import { useEffect, useMemo, useState, useCallback } from "react";
import {
  CheckCircle,
  Clock,
  FileText,
  Flag,
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
  Trash2,
  Search,
  X,
  Newspaper,
  Bell,
  Send,
  History,
  MessageCircle,
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
    total_news: number;
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
  recent_news: Array<{
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
    label: "Nhóm vi phạm",
    icon: <Flag className="h-5 w-5" />,
    href: "/content-manager/groups",
  },
  {
    label: "Quản lý bài viết",
    icon: <BookOpen className="h-5 w-5" />,
    href: "/content-manager/articles",
  },
  {
    label: "Quản lý bài báo",
    icon: <Newspaper className="h-5 w-5" />,
    href: "/content-manager/news",
  },
  // Đã ẩn 4 items cho content_manager: Quản lý câu hỏi, Trò chuyện, Blog Career, Điểm Tin Báo Chí
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
  const headers = useMemo(
    () => ({
      "x-user-id": user?.id ?? "",
      "x-user-role": user?.role ?? "",
    }),
    [user?.id, user?.role],
  );
  const [data, setData] = useState<CMDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // States cho tính năng Xem tất cả & Xóa bài viết
  const [allArticles, setAllArticles] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  async function reloadDashboard() {
    try {
      const response = await fetch("/api/dashboard/cm", { headers });
      if (response.ok) {
        setData((await response.json()) as CMDashboardData);
      }
    } catch (loadError) {
      console.error(loadError);
    }
  }

  async function loadAllArticles() {
    try {
      const response = await fetch("/api/dashboard/articles", { headers });
      if (!response.ok) throw new Error("Không thể tải danh sách bài viết.");
      const articles = await response.json();
      setAllArticles(articles);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteArticle(id: string) {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/dashboard/articles/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) throw new Error("Không thể xóa bài viết.");
      
      setDeleteConfirmId(null);
      await reloadDashboard();
      if (isModalOpen) {
        await loadAllArticles();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Có lỗi xảy ra khi xóa.";
      alert(message);
    } finally {
      setIsDeleting(false);
    }
  }

  const handleOpenAllArticlesModal = async () => {
    setIsModalOpen(true);
    await loadAllArticles();
  };

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
              subtitle="Bài viết nội bộ"
              accent="from-violet-500 to-purple-400"
            />
            <StatCard
              title="Tổng bài báo"
              value={data?.stats.total_news ?? 0}
              icon={<Newspaper className="h-5 w-5 text-violet-500" />}
              subtitle="Bài báo chia sẻ"
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
          <Card id="articles" className="border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-2.5">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-base">Bài viết gần đây</CardTitle>
                      {data && data.recent_articles.length > 0 && (
                        <button
                          type="button"
                          onClick={handleOpenAllArticlesModal}
                          className="text-xs font-semibold text-primary hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1"
                        >
                          Xem tất cả ({data.stats.total_articles})
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <CardDescription className="text-xs">
                      {data?.recent_articles.length ?? 0} bài viết gần nhất
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
                        <button
                          onClick={() => window.location.assign(`/blog/${article.id}`)}
                          className="flex items-center justify-center w-8 h-8 rounded-xl text-muted-foreground hover:text-foreground transition-all"
                          title="Xem bài viết"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(article.id)}
                          className="flex items-center justify-center w-8 h-8 rounded-xl text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
                          title="Xóa bài viết"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* News Section */}
          <Card id="news" className="border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-2.5">
                    <Newspaper className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-base">Bài báo gần đây</CardTitle>
                      {data && data.recent_news && data.recent_news.length > 0 && (
                        <button
                          type="button"
                          onClick={handleOpenAllArticlesModal}
                          className="text-xs font-semibold text-primary hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1"
                        >
                          Xem tất cả ({data.stats.total_news})
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <CardDescription className="text-xs">
                      {data?.recent_news?.length ?? 0} bài báo gần nhất
                    </CardDescription>
                  </div>
                </div>
                <Button
                  onClick={() => window.location.assign("/content/articles/new?type=news")}
                  className="rounded-xl flex items-center gap-2 bg-gradient-to-r from-primary to-accent-mint hover:opacity-90 text-white shadow-md transition-all duration-300"
                >
                  <Plus className="h-4 w-4" />
                  Thêm bài báo
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {!data || !data.recent_news || data.recent_news.length === 0 ? (
                <div className="text-center py-16">
                  <Newspaper className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm font-medium text-muted-foreground">Chưa có bài báo nào</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Thêm bài báo đầu tiên của bạn
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/30">
                  {data.recent_news.map((newsItem) => (
                    <div
                      key={newsItem.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-muted/5 transition-colors duration-150"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent-mint/10">
                          <Newspaper className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate max-w-md">{newsItem.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className="text-[10px] font-semibold border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700/30 dark:bg-slate-800/20 dark:text-slate-400"
                            >
                              {newsItem.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-semibold border ${articleStatusMap[newsItem.status] || "border-border bg-muted/30 text-muted-foreground"}`}
                            >
                              {newsItem.status === "published"
                                ? "Đã xuất bản"
                                : newsItem.status === "draft"
                                  ? "Nháp"
                                  : "Lưu trữ"}
                            </Badge>
                            <span className="text-xs text-muted-foreground hidden sm:inline">
                              {new Date(newsItem.created_at).toLocaleDateString("vi-VN", {
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
                            window.location.assign(`/content/articles/${newsItem.id}/edit?type=news`)
                          }
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Sửa
                        </Button>
                        <button
                          onClick={() => window.location.assign(`/news`)}
                          className="flex items-center justify-center w-8 h-8 rounded-xl text-muted-foreground hover:text-foreground transition-all"
                          title="Xem bài báo"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(newsItem.id)}
                          className="flex items-center justify-center w-8 h-8 rounded-xl text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
                          title="Xóa bài báo"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Questions Section */}
          <Card id="questions" className="border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden">
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

            <button
              onClick={() => window.location.assign("/content/articles/new?type=news")}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-green-500/5 to-green-500/10 p-6 text-left transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-400 p-3 shadow-lg shadow-green-500/20">
                  <Newspaper className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm group-hover:text-green-500 transition-colors">
                    Thêm bài báo
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Chia sẻ từ link ngoài</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-green-500 transition-all" />
              </div>
            </button>
          </div>



          {/* Modal Xem tất cả bài viết */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <Card className="w-full max-w-4xl border border-border/40 bg-card/90 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden max-h-[85vh] flex flex-col">
                <CardHeader className="border-b border-border/30 pb-4 flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-primary/10 border border-primary/20 p-2.5">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">Tất cả bài viết</CardTitle>
                      <CardDescription className="text-xs">Quản lý và xuất bản các bài viết trên hệ thống</CardDescription>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5 text-muted-foreground" />
                  </button>
                </CardHeader>
                
                {/* Bộ lọc Tìm kiếm */}
                <div className="p-6 border-b border-border/30 bg-muted/10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm bài viết theo tiêu đề..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-0 min-h-0">
                  {allArticles.filter(art => art.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
                    <div className="text-center py-16">
                      <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm font-medium text-muted-foreground">Không tìm thấy bài viết nào</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/30">
                      {allArticles
                        .filter(art => art.title.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((article) => (
                          <div
                            key={article.id}
                            className="flex items-center justify-between px-6 py-4 hover:bg-muted/5 transition-colors duration-150"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent-mint/10">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-sm truncate max-w-lg">{article.title}</p>
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
                              <button
                                onClick={() => window.location.assign(`/blog/${article.id}`)}
                                className="flex items-center justify-center w-8 h-8 rounded-xl text-muted-foreground hover:text-foreground transition-all"
                                title="Xem bài viết"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(article.id)}
                                className="flex items-center justify-center w-8 h-8 rounded-xl text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
                                title="Xóa bài viết"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Modal Xác nhận xóa bài viết */}
          {deleteConfirmId && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <Card className="w-full max-w-md border border-destructive/20 bg-card/90 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-br from-destructive/5 via-transparent to-transparent">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 border border-destructive/20 mb-3">
                    <Trash2 className="h-6 w-6 text-destructive" />
                  </div>
                  <CardTitle className="text-lg font-bold">Xác nhận xóa bài viết</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground mt-1">
                    Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn khỏi hệ thống quản lý và trang Blog Career công khai.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 border-t border-border/40 flex items-center justify-end gap-3 bg-muted/5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDeleteConfirmId(null)}
                    disabled={isDeleting}
                    className="rounded-xl h-10 px-4 text-xs font-semibold border-border/60 hover:bg-secondary transition-all"
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="button"
                    onClick={() => deleteConfirmId && void handleDeleteArticle(deleteConfirmId)}
                    disabled={isDeleting}
                    className="rounded-xl h-10 px-4 text-xs font-semibold bg-destructive hover:bg-destructive/90 text-white shadow-md shadow-destructive/20 transition-all flex items-center gap-1.5"
                  >
                    {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
