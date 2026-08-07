import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import { query } from "../config/database.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { uploadToS3 } from "../utils/s3.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure uploads directory exists (local fallback when S3 is not configured)
const uploadsDir = path.join(__dirname, "../../uploads/avatars");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`[AvatarController] Created uploads directory: ${uploadsDir}`);
}

// Buffered in memory, then uploaded to S3 (or written to disk as fallback).
const storage = multer.memoryStorage();

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

      // Persist avatar: S3 when configured, else local disk fallback.
      let avatarUrl;
      const s3Url = await uploadToS3({
        buffer: req.file.buffer,
        contentType: req.file.mimetype,
        ext: req.file.originalname,
      });
      if (s3Url) {
        avatarUrl = s3Url;
      } else {
        const filename = `${randomUUID()}${path.extname(req.file.originalname)}`;
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, req.file.buffer);
        avatarUrl = `/uploads/avatars/${filename}`;
      }
      console.log(`[AvatarController] Uploaded file: ${req.file.originalname}`);
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
        // file_path intentionally omitted: server-side filesystem path
        // must not be disclosed to clients (information disclosure).
      });
    } catch (error) {
      next(error);
    }
  }
}

// Export multer middleware
export const uploadAvatar = upload.single("avatar");
