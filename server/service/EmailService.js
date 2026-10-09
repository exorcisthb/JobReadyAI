/**
 * EmailService - Gửi email qua Brevo HTTP API (fetch)
 *
 * Yêu cầu cấu hình trong .env.local:
 *   BREVO_API_KEY    - API key từ Brevo (https://app.brevo.com/settings/keys/api)
 *   BREVO_FROM_EMAIL - Email người gửi đã được verify trên Brevo
 *
 * DEV MODE (chưa cấu hình): log ra console, không gửi email thật
 */

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const appName = "JobReady AI";

function isBrevoConfigured() {
  return !!process.env.BREVO_API_KEY;
}

async function sendBrevoEmail({ to, subject, html }) {
  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: appName, email: process.env.BREVO_FROM_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.message || `HTTP ${response.status}`);
  }

  return body;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

export async function sendSupportEmail({ category, subject, message, senderName, senderEmail, userId }) {
  if (!isBrevoConfigured() || !process.env.BREVO_FROM_EMAIL) {
    throw new Error("Email service is not configured");
  }

  const safe = {
    category: escapeHtml(category),
    subject: escapeHtml(subject),
    message: escapeHtml(message).replace(/\r?\n/g, "<br>"),
    senderName: escapeHtml(senderName || "Người dùng JobReady AI"),
    senderEmail: escapeHtml(senderEmail || "Không cung cấp"),
    userId: escapeHtml(userId),
  };

  return sendBrevoEmail({
    to: "admin@jobreadyai.vn",
    subject: `[JobReady AI · ${category}] ${subject}`,
    html: `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"></head><body style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.6"><h2>Yêu cầu hỗ trợ JobReady AI</h2><p><strong>Loại:</strong> ${safe.category}</p><p><strong>Tiêu đề:</strong> ${safe.subject}</p><p><strong>Người gửi:</strong> ${safe.senderName} (${safe.senderEmail})</p><p><strong>User ID:</strong> ${safe.userId}</p><hr><p>${safe.message}</p></body></html>`,
  });
}

/**
 * Gửi email OTP đến người dùng
 * @param {string} email - Email người nhận
 * @param {string} otp - Mã OTP 6 chữ số
 * @returns {Promise<{ success: boolean, devMode?: boolean, error?: string }>}
 */
export async function sendOtpEmail(email, otp) {
  if (!isBrevoConfigured()) {
    console.log(
      `\n[EmailService] DEV MODE - Brevo chưa được cấu hình.` +
        `\n[EmailService] OTP cho ${email}: ${otp}` +
        `\n[EmailService] Thêm BREVO_API_KEY vào .env.local để gửi email thật.\n`,
    );
    return { success: true, devMode: true };
  }

  const html = `
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
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1 0%,#4f46e5 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">${appName}</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Xác thực tài khoản của bạn</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 24px;color:#374151;font-size:16px;line-height:1.6;">
                Xin chào,<br>
                Đây là mã OTP để xác thực tài khoản <strong>${appName}</strong> của bạn:
              </p>
              <div style="background:#f0f0ff;border:2px dashed #6366f1;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
                <p style="margin:0 0 8px;color:#6b7280;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Mã xác thực</p>
                <p style="margin:0;font-size:40px;font-weight:800;letter-spacing:12px;color:#4f46e5;font-family:'Courier New',monospace;">${otp}</p>
              </div>
              <p style="margin:0 0 16px;color:#6b7280;font-size:14px;line-height:1.6;">
                Mã có hiệu lực trong <strong>10 phút</strong>.<br>
                Không chia sẻ mã này với bất kỳ ai.
              </p>
              <p style="margin:0;color:#9ca3af;font-size:13px;">
                Nếu bạn không yêu cầu mã này, hãy bỏ qua email này.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                &copy; 2025 ${appName}. Mọi quyền được bảo lưu.
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
    const result = await sendBrevoEmail({
      to: email,
      subject: `[${appName}] Mã OTP xác thực tài khoản: ${otp}`,
      html,
    });

    console.log(`[EmailService] Đã gửi OTP đến ${email} (MessageID: ${result.messageId})`);
    return { success: true };
  } catch (err) {
    console.error("[EmailService] Lỗi gửi email:", err.message);
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
  if (!isBrevoConfigured()) {
    console.log(
      `\n[EmailService] DEV MODE - Brevo chưa được cấu hình.` +
      `\n[EmailService] Nhắc nhở gửi đến ${email} (${userName || "Thành viên"}): "${reminderTitle}" lúc ${targetTime}\n`
    );
    return { success: true, devMode: true };
  }

  const displayName = userName || "Thành viên";

  const html = `
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
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1 0%,#4f46e5 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">${appName}</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Lịch nhắc luyện tập & chuẩn bị sự nghiệp</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.6;font-weight:600;">
                Xin chào ${displayName},
              </p>
              <p style="margin:0 0 24px;color:#4b5563;font-size:15px;line-height:1.6;">
                Đã đến thời gian luyện tập theo lịch nhắc của bạn! Hãy dành ít phút để nâng cao kỹ năng và chuẩn bị sẵn sàng cho các cơ hội nghề nghiệp tiếp theo.
              </p>
              <div style="background:#f5f3ff;border-left:4px solid #6366f1;border-radius:8px;padding:20px;margin:0 0 28px;">
                <h3 style="margin:0 0 8px;color:#1e1b4b;font-size:16px;font-weight:700;">${reminderTitle}</h3>
                ${reminderDescription ? `<p style="margin:0 0 12px;color:#4f46e5;font-size:14px;line-height:1.5;font-style:italic;">"${reminderDescription}"</p>` : ""}
                <p style="margin:0;color:#6b7280;font-size:13px;">Giờ hẹn nhắc: <strong>${targetTime}</strong></p>
              </div>
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
                <p style="margin:0 0 8px;color:#6b7280;font-size:13px;line-height:1.5;">Gợi ý hoạt động hôm nay:</p>
                <ul style="margin:0;padding-left:20px;color:#4b5563;font-size:13px;line-height:1.6;">
                  <li style="margin-bottom:6px;">Luyện trả lời các câu hỏi phỏng vấn thường gặp.</li>
                  <li style="margin-bottom:6px;">Kiểm tra và tối ưu hóa CV của bạn chuẩn ATS.</li>
                  <li>Đọc các bài viết chia sẻ kinh nghiệm trên Blog Career.</li>
                </ul>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                &copy; 2026 ${appName}. Mọi quyền được bảo lưu.
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
    const result = await sendBrevoEmail({
      to: email,
      subject: `[${appName}] Nhắc nhở luyện tập: ${reminderTitle}`,
      html,
    });

    console.log(`[EmailService] Đã gửi nhắc nhở đến ${email} (MessageID: ${result.messageId})`);
    return { success: true };
  } catch (err) {
    console.error("[EmailService] Lỗi gửi email nhắc nhở:", err.message);
    return { success: false, error: `Không thể gửi email: ${err.message}` };
  }
}

