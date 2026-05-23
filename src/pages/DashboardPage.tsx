import { FileText, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

export function DashboardPage() {
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    window.location.assign("/");
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
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
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Dashboard</p>
        <h1 className="mt-3 flex items-center gap-2 text-4xl font-bold tracking-tight">
          Xin chào, {user?.name ?? "JobReady user"}
          {user?.role === "admin" && (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
              Admin
            </span>
          )}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Đây là dashboard React thuần cho luồng demo. Từ đây bạn có thể phát triển tiếp các module
          quản lý CV, template và phân tích JD mà không phụ thuộc vào file `page.tsx` của Next.js.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {["CV của tôi", "Tối ưu theo JD", "Mẫu CV"].map((title) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6">
              <FileText className="h-6 w-6 text-primary" />
              <h2 className="mt-4 text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Khu vực sẵn sàng để nối dữ liệu thật hoặc mở rộng tính năng.
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
