import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/components/auth-provider";
import { useTheme } from "@/components/theme-provider";
import { getThemePalette } from "@/components/QuotaExceededPromoModal";
import { DashboardHeader, type NavItem } from "@/components/dashboard-header";
import { AnimatedDeleteButton } from "@/components/AnimatedDeleteButton";
import {
  Flame,
  Headset,
  Plus,
  Trash2,
  Edit,
  Tag,
  Clock,
  Sparkles,
  ArrowLeft,
  Loader2,
  Eye,
  RefreshCw,
  Zap,
  Save,
  ChevronLeft,
  ChevronRight,
  X,
  BarChart3,
  Users,
  CreditCard,
  ShieldCheck,
  Activity,
  Wrench,
  Calendar,
  Gift,
  Crown,
} from "lucide-react";
import { toast } from "sonner";

const adminNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <BarChart3 className="h-5 w-5" />, href: "/admin/dashboard" },
  { label: "Người dùng", icon: <Users className="h-5 w-5" />, href: "/admin/users" },
  { label: "Tài chính", icon: <CreditCard className="h-5 w-5" />, href: "/admin/finance" },
  { label: "Khuyến mãi", icon: <Flame className="h-5 w-5" />, href: "/admin/promotions" },
  { label: "Bảo mật", icon: <ShieldCheck className="h-5 w-5" />, href: "/admin/security" },
  { label: "User Activity", icon: <Activity className="h-5 w-5" />, href: "/admin/user-activity" },
  { label: "Hỗ trợ", icon: <Headset className="h-5 w-5" />, href: "/admin/support" },
  { label: "Bảo trì", icon: <Wrench className="h-5 w-5" />, href: "/admin/maintenance" },
];

export type Campaign = {
  id: string;
  name: string;
  eventType: "manual" | "automatic";
  startDate: string;
  endDate: string;
  discountPercentage: number;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerTheme: "amber" | "red" | "purple" | "emerald";
  isActive: boolean;
  targetPlans: string[];
  createdAt?: string;
};

export type FixedEventConfig = {
  name?: string;
  dateDesc?: string;
  month?: number;
  day?: number;
  enabled: boolean;
  discountPercentage: number;
  bannerTitle: string;
  bannerSubtitle?: string;
  bannerTheme?: string;
};

export type FixedEventSettings = Record<string, FixedEventConfig>;

const DEFAULT_FIXED_SETTINGS: FixedEventSettings = {
  black_friday: {
    name: "Black Friday Sale",
    dateDesc: "Thứ Sáu tuần thứ 4 tháng 11 hàng năm",
    enabled: true,
    discountPercentage: 40,
    bannerTitle: "🔥 SIÊU SALE BLACK FRIDAY: GIẢM 40% TẤT CẢ GÓI PRO & ULTRA!",
    bannerSubtitle: "Cơ hội nâng cấp tài khoản với ưu đãi lớn nhất năm. Đừng bỏ lỡ!",
    bannerTheme: "red",
  },
  double_11: {
    name: "Siêu Sale 11/11 (Singles' Day)",
    dateDesc: "Ngày 11 tháng 11 hàng năm",
    month: 11,
    day: 11,
    enabled: true,
    discountPercentage: 35,
    bannerTitle: "🔥 SIÊU SALE 11/11: GIẢM 35% TOÀN BỘ GÓI AI!",
    bannerSubtitle: "Ngày lễ Độc Thân — Nâng cấp bản thân cùng AI với mức giá cực hời!",
    bannerTheme: "red",
  },
  double_12: {
    name: "Siêu Sale 12/12 (Chào Năm Mới)",
    dateDesc: "Ngày 12 tháng 12 hàng năm",
    month: 12,
    day: 12,
    enabled: true,
    discountPercentage: 35,
    bannerTitle: "🔥 SIÊU SALE 12/12: CHÀO NĂM MỚI GIẢM 35%!",
    bannerSubtitle: "Đợt giảm giá cuối cùng trong năm. Chuẩn bị sự nghiệp bứt phá!",
    bannerTheme: "purple",
  },
  new_year: {
    name: "Siêu Sale Khai Xuân 1/1",
    dateDesc: "Ngày 01 tháng 01 hàng năm",
    month: 1,
    day: 1,
    enabled: true,
    discountPercentage: 30,
    bannerTitle: "🎉 CHÀO NĂM MỚI 1/1: GIẢM 30% GÓI PHỎNG VẤN & CV AI!",
    bannerSubtitle: "Khai xuân bứt phá — Sở hữu ngay công cụ AI luyện phỏng vấn chuẩn CV.",
    bannerTheme: "amber",
  },
  double_days: {
    name: "Ngày Đôi Hàng Tháng (2/2 - 10/10)",
    dateDesc: "Các ngày trùng tháng trong năm",
    enabled: true,
    discountPercentage: 25,
    bannerTitle: "⚡ SIÊU SALE NGÀY ĐÔI: GIẢM 25% DUY NHẤT HÔM NAY!",
    bannerSubtitle: "Ưu đãi đặc biệt ngày đôi hàng tháng. Nâng cấp ngay hôm nay!",
    bannerTheme: "amber",
  },
};

const themeGradients: Record<string, string> = {
  purple: "from-indigo-600 via-purple-600 to-pink-600",
  amber: "from-amber-600 via-orange-600 to-red-600",
  red: "from-red-700 via-rose-700 to-purple-900",
  emerald: "from-emerald-600 via-teal-600 to-cyan-700",
};

export type UnifiedCampaign = Campaign & {
  isFixed?: boolean;
  fixedKey?: string;
  month?: number;
  day?: number;
};

// Format ISO date string into datetime-local string (YYYY-MM-DDTHH:mm)
function formatForDateTimeInput(dateStr?: string) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return "";
  }
}

