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
  Loader2,
  AlertTriangle,
  PartyPopper,
  ShoppingCart,
  Plus,
  Minus,
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
  }: {
    plan: Plan;
    currentPlan: string;
    isUpgrading: boolean;
    period: BillingPeriod;
    index: number;
    onUpgrade: (planId: string) => void;
    onCancel: () => void;
  }) => {
    const { t } = useTranslation();
    const isCurrent = currentPlan === plan.id;
    const isPopular = plan.popular;
    const isFree = plan.id === "free";
    const isDowngrade =
      (currentPlan === "ultra" && plan.id === "pro") ||
      (currentPlan !== "free" && plan.id === "free");

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
            ? plan.id === "ultra"
              ? "border-amber-500/60 bg-amber-500/10 shadow-lg shadow-amber-500/10"
              : plan.id === "pro"
                ? "border-indigo-500/60 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                : "border-rose-200/80 bg-rose-50/80 dark:border-rose-900/40 dark:bg-rose-950/20 shadow-lg shadow-rose-100/50 dark:shadow-none"
            : plan.id === "ultra"
              ? "border-amber-500/30 bg-amber-500/5 shadow-lg shadow-amber-500/5 hover:border-amber-500/50"
              : plan.id === "pro"
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
                  plan.id === "pro"
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
                plan.id === "ultra"
                  ? "bg-gradient-to-r from-amber-500 to-orange-600"
                  : plan.id === "pro"
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
                plan.id === "ultra"
                  ? "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30"
                  : plan.id === "pro"
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-primary/10 text-primary border border-primary/20"
              }`}
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

            <div className="mt-4 flex items-baseline justify-center gap-1 min-h-[3rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={`${plan.id}-${period}`}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={`text-4xl font-extrabold tracking-tight tabular-nums ${
                    plan.id === "ultra"
                      ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent"
                      : plan.id === "pro"
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
              <div className="w-full rounded-xl border border-border/40 bg-muted/20 py-3 text-center text-sm font-medium text-muted-foreground/60">
                {plan.id === "free" ? t("pricing.label.freePlan") : t("pricing.label.downgrade")}
              </div>
            ) : (
              <button
                onClick={() => onUpgrade(plan.id)}
                disabled={isUpgrading}
                className={`w-full rounded-xl py-3.5 text-sm font-bold transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group/btn text-white ${
                  plan.id === "ultra"
                    ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02]"
                    : plan.id === "pro"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02]"
                      : "text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
                }`}
                style={
                  plan.id !== "ultra" && plan.id !== "pro"
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
                plan.id === "ultra"
                  ? "linear-gradient(90deg, #f59e0b, #f97316, #ef4444)"
                  : plan.id === "pro"
                    ? "linear-gradient(90deg, #6366f1, #8b5cf6)"
                    : "var(--gradient-hero)",
            }}
          />
        )}
      </motion.div>
    );
  },
);

// ─── Pricing Switch (Weekly / Monthly) ──────────────────────────────────────

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
    { value: "monthly", label: t("pricing.switch.monthly"), badge: t("pricing.label.discount20") },
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
              <h2 className="text-lg font-bold">{t("pricing.upgrade.title", { planName: plan.name })}</h2>
              <p className="text-xs text-muted-foreground">{t("pricing.upgrade.desc")}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{t("pricing.label.service")}</span>
              <span className="text-sm font-bold">{plan.name}</span>
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
            {t("pricing.desc.upgradeSuccess", { planName: plan.name })}
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

// ─── Main PricingPage ────────────────────────────────────────────────────────

