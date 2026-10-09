import "./config/env.js";
import helmet from "helmet";
import cors from "cors";

import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ensureSchema } from "./config/database.js";
import { query } from "./config/database.js";
import { get, set, del, TTL } from "./utils/cache.js";
import { errorMiddleware } from "./middleware/ErrorMiddleware.js";
import { authRoutes } from "./routes/AuthRoutes.js";
import { healthRoutes } from "./routes/HealthRoutes.js";
import adminRoutes from "./routes/admin.js";
import dashboardRoutes from "./routes/dashboard.js";
import uploadRoutes from "./routes/upload.js";
import blogRoutes from "./routes/blog.js";
import groupRoutes from "./routes/groups.js";
import cvRoutes from "./routes/cv.js";
import cvExportRoutes from "./routes/cv-export.js";
import subscriptionRoutes from "./routes/subscription.js";
import paymentRoutes from "./routes/payment.js";
import notificationRoutes from "./routes/notification.js";
import reminderRoutes from "./routes/reminders.js";
import interviewRoutes from "./routes/interview.js";
import liveTokenRoutes from "./routes/live-token.js";
import aiCvAdvisorRoutes from "./routes/ai-cv-advisor.js";
import aiCustomerSupportRoutes from "./routes/ai-customer-support.js";
import friendsRoutes from "./routes/friends.js";
import onlineRoutes from "./routes/online.js";
import promotionsRoutes from "./routes/promotions.js";
import supportRoutes from "./routes/support.js";

import { startReminderScheduler, runDueReminders } from "./utils/reminderScheduler.js";
import { trackActivity } from "./utils/authUtils.js";
import { rateSpikeMiddleware } from "./middleware/suspiciousActivity.js";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const app = express();
const port = Number(process.env.PORT ?? 3001);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "../dist");

// Vercel functions must not run the full schema bootstrap on cold start. The
// Neon schema is provisioned before deployment; local/Render startup below keeps
// the existing bootstrap behavior.

// ─── Security Headers (OWASP ZAP fixes) ──────────────────────────────────────
// Applied FIRST to ensure ALL routes (including /health) get security headers

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // Allow inline scripts (for third-party SDKs and theme flash prevention)
          "blob:",
          // Allowlist for third-party scripts
          "https://accounts.google.com",      // Google Sign-In
          "https://connect.facebook.net",     // Facebook SDK
          "https://unpkg.com",                // PDF.js worker
          "https://static.xx.fbcdn.net",      // Facebook CDN
          "https://*.clerk.accounts.dev",     // Clerk Development
          "https://*.clerk.com",              // Clerk Production
          "https://challenges.cloudflare.com",// Clerk Turnstile bot detection
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://accounts.google.com",     // Google Sign-In styles
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
        ],
        imgSrc: [
          "'self'",
          "data:",                                    // Inline base64 images
          "blob:",                                    // Canvas/File API
          // External image sources (whitelist specific domains)
          "https://images.unsplash.com",              // Blog/content images
          "https://api.qrserver.com",                 // QR code generation for groups
          "https://cdn.dribbble.com",                 // 404 page illustration
          "https://lh3.googleusercontent.com",        // Google OAuth avatars
          "https://platform-lookaside.fbsbx.com",     // Facebook OAuth avatars
          "https://scontent.xx.fbcdn.net",            // Facebook CDN (alternative)
          "https://res.cloudinary.com",               // Cloudinary (if used for blog)
          "https://i.imgur.com",                      // Imgur (blog editor support)
          "https://postimg.cc",                       // PostImg (blog editor support)
          "https://images.pexels.com",                // Pexels (blog content)
          "https://picsum.photos",                    // Lorem Picsum (placeholders)
          "https://placehold.co",                     // Placeholder images
          "https://raw.githubusercontent.com",        // GitHub raw content (blog)
          "https://img.clerk.com",                    // Clerk avatars / assets
          "https://*.r2.dev",                         // Cloudflare R2 – uploaded CV images
        ],
        mediaSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://*.r2.dev",                         // Cloudflare R2 – uploaded CV files
        ],
        connectSrc: [
          "'self'",
          // Gemini Live API – WebSocket used by GenAILiveClient (interview bot)
          "https://generativelanguage.googleapis.com",
          "wss://generativelanguage.googleapis.com",
          // Google OAuth / Identity Services
          "https://accounts.google.com",
          // Google APIs – userinfo endpoint for OAuth token exchange
          "https://www.googleapis.com",
          // Google Fonts metadata
          "https://fonts.googleapis.com",
          // Facebook Graph API & SDK endpoints for login verification
          "https://graph.facebook.com",
          "https://www.facebook.com",
          "https://connect.facebook.net",
          "https://*.facebook.net",
          "https://*.facebook.com",
          "https://static.xx.fbcdn.net",
          "https://*.fbcdn.net",
          // ConvAI for conversational AI
          "https://horizontal-9fb.convai.so",
          // Clerk Auth endpoints
          "https://*.clerk.accounts.dev",
          "https://*.clerk.com",
          "https://clerk-telemetry.com",
          // Cloudflare R2 – fetch/download uploaded CV files (PDF viewer, download)
          "https://*.r2.dev",
        ],
        frameSrc: [
          "'self'",
          "https://accounts.google.com",     // Google Sign-In iframe
          "https://www.facebook.com",        // Facebook Login iframe/popup
          "https://web.facebook.com",
          "https://challenges.cloudflare.com",// Clerk Turnstile bot detection
        ],
        workerSrc: [
          "'self'",
          "blob:",                           // PDF.js workers use blob: URLs
          "https://unpkg.com",               // PDF.js worker from CDN
          "https://*.clerk.accounts.dev",    // Clerk Development workers
          "https://*.clerk.com",             // Clerk Production workers
        ],
        objectSrc: ["'self'", "https://*.r2.dev", "blob:"], // Allow PDF embed from R2 & blob
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

