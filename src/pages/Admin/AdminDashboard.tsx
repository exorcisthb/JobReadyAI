import { useEffect, useMemo, useState } from "react";
import { BookOpen, FileText, MessageSquare, Users, Shield, LogOut, ArrowRight, UserPlus, ToggleLeft, Lock, Unlock, ShieldAlert, BarChart3, HelpCircle } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

interface ActivityDay {
  date: string;
  signups: number;
  sessions: number;
}

interface SystemStats {
  total_users: number;
  locked_users: number;
  total_sessions: number;
  total_cv_uploads: number;
  total_cv_built: number;
  total_jd_comparisons: number;
  active_questions: number;
  published_articles: number;
  activity?: ActivityDay[];
}

interface AdminUser {
  id: string;
  email: string;
  role: "user" | "content_manager" | "admin";
  status: "active" | "locked";
  created_at: string;
}

const roleBadgeMap: Record<AdminUser["role"], string> = {
  user: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/30 dark:bg-blue-950/20 dark:text-blue-400",
  content_manager: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/30 dark:bg-purple-950/20 dark:text-purple-400",
  admin: "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400",
};

const statusBadgeMap: Record<AdminUser["status"], string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-950/30 dark:bg-emerald-950/20 dark:text-emerald-400",
  locked: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-950/30 dark:bg-amber-950/20 dark:text-amber-400",
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "manager" | "admin">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const adminHeaders = useMemo(
    () => ({
      "x-user-role": user?.role ?? "",
      "x-user-id": user?.id ?? "",
    }),
    [user?.id, user?.role],
  );

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [statsResponse, usersResponse] = await Promise.all([
        fetch("/api/admin/stats", { headers: adminHeaders }),
        fetch("/api/admin/users?limit=100", { headers: adminHeaders }),
      ]);

      if (!statsResponse.ok || !usersResponse.ok) {
        throw new Error("Không thể tải dữ liệu dashboard admin.");
      }

      const statsData = (await statsResponse.json()) as SystemStats;
      const usersData = (await usersResponse.json()) as AdminUser[];
      setStats(statsData);
      setAllUsers(usersData);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Đã có lỗi xảy ra.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function updateUserStatus(id: string, status: AdminUser["status"]) {
    setError(null);
    try {
      const response = await fetch(`/api/admin/users/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...adminHeaders },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        throw new Error("Cập nhật trạng thái thất bại.");
      }
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    }
  }

  async function updateUserRole(id: string, role: AdminUser["role"]) {
    setError(null);
    try {
      const response = await fetch(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...adminHeaders },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) {
        throw new Error("Cập nhật vai trò thất bại.");
      }
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    }
  }

  function handleLogout() {
    logout();
    window.location.assign("/");
  }

  // Filtered users based on active tab
  const filteredUsers = useMemo(() => {
    if (activeTab === "manager") {
      return allUsers.filter((u) => u.role === "content_manager");
    }
    if (activeTab === "admin") {
      return allUsers.filter((u) => u.role === "admin");
    }
    return allUsers;
  }, [allUsers, activeTab]);

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Soft background glow circles */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-border/60 bg-card/70 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground shadow-md"
              style={{ background: "var(--gradient-hero)" }}
            >
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              JobReady<span className="text-primary"> Admin</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20 md:flex">
              <Shield className="h-3.5 w-3.5" />
              Quyền Quản Trị
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="rounded-full flex items-center gap-2 hover:bg-secondary border-border"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-10 space-y-8 relative z-10">
        {/* Title Section */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Hệ thống quản lý</p>
            <h1 className="text-3xl font-bold tracking-tight">Tổng quan hệ thống</h1>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500 border border-emerald-500/20 md:hidden">
            Admin Mode
          </span>
        </div>

        {error ? (
          <Card className="border-destructive/30 bg-destructive/10 text-destructive text-sm p-4 rounded-xl flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-bold">Lỗi thao tác</h4>
              <p className="mt-0.5">{error}</p>
            </div>
          </Card>
        ) : null}

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Tổng Người Dùng" value={stats?.total_users ?? 0} icon={<Users className="h-5 w-5 text-primary" />} />
          <StatCard title="Buổi Phỏng Vấn" value={stats?.total_sessions ?? 0} icon={<MessageSquare className="h-5 w-5 text-primary" />} />
          <StatCard title="CV Đã Phân Tích" value={(stats?.total_cv_uploads ?? 0) + (stats?.total_cv_built ?? 0)} icon={<FileText className="h-5 w-5 text-primary" />} />
          <StatCard title="Bài Viết Xuất Bản" value={stats?.published_articles ?? 0} icon={<BookOpen className="h-5 w-5 text-primary" />} />
        </div>

        {/* Activity Chart Section */}
        <Card className="border border-border/60 bg-card/75 backdrop-blur-sm shadow-[var(--shadow-elegant)] overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Biểu đồ hoạt động hệ thống</CardTitle>
                <CardDescription>Theo dõi lượt đăng ký mới (Signups) và số buổi phỏng vấn (Sessions) trong 7 ngày qua</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-80 pt-4">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                Đang tải dữ liệu biểu đồ...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.activity ?? []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="date" 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: string) => {
                      const d = new Date(value);
                      return `${d.getDate()}/${d.getMonth() + 1}`;
                    }}
                    style={{ fontSize: "12px", fill: "var(--color-muted-foreground)" }}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    style={{ fontSize: "12px", fill: "var(--color-muted-foreground)" }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "var(--color-card)", 
                      borderColor: "var(--color-border)",
                      borderRadius: "12px",
                      color: "var(--color-foreground)"
                    }}
                    labelFormatter={(label) => `Ngày: ${new Date(label).toLocaleDateString()}`}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Area
                    name="Đăng ký mới"
                    type="monotone"
                    dataKey="signups"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSignups)"
                  />
                  <Area
                    name="Buổi phỏng vấn"
                    type="monotone"
                    dataKey="sessions"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSessions)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* User Management Section */}
        <Card className="border border-border/60 bg-card/75 backdrop-blur-sm shadow-[var(--shadow-elegant)] overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-5">
            <div>
              <CardTitle>Danh sách tài khoản</CardTitle>
              <CardDescription>Bật/tắt trạng thái hoạt động hoặc phân quyền cho người dùng</CardDescription>
            </div>
            
            {/* Tabs & Buttons for Operations */}
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex bg-muted/40 rounded-xl p-1 border border-border/50">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === "all" ? "bg-background shadow text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Tất cả
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("manager")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === "manager" ? "bg-background shadow text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Content Managers
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("admin")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeTab === "admin" ? "bg-background shadow text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Admins
                </button>
              </div>
              
              <Button 
                onClick={() => window.location.assign("/admin/create-content-manager")}
                size="sm"
                className="rounded-xl flex items-center gap-1.5 text-xs bg-primary hover:bg-primary-hover"
              >
                <UserPlus className="h-4 w-4" />
                Tạo Manager
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            {loading ? (
              <p className="text-sm text-muted-foreground p-6 text-center">Đang tải danh sách người dùng...</p>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 px-6">
                <HelpCircle className="h-10 w-10 text-muted-foreground/60 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium text-sm">Không tìm thấy tài khoản phù hợp ở mục này.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-muted/30 border-b border-border/40 text-xs font-semibold text-muted-foreground uppercase">
                  <tr>
                    <th className="px-6 py-4">Tài khoản (Email)</th>
                    <th className="px-6 py-4">Vai trò</th>
                    <th className="px-6 py-4">Trạng thái hoạt động</th>
                    <th className="px-6 py-4">Ngày đăng ký</th>
                    <th className="px-6 py-4 text-center">Thao tác quản lý</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredUsers.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-semibold">{item.email}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`font-semibold text-xs border ${roleBadgeMap[item.role]}`}>
                          {item.role === "content_manager" ? "Content Manager" : item.role === "admin" ? "Administrator" : "User"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`font-semibold text-xs border ${statusBadgeMap[item.status]}`}>
                          {item.status === "active" ? "Đang hoạt động" : "Bị khóa"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        {new Date(item.created_at).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-4 flex gap-2 justify-center items-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const nextStatus = item.status === "active" ? "locked" : "active";
                            void updateUserStatus(item.id, nextStatus);
                          }}
                          disabled={item.id === user?.id} // Cannot lock oneself
                          className={`rounded-xl h-8 text-xs font-semibold flex items-center gap-1.5 border border-border/60 ${
                            item.status === "active" 
                              ? "hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/20" 
                              : "hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/20"
                          }`}
                        >
                          {item.status === "active" ? (
                            <>
                              <Lock className="h-3.5 w-3.5" />
                              Khóa
                            </>
                          ) : (
                            <>
                              <Unlock className="h-3.5 w-3.5" />
                              Mở khóa
                            </>
                          )}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            const nextRole = item.role === "user" ? "content_manager" : "user";
                            void updateUserRole(item.id, nextRole);
                          }}
                          disabled={item.id === user?.id} // Cannot demote oneself
                          className="rounded-xl h-8 text-xs font-semibold flex items-center gap-1.5 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                        >
                          <ToggleLeft className="h-3.5 w-3.5" />
                          Đổi vai trò
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card className="border border-border/60 bg-card/75 backdrop-blur-sm shadow-[var(--shadow-elegant)] hover:shadow-md transition-shadow relative overflow-hidden group">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground">{title}</CardTitle>
        <div className="rounded-xl bg-primary/5 border border-primary/10 p-2.5 transition-transform group-hover:scale-105">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-extrabold tracking-tight">{value.toLocaleString()}</p>
      </CardContent>
      {/* Micro glow line at top on hover */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-primary to-primary-hover opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
}
