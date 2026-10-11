import { useEffect, useState, useCallback, useRef } from "react";
import { Flame, Sparkles, X, ArrowRight, Clock, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

export type ActiveCampaign = {
  id: string;
  name: string;
  eventType: "automatic" | "manual";
  startDate: string;
  endDate: string;
  discountPercentage: number;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerTheme: "amber" | "red" | "purple" | "emerald" | string;
  isActive: boolean;
};

type PromoPlan = { id: string; name: string; weeklyPrice: number; discount: number | null };

function promoPrice(plan: PromoPlan) {
  const discount = Number(plan.discount || 0);
  return discount > 0 ? Math.round((plan.weeklyPrice * (1 - discount / 100)) / 1000) * 1000 : plan.weeklyPrice;
}

function calcTimeLeft(endDateStr: string) {
  const now = new Date().getTime();
  const end = new Date(endDateStr).getTime();
  const diff = Math.max(0, end - now);

  if (diff === 0) return null;

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}

export function PromotionalBanner() {
  const { user } = useAuth();

  // Banner only displays for standard users or non-logged-in guests (hide for admin/manager/content_manager)
  if (user && user.role !== "user") {
    return null;
  }

  const [campaign, setCampaign] = useState<ActiveCampaign | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);
  const activeCampaignIdRef = useRef<string | null>(null);
  const [showClaimOptions, setShowClaimOptions] = useState(false);
  const [claimPlans, setClaimPlans] = useState<PromoPlan[]>([]);
  const [loadingClaimPlans, setLoadingClaimPlans] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const hasTimeLeft = Boolean(timeLeft);

  useEffect(() => {
    async function fetchActivePromotion() {
      try {
        const res = await fetch("/api/promotions/active");
        if (res.ok) {
          const data = await res.json();
          if (data.hasActiveSale && data.campaign) {
            const camp: ActiveCampaign = data.campaign;
            // Check if dismissed for current user specifically (do not mix guest dismissal with logged in user)
            const userDismissKey = `promo_dismissed_${user?.id || "guest"}_${camp.id}`;
            const isDismissed = sessionStorage.getItem(userDismissKey);

            if (isDismissed) {
              setDismissed(true);
              setCampaign(null);
              return;
            }

            const initialTime = calcTimeLeft(camp.endDate);
            if (!initialTime) {
              setCampaign(null);
              return;
            }

            setDismissed(false);
            setCampaign(camp);
            setTimeLeft(initialTime);

            // Avoid re-triggering entrance animation if campaign didn't change
            if (activeCampaignIdRef.current !== camp.id) {
              activeCampaignIdRef.current = camp.id;
              setVisible(true);
            }
          } else {
            setCampaign(null);
            activeCampaignIdRef.current = null;
          }
        }
      } catch (err) {
        console.error("Failed to fetch active promotion:", err);
      }
    }

    fetchActivePromotion();
    const interval = setInterval(fetchActivePromotion, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user?.id]);

  // Countdown timer tick effect (1s)
  useEffect(() => {
    if (!campaign) return;

    function tick() {
      const remaining = calcTimeLeft(campaign!.endDate);
      if (!remaining) {
        setTimeLeft(null);
        setCampaign(null);
        setVisible(false);
        activeCampaignIdRef.current = null;
        return;
      }
      setTimeLeft(remaining);
    }

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [campaign]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setDismissed(true);
      if (campaign) {
        const dismissKey = `promo_dismissed_${user?.id || "guest"}_${campaign.id}`;
        sessionStorage.setItem(dismissKey, "true");
        activeCampaignIdRef.current = null;
      }
    }, 300);
  }, [campaign, user?.id]);

  useEffect(() => {
    const root = document.documentElement;
    if (!campaign || dismissed || !hasTimeLeft || !bannerRef.current) {
      root.style.setProperty("--promo-banner-height", "0px");
      return;
    }

    const banner = bannerRef.current;
    const updateHeight = () => root.style.setProperty("--promo-banner-height", `${banner.getBoundingClientRect().height}px`);
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(banner);
    return () => observer.disconnect();
  }, [campaign, dismissed, hasTimeLeft]);

  const openClaimOptions = async () => {
    setShowClaimOptions(true);
    if (claimPlans.length || loadingClaimPlans) return;
    setLoadingClaimPlans(true);
    try {
      const response = await fetch("/api/subscription/plans", { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      const targets = data.activePromotion?.targetPlans;
      const targetList = Array.isArray(targets) ? targets : [];
      const plans = [...(data.interviewPlans || []), ...(data.cvPlans || [])]
        .filter((plan: PromoPlan) => plan.id !== "free" && !plan.id.includes("pro") && (!targetList.length || targetList.includes(plan.id)));
      setClaimPlans(plans);
    } catch (err) {
      console.error("Failed to load promotion plans:", err);
    } finally {
      setLoadingClaimPlans(false);
    }
  };

  const choosePromoPlan = (plan: PromoPlan) => {
    const categoryPath = plan.id.includes("interview") ? "/pricing/interview" : "/pricing/cv";
    const claimUrl = `${categoryPath}?claimPromotion=1&plan=${encodeURIComponent(plan.id)}`;
    if (!user?.id) {
      window.location.assign(`/login?returnTo=${encodeURIComponent(claimUrl)}`);
      return;
    }
    window.location.assign(claimUrl);
  };

  if (dismissed || !campaign || !timeLeft) {
    return null;
  }

  const themeGradients: Record<string, string> = {
    amber: "from-amber-600 via-orange-500 to-red-600 border-amber-400/30",
    red: "from-red-700 via-rose-600 to-purple-900 border-rose-500/30",
    purple: "from-indigo-600 via-purple-600 to-pink-600 border-purple-400/30",
    emerald: "from-emerald-600 via-teal-600 to-cyan-700 border-emerald-400/30",
  };

  const currentGradient = themeGradients[campaign.bannerTheme] || themeGradients.amber;
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <>
    <div
      ref={bannerRef}
      className={`sticky top-0 z-[60] w-full bg-gradient-to-r ${currentGradient} bg-[length:200%_200%] animate-gradient-flow text-white shadow-xl border-b backdrop-blur-md overflow-hidden transition-all duration-300`}
      style={{
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
      }}
    >
      {/* Light shimmer bar moving across background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

      <div className="relative flex w-full items-center px-3 py-2.5 sm:px-5">
        <div className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-inner ring-2 ring-white/30 animate-bounce sm:mr-4">
          <Flame className="h-5 w-5 text-yellow-300 animate-pulse" />
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="promo-banner-marquee">
            {[0, 1].map((copy) => (
              <div key={copy} className="promo-banner-marquee-item" aria-hidden={copy === 1}>
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-2.5 py-0.5 text-[11px] font-black tracking-wider text-gray-950 shadow-sm">
                    <Sparkles className="h-3 w-3 text-red-600 animate-spin" />
                    GIẢM {campaign.discountPercentage}%
                  </span>
                  <h4 className="text-xs font-black tracking-tight text-white drop-shadow-sm sm:text-sm">{campaign.bannerTitle}</h4>
                  {campaign.bannerSubtitle && <span className="hidden text-[11px] font-medium text-white/90 md:inline">· {campaign.bannerSubtitle}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => void openClaimOptions()}
          className="group mr-3 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-black text-gray-950 shadow-lg transition-all duration-300 hover:bg-yellow-300 hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-white/50 sm:mr-4"
        >
          <span>Nhận ưu đãi</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </button>

        <div className="mr-3 flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 shadow-inner backdrop-blur-md sm:mr-4">
          <Clock className="h-3.5 w-3.5 text-yellow-300 animate-spin" style={{ animationDuration: "8s" }} />
          <span className="hidden text-[11px] font-bold text-white/90 lg:inline">Kết thúc sau:</span>
          <div className="flex items-center gap-1 font-mono text-xs font-black tracking-wider text-white">
            <span className="min-w-[22px] rounded bg-white/20 px-1.5 py-0.5 text-center text-[11px] shadow-sm">{pad(timeLeft.hours)}</span>
            <span className="animate-pulse">:</span>
            <span className="min-w-[22px] rounded bg-white/20 px-1.5 py-0.5 text-center text-[11px] shadow-sm">{pad(timeLeft.minutes)}</span>
            <span className="animate-pulse">:</span>
            <span className="min-w-[22px] rounded bg-yellow-300 px-1.5 py-0.5 text-center text-[11px] font-black text-gray-950 shadow-sm">{pad(timeLeft.seconds)}</span>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="shrink-0 rounded-full p-1 text-white/70 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
          title="Đóng thông báo"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
      {showClaimOptions && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowClaimOptions(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="promo-options-title" className="w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card text-foreground shadow-2xl">
            <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 p-6 text-white sm:p-8">
              <div><p className="text-xs font-black tracking-widest">ƯU ĐÃI {campaign.discountPercentage}%</p><h2 id="promo-options-title" className="mt-2 text-2xl font-black">Chọn gói bạn muốn nhận ưu đãi</h2><p className="mt-1 text-sm text-white/90">Mã QR thanh toán sẽ được tạo theo gói bạn chọn.</p></div>
              <button onClick={() => setShowClaimOptions(false)} aria-label="Đóng" className="rounded-full p-2 hover:bg-white/20"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7">
              {loadingClaimPlans ? <div className="sm:col-span-2 flex justify-center py-10"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div> : ([
                { label: "AI Phỏng vấn", plans: claimPlans.filter((plan) => plan.id.includes("interview")) },
                { label: "AI Tạo CV", plans: claimPlans.filter((plan) => plan.id.endsWith("_cv")) },
              ] as const).map((group) => {
                const plan = group.plans.sort((a, b) => promoPrice(a) - promoPrice(b))[0];
                return <div key={group.label} className="rounded-2xl border border-border bg-muted/30 p-5">
                  <p className="text-sm font-bold text-muted-foreground">{group.label}</p>
                  {plan ? <><h3 className="mt-2 text-xl font-black">{plan.id.startsWith("ultra") ? "Ultra" : "Pro"}</h3><p className="mt-3 text-sm text-muted-foreground line-through">{plan.weeklyPrice.toLocaleString("vi-VN")}đ / tuần</p><p className="text-2xl font-black text-primary">{promoPrice(plan).toLocaleString("vi-VN")}đ <span className="text-xs font-medium text-muted-foreground">/ tuần</span></p><p className="mt-1 text-xs font-bold text-emerald-600">Đã áp dụng ưu đãi {plan.discount || campaign.discountPercentage}%</p><button onClick={() => choosePromoPlan(plan)} className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:opacity-90">Chọn gói này</button></> : <p className="mt-3 text-sm text-muted-foreground">Ưu đãi hiện không áp dụng cho gói này.</p>}
                </div>;
              })}
              {!loadingClaimPlans && !claimPlans.length && <p className="sm:col-span-2 text-center text-sm text-destructive">Không tải được các gói ưu đãi. Vui lòng thử lại.</p>}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
