import { useState, useEffect, useCallback } from "react";

export type OnboardingStep =
  | "post_login"
  | "cv_page"
  | "cv_ready"
  | "persona_select";

export function useOnboarding(userId: string) {
  const keyDone = `onboarding_done_${userId}`;
  const keyStep = `onboarding_step_${userId}`;

  const [currentStep, setCurrentStep] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const done = localStorage.getItem(keyDone);
    if (done === "true") return 4;
    const saved = localStorage.getItem(keyStep);
    return saved ? parseInt(saved, 10) : 0;
  });

  const [hasCVs, setHasCVs] = useState(false);

  const isCompleted = currentStep >= 4;
  const isDone = typeof window !== "undefined" && localStorage.getItem(keyDone) === "true";

  const advanceTour = useCallback(() => {
    setCurrentStep((prev) => {
      const next = prev + 1;
      if (next >= 4) {
        localStorage.setItem(keyDone, "true");
        localStorage.setItem(keyStep, "4");
        return 4;
      }
      localStorage.setItem(keyStep, String(next));
      return next;
    });
  }, [keyDone, keyStep]);

  const skipTour = useCallback(() => {
    localStorage.setItem(keyDone, "true");
    localStorage.setItem(keyStep, "4");
    setCurrentStep(4);
  }, [keyDone, keyStep]);

  const markStepReady = useCallback(
    (step: OnboardingStep) => {
      const stepMap: Record<OnboardingStep, number> = {
        post_login: 0,
        cv_page: 1,
        cv_ready: 2,
        persona_select: 3,
      };
      const target = stepMap[step];
      setCurrentStep((prev) => {
        if (target > prev) {
          localStorage.setItem(keyStep, String(target));
          return target;
        }
        return prev;
      });
    },
    [keyStep]
  );

  const getActiveStepType = (): OnboardingStep | null => {
    if (isDone || isCompleted) return null;
    switch (currentStep) {
      case 0: return "post_login";
      case 1: return "cv_page";
      case 2: return hasCVs ? "cv_ready" : null;
      case 3: return "persona_select";
      default: return null;
    }
  };

  const activeStepType = getActiveStepType();
  const isTourActive = !isDone && !isCompleted && activeStepType !== null;

  return {
    isFirstLogin: !isDone,
    currentStep,
    isTourActive,
    activeStepType,
    advanceTour,
    skipTour,
    markStepReady,
    hasCVs,
    setHasCVs,
  };
}
