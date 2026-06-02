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
  QrCode,
  Copy,
  Check,
  MessageCircle,
  Pencil,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader } from "@/components/dashboard-header";
import { userNavItems } from "@/pages/user/user-nav-items";
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

interface GroupMessage {
  id: string;
  group_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender_name: string | null;
  sender_avatar: string | null;
  sender_email: string;
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
  local_ip?: string;
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

const industries = [
  { value: "it", label: "Công nghệ thông tin" },
  { value: "finance", label: "Tài chính - Ngân hàng" },
  { value: "marketing", label: "Kinh doanh - Marketing" },
  { value: "engineering", label: "Kỹ thuật" },
  { value: "hr", label: "Nhân sự" },
  { value: "education", label: "Giáo dục" },
  { value: "healthcare", label: "Y tế" },
  { value: "design", label: "Thiết kế" },
  { value: "other", label: "Khác" },
];

const jobTitlesByIndustry: Record<string, { value: string; label: string }[]> = {
  it: [
    { value: "Frontend Developer", label: "Frontend Developer" },
    { value: "Backend Developer", label: "Backend Developer" },
    { value: "Fullstack Developer", label: "Fullstack Developer" },
    { value: "Mobile Developer", label: "Mobile Developer" },
    { value: "DevOps Engineer", label: "DevOps Engineer" },
    { value: "QA Engineer", label: "QA Engineer" },
    { value: "Data Engineer", label: "Data Engineer" },
    { value: "Machine Learning Engineer", label: "Machine Learning Engineer" },
    { value: "Cloud Engineer", label: "Cloud Engineer" },
    { value: "Security Engineer", label: "Security Engineer" },
    { value: "Product Manager", label: "Product Manager" },
    { value: "UI/UX Designer", label: "UI/UX Designer" },
  ],
  finance: [
    { value: "Chuyên viên tín dụng", label: "Chuyên viên tín dụng" },
    { value: "Chuyên viên tài chính", label: "Chuyên viên tài chính" },
    { value: "Kế toán", label: "Kế toán" },
    { value: "Kiểm toán", label: "Kiểm toán" },
    { value: "Chuyên viên đầu tư", label: "Chuyên viên đầu tư" },
    { value: "Quản lý rủi ro", label: "Quản lý rủi ro" },
    { value: "Bảo hiểm", label: "Chuyên viên bảo hiểm" },
  ],
  marketing: [
    { value: "Content Marketing", label: "Content Marketing" },
    { value: "Digital Marketing", label: "Digital Marketing" },
    { value: "SEO Specialist", label: "SEO Specialist" },
    { value: "Social Media Marketing", label: "Social Media Marketing" },
    { value: "Brand Manager", label: "Brand Manager" },
    { value: "Marketing Manager", label: "Marketing Manager" },
    { value: "Sales Executive", label: "Sales Executive" },
    { value: "Business Development", label: "Business Development" },
  ],
  engineering: [
    { value: "Kỹ sư cơ khí", label: "Kỹ sư cơ khí" },
    { value: "Kỹ sư điện", label: "Kỹ sư điện" },
    { value: "Kỹ sư xây dựng", label: "Kỹ sư xây dựng" },
    { value: "Kỹ sư công nghiệp", label: "Kỹ sư công nghiệp" },
    { value: "Kỹ sư hóa", label: "Kỹ sư hóa" },
    { value: "Project Engineer", label: "Project Engineer" },
  ],
  hr: [
    { value: "Recruiter", label: "Recruiter" },
    { value: "HR Executive", label: "HR Executive" },
    { value: "HR Manager", label: "HR Manager" },
    { value: "Training Specialist", label: "Training Specialist" },
    { value: "C&B Specialist", label: "C&B Specialist" },
    { value: "HRBP", label: "HR Business Partner" },
  ],
  education: [
    { value: "Giáo viên", label: "Giáo viên" },
    { value: "Giảng viên", label: "Giảng viên" },
    { value: "Tư vấn tuyển sinh", label: "Tư vấn tuyển sinh" },
    { value: "Content Creator (Education)", label: "Content Creator (Education)" },
    { value: "Product Manager (EdTech)", label: "Product Manager (EdTech)" },
  ],
  healthcare: [
    { value: "Bác sĩ", label: "Bác sĩ" },
    { value: "Dược sĩ", label: "Dược sĩ" },
    { value: "Điều dưỡng", label: "Điều dưỡng" },
    { value: "Marketing y tế", label: "Marketing y tế" },
    { value: "Quản lý phòng khám", label: "Quản lý phòng khám" },
  ],
  design: [
    { value: "Graphic Designer", label: "Graphic Designer" },
    { value: "UI Designer", label: "UI Designer" },
    { value: "UX Designer", label: "UX Designer" },
    { value: "Product Designer", label: "Product Designer" },
    { value: "Motion Designer", label: "Motion Designer" },
    { value: "3D Artist", label: "3D Artist" },
  ],
  other: [
    { value: "Chuyên viên", label: "Chuyên viên" },
    { value: "Quản lý", label: "Quản lý" },
    { value: "Trưởng phòng", label: "Trưởng phòng" },
    { value: "Giám đốc", label: "Giám đốc" },
    { value: "Kinh doanh", label: "Kinh doanh" },
    { value: "Vận hành", label: "Vận hành" },
  ],
};

const experienceLevels = ["Fresher", "Junior", "Middle", "Senior", "Lead/Manager"];
const locations = ["Miền Bắc", "Miền Trung", "Miền Nam"];

function EditGroupModal({
  group,
  onClose,
  onSubmit,
}: {
  group: Group;
  onClose: () => void;
  onSubmit: (payload: {
    name: string;
    description: string;
    job_category: string;
    experience_level: string;
    position: string;
    location: string;
    is_private: boolean;
  }) => Promise<void>;
}) {
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description || "");
  
