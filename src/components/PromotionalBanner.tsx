import { useEffect, useState, useCallback, useRef } from "react";
import { Flame, Sparkles, X, ArrowRight, Clock } from "lucide-react";
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
  const [campaign, setCampaign] = useState<ActiveCampaign | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);
  const activeCampaignIdRef = useRef<string | null>(null);

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
    <div
      className={`relative z-[60] w-full bg-gradient-to-r ${currentGradient} bg-[length:200%_200%] animate-gradient-flow text-white shadow-xl border-b backdrop-blur-md overflow-hidden transition-all duration-300`}
      style={{
        transform: visible ? "translateY(0)" : "translateY(-100%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
      }}
    >
      {/* Light shimmer bar moving across background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        {/* Left Section: Icon & Title */}
        <div className="flex flex-1 items-center gap-3 min-w-0">
          <div className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md shadow-inner ring-2 ring-white/30 animate-bounce">
            <Flame className="h-5 w-5 text-yellow-300 animate-pulse" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 text-gray-950 px-2.5 py-0.5 text-[11px] font-black tracking-wider shadow-sm animate-pulse">
                <Sparkles className="h-3 w-3 text-red-600 animate-spin" />
                GIẢM {campaign.discountPercentage}%
              </span>
              <h4 className="text-xs font-black sm:text-sm tracking-tight text-white drop-shadow-sm truncate">
                {campaign.bannerTitle}
              </h4>
            </div>
            {campaign.bannerSubtitle && (
              <p className="hidden md:block text-[11px] font-medium text-white/90 truncate mt-0.5">
                {campaign.bannerSubtitle}
              </p>
            )}
          </div>
        </div>

        {/* Center: Live Countdown Timer */}
        <div className="flex items-center gap-1.5 shrink-0 bg-black/30 px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md shadow-inner">
          <Clock className="h-3.5 w-3.5 text-yellow-300 animate-spin" style={{ animationDuration: "8s" }} />
          <span className="text-[11px] font-bold text-white/90 hidden lg:inline">Kết thúc sau:</span>
          <div className="flex items-center gap-1 font-mono text-xs font-black tracking-wider text-white">
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[11px] min-w-[22px] text-center shadow-sm">
              {pad(timeLeft.hours)}
            </span>
            <span className="animate-pulse">:</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[11px] min-w-[22px] text-center shadow-sm">
              {pad(timeLeft.minutes)}
            </span>
            <span className="animate-pulse">:</span>
            <span className="bg-yellow-300 text-gray-950 font-black px-1.5 py-0.5 rounded text-[11px] min-w-[22px] text-center shadow-sm animate-pulse">
              {pad(timeLeft.seconds)}
            </span>
          </div>
        </div>

        {/* Right Section: CTA Button & Dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/pricing"
            className="group inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-black text-gray-950 shadow-lg transition-all duration-300 hover:bg-yellow-300 hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-white/50"
          >
            <span>Nhận ưu đãi</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </a>

          <button
            onClick={handleDismiss}
            className="rounded-full p-1 text-white/70 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
            title="Đóng thông báo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
