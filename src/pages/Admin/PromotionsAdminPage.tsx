import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import {
  Calendar,
  Flame,
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
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

type Campaign = {
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
  createdAt: string;
};

type FixedEventConfig = {
  enabled: boolean;
  discountPercentage: number;
  bannerTitle: string;
  bannerSubtitle?: string;
  bannerTheme?: string;
};

type FixedEventSettings = {
  black_friday: FixedEventConfig;
  double_11: FixedEventConfig;
  double_12: FixedEventConfig;
  new_year: FixedEventConfig;
  double_days: FixedEventConfig;
};

const DEFAULT_FIXED_SETTINGS: FixedEventSettings = {
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

export function PromotionsAdminPage() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [fixedSettings, setFixedSettings] = useState<FixedEventSettings>(DEFAULT_FIXED_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [savingFixed, setSavingFixed] = useState(false);

  // Form states for manual campaigns
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(30);
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  const [bannerTheme, setBannerTheme] = useState<"amber" | "red" | "purple" | "emerald">("amber");
  const [saving, setSaving] = useState(false);

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

  const handleSaveFixedSettings = async () => {
    setSavingFixed(true);
    try {
      const res = await fetch("/api/promotions/admin/fixed-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id ?? "",
          "x-user-role": user?.role ?? "admin",
        },
        body: JSON.stringify({ settings: fixedSettings }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Đã lưu chiết khấu sự kiện cố định tự động!");
      } else {
        toast.error(data.message || "Không thể lưu cài đặt sự kiện cố định.");
      }
    } catch (err) {
      toast.error("Lỗi kết nối máy chủ.");
    } finally {
      setSavingFixed(false);
    }
  };

  const handleUpdateFixedItem = (
    key: keyof FixedEventSettings,
    field: keyof FixedEventConfig,
    value: any
  ) => {
    setFixedSettings((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleResetForm = () => {
    setEditingId(null);
    setName("");
    setStartDate("");
    setEndDate("");
    setDiscountPercentage(30);
    setBannerTitle("");
    setBannerSubtitle("");
    setBannerTheme("amber");
  };

  const handleEdit = (c: Campaign) => {
    setEditingId(c.id);
    setName(c.name);
    setStartDate(c.startDate ? new Date(c.startDate).toISOString().slice(0, 16) : "");
    setEndDate(c.endDate ? new Date(c.endDate).toISOString().slice(0, 16) : "");
    setDiscountPercentage(c.discountPercentage);
    setBannerTitle(c.bannerTitle);
    setBannerSubtitle(c.bannerSubtitle);
    setBannerTheme(c.bannerTheme as any);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate || !endDate || !bannerTitle) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    setSaving(true);
    try {
      const endpoint = editingId
        ? `/api/promotions/admin/update/${editingId}`
        : "/api/promotions/admin/create";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id ?? "",
          "x-user-role": user?.role ?? "admin",
        },
        body: JSON.stringify({
          name,
          startDate: startDate ? new Date(startDate).toISOString() : "",
          endDate: endDate ? new Date(endDate).toISOString() : "",
          discountPercentage: Number(discountPercentage),
          bannerTitle,
          bannerSubtitle,
          bannerTheme,
          isActive: true,
          targetPlans: ["pro_interview", "ultra_interview", "pro_cv", "ultra_cv"],
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message);
        handleResetForm();
        fetchCampaigns();
      } else {
        toast.error(data.message || "Không thể lưu chiến dịch.");
      }
    } catch (err) {
      toast.error("Lỗi kết nối máy chủ.");
    } finally {
      setSaving(false);
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

      if (res.ok) {
        toast.success("Đã xóa chiến dịch thành công.");
        fetchCampaigns();
      } else {
        toast.error("Không thể xóa chiến dịch.");
      }
    } catch (err) {
      toast.error("Lỗi khi kết nối.");
    }
  };

  const themeGradients: Record<string, string> = {
    amber: "from-amber-600 via-orange-600 to-red-600",
    red: "from-red-700 via-rose-700 to-purple-900",
    purple: "from-indigo-600 via-purple-600 to-pink-600",
    emerald: "from-emerald-600 via-teal-600 to-cyan-700",
  };

  const fixedEventLabels: Record<keyof FixedEventSettings, { name: string; dateDesc: string; defaultTheme: string }> = {
    black_friday: { name: "Black Friday Sale", dateDesc: "Thứ 6 tuần thứ 4 tháng 11 hàng năm", defaultTheme: "red" },
    double_11: { name: "Siêu Sale 11/11 (Singles' Day)", dateDesc: "Ngày 11 tháng 11 hàng năm", defaultTheme: "red" },
    double_12: { name: "Siêu Sale 12/12 (Year-End Sale)", dateDesc: "Ngày 12 tháng 12 hàng năm", defaultTheme: "purple" },
    new_year: { name: "Khai Xuân 1/1 (Chào Năm Mới)", dateDesc: "Ngày 01 tháng 01 hàng năm", defaultTheme: "amber" },
    double_days: { name: "Ngày Đôi Hàng Tháng (2/2, 3/3... 10/10)", dateDesc: "Các ngày 2/2, 3/3, 4/4, 5/5, 6/6, 7/7, 8/8, 9/9, 10/10", defaultTheme: "amber" },
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header navigation */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <a
              href="/admin/finance"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Quay lại Tài chính Admin
            </a>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl flex items-center gap-2">
              <Flame className="h-7 w-7 text-amber-500" /> Quản lý Chiến dịch Khuyến mãi & Banner
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Tùy chỉnh chiết khấu tự động cho sự kiện cố định (Black Friday, 11/11, 12/12...) hoặc tạo đợt Flash Sale tùy chỉnh.
            </p>
          </div>

          <button
            onClick={fetchCampaigns}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-secondary transition cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Làm mới
          </button>
        </div>

        {/* SECTION 1: Cấu hình Sự kiện Cố định Tự động (Editable Fixed Events) */}
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card to-background p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-black uppercase text-white shadow-xs">
                  TỰ ĐỘNG TỰ KÍCH HOẠT
                </span>
                <h2 className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <Zap className="h-5 w-5 text-amber-500" /> Sự kiện cố định tự động
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Tự động kích hoạt khi đến đúng ngày trong năm. Bạn có thể chỉnh sửa % giảm giá (Discount) và tiêu đề Banner bên dưới.
              </p>
            </div>

            <button
              onClick={handleSaveFixedSettings}
              disabled={savingFixed}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2 text-xs font-bold text-white transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              {savingFixed ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {savingFixed ? "Đang lưu..." : "Lưu chiết khấu cố định"}
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(fixedEventLabels) as Array<keyof FixedEventSettings>).map((key) => {
              const info = fixedEventLabels[key];
              const conf = fixedSettings[key] || DEFAULT_FIXED_SETTINGS[key];

              return (
                <div
                  key={key}
                  className={`rounded-2xl border p-4 space-y-3 transition-all ${
                    conf.enabled
                      ? "border-amber-500/30 bg-card shadow-sm"
                      : "border-border bg-muted/20 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-foreground truncate">{info.name}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={conf.enabled}
                        onChange={(e) => handleUpdateFixedItem(key, "enabled", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>

                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-amber-500 shrink-0" />
                    {info.dateDesc}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-muted-foreground">Mức giảm giá (%):</span>
                      <span className="text-amber-500 font-black">-{conf.discountPercentage}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={5}
                        max={90}
                        step={5}
                        disabled={!conf.enabled}
                        value={conf.discountPercentage}
                        onChange={(e) => handleUpdateFixedItem(key, "discountPercentage", Number(e.target.value))}
                        className="flex-1 accent-amber-500 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <input
                        type="number"
                        min={5}
                        max={90}
                        step={1}
                        disabled={!conf.enabled}
                        value={conf.discountPercentage}
                        onChange={(e) => handleUpdateFixedItem(key, "discountPercentage", Math.min(90, Math.max(5, Number(e.target.value))))}
                        className="w-14 rounded-lg border border-input bg-background px-2 py-1 text-xs font-bold text-center"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-bold text-muted-foreground block">Tiêu đề Banner:</span>
                    <input
                      type="text"
                      disabled={!conf.enabled}
                      value={conf.bannerTitle}
                      onChange={(e) => handleUpdateFixedItem(key, "bannerTitle", e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-2.5 py-1 text-xs font-medium"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: Form Create/Edit Custom Manual Campaign */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            {editingId ? <Edit className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
            {editingId ? "Chỉnh sửa chiến dịch tùy chọn" : "Tạo đợt Flash Sale tùy chọn mới"}
          </h2>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold text-foreground">Tên chiến dịch *</span>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Sale Tuần Lễ Vàng, Flash Sale Cuối Tuần..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                    className="flex-1 accent-primary cursor-pointer"
                  />
                  <span className="inline-flex items-center gap-0.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-black text-primary min-w-[50px] text-center">
                    -{discountPercentage}%
                  </span>
                </div>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-bold text-foreground">Thời gian bắt đầu *</span>
                <input
                  type="datetime-local"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold text-foreground">Thời gian kết thúc *</span>
                <input
                  type="datetime-local"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
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
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
                />
              </label>

              <label className="block">
                <span className="text-xs font-bold text-foreground">Phụ đề Banner</span>
                <input
                  type="text"
                  placeholder="Duy nhất hôm nay! Mở khóa toàn bộ tính năng AI."
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-primary"
                />
              </label>
            </div>

            {/* Theme selection */}
            <div>
              <span className="text-xs font-bold text-foreground block mb-2">Màu sắc Banner Theme</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "amber", label: "Vàng Cam Sale", gradient: "from-amber-600 via-orange-600 to-red-600" },
                  { id: "red", label: "Đỏ Black Friday", gradient: "from-red-700 via-rose-700 to-purple-900" },
                  { id: "purple", label: "Tím Cyber", gradient: "from-indigo-600 via-purple-600 to-pink-600" },
                  { id: "emerald", label: "Xanh Emerald", gradient: "from-emerald-600 via-teal-600 to-cyan-700" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setBannerTheme(t.id as any)}
                    className={`flex items-center gap-2 rounded-xl p-2.5 border text-xs font-semibold transition cursor-pointer ${
                      bannerTheme === t.id
                        ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    <span className={`h-4 w-4 rounded-full bg-gradient-to-r ${t.gradient}`} />
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Banner Preview */}
            {bannerTitle && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5 text-primary" /> Live Preview Banner trên Website:
                </span>
                <div
                  className={`relative w-full rounded-2xl bg-gradient-to-r ${
                    themeGradients[bannerTheme]
                  } text-white p-3.5 shadow-md flex items-center justify-between gap-4`}
                >
                  <div className="flex items-center gap-3">
                    <Flame className="h-5 w-5 text-yellow-300 animate-pulse" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-extrabold uppercase">
                          GIẢM {discountPercentage}%
                        </span>
                        <h4 className="text-xs font-bold text-white">{bannerTitle}</h4>
                      </div>
                      {bannerSubtitle && <p className="text-[11px] text-white/80 mt-0.5">{bannerSubtitle}</p>}
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

            {/* Form actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-secondary transition cursor-pointer"
                >
                  Hủy chỉnh sửa
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 transition disabled:opacity-50 cursor-pointer shadow-md"
              >
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                {editingId ? "Cập nhật chiến dịch" : "Lưu & Xuất bản chiến dịch"}
              </button>
            </div>
          </form>
        </div>

        {/* Campaign List */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" /> Danh sách chiến dịch tùy chỉnh ({campaigns.length})
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-xs">
              Chưa có chiến dịch tùy chỉnh nào được tạo.
            </div>
          ) : (
            <div className="divide-y divide-border overflow-x-auto">
              {campaigns.map((c) => (
                <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{c.name}</span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black text-primary">
                        -{c.discountPercentage}%
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold text-white bg-gradient-to-r ${
                          themeGradients[c.bannerTheme]
                        }`}
                      >
                        {c.bannerTheme.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">{c.bannerTitle}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground pt-1">
                      <span>
                        Bắt đầu: {new Date(c.startDate).toLocaleString("vi-VN")}
                      </span>
                      <span>•</span>
                      <span>
                        Kết thúc: {new Date(c.endDate).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleEdit(c)}
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold hover:bg-secondary transition cursor-pointer"
                    >
                      <Edit className="h-3.5 w-3.5 text-blue-500" /> Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-rose-500/20 bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/20 transition cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
