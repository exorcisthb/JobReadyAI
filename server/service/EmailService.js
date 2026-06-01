/**
 * EmailService - Gửi OTP qua email bằng Nodemailer (Gmail SMTP)
 *
 * Yêu cầu cấu hình trong .env.local:
 *   SMTP_USER - Địa chỉ Gmail của bạn (vd: yourmail@gmail.com)
 *   SMTP_PASS - Mật khẩu ứng dụng (App Password) 16 ký tự từ Google
 *
 * Cách tạo App Password:
 *   1. Vào https://myaccount.google.com/security
 *   2. Bật "Xác minh 2 bước"
 *   3. Tìm "Mật khẩu ứng dụng" và tạo mới
 *
 * DEV MODE (chưa cấu hình): OTP sẽ log ra console, không gửi email thật
 */

import nodemailer from "nodemailer";

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

/**
 * Gửi email OTP đến người dùng
 * @param {string} email - Email người nhận
 * @param {string} otp - Mã OTP 6 chữ số
 * @returns {Promise<{ success: boolean, devMode?: boolean, error?: string }>}
 */
export async function sendOtpEmail(email, otp) {
  // ── DEV MODE ──
  if (!isGmailConfigured()) {
    console.log(
      `\n[EmailService] ⚠️  DEV MODE - Gmail chưa được cấu hình.` +
        `\n[EmailService] 📧 OTP cho ${email}: ${otp}` +
        `\n[EmailService] Điền SMTP_USER và SMTP_PASS (App Password) vào .env.local để gửi email thật.\n`,
    );
    return { success: true, devMode: true };
  }

  // ── PRODUCTION MODE ──
  const appName = "JobReady AI";

  const htmlBody = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mã xác thực OTP</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1 0%,#4f46e5 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">${appName}</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Xác thực tài khoản của bạn</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 24px;color:#374151;font-size:16px;line-height:1.6;">
                Xin chào,<br>
                Đây là mã OTP để xác thực tài khoản <strong>${appName}</strong> của bạn:
              </p>
              <!-- OTP Box -->
              <div style="background:#f0f0ff;border:2px dashed #6366f1;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
                <p style="margin:0 0 8px;color:#6b7280;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Mã xác thực</p>
                <p style="margin:0;font-size:40px;font-weight:800;letter-spacing:12px;color:#4f46e5;font-family:'Courier New',monospace;">${otp}</p>
              </div>
              <p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6;">
                ⏱️ Mã có hiệu lực trong <strong>10 phút</strong>.<br>
                🔒 Không chia sẻ mã này với bất kỳ ai.
              </p>
              <p style="margin:0;color:#9ca3af;font-size:13px;">
                Nếu bạn không yêu cầu mã này, hãy bỏ qua email này.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                © 2025 ${appName}. Mọi quyền được bảo lưu.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"${appName}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `[${appName}] Mã OTP xác thực tài khoản: ${otp}`,
      html: htmlBody,
    });

    console.log(`[EmailService] ✅ Đã gửi OTP đến ${email} (MessageID: ${info.messageId})`);
    return { success: true };
  } catch (err) {
    console.error("[EmailService] ❌ Lỗi gửi email:", err.message);
    return { success: false, error: `Không thể gửi email: ${err.message}` };
  }
}

/**
 * Gửi email nhắc nhở luyện tập định kỳ
 * @param {string} email - Email người nhận
 * @param {string} userName - Tên người nhận
 * @param {string} reminderTitle - Tiêu đề nhắc nhở
 * @param {string} reminderDescription - Mô tả nhắc nhở
 * @param {string} targetTime - Giờ hẹn nhắc nhở (HH:MM)
 * @returns {Promise<{ success: boolean, devMode?: boolean, error?: string }>}
 */
export async function sendReminderEmail(email, userName, reminderTitle, reminderDescription, targetTime) {
  // ── DEV MODE ──
  if (!isGmailConfigured()) {
    console.log(
      `\n[EmailService] ⚠️  DEV MODE - Gmail chưa được cấu hình.` +
      `\n[EmailService] 📧 Nhắc nhở gửi đến ${email} (${userName || "Thành viên"}): "${reminderTitle}" lúc ${targetTime}\n`
    );
    return { success: true, devMode: true };
  }

  const appName = "JobReady AI";
  const displayName = userName || "Thành viên";
  
  const htmlBody = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lịch nhắc luyện tập định kỳ</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1 0%,#4f46e5 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">${appName}</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Lịch nhắc luyện tập & chuẩn bị sự nghiệp</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.6;font-weight:600;">
                Xin chào ${displayName},
              </p>
              <p style="margin:0 0 24px;color:#4b5563;font-size:15px;line-height:1.6;">
                Đã đến thời gian luyện tập theo lịch nhắc của bạn! Hãy dành ít phút để nâng cao kỹ năng và chuẩn bị sẵn sàng cho các cơ hội nghề nghiệp tiếp theo.
              </p>
              <!-- Reminder Info Box -->
              <div style="background:#f5f3ff;border-left:4px solid #6366f1;border-radius:8px;padding:20px;margin:0 0 28px;">
                <h3 style="margin:0 0 8px;color:#1e1b4b;font-size:16px;font-weight:700;">🔔 ${reminderTitle}</h3>
                ${reminderDescription ? `<p style="margin:0 0 12px;color:#4f46e5;font-size:14px;line-height:1.5;font-style:italic;">"${reminderDescription}"</p>` : ""}
                <p style="margin:0;color:#6b7280;font-size:13px;">⏰ Giờ hẹn nhắc: <strong>${targetTime}</strong></p>
              </div>
              
              <!-- Call to Actions -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td align="center">
                    <a href="http://localhost:3000/interview/config" style="display:inline-block;padding:12px 28px;background:#6366f1;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:10px;box-shadow:0 4px 12px rgba(99,102,241,0.25);">
                      Bắt đầu phỏng vấn ngay
                    </a>
                  </td>
                </tr>
              </table>

              <div style="border-top:1px solid #f3f4f6;padding-top:20px;margin-top:20px;">
                <p style="margin:0 0 8px;color:#6b7280;font-size:13px;line-height:1.5;">💡 <strong>Gợi ý hoạt động hôm nay:</strong></p>
                <ul style="margin:0;padding-left:20px;color:#4b5563;font-size:13px;line-height:1.6;">
                  <li style="margin-bottom:6px;">Luyện trả lời các câu hỏi phỏng vấn thường gặp.</li>
                  <li style="margin-bottom:6px;">Kiểm tra và tối ưu hóa CV của bạn chuẩn ATS.</li>
                  <li>Đọc các bài viết chia sẻ kinh nghiệm trên Blog Career.</li>
                </ul>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                © 2026 ${appName}. Mọi quyền được bảo lưu.
              </p>
              <p style="margin:6px 0 0;color:#d1d5db;font-size:11px;">
                Bạn nhận được email này vì đã cài đặt lịch nhắc luyện tập định kỳ trên hệ thống.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"${appName}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `[${appName}] Nhắc nhở luyện tập: ${reminderTitle}`,
      html: htmlBody,
    });

    console.log(`[EmailService] ✅ Đã gửi nhắc nhở đến ${email} (MessageID: ${info.messageId})`);
    return { success: true };
  } catch (err) {
    console.error("[EmailService] ❌ Lỗi gửi email nhắc nhở:", err.message);
    return { success: false, error: `Không thể gửi email: ${err.message}` };
  }
}

