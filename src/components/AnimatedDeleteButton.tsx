import React, { useState, useRef, useEffect, useId, useCallback, useMemo } from "react";
import "./animated-delete-button.css";

export interface AnimatedDeleteButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  /** Text displayed on the button, whose characters fly into the trash. Default "Xóa" */
  text?: string;
  /** Async or sync callback fired when delete animation finishes */
  onDelete?: () => void | Promise<void>;
  /** Optional onClick handler (if passed, can cancel or complement onDelete) */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Size variant: 'sm' (for tables/cards) | 'md' (standard) | 'lg' (prominent) */
  size?: "sm" | "md" | "lg";
  /** Color theme: 'purple' (original gradient) | 'red' (danger red) | 'outline' */
  variant?: "purple" | "red" | "outline";
  /** Whether to play sound effects using Web Audio API synthesis */
  enableSound?: boolean;
  /** Whether to show particle splash effects */
  enableParticles?: boolean;
  /** Optional confirmation message before animation starts */
  confirmMessage?: string;
}

// Lightweight Web Audio API Synthesizer (Zero external dependencies)
class SoundEngine {
  private ctx: AudioContext | null = null;

  init() {
    try {
      if (!this.ctx && typeof window !== "undefined") {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
    } catch {
      // Audio not supported or blocked
    }
  }

  playLidOpen() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(460, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {}
  }

  playLetterFly(index: number) {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const baseFreq = 320 + index * 50;
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(130, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {}
  }

  playLidClose() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {}
  }
}

const globalSound = new SoundEngine();

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export const AnimatedDeleteButton: React.FC<AnimatedDeleteButtonProps> = ({
  text = "Xóa",
  onDelete,
  onClick,
  size = "md",
  variant = "purple",
  enableSound = true,
  enableParticles = true,
  confirmMessage,
  className = "",
  disabled = false,
  type = "button",
  ...rest
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [flyingIndices, setFlyingIndices] = useState<number[]>([]);

  // SVG fill level state
  const [fillHeight, setFillHeight] = useState(0);
  const [fillY, setFillY] = useState(21);
  const [fillTopD, setFillTopD] = useState("M 6 21 Q 12 21 18 21");
  const [isImpact, setIsImpact] = useState(false);

  // References
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const trashSvgRef = useRef<SVGSVGElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Particles animation frame ref
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Unique SVG IDs to avoid clipPath conflicts across multiple buttons
  const rawId = useId();
  const safeId = useMemo(() => "adb_" + rawId.replace(/[^a-zA-Z0-9_-]/g, ""), [rawId]);
  const clipId = `trashInnerClip_${safeId}`;
  const gradId = `fillGradient_${safeId}`;

  // Split characters
  const characters = useMemo(() => text.split(""), [text]);

  // Particle color based on variant
  const particleColor = variant === "red" ? "#f87171" : "#c084fc";

  // Particle emitter
  const emitParticles = useCallback(
    (count = 10) => {
      if (!enableParticles || !canvasRef.current || !trashSvgRef.current) return;
      const canvas = canvasRef.current;
      const svg = trashSvgRef.current;
      const canvasRect = canvas.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();

      const mouthX = svgRect.left - canvasRect.left + svgRect.width / 2;
      const mouthY = svgRect.top - canvasRect.top + svgRect.height / 3;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 2.5;
        particlesRef.current.push({
          x: mouthX,
          y: mouthY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          size: 2 + Math.random() * 2,
          alpha: 1,
          color: particleColor,
        });
      }

      if (!animFrameRef.current) {
        const loop = () => {
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          particlesRef.current.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.035;
            p.size = Math.max(0, p.size - 0.05);

            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          });

          particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0);

          if (particlesRef.current.length > 0) {
            animFrameRef.current = requestAnimationFrame(loop);
          } else {
            animFrameRef.current = null;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        };
        animFrameRef.current = requestAnimationFrame(loop);
      }
    },
    [enableParticles, particleColor]
  );

  // Resize canvas to match container bounds + padding
  const updateCanvasSize = useCallback(() => {
    if (canvasRef.current && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      canvasRef.current.width = rect.width + 60;
      canvasRef.current.height = rect.height + 60;
    }
  }, []);

  useEffect(() => {
    updateCanvasSize();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [updateCanvasSize]);

  // Compute fly distance for each letter
  const updateLetterDistances = useCallback(() => {
    if (!trashSvgRef.current) return;
    const trashRect = trashSvgRef.current.getBoundingClientRect();
    const trashMouthX = trashRect.left + trashRect.width / 2;

    letterRefs.current.forEach((span) => {
      if (!span) return;
      const spanRect = span.getBoundingClientRect();
      const spanCenterX = spanRect.left + spanRect.width / 2;
      const flyDist = Math.max(12, spanCenterX - trashMouthX);
      span.style.setProperty("--fly-dist", `${flyDist}px`);
    });
  }, []);

  // Handle click with full animation sequence
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (onClick) {
      onClick(e);
    }

    if (isAnimating || disabled) return;

    if (confirmMessage && !window.confirm(confirmMessage)) {
      return;
    }

    setIsAnimating(true);
    updateCanvasSize();
    updateLetterDistances();

    // Step 1: Open Lid & Tilt Trash Can
    setIsActive(true);
    if (enableSound) globalSound.playLidOpen();
    emitParticles(10);

    const totalLetters = characters.length;
    const flyDuration = 750; // ms
    const stagger = 110; // ms per letter
    const maxFillHeight = 13.5;

    // Step 2: Fly letters sequentially into trash mouth
    characters.forEach((_, index) => {
      setTimeout(() => {
        setFlyingIndices((prev) => [...prev, index]);
        if (enableSound) globalSound.playLetterFly(index);

        // Impact & Fill Effect when letter enters the mouth
        setTimeout(() => {
          const fillProgress = (index + 1) / totalLetters;
          const currentHeight = fillProgress * maxFillHeight;
          const currentY = 20.8 - currentHeight;

          setFillHeight(Number(currentHeight.toFixed(1)));
          setFillY(Number(currentY.toFixed(1)));
          setFillTopD(
            `M 6.5 ${currentY.toFixed(1)} Q 12 ${(currentY - 1.2).toFixed(1)} 17.5 ${currentY.toFixed(1)}`
          );

          setIsImpact(true);
          setTimeout(() => setIsImpact(false), 140);
          emitParticles(6);
        }, flyDuration * 0.6);
      }, index * stagger);
    });

    const totalFlyTime = totalLetters * stagger + flyDuration;

    // Step 3: Close lid
    setTimeout(() => {
      setIsActive(false);
      if (enableSound) globalSound.playLidClose();

      // Step 4: Collapse button smoothly into circular trash icon
      setTimeout(() => {
        setIsCollapsed(true);

        // Step 5: Trigger onDelete action
        setTimeout(async () => {
          try {
            if (onDelete) {
              await onDelete();
            }
          } finally {
            // In case the button stays mounted, reset state after a delay
            setTimeout(() => {
              setIsAnimating(false);
              setIsCollapsed(false);
              setFlyingIndices([]);
              setFillHeight(0);
              setFillY(21);
              setFillTopD("M 6 21 Q 12 21 18 21");
            }, 1200);
          }
        }, 350);
      }, 150);
    }, totalFlyTime + 80);
  };

  // SVG size helper
  const svgSize = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-7 h-7" : "w-5 h-5";

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      disabled={disabled || isAnimating}
      className={`animated-delete-btn size-${size} variant-${variant} ${
        isActive ? "is-active" : ""
      } ${isCollapsed ? "is-collapsed" : ""} ${className}`}
      {...rest}
    >
      {/* Particle Canvas positioned absolutely over the button */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute -inset-6 z-30"
        style={{ width: "calc(100% + 48px)", height: "calc(100% + 48px)" }}
      />

      {/* Trash Can SVG */}
      <div className="flex items-center justify-center shrink-0 z-10">
        <svg
          ref={trashSvgRef}
          className={`adb-trash-svg ${svgSize} transition-transform ${isImpact ? "impact" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <defs>
            <clipPath id={clipId}>
              <path d="M18 7.2l-0.9 12.2A1.5 1.5 0 0115.6 20.8H8.4a1.5 1.5 0 01-1.5-1.4L6 7.2h12z" />
            </clipPath>
            <linearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
              <stop
                offset="0%"
                stopColor={variant === "red" ? "#f87171" : "#c084fc"}
              />
              <stop
                offset="100%"
                stopColor={variant === "red" ? "#fecaca" : "#f3e8ff"}
              />
            </linearGradient>
          </defs>

          <g className="adb-trash-group">
            {/* Lid */}
            <path
              className="adb-trash-lid"
              d="M4 6h16 M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"
              stroke="white"
              strokeWidth="2.2"
              fill="none"
            />

            {/* Trash Fill Level */}
            <g clipPath={`url(#${clipId})`}>
              <rect
                className="adb-trash-fill-rect"
                x="4"
                y={fillY}
                width="16"
                height={fillHeight}
                fill={`url(#${gradId})`}
                opacity="0.95"
              />
              <path d={fillTopD} stroke="#ffffff" strokeWidth="1.2" opacity="0.9" fill="none" />
            </g>

            {/* Trash Body Outer Line */}
            <path
              className="adb-trash-body"
              d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
              stroke="white"
              strokeWidth="2.2"
              fill="none"
            />

            {/* Inner vertical stripes */}
            <path
              className="adb-trash-body opacity-60"
              d="M10 10v7 M12 10v7 M14 10v7"
              stroke="white"
              strokeWidth="1.6"
              fill="none"
            />
          </g>
        </svg>
      </div>

      {/* Letter Text Container */}
      <span className="adb-text-wrapper z-10">
        {characters.map((char, index) => {
          const isFlying = flyingIndices.includes(index);
          return (
            <span
              key={index}
              ref={(el) => {
                letterRefs.current[index] = el;
              }}
              className={`adb-letter-span ${isFlying ? "flying" : ""}`}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </span>
    </button>
  );
};

export default AnimatedDeleteButton;
