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
  CreditCard,
  Wrench,
  Zap,
  Server,
  X,
  Database,
  Globe,
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
  online_users?: number;
  realtime_online?: number;
  max_concurrent_limit?: number;
  activity?: ActivityDay[];
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
  { label: "User Activity", icon: <Activity className="h-5 w-5" />, href: "/admin/user-activity" },
  { label: "Bảo trì", icon: <Wrench className="h-5 w-5" />, href: "/admin/maintenance" },
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

  const [updatingCapacity, setUpdatingCapacity] = useState(false);
  const [showScaleModal, setShowScaleModal] = useState(false);
  const [dismissedAlert, setDismissedAlert] = useState(false);

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

  const updateCapacityLimit = useCallback(async (limitVal: number) => {
    setUpdatingCapacity(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/settings/capacity", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...adminHeaders,
        },
        body: JSON.stringify({ limit: limitVal }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Không thể cập nhật giới hạn tải trọng.");
      }
      await loadData();
      setShowScaleModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    } finally {
      setUpdatingCapacity(false);
    }
  }, [adminHeaders, loadData]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleLogout = useCallback(() => {
    logout();
    window.location.assign("/");
  }, [logout]);

  const onlineUsers = stats?.realtime_online ?? stats?.online_users ?? 0;
  const maxConcurrentLimit = stats?.max_concurrent_limit ?? 200;

  const activeThreshold = useMemo(() => {
    const ratio = onlineUsers / (maxConcurrentLimit || 1);
    if (ratio >= 1.0) {
      return {
        level: "critical" as const,
        color: "rose" as const,
        icon: Zap,
        title: "🚨 NGHIÊM TRỌNG: Quá tải hệ thống!",
        desc: `Hệ thống đang có ${onlineUsers} người dùng online (Giới hạn hiện tại: ${maxConcurrentLimit === 999999 ? "Vô hạn" : maxConcurrentLimit}). Web có thể bị sập nếu không hành động.`,
        actions: [
          "Tăng giới hạn tải trọng hệ thống lập tức (Click nút 'Mở rộng tải trọng')",
          "Nâng cấp server lên ít nhất 8GB RAM, 4 CPU cores",
          "Bật auto-scaling trên cloud provider",
          "Thiết lập Load Balancer (Nginx / AWS ALB)",
        ],
      };
    } else if (ratio >= 0.9) {
      return {
        level: "alert" as const,
        color: "orange" as const,
        icon: Server,
        title: "🔶 Cảnh báo cao: Hệ thống gần đạt giới hạn tải trọng",
        desc: `Hệ thống đang có ${onlineUsers} người dùng online (Giới hạn hiện tại: ${maxConcurrentLimit === 999999 ? "Vô hạn" : maxConcurrentLimit}). Cần nâng cấp để tránh sập web.`,
        actions: [
          "Nâng cấp giới hạn tải trọng hệ thống lên mức cao hơn",
          "Nâng cấp plan hosting/cloud (RAM ≥ 4GB)",
          "Bật connection pooling cho PostgreSQL (PgBouncer)",
          "Thiết lập Redis cache cho session",
        ],
      };
    } else if (ratio >= 0.8) {
      return {
        level: "warning" as const,
        color: "amber" as const,
        icon: TrendingUp,
        title: "⚠️ Cảnh báo: Lượng người dùng online đang tăng",
        desc: `Hệ thống đang có ${onlineUsers} người dùng online (Giới hạn hiện tại: ${maxConcurrentLimit === 999999 ? "Vô hạn" : maxConcurrentLimit}). Cần theo dõi hiệu suất.`,
        actions: [
          "Kiểm tra query performance",
          "Thêm database index nếu cần",
          "Monitor RAM/CPU server",
          "Cân nhắc mở rộng giới hạn tải trọng hệ thống",
        ],
      };
    }
    return null;
  }, [onlineUsers, maxConcurrentLimit]);

  const colorMap = {
    amber: { bg: "bg-amber-50 dark:bg-amber-950/20", border: "border-amber-400/40", text: "text-amber-700 dark:text-amber-400", btn: "bg-amber-500 hover:bg-amber-600" },
    orange: { bg: "bg-orange-50 dark:bg-orange-950/20", border: "border-orange-400/40", text: "text-orange-700 dark:text-orange-400", btn: "bg-orange-500 hover:bg-orange-600" },
    rose:   { bg: "bg-rose-50 dark:bg-rose-950/20",   border: "border-rose-400/40",   text: "text-rose-700 dark:text-rose-400",   btn: "bg-rose-500 hover:bg-rose-600" },
  } as const;

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
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowScaleModal(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  activeThreshold
                    ? `${colorMap[activeThreshold.color].bg} ${colorMap[activeThreshold.color].border} ${colorMap[activeThreshold.color].text} animate-pulse`
                    : "bg-secondary border-border text-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                {activeThreshold ? <activeThreshold.icon className="h-4 w-4" /> : <Server className="h-4 w-4" />}
                Quản lý tải trọng ({onlineUsers}/{maxConcurrentLimit === 999999 ? "∞" : maxConcurrentLimit})
              </button>
              <Button
                onClick={() => window.location.assign("/admin/create-content-manager")}
                className="rounded-xl flex items-center gap-2 bg-gradient-to-r from-primary to-accent-mint hover:opacity-90 text-white shadow-md shadow-primary/20 transition-all duration-300"
              >
                <UserPlus className="h-4 w-4" />
                Tạo Manager
              </Button>
            </div>
          </div>

          {/* Scale alert banner */}
          {activeThreshold && !dismissedAlert && (
            <div className={`flex items-start gap-4 rounded-2xl border p-4 ${colorMap[activeThreshold.color].bg} ${colorMap[activeThreshold.color].border}`}>
              <activeThreshold.icon className={`h-5 w-5 shrink-0 mt-0.5 ${colorMap[activeThreshold.color].text}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${colorMap[activeThreshold.color].text}`}>{activeThreshold.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {activeThreshold.desc}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowScaleModal(true)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-colors ${colorMap[activeThreshold.color].btn}`}
                >
                  Xem hướng dẫn
                </button>
                <button onClick={() => setDismissedAlert(true)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard
              title="Tổng Người Dùng"
              value={stats?.total_users ?? 0}
              icon={<Users className="h-5 w-5 text-primary" />}
              trend="+12% tuần này"
            />
            <StatCard
              title="Người Dùng Online"
              value={stats?.realtime_online ?? stats?.online_users ?? 0}
              icon={<Activity className="h-5 w-5 text-emerald-500 animate-pulse" />}
              trend={`Giới hạn: ${stats?.max_concurrent_limit === 999999 ? "Vô hạn" : stats?.max_concurrent_limit ?? 200}`}
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

      {/* Scale alert modal */}
      {showScaleModal && (() => {
        const modalInfo = activeThreshold || {
          level: "normal" as const,
          color: "amber" as const,
          icon: Server,
          title: "⚙️ Quản lý tải trọng hệ thống",
          desc: `Hệ thống đang hoạt động bình thường với ${onlineUsers} người dùng online (Giới hạn hiện tại: ${maxConcurrentLimit === 999999 ? "Vô hạn" : maxConcurrentLimit}).`,
          actions: [
            "Bạn có thể mở rộng tải trọng hệ thống trước khi có lượng truy cập lớn.",
            "Thực hiện tối ưu hóa database index định kỳ để tránh quá tải database.",
            "Theo dõi mức sử dụng RAM/CPU của máy chủ định kỳ.",
          ],
        };

        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowScaleModal(false)} />
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
              <div className={`flex items-center gap-4 p-6 border-b border-border/50 rounded-t-2xl ${colorMap[modalInfo.color].bg}`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${colorMap[modalInfo.color].bg} border ${colorMap[modalInfo.color].border}`}>
                  <modalInfo.icon className={`h-6 w-6 ${colorMap[modalInfo.color].text}`} />
                </div>
                <div className="flex-1">
                  <h2 className={`text-base font-bold ${colorMap[modalInfo.color].text}`}>{modalInfo.title}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {modalInfo.desc}
                  </p>
                </div>
                <button onClick={() => setShowScaleModal(false)} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-muted/40 border border-border/30 p-3 text-center">
                    <p className="text-lg font-black">{onlineUsers.toLocaleString("vi-VN")}</p>
                    <p className="text-xs text-muted-foreground">Người dùng online</p>
                  </div>
                  <div className="rounded-xl bg-muted/40 border border-border/30 p-3 text-center">
                    <p className="text-lg font-black">{maxConcurrentLimit === 999999 ? "∞" : maxConcurrentLimit.toLocaleString("vi-VN")}</p>
                    <p className="text-xs text-muted-foreground">Giới hạn tải trọng</p>
                  </div>
                  <div className="rounded-xl bg-muted/40 border border-border/30 p-3 text-center">
                    <p className={`text-lg font-black ${colorMap[modalInfo.color].text}`}>
                      {modalInfo.level === "warning" ? "⚠️" : modalInfo.level === "alert" ? "🔶" : modalInfo.level === "critical" ? "🚨" : "✅"}
                    </p>
                    <p className="text-xs text-muted-foreground">Mức cảnh báo</p>
                  </div>
                </div>

                {/* Capacity Upgrade Area */}
                <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
                  <h3 className="text-sm font-bold flex items-center gap-2 text-primary">
                    <Zap className="h-4 w-4" /> Mở rộng tải trọng dự án
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Chọn giới hạn số lượng người dùng cùng lúc (concurrent users) để nâng cấp hạ tầng ảo của hệ thống.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[200, 500, 1000, 5000, 999999].map((limitVal) => {
                      const label = limitVal === 999999 ? "Vô hạn (Enterprise)" : `${limitVal} Users`;
                      const isActive = maxConcurrentLimit === limitVal;
                      return (
                        <button
                          key={limitVal}
                          disabled={updatingCapacity}
                          onClick={() => void updateCapacityLimit(limitVal)}
                          className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                            isActive
                              ? "bg-primary text-white border-primary shadow-sm"
                              : "bg-background hover:bg-secondary border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {limitVal === 999999 && updatingCapacity && maxConcurrentLimit !== limitVal ? (
                            <div className="h-3 w-3 border-2 border-primary/20 border-t-primary rounded-full animate-spin inline-block mr-1" />
                          ) : null}
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <Server className="h-4 w-4 text-primary" /> Hành động được khuyến nghị
                  </h3>
                  <div className="space-y-2">
                    {modalInfo.actions.map((action, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl bg-muted/30 border border-border/30 px-4 py-3">
                        <span className={`text-xs font-black shrink-0 mt-0.5 ${colorMap[modalInfo.color].text}`}>{i + 1}.</span>
                        <p className="text-sm">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick links */}
                <div>
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" /> Tài nguyên tham khảo
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "NeonDB Scaling", href: "https://neon.tech/docs/guides/scaling" },
                      { label: "Render.com Plans", href: "https://render.com/pricing" },
                      { label: "PgBouncer Setup", href: "https://www.pgbouncer.org/config.html" },
                      { label: "Redis Cache", href: "https://redis.io/docs/getting-started/" },
                      { label: "Cloudflare CDN", href: "https://www.cloudflare.com/cdn/" },
                      { label: "Database Indexes", href: "https://www.postgresql.org/docs/current/indexes.html" },
                    ].map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-border/40 px-3 py-2 text-xs font-medium hover:bg-muted/30 transition-colors"
                      >
                        <Database className="h-3 w-3 text-primary" /> {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-border/50">
                <button
                  onClick={() => { setShowScaleModal(false); setDismissedAlert(true); }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Đóng & ẩn cảnh báo hôm nay
                </button>
                <button
                  onClick={() => setShowScaleModal(false)}
                  className="px-5 py-2 rounded-lg text-sm font-medium bg-primary hover:bg-primary/90 text-white transition-colors cursor-pointer"
                >
                  Đã hiểu
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
