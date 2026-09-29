import express from "express";
import { query } from "../config/database.js";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { getUserPlanCached } from "../utils/userPlan.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// API Keys pool for Gemini rotation
const API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
].filter(Boolean);

const keyCooldowns = new Map();
const COOLDOWN_MS = 5_000;

function getAvailableKey() {
  const now = Date.now();
  for (const key of API_KEYS) {
    const cooldownUntil = keyCooldowns.get(key) || 0;
    if (now >= cooldownUntil) return key;
  }
  let soonestKey = API_KEYS[0];
  let soonestTime = Infinity;
  for (const key of API_KEYS) {
    const t = keyCooldowns.get(key) || 0;
    if (t < soonestTime) {
      soonestTime = t;
      soonestKey = key;
    }
  }
  return soonestKey;
}

function markKeyCooldown(key) {
  if (key) keyCooldowns.set(key, Date.now() + COOLDOWN_MS);
}

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

function generateFallbackQuestions(company, position, level, candidateName, cvText) {
  const comp = company || "Doanh nghiệp mục tiêu";
  const pos = position || "Vị trí ứng tuyển";
  const lvl = level || "Junior";

  return {
    candidate_name: candidateName || "Ứng viên",
    company: comp,
    position: pos,
    level: lvl,
    match_score: 88,
    match_analysis: `Hồ sơ có nhiều điểm chạm tiềm năng với vị trí ${pos} tại ${comp}. Cần tập trung làm nổi bật các dự án thực tế và kỹ năng giải quyết vấn đề.`,
    questions: [
      {
        id: 1,
        category: "Khởi động & Động lực",
        question: `Chào em, em hãy giới thiệu ngắn gọn về bản thân và chia sẻ lý do tại sao em lại quan tâm, mong muốn ứng tuyển vào vị trí ${pos} tại ${comp}?`,
        rationale: "Đánh giá khả năng tóm tắt background, sự tự tin và động lực thực sự khi lựa chọn doanh nghiệp.",
        tip: "Nêu 2-3 điểm nổi bật về kinh nghiệm/kỹ năng, liên hệ trực tiếp với định hướng hoặc sản phẩm của " + comp + "."
      },
      {
        id: 2,
        category: "Đào sâu dự án từ CV",
        question: `Trong CV của em có đề cập đến các dự án gần đây. Em hãy chọn ra một dự án tâm đắc nhất và phân tích vai trò cụ thể, thách thức lớn nhất mà em đã giải quyết thành công?`,
        rationale: "Xác thực tính trung thực của CV, kiểm tra chiều sâu đóng góp cá nhân thay vì chỉ là công việc của team.",
        tip: "Dùng khung STAR (Situation - Task - Action - Result), nêu rõ số liệu/kết quả thực tế đạt được."
      },
      {
        id: 3,
        category: "Chuyên môn & Kỹ thuật then chốt",
        question: `Với vị trí ${pos} ở cấp bậc ${lvl} tại ${comp}, khi thiết kế hoặc giải quyết một yêu cầu phức tạp, quy trình và các công cụ/nguyên lý công nghệ nào em ưu tiên áp dụng để đảm bảo chất lượng cao nhất?`,
        rationale: "Đo lường năng lực kỹ thuật cốt lõi, tư duy kiến trúc và mức độ chuẩn mực trong quy trình làm việc.",
        tip: "Phân tích tư duy logic, các trade-off (sự đánh đổi) và lý do lựa chọn giải pháp cụ thể."
      },
      {
        id: 4,
        category: "Tình huống thực tế chuẩn STAR",
        question: `Hãy chia sẻ về một tình huống khi em gặp phải sự cố kỹ thuật bất ngờ hoặc bất đồng ý kiến gay gắt với đồng nghiệp/khách hàng về giải pháp. Em đã xử lý như thế nào để đưa dự án về đích đúng hẹn?`,
        rationale: "Đánh giá trí tuệ cảm xúc (EQ), khả năng chịu áp lực và kỹ năng phối hợp liên chức năng.",
        tip: "Tập trung vào phần Action (Hành động chủ động của bạn) và Result (Bài học rút ra cùng sự đồng thuận của team)."
      },
      {
        id: 5,
        category: "Văn hóa doanh nghiệp & Cam kết",
        question: `Tại ${comp}, môi trường đòi hỏi sự chủ động cao và tốc độ thích nghi liên tục. Em kỳ vọng học hỏi được gì nhiều nhất trong 6 tháng đầu và mục tiêu phát triển nghề nghiệp của em ra sao?`,
        rationale: "Đánh giá Culture Fit (Độ hòa nhập văn hóa), tính cam kết gắn bó lâu dài và định hướng lộ trình thăng tiến.",
        tip: "Thể hiện tinh thần cầu tiến, thái độ ham học hỏi và sự chủ động cống hiến cho mục tiêu chung của công ty."
      }
    ]
  };
}

