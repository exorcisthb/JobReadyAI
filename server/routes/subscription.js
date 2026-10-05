import express from "express";
import { query, withTransaction } from "../config/database.js";
import { del } from "../utils/cache.js";
import { getUserPlanCached } from "../utils/userPlan.js";
import { getActivePromotion } from "./promotions.js";

const router = express.Router();



function requireAuth(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.user = { id: userId, role: req.header("x-user-role") ?? "user" };
  return next();
}


export const INTERVIEW_PLANS = {
  free: {
    id: "free",
    name: "free",
    weeklyPrice: 0,
    monthlyPrice: 0,
    discount: null,
    positioning: "Luyện tập cơ bản",
    period: "Mãi mãi",
    features: [
      { key: "ai_interview_sessions", label: "Phỏng vấn AI mock", weeklyValue: "2", monthlyValue: "2", included: true },
      { key: "feedback_reports",      label: "Báo cáo phản hồi cá nhân", weeklyValue: "basic", monthlyValue: "basic", included: true },
    ],
  },
  pro_interview: {
    id: "pro_interview",
    name: "pro_interview",
    weeklyPrice: 15000,
    monthlyPrice: 50000,
    discount: 20,
    positioning: "Phù hợp cho ứng viên đang tìm việc",
    period: "tháng",
    popular: true,
    features: [
      { key: "ai_interview_sessions", label: "Phỏng vấn AI mock", weeklyValue: "5", monthlyValue: "25", included: true },
      { key: "feedback_reports",      label: "Báo cáo phản hồi cá nhân", weeklyValue: "standard", monthlyValue: "standard", included: true },
    ],
  },
  ultra_interview: {
    id: "ultra_interview",
    name: "ultra_interview",
    weeklyPrice: 30000,
    monthlyPrice: 100000,
    discount: 25,
    positioning: "Toàn diện cho người chuyển ngành",
    period: "tháng",
    features: [
      { key: "ai_interview_sessions", label: "Phỏng vấn AI mock", weeklyValue: "unlimited", monthlyValue: "unlimited", included: true },
      { key: "feedback_reports",      label: "Báo cáo phản hồi cá nhân", weeklyValue: "star_full", monthlyValue: "star_full", included: true },
    ],
  },
};

export const CV_PLANS = {
  free: {
    id: "free",
    name: "free",
    weeklyPrice: 0,
    monthlyPrice: 0,
    discount: null,
    positioning: "Khởi đầu sự nghiệp",
    period: "Mãi mãi",
    features: [
      { key: "cv_creation",           label: "Tạo CV",            weeklyValue: "2", monthlyValue: "2",   included: true },
      { key: "cv_templates",          label: "Template CV",       weeklyValue: "all", monthlyValue: "all", included: true },
      { key: "pdf_export",            label: "Xuất PDF không logo", weeklyValue: "no", monthlyValue: "no", included: false },
      { key: "ai_cv_comparison",      label: "AI so sánh CV",     weeklyValue: "no", monthlyValue: "no",  included: false },
      { key: "ai_cv_optimization",    label: "AI tối ưu CV",      weeklyValue: "no", monthlyValue: "no",  included: false },
    ],
  },
  pro_cv: {
    id: "pro_cv",
    name: "pro_cv",
    weeklyPrice: 10000,
    monthlyPrice: 30000,
    discount: 20,
    positioning: "Thiết kế CV ấn tượng chuyên nghiệp",
    period: "tháng",
    popular: true,
    features: [
      { key: "cv_creation",           label: "Tạo CV",            weeklyValue: "10", monthlyValue: "50",              included: true },
      { key: "cv_templates",          label: "Template CV",       weeklyValue: "all", monthlyValue: "all",  included: true },
      { key: "pdf_export",            label: "Xuất PDF không logo", weeklyValue: "yes", monthlyValue: "yes",               included: true },
      { key: "ai_cv_comparison",      label: "AI so sánh CV",     weeklyValue: "yes", monthlyValue: "yes",               included: true },
      { key: "ai_cv_optimization",    label: "AI tối ưu CV",      weeklyValue: "yes", monthlyValue: "yes",               included: true },
    ],
  },
  ultra_cv: {
    id: "ultra_cv",
    name: "ultra_cv",
    weeklyPrice: 20000,
    monthlyPrice: 60000,
    discount: 25,
    positioning: "Tối ưu hóa ATS tối đa",
    period: "tháng",
    features: [
      { key: "cv_creation",           label: "Tạo CV",            weeklyValue: "unlimited", monthlyValue: "unlimited",   included: true },
      { key: "cv_templates",          label: "Template CV",       weeklyValue: "all", monthlyValue: "all",  included: true },
      { key: "pdf_export",            label: "Xuất PDF không logo", weeklyValue: "yes", monthlyValue: "yes",               included: true },
      { key: "ai_cv_comparison",      label: "AI so sánh CV",     weeklyValue: "yes", monthlyValue: "yes",               included: true },
      { key: "ai_cv_optimization",    label: "AI tối ưu CV",      weeklyValue: "yes", monthlyValue: "yes",               included: true },
    ],
  },
};

