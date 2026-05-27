import { Sparkles, Sun, Moon, Palette, ChevronDown } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import type { Theme } from "@/components/theme-provider";
import { useState, useRef, useEffect } from "react";

type AuthShellProps = {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  showTimeoutWarning?: boolean;
};

export function AuthShell({
  children,
  eyebrow,
  title,
  description,
  showTimeoutWarning,
}: AuthShellProps) {
  const { theme, setTheme } = useTheme();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-soft)" }} />
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">JobReady AI</span>
        </a>
        <div className="flex items-center gap-3">
          <ThemeSwitcher theme={theme} setTheme={setTheme} />
          <a
            href="/"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            Về trang chủ
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
          {showTimeoutWarning && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-50 p-4 dark:bg-amber-900/20">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                <svg
                  className="h-4 w-4"
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
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Phiên đăng nhập của bạn đã hết hạn do không hoạt động trong 15 phút. Vui lòng đăng
                nhập lại để tiếp tục.
              </p>
            </div>
          )}
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-8 -z-10 rounded-3xl opacity-50 blur-3xl"
            style={{ background: "var(--gradient-hero)" }}
          />
          {children}
        </div>
      </section>
    </main>
  );
}

function ThemeSwitcher({ theme, setTheme }: { theme: Theme; setTheme: (t: Theme) => void }) {
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
        className="flex items-center gap-1.5 rounded-full border border-border bg-card/85 px-3 py-1.5 text-xs font-semibold text-foreground transition-all duration-300 hover:bg-secondary cursor-pointer shadow-[var(--shadow-soft)]"
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
            Giao diện hồng
          </button>
        </div>
      )}
    </div>
  );
}
