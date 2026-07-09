import { useEffect, useMemo, useState, useCallback, memo } from "react";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Upload,
  Users,
  Plus,
  BookOpen,
  BarChart3,
  User,
  Sparkles,
  Star,
  ArrowRight,
  Newspaper,
  Crown,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { useUserNavItems } from "@/pages/User/user-nav-items";
import { useOnboarding } from "@/hooks/useOnboarding";
import { OnboardingTour } from "@/components/OnboardingTour";

interface UserDashboardData {
  user?: {
    id: string;
    email: string;
    name?: string;
    subscription_plan?: string;
    subscription_expires_at?: string | null;
    sub_plan_interview?: string;
    sub_expires_interview?: string | null;
    sub_plan_cv?: string;
    sub_expires_cv?: string | null;
    sub_plan_interview_cycle?: string | null;
    sub_plan_cv_cycle?: string | null;
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

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<UserDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Onboarding tour
  const { isTourActive, activeStepType, advanceTour, skipTour, currentStep, resetTour } = useOnboarding(
    user?.id || "anonymous"
  );

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
      {/* Onboarding Tour */}
      {isTourActive && activeStepType === "post_login" && currentStep === 0 && (
        <OnboardingTour
          userId={user?.id || "anonymous"}
          currentStep="post_login"
          onAdvance={advanceTour}
          onSkip={skipTour}
        />
      )}

      <DashboardHeader
        navItems={useUserNavItems()}
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
                Sẵn sàng chinh phục mục tiêu nghề nghiệp của bạn!
              </p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Hồ Sơ CV"
              value={data?.stats.total_cv_uploads ?? 0}
              icon={<Upload className="h-5 w-5 text-emerald-500" />}
              subtitle="Tổng số CV của bạn"
              href="/cv"
              onClick={() => window.location.assign("/cv")}
            />
            
            <StatCard
              title="Gói Phỏng Vấn (Interview)"
              value={
                (() => {
                  const plan = data?.user?.sub_plan_interview;
                  const cycle = data?.user?.sub_plan_interview_cycle;
                  if (!plan || plan === "free") return "FREE";
                  const tierName = plan.startsWith("ultra") ? "ULTRA" : "PRO";
                  return `${tierName} (${cycle || "Tháng"})`;
                })()
              }
              icon={<Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />}
              subtitle={
                data?.user?.sub_plan_interview && data?.user?.sub_plan_interview !== "free" && data?.user?.sub_expires_interview
                  ? `Hạn dùng: ${new Date(data.user.sub_expires_interview).toLocaleDateString("vi-VN")}`
                  : "Mở khóa giới hạn luyện phỏng vấn"
              }
              href="/pricing"
              onClick={() => window.location.assign("/pricing")}
            />

            <StatCard
              title="Gói Tạo CV"
              value={
                (() => {
                  const plan = data?.user?.sub_plan_cv;
                  const cycle = data?.user?.sub_plan_cv_cycle;
                  if (!plan || plan === "free") return "FREE";
                  const tierName = plan.startsWith("ultra") ? "ULTRA" : "PRO";
                  return `${tierName} (${cycle || "Tháng"})`;
                })()
              }
              icon={<Crown className="h-5 w-5 text-amber-500" />}
              subtitle={
                data?.user?.sub_plan_cv && data?.user?.sub_plan_cv !== "free" && data?.user?.sub_expires_cv
                  ? `Hạn dùng: ${new Date(data.user.sub_expires_cv).toLocaleDateString("vi-VN")}`
                  : "Mở khóa giới hạn tạo CV AI"
              }
              href="/pricing"
              onClick={() => window.location.assign("/pricing")}
            />
          </div>

          {/* Feature Intro Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-border/40 bg-card/80 backdrop-blur-sm p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  Cộng Đồng & Nhóm Học Tập
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Tham gia các nhóm trao đổi cùng ngành nghề, thảo luận các vấn đề quan trọng về phát triển kỹ năng và cơ hội nghề nghiệp. Tích hợp chức năng chat nhóm thời gian thực cùng bong bóng chat linh hoạt.
                </p>
              </div>
              <button
                onClick={() => window.location.assign("/groups")}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline self-start"
              >
                Khám phá nhóm của bạn <ArrowRight className="h-4 w-4" />
              </button>
            </Card>

            <Card className="border border-border/40 bg-card/80 backdrop-blur-sm p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                  <BookOpen className="h-5 w-5 text-emerald-500" />
                  Career Blog & Điểm Tin
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Cập nhật liên tục các bài viết hướng dẫn chuyên sâu về cách tối ưu CV, mẹo phỏng vấn mới nhất, xu hướng tuyển dụng nổi bật và tin tức báo chí định kỳ hàng tuần.
                </p>
              </div>
              <button
                onClick={() => window.location.assign("/blog")}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-500 hover:underline self-start"
              >
                Đọc bài viết mới nhất <ArrowRight className="h-4 w-4" />
              </button>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Thao tác nhanh</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickActionCard
                icon={<Plus className="h-6 w-6 text-white" />}
                title="Tạo CV mới"
                subtitle="Thiết kế từ Template chuyên nghiệp"
                gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
                onClick={() => window.location.assign("/cv/create")}
              />
              <QuickActionCard
                icon={<FileText className="h-6 w-6 text-white" />}
                title="Quản lý CV"
                subtitle="Xem danh sách CV hiện có"
                gradient="bg-gradient-to-br from-emerald-500 to-teal-400"
                onClick={() => window.location.assign("/cv")}
              />
              <QuickActionCard
                icon={<Users className="h-6 w-6 text-white" />}
                title="Hội nhóm"
                subtitle="Kết nối cộng đồng"
                gradient="bg-gradient-to-br from-blue-500 to-sky-400"
                onClick={() => window.location.assign("/groups")}
              />
              <QuickActionCard
                icon={<Crown className="h-6 w-6 text-white" />}
                title="Nâng cấp gói"
                subtitle={
                  (() => {
                    const isSubscribed = (data?.user?.sub_plan_interview && data?.user?.sub_plan_interview !== "free") ||
                                        (data?.user?.sub_plan_cv && data?.user?.sub_plan_cv !== "free");
                    return isSubscribed ? "Quản lý gói dịch vụ của bạn" : "Mở khóa tính năng Premium";
                  })()
                }
                gradient="bg-gradient-to-br from-amber-500 to-orange-400"
                onClick={() => window.location.assign("/pricing")}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Dev: Reset Onboarding Tour button */}
      {import.meta.env.DEV && (
        <button
          onClick={() => {
            resetTour();
            window.location.reload();
          }}
          className="fixed bottom-4 left-4 z-[99999] flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold shadow-lg transition-colors cursor-pointer"
          title="Dev only: Reset onboarding tour"
        >
          🔄 Reset Tour
        </button>
      )}
    </div>
  );
}
