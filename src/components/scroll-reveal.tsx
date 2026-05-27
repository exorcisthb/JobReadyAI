import { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "fade" | "scale";
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds
  distance?: number; // in pixels
  threshold?: number;
}

export function ScrollReveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 800,
  distance = 30,
  threshold = 0.05,
}: ScrollRevealProps) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(currentRef);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px", // Trigger slightly before reaching the viewport line
      },
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  const getDirectionStyles = () => {
    if (isIntersecting) {
      return {
        opacity: 1,
        transform: "translate(0, 0) scale(1)",
      };
    }

    switch (direction) {
      case "up":
        return {
          opacity: 0,
          transform: `translateY(${distance}px)`,
        };
      case "down":
        return {
          opacity: 0,
          transform: `translateY(-${distance}px)`,
        };
      case "left":
        return {
          opacity: 0,
          transform: `translateX(${distance}px)`,
        };
      case "right":
        return {
          opacity: 0,
          transform: `translateX(-${distance}px)`,
        };
      case "scale":
        return {
          opacity: 0,
          transform: "scale(0.95)",
        };
      case "fade":
      default:
        return {
          opacity: 0,
        };
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...getDirectionStyles(),
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)", // Ultra-smooth ease-out
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
