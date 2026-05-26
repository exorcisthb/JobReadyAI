import bcrypt from "bcryptjs";
import { query } from "../config/database.js";
import nodemailer from "nodemailer";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isGmailConfigured() {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export class ChangePasswordController {
  static async verifyOTP(request, response, next) {
    try {
      const userId = request.headers["x-user-id"];
      if (!userId) {
        return response.status(401).json({ error: "Unauthorized" });
      }

      const { otp } = request.body;

      if (!otp) {
        return response.status(400).json({ error: "Missing OTP" });
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

      // Send email with OTP
      if (!isGmailConfigured()) {
        console.log(
          `\n[ChangePassword] OTP cho ${email}: ${otp}`,
        );
      } else {
        const appName = "JobReadyAI";
        const htmlBody = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác minh đổi mật khẩu</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1 0%,#4f46e5 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">${appName}</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Yêu cầu đổi mật khẩu</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 24px;color:#374151;font-size:16px;line-height:1.6;">
                Xin chào,<br>
                Bạn đã yêu cầu đổi mật khẩu. Vui lòng sử dụng mã OTP bên dưới:
              </p>
              <div style="background:#f0f0ff;border:2px dashed #6366f1;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
                <p style="margin:0 0 8px;color:#6b7280;font-size:13px;text-transform:uppercase;">Mã xác minh</p>
                <p style="margin:0;font-size:40px;font-weight:800;letter-spacing:12px;color:#4f46e5;font-family:'Courier New',monospace;">${otp}</p>
              </div>
              <p style="margin:0 0 16px;color:#6b7280;font-size:14px;">
                ⏱️ Mã có hiệu lực trong <strong>5 phút</strong>.<br>
                🔒 Không chia sẻ mã này với bất kỳ ai.
              </p>
              <p style="margin:0;color:#9ca3af;font-size:13px;">
                Nếu bạn không yêu cầu đổi mật khẩu, hãy bỏ qua email này.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                © 2025 ${appName}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

        const transporter = createTransporter();
        await transporter.sendMail({
          from: `"${appName}" <${process.env.SMTP_USER}>`,
          to: email,
          subject: `[${appName}] Mã xác minh đổi mật khẩu: ${otp}`,
          html: htmlBody,
        });
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
