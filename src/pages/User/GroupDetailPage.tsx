"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  Clock,
  Crown,
  FileText,
  MessageSquare,
  Plus,
  Send,
  ThumbsUp,
  Trash2,
  UserCircle,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader } from "@/components/dashboard-header";
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

interface PostComment {
  id: string;
  post_id: string;
  parent_comment_id?: string | null;
  author_id: string;
  author_name: string | null;
  author_email?: string;
  author_avatar?: string | null;
  content: string;
  created_at: string;
}

function getCommentReplies(comments: PostComment[], parentId: string) {
  return comments.filter((comment) => comment.parent_comment_id === parentId);
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
  like_count: number;
  liked_by_me: boolean;
  reaction_count?: number;
  my_reaction?: string | null;
  reaction_counts?: Record<string, number>;
  comment_count: number;
  comments: PostComment[];
}

interface GroupDetail {
  group: Group;
  my_role: string;
}

const reactionOptions = [
  { type: "like", label: "Thích", emoji: "👍", color: "text-blue-500" },
  { type: "love", label: "Yêu thích", emoji: "❤️", color: "text-rose-500" },
  { type: "haha", label: "Haha", emoji: "😆", color: "text-amber-500" },
  { type: "wow", label: "Wow", emoji: "😮", color: "text-amber-500" },
  { type: "sad", label: "Buồn", emoji: "😢", color: "text-amber-500" },
  { type: "angry", label: "Phẫn nộ", emoji: "😡", color: "text-red-500" },
];

