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

// ─── GET /api/groups — Lấy danh sách nhóm của user ─────────────────────────

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { search = "", filter = "all" } = req.query;

    let sql = `
      SELECT g.id, g.name, g.description, g.job_category, g.experience_level, g.position, g.location, g.is_private, g.creator_id, g.created_at,
             u.email as creator_email,
             (SELECT full_name FROM user_profiles WHERE user_id = g.creator_id) as creator_name,
             (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as member_count,
             (SELECT COUNT(*) FROM group_posts WHERE group_id = g.id) as post_count,
             gm.role as my_role,
             CASE WHEN gm.user_id IS NOT NULL THEN true ELSE false END as is_member
      FROM groups g
      INNER JOIN group_members gm ON g.id = gm.group_id AND gm.user_id = $1
      LEFT JOIN users u ON g.creator_id = u.id
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

    // Search
    if (search) {
      sql += ` AND (g.name ILIKE $${paramIndex} OR g.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    sql += ` ORDER BY g.created_at DESC`;

    const result = await query(sql, params);
    res.json({ groups: result.rows });
  } catch (error) {
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

    res.json({ group, my_role: myRole });
  } catch (error) {
    next(error);
  }
});

// ─── PUT /api/groups/:id — Cập nhật nhóm ────────────────────────────────────

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, description, is_private } = req.body;

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

// ─── DELETE /api/groups/:id — Xóa nhóm ──────────────────────────────────────

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Chỉ creator mới có quyền xóa nhóm
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
      // Xóa tất cả members trước ( cascade sẽ tự động nhưng để chắc chắn )
      await client.query(`DELETE FROM group_members WHERE group_id = $1`, [id]);
      // Xóa tất cả posts trước
      await client.query(`DELETE FROM group_posts WHERE group_id = $1`, [id]);
      // Xóa nhóm
      await client.query(`DELETE FROM groups WHERE id = $1`, [id]);
    });

    res.json({ success: true, message: "Đã xóa nhóm thành công." });
  } catch (error) {
    next(error);
  }
});

// ─── GET /api/groups/:id/members — Lấy danh sách thành viên ─────────────────

router.get("/:id/members", requireAuth, async (req, res, next) => {
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

// ─── POST /api/groups/:id/members — Thêm thành viên ─────────────────────────

router.post("/:id/members", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email không được để trống." });
    }

    // Kiểm tra user có quyền admin trong nhóm
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
      return res.status(403).json({ error: "Chỉ admin nhóm mới có quyền thêm thành viên." });
    }

    // Tìm user theo email
    const userResult = await query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy người dùng với email này." });
    }

    const targetUserId = userResult.rows[0].id;

    // Kiểm tra đã là thành viên chưa
    const existingMember = await query(
      `SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [id, targetUserId]
    );

    if (existingMember.rows.length > 0) {
      return res.status(400).json({ error: "Người dùng này đã là thành viên của nhóm." });
    }

    // Thêm thành viên
    await query(
      `INSERT INTO group_members (group_id, user_id, role)
       VALUES ($1, $2, 'member')`,
      [id, targetUserId]
    );

    res.status(201).json({ success: true, message: "Đã thêm thành viên vào nhóm." });
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

// ─── POST /api/groups/:id/leave — Rời nhóm ─────────────────────────────────

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

    // Không cho rời nhóm nếu là creator
    if (groupCheck.rows[0].creator_id === userId) {
      return res.status(400).json({ error: "Người tạo nhóm không thể rời nhóm. Hãy xóa nhóm hoặc chuyển quyền cho người khác." });
    }

    const result = await query(
      `DELETE FROM group_members WHERE group_id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ error: "Bạn không phải là thành viên của nhóm này." });
    }

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
    const memberCheck = await query(
      `SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ error: "Bạn không phải là thành viên của nhóm này." });
    }

    const result = await query(
      `SELECT gp.id, gp.title, gp.content, gp.created_at, gp.updated_at,
              gp.author_id,
              u.email as author_email,
              (SELECT full_name FROM user_profiles WHERE user_id = gp.author_id) as author_name,
              (SELECT avatar_url FROM user_profiles WHERE user_id = gp.author_id) as author_avatar
       FROM group_posts gp
       INNER JOIN users u ON gp.author_id = u.id
       WHERE gp.group_id = $1
       ORDER BY gp.created_at DESC`,
      [id]
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

export default router;
