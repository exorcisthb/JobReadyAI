import { useEffect, useMemo, useState, useCallback, memo, useRef } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader } from "@/components/dashboard-header";
import { useUserNavItems } from "@/pages/User/user-nav-items";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { QRCodeSVG } from "qrcode.react";
import { PaymentSuccessPopup } from "@/components/payment-success-popup";
import {
  Crown,
  Check,
  X,
  Sparkles,
  Zap,
  Shield,
  Star,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  HelpCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Lock,
  Clock,
  Flame,
  FileText,
  Mic,
  ChevronRight as ChevronNext,
} from "lucide-react";

interface PlanFeature {
  key: string;
  label: string;
  value: string;
  included: boolean;
  weeklyValue?: string;
  monthlyValue?: string;
}

const FEATURE_LABELS: Record<string, string> = {
  ai_interview_sessions: "pricing.feature.aiInterview",
  feedback_reports: "pricing.feature.feedback",
  cv_creation: "pricing.feature.cvCreation",
  practice_exercises: "pricing.feature.practice",
  cv_templates: "pricing.feature.cvTemplates",
  pdf_export: "pricing.feature.pdfExport",
  ai_cv_comparison: "pricing.feature.aiCvComparison",
  ai_cv_optimization: "pricing.feature.aiCvOptimization",
};

const PLAN_NAMES: Record<string, string> = {
  free: "pricing.planName.free",
  pro: "pricing.planName.pro",
  ultra: "pricing.planName.ultra",
  pro_interview: "pricing.planName.proInterview",
  ultra_interview: "pricing.planName.ultraInterview",
  pro_cv: "pricing.planName.proCv",
  ultra_cv: "pricing.planName.ultraCv",
};

function localizedPlanName(planId: string, fallbackName: string, t: (key: string) => string) {
  const key = PLAN_NAMES[planId];
  return key ? t(key) : fallbackName;
}

interface Plan {
  id: string;
  name: string;
  weeklyPrice: number;
  monthlyPrice: number;
  discount: number | null;
  positioning: string;
  period: string;
  popular?: boolean;
  features: PlanFeature[];
  referralDiscountActive?: boolean;
}

// ─── Format helpers ──────────────────────────────────────────────────────────

function formatPrice(price: number | undefined | null): string {
  if (price == null || isNaN(price)) return "—";
  if (price === 0) return "0đ";
  return price.toLocaleString("vi-VN") + "đ";
}

function formatFeatureValue(
  value: string,
  key: string,
  t: (key: string, options?: any) => string
): string {
  if (key === "cv_creation") {
    return t("pricing.featureValue.unlimited");
  }
  if (!isNaN(Number(value)) && ["ai_interview_sessions"].includes(key)) {
    return t("pricing.featureValue.perWeek", { count: value });
  }

  const valueKeys: Record<string, string> = {
    unlimited: "pricing.featureValue.unlimited",
    basic: "pricing.featureValue.basic",
    standard: "pricing.featureValue.standard",
    star_full: "pricing.featureValue.star_full",
    premium: "pricing.featureValue.premium",
    all: "pricing.featureValue.all",
    yes: "pricing.featureValue.yes",
    no: "pricing.featureValue.no",
  };

  return valueKeys[value] ? t(valueKeys[value]) : value;
}

function getSalePrice(plan: Plan): number | null {
  const basePrice = plan.weeklyPrice;
  if (plan.id === "free") return null;
  let discounted = basePrice;
  if (plan.discount && plan.discount > 0) {
    discounted = Math.round((basePrice * (1 - plan.discount / 100)) / 1000) * 1000;
  }
  if (plan.referralDiscountActive) {
    discounted = Math.round((discounted * 0.8) / 1000) * 1000;
  }
  return discounted < basePrice ? discounted : null;
}

function formatDate(dateStr: string, locale = "vi-VN"): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ReferralDiscountBanner({ reason, expiresAt }: { reason: string | null; expiresAt: string | null }) {
  const { t } = useTranslation();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  if (!expiresAt || new Date(expiresAt).getTime() <= now) return null;
  const remaining = new Date(expiresAt).getTime() - now;
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  const source = reason === "referral" ? t("pricing.ui.referralDiscount") : t("pricing.ui.newUserDiscount");
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-emerald-800 dark:text-emerald-300 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold">{source} {t("pricing.ui.extraDiscount")}</p>
      <p className="inline-flex shrink-0 items-center gap-2 text-sm font-bold"><Clock className="h-4 w-4" />{t("pricing.ui.remaining", { days })} {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</p>
    </div>
  );
}

// ─── Plan Card Component ─────────────────────────────────────────────────────

