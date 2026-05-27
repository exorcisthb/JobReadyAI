import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./auth-provider";
import { Bell, X } from "lucide-react";

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const WARNING_BEFORE_LOGOUT = 60 * 1000; // Show warning 1 minute before logout

type IdleContextValue = {
  isWarningVisible: boolean;
  remainingSeconds: number;
  resetTimer: () => void;
};

const IdleContext = createContext<IdleContextValue | null>(null);

export function useIdleTimeout() {
  const context = useContext(IdleContext);
  if (!context) {
    throw new Error("useIdleTimeout must be used inside IdleTimeoutProvider");
  }
  return context;
}

interface IdleTimeoutProviderProps {
  children: React.ReactNode;
}

export function IdleTimeoutProvider({ children }: IdleTimeoutProviderProps) {
  const { user, logout } = useAuth();
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(60);
  const [showToast, setShowToast] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAllTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
  }, []);

  const startCountdown = useCallback(() => {
    setIsWarningVisible(true);
    setRemainingSeconds(60);

    // Show toast notification first (like Facebook)
    setShowToast(true);
    setToastVisible(true);

    // Auto-hide toast after 5 seconds
    toastTimeoutRef.current = setTimeout(() => {
      setToastVisible(false);
      setTimeout(() => setShowToast(false), 300);
    }, 5000);

    countdownRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleLogout = useCallback(() => {
    clearAllTimers();
    setShowToast(false);
    setIsWarningVisible(false);
    logout();
    window.location.assign("/authentication/login?reason=timeout");
  }, [clearAllTimers, logout]);

  const resetTimer = useCallback(() => {
    if (!user) return;

    lastActivityRef.current = Date.now();
    clearAllTimers();
    setShowToast(false);
    setIsWarningVisible(false);
    setRemainingSeconds(60);

    // Set warning timer (14 minutes)
    warningTimeoutRef.current = setTimeout(() => {
      startCountdown();
    }, INACTIVITY_TIMEOUT - WARNING_BEFORE_LOGOUT);

    // Set logout timer (15 minutes)
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, INACTIVITY_TIMEOUT);
  }, [user, clearAllTimers, startCountdown, handleLogout]);

  // Setup activity listeners
  useEffect(() => {
    if (!user) return;

    const activityEvents = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];

    const handleActivity = () => {
      // Only reset if warning is not visible
      if (!isWarningVisible) {
        const now = Date.now();
        // Throttle activity detection to avoid excessive resets
        if (now - lastActivityRef.current > 1000) {
          resetTimer();
        }
      }
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Initial timer setup
    resetTimer();

    return () => {
      clearAllTimers();
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [user, isWarningVisible, clearAllTimers, resetTimer]);

  // Handle logout when countdown reaches 0
  useEffect(() => {
    if (remainingSeconds === 0 && isWarningVisible) {
      handleLogout();
    }
  }, [remainingSeconds, isWarningVisible, handleLogout]);

  // Hide warning when user logs out
  useEffect(() => {
    if (!user) {
      clearAllTimers();
      setShowToast(false);
      setIsWarningVisible(false);
    }
  }, [user, clearAllTimers]);

  return (
    <IdleContext.Provider value={{ isWarningVisible, remainingSeconds, resetTimer }}>
      {children}

      {/* Toast Notification - Like Facebook */}
      {showToast && (
        <div
          className={`fixed bottom-4 right-4 z-[250] transition-all duration-300 ${
            toastVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-2xl max-w-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <Bell className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Hết phiên đăng nhập</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Phiên của bạn sẽ hết hạn sau{" "}
                <span className="font-bold text-primary">{remainingSeconds}</span> giây nếu không
                hoạt động.
              </p>
            </div>
            <button
              onClick={() => {
                setToastVisible(false);
                setTimeout(() => setShowToast(false), 300);
              }}
              className="shrink-0 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Idle Warning Modal */}
      {isWarningVisible && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slide-in-up">
            <div className="flex items-center justify-center p-8">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 mb-4">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-2">Hết phiên đăng nhập</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Bạn đã không hoạt động trong một thời gian dài.
                </p>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="text-3xl font-extrabold text-primary">{remainingSeconds}</span>
                  <span className="text-sm text-muted-foreground">giây</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Bạn sẽ được đăng xuất tự động sau khi hết thời gian.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    Đăng xuất ngay
                  </button>
                  <button
                    onClick={resetTimer}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 premium-shimmer-btn"
                    style={{ background: "var(--gradient-hero)" }}
                  >
                    Ở lại đăng nhập
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </IdleContext.Provider>
  );
}
