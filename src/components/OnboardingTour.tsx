import { useEffect, useState, useRef, useCallback } from "react";
import { X } from "lucide-react";
import type { OnboardingStep } from "@/hooks/useOnboarding";

interface ClickCaptureSpotlightProps {
  tLeft: number;
  tTop: number;
  tWidth: number;
  tHeight: number;
  onSpotClick: () => void;
}

function ClickCaptureSpotlight({ tLeft, tTop, tWidth, tHeight, onSpotClick }: ClickCaptureSpotlightProps) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      if (x >= tLeft && x <= tLeft + tWidth && y >= tTop && y <= tTop + tHeight) {
        onSpotClick();
      }
    };
    window.addEventListener("click", handler, true);
    return () => window.removeEventListener("click", handler, true);
  }, [tLeft, tTop, tWidth, tHeight, onSpotClick]);
  return null;
}

export interface TourStepConfig {
  targetSelector: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

const TOUR_STEPS: Record<OnboardingStep, TourStepConfig[]> = {
  post_login: [
    {
      targetSelector: "[data-onboarding='nav-cv']",
      title: "📄 Bắt đầu với CV của bạn",
      description: "Đây là nơi quản lý tất cả CV của bạn. Hãy bấm vào để tiếp tục!",
      position: "right",
    },
  ],
  cv_page: [
    {
      targetSelector: "[data-onboarding='upload-cv'], [data-onboarding='create-cv']",
      title: "📋 Thêm CV của bạn",
      description: "Bạn có thể tải lên CV có sẵn từ máy tính, hoặc tạo CV mới ngay trong web với các template đẹp!",
      position: "bottom",
    },
  ],
  cv_ready: [
    {
      targetSelector: "[data-onboarding='interview-btn']",
      title: "🎤 Sẵn sàng phỏng vấn!",
      description: "Tuyệt vời! Bạn đã có CV. Hãy bấm 'Phỏng vấn' để bắt đầu luyện tập với AI ngay!",
      position: "right",
    },
  ],
  persona_select: [
    {
      targetSelector: "[data-onboarding='persona-card']",
      title: "🤖 Chọn người phỏng vấn",
      description: "Mỗi HR có phong cách khác nhau. Bắt đầu với Chị Linh Dịu Dàng nếu đây là lần đầu của bạn!",
      position: "bottom",
    },
  ],
};

interface TooltipPosition {
  top: number;
  left: number;
  arrowDirection: "up" | "down" | "left" | "right";
}

function calculateTooltipPosition(
  targetRect: DOMRect,
  tooltipWidth: number,
  tooltipHeight: number,
  position: "top" | "bottom" | "left" | "right"
): TooltipPosition {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const pad = 16;
  const cx = targetRect.left + targetRect.width / 2;
  const cy = targetRect.top + targetRect.height / 2;
  let top = 0, left = 0;
  let arrowDirection: TooltipPosition["arrowDirection"] = "up";

  switch (position) {
    case "bottom": top = targetRect.bottom + pad; left = cx - tooltipWidth / 2; arrowDirection = "up"; break;
    case "top":    top = targetRect.top - tooltipHeight - pad; left = cx - tooltipWidth / 2; arrowDirection = "down"; break;
    case "left":   top = cy - tooltipHeight / 2; left = targetRect.left - tooltipWidth - pad; arrowDirection = "right"; break;
    case "right":  top = cy - tooltipHeight / 2; left = targetRect.right + pad; arrowDirection = "left"; break;
  }

  // Nếu right tràn viewport → đổi sang bottom
  if (position === "right" && left + tooltipWidth > vw - pad) {
    top = targetRect.bottom + pad;
    left = cx - tooltipWidth / 2;
    arrowDirection = "up";
  }

  left = Math.max(pad, Math.min(left, vw - tooltipWidth - pad));
  top  = Math.max(pad, Math.min(top, vh - tooltipHeight - pad));
  return { top, left, arrowDirection };
}

interface OnboardingTourProps {
  userId: string;
  currentStep: OnboardingStep;
  onAdvance?: () => void;
  onSkip?: () => void;
}

export function OnboardingTour({ currentStep, onAdvance, onSkip }: OnboardingTourProps) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [shaking, setShaking] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tooltipWidth = 240;
  const tooltipHeight = 140;

  // Compute total steps in flow + current index for "Bước X/Y" display
  const stepOrder: OnboardingStep[] = ["post_login", "cv_page", "cv_ready", "persona_select"];
  const currentStepFlowIndex = stepOrder.indexOf(currentStep);
  const totalFlowSteps = stepOrder.length;
  const currentFlowStepNumber = currentStepFlowIndex + 1;

