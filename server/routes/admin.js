import express from "express";
import bcrypt from "bcryptjs";
import os from "node:os";
import { query, withTransaction } from "../config/database.js";
import { getOnlineCount } from "../utils/authUtils.js";
import { trackUnauthorizedAccess } from "../middleware/suspiciousActivity.js";
import { del } from "../utils/cache.js";

const router = express.Router();

function requireAdmin(req, res, next) {
  const role = req.header("x-user-role");
  if (role !== "admin") {
    const userId = req.header("x-user-id");
    if (userId) {
      const ip = (req.headers["x-forwarded-for"] || "").split(",")[0]?.trim()?.replace(/^::ffff:/, "") || req.ip || "";
      trackUnauthorizedAccess(userId, ip, req.originalUrl || req.url).catch(() => {});
    }
    return res.status(403).json({ error: "Forbidden" });
  }
  return next();
}

function requireManagerWeb(req, res, next) {
  const role = req.header("x-user-role");
  if (role !== "content_manager" && role !== "admin") {
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

function normalizeIp(raw) {
  return String(raw || "").trim().replace(/^::ffff:/, "").replace(/\/\d+$/, "");
}

function isLocalIp(ip) {
  const normalized = normalizeIp(ip);
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

  // Clean up IP values that were stored with CIDR suffix (/32) due to past bug
  await query(
    `UPDATE admin_blocklist SET value = regexp_replace(value, '/\\d+$', '') WHERE type = 'ip' AND value ~ '/\\d+$'`
  ).catch(() => {});

  // Add expires_at column for auto-temp-bans
  await query("ALTER TABLE admin_blocklist ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ").catch(() => {});
  // Auto-cleanup expired entries
  await query("DELETE FROM admin_blocklist WHERE expires_at IS NOT NULL AND expires_at < NOW()").catch(() => {});
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

function getGroupViolationState(nextCount) {
  if (nextCount <= 1) {
    return { count: 1, status: "warning", warningSql: "NOW() + INTERVAL '3 days'", banSql: "NULL" };
  }
  if (nextCount === 2) {
    return { count: 2, status: "temp_banned", warningSql: "NULL", banSql: "NOW() + INTERVAL '7 days'" };
  }
  return { count: 3, status: "permanent_banned", warningSql: "NULL", banSql: "NULL" };
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

    res.set("Cache-Control", "no-cache");
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
        `SELECT u.id, u.email, u.role, u.status, u.created_at,
                u.auth_provider,
                u.sub_plan_interview, u.sub_expires_interview, u.sub_plan_cv, u.sub_expires_cv
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

router.get("/groups", requireManagerWeb, async (_req, res, next) => {
  try {
    const result = await query(`
      SELECT g.id, g.name, g.description, g.creator_id, COALESCE(g.status, 'active') as status,
             g.warning_message, g.warning_until, g.ban_until, g.created_at,
             COALESCE(up.full_name, u.email) as creator_name,
             (SELECT COUNT(*)::int FROM group_members WHERE group_id = g.id) as member_count,
             (SELECT COUNT(*)::int FROM group_posts WHERE group_id = g.id) as post_count,
             COALESCE((SELECT MAX(violation_count)::int FROM group_status_violations WHERE group_id = g.id), 0) as violation_count,
             (SELECT COUNT(*)::int FROM group_ban_appeals WHERE group_id = g.id AND status = 'pending') as pending_appeal_count,
             (SELECT COUNT(*)::int FROM group_violation_reports WHERE group_id = g.id AND target_type = 'general' AND status = 'pending') as pending_group_report_count
      FROM groups g
      LEFT JOIN users u ON u.id = g.creator_id
      LEFT JOIN user_profiles up ON up.user_id = g.creator_id
      ORDER BY
        CASE COALESCE(g.status, 'active')
          WHEN 'permanent_banned' THEN 1
          WHEN 'temp_banned' THEN 2
          WHEN 'warning' THEN 3
          ELSE 4
        END,
        g.created_at DESC
      LIMIT 200
    `);
    res.json({ groups: result.rows });
  } catch (error) {
    next(error);
  }
});

router.get("/group-reports/:reportId", requireManagerWeb, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT r.id, r.reason, r.evidence_image_url, r.evidence_link, r.status, r.created_at,
              g.id as group_id, g.name as group_name,
              COALESCE(rp.full_name, ru.email) as reporter_name
       FROM group_violation_reports r
       JOIN groups g ON g.id = r.group_id
       LEFT JOIN users ru ON ru.id = r.reporter_id
       LEFT JOIN user_profiles rp ON rp.user_id = r.reporter_id
       WHERE r.id = $1 AND r.target_type = 'general'
       LIMIT 1`,
      [req.params.reportId],
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "Khong tim thay report nhom." });
    const report = result.rows[0];
    res.json({
      report: {
        ...report,
        group_link: `/content-manager/groups?groupId=${report.group_id}`,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/groups/:id/appeals", requireManagerWeb, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT a.*,
              COALESCE(up.full_name, u.email) as appellant_name
       FROM group_ban_appeals a
       LEFT JOIN users u ON u.id = a.appellant_id
       LEFT JOIN user_profiles up ON up.user_id = a.appellant_id
       WHERE a.group_id = $1
       ORDER BY
         CASE a.status WHEN 'pending' THEN 1 WHEN 'approved' THEN 2 ELSE 3 END,
         a.created_at DESC`,
      [req.params.id],
    );
    res.json({ appeals: result.rows });
  } catch (error) {
    next(error);
  }
});

router.patch("/groups/:id/appeals/:appealId", requireManagerWeb, async (req, res, next) => {
  try {
    const status = req.body?.status === "approved" ? "approved" : "rejected";
    const adminNote = String(req.body?.admin_note || "").trim() || null;
    const adminId = req.header("x-user-id") || null;

    const result = await withTransaction(async (client) => {
      const appeal = await client.query(
        `UPDATE group_ban_appeals
         SET status = $1, reviewed_by = $2, reviewed_at = NOW(), admin_note = $3, updated_at = NOW()
         WHERE id = $4 AND group_id = $5
         RETURNING *`,
        [status, adminId, adminNote, req.params.appealId, req.params.id],
      );
      if (appeal.rowCount === 0) return null;

      if (status === "approved") {
        await client.query(
          `UPDATE groups
           SET status = 'active', warning_message = NULL, warning_until = NULL, ban_until = NULL, updated_at = NOW()
           WHERE id = $1`,
          [req.params.id],
        );
      }
      return appeal.rows[0];
    });

    if (!result) return res.status(404).json({ error: "Khong tim thay khang cao." });
    await writeAudit(req, "group.appeal.review", "group", req.params.id, { appealId: req.params.appealId, status });
    res.json({ success: true, appeal: result });
  } catch (error) {
    next(error);
  }
});

router.get("/groups/:id/reports", requireManagerWeb, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT r.*,
              COALESCE(rp.full_name, ru.email) as reporter_name,
              COALESCE(tp.full_name, tu.email) as target_user_name,
              gp.title as target_post_title
       FROM group_violation_reports r
       LEFT JOIN users ru ON ru.id = r.reporter_id
       LEFT JOIN user_profiles rp ON rp.user_id = r.reporter_id
       LEFT JOIN users tu ON tu.id = r.target_user_id
       LEFT JOIN user_profiles tp ON tp.user_id = r.target_user_id
       LEFT JOIN group_posts gp ON gp.id = r.target_id AND r.target_type = 'post'
       WHERE r.group_id = $1
       ORDER BY r.created_at DESC
       LIMIT 100`,
      [req.params.id],
    );
    res.json({ reports: result.rows });
  } catch (error) {
    next(error);
  }
});

router.post("/groups/:id/violations", requireManagerWeb, async (req, res, next) => {
  try {
    const adminId = req.header("x-user-id") || null;
    const { message = "" } = req.body;
    const groupId = req.params.id;
    if (!String(message).trim()) {
      return res.status(400).json({ error: "Vui long nhap noi dung vi pham." });
    }

    const group = await query("SELECT id FROM groups WHERE id = $1", [groupId]);
    if (group.rowCount === 0) return res.status(404).json({ error: "Khong tim thay nhom." });

    const previous = await query(
      `SELECT COALESCE(MAX(violation_count), 0)::int as count FROM group_status_violations WHERE group_id = $1`,
      [groupId],
    );
    const next = getGroupViolationState(Math.min(Number(previous.rows[0]?.count || 0) + 1, 3));

    const violation = await withTransaction(async (client) => {
      const inserted = await client.query(
        `INSERT INTO group_status_violations (
           group_id, manager_web_id, violation_count, message, status,
           warning_start_at, warning_end_at, ban_start_at, ban_end_at
         )
         VALUES (
           $1, $2, $3, $4, $5::text,
           CASE WHEN $5::text = 'warning' THEN NOW() ELSE NULL END,
           ${next.warningSql},
           CASE WHEN $5::text IN ('temp_banned', 'permanent_banned') THEN NOW() ELSE NULL END,
           ${next.banSql}
         )
         RETURNING *`,
        [groupId, adminId, next.count, String(message).trim(), next.status],
      );

      await client.query(
        `UPDATE groups
         SET status = $1::text,
             warning_message = CASE WHEN $1::text = 'warning' THEN $2 ELSE NULL END,
             warning_until = CASE WHEN $1::text = 'warning' THEN NOW() + INTERVAL '3 days' ELSE NULL END,
             ban_until = CASE WHEN $1::text = 'temp_banned' THEN NOW() + INTERVAL '7 days' ELSE NULL END,
             updated_at = NOW()
         WHERE id = $3`,
        [next.status, String(message).trim(), groupId],
      );
      return inserted.rows[0];
    });

    await writeAudit(req, "group.violation", "group", groupId, { status: next.status, count: next.count });
    res.status(201).json({ success: true, violation });
  } catch (error) {
    next(error);
  }
});

router.patch("/groups/:id/unban", requireManagerWeb, async (req, res, next) => {
  try {
    await query(
      `UPDATE groups
       SET status = 'active', warning_message = NULL, warning_until = NULL, ban_until = NULL, updated_at = NOW()
       WHERE id = $1`,
      [req.params.id],
    );
    await writeAudit(req, "group.unban", "group", req.params.id, {});
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.get("/finance", requireAdmin, async (req, res, next) => {
  try {
    const subscriptionSummary = await query(`
      SELECT
        COUNT(*) FILTER (WHERE COALESCE(sub_plan_interview, 'free') = 'free' AND COALESCE(sub_plan_cv, 'free') = 'free')::int AS free_users,
        COUNT(*) FILTER (WHERE sub_plan_interview IN ('pro_interview', 'ultra_interview') OR sub_plan_cv IN ('pro_cv', 'ultra_cv'))::int AS pro_users,
        COUNT(*) FILTER (WHERE sub_plan_interview = 'ultra_interview' OR sub_plan_cv = 'ultra_cv')::int AS ultra_users,
        COUNT(*) FILTER (WHERE sub_plan_interview IN ('pro_interview','ultra_interview'))::int AS interview_users,
        COUNT(*) FILTER (WHERE sub_plan_cv IN ('pro_cv','ultra_cv'))::int AS cv_users,
        COUNT(*) FILTER (WHERE
          (sub_plan_interview IN ('pro_interview','ultra_interview') AND sub_expires_interview BETWEEN NOW() AND NOW() + INTERVAL '7 days')
          OR
          (sub_plan_cv IN ('pro_cv','ultra_cv') AND sub_expires_cv BETWEEN NOW() AND NOW() + INTERVAL '7 days')
        )::int AS expiring_soon
      FROM users
      WHERE COALESCE(is_test_user, false) = false
        AND (
          NOT EXISTS (SELECT 1 FROM user_subscriptions us WHERE us.user_id = users.id AND us.status = 'active' AND us.plan IN ('ultra_interview','ultra_cv','pro_interview','pro_cv') AND us.source = 'admin_grant')
          OR EXISTS (SELECT 1 FROM user_subscriptions us WHERE us.user_id = users.id AND us.status = 'active' AND us.source = 'payment')
        )
    `);

    const hasTransactions = await tableExists("transactions");

    // Doanh thu gói Interview
    const interviewRevenue = hasTransactions
      ? await query(`
          SELECT
            COALESCE(SUM(amount) FILTER (WHERE created_at::date = CURRENT_DATE), 0)::int AS today_interview_revenue,
            COALESCE(SUM(amount) FILTER (WHERE created_at >= DATE_TRUNC('week', NOW())), 0)::int AS week_interview_revenue,
            COALESCE(SUM(amount) FILTER (WHERE created_at >= DATE_TRUNC('month', NOW())), 0)::int AS month_interview_revenue
          FROM transactions
          WHERE item_type = 'subscription' AND status = 'completed'
            AND item_id IN ('pro_interview', 'ultra_interview')
        `)
      : { rows: [{ today_interview_revenue: 0, week_interview_revenue: 0, month_interview_revenue: 0 }] };

    // Doanh thu gói CV
    const cvRevenue = hasTransactions
      ? await query(`
          SELECT
            COALESCE(SUM(amount) FILTER (WHERE created_at::date = CURRENT_DATE), 0)::int AS today_cv_revenue,
            COALESCE(SUM(amount) FILTER (WHERE created_at >= DATE_TRUNC('week', NOW())), 0)::int AS week_cv_revenue,
            COALESCE(SUM(amount) FILTER (WHERE created_at >= DATE_TRUNC('month', NOW())), 0)::int AS month_cv_revenue
          FROM transactions
          WHERE item_type = 'subscription' AND status = 'completed'
            AND item_id IN ('pro_cv', 'ultra_cv')
        `)
      : { rows: [{ today_cv_revenue: 0, week_cv_revenue: 0, month_cv_revenue: 0 }] };

    const mrrResult = await query(`
      SELECT
        COALESCE(SUM(CASE
          WHEN sub_plan_interview = 'pro_interview' THEN 50000
          WHEN sub_plan_interview = 'ultra_interview' THEN 100000
          ELSE 0
        END), 0)::int AS mrr_interview,
        COALESCE(SUM(CASE
          WHEN sub_plan_cv = 'pro_cv' THEN 30000
          WHEN sub_plan_cv = 'ultra_cv' THEN 60000
          ELSE 0
        END), 0)::int AS mrr_cv
      FROM users
      WHERE COALESCE(is_test_user, false) = false
        AND (
          (sub_plan_interview IN ('pro_interview','ultra_interview') AND (sub_expires_interview IS NULL OR sub_expires_interview > NOW()))
          OR
          (sub_plan_cv IN ('pro_cv','ultra_cv') AND (sub_expires_cv IS NULL OR sub_expires_cv > NOW()))
        )
        AND (
          NOT EXISTS (SELECT 1 FROM user_subscriptions us WHERE us.user_id = users.id AND us.status = 'active' AND us.plan IN ('ultra_interview','ultra_cv','pro_interview','pro_cv') AND us.source = 'admin_grant')
          OR EXISTS (SELECT 1 FROM user_subscriptions us WHERE us.user_id = users.id AND us.status = 'active' AND us.source = 'payment')
        )
    `);

    // Tổng doanh thu tích lũy trọn đời
    const totalRevenueResult = hasTransactions
      ? await query(`
          SELECT COALESCE(SUM(amount), 0)::int AS total_revenue
          FROM transactions
          WHERE status = 'completed'
        `)
      : { rows: [{ total_revenue: 0 }] };

    // Phân tích tháng tùy chọn từ query param (ví dụ: ?month=2026-06)
    const { month } = req.query;
    let startStr, endStr;

    if (month && /^\d{4}-\d{2}$/.test(month)) {
      const parts = month.split("-");
      const year = parseInt(parts[0], 10);
      const monthVal = parseInt(parts[1], 10);
      
      const lastDay = new Date(year, monthVal, 0).getDate();
      
      startStr = `${year}-${String(monthVal).padStart(2, "0")}-01`;
      endStr = `${year}-${String(monthVal).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
    } else {
      // Mặc định là tháng hiện tại: từ ngày 1 đến ngày cuối tháng
      const now = new Date();
      const year = now.getFullYear();
      const monthVal = now.getMonth() + 1;
      
      const lastDay = new Date(year, monthVal, 0).getDate();
      
      startStr = `${year}-${String(monthVal).padStart(2, "0")}-01`;
      endStr = `${year}-${String(monthVal).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
    }

    // Biểu đồ doanh thu hàng ngày của tháng được chọn — 2 series: interview và CV
    const dailyRevenue = hasTransactions
      ? await query(`
          SELECT
            d.date::date::text AS date,
            COALESCE(SUM(t.amount) FILTER (WHERE t.item_id IN ('pro_interview','ultra_interview')), 0)::int AS interview_revenue,
            COALESCE(SUM(t.amount) FILTER (WHERE t.item_id IN ('pro_cv','ultra_cv')), 0)::int AS cv_revenue
          FROM (SELECT GENERATE_SERIES($1::date, $2::date, '1 day')::date AS date) d
          LEFT JOIN transactions t ON t.created_at::date = d.date AND t.item_type = 'subscription' AND t.status = 'completed'
          GROUP BY d.date
          ORDER BY d.date ASC
        `, [startStr, endStr])
      : { rows: [] };

    // Giao dịch Interview
    const interviewTransactions = hasTransactions
      ? await query(`
          SELECT t.id::text, t.item_name AS item, t.amount, t.status, t.created_at, u.email
          FROM transactions t
          LEFT JOIN users u ON u.id = t.user_id
          WHERE t.item_type = 'subscription' AND t.item_id IN ('pro_interview', 'ultra_interview')
          ORDER BY t.created_at DESC
          LIMIT 50
        `)
      : { rows: [] };

    // Giao dịch CV
    const cvTransactions = hasTransactions
      ? await query(`
          SELECT t.id::text, t.item_name AS item, t.amount, t.status, t.created_at, u.email
          FROM transactions t
          LEFT JOIN users u ON u.id = t.user_id
          WHERE t.item_type = 'subscription' AND t.item_id IN ('pro_cv', 'ultra_cv')
          ORDER BY t.created_at DESC
          LIMIT 50
        `)
      : { rows: [] };

    const expiringUsers = await query(`
      SELECT id, email,
        COALESCE(sub_plan_interview, 'free') AS subscription_plan,
        LEAST(
          CASE WHEN sub_plan_interview IN ('pro_interview','ultra_interview') THEN sub_expires_interview ELSE NULL END,
          CASE WHEN sub_plan_cv IN ('pro_cv','ultra_cv') THEN sub_expires_cv ELSE NULL END
        ) AS subscription_expires_at
      FROM users
      WHERE COALESCE(is_test_user, false) = false
        AND (
          (sub_plan_interview IN ('pro_interview','ultra_interview') AND sub_expires_interview BETWEEN NOW() AND NOW() + INTERVAL '14 days')
          OR
          (sub_plan_cv IN ('pro_cv','ultra_cv') AND sub_expires_cv BETWEEN NOW() AND NOW() + INTERVAL '14 days')
        )
      ORDER BY subscription_expires_at ASC
      LIMIT 30
    `);

    const activeUsers = await query(`
      SELECT id, email,
        sub_plan_interview,
        sub_plan_cv,
        sub_expires_interview,
        sub_expires_cv
      FROM users
      WHERE COALESCE(is_test_user, false) = false
        AND (
          (sub_plan_interview IN ('pro_interview','ultra_interview') AND (sub_expires_interview IS NULL OR sub_expires_interview > NOW()))
          OR
          (sub_plan_cv IN ('pro_cv','ultra_cv') AND (sub_expires_cv IS NULL OR sub_expires_cv > NOW()))
        )
        AND (
          NOT EXISTS (SELECT 1 FROM user_subscriptions us WHERE us.user_id = users.id AND us.status = 'active' AND us.plan IN ('ultra_interview','ultra_cv','pro_interview','pro_cv') AND us.source = 'admin_grant')
          OR EXISTS (SELECT 1 FROM user_subscriptions us WHERE us.user_id = users.id AND us.status = 'active' AND us.source = 'payment')
        )
      ORDER BY id DESC
      LIMIT 100
    `);

    const summary = subscriptionSummary.rows[0];
    const paidUsers = summary.pro_users;
    const totalUsers = summary.free_users + paidUsers;
    const ir = interviewRevenue.rows[0];
    const cr = cvRevenue.rows[0];
    const mrr = mrrResult.rows[0];
    const totalRev = totalRevenueResult.rows[0];

    res.json({
      summary: {
        today_revenue: (ir.today_interview_revenue ?? 0) + (cr.today_cv_revenue ?? 0),
        week_revenue: (ir.week_interview_revenue ?? 0) + (cr.week_cv_revenue ?? 0),
        month_revenue: (ir.month_interview_revenue ?? 0) + (cr.month_cv_revenue ?? 0),
        total_revenue: totalRev.total_revenue ?? 0,
        today_interview_revenue: ir.today_interview_revenue ?? 0,
        week_interview_revenue: ir.week_interview_revenue ?? 0,
        month_interview_revenue: ir.month_interview_revenue ?? 0,
        today_cv_revenue: cr.today_cv_revenue ?? 0,
        week_cv_revenue: cr.week_cv_revenue ?? 0,
        month_cv_revenue: cr.month_cv_revenue ?? 0,
        mrr: (mrr.mrr_interview ?? 0) + (mrr.mrr_cv ?? 0),
        mrr_interview: mrr.mrr_interview ?? 0,
        mrr_cv: mrr.mrr_cv ?? 0,
        conversion_rate: totalUsers ? Math.round((paidUsers / totalUsers) * 1000) / 10 : 0,
        ...summary,
      },
      dailyRevenue: dailyRevenue.rows,
      interviewTransactions: interviewTransactions.rows,
      cvTransactions: cvTransactions.rows,
      expiringUsers: expiringUsers.rows,
      activeUsers: activeUsers.rows,
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
      const targetIp = normalizeIp(trimmedValue);
      if (isLocalIp(targetIp)) {
        return res.status(400).json({ error: "Không được phép chặn IP của máy chủ/localhost." });
      }

      // Check current request IP
      const currentAdminIp = normalizeIp(req.ip || req.socket?.remoteAddress || "");
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

    const finalValue = type === "ip" ? normalizeIp(value) : String(value).trim().toLowerCase();
    const result = await query(
      `INSERT INTO admin_blocklist (type, value, reason, created_by)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (type, value) DO UPDATE SET reason = EXCLUDED.reason
       RETURNING id, type, value, reason, created_at`,
      [type, finalValue, reason || null, req.header("x-user-id") || null],
    );
    await writeAudit(req, "blocklist.upsert", type, finalValue, { reason });
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

    const suspiciousLogs = await query(`
      SELECT s.id, s.ip_address::text, s.activity_type, s.severity, s.details, s.created_at,
             u.email AS user_email, u.id AS user_id
      FROM suspicious_activity_logs s
      LEFT JOIN users u ON u.id = s.user_id
      ${searchEmail ? `WHERE LOWER(u.email) LIKE '%' || $1 || '%'` : ""}
      ORDER BY s.created_at DESC
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
    const adminIps = new Set(adminIpsResult.rows.map((r) => normalizeIp(r.ip)));

    res.json({
      userLogs: userLogs.rows,
      suspiciousLogs: suspiciousLogs.rows,
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
    del("maintenance_mode");
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
    // Only allow demote to 'user' — promoting to content_manager must go through POST /content-managers
    if (role !== "user") {
      return res.status(400).json({ error: "Route này chỉ hỗ trợ hạ cấp về user. Để tạo Manager, dùng route /admin/create-content-manager." });
    }
    await query("UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2", [role, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/users/:id/grant-ultra", requireAdmin, async (req, res, next) => {
  try {
    const userId = req.params.id;
    await withTransaction(async (client) => {
      // Cancel existing active subscriptions for this user
      await client.query(
        `UPDATE user_subscriptions SET status = 'cancelled'
         WHERE user_id = $1 AND plan IN ('pro_interview','ultra_interview','pro_cv','ultra_cv') AND status = 'active'`,
        [userId],
      );
      // Insert new ultra subscriptions (no expiry = permanent)
      await client.query(
        `INSERT INTO user_subscriptions (user_id, plan, status, started_at, expires_at, source)
         VALUES ($1, 'ultra_interview', 'active', NOW(), NULL, 'admin_grant')`,
        [userId],
      );
      await client.query(
        `INSERT INTO user_subscriptions (user_id, plan, status, started_at, expires_at, source)
         VALUES ($1, 'ultra_cv', 'active', NOW(), NULL, 'admin_grant')`,
        [userId],
      );
      // Update users table
      await client.query(
        `UPDATE users SET sub_plan_interview = 'ultra_interview', sub_expires_interview = NULL,
         sub_plan_cv = 'ultra_cv', sub_expires_cv = NULL, updated_at = NOW()
         WHERE id = $1`,
        [userId],
      );
      // Insert notification for user
      const message = "Tài khoản của bạn đã được nâng cấp lên Ultra vĩnh viễn";
      await client.query(
        `INSERT INTO notifications (user_id, sender_id, sender_name, sender_role, title, message, type)
         VALUES ($1, $2, 'Admin', 'admin', $3, $4, 'info')`,
        [userId, req.header("x-user-id") || null, message, message],
      );
    });
    await writeAudit(req, "subscription.grant_ultra", "user", req.params.id);
    del(`user_plan:${req.params.id}`);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/users/:id/revoke-ultra", requireAdmin, async (req, res, next) => {
  try {
    const userId = req.params.id;
    await withTransaction(async (client) => {
      // Cancel all active premium subscriptions
      await client.query(
        `UPDATE user_subscriptions SET status = 'cancelled'
         WHERE user_id = $1 AND plan IN ('pro_interview','ultra_interview','pro_cv','ultra_cv') AND status = 'active'`,
        [userId],
      );
      // Reset user to free immediately
      await client.query(
        `UPDATE users SET sub_plan_interview = 'free', sub_expires_interview = NULL,
         sub_plan_cv = 'free', sub_expires_cv = NULL, updated_at = NOW()
         WHERE id = $1`,
        [userId],
      );
      // Insert notification
      const revokeMessage = "Gói Ultra của bạn đã bị thu hồi, tài khoản trở về gói Miễn phí";
      await client.query(
        `INSERT INTO notifications (user_id, sender_id, sender_name, sender_role, title, message, type)
         VALUES ($1, $2, 'Admin', 'admin', $3, $4, 'info')`,
        [userId, req.header("x-user-id") || null, revokeMessage, revokeMessage],
      );
    });
    await writeAudit(req, "subscription.revoke_ultra", "user", req.params.id);
    del(`user_plan:${req.params.id}`);
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


