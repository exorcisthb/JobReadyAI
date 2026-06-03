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

// Helper to get sender profile name
async function getUserDisplayName(userId) {
  const result = await query(
    `SELECT COALESCE(up.full_name, u.email) as display_name, u.role
     FROM users u
     LEFT JOIN user_profiles up ON u.id = up.user_id
     WHERE u.id = $1`,
    [userId]
  );
  return result.rows[0] || { display_name: "Người dùng", role: "user" };
}

// ─── FRIENDS API ──────────────────────────────────────────────────────────────

// GET /api/friends - Lấy danh sách bạn bè & lời mời
router.get("/friends", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Lấy danh sách bạn bè đã chấp nhận
    const friendsResult = await query(
      `SELECT f.id as friendship_id, f.created_at as friendship_created_at,
              u.id as id, u.email,
              up.full_name as name, up.avatar_url, up.job_title, up.location
       FROM friendships f
       JOIN users u ON (f.user_id = u.id OR f.friend_id = u.id) AND u.id != $1
       LEFT JOIN user_profiles up ON u.id = up.user_id
       WHERE (f.user_id = $1 OR f.friend_id = $1) AND f.status = 'accepted'
       ORDER BY up.full_name ASC`,
      [userId]
    );

    // 2. Lấy danh sách lời mời kết bạn nhận được (Incoming)
    const incomingResult = await query(
      `SELECT f.id as friendship_id, f.created_at,
              u.id as id, u.email,
              up.full_name as name, up.avatar_url, up.job_title
       FROM friendships f
       JOIN users u ON f.user_id = u.id
       LEFT JOIN user_profiles up ON u.id = up.user_id
       WHERE f.friend_id = $1 AND f.status = 'pending'
       ORDER BY f.created_at DESC`,
      [userId]
    );

    // 3. Lấy danh sách lời mời đã gửi (Outgoing)
    const outgoingResult = await query(
      `SELECT f.id as friendship_id, f.created_at,
              u.id as id, u.email,
              up.full_name as name, up.avatar_url, up.job_title
       FROM friendships f
       JOIN users u ON f.friend_id = u.id
       LEFT JOIN user_profiles up ON u.id = up.user_id
       WHERE f.user_id = $1 AND f.status = 'pending'
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json({
      friends: friendsResult.rows,
      incoming: incomingResult.rows,
      outgoing: outgoingResult.rows,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/friends/search - Tìm kiếm người dùng mới để kết bạn
router.get("/friends/search", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { q = "" } = req.query;

    if (!q.trim()) {
      return res.json({ users: [] });
    }

    const searchStr = `%${q.trim()}%`;

    const result = await query(
      `SELECT u.id, u.email,
              up.full_name as name, up.avatar_url, up.job_title,
              -- Xác định mối quan hệ hiện tại
              COALESCE(
                (SELECT 
                  CASE 
                    WHEN f.status = 'accepted' THEN 'accepted'
                    WHEN f.status = 'pending' AND f.user_id = $1 THEN 'pending_outgoing'
                    WHEN f.status = 'pending' AND f.friend_id = $1 THEN 'pending_incoming'
                    ELSE 'none'
                  END
                 FROM friendships f 
                 WHERE (f.user_id = $1 AND f.friend_id = u.id) OR (f.user_id = u.id AND f.friend_id = $1)
                ),
                'none'
              ) as friendship_status
       FROM users u
       LEFT JOIN user_profiles up ON u.id = up.user_id
       WHERE u.id != $1 AND (u.email ILIKE $2 OR up.full_name ILIKE $2)
       LIMIT 20`,
      [userId, searchStr]
    );

    res.json({ users: result.rows });
  } catch (error) {
    next(error);
  }
});

// POST /api/friends/request - Gửi yêu cầu kết bạn
router.post("/friends/request", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { email, friend_id } = req.body;

    let targetUserId = friend_id;

    // Nếu gửi bằng email, tìm user ID trước
    if (email && !targetUserId) {
      const userRes = await query(`SELECT id FROM users WHERE email = $1`, [email.trim().toLowerCase()]);
      if (userRes.rows.length === 0) {
        return res.status(404).json({ error: "Không tìm thấy người dùng có email này." });
      }
      targetUserId = userRes.rows[0].id;
    }

    if (!targetUserId) {
      return res.status(400).json({ error: "Thiếu thông tin người dùng." });
    }

    if (targetUserId === userId) {
      return res.status(400).json({ error: "Bạn không thể gửi lời mời kết bạn cho chính mình." });
    }

    const friendship = await withTransaction(async (client) => {
      // Kiểm tra xem mối quan hệ đã tồn tại chưa
      const checkRes = await client.query(
        `SELECT id, user_id, friend_id, status FROM friendships 
         WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)`,
        [userId, targetUserId]
      );

      const existing = checkRes.rows[0];

      if (existing) {
        if (existing.status === "accepted") {
          throw new Error("Hai người đã là bạn bè.");
        }
        if (existing.status === "pending") {
          if (existing.user_id === userId) {
            throw new Error("Bạn đã gửi yêu cầu kết bạn rồi, vui lòng chờ đối phương xác nhận.");
          } else {
            // Đối phương đã gửi yêu cầu trước đó -> Tự động chấp nhận luôn
            const updateRes = await client.query(
              `UPDATE friendships SET status = 'accepted', updated_at = NOW() WHERE id = $1 RETURNING *`,
              [existing.id]
            );
            return { relationship: updateRes.rows[0], autoAccepted: true };
          }
        }
        // Nếu đã từng từ chối (declined), cho phép gửi lại bằng cách cập nhật status và đổi chiều sender
        const updateRes = await client.query(
          `UPDATE friendships SET user_id = $1, friend_id = $2, status = 'pending', updated_at = NOW() WHERE id = $3 RETURNING *`,
          [userId, targetUserId, existing.id]
        );
        return { relationship: updateRes.rows[0], autoAccepted: false };
      }

      // Tạo mới
      const insertRes = await client.query(
        `INSERT INTO friendships (user_id, friend_id, status)
         VALUES ($1, $2, 'pending')
         RETURNING *`,
        [userId, targetUserId]
      );
      return { relationship: insertRes.rows[0], autoAccepted: false };
    });

    // Gửi thông báo đến người nhận
    const senderProfile = await getUserDisplayName(userId);
    const senderName = senderProfile.display_name;
    const senderRole = senderProfile.role;

    if (friendship.autoAccepted) {
      await query(
        `INSERT INTO notifications (user_id, sender_id, sender_name, sender_role, title, message, type, link)
         VALUES ($1, $2, $3, $4, $5, $6, 'friend_accept', $7)`,
        [
          targetUserId,
          userId,
          senderName,
          senderRole,
          "Đã chấp nhận lời mời kết bạn",
          `${senderName} đã đồng ý kết bạn với bạn. Bây giờ bạn có thể nhắn tin cho họ.`,
          "/messages"
        ]
      );
    } else {
      await query(
        `INSERT INTO notifications (user_id, sender_id, sender_name, sender_role, title, message, type, link)
         VALUES ($1, $2, $3, $4, $5, $6, 'friend_request', $7)`,
        [
          targetUserId,
          userId,
          senderName,
          senderRole,
          "Lời mời kết bạn mới",
          `${senderName} đã gửi cho bạn một lời mời kết bạn.`,
          "/messages"
        ]
      );
    }

    res.json({ success: true, friendship: friendship.relationship, autoAccepted: friendship.autoAccepted });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/friends/accept - Chấp nhận lời mời kết bạn
router.post("/friends/accept", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { friendship_id, friend_id } = req.body;

    let updateRes;

    if (friendship_id) {
      updateRes = await query(
        `UPDATE friendships SET status = 'accepted', updated_at = NOW() 
         WHERE id = $1 AND friend_id = $2 AND status = 'pending'
         RETURNING *`,
        [friendship_id, userId]
      );
    } else if (friend_id) {
      updateRes = await query(
        `UPDATE friendships SET status = 'accepted', updated_at = NOW() 
         WHERE user_id = $1 AND friend_id = $2 AND status = 'pending'
         RETURNING *`,
        [friend_id, userId]
      );
    }

    if (!updateRes || updateRes.rowCount === 0) {
      return res.status(404).json({ error: "Không tìm thấy yêu cầu kết bạn hợp lệ." });
    }

    const relationship = updateRes.rows[0];
    const originalSenderId = relationship.user_id;

    // Gửi thông báo đến người gửi ban đầu
    const senderProfile = await getUserDisplayName(userId);
    const senderName = senderProfile.display_name;
    const senderRole = senderProfile.role;

    await query(
      `INSERT INTO notifications (user_id, sender_id, sender_name, sender_role, title, message, type, link)
       VALUES ($1, $2, $3, $4, $5, $6, 'friend_accept', $7)`,
      [
        originalSenderId,
        userId,
        senderName,
        senderRole,
        "Đã chấp nhận lời mời kết bạn",
        `${senderName} đã đồng ý kết bạn với bạn. Bây giờ bạn có thể nhắn tin cho họ.`,
        "/messages"
      ]
    );

    res.json({ success: true, friendship: relationship });
  } catch (error) {
    next(error);
  }
});

// POST /api/friends/decline - Từ chối hoặc hủy yêu cầu kết bạn
router.post("/friends/decline", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { friendship_id, friend_id } = req.body;

    let deleteRes;

    if (friendship_id) {
      deleteRes = await query(
        `DELETE FROM friendships 
         WHERE id = $1 AND (user_id = $2 OR friend_id = $2) AND status = 'pending'
         RETURNING *`,
        [friendship_id, userId]
      );
    } else if (friend_id) {
      deleteRes = await query(
        `DELETE FROM friendships 
         WHERE ((user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)) AND status = 'pending'
         RETURNING *`,
        [userId, friend_id]
      );
    }

    if (!deleteRes || deleteRes.rowCount === 0) {
      return res.status(404).json({ error: "Không tìm thấy yêu cầu kết bạn để hủy." });
    }

    res.json({ success: true, message: "Đã từ chối hoặc hủy yêu cầu kết bạn." });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/friends/:friendId - Hủy kết bạn (Unfriend)
router.delete("/friends/:friendId", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;

    const result = await query(
      `DELETE FROM friendships 
       WHERE ((user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)) AND status = 'accepted'
       RETURNING *`,
      [userId, friendId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Không tồn tại mối quan hệ bạn bè giữa hai người." });
    }

    // Cũng xóa luôn các tin nhắn trực tiếp giữa 2 người (Tùy chọn, Zalo thường giữ nhưng để sạch DB và an toàn thì có thể giữ/xóa. Ở đây ta giữ lịch sử chat)
    res.json({ success: true, message: "Đã hủy kết bạn thành công." });
  } catch (error) {
    next(error);
  }
});


// ─── MESSAGING API ────────────────────────────────────────────────────────────

// GET /api/messages/direct/:friendId - Lấy lịch sử nhắn tin
router.get("/messages/direct/:friendId", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;

    // 1. Kiểm tra xem có phải bạn bè không
    const friendCheck = await query(
      `SELECT status FROM friendships 
       WHERE ((user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)) AND status = 'accepted'`,
      [userId, friendId]
    );

    if (friendCheck.rows.length === 0) {
      return res.status(403).json({ error: "Chỉ bạn bè mới có thể nhắn tin và xem lịch sử trò chuyện." });
    }

    // 2. Lấy tin nhắn
    const result = await query(
      `SELECT dm.id, dm.sender_id, dm.receiver_id, dm.message, dm.created_at, dm.is_read
       FROM direct_messages dm
       WHERE (dm.sender_id = $1 AND dm.receiver_id = $2) OR (dm.sender_id = $2 AND dm.receiver_id = $1)
       ORDER BY dm.created_at ASC`,
      [userId, friendId]
    );

    // 3. Đánh dấu đã đọc các tin nhắn gửi đến mình
    await query(
      `UPDATE direct_messages 
       SET is_read = TRUE 
       WHERE sender_id = $1 AND receiver_id = $2 AND is_read = FALSE`,
      [friendId, userId]
    );

    res.json({ messages: result.rows });
  } catch (error) {
    next(error);
  }
});

// POST /api/messages/direct/:friendId - Gửi tin nhắn mới
router.post("/messages/direct/:friendId", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Tin nhắn không được để trống." });
    }

    // 1. Kiểm tra xem có phải bạn bè không
    const friendCheck = await query(
      `SELECT status FROM friendships 
       WHERE ((user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)) AND status = 'accepted'`,
      [userId, friendId]
    );

    if (friendCheck.rows.length === 0) {
      return res.status(403).json({ error: "Chỉ bạn bè mới có thể nhắn tin." });
    }

    // 2. Lưu tin nhắn
    const insertRes = await query(
      `INSERT INTO direct_messages (sender_id, receiver_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, friendId, message.trim()]
    );

    const newMessage = insertRes.rows[0];

    // 3. Gửi thông báo tin nhắn mới
    try {
      const senderProfile = await getUserDisplayName(userId);
      const senderName = senderProfile.display_name;
      const senderRole = senderProfile.role;

      await query(
        `INSERT INTO notifications (user_id, sender_id, sender_name, sender_role, title, message, type, link)
         VALUES ($1, $2, $3, $4, $5, $6, 'direct_message', $7)`,
        [
          friendId,
          userId,
          senderName,
          senderRole,
          "Tin nhắn mới",
          `${senderName} đã gửi tin nhắn: "${message.trim().substring(0, 50)}${message.trim().length > 50 ? "..." : ""}"`,
          `/messages?chat=${userId}`
        ]
      );
    } catch (notifErr) {
      console.error("Lỗi khi tạo thông báo tin nhắn trực tiếp:", notifErr);
    }

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    next(error);
  }
});

// GET /api/messages/unread - Lấy số lượng tin nhắn chưa đọc từ mỗi người bạn
router.get("/messages/unread", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT sender_id, COUNT(*)::int as unread_count 
       FROM direct_messages 
       WHERE receiver_id = $1 AND is_read = FALSE 
       GROUP BY sender_id`,
      [userId]
    );

    res.json({ unread: result.rows });
  } catch (error) {
    next(error);
  }
});

export default router;
