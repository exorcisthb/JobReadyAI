import express from "express";
import { query } from "../config/database.js";

const router = express.Router();

// Middleware yêu cầu quyền Admin
async function requireAdmin(req, res, next) {
  const userId = req.header("x-user-id");
  if (!userId) {
    return res.status(401).json({ error: "UNAUTHORIZED", message: "Yêu cầu đăng nhập." });
  }

  try {
    const result = await query("SELECT role FROM users WHERE id = $1", [userId]);
    if (result.rows.length === 0 || result.rows[0].role !== "admin") {
      return res.status(403).json({ error: "FORBIDDEN", message: "Quyền truy cập bị từ chối." });
    }
    req.user = { id: userId, role: "admin" };
    return next();
  } catch (err) {
    return next(err);
  }
}

/**
 * Cấu hình mặc định cho các Sự kiện cố định tự động
 */
export const DEFAULT_FIXED_PROMOTIONS = {
  black_friday: {
    enabled: true,
    discountPercentage: 40,
    bannerTitle: "🔥 SIÊU SALE BLACK FRIDAY: GIẢM 40% TẤT CẢ GÓI PRO & ULTRA!",
    bannerSubtitle: "Cơ hội nâng cấp tài khoản với ưu đãi lớn nhất năm. Đừng bỏ lỡ!",
    bannerTheme: "red",
  },
  double_11: {
    enabled: true,
    discountPercentage: 35,
    bannerTitle: "🔥 SIÊU SALE 11/11: GIẢM 35% TOÀN BỘ GÓI AI!",
    bannerSubtitle: "Ngày lễ Độc Thân — Nâng cấp bản thân cùng AI với mức giá cực hời!",
    bannerTheme: "red",
  },
  double_12: {
    enabled: true,
    discountPercentage: 35,
    bannerTitle: "🔥 SIÊU SALE 12/12: CHÀO NĂM MỚI GIẢM 35%!",
    bannerSubtitle: "Đợt giảm giá cuối cùng trong năm. Chuẩn bị sự nghiệp bứt phá!",
    bannerTheme: "purple",
  },
  new_year: {
    enabled: true,
    discountPercentage: 30,
    bannerTitle: "🎉 CHÀO NĂM MỚI 1/1: GIẢM 30% GÓI PHỎNG VẤN & CV AI!",
    bannerSubtitle: "Khai xuân bứt phá — Sở hữu ngay công cụ AI luyện phỏng vấn chuẩn CV.",
    bannerTheme: "amber",
  },
  double_days: {
    enabled: true,
    discountPercentage: 25,
    bannerTitle: "⚡ SIÊU SALE NGÀY ĐÔI: GIẢM 25% DUY NHẤT HÔM NAY!",
    bannerSubtitle: "Ưu đãi đặc biệt ngày đôi hàng tháng. Nâng cấp ngay hôm nay!",
    bannerTheme: "amber",
  },
};

export async function getFixedEventSettings() {
  try {
    const res = await query("SELECT value FROM admin_settings WHERE key = 'fixed_promotions'");
    if (res.rows.length > 0 && res.rows[0].value) {
      const parsed = typeof res.rows[0].value === "string" ? JSON.parse(res.rows[0].value) : res.rows[0].value;
      return { ...DEFAULT_FIXED_PROMOTIONS, ...parsed };
    }
  } catch (err) {
    console.error("Error fetching fixed_promotions from DB:", err);
  }
  return DEFAULT_FIXED_PROMOTIONS;
}

/**
 * Tính ngày Black Friday cho năm chỉ định (Thứ Sáu tuần thứ 4 của tháng 11)
 */
export function getBlackFridayDates(year = new Date().getFullYear()) {
  const novemberFirst = new Date(year, 10, 1); // Tháng 11 (0-indexed = 10)
  let dayOfWeek = novemberFirst.getDay(); // 0 = Sun, 5 = Fri
  let firstFriday = 1 + ((5 - dayOfWeek + 7) % 7);
  let fourthFridayDay = firstFriday + 21; // Thứ Sáu thứ 4

  const startDate = new Date(year, 10, fourthFridayDay, 0, 0, 0, 0);
  const endDate = new Date(year, 10, fourthFridayDay, 23, 59, 59, 999);

  return { startDate, endDate };
}

/**
 * Lấy chiến dịch khuyến mãi đang hoạt động hôm nay (Thủ công hoặc Tự động cố định)
 */
