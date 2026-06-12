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

// ─── Plans Data ──────────────────────────────────────────────────────────────

const PLANS = {
  free: {
    id: "free",
    name: "Miễn phí",
    price: 0,
    period: "Mãi mãi",
    features: [
      { label: "Tạo tối đa 2 CV", included: true },
      { label: "3 buổi phỏng vấn AI / tháng", included: true },
      { label: "5 câu luyện tập / ngày", included: true },
      { label: "Template cơ bản", included: true },
      { label: "Template Premium", included: false },
      { label: "Xuất PDF không logo", included: false },
      { label: "Phân tích CV nâng cao", included: false },
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 99000,
    period: "tháng",
    popular: true,
    features: [
      { label: "Tạo tối đa 10 CV", included: true },
      { label: "20 buổi phỏng vấn AI / tháng", included: true },
      { label: "50 câu luyện tập / ngày", included: true },
      { label: "Template cơ bản", included: true },
      { label: "Template Premium", included: true },
      { label: "Xuất PDF không logo", included: true },
      { label: "Phân tích CV nâng cao", included: false },
    ],
  },
  ultra: {
    id: "ultra",
    name: "Ultra",
    price: 199000,
    period: "tháng",
    features: [
      { label: "Tạo CV không giới hạn", included: true },
      { label: "Phỏng vấn AI không giới hạn", included: true },
      { label: "Luyện tập không giới hạn", included: true },
      { label: "Template cơ bản", included: true },
      { label: "Template Premium", included: true },
      { label: "Xuất PDF không logo", included: true },
      { label: "Phân tích CV nâng cao", included: true },
    ],
  },
};

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET /plans — Trả về danh sách các gói
router.get("/plans", (_req, res) => {
  res.json({
    plans: Object.values(PLANS),
  });
});

// GET /me — Trả về gói hiện tại của user
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT subscription_plan, subscription_expires_at FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Người dùng không tồn tại." });
    }

    const user = result.rows[0];
    const currentPlan = user.subscription_plan || "free";
    const expiresAt = user.subscription_expires_at;

    // Kiểm tra nếu gói đã hết hạn thì tự động chuyển về free
    if (expiresAt && new Date(expiresAt) < new Date() && currentPlan !== "free") {
      await query(
        `UPDATE users SET subscription_plan = 'free', subscription_expires_at = NULL WHERE id = $1`,
        [userId]
      );

      // Cập nhật subscription record
      await query(
        `UPDATE user_subscriptions SET status = 'expired' WHERE user_id = $1 AND status = 'active'`,
        [userId]
      );

      return res.json({
        plan: "free",
        planInfo: PLANS.free,
        expiresAt: null,
        message: "Gói của bạn đã hết hạn và đã được chuyển về gói Miễn phí.",
      });
    }

    // Lấy lịch sử subscription
    const history = await query(
      `SELECT plan, status, started_at, expires_at, created_at
       FROM user_subscriptions
       WHERE user_id = $1
       ORDER BY created_at DESC LIMIT 10`,
      [userId]
    );

    res.json({
      plan: currentPlan,
      planInfo: PLANS[currentPlan] || PLANS.free,
      expiresAt: expiresAt || null,
      history: history.rows,
    });
  } catch (error) {
    next(error);
  }
});

// POST /upgrade — Nâng cấp gói
router.post("/upgrade", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { plan } = req.body;

    if (!plan || !["pro", "ultra"].includes(plan)) {
      return res.status(400).json({ error: "Gói không hợp lệ. Chọn 'pro' hoặc 'ultra'." });
    }

    // Kiểm tra gói hiện tại
    const userResult = await query(
      `SELECT subscription_plan, subscription_expires_at FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Người dùng không tồn tại." });
    }

    const currentPlan = userResult.rows[0].subscription_plan || "free";

    if (currentPlan === plan) {
      return res.status(400).json({ error: `Bạn đang sử dụng gói ${PLANS[plan].name} rồi.` });
    }

    // Tính ngày hết hạn (30 ngày)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await withTransaction(async (client) => {
      // Hủy subscription cũ (nếu có)
      await client.query(
        `UPDATE user_subscriptions SET status = 'cancelled' WHERE user_id = $1 AND status = 'active'`,
        [userId]
      );

      // Tạo subscription mới
      await client.query(
        `INSERT INTO user_subscriptions (user_id, plan, status, started_at, expires_at)
         VALUES ($1, $2, 'active', NOW(), $3)`,
        [userId, plan, expiresAt]
      );

      // Cập nhật user
      await client.query(
        `UPDATE users SET subscription_plan = $1, subscription_expires_at = $2, updated_at = NOW() WHERE id = $3`,
        [plan, expiresAt, userId]
      );
    });

    res.json({
      success: true,
      plan,
      planInfo: PLANS[plan],
      expiresAt: expiresAt.toISOString(),
      message: `Chúc mừng! Bạn đã nâng cấp thành công lên gói ${PLANS[plan].name}.`,
    });
  } catch (error) {
    next(error);
  }
});

// POST /cancel — Hủy gói (chuyển về free)
router.post("/cancel", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const userResult = await query(
      `SELECT subscription_plan FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Người dùng không tồn tại." });
    }

    const currentPlan = userResult.rows[0].subscription_plan || "free";

    if (currentPlan === "free") {
      return res.status(400).json({ error: "Bạn đang sử dụng gói Miễn phí, không thể hủy." });
    }

    await withTransaction(async (client) => {
      // Cập nhật subscription record
      await client.query(
        `UPDATE user_subscriptions SET status = 'cancelled' WHERE user_id = $1 AND status = 'active'`,
        [userId]
      );

      // Chuyển user về free
      await client.query(
        `UPDATE users SET subscription_plan = 'free', subscription_expires_at = NULL, updated_at = NOW() WHERE id = $1`,
        [userId]
      );
    });

    res.json({
      success: true,
      plan: "free",
      planInfo: PLANS.free,
      message: "Bạn đã hủy gói thành công. Tài khoản đã chuyển về gói Miễn phí.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
