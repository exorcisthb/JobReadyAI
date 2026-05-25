import { useEffect, useState, useRef } from "react";
import heroCv from "@/assets/hero-cv.png";
import {
  ArrowRight,
  Check,
  FileText,
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
        <Features theme={theme} />
        <HowItWorks />
        <Pricing theme={theme} />
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
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
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
              { label: "Tính năng", href: "#features" },
              { label: "Cách hoạt động", href: "#how" },
              { label: "Bảng giá", href: "#pricing" },
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
                  className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                    theme === "light"
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
                  className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                    theme === "dark"
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
                  className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                    theme === "rose"
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
              JobReady AI giúp bạn xây dựng CV ấn tượng, chuẩn ATS và tối ưu cho từng vị trí ứng tuyển
              bằng sức mạnh của trí tuệ nhân tạo.
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
    icon: FileText,
    title: "Mẫu CV đa dạng",
    desc: "Hơn 30+ template hiện đại, dễ dàng tuỳ biến màu sắc, font chữ.",
  },
  {
    icon: Zap,
    title: "Xuất PDF tức thì",
    desc: "Tải về PDF chất lượng cao, sẵn sàng gửi nhà tuyển dụng.",
  },
  {
    icon: Sparkles,
    title: "Phân tích và chấm điểm",
    desc: "AI đánh giá CV của bạn và đề xuất cải thiện cụ thể.",
  },
];

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
              Công cụ AI toàn diện giúp bạn từ viết, chỉnh sửa đến tối ưu CV cho từng cơ hội việc làm.
            </p>
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
      title: "Nhập thông tin",
      desc: "Chia sẻ kinh nghiệm, học vấn và kỹ năng, hoặc tải CV cũ lên.",
    },
    {
      n: "02",
      title: "AI tối ưu",
      desc: "JobReady AI viết lại, sắp xếp và tinh chỉnh nội dung theo chuẩn ngành.",
    },
    {
      n: "03",
      title: "Tải về và ứng tuyển",
      desc: "Chọn template, xuất PDF và bắt đầu hành trình sự nghiệp mới.",
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
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">3 bước đơn giản</h2>
          </div>
        </ScrollReveal>
        
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <ScrollReveal
              key={step.n}
              direction="up"
              delay={index * 150}
              duration={800}
            >
              <div className="group relative rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[var(--shadow-soft)] premium-glow-card h-full">
                <div
                  className="bg-clip-text text-5xl font-bold text-transparent transition-transform duration-300 group-hover:scale-110 origin-left inline-block"
                  style={{ backgroundImage: "var(--gradient-hero)" }}
                >
                  {step.n}
                </div>
                <h3 className="mt-4 text-xl font-semibold transition-colors duration-300 group-hover:text-primary">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ theme }: ThemeProp) {
  const plans = [
    {
      name: "Miễn phí",
      price: "0 VND",
      desc: "Trải nghiệm các tính năng cơ bản",
      features: ["1 CV", "5 mẫu cơ bản", "Xuất PDF có watermark"],
      cta: "Bắt đầu",
      highlight: false,
    },
    {
      name: "Pro",
      price: "99K",
      suffix: "/tháng",
      desc: "Dành cho người tìm việc nghiêm túc",
      features: [
        "CV không giới hạn",
        "30+ mẫu cao cấp",
        "AI tối ưu theo JD",
        "Xuất PDF không watermark",
      ],
      cta: "Nâng cấp Pro",
      highlight: true,
    },
    {
      name: "Career+",
      price: "249K",
      suffix: "/tháng",
      desc: "Toàn diện cho phát triển sự nghiệp",
      features: [
        "Mọi tính năng Pro",
        "Cover letter AI",
        "Phân tích và chấm điểm CV",
        "Hỗ trợ ưu tiên",
      ],
      cta: "Chọn Career+",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal direction="up" duration={800}>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Bảng giá</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Lựa chọn phù hợp với bạn
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">Không ràng buộc, huỷ bất cứ lúc nào.</p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <ScrollReveal
              key={plan.name}
              direction="up"
              delay={index * 150}
              duration={800}
              className="flex"
            >
              <BorderGlow
                className={`relative w-full flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 ${
                  plan.highlight ? "scale-[1.02] z-10 border-primary/50" : "border-border/50"
                }`}
                backgroundColor="var(--card)"
                borderRadius={16}
                glowColor={
                  theme === "rose"
                    ? plan.highlight ? "350 90 65" : "350 60 70"
                    : plan.highlight ? "220 100 40" : "220 90 45"
                }
                glowIntensity={plan.highlight ? 1.8 : 1.2}
                fillOpacity={plan.highlight ? 0.2 : 0.12}
                colors={
                  theme === "rose"
                    ? plan.highlight
                      ? ['#db2777', '#e11d48', '#fda4af']
                      : ['#f43f5e', '#fb7185', '#ffe4e6']
                    : plan.highlight
                      ? ['#1e3a8a', '#1d4ed8', '#00f5ff']
                      : ['#1e3a8a', '#3b82f6', '#0284c7']
                }
              >
                <div className="p-8 flex flex-col justify-between h-full w-full">
                  <div>
                    {plan.highlight && (
                      <div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold text-primary-foreground animate-pulse z-20"
                        style={{ background: "var(--gradient-hero)" }}
                      >
                        Phổ biến nhất
                      </div>
                    )}
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.suffix && <span className="text-muted-foreground">{plan.suffix}</span>}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
                    <ul className="mt-6 space-y-3 text-sm">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.65_0.15_175)]" />{" "}
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href="/authentication/register"
                    className={`mt-8 inline-flex w-full justify-center rounded-full px-5 py-2.5 font-medium transition premium-shimmer-btn ${
                      plan.highlight
                        ? "text-primary-foreground hover:opacity-90"
                        : "bg-secondary text-foreground hover:bg-secondary/70"
                    }`}
                    style={plan.highlight ? { background: "var(--gradient-hero)" } : undefined}
                  >
                    {plan.cta}
                  </a>
                </div>
              </BorderGlow>
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
              Tham gia cùng hàng nghìn ứng viên đã tin dùng JobReady AI để nâng tầm CV của mình.
            </p>
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
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg text-primary-foreground"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-semibold text-foreground">JobReady AI</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground">
            Điều khoản
          </a>
          <a href="#" className="hover:text-foreground">
            Bảo mật
          </a>
          <a href="#" className="hover:text-foreground">
            Liên hệ
          </a>
        </div>
      </div>
    </footer>
  );
}
