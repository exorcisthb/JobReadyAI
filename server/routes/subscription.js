import express from "express";
import { query, withTransaction } from "../config/database.js";

const router = express.Router();


function requireAuth(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.user = { id: userId, role: req.header("x-user-role") ?? "user" };
  return next();
}


const INTERVIEW_PLANS = {
  free: {
    id: "free",
    name: "Miễn phí",
    weeklyPrice: 0,
    monthlyPrice: 0,
    positioning: "Luyện tập cơ bản",
    period: "Mãi mãi",
    features: [
      { key: "ai_interview_sessions", label: "Phỏng vấn AI mock", value: "2 lần / 1 tuần", included: true },
      { key: "feedback_reports",      label: "Báo cáo phản hồi cá nhân", value: "Cơ bản", included: true },
    ],
  },
  pro_interview: {
    id: "pro_interview",
    name: "Pro Phỏng vấn",
    weeklyPrice: 15000,
    monthlyPrice: 50000,
    positioning: "Phù hợp cho ứng viên đang tìm việc",
    period: "tháng",
    popular: true,
    features: [
      { key: "ai_interview_sessions", label: "Phỏng vấn AI mock", value: "10 lần / 1 tuần", included: true },
      { key: "feedback_reports",      label: "Báo cáo phản hồi cá nhân", value: "Tiêu chuẩn", included: true },
    ],
  },
  ultra_interview: {
    id: "ultra_interview",
    name: "Ultra Phỏng vấn",
    weeklyPrice: 30000,
    monthlyPrice: 100000,
    positioning: "Toàn diện cho người chuyển ngành",
    period: "tháng",
    features: [
      { key: "ai_interview_sessions", label: "Phỏng vấn AI mock", value: "Không giới hạn", included: true },
      { key: "feedback_reports",      label: "Báo cáo phản hồi cá nhân", value: "Báo cáo STAR đầy đủ", included: true },
    ],
  },
};

