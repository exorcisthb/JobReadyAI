import bcrypt from "bcryptjs";
import { query } from "../config/database.js";

export class ChangePasswordController {
  static async change(request, response, next) {
    try {
      const userId = request.headers["x-user-id"];
      if (!userId) {
        return response.status(401).json({ error: "Unauthorized" });
      }

      const { current_password, new_password } = request.body;

      if (!current_password || !new_password) {
        return response.status(400).json({ error: "Missing required fields" });
      }

      if (new_password.length < 6) {
        return response.status(400).json({ error: "Mật khẩu mới phải có ít nhất 6 ký tự" });
      }

      // Get current user password hash
      const userResult = await query("SELECT password_hash FROM users WHERE id = $1", [userId]);
      if (!userResult.rows[0]) {
        return response.status(404).json({ error: "User not found" });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(current_password, userResult.rows[0].password_hash);
      if (!isValidPassword) {
        return response.status(400).json({ error: "Mật khẩu hiện tại không đúng" });
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(new_password, 10);

      // Update password
      await query("UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2", [
        newPasswordHash,
        userId,
      ]);

      response.json({
        success: true,
        message: "Đổi mật khẩu thành công",
      });
    } catch (error) {
      next(error);
    }
  }
}
