import { useEffect, useMemo, useState, useCallback, memo } from "react";
import {
  Users,
  FileText,
  MessageSquare,
  BookOpen,
  Shield,
  BarChart3,
  ShieldAlert,
  UserPlus,
  TrendingUp,
  Activity,
  PieChart as PieChartIcon,
  Newspaper,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
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

const adminNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <BarChart3 className="h-5 w-5" />, href: "/admin/dashboard" },
  {
    label: "Quản lý người dùng",
    icon: <Users className="h-5 w-5" />,
    href: "/admin/users",
  },
  { label: "Trò chuyện", icon: <MessageCircle className="h-5 w-5" />, href: "/messages" },
  { label: "Blog Career", icon: <BookOpen className="h-5 w-5" />, href: "/blog" },
  { label: "Điểm Tin Báo Chí", icon: <Newspaper className="h-5 w-5" />, href: "/news" },
];

// Memoized StatCard
const StatCard = memo(
  ({
    title,
    value,
    icon,
    trend,
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    trend?: string;
  }) => (
    <Card className="border border-border/40 bg-card/80 backdrop-blur-sm hover:shadow-md transition-all duration-300 group">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </CardTitle>
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-2.5 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-extrabold tracking-tight">{value.toLocaleString()}</p>
        {trend && (
          <p className="text-xs text-emerald-500 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> {trend}
          </p>
        )}
      </CardContent>
    </Card>
  ),
);

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      const response = await fetch("/api/admin/stats", { headers: adminHeaders });
      if (!response.ok) throw new Error("Không thể tải dữ liệu dashboard admin.");
      setStats((await response.json()) as SystemStats);
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

  const handleLogout = useCallback(() => {
    logout();
    window.location.assign("/");
  }, [logout]);

  const pieData = [
    { name: "Người dùng", value: stats?.total_users ?? 0, color: "#6366f1" },
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
        <div
          className="p-6 lg:p-8 space-y-8"
          style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}
        >
          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                <Shield className="h-4 w-4" />
                Hệ thống quản lý
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Tổng quan hệ thống</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Chào mừng bạn quay trở lại, {user?.name || "Admin"}
              </p>
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
                    <CardDescription className="text-xs">
                      Lượt đăng ký & buổi phỏng vấn
                    </CardDescription>
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
                    <AreaChart
                      data={stats?.activity ?? []}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
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
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="var(--color-border)"
                      />
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

        </div>
      </main>
    </div>
  );
}
