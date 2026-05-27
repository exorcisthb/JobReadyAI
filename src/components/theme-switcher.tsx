import { useEffect, useState, useRef } from "react";
import { Sun, Moon, Palette, ChevronDown } from "lucide-react";

type Theme = "light" | "dark" | "rose";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("homepage-theme");
    return (saved as Theme) || "light";
  });

  useEffect(() => {
    document.documentElement.classList.remove("dark", "rose");
    if (theme !== "light") {
      document.documentElement.classList.add(theme);
    }
    localStorage.setItem("homepage-theme", theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);

  return { theme, setTheme };
}

export function ThemeSwitcher({ theme, setTheme }: { theme: Theme; setTheme: (t: Theme) => void }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-1.5 rounded-full border border-border bg-card/85 px-3 py-1.5 text-xs font-semibold text-foreground transition-all duration-300 hover:bg-secondary cursor-pointer shadow-[var(--shadow-soft)] hover:scale-[1.02]"
        title="Chọn giao diện"
      >
        {theme === "light" && <Sun className="h-3.5 w-3.5 text-amber-500" />}
        {theme === "dark" && <Moon className="h-3.5 w-3.5 text-blue-400" />}
        {theme === "rose" && <Palette className="h-3.5 w-3.5 text-rose-500" />}
        <span className="hidden sm:inline capitalize">
          {theme === "light" ? "Sáng" : theme === "dark" ? "Tối" : "Hồng"}
        </span>
        <ChevronDown
          className={`h-3 w-3 text-muted-foreground transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl border border-border bg-card/95 p-1.5 shadow-[var(--shadow-elegant)] backdrop-blur-xl animate-slide-in-up z-50">
          <button
            onClick={() => {
              setTheme("light");
              setDropdownOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
              theme === "light"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Sun className="h-4 w-4 text-amber-500" />
            Giao diện sáng
          </button>
          <button
            onClick={() => {
              setTheme("dark");
              setDropdownOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
              theme === "dark"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Moon className="h-4 w-4 text-blue-400" />
            Giao diện tối
          </button>
          <button
            onClick={() => {
              setTheme("rose");
              setDropdownOpen(false);
            }}
            className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
              theme === "rose"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Palette className="h-4 w-4 text-rose-500" />
            Hồng nhung
          </button>
        </div>
      )}
    </div>
  );
}
