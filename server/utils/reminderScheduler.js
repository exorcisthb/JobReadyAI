import { query } from "../config/database.js";
import { sendReminderEmail } from "../service/EmailService.js";

/**
 * Tính toán thời điểm gửi nhắc nhở tiếp theo dựa trên tần suất
 * @param {string} frequency - 'once' | 'daily' | 'weekly' | 'monthly'
 * @param {string} time_of_day - Định dạng 'HH:MM' hoặc 'HH:MM:SS'
 * @param {number|null} day_of_week - 0 (Chủ nhật) đến 6 (Thứ bảy)
 * @param {number|null} day_of_month - 1 đến 31
 * @param {Date} baseDate - Thời điểm mốc để tính toán
 * @returns {Date} - Đối tượng Date đại diện cho thời điểm tiếp theo
 */
export function calculateNextSendAt(frequency, time_of_day, day_of_week, day_of_month, baseDate = new Date()) {
  const next = new Date(baseDate);
  const parts = time_of_day.split(":");
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  next.setHours(hours, minutes, 0, 0);

  if (frequency === "once") {
    // Với lịch nhắc một lần, nếu giờ đã qua so với mốc thì giữ nguyên hoặc tăng thêm 1 ngày
    // nhưng thường chỉ chạy 1 lần duy nhất rồi tắt
  } else if (frequency === "daily") {
    if (next <= baseDate) {
      next.setDate(next.getDate() + 1);
    }
  } else if (frequency === "weekly") {
    const targetDay = day_of_week !== null && day_of_week !== undefined ? parseInt(day_of_week, 10) : 1;
    let daysDiff = targetDay - next.getDay();
    if (daysDiff < 0 || (daysDiff === 0 && next <= baseDate)) {
      daysDiff += 7;
    }
    next.setDate(next.getDate() + daysDiff);
  } else if (frequency === "monthly") {
    const targetDay = day_of_month !== null && day_of_month !== undefined ? parseInt(day_of_month, 10) : 1;
    next.setDate(targetDay);
    if (next <= baseDate) {
      next.setMonth(next.getMonth() + 1);
    }
  }
  return next;
}

/**
 * Khởi động bộ quét lịch nhắc chạy nền (setInterval)
 */
export function startReminderScheduler() {
  console.log("[Scheduler] 🚀 Khởi chạy hệ thống quét lịch nhắc luyện tập định kỳ...");

  // Quét mỗi 30 giây
  setInterval(runDueReminders, 30000);
}

export async function runDueReminders() {
    try {
      const now = new Date();

      // Truy vấn các lịch nhắc đang hoạt động và đã đến hạn gửi
      const result = await query(
        `SELECT r.*, u.email, up.full_name
         FROM reminders r
         JOIN users u ON r.user_id = u.id
         LEFT JOIN user_profiles up ON u.id = up.user_id
         WHERE r.is_active = true AND r.next_send_at <= $1`,
        [now]
      );

      const dueReminders = result.rows;
      if (dueReminders.length > 0) {
        console.log(`[Scheduler] ⏰ Phát hiện ${dueReminders.length} lịch nhắc cần xử lý.`);
      }

      for (const reminder of dueReminders) {
        console.log(`[Scheduler] ✉️ Đang xử lý gửi nhắc nhở: "${reminder.title}" cho ${reminder.email}`);

        // 1. Gửi email nhắc nhở
        const emailResult = await sendReminderEmail(
          reminder.email,
          reminder.full_name || "Thành viên",
          reminder.title,
          reminder.description,
          reminder.time_of_day
        );

        // 2. Lưu lịch sử gửi (log)
        await query(
          `INSERT INTO reminder_logs (reminder_id, status, error_message, sent_at)
           VALUES ($1, $2, $3, now())`,
          [
            reminder.id,
            emailResult.success ? "sent" : "failed",
            emailResult.error || null
          ]
        );

        // 3. Cập nhật lịch nhắc (cập nhật next_send_at và tắt lịch nhắc nếu chỉ gửi một lần)
        let is_active = reminder.is_active;
        let next_send_at = null;

        if (reminder.frequency === "once") {
          is_active = false;
        } else {
          // Tính toán mốc gửi tiếp theo bắt đầu từ thời điểm hiện tại
          next_send_at = calculateNextSendAt(
            reminder.frequency,
            reminder.time_of_day,
            reminder.day_of_week,
            reminder.day_of_month,
            now
          );
        }

        await query(
          `UPDATE reminders
           SET is_active = $1, next_send_at = $2, last_sent_at = now(), updated_at = now()
           WHERE id = $3`,
          [is_active, next_send_at, reminder.id]
        );

        console.log(`[Scheduler] ✅ Đã xử lý lịch nhắc "${reminder.title}". Tiếp theo: ${next_send_at || "Không có (Đã tắt)"}`);
      }

    } catch (err) {
      console.error("[Scheduler] ❌ Lỗi hệ thống quét lịch nhắc:", err.message);
    }
}