// POST /api/interview/generate-questions - Sinh bộ câu hỏi phỏng vấn chuẩn hóa dựa trên CV + Vị trí + Công ty
router.post("/generate-questions", requireAuth, aiLimiter, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { cv_id, company, position, level, model: selectedModel } = req.body;

    if (!cv_id) {
      return res.status(400).json({ error: "cv_id is required" });
    }

    const cvCheck = await query(
      `SELECT * FROM cvs WHERE id = $1 AND user_id = $2`,
      [cv_id, userId]
    );

    if (cvCheck.rows.length === 0) {
      return res.status(404).json({ error: "CV not found or does not belong to user" });
    }

    const cv = cvCheck.rows[0];
    let candidateName = cv.full_name || "";
    if (cv.type === "created" && cv.content) {
      try {
        const parsed = typeof cv.content === "string" ? JSON.parse(cv.content) : cv.content;
        candidateName = parsed.fullName || parsed.full_name || cv.full_name || "";
      } catch (_) {}
    }

    let cvText = cv.cv_text_cache?.trim() || "";
    if (!cvText || cvText.length < 200) {
      const { buildCvTextFromContent } = await import("./cv.js");
      cvText = buildCvTextFromContent(cv) || "";
    }

    const targetCompany = company?.trim() || "Doanh nghiệp mục tiêu";
    const targetPosition = position?.trim() || "Vị trí ứng tuyển";
    const targetLevel = level?.trim() || "Junior";

    // Try Gemini API
    const apiKey = getAvailableKey();
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const aiModel = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
          },
        });

        const prompt = `Bạn là Chuyên gia Tuyển dụng cấp cao (Senior HR Director & Tech Interviewer) tại ${targetCompany}.
Hãy phân tích hồ sơ CV của ứng viên dưới đây và kết hợp với vị trí "${targetPosition}" (Cấp bậc: ${targetLevel}) tại "${targetCompany}" để thiết kế một BỘ CÂU HỎI PHỎNG VẤN CHUYÊN BIỆT (Interview Question Blueprint) gồm đúng 5 câu hỏi trọng tâm.

HỒ SƠ CV CỦA ỨNG VIÊN (${candidateName || "Ứng viên"}):
---
${cvText.slice(0, 3500)}
---

YÊU CẦU:
1. Bộ câu hỏi PHẢI kết hợp chặt chẽ giữa:
   - Yêu cầu thực tế của vị trí "${targetPosition}" tại ${targetCompany}.
   - Các kỹ năng, dự án, công nghệ hoặc điểm mạnh/điểm yếu có trong CV thực tế của ứng viên.
2. Đúng 5 nhóm câu hỏi:
   - "Khởi động & Động lực" (Ice-breaking & Motivation)
   - "Đào sâu dự án từ CV" (CV & Project Deep Dive)
   - "Chuyên môn & Kỹ thuật then chốt" (Core Competency)
   - "Tình huống thực tế chuẩn STAR" (STAR Challenge)
   - "Văn hóa doanh nghiệp & Cam kết" (Company Culture Fit)
3. Cung cấp:
   - "id": số thứ tự từ 1 đến 5
   - "category": Tên nhóm câu hỏi
   - "question": Nội dung câu hỏi cụ thể, sắc sảo, tự nhiên như HR thật đang hỏi trực tiếp.
   - "rationale": Tại sao nhà tuyển dụng lại hỏi câu này (đối chiếu vị trí và CV).
   - "tip": Gợi ý cách trả lời chuẩn khung STAR hoặc từ khóa vàng cần nêu.

BẮT BUỘC TRẢ VỀ DƯỚI DẠNG JSON HỢP LỆ VỚI CẤU TRÚC SAU:
{
  "candidate_name": "${candidateName || "Ứng viên"}",
  "company": "${targetCompany}",
  "position": "${targetPosition}",
  "level": "${targetLevel}",
  "match_score": 88,
  "match_analysis": "Nhận xét ngắn gọn 1-2 câu về độ phù hợp giữa CV và vị trí ${targetPosition} tại ${targetCompany}.",
  "questions": [
    {
      "id": 1,
      "category": "Khởi động & Động lực",
      "question": "...",
      "rationale": "...",
      "tip": "..."
    }
  ]
}`;

        const result = await Promise.race([
          aiModel.generateContent(prompt),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout generating questions")), 12000)),
        ]);

        const rawText = result.response.text();
        const parsed = JSON.parse(rawText);
        if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
          return res.json({
            candidate_name: parsed.candidate_name || candidateName,
            company: targetCompany,
            position: targetPosition,
            level: targetLevel,
            match_score: parsed.match_score || 85,
            match_analysis: parsed.match_analysis || `Độ phù hợp tốt với vị trí ${targetPosition} tại ${targetCompany}.`,
            questions: parsed.questions,
            source: "gemini_ai",
          });
        }
      } catch (geminiError) {
        console.warn("Gemini question generation error, using smart fallback:", geminiError?.message);
        markKeyCooldown(apiKey);
      }
    }

    // Fallback generator
    const fallback = generateFallbackQuestions(targetCompany, targetPosition, targetLevel, candidateName, cvText);
    return res.json({
      ...fallback,
      source: "fallback_ai",
    });
  } catch (error) {
    console.error("Error in generate-questions:", error);
    next(error);
  }
});

// POST /api/interview/start - Bắt đầu phiên phỏng vấn
router.post("/start", requireAuth, aiLimiter, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { cv_id, company, position, model: selectedModel, level, questions } = req.body;

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
      [userId, cv_id, "voice", level || "junior", "in_progress", JSON.stringify([])]
    );

    res.json({
      session_id: result.rows[0].id,
      started_at: result.rows[0].started_at,
      cv_text: cvText,
      candidate_name: candidateName,
      company: company || "",
      position: position || "",
      level: level || "junior",
      model: selectedModel || "gemini-2.5-flash",
      questions: questions || [],
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
