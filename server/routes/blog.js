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

export default router;