const PlanCard = memo(
  ({
    plan,
    currentPlan,
    isUpgrading,
    index,
    onUpgrade,
    onCancel,
    autoRenew = true,
  }: {
    plan: Plan;
    currentPlan: string;
    isUpgrading: boolean;
    index: number;
    onUpgrade: (planId: string) => void;
    onCancel: () => void;
    autoRenew?: boolean;
  }) => {
    const { t } = useTranslation();
    const isCurrent = currentPlan === plan.id;
    const isUltra = plan.id.includes("ultra");
    const isFree = plan.id === "free";
    const isDowngrade = currentPlan !== "free" && plan.id === "free";

    const originalPrice = plan.weeklyPrice;
    const salePrice = getSalePrice(plan);
    const displayPrice = salePrice ?? originalPrice;

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: index * 0.1,
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1],
        }}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        className={cn(
          "relative flex flex-col rounded-3xl transition-all duration-300 group overflow-hidden",
          isUltra
            ? "bg-gradient-to-b from-amber-500/[0.08] via-background to-orange-500/[0.04] border-2 border-amber-500/40 shadow-xl shadow-amber-500/10 dark:border-amber-400/40 hover:border-amber-500 hover:shadow-2xl hover:shadow-amber-500/20"
            : "bg-card/70 backdrop-blur-xl border border-border/80 shadow-md hover:shadow-xl hover:border-border transition-all",
          isCurrent && "ring-2 ring-primary/60 ring-offset-2 ring-offset-background"
        )}
      >
        {/* Glow Top Accent Line */}
        <div
          className={cn(
            "h-1.5 w-full",
            isUltra
              ? "bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500"
              : "bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 dark:from-slate-700 dark:to-slate-800"
          )}
        />

        {/* Floating Badges */}
        {isUltra && (
          <div className="absolute top-4 right-4 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-300 shadow-md shadow-amber-500/20 border border-amber-400/40 animate-pulse">
              <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-600" />
              {t("pricing.ui.vipUnlimited")}
            </span>
          </div>
        )}

        {isCurrent && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
              <Check className="h-3.5 w-3.5 stroke-[3]" />
              Đang sử dụng
            </span>
          </div>
        )}

        <div className="flex flex-col flex-1 p-7 sm:p-8 pt-8">
          {/* Header & Icon */}
          <div className="flex items-center gap-4 mb-5">
            <div
              className={cn(
                "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-105",
                isUltra
                  ? "bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white shadow-orange-500/25 ring-2 ring-amber-400/30"
                  : "bg-muted text-muted-foreground border border-border"
              )}
            >
              {isUltra ? (
                <Crown className="h-7 w-7 fill-white/20" />
              ) : (
                <Shield className="h-7 w-7" />
              )}
            </div>

            <div>
              <h3 className="text-2xl font-black tracking-tight">
                {isUltra ? (
                  <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                    {t("pricing.planName.ultra")}
                  </span>
                ) : (
                  <span>{t("pricing.planName.free")}</span>
                )}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isUltra
                  ? t("pricing.ui.currentPlanDescription")
                  : t("pricing.ui.basicPlanDescription")}
              </p>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="my-4 p-4 rounded-2xl bg-muted/40 dark:bg-muted/20 border border-border/50 flex flex-col justify-center min-h-[5.5rem]">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span
                className={cn(
                  "text-3xl sm:text-4xl font-black tracking-tight tabular-nums",
                  isUltra
                    ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent"
                    : "text-foreground"
                )}
              >
                {formatPrice(displayPrice)}
              </span>

              {!isFree && (
                <span className="text-sm font-semibold text-muted-foreground">
                  /{t("pricing.label.weekly")}
                </span>
              )}

              {isFree && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {t("pricing.ui.forever")}
                </span>
              )}
            </div>

            {!isFree && (
              <div className="flex items-center gap-2 mt-1.5">
                {salePrice != null && originalPrice > salePrice && (
                  <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/60">
                    {formatPrice(originalPrice)}
                  </span>
                )}
                {((plan.discount && plan.discount > 0) || plan.referralDiscountActive) && (
                  <span
                    className={cn(
                      "text-[11px] font-bold px-2 py-0.5 rounded-full",
                      isUltra
                        ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    )}
                  >
                    {plan.referralDiscountActive ? t("pricing.ui.extra20") : t("pricing.ui.savePercent", { percent: plan.discount })}
                  </span>
                )}
                <span className="text-[11px] text-muted-foreground ml-auto font-medium">
                  {t("pricing.ui.weeklyCycle")}
                </span>
              </div>
            )}
          </div>

          <div className="mb-5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>
              {isUltra
                ? t("pricing.ui.unlimitedInterviewBenefit")
                : t("pricing.ui.basicInterviewBenefit")}
            </span>
          </div>

          <div className="h-px w-full bg-border/60 my-2" />

          {/* Features Checklist */}
          <div className="flex-1 py-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              {t("pricing.ui.planBenefits")}
            </p>
            <ul className="space-y-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  {feature.included ? (
                    <div
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full mt-0.5",
                        isUltra
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                          : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      )}
                    >
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted/60 text-muted-foreground/40 mt-0.5">
                      <X className="h-3 w-3 stroke-[2.5]" />
                    </div>
                  )}
                  <span
                    className={cn(
                      "text-xs sm:text-sm leading-tight",
                      feature.included
                        ? "text-foreground font-medium"
                        : "text-muted-foreground/50 line-through"
                    )}
                  >
                    {FEATURE_LABELS[feature.key] ? t(FEATURE_LABELS[feature.key]) : feature.label}
                    {(feature.weeklyValue || feature.monthlyValue) &&
                      ["ai_interview_sessions", "feedback_reports", "cv_creation", "cv_templates", "pdf_export"].includes(feature.key) &&
                      ` (${formatFeatureValue(feature.weeklyValue || feature.monthlyValue || "", feature.key, t)})`}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action CTA Button */}
          <div className="mt-6 pt-2">
            {isCurrent ? (
              isFree ? (
                <div className="w-full rounded-2xl border border-border/80 bg-muted/40 py-3.5 text-center text-sm font-bold text-muted-foreground flex items-center justify-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" />
                  {t("pricing.ui.planInUse")}
                </div>
              ) : !autoRenew ? (
                <button
                  onClick={() => onUpgrade(plan.id)}
                  disabled={isUpgrading}
                  className={cn(
                    "w-full rounded-2xl py-3.5 text-sm font-black transition-all duration-300 cursor-pointer disabled:opacity-50 text-white shadow-lg flex items-center justify-center gap-2",
                    isUltra
                      ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-orange-500/30 hover:scale-[1.02] hover:shadow-orange-500/40"
                      : "bg-primary shadow-primary/30 hover:scale-[1.02] hover:shadow-primary/40"
                  )}
                >
                  {isUpgrading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {t("pricing.ui.renewPlan")} <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={onCancel}
                  disabled={isUpgrading}
                  className="w-full rounded-2xl border border-destructive/30 bg-destructive/5 py-3.5 text-xs font-bold text-destructive hover:bg-destructive/10 transition-all cursor-pointer disabled:opacity-50"
                >
                  {t("pricing.ui.cancelAutoRenew")}
                </button>
              )
            ) : isDowngrade && isFree ? (
              <div className="w-full rounded-2xl border border-border/50 bg-muted/20 py-3.5 text-center text-xs font-semibold text-muted-foreground">
                {t("pricing.ui.defaultFreePlan")}
              </div>
            ) : (
              <button
                onClick={() => onUpgrade(plan.id)}
                disabled={isUpgrading}
                className={cn(
                  "w-full rounded-2xl py-4 text-sm font-black transition-all duration-300 cursor-pointer disabled:opacity-50 text-white shadow-xl flex items-center justify-center gap-2 group/btn relative overflow-hidden",
                  isUltra
                    ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.99]"
                    : "bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white hover:scale-[1.02]"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full duration-1000 transition-transform ease-in-out" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isUpgrading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {isFree
                        ? t("pricing.ui.startFree")
                        : t("pricing.ui.upgradeUltra")}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </>
                  )}
                </span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
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
  const { t } = useTranslation();
  if (!isOpen || !plan) return null;

  const originalPrice = plan.weeklyPrice;
  const salePrice = getSalePrice(plan);
  const displayPrice = salePrice ?? originalPrice;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-card border border-border/80 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div
          className={cn(
            "h-2 w-full",
            plan.id.includes("ultra")
              ? "bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"
              : "bg-primary"
          )}
        />

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-4 mb-6">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg",
                plan.id.includes("ultra")
                  ? "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-orange-500/30"
                  : "bg-primary"
              )}
            >
              {plan.id.includes("ultra") ? (
                <Crown className="h-7 w-7" />
              ) : (
                <Zap className="h-7 w-7" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-black">
                {t("pricing.ui.upgradePlan", { planName: localizedPlanName(plan.id, plan.name, t) })}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("pricing.ui.payWithVietQr")}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("pricing.ui.servicePlan")}</span>
              <span className="font-bold text-foreground">
                {localizedPlanName(plan.id, plan.name, t)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("pricing.ui.billingCycle")}</span>
              <span className="font-bold text-foreground">{t("pricing.ui.weekly7Days")}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("pricing.ui.amountDue")}</span>
              <span className="font-black text-primary text-base">
                {formatPrice(displayPrice)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("pricing.ui.activation")}</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 fill-emerald-500" /> {t("pricing.ui.instantAutomatic")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-2xl border border-border py-3.5 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
            >
              {t("pricing.ui.back")}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                "flex-1 rounded-2xl py-3.5 text-sm font-black text-white transition-all duration-300 cursor-pointer disabled:opacity-50 shadow-lg flex items-center justify-center gap-2",
                plan.id.includes("ultra")
                  ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-orange-500/25 hover:shadow-orange-500/40"
                  : "bg-primary shadow-primary/25 hover:shadow-primary/40"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {t("pricing.ui.continuePayment")} <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
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
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-card border border-border/80 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{t("pricing.cancel.title")}</h2>
              <p className="text-xs text-muted-foreground">{t("pricing.desc.cancelWarning")}</p>
            </div>
          </div>

          <p className="text-sm leading-relaxed mb-6 text-muted-foreground">
            {t("pricing.desc.cancelConfirm")}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-2xl border border-border py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
            >
              {t("pricing.btn.keepPlan")}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 rounded-2xl bg-destructive py-3 text-sm font-bold text-white hover:bg-destructive/90 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : t("pricing.btn.confirmCancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Payment Gateway Modal (PayOS Real Flow) ─────────────────────────────────
type PaymentGatewayData = {
  planId: string;
  planName: string;
  amount: number;
  discountPercentage?: number | null;
};

function PaymentGatewayModal({
  isOpen,
  onClose,
  gatewayData,
  headers,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  gatewayData: PaymentGatewayData | null;
  headers: Record<string, string>;
  onSuccess: (orderCode: number) => void;
}) {
  const { t } = useTranslation();
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [orderCode, setOrderCode] = useState<number | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [, setCheckoutUrl] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const requestIdRef = useRef<{ key: string | null; planId: string | null }>({ key: null, planId: null });

  useEffect(() => {
    if (!isOpen || !gatewayData) return;

    setOrderCode(null);
    setQrCode(null);
    setCheckoutUrl(null);
    setCreateError(null);
    setPolling(false);

    if (requestIdRef.current.key && requestIdRef.current.planId !== gatewayData.planId) {
      requestIdRef.current.key = null;
    }
    requestIdRef.current.planId = gatewayData.planId;

    const createPayment = async () => {
      setLoadingCreate(true);
      try {
        if (!requestIdRef.current.key) {
          requestIdRef.current.key = crypto.randomUUID();
        }
        const res = await fetch("/api/payment/create", {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({
            planId: gatewayData.planId,
            planName: gatewayData.planName,
            amount: gatewayData.amount,
            discountPercentage: gatewayData.discountPercentage,
            billingCycle: "weekly",
            requestId: requestIdRef.current.key,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setOrderCode(data.orderCode);
          setQrCode(data.qrCode);
          setCheckoutUrl(data.checkoutUrl);
        } else {
          setCreateError(t("pricing.ui.paymentCreateError"));
        }
      } catch {
        setCreateError(t("pricing.ui.connectionError"));
      } finally {
        setLoadingCreate(false);
      }
    };

    void createPayment();
  }, [isOpen, gatewayData, headers, t]);

  useEffect(() => {
    if (!orderCode || !isOpen) return;

    setPolling(true);
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/check/${orderCode}`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.order?.status === "paid") {
            clearInterval(pollingRef.current!);
            setPolling(false);
            onSuccess(orderCode);
          }
        }
      } catch {
        // Silent – keep polling
      }
    }, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [orderCode, isOpen, headers, onSuccess]);

  const handleClose = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    setPolling(false);
    onClose();
  };

  if (!isOpen || !gatewayData) return null;

  const formattedAmount = gatewayData.amount.toLocaleString("vi-VN") + "đ";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={handleClose} />
      <div className="relative bg-card border border-border/80 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {(loadingCreate || polling) && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-muted overflow-hidden z-20">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse" style={{ width: "100%" }} />
          </div>
        )}

        <div className="flex flex-col md:flex-row min-h-[480px]">
          {/* Left: Info panel */}
          <div className="w-full md:w-5/12 bg-muted/40 border-b md:border-b-0 md:border-r border-border/60 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary mb-4">
                <Lock className="h-3.5 w-3.5" /> {t("pricing.ui.securePayment")}
              </div>
              <h3 className="text-xl font-black text-foreground">
                {t("pricing.ui.scanVietQr")}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {t("pricing.ui.scanPaymentInstructions")}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-border/60 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">{t("pricing.ui.subscriptionPlan")}</p>
                <p className="text-sm font-bold text-foreground">{gatewayData.planName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t("pricing.ui.validFor7Days")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t("pricing.ui.totalPayment")}</p>
                <p className="text-2xl font-black text-primary">{formattedAmount}</p>
              </div>

              {polling && (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin shrink-0" />
                  <span>{t("pricing.ui.awaitingTransfer")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: QR Code */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between bg-card items-center text-center">
            {loadingCreate ? (
              <div className="my-auto flex flex-col items-center justify-center gap-4 py-12">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-semibold text-muted-foreground">
                  {t("pricing.ui.creatingQr")}
                </p>
              </div>
            ) : createError ? (
              <div className="my-auto flex flex-col items-center justify-center gap-4 py-8">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <p className="text-sm text-destructive font-medium max-w-xs">{createError}</p>
                <button
                  onClick={handleClose}
                  className="rounded-2xl border border-border px-6 py-2.5 text-xs font-bold hover:bg-muted transition cursor-pointer"
                >
                  {t("pricing.ui.close")}
                </button>
              </div>
            ) : qrCode ? (
              <>
                <div className="my-auto flex flex-col items-center space-y-4 py-2">
                  <div className="p-3 bg-white rounded-3xl shadow-xl border-2 border-primary/20 ring-4 ring-primary/5">
                    <QRCodeSVG value={qrCode} size={190} level="M" />
                  </div>

                  <div className="space-y-1 max-w-xs">
                    <p className="text-xs font-bold text-foreground">
                      {t("pricing.ui.scanBankingApp")}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {t("pricing.ui.autoActivate")}
                    </p>
                  </div>
                </div>

                <div className="w-full pt-4 border-t border-border/50">
                  <button
                    onClick={handleClose}
                    className="w-full rounded-2xl border border-border py-3 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
                  >
                    {t("pricing.ui.cancelTransaction")}
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Transaction History Section ─────────────────────────────────────────────

interface TransactionHistorySectionProps {
  loading: boolean;
  transactions: any[];
}

function TransactionHistorySection({ loading, transactions }: TransactionHistorySectionProps) {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = useMemo(
    () => Math.ceil(transactions.length / itemsPerPage) || 1,
    [transactions.length, itemsPerPage]
  );

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return transactions.slice(start, start + itemsPerPage);
  }, [transactions, currentPage, itemsPerPage]);

  if (loading) {
    return (
      <div className="bg-card/70 border border-border/80 rounded-3xl p-8 flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-card/70 border border-border/80 rounded-3xl p-5 sm:p-8 text-center text-xs sm:text-sm text-muted-foreground">
        {t("pricing.ui.noTransactions")}
      </div>
    );
  }

  return (
    <div className="bg-card/70 backdrop-blur-xl border border-border/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            {t("pricing.ui.transactionHistory")}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("pricing.ui.transactionHistoryDesc")}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-border/80 text-muted-foreground font-bold text-[11px] uppercase">
              <th className="pb-3 pr-4">{t("pricing.ui.orderId")}</th>
              <th className="pb-3 px-4">{t("pricing.ui.serviceName")}</th>
              <th className="pb-3 px-4">{t("pricing.ui.amount")}</th>
              <th className="pb-3 px-4">{t("pricing.ui.paymentMethod")}</th>
              <th className="pb-3 px-4">{t("pricing.ui.time")}</th>
              <th className="pb-3 pl-4">{t("pricing.ui.status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-medium">
            {paginatedTransactions.map((tx) => (
              <tr key={tx.id} className="text-foreground hover:bg-muted/20 transition-colors">
                <td className="py-3.5 pr-4 font-mono text-xs text-muted-foreground">
                  {tx.id.substring(0, 8).toUpperCase()}...
                </td>
                <td className="py-3.5 px-4 font-bold text-foreground">
                  {localizedPlanName(tx.item_id, tx.item_name, t)}
                </td>
                <td className="py-3.5 px-4 text-primary tabular-nums font-black">
                  {tx.amount.toLocaleString("vi-VN")}đ
                </td>
                <td className="py-3.5 px-4 text-muted-foreground text-xs">
                  VietQR / PayOS
                </td>
                <td className="py-3.5 px-4 text-muted-foreground text-xs">
                  {new Date(tx.created_at).toLocaleString(i18n.language.startsWith("vi") ? "vi-VN" : "en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td className="py-3.5 pl-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t("pricing.ui.success")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/40 pt-4 text-xs font-semibold">
          <span className="text-muted-foreground">
            {t("pricing.ui.pageOf", { current: currentPage, total: totalPages })}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 font-bold text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4" /> {t("pricing.ui.previous")}
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 font-bold text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {t("pricing.ui.next")} <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main PricingPage ────────────────────────────────────────────────────────

type PricingMode = "portal" | "interview" | "cv";

interface PricingPageProps {
  mode: PricingMode;
}

export default function PricingPage({ mode = "portal" as PricingMode }: PricingPageProps) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();

  const [interviewPlans, setInterviewPlans] = useState<Plan[]>([]);
  const [cvPlans, setCvPlans] = useState<Plan[]>([]);

  const [currentInterviewPlan, setCurrentInterviewPlan] = useState("free");
  const [interviewExpiresAt, setInterviewExpiresAt] = useState<string | null>(null);
  const [currentCvPlan, setCurrentCvPlan] = useState("free");
  const [cvExpiresAt, setCvExpiresAt] = useState<string | null>(null);
  const [interviewAutoRenew, setInterviewAutoRenew] = useState(true);
  const [cvAutoRenew, setCvAutoRenew] = useState(true);
  const [referralDiscountExpiresAt, setReferralDiscountExpiresAt] = useState<string | null>(null);
  const [discountOfferReason, setDiscountOfferReason] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [successPopupData, setSuccessPopupData] = useState<{
    planId: string;
    planName: string;
    amount: number;
    orderCode: string | number;
  } | null>(null);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [gatewayData, setGatewayData] = useState<PaymentGatewayData | null>(null);

  const [upgradeModal, setUpgradeModal] = useState<Plan | null>(null);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<"interview" | "cv" | null>(null);

  const headers = useMemo(
    () => ({
      "x-user-id": user?.id ?? "",
      "x-user-role": user?.role ?? "user",
    }),
    [user?.id, user?.role]
  );

  const fetchTransactions = useCallback(async () => {
    setTransactionsLoading(true);
    try {
      const res = await fetch("/api/subscription/transactions", { headers });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (e) {
      console.error("Failed to load transaction history:", e);
    } finally {
      setTransactionsLoading(false);
    }
  }, [headers]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [plansRes, meRes] = await Promise.all([
        fetch("/api/subscription/plans"),
        fetch("/api/subscription/me", { headers }),
      ]);

      let referralDiscountActive = false;
      let meData: any = null;
      if (meRes.ok) {
        meData = await meRes.json();
        referralDiscountActive = Boolean(meData.referralDiscountActive);
      }

      if (plansRes.ok) {
        const plansData = await plansRes.json();
        const applyReferralDiscount = (plan: Plan): Plan => ({
          ...plan,
          referralDiscountActive: referralDiscountActive && plan.id !== "free",
        });
        setInterviewPlans((plansData.interviewPlans || []).filter((p: Plan) => !p.id.includes("pro")).map(applyReferralDiscount));
        setCvPlans((plansData.cvPlans || []).filter((p: Plan) => !p.id.includes("pro")).map(applyReferralDiscount));
      }

      if (meData) {
        setReferralDiscountExpiresAt(meData.referralDiscountExpiresAt || null);
        setDiscountOfferReason(meData.discountOfferReason || null);
        setCurrentInterviewPlan(meData.planInterview || "free");
        setInterviewExpiresAt(meData.expiresInterview);
        setCurrentCvPlan(meData.planCv || "free");
        setCvExpiresAt(meData.expiresCv);
        setInterviewAutoRenew(meData.interviewAutoRenew !== false);
        setCvAutoRenew(meData.cvAutoRenew !== false);
      }

      void fetchTransactions();
    } catch {
      setError(t("pricing.error.loadPlan"));
    } finally {
      setLoading(false);
    }
  }, [headers, fetchTransactions, t]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleLogout = useCallback(() => {
    logout();
    window.location.assign("/");
  }, [logout]);

  const handleUpgrade = useCallback(
    (planId: string) => {
      const plan = [...interviewPlans, ...cvPlans].find((p) => p.id === planId);
      if (!plan) return;
      setUpgradeModal(plan);
    },
    [interviewPlans, cvPlans]
  );

  const openPaymentGateway = useCallback(
    (plan: Plan) => {
      const originalPrice = plan.weeklyPrice;
      const salePrice = getSalePrice(plan);
      const finalPrice = salePrice ?? originalPrice;
      const displayName = localizedPlanName(plan.id, plan.name, t);
      setUpgradeModal(null);
      setGatewayData({
        planId: plan.id,
        planName: displayName,
        amount: finalPrice,
        discountPercentage: plan.discount,
      });
    },
    [t]
  );

  const handleUpgradeConfirm = useCallback(() => {
    if (!upgradeModal) return;
    openPaymentGateway(upgradeModal);
  }, [upgradeModal, openPaymentGateway]);

  const confirmCancel = useCallback(async () => {
    if (!cancelTarget) return;
    setIsUpgrading(true);

    try {
      const res = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ target: cancelTarget }),
      });

      const data = await res.json();

      if (res.ok) {
        if (cancelTarget === "interview") {
          setInterviewAutoRenew(false);
        } else {
          setCvAutoRenew(false);
        }
        setCancelModal(false);
        setCancelTarget(null);
      } else {
        setError(t("pricing.error.cancel"));
        setCancelModal(false);
      }
    } catch {
      setError(t("pricing.error.cancel"));
      setCancelModal(false);
    } finally {
      setIsUpgrading(false);
    }
  }, [headers, cancelTarget, t]);

  // ───────────────────────────────────────────────────────────────────────────
  // 1. GIAO DIỆN TRANG 1 (PORTAL OVERVIEW - /pricing)
  // ───────────────────────────────────────────────────────────────────────────
  if (mode === "portal") {
    return (
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
        <DashboardHeader
          navItems={useUserNavItems()}
          activePath="/pricing"
          role="user"
          onLogout={handleLogout}
        />

        {/* Floating FAQ Help Widget */}
        <div className="fixed top-20 right-6 lg:right-8 z-40 group/pagefaq">
          <button
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-card/90 hover:bg-primary/10 text-primary transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-md cursor-pointer hover:border-primary/60"
            title={t("pricing.ui.faqTitle")}
          >
            <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75 group-hover/pagefaq:opacity-100" />
            <HelpCircle className="relative h-6 w-6 text-primary" />
          </button>

          <div className="pointer-events-none absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl border border-border bg-card/95 shadow-2xl backdrop-blur-xl z-50 opacity-0 group-hover/pagefaq:opacity-100 group-hover/pagefaq:pointer-events-auto transition-all duration-300 translate-y-1 group-hover/pagefaq:translate-y-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-border/50 text-left bg-gradient-to-r from-primary/10 via-card to-indigo-500/10">
              <h3 className="text-sm font-black flex items-center gap-2 text-foreground">
                <HelpCircle className="h-4.5 w-4.5 text-primary" />
                {t("pricing.ui.faqTitle")}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {t("pricing.ui.portalFaqSubtitle")}
              </p>
            </div>
            <div className="divide-y divide-border/40 max-h-[60vh] overflow-y-auto text-left">
              {[
                {
                  q: t("pricing.ui.faqWeekQuestion"),
                  a: t("pricing.ui.faqWeekAnswer"),
                },
                {
                  q: t("pricing.ui.faqPaymentQuestion"),
                  a: t("pricing.ui.faqPaymentAnswer"),
                },
                {
                  q: t("pricing.ui.faqBothQuestion"),
                  a: t("pricing.ui.faqBothAnswer"),
                },
                {
                  q: t("pricing.ui.faqCancelQuestion"),
                  a: t("pricing.ui.faqCancelAnswer"),
                },
              ].map((faq, i) => (
                <div key={i} className="px-5 py-3.5 hover:bg-muted/30 transition-colors">
                  <p className="text-xs font-bold text-foreground mb-1 flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">•</span>
                    {faq.q}
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed pl-3 font-normal">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <main className="pt-16 min-h-screen transition-all duration-300">
          <div
            className="p-4 sm:p-6 lg:p-10 space-y-10 max-w-7xl mx-auto"
            style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}
          >
            <ReferralDiscountBanner reason={discountOfferReason} expiresAt={referralDiscountExpiresAt} />
            {/* Hero Portal Header */}
            <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-primary/10 via-card to-indigo-500/10 p-4 sm:p-8 lg:p-12 shadow-xl">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold bg-primary/10 text-primary border border-primary/20 shadow-sm backdrop-blur-md">
                  <Crown className="h-4 w-4" />
                  {t("pricing.ui.upgradeCenter")}
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  {t("pricing.ui.chooseAiTool")} {" "}
                  <span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {t("pricing.ui.careerBreakthrough")}
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {t("pricing.ui.portalDescription")}
                </p>

                {/* Badges trạng thái 2 gói */}
                <div className="pt-3 flex flex-wrap justify-center gap-3 text-xs">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 font-medium text-primary shadow-sm">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{t("pricing.ui.aiInterview")} </span>
                    <span className="font-bold">
                      {currentInterviewPlan === "free"
                        ? t("pricing.ui.free")
                        : t("pricing.planName.ultraInterview")}
                    </span>
                    {interviewExpiresAt && currentInterviewPlan !== "free" && (
                      <span className="text-muted-foreground ml-1">
                        • {t("pricing.ui.expires")} {formatDate(interviewExpiresAt, i18n.language.startsWith("vi") ? "vi-VN" : "en-US")}
                      </span>
                    )}
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-1.5 font-medium text-indigo-600 dark:text-indigo-400 shadow-sm">
                    <Crown className="h-3.5 w-3.5" />
                    <span>{t("pricing.ui.aiCv")} </span>
                    <span className="font-bold">
                      {currentCvPlan === "free"
                        ? t("pricing.ui.free")
                        : t("pricing.planName.ultraCv")}
                    </span>
                    {cvExpiresAt && currentCvPlan !== "free" && (
                      <span className="text-muted-foreground ml-1">
                        • {t("pricing.ui.expires")} {formatDate(cvExpiresAt, i18n.language.startsWith("vi") ? "vi-VN" : "en-US")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2 Thẻ Lựa Chọn Nâng Cấp Chủ Đạo (Portal Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Card 1: AI Luyện Phỏng Vấn */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => window.location.assign("/pricing/interview")}
                className="group relative flex flex-col justify-between rounded-3xl border-2 border-primary/30 bg-gradient-to-b from-primary/[0.07] via-card to-background p-5 sm:p-10 shadow-xl hover:shadow-2xl hover:border-primary transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/15 rounded-full blur-3xl group-hover:bg-primary/25 transition-all duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                      <Mic className="h-8 w-8" />
                    </div>
                    <span className="px-3.5 py-1 rounded-full text-xs font-black bg-primary/10 text-primary border border-primary/20 shadow-sm">
                       {t("pricing.ui.interviewHot")}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black mb-3 text-foreground group-hover:text-primary transition-colors">
                     {t("pricing.ui.upgradeInterview")}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                     {t("pricing.ui.interviewCardDescription")}
                  </p>

                  <div className="space-y-3 mb-8">
                    {[
                      t("pricing.ui.interviewBenefit1"),
                      t("pricing.ui.interviewBenefit2"),
                      t("pricing.ui.interviewBenefit3"),
                      t("pricing.ui.interviewBenefit4"),
                    ].map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-foreground/90">
                        <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-border/60">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.assign("/pricing/interview");
                    }}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white font-black text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                     {t("pricing.ui.viewPlans")} <ChevronNext className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>

              {/* Card 2: AI Tạo & Tối Ưu CV */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => window.location.assign("/pricing/cv")}
                className="group relative flex flex-col justify-between rounded-3xl border-2 border-indigo-500/30 bg-gradient-to-b from-indigo-500/[0.07] via-card to-background p-5 sm:p-10 shadow-xl hover:shadow-2xl hover:border-indigo-500 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl group-hover:bg-indigo-500/25 transition-all duration-500 pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                      <FileText className="h-8 w-8" />
                    </div>
                    <span className="px-3.5 py-1 rounded-full text-xs font-black bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm">
                       {t("pricing.ui.atsStandard")}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black mb-3 text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                     {t("pricing.ui.upgradeCv")}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                     {t("pricing.ui.cvCardDescription")}
                  </p>

                  <div className="space-y-3 mb-8">
                    {[
                      t("pricing.ui.cvBenefit1"),
                      t("pricing.ui.cvBenefit2"),
                      t("pricing.ui.cvBenefit3"),
                      t("pricing.ui.cvBenefit4"),
                    ].map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-foreground/90">
                        <div className="h-5 w-5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-border/60">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.assign("/pricing/cv");
                    }}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                     {t("pricing.ui.viewPlans")} <ChevronNext className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Lịch sử giao dịch */}
            <div className="pt-4 max-w-5xl mx-auto">
              <TransactionHistorySection
                loading={transactionsLoading}
                transactions={transactions}
              />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2. GIAO DIỆN TRANG CHI TIẾT GÓI (INTERVIEW HOẶC CV)
  // ───────────────────────────────────────────────────────────────────────────
  const isInterviewPage = mode === "interview";
  const currentPlans = isInterviewPage ? interviewPlans : cvPlans;
  const activePlanId = isInterviewPage ? currentInterviewPlan : currentCvPlan;
  const activeAutoRenew = isInterviewPage ? interviewAutoRenew : cvAutoRenew;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <DashboardHeader
        navItems={useUserNavItems()}
        activePath="/pricing"
        role="user"
        onLogout={handleLogout}
      />

      {/* Floating FAQ Help Widget fixed in viewport */}
      <div className="fixed top-20 right-6 lg:right-8 z-40 group/pagefaq">
        <button
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-card/90 hover:bg-primary/10 text-primary transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-md cursor-pointer hover:border-primary/60"
          title={t("pricing.ui.faqTitle")}
        >
          <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75 group-hover/pagefaq:opacity-100" />
          <HelpCircle className="relative h-6 w-6 text-primary" />
        </button>

        <div className="pointer-events-none absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl border border-border bg-card/95 shadow-2xl backdrop-blur-xl z-50 opacity-0 group-hover/pagefaq:opacity-100 group-hover/pagefaq:pointer-events-auto transition-all duration-300 translate-y-1 group-hover/pagefaq:translate-y-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50 text-left bg-gradient-to-r from-primary/10 via-card to-indigo-500/10">
            <h3 className="text-sm font-black flex items-center gap-2 text-foreground">
              <HelpCircle className="h-4.5 w-4.5 text-primary" />
              {t("pricing.ui.faqTitle")}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {t("pricing.ui.detailFaqSubtitle")}
            </p>
          </div>
          <div className="divide-y divide-border/40 max-h-[60vh] overflow-y-auto text-left">
            {[
              {
                q: t("pricing.ui.faqWeekQuestion"),
                a: t("pricing.ui.faqWeekAnswer"),
              },
              {
                q: t("pricing.ui.faqPaymentQuestion"),
                a: t("pricing.ui.faqPaymentAnswer"),
              },
              {
                q: t("pricing.ui.faqCancelQuestion"),
                a: t("pricing.ui.faqCancelAnswer"),
              },
              {
                q: t("pricing.ui.faqUltraQuestion"),
                a: t("pricing.ui.faqUltraAnswer"),
              },
            ].map((faq, i) => (
              <div key={i} className="px-5 py-3.5 hover:bg-muted/30 transition-colors">
                <p className="text-xs font-bold text-foreground mb-1 flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">•</span>
                  {faq.q}
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed pl-3 font-normal">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="pt-16 min-h-screen transition-all duration-300">
        <div
          className="p-4 sm:p-6 lg:p-10 space-y-8 max-w-7xl mx-auto"
          style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}
        >
          <ReferralDiscountBanner reason={discountOfferReason} expiresAt={referralDiscountExpiresAt} />
          <div className="relative">
            <button
              onClick={() => window.location.assign("/pricing")}
              className="group relative z-20 mb-4 inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-card px-4 py-2.5 text-xs font-bold text-muted-foreground shadow-sm transition-all duration-300 hover:bg-muted hover:text-foreground hover:shadow-md cursor-pointer lg:absolute lg:top-0 lg:mb-0"
              style={{ left: "calc(0px - var(--sidebar-width))" }}
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              {t("pricing.ui.backToServices")}
            </button>
            {/* Hero Banner của trang chi tiết */}
            <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-primary/10 via-card to-indigo-500/10 p-4 sm:p-8 lg:p-10 shadow-xl">
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold bg-primary/10 text-primary border border-primary/20 shadow-sm backdrop-blur-md">
                {isInterviewPage ? <Mic className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                {isInterviewPage ? t("pricing.ui.interviewPriceTitle") : t("pricing.ui.cvPriceTitle")}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                {isInterviewPage ? (
                  <>
                    {t("pricing.ui.upgradeFeature")}{" "}
                    <span className="bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {t("pricing.ui.interviewName")}
                    </span>
                  </>
                ) : (
                  <>
                    {t("pricing.ui.upgradeFeature")}{" "}
                    <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {t("pricing.ui.cvName")}
                    </span>
                  </>
                )}
              </h1>

              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
                {isInterviewPage
                  ? t("pricing.ui.interviewSectionDescription")
                  : t("pricing.ui.cvSectionDescription")}
              </p>

              {/* Trạng thái gói hiện tại */}
              <div className="pt-2 flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{t("pricing.ui.currentPlan")} </span>
                  <span className="font-bold">
                    {activePlanId === "free"
                      ? t("pricing.ui.free")
                      : t("pricing.ui.ultraPlan")}
                  </span>
                  {((isInterviewPage ? interviewExpiresAt : cvExpiresAt) && activePlanId !== "free") && (
                    <span className="text-muted-foreground ml-1">
                      • {t("pricing.ui.expires")} {formatDate((isInterviewPage ? interviewExpiresAt : cvExpiresAt)!, i18n.language.startsWith("vi") ? "vi-VN" : "en-US")}
                    </span>
                  )}
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 flex items-center gap-3 text-destructive">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-xs underline font-bold cursor-pointer"
              >
                {t("pricing.ui.closeError")}
              </button>
            </div>
          )}

          {/* Pricing Cards Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground font-semibold">
                {t("pricing.ui.loadingPlans")}
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
                {currentPlans.map((plan, idx) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    currentPlan={activePlanId}
                    isUpgrading={isUpgrading}
                    index={idx}
                    onUpgrade={handleUpgrade}
                    onCancel={() => {
                      setCancelTarget(isInterviewPage ? "interview" : "cv");
                      setCancelModal(true);
                    }}
                    autoRenew={activeAutoRenew}
                  />
                ))}
              </div>

              {/* Lịch sử giao dịch */}
              <TransactionHistorySection
                loading={transactionsLoading}
                transactions={transactions}
              />
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <ConfirmUpgradeModal
        plan={upgradeModal}
        isOpen={!!upgradeModal}
        isLoading={isUpgrading}
        onConfirm={handleUpgradeConfirm}
        onClose={() => setUpgradeModal(null)}
      />

      <CancelModal
        isOpen={cancelModal}
        isLoading={isUpgrading}
        onConfirm={confirmCancel}
        onClose={() => setCancelModal(false)}
      />

      <PaymentGatewayModal
        isOpen={!!gatewayData}
        onClose={() => setGatewayData(null)}
        gatewayData={gatewayData}
        headers={headers}
        onSuccess={(orderCode) => {
          if (gatewayData) {
            setSuccessPopupData({
              planId: gatewayData.planId,
              planName: gatewayData.planName,
              amount: gatewayData.amount,
              orderCode: orderCode,
            });
          }
          setGatewayData(null);
        }}
      />

      <PaymentSuccessPopup
        isOpen={!!successPopupData}
        onClose={() => {
          setSuccessPopupData(null);
          void loadData();
          void fetchTransactions();
        }}
        planName={successPopupData?.planName || ""}
        amount={successPopupData?.amount || 0}
        orderCode={successPopupData?.orderCode || ""}
        onProceed={() => {
          setSuccessPopupData(null);
          void loadData();
          void fetchTransactions();
          window.location.assign("/dashboard");
        }}
      />
    </div>
  );
}
