import { useState, useEffect, useCallback } from "react";

export type OnboardingStep =
  | "post_login"
  | "cv_page"
  | "cv_ready"
  | "persona_select";

const STORAGE_KEY_DONE = "onboarding_done_v1";
const STORAGE_KEY_STEP = "onboarding_step";

interface UseOnboardingReturn {
  isFirstLogin: boolean;
  currentStep: number;
  isTourActive: boolean;
  activeStepType: OnboardingStep | null;
  advanceTour: () => void;
  skipTour: () => void;
  markStepReady: (step: OnboardingStep) => void;
  hasCVs: boolean;
  setHasCVs: (value: boolean) => void;
}

export function useOnboarding(userId: string): UseOnboardingReturn {
  const storageKeyDone = `${STORAGE_KEY_DONE}_${userId}`;
  const storageKeyStep = `${STORAGE_KEY_STEP}_${userId}`;

  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasCVs, setHasCVs] = useState(false);

  // Check if this is first login on mount
  useEffect(() => {
    const done = localStorage.getItem(storageKeyDone);
    if (done === null) {
      setIsFirstLogin(true);
      setCurrentStep(0);
    } else {
      setIsFirstLogin(false);
      const savedStep = localStorage.getItem(storageKeyStep);
      setCurrentStep(savedStep ? parseInt(savedStep, 10) : 0);
      setIsCompleted(done === "true");
    }
  }, [storageKeyDone, storageKeyStep]);

  const advanceTour = useCallback(() => {
    const nextStep = currentStep + 1;
    if (nextStep >= 4) {
      // Tour completed
      localStorage.setItem(storageKeyDone, "true");
      setIsCompleted(true);
      setCurrentStep(4);
      localStorage.setItem(storageKeyStep, "4");
    } else {
      setCurrentStep(nextStep);
      localStorage.setItem(storageKeyStep, String(nextStep));
    }
  }, [currentStep, storageKeyDone, storageKeyStep]);

  const skipTour = useCallback(() => {
    localStorage.setItem(storageKeyDone, "true");
    setIsCompleted(true);
    setCurrentStep(4);
    localStorage.setItem(storageKeyStep, "4");
  }, [storageKeyDone, storageKeyStep]);

  const markStepReady = useCallback(
    (step: OnboardingStep) => {
      const stepMap: Record<OnboardingStep, number> = {
        post_login: 0,
        cv_page: 1,
        cv_ready: 2,
        persona_select: 3,
      };
      const targetStep = stepMap[step];
      if (targetStep > currentStep) {
        setCurrentStep(targetStep);
        localStorage.setItem(storageKeyStep, String(targetStep));
      }
    },
    [currentStep, storageKeyStep]
  );

  // Determine active step type based on current step and conditions
  const getActiveStepType = useCallback((): OnboardingStep | null => {
    if (isCompleted || !isFirstLogin) return null;

    switch (currentStep) {
      case 0:
        return "post_login";
      case 1:
        return "cv_page";
      case 2:
        // Step 2 (cv_ready) only active if has CVs
        return hasCVs ? "cv_ready" : null;
      case 3:
        return "persona_select";
      default:
        return null;
    }
  }, [currentStep, isCompleted, isFirstLogin, hasCVs]);

  const activeStepType = getActiveStepType();
  const isTourActive =
    isFirstLogin && !isCompleted && activeStepType !== null;

  return {
    isFirstLogin,
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
