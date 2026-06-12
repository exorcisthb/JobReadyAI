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

function ArrowIcon({ direction }: { direction: "up" | "down" | "left" | "right" }) {
  const className =
    direction === "up"
      ? "animate-bounce-down"
      : direction === "down"
        ? "animate-bounce-up"
        : direction === "left"
          ? "animate-bounce-right"
          : "animate-bounce-left";

  return (
    <div className={`absolute ${className}`}>
      {direction === "up" && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-primary"
        >
          <path
            d="M8 12V4M8 4L4 8M8 4L12 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {direction === "down" && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-primary"
        >
          <path
            d="M8 4V12M8 12L4 8M8 12L12 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {direction === "left" && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-primary"
        >
          <path
            d="M12 8H4M4 8L8 4M4 8L8 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {direction === "right" && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-primary"
        >
          <path
            d="M4 8H12M12 8L8 4M12 8L8 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

interface OnboardingTourProps {
  userId: string;
  currentStep: OnboardingStep;
  onComplete?: () => void;
  onAdvance?: () => void;
  onSkip?: () => void;
}

export function OnboardingTour({
  userId,
  currentStep,
  onComplete,
  onAdvance,
  onSkip,
}: OnboardingTourProps) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(
    null
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
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
      setIsVisible(true);
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
      setIsVisible(false);
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
    setIsVisible(false);
  };

  if (!currentStepConfig || !targetRect || !tooltipPosition) {
    return null;
  }

  return (
    <>
      {/* CSS for animations */}
      <style>{`
        @keyframes bounce-up {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes bounce-down {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        @keyframes bounce-left {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-6px); }
        }
        @keyframes bounce-right {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }
        .animate-bounce-up { animation: bounce-up 1.5s ease-in-out infinite; }
        .animate-bounce-down { animation: bounce-down 1.5s ease-in-out infinite; }
        .animate-bounce-left { animation: bounce-left 1.5s ease-in-out infinite; }
        .animate-bounce-right { animation: bounce-right 1.5s ease-in-out infinite; }
        
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s ease-out infinite;
        }
      `}</style>

      {/* Backdrop with spotlight */}
      <div
        className="fixed inset-0 z-[9998] transition-opacity duration-300"
        style={{
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
        }}
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0 bg-black/60"
          style={{
            boxShadow: `inset 0 0 0 ${targetRect.width + 24}px rgba(0,0,0,0.7)`,
            borderRadius: "0",
          }}
        />

        {/* Spotlight hole - using box-shadow technique */}
        <div
          className="absolute bg-transparent"
          style={{
            top: targetRect.top - 12,
            left: targetRect.left - 12,
            width: targetRect.width + 24,
            height: targetRect.height + 24,
            boxShadow: `0 0 0 9999px rgba(0,0,0,0.65)`,
            borderRadius: "12px",
            pointerEvents: "none",
          }}
        />

        {/* Highlight border ring */}
        <div
          className="absolute border-2 border-primary rounded-xl animate-pulse-ring"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
          }}
        />
      </div>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[9999] w-72 bg-card border border-border rounded-2xl shadow-2xl p-5 transition-all duration-300"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "scale(1)" : "scale(0.95)",
          pointerEvents: isVisible ? "auto" : "none",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          aria-label="Bỏ qua hướng dẫn"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Title */}
        <h3 className="text-base font-bold pr-6 mb-2">{currentStepConfig.title}</h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {currentStepConfig.description}
        </p>

        {/* Arrow */}
        <div
          className="absolute"
          style={{
            top:
              tooltipPosition.arrowDirection === "down"
                ? -14
                : tooltipPosition.arrowDirection === "up"
                  ? "auto"
                  : "50%",
            bottom:
              tooltipPosition.arrowDirection === "up"
                ? -14
                : tooltipPosition.arrowDirection === "down"
                  ? "auto"
                  : "auto",
            left:
              tooltipPosition.arrowDirection === "right" ||
              tooltipPosition.arrowDirection === "left"
                ? "auto"
                : "50%",
            right:
              tooltipPosition.arrowDirection === "left"
                ? -14
                : tooltipPosition.arrowDirection === "right"
                  ? "auto"
                  : "auto",
            transform:
              tooltipPosition.arrowDirection === "up" ||
              tooltipPosition.arrowDirection === "down"
                ? "translateX(-50%)"
                : "translateY(-50%)",
          }}
        >
          <ArrowIcon direction={tooltipPosition.arrowDirection} />
        </div>

        {/* Footer: Dots and Next button */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === stepIndex
                    ? "w-4 bg-primary"
                    : idx < stepIndex
                      ? "bg-primary/60"
                      : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={handleAdvance}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors cursor-pointer"
          >
            {stepIndex < steps.length - 1 ? (
              <>
                Tiếp theo
                <ChevronRight className="h-4 w-4" />
              </>
            ) : (
              "Hoàn tất"
            )}
          </button>
        </div>
      </div>
    </>
  );
}
