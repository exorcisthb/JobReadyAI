import { useEffect, useState, useRef, useMemo } from "react";
import { X, Crown, Zap, Clock, Sparkles, Gift, ArrowRight, ArrowLeft, Check, RefreshCw, AlertTriangle, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/components/auth-provider";

import { useTheme } from "@/components/theme-provider";

interface QuotaPromoConfig {
  enabled: boolean;
  discountPercentage: number;
  countdownMinutes: number;
  title: string;
  subtitle: string;
}

interface QuotaExceededPromoModalProps {
  onClose: () => void;
  onUpgrade?: () => void;
  onSuccess?: () => void;
}

type Step = "BANNER" | "SELECT_PLAN" | "QR";
type PlanId = "pro_interview" | "ultra_interview";
type BillingCycle = "weekly" | "monthly";

function formatPrice(price: number): string {
  if (!price || isNaN(price)) return "0đ";
  return price.toLocaleString("vi-VN") + "đ";
}

export const getThemePalette = (theme: "light" | "dark" | "rose") => {
  if (theme === "light") {
    return {
      backdropBg: "rgba(15, 23, 42, 0.45)",
      modalBg: "linear-gradient(145deg, #ffffff 0%, #f8fafc 50%, #eff6ff 100%)",
      modalBorder: "1.5px solid rgba(99, 102, 241, 0.3)",
      modalShadow: "0 32px 80px rgba(15, 23, 42, 0.25), 0 0 80px rgba(99, 102, 241, 0.12)",
      glow1: "rgba(99, 102, 241, 0.12)",
      glow2: "rgba(59, 130, 246, 0.1)",
      topBadgeBg: "rgba(99, 102, 241, 0.1)",
      topBadgeBorder: "1px solid rgba(99, 102, 241, 0.3)",
      topBadgeText: "#4f46e5",
      giftBg: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)",
      giftBorder: "2px solid rgba(99, 102, 241, 0.4)",
      giftIconColor: "#4f46e5",
      titleColor: "#0f172a",
      subtitleColor: "#475569",
      discountBg: "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #2563eb 100%)",
      discountShadow: "0 8px 24px rgba(79, 70, 229, 0.3)",
      discountSubtext: "rgba(255, 255, 255, 0.95)",
      timerHeaderColor: "#64748b",
      timerDigitBg: "rgba(99, 102, 241, 0.08)",
      timerDigitBorder: "1.5px solid rgba(99, 102, 241, 0.35)",
      timerDigitText: "#4f46e5",
      timerColonColor: "#6366f1",
      ctaBg: "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #2563eb 100%)",
      ctaShadow: "0 6px 24px rgba(79, 70, 229, 0.35)",
      skipColor: "#64748b",
      skipHoverColor: "#0f172a",
      bottomInfoBg: "rgba(241, 245, 249, 0.9)",
      bottomInfoBorder: "1px solid rgba(203, 213, 225, 0.8)",
      bottomInfoIcon: "#4f46e5",
      bottomInfoText: "#475569",
      bottomInfoStrong: "#0f172a",
      closeBtnBg: "rgba(0, 0, 0, 0.06)",
      closeBtnBorder: "1px solid rgba(0, 0, 0, 0.12)",
      closeBtnColor: "#64748b",
      closeBtnHoverBg: "rgba(0, 0, 0, 0.1)",
      closeBtnHoverColor: "#0f172a",
      stepSubtitle: "#64748b",
      stepTitle: "#0f172a",
      planCardBg: "rgba(255, 255, 255, 0.9)",
      planCardBorder: "1px solid rgba(203, 213, 225, 0.8)",
      planCardSelectedBg: "rgba(99, 102, 241, 0.08)",
      planCardSelectedBorder: "2px solid #4f46e5",
      planNameColor: "#0f172a",
      planPriceColor: "#4f46e5",
      planOriginalPriceColor: "#94a3b8",
      planDetailColor: "#475569",
      cycleBtnBg: "rgba(0, 0, 0, 0.05)",
      cycleBtnBorder: "1px solid rgba(0, 0, 0, 0.1)",
      cycleBtnActiveBg: "#4f46e5",
      cycleBtnActiveText: "#ffffff",
      cycleBtnInactiveText: "#64748b",
      qrBoxBg: "#ffffff",
      qrBoxShadow: "0 12px 32px rgba(15, 23, 42, 0.15)",
      demoTestBtnBg: "rgba(99, 102, 241, 0.1)",
      demoTestBtnBorder: "1px dashed rgba(99, 102, 241, 0.5)",
      demoTestBtnText: "#4f46e5",
    };
  }

  if (theme === "rose") {
    return {
      backdropBg: "rgba(15, 23, 42, 0.65)",
      modalBg: "linear-gradient(145deg, #1c0a12 0%, #2d0f1e 50%, #15060e 100%)",
      modalBorder: "1.5px solid rgba(244, 63, 94, 0.35)",
      modalShadow: "0 32px 80px rgba(0,0,0,0.85), 0 0 120px rgba(244,63,94,0.15)",
      glow1: "rgba(244, 63, 94, 0.12)",
      glow2: "rgba(225, 29, 72, 0.12)",
      topBadgeBg: "rgba(244, 63, 94, 0.12)",
      topBadgeBorder: "1px solid rgba(244, 63, 94, 0.35)",
      topBadgeText: "#fb7185",
      giftBg: "linear-gradient(135deg, rgba(244,63,94,0.25) 0%, rgba(225,29,72,0.25) 100%)",
      giftBorder: "2px solid rgba(244,63,94,0.45)",
      giftIconColor: "#fb7185",
      titleColor: "#ffffff",
      subtitleColor: "rgba(255, 255, 255, 0.7)",
      discountBg: "linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #be123c 100%)",
      discountShadow: "0 8px 24px rgba(244, 63, 94, 0.35)",
      discountSubtext: "rgba(255, 255, 255, 0.9)",
      timerHeaderColor: "rgba(255, 255, 255, 0.6)",
      timerDigitBg: "rgba(244, 63, 94, 0.12)",
      timerDigitBorder: "1.5px solid rgba(244, 63, 94, 0.4)",
      timerDigitText: "#fb7185",
      timerColonColor: "#f43f5e",
      ctaBg: "linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #be123c 100%)",
      ctaShadow: "0 6px 24px rgba(244, 63, 94, 0.4)",
      skipColor: "rgba(255, 255, 255, 0.4)",
      skipHoverColor: "rgba(255, 255, 255, 0.8)",
      bottomInfoBg: "rgba(255, 255, 255, 0.05)",
      bottomInfoBorder: "1px solid rgba(255, 255, 255, 0.08)",
      bottomInfoIcon: "#fb7185",
      bottomInfoText: "rgba(255, 255, 255, 0.65)",
      bottomInfoStrong: "#ffffff",
      closeBtnBg: "rgba(255, 255, 255, 0.08)",
      closeBtnBorder: "1px solid rgba(255, 255, 255, 0.12)",
      closeBtnColor: "rgba(255, 255, 255, 0.6)",
      closeBtnHoverBg: "rgba(255, 255, 255, 0.16)",
      closeBtnHoverColor: "#ffffff",
      stepSubtitle: "rgba(255, 255, 255, 0.6)",
      stepTitle: "#ffffff",
      planCardBg: "rgba(255, 255, 255, 0.03)",
      planCardBorder: "1px solid rgba(255, 255, 255, 0.1)",
      planCardSelectedBg: "rgba(244, 63, 94, 0.15)",
      planCardSelectedBorder: "2px solid #f43f5e",
      planNameColor: "#ffffff",
      planPriceColor: "#fb7185",
      planOriginalPriceColor: "rgba(255, 255, 255, 0.45)",
      planDetailColor: "rgba(255, 255, 255, 0.65)",
      cycleBtnBg: "rgba(255, 255, 255, 0.06)",
      cycleBtnBorder: "1px solid rgba(255, 255, 255, 0.1)",
      cycleBtnActiveBg: "#e11d48",
      cycleBtnActiveText: "#ffffff",
      cycleBtnInactiveText: "rgba(255, 255, 255, 0.6)",
      qrBoxBg: "#ffffff",
      qrBoxShadow: "0 12px 32px rgba(0, 0, 0, 0.5)",
      demoTestBtnBg: "rgba(244, 63, 94, 0.15)",
      demoTestBtnBorder: "1px dashed rgba(244, 63, 94, 0.5)",
      demoTestBtnText: "#fb7185",
    };
  }

  // Dark theme default
  return {
    backdropBg: "rgba(0, 0, 0, 0.8)",
    modalBg: "linear-gradient(145deg, #0f0a1a 0%, #1a0f2e 50%, #0a1525 100%)",
    modalBorder: "1.5px solid rgba(251, 191, 36, 0.3)",
    modalShadow: "0 32px 80px rgba(0,0,0,0.85), 0 0 120px rgba(251,191,36,0.1), inset 0 1px 0 rgba(255,255,255,0.08)",
    glow1: "rgba(251, 191, 36, 0.08)",
    glow2: "rgba(168, 85, 247, 0.08)",
    topBadgeBg: "rgba(251, 191, 36, 0.12)",
    topBadgeBorder: "1px solid rgba(251, 191, 36, 0.35)",
    topBadgeText: "#fbbf24",
    giftBg: "linear-gradient(135deg, rgba(251,191,36,0.25) 0%, rgba(168,85,247,0.25) 100%)",
    giftBorder: "2px solid rgba(251,191,36,0.4)",
    giftIconColor: "#fbbf24",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255, 255, 255, 0.65)",
    discountBg: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
    discountShadow: "0 8px 24px rgba(245,158,11,0.35)",
    discountSubtext: "rgba(255, 255, 255, 0.9)",
    timerHeaderColor: "rgba(255, 255, 255, 0.55)",
    timerDigitBg: "rgba(251, 191, 36, 0.12)",
    timerDigitBorder: "1.5px solid rgba(251, 191, 36, 0.4)",
    timerDigitText: "#fbbf24",
    timerColonColor: "rgba(251, 191, 36, 0.5)",
    ctaBg: "linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ec4899 100%)",
    ctaShadow: "0 6px 24px rgba(245,158,11,0.4)",
    skipColor: "rgba(255, 255, 255, 0.4)",
    skipHoverColor: "rgba(255, 255, 255, 0.7)",
    bottomInfoBg: "rgba(255, 255, 255, 0.04)",
    bottomInfoBorder: "1px solid rgba(255, 255, 255, 0.07)",
    bottomInfoIcon: "#fbbf24",
    bottomInfoText: "rgba(255, 255, 255, 0.55)",
    bottomInfoStrong: "#ffffff",
    closeBtnBg: "rgba(255, 255, 255, 0.08)",
    closeBtnBorder: "1px solid rgba(255, 255, 255, 0.12)",
    closeBtnColor: "rgba(255, 255, 255, 0.6)",
    closeBtnHoverBg: "rgba(255, 255, 255, 0.16)",
    closeBtnHoverColor: "#ffffff",
    stepSubtitle: "rgba(255, 255, 255, 0.6)",
    stepTitle: "#ffffff",
    planCardBg: "rgba(255, 255, 255, 0.03)",
    planCardBorder: "1px solid rgba(255, 255, 255, 0.1)",
    planCardSelectedBg: "rgba(99, 102, 241, 0.15)",
    planCardSelectedBorder: "2px solid #6366f1",
    planNameColor: "#ffffff",
    planPriceColor: "#818cf8",
    planOriginalPriceColor: "rgba(255, 255, 255, 0.45)",
    planDetailColor: "rgba(255, 255, 255, 0.6)",
    cycleBtnBg: "rgba(255, 255, 255, 0.06)",
    cycleBtnBorder: "1px solid rgba(255, 255, 255, 0.1)",
    cycleBtnActiveBg: "#6366f1",
    cycleBtnActiveText: "#ffffff",
    cycleBtnInactiveText: "rgba(255, 255, 255, 0.6)",
    qrBoxBg: "#ffffff",
    qrBoxShadow: "0 12px 32px rgba(0, 0, 0, 0.5)",
    demoTestBtnBg: "rgba(251, 191, 36, 0.12)",
    demoTestBtnBorder: "1px dashed rgba(251, 191, 36, 0.5)",
    demoTestBtnText: "#fbbf24",
  };
};

