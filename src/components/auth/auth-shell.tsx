import Link from "next/link";
import { Sparkles } from "lucide-react";

type AuthShellProps = {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
};

export function AuthShell({ children, eyebrow, title, description }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-soft)" }} />
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Jobredy<span className="text-primary"> AI</span>
          </span>
        </Link>
        <Link
          href="/"
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          Về trang chủ
        </Link>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
          <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card/70 p-4">
              <strong className="block text-foreground">Email + mật khẩu</strong>
              Đăng ký và đăng nhập bằng thông tin tài khoản cơ bản.
            </div>
            <div className="rounded-2xl border border-border bg-card/70 p-4">
              <strong className="block text-foreground">Google OAuth</strong>
              Sẵn sàng nối Google provider khi có credentials.
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-8 -z-10 rounded-3xl opacity-50 blur-3xl"
            style={{ background: "var(--gradient-hero)" }}
          />
          {children}
        </div>
      </section>
    </main>
  );
}