export function PromotionsAdminPage() {
  const { user, logout } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [fixedSettings, setFixedSettings] = useState<FixedEventSettings>(DEFAULT_FIXED_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [savingFixed, setSavingFixed] = useState(false);
  const [saving, setSaving] = useState(false);

  // View state: "all" (Main Unified View) | "fixed" (Fixed Events Screen)
  const [currentView, setCurrentView] = useState<"all" | "fixed">("all");

  // Popup Modals State
  const [showCreateManualModal, setShowCreateManualModal] = useState(false);
  const [showCreateFixedModal, setShowCreateFixedModal] = useState(false);
  const [editingItem, setEditingItem] = useState<UnifiedCampaign | null>(null);
  const [previewCampaign, setPreviewCampaign] = useState<UnifiedCampaign | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formDiscount, setFormDiscount] = useState(30);
  const [formBannerTitle, setFormBannerTitle] = useState("");
  const [formBannerSubtitle, setFormBannerSubtitle] = useState("");
  const [formBannerTheme, setFormBannerTheme] = useState<"amber" | "red" | "purple" | "emerald">("purple");
  const [formFixedEnabled, setFormFixedEnabled] = useState(true);
  const [formFixedMonth, setFormFixedMonth] = useState<number | string>(1);
  const [formFixedDay, setFormFixedDay] = useState<number | string>(1);
  const [formFixedDateDesc, setFormFixedDateDesc] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Quota Exceeded Promo State
  const [showQuotaPromoModal, setShowQuotaPromoModal] = useState(false);
  const [quotaPromo, setQuotaPromo] = useState({
    enabled: true,
    discountPercentage: 20,
    countdownMinutes: 30,
    title: "🎉 Ưu đãi đặc biệt dành riêng cho bạn!",
    subtitle: "Nâng cấp ngay trong thời gian giới hạn để nhận ưu đãi độc quyền!",
  });
  const [savingQuotaPromo, setSavingQuotaPromo] = useState(false);
  const [loadingQuotaPromo, setLoadingQuotaPromo] = useState(false);

  // Synchronized Theme & Flexible Time Input State for Promo Modal
  let activeSiteTheme: "light" | "dark" | "rose" = "dark";
  try {
    const { theme } = useTheme();
    if (theme === "light" || theme === "dark" || theme === "rose") activeSiteTheme = theme;
  } catch {
    // fallback
  }
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark" | "rose">(activeSiteTheme);
  const [timeInputMode, setTimeInputMode] = useState<"hms" | "direct">("hms");

  useEffect(() => {
    setPreviewTheme(activeSiteTheme);
  }, [activeSiteTheme]);

  const nowIsoMin = useMemo(() => formatForDateTimeInput(new Date().toISOString()), []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/promotions/admin/list", {
        headers: {
          "x-user-id": user?.id ?? "",
          "x-user-role": user?.role ?? "admin",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
        if (data.fixedSettings) {
          setFixedSettings({ ...DEFAULT_FIXED_SETTINGS, ...data.fixedSettings });
        }
      } else {
        toast.error("Không thể tải danh sách chiến dịch.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Fetch quota exceeded promo settings
  const fetchQuotaPromo = async () => {
    setLoadingQuotaPromo(true);
    try {
      const res = await fetch("/api/promotions/admin/quota-exceeded-promo", {
        headers: {
          "x-user-id": user?.id ?? "",
          "x-user-role": user?.role ?? "admin",
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.promo) setQuotaPromo(data.promo);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuotaPromo(false);
    }
  };

  const handleSaveQuotaPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quotaPromo.discountPercentage < 1 || quotaPromo.discountPercentage > 90) {
      toast.error("Phần trăm giảm giá phải từ 1% đến 90%!");
      return;
    }
    if (quotaPromo.countdownMinutes < 0.1 || quotaPromo.countdownMinutes > 10080) {
      toast.error("Thời gian đếm ngược phải từ 6 giây đến 10080 phút (7 ngày)!");
      return;
    }
    setSavingQuotaPromo(true);
    try {
      const res = await fetch("/api/promotions/admin/quota-exceeded-promo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id ?? "",
          "x-user-role": user?.role ?? "admin",
        },
        body: JSON.stringify(quotaPromo),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Đã lưu cài đặt khuyến mãi hết lượt thành công!");
        setShowQuotaPromoModal(false);
      } else {
        toast.error(data.message || "Không thể lưu cài đặt.");
      }
    } catch {
      toast.error("Lỗi kết nối máy chủ.");
    } finally {
      setSavingQuotaPromo(false);
    }
  };

  const handleSaveFixedSettings = async (updatedSettings: FixedEventSettings) => {
    setSavingFixed(true);
    try {
      const res = await fetch("/api/promotions/admin/fixed-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id ?? "",
          "x-user-role": user?.role ?? "admin",
        },
        body: JSON.stringify({ settings: updatedSettings }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFixedSettings(updatedSettings);
        fetchCampaigns();
        return true;
      } else {
        toast.error(data.message || "Không thể lưu cài đặt sự kiện cố định.");
        return false;
      }
    } catch (err) {
      toast.error("Lỗi kết nối máy chủ.");
      return false;
    } finally {
      setSavingFixed(false);
    }
  };

  const resetFormFields = () => {
    setFormName("");
    setFormStartDate("");
    setFormEndDate("");
    setFormDiscount(30);
    setFormBannerTitle("");
    setFormBannerSubtitle("");
    setFormBannerTheme("purple");
    setFormFixedEnabled(true);
    setFormFixedMonth(1);
    setFormFixedDay(1);
    setFormFixedDateDesc("");
  };

  // Open Create Manual Campaign Modal
  const handleOpenCreateManual = () => {
    resetFormFields();
    setShowCreateManualModal(true);
  };

  // Open Create Fixed Event Modal
  const handleOpenCreateFixed = () => {
    resetFormFields();
    setShowCreateFixedModal(true);
  };

  // Open Edit Modal (Handles both custom manual and fixed campaigns)
  const handleOpenEditModal = (item: UnifiedCampaign) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormDiscount(item.discountPercentage);
    setFormBannerTitle(item.bannerTitle);
    setFormBannerSubtitle(item.bannerSubtitle || "");
    setFormBannerTheme((item.bannerTheme as any) || "purple");
    setFormFixedEnabled(item.isActive);

    if (!item.isFixed) {
      setFormStartDate(formatForDateTimeInput(item.startDate));
      setFormEndDate(formatForDateTimeInput(item.endDate));
    } else if (item.fixedKey) {
      const conf = fixedSettings[item.fixedKey];
      if (conf) {
        setFormFixedMonth(conf.month || 1);
        setFormFixedDay(conf.day || 1);
        setFormFixedDateDesc(conf.dateDesc || item.startDate);
      }
    }
  };

  /**
   * Validate Fixed Event (Name, Banner Title, Discount %, Month 1-12, Day 1-31)
   */
  const validateFixedForm = (
    nameVal: string,
    bannerTitleVal: string,
    discountVal: number,
    monthVal: number | string,
    dayVal: number | string
  ) => {
    if (!nameVal.trim()) {
      toast.error("Vui lòng nhập tên sự kiện cố định!");
      return false;
    }
    if (!bannerTitleVal.trim()) {
      toast.error("Vui lòng nhập tiêu đề banner!");
      return false;
    }
    if (isNaN(discountVal) || discountVal < 5 || discountVal > 90) {
      toast.error("Phần trăm giảm giá phải nằm trong khoảng từ 5% đến 90%!");
      return false;
    }

    const m = Number(monthVal);
    const d = Number(dayVal);

    if (isNaN(m) || m < 1 || m > 12) {
      toast.error("Tháng tổ chức phải từ 1 đến 12!");
      return false;
    }
    if (isNaN(d) || d < 1 || d > 31) {
      toast.error("Ngày tổ chức phải từ 1 đến 31!");
      return false;
    }

    const maxDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (d > maxDays[m - 1]) {
      toast.error(`Tháng ${m} chỉ có tối đa ${maxDays[m - 1]} ngày. Vui lòng kiểm tra lại ngày!`);
      return false;
    }

    return true;
  };

  /**
   * Validate Custom Flash Sale fields (Start >= Now, End > Start, End >= Now)
   */
  const validateManualForm = (
    nameVal: string,
    startStr: string,
    endStr: string,
    discountVal: number,
    bannerTitleVal: string,
    isEditing: boolean,
    originalStartStr?: string
  ) => {
    if (!nameVal.trim()) {
      toast.error("Vui lòng nhập tên chiến dịch!");
      return false;
    }
    if (!bannerTitleVal.trim()) {
      toast.error("Vui lòng nhập tiêu đề banner!");
      return false;
    }
    if (isNaN(discountVal) || discountVal < 5 || discountVal > 90) {
      toast.error("Phần trăm giảm giá phải nằm trong khoảng từ 5% đến 90%!");
      return false;
    }
    if (!startStr || !endStr) {
      toast.error("Vui lòng chọn đầy đủ thời gian bắt đầu và kết thúc!");
      return false;
    }

    const now = new Date();
    const start = new Date(startStr);
    const end = new Date(endStr);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      toast.error("Định dạng thời gian nhập vào không hợp lệ!");
      return false;
    }

    const nowBuffer = now.getTime() - 2 * 60 * 1000;

    // Check if start date was modified during edit
    const isStartChanged = originalStartStr && formatForDateTimeInput(originalStartStr) !== startStr;
    if (!isEditing || isStartChanged) {
      if (start.getTime() < nowBuffer) {
        toast.error("Thời gian bắt đầu không được ở trong quá khứ! Vui lòng chọn mốc thời gian từ hiện tại trở đi.");
        return false;
      }
    }

    if (end.getTime() <= start.getTime()) {
      toast.error("Thời gian kết thúc không thể sớm hơn hoặc bằng thời gian bắt đầu!");
      return false;
    }

    if (end.getTime() < nowBuffer) {
      toast.error("Thời gian kết thúc không thể ở trong quá khứ!");
      return false;
    }

    return true;
  };

  // Submit Handler for Custom Flash Sale (Create or Edit)
  const handleSaveCustomCampaign = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEditing = Boolean(editingItem && !editingItem.isFixed);
    const originalStart = isEditing ? editingItem?.startDate : undefined;

    if (!validateManualForm(formName, formStartDate, formEndDate, formDiscount, formBannerTitle, isEditing, originalStart)) {
      return;
    }

    setSaving(true);
    try {
      const endpoint = isEditing
        ? `/api/promotions/admin/update/${editingItem!.id}`
        : "/api/promotions/admin/create";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id ?? "",
          "x-user-role": user?.role ?? "admin",
        },
        body: JSON.stringify({
          name: formName.trim(),
          startDate: new Date(formStartDate).toISOString(),
          endDate: new Date(formEndDate).toISOString(),
          discountPercentage: Number(formDiscount),
          bannerTitle: formBannerTitle.trim(),
          bannerSubtitle: formBannerSubtitle.trim(),
          bannerTheme: formBannerTheme,
          isActive: true,
          targetPlans: ["pro_interview", "ultra_interview", "pro_cv", "ultra_cv"],
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || (isEditing ? "Đã cập nhật chiến dịch!" : "Đã tạo chiến dịch thành công!"));
        fetchCampaigns();
        setShowCreateManualModal(false);
        setEditingItem(null);
      } else {
        toast.error(data.message || "Không thể lưu chiến dịch.");
      }
    } catch (err) {
      toast.error("Lỗi kết nối máy chủ.");
    } finally {
      setSaving(false);
    }
  };

  // Submit Handler for Fixed Campaign Edit
  const handleSaveFixedCampaignModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.fixedKey) return;

    if (!validateFixedForm(formName, formBannerTitle, formDiscount, formFixedMonth, formFixedDay)) {
      return;
    }

    const key = editingItem.fixedKey;
    const updated = {
      ...fixedSettings,
      [key]: {
        ...fixedSettings[key],
        name: formName.trim(),
        enabled: formFixedEnabled,
        discountPercentage: Number(formDiscount),
        bannerTitle: formBannerTitle.trim(),
        bannerSubtitle: formBannerSubtitle.trim(),
        bannerTheme: formBannerTheme,
        month: Number(formFixedMonth),
        day: Number(formFixedDay),
        dateDesc: formFixedDateDesc.trim() || `Ngày ${formFixedDay} tháng ${formFixedMonth} hàng năm`,
      },
    };

    const success = await handleSaveFixedSettings(updated);
    if (success) {
      toast.success(`Đã cập nhật sự kiện cố định "${formName}" thành công!`);
      setEditingItem(null);
    }
  };

  // Submit Handler for Creating Brand New Fixed Event
  const handleCreateNewFixedCampaign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFixedForm(formName, formBannerTitle, formDiscount, formFixedMonth, formFixedDay)) {
      return;
    }

    const eventKey = `custom_${Date.now()}_${formName.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 15)}`;
    const monthNum = Number(formFixedMonth);
    const dayNum = Number(formFixedDay);
    const dateDescription = formFixedDateDesc.trim() || `Ngày ${dayNum} tháng ${monthNum} hàng năm`;

    const updated = {
      ...fixedSettings,
      [eventKey]: {
        name: formName.trim(),
        dateDesc: dateDescription,
        month: monthNum,
        day: dayNum,
        enabled: true,
        discountPercentage: Number(formDiscount),
        bannerTitle: formBannerTitle.trim(),
        bannerSubtitle: formBannerSubtitle.trim(),
        bannerTheme: formBannerTheme,
      },
    };

    const success = await handleSaveFixedSettings(updated);
    if (success) {
      toast.success(`Đã thêm mới sự kiện cố định "${formName}" thành công!`);
      setShowCreateFixedModal(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa chiến dịch khuyến mãi này?")) return;

    try {
      const res = await fetch(`/api/promotions/admin/delete/${id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": user?.id ?? "",
          "x-user-role": user?.role ?? "admin",
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Đã xóa chiến dịch thành công.");
        fetchCampaigns();
      } else {
        toast.error(data.message || "Không thể xóa chiến dịch.");
      }
    } catch (err) {
      toast.error("Lỗi kết nối máy chủ.");
    }
  };

  const handleDeleteFixed = async (key: string) => {
    const conf = fixedSettings[key];
    const eventName = conf?.name || key;
    if (!confirm(`Bạn có chắc chắn muốn xóa chiến dịch cố định "${eventName}"?`)) return;

    const updatedSettings = { ...fixedSettings };
    delete updatedSettings[key];

    const success = await handleSaveFixedSettings(updatedSettings);
    if (success) {
      toast.success(`Đã xóa sự kiện cố định "${eventName}".`);
    }
  };

  // Convert fixedSettings object into array of Fixed Event UnifiedCampaigns
  const fixedCampaignsList = useMemo<UnifiedCampaign[]>(() => {
    return Object.keys(fixedSettings).map((key) => {
      const conf = fixedSettings[key];
      return {
        id: `fixed-${key}`,
        name: conf.name || `Sự kiện ${key}`,
        eventType: "automatic",
        startDate: conf.dateDesc || (conf.month && conf.day ? `Ngày ${conf.day}/${conf.month} hàng năm` : "Sự kiện định kỳ hàng năm"),
        endDate: "Diễn ra tự động định kỳ",
        discountPercentage: conf.discountPercentage,
        bannerTitle: conf.bannerTitle,
        bannerSubtitle: conf.bannerSubtitle || "",
        bannerTheme: (conf.bannerTheme as any) || "purple",
        isActive: conf.enabled,
        targetPlans: ["pro_interview", "ultra_interview", "pro_cv", "ultra_cv"],
        isFixed: true,
        fixedKey: key,
        month: conf.month,
        day: conf.day,
      };
    });
  }, [fixedSettings]);

  // Combine both Fixed Events AND Custom Manual Campaigns for ALL view
  const allUnifiedCampaigns = useMemo<UnifiedCampaign[]>(() => {
    const manualList: UnifiedCampaign[] = campaigns.map((c) => ({
      ...c,
      isFixed: false,
    }));
    return [...manualList, ...fixedCampaignsList];
  }, [campaigns, fixedCampaignsList]);

  // Currently rendered items based on active view mode
  const displayedItems = currentView === "fixed" ? fixedCampaignsList : allUnifiedCampaigns;

  // Pagination calculation
  const totalPages = Math.ceil(displayedItems.length / itemsPerPage) || 1;
  const paginatedCampaigns = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return displayedItems.slice(start, start + itemsPerPage);
  }, [displayedItems, currentPage]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Constant Navigation Header Taskbar */}
      <DashboardHeader
        navItems={adminNavItems}
        activePath="/admin/promotions"
        role="admin"
        onLogout={() => {
          logout();
          window.location.assign("/");
        }}
      />

      <main className="min-h-screen pt-16">
        <div className="flex flex-col min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 space-y-8" style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}>
          
          {/* Main Top Header Section */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Flame className="h-4 w-4" /> Management & Promotions
              </div>
              <h1 className="text-3xl font-black tracking-tight">Quản lý Chiến dịch Khuyến mãi & Banner</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Quản lý các đợt Flash Sale tùy chỉnh và sự kiện khuyến mãi cố định tự động định kỳ.
              </p>
            </div>

            {/* TOP RIGHT ACTION BUTTONS REQUIRED BY USER */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Button 1: Thêm mới chiến dịch (Manual Flash Sale) */}
              <button
                onClick={handleOpenCreateManual}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground transition shadow-md hover:opacity-90 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Thêm mới chiến dịch
              </button>

              {/* Button 2: Chiến dịch cố định (Switch to Fixed Events screen) */}
              <button
                onClick={() => {
                  setCurrentView(currentView === "fixed" ? "all" : "fixed");
                  setCurrentPage(1);
                }}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition shadow-xs cursor-pointer ${
                  currentView === "fixed"
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "border-border bg-card hover:bg-secondary text-foreground"
                }`}
              >
                <Zap className="h-4 w-4 text-indigo-500" />
                {currentView === "fixed" ? "Xem toàn bộ chiến dịch" : "Chiến dịch cố định"}
              </button>

              {/* Button 3: KM Hết lượt free */}
              <button
                onClick={() => {
                  fetchQuotaPromo();
                  setShowQuotaPromoModal(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-4 py-2.5 text-xs font-bold text-amber-600 dark:text-amber-400 transition shadow-xs cursor-pointer"
              >
                <Gift className="h-4 w-4" />
                KM Hết lượt free
              </button>

              {/* Refresh Button */}
              <button
                onClick={fetchCampaigns}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2.5 text-xs font-semibold hover:bg-secondary transition cursor-pointer"
                title="Làm mới dữ liệu"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Navigation Bar / Mode Toggle Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  {currentView === "fixed" && (
                    <button
                      onClick={() => {
                        setCurrentView("all");
                        setCurrentPage(1);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-primary transition mr-2 cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" /> Quay về tất cả chiến dịch
                    </button>
                  )}
                  <h2 className="text-base font-bold flex items-center gap-2">
                    {currentView === "fixed" ? (
                      <>
                        <Zap className="h-4 w-4 text-indigo-500" /> Màn hình Quản lý Chiến dịch Cố định ({fixedCampaignsList.length})
                      </>
                    ) : (
                      <>
                        <Tag className="h-4 w-4 text-primary" /> Toàn bộ danh sách chiến dịch ({allUnifiedCampaigns.length})
                      </>
                    )}
                  </h2>
                </div>

                {/* If in Fixed Events View mode, show the "Thêm chiến dịch cố định" button */}
                {currentView === "fixed" && (
                  <button
                    onClick={handleOpenCreateFixed}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white transition shadow-sm cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Thêm chiến dịch cố định
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-7 w-7 animate-spin text-primary" />
                </div>
              ) : displayedItems.length === 0 ? (
                <div className="rounded-3xl border border-border bg-card p-6 sm:p-12 text-center text-muted-foreground text-sm space-y-3">
                  <Flame className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                  <p>Chưa có chiến dịch khuyến mãi nào.</p>
                  {currentView === "fixed" ? (
                    <button
                      onClick={handleOpenCreateFixed}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
                    >
                      <Plus className="h-4 w-4" /> Thêm chiến dịch cố định
                    </button>
                  ) : (
                    <button
                      onClick={handleOpenCreateManual}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition"
                    >
                      <Plus className="h-4 w-4" /> Tạo chiến dịch ngay
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {paginatedCampaigns.map((c) => (
                    <div
                      key={c.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4.5 shadow-xs hover:border-primary/40 transition-all duration-200"
                    >
                      {/* Left Info */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-foreground">{c.name}</span>

                          {/* Badge Type */}
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase border ${
                              c.isFixed
                                ? "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20"
                                : "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20"
                            }`}
                          >
                            {c.isFixed ? "⚡ Cố định tự động" : "🔥 Flash Sale tùy chọn"}
                          </span>

                          {/* Discount Badge */}
                          <span className="rounded-full bg-primary text-primary-foreground px-2.5 py-0.5 text-[10px] font-black tracking-wider shadow-xs">
                            -{c.discountPercentage}%
                          </span>

                          {/* Status Badge */}
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                              c.isActive
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                                : "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            {c.isActive ? "Đang bật" : "Đã tắt"}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground font-medium">{c.bannerTitle}</p>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-0.5">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-primary" />
                            {c.isFixed
                              ? `Thời gian: ${c.startDate}`
                              : `Bắt đầu: ${new Date(c.startDate).toLocaleString("vi-VN")}`}
                          </span>
                          {!c.isFixed && (
                            <>
                              <span>•</span>
                              <span>Kết thúc: {new Date(c.endDate).toLocaleString("vi-VN")}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right Action Buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => setPreviewCampaign(c)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition cursor-pointer shadow-xs"
                        >
                          <Eye className="h-3.5 w-3.5 text-indigo-500" /> Xem
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(c)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition cursor-pointer shadow-xs"
                        >
                          <Edit className="h-3.5 w-3.5 text-blue-500" /> Sửa
                        </button>

                        <AnimatedDeleteButton
                          size="sm"
                          text="Xóa"
                          onDelete={() => (c.isFixed && c.fixedKey ? handleDeleteFixed(c.fixedKey) : handleDelete(c.id))}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination Bar at the VERY BOTTOM */}
            {displayedItems.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border mt-auto">
                <span className="text-xs text-muted-foreground font-medium">
                  Hiển thị {Math.min(displayedItems.length, (currentPage - 1) * itemsPerPage + 1)} - {Math.min(displayedItems.length, currentPage * itemsPerPage)} trên tổng {displayedItems.length} chiến dịch
                </span>

                <div className="flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-2 shadow-xs">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-7 w-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                          currentPage === pageNum
                            ? "bg-primary text-primary-foreground shadow-xs"
                            : "text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ─── POPUP MODAL 1: EDIT CAMPAIGN (HANDLES BOTH CUSTOM & FIXED) ───────── */}
          {editingItem && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
              <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-scale-up">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Edit className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold text-foreground">
                      Chỉnh sửa: {editingItem.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setEditingItem(null)}
                    className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form
                  onSubmit={
                    editingItem.isFixed ? handleSaveFixedCampaignModal : handleSaveCustomCampaign
                  }
                  className="space-y-5"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-bold text-foreground">Tên chiến dịch *</span>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-bold text-foreground">Giảm giá (%) *</span>
                      <div className="flex items-center gap-3 mt-1.5">
                        <input
                          type="range"
                          min={5}
                          max={90}
                          step={5}
                          value={formDiscount}
                          onChange={(e) => setFormDiscount(Number(e.target.value))}
                          className="flex-1 accent-primary cursor-pointer"
                        />
                        <span className="inline-flex items-center gap-0.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-black text-primary min-w-[50px] text-center">
                          -{formDiscount}%
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Date fields for Custom Manual Campaigns with Strict Validation */}
                  {!editingItem.isFixed ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-xs font-bold text-foreground flex items-center gap-1">
                          Thời gian bắt đầu *
                        </span>
                        <input
                          type="datetime-local"
                          required
                          value={formStartDate}
                          onChange={(e) => setFormStartDate(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
                        />
                      </label>

                      <label className="block">
                        <span className="text-xs font-bold text-foreground flex items-center gap-1">
                          Thời gian kết thúc * (Phải sau thời gian bắt đầu)
                        </span>
                        <input
                          type="datetime-local"
                          required
                          min={formStartDate || nowIsoMin}
                          value={formEndDate}
                          onChange={(e) => setFormEndDate(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-3 p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-bold text-indigo-900 dark:text-indigo-200">
                          Sự kiện cố định tự động hàng năm
                        </span>
                        <label className="inline-flex items-center gap-2 cursor-pointer font-bold">
                          <span>Trạng thái:</span>
                          <input
                            type="checkbox"
                            checked={formFixedEnabled}
                            onChange={(e) => setFormFixedEnabled(e.target.checked)}
                            className="accent-primary h-4 w-4"
                          />
                          <span>{formFixedEnabled ? "Đang bật" : "Đã tắt"}</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <label className="block">
                          <span className="text-muted-foreground font-semibold">Tháng tổ chức (1 - 12):</span>
                          <input
                            type="number"
                            min={1}
                            max={12}
                            value={formFixedMonth}
                            onChange={(e) => setFormFixedMonth(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-input bg-background px-2.5 py-1 text-xs font-bold"
                          />
                        </label>

                        <label className="block">
                          <span className="text-muted-foreground font-semibold">Ngày tổ chức (1 - 31):</span>
                          <input
                            type="number"
                            min={1}
                            max={31}
                            value={formFixedDay}
                            onChange={(e) => setFormFixedDay(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-input bg-background px-2.5 py-1 text-xs font-bold"
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-bold text-foreground">Tiêu đề Banner *</span>
                      <input
                        type="text"
                        required
                        value={formBannerTitle}
                        onChange={(e) => setFormBannerTitle(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-bold text-foreground">Phụ đề Banner</span>
                      <input
                        type="text"
                        value={formBannerSubtitle}
                        onChange={(e) => setFormBannerSubtitle(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
                      />
                    </label>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-foreground block mb-2">Màu sắc Banner Theme</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: "purple", label: "Tím Cyber (Default)", gradient: "from-indigo-600 via-purple-600 to-pink-600" },
                        { id: "amber", label: "Vàng Cam Sale", gradient: "from-amber-600 via-orange-600 to-red-600" },
                        { id: "red", label: "Đỏ Hot Sale", gradient: "from-red-700 via-rose-700 to-purple-900" },
                        { id: "emerald", label: "Xanh Emerald", gradient: "from-emerald-600 via-teal-600 to-cyan-700" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setFormBannerTheme(t.id as any)}
                          className={`flex items-center gap-2 rounded-xl p-2 border text-xs font-semibold transition cursor-pointer ${
                            formBannerTheme === t.id
                              ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                              : "border-border hover:bg-secondary"
                          }`}
                        >
                          <span className={`h-3.5 w-3.5 rounded-full bg-gradient-to-r ${t.gradient}`} />
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Banner Preview inside Modal */}
                  {formBannerTitle && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold text-muted-foreground block">
                        Live Preview Banner trên màn hình người dùng:
                      </span>
                      <div
                        className={`relative w-full rounded-2xl bg-gradient-to-r ${
                          themeGradients[formBannerTheme] || themeGradients.purple
                        } text-white p-3.5 shadow-md flex items-center justify-between gap-4`}
                      >
                        <div className="flex items-center gap-3">
                          <Flame className="h-5 w-5 text-yellow-300 animate-pulse" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-extrabold uppercase">
                                GIẢM {formDiscount}%
                              </span>
                              <h4 className="text-xs font-bold text-white">{formBannerTitle}</h4>
                            </div>
                            {formBannerSubtitle && <p className="text-[11px] text-white/80 mt-0.5">{formBannerSubtitle}</p>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold bg-white text-gray-900 px-3 py-1 rounded-full">
                            Nhận ưu đãi
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-3 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-secondary transition cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={saving || savingFixed}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 transition cursor-pointer shadow-md"
                    >
                      {saving || savingFixed ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ─── POPUP MODAL 2: CREATE MANUAL FLASH SALE CAMPAIGN ───────────────────── */}
          {showCreateManualModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
              <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-scale-up">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold text-foreground">Tạo đợt Flash Sale tùy chọn mới</h3>
                  </div>
                  <button
                    onClick={() => setShowCreateManualModal(false)}
                    className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveCustomCampaign} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-bold text-foreground">Tên chiến dịch *</span>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Sale Tuần Lễ Vàng, Flash Sale Cuối Tuần..."
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-bold text-foreground">Giảm giá (%) *</span>
                      <div className="flex items-center gap-3 mt-1.5">
                        <input
                          type="range"
                          min={5}
                          max={90}
                          step={5}
                          value={formDiscount}
                          onChange={(e) => setFormDiscount(Number(e.target.value))}
                          className="flex-1 accent-primary cursor-pointer"
                        />
                        <span className="inline-flex items-center gap-0.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-black text-primary min-w-[50px] text-center">
                          -{formDiscount}%
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Strict Date Validation Inputs */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1">
                        Thời gian bắt đầu * (Từ hiện tại trở đi)
                      </span>
                      <input
                        type="datetime-local"
                        required
                        min={nowIsoMin}
                        value={formStartDate}
                        onChange={(e) => setFormStartDate(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-bold text-foreground flex items-center gap-1">
                        Thời gian kết thúc * (Phải sau thời gian bắt đầu)
                      </span>
                      <input
                        type="datetime-local"
                        required
                        min={formStartDate || nowIsoMin}
                        value={formEndDate}
                        onChange={(e) => setFormEndDate(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-bold text-foreground">Tiêu đề Banner *</span>
                      <input
                        type="text"
                        required
                        placeholder="🔥 SIÊU SALE: GIẢM 30% TẤT CẢ GÓI PRO & ULTRA!"
                        value={formBannerTitle}
                        onChange={(e) => setFormBannerTitle(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-bold text-foreground">Phụ đề Banner</span>
                      <input
                        type="text"
                        placeholder="Duy nhất hôm nay! Mở khóa toàn bộ tính năng AI."
                        value={formBannerSubtitle}
                        onChange={(e) => setFormBannerSubtitle(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
                      />
                    </label>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-foreground block mb-2">Màu sắc Banner Theme</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: "purple", label: "Tím Cyber (Default)", gradient: "from-indigo-600 via-purple-600 to-pink-600" },
                        { id: "amber", label: "Vàng Cam Sale", gradient: "from-amber-600 via-orange-600 to-red-600" },
                        { id: "red", label: "Đỏ Hot Sale", gradient: "from-red-700 via-rose-700 to-purple-900" },
                        { id: "emerald", label: "Xanh Emerald", gradient: "from-emerald-600 via-teal-600 to-cyan-700" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setFormBannerTheme(t.id as any)}
                          className={`flex items-center gap-2 rounded-xl p-2 border text-xs font-semibold transition cursor-pointer ${
                            formBannerTheme === t.id
                              ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                              : "border-border hover:bg-secondary"
                          }`}
                        >
                          <span className={`h-3.5 w-3.5 rounded-full bg-gradient-to-r ${t.gradient}`} />
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setShowCreateManualModal(false)}
                      className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-secondary transition cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 transition cursor-pointer shadow-md"
                    >
                      {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                      Tạo & Xuất bản chiến dịch
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ─── POPUP MODAL 3: CREATE BRAND NEW FIXED EVENT ────────────────────────── */}
          {showCreateFixedModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
              <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-scale-up">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-indigo-500" />
                    <h3 className="text-lg font-bold text-foreground">Thêm mới Sự kiện cố định hàng năm</h3>
                  </div>
                  <button
                    onClick={() => setShowCreateFixedModal(false)}
                    className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateNewFixedCampaign} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-bold text-foreground">Tên sự kiện cố định mới *</span>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Siêu Sale Valentine 14/2, Quốc tế Phụ nữ 8/3..."
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-bold text-foreground">Giảm giá (%) *</span>
                      <div className="flex items-center gap-3 mt-1.5">
                        <input
                          type="range"
                          min={5}
                          max={90}
                          step={5}
                          value={formDiscount}
                          onChange={(e) => setFormDiscount(Number(e.target.value))}
                          className="flex-1 accent-indigo-500 cursor-pointer"
                        />
                        <span className="inline-flex items-center gap-0.5 rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-black text-indigo-600 min-w-[50px] text-center">
                          -{formDiscount}%
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-bold text-foreground">Tháng tổ chức hàng năm (1 - 12) *</span>
                      <input
                        type="number"
                        min={1}
                        max={12}
                        required
                        value={formFixedMonth}
                        onChange={(e) => setFormFixedMonth(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-bold text-foreground">Ngày tổ chức hàng năm (1 - 31) *</span>
                      <input
                        type="number"
                        min={1}
                        max={31}
                        required
                        value={formFixedDay}
                        onChange={(e) => setFormFixedDay(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-bold text-foreground">Tiêu đề Banner *</span>
                      <input
                        type="text"
                        required
                        placeholder="🔥 SIÊU SALE VALENTINE: GIẢM 35% TOÀN BỘ GÓI AI!"
                        value={formBannerTitle}
                        onChange={(e) => setFormBannerTitle(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-bold text-foreground">Phụ đề Banner</span>
                      <input
                        type="text"
                        placeholder="Ưu đãi lớn duy nhất trong năm dành cho bạn!"
                        value={formBannerSubtitle}
                        onChange={(e) => setFormBannerSubtitle(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
                      />
                    </label>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-foreground block mb-2">Màu sắc Banner Theme</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: "purple", label: "Tím Cyber (Default)", gradient: "from-indigo-600 via-purple-600 to-pink-600" },
                        { id: "amber", label: "Vàng Cam Sale", gradient: "from-amber-600 via-orange-600 to-red-600" },
                        { id: "red", label: "Đỏ Hot Sale", gradient: "from-red-700 via-rose-700 to-purple-900" },
                        { id: "emerald", label: "Xanh Emerald", gradient: "from-emerald-600 via-teal-600 to-cyan-700" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setFormBannerTheme(t.id as any)}
                          className={`flex items-center gap-2 rounded-xl p-2 border text-xs font-semibold transition cursor-pointer ${
                            formBannerTheme === t.id
                              ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                              : "border-border hover:bg-secondary"
                          }`}
                        >
                          <span className={`h-3.5 w-3.5 rounded-full bg-gradient-to-r ${t.gradient}`} />
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setShowCreateFixedModal(false)}
                      className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-secondary transition cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={savingFixed}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-bold text-white transition cursor-pointer shadow-md"
                    >
                      {savingFixed ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
                      Thêm mới sự kiện cố định
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ─── POPUP MODAL 4: PREVIEW CAMPAIGN ("Xem" action) ────────────────── */}
          {previewCampaign && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
              <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 animate-scale-up">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-indigo-500" />
                    <h3 className="text-lg font-bold text-foreground">Chi tiết chiến dịch khuyến mãi</h3>
                  </div>
                  <button
                    onClick={() => setPreviewCampaign(null)}
                    className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/40 p-3 rounded-xl">
                      <span className="text-muted-foreground font-semibold block">Tên chiến dịch:</span>
                      <span className="text-sm font-bold text-foreground">{previewCampaign.name}</span>
                    </div>

                    <div className="bg-muted/40 p-3 rounded-xl">
                      <span className="text-muted-foreground font-semibold block">Mức giảm giá:</span>
                      <span className="text-sm font-bold text-primary">-{previewCampaign.discountPercentage}%</span>
                    </div>

                    <div className="bg-muted/40 p-3 rounded-xl">
                      <span className="text-muted-foreground font-semibold block">Loại chiến dịch:</span>
                      <span className="font-bold text-foreground">
                        {previewCampaign.isFixed ? "⚡ Sự kiện cố định tự động" : "🔥 Flash Sale tùy chọn"}
                      </span>
                    </div>

                    <div className="bg-muted/40 p-3 rounded-xl">
                      <span className="text-muted-foreground font-semibold block">Thời gian:</span>
                      <span className="font-bold text-foreground">
                        {previewCampaign.isFixed
                          ? previewCampaign.startDate
                          : `${new Date(previewCampaign.startDate).toLocaleString("vi-VN")} - ${new Date(previewCampaign.endDate).toLocaleString("vi-VN")}`}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <span className="font-bold text-muted-foreground block">Mô phỏng Banner trên màn hình người dùng:</span>
                    <div
                      className={`relative w-full rounded-2xl bg-gradient-to-r ${
                        themeGradients[previewCampaign.bannerTheme] || themeGradients.purple
                      } text-white p-4 shadow-lg flex items-center justify-between gap-4`}
                    >
                      <div className="flex items-center gap-3">
                        <Flame className="h-6 w-6 text-yellow-300 animate-bounce" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-yellow-400 text-gray-950 px-2.5 py-0.5 text-[10px] font-black uppercase shadow-xs">
                              GIẢM {previewCampaign.discountPercentage}%
                            </span>
                            <h4 className="text-xs font-bold text-white">{previewCampaign.bannerTitle}</h4>
                          </div>
                          {previewCampaign.bannerSubtitle && (
                            <p className="text-[11px] text-white/90 mt-0.5">{previewCampaign.bannerSubtitle}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold bg-white text-gray-900 px-3.5 py-1.5 rounded-full shadow-md">
                          Nhận ưu đãi
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setPreviewCampaign(null)}
                    className="rounded-xl bg-secondary px-5 py-2 text-xs font-bold text-foreground hover:bg-secondary/80 transition cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── QUOTA EXCEEDED PROMO MODAL ─── */}
          {showQuotaPromoModal && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-amber-500/5">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                      <Gift className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-foreground">Cài đặt Khuyến mãi Hết lượt Free</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Popup hiển thị khi người dùng free dùng hết 2 lượt phỏng vấn</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowQuotaPromoModal(false)}
                    className="h-8 w-8 rounded-lg border border-border bg-card hover:bg-secondary flex items-center justify-center transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveQuotaPromo}>
                  {loadingQuotaPromo ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2 className="h-7 w-7 animate-spin text-amber-500" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                      {/* Left: Settings */}
                      <div className="p-6 space-y-5">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Cấu hình
                        </h3>

                        {/* Toggle */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold text-foreground">Bật popup khuyến mãi</div>
                            <div className="text-xs text-muted-foreground mt-0.5">Hiện popup khi người dùng free hết lượt</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setQuotaPromo(p => ({ ...p, enabled: !p.enabled }))}
                            className={`relative h-6 w-11 rounded-full transition-colors duration-200 cursor-pointer ${quotaPromo.enabled ? "bg-amber-500" : "bg-muted"}`}
                          >
                            <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${quotaPromo.enabled ? "translate-x-5" : "translate-x-0"}`} />
                          </button>
                        </div>

                        {/* Discount % */}
                        <div>
                          <label className="block text-xs font-bold text-foreground mb-1.5">
                            Phần trăm giảm giá <span className="text-destructive">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min={1}
                              max={90}
                              value={quotaPromo.discountPercentage}
                              onChange={e => setQuotaPromo(p => ({ ...p, discountPercentage: Number(e.target.value) }))}
                              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-bold pr-10 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                              placeholder="20"
                              required
                            />
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-black text-amber-500">%</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1">Mức giảm giá hiển thị cho người dùng (1–90%)</p>
                        </div>

                        {/* Countdown duration */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-foreground">
                              Thời gian đếm ngược <span className="text-destructive">*</span>
                            </label>
                            <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg text-[10px]">
                              <button
                                type="button"
                                onClick={() => setTimeInputMode("hms")}
                                className={`px-2 py-0.5 rounded-md font-bold transition cursor-pointer ${
                                  timeInputMode === "hms" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                                }`}
                              >
                                Giờ / Phút / Giây
                              </button>
                              <button
                                type="button"
                                onClick={() => setTimeInputMode("direct")}
                                className={`px-2 py-0.5 rounded-md font-bold transition cursor-pointer ${
                                  timeInputMode === "direct" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground"
                                }`}
                              >
                                Tự điền tổng phút
                              </button>
                            </div>
                          </div>

                          {timeInputMode === "hms" ? (
                            <div className="space-y-2">
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                <div>
                                  <span className="text-[10px] font-semibold text-muted-foreground block mb-1">Giờ</span>
                                  <div className="relative">
                                    <input
                                      type="number"
                                      min={0}
                                      max={168}
                                      value={Math.floor(Math.round((quotaPromo.countdownMinutes || 0) * 60) / 3600)}
                                      onChange={e => {
                                        const h = Math.max(0, Number(e.target.value));
                                        const totalSecs = Math.round((quotaPromo.countdownMinutes || 0) * 60);
                                        const m = Math.floor((totalSecs % 3600) / 60);
                                        const s = totalSecs % 60;
                                        const newTotalSecs = h * 3600 + m * 60 + s;
                                        setQuotaPromo(p => ({ ...p, countdownMinutes: Math.round((newTotalSecs / 60) * 100) / 100 }));
                                      }}
                                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/40 pr-7"
                                    />
                                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-muted-foreground">h</span>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-[10px] font-semibold text-muted-foreground block mb-1">Phút</span>
                                  <div className="relative">
                                    <input
                                      type="number"
                                      min={0}
                                      max={59}
                                      value={Math.floor((Math.round((quotaPromo.countdownMinutes || 0) * 60) % 3600) / 60)}
                                      onChange={e => {
                                        const m = Math.max(0, Number(e.target.value));
                                        const totalSecs = Math.round((quotaPromo.countdownMinutes || 0) * 60);
                                        const h = Math.floor(totalSecs / 3600);
                                        const s = totalSecs % 60;
                                        const newTotalSecs = h * 3600 + m * 60 + s;
                                        setQuotaPromo(p => ({ ...p, countdownMinutes: Math.round((newTotalSecs / 60) * 100) / 100 }));
                                      }}
                                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/40 pr-7"
                                    />
                                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-muted-foreground">m</span>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-[10px] font-semibold text-muted-foreground block mb-1">Giây</span>
                                  <div className="relative">
                                    <input
                                      type="number"
                                      min={0}
                                      max={59}
                                      value={Math.round((quotaPromo.countdownMinutes || 0) * 60) % 60}
                                      onChange={e => {
                                        const s = Math.max(0, Number(e.target.value));
                                        const totalSecs = Math.round((quotaPromo.countdownMinutes || 0) * 60);
                                        const h = Math.floor(totalSecs / 3600);
                                        const m = Math.floor((totalSecs % 3600) / 60);
                                        const newTotalSecs = h * 3600 + m * 60 + s;
                                        setQuotaPromo(p => ({ ...p, countdownMinutes: Math.round((newTotalSecs / 60) * 100) / 100 }));
                                      }}
                                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/40 pr-7"
                                    />
                                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-muted-foreground">s</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="relative">
                              <input
                                type="number"
                                min={0.1}
                                max={10080}
                                step="any"
                                value={quotaPromo.countdownMinutes}
                                onChange={e => setQuotaPromo(p => ({ ...p, countdownMinutes: Number(e.target.value) }))}
                                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-bold pr-16 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                                placeholder="30"
                                required
                              />
                              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">phút</span>
                            </div>
                          )}

                          {/* Presets */}
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-bold text-muted-foreground mr-1">Nhanh:</span>
                            {[
                              { label: "15 phút", mins: 15 },
                              { label: "30 phút", mins: 30 },
                              { label: "1 giờ", mins: 60 },
                              { label: "2 giờ", mins: 120 },
                              { label: "24 giờ", mins: 1440 },
                            ].map(preset => (
                              <button
                                key={preset.mins}
                                type="button"
                                onClick={() => setQuotaPromo(p => ({ ...p, countdownMinutes: preset.mins }))}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                                  quotaPromo.countdownMinutes === preset.mins
                                    ? "bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400"
                                    : "bg-background border-border text-muted-foreground hover:border-amber-500/40"
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>

                          <p className="text-[10px] text-muted-foreground mt-1.5">
                            ⏱️ Đếm ngược:{" "}
                            <strong className="text-foreground font-bold">
                              {(() => {
                                const totalSecs = Math.round((quotaPromo.countdownMinutes || 0) * 60);
                                const h = Math.floor(totalSecs / 3600);
                                const m = Math.floor((totalSecs % 3600) / 60);
                                const s = totalSecs % 60;
                                const parts: string[] = [];
                                if (h > 0) parts.push(`${h} giờ`);
                                if (m > 0 || (h === 0 && s === 0)) parts.push(`${m} phút`);
                                if (s > 0) parts.push(`${s} giây`);
                                return parts.join(" ");
                              })()}
                            </strong>{" "}
                            ({quotaPromo.countdownMinutes} phút). Mỗi user có 1 bộ đếm riêng.
                          </p>
                        </div>

                        {/* Title */}
                        <div>
                          <label className="block text-xs font-bold text-foreground mb-1.5">Tiêu đề popup</label>
                          <input
                            type="text"
                            value={quotaPromo.title}
                            onChange={e => setQuotaPromo(p => ({ ...p, title: e.target.value }))}
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                            placeholder="🎉 Ưu đãi đặc biệt dành riêng cho bạn!"
                          />
                        </div>

                        {/* Subtitle */}
                        <div>
                          <label className="block text-xs font-bold text-foreground mb-1.5">Mô tả phụ</label>
                          <textarea
                            value={quotaPromo.subtitle}
                            onChange={e => setQuotaPromo(p => ({ ...p, subtitle: e.target.value }))}
                            rows={2}
                            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 resize-none"
                            placeholder="Nâng cấp ngay trong thời gian giới hạn để nhận ưu đãi độc quyền!"
                          />
                        </div>
                      </div>

                      {/* Right: Preview */}
                      <div className="p-6 space-y-4 bg-muted/20">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Eye className="h-3.5 w-3.5" /> Xem trước (giao diện user)
                          </h3>
                          {/* Synchronized Theme switcher for preview */}
                          <div className="flex items-center gap-1 bg-background border border-border p-0.5 rounded-lg text-[10px]">
                            {(["light", "dark", "rose"] as const).map(t => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setPreviewTheme(t)}
                                className={`px-2 py-0.5 rounded-md font-bold transition cursor-pointer ${
                                  previewTheme === t ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                {t === "light" ? "☀️ Sáng" : t === "dark" ? "🌙 Tối" : "🌹 Rose"}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Mini preview */}
                        {(() => {
                          const pal = getThemePalette(previewTheme);
                          const totalSecs = Math.round((quotaPromo.countdownMinutes || 0) * 60);
                          const h = Math.floor(totalSecs / 3600);
                          const m = Math.floor((totalSecs % 3600) / 60);
                          const s = totalSecs % 60;
                          const pad = (n: number) => String(n).padStart(2, "0");
                          const formattedTimer = h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;

                          return (
                            <div
                              className="rounded-2xl overflow-hidden transition-all duration-300"
                              style={{
                                background: pal.modalBg,
                                border: pal.modalBorder,
                                boxShadow: pal.modalShadow,
                              }}
                            >
                              <div className="p-5 text-center space-y-3">
                                {/* Badge */}
                                <div className="flex justify-center">
                                  <span
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 4,
                                      background: pal.topBadgeBg,
                                      border: pal.topBadgeBorder,
                                      borderRadius: 30,
                                      padding: "4px 10px",
                                      fontSize: 10,
                                      fontWeight: 800,
                                      letterSpacing: 1.5,
                                      textTransform: "uppercase",
                                      color: pal.topBadgeText,
                                    }}
                                  >
                                    ✨ Ưu đãi giới hạn thời gian
                                  </span>
                                </div>

                                {/* Icon */}
                                <div className="flex justify-center">
                                  <div
                                    style={{
                                      width: 52,
                                      height: 52,
                                      borderRadius: "50%",
                                      background: pal.giftBg,
                                      border: pal.giftBorder,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Gift className="h-6 w-6" style={{ color: pal.giftIconColor }} />
                                  </div>
                                </div>

                                {/* Title */}
                                <p style={{ color: pal.titleColor, fontSize: 14, fontWeight: 900, lineHeight: 1.3 }}>
                                  {quotaPromo.title || "🎉 Ưu đãi đặc biệt dành riêng cho bạn!"}
                                </p>
                                <p style={{ color: pal.subtitleColor, fontSize: 11, lineHeight: 1.5 }}>
                                  {quotaPromo.subtitle}
                                </p>

                                {/* Discount */}
                                <div
                                  style={{
                                    background: pal.discountBg,
                                    borderRadius: 12,
                                    padding: "8px 20px",
                                    display: "inline-block",
                                    boxShadow: pal.discountShadow,
                                  }}
                                >
                                  <span style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>
                                    -{quotaPromo.discountPercentage}%
                                  </span>
                                </div>

                                {/* Countdown preview */}
                                <div
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 800,
                                    color: pal.timerDigitText,
                                    textTransform: "uppercase",
                                    letterSpacing: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 4,
                                  }}
                                >
                                  <Clock className="h-3.5 w-3.5" style={{ color: pal.timerDigitText }} />
                                  CÒN LẠI: {formattedTimer}
                                </div>

                                {/* CTA */}
                                <div
                                  style={{
                                    background: pal.ctaBg,
                                    borderRadius: 10,
                                    padding: "10px 16px",
                                    color: "#fff",
                                    fontSize: 12,
                                    fontWeight: 900,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 6,
                                    boxShadow: pal.ctaShadow,
                                  }}
                                >
                                  <Crown className="h-3.5 w-3.5" />
                                  Đăng ký ngay — Giảm {quotaPromo.discountPercentage}%
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Status indicator */}
                        <div className={`flex items-center gap-2 text-xs font-semibold rounded-xl px-3 py-2 border ${quotaPromo.enabled
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted border-border text-muted-foreground"}`}
                        >
                          <span className={`h-2 w-2 rounded-full ${quotaPromo.enabled ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"}`} />
                          {quotaPromo.enabled ? "Popup đang được bật — hiển thị cho user free hết lượt" : "Popup đang tắt — không hiển thị"}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  {!loadingQuotaPromo && (
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/20">
                      <button
                        type="button"
                        onClick={() => setShowQuotaPromoModal(false)}
                        className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:bg-secondary transition cursor-pointer"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={savingQuotaPromo}
                        className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 px-5 py-2 text-xs font-bold text-white transition shadow-sm cursor-pointer"
                      >
                        {savingQuotaPromo ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                        {savingQuotaPromo ? "Đang lưu..." : "Lưu cài đặt"}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

