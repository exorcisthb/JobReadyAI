import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Clock,
  FileText,
  HelpCircle,
  Plus,
  PenLine,
  BookOpen,
  Sparkles,
  TrendingUp,
  Edit3,
  ArrowRight,
  BarChart3,
  Eye,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DashboardHeader, type NavItem } from "@/components/dashboard-header";

interface CMDashboardData {
  stats: {
    total_questions: number;
    total_articles: number;
    published_articles: number;
    draft_articles: number;
  };
  recent_articles: Array<{
    id: string;
    title: string;
    status: "draft" | "published" | "archived";
    category: string;
    created_at: string;
  }>;
  recent_questions: Array<{
    id: string;
    content: string;
    level: string;
    type: string;
    created_at: string;
  }>;
}

const cmNavItems: NavItem[] = [
  {
    label: "Tổng quan",
    icon: <BarChart3 className="h-5 w-5" />,
    href: "/content-manager/dashboard",
  },
  {
    label: "Quản lý bài viết",
    icon: <BookOpen className="h-5 w-5" />,
    href: "/content-manager/dashboard#articles",
  },
  {
    label: "Quản lý câu hỏi",
    icon: <HelpCircle className="h-5 w-5" />,
    href: "/content-manager/dashboard#questions",
  },
];

const articleStatusMap: Record<string, string> = {
  published:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400",
  draft:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-400",
  archived:
    "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700/30 dark:bg-slate-800/20 dark:text-slate-400",
};

const questionLevelMap: Record<string, string> = {
  Junior:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/30 dark:bg-blue-950/20 dark:text-blue-400",
  Mid: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/30 dark:bg-purple-950/20 dark:text-purple-400",
  Senior:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-400",
};

const questionTypeMap: Record<string, string> = {
  technical:
    "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/30 dark:bg-cyan-950/20 dark:text-cyan-400",
  behavioral:
    "border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-900/30 dark:bg-pink-950/20 dark:text-pink-400",
  situational:
    "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/30 dark:bg-indigo-950/20 dark:text-indigo-400",
};

