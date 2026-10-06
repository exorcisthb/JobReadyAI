import { useEffect, useState, useRef } from "react";
import { ArrowRight, Sparkles, Settings, ChevronDown, Sun, Moon, Palette, Globe, Check } from "lucide-react";
import GooeyNav from "@/components/gooey-nav";
import { BrandLogo } from "@/components/BrandLogo";
import { useTheme } from "@/components/theme-provider";
import i18n, { setGuestLanguage } from "@/i18n";
import { useTranslation } from "react-i18next";

interface SharedHeaderProps {
  /** Highlight a specific nav item as active. Defaults to "" (none). */
  activeNav?: string;
}

export function SharedHeader({ activeNav = "" }: SharedHeaderProps) {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<"vi" | "en">(
    i18n.language?.startsWith("en") ? "en" : "vi"
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-border/80 bg-background/85 shadow-[var(--shadow-soft)] backdrop-blur-lg py-1"
          : "border-border/0 bg-background/70 backdrop-blur-md py-3"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo with sparkles animation & role dashboard navigation */}
        <BrandLogo />

        {/* Navigation */}
        <div className="hidden md:flex">
          <GooeyNav
            items={[
              { label: t("landing.nav.home"), href: "/" },
              { label: t("landing.nav.about"), href: "/#about" },
              { label: t("landing.nav.features"), href: "/#features" },
              { label: t("landing.nav.how"), href: "/#how" },
              { label: t("landing.nav.privacy"), href: "/chinh-sach" },
            ]}
            initialActiveIndex={
              activeNav === "chinh-sach" ? 4 : activeNav === "about" ? 1 : activeNav === "features" ? 2 : activeNav === "how" ? 3 : 0
            }
            particleCount={15}
            particleDistances={[90, 10]}
            particleR={100}
            colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            animationTime={600}
            timeVariance={300}
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Settings Dropdown */}
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
                        onClick={() => { setTheme(id); setDropdownOpen(false); }}
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

          <a
            href="/authentication/login"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
          >
            {t("landing.nav.login")}
          </a>
          <a
            href="/authentication/register"
            className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-300 hover:opacity-90 hover:scale-105 premium-shimmer-btn"
            style={{ background: "var(--gradient-hero)" }}
          >
            {t("landing.nav.createCv")} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