  const steps = TOUR_STEPS[currentStep] || [];
  const currentStepConfig = steps[stepIndex];

  const queryAndSet = useCallback((): boolean => {
    if (!currentStepConfig) return false;

    // Đợi sidebar transition xong
    const sidebar = document.querySelector("aside");
    if (sidebar && sidebar.getAttribute("data-sidebar-ready") === "false") return false;

    const targets = Array.from(document.querySelectorAll(currentStepConfig.targetSelector));
    if (targets.length === 0) return false;

    let minTop = Infinity, minLeft = Infinity, maxRight = -Infinity, maxBottom = -Infinity;
    targets.forEach((el) => {
      const r = el.getBoundingClientRect();
      minTop    = Math.min(minTop, r.top);
      minLeft   = Math.min(minLeft, r.left);
      maxRight  = Math.max(maxRight, r.right);
      maxBottom = Math.max(maxBottom, r.bottom);
    });

    // Rect chưa paint xong → thất bại, retry
    if (maxRight - minLeft < 4 || maxBottom - minTop < 4) return false;

    const sp = 6;
    const rect = new DOMRect(
      minLeft - sp, minTop - sp,
      maxRight - minLeft + sp * 2,
      maxBottom - minTop + sp * 2
    );
    setTargetRect(rect);
    setTooltipPosition(calculateTooltipPosition(rect, tooltipWidth, tooltipHeight, currentStepConfig.position));
    return true;
  }, [currentStepConfig, tooltipWidth, tooltipHeight]);

  // Retry loop: thử mỗi 150ms, tối đa 20 lần
  const startRetryLoop = useCallback(() => {
    let attempts = 0;
    const tryOnce = () => {
      if (queryAndSet()) return;
      attempts++;
      if (attempts < 20) retryRef.current = setTimeout(tryOnce, 150);
    };
    retryRef.current = setTimeout(tryOnce, 150);
  }, [queryAndSet]);

  useEffect(() => {
    setTargetRect(null);
    setTooltipPosition(null);
    if (retryRef.current) clearTimeout(retryRef.current);
    if (!queryAndSet()) startRetryLoop();
    return () => { if (retryRef.current) clearTimeout(retryRef.current); };
  }, [currentStepConfig?.targetSelector, queryAndSet, startRetryLoop]);