export default function CMDashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<CMDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const headers = useMemo(
    () => ({
      "x-user-id": user?.id ?? "",
      "x-user-role": user?.role ?? "",
    }),
    [user?.id, user?.role],
  );

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/dashboard/cm", { headers });
        if (!response.ok) throw new Error("Không thể tải dashboard content manager.");
        setData((await response.json()) as CMDashboardData);
      } catch (loadError) {
        const message = loadError instanceof Error ? loadError.message : "Đã có lỗi xảy ra.";
        setError(message);
      }
    }
    void load();
  }, [headers]);

  function handleLogout() {
    logout();
    window.location.assign("/");
  }

  const StatCard = ({
    title,
    value,
    icon,
    subtitle,
    accent,
  }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    subtitle?: string;
    accent?: string;
  }) => (
    <Card className="border border-border/40 bg-card/80 backdrop-blur-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
      <div
        className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${accent || "from-primary to-accent-mint"} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </CardTitle>
        <div className="rounded-xl bg-primary/5 border border-primary/10 p-2.5 group-hover:scale-110 transition-all duration-300">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-extrabold tracking-tight">{value.toLocaleString()}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader
        navItems={cmNavItems}
        activePath="/content-manager/dashboard"
        role="content_manager"
        onLogout={handleLogout}
      />

      <main className="pt-16 min-h-screen transition-all duration-300">
        <div
          className="p-6 lg:p-8 space-y-8"
          style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}
        >
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-purple-500/5 via-card to-pink-500/5 p-6 lg:p-8">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-500 uppercase tracking-wider mb-2">
                <Sparkles className="h-4 w-4" />
                Content Manager
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Tổng quan nội dung</h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                Quản lý và tạo nội dung câu hỏi phỏng vấn cùng các bài viết hướng dẫn cho người
                dùng.
              </p>
            </div>
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl" />
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
              title="Tổng câu hỏi"
              value={data?.stats.total_questions ?? 0}
              icon={<HelpCircle className="h-5 w-5 text-primary" />}
              subtitle="Câu hỏi đang có"
              accent="from-blue-500 to-cyan-400"
            />
            <StatCard
              title="Tổng bài viết"
              value={data?.stats.total_articles ?? 0}
              icon={<FileText className="h-5 w-5 text-violet-500" />}
              subtitle="Tất cả bài viết"
              accent="from-violet-500 to-purple-400"
            />
            <StatCard
              title="Đã xuất bản"
              value={data?.stats.published_articles ?? 0}
              icon={<CheckCircle className="h-5 w-5 text-emerald-500" />}
              subtitle="Bài viết công khai"
              accent="from-emerald-500 to-teal-400"
            />
            <StatCard
              title="Bản nháp"
              value={data?.stats.draft_articles ?? 0}
              icon={<Clock className="h-5 w-5 text-amber-500" />}
              subtitle="Đang chờ xuất bản"
              accent="from-amber-500 to-orange-400"
            />
          </div>

          {/* Articles Section */}
          <Card className="border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-2.5">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Bài viết gần đây</CardTitle>
                    <CardDescription className="text-xs">
                      {data?.recent_articles.length ?? 0} bài viết
                    </CardDescription>
                  </div>
                </div>
                <Button
                  onClick={() => window.location.assign("/content/articles/new")}
                  className="rounded-xl flex items-center gap-2 bg-gradient-to-r from-primary to-accent-mint hover:opacity-90 text-white shadow-md transition-all duration-300"
                >
                  <Plus className="h-4 w-4" />
                  Viết bài mới
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {!data || data.recent_articles.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">Chưa có bài viết nào</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Tạo bài viết đầu tiên của bạn
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/30">
                  {data.recent_articles.map((article) => (
                    <div
                      key={article.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-muted/5 transition-colors duration-150"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent-mint/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate max-w-md">{article.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className="text-[10px] font-semibold border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700/30 dark:bg-slate-800/20 dark:text-slate-400"
                            >
                              {article.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-semibold border ${articleStatusMap[article.status] || "border-border bg-muted/30 text-muted-foreground"}`}
                            >
                              {article.status === "published"
                                ? "Đã xuất bản"
                                : article.status === "draft"
                                  ? "Nháp"
                                  : "Lưu trữ"}
                            </Badge>
                            <span className="text-xs text-muted-foreground hidden sm:inline">
                              {new Date(article.created_at).toLocaleDateString("vi-VN", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl h-8 text-xs font-semibold flex items-center gap-1.5 border border-border/50 hover:bg-secondary transition-all"
                          onClick={() =>
                            window.location.assign(`/content/articles/${article.id}/edit`)
                          }
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Sửa
                        </Button>
                        {article.status === "published" && (
                          <button
                            onClick={() => window.location.assign(`/blog/${article.id}`)}
                            className="flex items-center justify-center w-8 h-8 rounded-xl text-muted-foreground hover:text-foreground transition-all"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Questions Section */}
          <Card className="border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-2.5">
                    <HelpCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Câu hỏi gần đây</CardTitle>
                    <CardDescription className="text-xs">
                      {data?.recent_questions.length ?? 0} câu hỏi
                    </CardDescription>
                  </div>
                </div>
                <Button
                  onClick={() => window.location.assign("/content/questions/new")}
                  className="rounded-xl flex items-center gap-2 bg-gradient-to-r from-primary to-accent-mint hover:opacity-90 text-white shadow-md transition-all duration-300"
                >
                  <Plus className="h-4 w-4" />
                  Thêm câu hỏi
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {!data || data.recent_questions.length === 0 ? (
                <div className="text-center py-16">
                  <HelpCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">Chưa có câu hỏi nào</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Tạo câu hỏi phỏng vấn đầu tiên
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/30">
                  {data.recent_questions.map((question) => (
                    <div
                      key={question.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-muted/5 transition-colors duration-150"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10">
                          <HelpCircle className="h-5 w-5 text-violet-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm leading-relaxed">
                            {question.content.length > 90
                              ? `${question.content.slice(0, 90)}...`
                              : question.content}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-semibold border ${questionLevelMap[question.level] || "border-border bg-muted/30 text-muted-foreground"}`}
                            >
                              {question.level}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-semibold border ${questionTypeMap[question.type] || "border-border bg-muted/30 text-muted-foreground"}`}
                            >
                              {question.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground hidden sm:inline">
                              {new Date(question.created_at).toLocaleDateString("vi-VN", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl h-8 text-xs font-semibold flex items-center gap-1.5 border border-border/50 hover:bg-secondary transition-all shrink-0"
                        onClick={() =>
                          window.location.assign(`/content/questions/${question.id}/edit`)
                        }
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        Sửa
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => window.location.assign("/content/questions/new")}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-blue-500/5 to-blue-500/10 p-6 text-left transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 p-3 shadow-lg shadow-blue-500/20">
                  <HelpCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm group-hover:text-blue-500 transition-colors">
                    Thêm câu hỏi mới
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Tạo câu hỏi phỏng vấn mới</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-blue-500 transition-all" />
              </div>
            </button>

            <button
              onClick={() => window.location.assign("/content/articles/new")}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-purple-500/5 to-purple-500/10 p-6 text-left transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-400 p-3 shadow-lg shadow-purple-500/20">
                  <PenLine className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm group-hover:text-purple-500 transition-colors">
                    Viết bài mới
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Tạo bài viết hướng dẫn</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-purple-500 transition-all" />
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
