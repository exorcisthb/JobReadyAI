import { Activity, FileText, LogOut, Shield, Sparkles, Users } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

export function AdminDashboardPage() {
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    window.location.assign("/");
  }

  // Simulated list of recent users for the admin demo
  const recentUsers = [
    { id: "1", name: "Nguyễn Văn A", phone: "0912345678", role: "user", status: "active", date: "2026-05-23" },
    { id: "2", name: "Trần Thị B", phone: "0987654321", role: "user", status: "active", date: "2026-05-22" },
    { id: "3", name: "System Administrator", phone: "0900000000", role: "admin", status: "active", date: "2026-05-20" },
    { id: "4", name: "Lê Văn C", phone: "0933333333", role: "user", status: "pending", date: "2026-05-19" },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
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
          
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20 md:flex">
              <Shield className="h-3.5 w-3.5" />
              Quyền Admin
            </span>
            
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Hệ thống quản trị</p>
            <h1 className="mt-1 text-4xl font-bold tracking-tight">
              Xin chào, {user?.name ?? "Administrator"}
            </h1>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500 border border-emerald-500/20 md:hidden">
            <Shield className="h-3.5 w-3.5" /> Admin Mode
          </span>
        </div>

        {/* Stats Cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-elegant)]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Tổng người dùng</span>
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold">128</p>
            <p className="mt-1 text-xs text-muted-foreground">+12 người dùng mới tuần này</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-elegant)]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">CV đã phân tích</span>
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold">1,024</p>
            <p className="mt-1 text-xs text-muted-foreground">+85 lượt tối ưu hóa thành công</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-elegant)]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Trạng thái hệ thống</span>
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-emerald-500">99.9%</p>
            <p className="mt-1 text-xs text-muted-foreground">Hoạt động ổn định (API OK)</p>
          </div>
        </div>

        {/* User Management Section */}
        <div className="mt-10 rounded-2xl border border-border bg-card overflow-hidden shadow-[var(--shadow-elegant)]">
          <div className="border-b border-border bg-card/50 px-6 py-4">
            <h2 className="text-lg font-bold">Quản lý người dùng gần đây</h2>
            <p className="text-xs text-muted-foreground">Danh sách tài khoản vừa đăng ký trên hệ thống</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase">
                <tr>
                  <th className="px-6 py-3">Tên</th>
                  <th className="px-6 py-3">Số điện thoại</th>
                  <th className="px-6 py-3">Vai trò</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3">Ngày đăng ký</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentUsers.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium">{item.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{item.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        item.role === "admin" 
                          ? "bg-primary/10 text-primary border border-primary/20" 
                          : "bg-secondary text-secondary-foreground border border-border"
                      }`}>
                        {item.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                        item.status === "active" ? "text-emerald-500" : "text-amber-500"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          item.status === "active" ? "bg-emerald-500" : "bg-amber-500"
                        }`} />
                        {item.status === "active" ? "Hoạt động" : "Chờ kích hoạt"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