function getReactionOption(type?: string | null) {
  return reactionOptions.find((reaction) => reaction.type === type);
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
  authorName,
  authorAvatar,
  onClose,
  onSubmit,
}: {
  groupName: string;
  authorName: string;
  authorAvatar?: string;
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

  const selectedTemplateData = postTemplates.find((item) => item.id === selectedTemplate) ?? postTemplates[0];
  const initials = authorName.charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label="Đóng popup" />
      <div className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        <div className="relative border-b border-border/50 px-12 py-4 text-center">
          <h2 className="text-lg font-bold">Tạo bài viết</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
            aria-label="Đóng popup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(event) => void handleSubmit(event)} className="min-h-0 overflow-y-auto">
          <div className="space-y-4 p-4">
            {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

            <div className="flex items-center gap-3">
              {authorAvatar ? (
                <img src={authorAvatar} alt={authorName} className="h-11 w-11 rounded-full object-cover" />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{authorName}</p>
                <div className="mt-1 inline-flex max-w-full items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span className="truncate">{groupName}</span>
                </div>
              </div>
            </div>

            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Tiêu đề bài viết"
              className="h-11 rounded-lg border-border/70 text-base font-semibold"
              autoFocus
            />

            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder={`${authorName} ơi, bạn muốn chia sẻ gì?`}
              rows={10}
              className="min-h-[260px] resize-none border-0 px-0 text-base leading-7 shadow-none focus-visible:ring-0"
            />

            <div className="rounded-xl border border-border p-3 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Mẫu bài viết</p>
                  <p className="text-xs text-muted-foreground">Chọn mẫu rồi sửa lại nội dung trước khi đăng.</p>
                </div>
                <div className="hidden items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary sm:flex">
                  {selectedTemplateData.icon}
                  {selectedTemplateData.title}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {postTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => applyTemplate(template.id)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm font-semibold transition ${
                      selectedTemplate === template.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-transparent bg-muted/60 text-foreground hover:bg-muted"
                    }`}
                    title={template.description}
                  >
                    {template.icon}
                    <span className="truncate">{template.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 p-4">
            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full gap-2 rounded-lg text-base font-semibold"
              style={{ background: "var(--gradient-hero)" }}
            >
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
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<string | null>(null);
  const [submittingCommentId, setSubmittingCommentId] = useState<string | null>(null);
  const [activeReactionPicker, setActiveReactionPicker] = useState<string | null>(null);
  const [showMemberPicker, setShowMemberPicker] = useState<string | null>(null);
  const [memberSearch, setMemberSearch] = useState("");
  const [error, setError] = useState("");
  const closeReactionTimerRef = useRef<number | null>(null);

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

  const handleToggleReaction = async (postId: string, reactionType = "like") => {
    if (!groupId) return;
    const response = await fetch(`/api/groups/${groupId}/posts/${postId}/reaction`, {
      method: "POST",
      headers,
      body: JSON.stringify({ reaction_type: reactionType }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Không thể thả cảm xúc cho bài viết.");
      return;
    }

    const data = await response.json();
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked_by_me: Boolean(data.my_reaction),
              like_count: Number(data.reaction_count ?? post.like_count),
              reaction_count: Number(data.reaction_count ?? post.reaction_count ?? post.like_count),
              my_reaction: data.my_reaction,
              reaction_counts: data.reaction_counts || {},
            }
          : post,
      ),
    );
    setActiveReactionPicker(null);
  };

  const handleSubmitComment = async (postId: string, parentCommentId?: string) => {
    if (!groupId) return;
    const draftKey = parentCommentId || postId;
    const content = (parentCommentId ? replyDrafts[draftKey] : commentDrafts[draftKey])?.trim();
    if (!content) return;

    setSubmittingCommentId(draftKey);
    const response = await fetch(`/api/groups/${groupId}/posts/${postId}/comments`, {
      method: "POST",
      headers,
      body: JSON.stringify({ content, parent_comment_id: parentCommentId || null }),
    });
    setSubmittingCommentId(null);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Không thể gửi bình luận.");
      return;
    }

    const data = await response.json();
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...(post.comments || []), data.comment],
              comment_count: Number(data.comment_count ?? post.comment_count + 1),
            }
          : post,
      ),
    );
    if (parentCommentId) {
      setReplyDrafts((drafts) => ({ ...drafts, [parentCommentId]: "" }));
      setActiveReplyCommentId(null);
    } else {
      setCommentDrafts((drafts) => ({ ...drafts, [postId]: "" }));
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!groupId || !confirm("Bạn có chắc muốn xóa bình luận này?")) return;
    const response = await fetch(`/api/groups/${groupId}/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) return;

    const data = await response.json();
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: (post.comments || []).filter((comment) => comment.id !== commentId),
              comment_count: Number(data.comment_count ?? Math.max(0, post.comment_count - 1)),
            }
          : post,
      ),
    );
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

  const { logout } = useAuth();

  const userNavItems = [
    { label: "Tổng quan", icon: <span />, href: "/user/dashboard" },
    { label: "Phỏng vấn", icon: <span />, href: "/interview/config" },
    { label: "Xem CV", icon: <span />, href: "/cv" },
    { label: "Nhóm", icon: <span />, href: "/groups" },
  ];

  const insertMention = (postId: string, commentId: string | null, authorName: string, authorId: string) => {
    const key = commentId || postId;
    const currentDraft = commentId ? replyDrafts[key] || "" : commentDrafts[key] || "";
    const mention = `@${authorName} `;
    const newDraft = currentDraft + mention;
    
    if (commentId) {
      setReplyDrafts((drafts) => ({ ...drafts, [key]: newDraft }));
    } else {
      setCommentDrafts((drafts) => ({ ...drafts, [key]: newDraft }));
    }
    setShowMemberPicker(null);
    setMemberSearch("");
    
    // Focus the input
    setTimeout(() => {
      const input = document.getElementById(`reply-${commentId || postId}`) as HTMLInputElement | null;
      if (input) {
        input.focus();
        // Move cursor to end
        const len = input.value.length;
        input.setSelectionRange(len, len);
      }
    }, 0);
  };

  const filteredMembers = members.filter((member) =>
    member.name?.toLowerCase().includes(memberSearch.toLowerCase()) ||
    member.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader
        navItems={userNavItems}
        activePath="/groups"
        role="user"
        onLogout={logout}
      />

      <main className="pt-16">
        <div className="mx-auto max-w-6xl p-6 lg:p-8 space-y-6" style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}>
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
                        <CardContent className="space-y-4">
                          <p className="whitespace-pre-wrap text-sm leading-6">{post.content}</p>

                          <div className="flex items-center justify-between border-y border-border/60 py-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                              {Object.entries(post.reaction_counts || {})
                                .filter(([, count]) => Number(count) > 0)
                                .slice(0, 3)
                                .map(([type]) => (
                                  <span key={type} title={getReactionOption(type)?.label} className="-mr-1">
                                    {getReactionOption(type)?.emoji}
                                  </span>
                                ))}
                              {post.reaction_count ?? post.like_count ?? 0} cảm xúc
                            </span>
                            <span>{post.comment_count || 0} bình luận</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div
                              className="relative"
                              onMouseEnter={() => {
                                if (closeReactionTimerRef.current) {
                                  window.clearTimeout(closeReactionTimerRef.current);
                                  closeReactionTimerRef.current = null;
                                }
                                setActiveReactionPicker(post.id);
                              }}
                              onMouseLeave={() => {
                                closeReactionTimerRef.current = window.setTimeout(() => {
                                  setActiveReactionPicker((current) => (current === post.id ? null : current));
                                }, 250);
                              }}
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                  if (post.my_reaction) {
                                    // Nếu đã có reaction, click sẽ xóa reaction
                                    void handleToggleReaction(post.id, post.my_reaction);
                                  } else {
                                    // Nếu chưa có reaction, click sẽ thả like
                                    void handleToggleReaction(post.id, "like");
                                  }
                                }}
                                onMouseEnter={() => {
                                  if (closeReactionTimerRef.current) {
                                    window.clearTimeout(closeReactionTimerRef.current);
                                    closeReactionTimerRef.current = null;
                                  }
                                  setActiveReactionPicker(post.id);
                                }}
                                className={`w-full gap-2 ${post.my_reaction ? getReactionOption(post.my_reaction)?.color || "text-primary" : "text-muted-foreground"}`}
                              >
                                {post.my_reaction ? (
                                  <span className="text-base">{getReactionOption(post.my_reaction)?.emoji}</span>
                                ) : (
                                  <ThumbsUp className="h-4 w-4" />
                                )}
                                {getReactionOption(post.my_reaction)?.label || "Thích"}
                              </Button>
                              {activeReactionPicker === post.id && (
                                <div
                                  className="absolute left-0 bottom-full z-20 mb-2 flex rounded-full border border-border bg-card p-1.5 shadow-xl"
                                  onMouseEnter={() => {
                                    if (closeReactionTimerRef.current) {
                                      window.clearTimeout(closeReactionTimerRef.current);
                                      closeReactionTimerRef.current = null;
                                    }
                                    setActiveReactionPicker(post.id);
                                  }}
                                  onMouseLeave={() => {
                                    closeReactionTimerRef.current = window.setTimeout(() => {
                                      setActiveReactionPicker((current) => (current === post.id ? null : current));
                                    }, 250);
                                  }}
                                >
                                  {reactionOptions.map((reaction) => (
                                    <button
                                      key={reaction.type}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        void handleToggleReaction(post.id, reaction.type);
                                        setActiveReactionPicker(null);
                                      }}
                                      className="flex h-10 w-10 items-center justify-center rounded-full text-2xl transition hover:-translate-y-1 hover:bg-muted"
                                      title={reaction.label}
                                      aria-label={reaction.label}
                                    >
                                      {reaction.emoji}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                const input = document.getElementById(`comment-${post.id}`);
                                input?.focus();
                              }}
                              className="gap-2 text-muted-foreground"
                            >
                              <MessageSquare className="h-4 w-4" />
                              Bình luận
                            </Button>
                          </div>

                          <div className="space-y-3">
                            {(post.comments || [])
                              .filter((comment) => !comment.parent_comment_id)
                              .map((comment) => {
                                const replies = getCommentReplies(post.comments || [], comment.id);

                                return (
                                  <div key={comment.id} className="space-y-2">
                                    <div className="flex items-start gap-2">
                                      {comment.author_avatar ? (
                                        <img
                                          src={comment.author_avatar}
                                          alt={comment.author_name || "Thành viên"}
                                          className="h-8 w-8 rounded-full object-cover"
                                        />
                                      ) : (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                          <UserCircle className="h-4 w-4" />
                                        </div>
                                      )}
                                      <div className="min-w-0 flex-1">
                                        <div className="rounded-2xl bg-muted px-3 py-2">
                                          <div className="flex items-start justify-between gap-2">
                                            <p className="text-sm font-semibold">{comment.author_name || comment.author_email || "Thành viên"}</p>
                                            {(comment.author_id === user?.id || isAdmin) && (
                                              <button
                                                type="button"
                                                onClick={() => void handleDeleteComment(post.id, comment.id)}
                                                className="text-muted-foreground hover:text-destructive"
                                                aria-label="Xóa bình luận"
                                              >
                                                <Trash2 className="h-3.5 w-3.5" />
                                              </button>
                                            )}
                                          </div>
                                          <p className="whitespace-pre-wrap break-words text-sm leading-5">{comment.content}</p>
                                        </div>
                                        <div className="mt-1 flex items-center gap-3 px-3 text-xs text-muted-foreground">
                                          <span>{formatTimeAgo(comment.created_at)}</span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (activeReplyCommentId === comment.id) {
                                                setActiveReplyCommentId(null);
                                                setReplyDrafts((drafts) => ({ ...drafts, [comment.id]: "" }));
                                              } else {
                                                const name = comment.author_name || comment.author_email || "Thành viên";
                                                setReplyDrafts((drafts) => ({ ...drafts, [comment.id]: `@${name} ` }));
                                                setActiveReplyCommentId(comment.id);
                                                setTimeout(() => {
                                                  const input = document.getElementById(`reply-${comment.id}`) as HTMLInputElement | null;
                                                  if (input) {
                                                    input.focus();
                                                    input.setSelectionRange(input.value.length, input.value.length);
                                                  }
                                                }, 0);
                                              }
                                            }}
                                            className="font-semibold hover:text-foreground"
                                          >
                                            Trả lời
                                          </button>
                                        </div>

                                        {replies.length > 0 && (
                                          <div className="mt-2 space-y-2 border-l border-border/70 pl-3">
                                            {replies.map((reply) => (
                                              <div key={reply.id} className="flex items-start gap-2">
                                                {reply.author_avatar ? (
                                                  <img
                                                    src={reply.author_avatar}
                                                    alt={reply.author_name || "Thành viên"}
                                                    className="h-7 w-7 rounded-full object-cover"
                                                  />
                                                ) : (
                                                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                    <UserCircle className="h-3.5 w-3.5" />
                                                  </div>
                                                )}
                                                <div className="min-w-0 flex-1">
                                                  <div className="rounded-2xl bg-muted px-3 py-2">
                                                    <div className="flex items-start justify-between gap-2">
                                                      <p className="text-sm font-semibold">{reply.author_name || reply.author_email || "Thành viên"}</p>
                                                      {(reply.author_id === user?.id || isAdmin) && (
                                                        <button
                                                          type="button"
                                                          onClick={() => void handleDeleteComment(post.id, reply.id)}
                                                          className="text-muted-foreground hover:text-destructive"
                                                          aria-label="Xóa trả lời"
                                                        >
                                                          <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                      )}
                                                    </div>
                                                    <p className="whitespace-pre-wrap break-words text-sm leading-5">{reply.content}</p>
                                                  </div>
                                                  <p className="mt-1 px-3 text-xs text-muted-foreground">{formatTimeAgo(reply.created_at)}</p>
                                                  <button
                                                    type="button"
                                                    onClick={() => {
                                                      if (activeReplyCommentId === reply.id) {
                                                        setActiveReplyCommentId(null);
                                                        setReplyDrafts((drafts) => ({ ...drafts, [reply.id]: "" }));
                                                      } else {
                                                        const name = reply.author_name || reply.author_email || "Thành viên";
                                                        setReplyDrafts((drafts) => ({ ...drafts, [reply.id]: `@${name} ` }));
                                                        setActiveReplyCommentId(reply.id);
                                                        setTimeout(() => {
                                                          const input = document.getElementById(`reply-${reply.id}`) as HTMLInputElement | null;
                                                          if (input) {
                                                            input.focus();
                                                            input.setSelectionRange(input.value.length, input.value.length);
                                                          }
                                                        }, 0);
                                                      }
                                                    }}
                                                    className="px-3 text-xs font-semibold text-muted-foreground hover:text-foreground"
                                                  >
                                                    Trả lời
                                                  </button>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}

                                        {activeReplyCommentId === comment.id && (
                                          <div className="mt-2 relative">
                                            <div className="flex items-center gap-2">
                                              {user?.image ? (
                                                <img src={user.image} alt={user.name || "Bạn"} className="h-7 w-7 rounded-full object-cover" />
                                              ) : (
                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                                  <UserCircle className="h-3.5 w-3.5" />
                                                </div>
                                              )}
                                              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-background px-3 py-1 focus-within:ring-2 focus-within:ring-ring">
                                                <input
                                                  id={`reply-${comment.id}`}
                                                  value={replyDrafts[comment.id] || ""}
                                                  onChange={(event) =>
                                                    setReplyDrafts((drafts) => ({ ...drafts, [comment.id]: event.target.value }))
                                                  }
                                                  onKeyDown={(event) => {
                                                    if (event.key === "Enter" && !event.shiftKey) {
                                                      event.preventDefault();
                                                      void handleSubmitComment(post.id, comment.id);
                                                    }
                                                  }}
                                                  onFocus={() => setShowMemberPicker(comment.id)}
                                                  placeholder="Viết trả lời..."
                                                  className="h-7 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                                                  autoFocus
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() => void handleSubmitComment(post.id, comment.id)}
                                                  disabled={submittingCommentId === comment.id || !replyDrafts[comment.id]?.trim()}
                                                  className="text-primary disabled:cursor-not-allowed disabled:text-muted-foreground"
                                                  aria-label="Gửi trả lời"
                                                >
                                                  <Send className="h-4 w-4" />
                                                </button>
                                              </div>
                                            </div>
                                            
                                            {showMemberPicker === comment.id && (
                                              <div className="absolute left-8 top-full z-30 mt-1 w-64 rounded-lg border border-border bg-card shadow-xl">
                                                <div className="p-2 border-b border-border/50">
                                                  <input
                                                    type="text"
                                                    value={memberSearch}
                                                    onChange={(e) => setMemberSearch(e.target.value)}
                                                    placeholder="Tìm thành viên..."
                                                    className="w-full px-2 py-1.5 text-sm border border-border rounded-md outline-none focus:ring-2 focus:ring-ring"
                                                    autoFocus
                                                  />
                                                </div>
                                                <div className="max-h-48 overflow-y-auto">
                                                  {filteredMembers.slice(0, 8).map((member) => (
                                                    <button
                                                      key={member.id}
                                                      type="button"
                                                      onClick={() => insertMention(post.id, comment.id, member.name || member.email, member.user_id)}
                                                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                                                    >
                                                      {member.avatar_url ? (
                                                        <img src={member.avatar_url} alt="" className="h-6 w-6 rounded-full object-cover" />
                                                      ) : (
                                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                                                          {(member.name || member.email).charAt(0).toUpperCase()}
                                                        </div>
                                                      )}
                                                      <span className="font-medium">{member.name || member.email}</span>
                                                    </button>
                                                  ))}
                                                  {filteredMembers.length === 0 && (
                                                    <p className="p-3 text-center text-sm text-muted-foreground">Không tìm thấy thành viên</p>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}

                            <div className="flex items-center gap-2 relative">
                              {user?.image ? (
                                <img src={user.image} alt={user.name || "Bạn"} className="h-8 w-8 rounded-full object-cover" />
                              ) : (
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                  <UserCircle className="h-4 w-4" />
                                </div>
                              )}
                              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 focus-within:ring-2 focus-within:ring-ring">
                                <input
                                  id={`comment-${post.id}`}
                                  value={commentDrafts[post.id] || ""}
                                  onChange={(event) =>
                                    setCommentDrafts((drafts) => ({ ...drafts, [post.id]: event.target.value }))
                                  }
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter" && !event.shiftKey) {
                                      event.preventDefault();
                                      void handleSubmitComment(post.id);
                                    }
                                  }}
                                  onFocus={() => setShowMemberPicker(`main-${post.id}`)}
                                  placeholder="Viết bình luận..."
                                  className="h-8 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                                />
                                <button
                                  type="button"
                                  onClick={() => void handleSubmitComment(post.id)}
                                  disabled={submittingCommentId === post.id || !commentDrafts[post.id]?.trim()}
                                  className="text-primary disabled:cursor-not-allowed disabled:text-muted-foreground"
                                  aria-label="Gửi bình luận"
                                >
                                  <Send className="h-4 w-4" />
                                </button>
                              </div>
                              
                              {showMemberPicker === `main-${post.id}` && (
                                <div className="absolute left-10 top-full z-30 mt-1 w-64 rounded-lg border border-border bg-card shadow-xl">
                                  <div className="p-2 border-b border-border/50">
                                    <input
                                      type="text"
                                      value={memberSearch}
                                      onChange={(e) => setMemberSearch(e.target.value)}
                                      placeholder="Tìm thành viên..."
                                      className="w-full px-2 py-1.5 text-sm border border-border rounded-md outline-none focus:ring-2 focus:ring-ring"
                                      autoFocus
                                    />
                                  </div>
                                  <div className="max-h-48 overflow-y-auto">
                                    {filteredMembers.slice(0, 8).map((member) => (
                                      <button
                                        key={member.id}
                                        type="button"
                                        onClick={() => insertMention(post.id, null, member.name || member.email, member.user_id)}
                                        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                                      >
                                        {member.avatar_url ? (
                                          <img src={member.avatar_url} alt="" className="h-6 w-6 rounded-full object-cover" />
                                        ) : (
                                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                                            {(member.name || member.email).charAt(0).toUpperCase()}
                                          </div>
                                        )}
                                        <span className="font-medium">{member.name || member.email}</span>
                                      </button>
                                    ))}
                                    {filteredMembers.length === 0 && (
                                      <p className="p-3 text-center text-sm text-muted-foreground">Không tìm thấy thành viên</p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
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
        <CreatePostModal
          groupName={group.name}
          authorName={user?.name || user?.email || "Người dùng"}
          authorAvatar={user?.image}
          onClose={() => setShowCreatePost(false)}
          onSubmit={handleCreatePost}
        />
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
