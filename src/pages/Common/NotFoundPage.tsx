import { ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">404</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">Không tìm thấy trang</h1>
        <p className="mt-4 text-muted-foreground">
          Đường dẫn này chưa có trong router React hiện tại.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-primary-foreground"
          style={{ background: "var(--gradient-hero)" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Về trang chủ
        </a>
      </div>
    </main>
  );
}
