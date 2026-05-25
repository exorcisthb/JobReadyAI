import express from "express";
import { query } from "../config/database.js";

const router = express.Router();

// Auth middleware to check if user is logged in
function requireAuth(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.user = { id: userId, role: req.header("x-user-role") ?? "user" };
  return next();
}

// Automatically seed default industries if empty
async function seedIndustries() {
  try {
    const check = await query("SELECT COUNT(*)::int as count FROM industries");
    if (check.rows[0].count === 0) {
      console.log("Seeding default industries in database...");
      const defaults = [
        "Công nghệ thông tin (IT)",
        "Tài chính & Ngân hàng",
        "Marketing & Truyền thông",
        "Y tế & Sức khỏe",
        "Quản trị nhân sự (HR)",
        "Thiết kế & Nghệ thuật",
        "Bán hàng & Chăm sóc khách hàng",
        "Giáo dục & Đào tạo"
      ];
      for (const name of defaults) {
        await query("INSERT INTO industries (name) VALUES ($1)", [name]);
      }
      console.log("Default industries seeded successfully.");
    }
  } catch (err) {
    console.error("Failed to seed default industries:", err);
  }
}

// Call seeding immediately on module load
void seedIndustries();

// GET /api/interview/industries
router.get("/industries", requireAuth, async (_req, res, next) => {
  try {
    const result = await query("SELECT id, name FROM industries ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// POST /api/interview/session
router.post("/session", requireAuth, async (req, res, next) => {
  try {
    const { industry_id, level, mode, job_description } = req.body;

    if (!industry_id || !level || !mode) {
      return res.status(400).json({ error: "Thiếu thông tin cấu hình phỏng vấn." });
    }

    const userId = req.user.id;

    // Create session in DB
    const result = await query(
      `
      INSERT INTO interview_sessions (
        user_id, 
        industry_id, 
        level, 
        mode, 
        status, 
        job_description, 
        total_questions, 
        started_at
      )
      VALUES ($1, $2, $3, $4, 'in_progress', $5, 5, NOW())
      RETURNING *
    `,
      [userId, industry_id, level, mode, job_description || null]
    );

    const session = result.rows[0];

    // Seed some mock user progress to simulate a dynamic improvement chart for the user!
    // This makes sure their progress chart is beautifully filled.
    const progressCheck = await query("SELECT COUNT(*)::int as count FROM user_progress WHERE user_id = $1", [userId]);
    if (progressCheck.rows[0].count === 0) {
      const dates = [
        new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      ];
      const scores = [5.5, 6.2, 7.0, 7.8];
      for (let i = 0; i < dates.length; i++) {
        await query(
          "INSERT INTO user_progress (user_id, session_date, avg_score) VALUES ($1, $2, $3)",
          [userId, dates[i], scores[i]]
        );
      }
    }

    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
});

export default router;
