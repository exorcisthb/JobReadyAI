import { useState, useEffect, useMemo } from "react";
import { BookOpen, Edit3, Trash2, Calendar, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedDeleteButton } from "@/components/AnimatedDeleteButton";

export interface PostItem {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  category: string;
  created_at: string;
  image_url?: string;
  thumbnail_url?: string;
  status?: string;
  source_url?: string;
}

interface PostGridProps {
  posts: PostItem[];
  loading?: boolean;
  isManager?: boolean;
  categoryMap: Record<string, string>;
  getImageUrl?: (post: PostItem) => string | undefined;
  getExcerpt?: (post: PostItem) => string;
  onCardClick?: (post: PostItem) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  icon?: React.ReactNode;
  pageSize?: number;
}

function BlogImage({ src, alt, wrapperClassName }: { src?: string; alt: string; wrapperClassName?: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setLoaded(false);
    setHasError(false);
  }, [src]);

  if (!imgSrc || hasError) {
    return (
      <div className={`bg-muted flex items-center justify-center ${wrapperClassName ?? ""}`}>
        <BookOpen className="h-12 w-12 text-muted-foreground/30" />
      </div>
    );
  }

  return (
    <div className={`relative bg-muted ${wrapperClassName ?? ""}`}>
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

function generateExcerpt(content?: string, maxLength = 150) {
  if (!content) return "";
  const plain = content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return plain.length > maxLength ? plain.slice(0, maxLength) + "..." : plain;
}

const statusBadgeStyle: Record<string, string> = {
  published: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-400",
  draft: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-400",
  archived: "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700/30 dark:bg-slate-800/20 dark:text-slate-400",
};

export function PostGrid({
  posts,
  loading = false,
  isManager = false,
  categoryMap,
  getImageUrl = (p) => p.image_url ?? p.thumbnail_url,
  getExcerpt = (p) => p.excerpt ?? generateExcerpt(p.content),
  onCardClick,
  onEdit,
  onDelete,
  emptyTitle,
  emptyDescription,
  icon,
  pageSize = 6,
}: PostGridProps) {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const resolvedEmptyTitle = emptyTitle ?? t("postGrid.emptyTitle");
  const resolvedEmptyDescription = emptyDescription ?? t("postGrid.emptyDesc");

  const statusLabel: Record<string, string> = {
    published: t("postGrid.statusPublished"),
    draft: t("postGrid.statusDraft"),
    archived: t("postGrid.statusArchived"),
  };

  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const pagedPosts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return posts.slice(start, start + pageSize);
  }, [posts, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [posts.length]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">{t("postGrid.loading")}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        {icon || <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />}
        <h3 className="text-lg font-semibold text-foreground mb-2">{resolvedEmptyTitle}</h3>
        <p className="text-sm text-muted-foreground">{resolvedEmptyDescription}</p>
      </div>
    );
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId || !onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteConfirmId);
      setDeleteConfirmId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pagedPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => {
              if (!isManager && onCardClick) {
                if (post.source_url) {
                  window.open(post.source_url, "_blank");
                } else {
                  onCardClick(post);
                }
              }
            }}
            className={`group relative bg-card rounded-2xl border border-border overflow-hidden transition-all ${
              !isManager && onCardClick
                ? "hover:shadow-lg hover:border-primary/30 cursor-pointer"
                : "hover:shadow-md"
            }`}
          >
            <BlogImage
              src={getImageUrl(post)}
              alt={post.title}
              wrapperClassName="aspect-video overflow-hidden border-b border-border/20"
            />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {categoryMap[post.category] || post.category}
                </span>
                {isManager && post.status && (
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                      statusBadgeStyle[post.status] || "border-border bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    {statusLabel[post.status] || post.status}
                  </span>
                )}
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2">
                {post.title}
              </h3>
              {getExcerpt(post) && (
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {getExcerpt(post)}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(post.created_at).toLocaleDateString(i18n.language === "vi" ? "vi-VN" : "en-US")}
                </div>
                {!isManager && onCardClick && !post.source_url ? (
                  <div className="flex items-center gap-1 text-xs font-medium text-primary">
                    {t("postGrid.readMore")}
                    <ChevronRight className="h-3 w-3" />
                  </div>
                ) : isManager ? (
                  <div className="flex items-center gap-2">
                    {onEdit && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(post.id); }}
                        className="flex items-center justify-center w-8 h-8 rounded-lg text-primary hover:bg-primary/10 transition-all"
                        title={t("postGrid.edit")}
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(post.id); }}
                        className="flex items-center justify-center w-8 h-8 rounded-lg text-destructive hover:bg-destructive/10 transition-all"
                        title={t("postGrid.delete")}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("postGrid.prev")}
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                  p === page
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted"
          >
            {t("postGrid.next")}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-lg">{t("postGrid.confirmDeleteTitle")}</CardTitle>
              <CardDescription>{t("postGrid.confirmDeleteDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="rounded-xl"
              >
                {t("postGrid.cancel")}
              </Button>
              <AnimatedDeleteButton
                size="md"
                text={t("postGrid.delete") || "Xóa"}
                onDelete={handleDeleteConfirm}
                disabled={isDeleting}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
