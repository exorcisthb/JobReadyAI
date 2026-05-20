import { createFileRoute } from "@tanstack/react-router";
import heroCv from "@/assets/hero-cv.png";
import { Sparkles, FileText, Wand2, ShieldCheck, Zap, Target, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">Jobredy<span className="text-primary"> AI</span></span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Tính năng</a>
          <a href="#how" className="hover:text-foreground transition">Cách hoạt động</a>
          <a href="#pricing" className="hover:text-foreground transition">Bảng giá</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href="#login" className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground">Đăng nhập</a>
          <button onClick={downloadHomepage} className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium border border-border bg-card hover:bg-secondary transition" title="Tải homepage">
            <Download className="h-4 w-4" /> <span className="hidden sm:inline">Tải về</span>
          </button>
          <a href="#start" className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90 transition" style={{ background: "var(--gradient-hero)" }}>
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
      <div aria-hidden className="absolute -top-32 -right-32 h-96 w-96 rounded-full blur-3xl opacity-40" style={{ background: "var(--gradient-hero)" }} />
      <div aria-hidden className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full blur-3xl opacity-30 bg-[oklch(0.78_0.14_175)]" />

      <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Powered by AI — Tối ưu chuẩn ATS
          </div>
          <h1 className="mt-6 text-5xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
            Tạo CV chuyên nghiệp <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>
              chỉ trong 5 phút
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            Jobredy AI giúp bạn xây dựng CV ấn tượng, chuẩn ATS và tối ưu cho từng vị trí ứng tuyển — bằng sức mạnh của trí tuệ nhân tạo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#start" className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] hover:translate-y-[-1px] transition" style={{ background: "var(--gradient-hero)" }}>
              Bắt đầu miễn phí <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#how" className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium border border-border bg-card hover:bg-secondary transition">
              Xem cách hoạt động
            </a>
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Check className="h-4 w-4 text-[oklch(0.65_0.15_175)]" /> Miễn phí dùng thử</div>
            <div className="flex items-center gap-2"><Check className="h-4 w-4 text-[oklch(0.65_0.15_175)]" /> Không cần thẻ tín dụng</div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 blur-2xl opacity-60" style={{ background: "var(--gradient-hero)" }} />
          <img src={heroCv} alt="Mẫu CV được tạo bởi Jobredy AI" width={1280} height={1024} className="relative w-full h-auto drop-shadow-2xl" />
        </div>
      </div>
    </section>
  );
}

const features = [
  { icon: Wand2, title: "AI viết nội dung", desc: "Gợi ý mô tả kinh nghiệm, kỹ năng phù hợp với vị trí ứng tuyển." },
  { icon: ShieldCheck, title: "Chuẩn ATS", desc: "CV được tối ưu để vượt qua hệ thống lọc hồ sơ tự động của nhà tuyển dụng." },
  { icon: Target, title: "Tối ưu từng JD", desc: "Dán mô tả công việc — Jobredy điều chỉnh CV để khớp tối đa." },
  { icon: FileText, title: "Mẫu CV đa dạng", desc: "Hơn 30+ template hiện đại, dễ dàng tuỳ biến màu sắc, font chữ." },
  { icon: Zap, title: "Xuất PDF tức thì", desc: "Tải về PDF chất lượng cao, sẵn sàng gửi nhà tuyển dụng." },
  { icon: Sparkles, title: "Phân tích & chấm điểm", desc: "AI đánh giá CV của bạn và đề xuất cải thiện cụ thể." },
];

function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Tính năng nổi bật</p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">Mọi thứ bạn cần để chinh phục nhà tuyển dụng</h2>
          <p className="mt-4 text-muted-foreground text-lg">Công cụ AI toàn diện giúp bạn từ viết, chỉnh sửa đến tối ưu CV cho từng cơ hội việc làm.</p>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="group rounded-2xl border border-border bg-card p-6 hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5 transition">
              <div className="h-11 w-11 rounded-xl flex items-center justify-center text-primary-foreground mb-4" style={{ background: "var(--gradient-hero)" }}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Nhập thông tin", desc: "Chia sẻ kinh nghiệm, học vấn và kỹ năng — hoặc tải CV cũ lên." },
    { n: "02", title: "AI tối ưu", desc: "Jobredy AI viết lại, sắp xếp và tinh chỉnh nội dung theo chuẩn ngành." },
    { n: "03", title: "Tải về & ứng tuyển", desc: "Chọn template, xuất PDF và bắt đầu hành trình sự nghiệp mới." },
  ];
  return (
    <section id="how" className="py-24 bg-secondary/40 border-y border-border">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Cách hoạt động</p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">3 bước đơn giản</h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-2xl bg-card border border-border p-8">
              <div className="text-5xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-hero)" }}>{s.n}</div>
              <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    { name: "Miễn phí", price: "0₫", desc: "Trải nghiệm các tính năng cơ bản", features: ["1 CV", "5 mẫu cơ bản", "Xuất PDF có watermark"], cta: "Bắt đầu", highlight: false },
    { name: "Pro", price: "99K", suffix: "/tháng", desc: "Dành cho người tìm việc nghiêm túc", features: ["CV không giới hạn", "30+ mẫu cao cấp", "AI tối ưu theo JD", "Xuất PDF không watermark"], cta: "Nâng cấp Pro", highlight: true },
    { name: "Career+", price: "249K", suffix: "/tháng", desc: "Toàn diện cho phát triển sự nghiệp", features: ["Mọi tính năng Pro", "Cover letter AI", "Phân tích & chấm điểm CV", "Hỗ trợ ưu tiên"], cta: "Chọn Career+", highlight: false },
  ];
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Bảng giá</p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">Lựa chọn phù hợp với bạn</h2>
          <p className="mt-4 text-muted-foreground text-lg">Không ràng buộc — huỷ bất cứ lúc nào.</p>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div key={p.name} className={`relative rounded-2xl p-8 border ${p.highlight ? "border-primary shadow-[var(--shadow-elegant)] bg-card" : "border-border bg-card"}`}>
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
                  Phổ biến nhất
                </div>
              )}
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{p.price}</span>
                {p.suffix && <span className="text-muted-foreground">{p.suffix}</span>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 text-[oklch(0.65_0.15_175)] shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <a href="#start" className={`mt-8 inline-flex w-full justify-center rounded-full px-5 py-2.5 font-medium transition ${p.highlight ? "text-primary-foreground hover:opacity-90" : "bg-secondary text-foreground hover:bg-secondary/70"}`} style={p.highlight ? { background: "var(--gradient-hero)" } : undefined}>
                {p.cta}
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
        <div className="relative overflow-hidden rounded-3xl p-12 sm:p-16 text-center text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
          <div aria-hidden className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div aria-hidden className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <h2 className="relative text-4xl sm:text-5xl font-bold tracking-tight">Sẵn sàng cho công việc mơ ước?</h2>
          <p className="relative mt-4 text-lg opacity-90 max-w-2xl mx-auto">Tham gia cùng hàng nghìn ứng viên đã tin dùng Jobredy AI để nâng tầm CV của mình.</p>
          <a href="#" className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-background text-foreground px-7 py-3 font-semibold hover:scale-[1.02] transition">
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
      <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg flex items-center justify-center text-primary-foreground" style={{ background: "var(--gradient-hero)" }}>
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-semibold text-foreground">Jobredy AI</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground">Điều khoản</a>
          <a href="#" className="hover:text-foreground">Bảo mật</a>
          <a href="#" className="hover:text-foreground">Liên hệ</a>
        </div>
      </div>
    </footer>
  );
}
