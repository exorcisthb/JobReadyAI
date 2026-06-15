"use client";

import * as React from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type AsProp = keyof React.JSX.IntrinsicElements;

interface TimelineContentProps {
  as?: AsProp;
  animationNum: number;
  timelineRef: React.RefObject<Element | null>;
  customVariants?: Variants;
  className?: string;
  children: React.ReactNode;
}

export const TimelineContent = React.forwardRef<HTMLElement, TimelineContentProps>(
  (
    { as = "div", animationNum, timelineRef, customVariants, className, children, ...props },
    ref,
  ) => {
    const localRef = React.useRef<HTMLElement | null>(null);
    const inView = useInView(localRef, { once: true, margin: "-15% 0px" });

    React.useImperativeHandle(ref, () => localRef.current as HTMLElement);

    const defaultVariants: Variants = {
      hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
      visible: (i: number) => ({
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
          delay: i * 0.25,
          duration: 0.6,
          ease: "easeOut",
        },
      }),
    };

    const MotionTag = motion[as as "div"] ?? motion.div;

    return (
      <MotionTag
        ref={localRef as unknown as React.Ref<HTMLDivElement>}
        custom={animationNum}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={customVariants ?? defaultVariants}
        className={cn(className)}
        {...(props as Record<string, unknown>)}
      >
        {children}
      </MotionTag>
    );
  },
);
TimelineContent.displayName = "TimelineContent";

export default TimelineContent;
