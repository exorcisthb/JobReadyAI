import { useEffect, useState, useRef } from "react";
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

import { Sun, Moon, Palette, ChevronDown } from "lucide-react";

export function HomePage() {
  const [theme, setTheme] = useState<"light" | "dark" | "rose">(() => {
    const saved = localStorage.getItem("homepage-theme");
    return (saved as "light" | "dark" | "rose") || "light";
  });

  useEffect(() => {
    document.documentElement.classList.remove("dark", "rose");
    if (theme !== "light") {
      document.documentElement.classList.add(theme);
    }
    localStorage.setItem("homepage-theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Header theme={theme} setTheme={setTheme} />
      <main>
        <Hero />
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
}

function Header({ theme, setTheme }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
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
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled
        ? "border-border/80 bg-background/85 shadow-[var(--shadow-soft)] backdrop-blur-lg py-1"
        : "border-border/0 bg-background/70 backdrop-blur-md py-3"
        }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2 group">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            JobReady<span className="text-primary transition-colors duration-300 group-hover:text-primary-glow"> AI</span>
          </span>
        </a>
        <div className="hidden md:flex">
          <GooeyNav
            items={[
              { label: "Trang chủ", href: "#" },
              { label: "Giới thiệu", href: "#about" },
              { label: "Tính năng", href: "#features" },
              { label: "Cách hoạt động", href: "#how" },
            ]}
            particleCount={12}
            particleDistances={[60, 5]}
            particleR={60}
            colors={[1, 2, 3, 1, 2, 3, 2]}
            animationTime={400}
            timeVariance={200}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card/85 px-3 py-1.5 text-xs font-semibold text-foreground transition-all duration-300 hover:bg-secondary cursor-pointer shadow-[var(--shadow-soft)] hover:scale-[1.02]"
              title="Chọn giao diện"
            >
              {theme === "light" && <Sun className="h-3.5 w-3.5 text-amber-500 animate-spin-slow" />}
              {theme === "dark" && <Moon className="h-3.5 w-3.5 text-blue-400" />}
              {theme === "rose" && <Palette className="h-3.5 w-3.5 text-rose-500" />}
              <span className="hidden sm:inline capitalize">{theme === "light" ? "Sáng" : theme === "dark" ? "Tối" : "Hồng"}</span>
              <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-2xl border border-border bg-card/95 p-1.5 shadow-[var(--shadow-elegant)] backdrop-blur-xl animate-slide-in-up z-50">
                <button
                  onClick={() => {
                    setTheme("light");
                    setDropdownOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${theme === "light"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                >
                  <Sun className={`h-4 w-4 ${theme === "light" ? "text-amber-500 animate-spin-slow" : "text-muted-foreground"}`} />
                  Giao diện sáng
                </button>
                <button
                  onClick={() => {
                    setTheme("dark");
                    setDropdownOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${theme === "dark"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                >
                  <Moon className={`h-4 w-4 ${theme === "dark" ? "text-blue-400" : "text-muted-foreground"}`} />
                  Giao diện tối
                </button>
                <button
                  onClick={() => {
                    setTheme("rose");
                    setDropdownOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${theme === "rose"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                >
                  <Palette className={`h-4 w-4 ${theme === "rose" ? "text-rose-500" : "text-muted-foreground"}`} />
                  Hồng nhung
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
            className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-300 hover:opacity-90 hover:scale-[1.02] premium-shimmer-btn"
            style={{ background: "var(--gradient-hero)" }}
          >
            Tạo CV ngay <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-soft)" }} />
      <div
        aria-hidden
        className="absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-40 blur-3xl animate-pulse-rotate-1"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[oklch(0.78_0.14_175)] opacity-30 blur-3xl animate-pulse-rotate-2"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-20 lg:grid-cols-2">
        <div>
          <ScrollReveal direction="up" delay={100} duration={800}>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Powered by AI - Tối ưu chuẩn ATS
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200} duration={800}>
            <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Tạo CV chuyên nghiệp <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-hero)" }}
              >
                chỉ trong 5 phút
              </span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={300} duration={800}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              JobReady AI giúp bạn xây dựng CV ấn tượng, chuẩn ATS, tối ưu cho từng vị trí ứng tuyển
              và luyện tập phỏng vấn cùng HR ảo — tất cả bằng sức mạnh của trí tuệ nhân tạo.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={400} duration={800}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/authentication/register"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-all duration-300 hover:translate-y-[-2px] hover:scale-[1.02] premium-shimmer-btn"
                style={{ background: "var(--gradient-hero)" }}
              >
                Bắt đầu miễn phí <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-medium transition-all duration-300 hover:bg-secondary hover:translate-y-[-1px]"
              >
                Xem cách hoạt động
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={500} duration={800}>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[oklch(0.65_0.15_175)]" /> Miễn phí dùng thử
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[oklch(0.65_0.15_175)]" /> Không cần thẻ tín dụng
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal direction="left" delay={300} duration={1000} className="relative">
          <div
            className="absolute inset-0 -z-10 opacity-60 blur-2xl animate-pulse-rotate-1"
            style={{ background: "var(--gradient-hero)" }}
          />
          <img
            src={heroCv}
            alt="Mẫu CV được tạo bởi JobReady AI"
            className="relative h-auto w-full drop-shadow-2xl animate-float"
          />
        </ScrollReveal>
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
    icon: Sparkles,          // ← đổi lên đây (trước là index 5)
    title: "Phân tích và chấm điểm",
    desc: "AI đánh giá CV của bạn và đề xuất cải thiện cụ thể.",
  },
  {
    icon: Zap,
    title: "Xuất PDF tức thì",
    desc: "Tải về PDF chất lượng cao, sẵn sàng gửi nhà tuyển dụng.",
  },
  {
    icon: MessageSquare,     // ← xuống đây (trước là index 3)
    title: "Phỏng vấn giả lập",
    desc: "AI đóng vai HR ảo, đặt câu hỏi thực tế và cho phản hồi tức thì để bạn tự tin hơn trước buổi phỏng vấn.",
  },
];

function About({ theme }: ThemeProp) {
  return (
    <section id="about" className="py-24 border-b border-border bg-secondary/10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <ScrollReveal direction="right" duration={800}>
            <div className="space-y-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Về chúng tôi
              </p>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Sứ mệnh đồng hành cùng sự nghiệp của bạn
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                JobReady AI được ra đời với mục tiêu phá vỡ mọi rào cản giữa ứng viên tài năng và nhà tuyển dụng hàng đầu.
                Chúng tôi tin rằng mọi hành trình sự nghiệp đều xứng đáng có một khởi đầu hoàn hảo — từ CV chuẩn ATS
                đến phỏng vấn tự tin cùng HR ảo.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Bằng việc áp dụng các công nghệ trí tuệ nhân tạo (AI) tiên tiến nhất, JobReady AI giúp bạn tự động hóa
                quy trình viết CV, tối ưu hóa các từ khóa chuẩn ATS theo từng mô tả công việc (JD), luyện tập phỏng vấn
                cùng HR ảo thông minh và nâng cao cơ hội được gọi phỏng vấn lên gấp 3 lần.              </p>
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div>
                  <h4 className="text-3xl font-extrabold text-primary">99%</h4>
                  <p className="mt-1 text-xs text-muted-foreground">Tương thích ATS</p>
                </div>
                <div>
                  <h4 className="text-3xl font-extrabold text-primary">10K+</h4>
                  <p className="mt-1 text-xs text-muted-foreground">CV đã được tối ưu</p>
                </div>
                <div>
                  <h4 className="text-3xl font-extrabold text-primary">3x</h4>
                  <p className="mt-1 text-xs text-muted-foreground">Tỷ lệ gọi phỏng vấn</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" duration={800} className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-elegant)] hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 -z-10 opacity-20 blur-3xl bg-[oklch(0.65_0.15_175)] animate-pulse" />
              <div className="space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">Tại sao chọn JobReady AI?</h3>
                <ul className="space-y-3.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span><strong>Thuật toán tối ưu hóa thông minh:</strong> Tự động phát hiện và bổ sung các từ khóa cốt lõi mà nhà tuyển dụng đang tìm kiếm.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span><strong>Template chất lượng cao:</strong> Tất cả giao diện mẫu đều được kiểm duyệt chặt chẽ bởi các chuyên gia tuyển dụng.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span><strong>Nhanh chóng & Tiện lợi:</strong> Tạo, sửa và xuất PDF chuyên nghiệp chỉ trong tích tắc.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span><strong>Phỏng vấn với HR ảo:</strong> Luyện tập trả lời phỏng vấn cùng AI HR thông minh, nhận phản hồi tức thì để tự tin hơn trước mỗi buổi phỏng vấn thực.</span>
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

interface ThemeProp {
  theme: "light" | "dark" | "rose";
}

function Features({ theme }: ThemeProp) {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal direction="up" duration={800}>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Tính năng nổi bật
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Mọi thứ bạn cần để chinh phục nhà tuyển dụng
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Công cụ AI toàn diện giúp bạn từ viết, chỉnh sửa, tối ưu CV đến luyện tập phỏng vấn cùng HR ảo cho từng cơ hội việc làm.            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <ScrollReveal
              key={feature.title}
              direction="up"
              delay={index * 100}
              duration={800}
              className="flex"
            >
              <BorderGlow
                className="w-full text-foreground transition-all duration-300 hover:-translate-y-1.5"
                backgroundColor="var(--card)"
                borderRadius={16}
                glowColor={theme === "rose" ? "350 70 75" : "220 100 45"}
                glowIntensity={1.5}
                fillOpacity={0.15}
                colors={
                  theme === "rose"
                    ? ['#f43f5e', '#fb7185', '#ffe4e6']
                    : ['#1e3a8a', '#2563eb', '#06b6d4']
                }
              >
                <div className="group p-6 h-full flex flex-col justify-start">
                  <div
                    className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                    style={{ background: "var(--gradient-hero)" }}
                  >
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-primary">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
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
      desc: "Tải lên bản CV cũ sẵn có hoặc nhờ AI tạo lập hồ sơ cá nhân chuyên nghiệp mới chỉ trong vài bước.",
    },
    {
      n: "02",
      title: "AI Tối ưu hóa CV",
      desc: "Sức mạnh AI phân tích sâu, tự động tinh chỉnh và chèn từ khóa khớp chuẩn ATS tương thích với mô tả công việc (JD).",
    },
    {
      n: "03",
      title: "Phỏng vấn với HR ảo",
      desc: "Luyện tập trả lời phỏng vấn thông minh cùng AI HR giả định để rèn luyện tư duy phản xạ nhạy bén.",
    },
    {
      n: "04",
      title: "Tải về & Ứng tuyển",
      desc: "Xuất CV định dạng PDF chất lượng cao nhất, sẵn sàng gửi tới tay các nhà tuyển dụng hàng đầu.",
    },
  ];

  return (
    <section id="how" className="border-y border-border bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal direction="up" duration={800}>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Cách hoạt động
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">4 bước đơn giản</h2>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <ScrollReveal
              key={step.n}
              direction="up"
              delay={index * 150}
              duration={800}
              className="flex"
            >
              <div className="group relative rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[var(--shadow-soft)] premium-glow-card h-full w-full">
                <div
                  className="bg-clip-text text-5xl font-bold text-transparent transition-transform duration-300 group-hover:scale-110 origin-left inline-block"
                  style={{ backgroundImage: "var(--gradient-hero)" }}
                >
                  {step.n}
                </div>
                <h3 className="mt-4 text-xl font-semibold transition-colors duration-300 group-hover:text-primary">{step.title}</h3>
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
    <section id="start" className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal direction="scale" duration={1000}>
          <div
            className="relative overflow-hidden rounded-3xl p-12 text-center text-primary-foreground sm:p-16 shadow-[var(--shadow-elegant)] transition-transform duration-500 hover:scale-[1.01]"
            style={{ background: "var(--gradient-hero)" }}
          >
            <div
              aria-hidden
              className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-rotate-1"
            />
            <div
              aria-hidden
              className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse-rotate-2"
            />
            <h2 className="relative text-4xl font-bold tracking-tight sm:text-5xl">
              Sẵn sàng cho công việc mơ ước?
            </h2>
            <p className="relative mx-auto mt-4 max-w-2xl text-lg opacity-90">
              Tham gia cùng hàng nghìn ứng viên đã tin dùng JobReady AI để nâng tầm CV và tự tin chinh phục phỏng vấn cùng HR ảo.            </p>
            <a
              href="/authentication/register"
              className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-background px-7 py-3 font-semibold text-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg premium-shimmer-btn"
            >
              Tạo CV miễn phí <ArrowRight className="h-4 w-4" />
            </a>
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
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">JobReady AI</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Giải pháp tối ưu hóa hồ sơ xin việc toàn diện bằng công nghệ trí tuệ nhân tạo. Giúp bạn chinh phục mọi nhà tuyển dụng.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Sản phẩm</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-primary transition-colors duration-200">Tính năng nổi bật</a></li>
              <li><a href="#how" className="hover:text-primary transition-colors duration-200">Cách hoạt động</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Về chúng tôi</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="#about" className="hover:text-primary transition-colors duration-200">Giới thiệu</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors duration-200">Sứ mệnh phát triển</a></li>
              <li><a href="#" className="hover:text-primary transition-colors duration-200">Chính sách bảo mật</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Kết nối</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><span className="text-foreground">Email:</span> jobreadya@gmail.com</li>
              <li><span className="text-foreground">Hotline:</span> 1900 1234</li>
              <li><span className="text-foreground">Địa chỉ:</span> Hà Nội, Việt Nam</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} JobReady AI. Bảo lưu mọi quyền.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Điều khoản dịch vụ</a>
            <a href="#" className="hover:text-foreground transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-foreground transition-colors">Liên hệ hỗ trợ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
