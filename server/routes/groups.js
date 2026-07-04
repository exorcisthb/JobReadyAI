import express from "express";
import os from "node:os";
import { query, withTransaction } from "../config/database.js";

const router = express.Router();

router.param("id", (req, res, next, id) => {
  if (id) {
    req.params.id = id.replace(/^\//, "");
  }
  next();
});

const allowedReactionTypes = new Set(["like", "love", "haha", "wow", "sad", "angry"]);

function getLocalIpAddress() {
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const net of interfaces[name]) {
        if (net.family === "IPv4" && !net.internal) {
          return net.address;
        }
      }
    }
  } catch (e) {
    console.error("Lỗi khi lấy IP nội bộ:", e);
  }
  return "localhost";
}

function normalizeSearchText(value = "") {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "");
}

// ─── Middleware ───────────────────────────────────────────────────────────────

function requireAuth(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.user = { id: userId, role: req.header("x-user-role") ?? "user" };
  return next();
}

async function requireGroupMember(groupId, userId) {
  const memberCheck = await query(
    `SELECT role FROM group_members WHERE group_id = $1 AND user_id = $2`,
    [groupId, userId]
  );

  return memberCheck.rows[0] ?? null;
}

async function updatePostReaction({ groupId, postId, userId, reactionType = "like" }) {
  if (!allowedReactionTypes.has(reactionType)) {
    const error = new Error("Cảm xúc không hợp lệ.");
    error.status = 400;
    throw error;
  }

  const member = await requireGroupMember(groupId, userId);
  if (!member) {
    const error = new Error("Bạn không phải là thành viên của nhóm này.");
    error.status = 403;
    throw error;
  }

  const postCheck = await query(
    `SELECT id FROM group_posts WHERE id = $1 AND group_id = $2`,
    [postId, groupId]
  );

  if (postCheck.rows.length === 0) {
    const error = new Error("Không tìm thấy bài viết.");
    error.status = 404;
    throw error;
  }

  return withTransaction(async (client) => {
    const existingReaction = await client.query(
      `SELECT reaction_type FROM group_post_likes WHERE post_id = $1 AND user_id = $2`,
      [postId, userId]
    );

    let myReaction = reactionType;
    if (existingReaction.rows[0]?.reaction_type === reactionType) {
      await client.query(
        `DELETE FROM group_post_likes WHERE post_id = $1 AND user_id = $2`,
        [postId, userId]
      );
      myReaction = null;
    } else {
      await client.query(
        `INSERT INTO group_post_likes (post_id, user_id, reaction_type)
         VALUES ($1, $2, $3)
         ON CONFLICT (post_id, user_id)
         DO UPDATE SET reaction_type = EXCLUDED.reaction_type, created_at = NOW()`,
        [postId, userId, reactionType]
      );
    }

    const countResult = await client.query(
      `SELECT COUNT(*)::int as reaction_count FROM group_post_likes WHERE post_id = $1`,
      [postId]
    );
    const countsResult = await client.query(
      `SELECT COALESCE(json_object_agg(reaction_type, total), '{}'::json) as reaction_counts
       FROM (
         SELECT reaction_type, COUNT(*)::int as total
         FROM group_post_likes
         WHERE post_id = $1
         GROUP BY reaction_type
       ) reaction_rows`,
      [postId]
    );

    return {
      my_reaction: myReaction,
      reaction_count: countResult.rows[0].reaction_count,
      reaction_counts: countsResult.rows[0].reaction_counts,
    };
  });
}

// ─── GET /api/groups — Lấy danh sách nhóm của user ─────────────────────────

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { search = "", filter = "all" } = req.query;
    const searchText = Array.isArray(search) ? search[0] ?? "" : search;
    const normalizedSearch = normalizeSearchText(searchText);

    let sql = `
      SELECT g.id, g.name, g.description, g.job_category, g.experience_level, g.position, g.location, g.is_private, g.creator_id, g.created_at,
             u.email as creator_email,
             (SELECT full_name FROM user_profiles WHERE user_id = g.creator_id) as creator_name,
             (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as member_count,
             (SELECT COUNT(*) FROM group_posts WHERE group_id = g.id) as post_count,
             gm.role as my_role,
             CASE WHEN gm.user_id IS NOT NULL THEN true ELSE false END as is_member
      FROM groups g
      LEFT JOIN group_members gm ON g.id = gm.group_id AND gm.user_id = $1
      LEFT JOIN users u ON g.creator_id = u.id
      WHERE (g.is_private = false OR gm.user_id IS NOT NULL)
    `;

    const params = [userId];
    let paramIndex = 2;

    // Filter by job_category, experience, position, location
    if (req.query.job_category) {
      sql += ` AND g.job_category = $${paramIndex}`;
      params.push(req.query.job_category);
      paramIndex++;
    }
    if (req.query.experience_level) {
      sql += ` AND g.experience_level = $${paramIndex}`;
      params.push(req.query.experience_level);
      paramIndex++;
    }
    if (req.query.position) {
      sql += ` AND g.position ILIKE $${paramIndex}`;
      params.push(`%${req.query.position}%`);
      paramIndex++;
    }
    if (req.query.location) {
      sql += ` AND g.location ILIKE $${paramIndex}`;
      params.push(`%${req.query.location}%`);
      paramIndex++;
    }

    // Filter by member status
    if (filter === "my") {
      sql += ` AND gm.role IN ('admin', 'member')`;
    } else if (filter === "created") {
      sql += ` AND g.creator_id = $${paramIndex}`;
      params.push(userId);
      paramIndex++;
    }

    sql += ` ORDER BY g.created_at DESC`;

    const result = await query(sql, params);
    const groups = normalizedSearch
      ? result.rows.filter((group) =>
          normalizeSearchText(group.name).includes(normalizedSearch)
        )
      : result.rows;

    res.json({ groups });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    next(error);
  }
});

