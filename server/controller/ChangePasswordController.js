import bcrypt from "bcryptjs";
import { query } from "../config/database.js";
import { sendOtpEmail } from "../service/EmailService.js";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export class ChangePasswordController {
  static async verifyOTP(request, response, next) {
    try {
      const userId = request.headers["x-user-id"];
      console.log(`[ChangePassword] verifyOTP - userId from header: ${userId}`);

      if (!userId) {
        return response.status(401).json({ error: "Unauthorized" });
      }

      const { otp } = request.body;
      console.log(`[ChangePassword] verifyOTP - received OTP: ${otp}`);

      if (!otp) {
        return response.status(400).json({ error: "Missing OTP" });
      }

      // Check what OTP is in DB
      const checkResult = await query(
        `SELECT user_id, otp, expires_at FROM password_reset_otps WHERE user_id = $1`,
        [userId]
      );
      console.log(`[ChangePassword] verifyOTP - DB record:`, checkResult.rows[0]);

      // Verify OTP
      const otpResult = await query(
        `SELECT * FROM password_reset_otps 
         WHERE user_id = $1 AND otp = $2 AND expires_at > NOW()
         ORDER BY created_at DESC LIMIT 1`,
        [userId, otp]
      );

      if (!otpResult.rows[0]) {
        return response.status(400).json({ error: "Mã OTP không hợp lệ hoặc đã hết hạn" });
      }

      response.json({
        success: true,
        message: "OTP hợp lệ",
      });
    } catch (error) {
      next(error);
    }
  }

  static async sendOTP(request, response, next) {
    try {
      const userId = request.headers["x-user-id"];
      if (!userId) {
        return response.status(401).json({ error: "Unauthorized" });
      }

      // Get user email
      const userResult = await query("SELECT email FROM users WHERE id = $1", [userId]);
      if (!userResult.rows[0]) {
        return response.status(404).json({ error: "User not found" });
      }

      const user = userResult.rows[0];
      const email = user.email;

      // Generate OTP
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Save OTP to database
      await query(
        `INSERT INTO password_reset_otps (user_id, otp, expires_at, created_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id) DO UPDATE SET
           otp = $2,
           expires_at = $3,
           created_at = NOW()`,
        [userId, otp, expiresAt]
      );

      // Send email with OTP via EmailService
      const emailResult = await sendOtpEmail(email, otp);

      if (emailResult.error) {
        console.error(`[ChangePassword] Lỗi gửi OTP: ${emailResult.error}`);
        return response.status(500).json({ error: emailResult.error });
      }

      response.json({
        success: true,
        message: "Mã OTP đã được gửi đến email của bạn",
      });
    } catch (error) {
      next(error);
    }
  }

  static async change(request, response, next) {
    try {
      const userId = request.headers["x-user-id"];
      if (!userId) {
        return response.status(401).json({ error: "Unauthorized" });
      }

      const { otp, new_password } = request.body;

      if (!otp || !new_password) {
        return response.status(400).json({ error: "Missing required fields" });
      }

      if (new_password.length < 6) {
        return response.status(400).json({ error: "Mật khẩu mới phải có ít nhất 6 ký tự" });
      }

      // Verify OTP
      const otpResult = await query(
        `SELECT * FROM password_reset_otps 
         WHERE user_id = $1 AND otp = $2 AND expires_at > NOW()
         ORDER BY created_at DESC LIMIT 1`,
        [userId, otp]
      );

      if (!otpResult.rows[0]) {
        return response.status(400).json({ error: "Mã OTP không hợp lệ hoặc đã hết hạn" });
      }

      // Get current user password hash to compare
      const userResult = await query("SELECT password_hash FROM users WHERE id = $1", [userId]);
      if (!userResult.rows[0]) {
        return response.status(404).json({ error: "User not found" });
      }

      // Check if new password is same as current password (only if user has a password)
      const currentPasswordHash = userResult.rows[0].password_hash;
      if (currentPasswordHash) {
        const isSamePassword = await bcrypt.compare(new_password, currentPasswordHash);
        if (isSamePassword) {
          return response.status(400).json({ error: "Mật khẩu mới phải khác mật khẩu hiện tại" });
        }
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(new_password, 10);

      // Update password
      await query("UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2", [
        newPasswordHash,
        userId,
      ]);

      // Delete used OTP
      await query("DELETE FROM password_reset_otps WHERE user_id = $1", [userId]);

      response.json({
        success: true,
        message: "Đổi mật khẩu thành công",
      });
    } catch (error) {
      next(error);
    }
  }
}
