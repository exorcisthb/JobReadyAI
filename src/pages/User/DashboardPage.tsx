import { FileText, LogOut, Sparkles, Sun, Moon, Palette, ChevronDown } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useTheme } from "@/components/theme-provider";
import { useState, useEffect, useRef } from "react";
import { useOnboarding } from "@/hooks/useOnboarding";
import { OnboardingTour } from "@/components/OnboardingTour";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Onboarding tour
  const { isTourActive, activeStepType, advanceTour, skipTour, currentStep } = useOnboarding(
    user?.id || "anonymous"
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    window.location.assign("/");
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Onboarding Tour */}
      {isTourActive && activeStepType === "post_login" && currentStep === 0 && (
        <OnboardingTour
          userId={user?.id || "anonymous"}
          currentStep="post_login"
          onAdvance={advanceTour}
          onSkip={skipTour}
        />
      )}

      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground"
              style={{ background: "var(--gradient-hero)" }}
            >
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">JobReadyAI</span>
          </a>
          <div className="flex items-center gap-4">
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
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Dashboard</p>
        <h1 className="mt-3 flex items-center gap-2 text-4xl font-bold tracking-tight">
          Xin chào, {user?.name ?? "JobReady user"}
          {user?.role === "admin" && (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
              Admin
            </span>
          )}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Đây là dashboard React thuần cho luồng demo. Từ đây bạn có thể phát triển tiếp các module
          quản lý CV, template và phân tích JD mà không phụ thuộc vào file `page.tsx` của Next.js.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {["CV của tôi", "Tối ưu theo JD", "Mẫu CV"].map((title) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6">
              <FileText className="h-6 w-6 text-primary" />
              <h2 className="mt-4 text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Khu vực sẵn sàng để nối dữ liệu thật hoặc mở rộng tính năng.
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
