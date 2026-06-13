"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MessageSquare, FileText, Briefcase, Users } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { userNavItems } from "@/pages/User/user-nav-items";

// Post templates
const postTemplates = [
  {
    id: "share-exp",
    icon: <Briefcase className="h-5 w-5" />,
    title: "Chia sẻ kinh nghiệm",
    description: "Chia sẻ kinh nghiệm làm việc, phỏng vấn, kỹ năng",
    content: `## 🎯 Kinh nghiệm [vị trí/ngành]

### Về công việc
[Mô tả ngắn về công việc hiện tại]

### Kinh nghiệm nổi bật
1. ...
2. ...
3. ...

### Bài học quý giá
- ...

### Lời khuyên cho người mới
...`,
  },
  {
    id: "ask-help",
    icon: <Users className="h-5 w-5" />,
    title: "Hỏi đáp & Thảo luận",
    description: "Đặt câu hỏi và thảo luận với cộng đồng",
    content: `## ❓ Câu hỏi về [chủ đề]

### Mô tả vấn đề
[Chi tiết vấn đề bạn đang gặp phải]

### Đã thử cách này
- ...

### Kết quả mong muốn
...

### Ai có kinh nghiệm giúp đỡ mình với ạ?`,
  },
  {
    id: "job-news",
    icon: <FileText className="h-5 w-5" />,
    title: "Tin tuyển dụng",
    description: "Chia sẻ cơ hội việc làm và thông tin tuyển dụng",
    content: `## 💼 [Vị trí] - [Công ty]

### Thông tin tuyển dụng
- **Vị trí:** ...
- **Địa điểm:** ...
- **Mức lương:** ...
- **Hình thức:** Full-time / Part-time / Remote

### Mô tả công việc
- ...

### Yêu cầu
- ...

### Liên hệ
[Email/Số điện thoại/Người liên hệ]

*#tuyendung #vieclam #...*`,
  },
  {
    id: "general",
    icon: <MessageSquare className="h-5 w-5" />,
    title: "Bài viết tự do",
    description: "Chia sẻ suy nghĩ, câu chuyện cá nhân",
    content: `## [Tiêu đề bài viết]

[Nội dung bài viết của bạn...]

---

*Cảm ơn đã đọc! Nếu thấy hữu ích, hãy like và comment ý kiến của bạn nhé!*`,
  },
];

export default function CreatePostPage() {
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
      alert("Tiêu đề không được để trống");
      return;
    }

    if (!content.trim()) {
      alert("Nội dung không được để trống");
      return;
    }

    if (!groupId) {
      alert("Không tìm thấy nhóm");
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
        alert(err.error || "Không thể tạo bài viết");
        return;
      }

      alert("Bài viết đã được đăng!");
      window.location.href = `/groups?highlight=${groupId}`;
    } catch (error) {
      alert(error instanceof Error ? error.message : "Có lỗi xảy ra");
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
        navItems={userNavItems}
        activePath="/groups"
        role="user"
        onLogout={logout}
      />

      <main className="pt-16">
        <div
          className="p-6 lg:p-8 space-y-6"
          style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}
        >
          {/* Page Header */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent-mint flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Viết bài mới</h1>
              {groupName && (
                <p className="text-sm text-muted-foreground">
                  Đăng bài trong nhóm: <span className="font-medium">{groupName}</span>
                </p>
              )}
            </div>
          </div>

          {/* Templates */}
          {selectedTemplate === null && (
            <Card className="border-border/50 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Chọn mẫu bài viết</CardTitle>
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
                <CardTitle className="text-lg">Nội dung bài viết</CardTitle>
                {selectedTemplate !== null && (
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="text-sm text-primary hover:underline"
                  >
                    Chọn mẫu khác
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Tiêu đề</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nhập tiêu đề bài viết..."
                    className="text-lg"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Nội dung</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Chia sẻ ý kiến, kinh nghiệm hoặc câu hỏi của bạn..."
                    rows={15}
                    className="resize-none font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Sử dụng Markdown để định dạng: **bold**, *italic*, # heading, - list
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Bài viết sẽ được đăng trong nhóm: <strong>{groupName || "Không xác định"}</strong>
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.history.back()}
                    >
                      Hủy
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
                      Đăng bài
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
