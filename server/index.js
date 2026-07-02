import "./config/env.js";
import { randomBytes } from "node:crypto";
import helmet from "helmet";

import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ensureSchema } from "./config/database.js";
import { query } from "./config/database.js";
import { errorMiddleware } from "./middleware/ErrorMiddleware.js";
import { authRoutes } from "./routes/AuthRoutes.js";
import { healthRoutes } from "./routes/HealthRoutes.js";
import adminRoutes from "./routes/admin.js";
import dashboardRoutes from "./routes/dashboard.js";
import uploadRoutes from "./routes/upload.js";
import blogRoutes from "./routes/blog.js";
import groupRoutes from "./routes/groups.js";
import cvRoutes from "./routes/cv.js";
import subscriptionRoutes from "./routes/subscription.js";
import notificationRoutes from "./routes/notification.js";
import reminderRoutes from "./routes/reminders.js";
import interviewRoutes from "./routes/interview.js";
import aiCvAdvisorRoutes from "./routes/ai-cv-advisor.js";
import aiCustomerSupportRoutes from "./routes/ai-customer-support.js";
import friendsRoutes from "./routes/friends.js";
import onlineRoutes from "./routes/online.js";
import { startReminderScheduler } from "./utils/reminderScheduler.js";
import { trackActivity } from "./utils/authUtils.js";

const app = express();
const port = Number(process.env.PORT ?? 3001);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "../dist");

// ─── Security Headers (OWASP ZAP fixes) ──────────────────────────────────────

// Generate a fresh cryptographic nonce per request.
// The nonce is stored in res.locals.cspNonce and injected into the HTML
// response by the SPA catch-all route below (replacing the __CSP_NONCE__
// placeholder set in index.html at build time).
app.use((_req, res, next) => {
  res.locals.cspNonce = randomBytes(16).toString("base64");
  next();
});

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          // Nonce covers all script elements (both inline and Vite module script bundles).
          // The nonce value is injected at request time by the catch-all route.
          (_req, res) => `'nonce-${res.locals.cspNonce}'`,
          "https://accounts.google.com",    // Google Sign-In SDK
          "https://cdn.jsdelivr.net",       // jsQR library (loaded in Groups page)
          "https://connect.facebook.net",   // Facebook SDK (loaded in Login/Register)
        ],
        styleSrc: [
          "'self'",
          // 'unsafe-inline' is required because framer-motion and similar libraries
          // inject <style> elements at runtime via JavaScript (e.g. CSS keyframe animations).
          // Removing this without refactoring all animation libraries would break the UI.
          // OWASP risk: LOW — styleSrc unsafe-inline cannot execute scripts and the
          // main XSS vector (scriptSrc) is fully nonce-hardened above.
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
        ],
        // imgSrc: restrict to self, data URIs, and known image CDN hosts.
        // Avoid the broad "https:" scheme wildcard (flagged by OWASP ZAP as Wildcard Directive).
        imgSrc: [
          "'self'",
          "data:",
          "https://lh3.googleusercontent.com", // Google user avatars (OAuth)
          "https://lh4.googleusercontent.com",
          "https://lh5.googleusercontent.com",
          "https://lh6.googleusercontent.com",
          "https://fonts.gstatic.com",          // Google Fonts icon sprites
        ],
        connectSrc: [
          "'self'",
          // Gemini Live API – WebSocket used by GenAILiveClient (interview bot)
          "https://generativelanguage.googleapis.com",
          "wss://generativelanguage.googleapis.com",
          // Google OAuth / Identity Services
          "https://accounts.google.com",
          // Google Fonts metadata
          "https://fonts.googleapis.com",
          // Facebook Graph API for login verification
          "https://graph.facebook.com",
          "https://www.facebook.com",
        ],
        frameSrc: [
          "'self'",
          "https://accounts.google.com",     // Google Sign-In iframe
          "https://www.facebook.com",        // Facebook Login iframe/popup
          "https://web.facebook.com",
        ],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },
    frameguard: { action: "deny" },      // X-Frame-Options: DENY – fix Missing Anti-clickjacking Header
    noSniff: true,                        // X-Content-Type-Options: nosniff
    hidePoweredBy: true,                  // Remove X-Powered-By header
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    permittedCrossDomainPolicies: { permittedPolicies: "none" },
    crossOriginEmbedderPolicy: false,     // Disable COEP – breaks Google Sign-In iframe
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }, // Allow Google OAuth popup
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const lastActivityCache = new Map();
const userActivityLogCache = new Map();

