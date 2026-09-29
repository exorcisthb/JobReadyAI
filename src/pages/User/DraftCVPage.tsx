import React, { useState, useEffect, useRef } from "react";
import { FileText, Trash2, Clock, Edit, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard-header";
import { useUserNavItems } from "@/pages/User/user-nav-items";
import { useAuth } from "@/components/auth-provider";
import { AnimatedDeleteButton } from "@/components/AnimatedDeleteButton";
import { getTemplateComponent } from "@/pages/User/CVBuilderPage";
import { getDrafts, deleteDraft } from "@/lib/draft-storage";
import type { DraftCV } from "@/lib/draft-storage";
import { useTranslation } from "react-i18next";

function DraftThumbnail({ draft, onEdit, onDelete }: {
  draft: DraftCV;
  onEdit: (draft: DraftCV) => void;
  onDelete: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [scale, setScale] = useState(0.3);
  const [TemplateComponent, setTemplateComponent] = useState<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateScale = () => {
      if (containerRef.current) {
        setScale(containerRef.current.clientWidth / 595);
      }
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (draft.template?.layout) {
      const component = getTemplateComponent(draft.template.layout);
      setTemplateComponent(() => component);
    }
  }, [draft.template?.layout]);

  const getColorScheme = () => {
    const first = draft.template?.colors?.[0] || draft.template || {};
    return {
      ...draft.template,
      primaryColor: first.primaryColor || draft.template?.primaryColor || "#6366f1",
      secondaryColor: first.secondaryColor || draft.template?.secondaryColor || "#4f46e5",
      accentColor: first.accentColor || draft.template?.accentColor || "#a5b4fc",
      textColor: first.textColor || draft.template?.textColor || "#ffffff",
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return t("header.justNow");
    if (hours < 24) return t("header.hoursAgo", { count: hours });
    const days = Math.floor(hours / 24);
    if (days < 7) return t("header.daysAgo", { count: days });
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="group flex flex-col bg-slate-50/40 border border-slate-100 hover:border-slate-200 rounded-3xl p-3.5 hover:shadow-xl transition-all duration-300 relative">
      {/* Live CV Preview Thumbnail */}
      <div
        ref={containerRef}
        className="relative mx-auto aspect-[210/297] w-full overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)] ring-1 ring-slate-200/50"
      >
        {TemplateComponent ? (
          <div
            className="absolute top-0 left-0 w-[595px] h-[842px] origin-top-left pointer-events-none select-none cv-template-container-bg"
            style={{ 
              transform: `scale(${scale})`,
              "--cv-font-family": draft.data?.fontFamily || "'Segoe UI', sans-serif",
              "--cv-line-spacing": draft.data?.lineHeight || 1.4,
              "--cv-background": (!draft.data?.background || draft.data?.background === "none") ? "#ffffff" : draft.data?.background,
            } as React.CSSProperties}
          >
            <div className={`w-full h-full cv-template-container cv-size-${draft.data?.fontSize || "medium"}`}>
              <TemplateComponent
                data={draft.data}
                onChange={() => {}}
                template={getColorScheme()}
              />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center gap-2.5 transition-all duration-300 z-30 backdrop-blur-[2px]">
          <button
            onClick={() => onEdit(draft)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer transform hover:scale-105 flex items-center gap-2"
          >
            <Edit className="h-3.5 w-3.5" />
            {t("cv.draftEdit")}
          </button>
          <AnimatedDeleteButton
            size="sm"
            text={t("cv.draftDelete") || "Xóa"}
            onDelete={() => onDelete(draft.id)}
            className="shadow-lg transform hover:scale-105"
          />
        </div>
      </div>

      {/* Color dot indicator */}
      <div className="flex items-center justify-center mt-3">
        <div
          className="w-3.5 h-3.5 rounded-full border border-white shadow-sm"
          style={{ backgroundColor: getColorScheme().primaryColor }}
        />
      </div>

      {/* Title */}
      <h3 className="text-slate-900 font-bold text-center text-sm mt-2 line-clamp-1 px-1">
        {draft.title || t("cv.draftUntitled")}
      </h3>

      {/* Template name + date */}
      <div className="flex items-center justify-center gap-2 mt-1">
        <span className="text-[10px] text-slate-500 font-medium">{draft.templateName}</span>
        <span className="text-slate-300">·</span>
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <Clock className="h-2.5 w-2.5" />
          {formatDate(draft.lastModified)}
        </span>
      </div>
    </div>
  );
}

export default function DraftCVPage() {
  const [drafts, setDrafts] = useState<DraftCV[]>([]);
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    if (!user?.id) return;
    setDrafts(getDrafts(user.id));
  }, [user?.id]);

  // Reset to page 1 when drafts change
  useEffect(() => {
    setCurrentPage(1);
  }, [drafts.length]);

  // Pagination
  const totalPages = Math.ceil(drafts.length / itemsPerPage);
  const paginatedDrafts = drafts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (draft: DraftCV) => {
    sessionStorage.setItem("resume-draft", JSON.stringify({
      data: draft.data,
      template: draft.template,
      draftId: draft.id
    }));
    window.location.href = "/user/cv-builder";
  };

  const handleDelete = (id: string) => {
    if (!user?.id || !confirm(t("cv.draftDeleteConfirm"))) return;
    deleteDraft(user.id, id);
    setDrafts(getDrafts(user.id));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader
        navItems={useUserNavItems()}
        activePath="/cv/drafts"
        role={(user?.role as "admin" | "content_manager" | "user") || "user"}
        onLogout={() => {
          logout();
          window.location.href = "/login";
        }}
      />

      <main className="pt-16 min-h-screen transition-all duration-300">
        <div
          className="p-6 lg:p-10 space-y-6 max-w-7xl mx-auto"
          style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">{t("cv.draftTitle")}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t("cv.draftDesc")}
              </p>
            </div>
            <Button
              onClick={() => window.location.href = "/user/cv-builder"}
              className="gap-2 font-semibold shadow-sm"
              style={{ background: "var(--gradient-hero)" }}
            >
              <FileText className="h-4 w-4" />
              {t("cv.createNew")}
            </Button>
          </div>

          {drafts.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border/60 p-12 text-center shadow-sm">
              <FileText className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {t("cv.draftEmpty")}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {t("cv.draftEmptyDesc")}
              </p>
              <Button
                onClick={() => window.location.href = "/user/cv-builder"}
                className="font-semibold shadow-sm"
                style={{ background: "var(--gradient-hero)" }}
              >
                {t("cv.draftCreateFirst")}
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedDrafts.map((draft) => (
                  <DraftThumbnail
                    key={draft.id}
                    draft={draft}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                          : "border border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
