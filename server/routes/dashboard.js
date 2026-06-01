import express from "express";
import * as cheerio from "cheerio";
import { query, withTransaction } from "../config/database.js";

const router = express.Router();

// ─── Middleware ───────────────────────────────────────────────────────────────

function requireAuth(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.user = { id: userId, role: req.header("x-user-role") ?? "user" };
  return next();
}

function requireContentManager(req, res, next) {
  if (!req.user || (req.user.role !== "content_manager" && req.user.role !== "admin")) {
    return res.status(403).json({ error: "Forbidden" });
  }
  return next();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Strip HTML tags and generate a plain-text excerpt.
 * FIX: Prevents raw HTML from leaking into blog_posts.excerpt.
 */
function generateExcerpt(content, maxLength = 150) {
  const plain = content
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > maxLength ? plain.slice(0, maxLength) + "..." : plain;
}

const categoryMap = {
  interview_tips: "Mẹo phỏng vấn",
  soft_skills: "Kỹ năng nghề nghiệp",
  career: "Tiêu chí xin việc",
  cv_tips: "Tiêu chí chọn CV",
  other: "Xu hướng tuyển dụng",
};

// ─── Routes ───────────────────────────────────────────────────────────────────

router.post("/scrape", requireAuth, requireContentManager, async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "Thiếu URL" });

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      return res.status(400).json({ error: "Không thể truy cập trang web" });
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('meta[property="og:title"]').attr("content") || $("title").text() || "";
    const image = $('meta[property="og:image"]').attr("content") || "";
    let description = $('meta[property="og:description"]').attr("content") || $('meta[name="description"]').attr("content") || "";

    res.json({ title: title.trim(), image, description: description.trim() });
  } catch (error) {
    console.error("Lỗi scrape URL:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi phân tích URL" });
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [userData, profile, sessionStats, recentSessions, progress, practiceCount, cvStats] =
      await Promise.all([
        query("SELECT id, email, auth_provider, subscription_plan, subscription_expires_at FROM users WHERE id = $1", [userId]),
        query("SELECT * FROM user_profiles WHERE user_id = $1", [userId]),
        query(
          `SELECT COUNT(*) as total_sessions,
                  ROUND(AVG(avg_score)::numeric, 2) as avg_score
           FROM interview_sessions
           WHERE user_id = $1 AND status = 'completed'`,
          [userId],
        ),
        query(
          `SELECT id, level, avg_score, started_at, status
           FROM interview_sessions
           WHERE user_id = $1
           ORDER BY started_at DESC LIMIT 5`,
          [userId],
        ),
        query(
          `SELECT session_date, avg_score
           FROM user_progress
           WHERE user_id = $1
           ORDER BY session_date DESC LIMIT 30`,
          [userId],
        ),
        query("SELECT COUNT(*) as total FROM practice_sessions WHERE user_id = $1", [userId]),
        query(
          `SELECT
             (SELECT COUNT(*) FROM cvs WHERE user_id = $1) as cv_uploads,
             (SELECT COUNT(*) FROM cv_builder_drafts WHERE user_id = $1) as cv_built`,
          [userId],
        ),
      ]);

    const user = userData.rows[0] ?? {};
    const userProfile = profile.rows[0] ?? {};
    const name = userProfile.full_name || user.email?.split("@")[0] || "User";

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name,
        avatar_url: userProfile.avatar_url || null,
        auth_provider: user.auth_provider || null,
        subscription_plan: user.subscription_plan || "free",
        subscription_expires_at: user.subscription_expires_at || null,
      },
      profile: {
        full_name: userProfile.full_name ?? null,
        avatar_url: userProfile.avatar_url ?? null,
        profile_completed: userProfile.profile_completed ?? false,
        phone: userProfile.phone ?? null,
        job_title: userProfile.job_title ?? null,
        industry: userProfile.industry ?? null,
        experience_level: userProfile.experience_level ?? null,
        location: userProfile.location ?? null,
        skills: userProfile.skills ?? null,
        career_goal: userProfile.career_goal ?? null,
      },
      stats: {
        total_sessions: Number.parseInt(String(sessionStats.rows[0]?.total_sessions ?? "0"), 10),
        avg_score: sessionStats.rows[0]?.avg_score ?? null,
        total_cv_uploads: Number.parseInt(String(cvStats.rows[0]?.cv_uploads ?? "0"), 10),
        total_cv_built: Number.parseInt(String(cvStats.rows[0]?.cv_built ?? "0"), 10),
        total_practice_sessions: Number.parseInt(String(practiceCount.rows[0]?.total ?? "0"), 10),
      },
      recent_sessions: recentSessions.rows,
      progress: progress.rows.reverse(),
    });
  } catch (error) {
    next(error);
  }
});

