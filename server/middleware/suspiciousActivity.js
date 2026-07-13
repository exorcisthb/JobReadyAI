import { query } from "../config/database.js";

const FAILED_LOGIN_CACHE = new Map();
const RATE_SPIKE_CACHE = new Map();

const FAILED_LOGIN_THRESHOLD = 5;
const FAILED_LOGIN_WINDOW_MS = 15 * 60 * 1000;
const RATE_SPIKE_THRESHOLD = 100;
const RATE_SPIKE_WINDOW_MS = 60 * 1000;
const MULTI_ACCOUNT_THRESHOLD = 3;

export async function insertSuspiciousLog(userId, ip, activityType, severity = "medium", details = {}) {
  try {
    await query(
      `INSERT INTO suspicious_activity_logs (user_id, ip_address, activity_type, severity, details)
       VALUES ($1, $2, $3, $4, $5::jsonb)`,
      [userId || null, ip || null, activityType, severity, JSON.stringify(details)],
    );
  } catch (err) {
    console.error("insertSuspiciousLog error:", err);
  }
}

export async function trackLoginFailed(ip, email) {
  if (!ip) return;
  const now = Date.now();
  const entry = FAILED_LOGIN_CACHE.get(ip) || { count: 0, firstAttempt: now };
  entry.count++;
  if (entry.count === 1) entry.firstAttempt = now;
  FAILED_LOGIN_CACHE.set(ip, entry);

  if (entry.count >= FAILED_LOGIN_THRESHOLD && now - entry.firstAttempt <= FAILED_LOGIN_WINDOW_MS) {
    FAILED_LOGIN_CACHE.delete(ip);
    await insertSuspiciousLog(null, ip, "login_failed_repeated", "high", {
      failedCount: entry.count,
      email: email || null,
      windowMinutes: FAILED_LOGIN_WINDOW_MS / 60000,
    });
  }

  if (now - entry.firstAttempt > FAILED_LOGIN_WINDOW_MS) {
    FAILED_LOGIN_CACHE.delete(ip);
  }
}

export async function checkMultiAccount(ip, userId) {
  if (!ip) return;
  try {
    const result = await query(
      `SELECT COUNT(*)::int AS cnt FROM users
       WHERE (registration_ip::text = $1 OR last_login_ip::text = $1)
         AND role IS DISTINCT FROM 'admin'`,
      [ip],
    );
    if (result.rows[0]?.cnt > MULTI_ACCOUNT_THRESHOLD) {
      await insertSuspiciousLog(userId, ip, "multi_account_same_ip", "high", {
        accountCount: result.rows[0].cnt,
        threshold: MULTI_ACCOUNT_THRESHOLD,
      });
    }
  } catch (err) {
    console.error("checkMultiAccount error:", err);
  }
}

export function rateSpikeMiddleware(request, _response, next) {
  const userId = request.headers["x-user-id"];
  if (userId) {
    const now = Date.now();
    const entry = RATE_SPIKE_CACHE.get(userId) || { count: 0, windowStart: now };
    if (now - entry.windowStart > RATE_SPIKE_WINDOW_MS) {
      entry.count = 0;
      entry.windowStart = now;
    }
    entry.count++;
    RATE_SPIKE_CACHE.set(userId, entry);

    if (entry.count === RATE_SPIKE_THRESHOLD + 1) {
      const ip = request.headers["x-forwarded-for"]?.split(",")[0]?.trim()?.replace(/^::ffff:/, "") ||
                 request.ip || "";
      insertSuspiciousLog(userId, ip, "rate_spike", "medium", {
        requestCount: entry.count,
        windowMs: RATE_SPIKE_WINDOW_MS,
      }).catch(() => {});
    }
  }
  return next();
}

export async function trackUnauthorizedAccess(userId, ip, path) {
  await insertSuspiciousLog(userId, ip, "unauthorized_access_attempt", "high", {
    path: path || null,
  });
}