const CV_PLANS = {
  free: {
    id: "free",
    name: "Miễn phí",
    weeklyPrice: 0,
    monthlyPrice: 0,
    positioning: "Khởi đầu sự nghiệp",
    period: "Mãi mãi",
    features: [
      { key: "cv_creation",           label: "Tạo CV",            value: "2 CV",   included: true },
      { key: "cv_templates",          label: "Template CV",       value: "Cơ bản", included: true },
      { key: "pdf_export",            label: "Xuất PDF không logo",value: "Không", included: false },
      { key: "ai_cv_comparison",      label: "AI so sánh CV",     value: "Không",  included: false },
      { key: "ai_cv_optimization",    label: "AI tối ưu CV",      value: "Không",  included: false },
      { key: "advanced_cv_analysis",  label: "Phân tích CV nâng cao AI", value: "Không", included: false },
    ],
  },
  pro_cv: {
    id: "pro_cv",
    name: "Pro Tạo CV",
    weeklyPrice: 10000,
    monthlyPrice: 30000,
    positioning: "Thiết kế CV ấn tượng chuyên nghiệp",
    period: "tháng",
    popular: true,
    features: [
      { key: "cv_creation",           label: "Tạo CV",            value: "5 CV",              included: true },
      { key: "cv_templates",          label: "Template CV",       value: "Cơ bản + Premium",  included: true },
      { key: "pdf_export",            label: "Xuất PDF không logo",value: "Có",               included: true },
      { key: "ai_cv_comparison",      label: "AI so sánh CV",     value: "Có",               included: true },
      { key: "ai_cv_optimization",    label: "AI tối ưu CV",      value: "Có",               included: true },
      { key: "advanced_cv_analysis",  label: "Phân tích CV nâng cao AI", value: "Không",      included: false },
    ],
  },
  ultra_cv: {
    id: "ultra_cv",
    name: "Ultra Tạo CV",
    weeklyPrice: 20000,
    monthlyPrice: 60000,
    positioning: "Tối ưu hóa ATS tối đa",
    period: "tháng",
    features: [
      { key: "cv_creation",           label: "Tạo CV",            value: "Không giới hạn",   included: true },
      { key: "cv_templates",          label: "Template CV",       value: "Tất cả template",  included: true },
      { key: "pdf_export",            label: "Xuất PDF không logo",value: "Có",               included: true },
      { key: "ai_cv_comparison",      label: "AI so sánh CV",     value: "Có",               included: true },
      { key: "ai_cv_optimization",    label: "AI tối ưu CV",      value: "Có",               included: true },
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

// GET /plans — Trả về danh sách các gói (chia thành 2 phần)
router.get("/plans", (_req, res) => {
  res.json({
    interviewPlans: Object.values(INTERVIEW_PLANS),
    cvPlans: Object.values(CV_PLANS),
  });
});

// GET /addons — Trả về danh sách dịch vụ add-on
router.get("/addons", (_req, res) => {
  res.json({
    addons: Object.values(ADDONS),
  });
});

// GET /me — Trả về các gói hiện tại của user (gồm Interview và CV)
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await query(
      `SELECT sub_plan_interview, sub_expires_interview, sub_plan_cv, sub_expires_cv FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Người dùng không tồn tại." });
    }

    const user = result.rows[0];
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
      history: history.rows,
    });
  } catch (error) {
    next(error);
  }
});

// POST /upgrade — Nâng cấp gói (Interview hoặc CV)
router.post("/upgrade", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { plan, billingCycle = "monthly", paymentMethod = "credit_card" } = req.body;

    const isInterview = ["pro_interview", "ultra_interview"].includes(plan);
    const isCv = ["pro_cv", "ultra_cv"].includes(plan);

    if (!isInterview && !isCv) {
      return res.status(400).json({ error: "Gói nâng cấp không hợp lệ." });
    }

    // Lấy thông tin gói tương ứng
    const planInfo = isInterview ? INTERVIEW_PLANS[plan] : CV_PLANS[plan];
    if (!planInfo) {
      return res.status(400).json({ error: "Không tìm thấy cấu hình gói." });
    }

    const userResult = await query(
      `SELECT sub_plan_interview, sub_plan_cv FROM users WHERE id = $1`,
      [userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Người dùng không tồn tại." });
    }
    const currentUser = userResult.rows[0];

    // Kiểm tra xem gói hiện tại có đang tự động gia hạn (active) hay đã hủy (cancelled)
    const activeSub = await query(
      `SELECT status FROM user_subscriptions 
       WHERE user_id = $1 AND plan = $2 AND status = 'active'`,
      [userId, isInterview ? currentUser.sub_plan_interview : currentUser.sub_plan_cv]
    );
    const hasActiveRenewal = activeSub.rows.length > 0;

    // Ngăn chặn hạ cấp (chỉ chặn khi gói hiện tại đang tự động gia hạn)
    if (hasActiveRenewal) {
      if (isInterview) {
        if (currentUser.sub_plan_interview === "ultra_interview" && plan === "pro_interview") {
          return res.status(400).json({ error: "Bạn không thể mua gói Pro khi đang sử dụng gói Ultra." });
        }
      } else {
        if (currentUser.sub_plan_cv === "ultra_cv" && plan === "pro_cv") {
          return res.status(400).json({ error: "Bạn không thể mua gói Pro khi đang sử dụng gói Ultra." });
        }
      }
    }

    // Tính ngày hết hạn (30 ngày nếu tháng, 7 ngày nếu tuần)
    const expiresAt = new Date();
    if (billingCycle === "weekly") {
      expiresAt.setDate(expiresAt.getDate() + 7);
    } else {
      expiresAt.setDate(expiresAt.getDate() + 30);
    }

    // Tính tiền
    const amount = billingCycle === "weekly" ? planInfo.weeklyPrice : planInfo.monthlyPrice;
    const planDisplayName = `${planInfo.name} (${billingCycle === "weekly" ? "Tuần" : "Tháng"})`;

    await withTransaction(async (client) => {
      // Hủy subscription cũ cùng loại (nếu có)
      const oldPlans = isInterview 
        ? "('pro_interview', 'ultra_interview')" 
        : "('pro_cv', 'ultra_cv')";

      await client.query(
        `UPDATE user_subscriptions SET status = 'cancelled' WHERE user_id = $1 AND plan IN ${oldPlans} AND status = 'active'`,
        [userId]
      );

      // Tạo subscription mới
      await client.query(
        `INSERT INTO user_subscriptions (user_id, plan, status, started_at, expires_at)
         VALUES ($1, $2, 'active', NOW(), $3)`,
        [userId, plan, expiresAt]
      );

      // Cập nhật trường subscription tương ứng trên bảng users
      if (isInterview) {
        await client.query(
          `UPDATE users SET sub_plan_interview = $1, sub_expires_interview = $2, updated_at = NOW() WHERE id = $3`,
          [plan, expiresAt, userId]
        );
      } else {
        await client.query(
          `UPDATE users SET sub_plan_cv = $1, sub_expires_cv = $2, updated_at = NOW() WHERE id = $3`,
          [plan, expiresAt, userId]
        );
      }

      // Ghi nhận lịch sử giao dịch thanh toán
      await client.query(
        `INSERT INTO transactions (user_id, item_type, item_id, item_name, amount, payment_method, status)
         VALUES ($1, 'subscription', $2, $3, $4, $5, 'completed')`,
        [userId, plan, planDisplayName, amount, paymentMethod]
      );
    });

    res.json({
      success: true,
      plan,
      planInfo,
      expiresAt: expiresAt.toISOString(),
      message: `Chúc mừng! Bạn đã nâng cấp thành công lên gói ${planInfo.name}.`,
    });
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

// POST /addon/purchase — Mua dịch vụ lẻ
router.post("/addon/purchase", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { addonId, quantity = 1, paymentMethod = "credit_card" } = req.body;

    if (!addonId || !ADDONS[addonId]) {
      return res.status(400).json({ error: "Dịch vụ không hợp lệ." });
    }

    const qty = Math.max(1, Math.min(10, parseInt(quantity, 10) || 1));
    const addon = ADDONS[addonId];
    const totalPrice = addon.price * qty;

    await withTransaction(async (client) => {
      // Ghi nhận giao dịch vào bảng user_addon_purchases
      await client.query(
        `INSERT INTO user_addon_purchases
           (user_id, addon_id, addon_name, quantity, unit_price, total_price, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'completed')`,
        [userId, addonId, addon.name, qty, addon.price, totalPrice]
      );

      // Ghi nhận vào bảng transactions
      await client.query(
        `INSERT INTO transactions (user_id, item_type, item_id, item_name, amount, payment_method, status)
         VALUES ($1, 'addon', $2, $3, $4, $5, 'completed')`,
        [userId, addonId, `${addon.name} (x${qty})`, totalPrice, paymentMethod]
      );
    });

    res.json({
      success: true,
      purchase: {
        addonId,
        addonName: addon.name,
        quantity: qty,
        unitPrice: addon.price,
        totalPrice,
        unitLabel: addon.unitLabel,
        createdAt: new Date().toISOString(),
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
