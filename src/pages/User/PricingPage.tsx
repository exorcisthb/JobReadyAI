import { useEffect, useMemo, useState, useCallback, memo, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader } from "@/components/dashboard-header";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { useUserNavItems } from "@/pages/User/user-nav-items";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
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
  PartyPopper,
  ShoppingCart,
  Plus,
  Minus,
  HelpCircle,
} from "lucide-react";

interface PlanFeature {
  key: string;
  label: string;
  value: string;
  included: boolean;
}

const FEATURE_LABELS: Record<string, string> = {
  ai_interview_sessions: "pricing.feature.aiInterview",
  feedback_reports: "pricing.feature.feedback",
  cv_creation: "pricing.feature.cvCreation",
  practice_exercises: "pricing.feature.practice",
  cv_templates: "pricing.feature.cvTemplates",
  pdf_export: "pricing.feature.pdfExport",
  advanced_cv_analysis: "pricing.feature.advancedAnalysis",
  ai_cv_comparison: "pricing.feature.aiCvComparison",
  ai_cv_optimization: "pricing.feature.aiCvOptimization",
};

const PLAN_NAMES: Record<string, string> = {
  free: "pricing.planName.free",
  pro: "pricing.planName.pro",
  ultra: "pricing.planName.ultra",
};

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
}

interface Addon {
  id: string;
  name: string;
  price: number;
  unit: string;
  unitLabel: string;
  description: string;
}

// ─── Format helpers ──────────────────────────────────────────────────────────

function formatPrice(price: number | undefined | null): string {
  if (price == null || isNaN(price)) return "—";
  if (price === 0) return "0đ";
  return price.toLocaleString("vi-VN") + "đ";
}

