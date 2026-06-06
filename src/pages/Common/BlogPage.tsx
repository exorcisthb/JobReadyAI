import { useState, useEffect } from "react";
import { Search, BookOpen, Calendar, ArrowLeft, Loader2, ChevronRight, Sparkles, Share2, Check, BarChart3, Users, MessageCircle, HelpCircle, Newspaper } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader, type NavItem } from "@/components/dashboard-header";
import { userNavItems } from "@/pages/user/user-nav-items";

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

const blogCategories = [
  "Tất cả",
  "Tiêu chí xin việc",
  "Tiêu chí chọn CV",
  "Mẹo phỏng vấn",
  "Xu hướng tuyển dụng",
  "Kỹ năng nghề nghiệp",
];

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
    label: "Quản lý bài báo",
    icon: <Newspaper className="h-5 w-5" />,
    href: "/content-manager/dashboard#news",
  },
  {
    label: "Quản lý câu hỏi",
    icon: <HelpCircle className="h-5 w-5" />,
    href: "/content-manager/dashboard#questions",
  },
  { label: "Trò chuyện", icon: <MessageCircle className="h-5 w-5" />, href: "/messages" },
  { label: "Blog Career", icon: <BookOpen className="h-5 w-5" />, href: "/blog" },
  { label: "Điểm Tin Báo Chí", icon: <Newspaper className="h-5 w-5" />, href: "/news" },
];

const adminNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <BarChart3 className="h-5 w-5" />, href: "/admin/dashboard" },
  {
    label: "Quản lý người dùng",
    icon: <Users className="h-5 w-5" />,
    href: "/admin/dashboard#users",
  },
  { label: "Trò chuyện", icon: <MessageCircle className="h-5 w-5" />, href: "/messages" },
  { label: "Blog Career", icon: <BookOpen className="h-5 w-5" />, href: "/blog" },
  { label: "Điểm Tin Báo Chí", icon: <Newspaper className="h-5 w-5" />, href: "/news" },
];

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
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isCopied, setIsCopied] = useState(false);

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

  const handleShare = async () => {
    if (!selectedPost) return;
    
    const url = window.location.href;
    const shareData = {
      title: selectedPost.title,
      text: `Đọc bài viết "${selectedPost.title}" trên JobReadyAI - Nền tảng tuyển dụng thông minh.\n`,
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
      const response = await fetch("/api/blog", {
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
      selectedCategory === "Tất cả" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const currentRole: "user" | "admin" | "content_manager" =
    user?.role === "admin" || user?.role === "content_manager" ? user.role : "user";
  const currentNavItems =
    currentRole === "admin"
      ? adminNavItems
      : currentRole === "content_manager"
        ? cmNavItems
        : userNavItems;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải bài viết...</p>
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
                    {type === "internal" ? "Blog Career" : "Điểm Tin Báo Chí"}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-3">
                  {type === "internal" ? "Kiến thức nghề nghiệp" : "Tin tức chuyên ngành"}
                </h2>
                <p className="text-muted-foreground max-w-2xl">
                  {type === "internal" 
                    ? "Khám phá các bài viết về tiêu chí xin việc, cách chọn CV, mẹo phỏng vấn và xu hướng tuyển dụng tại Việt Nam."
                    : "Cập nhật nhanh chóng các tin tức tuyển dụng, thị trường việc làm từ các nguồn báo uy tín."}
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
                  placeholder="Tìm kiếm bài viết..."
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
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Không tìm thấy bài viết
                </h3>
                <p className="text-sm text-muted-foreground">
                  Thử thay đổi từ khóa tìm kiếm hoặc danh mục
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    onClick={() => {
                      if (post.source_url) {
                        window.open(post.source_url, "_blank");
                      } else {
                        setSelectedPost(post);
                        window.history.pushState(null, "", `/blog/${post.id}`);
                      }
                    }}
                    className="group cursor-pointer bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all"
                  >
                    <BlogImage
                      src={post.image_url}
                      alt={post.title}
                      className="group-hover:scale-105 transition-transform duration-500"
                      wrapperClassName="aspect-video overflow-hidden border-b border-border/20"
                    />
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
                          {post.category}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(post.created_at).toLocaleDateString("vi-VN")}
                        </div>
                        <div className="flex items-center gap-1 text-xs font-medium text-primary">
                          Đọc thêm
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
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
                Quay lại danh sách
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                {isCopied ? "Đã sao chép link" : "Chia sẻ bài viết"}
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
          </div>
        )}
        </div>
      </main>
    </div>
  );
}

export default BlogPage;