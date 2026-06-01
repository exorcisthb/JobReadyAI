import { useEffect, useState, useCallback, memo } from "react";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader, type NavItem } from "@/components/dashboard-header";
import {
  Crown,
  Check,
  X,
  Sparkles,
  Zap,
  Shield,
  Star,
  ArrowRight,
  MessageSquare,
  FileText,
  Dumbbell,
  BookOpen,
  BarChart3,
  Newspaper,
  Loader2,
  AlertTriangle,
  PartyPopper,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PlanFeature {
  label: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  popular?: boolean;
  features: PlanFeature[];
}


const userNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <BarChart3 className="h-5 w-5" />, href: "/user/dashboard" },
  { label: "Phỏng vấn", icon: <MessageSquare className="h-5 w-5" />, href: "/interview/config" },
  { label: "Xem CV", icon: <FileText className="h-5 w-5" />, href: "/cv" },
  { label: "Luyện tập", icon: <Dumbbell className="h-5 w-5" />, href: "/practice" },
  { label: "Blog Career", icon: <BookOpen className="h-5 w-5" />, href: "/blog" },
  { label: "Điểm Tin Báo Chí", icon: <Newspaper className="h-5 w-5" />, href: "/news" },
  { label: "Nâng cấp", icon: <Crown className="h-5 w-5" />, href: "/pricing" },
];

// ─── Format helpers ──────────────────────────────────────────────────────────

