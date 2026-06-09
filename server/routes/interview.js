import express from "express";
import { query } from "../config/database.js";

const router = express.Router();

// Auth middleware
function requireAuth(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.user = { id: userId, role: req.header("x-user-role") ?? "user" };
  return next();
}

// POST /api/interview/start - Bắt đầu phiên phỏng vấn
router.post("/start", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { cv_id } = req.body;

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
    } = req.body;

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
