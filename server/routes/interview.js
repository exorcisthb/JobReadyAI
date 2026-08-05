import express from "express";
import { query } from "../config/database.js";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { getUserPlanCached } from "../utils/userPlan.js";

const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip || "unknown"),
  message: { error: "RATE_LIMITED", message: "Quá nhiều yêu cầu AI, vui lòng thử lại sau." },
});

function requireAuth(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.user = { id: userId, role: req.header("x-user-role") ?? "user" };
  return next();
}

// ─── Weekly Interview Limits ──────────────────────────────────────────────

const PLAN_WEEKLY_LIMITS = {
  free: 2,
  pro_interview: 10,
  ultra_interview: Infinity,
  pro: 10,
  ultra: Infinity,
};

function getWeekStart() {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun, 1=Mon ...
  const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(now);
  monday.setUTCDate(diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday;
}

function getNextWeekStart() {
  const next = getWeekStart();
  next.setUTCDate(next.getUTCDate() + 7);
  return next;
}

async function getUserPlan(userId) {
  const user = await getUserPlanCached(userId);
  if (!user) return "free";

  let plan = user.sub_plan_interview || "free";
  let expires = user.sub_expires_interview;
  
  if (plan === "free" && user.subscription_plan && user.subscription_plan !== "free") {
    plan = user.subscription_plan === "pro" ? "pro_interview" : "ultra_interview";
    expires = user.subscription_expires_at;
  }
  
  if (plan !== "free" && expires && new Date(expires) < new Date()) {
    return "free";
  }
  return plan;
}

async function countWeeklySessions(userId, weekStart) {
  const result = await query(
    `SELECT COUNT(*) as count FROM interview_sessions
     WHERE user_id = $1 AND created_at >= $2
       AND status = 'completed'`,
    [userId, weekStart]
  );
  return parseInt(result.rows[0].count, 10) || 0;
}

// GET /api/interview/quota — Trả về số lượt còn lại trong tuần
router.get("/quota", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const plan = await getUserPlan(userId);
    const weekStart = getWeekStart();
    const nextWeekStart = getNextWeekStart();
    const used = await countWeeklySessions(userId, weekStart);
    const limit = PLAN_WEEKLY_LIMITS[plan] ?? 2;

    res.json({
      used,
      limit: limit === Infinity ? "unlimited" : limit,
      remaining: limit === Infinity ? "unlimited" : Math.max(0, limit - used),
      plan,
      reset_at: nextWeekStart.toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/interview/start - Bắt đầu phiên phỏng vấn
router.post("/start", requireAuth, aiLimiter, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { cv_id } = req.body;

    // Check weekly interview limit
    const plan = await getUserPlan(userId);
    const weekStart = getWeekStart();
    const used = await countWeeklySessions(userId, weekStart);
    const limit = PLAN_WEEKLY_LIMITS[plan] ?? 2;

    if (used >= limit) {
      const nextWeekStart = getNextWeekStart();
      return res.status(429).json({
        error: "interview_limit_reached",
        message: `Bạn đã dùng hết ${limit} lượt phỏng vấn trong tuần này. Nâng cấp lên Pro để có thêm lượt.`,
        used,
        limit: limit === Infinity ? "unlimited" : limit,
        reset_at: nextWeekStart.toISOString(),
        plan,
      });
    }

    if (!cv_id) {
      return res.status(400).json({ error: "cv_id is required" });
    }

    // Fetch full CV row
    const cvCheck = await query(
      `SELECT * FROM cvs WHERE id = $1 AND user_id = $2`,
      [cv_id, userId]
    );

    if (cvCheck.rows.length === 0) {
      return res.status(404).json({ error: "CV not found or does not belong to user" });
    }

    const cv = cvCheck.rows[0];

    // Get candidate name
    let candidateName = cv.full_name || "";
    if (cv.type === "created" && cv.content) {
      try {
        const parsed =
          typeof cv.content === "string" ? JSON.parse(cv.content) : cv.content;
        candidateName = parsed.fullName || parsed.full_name || cv.full_name || "";
      } catch (_) {}
    }

    // Get or generate cv_text_cache
    let cvText = cv.cv_text_cache?.trim() || "";

    if (!cvText || cvText.length < 500) {
      // Import buildCvTextFromContent from cv.js
      const { buildCvTextFromContent } = await import("./cv.js");
      cvText = buildCvTextFromContent(cv);

      if (cvText && cvText.length > 20) {
        await query(`UPDATE cvs SET cv_text_cache = $1 WHERE id = $2`, [
          cvText,
          cv.id,
        ]).catch(console.warn);
      }
    }

    // Create session
    const result = await query(
      `INSERT INTO interview_sessions (user_id, cv_id, type, level, status, conversation)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, started_at`,
      [userId, cv_id, "voice", "junior", "in_progress", JSON.stringify([])]
    );

    res.json({
      session_id: result.rows[0].id,
      started_at: result.rows[0].started_at,
      cv_text: cvText,
      candidate_name: candidateName,
    });
  } catch (error) {
    console.error("Error starting interview:", error);
    next(error);
  }
});

// PUT /api/interview/:id/end - Kết thúc và lưu kết quả
router.put("/:id/end", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const sessionId = req.params.id;
    const {
      conversation,
      total_score,
      content_score,
      voice_score,
      audio_metrics,
      feedback,
      strengths,
      weaknesses,
      improvements,
      ended_by_user,
    } = req.body;

    if (ended_by_user !== true) {
      return res.status(400).json({ error: "Interview must be ended by the user" });
    }

    // Tính duration
    const sessionResult = await query(
      `SELECT started_at FROM interview_sessions WHERE id = $1 AND user_id = $2`,
      [sessionId, userId]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    const startedAt = new Date(sessionResult.rows[0].started_at);
    const endedAt = new Date();
    const durationSeconds = Math.floor((endedAt - startedAt) / 1000);

    // Update session
    await query(
      `UPDATE interview_sessions 
       SET 
         ended_at = $1,
         status = 'completed',
         duration_seconds = $2,
         total_score = $3,
         content_score = $4,
         voice_score = $5,
         avg_volume = $6,
         pause_count = $7,
         avg_pause_duration = $8,
         confidence_level = $9,
         conversation = $10,
         feedback = $11,
         strengths = $12,
         weaknesses = $13,
         improvements = $14,
         updated_at = NOW()
       WHERE id = $15 AND user_id = $16`,
      [
        endedAt,
        durationSeconds,
        total_score,
        content_score,
        voice_score,
        audio_metrics?.avg_volume || 0,
        audio_metrics?.pause_count || 0,
        audio_metrics?.avg_pause_duration || 0,
        audio_metrics?.confidence_level || "medium",
        JSON.stringify(conversation),
        feedback,
        strengths || [],
        weaknesses || [],
        improvements || [],
        sessionId,
        userId,
      ]
    );

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// GET /api/interview/history - Lấy lịch sử phỏng vấn
router.get("/history", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const result = await query(
      `SELECT 
        i.id,
        i.started_at,
        i.ended_at,
        i.duration_seconds,
        i.total_score,
        i.content_score,
        i.voice_score,
        i.confidence_level,
        c.full_name as cv_name
       FROM interview_sessions i
       LEFT JOIN cvs c ON i.cv_id = c.id
       WHERE i.user_id = $1
       ORDER BY i.started_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// GET /api/interview/:id - Lấy chi tiết phiên phỏng vấn
router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const sessionId = req.params.id;

    const result = await query(
      `SELECT 
        i.*,
        c.full_name as cv_name
       FROM interview_sessions i
       LEFT JOIN cvs c ON i.cv_id = c.id
       WHERE i.id = $1 AND i.user_id = $2`,
      [sessionId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