// Log CSP img-src directive for verification
console.log("[CSP] img-src directive:", JSON.stringify(["'self'", "data:", "blob:", "https:"]));

// ─── Health Check (lightweight endpoint for monitoring) ──────────────────────
// Moved AFTER helmet to ensure security headers are applied
app.get("/health", (_request, response) => {
  response.status(200).send("OK");
});

// ─── CORS (Cross-Domain Misconfiguration fix) ─────────────────────────────────
// Applied to /api/* routes only — NOT globally.
// Global CORS would intercept static file requests (CSS/JS/images) if the browser
// sends an Origin header (fetch preload, module import), causing the error middleware
// to return JSON for non-API paths and breaking the frontend entirely.
//
// Import centralized CORS config from server/config/cors.js
import { corsOptions } from "./config/cors.js";

// Apply CORS headers to all /api responses (includes automatic OPTIONS preflight handling)
app.use("/api", cors(corsOptions));

// Trust proxy — Render dùng reverse proxy, dev localhost không có proxy
app.set("trust proxy", process.env.NODE_ENV === "production" ? 1 : false);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ─── Global rate limit ───────────────────────────────────────────────────────

const globalRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip || "unknown"),
  skip: (req) => {
    // Bỏ qua payment webhook và cv-export để không ảnh hưởng luồng thanh toán / xuất PDF
    if (req.path === "/payment/webhook") return true;
    if (req.path.startsWith("/cv-export")) return true;
    return false;
  },
  message: { error: "RATE_LIMITED", message: "Quá nhiều yêu cầu, vui lòng thử lại sau." },
});

app.use("/api", globalRateLimiter);

const lastActivityCache = new Map();

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
  }
  next();
});