  const initialCategoryKey = useMemo(() => {
    return industries.find((item) => item.label === group.job_category)?.value || "";
  }, [group.job_category]);

  const [jobCategory, setJobCategory] = useState(initialCategoryKey);
  const [experienceLevel, setExperienceLevel] = useState(group.experience_level || "");
  const [position, setPosition] = useState(group.position || "");
  const [location, setLocation] = useState(group.location || "");
  const [isPrivate, setIsPrivate] = useState(group.is_private);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const jobTitles = jobCategory ? jobTitlesByIndustry[jobCategory] || [] : [];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Tên nhóm không được để trống.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const industryLabel = industries.find((item) => item.value === jobCategory)?.label || "";
      const positionLabel = jobCategory 
        ? (jobTitles.find((item) => item.value === position)?.label || position)
        : "";

      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        job_category: industryLabel,
        experience_level: experienceLevel,
        position: positionLabel,
        location,
        is_private: isPrivate,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể chỉnh sửa nhóm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label="Đóng popup" />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/50 p-5">
          <h2 className="text-lg font-bold">Chỉnh sửa thông tin nhóm</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-muted" aria-label="Đóng popup">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={(event) => void handleSubmit(event)}>
          <div className="space-y-4 p-5">
            {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
            <div>
              <label className="mb-1.5 block text-sm font-medium">Tên nhóm</label>
              <Input value={name} onChange={(event) => setName(event.target.value)} autoFocus />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Ngành nghề</label>
                <select
                  value={jobCategory}
                  onChange={(event) => {
                    setJobCategory(event.target.value);
                    setPosition("");
                  }}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Chọn ngành nghề</option>
                  {industries.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Kinh nghiệm</label>
                <select 
                  value={experienceLevel} 
                  onChange={(event) => setExperienceLevel(event.target.value)} 
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Chọn kinh nghiệm</option>
                  {experienceLevels.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Vị trí</label>
                <select
                  value={position}
                  onChange={(event) => setPosition(event.target.value)}
                  disabled={!jobCategory}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm disabled:cursor-not-allowed disabled:bg-muted/50 disabled:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Chọn vị trí</option>
                  {jobTitles.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                {!jobCategory && <p className="mt-1 text-xs text-muted-foreground">Chọn ngành trước</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Nơi ở</label>
                <select 
                  value={location} 
                  onChange={(event) => setLocation(event.target.value)} 
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Chọn nơi ở</option>
                  {locations.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Mô tả</label>
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} />
            </div>
            <label className="flex items-center gap-2 text-sm select-none cursor-pointer">
              <input type="checkbox" checked={isPrivate} onChange={(event) => setIsPrivate(event.target.checked)} className="accent-primary" />
              Nhóm riêng tư
            </label>
          </div>
          <div className="flex justify-end gap-3 border-t border-border/50 p-5">
            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
            <Button type="submit" disabled={loading}>{loading ? "Đang lưu..." : "Lưu thay đổi"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GroupDetailPage() {
  const { user } = useAuth();
  const rawGroupId = new URLSearchParams(window.location.search).get("id");
  const groupId = rawGroupId ? rawGroupId.replace(/^\//, "") : "";
  const [groupDetail, setGroupDetail] = useState<GroupDetail | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "members" | "chat">("posts");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadingQR, setDownloadingQR] = useState(false);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [showFloatingChat, setShowFloatingChat] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const prevMessagesLengthRef = useRef(0);
  const isFirstChatLoadRef = useRef(true);
  const isFirstMessagesLoadedRef = useRef(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const floatingChatScrollRef = useRef<HTMLDivElement | null>(null);
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

  const handleEditGroup = async (payload: {
    name: string;
    description: string;
    job_category: string;
    experience_level: string;
    position: string;
    location: string;
    is_private: boolean;
  }) => {
    if (!groupId) throw new Error("Không tìm thấy nhóm.");
    const response = await fetch(`/api/groups/${groupId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Không thể lưu thông tin nhóm.");
    }
    setShowEditGroup(false);
    await fetchData();
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

  // If the user is accessing via localhost, we use the server's local network IP so their phone can scan it successfully on Wi-Fi!
  const localIp = groupDetail?.local_ip || "localhost";
  const inviteUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? `http://${localIp}:3000/groups/invite?id=${groupId}`
    : `${window.location.origin}/groups/invite?id=${groupId}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(inviteUrl)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Lỗi khi sao chép liên kết:", err);
    }
  };

  const handleDownloadQR = async () => {
    if (downloadingQR) return;
    setDownloadingQR(true);
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qrcode-nhom-${group?.name || "group"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Lỗi khi tải mã QR:", err);
    } finally {
      setDownloadingQR(false);
    }
  };

  const fetchMessages = useCallback(async () => {
    if (!groupId) return;
    try {
      const response = await fetch(`/api/groups/${groupId}/messages`, { headers });
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        isFirstMessagesLoadedRef.current = true;
      }
    } catch (err) {
      console.error("Lỗi khi tải tin nhắn:", err);
    }
  }, [groupId, headers]);

  const handleSendMessage = async (messageText: string) => {
    if (!groupId || !messageText.trim()) return;
    try {
      const response = await fetch(`/api/groups/${groupId}/messages`, {
        method: "POST",
        headers,
        body: JSON.stringify({ message: messageText.trim() }),
      });
      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, data.message]);
        setChatInput("");
        setTimeout(() => {
          chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
          floatingChatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
      }
    } catch (err) {
      console.error("Lỗi khi gửi tin nhắn:", err);
    }
  };

  // Poll messages every 3 seconds for real-time background sync
  useEffect(() => {
    if (!groupId) return;
    void fetchMessages();
    const interval = setInterval(() => {
      void fetchMessages();
    }, 3000);
    return () => clearInterval(interval);
  }, [groupId, fetchMessages]);

  // Track unread chat messages for floating chat bubble badge
  useEffect(() => {
    // Chỉ hoạt động khi tin nhắn đã hoàn tất lượt tải đầu tiên
    if (!isFirstMessagesLoadedRef.current) return;

    if (isFirstChatLoadRef.current) {
      prevMessagesLengthRef.current = messages.length;
      isFirstChatLoadRef.current = false;
      return;
    }

    if (showFloatingChat || activeTab === "chat") {
      setUnreadChatCount(0);
      prevMessagesLengthRef.current = messages.length;
    } else {
      if (messages.length > prevMessagesLengthRef.current) {
        const diff = messages.length - prevMessagesLengthRef.current;
        setUnreadChatCount((prev) => prev + diff);
      }
      prevMessagesLengthRef.current = messages.length;
    }
  }, [messages, showFloatingChat, activeTab]);

  // Clear unread count when user opens chat
  useEffect(() => {
    if (showFloatingChat || activeTab === "chat") {
      setUnreadChatCount(0);
      prevMessagesLengthRef.current = messages.length;
    }
  }, [showFloatingChat, activeTab, messages.length]);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
    floatingChatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, activeTab, showFloatingChat]);

  const { logout } = useAuth();

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
                      <Button variant="outline" onClick={() => setShowQRCodeModal(true)} className="gap-2" id="btn-show-qr">
                        <QrCode className="h-4 w-4" />
                        Mã QR nhóm
                      </Button>
                      {isAdmin && (
                        <Button variant="outline" onClick={() => setShowEditGroup(true)} className="gap-2" id="btn-edit-group">
                          <Pencil className="h-4 w-4" />
                          Chỉnh sửa
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
                  className={`px-3 pb-3 text-sm font-semibold cursor-pointer ${activeTab === "posts" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                >
                  Bài viết ({posts.length})
                </button>
                <button
                  onClick={() => setActiveTab("members")}
                  className={`px-3 pb-3 text-sm font-semibold cursor-pointer ${activeTab === "members" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                >
                  Thành viên ({members.length})
                </button>
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`px-3 pb-3 text-sm font-semibold cursor-pointer ${activeTab === "chat" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}
                >
                  Trò chuyện
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
              ) : activeTab === "members" ? (
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
              ) : (
                <Card className="border border-border/80 bg-card/40 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden flex flex-col h-[550px]" id="chat-tab-container">
                  {/* Chat feed container */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                        <MessageCircle className="h-12 w-12 text-muted-foreground/30 mb-2 animate-bounce" />
                        <p className="text-sm font-semibold">Chưa có cuộc hội thoại nào</p>
                        <p className="text-xs text-muted-foreground/80 mt-0.5">Hãy bắt đầu gửi tin nhắn đầu tiên để cùng trao đổi!</p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isSelf = msg.sender_id === user?.id;
                        const isMsgCreator = msg.sender_id === group.creator_id;
                        return (
                          <div key={msg.id} className={`flex items-start gap-3 ${isSelf ? "flex-row-reverse" : ""}`}>
                            {/* Avatar */}
                            {!isSelf && (
                              msg.sender_avatar ? (
                                <img src={msg.sender_avatar} alt="" className="h-9 w-9 rounded-full object-cover border border-border" />
                              ) : (
                                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-bold shrink-0">
                                  {(msg.sender_name || msg.sender_email).charAt(0).toUpperCase()}
                                </div>
                              )
                            )}

                            {/* Bubble body */}
                            <div className={`max-w-[70%] space-y-1 ${isSelf ? "text-right" : "text-left"}`}>
                              {!isSelf && (
                                <p className="text-[11px] font-bold text-muted-foreground/80 flex items-center gap-1">
                                  {msg.sender_name || msg.sender_email}
                                  {isMsgCreator && <Crown className="h-3 w-3 text-amber-500" />}
                                </p>
                              )}
                              <div
                                className={`px-4 py-2.5 rounded-2xl text-sm break-words leading-relaxed shadow-sm inline-block text-left ${
                                  isSelf
                                    ? "bg-gradient-to-r from-primary to-primary-hover text-white rounded-tr-none"
                                    : "bg-muted text-foreground rounded-tl-none"
                                }`}
                              >
                                {msg.message}
                              </div>
                              <p className="text-[9px] text-muted-foreground/60 font-mono">
                                {new Date(msg.created_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={chatScrollRef} />
                  </div>

                  {/* Input bar */}
                  <div className="border-t border-border p-4 bg-muted/20">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        void handleSendMessage(chatInput);
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Nhập nội dung trò chuyện..."
                        className="flex-1 h-10 px-4 rounded-xl border border-input bg-background text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      <Button
                        type="submit"
                        disabled={!chatInput.trim()}
                        className="h-10 px-4 rounded-xl font-semibold gap-2 cursor-pointer shrink-0"
                        style={{ background: "var(--gradient-hero)" }}
                      >
                        <Send className="h-4 w-4" />
                        Gửi
                      </Button>
                    </form>
                  </div>
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

      {showEditGroup && group && (
        <EditGroupModal
          group={group}
          onClose={() => setShowEditGroup(false)}
          onSubmit={handleEditGroup}
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

      {showQRCodeModal && group && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowQRCodeModal(false)} aria-label="Đóng popup" />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Top accent gradient bar */}
            <div className="h-2 w-full bg-gradient-to-r from-primary via-primary-hover to-accent-mint" />

            <div className="flex items-center justify-between border-b border-border/50 p-5">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold">Mã QR nhóm</h2>
              </div>
              <button onClick={() => setShowQRCodeModal(false)} className="rounded-lg p-2 hover:bg-muted text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 text-center space-y-6">
              <div>
                <h3 className="font-extrabold text-lg text-foreground">{group.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">Quét mã QR để nhanh chóng tham gia cộng đồng này.</p>
              </div>

              {/* QR Code Container */}
              <div className="mx-auto w-[220px] h-[220px] p-3 rounded-2xl border border-border bg-white shadow-inner flex items-center justify-center relative overflow-hidden group">
                <img
                  src={qrCodeUrl}
                  alt={`QR Code ${group.name}`}
                  className="w-full h-full object-contain select-none"
                  crossOrigin="anonymous"
                />
              </div>

              {/* URL Box */}
              <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-muted/30 p-2.5">
                <input
                  type="text"
                  value={inviteUrl}
                  readOnly
                  className="flex-1 bg-transparent text-xs outline-none select-all text-muted-foreground font-mono text-left truncate pl-2"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => void handleCopyLink()}
                  className="shrink-0 h-8 px-3 rounded-lg flex items-center gap-1.5"
                  id="btn-copy-invite-link"
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-500 font-semibold">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span className="text-xs">Sao chép</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Download Action button */}
              <div className="pt-2 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowQRCodeModal(false)}
                  className="flex-1 rounded-xl h-11 text-sm font-semibold"
                >
                  Đóng
                </Button>
                <Button
                  onClick={() => void handleDownloadQR()}
                  disabled={downloadingQR}
                  className="flex-1 rounded-xl h-11 text-sm font-semibold gap-2"
                  style={{ background: "var(--gradient-hero)" }}
                  id="btn-download-qr"
                >
                  {downloadingQR ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Đang tải...
                    </>
                  ) : (
                    <>
                      Tải ảnh QR
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Glowing Chat Bubble Trigger */}
      {group && (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3 select-none">
          {/* Glowing floating popover chat box */}
          {showFloatingChat && (
            <div className="w-[340px] h-[460px] rounded-2xl border border-border bg-card/85 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-200">
              {/* Popover Header */}
              <div className="bg-gradient-to-r from-primary via-primary-hover to-accent-mint p-4 text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 animate-pulse" />
                  <div className="text-left">
                    <p className="text-xs font-bold opacity-80 uppercase tracking-wider">Hội thoại nhóm</p>
                    <p className="text-sm font-extrabold truncate max-w-[200px]">{group.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFloatingChat(false)}
                  className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Popover Chat Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-card">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
                    <MessageCircle className="h-10 w-10 text-muted-foreground/30 mb-2 animate-bounce" />
                    <p className="text-xs font-bold">Chưa có tin nhắn</p>
                    <p className="text-[10px] text-muted-foreground/75 mt-0.5">Bắt đầu chat với nhóm!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isSelf = msg.sender_id === user?.id;
                    const isMsgCreator = msg.sender_id === group.creator_id;
                    return (
                      <div key={msg.id} className={`flex items-start gap-2 ${isSelf ? "flex-row-reverse" : ""}`}>
                        {!isSelf && (
                          msg.sender_avatar ? (
                            <img src={msg.sender_avatar} alt="" className="h-7 w-7 rounded-full object-cover border border-border shrink-0" />
                          ) : (
                            <div className="h-7 w-7 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {(msg.sender_name || msg.sender_email).charAt(0).toUpperCase()}
                            </div>
                          )
                        )}
                        <div className={`max-w-[75%] ${isSelf ? "text-right" : "text-left"}`}>
                          {!isSelf && (
                            <p className="text-[9px] font-bold text-muted-foreground/80 flex items-center gap-0.5 mb-0.5">
                              {msg.sender_name || msg.sender_email}
                              {isMsgCreator && <Crown className="h-2.5 w-2.5 text-amber-500" />}
                            </p>
                          )}
                          <div
                            className={`px-3 py-2 rounded-xl text-xs break-words inline-block text-left shadow-sm ${
                              isSelf
                                ? "bg-gradient-to-r from-primary to-primary-hover text-white rounded-tr-none"
                                : "bg-muted text-foreground rounded-tl-none"
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={floatingChatScrollRef} />
              </div>

              {/* Popover Input */}
              <div className="border-t border-border/50 p-3 bg-muted/15">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void handleSendMessage(chatInput);
                  }}
                  className="flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 h-9 px-3 rounded-lg border border-input bg-background text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <Button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="h-9 px-3 rounded-lg font-semibold shrink-0 cursor-pointer"
                    style={{ background: "var(--gradient-hero)" }}
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* Pulse Floating Bubble trigger */}
          <button
            onClick={() => {
              setShowFloatingChat(!showFloatingChat);
              if (!showFloatingChat) {
                void fetchMessages();
              }
            }}
            className={`h-14 w-14 rounded-full flex items-center justify-center text-white shadow-2xl transition hover:scale-105 hover:rotate-6 cursor-pointer relative ${
              showFloatingChat
                ? "bg-destructive shadow-destructive/20"
                : "bg-gradient-to-tr from-primary via-primary-hover to-accent-mint shadow-primary/30 animate-pulse"
            }`}
            style={{ animationDuration: "2s" }}
            title={showFloatingChat ? "Đóng hộp chat" : "Mở bong bóng chat nhóm"}
            id="btn-floating-chat-bubble"
          >
            {showFloatingChat ? (
              <X className="h-6 w-6" />
            ) : (
              <MessageCircle className="h-6 w-6" />
            )}
            
            {/* Unread message count badge */}
            {!showFloatingChat && unreadChatCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-6 min-w-6 px-1.5 rounded-full bg-rose-600 text-white text-xs font-black flex items-center justify-center border border-white dark:border-slate-900 shadow-md animate-bounce">
                {unreadChatCount}
              </span>
            )}
            
            {/* Glowing pulse aura ring */}
            {!showFloatingChat && (
              <span className="absolute inset-0 rounded-full border border-primary animate-ping opacity-60" style={{ animationDuration: "2.5s" }} />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
