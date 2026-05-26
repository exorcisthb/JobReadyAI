import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import { query } from "../config/database.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads/avatars");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`[AvatarController] Created uploads directory: ${uploadsDir}`);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`[AvatarController] Saving to: ${uploadsDir}`);
    cb(null, uploadsDir);
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
      console.log(`[AvatarController] Uploaded file: ${req.file.path}`);
      console.log(`[AvatarController] Avatar URL: ${avatarUrl}`);

      // Check if user_profiles exists (table may not have 'id' column)
      let profileExists = false;
      try {
        const profileCheck = await query(
          "SELECT 1 FROM user_profiles WHERE user_id = $1 LIMIT 1",
          [userId]
        );
        profileExists = profileCheck.rows.length > 0;
      } catch (e) {
        // Table might not have proper structure, try INSERT
      }

      if (profileExists) {
        // Update existing profile
        await query(
          `UPDATE user_profiles SET avatar_url = $1, updated_at = NOW() WHERE user_id = $2`,
          [avatarUrl, userId]
        );
      } else {
        // Create new profile with avatar (ignore if table doesn't exist)
        try {
          await query(
            `INSERT INTO user_profiles (user_id, avatar_url, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())`,
            [userId, avatarUrl]
          );
        } catch (insertError) {
          console.log("[AvatarController] Could not insert to user_profiles:", insertError.message);
        }
      }

      res.json({
        success: true,
        message: "Cập nhật avatar thành công",
        avatar_url: avatarUrl,
        file_path: req.file.path,
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export multer middleware
export const uploadAvatar = upload.single("avatar");
