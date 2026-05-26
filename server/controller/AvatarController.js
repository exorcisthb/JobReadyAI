import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import { query } from "../config/database.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/avatars"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file hình ảnh"));
    }
  },
});

export class AvatarController {
  static async upload(req, res, next) {
    try {
      const userId = req.headers["x-user-id"];
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Không có file được upload" });
      }

      const avatarUrl = `/uploads/avatars/${req.file.filename}`;

      // Update user_profiles table
      await query(
        `UPDATE user_profiles SET avatar_url = $1, updated_at = NOW() WHERE user_id = $2`,
        [avatarUrl, userId]
      );

      // Also update users table if needed
      await query(
        `UPDATE users SET avatar_url = $1 WHERE id = $2`,
        [avatarUrl, userId]
      );

      res.json({
        success: true,
        message: "Cập nhật avatar thành công",
        avatar_url: avatarUrl,
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export multer middleware
export const uploadAvatar = upload.single("avatar");
