import express from "express";
import { query, withTransaction } from "../config/database.js";

const router = express.Router();


function requireAuth(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.user = { id: userId, role: req.header("x-user-role") ?? "user" };
  return next();
}


const PLANS = {
  free: {
    id: "free",
    name: "Miễn phí",
    weeklyPrice: 0,
    monthlyPrice: 0,
    discount: null,
    positioning: "Attract users, build habits",
    period: "Mãi mãi",
    features: [
      { key: "ai_interview_sessions", label: "Phỏng vấn AI mock", value: "2/tuần", included: true },
      { key: "feedback_reports",      label: "Báo cáo phản hồi cá nhân", value: "Cơ bản", included: true },
      { key: "cv_creation",           label: "Tạo CV",            value: "2 CV",   included: true },
      { key: "practice_exercises",    label: "Bài luyện tập",     value: "3/ngày", included: true },
      { key: "cv_templates",          label: "Template CV",       value: "Cơ bản", included: true },
      { key: "pdf_export",            label: "Xuất PDF không logo",value: "Không", included: false },
      { key: "advanced_cv_analysis",  label: "Phân tích CV nâng cao AI", value: "Không", included: false },
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    weeklyPrice: 25000,
    monthlyPrice: 80000,
    discount: 20,
    positioning: "Most popular — active job seekers",
    period: "tháng",
    popular: true,
    features: [
      { key: "ai_interview_sessions", label: "Phỏng vấn AI mock", value: "10/tuần",          included: true },
      { key: "feedback_reports",      label: "Báo cáo phản hồi cá nhân", value: "Tiêu chuẩn", included: true },
      { key: "cv_creation",           label: "Tạo CV",            value: "5 CV",              included: true },
      { key: "practice_exercises",    label: "Bài luyện tập",     value: "20/ngày",           included: true },
      { key: "cv_templates",          label: "Template CV",       value: "Cơ bản + Premium",  included: true },
      { key: "pdf_export",            label: "Xuất PDF không logo",value: "Có",               included: true },
      { key: "advanced_cv_analysis",  label: "Phân tích CV nâng cao AI", value: "Không",      included: false },
    ],
  },
  ultra: {
    id: "ultra",
    name: "Ultra",
    weeklyPrice: 50000,
    monthlyPrice: 160000,
    discount: 20,
    positioning: "Most comprehensive — career switchers",
    period: "tháng",
    features: [
      { key: "ai_interview_sessions", label: "Phỏng vấn AI mock", value: "Không giới hạn",   included: true },
      { key: "feedback_reports",      label: "Báo cáo phản hồi cá nhân", value: "Báo cáo STAR đầy đủ", included: true },
      { key: "cv_creation",           label: "Tạo CV",            value: "Không giới hạn",   included: true },
      { key: "practice_exercises",    label: "Bài luyện tập",     value: "Không giới hạn",   included: true },
      { key: "cv_templates",          label: "Template CV",       value: "Tất cả template",  included: true },
      { key: "pdf_export",            label: "Xuất PDF không logo",value: "Có",               included: true },
      { key: "advanced_cv_analysis",  label: "Phân tích CV nâng cao AI", value: "Có",         included: true },
    ],
  },
};


const ADDONS = {
  ai_mock_interview: {
    id: "ai_mock_interview",
    name: "Phỏng vấn AI Mock",
    price: 15000,
    unit: "session",
    unitLabel: "buổi",
    description: "Một buổi phỏng vấn giả lập toàn diện bằng AI với câu hỏi theo đúng vị trí ứng tuyển",
  },
  cv_optimization: {
    id: "cv_optimization",
    name: "Tối ưu hóa CV (1 vị trí)",
    price: 20000,
    unit: "CV",
    unitLabel: "CV",
    description: "AI viết lại và điều chỉnh CV phù hợp với mô tả công việc cụ thể, kèm chấm điểm ATS",
  },
  advanced_cv_analysis: {
    id: "advanced_cv_analysis",
    name: "Phân tích CV nâng cao + Báo cáo ATS",
    price: 25000,
    unit: "report",
    unitLabel: "báo cáo",
    description: "Phân tích chi tiết điểm yếu của CV và khoảng cách từ khóa so với vị trí mục tiêu",
  },
  star_feedback_report: {
    id: "star_feedback_report",
    name: "Báo cáo phản hồi STAR đầy đủ",
    price: 30000,
    unit: "report",
    unitLabel: "báo cáo",
    description: "Phân tích câu trả lời phỏng vấn theo khung STAR cá nhân hóa, kèm gợi ý cải thiện cụ thể",
  },
  premium_cv_template: {
    id: "premium_cv_template",
    name: "Template CV Premium + Xuất PDF (không logo)",
    price: 10000,
    unit: "export",
    unitLabel: "lượt xuất",
    description: "Mở khóa và tải xuống bất kỳ template premium nào dưới dạng PDF sạch, không có logo",
  },
};

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET /plans — Trả về danh sách các gói
router.get("/plans", (_req, res) => {
  res.json({
    plans: Object.values(PLANS),
  });
});

// GET /addons — Trả về danh sách dịch vụ add-on
router.get("/addons", (_req, res) => {
  res.json({
    addons: Object.values(ADDONS),
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

// POST /addon/purchase — Mua dịch vụ lẻ
router.post("/addon/purchase", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addonId, quantity = 1 } = req.body;

    if (!addonId || !ADDONS[addonId]) {
      return res.status(400).json({ error: "Dịch vụ không hợp lệ." });
    }

    const qty = Math.max(1, Math.min(10, parseInt(quantity, 10) || 1));
    const addon = ADDONS[addonId];
    const totalPrice = addon.price * qty;

    // Ghi nhận giao dịch
    const result = await query(
      `INSERT INTO user_addon_purchases
         (user_id, addon_id, addon_name, quantity, unit_price, total_price, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'completed')
       RETURNING id, created_at`,
      [userId, addonId, addon.name, qty, addon.price, totalPrice]
    );

    res.json({
      success: true,
      purchase: {
        id: result.rows[0].id,
        addonId,
        addonName: addon.name,
        quantity: qty,
        unitPrice: addon.price,
        totalPrice,
        unitLabel: addon.unitLabel,
        createdAt: result.rows[0].created_at,
      },
      message: `Mua thành công ${qty} ${addon.unitLabel} dịch vụ "${addon.name}".`,
    });
  } catch (error) {
    next(error);
  }
});

// GET /addon/history — Lịch sử mua dịch vụ lẻ
router.get("/addon/history", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Trả về rỗng nếu bảng chưa tồn tại
    const tableExists = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'user_addon_purchases'
      ) AS exists
    `);

    if (!tableExists.rows[0].exists) {
      return res.json({ history: [] });
    }

    const result = await query(
      `SELECT id, addon_id, addon_name, quantity, unit_price, total_price, status, created_at
       FROM user_addon_purchases
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [userId]
    );

    res.json({ history: result.rows });
  } catch (error) {
    next(error);
  }
});

export default router;