export async function getDynamicPlanPrices() {
  try {
    const res = await query("SELECT value FROM admin_settings WHERE key = 'plan_prices'");
    if (res.rows.length > 0 && res.rows[0].value) {
      const parsed = typeof res.rows[0].value === "string" ? JSON.parse(res.rows[0].value) : res.rows[0].value;
      return parsed;
    }
  } catch (err) {
    console.error("Error fetching plan_prices from DB:", err);
  }
  return {
    pro_interview: { weeklyPrice: 15000, monthlyPrice: 50000, discount: 20 },
    ultra_interview: { weeklyPrice: 30000, monthlyPrice: 100000, discount: 25 },
    pro_cv: { weeklyPrice: 10000, monthlyPrice: 30000, discount: 20 },
    ultra_cv: { weeklyPrice: 20000, monthlyPrice: 60000, discount: 25 },
  };
}

// Shared current catalog for the pricing page and support chatbot so prices,
// discounts, and included limits come from the same source of truth.
export async function getCurrentPlanCatalog() {
  const customPrices = await getDynamicPlanPrices();
  const activePromotion = await getActivePromotion();

  const applyPromoDiscount = (planId, defaultDiscount) => {
    let finalDiscount = defaultDiscount;
    if (activePromotion?.discountPercentage) {
      let targets = activePromotion.targetPlans;
      if (typeof targets === "string") {
        try { targets = JSON.parse(targets); } catch { targets = [targets]; }
      }
      const isTarget = !targets || !Array.isArray(targets) || targets.length === 0 || targets.includes(planId);
      if (isTarget && planId !== "free") {
        finalDiscount = Math.max(Number(defaultDiscount || 0), Number(activePromotion.discountPercentage));
      }
    }
    return finalDiscount;
  };

  const resolvePlans = (plans) => Object.values(plans).map((plan) => {
    const configured = customPrices[plan.id] || {};
    const defaultDiscount = configured.discount !== undefined && configured.discount !== null
      ? Number(configured.discount)
      : plan.discount;
    return {
      ...plan,
      weeklyPrice: Number(configured.weeklyPrice ?? plan.weeklyPrice),
      monthlyPrice: Number(configured.monthlyPrice ?? plan.monthlyPrice),
      discount: applyPromoDiscount(plan.id, defaultDiscount),
    };
  });

  return {
    interviewPlans: resolvePlans(INTERVIEW_PLANS),
    cvPlans: resolvePlans(CV_PLANS),
    activePromotion: activePromotion || null,
  };
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET /plans — Trả về danh sách các gói với giá & chiết khấu khuyến mãi mới nhất (nếu có chiến dịch sale hôm nay)
router.get("/plans", async (_req, res, next) => {
  try {
    const { interviewPlans, cvPlans, activePromotion } = await getCurrentPlanCatalog();
    res.set("Cache-Control", "no-cache");
    res.json({
      interviewPlans,
      cvPlans,
      activePromotion: activePromotion || null,
    });
  } catch (err) {
    next(err);
  }
});

// GET /me — Trả về các gói hiện tại của user (gồm Interview và CV)
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await getUserPlanCached(userId);
    if (!user) {
      return res.status(404).json({ error: "Người dùng không tồn tại." });
    }
    const referralResult = await query(
      `select referral_code, referral_discount_expires_at, discount_popup_pending, discount_offer_reason from users where id = $1`,
      [userId],
    );
    const referral = referralResult.rows[0] || {};

    let planInterview = user.sub_plan_interview || "free";
    let expiresInterview = user.sub_expires_interview;
    let planCv = user.sub_plan_cv || "free";
    let expiresCv = user.sub_expires_cv;

    const now = new Date();
    let updated = false;

    // Kiểm tra hết hạn cho gói Phỏng vấn
    if (expiresInterview && new Date(expiresInterview) < now && planInterview !== "free") {
      planInterview = "free";
      expiresInterview = null;
      updated = true;
      await query(
        `UPDATE user_subscriptions SET status = 'expired' WHERE user_id = $1 AND plan IN ('pro_interview', 'ultra_interview') AND status = 'active'`,
        [userId]
      );
    }

    // Kiểm tra hết hạn cho gói CV
    if (expiresCv && new Date(expiresCv) < now && planCv !== "free") {
      planCv = "free";
      expiresCv = null;
      updated = true;
      await query(
        `UPDATE user_subscriptions SET status = 'expired' WHERE user_id = $1 AND plan IN ('pro_cv', 'ultra_cv') AND status = 'active'`,
        [userId]
      );
    }

    if (updated) {
      await query(
        `UPDATE users SET sub_plan_interview = $1, sub_expires_interview = $2, sub_plan_cv = $3, sub_expires_cv = $4, updated_at = NOW() WHERE id = $5`,
        [planInterview, expiresInterview, planCv, expiresCv, userId]
      );
      del(`user_plan:${userId}`);
    }

    // Lấy lịch sử subscription
    const history = await query(
      `SELECT plan, status, started_at, expires_at, created_at
       FROM user_subscriptions
       WHERE user_id = $1
       ORDER BY created_at DESC LIMIT 10`,
      [userId]
    );

    const activeSubResult = await query(
      `SELECT plan, status FROM user_subscriptions WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );
    const activePlans = activeSubResult.rows.map(r => r.plan);
    const interviewAutoRenew = activePlans.some(p => ["pro_interview", "ultra_interview"].includes(p));
    const cvAutoRenew = activePlans.some(p => ["pro_cv", "ultra_cv"].includes(p));

    res.json({
      planInterview,
      planInterviewInfo: INTERVIEW_PLANS[planInterview] || INTERVIEW_PLANS.free,
      expiresInterview,
      planCv,
      planCvInfo: CV_PLANS[planCv] || CV_PLANS.free,
      expiresCv,
      interviewAutoRenew,
      cvAutoRenew,
      referralCode: referral.referral_code || null,
      referralDiscountExpiresAt: referral.referral_discount_expires_at || null,
      referralDiscountActive: Boolean(referral.referral_discount_expires_at && new Date(referral.referral_discount_expires_at) > now),
      discountPopupPending: Boolean(referral.discount_popup_pending),
      discountOfferReason: referral.discount_offer_reason || null,
      history: history.rows,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/discount-notification/acknowledge", requireAuth, async (req, res, next) => {
  try {
    await query(
      `update users set discount_popup_pending = false, updated_at = now() where id = $1`,
      [req.user.id],
    );
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});


// POST /cancel — Hủy gói (chuyển về free)
router.post("/cancel", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { target } = req.body; // 'interview' hoặc 'cv'

    if (!target || !["interview", "cv"].includes(target)) {
      return res.status(400).json({ error: "Lựa chọn gói huỷ không hợp lệ." });
    }

    const userResult = await query(
      `SELECT sub_plan_interview, sub_plan_cv FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Người dùng không tồn tại." });
    }

    const { sub_plan_interview, sub_plan_cv } = userResult.rows[0];

    if (target === "interview") {
      if (sub_plan_interview === "free") {
        return res.status(400).json({ error: "Bạn đang sử dụng gói Miễn phí Phỏng vấn, không thể hủy." });
      }

      await withTransaction(async (client) => {
        await client.query(
          `UPDATE user_subscriptions SET status = 'cancelled' WHERE user_id = $1 AND plan IN ('pro_interview', 'ultra_interview') AND status = 'active'`,
          [userId]
        );
      });

      return res.json({
        success: true,
        plan: sub_plan_interview,
        planInfo: INTERVIEW_PLANS[sub_plan_interview],
        message: "Bạn đã hủy gia hạn tự động thành công. Gói dịch vụ vẫn hoạt động cho đến ngày hết hạn.",
      });
    } else {
      if (sub_plan_cv === "free") {
        return res.status(400).json({ error: "Bạn đang sử dụng gói Miễn phí Tạo CV, không thể hủy." });
      }

      await withTransaction(async (client) => {
        await client.query(
          `UPDATE user_subscriptions SET status = 'cancelled' WHERE user_id = $1 AND plan IN ('pro_cv', 'ultra_cv') AND status = 'active'`,
          [userId]
        );
      });

      return res.json({
        success: true,
        plan: sub_plan_cv,
        planInfo: CV_PLANS[sub_plan_cv],
        message: "Bạn đã hủy gia hạn tự động thành công. Gói dịch vụ vẫn hoạt động cho đến ngày hết hạn.",
      });
    }
  } catch (error) {
    next(error);
  }
});



// GET /transactions — Lịch sử giao dịch tổng hợp của user
router.get("/transactions", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await query(
      `SELECT id, item_type, item_id, item_name, amount, payment_method, status, created_at
       FROM transactions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId]
    );
    res.json({ transactions: result.rows });
  } catch (error) {
    next(error);
  }
});

export default router;
