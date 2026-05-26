import express from "express";
import multer from "multer";
import { query } from "../config/database.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, DOCX allowed"));
    }
  },
});

function requireAuth(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.user = { id: userId, role: req.header("x-user-role") ?? "user" };
  return next();
}

router.get("/cv", requireAuth, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, title, file_name, file_size, uploaded_at FROM cvs WHERE user_id = $1 ORDER BY uploaded_at DESC`,
      [req.user.id]
    );
    res.json({ cvs: result.rows });
  } catch (error) {
    next(error);
  }
});

router.post("/cv", requireAuth, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const result = await query(
      `INSERT INTO cvs (user_id, title, file_name, file_size, uploaded_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, title, file_name, file_size, uploaded_at`,
      [req.user.id, title, req.file.originalname, req.file.size]
    );
    res.status(201).json({ success: true, cv: result.rows[0], message: "CV uploaded successfully" });
  } catch (error) {
    next(error);
  }
});

router.delete("/cv/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(`DELETE FROM cvs WHERE id = $1 AND user_id = $2 RETURNING id`, [id, req.user.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ error: "CV not found" });
    }
    res.json({ success: true, message: "CV deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