// ─── POST /api/groups — Tạo nhóm mới ────────────────────────────────────────

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, description = "", job_category = "", experience_level = "", position = "", location = "", is_private = true } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "Tên nhóm không được để trống." });
    }

    const result = await withTransaction(async (client) => {
      // Tạo nhóm
      const groupResult = await client.query(
        `INSERT INTO groups (name, description, job_category, experience_level, position, location, creator_id, is_private)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [name.trim(), description.trim(), job_category, experience_level, position, location, userId, is_private]
      );

      const newGroup = groupResult.rows[0];

      // Thêm creator làm thành viên admin của nhóm
      await client.query(
        `INSERT INTO group_members (group_id, user_id, role)
         VALUES ($1, $2, 'admin')`,
        [newGroup.id, userId]
      );

      return newGroup;
    });

    res.status(201).json({ success: true, group: result });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    next(error);
  }
});

// ─── GET /api/groups/my-invitations — Lấy lời mời nhóm đang chờ ─────────────

router.get("/my-invitations", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT gi.id as invitation_id, gi.group_id, gi.inviter_id, gi.status, gi.created_at,
              g.name as group_name, g.description as group_description, g.is_private,
              (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as member_count,
              COALESCE(
                (SELECT full_name FROM user_profiles WHERE user_id = gi.inviter_id),
                (SELECT email FROM users WHERE id = gi.inviter_id)
              ) as inviter_name,
              (SELECT avatar_url FROM user_profiles WHERE user_id = gi.inviter_id) as inviter_avatar
       FROM group_invitations gi
       INNER JOIN groups g ON gi.group_id = g.id
       WHERE gi.invitee_id = $1 AND gi.status = 'pending'
       ORDER BY gi.created_at DESC`,
      [userId]
    );

    res.json({ invitations: result.rows });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/groups/:id — Lấy chi tiết nhóm ────────────────────────────────

router.get("/:id", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Lấy thông tin nhóm
    const groupResult = await query(
      `SELECT g.id, g.name, g.description, g.job_category, g.experience_level, g.position, g.location, g.is_private, g.creator_id, g.created_at,
              u.email as creator_email,
              (SELECT full_name FROM user_profiles WHERE user_id = g.creator_id) as creator_name,
              (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as member_count,
              (SELECT COUNT(*) FROM group_posts WHERE group_id = g.id) as post_count
       FROM groups g
       LEFT JOIN users u ON g.creator_id = u.id
       WHERE g.id = $1`,
      [id]
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy nhóm." });
    }

    const group = groupResult.rows[0];

    // Kiểm tra user có phải là thành viên không
    const memberCheck = await query(
      `SELECT role FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ error: "Bạn không phải là thành viên của nhóm này." });
    }

    const myRole = memberCheck.rows[0].role;

    res.json({ group, my_role: myRole, local_ip: getLocalIpAddress() });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/groups/:id/invite — Lấy thông tin mời tham gia nhóm ────────────

router.get("/:id/invite", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Lấy thông tin nhóm cơ bản
    const groupResult = await query(
      `SELECT g.id, g.name, g.description, g.job_category, g.experience_level, g.position, g.location, g.is_private, g.creator_id, g.created_at,
              u.email as creator_email,
              (SELECT full_name FROM user_profiles WHERE user_id = g.creator_id) as creator_name,
              (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as member_count,
              (SELECT COUNT(*) FROM group_posts WHERE group_id = g.id) as post_count
       FROM groups g
       LEFT JOIN users u ON g.creator_id = u.id
       WHERE g.id = $1`,
      [id]
    );

    if (groupResult.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy nhóm." });
    }

    const group = groupResult.rows[0];

    // Kiểm tra xem người dùng hiện tại đã là thành viên hay chưa
    const memberCheck = await query(
      `SELECT role FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [id, userId]
    );

    const isMember = memberCheck.rows.length > 0;

    res.json({ group, is_member: isMember, local_ip: getLocalIpAddress() });
  } catch (error) {
    next(error);
  }
});

// ─── PUT /api/groups/:id — Cập nhật nhóm ────────────────────────────────────

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, description, is_private, job_category, experience_level, position, location } = req.body;

    // Kiểm tra quyền (chỉ creator hoặc admin của nhóm)
    const memberCheck = await query(
      `SELECT gm.role, g.creator_id
       FROM group_members gm
       INNER JOIN groups g ON gm.group_id = g.id
       WHERE gm.group_id = $1 AND gm.user_id = $2`,
      [id, userId]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ error: "Bạn không phải là thành viên của nhóm này." });
    }

    const { role, creator_id } = memberCheck.rows[0];
    if (role !== "admin" && creator_id !== userId) {
      return res.status(403).json({ error: "Bạn không có quyền chỉnh sửa nhóm này." });
    }

    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      params.push(name.trim());
      paramIndex++;
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      params.push(description.trim());
      paramIndex++;
    }
    if (is_private !== undefined) {
      updates.push(`is_private = $${paramIndex}`);
      params.push(is_private);
      paramIndex++;
    }
    if (job_category !== undefined) {
      updates.push(`job_category = $${paramIndex}`);
      params.push(job_category);
      paramIndex++;
    }
    if (experience_level !== undefined) {
      updates.push(`experience_level = $${paramIndex}`);
      params.push(experience_level);
      paramIndex++;
    }
    if (position !== undefined) {
      updates.push(`position = $${paramIndex}`);
      params.push(position);
      paramIndex++;
    }
    if (location !== undefined) {
      updates.push(`location = $${paramIndex}`);
      params.push(location);
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "Không có thông tin nào để cập nhật." });
    }

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const result = await query(
      `UPDATE groups SET ${updates.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
      params
    );

    res.json({ success: true, group: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// ─── PUT /api/groups/:id/transfer-owner — Chuyển quyền trưởng nhóm ───────────

router.put("/:id/transfer-owner", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { new_owner_id } = req.body;

    if (!new_owner_id) {
      return res.status(400).json({ error: "Thiếu thông tin trưởng nhóm mới." });
    }

    // Kiểm tra nhóm & người tạo hiện tại
    const groupCheck = await query(
      `SELECT creator_id FROM groups WHERE id = $1`,
      [id]
    );

    if (groupCheck.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy nhóm." });
    }

    if (groupCheck.rows[0].creator_id !== userId) {
      return res.status(403).json({ error: "Chỉ trưởng nhóm hiện tại mới có quyền chuyển giao." });
    }
    const memberCheck = await query(
      `SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [id, new_owner_id]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(400).json({ error: "Trưởng nhóm mới phải là thành viên của nhóm." });
    }

    await withTransaction(async (client) => {
      await client.query(
        `UPDATE groups SET creator_id = $1 WHERE id = $2`,
        [new_owner_id, id]
      );
      await client.query(
        `UPDATE group_members SET role = 'admin' WHERE group_id = $1 AND user_id = $2`,
        [id, new_owner_id]
      );
    });

    res.json({ success: true, message: "Chuyển giao quyền trưởng nhóm thành công." });
  } catch (error) {
    next(error);
  }
});
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const groupCheck = await query(
      `SELECT creator_id FROM groups WHERE id = $1`,
      [id]
    );

    if (groupCheck.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy nhóm." });
    }

    if (groupCheck.rows[0].creator_id !== userId) {
      return res.status(403).json({ error: "Chỉ người tạo nhóm mới có quyền xóa nhóm." });
    }

    await withTransaction(async (client) => {
      await client.query(`DELETE FROM group_members WHERE group_id = $1`, [id]);
      await client.query(`DELETE FROM group_posts WHERE group_id = $1`, [id]);
      await client.query(`DELETE FROM groups WHERE id = $1`, [id]);
    });

    res.json({ success: true, message: "Đã xóa nhóm thành công." });
  } catch (error) {
    next(error);
  }
});
router.get("/:id/members", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const memberCheck = await query(
      `SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ error: "Bạn không phải là thành viên của nhóm này." });
    }

    const result = await query(
      `SELECT gm.id, gm.user_id, gm.role, gm.joined_at,
              u.email,
              (SELECT full_name FROM user_profiles WHERE user_id = gm.user_id) as name,
              (SELECT avatar_url FROM user_profiles WHERE user_id = gm.user_id) as avatar_url
       FROM group_members gm
       INNER JOIN users u ON gm.user_id = u.id
       WHERE gm.group_id = $1
       ORDER BY gm.joined_at ASC`,
      [id]
    );

    res.json({ members: result.rows });
  } catch (error) {
    next(error);
  }
});
router.post("/:id/members", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { email, friend_id } = req.body;
    const memberCheck = await query(
      `SELECT gm.role, g.creator_id, g.is_private
       FROM group_members gm
       INNER JOIN groups g ON gm.group_id = g.id
       WHERE gm.group_id = $1 AND gm.user_id = $2`,
      [id, userId]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ error: "Bạn không phải là thành viên của nhóm này." });
    }



    // Xác định target user id
    let targetUserId = friend_id;

    if (email && !targetUserId) {
      const userResult = await query(
        `SELECT id FROM users WHERE email = $1`,
        [email]
      );
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: "Không tìm thấy người dùng với email này." });
      }
      targetUserId = userResult.rows[0].id;
    }

    if (!targetUserId) {
      return res.status(400).json({ error: "Thiếu thông tin người dùng cần mời." });
    }

    // Kiểm tra đã là thành viên chưa
    const existingMember = await query(
      `SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [id, targetUserId]
    );

    if (existingMember.rows.length > 0) {
      return res.status(400).json({ error: "Người dùng này đã là thành viên của nhóm." });
    }

    // Kiểm tra đã có lời mời pending chưa
    const existingInvitation = await query(
      `SELECT id, status FROM group_invitations WHERE group_id = $1 AND invitee_id = $2`,
      [id, targetUserId]
    );

    if (existingInvitation.rows.length > 0) {
      const inv = existingInvitation.rows[0];
      if (inv.status === "pending") {
        return res.status(400).json({ error: "Đã gửi lời mời cho người dùng này rồi." });
      }
      // Nếu từng declined, cập nhật lại thành pending
      await query(
        `UPDATE group_invitations SET status = 'pending', inviter_id = $1, updated_at = NOW() WHERE id = $2`,
        [userId, inv.id]
      );
    } else {
      // Tạo lời mời mới
      await query(
        `INSERT INTO group_invitations (group_id, inviter_id, invitee_id, status)
         VALUES ($1, $2, $3, 'pending')`,
        [id, userId, targetUserId]
      );
    }

    // Gửi thông báo đến người được mời
    try {
      const groupNameResult = await query(`SELECT name FROM groups WHERE id = $1`, [id]);
      const groupName = groupNameResult.rows[0]?.name || "nhóm";

      const inviterProfile = await query(
        `SELECT COALESCE(up.full_name, u.email) as display_name, u.role
         FROM users u LEFT JOIN user_profiles up ON u.id = up.user_id
         WHERE u.id = $1`,
        [userId]
      );
      const inviterName = inviterProfile.rows[0]?.display_name || "Thành viên";
      const inviterRole = inviterProfile.rows[0]?.role || "user";

      await query(
        `INSERT INTO notifications (user_id, sender_id, sender_name, sender_role, title, message, type, link)
         VALUES ($1, $2, $3, $4, $5, $6, 'group_invite', $7)`,
        [
          targetUserId,
          userId,
          inviterName,
          inviterRole,
          `Lời mời tham gia nhóm "${groupName}"`,
          `${inviterName} đã mời bạn tham gia nhóm "${groupName}". Hãy vào trang Nhóm để chấp nhận hoặc từ chối.`,
          `/groups`
        ]
      );
    } catch (notifErr) {
      console.error("Lỗi khi tạo thông báo mời nhóm:", notifErr);
    }

    res.status(201).json({ success: true, message: "Đã gửi lời mời tham gia nhóm." });
  } catch (error) {
    next(error);
  }
});

