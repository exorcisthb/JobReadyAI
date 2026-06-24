import { useEffect, useMemo, useState, useCallback } from "react";
import { Users, Shield, UserPlus, HelpCircle, Lock, Unlock, ToggleLeft, UserMinus, AlertTriangle, BarChart3, CreditCard, ShieldAlert, Wrench } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DashboardHeader, type NavItem } from "@/components/dashboard-header";

interface AdminUser {
  id: string;
  email: string;
  role: "user" | "content_manager" | "admin";
  status: "active" | "locked";
  created_at: string;
}

const adminNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <BarChart3 className="h-5 w-5" />, href: "/admin/dashboard" },
  {
    label: "Quản lý người dùng",
    icon: <Users className="h-5 w-5" />,
    href: "/admin/users",
  },
  { label: "Tài chính", icon: <CreditCard className="h-5 w-5" />, href: "/admin/finance" },
  { label: "Bảo mật", icon: <ShieldAlert className="h-5 w-5" />, href: "/admin/security" },
  { label: "Bảo trì", icon: <Wrench className="h-5 w-5" />, href: "/admin/maintenance" },
];

const TabButton = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    }`}
  >
    {label}
  </button>
);

export default function UserManagementPage() {
  const { user, logout } = useAuth();
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "manager" | "admin">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDemote, setConfirmDemote] = useState<AdminUser | null>(null);
  const [demoting, setDemoting] = useState(false);

  const adminHeaders = useMemo(
    () => ({
      "x-user-role": user?.role ?? "",
      "x-user-id": user?.id ?? "",
    }),
    [user?.id, user?.role],
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/users?limit=100", { headers: adminHeaders });
      if (!response.ok) throw new Error("Không thể tải danh sách người dùng.");
      setAllUsers((await response.json()) as AdminUser[]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Đã có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  }, [adminHeaders]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const updateUserStatus = useCallback(
    async (id: string, status: AdminUser["status"]) => {
      setError(null);
      try {
        const response = await fetch(`/api/admin/users/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...adminHeaders },
          body: JSON.stringify({ status }),
        });
        if (!response.ok) throw new Error("Cập nhật trạng thái thất bại.");
        await loadData();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
      }
    },
    [adminHeaders, loadData],
  );

  const updateUserRole = useCallback(
    async (id: string, role: AdminUser["role"]) => {
      setError(null);
      try {
        const response = await fetch(`/api/admin/users/${id}/role`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...adminHeaders },
          body: JSON.stringify({ role }),
        });
        if (!response.ok) throw new Error("Cập nhật vai trò thất bại.");
        await loadData();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
      }
    },
    [adminHeaders, loadData],
  );

  const handleConfirmDemote = useCallback(async () => {
    if (!confirmDemote) return;
    setDemoting(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/users/${confirmDemote.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...adminHeaders },
        body: JSON.stringify({ role: "user" }),
      });
      if (!response.ok) throw new Error("Xóa vai trò Manager thất bại.");
      setConfirmDemote(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    } finally {
      setDemoting(false);
    }
  }, [confirmDemote, adminHeaders, loadData]);

  const handleLogout = useCallback(() => {
    logout();
    window.location.assign("/");
  }, [logout]);

  const filteredUsers = useMemo(() => {
    if (activeTab === "manager") return allUsers.filter((u) => u.role === "content_manager");
    if (activeTab === "admin") return allUsers.filter((u) => u.role === "admin");
    return allUsers;
  }, [allUsers, activeTab]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader
        navItems={adminNavItems}
        activePath="/admin/users"
        role="admin"
        onLogout={handleLogout}
      />

      <main className="pt-16 min-h-screen transition-all duration-300">
        <div className="p-6 lg:p-8 space-y-8" style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                <Users className="h-4 w-4" />
                Quản lý người dùng
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Tài khoản hệ thống</h1>
            </div>
            <Button
              onClick={() => window.location.assign("/admin/create-content-manager")}
              className="rounded-xl flex items-center gap-2 bg-gradient-to-r from-primary to-accent-mint hover:opacity-90 text-white shadow-md shadow-primary/20 transition-all duration-300"
            >
              <UserPlus className="h-4 w-4" />
              Tạo Manager
            </Button>
          </div>

          {error ? (
            <Card className="border-destructive/30 bg-destructive/10">
              <CardContent className="flex items-center gap-3 p-4">
                <Shield className="h-5 w-5 text-destructive shrink-0" />
                <div>
                  <h4 className="font-bold text-destructive text-sm">Lỗi thao tác</h4>
                  <p className="text-sm text-destructive/70">{error}</p>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card className="border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-2.5">
                    <UserPlus className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Tất cả tài khoản</CardTitle>
                    <CardDescription className="text-xs">{filteredUsers.length} tài khoản</CardDescription>
                  </div>
                </div>
                <div className="flex bg-muted/30 rounded-lg p-1 border border-border/30">
                  <TabButton label="Tất cả" isActive={activeTab === "all"} onClick={() => setActiveTab("all")} />
                  <TabButton label="Managers" isActive={activeTab === "manager"} onClick={() => setActiveTab("manager")} />
                  <TabButton label="Admins" isActive={activeTab === "admin"} onClick={() => setActiveTab("admin")} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-16">
                  <HelpCircle className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium text-sm">Không tìm thấy tài khoản</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-muted/20 border-b border-border/30 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      <tr>
                        <th className="px-5 py-4">Tài khoản</th>
                        <th className="px-5 py-4">Vai trò</th>
                        <th className="px-5 py-4">Trạng thái</th>
                        <th className="px-5 py-4">Ngày đăng ký</th>
                        <th className="px-5 py-4 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {filteredUsers.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/5 transition-colors duration-150">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 text-sm font-bold text-primary">
                                {item.email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{item.email}</p>
                                <p className="text-xs text-muted-foreground">ID: {item.id.slice(0, 8)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <Badge variant="outline" className={`font-semibold text-xs ${
                              item.role === "content_manager"
                                ? "border-purple-500/30 bg-purple-50 text-purple-700 dark:border-purple-500/30 dark:bg-purple-950/20 dark:text-purple-400"
                                : item.role === "admin"
                                  ? "border-rose-500/30 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/20 dark:text-rose-400"
                                  : "border-slate-500/30 bg-slate-50 text-slate-700 dark:border-slate-500/30 dark:bg-slate-950/20 dark:text-slate-400"
                            }`}>
                              {item.role === "content_manager" ? "Content Manager" : item.role === "admin" ? "Administrator" : "User"}
                            </Badge>
                          </td>
                          <td className="px-5 py-4">
                            <Badge variant="outline" className={`font-semibold text-xs ${
                              item.status === "active"
                                ? "border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/20 dark:text-emerald-400"
                                : "border-amber-500/30 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-400"
                            }`}>
                              {item.status === "active" ? "Đang hoạt động" : "Bị khóa"}
                            </Badge>
                          </td>
                          <td className="px-5 py-4 text-muted-foreground text-xs">
                            {new Date(item.created_at).toLocaleDateString("vi-VN", { year: "numeric", month: "short", day: "numeric" })}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2 justify-center flex-wrap">
                              <button
                                onClick={() => {
                                  const nextStatus = item.status === "active" ? "locked" : "active";
                                  void updateUserStatus(item.id, nextStatus);
                                }}
                                disabled={item.id === user?.id}
                                className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
                                  item.status === "active"
                                    ? "border-amber-500/30 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-950/40"
                                    : "border-emerald-500/30 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
                                } ${item.id === user?.id ? "opacity-40 cursor-not-allowed" : ""}`}
                              >
                                {item.status === "active" ? <><Lock className="h-3.5 w-3.5" /> Khóa</> : <><Unlock className="h-3.5 w-3.5" /> Mở khóa</>}
                              </button>
                              {item.role === "user" && (
                                <button
                                  onClick={() => void updateUserRole(item.id, "content_manager")}
                                  disabled={item.id === user?.id}
                                  className={`flex items-center gap-1.5 rounded-md border border-purple-500/30 bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100 dark:border-purple-500/30 dark:bg-purple-950/20 dark:text-purple-400 dark:hover:bg-purple-950/40 transition-all duration-200 cursor-pointer ${item.id === user?.id ? "opacity-40 cursor-not-allowed" : ""}`}
                                >
                                  <ToggleLeft className="h-3.5 w-3.5" /> Thêm Manager
                                </button>
                              )}
                              {item.role === "content_manager" && (
                                <button
                                  onClick={() => setConfirmDemote(item)}
                                  disabled={item.id === user?.id}
                                  className={`flex items-center gap-1.5 rounded-md border border-rose-500/30 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-all duration-200 cursor-pointer ${item.id === user?.id ? "opacity-40 cursor-not-allowed" : ""}`}
                                >
                                  <UserMinus className="h-3.5 w-3.5" /> Xóa Manager
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {confirmDemote && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !demoting && setConfirmDemote(null)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slide-in-up">
            <div className="flex items-center gap-4 p-6 border-b border-border/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 shrink-0">
                <AlertTriangle className="h-6 w-6 text-rose-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Xóa quyền Manager</h2>
                <p className="text-xs text-muted-foreground">Thao tác này sẽ hạ cấp tài khoản</p>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-sm leading-relaxed">
                Bạn có chắc chắn muốn xóa quyền{" "}
                <span className="font-semibold text-purple-600 dark:text-purple-400">Content Manager</span> của tài khoản:
              </p>
              <div className="rounded-xl bg-muted/40 border border-border/50 px-4 py-3">
                <p className="text-sm font-bold truncate">{confirmDemote.email}</p>
                <p className="text-xs text-muted-foreground mt-0.5">ID: {confirmDemote.id.slice(0, 16)}...</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tài khoản này sẽ được chuyển về vai trò <span className="font-semibold">Người dùng thông thường</span> và mất toàn bộ quyền quản lý nội dung.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border/50">
              <button onClick={() => setConfirmDemote(null)} disabled={demoting} className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50">
                Hủy bỏ
              </button>
              <button onClick={() => void handleConfirmDemote()} disabled={demoting} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-rose-500 hover:bg-rose-600 text-white transition-colors cursor-pointer disabled:opacity-70">
                {demoting ? (
                  <div className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : <UserMinus className="h-3.5 w-3.5" />}
                {demoting ? "Đang xóa..." : "Xóa quyền Manager"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
