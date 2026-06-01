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
      {/* Animated background with floating particles - MORE VISIBLE */}
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-soft)" }}>
        {/* Floating circles - increased opacity and size */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-accent-mint/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-primary/15 rounded-full blur-2xl animate-float-slow" />
        
        {/* Additional sparkle particles */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-accent-mint/30 rounded-full blur-xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-primary/25 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>
      
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 relative z-10">
        <a href="/" className="flex items-center gap-2 group">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-lg"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Sparkles className="h-5 w-5 group-hover:animate-spin" />
          </div>
          <span className="text-lg font-bold tracking-tight group-hover:text-primary transition-colors">JobReady AI</span>
        </a>
        <div className="flex items-center gap-3">
          <ThemeSwitcher theme={theme} setTheme={setTheme} />
          <a
            href="/"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:scale-105 hover:shadow-lg hover:border-primary/50"
          >
            Về trang chủ
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr] relative z-10">
        <div className="space-y-6">
          <p 
            className="text-sm font-bold uppercase tracking-widest animate-fade-in-up"
            style={{
              background: 'linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(16, 185, 129) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))'
            }}
          >
            {eyebrow}
          </p>
          <h1 
            className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl animate-fade-in-up animation-delay-100"
            style={{
              color: 'rgb(17, 24, 39)',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}
          >
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-700 dark:text-gray-300 animate-fade-in-up animation-delay-200">
            {description}
          </p>
          {showTimeoutWarning && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-50 p-4 dark:bg-amber-900/20 animate-shake">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 animate-pulse">
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

        <div className="relative animate-fade-in-up animation-delay-300">
          {/* Pulsing glow behind form - MORE VISIBLE */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 rounded-3xl opacity-60 blur-3xl animate-pulse-slow"
            style={{ background: "var(--gradient-hero)" }}
          />
          <div
            aria-hidden
            className="absolute inset-4 -z-10 rounded-3xl opacity-40 blur-2xl animate-pulse-slow"
            style={{ 
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.6) 0%, rgba(16, 185, 129, 0.6) 100%)",
              animationDelay: '1s'
            }}
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
