import { useEffect, useState, useRef, useCallback } from "react";
import heroCv from "@/assets/hero-cv.png";
import logoJr from "@/assets/logo.png";
import {
  ArrowRight,
  Check,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Target,
  Wand2,
  Zap,
} from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import GooeyNav from "@/components/gooey-nav";
import BorderGlow from "@/components/border-glow";
import ContactDock from "@/components/ContactDock";
import { useTheme } from "@/components/theme-provider";

import { Sun, Moon, Palette, ChevronDown, Settings, Globe } from "lucide-react";
import i18n, { setGuestLanguage } from "@/i18n";
import { useTranslation } from "react-i18next";

export function HomePage() {
  const { theme, setTheme } = useTheme();

  // Calculate initial nav index immediately from URL hash
  const getNavIndexFromHash = () => {
    const hash = window.location.hash;
    if (hash === '#about') return 1;
    if (hash === '#features') return 2;
    if (hash === '#how') return 3;
    return 0;
  };

  const [initialNavIndex, setInitialNavIndex] = useState(getNavIndexFromHash);

  // Handle scroll to anchor on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, []);

  // Update nav index and handle scroll when hash changes
  useEffect(() => {
    const updateNavIndex = () => {
      const hash = window.location.hash;
      let navIndex = 0;

      if (hash === '#about') navIndex = 1;
      else if (hash === '#features') navIndex = 2;
      else if (hash === '#how') navIndex = 3;
      else if (hash === '') navIndex = 0;

      setInitialNavIndex(navIndex);

      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
    };

    window.addEventListener('hashchange', updateNavIndex);

    return () => {
      window.removeEventListener('hashchange', updateNavIndex);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Header theme={theme} setTheme={setTheme} initialNavIndex={initialNavIndex} />
      <main>
        <Hero theme={theme} />
        <About theme={theme} />
        <Features theme={theme} />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

interface HeaderProps {
  theme: "light" | "dark" | "rose";
  setTheme: (t: "light" | "dark" | "rose") => void;
  initialNavIndex: number;
}

function Header({ theme, setTheme, initialNavIndex }: HeaderProps) {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<"vi" | "en">(
    i18n.language?.startsWith("en") ? "en" : "vi"
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
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
        <a href="/" className="flex items-center gap-2 group logo-sparkle-link">
          <div className="logo-sparkle-wrapper">
            <div className="logo-glow-ring" />
            <span className="logo-spark logo-spark-1" />
            <span className="logo-spark logo-spark-2" />
            <span className="logo-spark logo-spark-3" />
            <span className="logo-spark logo-spark-4" />
            <span className="logo-spark logo-spark-5" />
            <span className="logo-spark logo-spark-6" />
            <img src={logoJr} alt="JobReady AI Logo" className="logo-img" />
          </div>
          <span className="text-lg font-bold tracking-tight logo-brand-text">JobReady AI</span>
        </a>
        <div className="hidden md:flex">
          <GooeyNav
            items={[
              { label: t("landing.nav.home"), href: "/" },
              { label: t("landing.nav.about"), href: "/#about" },
              { label: t("landing.nav.features"), href: "/#features" },
              { label: t("landing.nav.how"), href: "/#how" },
              { label: t("landing.nav.privacy"), href: "/chinh-sach" },
            ]}
            particleCount={15}
            particleDistances={[90, 10]}
            particleR={100}
            colors={theme === "rose" ? [1, 2, 1, 2, 1, 2, 1, 2] : [1, 1, 1, 1, 1, 1, 1, 1]}
            animationTime={600}
            timeVariance={300}
            initialActiveIndex={initialNavIndex}
          />
        </div>
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

interface ThemeProp {
  theme: "light" | "dark" | "rose";
}

function Hero({ theme }: ThemeProp) {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-soft)" }} />

      <div
        aria-hidden
        className="absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full opacity-25 blur-[100px] animate-pulse-rotate-1"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div
        aria-hidden
        className="absolute -left-20 top-1/2 h-[400px] w-[400px] rounded-full opacity-20 blur-[80px] animate-pulse-rotate-2"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div
        aria-hidden
        className="absolute left-1/3 bottom-0 h-[300px] w-[300px] rounded-full opacity-15 blur-[60px] animate-pulse"
        style={{ background: "var(--accent-mint)" }}
      />

      <div className="hero-particles absolute inset-0 -z-5 overflow-hidden pointer-events-none">
        <div className="particle-dot particle-dot-1" />
        <div className="particle-dot particle-dot-2" />
        <div className="particle-dot particle-dot-3" />
        <div className="particle-dot particle-dot-4" />
        <div className="particle-dot particle-dot-5" />
        <div className="particle-dot particle-dot-6" />
        <div className="particle-dot particle-dot-7" />
        <div className="particle-dot particle-dot-8" />
      </div>

      <div
        aria-hidden
        className="hero-grid absolute inset-0 -z-5 opacity-[0.03] [background-image:linear-gradient(var(--foreground)_1px,transparent_1px),linear-gradient(90deg,var(--foreground)_1px,transparent_1px)] [background-size:60px_60px]"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-20 lg:grid-cols-2 relative z-10">
        <div>
          <ScrollReveal direction="up" delay={100} duration={600}>
            <div className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur transition-all duration-300 hover:border-primary/30">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              {t("landing.hero.badge")}
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200} duration={600}>
            <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              {t("landing.hero.titlePart1")} <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-hero)" }}
              >
                {t("landing.hero.titlePart2")}
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300} duration={600}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {t("landing.hero.description")}
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={400} duration={600}>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/authentication/register"
                className="group inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 premium-shimmer-btn"
                style={{ background: "var(--gradient-hero)" }}
              >
                {t("landing.hero.btnStart")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#how"
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-medium transition-all duration-300 hover:bg-secondary hover:-translate-y-0.5"
              >
                {t("landing.hero.btnHow")}
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={500} duration={600}>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>{t("landing.hero.trialFree")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>{t("landing.hero.noCredit")}</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal direction="left" delay={300} duration={800} className="relative">
          <div className="hero-float-card hero-float-card-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span className="text-xs font-medium">{t("landing.hero.atsScore")}</span>
            </div>
          </div>
          <div className="hero-float-card hero-float-card-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium">{t("landing.hero.aiOptimized")}</span>
            </div>
          </div>
          <div className="hero-float-card hero-float-card-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium">{t("landing.hero.readyTime")}</span>
            </div>
          </div>

          <div className="hero-cv-wrapper relative">
            <div
              aria-hidden
              className="absolute -inset-4 rounded-3xl opacity-50 blur-xl animate-pulse"
              style={{ background: "var(--gradient-hero)" }}
            />
            <img
              src={heroCv}
              alt="Mẫu CV được tạo bởi JobReadyAI"
              className="hero-cv-img relative h-auto w-full drop-shadow-2xl rounded-2xl"
              loading="eager"
            />
          </div>
        </ScrollReveal>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}

function About({ theme }: ThemeProp) {
  const { t } = useTranslation();

  return (
    <section
      id="about"
      className="py-24 border-b border-border bg-secondary/5 relative overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <ScrollReveal direction="right" duration={600}>
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {t("landing.about.badge")}
              </p>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {t("landing.about.heading")}
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t("landing.about.p1")}
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {t("landing.about.p2")}
              </p>

              <div className="grid grid-cols-3 gap-6 pt-4">
                <div className="text-center p-4 rounded-2xl bg-card border border-border">
                  <div className="text-3xl font-extrabold text-primary">99%</div>
                  <p className="mt-1 text-xs text-muted-foreground">{t("landing.about.statAts")}</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-card border border-border">
                  <div className="text-3xl font-extrabold text-primary">10K+</div>
                  <p className="mt-1 text-xs text-muted-foreground">{t("landing.about.statCv")}</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-card border border-border">
                  <div className="text-3xl font-extrabold text-primary">3x</div>
                  <p className="mt-1 text-xs text-muted-foreground">{t("landing.about.statInterview")}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" duration={600} className="relative">
            <div className="overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-elegant)] transition-shadow duration-300 hover:shadow-xl">
              <div className="space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">{t("landing.about.whyTitle")}</h3>
                <ul className="space-y-3.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>
                      <strong>{t("landing.about.why1")}</strong> {t("landing.about.why1Desc")}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>
                      <strong>{t("landing.about.why2")}</strong> {t("landing.about.why2Desc")}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>
                      <strong>{t("landing.about.why3")}</strong> {t("landing.about.why3Desc")}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>
                      <strong>{t("landing.about.why4")}</strong> {t("landing.about.why4Desc")}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function Features({ theme }: ThemeProp) {
  const { t } = useTranslation();

  const features = [
    {
      icon: Wand2,
      title: t("landing.features.f1Title"),
      desc: t("landing.features.f1Desc"),
    },
    {
      icon: ShieldCheck,
      title: t("landing.features.f2Title"),
      desc: t("landing.features.f2Desc"),
    },
    {
      icon: Target,
      title: t("landing.features.f3Title"),
      desc: t("landing.features.f3Desc"),
    },
    {
      icon: Zap,
      title: t("landing.features.f4Title"),
      desc: t("landing.features.f4Desc"),
    },
    {
      icon: MessageSquare,
      title: t("landing.features.f5Title"),
      desc: t("landing.features.f5Desc"),
    },
    {
      icon: Sparkles,
      title: t("landing.features.f6Title"),
      desc: t("landing.features.f6Desc"),
    },
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <ScrollReveal direction="up" duration={600}>
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {t("landing.features.badge")}
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              {t("landing.features.heading")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {t("landing.features.desc")}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <ScrollReveal
              key={feature.title}
              direction="up"
              delay={index * 80}
              duration={600}
              className="flex"
            >
              <BorderGlow
                className="w-full text-foreground transition-all duration-300 hover:-translate-y-1"
                backgroundColor="var(--card)"
                borderRadius={16}
                glowColor={theme === "rose" ? "350 70 75" : "220 100 45"}
                glowIntensity={1}
                fillOpacity={0.1}
                colors={
                  theme === "rose"
                    ? ["#f43f5e", "#fb7185", "#ffe4e6"]
                    : ["#1e3a8a", "#2563eb", "#06b6d4"]
                }
              >
                <div className="p-6 h-full flex flex-col justify-start">
                  <div
                    className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground"
                    style={{ background: "var(--gradient-hero)" }}
                  >
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              </BorderGlow>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      n: "01",
      title: t("landing.how.step1Title"),
      desc: t("landing.how.step1Desc"),
    },
    {
      n: "02",
      title: t("landing.how.step2Title"),
      desc: t("landing.how.step2Desc"),
    },
    {
      n: "03",
      title: t("landing.how.step3Title"),
      desc: t("landing.how.step3Desc"),
    },
  ];

  return (
    <section id="how" className="py-24 bg-secondary/10 border-y border-border">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal direction="up" duration={600}>
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {t("landing.how.badge")}
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              {t("landing.how.heading")}
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-3">
          {steps.map((step, index) => (
            <ScrollReveal key={step.n} direction="up" delay={index * 100} duration={600}>
              <div className="rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)] h-full">
                <div
                  className="text-5xl font-bold text-transparent bg-clip-text"
                  style={{ backgroundImage: "var(--gradient-hero)" }}
                >
                  {step.n}
                </div>
                <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const { t } = useTranslation();

  return (
    <section id="start" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-soft)" }} />

      <div className="mx-auto max-w-5xl px-6 relative z-10">
        <ScrollReveal direction="scale" duration={800}>
          <div
            className="relative overflow-hidden rounded-3xl p-12 text-center text-primary-foreground sm:p-16 shadow-[var(--shadow-elegant)]"
            style={{ background: "var(--gradient-hero)" }}
          >
            <div
              aria-hidden
              className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"
            />

            <h2 className="relative text-4xl font-bold tracking-tight sm:text-5xl">
              {t("landing.cta.heading")}
            </h2>
            <p className="relative mx-auto mt-4 max-w-2xl text-lg opacity-90">
              {t("landing.cta.desc")}
            </p>

            <div className="relative mt-8 flex justify-center">
              <a
                href="/authentication/register"
                className="inline-flex items-center gap-2 rounded-full bg-background px-8 py-4 font-semibold text-foreground shadow-lg transition-all duration-300 hover:scale-105 premium-shimmer-btn"
              >
                {t("landing.cta.btn")}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-md pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl text-primary-foreground"
                style={{ background: "var(--gradient-hero)" }}
              >
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">JobReady AI</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("landing.footer.desc")}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              {t("landing.footer.products")}
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-primary transition-colors duration-200">
                  {t("landing.features.badge")}
                </a>
              </li>
              <li>
                <a href="#how" className="hover:text-primary transition-colors duration-200">
                  {t("landing.how.badge")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              {t("landing.footer.about")}
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a href="#about" className="hover:text-primary transition-colors duration-200">
                  {t("landing.about.badge")}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-primary transition-colors duration-200">
                  {t("landing.footer.mission")}
                </a>
              </li>
              <li>
                <a href="/chinh-sach" className="hover:text-primary transition-colors duration-200">
                  {t("landing.footer.privacy")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              {t("landing.footer.connect")}
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <span className="text-foreground">Email:</span> jobreadya@gmail.com
              </li>
              <li>
                <span className="text-foreground">Hotline:</span> 1900 1234
              </li>
              <li>
                <span className="text-foreground">Địa chỉ:</span> {t("landing.footer.address")}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            {t("landing.footer.copyright")}
          </p>
          <ContactDock />
        </div>
      </div>
    </footer>
  );
}
