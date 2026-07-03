import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { loadUserLanguage } from "@/i18n";

export type DemoUser = {
  id?: string;
  name: string;
  email: string;
  image?: string;
  provider: "phone" | "google" | "facebook";
  profileCompleted?: boolean;
  role?: string;
  subscriptionPlan?: string;
  isTestUser?: boolean;
  profile?: {
    phone?: string;
    jobTitle?: string;
    industry?: string;
    experienceLevel?: string;
    location?: string;
    skills?: string;
    careerGoal?: string;
  };
};

type AuthContextValue = {
  user: DemoUser | null;
  login: (user: DemoUser) => void;
  logout: () => void;
  updateUser: (updates: Partial<DemoUser>) => void;
  isActiveSession: boolean;
};

const storageKey = "jobready_demo_session";
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [isActiveSession, setIsActiveSession] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return;

    try {
      const userData = JSON.parse(stored) as DemoUser;
      setUser(userData);
      
      // Load user's language preference from database
      if (userData.id) {
        loadUserLanguage(userData.id).catch(console.error);
      }
      
      // NOT setting isActiveSession — restore from localStorage is passive,
      // only explicit login() counts as active session
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  const updateUser = useCallback((updates: Partial<DemoUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      window.localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isActiveSession,
      login(nextUser) {
        setUser(nextUser);
        setIsActiveSession(true);
        window.localStorage.setItem(storageKey, JSON.stringify(nextUser));
        
        // Load user's language preference from database
        if (nextUser.id) {
          loadUserLanguage(nextUser.id).catch(console.error);
        }
      },
      logout() {
        setUser(null);
        setIsActiveSession(false);
        window.localStorage.removeItem(storageKey);
        // Chỉ xóa chat tạm thời khi logout, KHÔNG xóa chat của CV nháp
        // (draft chat được lưu theo userId_draftId và phải tồn tại cho đến khi ấn Lưu CV)
        const TEMP_PREFIXES = ["jobready_support", "jobready_cv_advisor_session_new"];
        TEMP_PREFIXES.forEach(prefix => {
          Object.keys(localStorage)
            .filter(k => k.startsWith(prefix))
            .forEach(k => localStorage.removeItem(k));
          sessionStorage.removeItem(`${prefix}_guest_messages`);
        });
      },
      updateUser,
    }),
    [user, isActiveSession, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}