router.get("/cm", requireAuth, requireContentManager, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const [stats, recentArticles, recentNews, recentQuestions] = await Promise.all([
      query(`
        SELECT
          (SELECT COUNT(*) FROM questions WHERE is_active = true) as total_questions,
          (SELECT COUNT(*) FROM articles WHERE source_url IS NULL OR source_url = '') as total_articles,
          (SELECT COUNT(*) FROM articles WHERE source_url IS NOT NULL AND source_url != '') as total_news,
          (SELECT COUNT(*) FROM articles WHERE status = 'published') as published_articles,
          (SELECT COUNT(*) FROM articles WHERE status = 'draft') as draft_articles
      `),
      userRole === "admin"
        ? query(
            `SELECT id, title, status, category, created_at
             FROM articles
             WHERE source_url IS NULL OR source_url = ''
             ORDER BY created_at DESC LIMIT 5`,
          )
        : query(
            `SELECT id, title, status, category, created_at
             FROM articles
             WHERE author_id = $1 AND (source_url IS NULL OR source_url = '')
             ORDER BY created_at DESC LIMIT 5`,
            [userId],
          ),
      userRole === "admin"
        ? query(
            `SELECT id, title, status, category, created_at
             FROM articles
             WHERE source_url IS NOT NULL AND source_url != ''
             ORDER BY created_at DESC LIMIT 5`,
          )
        : query(
            `SELECT id, title, status, category, created_at
             FROM articles
             WHERE author_id = $1 AND source_url IS NOT NULL AND source_url != ''
             ORDER BY created_at DESC LIMIT 5`,
            [userId],
          ),
      query(
        `SELECT id, content, level, type, created_at
         FROM questions
         WHERE created_by = $1
         ORDER BY created_at DESC LIMIT 5`,
        [userId],
      ),
    ]);

    res.json({
      stats: stats.rows[0],
      recent_articles: recentArticles.rows,
      recent_news: recentNews.rows,
      recent_questions: recentQuestions.rows,
    });
  } catch (error) {
    next(error);
  }
});

