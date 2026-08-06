import { Sparkles, Sun, Moon, Palette, ChevronDown, Settings, Globe, Check } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import type { Theme } from "@/components/theme-provider";
import { useState, useRef, useEffect } from "react";
import logoJr from "@/assets/logo.png";
import i18n, { setGuestLanguage } from "@/i18n";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Animated background with floating particles */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{ background: "var(--gradient-soft)" }}
      >
        {/* Floating circles */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-accent-mint/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-primary/15 rounded-full blur-2xl animate-float-slow" />

        {/* Additional sparkle particles */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-accent-mint/30 rounded-full blur-xl animate-pulse-slow" />
        <div
          className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-primary/25 rounded-full blur-xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Header - always on top so theme/settings switcher is accessible */}
      <header className="relative z-50 mx-auto flex h-16 max-w-7xl items-center justify-between px-6 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <a href="/" className="flex items-center gap-2 group logo-sparkle-link">
          <div className="logo-sparkle-wrapper">
            <div className="logo-glow-ring" />
            <span className="logo-spark logo-spark-1" />
            <span className="logo-spark logo-spark-2" />
            <span className="logo-spark logo-spark-3" />
            <span className="logo-spark logo-spark-4" />
            <span className="logo-spark logo-spark-5" />
            <span className="logo-spark logo-spark-6" />
            
            <img
              src={logoJr}
              alt="JobReady AI Logo"
              className="logo-img"
            />
          </div>
          <span className="text-lg font-bold tracking-tight logo-brand-text">
            JobReady AI
          </span>
        </a>
        <div className="flex items-center gap-3">
          <SettingsSwitcher theme={theme} setTheme={setTheme} />
          <a
            href="/"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:scale-105 hover:shadow-lg hover:border-primary/50"
          >
            {t("auth.backToHome")}
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr] relative z-10">
        <div className="space-y-6">
          <p
            className="text-sm font-bold uppercase tracking-widest animate-fade-in-up"
            style={{
              background: "linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(16, 185, 129) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 10px rgba(99, 102, 241, 0.3))",
            }}
          >
            {eyebrow}
          </p>
          <h1
            className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl animate-fade-in-up animation-delay-100 text-foreground"
            style={{
              textShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
            }}
          >
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-violet-300/90 animate-fade-in-up animation-delay-200">
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
                {t("auth.sessionExpiredDesc")}
              </p>
            </div>
          )}
        </div>

        <div className="relative animate-fade-in-up animation-delay-300">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 rounded-3xl opacity-60 blur-3xl animate-pulse-slow"
            style={{ background: "var(--gradient-hero)" }}
          />
          <div
            aria-hidden
            className="absolute inset-4 -z-10 rounded-3xl opacity-40 blur-2xl animate-pulse-slow"
            style={{
              background:
                "linear-gradient(135deg, rgba(99, 102, 241, 0.6) 0%, rgba(16, 185, 129, 0.6) 100%)",
              animationDelay: "1s",
            }}
          />
          {children}
        </div>
      </section>
    </main>
  );
}

function SettingsSwitcher({ theme, setTheme }: { theme: Theme; setTheme: (t: Theme) => void }) {
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<"vi" | "en">(
    i18n.language?.startsWith("en") ? "en" : "vi"
  );
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

  useEffect(() => {
    const onLangChange = (lng: string) => {
      setCurrentLang(lng.startsWith("en") ? "en" : "vi");
    };
    i18n.on("languageChanged", onLangChange);
    return () => i18n.off("languageChanged", onLangChange);
  }, []);

  const handleLangChange = async (lang: "vi" | "en") => {
    if (lang === currentLang) return;
    await setGuestLanguage(lang);
    setCurrentLang(lang);
    setDropdownOpen(false);
  };

  const themeOptions = [
    { id: "light" as const, label: t("header.light") || "Giao diện sáng", icon: <Sun className="h-4 w-4 text-amber-500" /> },
    { id: "dark" as const, label: t("header.dark") || "Giao diện tối", icon: <Moon className="h-4 w-4 text-blue-400" /> },
    { id: "rose" as const, label: t("header.rose") || "Giao diện hồng", icon: <Palette className="h-4 w-4 text-rose-500" /> },
  ];

  const langOptions = [
    { id: "vi" as const, label: t("language.vi") || "Tiếng Việt", flag: "VN" },
    { id: "en" as const, label: t("language.en") || "English", flag: "US" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="group flex items-center gap-1.5 rounded-full border border-border bg-card/85 px-3 py-1.5 text-xs font-semibold text-foreground transition-all duration-300 hover:bg-secondary cursor-pointer shadow-[var(--shadow-soft)]"
        title={t("settings.title") || "Cài đặt"}
      >
        <Settings className="h-3.5 w-3.5 text-primary transition-transform duration-500 group-hover:rotate-90" />
        <span className="hidden sm:inline">{t("settings.title") || "Cài đặt"}</span>
        <ChevronDown
          className={`h-3 w-3 text-muted-foreground transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-border bg-card/95 shadow-[var(--shadow-elegant)] backdrop-blur-xl animate-slide-in-up z-50 overflow-hidden">
          {/* Section: Giao diện */}
          <div className="px-3 pt-3 pb-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-1.5">
              <Palette className="h-3.5 w-3.5 text-purple-500" />
              {t("settings.display") || "Giao diện"}
            </p>
            <div className="space-y-0.5">
              {themeOptions.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setTheme(id);
                    setDropdownOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                    theme === id
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {icon}
                  <span className="flex-1 text-left">{label}</span>
                  {theme === id && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-3 my-2 h-px bg-border" />

          {/* Section: Ngôn ngữ */}
          <div className="px-3 pb-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-1.5">
              <Globe className="h-3.5 w-3.5 text-blue-500" />
              {t("settings.language") || "Ngôn ngữ"}
            </p>
            <div className="space-y-0.5">
              {langOptions.map(({ id, label, flag }) => (
                <button
                  key={id}
                  onClick={() => void handleLangChange(id)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                    currentLang === id
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${
                    id === "vi"
                      ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                  }`}>
                    {flag}
                  </span>
                  <span className="flex-1 text-left">{label}</span>
                  {currentLang === id && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
