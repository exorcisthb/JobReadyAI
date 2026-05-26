import { useEffect, useMemo, useState, useCallback, memo } from "react";
import {
  Users,
  FileText,
  MessageSquare,
  BookOpen,
  Shield,
  Lock,
  Unlock,
  ToggleLeft,
  BarChart3,
  ShieldAlert,
  HelpCircle,
  UserPlus,
  TrendingUp,
  Activity,
  UserCog,
  PieChart as PieChartIcon,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart as RechartPie,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { DashboardHeader, type NavItem } from "@/components/dashboard-header";

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

const adminNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <BarChart3 className="h-5 w-5" />, href: "/admin/dashboard" },
  { label: "Quản lý người dùng", icon: <Users className="h-5 w-5" />, href: "/admin/dashboard#users" },
  { label: "Nội dung", icon: <BookOpen className="h-5 w-5" />, href: "/content-manager/dashboard" },
];

// Memoized StatCard
const StatCard = memo(({ title, value, icon, trend }: { title: string; value: number; icon: React.ReactNode; trend?: string }) => (
  <Card className="border border-border/40 bg-card/80 backdrop-blur-sm hover:shadow-md transition-all duration-300 group">
    <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</CardTitle>
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-2.5 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-extrabold tracking-tight">{value.toLocaleString()}</p>
      {trend && <p className="text-xs text-emerald-500 font-medium mt-1 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {trend}</p>}
    </CardContent>
  </Card>
));

// Memoized Tab Button
const TabButton = memo(({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
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
));

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "manager" | "admin">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

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
      setDataLoaded(true);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Đã có lỗi xảy ra.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [adminHeaders]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const updateUserStatus = useCallback(async (id: string, status: AdminUser["status"]) => {
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
  }, [adminHeaders, loadData]);

  const updateUserRole = useCallback(async (id: string, role: AdminUser["role"]) => {
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
  }, [adminHeaders, loadData]);

  const handleLogout = useCallback(() => {
    logout();
    window.location.assign("/");
  }, [logout]);

  const filteredUsers = useMemo(() => {
    if (activeTab === "manager") {
      return allUsers.filter((u) => u.role === "content_manager");
    }
    if (activeTab === "admin") {
      return allUsers.filter((u) => u.role === "admin");
    }
    return allUsers;
  }, [allUsers, activeTab]);

  const pieData = [
    { name: "Người dùng", value: stats?.total_users ?? 0, color: "#6366f1" },
    { name: "Content Manager", value: allUsers.filter((u) => u.role === "content_manager").length, color: "#a855f7" },
    { name: "Đã khóa", value: stats?.locked_users ?? 0, color: "#f59e0b" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader
        navItems={adminNavItems}
        activePath="/admin/dashboard"
        role="admin"
        onLogout={handleLogout}
      />

      <main className="pt-16 min-h-screen transition-all duration-300">
        <div className="p-6 lg:p-8 space-y-8" style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}>
          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                <Shield className="h-4 w-4" />
                Hệ thống quản lý
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Tổng quan hệ thống</h1>
              <p className="text-sm text-muted-foreground mt-1">Chào mừng bạn quay trở lại, {user?.name || "Admin"}</p>
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
                <ShieldAlert className="h-5 w-5 text-destructive shrink-0" />
                <div>
                  <h4 className="font-bold text-destructive text-sm">Lỗi thao tác</h4>
                  <p className="text-sm text-destructive/70">{error}</p>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Tổng Người Dùng"
              value={stats?.total_users ?? 0}
              icon={<Users className="h-5 w-5 text-primary" />}
              trend="+12% tuần này"
            />
            <StatCard
              title="Buổi Phỏng Vấn"
              value={stats?.total_sessions ?? 0}
              icon={<MessageSquare className="h-5 w-5 text-primary" />}
              trend="+8% tuần này"
            />
            <StatCard
              title="CV Đã Phân Tích"
              value={(stats?.total_cv_uploads ?? 0) + (stats?.total_cv_built ?? 0)}
              icon={<FileText className="h-5 w-5 text-primary" />}
            />
            <StatCard
              title="Bài Viết Xuất Bản"
              value={stats?.published_articles ?? 0}
              icon={<BookOpen className="h-5 w-5 text-primary" />}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activity Chart */}
            <Card className="border border-border/40 bg-card/80 backdrop-blur-sm lg:col-span-2 overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-2.5">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Biểu đồ hoạt động 7 ngày</CardTitle>
                    <CardDescription className="text-xs">Lượt đăng ký & buổi phỏng vấn</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-64">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.activity ?? []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
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
                          borderRadius: "8px",
                          color: "var(--color-foreground)",
                          fontSize: "12px",
                        }}
                        labelFormatter={(label) => `Ngày: ${new Date(label).toLocaleDateString()}`}
                      />
                      <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "12px" }} />
                      <Area
                        name="Đăng ký mới"
                        type="monotone"
                        dataKey="signups"
                        stroke="#6366f1"
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

            {/* Pie Chart */}
            <Card className="border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-2.5">
                    <PieChartIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Phân bố tài khoản</CardTitle>
                    <CardDescription className="text-xs">Theo vai trò</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-64">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartPie>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          borderColor: "var(--color-border)",
                          borderRadius: "8px",
                          color: "var(--color-foreground)",
                          fontSize: "12px",
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{ fontSize: "12px" }}
                      />
                    </RechartPie>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* User Management */}
          <Card className="border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-2.5">
                    <UserCog className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Quản lý tài khoản</CardTitle>
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
                            {new Date(item.created_at).toLocaleDateString("vi-VN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2 justify-center">
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
                                {item.status === "active" ? (
                                  <><Lock className="h-3.5 w-3.5" /> Khóa</>
                                ) : (
                                  <><Unlock className="h-3.5 w-3.5" /> Mở khóa</>
                                )}
                              </button>

                              <button
                                onClick={() => {
                                  const nextRole = item.role === "user" ? "content_manager" : "user";
                                  void updateUserRole(item.id, nextRole);
                                }}
                                disabled={item.id === user?.id}
                                className={`flex items-center gap-1.5 rounded-md border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-muted/50 cursor-pointer ${
                                  item.id === user?.id ? "opacity-40 cursor-not-allowed" : ""
                                }`}
                              >
                                <ToggleLeft className="h-3.5 w-3.5" />
                                Đổi vai
                              </button>
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
    </div>
  );
}
