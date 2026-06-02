import { Router } from "express";
import { query } from "../config/database.js";
import { ApiError } from "../utils/ApiError.js";
import { calculateNextSendAt } from "../utils/reminderScheduler.js";

const router = Router();

function getUserId(req) {
  const userId = req.header("x-user-id");
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }
  return userId;
}

// Tạo lịch nhắc mới
router.post("/", async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const {
      title,
      description,
      reminder_type = "once",
      frequency = "once",
      day_of_week,
      day_of_month,
      time_of_day,
      start_date,
      end_date,
      notification_channel = "in_app",
    } = req.body;

    if (!title || !time_of_day) {
      throw new ApiError(400, "Tiêu đề và giờ nhắc là bắt buộc");
    }

    // Tính next_send_at dựa trên frequency và các thông số cài đặt
    const nextSendAt = calculateNextSendAt(
      frequency,
      time_of_day,
      day_of_week,
      day_of_month,
      new Date()
    );

    const result = await query(
      `INSERT INTO reminders 
       (user_id, title, description, reminder_type, frequency, day_of_week, day_of_month, 
        time_of_day, start_date, end_date, next_send_at, notification_channel)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        userId,
        title,
        description,
        reminder_type,
        frequency,
        day_of_week || null,
        day_of_month || null,
        time_of_day,
        start_date || null,
        end_date || null,
        nextSendAt,
        notification_channel,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Lấy danh sách lịch nhắc của user
router.get("/", async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { active_only } = req.query;

    let sql = "SELECT * FROM reminders WHERE user_id = $1";
    const params = [userId];

    if (active_only === "true") {
      sql += " AND is_active = true";
    }

    sql += " ORDER BY next_send_at ASC NULLS LAST, created_at DESC";

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Lấy chi tiết lịch nhắc
router.get("/:id", async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const result = await query(
      "SELECT * FROM reminders WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (result.rows.length === 0) {
      throw new ApiError(404, "Không tìm thấy lịch nhắc");
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Cập nhật lịch nhắc
router.put("/:id", async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const {
      title,
      description,
      reminder_type,
      frequency,
      day_of_week,
      day_of_month,
      time_of_day,
      start_date,
      end_date,
      is_active,
      notification_channel,
    } = req.body;

    // Kiểm tra reminder tồn tại và thuộc về user
    const checkResult = await query(
      "SELECT * FROM reminders WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      throw new ApiError(404, "Không tìm thấy lịch nhắc");
    }
    const current = checkResult.rows[0];

    // Tính lại next_send_at nếu có thay đổi liên quan đến lịch trình
    let nextSendAt = current.next_send_at;
    if (time_of_day !== undefined || frequency !== undefined || day_of_week !== undefined || day_of_month !== undefined) {
      const newFrequency = frequency !== undefined ? frequency : current.frequency;
      const newTime = time_of_day !== undefined ? time_of_day : current.time_of_day;
      const newDayOfWeek = day_of_week !== undefined ? day_of_week : current.day_of_week;
      const newDayOfMonth = day_of_month !== undefined ? day_of_month : current.day_of_month;

      nextSendAt = calculateNextSendAt(
        newFrequency,
        newTime,
        newDayOfWeek,
        newDayOfMonth,
        new Date()
      );
    }

    const result = await query(
      `UPDATE reminders SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        reminder_type = COALESCE($3, reminder_type),
        frequency = COALESCE($4, frequency),
        day_of_week = COALESCE($5, day_of_week),
        day_of_month = COALESCE($6, day_of_month),
        time_of_day = COALESCE($7, time_of_day),
        start_date = COALESCE($8, start_date),
        end_date = COALESCE($9, end_date),
        is_active = COALESCE($10, is_active),
        notification_channel = COALESCE($11, notification_channel),
        next_send_at = $12,
        updated_at = now()
       WHERE id = $13 AND user_id = $14
       RETURNING *`,
      [
        title,
        description,
        reminder_type,
        frequency,
        day_of_week,
        day_of_month,
        time_of_day,
        start_date,
        end_date,
        is_active,
        notification_channel,
        nextSendAt,
        id,
        userId,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Xóa lịch nhắc
router.delete("/:id", async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const result = await query(
      "DELETE FROM reminders WHERE id = $1 AND user_id = $2 RETURNING id",
      [id, userId]
    );

    if (result.rows.length === 0) {
      throw new ApiError(404, "Không tìm thấy lịch nhắc");
    }

    res.json({ message: "Đã xóa lịch nhắc" });
  } catch (error) {
    next(error);
  }
});

// Toggle trạng thái lịch nhắc (bật/tắt)
router.patch("/:id/toggle", async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    // Lấy thông tin hiện tại
    const currentResult = await query(
      "SELECT * FROM reminders WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    if (currentResult.rows.length === 0) {
      throw new ApiError(404, "Không tìm thấy lịch nhắc");
    }
    const current = currentResult.rows[0];
    const newIsActive = !current.is_active;

    let nextSendAt = current.next_send_at;
    // Nếu chuyển sang hoạt động, tính toán lại thời gian gửi kế tiếp ở tương lai
    if (newIsActive) {
      nextSendAt = calculateNextSendAt(
        current.frequency,
        current.time_of_day,
        current.day_of_week,
        current.day_of_month,
        new Date()
      );
    }

    const result = await query(
      `UPDATE reminders 
       SET is_active = $1, next_send_at = $2, updated_at = now()
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [newIsActive, nextSendAt, id, userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Lấy lịch sử gửi nhắc
router.get("/:id/logs", async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    // Kiểm tra reminder thuộc về user
    const checkResult = await query(
      "SELECT id FROM reminders WHERE id = $1 AND user_id = $2",
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      throw new ApiError(404, "Không tìm thấy lịch nhắc");
    }

    const result = await query(
      "SELECT * FROM reminder_logs WHERE reminder_id = $1 ORDER BY sent_at DESC LIMIT 50",
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
