import Image from "next/image";
import heroCv from "@/assets/hero-cv.png";
import {
  Sparkles,
  FileText,
  Wand2,
  ShieldCheck,
  Zap,
  Target,
  ArrowRight,
  Check,
} from "lucide-react";

export default function Home() {
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
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Jobredy<span className="text-primary"> AI</span>
          </span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition hover:text-foreground">
            Tinh nang
          </a>
          <a href="#how" className="transition hover:text-foreground">
            Cach hoat dong
          </a>
          <a href="#pricing" className="transition hover:text-foreground">
            Bang gia
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#login"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
          >
            Dang nhap
          </a>
          <a
            href="#start"
            className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition hover:opacity-90"
            style={{ background: "var(--gradient-hero)" }}
          >
            Tao CV ngay <ArrowRight className="h-4 w-4" />
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
        className="absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[oklch(0.78_0.14_175)] opacity-30 blur-3xl"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-20 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Powered by AI - Toi uu chuan ATS
          </div>
          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            Tao CV chuyen nghiep <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-hero)" }}
            >
              chi trong 5 phut
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Jobredy AI giup ban xay dung CV an tuong, chuan ATS va toi uu cho tung vi tri ung tuyen
            bang suc manh cua tri tue nhan tao.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#start"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition hover:translate-y-[-1px]"
              style={{ background: "var(--gradient-hero)" }}
            >
              Bat dau mien phi <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-medium transition hover:bg-secondary"
            >
              Xem cach hoat dong
            </a>
          </div>
          <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[oklch(0.65_0.15_175)]" /> Mien phi dung thu
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[oklch(0.65_0.15_175)]" /> Khong can the tin dung
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            className="absolute inset-0 -z-10 opacity-60 blur-2xl"
            style={{ background: "var(--gradient-hero)" }}
          />
          <Image
            src={heroCv}
            alt="Mau CV duoc tao boi Jobredy AI"
            priority
            className="relative h-auto w-full drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: Wand2,
    title: "AI viet noi dung",
    desc: "Goi y mo ta kinh nghiem, ky nang phu hop voi vi tri ung tuyen.",
  },
  {
    icon: ShieldCheck,
    title: "Chuan ATS",
    desc: "CV duoc toi uu de vuot qua he thong loc ho so tu dong cua nha tuyen dung.",
  },
  {
    icon: Target,
    title: "Toi uu tung JD",
    desc: "Dan mo ta cong viec, Jobredy dieu chinh CV de khop toi da.",
  },
  {
    icon: FileText,
    title: "Mau CV da dang",
    desc: "Hon 30+ template hien dai, de dang tuy bien mau sac, font chu.",
  },
  {
    icon: Zap,
    title: "Xuat PDF tuc thi",
    desc: "Tai ve PDF chat luong cao, san sang gui nha tuyen dung.",
  },
  {
    icon: Sparkles,
    title: "Phan tich va cham diem",
    desc: "AI danh gia CV cua ban va de xuat cai thien cu the.",
  },
];

function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Tinh nang noi bat
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Moi thu ban can de chinh phuc nha tuyen dung
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Cong cu AI toan dien giup ban tu viet, chinh sua den toi uu CV cho tung co hoi viec lam.
          </p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
            >
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-primary-foreground"
                style={{ background: "var(--gradient-hero)" }}
              >
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
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
      title: "Nhap thong tin",
      desc: "Chia se kinh nghiem, hoc van va ky nang, hoac tai CV cu len.",
    },
    {
      n: "02",
      title: "AI toi uu",
      desc: "Jobredy AI viet lai, sap xep va tinh chinh noi dung theo chuan nganh.",
    },
    {
      n: "03",
      title: "Tai ve va ung tuyen",
      desc: "Chon template, xuat PDF va bat dau hanh trinh su nghiep moi.",
    },
  ];

  return (
    <section id="how" className="border-y border-border bg-secondary/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Cach hoat dong
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">3 buoc don gian</h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-border bg-card p-8">
              <div
                className="bg-clip-text text-5xl font-bold text-transparent"
                style={{ backgroundImage: "var(--gradient-hero)" }}
              >
                {s.n}
              </div>
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
    {
      name: "Mien phi",
      price: "0 VND",
      desc: "Trai nghiem cac tinh nang co ban",
      features: ["1 CV", "5 mau co ban", "Xuat PDF co watermark"],
      cta: "Bat dau",
      highlight: false,
    },
    {
      name: "Pro",
      price: "99K",
      suffix: "/thang",
      desc: "Danh cho nguoi tim viec nghiem tuc",
      features: [
        "CV khong gioi han",
        "30+ mau cao cap",
        "AI toi uu theo JD",
        "Xuat PDF khong watermark",
      ],
      cta: "Nang cap Pro",
      highlight: true,
    },
    {
      name: "Career+",
      price: "249K",
      suffix: "/thang",
      desc: "Toan dien cho phat trien su nghiep",
      features: [
        "Moi tinh nang Pro",
        "Cover letter AI",
        "Phan tich va cham diem CV",
        "Ho tro uu tien",
      ],
      cta: "Chon Career+",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Bang gia</p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Lua chon phu hop voi ban
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">Khong rang buoc, huy bat cu luc nao.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl border p-8 ${
                p.highlight
                  ? "border-primary bg-card shadow-[var(--shadow-elegant)]"
                  : "border-border bg-card"
              }`}
            >
              {p.highlight && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold text-primary-foreground"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  Pho bien nhat
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
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.65_0.15_175)]" /> {f}
                  </li>
                ))}
              </ul>
              <a
                href="#start"
                className={`mt-8 inline-flex w-full justify-center rounded-full px-5 py-2.5 font-medium transition ${
                  p.highlight
                    ? "text-primary-foreground hover:opacity-90"
                    : "bg-secondary text-foreground hover:bg-secondary/70"
                }`}
                style={p.highlight ? { background: "var(--gradient-hero)" } : undefined}
              >
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
        <div
          className="relative overflow-hidden rounded-3xl p-12 text-center text-primary-foreground sm:p-16"
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
            San sang cho cong viec mo uoc?
          </h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-lg opacity-90">
            Tham gia cung hang nghin ung vien da tin dung Jobredy AI de nang tam CV cua minh.
          </p>
          <a
            href="#"
            className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-background px-7 py-3 font-semibold text-foreground transition hover:scale-[1.02]"
          >
            Tao CV mien phi <ArrowRight className="h-4 w-4" />
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
          <span className="font-semibold text-foreground">Jobredy AI</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground">
            Dieu khoan
          </a>
          <a href="#" className="hover:text-foreground">
            Bao mat
          </a>
          <a href="#" className="hover:text-foreground">
            Lien he
          </a>
        </div>
      </div>
    </footer>
  );
}
