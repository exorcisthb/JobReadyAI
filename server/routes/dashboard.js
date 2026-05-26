import express from "express";
import { query } from "../config/database.js";

const router = express.Router();

function requireAuth(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.user = { id: userId, role: req.header("x-user-role") ?? "user" };
  return next();
}

function requireContentManager(req, res, next) {
  if (!req.user || req.user.role !== "content_manager") {
    return res.status(403).json({ error: "Forbidden" });
  }
  return next();
}

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [userData, profile, sessionStats, recentSessions, progress, practiceCount, cvStats] = await Promise.all([
      query("SELECT id, email FROM users WHERE id = $1", [userId]),
      query("SELECT * FROM user_profiles WHERE user_id = $1", [userId]),
      query(
        `
        SELECT COUNT(*) as total_sessions,
               ROUND(AVG(avg_score)::numeric, 2) as avg_score
        FROM interview_sessions
        WHERE user_id = $1 AND status = 'completed'
      `,
        [userId],
      ),
      query(
        `
        SELECT id, level, avg_score, started_at, status
        FROM interview_sessions
        WHERE user_id = $1
        ORDER BY started_at DESC LIMIT 5
      `,
        [userId],
      ),
      query(
        `
        SELECT session_date, avg_score
        FROM user_progress
        WHERE user_id = $1
        ORDER BY session_date DESC LIMIT 30
      `,
        [userId],
      ),
      query("SELECT COUNT(*) as total FROM practice_sessions WHERE user_id = $1", [userId]),
      query(
        `
        SELECT
          (SELECT COUNT(*) FROM cvs WHERE user_id = $1) as cv_uploads,
          (SELECT COUNT(*) FROM cv_builder_drafts WHERE user_id = $1) as cv_built
      `,
        [userId],
      ),
    ]);

    const user = userData.rows[0] ?? {};
    const userProfile = profile.rows[0] ?? {};

    const name = userProfile.full_name || user.email?.split("@")[0] || "User";

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: name,
        avatar_url: userProfile.avatar_url || null,
      },
      profile: {
        full_name: userProfile.full_name ?? null,
        avatar_url: userProfile.avatar_url ?? null,
        profile_completed: userProfile.profile_completed ?? false,
        phone: userProfile.phone ?? null,
        job_title: userProfile.job_title ?? null,
        industry: userProfile.industry ?? null,
        experience_level: userProfile.experience_level ?? null,
        location: userProfile.location ?? null,
        skills: userProfile.skills ?? null,
        career_goal: userProfile.career_goal ?? null,
      },
      stats: {
        total_sessions: Number.parseInt(String(sessionStats.rows[0]?.total_sessions ?? "0"), 10),
        avg_score: sessionStats.rows[0]?.avg_score ?? null,
        total_cv_uploads: Number.parseInt(String(cvStats.rows[0]?.cv_uploads ?? "0"), 10),
        total_cv_built: Number.parseInt(String(cvStats.rows[0]?.cv_built ?? "0"), 10),
        total_practice_sessions: Number.parseInt(String(practiceCount.rows[0]?.total ?? "0"), 10),
      },
      recent_sessions: recentSessions.rows,
      progress: progress.rows.reverse(),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/cm", requireAuth, requireContentManager, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [stats, recentArticles, recentQuestions] = await Promise.all([
      query(`
      SELECT
        (SELECT COUNT(*) FROM questions WHERE is_active = true) as total_questions,
        (SELECT COUNT(*) FROM articles) as total_articles,
        (SELECT COUNT(*) FROM articles WHERE status = 'published') as published_articles,
        (SELECT COUNT(*) FROM articles WHERE status = 'draft') as draft_articles
    `),
      query(
        `
      SELECT id, title, status, category, created_at
      FROM articles
      WHERE author_id = $1
      ORDER BY created_at DESC LIMIT 5
    `,
        [userId],
      ),
      query(
        `
      SELECT id, content, level, type, created_at
      FROM questions
      WHERE created_by = $1
      ORDER BY created_at DESC LIMIT 5
    `,
        [userId],
      ),
    ]);

    res.json({
      stats: stats.rows[0],
      recent_articles: recentArticles.rows,
      recent_questions: recentQuestions.rows,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