  useEffect(() => {
    const update = () => queryAndSet();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [queryAndSet]);

  const handleAdvance = useCallback(() => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((p) => p + 1);
    } else {
      onAdvance?.();
    }
  }, [stepIndex, steps.length, onAdvance]);

  const handleSkip = useCallback(() => {
    onSkip?.();
  }, [onSkip]);

  if (!currentStepConfig || !targetRect || !tooltipPosition) return null;

  const { top: tTop, left: tLeft, width: tWidth, height: tHeight } = targetRect;
  const svgH = window.innerHeight;
  const svgW = window.innerWidth;

  return (
    <>
      <style>{`
        @keyframes pulse-ring { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes arrow-bounce-right { 0%,100%{transform:translateX(0) translateY(-50%)} 50%{transform:translateX(5px) translateY(-50%)} }
        @keyframes arrow-bounce-down  { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(5px)} }
        @keyframes arrow-bounce-up    { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-5px)} }
        @keyframes arrow-bounce-left  { 0%,100%{transform:translateX(0) translateY(-50%)} 50%{transform:translateX(-5px) translateY(-50%)} }
        @keyframes tour-in { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        @keyframes tour-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
        .tour-ring  { animation: pulse-ring 2s ease-in-out infinite; }
        .tour-arrow-right { animation: arrow-bounce-right 1.2s ease-in-out infinite; }
        .tour-arrow-down  { animation: arrow-bounce-down  1.2s ease-in-out infinite; }
        .tour-arrow-up    { animation: arrow-bounce-up    1.2s ease-in-out infinite; }
        .tour-arrow-left  { animation: arrow-bounce-left  1.2s ease-in-out infinite; }
        .tour-box   { animation: tour-in 0.2s ease-out both; }
      `}</style>

      {/* SVG spotlight: 4 rect tối + ring viền quanh element */}
      <svg
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9998, width: svgW, height: svgH }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top */}
        <rect x={0} y={0} width={svgW} height={Math.max(0, tTop)} fill="rgba(0,0,0,0.35)" />
        {/* Bottom */}
        <rect x={0} y={tTop + tHeight} width={svgW} height={Math.max(0, svgH - tTop - tHeight)} fill="rgba(0,0,0,0.35)" />
        {/* Left */}
        <rect x={0} y={tTop} width={Math.max(0, tLeft)} height={tHeight} fill="rgba(0,0,0,0.35)" />
        {/* Right */}
        <rect x={tLeft + tWidth} y={tTop} width={Math.max(0, svgW - tLeft - tWidth)} height={tHeight} fill="rgba(0,0,0,0.35)" />
        {/* Highlight ring */}
        <rect
          className="tour-ring"
          x={tLeft - 3} y={tTop - 3}
          width={tWidth + 6} height={tHeight + 6}
          rx={8} fill="none"
          stroke="hsl(var(--primary))" strokeWidth={2}
        />
      </svg>

      {/* Click blocker: 4 div chặn ở vùng NGOÀI spotlight. Vùng spotlight KHÔNG bị chặn → click rơi xuống element thật */}
      {/* Top blocker */}
      <div
        className="fixed left-0 right-0 pointer-events-auto"
        style={{ top: 0, height: tTop, zIndex: 9997 }}
        onClick={() => { setShaking(true); setTimeout(() => setShaking(false), 350); }}
      />
      {/* Bottom blocker */}
      <div
        className="fixed left-0 right-0 pointer-events-auto"
        style={{ top: tTop + tHeight, bottom: 0, zIndex: 9997 }}
        onClick={() => { setShaking(true); setTimeout(() => setShaking(false), 350); }}
      />
      {/* Left blocker */}
      <div
        className="fixed pointer-events-auto"
        style={{ top: tTop, left: 0, width: tLeft, height: tHeight, zIndex: 9997 }}
        onClick={() => { setShaking(true); setTimeout(() => setShaking(false), 350); }}
      />
      {/* Right blocker */}
      <div
        className="fixed pointer-events-auto"
        style={{ top: tTop, left: tLeft + tWidth, right: 0, height: tHeight, zIndex: 9997 }}
        onClick={() => { setShaking(true); setTimeout(() => setShaking(false), 350); }}
      />

      {/* Advance listener: capture click vào spotlight → advance tour + click vẫn propagate để navigate */}
      <ClickCaptureSpotlight
        tLeft={tLeft} tTop={tTop} tWidth={tWidth} tHeight={tHeight}
        onSpotClick={handleAdvance}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="tour-box fixed bg-card border border-border rounded-2xl shadow-2xl p-4"
        style={{
          zIndex: 9999,
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          width: 240,
          maxWidth: "calc(100vw - 32px)",
          pointerEvents: "auto",
          animation: shaking
            ? "tour-shake 0.35s ease-in-out"
            : "tour-in 0.2s ease-out both",
        }}
      >
        {/* Mũi tên chỉ vào element */}
        {/* tooltip ở DƯỚI target → arrow ở TRÊN tooltip → chỉ lên ↑ */}
        {tooltipPosition.arrowDirection === "up" && (
          <div className="tour-arrow-up absolute" style={{ top: -22, left: "50%", transform: "translateX(-50%)" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 16V4M10 4L5 9M10 4L15 9" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        {/* tooltip ở TRÊN target → arrow ở DƯỚI tooltip → chỉ xuống ↓ */}
        {tooltipPosition.arrowDirection === "down" && (
          <div className="tour-arrow-down absolute" style={{ bottom: -22, left: "50%", transform: "translateX(-50%)" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4V16M10 16L5 11M10 16L15 11" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        {/* tooltip ở PHẢI target → arrow ở TRÁI tooltip → chỉ sang trái ← */}
        {tooltipPosition.arrowDirection === "left" && (
          <div className="tour-arrow-left absolute" style={{ left: -22, top: "50%", transform: "translateY(-50%)" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        {/* tooltip ở TRÁI target → arrow ở PHẢI tooltip → chỉ sang phải → */}
        {tooltipPosition.arrowDirection === "right" && (
          <div className="tour-arrow-right absolute" style={{ right: -22, top: "50%", transform: "translateY(-50%)" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}

        {/* Nút X bỏ qua */}
        <button
          onClick={handleSkip}
          className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          aria-label="Bỏ qua hướng dẫn"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Step indicator */}
        <span className="text-xs text-muted-foreground mb-2">
          Bước {currentFlowStepNumber}/{totalFlowSteps}
        </span>

        {/* Nội dung */}
        <h3 className="text-sm font-semibold mb-1 leading-snug">{currentStepConfig.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{currentStepConfig.description}</p>

        {/* Skip link */}
        <button
          onClick={handleSkip}
          className="text-xs text-muted-foreground hover:text-foreground hover:underline mt-3 cursor-pointer"
        >
          Bỏ qua hướng dẫn — tôi đã biết dùng rồi
        </button>
      </div>
    </>
  );
}
