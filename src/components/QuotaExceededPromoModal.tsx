import { useEffect, useState, useRef, useMemo } from "react";
import { X, Crown, Zap, Clock, Sparkles, Gift, ArrowRight, ArrowLeft, Check, RefreshCw, AlertTriangle, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/components/auth-provider";

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
type PlanId = "ultra_interview";
type BillingCycle = "weekly" | "monthly";

function formatPrice(price: number): string {
  if (!price || isNaN(price)) return "0đ";
  return price.toLocaleString("vi-VN") + "đ";
}

export function QuotaExceededPromoModal({ onClose, onSuccess }: QuotaExceededPromoModalProps) {
  const { user } = useAuth();
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

          // Check stored deadline
          const stored = sessionStorage.getItem(storageKey);
          let deadline: number;
          if (stored) {
            deadline = parseInt(stored, 10);
            if (Date.now() > deadline) {
              deadline = Date.now() + data.promo.countdownMinutes * 60 * 1000;
              sessionStorage.setItem(storageKey, String(deadline));
            }
          } else {
            deadline = Date.now() + data.promo.countdownMinutes * 60 * 1000;
            sessionStorage.setItem(storageKey, String(deadline));
          }

          const updateTimer = () => {
            const remaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
            setTimeLeft(remaining);
            if (remaining <= 0 && timerRef.current) {
              window.clearInterval(timerRef.current);
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
    sessionStorage.removeItem(storageKey);
    if (onSuccess) {
      onSuccess();
    }
    onClose();
    window.location.reload();
  };

  if (!loadingPromo && (!promo || !promo.enabled)) return null;

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
        background: "rgba(0, 0, 0, 0.8)",
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
          0%, 100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4); }
          50% { box-shadow: 0 0 0 14px rgba(251, 191, 36, 0); }
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
          background: rgba(251, 191, 36, 0.12);
          border: 1.5px solid rgba(251, 191, 36, 0.4);
          border-radius: 10px;
          min-width: 48px;
          height: 52px;
          font-size: 26px;
          font-weight: 900;
          color: #fbbf24;
          letter-spacing: 1px;
          text-shadow: 0 0 20px rgba(251, 191, 36, 0.6);
        }
        .qp-btn-primary {
          transition: all 0.25s ease;
        }
        .qp-btn-primary:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 32px rgba(251, 191, 36, 0.45);
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
          background: "linear-gradient(145deg, #0f0a1a 0%, #1a0f2e 50%, #0a1525 100%)",
          border: "1.5px solid rgba(251, 191, 36, 0.3)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.85), 0 0 120px rgba(251,191,36,0.1), inset 0 1px 0 rgba(255,255,255,0.08)",
          overflow: "hidden",
          animation: "qpSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
          transition: "max-width 0.3s ease",
        }}
      >
        {/* Background glow accents */}
        <div style={{
          position: "absolute", top: -70, right: -70, width: 220, height: 220,
          borderRadius: "50%", background: "rgba(251,191,36,0.08)", filter: "blur(50px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -50, left: -50, width: 200, height: 200,
          borderRadius: "50%", background: "rgba(168,85,247,0.08)", filter: "blur(50px)", pointerEvents: "none",
        }} />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16, zIndex: 20,
            width: 32, height: 32, borderRadius: "50%",
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.6)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.16)";
            (e.currentTarget as HTMLElement).style.color = "#fff";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
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
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 20, padding: "6px 12px",
              color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.16)";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)";
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
                border: "3px solid rgba(251,191,36,0.2)",
                borderTopColor: "#fbbf24",
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
                      background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.35)",
                      borderRadius: 30, padding: "6px 14px",
                      fontSize: 11, fontWeight: 800, letterSpacing: 1.5,
                      textTransform: "uppercase", color: "#fbbf24",
                    }}>
                      <Sparkles size={13} />
                      Ưu đãi giới hạn thời gian
                    </div>
                  </div>

                  {/* Icon */}
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                    <div style={{
                      width: 68, height: 68, borderRadius: "50%",
                      background: "linear-gradient(135deg, rgba(251,191,36,0.25) 0%, rgba(168,85,247,0.25) 100%)",
                      border: "2px solid rgba(251,191,36,0.4)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      animation: "qpPulse 2.5s ease infinite",
                    }}>
                      <Gift size={32} color="#fbbf24" />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h2 style={{
                    textAlign: "center", fontSize: 20, fontWeight: 900, color: "#fff",
                    lineHeight: 1.3, marginBottom: 6,
                  }}>
                    {promo.title}
                  </h2>
                  <p style={{
                    textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.65)",
                    lineHeight: 1.5, marginBottom: 20,
                  }}>
                    {promo.subtitle}
                  </p>

                  {/* Discount Badge */}
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                    <div style={{
                      background: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
                      borderRadius: 16, padding: "12px 30px", textAlign: "center",
                      boxShadow: "0 8px 24px rgba(245,158,11,0.35)",
                    }}>
                      <div style={{ fontSize: 44, fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: -1 }}>
                        -{promo.discountPercentage}%
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginTop: 4, letterSpacing: 1 }}>
                        ÁP DỤNG CHO CÁC GÓI PHỎNG VẤN
                      </div>
                    </div>
                  </div>

                  {/* Countdown */}
                  <div style={{ marginBottom: 22 }}>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      marginBottom: 8, fontSize: 11, fontWeight: 700,
                      color: timeLeft < 300 ? "#f87171" : "rgba(255,255,255,0.55)",
                      textTransform: "uppercase", letterSpacing: 1.5,
                    }}>
                      <Clock size={12} />
                      {timeLeft > 0 ? "Ưu đãi kết thúc sau" : "Ưu đãi đã hết hạn"}
                    </div>
                    {timeLeft > 0 ? (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        {formatTime(timeLeft).split("").map((ch, i) =>
                          ch === ":" ? (
                            <span key={i} style={{ fontSize: 26, fontWeight: 900, color: "rgba(251,191,36,0.5)", animation: "qpBounce 1s ease infinite", animationDelay: `${i * 0.1}s` }}>:</span>
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
                      background: "linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ec4899 100%)",
                      color: "#fff", fontSize: 14, fontWeight: 900, letterSpacing: 0.5,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      boxShadow: "0 6px 24px rgba(245,158,11,0.4)",
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
                      fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                  >
                    Bỏ qua, tôi sẽ không nhận ưu đãi này
                  </button>

                  {/* Bottom info */}
                  <div style={{
                    marginTop: 18, marginBottom: 24, padding: "10px 14px", borderRadius: 12,
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <Zap size={14} color="#fbbf24" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>
                      Bạn đã sử dụng hết <strong style={{ color: "#fff" }}>2/2 lượt phỏng vấn free</strong>. Nâng cấp ngay để nhận mã QR thanh toán ưu đãi!
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
                      background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)",
                      borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700, color: "#fbbf24", marginBottom: 8,
                    }}>
                      <Crown size={12} /> GIẢM {promo.discountPercentage}% ĐÃ ĐƯỢC KÍCH HOẠT
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>
                      Chọn Gói Phỏng Vấn Ưu Đãi
                    </h3>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                      Mã QR thanh toán PayOS sẽ hiển thị ngay ở bước tiếp theo
                    </p>
                  </div>

                  {/* Billing Cycle Switch */}
                  <div style={{
                    display: "flex", justifyContent: "center", gap: 4,
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 14, padding: 4, width: "fit-content", margin: "0 auto 20px",
                  }}>
                    <button
                      type="button"
                      onClick={() => setBillingCycle("weekly")}
                      style={{
                        padding: "8px 18px", borderRadius: 10, border: "none", cursor: "pointer",
                        fontSize: 12, fontWeight: 700, transition: "all 0.2s ease",
                        background: billingCycle === "weekly" ? "#6366f1" : "transparent",
                        color: billingCycle === "weekly" ? "#fff" : "rgba(255,255,255,0.6)",
                        boxShadow: billingCycle === "weekly" ? "0 4px 12px rgba(99,102,241,0.4)" : "none",
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
                        background: billingCycle === "monthly" ? "#6366f1" : "transparent",
                        color: billingCycle === "monthly" ? "#fff" : "rgba(255,255,255,0.6)",
                        boxShadow: billingCycle === "monthly" ? "0 4px 12px rgba(99,102,241,0.4)" : "none",
                      }}
                    >
                      Hàng tháng (Tiết kiệm hơn)
                    </button>
                  </div>

                  {/* Plan Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14, marginBottom: 22, maxWidth: 360, margin: "0 auto 22px" }}>
                    {/* ULTRA INTERVIEW */}
                    <div
                      onClick={() => setSelectedPlan("ultra_interview")}
                      className="qp-plan-card"
                      style={{
                        borderRadius: 18, padding: "18px 16px",
                        background: "rgba(245,158,11,0.15)",
                        border: "2px solid #f59e0b",
                        boxShadow: "0 8px 24px rgba(245,158,11,0.25)",
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
                        <span style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>
                          Gói ULTRA
                        </span>
                      </div>

                      <div style={{ margin: "12px 0 10px" }}>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textDecoration: "line-through", display: "block" }}>
                          {formatPrice(getOriginalPrice("ultra_interview", billingCycle))}
                        </span>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                          <span style={{ fontSize: 22, fontWeight: 900, color: "#fbbf24" }}>
                            {formatPrice(getCalculatedPrice("ultra_interview", billingCycle))}
                          </span>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
                            /{billingCycle === "weekly" ? "tuần" : "tháng"}
                          </span>
                        </div>
                      </div>

                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
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
                        : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                      color: "#fff", fontSize: 14, fontWeight: 900, letterSpacing: 0.5,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      boxShadow: selectedPlan === "ultra_interview"
                        ? "0 6px 24px rgba(245,158,11,0.4)"
                        : "0 6px 24px rgba(99,102,241,0.4)",
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
                      <h3 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 8 }}>
                        Thanh Toán Thành Công!
                      </h3>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.5, marginBottom: 24 }}>
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
                        border: "3px solid rgba(251,191,36,0.2)",
                        borderTopColor: "#fbbf24", margin: "0 auto 16px",
                        animation: "qpSpin 0.8s linear infinite",
                      }} />
                      <p style={{ fontSize: 14, color: "#fff", fontWeight: 700 }}>Đang khởi tạo mã VietQR PayOS...</p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>Vui lòng đợi trong giây lát</p>
                    </div>
                  ) : paymentError ? (
                    <div style={{ textAlign: "center", padding: "30px 0" }}>
                      <AlertTriangle size={40} color="#f87171" style={{ margin: "0 auto 12px" }} />
                      <p style={{ fontSize: 14, color: "#f87171", fontWeight: 700, marginBottom: 16 }}>{paymentError}</p>
                      <button
                        onClick={() => handleCreatePayment(selectedPlan, billingCycle)}
                        style={{
                          padding: "10px 20px", borderRadius: 12,
                          background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                          color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
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
                        <h3 style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>
                          Quét Mã QR ĐỂ Thanh Toán
                        </h3>
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
                          {selectedPlan === "ultra_interview" ? "Gói ULTRA Phỏng Vấn" : "Gói PRO Phỏng Vấn"} ({billingCycle === "weekly" ? "Hàng tuần" : "Hàng tháng"}) — <strong style={{ color: "#fbbf24" }}>{formatPrice(getCalculatedPrice(selectedPlan, billingCycle))}</strong>
                        </p>
                      </div>

                      {/* QR Box */}
                      <div style={{
                        background: "#fff", borderRadius: 20, padding: 14,
                        width: 200, height: 200, margin: "0 auto 16px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
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

                      <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>
                        Mở ứng dụng ngân hàng bất kỳ (Momo, Vietcombank, Techcombank, MB,...) quét mã QR để thanh toán.
                      </p>

                      <button
                        type="button"
                        onClick={handleMockComplete}
                        className="qp-btn-primary"
                        style={{
                          width: "100%", marginTop: 14, padding: "10px 16px", borderRadius: 12,
                          background: "rgba(251, 191, 36, 0.12)", border: "1px dashed rgba(251, 191, 36, 0.5)",
                          color: "#fbbf24", fontSize: 12, fontWeight: 800, cursor: "pointer",
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
