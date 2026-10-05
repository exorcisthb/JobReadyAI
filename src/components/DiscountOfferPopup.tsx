import { useCallback, useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Clock3, Crown, Loader2, Sparkles, X, Zap } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

type OfferPlan = {
  id: string;
  name: string;
  weeklyPrice: number;
  discount: number | null;
};

type OfferState = {
  reason: "signup" | "referral";
  expiresAt: string;
  plans: OfferPlan[];
};

type PaymentState = {
  planId: string;
  planName: string;
  amount: number;
  qrCode: string;
  orderCode: number;
};

const formatPrice = (price: number) => `${price.toLocaleString("vi-VN")}đ`;

function discountedPrices(plan: OfferPlan) {
  const base = Number(plan.weeklyPrice || 0);
  const discount = Number(plan.discount || 0);
  const regular = discount > 0
    ? Math.round((base * (1 - discount / 100)) / 1000) * 1000
    : base;
  const offer = Math.round((regular * 0.8) / 1000) * 1000;
  return { regular, offer };
}

function Countdown({ expiresAt }: { expiresAt: string }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const remaining = Math.max(0, new Date(expiresAt).getTime() - now);
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  return <span>{days} ngày {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</span>;
}

export function DiscountOfferPopup() {
  const { user } = useAuth();
  const [offer, setOffer] = useState<OfferState | null>(null);
  const [payment, setPayment] = useState<PaymentState | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false);

  const headers = useMemo(() => ({
    "x-user-id": user?.id || "",
    "x-user-role": user?.role || "user",
  }), [user?.id, user?.role]);

  useEffect(() => {
    if (!user?.id || user.role !== "user" || !user.profileCompleted) {
      setOffer(null);
      return;
    }
    let cancelled = false;
    const load = async () => {
      try {
        const [meResponse, plansResponse] = await Promise.all([
          fetch("/api/subscription/me", { headers, cache: "no-store" }),
          fetch("/api/subscription/plans", { cache: "no-store" }),
        ]);
        if (!meResponse.ok || !plansResponse.ok) return;
        const [me, catalog] = await Promise.all([meResponse.json(), plansResponse.json()]);
        if (cancelled || !me.discountPopupPending || !me.referralDiscountActive || !me.referralDiscountExpiresAt) return;
        const plans = [...(catalog.interviewPlans || []), ...(catalog.cvPlans || [])]
          .filter((plan: OfferPlan) => plan.id !== "free" && !plan.id.includes("pro")) as OfferPlan[];
        if (plans.length) {
          setOffer({
            reason: me.discountOfferReason === "referral" ? "referral" : "signup",
            expiresAt: me.referralDiscountExpiresAt,
            plans,
          });
        }
      } catch {
        // Keep the server-side notification pending and try again on next login.
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [headers, user?.id, user?.profileCompleted, user?.role]);

  const acknowledge = useCallback(async () => {
    if (user?.id) {
      await fetch("/api/subscription/discount-notification/acknowledge", {
        method: "POST",
        headers,
      }).catch(() => {});
    }
  }, [headers, user?.id]);

  const buyPlan = useCallback(async (plan: OfferPlan) => {
    if (!offer) return;
    setSelectedPlan(plan.id);
    setError("");
    try {
      const { offer: amount } = discountedPrices(plan);
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          planName: planLabel(plan.id),
          amount,
          discountPercentage: Number(plan.discount || 0),
          billingCycle: "weekly",
          requestId: crypto.randomUUID(),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success || !data.qrCode) {
        setError(data.error || "Không tạo được mã QR thanh toán.");
        return;
      }
      await acknowledge();
      setPayment({ planId: plan.id, planName: planLabel(plan.id), amount, qrCode: data.qrCode, orderCode: data.orderCode });
    } catch {
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setSelectedPlan(null);
    }
  }, [acknowledge, headers, offer]);

  useEffect(() => {
    if (!payment || paid) return;
    const poll = window.setInterval(async () => {
      try {
        const response = await fetch(`/api/payment/check/${payment.orderCode}`, { headers, cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        if (data.order?.status === "paid") setPaid(true);
      } catch {
        // Keep checking while the QR payment is open.
      }
    }, 3000);
    return () => window.clearInterval(poll);
  }, [headers, paid, payment]);

  if (!offer) return null;

  const title = offer.reason === "referral"
    ? "Bạn được tặng ưu đãi giới thiệu!"
    : "Ưu đãi dành cho tài khoản mới!";
  const description = offer.reason === "referral"
    ? "Một người bạn đã đăng ký bằng mã giới thiệu của bạn. Bạn được giảm thêm 20% cho các gói trong 7 ngày."
    : "Cảm ơn bạn đã đăng ký JobReady AI. Tất cả gói trả phí được giảm thêm 20% trong tuần đầu tiên.";
  const interviewPlans = offer.plans.filter((plan) => plan.id.includes("interview"));
  const cvPlans = offer.plans.filter((plan) => plan.id.includes("_cv"));

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-slate-950/65 p-4 backdrop-blur-sm" role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="discount-offer-title" className="relative my-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <button onClick={async () => { await acknowledge(); setOffer(null); setPayment(null); }} aria-label="Đóng ưu đãi" className="absolute right-4 top-4 z-10 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        {payment ? (
          <div className="p-6 text-center sm:p-9">
            {paid ? (
              <div className="mx-auto max-w-md py-8">
                <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
                <h2 className="mt-4 text-2xl font-bold">Thanh toán thành công</h2>
                <p className="mt-2 text-muted-foreground">Gói {payment.planName} đã được kích hoạt.</p>
                <button onClick={() => { setPayment(null); setPaid(false); setOffer(null); }} className="mt-6 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground">Hoàn tất</button>
              </div>
            ) : (
              <div className="mx-auto max-w-md">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Zap /></div>
                <h2 className="mt-4 text-2xl font-bold">Quét QR để thanh toán</h2>
                <p className="mt-2 text-sm text-muted-foreground">{payment.planName} · 7 ngày</p>
                <p className="mt-1 text-2xl font-black text-primary">{formatPrice(payment.amount)}</p>
                <div className="mx-auto mt-5 flex w-fit rounded-2xl border bg-white p-4"><QRCodeSVG value={payment.qrCode} size={220} /></div>
                <p className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Đang chờ xác nhận thanh toán…</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-7 pr-14 text-white sm:px-9">
              <div className="flex items-center gap-2 text-sm font-semibold text-white/85"><Sparkles className="h-4 w-4" />ƯU ĐÃI GIỚI HẠN</div>
              <h2 id="discount-offer-title" className="mt-2 text-2xl font-black sm:text-3xl">{title}</h2>
              <p className="mt-2 max-w-2xl text-sm text-white/90">{description}</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold"><Clock3 className="h-4 w-4" /><Countdown expiresAt={offer.expiresAt} /></div>
            </div>
            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-8">
              {[
                { heading: "AI Phỏng vấn", icon: <Zap className="h-4 w-4" />, plans: interviewPlans },
                { heading: "AI Tạo CV", icon: <Crown className="h-4 w-4" />, plans: cvPlans },
              ].map((group) => (
                <div key={group.heading} className="rounded-2xl border border-border p-4 sm:p-5">
                  <h3 className="mb-3 flex items-center gap-2 font-bold">{group.icon}{group.heading}</h3>
                  <div className="space-y-3">
                    {group.plans.map((plan) => {
                      const prices = discountedPrices(plan);
                      return (
                        <div key={plan.id} className="flex items-center justify-between gap-3 rounded-xl bg-muted/50 p-3">
                          <div className="min-w-0">
                            <p className="font-semibold">{plan.id.startsWith("ultra") ? "Ultra" : "Pro"}</p>
                            <p className="text-xs text-muted-foreground line-through">{formatPrice(prices.regular)}</p>
                            <p className="text-lg font-black text-primary">{formatPrice(prices.offer)}<span className="text-xs font-medium text-muted-foreground"> / tuần</span></p>
                          </div>
                          <button onClick={() => void buyPlan(plan)} disabled={!!selectedPlan} className="shrink-0 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-60">
                            {selectedPlan === plan.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Mua ngay"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              {error && <p className="sm:col-span-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
            </div>
            <div className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">Đóng cửa sổ này không làm mất ưu đãi. Bạn vẫn xem được giá đã giảm trong mục Nâng cấp.</div>
          </>
        )}
      </section>
    </div>
  );
}

function planLabel(id: string) {
  const family = id.endsWith("_cv") ? "AI Tạo CV" : "AI Phỏng vấn";
  const tier = id.startsWith("ultra") ? "Ultra" : "Pro";
  return `${tier} ${family}`;
}