app.use("/api", (request, response, next) => {
  const userId = request.header("x-user-id");
  if (userId) {
    const now = Date.now();
    const lastUpdate = lastActivityCache.get(userId) || 0;
    if (now - lastUpdate > 60000) {
      lastActivityCache.set(userId, now);
      query("UPDATE users SET last_activity_at = NOW() WHERE id = $1", [userId]).catch((err) => {
        console.error("Lỗi cập nhật last_activity_at:", err);
      });
    }
    // Log user core actions (throttled 30s/user, only important paths)
    const corePaths = [
      "/api/auth/login", "/api/auth/register",
      "/api/cv", "/api/cv/create", "/api/cv/upload",
      "/api/interview", "/api/interview/config",
      "/api/groups", "/api/groups/create",
      "/api/subscription", "/api/pricing",
      "/api/dashboard",
      "/api/blog",
      "/api/messages", "/api/friends",
      "/api/articles",
    ];
    const url = request.originalUrl || request.url;
    const isCore = corePaths.some((p) => url.startsWith(p));
    if (isCore) {
      const lastLog = userActivityLogCache.get(userId) || 0;
      if (now - lastLog > 30000) {
        userActivityLogCache.set(userId, now);
        const ip = getClientIp(request);
        query(
          `INSERT INTO user_activity_logs (user_id, ip_address, page_url)
           VALUES ($1, $2, $3)`,
          [userId, ip, url]
        ).catch(() => {});
      }
    }
  }
  next();
});

function getClientIp(request) {
  const forwardedFor = request.headers["x-forwarded-for"];
  const rawIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(",")[0];
  return (rawIp || request.ip || request.socket?.remoteAddress || "").trim().replace(/^::ffff:/, "") || null;
}

app.use("/api", async (request, response, next) => {
  const allowedPaths = ["/health", "/system/maintenance"];
  if (allowedPaths.includes(request.path) || request.path.startsWith("/admin")) return next();

  try {
    const clientIp = getClientIp(request);
    const email = typeof request.body?.email === "string" ? request.body.email.toLowerCase() : "";
    const emailDomain = email.includes("@") ? email.split("@").pop() : "";
    const result = await query(
      `
        SELECT type, value, reason
        FROM admin_blocklist
        WHERE (type = 'ip' AND value = $1)
           OR (type = 'email_domain' AND value = $2)
        LIMIT 1
      `,
      [clientIp, emailDomain],
    );

    if (result.rows[0]) {
      return response.status(403).json({
        error: "BLOCKED_BY_ADMIN",
        message: "Truy cập đã bị chặn bởi quản trị viên.",
        reason: result.rows[0].reason,
      });
    }
  } catch {
    // Nếu bảng blocklist chưa có, không chặn nhầm traffic production.
  }

  return next();
});

async function getMaintenanceMode() {
  try {
    const result = await query("SELECT value FROM admin_settings WHERE key = 'maintenance_mode'");
    const value = result.rows[0]?.value;
    return {
      enabled: Boolean(value?.enabled),
      message: value?.message || "Hệ thống đang bảo trì, vui lòng quay lại sau.",
    };
  } catch {
    return { enabled: false, message: "Hệ thống đang bảo trì, vui lòng quay lại sau." };
  }
}

app.get("/api/system/maintenance", async (_request, response, next) => {
  try {
    response.json(await getMaintenanceMode());
  } catch (error) {
    next(error);
  }
});

