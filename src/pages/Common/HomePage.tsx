import { useEffect, useState, useRef, useCallback } from "react";
import heroCv from "@/assets/hero-cv.png";
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
import { useTheme } from "@/components/theme-provider";

import { Sun, Moon, Palette, ChevronDown } from "lucide-react";

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
      // Wait for page to fully render
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, []); // Run only on mount

  // Update nav index and handle scroll when hash changes
  useEffect(() => {
    const updateNavIndex = () => {
      const hash = window.location.hash;
      let navIndex = 0;
      
      // Map hash to nav index
      if (hash === '#about') navIndex = 1;
      else if (hash === '#features') navIndex = 2;
      else if (hash === '#how') navIndex = 3;
      else if (hash === '') navIndex = 0; // No hash means home
      
      setInitialNavIndex(navIndex);

      // Handle scroll to anchor
      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
    };

    // Listen for hash changes
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
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-border/80 bg-background/85 shadow-[var(--shadow-soft)] backdrop-blur-lg py-1"
          : "border-border/0 bg-background/70 backdrop-blur-md py-3"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2 group">
          <div
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground transition-transform duration-300 group-hover:scale-110"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">JobReady AI</span>
        </a>
        <div className="hidden md:flex">
          <GooeyNav
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Giới thiệu", href: "/#about" },
              { label: "Tính năng", href: "/#features" },
              { label: "Cách hoạt động", href: "/#how" },
              { label: "Chính sách bảo mật", href: "/chinh-sach" },
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
                  <Sun
                    className={`h-4 w-4 ${theme === "light" ? "text-amber-500" : "text-muted-foreground"}`}
                  />
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
                  <Moon
                    className={`h-4 w-4 ${theme === "dark" ? "text-blue-400" : "text-muted-foreground"}`}
                  />
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
                  <Palette
                    className={`h-4 w-4 ${theme === "rose" ? "text-rose-500" : "text-muted-foreground"}`}
                  />
                  Giao diện hồng
                </button>
              </div>
            )}
          </div>
          <a
            href="/authentication/login"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
          >
            Đăng nhập
          </a>
          <a
            href="/authentication/register"
            className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-300 hover:opacity-90 hover:scale-105 premium-shimmer-btn"
            style={{ background: "var(--gradient-hero)" }}
          >
            Tạo CV ngay <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

// Counter animation - optimized
function useCounter(end: number, duration: number = 1500, start: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, start]);

  return count;
}