// ─── DELETE /api/groups/:id/members/:userId — Xóa thành viên ────────────────

router.delete("/:id/members/:userId", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id, userId: targetUserId } = req.params;

    // Kiểm tra user có quyền (admin nhóm hoặc tự xóa chính mình)
    const memberCheck = await query(
      `SELECT gm.role, g.creator_id
       FROM group_members gm
       INNER JOIN groups g ON gm.group_id = g.id
       WHERE gm.group_id = $1 AND gm.user_id = $2`,
      [id, userId]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ error: "Bạn không phải là thành viên của nhóm này." });
    }

    const { role, creator_id } = memberCheck.rows[0];
    const isAdmin = role === "admin" || creator_id === userId;
    const isSelf = targetUserId === userId;

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ error: "Bạn không có quyền xóa thành viên này." });
    }

    // Không cho xóa creator
    const groupCheck = await query(
      `SELECT creator_id FROM groups WHERE id = $1`,
      [id]
    );

    if (groupCheck.rows[0]?.creator_id === targetUserId) {
      return res.status(400).json({ error: "Không thể xóa người tạo nhóm." });
    }

    await query(
      `DELETE FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [id, targetUserId]
    );

    res.json({ success: true, message: "Đã xóa thành viên khỏi nhóm." });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/groups/:id/join — Tham gia nhóm ──────────────────────────────

router.post("/:id/join", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Kiểm tra nhóm có tồn tại không
    const groupCheck = await query(
      `SELECT is_private FROM groups WHERE id = $1`,
      [id]
    );

    if (groupCheck.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy nhóm." });
    }

    // Kiểm tra đã là thành viên chưa
    const existingMember = await query(
      `SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (existingMember.rows.length > 0) {
      return res.status(400).json({ error: "Bạn đã là thành viên của nhóm này." });
    }

    // Thêm thành viên
    await query(
      `INSERT INTO group_members (group_id, user_id, role)
       VALUES ($1, $2, 'member')`,
      [id, userId]
    );

    res.status(201).json({ success: true, message: "Đã tham gia nhóm thành công." });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/leave", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Kiểm tra nhóm
    const groupCheck = await query(
      `SELECT creator_id FROM groups WHERE id = $1`,
      [id]
    );

    if (groupCheck.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy nhóm." });
    }

    // Kiểm tra thành viên
    const memberCheck = await query(
      `SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(400).json({ error: "Bạn không phải là thành viên của nhóm này." });
    }

    const isCreator = groupCheck.rows[0].creator_id === userId;

    await withTransaction(async (client) => {
      if (isCreator) {
        // Tìm thành viên khác để chuyển quyền (ưu tiên người gia nhập lâu nhất)
        const nextMember = await client.query(
          `SELECT user_id FROM group_members WHERE group_id = $1 AND user_id != $2 ORDER BY joined_at ASC LIMIT 1`,
          [id, userId]
        );

        if (nextMember.rows.length > 0) {
          const newCreatorId = nextMember.rows[0].user_id;

          // Chuyển quyền trưởng nhóm
          await client.query(
            `UPDATE groups SET creator_id = $1 WHERE id = $2`,
            [newCreatorId, id]
          );

          // Đảm bảo trưởng nhóm mới có vai trò admin
          await client.query(
            `UPDATE group_members SET role = 'admin' WHERE group_id = $1 AND user_id = $2`,
            [id, newCreatorId]
          );
        } else {
          // Nếu là thành viên cuối cùng, tiến hành xóa nhóm sạch sẽ
          await client.query(`DELETE FROM group_members WHERE group_id = $1`, [id]);
          await client.query(`DELETE FROM group_posts WHERE group_id = $1`, [id]);
          await client.query(`DELETE FROM groups WHERE id = $1`, [id]);
          return;
        }
      }

      // Xóa thành viên rời nhóm
      await client.query(
        `DELETE FROM group_members WHERE group_id = $1 AND user_id = $2`,
        [id, userId]
      );
    });

    res.json({ success: true, message: "Đã rời nhóm thành công." });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/groups/:id/posts — Lấy danh sách bài viết ─────────────────────

router.get("/:id/posts", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Kiểm tra user là thành viên
    const member = await requireGroupMember(id, userId);

    if (!member) {
      return res.status(403).json({ error: "Bạn không phải là thành viên của nhóm này." });
    }

    const result = await query(
      `SELECT gp.id, gp.title, gp.content, gp.created_at, gp.updated_at,
              gp.author_id,
              u.email as author_email,
              (SELECT full_name FROM user_profiles WHERE user_id = gp.author_id) as author_name,
              (SELECT avatar_url FROM user_profiles WHERE user_id = gp.author_id) as author_avatar,
              (SELECT COUNT(*)::int FROM group_post_likes WHERE post_id = gp.id) as like_count,
              (SELECT COUNT(*)::int FROM group_post_likes WHERE post_id = gp.id) as reaction_count,
              EXISTS(SELECT 1 FROM group_post_likes WHERE post_id = gp.id AND user_id = $2) as liked_by_me,
              (SELECT reaction_type FROM group_post_likes WHERE post_id = gp.id AND user_id = $2) as my_reaction,
              COALESCE(
                (
                  SELECT json_object_agg(reaction_type, total)
                  FROM (
                    SELECT reaction_type, COUNT(*)::int as total
                    FROM group_post_likes
                    WHERE post_id = gp.id
                    GROUP BY reaction_type
                  ) reaction_rows
                ),
                '{}'::json
              ) as reaction_counts,
              (SELECT COUNT(*)::int FROM group_post_comments WHERE post_id = gp.id) as comment_count,
              COALESCE(
                (
                  SELECT json_agg(comment_rows ORDER BY comment_rows.created_at ASC)
                  FROM (
                    SELECT gpc.id, gpc.post_id, gpc.parent_comment_id, gpc.author_id, gpc.content, gpc.created_at, gpc.updated_at,
                           cu.email as author_email,
                           (SELECT full_name FROM user_profiles WHERE user_id = gpc.author_id) as author_name,
                           (SELECT avatar_url FROM user_profiles WHERE user_id = gpc.author_id) as author_avatar
                    FROM group_post_comments gpc
                    INNER JOIN users cu ON gpc.author_id = cu.id
                    WHERE gpc.post_id = gp.id
                    ORDER BY gpc.created_at ASC
                  ) comment_rows
                ),
                '[]'::json
              ) as comments
       FROM group_posts gp
       INNER JOIN users u ON gp.author_id = u.id
       WHERE gp.group_id = $1
       ORDER BY gp.created_at DESC`,
      [id, userId]
    );

    res.json({ posts: result.rows });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/groups/:id/posts — Tạo bài viết mới ─────────────────────────

router.post("/:id/posts", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: "Tiêu đề không được để trống." });
    }
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Nội dung không được để trống." });
    }

    // Kiểm tra user là thành viên
    const memberCheck = await query(
      `SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ error: "Bạn không phải là thành viên của nhóm này." });
    }

    const result = await query(
      `INSERT INTO group_posts (group_id, author_id, title, content)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, userId, title.trim(), content.trim()]
    );

    res.status(201).json({ success: true, post: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/groups/:id/posts/:postId/like — Like/unlike bài viết ─────────

router.post("/:id/posts/:postId/like", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id, postId } = req.params;
    const result = await updatePostReaction({ groupId: id, postId, userId, reactionType: "like" });

    res.json({
      success: true,
      liked: Boolean(result.my_reaction),
      like_count: result.reaction_count,
      ...result,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    next(error);
  }
});

// ─── POST /api/groups/:id/posts/:postId/reaction — Thả cảm xúc bài viết ─────

router.post("/:id/posts/:postId/reaction", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id, postId } = req.params;
    const result = await updatePostReaction({
      groupId: id,
      postId,
      userId,
      reactionType: req.body?.reaction_type || "like",
    });

    res.json({ success: true, ...result });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    next(error);
  }
});

// ─── POST /api/groups/:id/posts/:postId/comments — Bình luận bài viết ───────

router.post("/:id/posts/:postId/comments", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id, postId } = req.params;
    const { content = "", parent_comment_id = null } = req.body;

    if (!content.trim()) {
      return res.status(400).json({ error: "Bình luận không được để trống." });
    }

    const member = await requireGroupMember(id, userId);
    if (!member) {
      return res.status(403).json({ error: "Bạn không phải là thành viên của nhóm này." });
    }

    const postCheck = await query(
      `SELECT id FROM group_posts WHERE id = $1 AND group_id = $2`,
      [postId, id]
    );

    if (postCheck.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy bài viết." });
    }

    if (parent_comment_id) {
      const parentCheck = await query(
        `SELECT id FROM group_post_comments WHERE id = $1 AND post_id = $2`,
        [parent_comment_id, postId]
      );

      if (parentCheck.rows.length === 0) {
        return res.status(404).json({ error: "Không tìm thấy bình luận cần trả lời." });
      }
    }

    const result = await query(
      `INSERT INTO group_post_comments (post_id, parent_comment_id, author_id, content)
       VALUES ($1, $2, $3, $4)
       RETURNING id, post_id, parent_comment_id, author_id, content, created_at, updated_at,
         (SELECT email FROM users WHERE id = $3) as author_email,
         (SELECT full_name FROM user_profiles WHERE user_id = $3) as author_name,
         (SELECT avatar_url FROM user_profiles WHERE user_id = $3) as author_avatar`,
      [postId, parent_comment_id, userId, content.trim()]
    );

    const countResult = await query(
      `SELECT COUNT(*)::int as comment_count FROM group_post_comments WHERE post_id = $1`,
      [postId]
    );

    res.status(201).json({
      success: true,
      comment: result.rows[0],
      comment_count: countResult.rows[0].comment_count,
    });
  } catch (error) {
    next(error);
  }
});

// ─── DELETE /api/groups/:id/posts/:postId/comments/:commentId — Xóa comment ─

router.delete("/:id/posts/:postId/comments/:commentId", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id, postId, commentId } = req.params;

    const commentCheck = await query(
      `SELECT gpc.author_id, gp.group_id, g.creator_id,
              (SELECT role FROM group_members WHERE group_id = $1 AND user_id = $2) as user_role
       FROM group_post_comments gpc
       INNER JOIN group_posts gp ON gpc.post_id = gp.id
       INNER JOIN groups g ON gp.group_id = g.id
       WHERE gpc.id = $3 AND gpc.post_id = $4 AND gp.group_id = $1`,
      [id, userId, commentId, postId]
    );

    if (commentCheck.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy bình luận." });
    }

    const { author_id, creator_id, user_role } = commentCheck.rows[0];
    if (author_id !== userId && creator_id !== userId && user_role !== "admin") {
      return res.status(403).json({ error: "Bạn không có quyền xóa bình luận này." });
    }

    await query(`DELETE FROM group_post_comments WHERE id = $1`, [commentId]);

    const countResult = await query(
      `SELECT COUNT(*)::int as comment_count FROM group_post_comments WHERE post_id = $1`,
      [postId]
    );

    res.json({ success: true, comment_count: countResult.rows[0].comment_count });
  } catch (error) {
    next(error);
  }
});

// ─── DELETE /api/groups/:id/posts/:postId — Xóa bài viết ────────────────────

router.delete("/:id/posts/:postId", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id, postId } = req.params;

    // Lấy bài viết và kiểm tra quyền
    const postCheck = await query(
      `SELECT gp.author_id, g.creator_id,
              (SELECT role FROM group_members WHERE group_id = $1 AND user_id = $2) as user_role
       FROM group_posts gp
       INNER JOIN groups g ON gp.group_id = g.id
       WHERE gp.id = $3 AND gp.group_id = $1`,
      [id, userId, postId]
    );

    if (postCheck.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy bài viết." });
    }

    const { author_id, creator_id, user_role } = postCheck.rows[0];

    // Cho phép xóa nếu là author, creator nhóm, hoặc admin nhóm
    if (author_id !== userId && creator_id !== userId && user_role !== "admin") {
      return res.status(403).json({ error: "Bạn không có quyền xóa bài viết này." });
    }

    await query(`DELETE FROM group_posts WHERE id = $1`, [postId]);

    res.json({ success: true, message: "Đã xóa bài viết thành công." });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/groups/:id/messages — Lấy lịch sử trò chuyện nhóm ──────────────

router.get("/:id/messages", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Kiểm tra user có phải là thành viên không
    const member = await requireGroupMember(id, userId);
    if (!member) {
      return res.status(403).json({ error: "Bạn không phải là thành viên của nhóm này." });
    }

    const result = await query(
      `SELECT gm.id, gm.group_id, gm.sender_id, gm.message, gm.created_at,
              (SELECT full_name FROM user_profiles WHERE user_id = gm.sender_id) as sender_name,
              (SELECT avatar_url FROM user_profiles WHERE user_id = gm.sender_id) as sender_avatar,
              (SELECT email FROM users WHERE id = gm.sender_id) as sender_email
       FROM group_messages gm
       WHERE gm.group_id = $1
       ORDER BY gm.created_at ASC`,
      [id]
    );

    res.json({ messages: result.rows });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/groups/:id/messages — Gửi tin nhắn mới ─────────────────────────

router.post("/:id/messages", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Tin nhắn không được để trống." });
    }

    // Kiểm tra user có phải là thành viên không
    const member = await requireGroupMember(id, userId);
    if (!member) {
      return res.status(403).json({ error: "Bạn không phải là thành viên của nhóm này." });
    }

    const insertResult = await query(
      `INSERT INTO group_messages (group_id, sender_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id, userId, message.trim()]
    );

    const newMessage = insertResult.rows[0];

    // Lấy thông tin người gửi kèm theo
    const senderResult = await query(
      `SELECT 
        (SELECT full_name FROM user_profiles WHERE user_id = $1) as sender_name,
        (SELECT avatar_url FROM user_profiles WHERE user_id = $1) as sender_avatar,
        (SELECT email FROM users WHERE id = $1) as sender_email`,
      [userId]
    );

    // Gửi thông báo đến những người khác trong nhóm
    try {
      const groupNameResult = await query(`SELECT name FROM groups WHERE id = $1`, [id]);
      const groupName = groupNameResult.rows[0]?.name || "nhóm";
      
      const otherMembers = await query(
        `SELECT user_id FROM group_members WHERE group_id = $1 AND user_id != $2`,
        [id, userId]
      );
      
      if (otherMembers.rows.length > 0) {
        const senderName = senderResult.rows[0]?.sender_name || senderResult.rows[0]?.sender_email || "Thành viên";
        const senderRole = req.user.role || "user";
        
        await Promise.all(
          otherMembers.rows.map((row) =>
            query(
              `INSERT INTO notifications (user_id, sender_id, sender_name, sender_role, title, message, type, link)
               VALUES ($1, $2, $3, $4, $5, $6, 'chat', $7)`,
              [
                row.user_id,
                userId,
                senderName,
                senderRole,
                `Tin nhắn mới trong nhóm ${groupName}`,
                `${senderName} đã nhắn: "${message.trim()}"`,
                `/groups/detail?id=${id}`
              ]
            )
          )
        );
      }
    } catch (notifErr) {
      console.error("Lỗi khi tạo thông báo nhắn tin nhóm:", notifErr);
    }

    res.status(201).json({
      success: true,
      message: {
        ...newMessage,
        sender_name: senderResult.rows[0].sender_name,
        sender_avatar: senderResult.rows[0].sender_avatar,
        sender_email: senderResult.rows[0].sender_email,
      }
    });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/groups/:id/friends-to-invite — Bạn bè có thể mời ──────────────

