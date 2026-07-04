import express from "express";
import { query, withTransaction } from "../config/database.js";

const router = express.Router();

// ─── Middleware ───────────────────────────────────────────────────────────────

function requireAuth(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.user = { id: userId, role: req.header("x-user-role") ?? "user" };
  return next();
}

function requireAdminOrManager(req, res, next) {
  const role = req.header("x-user-role");
  if (role !== "admin" && role !== "content_manager") {
    return res.status(403).json({ error: "Forbidden: Phải là Admin hoặc Manager" });
  }
  return next();
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// 1. GET / — Lấy danh sách thông báo của người dùng hiện tại
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await query(
      `SELECT id, sender_name, sender_role, title, message, type, is_read, created_at, link
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    const unreadCountResult = await query(
      `SELECT COUNT(*)::int as count FROM notifications WHERE user_id = $1 AND is_read = false`,
      [userId]
    );

    res.json({
      notifications: result.rows,
      unreadCount: unreadCountResult.rows[0]?.count ?? 0,
    });
  } catch (error) {
    next(error);
  }
});

// 2. GET /users — Lấy danh sách tất cả người dùng (Dành cho Admin/Manager chọn đối tượng gửi)
router.get("/users", requireAuth, requireAdminOrManager, async (_req, res, next) => {
  try {
    const result = await query(
      `SELECT u.id, u.email, u.role, p.full_name
       FROM users u
       LEFT JOIN user_profiles p ON u.id = p.user_id
       ORDER BY u.email ASC`
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// 3. POST /read — Đánh dấu đã đọc (1 thông báo cụ thể hoặc tất cả)
router.post("/read", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.body; // Nếu id là undefined, đánh dấu tất cả đã đọc

    if (id) {
      await query(
        `UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2`,
        [id, userId]
      );
    } else {
      await query(
        `UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false`,
        [userId]
      );
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// 4. DELETE /:id — Xóa thông báo khỏi danh sách của user
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleteResult = await query(
      `DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );

    if (deleteResult.rows.length === 0) {
      return res.status(404).json({ error: "Thông báo không tồn tại hoặc bạn không có quyền xóa." });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// 5. POST /send — Gửi thông báo tới người dùng (Dành cho Admin/Manager)
router.post("/send", requireAuth, requireAdminOrManager, async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const senderRole = req.user.role;
    const { targetType, targetUserId, title, message, type } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: "Tiêu đề và nội dung không được để trống." });
    }

    const notificationType = type || "info";

    // Tìm tên người gửi
    const profileResult = await query(
      `SELECT full_name FROM user_profiles WHERE user_id = $1`,
      [senderId]
    );
    const senderName = profileResult.rows[0]?.full_name || (senderRole === "admin" ? "Hệ thống (Admin)" : "Ban Quản Lý (Manager)");

    if (targetType === "user") {
      if (!targetUserId) {
        return res.status(400).json({ error: "Vui lòng chọn người dùng nhận thông báo." });
      }

      await query(
        `INSERT INTO notifications (user_id, sender_id, sender_name, sender_role, title, message, type)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [targetUserId, senderId, senderName, senderRole, title, message, notificationType]
      );
    } else if (targetType === "all") {
      // Lấy danh sách tất cả người dùng (role = 'user') hoặc tất cả tài khoản
      const usersResult = await query(`SELECT id FROM users`);
      const userIds = usersResult.rows.map(r => r.id);

      if (userIds.length > 0) {
        await withTransaction(async (client) => {
          for (const uid of userIds) {
            await client.query(
              `INSERT INTO notifications (user_id, sender_id, sender_name, sender_role, title, message, type)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [uid, senderId, senderName, senderRole, title, message, notificationType]
            );
          }
        });
      }
    } else {
      return res.status(400).json({ error: "Đối tượng nhận thông báo không hợp lệ." });
    }

    res.json({ success: true, message: "Gửi thông báo thành công." });
  } catch (error) {
    next(error);
  }
});

// 6. GET /history — Xem lịch sử đã gửi thông báo của chính Admin/Manager đó
router.get("/history", requireAuth, requireAdminOrManager, async (req, res, next) => {
  try {
    const senderId = req.user.id;
    // Lấy thông báo được nhóm hoặc hiển thị danh sách chi tiết các thông báo đã gửi
    // Để tiện lợi và gọn gàng, chúng ta lấy danh sách duy nhất theo title, message và created_at gửi gần nhất
    const result = await query(
      `SELECT n.title, n.message, n.type, n.created_at, n.sender_role,
              COUNT(DISTINCT n.user_id) as total_recipients,
              MIN(n.user_id) as single_recipient_id,
              MIN(u.email) as single_recipient_email
       FROM notifications n
       LEFT JOIN users u ON n.user_id = u.id
       WHERE n.sender_id = $1
       GROUP BY n.title, n.message, n.type, n.created_at, n.sender_role
       ORDER BY n.created_at DESC`,
      [senderId]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