// Animated counter - simplified
function AnimatedCounter({
  end,
  suffix = "",
  duration = 1500,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const count = useCounter(end, duration, inView);

  return (
    <div ref={ref}>
      <span className="tabular-nums">{count}</span>
      {suffix}
    </div>
  );
}

interface ThemeProp {
  theme: "light" | "dark" | "rose";
}

function Hero({ theme }: ThemeProp) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-soft)" }} />

      {/* Background gradient orbs with animation */}
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

      {/* Floating particles */}
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

      {/* Grid pattern overlay */}
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
              Powered by AI - Tối ưu chuẩn ATS
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200} duration={600}>
            <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              JobReady AI <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-hero)" }}
              >
                chỉ trong 5 phút
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300} duration={600}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              JobReadyAI giúp bạn xây dựng CV ấn tượng, chuẩn ATS, tối ưu cho từng vị trí ứng tuyển
              và luyện tập phỏng vấn cùng HR ảo — tất cả bằng sức mạnh của trí tuệ nhân tạo.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={400} duration={600}>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/authentication/register"
                className="group inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 premium-shimmer-btn"
                style={{ background: "var(--gradient-hero)" }}
              >
                Bắt đầu miễn phí
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#how"
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-medium transition-all duration-300 hover:bg-secondary hover:-translate-y-0.5"
              >
                Xem cách hoạt động
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
                <span>Miễn phí dùng thử</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>Không cần thẻ tín dụng</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal direction="left" delay={300} duration={800} className="relative">
          {/* Floating decorative elements */}
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
              <span className="text-xs font-medium">ATS Score: 95</span>
            </div>
          </div>
          <div className="hero-float-card hero-float-card-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium">AI Optimized</span>
            </div>
          </div>
          <div className="hero-float-card hero-float-card-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-xs font-medium">Ready in 5 min</span>
            </div>
          </div>

          <div className="hero-cv-wrapper relative">
            {/* Glow behind CV */}
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

      {/* Simple wave separator */}
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
                Về chúng tôi
              </p>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Sứ mệnh đồng hành cùng sự nghiệp của bạn
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                JobReadyAI được ra đời với mục tiêu phá vỡ mọi rào cản giữa ứng viên tài năng và nhà
                tuyển dụng hàng đầu. Chúng tôi tin rằng mọi hành trình sự nghiệp đều xứng đáng có
                một khởi đầu hoàn hảo.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Bằng việc áp dụng các công nghệ trí tuệ nhân tạo (AI) tiên tiến nhất, JobReadyAI
                giúp bạn tự động hóa quy trình viết CV, tối ưu hóa các từ khóa chuẩn ATS theo từng
                mô tả công việc (JD), luyện tập phỏng vấn cùng HR ảo thông minh và nâng cao cơ hội
                được gọi phỏng vấn lên gấp 3 lần.
              </p>

              {/* Simple stats - no animation */}
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div className="text-center p-4 rounded-2xl bg-card border border-border">
                  <div className="text-3xl font-extrabold text-primary">99%</div>
                  <p className="mt-1 text-xs text-muted-foreground">Tương thích ATS</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-card border border-border">
                  <div className="text-3xl font-extrabold text-primary">10K+</div>
                  <p className="mt-1 text-xs text-muted-foreground">CV đã được tối ưu</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-card border border-border">
                  <div className="text-3xl font-extrabold text-primary">3x</div>
                  <p className="mt-1 text-xs text-muted-foreground">Tỷ lệ gọi phỏng vấn</p>
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
                <h3 className="text-2xl font-bold">Tại sao chọn JobReadyAI?</h3>
                <ul className="space-y-3.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>
                      <strong>Thuật toán tối ưu hóa thông minh:</strong> Tự động phát hiện và bổ
                      sung các từ khóa cốt lõi mà nhà tuyển dụng đang tìm kiếm.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>
                      <strong>Template chất lượng cao:</strong> Tất cả giao diện mẫu đều được kiểm
                      duyệt chặt chẽ bởi các chuyên gia tuyển dụng.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>
                      <strong>Nhanh chóng & Tiện lợi:</strong> Tạo, sửa và xuất PDF chuyên nghiệp
                      chỉ trong tích tắc.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span>
                      <strong>Phỏng vấn với HR ảo:</strong> Luyện tập trả lời phỏng vấn cùng AI HR
                      thông minh, nhận phản hồi tức thì.
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

const features = [
  {
    icon: Wand2,
    title: "AI viết nội dung",
    desc: "Gợi ý mô tả kinh nghiệm, kỹ năng phù hợp với vị trí ứng tuyển.",
  },
  {
    icon: ShieldCheck,
    title: "Chuẩn ATS",
    desc: "CV được tối ưu để vượt qua hệ thống lọc hồ sơ tự động của nhà tuyển dụng.",
  },
  {
    icon: Target,
    title: "Tối ưu từng JD",
    desc: "Dán mô tả công việc, JobReady điều chỉnh CV để khớp tối đa.",
  },
  {
    icon: Sparkles,
    title: "Phân tích và chấm điểm",
    desc: "AI đánh giá CV của bạn và đề xuất cải thiện cụ thể.",
  },
  {
    icon: Zap,
    title: "Xuất PDF tức thì",
    desc: "Tải về PDF chất lượng cao, sẵn sàng gửi nhà tuyển dụng.",
  },
  {
    icon: MessageSquare,
    title: "Phỏng vấn giả lập",
    desc: "AI đóng vai HR ảo, đặt câu hỏi thực tế và cho phản hồi tức thì để bạn tự tin hơn trước buổi phỏng vấn.",
  },
];