/**
 * Gửi email xác nhận đơn hàng sau khi thanh toán gói thành công
 * @param {string} email - Email người nhận
 * @param {string} userName - Tên người nhận (có thể rỗng)
 * @param {string} planName - Tên gói đã mua (vd: "Pro - Phỏng vấn AI")
 * @param {number} amount - Số tiền đã thanh toán (VNĐ)
 * @param {string} billingCycle - "weekly" | "monthly"
 * @param {Date|string} expiresAt - Hạn sử dụng gói
 * @returns {Promise<{ success: boolean, devMode?: boolean, error?: string }>}
 */
export async function sendPurchaseEmail(email, { userName, planName, amount, billingCycle, expiresAt }) {
  if (!isBrevoConfigured()) {
    console.log(
      `\n[EmailService] DEV MODE - Brevo chưa được cấu hình.` +
      `\n[EmailService] Đơn hàng thành công gửi đến ${email}: gói "${planName}" (${billingCycle}) - ${amount}đ` +
      `\n[EmailService] Thêm BREVO_API_KEY vào .env.local để gửi email thật.\n`
    );
    return { success: true, devMode: true };
  }

  const displayName = userName || "bạn";
  const cycleLabel = billingCycle === "weekly" ? "Tuần (7 ngày)" : "Tháng (30 ngày)";
  const formattedAmount = Number(amount || 0).toLocaleString("vi-VN") + "đ";
  const expiresText = expiresAt
    ? new Date(expiresAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "—";

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác nhận đơn hàng thành công</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1 0%,#4f46e5 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">${appName}</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Xác nhận đơn hàng thanh toán thành công</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.6;font-weight:600;">
                Xin chào ${displayName},
              </p>
              <p style="margin:0 0 24px;color:#4b5563;font-size:15px;line-height:1.6;">
                Đơn hàng của bạn đã được thanh toán thành công. Gói <strong>${planName}</strong> đã được kích hoạt và sẵn sàng để sử dụng!
              </p>
              <div style="background:#f5f3ff;border:1px solid #e9e5ff;border-radius:12px;padding:20px;margin:0 0 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">Tên gói</td>
                    <td style="padding:6px 0;text-align:right;color:#1e1b4b;font-weight:700;">${planName}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">Chu kỳ</td>
                    <td style="padding:6px 0;text-align:right;color:#374151;">${cycleLabel}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">Số tiền đã thanh toán</td>
                    <td style="padding:6px 0;text-align:right;color:#4f46e5;font-weight:700;">${formattedAmount}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">Hạn sử dụng</td>
                    <td style="padding:6px 0;text-align:right;color:#374151;">${expiresText}</td>
                  </tr>
                </table>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td align="center">
                    <a href="http://localhost:3000/dashboard" style="display:inline-block;padding:12px 28px;background:#6366f1;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:10px;box-shadow:0 4px 12px rgba(99,102,241,0.25);">
                      Đến trang quản lý
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.6;">
                Cảm ơn bạn đã tin tưởng sử dụng <strong>${appName}</strong>. Nếu có bất kỳ thắc mắc nào, hãy liên hệ với chúng tôi qua email <a href="mailto:jobreadya@gmail.com" style="color:#4f46e5;">jobreadya@gmail.com</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                &copy; 2026 ${appName}. Mọi quyền được bảo lưu.
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
    const result = await sendBrevoEmail({
      to: email,
      subject: `[${appName}] Đơn hàng thành công: ${planName}`,
      html,
    });

    console.log(`[EmailService] Đã gửi xác nhận đơn hàng đến ${email} (MessageID: ${result.messageId})`);
    return { success: true };
  } catch (err) {
    console.error("[EmailService] Lỗi gửi email xác nhận đơn hàng:", err.message);
    return { success: false, error: `Không thể gửi email: ${err.message}` };
  }
}
