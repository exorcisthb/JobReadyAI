"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MessageSquare, FileText, Briefcase, Users } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { useUserNavItems } from "@/pages/User/user-nav-items";

// Post templates
const postTemplates = [
  {
    id: "share-exp",
    icon: <Briefcase className="h-5 w-5" />,
    title: i18n.t("post.template.shareExp.title"),
    description: i18n.t("post.template.shareExp.desc"),
    content: i18n.t("post.template.shareExp.content"),
  },
  {
    id: "ask-help",
    icon: <Users className="h-5 w-5" />,
    title: i18n.t("post.template.qna.title"),
    description: i18n.t("post.template.qna.desc"),
    content: i18n.t("post.template.qna.content"),
  },
  {
    id: "job-news",
    icon: <FileText className="h-5 w-5" />,
    title: i18n.t("post.template.recruit.title"),
    description: i18n.t("post.template.recruit.desc"),
    content: i18n.t("post.template.recruit.content"),
  },
  {
    id: "general",
    icon: <MessageSquare className="h-5 w-5" />,
    title: i18n.t("post.template.free.title"),
    description: i18n.t("post.template.free.desc"),
    content: i18n.t("post.template.free.content"),
  },
];

export default function CreatePostPage() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const rawGroupId = new URLSearchParams(window.location.search).get("groupId");
  const groupId = rawGroupId ? rawGroupId.replace(/^\//, "") : "";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [loadingGroup, setLoadingGroup] = useState(true);

  const headers = useMemo(
    () => ({
      "x-user-id": user?.id ?? "",
      "x-user-role": user?.role ?? "user",
      "Content-Type": "application/json",
    }),
    [user?.id, user?.role],
  );

  // Fetch group info
  useEffect(() => {
    if (!groupId) {
      setLoadingGroup(false);
      return;
    }

    const fetchGroup = async () => {
      try {
        const response = await fetch(`/api/groups/${groupId}`, { headers });
        if (response.ok) {
          const data = await response.json();
          setGroupName(data.group.name);
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin nhóm:", error);
      } finally {
        setLoadingGroup(false);
      }
    };

    void fetchGroup();
  }, [groupId, headers]);

  const handleSelectTemplate = (templateId: string) => {
    const template = postTemplates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setTitle(template.title);
      setContent(template.content);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert(t("post.alert.emptyTitle"));
      return;
    }

    if (!content.trim()) {
      alert(t("post.alert.emptyContent"));
      return;
    }

    if (!groupId) {
      alert(t("post.alert.noGroup"));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/groups/${groupId}/posts`, {
        method: "POST",
        headers,
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.error || t("post.alert.createFailed"));
        return;
      }

      alert(t("post.alert.createSuccess"));
      window.location.href = `/groups?highlight=${groupId}`;
    } catch (error) {
      alert(error instanceof Error ? error.message : t("post.alert.error"));
    } finally {
      setLoading(false);
    }
  };

  if (loadingGroup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <DashboardHeader
        navItems={useUserNavItems()}
        activePath="/groups"
        role="user"
        onLogout={logout}
      />

      <main className="pt-16">
        <div
          className="p-4 sm:p-6 lg:p-8 space-y-6"
          style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}
        >
          {/* Page Header */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent-mint flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t("post.create.title")}</h1>
              {groupName && (
                <p className="text-sm text-muted-foreground">
                  {t("post.label.groupPrefix")}<span className="font-medium">{groupName}</span>
                </p>
              )}
            </div>
          </div>

          {/* Templates */}
          {selectedTemplate === null && (
            <Card className="border-border/50 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{t("post.create.chooseTemplate")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {postTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleSelectTemplate(template.id)}
                      className="flex items-start gap-4 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        {template.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{template.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Post Form */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="pb-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{t("post.create.content")}</CardTitle>
                {selectedTemplate !== null && (
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="text-sm text-primary hover:underline"
                  >
                    {t("post.btn.changeTemplate")}
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">{t("post.label.title")}</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t("post.placeholder.title")}
                    className="text-lg"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">{t("post.label.content")}</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={t("post.placeholder.content")}
                    rows={15}
                    className="resize-none font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {t("post.help.markdown")}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    {t("post.label.groupPrefix")}<strong>{groupName || t("post.label.undefined")}</strong>
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.history.back()}
                    >
                      {t("post.btn.cancel")}
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || !groupId}
                      className="gap-2"
                      style={{ background: "var(--gradient-hero)" }}
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {t("post.btn.submit")}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
