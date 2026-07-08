import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { Search, BookOpen, Calendar, ArrowLeft, Loader2, Sparkles, Share2, Check, BarChart3, Users, MessageCircle, HelpCircle, Newspaper, Trash2, Send, MessageSquare } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader, type NavItem } from "@/components/dashboard-header";
import { useUserNavItems } from "@/pages/User/user-nav-items";
import { PostGrid } from "@/components/PostGrid";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  created_at: string;
  image_url?: string;
  source_url?: string;
}

// FIX 1: Dùng placehold.co thay vì Unsplash để tránh lỗi CORS / rate limit
const DEFAULT_BLOG_IMAGE = "https://placehold.co/1200x675/e2e8f0/94a3b8?text=Blog+Career";

// FIX 2: Kiểm tra chặt chẽ hơn, xử lý cả "null" string và "undefined" string
const getValidImageUrl = (url?: string) => {
  if (!url) return null;
  const clean = url.trim();
  if (
    clean === "" ||
    clean === "null" ||
    clean === "undefined"
  ) return null;
  if (
    clean.startsWith("http://") ||
    clean.startsWith("https://") ||
    clean.startsWith("/") ||
    clean.startsWith("data:image/")
  ) return clean;
  return null;
};

// FIX 3: Component ảnh riêng có xử lý loading state và fallback
function BlogImage({
  src,
  alt,
  className,
  wrapperClassName,
}: {
  src?: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
}) {
  const [imgSrc, setImgSrc] = useState(getValidImageUrl(src));
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Khi prop src thay đổi (ví dụ navigate sang bài khác), reset lại
  useEffect(() => {
    setImgSrc(getValidImageUrl(src));
    setLoaded(false);
    setHasError(false);
  }, [src]);

  if (!imgSrc || hasError) return null;

  return (
    <div className={`relative bg-muted ${wrapperClassName ?? ""} ${className ?? ""}`}>
      {/* Skeleton hiển thị khi ảnh chưa load */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted-foreground/10 to-muted animate-pulse" />
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export function BlogPage({ type = "internal" }: { type?: "internal" | "external" }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(t("blog.category.all"));
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // States cho tính năng bình luận
  const [comments, setComments] = useState<any[]>([]);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchComments = async (postId: string) => {
    setCommentsLoading(true);
    setCommentsError("");
    try {
      const response = await fetch(`/api/blog/${postId}/comments`);
      if (!response.ok) throw new Error("Không thể tải bình luận");
      const data = await response.json();
      setComments(data.comments || []);
    } catch (err) {
      setCommentsError(err instanceof Error ? err.message : "Lỗi khi tải bình luận");
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !newCommentContent.trim() || submittingComment) return;
    setSubmittingComment(true);
    try {
      const response = await fetch(`/api/blog/${selectedPost.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id ?? "",
          "x-user-role": user?.role ?? "user",
        },
        body: JSON.stringify({ content: newCommentContent.trim() }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Không thể gửi bình luận");
      }
      const data = await response.json();
      setComments((prev) => [data.comment, ...prev]);
      setNewCommentContent("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi khi gửi bình luận");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bình luận này?")) return;
    try {
      const response = await fetch(`/api/blog/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": user?.id ?? "",
          "x-user-role": user?.role ?? "user",
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Không thể xóa bình luận");
      }
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Lỗi khi xóa bình luận");
    }
  };

  const CATEGORY_MAP: Record<string, string> = {
    "Tiêu chí xin việc": t("blog.category.jobCriteria"),
    "Tiêu chí chọn CV": t("blog.category.cvCriteria"),
    "Mẹo phỏng vấn": t("blog.category.interviewTips"),
    "Xu hướng tuyển dụng": t("blog.category.recruitmentTrends"),
    "Kỹ năng nghề nghiệp": t("blog.category.careerSkills"),
    "Job Criteria": t("blog.category.jobCriteria"),
    "CV Criteria": t("blog.category.cvCriteria"),
    "Interview Tips": t("blog.category.interviewTips"),
    "Recruitment Trends": t("blog.category.recruitmentTrends"),
    "Career Skills": t("blog.category.careerSkills"),
  };

  const blogCategories = [
    t("blog.category.all"),
    t("blog.category.jobCriteria"),
    t("blog.category.cvCriteria"),
    t("blog.category.interviewTips"),
    t("blog.category.recruitmentTrends"),
    t("blog.category.careerSkills"),
  ];

  const cmNavItems: NavItem[] = [
    {
      label: t("blog.nav.overview"),
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/content-manager/dashboard",
    },
    {
      label: t("blog.nav.managePosts"),
      icon: <BookOpen className="h-5 w-5" />,
      href: "/content-manager/articles",
    },
    {
      label: t("blog.nav.manageArticles"),
      icon: <Newspaper className="h-5 w-5" />,
      href: "/content-manager/news",
    },
    // Đã ẩn 4 items cho content_manager: Quản lý câu hỏi, Trò chuyện, Blog Career, Điểm Tin Báo Chí
  ];

  const adminNavItems: NavItem[] = [
    { label: t("blog.nav.overview"), icon: <BarChart3 className="h-5 w-5" />, href: "/admin/dashboard" },
    {
      label: t("blog.nav.manageUsers"),
      icon: <Users className="h-5 w-5" />,
      href: "/admin/dashboard#users",
    },
    { label: t("blog.nav.messages"), icon: <MessageCircle className="h-5 w-5" />, href: "/messages" },
    { label: t("blog.nav.blogCareer"), icon: <BookOpen className="h-5 w-5" />, href: "/blog" },
    { label: t("blog.nav.newsHighlights"), icon: <Newspaper className="h-5 w-5" />, href: "/news" },
  ];

  useEffect(() => {
    fetchPosts();

    const pathParts = window.location.pathname.split("/");
    const articleId = pathParts.length > 2 && pathParts[1] === "blog" ? pathParts[2] : null;

    if (articleId) {
      const fetchSinglePost = async () => {
        try {
          const response = await fetch(`/api/blog/${articleId}`);
          if (response.ok) {
            const data = await response.json();
            setSelectedPost(data.post || null);
          }
        } catch (error) {
          console.error("Failed to fetch post detail:", error);
        }
      };
      void fetchSinglePost();
    }
  }, []);

  useEffect(() => {
    if (selectedPost) {
      void fetchComments(selectedPost.id);
    }
  }, [selectedPost]);

  const handleShare = async () => {
    if (!selectedPost) return;
    
    const url = window.location.href;
    const shareData = {
      title: selectedPost.title,
      text: `${t("blog.shareText")} "${selectedPost.title}"`,
      url: url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/blog?lang=${i18n.language}`, {
        headers: {
          "x-user-id": user?.id || "",
          "x-user-role": user?.role || "user",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const isCorrectType = type === "internal" ? !post.source_url : !!post.source_url;
    if (!isCorrectType) return false;

    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === t("blog.category.all") || CATEGORY_MAP[post.category] === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const currentRole: "user" | "admin" | "content_manager" =
    user?.role === "admin" || user?.role === "content_manager" ? user.role : "user";
  const currentNavItems =
    currentRole === "admin"
      ? adminNavItems
      : currentRole === "content_manager"
        ? cmNavItems
        : useUserNavItems();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t("blog.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader
        navItems={currentNavItems}
        activePath={type === "internal" ? "/blog" : "/news"}
        role={currentRole}
        onLogout={logout}
      />

      {/* Main Content */}
      <main className="pt-16 min-h-screen transition-all duration-300">
        <div
          className="max-w-6xl mx-auto px-6 py-8"
          style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}
        >
        {!selectedPost ? (
          <>
            {/* Hero Section */}
            <div className="relative mb-8 p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent-mint/10 border border-border overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    {type === "internal" ? t("blog.hero.badge") : t("blog.hero.externalBadge")}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-3">
                  {type === "internal" ? t("blog.hero.heading") : t("blog.hero.externalHeading")}
                </h2>
                <p className="text-muted-foreground max-w-2xl">
                  {type === "internal" 
                    ? t("blog.hero.desc")
                    : t("blog.hero.externalDesc")}
                </p>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t("blog.search")}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {blogCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Grid */}
            <PostGrid
              posts={filteredPosts}
              loading={false}
              categoryMap={CATEGORY_MAP}
              onCardClick={(post) => {
                setSelectedPost(post as BlogPost);
                window.history.pushState(null, "", `/blog/${post.id}`);
              }}
              emptyTitle={t("blog.emptyTitle")}
              emptyDescription={t("blog.emptyDesc")}
              icon={<BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />}
            />
          </>
        ) : (
          /* Post Detail View */
          <div>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => {
                  setSelectedPost(null);
                  window.history.pushState(null, "", "/blog");
                }}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("blog.backToList")}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                {isCopied ? t("blog.shareCopied") : t("blog.shareTitle")}
              </button>
            </div>

            <article className="bg-card rounded-3xl border border-border overflow-hidden">
              {getValidImageUrl(selectedPost.image_url) && (
                <div className="mb-8 rounded-3xl overflow-hidden shadow-lg border border-border">
                  <BlogImage src={selectedPost.image_url} alt={selectedPost.title} className="max-h-[400px]" />
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {selectedPost.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(selectedPost.created_at).toLocaleDateString("vi-VN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-6">
                  {selectedPost.title}
                </h1>
                <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
                  {selectedPost.content.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </article>

            {/* Comments Section */}
            <div className="mt-8 bg-card rounded-3xl border border-border p-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-border/50 pb-4">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">
                  Bình luận ({comments.length})
                </h2>
              </div>

              {/* Comment Input */}
              {user ? (
                <form onSubmit={(e) => { void handleAddComment(e); }} className="flex gap-4 items-start">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0 overflow-hidden border border-border">
                    {user.image ? (
                      <img src={user.image} alt={user.email} className="h-full w-full object-cover" />
                    ) : (
                      user.email?.[0]?.toUpperCase() || "U"
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <textarea
                      value={newCommentContent}
                      onChange={(e) => setNewCommentContent(e.target.value)}
                      placeholder="Viết bình luận của bạn..."
                      rows={3}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submittingComment || !newCommentContent.trim()}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/95 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {submittingComment ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            Gửi bình luận
                            <Send className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-muted/40 border border-border text-center text-sm text-muted-foreground">
                  Vui lòng đăng nhập để tham gia bình luận.
                </div>
              )}

              {/* Comments List */}
              {commentsLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : commentsError ? (
                <div className="text-center text-sm text-destructive py-4">
                  {commentsError}
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-8">
                  Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 items-start border-b border-border/10 pb-4 last:border-0 last:pb-0">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0 overflow-hidden border border-border">
                        {comment.user_avatar ? (
                          <img src={comment.user_avatar} alt={comment.user_name} className="h-full w-full object-cover" />
                        ) : (
                          comment.user_name?.[0]?.toUpperCase() || "U"
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-semibold text-foreground">
                              {comment.user_name}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(comment.created_at).toLocaleString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "numeric",
                                month: "numeric",
                              })}
                            </span>
                          </div>
                          {(user?.id === comment.user_id || user?.role === "admin") && (
                            <button
                              onClick={() => { void handleDeleteComment(comment.id); }}
                              className="text-muted-foreground hover:text-destructive p-1 rounded-lg hover:bg-muted transition cursor-pointer"
                              title="Xóa bình luận"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}

export default BlogPage;