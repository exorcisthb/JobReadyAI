import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, LogOut, Sparkles } from "lucide-react";
import { getDemoSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getDemoSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
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
          <a
            href="/api/auth/logout"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Dang xuat
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {session.provider === "google" ? "Google account" : "Email account"}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Xin chao, {session.name}</h1>
          <p className="mt-3 text-muted-foreground">{session.email}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {["Tao CV moi", "Toi uu theo JD", "Xuat PDF"].map((item) => (
              <div key={item} className="rounded-2xl border border-border bg-background p-5">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="mt-4 font-semibold">{item}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Khu vuc mau de noi tiep cac chuc nang CV that sau nay.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