function formatFeatureValue(value: string, key: string, t: (key: string, options?: any) => string): string {
  // Handle numeric values for sessions/creation
  if (!isNaN(Number(value)) && ["ai_interview_sessions", "cv_creation"].includes(key)) {
    return t("pricing.featureValue.perMonth", { count: value });
  }
  
  // Handle special keys
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

type BillingPeriod = "weekly" | "monthly";

function getPeriodLabel(t: (key: string) => string, period: BillingPeriod): string {
  return period === "weekly" ? t("pricing.label.weekly") : t("pricing.label.monthly");
}

function getPriceForPeriod(plan: Plan, period: BillingPeriod): number {
  return period === "weekly" ? plan.weeklyPrice : plan.monthlyPrice;
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
    period,
    index,
    onUpgrade,
    onCancel,
    autoRenew = true,
  }: {
    plan: Plan;
    currentPlan: string;
    isUpgrading: boolean;
    period: BillingPeriod;
    index: number;
    onUpgrade: (planId: string) => void;
    onCancel: () => void;
    autoRenew?: boolean;
  }) => {
    const { t } = useTranslation();
    const isCurrent = currentPlan === plan.id;
    const isPopular = plan.popular;
    const isFree = plan.id === "free";
    const isDowngrade =
      autoRenew &&
      ((currentPlan.includes("ultra") && plan.id.includes("pro")) ||
       (currentPlan !== "free" && plan.id === "free"));

    const displayPrice = getPriceForPeriod(plan, period);
    const periodLabel = getPeriodLabel(t, period);
    const periodHint =
      period === "monthly" && !isFree && plan.discount
        ? t("pricing.label.discountPercent", { discount: plan.discount })
        : null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          delay: index * 0.12,
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
        }}
        whileHover={{ y: -8, transition: { duration: 0.25 } }}
        className={`relative flex flex-col rounded-3xl border-2 transition-shadow duration-500 group ${
          isCurrent
            ? plan.id.includes("ultra")
              ? "border-amber-500/60 bg-amber-500/10 shadow-lg shadow-amber-500/10"
              : plan.id.includes("pro")
                ? "border-indigo-500/60 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                : "border-rose-200/80 bg-rose-50/80 dark:border-rose-900/40 dark:bg-rose-950/20 shadow-lg shadow-rose-100/50 dark:shadow-none"
            : plan.id.includes("ultra")
              ? "border-amber-500/30 bg-amber-500/5 shadow-lg shadow-amber-500/5 hover:border-amber-500/50"
              : plan.id.includes("pro")
                ? "border-indigo-500/30 bg-indigo-500/5 shadow-lg shadow-indigo-500/5 hover:border-indigo-500/50"
                : "border-rose-100/60 bg-white/40 dark:border-rose-900/20 dark:bg-slate-900/60 shadow-sm hover:border-rose-200 hover:bg-rose-50/40 dark:hover:border-rose-900/40 hover:shadow-md"
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
              style={{
                background:
                  plan.id.includes("pro")
                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                    : "var(--gradient-hero)",
              }}
            >
              <Star className="h-3.5 w-3.5 fill-current" />
              {t("pricing.label.popular")}
            </div>
          </div>
        )}

        {/* Current Plan Badge */}
        {isCurrent && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <div
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-white shadow-lg ${
                plan.id.includes("ultra")
                  ? "bg-gradient-to-r from-amber-500 to-orange-600"
                  : plan.id.includes("pro")
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600"
                    : "bg-primary text-primary-foreground"
              }`}
            >
              <Check className="h-3.5 w-3.5" />
              {t("pricing.label.currentPlan")}
            </div>
          </div>
        )}

        <div className="flex flex-col flex-1 p-8 pt-10">
          {/* Plan Header */}
          <div className="text-center mb-8">
            <div
              className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4 transition-transform duration-300 group-hover:scale-110 ${
                plan.id.includes("ultra")
                  ? "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30"
                  : plan.id.includes("pro")
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-primary/10 text-primary border border-primary/20"
              }`}
            >
              {plan.id.includes("ultra") ? (
                <Crown className="h-7 w-7" />
              ) : plan.id.includes("pro") ? (
                <Zap className="h-7 w-7" />
              ) : (
                <Shield className="h-7 w-7" />
              )}
            </div>

            <h3 className="text-xl font-bold tracking-tight">{PLAN_NAMES[plan.id] ? t(PLAN_NAMES[plan.id]) : plan.name}</h3>

            <div className="mt-4 flex flex-col items-center justify-center min-h-[4.5rem]">
              {period === "monthly" && !isFree && plan.discount && (
                <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/60 mb-0.5">
                  {formatPrice(Math.round((plan.monthlyPrice / (1 - plan.discount / 100)) / 1000) * 1000)}
                </span>
              )}

              <div className="flex items-baseline justify-center gap-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={`${plan.id}-${period}`}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={`text-4xl font-extrabold tracking-tight tabular-nums ${
                      plan.id.includes("ultra")
                        ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent"
                        : plan.id.includes("pro")
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
                          : "text-foreground"
                    }`}
                  >
                    {formatPrice(displayPrice)}
                  </motion.span>
                </AnimatePresence>
                {plan.monthlyPrice > 0 && (
                  <span className="text-sm text-muted-foreground font-medium">/{periodLabel}</span>
                )}
              </div>
            </div>
            {plan.monthlyPrice === 0 && (
              <p className="text-sm text-muted-foreground mt-1">{plan.period}</p>
            )}
            {periodHint && (
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
              >
                {periodHint}
              </motion.p>
            )}
          </div>

          {/* Features */}
          <div className="flex-1">
            <div className="h-px w-full bg-border/40 mb-6" />
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3.5">
                  {feature.included ? (
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 mt-0.5">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground/40 mt-0.5">
                      <X className="h-3 w-3" strokeWidth={2.5} />
                    </div>
                  )}
                  <span
                    className={`text-sm leading-relaxed ${
                      feature.included
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground/40"
                    }`}
                   >
                    {FEATURE_LABELS[feature.key] ? t(FEATURE_LABELS[feature.key]) : feature.label}
                    {feature.value && ["ai_interview_sessions", "feedback_reports", "cv_creation", "cv_templates", "pdf_export"].includes(feature.key) && ` (${formatFeatureValue(feature.value, feature.key, t)})`}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Button */}
          <div className="mt-auto">
            {isCurrent ? (
              isFree ? (
                <div className="w-full rounded-xl border border-border/60 bg-muted/30 py-3 text-center text-sm font-medium text-muted-foreground">
                  {t("pricing.label.currentPlan2")}
                </div>
              ) : !autoRenew ? (
                <button
                  onClick={() => onUpgrade(plan.id)}
                  disabled={isUpgrading}
                  className={`w-full rounded-xl py-3.5 text-sm font-bold transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group/btn text-white ${
                    plan.id.includes("ultra")
                      ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02]"
                      : plan.id.includes("pro")
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02]"
                        : "text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
                  }`}
                  style={
                    !plan.id.includes("ultra") && !plan.id.includes("pro")
                      ? { background: "var(--gradient-hero)" }
                      : undefined
                  }
                >
                  <span className="flex items-center justify-center gap-2">
                    {isUpgrading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        {t("pricing.btn.renew")}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </>
                    )}
                  </span>
                </button>
              ) : (
                <button
                  onClick={onCancel}
                  disabled={isUpgrading}
                  className="w-full rounded-xl border border-destructive/30 bg-destructive/5 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-all duration-300 cursor-pointer disabled:opacity-50"
                >
                  {t("pricing.btn.cancel")}
                </button>
              )
            ) : isDowngrade ? (
              plan.id === "free" ? (
                <div className="w-full rounded-xl border border-border/40 bg-muted/20 py-3 text-center text-sm font-medium text-muted-foreground/60">
                  {t("pricing.label.freePlan")}
                </div>
              ) : (
                <div className="w-full rounded-xl border border-border/40 bg-muted/20 py-3 text-center text-sm font-medium text-muted-foreground/60">
                  {t("pricing.label.downgrade")}
                </div>
              )
            ) : (
              <button
                onClick={() => onUpgrade(plan.id)}
                disabled={isUpgrading}
                className={`w-full rounded-xl py-3.5 text-sm font-bold transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group/btn text-white ${
                  plan.id.includes("ultra")
                    ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02]"
                    : plan.id.includes("pro")
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02]"
                      : "text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
                }`}
                style={
                  !plan.id.includes("ultra") && !plan.id.includes("pro")
                    ? { background: "var(--gradient-hero)" }
                    : undefined
                }
              >
                <span className="flex items-center justify-center gap-2">
                  {isUpgrading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {t("pricing.btn.upgrade")}
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
            style={{
              background:
                plan.id.includes("ultra")
                  ? "linear-gradient(90deg, #f59e0b, #f97316, #ef4444)"
                  : plan.id.includes("pro")
                    ? "linear-gradient(90deg, #6366f1, #8b5cf6)"
                    : "var(--gradient-hero)",
            }}
          />
        )}
      </motion.div>
    );
  },
);

const PricingSwitch = ({
  period,
  onChange,
  className,
}: {
  period: BillingPeriod;
  onChange: (p: BillingPeriod) => void;
  className?: string;
}) => {
  const { t } = useTranslation();

  const periodOptions: {
    value: BillingPeriod;
    label: string;
    badge?: string;
  }[] = [
    { value: "weekly", label: t("pricing.switch.weekly") },
    { value: "monthly", label: t("pricing.switch.monthly") },
  ];

  return (
    <div
      className={cn(
        "relative z-10 mx-auto flex w-fit rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-1",
        className,
      )}
    >
      {periodOptions.map((opt) => {
        const active = opt.value === period;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative z-10 cursor-pointer h-12 rounded-xl sm:px-6 px-4 sm:py-2 py-1 font-medium transition-colors sm:text-base text-sm flex items-center gap-2",
              active ? "text-white" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="pricing-switch"
                className="absolute inset-0 rounded-xl border-4 shadow-sm shadow-indigo-600 border-indigo-600 bg-gradient-to-t from-indigo-500 via-indigo-400 to-indigo-600"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative whitespace-nowrap">{opt.label}</span>
            {opt.badge && (
              <span
                className={cn(
                  "relative rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap",
                  active
                    ? "bg-white/20 text-white"
                    : "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
                )}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// ─── Confirm Modal ───────────────────────────────────────────────────────────

function ConfirmUpgradeModal({
  plan,
  period,
  isOpen,
  isLoading,
  onConfirm,
  onClose,
}: {
  plan: Plan | null;
  period: BillingPeriod;
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  if (!isOpen || !plan) return null;

  const displayPrice = getPriceForPeriod(plan, period);
  const periodLabel = getPeriodLabel(t, period);
  const periodFullLabel = period === "weekly" ? t("pricing.switch.weekly") : t("pricing.switch.monthly");
  const durationLabel = period === "weekly" ? t("pricing.label.weekDuration") : t("pricing.label.monthDuration");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md mx-4 animate-slide-in-up overflow-hidden">
        {/* Gradient top accent */}
        <div
          className="h-1.5 w-full"
          style={{
            background:
              plan.id === "ultra"
                ? "linear-gradient(90deg, #f59e0b, #f97316, #ef4444)"
                : plan.id === "pro"
                  ? "linear-gradient(90deg, #6366f1, #8b5cf6)"
                  : "var(--gradient-hero)",
          }}
        />

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${
                plan.id === "ultra"
                  ? "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500"
                  : plan.id === "pro"
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                    : ""
              }`}
              style={
                plan.id !== "ultra" && plan.id !== "pro"
                  ? { background: "var(--gradient-hero)" }
                  : undefined
              }
            >
              {plan.id === "ultra" ? <Crown className="h-6 w-6" /> : <Zap className="h-6 w-6" />}
            </div>
            <div>
              <h2 className="text-lg font-bold">{t("pricing.upgrade.title", { planName: PLAN_NAMES[plan.id] ? t(PLAN_NAMES[plan.id]) : plan.name })}</h2>
              <p className="text-xs text-muted-foreground">{t("pricing.upgrade.desc")}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{t("pricing.label.service")}</span>
              <span className="text-sm font-bold">{PLAN_NAMES[plan.id] ? t(PLAN_NAMES[plan.id]) : plan.name}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{t("pricing.label.cycle")}</span>
              <span className="text-sm font-bold">{periodFullLabel}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{t("pricing.label.price")}</span>
              <span className="text-sm font-bold">
                {formatPrice(displayPrice)}/{periodLabel}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("pricing.label.validity")}</span>
              <span className="text-sm font-bold">{durationLabel}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 p-3 mb-6">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              {t("pricing.desc.simulated")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
            >
              {t("pricing.btn.cancel")}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 rounded-xl py-3 text-sm font-bold text-white transition-all duration-300 cursor-pointer disabled:opacity-50 ${
                plan.id === "ultra"
                  ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:shadow-lg hover:shadow-orange-500/20"
                  : plan.id === "pro"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/20"
                    : "hover:shadow-lg"
              }`}
              style={
                plan.id !== "ultra" && plan.id !== "pro"
                  ? { background: "var(--gradient-hero)" }
                  : undefined
              }
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                t("pricing.btn.confirmUpgrade")
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
  const { t } = useTranslation();
  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md mx-4 animate-slide-in-up overflow-hidden">
        <div
          className="h-1.5 w-full"
          style={{
            background:
              plan.id === "ultra"
                ? "linear-gradient(90deg, #f59e0b, #f97316, #ef4444)"
                : plan.id === "pro"
                  ? "linear-gradient(90deg, #6366f1, #8b5cf6)"
                  : "var(--gradient-hero)",
          }}
        />

        <div className="p-8 text-center">
          <div className="relative inline-flex mb-6">
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-3xl text-white ${
                plan.id === "ultra"
                  ? "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500"
                  : plan.id === "pro"
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                    : ""
              }`}
              style={
                plan.id !== "ultra" && plan.id !== "pro"
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

          <h2 className="text-2xl font-bold mb-2">{t("pricing.success.title")}</h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            {t("pricing.desc.upgradeSuccess", { planName: PLAN_NAMES[plan.id] ? t(PLAN_NAMES[plan.id]) : plan.name })}
          </p>

          {expiresAt && (
            <div className="rounded-xl bg-muted/30 border border-border/40 p-3 mb-6">
              <p className="text-xs text-muted-foreground">
                {t("pricing.desc.validUntil")}{" "}
                <span className="font-bold text-foreground">{formatDate(expiresAt)}</span>
              </p>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full rounded-xl py-3 text-sm font-bold text-white transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-lg"
            style={{ background: "var(--gradient-hero)" }}
          >
            {t("pricing.btn.start")}
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
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md mx-4 animate-slide-in-up">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{t("pricing.cancel.title")}</h2>
              <p className="text-xs text-muted-foreground">{t("pricing.desc.cancelWarning")}</p>
            </div>
          </div>

          <p className="text-sm leading-relaxed mb-6">
            {t("pricing.desc.cancelConfirm")}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
            >
              {t("pricing.btn.keepPlan")}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 rounded-xl bg-destructive py-3 text-sm font-bold text-white hover:bg-destructive/90 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : t("pricing.btn.confirmCancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Addon Purchase Modal ────────────────────────────────────────────────────

function AddonPurchaseModal({
  addon,
  isOpen,
  isLoading,
  onConfirm,
  onClose,
}: {
  addon: Addon | null;
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: (addonId: string, quantity: number) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen, addon?.id]);

  if (!isOpen || !addon) return null;

  const totalPrice = addon.price * quantity;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md mx-4 animate-slide-in-up overflow-hidden">
        <div className="h-1.5 w-full" style={{ background: "var(--gradient-hero)" }} />
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shrink-0"
              style={{ background: "var(--gradient-hero)" }}
            >
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-snug">{addon.name}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{t("pricing.addonPurchase.subtitle")}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">{t("pricing.label.unitPrice")}</span>
              <span className="text-sm font-bold">
                {formatPrice(addon.price)}/{addon.unitLabel}
              </span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">{t("pricing.label.quantity")}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center text-sm font-bold tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  disabled={quantity >= 10}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border/40 pt-3">
              <span className="text-sm font-semibold">{t("pricing.label.total")}</span>
              <span className="text-lg font-extrabold text-primary tabular-nums">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 p-3 mb-6">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
              {t("pricing.desc.addonSimulated")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
            >
              {t("pricing.btn.cancel")}
            </button>
            <button
              onClick={() => onConfirm(addon.id, quantity)}
              disabled={isLoading}
              className="flex-1 rounded-xl py-3 text-sm font-bold text-white transition-all duration-300 cursor-pointer disabled:opacity-50 hover:shadow-lg hover:scale-[1.02]"
              style={{ background: "var(--gradient-hero)" }}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : (
                t("pricing.btn.buyAddon", { quantity, unitLabel: addon.unitLabel })
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Addon Success Modal ──────────────────────────────────────────────────────

function AddonSuccessModal({
  result,
  isOpen,
  onClose,
}: {
  result: { addonName: string; quantity: number; totalPrice: number; unitLabel: string } | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-md mx-4 animate-slide-in-up overflow-hidden">
        <div className="h-1.5 w-full" style={{ background: "var(--gradient-hero)" }} />
        <div className="p-8 text-center">
          <div className="relative inline-flex mb-6">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-3xl text-white"
              style={{ background: "var(--gradient-hero)" }}
            >
              <PartyPopper className="h-10 w-10" />
            </div>
            <div className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg">
              <Check className="h-4 w-4" strokeWidth={3} />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">{t("pricing.addonSuccess.title")}</h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            {t("pricing.desc.addonSuccess", { quantity: result.quantity, unitLabel: result.unitLabel, addonName: result.addonName })}
          </p>
          <div className="rounded-xl bg-muted/30 border border-border/40 p-3 mb-6">
            <p className="text-xs text-muted-foreground">
              {t("pricing.desc.addonTotal")}{" "}
              <span className="font-bold text-foreground text-base">
                {formatPrice(result.totalPrice)}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full rounded-xl py-3 text-sm font-bold text-white transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-lg"
            style={{ background: "var(--gradient-hero)" }}
          >
            {t("pricing.btn.done")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Payment Gateway Modal ──────────────────────────────────────────────────
function PaymentGatewayModal({
  isOpen,
  onClose,
  onPay,
  itemName,
  amount,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onPay: (paymentMethod: string) => Promise<void>;
  itemName: string;
  amount: number;
  isLoading: boolean;
}) {
  const [simulatedPaying, setSimulatedPaying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSimulatedPaying(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setSimulatedPaying(true);
    // Giả lập xử lý thanh toán 1.5 giây để tăng tính chân thực
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSimulatedPaying(false);
    await onPay("bank");
  };

  const formattedAmount = amount.toLocaleString("vi-VN") + "đ";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-in-up">
        {/* Progress Bar Giả lập */}
        {(isLoading || simulatedPaying) && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted overflow-hidden">
            <div className="h-full bg-primary animate-pulse" style={{ width: "100%" }} />
          </div>
        )}

        <div className="flex flex-col md:flex-row h-[500px] max-h-[80vh]">
          {/* Cột Trái: Chọn phương thức */}
          <div className="w-full md:w-2/5 bg-muted/30 border-r border-border/50 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Phương thức thanh toán
              </h3>
              <div className="space-y-2">
                <div className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 bg-primary text-primary-foreground shadow">
                  <span>🏦</span>
                  <span>Chuyển khoản (VietQR)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 md:mt-0 pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Thanh toán cho</p>
              <p className="text-sm font-bold text-foreground line-clamp-1">{itemName}</p>
              <p className="text-xl font-black text-primary mt-1">{formattedAmount}</p>
            </div>
          </div>

          {/* Cột Phải: Chi tiết phương thức & Nút xác nhận */}
          <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto bg-card">
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-center space-y-4">
                <div className="mx-auto border border-border/60 bg-white p-2 rounded-2xl w-44 h-44 flex items-center justify-center shadow-inner">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                      `JOBREADY|MBBank|9704229202606|${amount}`
                    )}`}
                    alt="VietQR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-xs text-left bg-muted/40 p-4 rounded-2xl border border-border/50 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ngân hàng:</span>
                    <span className="font-bold">MB Bank</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chủ tài khoản:</span>
                    <span className="font-bold">CONG TY CONG NGHE JOBREADY AI</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Số tài khoản:</span>
                    <span className="font-bold">9704229202606</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nội dung chuyển:</span>
                    <span className="font-bold text-primary">JOBREADY PAY</span>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground italic">
                  Quét mã QR bằng ứng dụng ngân hàng của bạn để thanh toán giả lập.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-border/50">
              <button
                onClick={onClose}
                disabled={isLoading || simulatedPaying}
                className="flex-1 rounded-xl border border-border py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={() => { void handlePayment(); }}
                disabled={isLoading || simulatedPaying}
                className="flex-1 rounded-xl py-3 text-sm font-bold text-white transition hover:shadow-lg cursor-pointer disabled:opacity-50 bg-primary"
              >
                {isLoading || simulatedPaying ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </span>
                ) : (
                  "Xác nhận thanh toán"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


interface TransactionHistorySectionProps {
  loading: boolean;
  transactions: any[];
}

function TransactionHistorySection({ loading, transactions }: TransactionHistorySectionProps) {
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto bg-card border border-border/60 rounded-3xl p-6 lg:p-8 flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="max-w-5xl mx-auto bg-card border border-border/60 rounded-3xl p-6 lg:p-8 text-center text-sm text-muted-foreground bg-muted/10">
        Bạn chưa thực hiện bất kỳ giao dịch nào.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-card border border-border/60 rounded-3xl p-6 lg:p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold">Lịch sử giao dịch</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Danh sách giao dịch nâng cấp tài khoản và mua dịch vụ lẻ.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border/60 text-muted-foreground font-semibold">
              <th className="pb-3 pr-4">Mã giao dịch</th>
              <th className="pb-3 px-4">Tên dịch vụ</th>
              <th className="pb-3 px-4">Số tiền</th>
              <th className="pb-3 px-4">Phương thức</th>
              <th className="pb-3 px-4">Thời gian</th>
              <th className="pb-3 pl-4">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-medium">
            {transactions.map((tx) => {
              let methodLabel = tx.payment_method;
              if (tx.payment_method === "bank") methodLabel = "Chuyển khoản (VietQR)";
              else if (tx.payment_method === "momo") methodLabel = "Ví MoMo";
              else if (tx.payment_method === "vnpay") methodLabel = "Cổng VNPAY";
              else if (tx.payment_method === "card" || tx.payment_method === "credit_card") methodLabel = "Visa/Mastercard";

              return (
                <tr key={tx.id} className="text-foreground hover:bg-muted/10 transition-colors">
                  <td className="py-3.5 pr-4 font-mono text-xs text-muted-foreground select-all">
                    {tx.id.substring(0, 8).toUpperCase()}...
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-foreground">
                    {tx.item_name}
                  </td>
                  <td className="py-3.5 px-4 text-primary tabular-nums font-bold">
                    {tx.amount.toLocaleString("vi-VN")}đ
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground text-xs">
                    {methodLabel}
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground text-xs">
                    {new Date(tx.created_at).toLocaleString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3.5 pl-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Thành công
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main PricingPage ────────────────────────────────────────────────────────

export default function PricingPage({ mode = "portal" }: { mode?: "portal" | "interview" | "cv" }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [interviewPlans, setInterviewPlans] = useState<Plan[]>([]);
  const [cvPlans, setCvPlans] = useState<Plan[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  
  const [currentInterviewPlan, setCurrentInterviewPlan] = useState("free");
  const [interviewExpiresAt, setInterviewExpiresAt] = useState<string | null>(null);
  const [currentCvPlan, setCurrentCvPlan] = useState("free");
  const [cvExpiresAt, setCvExpiresAt] = useState<string | null>(null);
  const [interviewAutoRenew, setInterviewAutoRenew] = useState(true);
  const [cvAutoRenew, setCvAutoRenew] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  // States cho Cổng thanh toán giả lập và Lịch sử giao dịch
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [gatewayData, setGatewayData] = useState<{
    itemName: string;
    amount: number;
    onPay: (paymentMethod: string) => Promise<void>;
  } | null>(null);

  // Modal states
  const [upgradeModal, setUpgradeModal] = useState<Plan | null>(null);
  const [successModal, setSuccessModal] = useState<{
    plan: Plan;
    expiresAt: string | null;
  } | null>(null);
  
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<"interview" | "cv" | null>(null);

  // Addon purchase
  const [addonModal, setAddonModal] = useState<Addon | null>(null);
  const [addonSuccessModal, setAddonSuccessModal] = useState<{
    addonName: string;
    quantity: number;
    totalPrice: number;
    unitLabel: string;
  } | null>(null);
  const [isPurchasingAddon, setIsPurchasingAddon] = useState(false);

  // Billing period toggle (weekly / monthly)
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants: Variants = {
    hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const headers = useMemo(
    () => ({
      "x-user-id": user?.id ?? "",
      "x-user-role": user?.role ?? "user",
    }),
    [user?.id, user?.role],
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
      console.error("Lỗi khi tải lịch sử giao dịch:", e);
    } finally {
      setTransactionsLoading(false);
    }
  }, [headers]);

  // Load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [plansRes, addonsRes, meRes] = await Promise.all([
        fetch("/api/subscription/plans"),
        fetch("/api/subscription/addons"),
        fetch("/api/subscription/me", { headers }),
      ]);

      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setInterviewPlans(plansData.interviewPlans || []);
        setCvPlans(plansData.cvPlans || []);
      }

      if (addonsRes.ok) {
        const addonsData = await addonsRes.json();
        setAddons(addonsData.addons || []);
      }

      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentInterviewPlan(meData.planInterview || "free");
        setInterviewExpiresAt(meData.expiresInterview);
        setCurrentCvPlan(meData.planCv || "free");
        setCvExpiresAt(meData.expiresCv);
        setInterviewAutoRenew(meData.interviewAutoRenew !== false);
        setCvAutoRenew(meData.cvAutoRenew !== false);
      }

      // Tải lịch sử giao dịch
      void fetchTransactions();
    } catch {
      setError(t("pricing.error.loadPlan"));
    } finally {
      setLoading(false);
    }
  }, [headers, fetchTransactions]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleLogout = useCallback(() => {
    logout();
    window.location.assign("/");
  }, [logout]);

  
  if (mode === "portal") {
    const interviewPlanName = currentInterviewPlan === "free" 
      ? t("pricing.planName.free") 
      : currentInterviewPlan === "pro_interview" 
        ? t("pricing.planName.proInterview") 
        : t("pricing.planName.ultraInterview");
    const cvPlanName = currentCvPlan === "free" 
      ? t("pricing.planName.free") 
      : currentCvPlan === "pro_cv" 
        ? t("pricing.planName.proCv") 
        : t("pricing.planName.ultraCv");

    return (
      <div className="min-h-screen bg-background text-foreground">
        <DashboardHeader
          navItems={useUserNavItems()}
          activePath="/pricing"
          role="user"
          onLogout={handleLogout}
        />

        <main className="pt-16 min-h-screen transition-all duration-300">
          <div
            className="p-6 lg:p-10 space-y-10"
            style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}
          >
            <TimelineContent
              as="div"
              animationNum={0}
              timelineRef={pricingRef}
              customVariants={revealVariants}
              className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/5 via-card to-accent-mint/5 p-8 lg:p-12"
            >
              <div className="relative z-10 text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
                  <Crown className="h-4 w-4" />
                  {t("pricing.hero.subtitle")}
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">
                  {t("pricing.hero.title")}
                </h1>
                <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                  {t("pricing.desc.choosePlan")}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{t("pricing.label.aiInterview")} </span>
                    <span className="font-bold">
                      {currentInterviewPlan === "free" ? t("pricing.planName.free") : currentInterviewPlan === "pro_interview" ? t("pricing.planName.proInterview") : t("pricing.planName.ultraInterview")}
                    </span>
                    {interviewExpiresAt && currentInterviewPlan !== "free" && (
                      <span className="text-muted-foreground ml-1">
                        • {t("pricing.hero.expiry")} {formatDate(interviewExpiresAt)}
                      </span>
                    )}
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    <Crown className="h-3.5 w-3.5" />
                    <span>{t("pricing.label.aiCv")} </span>
                    <span className="font-bold">
                      {currentCvPlan === "free" ? t("pricing.planName.free") : currentCvPlan === "pro_cv" ? t("pricing.planName.proCv") : t("pricing.planName.ultraCv")}
                    </span>
                    {cvExpiresAt && currentCvPlan !== "free" && (
                      <span className="text-muted-foreground ml-1">
                        • {t("pricing.hero.expiry")} {formatDate(cvExpiresAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-accent-mint/10 rounded-full blur-3xl" />
            </TimelineContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 32, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative flex flex-col rounded-3xl border border-border/60 bg-card/90 p-8 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => window.location.assign("/pricing/interview")}
              >
                <div className="absolute -top-8 -right-8 w-36 h-36 bg-primary/15 rounded-full blur-3xl group-hover:bg-primary/25 transition-colors duration-500" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary/8 rounded-full blur-2xl" />
                <div className="relative z-10 mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg" style={{ background: "var(--gradient-hero)" }}>
                  <Sparkles className="h-8 w-8 text-white" />
                </div>

                <h2 className="relative z-10 text-2xl font-bold mb-3">{t("pricing.hero.upgradeInterviewTitle")}</h2>
                <p className="relative z-10 text-sm text-muted-foreground leading-relaxed mb-5">
                  {t("pricing.desc.interviewFeatures")}
                </p>

                <ul className="relative z-10 space-y-2 mb-6 flex-1">
                  {[t("pricing.interviewFeature.unlimited"), t("pricing.interviewFeature.starFeedback"), t("pricing.interviewFeature.naturalVoice")].map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-foreground/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  className="relative z-10 w-full rounded-2xl py-3 text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  {t("pricing.btn.viewInterviewPlans")} <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 32, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative flex flex-col rounded-3xl border border-border/60 bg-card/90 p-8 shadow-sm hover:shadow-xl hover:border-indigo-500/40 transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => window.location.assign("/pricing/cv")}
              >
                <div className="absolute -top-8 -right-8 w-36 h-36 bg-indigo-500/15 rounded-full blur-3xl group-hover:bg-indigo-500/25 transition-colors duration-500" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-indigo-500/8 rounded-full blur-2xl" />
                <div className="relative z-10 mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg" style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" }}>
                  <Crown className="h-8 w-8 text-white" />
                </div>

                <h2 className="relative z-10 text-2xl font-bold mb-3">{t("pricing.hero.upgradeCvTitle")}</h2>
                <p className="relative z-10 text-sm text-muted-foreground leading-relaxed mb-5">
                  {t("pricing.desc.cvFeatures")}
                </p>

                <ul className="relative z-10 space-y-2 mb-6 flex-1">
                  {[t("pricing.cvFeature.cleanPdf"), t("pricing.cvFeature.premiumTemplates"), t("pricing.cvFeature.atsAnalysis")].map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-foreground/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  className="relative z-10 w-full rounded-2xl py-3 text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" }}
                >
                  {t("pricing.btn.viewCvPlans")} <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            </div>
            <div className="pt-6">
              <TransactionHistorySection loading={transactionsLoading} transactions={transactions} />
            </div>
          </div>
        </main>
      </div>
    );
  }
  const handleUpgrade = useCallback(
    async (planId: string) => {
      const plan = [...interviewPlans, ...cvPlans].find((p) => p.id === planId);
      if (!plan) return;
      setUpgradeModal(plan);
    },
    [interviewPlans, cvPlans],
  );

  const executeUpgrade = useCallback(async (plan: Plan, paymentMethod: string) => {
    setIsUpgrading(true);

    try {
      const res = await fetch("/api/subscription/upgrade", {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: plan.id,
          billingCycle: period,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const isInterview = ["pro_interview", "ultra_interview"].includes(plan.id);
        if (isInterview) {
          setCurrentInterviewPlan(plan.id);
          setInterviewExpiresAt(data.expiresAt);
          setInterviewAutoRenew(true);
        } else {
          setCurrentCvPlan(plan.id);
          setCvExpiresAt(data.expiresAt);
          setCvAutoRenew(true);
        }
        setGatewayData(null);
        setSuccessModal({
          plan: plan,
          expiresAt: data.expiresAt,
        });
        void fetchTransactions();
      } else {
        setError(data.error || t("pricing.error.upgrade"));
        setGatewayData(null);
      }
    } catch {
      setError(t("pricing.error.upgrade"));
      setGatewayData(null);
    } finally {
      setIsUpgrading(false);
    }
  }, [headers, period, fetchTransactions]);

  const handleUpgradeConfirm = useCallback(() => {
    if (!upgradeModal) return;
    const price = period === "weekly" ? upgradeModal.weeklyPrice : upgradeModal.monthlyPrice;
    const planName = `${t("pricing.upgrade.title", { planName: PLAN_NAMES[upgradeModal.id] ? t(PLAN_NAMES[upgradeModal.id]) : upgradeModal.name })}`;
    const targetPlan = upgradeModal;

    setUpgradeModal(null);
    setGatewayData({
      itemName: planName,
      amount: price,
      onPay: async (method) => {
        await executeUpgrade(targetPlan, method);
      },
    });
  }, [upgradeModal, period, executeUpgrade]);

  // Cancel
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
        setError(data.error || t("pricing.error.cancel"));
        setCancelModal(false);
      }
    } catch {
      setError(t("pricing.error.cancel"));
      setCancelModal(false);
    } finally {
      setIsUpgrading(false);
    }
  }, [headers, cancelTarget]);

  const executeAddonPurchase = useCallback(
    async (addonId: string, quantity: number, paymentMethod: string) => {
      setIsPurchasingAddon(true);
      try {
        const res = await fetch("/api/subscription/addon/purchase", {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ addonId, quantity, paymentMethod }),
        });
        const data = await res.json();
        if (res.ok) {
          setGatewayData(null);
          setAddonSuccessModal({
            addonName: data.purchase.addonName,
            quantity: data.purchase.quantity,
            totalPrice: data.purchase.totalPrice,
            unitLabel: data.purchase.unitLabel,
          });
          // Tải lại giao dịch
          void fetchTransactions();
        } else {
          setError(data.error || t("pricing.error.addon"));
          setGatewayData(null);
        }
      } catch {
        setError(t("pricing.error.addon"));
        setGatewayData(null);
      } finally {
        setIsPurchasingAddon(false);
      }
    },
    [headers, fetchTransactions],
  );

  const handleAddonConfirm = useCallback((addonId: string, quantity: number) => {
    const addon = addons.find((a) => a.id === addonId);
    if (!addon) return;
    const totalPrice = addon.price * quantity;
    setAddonModal(null); // Đóng modal chọn số lượng addon
    setGatewayData({
      itemName: `${addon.name} (x${quantity})`,
      amount: totalPrice,
      onPay: async (method) => {
        await executeAddonPurchase(addonId, quantity, method);
      },
    });
  }, [addons, executeAddonPurchase]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader
        navItems={useUserNavItems()}
        activePath="/pricing"
        role="user"
        onLogout={handleLogout}
      />

      {/* Floating FAQ Help Widget fixed in viewport */}
      <div className="fixed top-20 right-6 lg:right-8 z-40 group/pagefaq">
        <button
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-background/80 hover:bg-primary/10 text-primary transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-md cursor-pointer hover:border-primary/40"
          title={t("pricing.label.faqTitle")}
        >
          {/* Subtle pulse glow */}
          <span className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-70 group-hover/pagefaq:opacity-100" />
          <HelpCircle className="relative h-5.5 w-5.5 text-primary" />
        </button>

        {/* FAQ Tooltip popup */}
        <div className="pointer-events-none absolute right-0 mt-3 w-80 rounded-2xl border border-border bg-card/95 shadow-[var(--shadow-elegant)] backdrop-blur-xl z-50 opacity-0 group-hover/pagefaq:opacity-100 group-hover/pagefaq:pointer-events-auto transition-all duration-300 translate-y-1 group-hover/pagefaq:translate-y-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50 text-left bg-gradient-to-r from-primary/5 via-card to-indigo-500/5">
            <h3 className="text-sm font-bold flex items-center gap-2 text-foreground">
              <HelpCircle className="h-4.5 w-4.5 text-primary" />
              {t("pricing.faq.title")}
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">{t("pricing.label.faqSubtitle")}</p>
          </div>
          <div className="divide-y divide-border/40 max-h-[60vh] overflow-y-auto text-left">
            {[
              {
                q: t("pricing.faq.q1"),
                a: t("pricing.faq.a1"),
              },
              {
                q: t("pricing.faq.q2"),
                a: t("pricing.faq.a2"),
              },
              {
                q: t("pricing.faq.q3"),
                a: t("pricing.faq.a3"),
              },
              {
                q: t("pricing.faq.q4"),
                a: t("pricing.faq.a4"),
              },
            ].map((faq, i) => (
              <div key={i} className="px-5 py-3.5 hover:bg-muted/30 transition-colors">
                <p className="text-xs font-bold text-foreground mb-1 flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">•</span>
                  {faq.q}
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed pl-3 font-normal">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="pt-16 min-h-screen transition-all duration-300">
        <div
          className="p-6 lg:p-8 space-y-8"
          style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}
        >
          {/* Quay lại button */}
          <button
            onClick={() => window.location.assign("/pricing")}
            className="group inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-secondary cursor-pointer shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            {t("pricing.hero.backToUpgrade")}
          </button>

          {/* Hero Section */}
          <TimelineContent
            as="div"
            animationNum={0}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/5 via-card to-accent-mint/5 p-8 lg:p-12"
          >
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
                <Crown className="h-4 w-4" />
                {t("pricing.hero.subtitle")}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">
                {t("pricing.hero.title")}
              </h1>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                {t("pricing.desc.choosePlan")}
              </p>

              {/* Current plans badges */}
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{t("pricing.label.aiInterview")} </span>
                  <span className="font-bold">
                    {currentInterviewPlan === "free" ? t("pricing.planName.free") : currentInterviewPlan === "pro_interview" ? t("pricing.planName.proInterview") : t("pricing.planName.ultraInterview")}
                  </span>
                  {interviewExpiresAt && currentInterviewPlan !== "free" && (
                    <span className="text-muted-foreground ml-1">
                      • {t("pricing.hero.expiry")} {formatDate(interviewExpiresAt)}
                    </span>
                  )}
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  <Crown className="h-3.5 w-3.5" />
                  <span>{t("pricing.label.aiCv")} </span>
                  <span className="font-bold">
                    {currentCvPlan === "free" ? t("pricing.planName.free") : currentCvPlan === "pro_cv" ? t("pricing.planName.proCv") : t("pricing.planName.ultraCv")}
                  </span>
                  {cvExpiresAt && currentCvPlan !== "free" && (
                    <span className="text-muted-foreground ml-1">
                      • {t("pricing.hero.expiry")} {formatDate(cvExpiresAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Decorative */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-accent-mint/10 rounded-full blur-3xl" />
          </TimelineContent>

          {/* Billing Period Switch */}
          <TimelineContent
            as="div"
            animationNum={1}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="flex flex-col items-center gap-2"
          >
            <PricingSwitch period={period} onChange={setPeriod} className="w-fit" />
            <p className="text-xs text-muted-foreground">
              {period === "weekly"
                ? t("pricing.desc.weekly")
                : t("pricing.desc.monthly")}
            </p>
          </TimelineContent>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-center gap-3">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
              <span className="text-sm text-destructive">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-xs text-destructive hover:underline cursor-pointer"
              >
                {t("pricing.btn.close")}
              </button>
            </div>
          )}

          {/* Plans Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-12 max-w-5xl mx-auto">

              {mode === "interview" && (
                <div className="space-y-6">
                  <div className="text-center md:text-left border-b border-border/60 pb-3">
                    <h2 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-2">
                      <Sparkles className="h-5.5 w-5.5 text-primary" />
                      {t("pricing.hero.upgradeInterviewTitle")}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("pricing.desc.interviewSectionDesc")}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {interviewPlans.map((plan, idx) => (
                      <PlanCard
                        key={plan.id}
                        plan={plan}
                        currentPlan={currentInterviewPlan}
                        isUpgrading={isUpgrading}
                        period={period}
                        index={idx}
                        onUpgrade={handleUpgrade}
                        onCancel={() => {
                          setCancelTarget("interview");
                          setCancelModal(true);
                        }}
                        autoRenew={interviewAutoRenew}
                      />
                    ))}
                  </div>
                </div>
              )}
              {mode === "cv" && (
                <div className="space-y-6 pt-6">
                  <div className="text-center md:text-left border-b border-border/60 pb-3">
                    <h2 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-2">
                      <Crown className="h-5.5 w-5.5 text-indigo-500" />
                      {t("pricing.hero.upgradeCvTitle")}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("pricing.desc.cvSectionDesc")}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {cvPlans.map((plan, idx) => (
                      <PlanCard
                        key={plan.id}
                        plan={plan}
                        currentPlan={currentCvPlan}
                        isUpgrading={isUpgrading}
                        period={period}
                        index={idx}
                        onUpgrade={handleUpgrade}
                        onCancel={() => {
                          setCancelTarget("cv");
                          setCancelModal(true);
                        }}
                        autoRenew={cvAutoRenew}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <ConfirmUpgradeModal
        plan={upgradeModal}
        period={period}
        isOpen={!!upgradeModal}
        isLoading={isUpgrading}
        onConfirm={handleUpgradeConfirm}
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

      <AddonPurchaseModal
        addon={addonModal}
        isOpen={!!addonModal}
        isLoading={isPurchasingAddon}
        onConfirm={handleAddonConfirm}
        onClose={() => setAddonModal(null)}
      />

      <AddonSuccessModal
        result={addonSuccessModal}
        isOpen={!!addonSuccessModal}
        onClose={() => setAddonSuccessModal(null)}
      />

      <PaymentGatewayModal
        isOpen={!!gatewayData}
        onClose={() => setGatewayData(null)}
        onPay={gatewayData?.onPay || (async () => {})}
        itemName={gatewayData?.itemName || ""}
        amount={gatewayData?.amount || 0}
        isLoading={isUpgrading || isPurchasingAddon}
      />
    </div>
  );
}