router.get("/:id/friends-to-invite", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Kiểm tra user là thành viên
    const memberCheck = await query(
      `SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ error: "Bạn không phải là thành viên của nhóm này." });
    }

    // Lấy bạn bè đã accepted, loại trừ đã là member và đã có invitation pending
    const result = await query(
      `SELECT u.id, u.email,
              up.full_name as name, up.avatar_url, up.job_title,
              CASE 
                WHEN gm.user_id IS NOT NULL THEN 'member'
                WHEN gi.status = 'pending' THEN 'invited'
                ELSE 'available'
              END as invite_status
       FROM friendships f
       JOIN users u ON (f.user_id = u.id OR f.friend_id = u.id) AND u.id != $1
       LEFT JOIN user_profiles up ON u.id = up.user_id
       LEFT JOIN group_members gm ON gm.group_id = $2 AND gm.user_id = u.id
       LEFT JOIN group_invitations gi ON gi.group_id = $2 AND gi.invitee_id = u.id AND gi.status = 'pending'
       WHERE (f.user_id = $1 OR f.friend_id = $1)
         AND f.status = 'accepted'
         AND u.status = 'active'
       ORDER BY up.full_name ASC`,
      [userId, id]
    );

    res.json({ friends: result.rows });
  } catch (error) {
    next(error);
  }
});

// ─── POST /api/groups/:id/invitations/:invitationId/accept — Chấp nhận lời mời

router.post("/:id/invitations/:invitationId/accept", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id, invitationId } = req.params;

    const result = await withTransaction(async (client) => {
      // Kiểm tra lời mời
      const invCheck = await client.query(
        `SELECT id, group_id, invitee_id, status FROM group_invitations
         WHERE id = $1 AND group_id = $2 AND invitee_id = $3 AND status = 'pending'`,
        [invitationId, id, userId]
      );

      if (invCheck.rows.length === 0) {
        const error = new Error("Không tìm thấy lời mời hợp lệ.");
        error.status = 404;
        throw error;
      }

      // Cập nhật status lời mời
      await client.query(
        `UPDATE group_invitations SET status = 'accepted', updated_at = NOW() WHERE id = $1`,
        [invitationId]
      );

      // Thêm vào group_members
      await client.query(
        `INSERT INTO group_members (group_id, user_id, role)
         VALUES ($1, $2, 'member')
         ON CONFLICT (group_id, user_id) DO NOTHING`,
        [id, userId]
      );

      return invCheck.rows[0];
    });

    // Gửi thông báo cho người mời
    try {
      const groupNameResult = await query(`SELECT name FROM groups WHERE id = $1`, [id]);
      const groupName = groupNameResult.rows[0]?.name || "nhóm";

      const accepterProfile = await query(
        `SELECT COALESCE(up.full_name, u.email) as display_name, u.role
         FROM users u LEFT JOIN user_profiles up ON u.id = up.user_id
         WHERE u.id = $1`,
        [userId]
      );
      const accepterName = accepterProfile.rows[0]?.display_name || "Thành viên";
      const accepterRole = accepterProfile.rows[0]?.role || "user";

      const invitation = await query(`SELECT inviter_id FROM group_invitations WHERE id = $1`, [invitationId]);
      const inviterId = invitation.rows[0]?.inviter_id;

      if (inviterId) {
        await query(
          `INSERT INTO notifications (user_id, sender_id, sender_name, sender_role, title, message, type, link)
           VALUES ($1, $2, $3, $4, $5, $6, 'group_invite_accepted', $7)`,
          [
            inviterId,
            userId,
            accepterName,
            accepterRole,
            `Đã chấp nhận lời mời nhóm`,
            `${accepterName} đã chấp nhận lời mời tham gia nhóm "${groupName}".`,
            `/groups/detail?id=${id}`
          ]
        );
      }
    } catch (notifErr) {
      console.error("Lỗi khi tạo thông báo chấp nhận mời nhóm:", notifErr);
    }

    res.json({ success: true, message: "Đã chấp nhận lời mời và tham gia nhóm." });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.message });
    }
    next(error);
  }
});

// ─── POST /api/groups/:id/invitations/:invitationId/decline — Từ chối lời mời

router.post("/:id/invitations/:invitationId/decline", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id, invitationId } = req.params;

    const result = await query(
      `UPDATE group_invitations SET status = 'declined', updated_at = NOW()
       WHERE id = $1 AND group_id = $2 AND invitee_id = $3 AND status = 'pending'
       RETURNING id`,
      [invitationId, id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Không tìm thấy lời mời hợp lệ." });
    }

    res.json({ success: true, message: "Đã từ chối lời mời tham gia nhóm." });
  } catch (error) {
    next(error);
  }
});

export default router;
