import { useEffect, useState, useRef, useCallback } from "react";
import { X, ChevronRight } from "lucide-react";
import type { OnboardingStep } from "@/hooks/useOnboarding";

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
      description:
        "Đây là nơi quản lý tất cả CV của bạn. Hãy bấm vào để tiếp tục!",
      position: "bottom",
    },
  ],
  cv_page: [
    {
      targetSelector:
        "[data-onboarding='upload-cv'], [data-onboarding='create-cv']",
      title: "📋 Thêm CV của bạn",
      description:
        "Bạn có thể tải lên CV có sẵn từ máy tính, hoặc tạo CV mới ngay trong web với các template đẹp!",
      position: "bottom",
    },
  ],
  cv_ready: [
    {
      targetSelector: "[data-onboarding='interview-btn']",
      title: "🎤 Sẵn sàng phỏng vấn!",
      description:
        "Tuyệt vời! Bạn đã có CV. Hãy bấm 'Phỏng vấn' để bắt đầu luyện tập với AI ngay!",
      position: "right",
    },
  ],
  persona_select: [
    {
      targetSelector: "[data-onboarding='persona-card']",
      title: "🤖 Chọn người phỏng vấn",
      description:
        "Mỗi HR có phong cách khác nhau. Bắt đầu với Chị Linh Dịu Dàng nếu đây là lần đầu của bạn! Bấm vào card để bắt đầu phỏng vấn.",
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
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const padding = 16;

  let top = 0;
  let left = 0;
  let arrowDirection: "up" | "down" | "left" | "right" = "up";

  const targetCenterX = targetRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top + targetRect.height / 2;

  switch (position) {
    case "bottom":
      top = targetRect.bottom + padding;
      left = targetCenterX - tooltipWidth / 2;
      arrowDirection = "up";
      break;
    case "top":
      top = targetRect.top - tooltipHeight - padding;
      left = targetCenterX - tooltipWidth / 2;
      arrowDirection = "down";
      break;
    case "left":
      top = targetCenterY - tooltipHeight / 2;
      left = targetRect.left - tooltipWidth - padding;
      arrowDirection = "right";
      break;
    case "right":
      top = targetCenterY - tooltipHeight / 2;
      left = targetRect.right + padding;
      arrowDirection = "left";
      break;
  }

  // Clamp to viewport
  left = Math.max(padding, Math.min(left, viewportWidth - tooltipWidth - padding));
  top = Math.max(padding, Math.min(top, viewportHeight - tooltipHeight - padding));

  // Auto-reposition if out of bounds
  if (left + tooltipWidth > viewportWidth - padding) {
    left = viewportWidth - tooltipWidth - padding;
  }
  if (top < padding) {
    top = padding;
  }
  if (top + tooltipHeight > viewportHeight - padding) {
    top = viewportHeight - tooltipHeight - padding;
  }

  return { top, left, arrowDirection };
}

interface OnboardingTourProps {
  userId: string;
  currentStep: OnboardingStep;
  onAdvance?: () => void;
  onSkip?: () => void;
}

export function OnboardingTour({
  userId,
  currentStep,
  onAdvance,
  onSkip,
}: OnboardingTourProps) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(
    null
  );
  const [stepIndex, setStepIndex] = useState(0);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipWidth = 288; // w-72 = 18rem = 288px
  const tooltipHeight = 180; // approximate

  const steps = TOUR_STEPS[currentStep] || [];
  const currentStepConfig = steps[stepIndex];

  const updateTargetPosition = useCallback(() => {
    if (!currentStepConfig) return;

    const selector = currentStepConfig.targetSelector;
    const targets = document.querySelectorAll(selector);

    if (targets.length === 0) {
      // Target not found, skip to next step
      if (onAdvance) {
        onAdvance();
      }
      return;
    }

    // Get bounding rect of all targets combined
    let minTop = Infinity;
    let minLeft = Infinity;
    let maxRight = -Infinity;
    let maxBottom = -Infinity;

    targets.forEach((target) => {
      const rect = target.getBoundingClientRect();
      minTop = Math.min(minTop, rect.top);
      minLeft = Math.min(minLeft, rect.left);
      maxRight = Math.max(maxRight, rect.right);
      maxBottom = Math.max(maxBottom, rect.bottom);
    });

    // Add padding
    const padding = 8;
    const combinedRect = new DOMRect(
      minLeft - padding,
      minTop - padding,
      maxRight - minLeft + padding * 2,
      maxBottom - minTop + padding * 2
    );

    setTargetRect(combinedRect);

    // Scroll element into view if needed
    if (targets[0]) {
      targets[0].scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }

    // Calculate tooltip position
    const pos = calculateTooltipPosition(
      combinedRect,
      tooltipWidth,
      tooltipHeight,
      currentStepConfig.position
    );
    setTooltipPosition(pos);
  }, [currentStepConfig, onAdvance]);

  useEffect(() => {
    // Delay to allow DOM to settle
    const timer = setTimeout(() => {
      updateTargetPosition();
    }, 100);

    return () => clearTimeout(timer);
  }, [updateTargetPosition]);

  useEffect(() => {
    const handleResize = () => {
      updateTargetPosition();
    };

    const handleScroll = () => {
      updateTargetPosition();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [updateTargetPosition]);

  const handleAdvance = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      // Tour step complete
      if (onAdvance) {
        onAdvance();
      }
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  if (!currentStepConfig || !targetRect || !tooltipPosition) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes bounce-vertical {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        @keyframes bounce-up-anim {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes bounce-horizontal {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }
        @keyframes bounce-left-anim {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-6px); }
        }
        @keyframes pulse-border {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes tour-fadein {
          from { opacity: 0; transform: scale(0.96) translateY(4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-bounce-down { animation: bounce-vertical 1.5s ease-in-out infinite; }
        .animate-bounce-up   { animation: bounce-up-anim 1.5s ease-in-out infinite; }
        .animate-bounce-right{ animation: bounce-horizontal 1.5s ease-in-out infinite; }
        .animate-bounce-left { animation: bounce-left-anim 1.5s ease-in-out infinite; }
        .tour-tooltip { animation: tour-fadein 0.25s ease-out both; }
        .tour-highlight-ring { animation: pulse-border 2s ease-in-out infinite; }
      `}</style>

      {/* SVG Overlay — spotlight bằng cách vẽ 4 rect tối xung quanh element, KHÔNG che element */}
      {targetRect && (
        <svg
          className="fixed inset-0 z-[9998] pointer-events-none"
          style={{ width: '100vw', height: '100vh' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top */}
          <rect
            x={0} y={0}
            width="100%"
            height={Math.max(0, targetRect.top - 8)}
            fill="rgba(0,0,0,0.6)"
          />
          {/* Bottom */}
          <rect
            x={0}
            y={targetRect.bottom + 8}
            width="100%"
            height={`calc(100vh - ${targetRect.bottom + 8}px)`}
            fill="rgba(0,0,0,0.6)"
          />
          {/* Left */}
          <rect
            x={0}
            y={Math.max(0, targetRect.top - 8)}
            width={Math.max(0, targetRect.left - 8)}
            height={targetRect.height + 16}
            fill="rgba(0,0,0,0.6)"
          />
          {/* Right */}
          <rect
            x={targetRect.right + 8}
            y={Math.max(0, targetRect.top - 8)}
            width={`calc(100vw - ${targetRect.right + 8}px)`}
            height={targetRect.height + 16}
            fill="rgba(0,0,0,0.6)"
          />
          {/* Highlight border ring around element */}
          <rect
            x={targetRect.left - 6}
            y={targetRect.top - 6}
            width={targetRect.width + 12}
            height={targetRect.height + 12}
            rx={10}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
            className="tour-highlight-ring"
          />
        </svg>
      )}

      {/* Click-blocker backdrop — cho phép click vào vùng highlight, chặn vùng còn lại */}
      {targetRect && (
        <div
          className="fixed inset-0 z-[9997]"
          style={{ cursor: 'default' }}
          onClick={(e) => {
            // Nếu click vào vùng highlight thì cho qua
            const x = e.clientX, y = e.clientY;
            const inSpot =
              x >= targetRect.left - 8 && x <= targetRect.right + 8 &&
              y >= targetRect.top - 8 && y <= targetRect.bottom + 8;
            if (inSpot) {
              handleAdvance();
            }
          }}
        />
      )}

      {/* Tooltip box */}
      {tooltipPosition && (
        <div
          ref={tooltipRef}
          className="tour-tooltip fixed z-[9999] bg-card border border-border rounded-2xl shadow-2xl p-5"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            width: Math.min(tooltipWidth, window.innerWidth - 32),
            pointerEvents: 'auto',
          }}
        >
          {/* Arrow trỏ từ tooltip vào element */}
          {tooltipPosition.arrowDirection === 'up' && (
            <div
              className="absolute animate-bounce-down"
              style={{ top: -20, left: '50%', transform: 'translateX(-50%)' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L10 16M10 2L4 9M10 2L16 9"
                  stroke="hsl(var(--primary))" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
          {tooltipPosition.arrowDirection === 'down' && (
            <div
              className="absolute animate-bounce-up"
              style={{ bottom: -20, left: '50%', transform: 'translateX(-50%)' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 18L10 4M10 18L4 11M10 18L16 11"
                  stroke="hsl(var(--primary))" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
          {tooltipPosition.arrowDirection === 'left' && (
            <div
              className="absolute animate-bounce-right"
              style={{ left: -20, top: '50%', transform: 'translateY(-50%)' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 10L16 10M2 10L9 4M2 10L9 16"
                  stroke="hsl(var(--primary))" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
          {tooltipPosition.arrowDirection === 'right' && (
            <div
              className="absolute animate-bounce-left"
              style={{ right: -20, top: '50%', transform: 'translateY(-50%)' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M18 10L4 10M18 10L11 4M18 10L11 16"
                  stroke="hsl(var(--primary))" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Bỏ qua hướng dẫn"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Title */}
          <h3 className="text-base font-bold pr-6 mb-2 leading-snug">
            {currentStepConfig.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentStepConfig.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
            {/* Step dots */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: idx === stepIndex ? 16 : 8,
                    height: 8,
                    background: idx <= stepIndex
                      ? 'hsl(var(--primary))'
                      : 'hsl(var(--muted-foreground) / 0.3)',
                  }}
                />
              ))}
            </div>

            {/* Next / Done button */}
            <button
              onClick={handleAdvance}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold transition-colors cursor-pointer"
            >
              {stepIndex < steps.length - 1 ? (
                <>Tiếp theo <ChevronRight className="h-4 w-4" /></>
              ) : (
                'Hoàn tất'
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
