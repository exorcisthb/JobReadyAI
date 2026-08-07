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

// ─── Interview Limits ──────────────────────────────────────────────────────
// Pro has different limits per billing cycle: 5/week (weekly) or 25/month (monthly).
// Ultra is unlimited. Free is 2/week.

const PLAN_LIMITS = {
  free: { weekly: 2 },
  pro_interview: { weekly: 5, monthly: 25 },
  ultra_interview: { weekly: Infinity, monthly: Infinity },
  pro: { weekly: 5, monthly: 25 },
  ultra: { weekly: Infinity, monthly: Infinity },
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

function getMonthStart() {
  const now = new Date();
  const first = new Date(now);
  first.setUTCDate(1);
  first.setUTCHours(0, 0, 0, 0);
  return first;
}

function getNextMonthStart() {
  const now = new Date();
  const next = new Date(now);
  next.setUTCDate(1);
  next.setUTCMonth(next.getUTCMonth() + 1);
  next.setUTCHours(0, 0, 0, 0);
  return next;
}

// Resolve effective plan + billing cycle (weekly/monthly) for a user.
// Cycle is inferred from the active subscription duration (≤8 days = weekly).
async function getUserPlan(userId) {
  const user = await getUserPlanCached(userId);
  if (!user) return { plan: "free", cycle: "weekly" };

  let plan = user.sub_plan_interview || "free";
  let expires = user.sub_expires_interview;

  if (plan === "free" && user.subscription_plan && user.subscription_plan !== "free") {
    plan = user.subscription_plan === "pro" ? "pro_interview" : "ultra_interview";
    expires = user.subscription_expires_at;
  }

  if (plan !== "free" && expires && new Date(expires) < new Date()) {
    return { plan: "free", cycle: "weekly" };
  }

  let cycle = "weekly";
  if (plan !== "free") {
    const subResult = await query(
      `SELECT started_at, expires_at FROM user_subscriptions
       WHERE user_id = $1 AND plan IN ('pro_interview', 'ultra_interview') AND status = 'active'
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );
    if (subResult.rows.length > 0) {
      const sub = subResult.rows[0];
      const durationDays = sub.expires_at && sub.started_at
        ? Math.round((new Date(sub.expires_at) - new Date(sub.started_at)) / (1000 * 60 * 60 * 24))
        : 30;
      cycle = durationDays <= 8 ? "weekly" : "monthly";
    }
  }

  return { plan, cycle };
}

function getCycleStart(cycle) {
  return cycle === "monthly" ? getMonthStart() : getWeekStart();
}

function getNextCycleStart(cycle) {
  return cycle === "monthly" ? getNextMonthStart() : getNextWeekStart();
}

async function countSessionsSince(userId, since) {
  const result = await query(
    `SELECT COUNT(*) as count FROM interview_sessions
     WHERE user_id = $1 AND created_at >= $2
       AND status = 'completed'`,
    [userId, since]
  );
  return parseInt(result.rows[0].count, 10) || 0;
}

// GET /api/interview/quota — Trả về số lượt còn lại trong chu kỳ
router.get("/quota", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { plan, cycle } = await getUserPlan(userId);
    const cycleStart = getCycleStart(cycle);
    const nextCycleStart = getNextCycleStart(cycle);
    const used = await countSessionsSince(userId, cycleStart);
    const limit = PLAN_LIMITS[plan]?.[cycle] ?? 2;

    res.json({
      used,
      limit: limit === Infinity ? "unlimited" : limit,
      remaining: limit === Infinity ? "unlimited" : Math.max(0, limit - used),
      plan,
      cycle,
      reset_at: nextCycleStart.toISOString(),
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

    // Check interview limit
    const { plan, cycle } = await getUserPlan(userId);
    const cycleStart = getCycleStart(cycle);
    const used = await countSessionsSince(userId, cycleStart);
    const limit = PLAN_LIMITS[plan]?.[cycle] ?? 2;

    if (used >= limit) {
      const nextCycleStart = getNextCycleStart(cycle);
      return res.status(429).json({
        error: "interview_limit_reached",
        message: `Bạn đã dùng hết ${limit} lượt phỏng vấn trong ${cycle === "monthly" ? "tháng" : "tuần"} này. Nâng cấp lên Ultra để không giới hạn.`,
        used,
        limit: limit === Infinity ? "unlimited" : limit,
        reset_at: nextCycleStart.toISOString(),
        plan,
        cycle,
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