export async function getActivePromotion() {
  try {
    const now = new Date();

    // 1. Kiểm tra chiến dịch thủ công/tùy chỉnh trong CSDL đang hoạt động
    const res = await query(
      `SELECT id, name, event_type, start_date, end_date, discount_percentage, 
              banner_title, banner_subtitle, banner_theme, is_active, target_plans
       FROM promotional_campaigns
       WHERE is_active = true 
         AND $1 BETWEEN start_date AND end_date
       ORDER BY discount_percentage DESC
       LIMIT 1`,
      [now]
    );

    if (res.rows.length > 0) {
      const c = res.rows[0];
      return {
        id: c.id,
        name: c.name,
        eventType: c.event_type,
        startDate: c.start_date,
        endDate: c.end_date,
        discountPercentage: Number(c.discount_percentage),
        bannerTitle: c.banner_title,
        bannerSubtitle: c.banner_subtitle || "",
        bannerTheme: c.banner_theme || "amber",
        isActive: c.is_active,
        targetPlans: typeof c.target_plans === "string" ? JSON.parse(c.target_plans) : c.target_plans,
      };
    }

    // 2. Lấy cấu hình sự kiện cố định tự động từ DB
    const fixedSettings = await getFixedEventSettings();

    const month = now.getMonth() + 1; // 1-12
    const day = now.getDate();
    const year = now.getFullYear();

    // 2a. Kiểm tra Black Friday
    const bf = getBlackFridayDates(year);
    if (now >= bf.startDate && now <= bf.endDate && fixedSettings.black_friday?.enabled) {
      const conf = fixedSettings.black_friday;
      return {
        id: `black-friday-auto-${year}`,
        name: `Black Friday Sale ${year}`,
        eventType: "automatic",
        startDate: bf.startDate.toISOString(),
        endDate: bf.endDate.toISOString(),
        discountPercentage: Number(conf.discountPercentage || 40),
        bannerTitle: conf.bannerTitle || `🔥 SIÊU SALE BLACK FRIDAY ${year}: GIẢM ${conf.discountPercentage}% TẤT CẢ GÓI!`,
        bannerSubtitle: conf.bannerSubtitle || "Cơ hội nâng cấp tài khoản với ưu đãi lớn nhất năm. Đừng bỏ lỡ!",
        bannerTheme: conf.bannerTheme || "red",
        isActive: true,
        targetPlans: ["pro_interview", "ultra_interview", "pro_cv", "ultra_cv"],
      };
    }

    // 2b. Kiểm tra 11/11 (Singles' Day)
    if (month === 11 && day === 11 && fixedSettings.double_11?.enabled) {
      const conf = fixedSettings.double_11;
      const start = new Date(year, 10, 11, 0, 0, 0);
      const end = new Date(year, 10, 11, 23, 59, 59);
      return {
        id: `double-11-auto-${year}`,
        name: `Siêu Sale 11/11 (${year})`,
        eventType: "automatic",
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        discountPercentage: Number(conf.discountPercentage || 35),
        bannerTitle: conf.bannerTitle || `🔥 SIÊU SALE 11/11: GIẢM ${conf.discountPercentage}% TOÀN BỘ GÓI AI!`,
        bannerSubtitle: conf.bannerSubtitle || "Ngày lễ Độc Thân — Nâng cấp bản thân cùng AI với mức giá cực hời!",
        bannerTheme: conf.bannerTheme || "red",
        isActive: true,
        targetPlans: ["pro_interview", "ultra_interview", "pro_cv", "ultra_cv"],
      };
    }

    // 2c. Kiểm tra 12/12 (Year-End Sale)
    if (month === 12 && day === 12 && fixedSettings.double_12?.enabled) {
      const conf = fixedSettings.double_12;
      const start = new Date(year, 11, 12, 0, 0, 0);
      const end = new Date(year, 11, 12, 23, 59, 59);
      return {
        id: `double-12-auto-${year}`,
        name: `Siêu Sale 12/12 (${year})`,
        eventType: "automatic",
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        discountPercentage: Number(conf.discountPercentage || 35),
        bannerTitle: conf.bannerTitle || `🔥 SIÊU SALE 12/12: CHÀO NĂM MỚI GIẢM ${conf.discountPercentage}%!`,
        bannerSubtitle: conf.bannerSubtitle || "Đợt giảm giá cuối cùng trong năm. Chuẩn bị sự nghiệp bứt phá!",
        bannerTheme: conf.bannerTheme || "purple",
        isActive: true,
        targetPlans: ["pro_interview", "ultra_interview", "pro_cv", "ultra_cv"],
      };
    }

    // 2d. Kiểm tra 1/1 (Chào Năm Mới)
    if (month === 1 && day === 1 && fixedSettings.new_year?.enabled) {
      const conf = fixedSettings.new_year;
      const start = new Date(year, 0, 1, 0, 0, 0);
      const end = new Date(year, 0, 1, 23, 59, 59);
      return {
        id: `new-year-auto-${year}`,
        name: `Siêu Sale Khai Xuân 1/1 (${year})`,
        eventType: "automatic",
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        discountPercentage: Number(conf.discountPercentage || 30),
        bannerTitle: conf.bannerTitle || `🎉 CHÀO NĂM MỚI 1/1: GIẢM ${conf.discountPercentage}% GÓI AI!`,
        bannerSubtitle: conf.bannerSubtitle || "Khai xuân bứt phá — Sở hữu ngay công cụ AI luyện phỏng vấn chuẩn CV.",
        bannerTheme: conf.bannerTheme || "amber",
        isActive: true,
        targetPlans: ["pro_interview", "ultra_interview", "pro_cv", "ultra_cv"],
      };
    }

    // 2e. Kiểm tra Ngày Đôi Hàng Tháng (2/2, 3/3, 4/4, 5/5, 6/6, 7/7, 8/8, 9/9, 10/10)
    if (month === day && month >= 2 && month <= 10 && fixedSettings.double_days?.enabled) {
      const conf = fixedSettings.double_days;
      const start = new Date(year, month - 1, day, 0, 0, 0);
      const end = new Date(year, month - 1, day, 23, 59, 59);
      return {
        id: `double-day-auto-${month}-${day}-${year}`,
        name: `Siêu Sale Ngày Đôi ${day}/${month} (${year})`,
        eventType: "automatic",
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        discountPercentage: Number(conf.discountPercentage || 25),
        bannerTitle: conf.bannerTitle || `⚡ SIÊU SALE ${day}/${month}: GIẢM ${conf.discountPercentage}% DUY NHẤT HÔM NAY!`,
        bannerSubtitle: conf.bannerSubtitle || "Ưu đãi đặc biệt ngày đôi hàng tháng. Nâng cấp ngay hôm nay!",
        bannerTheme: conf.bannerTheme || "amber",
        isActive: true,
        targetPlans: ["pro_interview", "ultra_interview", "pro_cv", "ultra_cv"],
      };
    }

    // 2f. Kiểm tra các sự kiện cố định tùy chỉnh bổ sung trong fixedSettings
    for (const [key, conf] of Object.entries(fixedSettings)) {
      if (
        conf &&
        conf.enabled &&
        conf.month &&
        conf.day &&
        month === Number(conf.month) &&
        day === Number(conf.day)
      ) {
        const start = new Date(year, month - 1, day, 0, 0, 0);
        const end = new Date(year, month - 1, day, 23, 59, 59);
        return {
          id: `fixed-custom-${key}-${year}`,
          name: conf.name || `Sự kiện ${key}`,
          eventType: "automatic",
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          discountPercentage: Number(conf.discountPercentage || 25),
          bannerTitle: conf.bannerTitle || `⚡ SIÊU SALE GIẢM ${conf.discountPercentage}%!`,
          bannerSubtitle: conf.bannerSubtitle || "",
          bannerTheme: conf.bannerTheme || "amber",
          isActive: true,
          targetPlans: ["pro_interview", "ultra_interview", "pro_cv", "ultra_cv"],
        };
      }
    }
  } catch (err) {
    console.error("Lỗi khi kiểm tra chiến dịch khuyến mãi:", err);
  }

  return null;
}