function Features({ theme }: ThemeProp) {
  return (
    <section id="features" className="py-24 relative">
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <ScrollReveal direction="up" duration={600}>
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Tính năng nổi bật
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Mọi thứ bạn cần để chinh phục nhà tuyển dụng
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Công cụ AI toàn diện giúp bạn từ viết, chỉnh sửa, tối ưu CV đến luyện tập phỏng vấn
              cùng HR ảo cho từng cơ hội việc làm.
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
  const steps = [
    {
      n: "01",
      title: "Tạo hoặc Tải lên CV",
      desc: "Bắt đầu bằng việc tạo CV mới với AI hoặc tải lên CV hiện có để AI phân tích và tối ưu hóa.",
    },
    {
      n: "02",
      title: "Dán mô tả công việc",
      desc: "Dán mô tả công việc (JD) từ tin tuyển dụng bạn muốn ứng tuyển để AI điều chỉnh CV phù hợp nhất.",
    },
    {
      n: "03",
      title: "Nhận CV tối ưu",
      desc: "AI sẽ tự động điều chỉnh từ khóa, cấu trúc và nội dung để CV đạt điểm ATS cao nhất.",
    },
  ];

  return (
    <section id="how" className="py-24 bg-secondary/10 border-y border-border">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal direction="up" duration={600}>
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Cách hoạt động
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Chỉ 3 bước đơn giản
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
  return (
    <section id="start" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-soft)" }} />

      <div className="mx-auto max-w-5xl px-6 relative z-10">
        <ScrollReveal direction="scale" duration={800}>
          <div
            className="relative overflow-hidden rounded-3xl p-12 text-center text-primary-foreground sm:p-16 shadow-[var(--shadow-elegant)]"
            style={{ background: "var(--gradient-hero)" }}
          >
            {/* Simple glow - no animation */}
            <div
              aria-hidden
              className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"
            />

            <h2 className="relative text-4xl font-bold tracking-tight sm:text-5xl">
              Sẵn sàng cho công việc mơ ước?
            </h2>
            <p className="relative mx-auto mt-4 max-w-2xl text-lg opacity-90">
              Tham gia cùng hàng nghìn ứng viên đã tin dùng JobReadyAI để nâng tầm CV và tự tin
              chinh phục phỏng vấn cùng HR ảo.
            </p>

            <div className="relative mt-8 flex justify-center">
              <a
                href="/authentication/register"
                className="inline-flex items-center gap-2 rounded-full bg-background px-8 py-4 font-semibold text-foreground shadow-lg transition-all duration-300 hover:scale-105 premium-shimmer-btn"
              >
                Tạo CV miễn phí
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
              Giải pháp tối ưu hóa hồ sơ xin việc toàn diện bằng công nghệ trí tuệ nhân tạo. Giúp
              bạn chinh phục mọi nhà tuyển dụng.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              Sản phẩm
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="hover:text-primary transition-colors duration-200">
                  Tính năng nổi bật
                </a>
              </li>
              <li>
                <a href="#how" className="hover:text-primary transition-colors duration-200">
                  Cách hoạt động
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              Về chúng tôi
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a href="#about" className="hover:text-primary transition-colors duration-200">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-primary transition-colors duration-200">
                  Sứ mệnh phát triển
                </a>
              </li>
              <li>
                <a href="/chinh-sach" className="hover:text-primary transition-colors duration-200">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
              Kết nối
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <span className="text-foreground">Email:</span> jobreadya@gmail.com
              </li>
              <li>
                <span className="text-foreground">Hotline:</span> 1900 1234
              </li>
              <li>
                <span className="text-foreground">Địa chỉ:</span> Hà Nội, Việt Nam
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 JobReadyAI. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
