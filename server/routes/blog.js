import express from "express";
import { query } from "../config/database.js";

const router = express.Router();

// Get all blog posts
router.get("/", async (req, res) => {
  try {
    const result = await query(
      "SELECT * FROM blog_posts ORDER BY created_at DESC"
    );
    res.json({ posts: result.rows });
  } catch (error) {
    console.error("[BlogRoutes] Error fetching posts:", error);
    res.status(500).json({ error: "Lỗi khi lấy danh sách bài viết" });
  }
});

// Get single blog post
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query("SELECT * FROM blog_posts WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy bài viết" });
    }
    res.json({ post: result.rows[0] });
  } catch (error) {
    console.error("[BlogRoutes] Error fetching post:", error);
    res.status(500).json({ error: "Lỗi khi lấy bài viết" });
  }
});

export default router;