// ─── PUBLIC ENDPOINTS ─────────────────────────────────────────────────────────

// GET /api/promotions/active — Lấy thông tin khuyến mãi đang diễn ra hôm nay
router.get("/active", async (_req, res, next) => {
  try {
    const promotion = await getActivePromotion();
    if (promotion) {
      return res.json({
        hasActiveSale: true,
        campaign: promotion,
      });
    }

    return res.json({
      hasActiveSale: false,
      campaign: null,
    });
  } catch (err) {
    next(err);
  }
});

// ─── ADMIN ENDPOINTS ──────────────────────────────────────────────────────────

// GET /api/admin/promotions/fixed-settings — Lấy cài đặt sự kiện cố định tự động
router.get("/admin/fixed-settings", requireAdmin, async (_req, res, next) => {
  try {
    const settings = await getFixedEventSettings();
    res.json({ success: true, settings });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/promotions/fixed-settings — Cập nhật cài đặt sự kiện cố định tự động
router.put("/admin/fixed-settings", requireAdmin, async (req, res, next) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== "object") {
      return res.status(400).json({ error: "BAD_REQUEST", message: "Dữ liệu không hợp lệ." });
    }

    await query(
      `INSERT INTO admin_settings (key, value, updated_at)
       VALUES ('fixed_promotions', $1, NOW())
       ON CONFLICT (key) DO UPDATE
       SET value = EXCLUDED.value, updated_at = NOW()`,
      [JSON.stringify(settings)]
    );

    res.json({
      success: true,
      settings,
      message: "Cập nhật chiết khấu sự kiện cố định tự động thành công!",
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/promotions — Danh sách chiến dịch khuyến mãi (Admin)
router.get("/admin/list", requireAdmin, async (_req, res, next) => {
  try {
    const result = await query(
      `SELECT id, name, event_type, start_date, end_date, discount_percentage, 
              banner_title, banner_subtitle, banner_theme, is_active, target_plans, created_at
       FROM promotional_campaigns
       ORDER BY start_date DESC`
    );

    const now = new Date();
    const bf = getBlackFridayDates(now.getFullYear());
    const fixedSettings = await getFixedEventSettings();

    res.json({
      campaigns: result.rows.map((c) => ({
        id: c.id,
        name: c.name,
        eventType: c.event_type,
        startDate: c.start_date,
        endDate: c.end_date,
        discountPercentage: Number(c.discount_percentage),
        bannerTitle: c.banner_title,
        bannerSubtitle: c.banner_subtitle || "",
        bannerTheme: c.banner_theme || "amber",
        isActive: c.is_active,
        targetPlans: typeof c.target_plans === "string" ? JSON.parse(c.target_plans) : c.target_plans,
        createdAt: c.created_at,
      })),
      blackFridayInfo: {
        year: now.getFullYear(),
        startDate: bf.startDate.toISOString(),
        endDate: bf.endDate.toISOString(),
        isToday: now >= bf.startDate && now <= bf.endDate,
      },
      fixedSettings,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/admin/promotions — Tạo chiến dịch khuyến mãi mới
router.post("/admin/create", requireAdmin, async (req, res, next) => {
  try {
    const {
      name,
      startDate,
      endDate,
      discountPercentage,
      bannerTitle,
      bannerSubtitle,
      bannerTheme,
      targetPlans,
    } = req.body;

    if (!name || !startDate || !endDate || !discountPercentage || !bannerTitle) {
      return res.status(400).json({ error: "BAD_REQUEST", message: "Vui lòng nhập đầy đủ các thông tin bắt buộc." });
    }

    const result = await query(
      `INSERT INTO promotional_campaigns 
        (name, event_type, start_date, end_date, discount_percentage, banner_title, banner_subtitle, banner_theme, is_active, target_plans)
       VALUES ($1, 'manual', $2, $3, $4, $5, $6, $7, true, $8)
       RETURNING *`,
      [
        name.trim(),
        new Date(startDate),
        new Date(endDate),
        Number(discountPercentage),
        bannerTitle.trim(),
        (bannerSubtitle || "").trim(),
        bannerTheme || "amber",
        JSON.stringify(targetPlans || ["pro_interview", "ultra_interview", "pro_cv", "ultra_cv"]),
      ]
    );

    res.json({
      success: true,
      campaign: result.rows[0],
      message: "Tạo chiến dịch khuyến mãi mới thành công!",
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/promotions/:id — Cập nhật chiến dịch khuyến mãi
router.put("/admin/update/:id", requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      startDate,
      endDate,
      discountPercentage,
      bannerTitle,
      bannerSubtitle,
      bannerTheme,
      isActive,
      targetPlans,
    } = req.body;

    const check = await query("SELECT id FROM promotional_campaigns WHERE id = $1", [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: "NOT_FOUND", message: "Chiến dịch không tồn tại." });
    }

    const result = await query(
      `UPDATE promotional_campaigns
       SET name = $1,
           start_date = $2,
           end_date = $3,
           discount_percentage = $4,
           banner_title = $5,
           banner_subtitle = $6,
           banner_theme = $7,
           is_active = $8,
           target_plans = $9,
           updated_at = NOW()
       WHERE id = $10
       RETURNING *`,
      [
        name,
        new Date(startDate),
        new Date(endDate),
        Number(discountPercentage),
        bannerTitle,
        bannerSubtitle || "",
        bannerTheme || "amber",
        Boolean(isActive),
        JSON.stringify(targetPlans || ["pro_interview", "ultra_interview", "pro_cv", "ultra_cv"]),
        id,
      ]
    );

    res.json({
      success: true,
      campaign: result.rows[0],
      message: "Cập nhật chiến dịch thành công!",
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/promotions/:id — Xóa chiến dịch khuyến mãi
router.delete("/admin/delete/:id", requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query("DELETE FROM promotional_campaigns WHERE id = $1 RETURNING id", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "NOT_FOUND", message: "Chiến dịch không tồn tại." });
    }

    res.json({
      success: true,
      message: "Đã xóa chiến dịch khuyến mãi thành công.",
    });
  } catch (err) {
    next(err);
  }
});

export default router;
