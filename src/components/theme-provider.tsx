import { createContext, useContext, useEffect, useState, useLayoutEffect } from "react";

export type Theme = "light" | "dark" | "rose";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = "jobready-theme";

function getThemeFromStorage(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark" || saved === "rose") {
    return saved;
  }
  return "light";
}

function applyTheme(theme: Theme) {
  // Remove all theme classes
  document.documentElement.classList.remove("dark", "rose");

  // Add current theme class if not light
  if (theme !== "light") {
    document.documentElement.classList.add(theme);
  }

  // Save to localStorage
  localStorage.setItem(THEME_KEY, theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getThemeFromStorage);

  // Apply theme on mount and whenever it changes
  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
