import { useEffect, useState } from "react";
import { Plus, Search, BookOpen, BarChart3, Flag, Newspaper, Sparkles } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { DashboardHeader, type NavItem } from "@/components/dashboard-header";
import { PostGrid, type PostItem } from "@/components/PostGrid";

const cmNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <BarChart3 className="h-5 w-5" />, href: "/content-manager/dashboard" },
  { label: "Nhóm vi phạm", icon: <Flag className="h-5 w-5" />, href: "/content-manager/groups" },
  { label: "Quản lý bài viết", icon: <BookOpen className="h-5 w-5" />, href: "/content-manager/articles" },
  { label: "Quản lý bài báo", icon: <Newspaper className="h-5 w-5" />, href: "/content-manager/news" },
];

const categoryMap: Record<string, string> = {
  interview_tips: "Mẹo phỏng vấn",
  soft_skills: "Kỹ năng nghề nghiệp",
  career: "Tiêu chí xin việc",
  cv_tips: "Tiêu chí chọn CV",
  other: "Xu hướng tuyển dụng",
};

export default function ArticleManagementPage() {
  const { user, logout } = useAuth();
  const [articles, setArticles] = useState<PostItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "published" | "archived">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    setLoading(true);
    try {
      const headers = { "x-user-id": user?.id ?? "", "x-user-role": user?.role ?? "" };
      const response = await fetch("/api/dashboard/articles", { headers });
      if (!response.ok) throw new Error("Không thể tải danh sách bài viết.");
      const data = await response.json();
      setArticles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tất cả" || categoryMap[article.category] === selectedCategory;
    const matchesStatus = filterStatus === "all" || article.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  async function handleDeleteArticle(id: string) {
    const headers = { "x-user-id": user?.id ?? "", "x-user-role": user?.role ?? "" };
    const response = await fetch(`/api/dashboard/articles/${id}`, { method: "DELETE", headers });
    if (!response.ok) throw new Error("Không thể xóa bài viết.");
    await loadArticles();
  }

  function handleLogout() {
    logout();
    window.location.assign("/");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader
        navItems={cmNavItems}
        activePath="/content-manager/articles"
        role="content_manager"
        onLogout={handleLogout}
      />

      <main className="pt-16 min-h-screen transition-all duration-300">
        <div
          className="max-w-6xl mx-auto px-6 py-8"
          style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}
        >
          {/* Hero Section */}
          <div className="relative mb-8 p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent-mint/10 border border-border overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">Blog Career</span>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-3">Quản lý bài viết</h2>
                <p className="text-muted-foreground max-w-2xl">
                  Khám phá các bài viết về tiêu chí xin việc, cách chọn CV, mẹo phỏng vấn và xu hướng tuyển dụng tại Việt Nam.
                </p>
              </div>
              <Button
                onClick={() => window.location.assign("/content/articles/new")}
                className="rounded-xl flex items-center gap-2 bg-gradient-to-r from-primary to-accent-mint hover:opacity-90 text-white shadow-md shrink-0"
              >
                <Plus className="h-4 w-4" />
                Viết bài mới
              </Button>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="mb-8 flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div className="flex gap-2 flex-nowrap overflow-x-auto">
              <button
                onClick={() => { setSelectedCategory("Tất cả"); setFilterStatus("all"); }}
                className={`h-11 px-4 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === "Tất cả" && filterStatus === "all"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >Tất cả</button>
              <button
                onClick={() => { setSelectedCategory("Tất cả"); setFilterStatus("published"); }}
                className={`h-11 px-4 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === "published"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >Đã xuất bản</button>
              <button
                onClick={() => { setSelectedCategory("Tất cả"); setFilterStatus("draft"); }}
                className={`h-11 px-4 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === "draft"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >Nháp</button>
              <button
                onClick={() => { setSelectedCategory("Tất cả"); setFilterStatus("archived"); }}
                className={`h-11 px-4 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === "archived"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >Lưu trữ</button>
            </div>
          </div>

          {/* Articles Grid */}
          <PostGrid
            posts={filteredArticles}
            loading={loading}
            isManager
            categoryMap={categoryMap}
            getImageUrl={(p) => p.thumbnail_url}
            getExcerpt={(p) => {
              if (!p.content) return "";
              const plain = p.content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
              return plain.length > 150 ? plain.slice(0, 150) + "..." : plain;
            }}
            onEdit={(id) => window.location.assign(`/content/articles/${id}/edit`)}
            onDelete={handleDeleteArticle}
            icon={<BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />}
          />
        </div>
      </main>
    </div>
  );
}
