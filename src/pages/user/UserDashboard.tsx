import { useEffect, useMemo, useState, useCallback, memo } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
  Area,
} from "recharts";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  FileText,
  Target,
  TrendingUp,
  Clock,
  Award,
  Play,
  Plus,
  Dumbbell,
  BookOpen,
  BarChart3,
  User,
  Sparkles,
  Star,
  ArrowRight,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { userNavItems } from "@/pages/user/user-nav-items";

interface UserDashboardData {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
    profile_completed: boolean;
    phone?: string | null;
    job_title?: string | null;
    industry?: string | null;
    experience_level?: string | null;
    location?: string | null;
    skills?: string | null;
    career_goal?: string | null;
  };
  stats: {
    total_sessions: number;
    avg_score: number | null;
    total_cv_uploads: number;
    total_cv_built: number;
    total_practice_sessions: number;
  };
  recent_sessions: Array<{
    id: string;
    level: string;
    avg_score: number | null;
    started_at: string;
    status: string;
  }>;
  progress: Array<{
    session_date: string;
    avg_score: number;
  }>;
}

// Memoized StatCard
const StatCard = memo(
  ({
    title,
    value,
    icon,
    subtitle,
    accent,
    href,
    onClick,
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    subtitle?: string;
    accent?: string;
    href?: string;
    onClick?: () => void;
  }) => (
    <Card
      className="border border-border/40 bg-card/80 backdrop-blur-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </CardTitle>
        <div
          className={`rounded-xl p-2.5 group-hover:scale-110 transition-all duration-300 ${accent ? "" : "bg-primary/5 border border-primary/10 group-hover:bg-primary/10"}`}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-extrabold tracking-tight">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  ),
);

// Memoized Quick Action Card
const QuickActionCard = memo(
  ({
    icon,
    title,
    subtitle,
    gradient,
    onClick,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    gradient: string;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br p-6 text-left transition-all duration-300 hover:shadow-lg cursor-pointer w-full"
      style={{
        background: `linear-gradient(135deg, var(--color-primary) 0%, rgba(var(--color-primary-rgb, 99, 102, 241), 0.05) 100%)`,
      }}
    >
      <div className="flex items-center gap-4">
        <div className={`rounded-2xl ${gradient} p-3 shadow-lg`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all" />
      </div>
    </button>
  ),
);

function getGreeting(name: string): string {
  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";
  return `${timeGreeting}, ${name}!`;
}

function getScoreLabel(score: number | null | undefined): string {
  if (score == null) return "Chưa có điểm";
  if (score >= 9) return "Xuất sắc";
  if (score >= 8) return "Rất tốt";
  if (score >= 7) return "Tốt";
  if (score >= 6) return "Khá";
  if (score >= 5) return "Trung bình";
  return "Cần cố gắng thêm";
}

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<UserDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const headers = useMemo(
    () => ({
      "x-user-id": user?.id ?? "",
      "x-user-role": user?.role ?? "user",
    }),
    [user?.id, user?.role],
  );

  const loadData = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard/me", { headers });
      if (!response.ok) throw new Error("Không thể tải dashboard.");
      const payload = (await response.json()) as UserDashboardData;
      setData(payload);
      setDataLoaded(true);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Đã có lỗi xảy ra.";
      setError(message);
    }
  }, [headers]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleLogout = useCallback(() => {
    logout();
    window.location.assign("/");
  }, [logout]);

  const displayName = data?.user?.name || data?.profile?.full_name || user?.name || "Bạn";
  const greeting = getGreeting(displayName);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader
        navItems={userNavItems}
        activePath="/user/dashboard"
        role="user"
        onLogout={handleLogout}
      />

      <main className="pt-16 min-h-screen transition-all duration-300">
        <div
          className="p-6 lg:p-8 space-y-8"
          style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}
        >
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 via-card to-accent-mint/5 p-6 lg:p-8">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                <Sparkles className="h-4 w-4" />
                Dashboard cá nhân
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{greeting}</h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                {data?.profile?.profile_completed
                  ? "Hồ sơ của bạn đã hoàn thiện. Tiếp tục phấn đấu để đạt được mục tiêu nghề nghiệp!"
                  : "Hoàn thiện hồ sơ để nhận gợi ý phù hợp hơn với bạn."}
              </p>

              {!data?.profile?.profile_completed && (
                <button
                  onClick={() => window.location.assign("/complete-profile")}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent-mint px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <Star className="h-4 w-4" />
                  Hoàn thiện hồ sơ
                </button>
              )}
            </div>
            {/* Decorative background */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-accent-mint/10 rounded-full blur-3xl" />
          </div>

          {error ? (
            <Card className="border-destructive/30 bg-destructive/10">
              <CardContent className="flex items-center gap-3 p-4">
                <span className="text-destructive text-sm">{error}</span>
              </CardContent>
            </Card>
          ) : null}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Buổi phỏng vấn"
              value={data?.stats.total_sessions ?? 0}
              icon={<MessageSquare className="h-5 w-5 text-primary" />}
              subtitle="Tổng số buổi đã thực hiện"
              href="/interview/config"
              onClick={() => window.location.assign("/interview/config")}
            />
            <StatCard
              title="Điểm trung bình"
              value={data?.stats.avg_score != null ? data.stats.avg_score.toFixed(1) : "--"}
              icon={<Target className="h-5 w-5 text-emerald-500" />}
              subtitle={
                data?.stats.avg_score != null ? "Điểm trung bình các buổi" : "Chưa có dữ liệu"
              }
            />
            <StatCard
              title="CV của bạn"
              value={data?.stats.total_cv_built ?? 0}
              icon={<FileText className="h-5 w-5 text-violet-500" />}
              subtitle="Số CV trong hồ sơ"
              href="/cv"
              onClick={() => window.location.assign("/cv")}
            />
            <StatCard
              title="Luyện tập"
              value={data?.stats.total_practice_sessions ?? 0}
              icon={<Dumbbell className="h-5 w-5 text-rose-500" />}
              subtitle="Câu hỏi đã luyện tập"
              href="/practice"
              onClick={() => window.location.assign("/practice")}
            />
          </div>

          {/* Chart + Progress Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progress Chart */}
            <Card className="border border-border/40 bg-card/80 backdrop-blur-sm lg:col-span-2 overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-primary/10 border border-primary/20 p-2.5">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Tiến độ luyện tập</CardTitle>
                      <CardDescription className="text-xs">
                        Điểm trung bình qua các buổi
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs font-semibold border-primary/20 bg-primary/5 text-primary"
                  >
                    {data?.progress.length ?? 0} buổi
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="h-64">
                {!data || data.progress.length === 0 ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mb-3 opacity-30" />
                    <p className="text-sm font-medium">Chưa có dữ liệu tiến độ</p>
                    <p className="text-xs opacity-60 mt-1">
                      Bắt đầu một buổi phỏng vấn để xem biểu đồ
                    </p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data.progress}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="session_date"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value: string) =>
                          new Date(value).toLocaleDateString("vi-VN", {
                            month: "short",
                            day: "numeric",
                          })
                        }
                        style={{ fontSize: "12px", fill: "var(--color-muted-foreground)" }}
                      />
                      <YAxis
                        domain={[0, 10]}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `${v}`}
                        style={{ fontSize: "12px", fill: "var(--color-muted-foreground)" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--color-card)",
                          borderColor: "var(--color-border)",
                          borderRadius: "12px",
                          color: "var(--color-foreground)",
                          fontSize: "12px",
                        }}
                        labelFormatter={(label) => new Date(label).toLocaleDateString("vi-VN")}
                        formatter={(value: number) => [`${value}/10`, "Điểm"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="avg_score"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        fill="url(#progressGradient)"
                        dot={{ fill: "#6366f1", strokeWidth: 0, r: 4 }}
                        activeDot={{
                          r: 6,
                          fill: "#6366f1",
                          stroke: "var(--color-card)",
                          strokeWidth: 2,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Quick Score Summary */}
            <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-2.5">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Đánh giá</CardTitle>
                    <CardDescription className="text-xs">Kết quả hiện tại</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="var(--color-muted)"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${((data?.stats.avg_score ?? 0) / 10) * 264} 264`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold">
                        {data?.stats.avg_score != null ? data.stats.avg_score.toFixed(1) : "--"}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">/ 10</span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-muted-foreground">
                    {getScoreLabel(data?.stats.avg_score)}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Buổi phỏng vấn</span>
                    <span className="font-semibold">{data?.stats.total_sessions ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">CV đã tạo</span>
                    <span className="font-semibold">{data?.stats.total_cv_built ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Luyện tập</span>
                    <span className="font-semibold">
                      {data?.stats.total_practice_sessions ?? 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Sessions */}
          <Card className="border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-2.5">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Lịch sử buổi phỏng vấn</CardTitle>
                    <CardDescription className="text-xs">
                      {data?.recent_sessions.length ?? 0} buổi gần đây
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {!data || data.recent_sessions.length === 0 ? (
                <div className="text-center py-16">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">
                    Chưa có buổi phỏng vấn nào
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Bắt đầu buổi phỏng vấn đầu tiên của bạn
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-muted/20 border-b border-border/30 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      <tr>
                        <th className="px-5 py-4">Level</th>
                        <th className="px-5 py-4">Điểm</th>
                        <th className="px-5 py-4">Ngày</th>
                        <th className="px-5 py-4">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {data.recent_sessions.slice(0, 5).map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-muted/5 transition-colors duration-150"
                        >
                          <td className="px-5 py-4">
                            <Badge
                              variant="outline"
                              className="font-semibold text-xs border-primary/20 bg-primary/5 text-primary"
                            >
                              {item.level}
                            </Badge>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-bold text-sm">
                              {item.avg_score != null ? `${item.avg_score}/10` : "--"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-muted-foreground text-xs">
                            {new Date(item.started_at).toLocaleDateString("vi-VN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="px-5 py-4">
                            <Badge
                              variant="outline"
                              className={`font-semibold text-xs ${
                                item.status === "completed"
                                  ? "border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/20 dark:text-emerald-400"
                                  : item.status === "in_progress"
                                    ? "border-blue-500/30 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-950/20 dark:text-blue-400"
                                    : "border-red-500/30 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-950/20 dark:text-red-400"
                              }`}
                            >
                              {item.status === "completed"
                                ? "Hoàn thành"
                                : item.status === "in_progress"
                                  ? "Đang thực hiện"
                                  : item.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <QuickActionCard
              icon={<Play className="h-6 w-6 text-white" />}
              title="Bắt đầu phỏng vấn"
              subtitle="Thực hành với AI"
              gradient="bg-gradient-to-br from-primary to-accent-mint"
              onClick={() => window.location.assign("/interview/config")}
            />
            <QuickActionCard
              icon={<Plus className="h-6 w-6 text-white" />}
              title="Quản lý CV"
              subtitle="Xem và quản lý CV của bạn"
              gradient="bg-gradient-to-br from-emerald-500 to-teal-400"
              onClick={() => window.location.assign("/cv")}
            />
            <QuickActionCard
              icon={<BookOpen className="h-6 w-6 text-white" />}
              title="Luyện câu hỏi"
              subtitle="Câu hỏi phỏng vấn thường gặp"
              gradient="bg-gradient-to-br from-violet-500 to-purple-400"
              onClick={() => window.location.assign("/practice")}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