function formatPrice(price: number): string {
  if (price === 0) return "0đ";
  return price.toLocaleString("vi-VN") + "đ";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Plan Card Component ─────────────────────────────────────────────────────

const PlanCard = memo(
  ({
    plan,
    currentPlan,
    isUpgrading,
    onUpgrade,
    onCancel,
  }: {
    plan: Plan;
    currentPlan: string;
    isUpgrading: boolean;
    onUpgrade: (planId: string) => void;
    onCancel: () => void;
  }) => {
    const isCurrent = currentPlan === plan.id;
    const isPopular = plan.popular;
    const isFree = plan.id === "free";
    const isDowngrade =
      (currentPlan === "ultra" && plan.id === "pro") ||
      (currentPlan !== "free" && plan.id === "free");

    return (
      <div
        className={`relative flex flex-col rounded-3xl border-2 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group ${
          isCurrent
            ? "border-primary/60 bg-primary/5 shadow-lg shadow-primary/10"
            : isPopular
              ? "border-primary/30 bg-card/95 shadow-lg"
              : "border-border/60 bg-card/80"
        }`}
        style={{
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Popular Badge */}
        {isPopular && !isCurrent && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <div
              className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-white shadow-lg"
              style={{ background: "var(--gradient-hero)" }}
            >
              <Star className="h-3.5 w-3.5 fill-current" />
              Phổ biến nhất
            </div>
          </div>
        )}

        {/* Current Plan Badge */}
        {isCurrent && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground shadow-lg">
              <Check className="h-3.5 w-3.5" />
              Đang sử dụng
            </div>
          </div>
        )}

        <div className="flex flex-col flex-1 p-8 pt-10">
          {/* Plan Header */}
          <div className="text-center mb-8">
            <div
              className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4 transition-transform duration-300 group-hover:scale-110 ${
                plan.id === "ultra"
                  ? "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30"
                  : plan.id === "pro"
                    ? "text-white shadow-lg shadow-primary/30"
                    : "bg-muted/50 text-muted-foreground border border-border/50"
              }`}
              style={
                plan.id === "pro" ? { background: "var(--gradient-hero)" } : undefined
              }
            >
              {plan.id === "ultra" ? (
                <Crown className="h-7 w-7" />
              ) : plan.id === "pro" ? (
                <Zap className="h-7 w-7" />
              ) : (
                <Shield className="h-7 w-7" />
              )}
            </div>

            <h3 className="text-xl font-bold tracking-tight">{plan.name}</h3>

            <div className="mt-4 flex items-baseline justify-center gap-1">
              <span
                className={`text-4xl font-extrabold tracking-tight ${
                  plan.id === "ultra"
                    ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent"
                    : plan.id === "pro"
                      ? "bg-clip-text text-transparent"
                      : ""
                }`}
                style={
                  plan.id === "pro"
                    ? { backgroundImage: "var(--gradient-hero)" }
                    : undefined
                }
              >
                {formatPrice(plan.price)}
              </span>
              {plan.price > 0 && (
                <span className="text-sm text-muted-foreground font-medium">
                  /{plan.period}
                </span>
              )}
            </div>
            {plan.price === 0 && (
              <p className="text-sm text-muted-foreground mt-1">{plan.period}</p>
            )}
          </div>

          {/* Features */}
          <ul className="space-y-3 flex-1 mb-8">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                {feature.included ? (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 mt-0.5">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted/50 text-muted-foreground/40 mt-0.5">
                    <X className="h-3 w-3" strokeWidth={3} />
                  </div>
                )}
                <span
                  className={`text-sm ${
                    feature.included
                      ? "text-foreground font-medium"
                      : "text-muted-foreground/60 line-through"
                  }`}
                >
                  {feature.label}
                </span>
              </li>
            ))}
          </ul>

          {/* Action Button */}
          <div className="mt-auto">
            {isCurrent ? (
              isFree ? (
                <div className="w-full rounded-xl border border-border/60 bg-muted/30 py-3 text-center text-sm font-medium text-muted-foreground">
                  Gói hiện tại
                </div>
              ) : (
                <button
                  onClick={onCancel}
                  disabled={isUpgrading}
                  className="w-full rounded-xl border border-destructive/30 bg-destructive/5 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  Hủy gói
                </button>
              )
            ) : isDowngrade ? (
              <div className="w-full rounded-xl border border-border/40 bg-muted/20 py-3 text-center text-sm font-medium text-muted-foreground/60">
                {plan.id === "free" ? "Gói cơ bản" : "Gói thấp hơn"}
              </div>
            ) : (
              <button
                onClick={() => onUpgrade(plan.id)}
                disabled={isUpgrading}
                className={`w-full rounded-xl py-3.5 text-sm font-bold transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group/btn ${
                  plan.id === "ultra"
                    ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02]"
                    : "text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
                }`}
                style={
                  plan.id !== "ultra"
                    ? { background: "var(--gradient-hero)" }
                    : undefined
                }
              >
                <span className="flex items-center justify-center gap-2">
                  {isUpgrading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Nâng cấp ngay
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </>
                  )}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative glow */}
        {(isPopular || isCurrent) && (
          <div
            className="absolute -inset-px rounded-3xl opacity-20 blur-xl -z-10"
            style={{ background: "var(--gradient-hero)" }}
          />
        )}
      </div>
    );
  }
);

// ─── Confirm Modal ───────────────────────────────────────────────────────────

function ConfirmUpgradeModal({
  plan,
  isOpen,
  isLoading,
  onConfirm,
  onClose,
}: {
  plan: Plan | null;
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md mx-4 animate-slide-in-up overflow-hidden">
        {/* Gradient top accent */}
        <div
          className="h-1.5 w-full"
          style={{
            background:
              plan.id === "ultra"
                ? "linear-gradient(90deg, #f59e0b, #f97316, #ef4444)"
                : "var(--gradient-hero)",
          }}
        />

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                plan.id === "ultra"
                  ? "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white"
                  : "text-white"
              }`}
              style={
                plan.id !== "ultra"
                  ? { background: "var(--gradient-hero)" }
                  : undefined
              }
            >
              {plan.id === "ultra" ? (
                <Crown className="h-6 w-6" />
              ) : (
                <Zap className="h-6 w-6" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold">Nâng cấp lên {plan.name}</h2>
              <p className="text-xs text-muted-foreground">
                Xác nhận nâng cấp gói dịch vụ
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Gói dịch vụ</span>
              <span className="text-sm font-bold">{plan.name}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Giá</span>
              <span className="text-sm font-bold">
                {formatPrice(plan.price)}/{plan.period}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Thời hạn</span>
              <span className="text-sm font-bold">30 ngày</span>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 p-3 mb-6">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              Đây là thanh toán giả lập. Gói sẽ được kích hoạt ngay và có hiệu lực
              trong 30 ngày.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 rounded-xl py-3 text-sm font-bold text-white transition-all duration-300 cursor-pointer disabled:opacity-50 ${
                plan.id === "ultra"
                  ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:shadow-lg"
                  : "hover:shadow-lg"
              }`}
              style={
                plan.id !== "ultra"
                  ? { background: "var(--gradient-hero)" }
                  : undefined
              }
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                "Xác nhận nâng cấp"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Success Modal ───────────────────────────────────────────────────────────

function SuccessModal({
  plan,
  expiresAt,
  isOpen,
  onClose,
}: {
  plan: Plan | null;
  expiresAt: string | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md mx-4 animate-slide-in-up overflow-hidden">
        <div
          className="h-1.5 w-full"
          style={{
            background:
              plan.id === "ultra"
                ? "linear-gradient(90deg, #f59e0b, #f97316, #ef4444)"
                : "var(--gradient-hero)",
          }}
        />

        <div className="p-8 text-center">
          <div className="relative inline-flex mb-6">
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-3xl ${
                plan.id === "ultra"
                  ? "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white"
                  : "text-white"
              }`}
              style={
                plan.id !== "ultra"
                  ? { background: "var(--gradient-hero)" }
                  : undefined
              }
            >
              <PartyPopper className="h-10 w-10" />
            </div>
            <div className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
              <Check className="h-4 w-4" strokeWidth={3} />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2">Nâng cấp thành công! 🎉</h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Bạn đã nâng cấp thành công lên gói{" "}
            <span className="font-bold text-foreground">{plan.name}</span>. Tận
            hưởng tất cả tính năng premium ngay bây giờ!
          </p>

          {expiresAt && (
            <div className="rounded-xl bg-muted/30 border border-border/40 p-3 mb-6">
              <p className="text-xs text-muted-foreground">
                Gói có hiệu lực đến:{" "}
                <span className="font-bold text-foreground">
                  {formatDate(expiresAt)}
                </span>
              </p>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full rounded-xl py-3 text-sm font-bold text-white transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-lg"
            style={{ background: "var(--gradient-hero)" }}
          >
            Bắt đầu sử dụng
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Cancel Confirm Modal ────────────────────────────────────────────────────

function CancelModal({
  isOpen,
  isLoading,
  onConfirm,
  onClose,
}: {
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md mx-4 animate-slide-in-up">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Hủy gói dịch vụ</h2>
              <p className="text-xs text-muted-foreground">
                Thao tác này không thể hoàn tác
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed mb-6">
            Bạn có chắc chắn muốn hủy gói hiện tại? Tài khoản sẽ chuyển về gói{" "}
            <span className="font-semibold">Miễn phí</span> và bạn sẽ mất quyền
            truy cập các tính năng premium.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
            >
              Giữ gói hiện tại
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 rounded-xl bg-destructive py-3 text-sm font-bold text-white hover:bg-destructive/90 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                "Xác nhận hủy"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main PricingPage ────────────────────────────────────────────────────────

export default function PricingPage() {
  const { user, logout } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Modal states
  const [upgradeModal, setUpgradeModal] = useState<Plan | null>(null);
  const [successModal, setSuccessModal] = useState<{
    plan: Plan;
    expiresAt: string | null;
  } | null>(null);
  const [cancelModal, setCancelModal] = useState(false);

  const headers = {
    "x-user-id": user?.id ?? "",
    "x-user-role": user?.role ?? "user",
  };

  // Load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [plansRes, meRes] = await Promise.all([
        fetch("/api/subscription/plans"),
        fetch("/api/subscription/me", { headers }),
      ]);

      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setPlans(plansData.plans);
      }

      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentPlan(meData.plan || "free");
        setExpiresAt(meData.expiresAt);
      }
    } catch {
      setError("Không thể tải thông tin gói dịch vụ.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleLogout = useCallback(() => {
    logout();
    window.location.assign("/");
  }, [logout]);

  // Upgrade
  const handleUpgrade = useCallback(
    async (planId: string) => {
      const plan = plans.find((p) => p.id === planId);
      if (!plan) return;
      setUpgradeModal(plan);
    },
    [plans]
  );

  const confirmUpgrade = useCallback(async () => {
    if (!upgradeModal) return;
    setIsUpgrading(true);

    try {
      const res = await fetch("/api/subscription/upgrade", {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: upgradeModal.id }),
      });

      const data = await res.json();

      if (res.ok) {
        setCurrentPlan(upgradeModal.id);
        setExpiresAt(data.expiresAt);
        setUpgradeModal(null);
        setSuccessModal({
          plan: upgradeModal,
          expiresAt: data.expiresAt,
        });
      } else {
        setError(data.error || "Đã xảy ra lỗi khi nâng cấp.");
        setUpgradeModal(null);
      }
    } catch {
      setError("Đã xảy ra lỗi khi nâng cấp.");
      setUpgradeModal(null);
    } finally {
      setIsUpgrading(false);
    }
  }, [upgradeModal, headers]);

  // Cancel
  const confirmCancel = useCallback(async () => {
    setIsUpgrading(true);

    try {
      const res = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers,
      });

      const data = await res.json();

      if (res.ok) {
        setCurrentPlan("free");
        setExpiresAt(null);
        setCancelModal(false);
      } else {
        setError(data.error || "Đã xảy ra lỗi khi hủy gói.");
        setCancelModal(false);
      }
    } catch {
      setError("Đã xảy ra lỗi khi hủy gói.");
      setCancelModal(false);
    } finally {
      setIsUpgrading(false);
    }
  }, [headers]);

  const planDisplayName =
    currentPlan === "ultra" ? "Ultra" : currentPlan === "pro" ? "Pro" : "Miễn phí";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader
        navItems={userNavItems}
        activePath="/pricing"
        role="user"
        onLogout={handleLogout}
      />

      <main className="pt-16 min-h-screen transition-all duration-300">
        <div
          className="p-6 lg:p-8 space-y-8"
          style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}
        >
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/5 via-card to-accent-mint/5 p-8 lg:p-12">
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
                <Crown className="h-4 w-4" />
                Nâng cấp gói dịch vụ
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">
                Mở khóa toàn bộ sức mạnh{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-hero)" }}
                >
                  JobReady AI
                </span>
              </h1>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Chọn gói phù hợp với nhu cầu của bạn. Nâng cấp ngay để trải
                nghiệm đầy đủ tính năng AI tạo CV, phỏng vấn và luyện tập.
              </p>

              {/* Current plan badge */}
              {currentPlan !== "free" && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Bạn đang sử dụng gói{" "}
                  <span className="font-bold">{planDisplayName}</span>
                  {expiresAt && (
                    <span className="text-muted-foreground">
                      • Hết hạn: {formatDate(expiresAt)}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Decorative */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-accent-mint/10 rounded-full blur-3xl" />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-center gap-3">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
              <span className="text-sm text-destructive">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-xs text-destructive hover:underline cursor-pointer"
              >
                Đóng
              </button>
            </div>
          )}

          {/* Plans Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  currentPlan={currentPlan}
                  isUpgrading={isUpgrading}
                  onUpgrade={handleUpgrade}
                  onCancel={() => setCancelModal(true)}
                />
              ))}
            </div>
          )}

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-center mb-6">
              Câu hỏi thường gặp
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "Tôi có thể hủy gói bất cứ lúc nào không?",
                  a: "Có, bạn có thể hủy gói bất cứ lúc nào. Sau khi hủy, tài khoản sẽ chuyển về gói Miễn phí và bạn vẫn giữ được dữ liệu đã tạo.",
                },
                {
                  q: "Gói Pro và Ultra khác nhau như thế nào?",
                  a: "Gói Ultra bao gồm tất cả tính năng của Pro, cộng thêm phân tích CV nâng cao bằng AI, số lượng CV và phỏng vấn không giới hạn, cùng hỗ trợ ưu tiên.",
                },
                {
                  q: "Tôi có thể nâng cấp từ Pro lên Ultra không?",
                  a: "Có, bạn có thể nâng cấp lên gói cao hơn bất cứ lúc nào. Gói mới sẽ có hiệu lực ngay lập tức.",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border/60 bg-card/80 p-5 transition-all duration-300 hover:shadow-sm"
                >
                  <h3 className="text-sm font-bold mb-2">{faq.q}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <ConfirmUpgradeModal
        plan={upgradeModal}
        isOpen={!!upgradeModal}
        isLoading={isUpgrading}
        onConfirm={confirmUpgrade}
        onClose={() => setUpgradeModal(null)}
      />

      <SuccessModal
        plan={successModal?.plan ?? null}
        expiresAt={successModal?.expiresAt ?? null}
        isOpen={!!successModal}
        onClose={() => setSuccessModal(null)}
      />

      <CancelModal
        isOpen={cancelModal}
        isLoading={isUpgrading}
        onConfirm={confirmCancel}
        onClose={() => setCancelModal(false)}
      />
    </div>
  );
}