// GET /articles — FIX #1: thêm thumbnail_url vào SELECT
router.get("/articles", requireAuth, requireContentManager, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let sql =
      "SELECT id, title, status, category, thumbnail_url, source_url, created_at FROM articles";
    let params = [];

    if (userRole !== "admin") {
      sql += " WHERE author_id = $1";
      params.push(userId);
    }

    sql += " ORDER BY created_at DESC";

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// POST /articles — FIX #2: excerpt strip HTML | FIX #3: dùng giá trị ảnh từ DB
router.post("/articles", requireAuth, requireContentManager, async (req, res, next) => {
  try {
    const { title, content, category, status, thumbnail_url, image_url, source_url } = req.body;

    if (!title || !category || !status) {
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc của bài viết." });
    }
    if (!content && !source_url) {
      return res.status(400).json({ error: "Nội dung bài viết hoặc đường dẫn gốc không được để trống." });
    }

    const finalImageUrl = image_url || thumbnail_url || null;
    const authorId = req.user.id;
    const publishedAt = status === "published" ? new Date() : null;

    const result = await withTransaction(async (client) => {
      const articleResult = await client.query(
        `INSERT INTO articles
           (author_id, title, content, thumbnail_url, source_url, category, status, published_at, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6::article_category, $7::article_status, $8, NOW(), NOW())
         RETURNING *`,
        [authorId, title, content || "", finalImageUrl, source_url || null, category, status, publishedAt],
      );

      const newArticle = articleResult.rows[0];

      if (status === "published") {
        const profileResult = await client.query(
          "SELECT full_name FROM user_profiles WHERE user_id = $1",
          [authorId],
        );
        const authorName = profileResult.rows[0]?.full_name || "JobReady AI";

        // FIX #2: strip HTML trước khi tạo excerpt
        const excerpt = generateExcerpt(content || "");
        const blogCategory = categoryMap[category] || "Kỹ năng nghề nghiệp";

        // FIX #3: dùng newArticle.thumbnail_url (giá trị đã lưu vào DB) thay vì finalImageUrl local
        await client.query(
          `INSERT INTO blog_posts
             (id, title, content, excerpt, category, author, image_url, source_url, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
          [
            newArticle.id,
            title,
            content,
            excerpt,
            blogCategory,
            authorName,
            newArticle.thumbnail_url,
            newArticle.source_url,
          ],
        );
      }

      return newArticle;
    });

    res.status(201).json({ success: true, article: result });
  } catch (error) {
    next(error);
  }
});

// GET /articles/:id
router.get("/articles/:id", requireAuth, requireContentManager, async (req, res, next) => {
  try {
    const { id } = req.params;
    const authorId = req.user.id;
    const userRole = req.user.role;

    const result = await query("SELECT * FROM articles WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy bài viết." });
    }

    const article = result.rows[0];
    if (userRole !== "admin" && article.author_id !== authorId) {
      return res.status(403).json({ error: "Bạn không có quyền truy cập bài viết này." });
    }

    res.json(article);
  } catch (error) {
    next(error);
  }
});

// PUT /articles/:id — FIX #2: excerpt strip HTML | FIX #3: giữ ảnh cũ nếu không gửi ảnh mới
router.put("/articles/:id", requireAuth, requireContentManager, async (req, res, next) => {
  try {
    const { id } = req.params;
    const authorId = req.user.id;
    const userRole = req.user.role;
    const { title, content, category, status, thumbnail_url, image_url, source_url } = req.body;

    if (!title || !category || !status) {
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc của bài viết." });
    }
    if (!content && !source_url) {
      return res.status(400).json({ error: "Nội dung bài viết hoặc đường dẫn gốc không được để trống." });
    }

    const checkResult = await query("SELECT * FROM articles WHERE id = $1", [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy bài viết để cập nhật." });
    }

    const oldArticle = checkResult.rows[0];
    if (userRole !== "admin" && oldArticle.author_id !== authorId) {
      return res.status(403).json({ error: "Bạn không có quyền chỉnh sửa bài viết này." });
    }

    // FIX #3: fallback về ảnh cũ nếu không gửi ảnh mới
    const finalImageUrl = image_url || thumbnail_url || oldArticle.thumbnail_url || null;
    const publishedAt =
      status === "published" ? oldArticle.published_at || new Date() : null;

    const result = await withTransaction(async (client) => {
      const articleResult = await client.query(
        `UPDATE articles
         SET title = $1, content = $2, thumbnail_url = $3,
             category = $4::article_category, status = $5::article_status,
             published_at = $6, source_url = $7, updated_at = NOW()
         WHERE id = $8
         RETURNING *`,
        [title, content || "", finalImageUrl, category, status, publishedAt, source_url || null, id],
      );

      const updatedArticle = articleResult.rows[0];

      if (status === "published") {
        const profileResult = await client.query(
          "SELECT full_name FROM user_profiles WHERE user_id = $1",
          [updatedArticle.author_id],
        );
        const authorName = profileResult.rows[0]?.full_name || "JobReady AI";

        // FIX #2: strip HTML trước khi tạo excerpt
        const excerpt = generateExcerpt(content || "");
        const blogCategory = categoryMap[category] || "Kỹ năng nghề nghiệp";

        const blogCheck = await client.query(
          "SELECT 1 FROM blog_posts WHERE id = $1",
          [id],
        );

        if (blogCheck.rows.length > 0) {
          // FIX #3: dùng updatedArticle.thumbnail_url thay vì finalImageUrl local
          await client.query(
            `UPDATE blog_posts
             SET title = $1, content = $2, excerpt = $3, category = $4,
                 author = $5, image_url = $6, source_url = $7, updated_at = NOW()
             WHERE id = $8`,
            [
              title,
              content,
              excerpt,
              blogCategory,
              authorName,
              updatedArticle.thumbnail_url,
              updatedArticle.source_url,
              id,
            ],
          );
        } else {
          await client.query(
            `INSERT INTO blog_posts
               (id, title, content, excerpt, category, author, image_url, source_url, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
            [
              id,
              title,
              content,
              excerpt,
              blogCategory,
              authorName,
              updatedArticle.thumbnail_url,
              updatedArticle.source_url,
            ],
          );
        }
      } else {
        await client.query("DELETE FROM blog_posts WHERE id = $1", [id]);
      }

      return updatedArticle;
    });

    res.json({ success: true, article: result });
  } catch (error) {
    next(error);
  }
});

// DELETE /articles/:id
router.delete("/articles/:id", requireAuth, requireContentManager, async (req, res, next) => {
  try {
    const { id } = req.params;
    const authorId = req.user.id;
    const userRole = req.user.role;

    const check = await query("SELECT author_id FROM articles WHERE id = $1", [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy bài viết." });
    }

    const article = check.rows[0];
    if (userRole !== "admin" && article.author_id !== authorId) {
      return res.status(403).json({ error: "Bạn không có quyền xóa bài viết này." });
    }

    await withTransaction(async (client) => {
      await client.query("DELETE FROM articles WHERE id = $1", [id]);
      await client.query("DELETE FROM blog_posts WHERE id = $1", [id]);
    });

    res.json({ success: true, message: "Đã xóa bài viết thành công." });
  } catch (error) {
    next(error);
  }
});

export default router;