import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type DemoUser = {
  id?: string;
  name: string;
  email: string;
  image?: string;
  provider: "phone" | "google" | "facebook";
  profileCompleted?: boolean;
  role?: string;
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
};

const storageKey = "jobready_demo_session";
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return;

    try {
      setUser(JSON.parse(stored) as DemoUser);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login(nextUser) {
        setUser(nextUser);
        window.localStorage.setItem(storageKey, JSON.stringify(nextUser));
      },
      logout() {
        setUser(null);
        window.localStorage.removeItem(storageKey);
      },
    }),
    [user],
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
