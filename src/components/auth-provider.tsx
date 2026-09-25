import { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from "react";
import { loadUserLanguage } from "@/i18n";
import { useUser, useClerk, useAuth as useClerkAuth } from "@clerk/clerk-react";

export type DemoUser = {
  id?: string;
  name: string;
  email: string;
  image?: string;
  provider: "phone" | "google" | "facebook" | "clerk" | "email";
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

// A login must end when the browser session ends.  Unlike localStorage,
// sessionStorage is cleared when the browser is closed, so pasting a saved
// private URL into a new browser session cannot restore an account.
const storageKey = "jobready_session";
const legacyStorageKey = "jobready_demo_session";
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [isActiveSession, setIsActiveSession] = useState(false);
  const syncedClerkIdRef = useRef<string | null>(null);

  // Clerk integration hooks
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { signOut: clerkSignOut } = useClerk();
  const { getToken } = useClerkAuth();

  // 1. Tự động đồng bộ khi Clerk đăng nhập thành công
  useEffect(() => {
    if (!isClerkLoaded) return;

    if (isSignedIn && clerkUser) {
      if (syncedClerkIdRef.current === clerkUser.id && user) {
        return; // Đã đồng bộ rồi
      }

      const email = clerkUser.primaryEmailAddress?.emailAddress || "";
      const name = clerkUser.fullName || clerkUser.firstName || (email ? email.split("@")[0] : "User");
      const image = clerkUser.imageUrl;

      getToken()
        .then((token) =>
          fetch("/api/auth/clerk-sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ email, name, image }),
          })
        )
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            syncedClerkIdRef.current = clerkUser.id;
            setUser(data.user);
            setIsActiveSession(true);
            window.sessionStorage.setItem(storageKey, JSON.stringify(data.user));
            if (data.user.id) {
              loadUserLanguage(data.user.id).catch(console.error);
            }
          }
        })
        .catch((err) => console.error("Lỗi đồng bộ Clerk:", err));
    } else if (!isSignedIn && isClerkLoaded) {
      syncedClerkIdRef.current = null;
    }
  }, [isClerkLoaded, isSignedIn, clerkUser, user]);

  useEffect(() => {
    const stored = window.sessionStorage.getItem(storageKey);
    // Remove the old persistent session left by earlier versions.  It must
    // never be used to silently sign a user back in after closing the browser.
    window.localStorage.removeItem(legacyStorageKey);
    if (!stored) return;

    try {
      const userData = JSON.parse(stored) as DemoUser;
      setUser(userData);
      setIsActiveSession(true);
      
      // Load user's language preference from database
      if (userData.id) {
        loadUserLanguage(userData.id).catch(console.error);
      }
      
      // NOT setting isActiveSession — restore from localStorage is passive,
      // only explicit login() counts as active session
    } catch {
      window.sessionStorage.removeItem(storageKey);
    }
  }, []);

  const updateUser = useCallback((updates: Partial<DemoUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      window.sessionStorage.setItem(storageKey, JSON.stringify(updated));
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
        window.sessionStorage.setItem(storageKey, JSON.stringify(nextUser));
        
        // Load user's language preference from database
        if (nextUser.id) {
          loadUserLanguage(nextUser.id).catch(console.error);
        }
      },
      logout() {
        if (isSignedIn) {
          clerkSignOut().catch(() => {});
        }
        syncedClerkIdRef.current = null;
        setUser(null);
        setIsActiveSession(false);
        window.sessionStorage.removeItem(storageKey);
        window.localStorage.removeItem(legacyStorageKey);
        const TEMP_PREFIXES = ["jobready_support", "jobready_cv_advisor_session_new"];
        TEMP_PREFIXES.forEach((prefix) => {
          Object.keys(localStorage)
            .filter((k) => k.startsWith(prefix))
            .forEach((k) => localStorage.removeItem(k));
          sessionStorage.removeItem(`${prefix}_guest_messages`);
        });
      },
      updateUser,
    }),
    [user, isActiveSession, updateUser, isSignedIn, clerkSignOut],
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