app.use("/api", async (request, response, next) => {
  const allowedPaths = ["/health", "/system/maintenance", "/promotions/active"];
  if (allowedPaths.includes(request.path) || request.path.startsWith("/admin") || request.path.startsWith("/promotions/admin")) return next();
  // PayOS webhook phải được xử lý trực tiếp, không kiểm tra blocklist
  if (request.path === "/payment/webhook") return next();

  try {
    const clientIp = request.ip || request.socket?.remoteAddress?.replace(/^::ffff:/, "") || null;
    if (clientIp === "::1" || clientIp === "127.0.0.1" || clientIp === "localhost") {
      return next();
    }
    const email = typeof request.body?.email === "string" ? request.body.email.toLowerCase() : "";

    const emailDomain = email.includes("@") ? email.split("@").pop() : "";
    const result = await query(
      `
        SELECT type, value, reason
        FROM admin_blocklist
        WHERE ((type = 'ip' AND value::inet = $1::inet)
           OR (type = 'email_domain' AND value = $2))
          AND (expires_at IS NULL OR expires_at > NOW())
        LIMIT 1
      `,
      [clientIp || "", emailDomain],
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

// Track request rate per user — log suspicious spikes
app.use("/api", rateSpikeMiddleware);

async function getMaintenanceMode() {
  const cached = get("maintenance_mode");
  if (cached) return cached;
  try {
    const result = await query("SELECT value FROM admin_settings WHERE key = 'maintenance_mode'");
    const value = result.rows[0]?.value;
    const data = {
      enabled: Boolean(value?.enabled),
      message: value?.message || "Hệ thống đang bảo trì, vui lòng quay lại sau.",
    };
    set("maintenance_mode", data, TTL.ADMIN_SETTINGS);
    return data;
  } catch {
    return { enabled: false, message: "Hệ thống đang bảo trì, vui lòng quay lại sau." };
  }
}

app.get("/api/system/maintenance", async (_request, response, next) => {
  try {
    response.set("Cache-Control", "public, max-age=30");
    response.json(await getMaintenanceMode());
  } catch (error) {
    next(error);
  }
});

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Normalize x-user-id header: if it's a Clerk ID, map it to the PostgreSQL UUID
app.use("/api", async (request, _response, next) => {
  const rawId = request.header("x-user-id");
  if (rawId && !UUID_REGEX.test(rawId)) {
    try {
      const uRes = await query("SELECT id FROM users WHERE clerk_id = $1", [rawId]);
      if (uRes.rows[0]?.id) {
        request.headers["x-user-id"] = uRes.rows[0].id;
      }
    } catch {
      // Ignore lookup failure
    }
  }
  next();
});

app.use("/api", async (request, response, next) => {
  const role = request.header("x-user-role") || "";
  const allowedDuringMaintenance =
    role !== "user" ||
    request.path === "/health" ||
    request.path === "/system/maintenance" ||
    request.path.startsWith("/auth/login") ||
    request.path.startsWith("/auth/oauth");

  // PayOS webhook không có user role header — phải được bypass
  if (request.path === "/payment/webhook") return next();
  if (allowedDuringMaintenance) return next();

  try {
    const userId = request.header("x-user-id");
    if (userId) {
      const isUuid = UUID_REGEX.test(userId);
      const testUserResult = isUuid
        ? await query("SELECT is_test_user FROM users WHERE id = $1", [userId])
        : await query("SELECT is_test_user FROM users WHERE clerk_id = $1", [userId]);
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
        const isUuid = UUID_REGEX.test(userId);
        const sql = isUuid
          ? "UPDATE users SET last_activity_at = NOW() WHERE id = $1"
          : "UPDATE users SET last_activity_at = NOW() WHERE clerk_id = $1";
        await query(sql, [userId]);
      } catch {} // silent
    }
  }
  return next();
});

// Serve uploaded files with explicit security headers.
// NOTE: X-Frame-Options and CSP must NOT be set on binary files (PDF/images),
// only on HTML pages. Setting X-Frame-Options: DENY on PDFs blocks embed/iframe display.
if (!process.env.VERCEL) app.use("/uploads", (_req, res, next) => {
  res.set({
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "public, max-age=31536000, immutable",
  });
  next();
}, express.static(path.join(__dirname, "../uploads")), async (req, res) => {
  // File not found locally (dev environment) — proxy content from production
  if (process.env.NODE_ENV !== "production") {
    try {
      const prodUrl = `https://jobreadyai.vn${req.originalUrl}`;
      const upstream = await fetch(prodUrl); // Node 18+ built-in fetch
      if (upstream.ok) {
        const contentType = upstream.headers.get("content-type") || "";
        // Only pipe binary file responses — skip HTML (which means production SPA fallback)
        const isBinaryFile =
          contentType.startsWith("application/pdf") ||
          contentType.startsWith("image/") ||
          contentType.startsWith("application/octet-stream");
        if (isBinaryFile) {
          res.set("Content-Type", contentType);
          const { Readable } = await import("stream");
          Readable.fromWeb(upstream.body).pipe(res);
          return;
        }
      }
    } catch (_e) { /* fall through */ }
  }
  res.status(404).send("File not found");
});

// Serve Vite-built frontend assets (content-hashed filenames → safe for long-lived cache).
// Must be registered BEFORE the Cache-Control: no-store middleware so static assets are unaffected.
if (!process.env.VERCEL) app.use(express.static(distPath));

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
app.use("/api/cv-export", cvExportRoutes); // Use different prefix to avoid conflict
app.use("/api/cv", cvRoutes);
app.use("/api/cv", uploadRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/interview", liveTokenRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/ai/cv-advisor", aiCvAdvisorRoutes);
app.use("/api/ai/customer-support", aiCustomerSupportRoutes);
app.use("/api", friendsRoutes);
app.use("/api", onlineRoutes);
app.use("/api/promotions", promotionsRoutes);
app.use("/api/support", supportRoutes);

app.get("/api/cron/reminders", async (request, response, next) => {
  if (!process.env.CRON_SECRET || request.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return response.status(401).json({ error: "Unauthorized" });
  }
  try {
    await runDueReminders();
    response.json({ success: true });
  } catch (error) {
    next(error);
  }
});


// SPA catch-all: serve index.html for all non-API routes
if (!process.env.VERCEL) app.get(/^\/(?!api).*/, (request, response) => {
  const htmlPath = path.join(distPath, "index.html");
  response.sendFile(htmlPath);
});

app.use(errorMiddleware);

async function cleanOldData() {
  try {
    const { query } = await import("./config/database.js");
    await query("DELETE FROM suspicious_activity_logs WHERE created_at < NOW() - INTERVAL '30 days'");
  } catch (e) {
    console.error("Clean old data error:", e);
  }
}

if (!process.env.VERCEL) {
  ensureSchema()
    .then(() => {
      cleanOldData();
      setInterval(cleanOldData, 86_400_000);
      app.listen(port, () => {
        console.log(`API server listening on http://localhost:${port}`);
        startReminderScheduler();
      });
    })
    .catch((error) => {
      console.error("Failed to initialize database schema.", error);
      process.exit(1);
    });
}

export default app;
