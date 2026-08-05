import bcrypt from "bcryptjs";
import { query } from "../config/database.js";

export class ChangePasswordController {
  /**
   * POST /api/auth/change-password/verify-old
   * Body: { old_password }
   * Header: x-user-id
   */
  static async verifyOldPassword(request, response, next) {
    try {
      const userId = request.headers["x-user-id"];
      if (!userId) {
        return response.status(401).json({ error: "Unauthorized" });
      }

      const { old_password } = request.body;

      if (!old_password) {
        return response.status(400).json({ error: "Vui lòng nhập mật khẩu hiện tại" });
      }

      const userResult = await query(
        "SELECT password_hash, auth_provider FROM users WHERE id = $1",
        [userId]
      );
      if (!userResult.rows[0]) {
        return response.status(404).json({ error: "Không tìm thấy tài khoản" });
      }

      const { password_hash, auth_provider } = userResult.rows[0];

      if (auth_provider === "google" || auth_provider === "facebook") {
        return response.status(400).json({
          error: "Tài khoản đăng nhập bằng Google / Facebook không sử dụng mật khẩu.",
        });
      }

      if (!password_hash) {
        return response.status(400).json({ error: "Tài khoản này chưa thiết lập mật khẩu" });
      }

      const isOldCorrect = await bcrypt.compare(old_password, password_hash);
      if (!isOldCorrect) {
        return response.status(400).json({ error: "Mật khẩu hiện tại không đúng" });
      }

      response.json({ success: true, message: "Mật khẩu hiện tại chính xác" });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/auth/change-password
   * Body: { old_password, new_password }
   * Header: x-user-id
   */
  static async change(request, response, next) {
    try {
      const userId = request.headers["x-user-id"];
      if (!userId) {
        return response.status(401).json({ error: "Unauthorized" });
      }

      const { old_password, new_password } = request.body;

      if (!old_password || !new_password) {
        return response.status(400).json({ error: "Thiếu mật khẩu cũ hoặc mật khẩu mới" });
      }

      if (new_password.length < 6) {
        return response.status(400).json({ error: "Mật khẩu mới phải có ít nhất 6 ký tự" });
      }

      // Get current password hash
      const userResult = await query(
        "SELECT password_hash, auth_provider FROM users WHERE id = $1",
        [userId]
      );
      if (!userResult.rows[0]) {
        return response.status(404).json({ error: "Không tìm thấy tài khoản" });
      }

      const { password_hash, auth_provider } = userResult.rows[0];

      // Block OAuth accounts
      if (auth_provider === "google" || auth_provider === "facebook") {
        return response.status(400).json({
          error: "Tài khoản đăng nhập bằng Google / Facebook không sử dụng mật khẩu.",
        });
      }

      if (!password_hash) {
        return response.status(400).json({ error: "Tài khoản này chưa có mật khẩu" });
      }

      // Verify old password again for safety
      const isOldCorrect = await bcrypt.compare(old_password, password_hash);
      if (!isOldCorrect) {
        return response.status(400).json({ error: "Mật khẩu hiện tại không đúng" });
      }

      // Ensure new password differs
      const isSame = await bcrypt.compare(new_password, password_hash);
      if (isSame) {
        return response.status(400).json({ error: "Mật khẩu mới phải khác mật khẩu hiện tại" });
      }

      // Hash & save
      const newHash = await bcrypt.hash(new_password, 10);
      await query(
        "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2",
        [newHash, userId]
      );

      response.json({ success: true, message: "Đổi mật khẩu thành công" });
    } catch (error) {
      next(error);
    }
  }
}
