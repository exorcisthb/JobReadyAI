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

export function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground motion-safe:animate-page-in">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md motion-safe:animate-header-drop">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            JobReady<span className="text-primary"> AI</span>
          </span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition hover:text-foreground">
            Tính năng
          </a>
          <a href="#how" className="transition hover:text-foreground">
            Cách hoạt động
          </a>
          <a href="#pricing" className="transition hover:text-foreground">
            Bảng giá
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="/authentication/login"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
          >
            Đăng nhập
          </a>
          <a
            href="/authentication/register"
            className="shine-button inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:opacity-95"
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
      <div className="absolute inset-0 -z-10 motion-safe:animate-soft-shift" style={{ background: "var(--gradient-soft)" }} />
      <div
        aria-hidden
        className="absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-40 blur-3xl motion-safe:animate-float-slow"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[oklch(0.78_0.14_175)] opacity-30 blur-3xl motion-safe:animate-float-slow motion-delay-300"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-20 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Powered by AI - Tối ưu chuẩn ATS
          </div>
          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl motion-safe:animate-reveal-up motion-delay-200">
            Tạo CV chuyên nghiệp <br />
            <span
              className="gradient-text-motion bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-hero)" }}
            >
              chỉ trong 5 phút
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground motion-safe:animate-reveal-up motion-delay-300">
            JobReady AI giúp bạn xây dựng CV ấn tượng, chuẩn ATS và tối ưu cho từng vị trí ứng tuyển
            bằng sức mạnh của trí tuệ nhân tạo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 motion-safe:animate-reveal-up motion-delay-400">
            <a
              href="/authentication/register"
              className="shine-button inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition hover:-translate-y-1 hover:opacity-95"
              style={{ background: "var(--gradient-hero)" }}
            >
              Bắt đầu miễn phí <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-medium transition hover:-translate-y-1 hover:bg-secondary hover:shadow-[var(--shadow-soft)]"
            >
              Xem cách hoạt động
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground motion-safe:animate-reveal-up motion-delay-500">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[oklch(0.65_0.15_175)]" /> Miễn phí dùng thử
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[oklch(0.65_0.15_175)]" /> Không cần thẻ tín dụng
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            className="absolute inset-0 -z-10 opacity-60 blur-2xl"
            style={{ background: "var(--gradient-hero)" }}
          />
          <img
            src={heroCv}
            alt="Mẫu CV được tạo bởi JobReady AI"
            className="relative h-auto w-full drop-shadow-2xl motion-safe:animate-float-card"
          />
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

function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
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
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="interactive-card group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-2 hover:shadow-[var(--shadow-soft)] motion-safe:animate-reveal-up"
            >
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground transition group-hover:rotate-3 group-hover:scale-110"
                style={{ background: "var(--gradient-hero)" }}
              >
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
            </div>
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
      desc: "Chia sẻ kinh nghiệm, học văn và kỹ năng, hoặc tải CV cũ lên.",
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
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Cách hoạt động
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">3 bước đơn giản</h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n} className="interactive-card relative rounded-2xl border border-border bg-card p-8 transition hover:-translate-y-2 hover:shadow-[var(--shadow-soft)] motion-safe:animate-reveal-up">
              <div
                className="bg-clip-text text-5xl font-bold text-transparent"
                style={{ backgroundImage: "var(--gradient-hero)" }}
              >
                {step.n}
              </div>
              <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
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
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Bảng giá</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Lựa chọn phù hợp với bạn
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">Không ràng buộc, huỷ bất cứ lúc nào.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`interactive-card relative rounded-2xl border p-8 transition hover:-translate-y-2 ${
                plan.highlight
                  ? "border-primary bg-card shadow-[var(--shadow-elegant)]"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlight && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold text-primary-foreground"
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
              <a
                href="/authentication/register"
                className={`mt-8 inline-flex w-full justify-center rounded-full px-5 py-2.5 font-medium transition ${
                  plan.highlight
                    ? "text-primary-foreground hover:opacity-90"
                    : "bg-secondary text-foreground hover:bg-secondary/70"
                }`}
                style={plan.highlight ? { background: "var(--gradient-hero)" } : undefined}
              >
                {plan.cta}
              </a>
            </div>
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
        <div
          className="relative overflow-hidden rounded-3xl p-12 text-center text-primary-foreground transition hover:scale-[1.01] sm:p-16"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div
            aria-hidden
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"
          />
          <h2 className="relative text-4xl font-bold tracking-tight sm:text-5xl">
            Sẵn sàng cho công việc mơ ước?
          </h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-lg opacity-90">
            Tham gia cùng hàng nghìn ứng viên đã tin dùng JobReady AI để nâng tầm CV của mình.
          </p>
          <a
            href="/authentication/register"
            className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-background px-7 py-3 font-semibold text-foreground transition hover:-translate-y-1 hover:scale-[1.02]"
          >
            Tạo CV miễn phí <ArrowRight className="h-4 w-4" />
          </a>
        </div>
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
