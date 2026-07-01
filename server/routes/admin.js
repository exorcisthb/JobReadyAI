import express from "express";
import bcrypt from "bcryptjs";
import os from "node:os";
import { query, withTransaction } from "../config/database.js";
import { getOnlineCount } from "../utils/authUtils.js";

const router = express.Router();

function requireAdmin(req, res, next) {
  const role = req.header("x-user-role");
  if (role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  return next();
}

async function tableExists(tableName) {
  const result = await query(
    `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1) AS exists`,
    [tableName],
  );
  return Boolean(result.rows[0]?.exists);
}

function isLocalIp(ip) {
  const normalized = ip.trim().replace(/^::ffff:/, "");
  if (normalized === "127.0.0.1" || normalized === "::1" || normalized.toLowerCase() === "localhost") {
    return true;
  }
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const net of interfaces[name]) {
        if (net.address === normalized) {
          return true;
        }
      }
    }
  } catch (err) {
    console.error("Lỗi khi đọc network interfaces:", err);
  }
  return false;
}

async function ensureAdminOpsTables() {
  await query(`
    CREATE TABLE IF NOT EXISTS admin_settings (
      key VARCHAR(100) PRIMARY KEY,
      value JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS admin_audit_logs (
      id BIGSERIAL PRIMARY KEY,
      admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
      action VARCHAR(120) NOT NULL,
      target_type VARCHAR(80),
      target_id VARCHAR(120),
      metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
      ip_address INET,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await query("CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON admin_audit_logs(created_at DESC)");

  await query(`
    CREATE TABLE IF NOT EXISTS admin_blocklist (
      id BIGSERIAL PRIMARY KEY,
      type VARCHAR(20) NOT NULL CHECK (type IN ('ip', 'email_domain')),
      value VARCHAR(255) NOT NULL,
      reason TEXT,
      created_by UUID REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(type, value)
    )
  `);

  await query(`
    INSERT INTO admin_settings (key, value, updated_at)
    VALUES ('max_concurrent_users_limit', '{"limit": 200}'::jsonb, NOW())
    ON CONFLICT (key) DO NOTHING
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS user_activity_logs (
      id BIGSERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      ip_address INET,
      page_url VARCHAR(500),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await query("CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id)");
  await query("CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at DESC)");
}

async function writeAudit(req, action, targetType = null, targetId = null, metadata = {}) {
  await ensureAdminOpsTables();
  const rawAdminId = req.header("x-user-id") || "";
  const adminId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(rawAdminId) ? rawAdminId : null;
  const ipAddress = req.ip?.replace("::ffff:", "") || null;
  await query(
    `INSERT INTO admin_audit_logs (admin_id, action, target_type, target_id, metadata, ip_address)
     VALUES ($1, $2, $3, $4, $5, NULLIF($6, '')::inet)`,
    [adminId, action, targetType, targetId, metadata, ipAddress],
  );
}

router.get("/stats", requireAdmin, async (_req, res, next) => {
  try {
    await ensureAdminOpsTables();
    const limitResult = await query("SELECT value FROM admin_settings WHERE key = 'max_concurrent_users_limit'");
    const max_concurrent_limit = limitResult.rows[0]?.value?.limit ?? 200;

    const statsResult = await query(`
      SELECT
        (SELECT COUNT(*)::int FROM users WHERE COALESCE(is_test_user, false) = false) as total_users,
        (SELECT COUNT(*)::int FROM users WHERE status = 'locked' AND COALESCE(is_test_user, false) = false) as locked_users,
        (SELECT COUNT(*)::int FROM interview_sessions) as total_sessions,
        (SELECT COUNT(*)::int FROM cvs) as total_cv_uploads,
        (SELECT COUNT(*)::int FROM cv_builder_drafts) as total_cv_built,
        (SELECT COUNT(*)::int FROM jd_comparisons) as total_jd_comparisons,
        0::int as active_questions,
        (SELECT COUNT(*)::int FROM articles WHERE status = 'published') as published_articles,
        (SELECT COUNT(*)::int FROM users WHERE last_activity_at >= NOW() - INTERVAL '5 minutes' AND COALESCE(is_test_user, false) = false) as online_users
    `);

    const activityResult = await query(`
      SELECT 
        d.date::date::text as date,
        COALESCE(u.count, 0)::int as signups,
        0::int as sessions
      FROM (
        SELECT GENERATE_SERIES(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day')::date as date
      ) d
      LEFT JOIN (
        SELECT created_at::date as date, COUNT(*) as count 
        FROM users 
        WHERE COALESCE(is_test_user, false) = false
        GROUP BY created_at::date
      ) u ON d.date = u.date
      ORDER BY d.date ASC
    `);

    res.json({
      ...statsResult.rows[0],
      realtime_online: getOnlineCount(),
      max_concurrent_limit,
      activity: activityResult.rows
    });
  } catch (error) {
    next(error);
  }
});

router.get("/users", requireAdmin, async (req, res, next) => {
  try {
    const limit = Math.min(Number.parseInt(String(req.query.limit ?? "50"), 10) || 50, 200);
    const page  = Math.max(Number.parseInt(String(req.query.page  ?? "1"),  10) || 1,  1);
    const offset = (page - 1) * limit;

    const [usersResult, countResult] = await Promise.all([
      query(
        `SELECT u.id, u.email, u.role, u.status, u.created_at
         FROM users u
         WHERE COALESCE(u.is_test_user, false) = false
         ORDER BY u.created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset],
      ),
      query(
        `SELECT COUNT(*)::int AS total FROM users WHERE COALESCE(is_test_user, false) = false`,
      ),
    ]);

    res.json({
      users: usersResult.rows,
      total: countResult.rows[0].total,
      page,
      limit,
      totalPages: Math.ceil(countResult.rows[0].total / limit),
    });
  } catch (error) {
    next(error);
  }
});


router.get("/finance", requireAdmin, async (_req, res, next) => {
  try {
    const subscriptionSummary = await query(`
      SELECT
        COUNT(*) FILTER (WHERE COALESCE(subscription_plan, 'free') = 'free')::int AS free_users,
        COUNT(*) FILTER (WHERE subscription_plan = 'pro')::int AS pro_users,
        COUNT(*) FILTER (WHERE subscription_plan = 'ultra')::int AS ultra_users,
        COUNT(*) FILTER (WHERE subscription_plan IN ('pro', 'ultra') AND subscription_expires_at BETWEEN NOW() AND NOW() + INTERVAL '7 days')::int AS expiring_soon
      FROM users
      WHERE COALESCE(is_test_user, false) = false
    `);

    const addonRevenue = await tableExists("user_addon_purchases")
      ? await query(`
          SELECT
            COALESCE(SUM(total_price) FILTER (WHERE created_at::date = CURRENT_DATE), 0)::int AS today_revenue,
            COALESCE(SUM(total_price) FILTER (WHERE created_at >= DATE_TRUNC('week', NOW())), 0)::int AS week_revenue,
            COALESCE(SUM(total_price) FILTER (WHERE created_at >= DATE_TRUNC('month', NOW())), 0)::int AS month_revenue
          FROM user_addon_purchases
          WHERE status IN ('completed', 'success')
        `)
      : { rows: [{ today_revenue: 0, week_revenue: 0, month_revenue: 0 }] };

    const mrrResult = await query(`
      SELECT COALESCE(SUM(CASE subscription_plan WHEN 'pro' THEN 80000 WHEN 'ultra' THEN 160000 ELSE 0 END), 0)::int AS mrr
      FROM users
      WHERE COALESCE(is_test_user, false) = false
        AND subscription_plan IN ('pro', 'ultra') AND (subscription_expires_at IS NULL OR subscription_expires_at > NOW())
    `);

    const dailyRevenue = await tableExists("user_addon_purchases")
      ? await query(`
          SELECT d.date::date::text AS date, COALESCE(SUM(p.total_price), 0)::int AS revenue
          FROM (SELECT GENERATE_SERIES(CURRENT_DATE - INTERVAL '13 days', CURRENT_DATE, '1 day')::date AS date) d
          LEFT JOIN user_addon_purchases p ON p.created_at::date = d.date AND p.status IN ('completed', 'success')
          GROUP BY d.date
          ORDER BY d.date ASC
        `)
      : { rows: [] };

    const transactions = await tableExists("user_addon_purchases")
      ? await query(`
          SELECT p.id::text, p.addon_name AS item, p.total_price AS amount, p.status, p.created_at, u.email
          FROM user_addon_purchases p
          LEFT JOIN users u ON u.id = p.user_id
          ORDER BY p.created_at DESC
          LIMIT 50
        `)
      : { rows: [] };

    const expiringUsers = await query(`
      SELECT id, email, subscription_plan, subscription_expires_at
      FROM users
      WHERE COALESCE(is_test_user, false) = false
        AND subscription_plan IN ('pro', 'ultra') AND subscription_expires_at BETWEEN NOW() AND NOW() + INTERVAL '14 days'
      ORDER BY subscription_expires_at ASC
      LIMIT 30
    `);

    const summary = subscriptionSummary.rows[0];
    const paidUsers = summary.pro_users + summary.ultra_users;
    const totalUsers = summary.free_users + paidUsers;

    res.json({
      summary: {
        ...addonRevenue.rows[0],
        mrr: mrrResult.rows[0].mrr,
        conversion_rate: totalUsers ? Math.round((paidUsers / totalUsers) * 1000) / 10 : 0,
        ...summary,
      },
      dailyRevenue: dailyRevenue.rows,
      transactions: transactions.rows,
      expiringUsers: expiringUsers.rows,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/security", requireAdmin, async (_req, res, next) => {
  try {
    await ensureAdminOpsTables();
    const auditLogs = await query(`
      SELECT l.id, l.action, l.target_type, l.target_id, l.metadata, l.ip_address::text, l.created_at, u.email AS admin_email
      FROM admin_audit_logs l
      LEFT JOIN users u ON u.id = l.admin_id
      ORDER BY l.created_at DESC
      LIMIT 80
    `);
    const blocklist = await query("SELECT id, type, value, reason, created_at FROM admin_blocklist ORDER BY created_at DESC LIMIT 100");
    const sameIpAccounts = await query(`
      SELECT COALESCE(last_login_ip::text, registration_ip::text) AS ip_address, COUNT(*)::int AS account_count,
             ARRAY_AGG(email ORDER BY created_at DESC) FILTER (WHERE email IS NOT NULL) AS emails
      FROM users
      WHERE last_login_ip IS NOT NULL OR registration_ip IS NOT NULL
      GROUP BY COALESCE(last_login_ip::text, registration_ip::text)
      HAVING COUNT(*) > 1
      ORDER BY account_count DESC
      LIMIT 20
    `).catch(() => ({ rows: [] }));
    const recentIpActivity = await query(`
      SELECT id, email, registration_ip::text, last_login_ip::text, last_login_at, created_at
      FROM users
      WHERE registration_ip IS NOT NULL OR last_login_ip IS NOT NULL
      ORDER BY COALESCE(last_login_at, created_at) DESC
      LIMIT 50
    `).catch(() => ({ rows: [] }));

    res.json({
      auditLogs: auditLogs.rows,
      blocklist: blocklist.rows,
      sameIpAccounts: sameIpAccounts.rows,
      recentIpActivity: recentIpActivity.rows,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/security/blocklist", requireAdmin, async (req, res, next) => {
  try {
    await ensureAdminOpsTables();
    const { type, value, reason } = req.body;
    if (!["ip", "email_domain"].includes(type) || !String(value || "").trim()) {
      return res.status(400).json({ error: "Blocklist không hợp lệ." });
    }

    const trimmedValue = String(value).trim();

    if (type === "ip") {
      const targetIp = trimmedValue.replace(/^::ffff:/, "");
      if (isLocalIp(targetIp)) {
        return res.status(400).json({ error: "Không được phép chặn IP của máy chủ/localhost." });
      }

      // Check current request IP
      const currentAdminIp = (req.ip || req.socket?.remoteAddress || "").trim().replace(/^::ffff:/, "");
      if (targetIp === currentAdminIp) {
        return res.status(400).json({ error: "Không được phép tự chặn IP hiện tại của bạn." });
      }

      // Check if IP belongs to an admin
      const adminIpCheck = await query(
        `SELECT email FROM users WHERE role = 'admin' AND (last_login_ip = $1::inet OR registration_ip = $1::inet)`,
        [targetIp]
      );
      if (adminIpCheck.rows.length > 0) {
        return res.status(400).json({ error: `Không được phép chặn IP của tài khoản Admin (${adminIpCheck.rows[0].email}).` });
      }
    }

    if (type === "email_domain") {
      const targetDomain = trimmedValue.toLowerCase();
      // Check if any admin has email belonging to this domain
      const adminEmailCheck = await query(
        `SELECT email FROM users WHERE role = 'admin' AND email LIKE '%@' || $1`,
        [targetDomain]
      );
      if (adminEmailCheck.rows.length > 0) {
        return res.status(400).json({ error: `Không được phép chặn tên miền email của tài khoản Admin (${adminEmailCheck.rows[0].email}).` });
      }
    }

    const result = await query(
      `INSERT INTO admin_blocklist (type, value, reason, created_by)
       VALUES ($1, LOWER(TRIM($2)), $3, $4)
       ON CONFLICT (type, value) DO UPDATE SET reason = EXCLUDED.reason
       RETURNING id, type, value, reason, created_at`,
      [type, value, reason || null, req.header("x-user-id") || null],
    );
    await writeAudit(req, "blocklist.upsert", type, value, { reason });
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.get("/user-activity", requireAdmin, async (req, res, next) => {
  try {
    await ensureAdminOpsTables();
    const searchEmail = String(req.query.email || "").trim().toLowerCase();

    const userLogs = await query(`
      SELECT l.id, l.action, l.target_type, l.target_id, l.metadata, l.ip_address::text, l.created_at, u.email AS user_email, u.id AS user_id
      FROM admin_audit_logs l
      LEFT JOIN users u ON u.id = l.admin_id
      WHERE u.role IS DISTINCT FROM 'admin'
      ${searchEmail ? `AND LOWER(u.email) LIKE '%' || $1 || '%'` : ""}
      ORDER BY l.created_at DESC
      LIMIT 500
    `, searchEmail ? [searchEmail] : []);

    const activityLogs = await query(`
      SELECT a.id, a.ip_address::text, a.page_url, a.created_at, u.email AS user_email, u.id AS user_id
      FROM user_activity_logs a
      LEFT JOIN users u ON u.id = a.user_id
      ${searchEmail ? `WHERE LOWER(u.email) LIKE '%' || $1 || '%'` : ""}
      ORDER BY a.created_at DESC
      LIMIT 500
    `, searchEmail ? [searchEmail] : []);

    const recentIpActivity = await query(`
      SELECT id, email, registration_ip::text, last_login_ip::text, last_login_at, created_at
      FROM users
      WHERE (registration_ip IS NOT NULL OR last_login_ip IS NOT NULL)
        AND role IS DISTINCT FROM 'admin'
      ${searchEmail ? `AND LOWER(email) LIKE '%' || $1 || '%'` : ""}
      ORDER BY COALESCE(last_login_at, created_at) DESC
      LIMIT 100
    `, searchEmail ? [searchEmail] : []).catch(() => ({ rows: [] }));

    const sameIpAccounts = await query(`
      SELECT COALESCE(last_login_ip::text, registration_ip::text) AS ip_address, COUNT(*)::int AS account_count,
             ARRAY_AGG(email ORDER BY created_at DESC) FILTER (WHERE email IS NOT NULL) AS emails
      FROM users
      WHERE (last_login_ip IS NOT NULL OR registration_ip IS NOT NULL)
        AND role IS DISTINCT FROM 'admin'
      GROUP BY COALESCE(last_login_ip::text, registration_ip::text)
      HAVING COUNT(*) > 1
      ORDER BY account_count DESC
      LIMIT 20
    `).catch(() => ({ rows: [] }));

    const blockedValues = await query("SELECT value FROM admin_blocklist WHERE type = 'ip'").catch(() => ({ rows: [] }));
    const blockedIps = new Set(blockedValues.rows.map((r) => r.value));

    const adminIpsResult = await query(`
      SELECT DISTINCT ip FROM (
        SELECT registration_ip::text AS ip FROM users WHERE role = 'admin' AND registration_ip IS NOT NULL
        UNION
        SELECT last_login_ip::text AS ip FROM users WHERE role = 'admin' AND last_login_ip IS NOT NULL
      ) ips
    `).catch(() => ({ rows: [] }));
    const adminIps = new Set(adminIpsResult.rows.map((r) => r.ip.replace(/^::ffff:/, "")));

    res.json({
      userLogs: userLogs.rows,
      activityLogs: activityLogs.rows,
      recentIpActivity: recentIpActivity.rows,
      sameIpAccounts: sameIpAccounts.rows,
      blockedIps: Array.from(blockedIps),
      adminIps: Array.from(adminIps),
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/security/blocklist/:id", requireAdmin, async (req, res, next) => {
  try {
    await ensureAdminOpsTables();
    const result = await query("DELETE FROM admin_blocklist WHERE id = $1 RETURNING id, type, value", [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Không tìm thấy mục trong blocklist." });
    }
    await writeAudit(req, "blocklist.delete", result.rows[0].type, result.rows[0].value);
    res.json({ success: true, ...result.rows[0] });
  } catch (error) {
    next(error);
  }
});

router.post("/security/force-logout", requireAdmin, async (req, res, next) => {
  try {
    await writeAudit(req, "user.force_logout", "user", req.body.userId, { email: req.body.email });
    res.json({ success: true, message: "Đã ghi nhận yêu cầu force logout. Cần tích hợp session store để thực thi realtime." });
  } catch (error) {
    next(error);
  }
});

router.get("/maintenance", requireAdmin, async (_req, res, next) => {
  try {
    await ensureAdminOpsTables();
    const setting = await query("SELECT value, updated_at FROM admin_settings WHERE key = 'maintenance_mode'");
    res.json({
      maintenance: setting.rows[0]?.value || { enabled: false, message: "Hệ thống đang bảo trì, vui lòng quay lại sau." },
      updatedAt: setting.rows[0]?.updated_at || null,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/maintenance", requireAdmin, async (req, res, next) => {
  try {
    await ensureAdminOpsTables();
    const value = { enabled: Boolean(req.body.enabled), message: String(req.body.message || "Hệ thống đang bảo trì, vui lòng quay lại sau.") };
    const result = await query(
      `INSERT INTO admin_settings (key, value, updated_by, updated_at)
       VALUES ('maintenance_mode', $1, $2, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by, updated_at = NOW()
       RETURNING value, updated_at`,
      [value, req.header("x-user-id") || null],
    );
    await writeAudit(req, "maintenance.update", "setting", "maintenance_mode", value);
    res.json({ maintenance: result.rows[0].value, updatedAt: result.rows[0].updated_at });
  } catch (error) {
    next(error);
  }
});

router.post("/maintenance/backup", requireAdmin, async (req, res, next) => {
  try {
    await writeAudit(req, "backup.trigger", "database", "neondb", { note: req.body.note || null });
    res.json({ success: true, message: "Đã ghi nhận yêu cầu backup thủ công. NeonDB backup thực tế cần cấu hình webhook/CLI ở bước tiếp theo." });
  } catch (error) {
    next(error);
  }
});

router.post("/maintenance/cache/clear", requireAdmin, async (req, res, next) => {
  try {
    await writeAudit(req, "cache.clear", "system", "all");
    res.json({ success: true, message: "Đã ghi nhận thao tác xoá cache." });
  } catch (error) {
    next(error);
  }
});


router.get("/test-users", requireAdmin, async (_req, res, next) => {
  try {
    const result = await query(`
      SELECT u.id, u.email, u.status, u.created_at, p.full_name
      FROM users u
      LEFT JOIN user_profiles p ON p.user_id = u.id
      WHERE COALESCE(u.is_test_user, false) = true
      ORDER BY u.created_at DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.post("/test-users", requireAdmin, async (req, res, next) => {
  try {
    const { email, password, full_name: fullName } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!normalizedEmail || !String(password || "").trim()) {
      return res.status(400).json({ error: "Email và mật khẩu là bắt buộc." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({ error: "Email không hợp lệ." });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ error: "Mật khẩu phải có ít nhất 8 ký tự." });
    }

    const hash = await bcrypt.hash(String(password), 10);
    let userId = "";
    await withTransaction(async (client) => {
      const existing = await client.query("SELECT id FROM users WHERE LOWER(email) = LOWER($1)", [normalizedEmail]);
      if (existing.rows.length > 0) {
        const err = new Error("Email đã tồn tại.");
        err.code = "EMAIL_EXISTS";
        throw err;
      }

      await client.query("DELETE FROM deleted_test_users WHERE LOWER(email) = LOWER($1)", [normalizedEmail]);

      const userResult = await client.query(
        `INSERT INTO users (email, password_hash, role, auth_provider, status, otp_verified, is_test_user, subscription_plan)
         VALUES ($1, $2, 'user', 'email', 'active', true, true, 'free')
         RETURNING id`,
        [normalizedEmail, hash],
      );
      userId = String(userResult.rows[0].id);
      await client.query(
        `INSERT INTO user_profiles (user_id, full_name, profile_completed)
         VALUES ($1, $2, true)`,
        [userId, fullName || `Test User ${normalizedEmail.split("@")[0]}`],
      );
    });

    await writeAudit(req, "test_user.create", "user", userId, { email: normalizedEmail });
    res.json({ success: true, userId });
  } catch (error) {
    if (error.code === "23505" || error.code === "EMAIL_EXISTS") {
      return res.status(409).json({ error: "Email này đã được sử dụng." });
    }
    next(error);
  }
});


router.delete("/test-users/:id", requireAdmin, async (req, res, next) => {
  try {
    const result = await query(
      `DELETE FROM users
       WHERE id = $1 AND COALESCE(is_test_user, false) = true
       RETURNING id, email`,
      [req.params.id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Không tìm thấy User Test hoặc tài khoản này không phải User Test." });
    }

    await query(
      `INSERT INTO deleted_test_users (email, deleted_by, deleted_at)
       VALUES (LOWER($1), NULLIF($2, '')::uuid, NOW())
       ON CONFLICT (email) DO UPDATE SET deleted_by = EXCLUDED.deleted_by, deleted_at = NOW()`,
      [result.rows[0].email, req.header("x-user-id") || ""],
    );
    await writeAudit(req, "test_user.delete", "user", result.rows[0].id, { email: result.rows[0].email });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.patch("/users/:id/status", requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    const requestingAdminId = req.header("x-user-id") || "";

    // Không được tự ban chính mình
    if (requestingAdminId && requestingAdminId === req.params.id && status === "locked") {
      return res.status(400).json({ error: "Không được phép tự khóa tài khoản của chính mình." });
    }

    // Kiểm tra xem user mục tiêu có phải admin không — chỉ cho phép MỞ KHÓA, không được KHÓA
    const targetUser = await query("SELECT email, role FROM users WHERE id = $1", [req.params.id]);
    if (targetUser.rows.length > 0 && targetUser.rows[0].role === "admin" && status === "locked") {
      return res.status(400).json({ error: "Không được phép khóa tài khoản Admin. Chỉ có thể mở khóa admin nếu cần." });
    }

    await writeAudit(req, status === "locked" ? "user.lock" : "user.unlock", "user", req.params.id, { email: targetUser.rows[0]?.email });
    await query("UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2", [status, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.patch("/users/:id/role", requireAdmin, async (req, res, next) => {
  try {
    const { role } = req.body;
    await query("UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2", [role, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/content-managers", requireAdmin, async (req, res, next) => {
  try {
    const { email, password, full_name: fullName } = req.body;
    const hash = await bcrypt.hash(password, 10);
    let userId = "";
    await withTransaction(async (client) => {
      const userResult = await client.query(
        `
          INSERT INTO users (email, password_hash, role, auth_provider, status, otp_verified)
          VALUES ($1, $2, 'content_manager', 'email', 'active', true)
          RETURNING id
        `,
        [email, hash],
      );
      userId = String(userResult.rows[0].id);
      await client.query("INSERT INTO user_profiles (user_id, full_name, profile_completed) VALUES ($1, $2, true)", [
        userId,
        fullName,
      ]);
    });
    res.json({ success: true, userId });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "Email này đã được sử dụng." });
    }
    next(error);
  }
});

router.get("/settings/capacity", requireAdmin, async (_req, res, next) => {
  try {
    await ensureAdminOpsTables();
    const result = await query("SELECT value FROM admin_settings WHERE key = 'max_concurrent_users_limit'");
    res.json({ limit: result.rows[0]?.value?.limit ?? 200 });
  } catch (error) {
    next(error);
  }
});

router.put("/settings/capacity", requireAdmin, async (req, res, next) => {
  try {
    await ensureAdminOpsTables();
    const limit = Number(req.body.limit);
    if (isNaN(limit) || limit <= 0) {
      return res.status(400).json({ error: "Giới hạn tải trọng không hợp lệ." });
    }
    const value = { limit };
    await query(
      `INSERT INTO admin_settings (key, value, updated_by, updated_at)
       VALUES ('max_concurrent_users_limit', $1, $2, NOW())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by, updated_at = NOW()`,
      [value, req.header("x-user-id") || null]
    );
    await writeAudit(req, "capacity.update", "setting", "max_concurrent_users_limit", value);
    res.json({ success: true, limit });
  } catch (error) {
    next(error);
  }
});

export default router;