export default function PricingPage() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
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
        setPlans(plansData.plans);
      }

      if (addonsRes.ok) {
        const addonsData = await addonsRes.json();
        setAddons(addonsData.addons);
      }

      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentPlan(meData.plan || "free");
        setExpiresAt(meData.expiresAt);
      }
    } catch {
      setError(t("pricing.error.loadPlan"));
    } finally {
      setLoading(false);
    }
  }, [headers]);

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
    [plans],
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
        body: JSON.stringify({
          plan: upgradeModal.id,
          billingCycle: period,
        }),
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
        setError(data.error || t("pricing.error.upgrade"));
        setUpgradeModal(null);
      }
    } catch {
      setError(t("pricing.error.upgrade"));
      setUpgradeModal(null);
    } finally {
      setIsUpgrading(false);
    }
  }, [upgradeModal, headers, period]);

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
        setError(data.error || t("pricing.error.cancel"));
        setCancelModal(false);
      }
    } catch {
      setError(t("pricing.error.cancel"));
      setCancelModal(false);
    } finally {
      setIsUpgrading(false);
    }
  }, [headers]);

  const handleAddonPurchase = useCallback(
    async (addonId: string, quantity: number) => {
      setIsPurchasingAddon(true);
      try {
        const res = await fetch("/api/subscription/addon/purchase", {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ addonId, quantity }),
        });
        const data = await res.json();
        if (res.ok) {
          setAddonModal(null);
          setAddonSuccessModal({
            addonName: data.purchase.addonName,
            quantity: data.purchase.quantity,
            totalPrice: data.purchase.totalPrice,
            unitLabel: data.purchase.unitLabel,
          });
        } else {
          setError(data.error || t("pricing.error.addon"));
          setAddonModal(null);
        }
      } catch {
        setError(t("pricing.error.addon"));
        setAddonModal(null);
      } finally {
        setIsPurchasingAddon(false);
      }
    },
    [headers],
  );

  const planDisplayName =
    currentPlan === "ultra" ? "Ultra" : currentPlan === "pro" ? "Pro" : t("pricing.label.freePlanName");

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
          className="p-6 lg:p-8 space-y-8"
          style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}
        >
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

              {/* Current plan badge */}
              {currentPlan !== "free" && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t("pricing.label.currentPlan2")} <span className="font-bold">{planDisplayName}</span>
                  {expiresAt && (
                    <span className="text-muted-foreground">
                      • {t("pricing.label.expires")} {formatDate(expiresAt)}
                    </span>
                  )}
                </div>
              )}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan, idx) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  currentPlan={currentPlan}
                  isUpgrading={isUpgrading}
                  period={period}
                  index={idx}
                  onUpgrade={handleUpgrade}
                  onCancel={() => setCancelModal(true)}
                />
              ))}
            </div>
          )}

          {/* Add-on Services Section */}
          {addons.length > 0 && (
            <TimelineContent
              as="div"
              animationNum={2}
              timelineRef={pricingRef}
              customVariants={revealVariants}
              className="max-w-5xl mx-auto"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">{t("pricing.addonSection.title")}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("pricing.desc.addonSection")}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {addons.map((addon, i) => (
                  <motion.div
                    key={addon.id}
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: i * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group relative flex flex-col rounded-2xl border border-border/60 bg-card/80 p-5 transition-shadow duration-300 hover:shadow-md hover:border-primary/30"
                    style={{ backdropFilter: "blur(16px)" }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-sm font-bold leading-snug pr-2">{addon.name}</h3>
                      <div className="shrink-0 rounded-xl border border-primary/20 bg-primary/5 px-2.5 py-1 text-right">
                        <p className="text-base font-extrabold text-primary tabular-nums">
                          {formatPrice(addon.price)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">/{addon.unitLabel}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
                      {addon.description}
                    </p>
                    <button
                      onClick={() => setAddonModal(addon)}
                      className="w-full rounded-xl py-2.5 text-sm font-bold text-white transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
                      style={{ background: "var(--gradient-hero)" }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {t("pricing.btn.buyNow")}
                    </button>
                  </motion.div>
                ))}
              </div>
            </TimelineContent>
          )}

          {/* FAQ Section */}
          <TimelineContent
            as="div"
            animationNum={3}
            timelineRef={pricingRef}
            customVariants={revealVariants}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-xl font-bold text-center mb-6">{t("pricing.faq.title")}</h2>
            <div className="space-y-4">
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
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="rounded-2xl border border-border/60 bg-card/80 p-5 transition-all duration-300 hover:shadow-sm"
                >
                  <h3 className="text-sm font-bold mb-2">{faq.q}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </TimelineContent>
        </div>
      </main>

      {/* Modals */}
      <ConfirmUpgradeModal
        plan={upgradeModal}
        period={period}
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

      <AddonPurchaseModal
        addon={addonModal}
        isOpen={!!addonModal}
        isLoading={isPurchasingAddon}
        onConfirm={handleAddonPurchase}
        onClose={() => setAddonModal(null)}
      />

      <AddonSuccessModal
        result={addonSuccessModal}
        isOpen={!!addonSuccessModal}
        onClose={() => setAddonSuccessModal(null)}
      />
    </div>
  );
}
