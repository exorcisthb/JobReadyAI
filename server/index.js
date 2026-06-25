import "./config/env.js";

import express from "express";
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
import { startReminderScheduler } from "./utils/reminderScheduler.js";
import { trackActivity } from "./utils/authUtils.js";

const app = express();
const port = Number(process.env.PORT ?? 3001);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "../dist");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const lastActivityCache = new Map();

app.use("/api", (request, response, next) => {
  const userId = request.header("x-user-id");
  if (userId) {
    const now = Date.now();
    const lastUpdate = lastActivityCache.get(userId) || 0;
    if (now - lastUpdate > 60000) { // 1 phút throttle
      lastActivityCache.set(userId, now);
      query("UPDATE users SET last_activity_at = NOW() WHERE id = $1", [userId]).catch((err) => {
        console.error("Lỗi cập nhật last_activity_at:", err);
      });
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
      message: value?.message || "Há»‡ thá»‘ng Ä‘ang báº£o trÃ¬, vui lÃ²ng quay láº¡i sau.",
    };
  } catch {
    return { enabled: false, message: "Há»‡ thá»‘ng Ä‘ang báº£o trÃ¬, vui lÃ²ng quay láº¡i sau." };
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

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(express.static(distPath));
app.get(/^(?!\/api).*/, (_request, response) => {
  response.sendFile(path.join(distPath, "index.html"));
});

app.use(errorMiddleware);

ensureSchema()
  .then(() => {
    app.listen(port, () => {
      console.log(`API server listening on http://localhost:${port}`);
      startReminderScheduler();
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database schema.", error);
    process.exit(1);
  });



