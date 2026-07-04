import express from "express";
import { query } from "../config/database.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const lang = req.query.lang || "vi";
    let result;
    if (lang === "en") {
      result = await query(`SELECT * FROM blog_posts WHERE language = 'en' ORDER BY created_at DESC`);
    } else {
      result = await query(`SELECT * FROM blog_posts WHERE language = 'vi' OR language IS NULL ORDER BY created_at DESC`);
    }
    const posts = result.rows.map((post) => ({
      ...post,
      image_url: post.image_url || post.thumbnail_url || null,
    }));

    res.json({ posts });
  } catch (error) {
    console.error("[BlogRoutes] Error fetching posts:", error);
    res.status(500).json({ error: "Lỗi khi lấy danh sách bài viết" });
  }
});

// Get single blog post
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra định dạng UUID hợp lệ trước khi truy vấn để tránh lỗi syntax trên database
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return res.status(404).json({ error: "Không tìm thấy bài viết" });
    }

    // Thử lấy từ blog_posts trước
    let result = await query(
      `SELECT * FROM blog_posts WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      result = await query(
        `SELECT
          a.*,
          COALESCE(p.full_name, 'JobReady AI') AS author
        FROM articles a
        LEFT JOIN user_profiles p ON p.user_id = a.author_id
        WHERE a.id = $1`,
        [id]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy bài viết" });
    }

    const post = {
      ...result.rows[0],
      image_url: result.rows[0].image_url || result.rows[0].thumbnail_url || null,
    };

    res.json({ post });
  } catch (error) {
    console.error("[BlogRoutes] Error fetching post:", error);
    res.status(500).json({ error: "Lỗi khi lấy bài viết" });
  }
});

// Middleware xác thực người dùng
function requireAuth(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Yêu cầu đăng nhập." });
  req.user = { id: userId, role: req.header("x-user-role") ?? "user" };
  return next();
}

// GET /api/blog/:id/comments — Lấy danh sách bình luận
router.get("/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT bc.id, bc.post_id, bc.user_id, bc.content, bc.created_at,
              COALESCE(up.full_name, u.email) as user_name,
              up.avatar_url as user_avatar
       FROM blog_comments bc
       INNER JOIN users u ON bc.user_id = u.id
       LEFT JOIN user_profiles up ON bc.user_id = up.user_id
       WHERE bc.post_id = $1
       ORDER BY bc.created_at DESC`,
      [id]
    );
    res.json({ comments: result.rows });
  } catch (error) {
    console.error("[BlogRoutes] Error fetching comments:", error);
    res.status(500).json({ error: "Lỗi khi tải danh sách bình luận" });
  }
});

// POST /api/blog/:id/comments — Thêm bình luận mới
router.post("/:id/comments", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Nội dung bình luận không được để trống." });
    }

    const insertResult = await query(
      `INSERT INTO blog_comments (post_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [id, userId, content.trim()]
    );

    const commentResult = await query(
      `SELECT bc.id, bc.post_id, bc.user_id, bc.content, bc.created_at,
              COALESCE(up.full_name, u.email) as user_name,
              up.avatar_url as user_avatar
       FROM blog_comments bc
       INNER JOIN users u ON bc.user_id = u.id
       LEFT JOIN user_profiles up ON bc.user_id = up.user_id
       WHERE bc.id = $1`,
      [insertResult.rows[0].id]
    );

    res.status(201).json({ comment: commentResult.rows[0] });
  } catch (error) {
    console.error("[BlogRoutes] Error adding comment:", error);
    res.status(500).json({ error: "Lỗi khi thêm bình luận" });
  }
});

// DELETE /api/blog/comments/:commentId — Xóa bình luận
router.delete("/comments/:commentId", requireAuth, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const checkResult = await query(
      `SELECT user_id FROM blog_comments WHERE id = $1`,
      [commentId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy bình luận." });
    }

    const commentOwnerId = checkResult.rows[0].user_id;

    // Chỉ chủ bình luận hoặc admin mới được xóa
    if (commentOwnerId !== userId && req.user.role !== "admin") {
      return res.status(403).json({ error: "Bạn không có quyền xóa bình luận này." });
    }

    await query(`DELETE FROM blog_comments WHERE id = $1`, [commentId]);

    res.json({ success: true, message: "Đã xóa bình luận." });
  } catch (error) {
    console.error("[BlogRoutes] Error deleting comment:", error);
    res.status(500).json({ error: "Lỗi khi xóa bình luận" });
  }
});

export default router;