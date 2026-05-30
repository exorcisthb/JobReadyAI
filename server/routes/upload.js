import express from "express";
import multer from "multer";
import { query } from "../config/database.js";

const router = express.Router();

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, "../../uploads");

// Tạo thư mục uploads nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Tăng lên 10MB khớp với FE
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/jpg",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file PDF hoặc hình ảnh (JPG, PNG, GIF, WEBP)"));
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
      `SELECT id, title, file_name, file_size, file_url, uploaded_at, type, file_type FROM cvs WHERE user_id = $1 ORDER BY uploaded_at DESC`,
      [req.user.id]
    );
    res.json({ cvs: result.rows });
  } catch (error) {
    next(error);
  }
});

router.post("/cv", requireAuth, upload.single("file"), async (req, res, next) => {
  try {
    // Check if this is JSON (CV Builder) - no file uploaded
    const contentType = req.header("Content-Type") || "";
    
    if (!req.file && contentType.includes("application/json")) {
      // CV Builder - JSON payload
      const { title, template_id, content, type } = req.body;
      
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const result = await query(
        `INSERT INTO cvs (user_id, title, file_name, file_size, file_url, uploaded_at, type, content, template_id) 
         VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7, $8) 
         RETURNING id, title, file_name, file_size, file_url, uploaded_at, type, content, template_id`,
        [req.user.id, title, content?.fullName ? `${content.fullName}-CV.json` : "CV.json", 0, null, type || "created", content ? JSON.stringify(content) : null, template_id]
      );
      res.status(201).json({ success: true, cv: result.rows[0], message: "CV saved successfully" });
    } else if (!req.file) {
      // File upload without file
      return res.status(400).json({ error: "No file uploaded" });
    } else {
      // File upload with multer
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const fileUrl = `/uploads/${req.file.filename}`;

      const result = await query(
        `INSERT INTO cvs (user_id, title, file_name, file_size, file_url, uploaded_at, type, file_type) 
         VALUES ($1, $2, $3, $4, $5, NOW(), 'uploaded', $6) 
         RETURNING id, title, file_name, file_size, file_url, uploaded_at, type, file_type`,
        [req.user.id, title, req.file.originalname, req.file.size, fileUrl, req.file.mimetype]
      );
      res.status(201).json({ success: true, cv: result.rows[0], message: "CV uploaded successfully" });
    }
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