app.use("/api", async (request, response, next) => {
  const role = request.header("x-user-role") || "";
  const allowedDuringMaintenance =
    role !== "user" ||
    request.path === "/health" ||
    request.path === "/system/maintenance" ||
    request.path.startsWith("/auth/login") ||
    request.path.startsWith("/auth/oauth");

  if (allowedDuringMaintenance) return next();

  try {
    const userId = request.header("x-user-id");
    if (userId) {
      const testUserResult = await query("SELECT is_test_user FROM users WHERE id = $1", [userId]);
      if (testUserResult.rows[0]?.is_test_user) return next();
    }

    const maintenance = await getMaintenanceMode();
    if (!maintenance.enabled) return next();

    return response.status(503).json({
      error: "MAINTENANCE_MODE",
      message: maintenance.message,
    });
  } catch (error) {
    return next(error);
  }
});

// Track online users — update on every authenticated request
app.use("/api", (request, _response, next) => {
  const userId = request.headers["x-user-id"];
  if (userId) trackActivity(userId);
  return next();
});

// Update last_activity_at in DB periodically (throttled)
let lastDbWrite = 0;
app.use("/api", async (request, _response, next) => {
  const userId = request.headers["x-user-id"];
  if (userId) {
    const now = Date.now();
    if (now - lastDbWrite > 60_000) {
      lastDbWrite = now;
      try {
        const { query } = await import("./config/database.js");
        await query("UPDATE users SET last_activity_at = NOW() WHERE id = $1", [userId]);
      } catch {} // silent
    }
  }
  return next();
});

// Serve uploaded files (static – not affected by no-store middleware below)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Serve Vite-built frontend assets (content-hashed filenames → safe for long-lived cache).
// Must be registered BEFORE the Cache-Control: no-store middleware so static assets are unaffected.
app.use(express.static(distPath));

// ─── Cache-Control: no-store for all dynamic/API responses ───────────────────
// Applied after static-file handlers so that JS/CSS/image assets keep their caching.
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// Dynamic API Routes
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/cv", uploadRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/ai/cv-advisor", aiCvAdvisorRoutes);
app.use("/api/ai/customer-support", aiCustomerSupportRoutes);
app.use("/api", friendsRoutes);
app.use("/api", onlineRoutes);

// SPA catch-all: serve index.html and inject the per-request CSP nonce.
// 1. We replace `<script` with `<script nonce="${nonce}"` to ensure all script tags (including Vite modules) have the nonce.
// 2. We clean up `nonce="__CSP_NONCE__"` to avoid duplicate nonce attributes.
// 3. We substitute any remaining `__CSP_NONCE__` placeholders (e.g. in the meta tag).
app.get(/^\/(?!api).*/, (request, response) => {
  const htmlPath = path.join(distPath, "index.html");
  let html;
  try {
    html = fs.readFileSync(htmlPath, "utf8");
  } catch {
    return response.sendFile(htmlPath);
  }
  const nonce = response.locals.cspNonce;
  let patched = html.replace(/<script/g, `<script nonce="${nonce}"`);
  patched = patched.replace(/nonce="__CSP_NONCE__"/g, "");
  patched = patched.replace(/__CSP_NONCE__/g, nonce);
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.send(patched);
});

app.use(errorMiddleware);

async function cleanOldUserActivityLogs() {
  try {
    const { query } = await import("./config/database.js");
    await query("DELETE FROM user_activity_logs WHERE created_at < NOW() - INTERVAL '5 days'");
  } catch (e) {
    console.error("Clean user_activity_logs error:", e);
  }
}

ensureSchema()
  .then(() => {
    cleanOldUserActivityLogs();
    setInterval(cleanOldUserActivityLogs, 86_400_000); // daily cleanup
    app.listen(port, () => {
      console.log(`API server listening on http://localhost:${port}`);
      startReminderScheduler();
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database schema.", error);
    process.exit(1);
  });
