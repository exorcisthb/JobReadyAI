import { useState, useEffect } from "react";
import { Search, BookOpen, Calendar, ArrowLeft, Loader2, ChevronRight, Sparkles } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  created_at: string;
  image_url?: string;
}

const blogCategories = [
  "Tất cả",
  "Tiêu chí xin việc",
  "Tiêu chí chọn CV",
  "Mẹo phỏng vấn",
  "Xu hướng tuyển dụng",
  "Kỹ năng nghề nghiệp",
];

export function BlogPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

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
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.location.assign("/dashboard")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Blog Career</h1>
              <p className="text-sm text-muted-foreground">
                Cập nhật xu hướng tuyển dụng & mẹo nghề nghiệp
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {!selectedPost ? (
          <>
            {/* Hero Section */}
            <div className="relative mb-8 p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent-mint/10 border border-border overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold text-primary">Blog Career</span>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-3">
                  Kiến thức nghề nghiệp
                </h2>
                <p className="text-muted-foreground max-w-2xl">
                  Khám phá các bài viết về tiêu chí xin việc, cách chọn CV, mẹo phỏng vấn
                  và xu hướng tuyển dụng tại Việt Nam.
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
                    onClick={() => setSelectedPost(post)}
                    className="group cursor-pointer bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all"
                  >
                    {post.image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
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
            <button
              onClick={() => setSelectedPost(null)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại danh sách
            </button>

            <article className="bg-card rounded-3xl border border-border overflow-hidden">
              {selectedPost.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={selectedPost.image_url}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
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
      </main>
    </div>
  );
}

export default BlogPage;