export function QuotaExceededPromoModal({ onClose, onSuccess }: QuotaExceededPromoModalProps) {
  const { user } = useAuth();
  
  let currentTheme: "light" | "dark" | "rose" = "dark";
  try {
    const { theme } = useTheme();
    currentTheme = theme;
  } catch {
    if (typeof document !== "undefined") {
      if (document.documentElement.classList.contains("rose")) currentTheme = "rose";
      else if (document.documentElement.classList.contains("dark")) currentTheme = "dark";
      else currentTheme = "light";
    }
  }
  const palette = getThemePalette(currentTheme);

  const [promo, setPromo] = useState<QuotaPromoConfig | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0); // seconds
  const [loadingPromo, setLoadingPromo] = useState(true);
  const timerRef = useRef<number | null>(null);
  const storageKey = "quota_promo_deadline";

  // Step & Plan Selection State
  const [step, setStep] = useState<Step>("BANNER");
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("ultra_interview");
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  // Prices State (fetched or defaults)
  const [planPrices, setPlanPrices] = useState<Record<string, { weeklyPrice: number; monthlyPrice: number }>>({
    ultra_interview: { weeklyPrice: 30000, monthlyPrice: 100000 },
  });

  // Payment QR State
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [orderCode, setOrderCode] = useState<number | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const requestIdRef = useRef<string | null>(null);

  const authHeaders = useMemo<Record<string, string>>(() => {
    const headers: Record<string, string> = {};
    if (user?.id) {
      headers["x-user-id"] = user.id;
      headers["x-user-role"] = user.role ?? "user";
    }
    return headers;
  }, [user]);

  // Load promo config & timer
  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const res = await fetch("/api/promotions/quota-exceeded-promo");
        const data = await res.json();
        if (data.success && data.promo && data.promo.enabled) {
          setPromo(data.promo);

          // Check stored deadline in localStorage
          const stored = localStorage.getItem(storageKey);
          let deadline: number;
          if (stored) {
            deadline = parseInt(stored, 10);
          } else {
            deadline = Date.now() + data.promo.countdownMinutes * 60 * 1000;
            localStorage.setItem(storageKey, String(deadline));
          }

          const initialRemaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
          setTimeLeft(initialRemaining);

          if (initialRemaining <= 0) {
            onClose();
            return;
          }

          const updateTimer = () => {
            const remaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
            setTimeLeft(remaining);
            if (remaining <= 0) {
              if (timerRef.current) window.clearInterval(timerRef.current);
              onClose();
            }
          };
          updateTimer();
          timerRef.current = window.setInterval(updateTimer, 1000);
        }
      } catch (err) {
        console.error("Failed to load quota promo:", err);
      } finally {
        setLoadingPromo(false);
      }
    };

    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/subscription/plans");
        if (res.ok) {
          const data = await res.json();
          if (data.interviewPlans && Array.isArray(data.interviewPlans)) {
            const pricesObj: Record<string, { weeklyPrice: number; monthlyPrice: number }> = {};
            data.interviewPlans.forEach((p: any) => {
              if (p.id) {
                pricesObj[p.id] = {
                  weeklyPrice: Number(p.weeklyPrice) || 0,
                  monthlyPrice: Number(p.monthlyPrice) || 0,
                };
              }
            });
            setPlanPrices((prev) => ({ ...prev, ...pricesObj }));
          }
        }
      } catch (err) {
        console.warn("Could not fetch plan prices, using defaults:", err);
      }
    };

    fetchPromo();
    fetchPlans();

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Compute prices with promo discount
  const getCalculatedPrice = (planId: PlanId, cycle: BillingCycle) => {
    const base = planPrices[planId]?.[cycle === "weekly" ? "weeklyPrice" : "monthlyPrice"] || 0;
    const discount = promo?.discountPercentage || 0;
    if (!discount) return base;
    return Math.round((base * (1 - discount / 100)) / 1000) * 1000;
  };

  const getOriginalPrice = (planId: PlanId, cycle: BillingCycle) => {
    return planPrices[planId]?.[cycle === "weekly" ? "weeklyPrice" : "monthlyPrice"] || 0;
  };

  // Payment creation trigger when step changes to QR
  const handleCreatePayment = async (plan: PlanId, cycle: BillingCycle) => {
    setLoadingPayment(true);
    setPaymentError(null);
    setOrderCode(null);
    setQrCode(null);
    setPaymentSuccess(false);

    const discountPercentage = promo?.discountPercentage || 0;
    const finalAmount = getCalculatedPrice(plan, cycle);
    const planName = plan === "ultra_interview" ? "Gói ULTRA Phỏng Vấn" : "Gói PRO Phỏng Vấn";

    if (!requestIdRef.current) {
      requestIdRef.current = crypto.randomUUID();
    }

    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          ...authHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: plan,
          planName: `${planName} (${cycle === "weekly" ? "Tuần" : "Tháng"} - Ưu Đãi -${discountPercentage}%)`,
          amount: finalAmount,
          billingCycle: cycle,
          discountPercentage,
          requestId: requestIdRef.current,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrderCode(data.orderCode);
        setQrCode(data.qrCode);
      } else {
        setPaymentError(data.error || "Không thể khởi tạo mã QR thanh toán. Vui lòng thử lại.");
      }
    } catch {
      setPaymentError("Lỗi kết nối máy chủ. Vui lòng kiểm tra lại đường truyền.");
    } finally {
      setLoadingPayment(false);
    }
  };

  // Polling for payment status
  useEffect(() => {
    if (!orderCode || step !== "QR" || paymentSuccess) return;

    setPolling(true);
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/check/${orderCode}`, { headers: authHeaders });
        if (res.ok) {
          const data = await res.json();
          if (data.order?.status === "paid") {
            if (pollingRef.current) clearInterval(pollingRef.current);
            setPolling(false);
            setPaymentSuccess(true);
          }
        }
      } catch {
        // Silent error retry
      }
    }, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [orderCode, step, paymentSuccess, authHeaders]);

  const handleMockComplete = async () => {
    if (!orderCode) return;
    try {
      const res = await fetch(`/api/payment/mock-complete/${orderCode}`, {
        method: "POST",
        headers: authHeaders,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPaymentSuccess(true);
      }
    } catch (err) {
      console.error("Mock complete failed:", err);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
    return `${pad(m)}:${pad(s)}`;
  };

  const handleFinishSuccess = () => {
    localStorage.removeItem(storageKey);
    sessionStorage.removeItem("quota_promo_auto_shown");
    if (onSuccess) {
      onSuccess();
    }
    onClose();
    window.location.reload();
  };

  if (!loadingPromo && (!promo || !promo.enabled || timeLeft <= 0)) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: palette.backdropBg,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        animation: "qpFadeIn 0.3s ease both",
      }}
    >
      <style>{`
        @keyframes qpFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes qpSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes qpPulse {
          0%, 100% { box-shadow: 0 0 0 0 ${palette.glow1}; }
          50% { box-shadow: 0 0 0 14px transparent; }
        }
        @keyframes qpSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes qpBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .qp-digit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: ${palette.timerDigitBg};
          border: ${palette.timerDigitBorder};
          border-radius: 10px;
          min-width: 48px;
          height: 52px;
          font-size: 26px;
          font-weight: 900;
          color: ${palette.timerDigitText};
          letter-spacing: 1px;
        }
        .qp-btn-primary {
          transition: all 0.25s ease;
        }
        .qp-btn-primary:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: ${palette.ctaShadow};
        }
        .qp-btn-primary:active {
          transform: translateY(0) scale(0.99);
        }
        .qp-plan-card {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .qp-plan-card:hover {
          transform: translateY(-3px);
        }
      `}</style>

      {/* Main Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: step === "SELECT_PLAN" ? 560 : 490,
          borderRadius: 24,
          background: palette.modalBg,
          border: palette.modalBorder,
          boxShadow: palette.modalShadow,
          overflow: "hidden",
          animation: "qpSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
          transition: "max-width 0.3s ease, background 0.3s ease, border 0.3s ease",
        }}
      >
        {/* Background glow accents */}
        <div style={{
          position: "absolute", top: -70, right: -70, width: 220, height: 220,
          borderRadius: "50%", background: palette.glow1, filter: "blur(50px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -50, left: -50, width: 200, height: 200,
          borderRadius: "50%", background: palette.glow2, filter: "blur(50px)", pointerEvents: "none",
        }} />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16, zIndex: 20,
            width: 32, height: 32, borderRadius: "50%",
            background: palette.closeBtnBg, border: palette.closeBtnBorder,
            color: palette.closeBtnColor, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = palette.closeBtnHoverBg;
            (e.currentTarget as HTMLElement).style.color = palette.closeBtnHoverColor;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = palette.closeBtnBg;
            (e.currentTarget as HTMLElement).style.color = palette.closeBtnColor;
          }}
          aria-label="Đóng"
        >
          <X size={15} />
        </button>

        {/* Back button (when in SELECT_PLAN or QR) */}
        {step !== "BANNER" && !paymentSuccess && (
          <button
            onClick={() => {
              if (step === "QR") setStep("SELECT_PLAN");
              else if (step === "SELECT_PLAN") setStep("BANNER");
            }}
            style={{
              position: "absolute", top: 16, left: 16, zIndex: 20,
              display: "inline-flex", alignItems: "center", gap: 6,
              background: palette.closeBtnBg, border: palette.closeBtnBorder,
              borderRadius: 20, padding: "6px 12px",
              color: palette.closeBtnColor, fontSize: 12, fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = palette.closeBtnHoverBg;
              (e.currentTarget as HTMLElement).style.color = palette.closeBtnHoverColor;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = palette.closeBtnBg;
              (e.currentTarget as HTMLElement).style.color = palette.closeBtnColor;
            }}
          >
            <ArrowLeft size={14} />
            Quay lại
          </button>
        )}

        {/* Modal Header Progress */}
        <div style={{ padding: "28px 28px 0" }}>
          {loadingPromo ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                border: `3px solid ${palette.topBadgeBorder}`,
                borderTopColor: palette.topBadgeText,
                animation: "qpSpin 0.8s linear infinite",
              }} />
            </div>
          ) : promo ? (
            <>
              {/* STEP 1: BANNER */}
              {step === "BANNER" && (
                <div>
                  {/* Top badge */}
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: palette.topBadgeBg, border: palette.topBadgeBorder,
                      borderRadius: 30, padding: "6px 14px",
                      fontSize: 11, fontWeight: 800, letterSpacing: 1.5,
                      textTransform: "uppercase", color: palette.topBadgeText,
                    }}>
                      <Sparkles size={13} />
                      Ưu đãi giới hạn thời gian
                    </div>
                  </div>

                  {/* Icon */}
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                    <div style={{
                      width: 68, height: 68, borderRadius: "50%",
                      background: palette.giftBg,
                      border: palette.giftBorder,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      animation: "qpPulse 2.5s ease infinite",
                    }}>
                      <Gift size={32} color={palette.giftIconColor} />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h2 style={{
                    textAlign: "center", fontSize: 20, fontWeight: 900, color: palette.titleColor,
                    lineHeight: 1.3, marginBottom: 6,
                  }}>
                    {promo.title}
                  </h2>
                  <p style={{
                    textAlign: "center", fontSize: 13, color: palette.subtitleColor,
                    lineHeight: 1.5, marginBottom: 20,
                  }}>
                    {promo.subtitle}
                  </p>

                  {/* Discount Badge */}
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                    <div style={{
                      background: palette.discountBg,
                      borderRadius: 16, padding: "12px 30px", textAlign: "center",
                      boxShadow: palette.discountShadow,
                    }}>
                      <div style={{ fontSize: 44, fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: -1 }}>
                        -{promo.discountPercentage}%
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: palette.discountSubtext, marginTop: 4, letterSpacing: 1 }}>
                        ÁP DỤNG CHO CÁC GÓI PHỎNG VẤN
                      </div>
                    </div>
                  </div>

                  {/* Countdown */}
                  <div style={{ marginBottom: 22 }}>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      marginBottom: 8, fontSize: 11, fontWeight: 700,
                      color: timeLeft < 300 ? "#f87171" : palette.timerHeaderColor,
                      textTransform: "uppercase", letterSpacing: 1.5,
                    }}>
                      <Clock size={12} />
                      {timeLeft > 0 ? "Ưu đãi kết thúc sau" : "Ưu đãi đã hết hạn"}
                    </div>
                    {timeLeft > 0 ? (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        {formatTime(timeLeft).split("").map((ch, i) =>
                          ch === ":" ? (
                            <span key={i} style={{ fontSize: 26, fontWeight: 900, color: palette.timerColonColor, animation: "qpBounce 1s ease infinite", animationDelay: `${i * 0.1}s` }}>:</span>
                          ) : (
                            <span key={i} className="qp-digit">{ch}</span>
                          )
                        )}
                      </div>
                    ) : (
                      <div style={{ textAlign: "center", fontSize: 13, color: "#f87171", fontWeight: 600 }}>
                        Ưu đãi đã hết hạn. Hãy liên hệ để biết thêm chi tiết.
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => setStep("SELECT_PLAN")}
                    className="qp-btn-primary"
                    style={{
                      width: "100%", padding: "14px 24px", borderRadius: 14,
                      border: "none", cursor: "pointer",
                      background: palette.ctaBg,
                      color: "#fff", fontSize: 14, fontWeight: 900, letterSpacing: 0.5,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      boxShadow: palette.ctaShadow,
                    }}
                  >
                    <Crown size={16} />
                    Nhận Ưu Đãi Ngay — Giảm {promo.discountPercentage}%
                    <ArrowRight size={16} />
                  </button>

                  {/* Skip link */}
                  <button
                    onClick={onClose}
                    style={{
                      display: "block", width: "100%", marginTop: 12,
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: 12, color: palette.skipColor, textAlign: "center",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = palette.skipHoverColor)}
                    onMouseLeave={e => (e.currentTarget.style.color = palette.skipColor)}
                  >
                    Bỏ qua, tôi sẽ không nhận ưu đãi này
                  </button>

                  {/* Bottom info */}
                  <div style={{
                    marginTop: 18, marginBottom: 24, padding: "10px 14px", borderRadius: 12,
                    background: palette.bottomInfoBg, border: palette.bottomInfoBorder,
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <Zap size={14} color={palette.bottomInfoIcon} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: palette.bottomInfoText, lineHeight: 1.4 }}>
                      Bạn đã sử dụng hết <strong style={{ color: palette.bottomInfoStrong }}>2/2 lượt phỏng vấn free</strong>. Nâng cấp ngay để nhận mã QR thanh toán ưu đãi!
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 2: SELECT PLAN */}
              {step === "SELECT_PLAN" && (
                <div style={{ paddingBottom: 24 }}>
                  <div style={{ textAlign: "center", marginTop: 16, marginBottom: 20 }}>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: palette.topBadgeBg, border: palette.topBadgeBorder,
                      borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: palette.topBadgeText, marginBottom: 8,
                    }}>
                      <Crown size={12} /> GIẢM {promo.discountPercentage}% ĐÃ ĐƯỢC KÍCH HOẠT
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 900, color: palette.stepTitle }}>
                      Chọn Gói Phỏng Vấn Ưu Đãi
                    </h3>
                    <p style={{ fontSize: 12, color: palette.stepSubtitle, marginTop: 2 }}>
                      Mã QR thanh toán PayOS sẽ hiển thị ngay ở bước tiếp theo
                    </p>
                  </div>

                  {/* Billing Cycle Switch */}
                  <div style={{
                    display: "flex", justifyContent: "center", gap: 4,
                    background: palette.cycleBtnBg, border: palette.cycleBtnBorder,
                    borderRadius: 14, padding: 4, width: "fit-content", margin: "0 auto 20px",
                  }}>
                    <button
                      type="button"
                      onClick={() => setBillingCycle("weekly")}
                      style={{
                        padding: "8px 18px", borderRadius: 10, border: "none", cursor: "pointer",
                        fontSize: 12, fontWeight: 700, transition: "all 0.2s ease",
                        background: billingCycle === "weekly" ? palette.cycleBtnActiveBg : "transparent",
                        color: billingCycle === "weekly" ? palette.cycleBtnActiveText : palette.cycleBtnInactiveText,
                        boxShadow: billingCycle === "weekly" ? "0 4px 12px rgba(99,102,241,0.3)" : "none",
                      }}
                    >
                      Hàng tuần
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle("monthly")}
                      style={{
                        padding: "8px 18px", borderRadius: 10, border: "none", cursor: "pointer",
                        fontSize: 12, fontWeight: 700, transition: "all 0.2s ease",
                        background: billingCycle === "monthly" ? palette.cycleBtnActiveBg : "transparent",
                        color: billingCycle === "monthly" ? palette.cycleBtnActiveText : palette.cycleBtnInactiveText,
                        boxShadow: billingCycle === "monthly" ? "0 4px 12px rgba(99,102,241,0.3)" : "none",
                      }}
                    >
                      Hàng tháng (Tiết kiệm hơn)
                    </button>
                  </div>

                  {/* Plan Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
                    {/* PRO INTERVIEW */}
                    <div
                      onClick={() => setSelectedPlan("pro_interview")}
                      className="qp-plan-card"
                      style={{
                        borderRadius: 18, padding: "18px 14px",
                        background: selectedPlan === "pro_interview"
                          ? palette.planCardSelectedBg
                          : palette.planCardBg,
                        border: selectedPlan === "pro_interview"
                          ? palette.planCardSelectedBorder
                          : palette.planCardBorder,
                        boxShadow: selectedPlan === "pro_interview"
                          ? "0 8px 24px rgba(99,102,241,0.25)"
                          : "none",
                        position: "relative",
                      }}
                    >
                      {selectedPlan === "pro_interview" && (
                        <div style={{
                          position: "absolute", top: 10, right: 10,
                          width: 20, height: 20, borderRadius: "50%", background: "#6366f1",
                          display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
                        }}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 10,
                          background: "rgba(99,102,241,0.2)", color: "#818cf8",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <Zap size={18} />
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 800, color: palette.planNameColor }}>
                          Gói PRO
                        </span>
                      </div>

                      <div style={{ margin: "12px 0 10px" }}>
                        <span style={{ fontSize: 11, color: palette.planOriginalPriceColor, textDecoration: "line-through", display: "block" }}>
                          {formatPrice(getOriginalPrice("pro_interview", billingCycle))}
                        </span>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                          <span style={{ fontSize: 22, fontWeight: 900, color: palette.planPriceColor }}>
                            {formatPrice(getCalculatedPrice("pro_interview", billingCycle))}
                          </span>
                          <span style={{ fontSize: 11, color: palette.planDetailColor }}>
                            /{billingCycle === "weekly" ? "tuần" : "tháng"}
                          </span>
                        </div>
                      </div>

                      <div style={{ fontSize: 11, color: palette.planDetailColor }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                          <Check size={12} color="#10b981" /> {billingCycle === "weekly" ? "5 buổi phỏng vấn/tuần" : "25 buổi phỏng vấn/tháng"}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Check size={12} color="#10b981" /> Báo cáo phân tích chi tiết
                        </div>
                      </div>
                    </div>

                    {/* ULTRA INTERVIEW */}
                    <div
                      onClick={() => setSelectedPlan("ultra_interview")}
                      className="qp-plan-card"
                      style={{
                        borderRadius: 18, padding: "18px 14px",
                        background: selectedPlan === "ultra_interview"
                          ? "rgba(245,158,11,0.15)"
                          : palette.planCardBg,
                        border: selectedPlan === "ultra_interview"
                          ? "2px solid #f59e0b"
                          : palette.planCardBorder,
                        boxShadow: selectedPlan === "ultra_interview"
                          ? "0 8px 24px rgba(245,158,11,0.25)"
                          : "none",
                        position: "relative",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{
                        position: "absolute", top: -10, left: 14,
                        background: "linear-gradient(90deg, #f59e0b, #ef4444)",
                        borderRadius: 10, padding: "2px 8px", fontSize: 9, fontWeight: 800, color: "#fff",
                      }}>
                        KHUYÊN DÙNG
                      </div>

                      <div style={{
                        position: "absolute", top: 10, right: 10,
                        width: 20, height: 20, borderRadius: "50%", background: "#f59e0b",
                        display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
                      }}>
                        <Check size={12} strokeWidth={3} />
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 10,
                          background: "rgba(245,158,11,0.2)", color: "#fbbf24",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <Crown size={18} />
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 800, color: palette.planNameColor }}>
                          Gói ULTRA
                        </span>
                      </div>

                      <div style={{ margin: "12px 0 10px" }}>
                        <span style={{ fontSize: 11, color: palette.planOriginalPriceColor, textDecoration: "line-through", display: "block" }}>
                          {formatPrice(getOriginalPrice("ultra_interview", billingCycle))}
                        </span>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                          <span style={{ fontSize: 22, fontWeight: 900, color: "#fbbf24" }}>
                            {formatPrice(getCalculatedPrice("ultra_interview", billingCycle))}
                          </span>
                          <span style={{ fontSize: 11, color: palette.planDetailColor }}>
                            /{billingCycle === "weekly" ? "tuần" : "tháng"}
                          </span>
                        </div>
                      </div>

                      <div style={{ fontSize: 11, color: palette.planDetailColor }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                          <Check size={12} color="#10b981" /> <strong>Không giới hạn</strong> phỏng vấn
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Check size={12} color="#10b981" /> Đánh giá chuyên sâu STAR
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Proceed to QR Payment Button */}
                  <button
                    onClick={() => {
                      setStep("QR");
                      handleCreatePayment(selectedPlan, billingCycle);
                    }}
                    className="qp-btn-primary"
                    style={{
                      width: "100%", padding: "14px 24px", borderRadius: 14,
                      border: "none", cursor: "pointer",
                      background: selectedPlan === "ultra_interview"
                        ? "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)"
                        : palette.ctaBg,
                      color: "#fff", fontSize: 14, fontWeight: 900, letterSpacing: 0.5,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      boxShadow: selectedPlan === "ultra_interview"
                        ? "0 6px 24px rgba(245,158,11,0.4)"
                        : palette.ctaShadow,
                    }}
                  >
                    <span>Tạo mã QR thanh toán — {formatPrice(getCalculatedPrice(selectedPlan, billingCycle))}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}

              {/* STEP 3: QR PAYMENT VIEW */}
              {step === "QR" && (
                <div style={{ paddingBottom: 28, paddingTop: 10 }}>
                  {paymentSuccess ? (
                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                      <div style={{
                        width: 72, height: 72, borderRadius: "50%",
                        background: "rgba(16,185,129,0.2)", border: "2px solid #10b981",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 16px", color: "#10b981",
                      }}>
                        <ShieldCheck size={38} />
                      </div>
                      <h3 style={{ fontSize: 20, fontWeight: 900, color: palette.stepTitle, marginBottom: 8 }}>
                        Thanh Toán Thành Công!
                      </h3>
                      <p style={{ fontSize: 13, color: palette.stepSubtitle, lineHeight: 1.5, marginBottom: 24 }}>
                        Tài khoản của bạn đã được nâng cấp lên <strong>{selectedPlan === "ultra_interview" ? "Gói ULTRA Phỏng Vấn" : "Gói PRO Phỏng Vấn"}</strong>. Bạn có thể bắt đầu lượt phỏng vấn mới ngay bây giờ!
                      </p>
                      <button
                        onClick={handleFinishSuccess}
                        className="qp-btn-primary"
                        style={{
                          width: "100%", padding: "14px 24px", borderRadius: 14,
                          border: "none", cursor: "pointer",
                          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                          color: "#fff", fontSize: 14, fontWeight: 900,
                          boxShadow: "0 6px 24px rgba(16,185,129,0.4)",
                        }}
                      >
                        Bắt Đầu Phỏng Vấn Ngay
                      </button>
                    </div>
                  ) : loadingPayment ? (
                    <div style={{ textAlign: "center", padding: "50px 0" }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: "50%",
                        border: `3px solid ${palette.topBadgeBorder}`,
                        borderTopColor: palette.topBadgeText, margin: "0 auto 16px",
                        animation: "qpSpin 0.8s linear infinite",
                      }} />
                      <p style={{ fontSize: 14, color: palette.stepTitle, fontWeight: 700 }}>Đang khởi tạo mã VietQR PayOS...</p>
                      <p style={{ fontSize: 12, color: palette.stepSubtitle, marginTop: 4 }}>Vui lòng đợi trong giây lát</p>
                    </div>
                  ) : paymentError ? (
                    <div style={{ textAlign: "center", padding: "30px 0" }}>
                      <AlertTriangle size={40} color="#f87171" style={{ margin: "0 auto 12px" }} />
                      <p style={{ fontSize: 14, color: "#f87171", fontWeight: 700, marginBottom: 16 }}>{paymentError}</p>
                      <button
                        onClick={() => handleCreatePayment(selectedPlan, billingCycle)}
                        style={{
                          padding: "10px 20px", borderRadius: 12,
                          background: palette.closeBtnBg, border: palette.closeBtnBorder,
                          color: palette.stepTitle, fontSize: 13, fontWeight: 700, cursor: "pointer",
                        }}
                      >
                        Thử lại
                      </button>
                    </div>
                  ) : qrCode ? (
                    <div>
                      <div style={{ textAlign: "center", marginBottom: 16 }}>
                        <div style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)",
                          borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: "#34d399", marginBottom: 6,
                        }}>
                          <Zap size={12} /> GIÁ ĐÃ GIẢM {promo.discountPercentage}%
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 900, color: palette.stepTitle }}>
                          Quét Mã QR ĐỂ Thanh Toán
                        </h3>
                        <p style={{ fontSize: 12, color: palette.stepSubtitle, marginTop: 2 }}>
                          {selectedPlan === "ultra_interview" ? "Gói ULTRA Phỏng Vấn" : "Gói PRO Phỏng Vấn"} ({billingCycle === "weekly" ? "Hàng tuần" : "Hàng tháng"}) — <strong style={{ color: palette.topBadgeText }}>{formatPrice(getCalculatedPrice(selectedPlan, billingCycle))}</strong>
                        </p>
                      </div>

                      {/* QR Box */}
                      <div style={{
                        background: palette.qrBoxBg, borderRadius: 20, padding: 14,
                        width: 200, height: 200, margin: "0 auto 16px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: palette.qrBoxShadow,
                      }}>
                        <QRCodeSVG value={qrCode} size={172} />
                      </div>

                      {/* Polling Indicator */}
                      {polling && (
                        <div style={{
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                          fontSize: 12, color: "#34d399", background: "rgba(52,211,153,0.1)",
                          border: "1px solid rgba(52,211,153,0.25)", borderRadius: 12, padding: "8px 14px",
                          marginBottom: 16, width: "fit-content", margin: "0 auto 16px",
                        }}>
                          <RefreshCw size={13} style={{ animation: "qpSpin 1.5s linear infinite" }} />
                          <span>Đang chờ hệ thống ngân hàng xác nhận...</span>
                        </div>
                      )}

                      <p style={{ textAlign: "center", fontSize: 11, color: palette.stepSubtitle, lineHeight: 1.4 }}>
                        Mở ứng dụng ngân hàng bất kỳ (Momo, Vietcombank, Techcombank, MB,...) quét mã QR để thanh toán.
                      </p>

                      <button
                        type="button"
                        onClick={handleMockComplete}
                        className="qp-btn-primary"
                        style={{
                          width: "100%", marginTop: 14, padding: "10px 16px", borderRadius: 12,
                          background: palette.demoTestBtnBg, border: palette.demoTestBtnBorder,
                          color: palette.demoTestBtnText, fontSize: 12, fontWeight: 800, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        }}
                      >
                        <Zap size={14} />
                        Xác Nhận Đã Thanh Toán (Giả Lập Demo Test)
                      </button>
                    </div>
                  ) : null}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
