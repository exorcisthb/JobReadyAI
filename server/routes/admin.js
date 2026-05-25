import express from "express";
import bcrypt from "bcryptjs";
import { query, withTransaction } from "../config/database.js";

const router = express.Router();

function requireAdmin(req, res, next) {
  const role = req.header("x-user-role");
  if (role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }
  return next();
}

router.get("/stats", requireAdmin, async (_req, res, next) => {
  try {
    const statsResult = await query(`
      SELECT
        (SELECT COUNT(*)::int FROM users) as total_users,
        (SELECT COUNT(*)::int FROM users WHERE status = 'locked') as locked_users,
        (SELECT COUNT(*)::int FROM interview_sessions) as total_sessions,
        (SELECT COUNT(*)::int FROM cvs) as total_cv_uploads,
        (SELECT COUNT(*)::int FROM cv_builder_drafts) as total_cv_built,
        (SELECT COUNT(*)::int FROM jd_comparisons) as total_jd_comparisons,
        (SELECT COUNT(*)::int FROM questions WHERE is_active = true) as active_questions,
        (SELECT COUNT(*)::int FROM articles WHERE status = 'published') as published_articles
    `);

    const activityResult = await query(`
      SELECT 
        d.date::date::text as date,
        COALESCE(u.count, 0)::int as signups,
        COALESCE(s.count, 0)::int as sessions
      FROM (
        SELECT GENERATE_SERIES(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day')::date as date
      ) d
      LEFT JOIN (
        SELECT created_at::date as date, COUNT(*) as count 
        FROM users 
        GROUP BY created_at::date
      ) u ON d.date = u.date
      LEFT JOIN (
        SELECT started_at::date as date, COUNT(*) as count 
        FROM interview_sessions 
        GROUP BY started_at::date
      ) s ON d.date = s.date
      ORDER BY d.date ASC
    `);

    res.json({
      ...statsResult.rows[0],
      activity: activityResult.rows
    });
  } catch (error) {
    next(error);
  }
});

router.get("/users", requireAdmin, async (req, res, next) => {
  try {
    const limit = Number.parseInt(String(req.query.limit ?? "50"), 10) || 50;
    const usersResult = await query(
      `
      SELECT u.id, u.email, u.role, u.status, u.created_at
      FROM users u
      ORDER BY u.created_at DESC
      LIMIT $1
    `,
      [limit],
    );
    res.json(usersResult.rows);
  } catch (error) {
    next(error);
  }
});

router.patch("/users/:id/status", requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
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
    next(error);
  }
});

export default router;
