"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  Clock,
  Crown,
  FileText,
  MessageSquare,
  Plus,
  Send,
  Trash2,
  UserCircle,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Group {
  id: string;
  name: string;
  description: string;
  job_category: string;
  experience_level: string;
  position: string;
  location: string;
  is_private: boolean;
  creator_id: string;
  creator_name: string | null;
  creator_email: string;
  member_count: number;
  post_count: number;
  is_member?: boolean;
  created_at: string;
}

interface Member {
  id: string;
  user_id: string;
  name: string | null;
  email: string;
  role: string;
  avatar_url?: string | null;
  joined_at: string;
}

interface Post {
  id: string;
  author_id: string;
  author_name: string | null;
  author_email?: string;
  author_avatar?: string | null;
  title: string;
  content: string;
  created_at: string;
}

interface GroupDetail {
  group: Group;
  my_role: string;
}

const postTemplates = [
  {
    id: "experience",
    icon: <Briefcase className="h-4 w-4" />,
    title: "Chia sẻ kinh nghiệm",
    description: "Kể lại kinh nghiệm học tập, ứng tuyển hoặc làm việc.",
    content: `## Kinh nghiệm về [vị trí/ngành]

### Bối cảnh
[Bạn đang làm gì, ở đâu, vai trò như thế nào?]

### Điều mình đã học được
1. ...
2. ...
3. ...

### Lời khuyên cho thành viên trong nhóm
...`,
  },
  {
    id: "question",
    icon: <Users className="h-4 w-4" />,
    title: "Hỏi đáp thảo luận",
    description: "Đặt câu hỏi để mọi người góp ý nhanh hơn.",
    content: `## Câu hỏi về [chủ đề]

### Vấn đề mình đang gặp
[Mô tả ngắn gọn vấn đề]

### Mình đã thử
- ...
- ...

### Mình cần mọi người góp ý
...`,
  },
  {
    id: "job",
    icon: <FileText className="h-4 w-4" />,
    title: "Tin tuyển dụng",
    description: "Chia sẻ cơ hội việc làm cho thành viên nhóm.",
    content: `## [Vị trí] - [Công ty]

### Thông tin nhanh
- Địa điểm: ...
- Hình thức: Full-time / Part-time / Remote
- Mức lương: ...

### Mô tả công việc
- ...

### Yêu cầu
- ...

### Cách ứng tuyển
[Email/link/người liên hệ]`,
  },
  {
    id: "general",
    icon: <MessageSquare className="h-4 w-4" />,
    title: "Bài viết tự do",
    description: "Mẫu trống cho thông báo hoặc chia sẻ ngắn.",
    content: `## [Tiêu đề bài viết]

[Nội dung bài viết của bạn]

### Ghi chú thêm
...`,
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTimeAgo(dateString: string) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "Vừa xong";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;
  return new Date(dateString).toLocaleDateString("vi-VN");
}

function CreatePostModal({
  groupName,
  onClose,
  onSubmit,
}: {
  groupName: string;
  onClose: () => void;
  onSubmit: (title: string, content: string) => Promise<void>;
}) {
  const [selectedTemplate, setSelectedTemplate] = useState(postTemplates[0].id);
  const [title, setTitle] = useState(postTemplates[0].title);
  const [content, setContent] = useState(postTemplates[0].content);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const applyTemplate = (templateId: string) => {
    const template = postTemplates.find((item) => item.id === templateId);
    if (!template) return;
    setSelectedTemplate(template.id);
    setTitle(template.title);
    setContent(template.content);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Tiêu đề và nội dung không được để trống.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await onSubmit(title.trim(), content.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể đăng bài viết.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label="Đóng popup" />
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-border/50 p-5">
          <div>
            <h2 className="text-lg font-bold">Viết bài trong nhóm</h2>
            <p className="text-sm text-muted-foreground">Nhóm: {groupName}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={(event) => void handleSubmit(event)} className="min-h-0 overflow-y-auto">
          <div className="grid gap-5 p-5 lg:grid-cols-[260px_1fr]">
            <div className="space-y-2">
              <p className="text-sm font-semibold">Chọn mẫu có sẵn</p>
              {postTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => applyTemplate(template.id)}
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    selectedTemplate === template.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    {template.icon}
                    {template.title}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">{template.description}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
              <div>
                <label className="mb-1.5 block text-sm font-medium">Tiêu đề</label>
                <Input value={title} onChange={(event) => setTitle(event.target.value)} autoFocus />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Nội dung</label>
                <Textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  rows={14}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border/50 p-5">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading} className="gap-2" style={{ background: "var(--gradient-hero)" }}>
              {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-b-white" /> : <Send className="h-4 w-4" />}
              {loading ? "Đang đăng..." : "Đăng bài"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GroupDetailPage() {
  const { user } = useAuth();
  const groupId = new URLSearchParams(window.location.search).get("id");
  const [groupDetail, setGroupDetail] = useState<GroupDetail | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "members">("posts");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [addMemberEmail, setAddMemberEmail] = useState("");
  const [error, setError] = useState("");

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      "x-user-id": user?.id ?? "",
      "x-user-role": user?.role ?? "user",
    }),
    [user?.id, user?.role],
  );

  const fetchData = useCallback(async () => {
    if (!groupId) {
      setLoading(false);
      setError("Không tìm thấy nhóm.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const [groupRes, membersRes, postsRes] = await Promise.all([
        fetch(`/api/groups/${groupId}`, { headers }),
        fetch(`/api/groups/${groupId}/members`, { headers }),
        fetch(`/api/groups/${groupId}/posts`, { headers }),
      ]);

      if (!groupRes.ok) {
        const data = await groupRes.json().catch(() => ({}));
        throw new Error(data.error || "Không thể tải thông tin nhóm.");
      }

      const [groupData, membersData, postsData] = await Promise.all([
        groupRes.json(),
        membersRes.ok ? membersRes.json() : Promise.resolve({ members: [] }),
        postsRes.ok ? postsRes.json() : Promise.resolve({ posts: [] }),
      ]);

      setGroupDetail(groupData);
      setMembers(membersData.members || []);
      setPosts(postsData.posts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải thông tin nhóm.");
    } finally {
      setLoading(false);
    }
  }, [groupId, headers]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const group = groupDetail?.group;
  const isAdmin = groupDetail?.my_role === "admin" || group?.creator_id === user?.id;
  const isCreator = group?.creator_id === user?.id;

  const handleCreatePost = async (title: string, content: string) => {
    if (!groupId) throw new Error("Không tìm thấy nhóm.");
    const response = await fetch(`/api/groups/${groupId}/posts`, {
      method: "POST",
      headers,
      body: JSON.stringify({ title, content }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Không thể tạo bài viết.");
    }
    setShowCreatePost(false);
    setActiveTab("posts");
    await fetchData();
  };

  const handleAddMember = async () => {
    if (!groupId || !addMemberEmail.trim()) return;
    const response = await fetch(`/api/groups/${groupId}/members`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email: addMemberEmail.trim() }),
    });
    if (response.ok) {
      setAddMemberEmail("");
      setShowAddMember(false);
      await fetchData();
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!groupId || !confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    const response = await fetch(`/api/groups/${groupId}/posts/${postId}`, { method: "DELETE", headers });
    if (response.ok) await fetchData();
  };

  const handleDeleteMember = async (memberUserId: string) => {
    if (!groupId || !confirm("Bạn có chắc muốn xóa thành viên này?")) return;
    const response = await fetch(`/api/groups/${groupId}/members/${memberUserId}`, { method: "DELETE", headers });
    if (response.ok) await fetchData();
  };

  const handleDeleteGroup = async () => {
    if (!groupId || !confirm("Bạn có chắc muốn xóa nhóm này?")) return;
    const response = await fetch(`/api/groups/${groupId}`, { method: "DELETE", headers });
    if (response.ok) window.location.assign("/groups");
  };

  const handleLeaveGroup = async () => {
    if (!groupId || !confirm("Bạn có chắc muốn rời nhóm này?")) return;
    const response = await fetch(`/api/groups/${groupId}/leave`, { method: "POST", headers });
    if (response.ok) window.location.assign("/groups");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="min-h-screen">
        <div className="mx-auto max-w-6xl p-6 lg:p-8 space-y-6">
          <Button variant="ghost" onClick={() => window.location.assign("/groups")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Quay về nhóm
          </Button>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
            </div>
          ) : error || !group ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">{error || "Không tìm thấy nhóm."}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <CardTitle className="text-2xl">{group.name}</CardTitle>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {group.job_category && <Badge variant="secondary">{group.job_category}</Badge>}
                        {group.position && <Badge variant="outline">{group.position}</Badge>}
                        {group.experience_level && <Badge variant="outline">{group.experience_level}</Badge>}
                        {group.location && <Badge variant="outline">{group.location}</Badge>}
                        <Badge variant={group.is_private ? "destructive" : "default"}>
                          {group.is_private ? "Riêng tư" : "Công khai"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => setShowCreatePost(true)} className="gap-2" style={{ background: "var(--gradient-hero)" }}>
                        <Plus className="h-4 w-4" />
                        Viết bài
                      </Button>
                      {isAdmin && (
                        <Button variant="outline" onClick={() => setShowAddMember(true)} className="gap-2">
                          <UserPlus className="h-4 w-4" />
                          Thêm thành viên
                        </Button>
                      )}
                      {isCreator ? (
                        <Button variant="destructive" onClick={() => void handleDeleteGroup()}>
                          Xóa nhóm
                        </Button>
                      ) : (
                        <Button variant="outline" onClick={() => void handleLeaveGroup()}>
                          Rời nhóm
                        </Button>
                      )}
                    </div>
                  </div>
                  {group.description && <p className="mt-4 text-sm text-muted-foreground">{group.description}</p>}
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-4 w-4" />{members.length} thành viên</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" />{posts.length} bài viết</span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{formatDate(group.created_at)}</span>
                  </div>
                </CardHeader>
              </Card>

              <div className="flex gap-2 border-b border-border">
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`px-3 pb-3 text-sm font-semibold ${activeTab === "posts" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                >
                  Bài viết ({posts.length})
                </button>
                <button
                  onClick={() => setActiveTab("members")}
                  className={`px-3 pb-3 text-sm font-semibold ${activeTab === "members" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                >
                  Thành viên ({members.length})
                </button>
              </div>

              {activeTab === "posts" ? (
                <div className="space-y-4">
                  {posts.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <MessageSquare className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
                        <p className="text-sm text-muted-foreground">Chưa có bài viết nào.</p>
                        <Button onClick={() => setShowCreatePost(true)} className="mt-4 gap-2">
                          <Plus className="h-4 w-4" />
                          Viết bài đầu tiên
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    posts.map((post) => (
                      <Card key={post.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              {post.author_avatar ? (
                                <img src={post.author_avatar} alt={post.author_name || "Tác giả"} className="h-9 w-9 rounded-full object-cover" />
                              ) : (
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                                  <UserCircle className="h-5 w-5" />
                                </div>
                              )}
                              <div>
                                <h3 className="font-semibold">{post.title}</h3>
                                <p className="text-xs text-muted-foreground">
                                  {post.author_name || post.author_email || "Thành viên"} · {formatTimeAgo(post.created_at)}
                                </p>
                              </div>
                            </div>
                            {(post.author_id === user?.id || isAdmin) && (
                              <Button variant="ghost" size="sm" onClick={() => void handleDeletePost(post.id)} className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="whitespace-pre-wrap text-sm leading-6">{post.content}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between gap-4 border-b border-border/50 p-4 last:border-b-0">
                        <div className="flex items-center gap-3">
                          {member.avatar_url ? (
                            <img src={member.avatar_url} alt={member.name || member.email} className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <UserCircle className="h-6 w-6" />
                            </div>
                          )}
                          <div>
                            <p className="flex items-center gap-2 text-sm font-semibold">
                              {member.name || member.email}
                              {member.user_id === group.creator_id && <Crown className="h-4 w-4 text-amber-500" />}
                            </p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        {isAdmin && member.user_id !== group.creator_id && (
                          <Button variant="ghost" size="sm" onClick={() => void handleDeleteMember(member.user_id)} className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>

      {showCreatePost && group && (
        <CreatePostModal groupName={group.name} onClose={() => setShowCreatePost(false)} onSubmit={handleCreatePost} />
      )}

      {showAddMember && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddMember(false)} aria-label="Đóng popup" />
          <div className="relative w-full max-w-md rounded-xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/50 p-5">
              <h2 className="text-lg font-bold">Thêm thành viên</h2>
              <button onClick={() => setShowAddMember(false)} className="rounded-lg p-2 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Email thành viên</label>
                <Input type="email" value={addMemberEmail} onChange={(event) => setAddMemberEmail(event.target.value)} autoFocus />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowAddMember(false)}>Hủy</Button>
                <Button onClick={() => void handleAddMember()}>Thêm</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
