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
  Eye,
  Search,
  Sidebar,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

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

interface InvitableFriend {
  id: string;
  email: string;
  name: string | null;
  avatar_url?: string | null;
  job_title?: string | null;
  invite_status: "available" | "invited" | "member";
}

interface GroupDetail {
  group: Group;
  my_role: string;
  local_ip?: string;
}

const reactionOptions = [
  { type: "like", emoji: "👍", color: "text-blue-500" },
  { type: "love", emoji: "❤️", color: "text-rose-500" },
  { type: "haha", emoji: "😆", color: "text-amber-500" },
  { type: "wow", emoji: "😮", color: "text-amber-500" },
  { type: "sad", emoji: "😢", color: "text-amber-500" },
  { type: "angry", emoji: "😡", color: "text-red-500" },
];

function getReactionOption(type?: string | null) {
  return reactionOptions.find((reaction) => reaction.type === type);
}

function getPostTemplates(t: (key: string) => string) {
  return [
    {
      id: "experience",
      icon: <Briefcase className="h-4 w-4" />,
      title: t("groups.templateExpTitle"),
      description: t("groups.templateExpDesc"),
      content: `## ${t("groups.templateExpContent")}

### ${t("groups.templateExpContext")}
${t("groups.templateExpContextDesc")}

### ${t("groups.templateExpLearned")}
1. ...
2. ...
3. ...

### ${t("groups.templateExpAdvice")}
...`,
    },
    {
      id: "question",
      icon: <Users className="h-4 w-4" />,
      title: t("groups.templateQaTitle"),
      description: t("groups.templateQaDesc"),
      content: `## ${t("groups.templateQaContent")}

### ${t("groups.templateQaProblem")}
${t("groups.templateQaProblemDesc")}

### ${t("groups.templateQaTried")}
- ...
- ...

### ${t("groups.templateQaNeed")}
...`,
    },
    {
      id: "job",
      icon: <FileText className="h-4 w-4" />,
      title: t("groups.templateJobTitle"),
      description: t("groups.templateJobDesc"),
      content: `## ${t("groups.templateJobContent")}

### ${t("groups.templateJobQuickInfo")}
- ${t("groups.templateJobLocation")}: ...
- ${t("groups.templateJobType")}: Full-time / Part-time / Remote
- ${t("groups.templateJobSalary")}: ...

### ${t("groups.templateJobDescription")}
- ...

### ${t("groups.templateJobRequirements")}
- ...

### ${t("groups.templateJobApply")}
${t("groups.templateJobApplyDesc")}`,
    },
    {
      id: "general",
      icon: <MessageSquare className="h-4 w-4" />,
      title: t("groups.templateGeneralTitle"),
      description: t("groups.templateGeneralDesc"),
      content: `## ${t("groups.templateGeneralContent")}

${t("groups.templateGeneralBody")}

### ${t("groups.templateGeneralNotes")}
...`,
    },
  ];
}

function formatDate(dateString: string, t?: (key: string) => string) {
  return new Date(dateString).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTimeAgo(dateString: string, t?: (key: string, options?: any) => string) {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return t ? t("groups.justNow") : "Vừa xong";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return t ? t("groups.minutesAgo", { count: minutes }) : `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t ? t("groups.hoursAgo", { count: hours }) : `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 30) return t ? t("groups.daysAgo", { count: days }) : `${days} ngày trước`;
  return new Date(dateString).toLocaleDateString(undefined);
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
  const { t } = useTranslation();
  const postTemplates = useMemo(() => getPostTemplates(t), [t]);
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
      setError(t("groups.postEmptyError"));
      return;
    }

    setLoading(true);
    setError("");
    try {
      await onSubmit(title.trim(), content.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : t("groups.errorPost"));
    } finally {
      setLoading(false);
    }
  };

  const selectedTemplateData = postTemplates.find((item) => item.id === selectedTemplate) ?? postTemplates[0];
  const initials = authorName.charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label={t("groups.close")} />
      <div className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        <div className="relative border-b border-border/50 px-12 py-4 text-center">
          <h2 className="text-lg font-bold">{t("groups.createPost")}</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
            aria-label={t("groups.close")}
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
              placeholder={t("groups.postTitle")}
              className="h-11 rounded-lg border-border/70 text-base font-semibold"
              autoFocus
            />

            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder={t("groups.postContentPlaceholder", { name: authorName })}
              rows={10}
              className="min-h-[260px] resize-none border-0 px-0 text-base leading-7 shadow-none focus-visible:ring-0"
            />

            <div className="rounded-xl border border-border p-3 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{t("groups.postTemplate")}</p>
                  <p className="text-xs text-muted-foreground">{t("groups.postTemplateDesc")}</p>
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
              {loading ? t("groups.posting") : t("groups.postButton")}
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
  const { t } = useTranslation();
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
      setError(t("groups.editNameError"));
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
      setError(err instanceof Error ? err.message : t("groups.errorEdit"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label={t("groups.close")} />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/50 p-5">
          <h2 className="text-lg font-bold">{t("groups.editGroup")}</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-muted" aria-label={t("groups.close")}>
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={(event) => void handleSubmit(event)}>
          <div className="space-y-4 p-5">
            {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
            <div>
              <label className="mb-1.5 block text-sm font-medium">{t("groups.editName")}</label>
              <Input value={name} onChange={(event) => setName(event.target.value)} autoFocus />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">{t("groups.industry")}</label>
                <select
                  value={jobCategory}
                  onChange={(event) => {
                    setJobCategory(event.target.value);
                    setPosition("");
                  }}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">{t("groups.selectIndustry")}</option>
                  {industries.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">{t("groups.experience")}</label>
                <select 
                  value={experienceLevel} 
                  onChange={(event) => setExperienceLevel(event.target.value)} 
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">{t("groups.selectExperience")}</option>
                  {experienceLevels.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">{t("groups.position")}</label>
                <select
                  value={position}
                  onChange={(event) => setPosition(event.target.value)}
                  disabled={!jobCategory}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm disabled:cursor-not-allowed disabled:bg-muted/50 disabled:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">{t("groups.selectPosition")}</option>
                  {jobTitles.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                {!jobCategory && <p className="mt-1 text-xs text-muted-foreground">{t("groups.selectIndustryFirst")}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">{t("groups.location")}</label>
                <select 
                  value={location} 
                  onChange={(event) => setLocation(event.target.value)} 
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">{t("groups.selectLocation")}</option>
                  {locations.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">{t("groups.editDesc")}</label>
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} />
            </div>
            <label className="flex items-center gap-2 text-sm select-none cursor-pointer">
              <input type="checkbox" checked={isPrivate} onChange={(event) => setIsPrivate(event.target.checked)} className="accent-primary" />
              {t("groups.privateGroup")}
            </label>
          </div>
          <div className="flex justify-end gap-3 border-t border-border/50 p-5">
            <Button type="button" variant="outline" onClick={onClose}>{t("groups.cancel")}</Button>
            <Button type="submit" disabled={loading}>{loading ? t("groups.saving") : t("groups.save")}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GroupDetailPage({ id }: { id?: string }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const rawGroupId = id || new URLSearchParams(window.location.search).get("id");
  const groupId = rawGroupId ? rawGroupId.replace(/^\//, "") : "";
  const [groupDetail, setGroupDetail] = useState<GroupDetail | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "chat">("chat");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadingQR, setDownloadingQR] = useState(false);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [showRightPane, setShowRightPane] = useState(false);
  const [showSidebarMembers, setShowSidebarMembers] = useState(false);
  const [rightPaneView, setRightPaneView] = useState<"info" | "search">("info");
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [searchSenderId, setSearchSenderId] = useState("");
  const [searchDateFilter, setSearchDateFilter] = useState<"all" | "today" | "week" | "month">("all");
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const [addMemberEmail, setAddMemberEmail] = useState("");
  const [friendsToInvite, setFriendsToInvite] = useState<InvitableFriend[]>([]);
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [invitingFriendId, setInvitingFriendId] = useState<string | null>(null);
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
      setError(t("groups.errorLoad"));
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
        throw new Error(data.error || t("groups.errorLoad"));
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
      setError(err instanceof Error ? err.message : t("groups.errorLoad"));
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
    if (!groupId) throw new Error(t("groups.errorLoad"));
    const response = await fetch(`/api/groups/${groupId}/posts`, {
      method: "POST",
      headers,
      body: JSON.stringify({ title, content }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || t("groups.errorPost"));
    }
    setShowCreatePost(false);
    setActiveTab("posts");
    await fetchData();
  };

  const fetchFriendsToInvite = useCallback(async () => {
    if (!groupId) return;
    setLoadingFriends(true);
    try {
      const response = await fetch(`/api/groups/${groupId}/friends-to-invite`, { headers });
      if (response.ok) {
        const data = await response.json();
        setFriendsToInvite(data.friends || []);
      }
    } catch (err) {
      console.error(t("groups.errorLoadFriends"), err);
    } finally {
      setLoadingFriends(false);
    }
  }, [groupId, headers]);

  useEffect(() => {
    if (showAddMember) {
      void fetchFriendsToInvite();
      setFriendSearchQuery("");
    }
  }, [showAddMember, fetchFriendsToInvite]);

  const handleInviteFriend = async (friendId: string) => {
    if (!groupId || invitingFriendId) return;
    setInvitingFriendId(friendId);
    try {
      const response = await fetch(`/api/groups/${groupId}/members`, {
        method: "POST",
        headers,
        body: JSON.stringify({ friend_id: friendId }),
      });
      if (response.ok) {
        // Cập nhật trạng thái trong danh sách
        setFriendsToInvite((prev) =>
          prev.map((f) => (f.id === friendId ? { ...f, invite_status: "invited" as const } : f))
        );
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data.error || t("groups.errorInvite"));
      }
    } catch (err) {
      console.error(t("groups.errorInvite"), err);
    } finally {
      setInvitingFriendId(null);
    }
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
    if (!groupId) throw new Error(t("groups.errorLoad"));
    const response = await fetch(`/api/groups/${groupId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || t("groups.errorSave"));
    }
    setShowEditGroup(false);
    await fetchData();
  };

  const handleDeletePost = async (postId: string) => {
    if (!groupId || !confirm(t("groups.confirmDeletePost"))) return;
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
      setError(data.error || t("groups.errorReaction"));
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
      setError(data.error || t("groups.errorComment"));
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
    if (!groupId || !confirm(t("groups.confirmDeleteComment"))) return;
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
    if (!groupId || !confirm(t("groups.confirmDeleteMember"))) return;
    const response = await fetch(`/api/groups/${groupId}/members/${memberUserId}`, { method: "DELETE", headers });
    if (response.ok) await fetchData();
  };

  const handleDeleteGroup = async () => {
    if (!groupId || !confirm(t("groups.confirmDeleteGroup"))) return;
    const response = await fetch(`/api/groups/${groupId}`, { method: "DELETE", headers });
    if (response.ok) window.location.assign("/groups");
  };

  const handleLeaveGroup = async () => {
    if (!groupId || !confirm(t("groups.confirmLeaveGroup"))) return;
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
      console.error(t("groups.errorCopyLink"), err);
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
      a.download = `qrcode-group-${group?.name || "group"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(t("groups.errorQR"), err);
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
      }
    } catch (err) {
      console.error(t("groups.errorLoadMessages"), err);
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
        }, 50);
      }
    } catch (err) {
      console.error(t("groups.errorSendMessage"), err);
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

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, activeTab]);

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
    <div className="flex-1 flex flex-col overflow-hidden bg-background h-full w-full relative">
      {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          </div>
        ) : error || !group ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <p className="text-muted-foreground">{error || t("groups.errorLoad")}</p>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Center Pane */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-border bg-card relative">
              {/* Zalo Top Bar */}
              <div className="h-16 border-b border-border flex items-center justify-between px-4 shrink-0 bg-background/50 backdrop-blur-md z-10">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => {
                      if (showRightPane && rightPaneView === "info") {
                        setShowRightPane(false);
                      } else {
                        setShowRightPane(true);
                        setRightPaneView("info");
                      }
                    }}
                    title={t("groups.infoTitle")}
                  >
                    <Users className="h-5 w-5" />
                  </div>
                  <div
                    className="flex flex-col min-w-0 cursor-pointer group"
                    onClick={() => {
                      if (showRightPane && rightPaneView === "info" && showSidebarMembers) {
                        setShowRightPane(false);
                        setShowSidebarMembers(false);
                      } else {
                        setShowRightPane(true);
                        setRightPaneView("info");
                      }
                    }}
                    title={t("groups.viewMembers")}
                  >
                    <h1 className="text-[15px] font-bold leading-tight group-hover:text-primary transition-colors truncate">{group.name}</h1>
                    <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground mt-0.5">
                      <Users className="h-3 w-3" />
                      {t("groups.memberCount", { count: members.length })}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setShowAddMember(true)} className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted" title={t("groups.addMember")}>
                    <UserPlus className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (showRightPane && rightPaneView === "search") {
                        setShowRightPane(false);
                      } else {
                        setShowRightPane(true);
                        setRightPaneView("search");
                      }
                    }}
                    className={`h-9 w-9 rounded-full hover:bg-muted ${showRightPane && rightPaneView === "search" ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-muted-foreground hover:text-foreground"}`}
                    title={t("groups.searchChat")}
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                  <div className="w-px h-4 bg-border mx-1" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (showRightPane && rightPaneView === "info") {
                        setShowRightPane(false);
                      } else {
                        setShowRightPane(true);
                        setRightPaneView("info");
                      }
                    }}
                    className={`h-9 w-9 rounded-md hover:bg-muted ${showRightPane && rightPaneView === "info" ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-foreground"}`}
                    title={t("groups.infoAndMembers")}
                  >
                    <Sidebar className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Zalo Tabs Row */}
              <div className="flex items-center gap-6 px-4 border-b border-border bg-background/95 shrink-0 h-11">
                <button 
                  onClick={() => setActiveTab("chat")} 
                  className={`h-full text-sm font-semibold border-b-[3px] transition-colors ${activeTab === "chat" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  {t("groups.tabChat")}
                </button>
                <button 
                  onClick={() => setActiveTab("posts")} 
                  className={`h-full text-sm font-semibold border-b-[3px] transition-colors ${activeTab === "posts" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                >
                  {t("groups.tabFeed", { count: posts.length })}
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto bg-muted/20 relative flex flex-col">

              {activeTab === "posts" ? (
                <div className="space-y-4">
                  {posts.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <MessageSquare className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
                        <p className="text-sm text-muted-foreground">{t("groups.noPosts")}</p>
                        <Button onClick={() => setShowCreatePost(true)} className="mt-4 gap-2">
                          <Plus className="h-4 w-4" />
                          {t("groups.writeFirstPost")}
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
                                <img src={post.author_avatar} alt={post.author_name || t("groups.author")} className="h-9 w-9 rounded-full object-cover" />
                              ) : (
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                                  <UserCircle className="h-5 w-5" />
                                </div>
                              )}
                              <div>
                                <h3 className="font-semibold">{post.title}</h3>
                                <p className="text-xs text-muted-foreground">
                                  {post.author_name || post.author_email || t("groups.member")} · {formatTimeAgo(post.created_at, t)}
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
                                  <span key={type} title={t("groups." + type)} className="-mr-1">
                                    {getReactionOption(type)?.emoji}
                                  </span>
                                ))}
                              {t("groups.reactionCount", { count: post.reaction_count ?? post.like_count ?? 0 })}
                            </span>
                            <span>{t("groups.commentCount", { count: post.comment_count || 0 })}</span>
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
                                {t("groups." + (post.my_reaction || "like"))}
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
                                      title={t("groups." + reaction.type)}
                                      aria-label={t("groups." + reaction.type)}
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
                              {t("groups.comment")}
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
                                          alt={comment.author_name || t("groups.member")}
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
                                            <p className="text-sm font-semibold">{comment.author_name || comment.author_email || t("groups.member")}</p>
                                            {(comment.author_id === user?.id || isAdmin) && (
                                              <button
                                                type="button"
                                                onClick={() => void handleDeleteComment(post.id, comment.id)}
                                                className="text-muted-foreground hover:text-destructive"
                                                aria-label={t("groups.commentDelete")}
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
                                                const name = comment.author_name || comment.author_email || t("groups.member");
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
                                            {t("groups.reply")}
                                          </button>
                                        </div>

                                        {replies.length > 0 && (
                                          <div className="mt-2 space-y-2 border-l border-border/70 pl-3">
                                            {replies.map((reply) => (
                                              <div key={reply.id} className="flex items-start gap-2">
                                                {reply.author_avatar ? (
                                                    <img
                                                      src={reply.author_avatar}
                                                      alt={reply.author_name || t("groups.member")}
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
                                                      <p className="text-sm font-semibold">{reply.author_name || reply.author_email || t("groups.member")}</p>
                                                      {(reply.author_id === user?.id || isAdmin) && (
                                                        <button
                                                          type="button"
                                                          onClick={() => void handleDeleteComment(post.id, reply.id)}
                                                          className="text-muted-foreground hover:text-destructive"
                                                          aria-label={t("groups.deleteReply")}
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
                                                        const name = reply.author_name || reply.author_email || t("groups.member");
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
                                                    {t("groups.reply")}
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
                                                <img src={user.image} alt={user.name || t("groups.you")} className="h-7 w-7 rounded-full object-cover" />
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
                                                  placeholder={t("groups.replyPlaceholder")}
                                                  className="h-7 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                                                  autoFocus
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() => void handleSubmitComment(post.id, comment.id)}
                                                  disabled={submittingCommentId === comment.id || !replyDrafts[comment.id]?.trim()}
                                                  className="text-primary disabled:cursor-not-allowed disabled:text-muted-foreground"
                                                  aria-label={t("groups.sendReply")}
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
                                                    placeholder={t("groups.searchMember")}
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
                                                     <p className="p-3 text-center text-sm text-muted-foreground">{t("groups.noMembersFound")}</p>
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
                                <img src={user.image} alt={user.name || t("groups.you")} className="h-8 w-8 rounded-full object-cover" />
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
                                  placeholder={t("groups.commentPlaceholder")}
                                  className="h-8 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                                />
                                <button
                                  type="button"
                                  onClick={() => void handleSubmitComment(post.id)}
                                  disabled={submittingCommentId === post.id || !commentDrafts[post.id]?.trim()}
                                  className="text-primary disabled:cursor-not-allowed disabled:text-muted-foreground"
                                  aria-label={t("groups.commentButton")}
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
                                      placeholder={t("groups.searchMember")}
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
                                      <p className="p-3 text-center text-sm text-muted-foreground">{t("groups.noMembersFound")}</p>
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
              ) : activeTab === "chat" ? (
                <>
                  {/* Chat feed container */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                        <MessageCircle className="h-12 w-12 text-muted-foreground/30 mb-2 animate-bounce" />
                        <p className="text-sm font-semibold">{t("groups.noMessages")}</p>
                        <p className="text-xs text-muted-foreground/80 mt-0.5">{t("groups.noMessagesDesc")}</p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isSelf = msg.sender_id === user?.id;
                        const isMsgCreator = msg.sender_id === group.creator_id;
                        return (
                          <div
                            key={msg.id}
                            id={`msg-${msg.id}`}
                            className={`flex items-start gap-3 p-1 rounded-xl transition-all duration-500 ${isSelf ? "flex-row-reverse" : ""}`}
                          >
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
                                {new Date(msg.created_at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={chatScrollRef} />
                  </div>

                  {/* Input bar */}
                  <div className="border-t border-border p-4 bg-muted/20 shrink-0">
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
                        placeholder={t("groups.chatPlaceholder")}
                        className="flex-1 h-10 px-4 rounded-xl border border-input bg-background text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      <Button
                        type="submit"
                        disabled={!chatInput.trim()}
                        className="h-10 px-4 rounded-xl font-semibold gap-2 cursor-pointer shrink-0"
                        style={{ background: "var(--gradient-hero)" }}
                      >
                        <Send className="h-4 w-4" />
                        {t("groups.send")}
                      </Button>
                    </form>
                  </div>
                </>
              ) : null}
              </div>
            </div>

            {/* Right Pane (Thông tin cộng đồng) */}
            <div className={`w-[340px] shrink-0 bg-background flex-col h-full overflow-y-auto border-l border-border ${showRightPane ? "hidden lg:flex" : "hidden"}`}>
              {rightPaneView === "info" ? (
                <>
                  <div className="h-16 flex items-center justify-center border-b border-border shrink-0 font-bold text-base bg-card sticky top-0 z-10">
                    {t("groups.infoTitle")}
                  </div>
                  
                  <div className="p-5 flex flex-col items-center border-b border-border/50 bg-card">
                     <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary mb-3 shadow-inner">
                       <Users className="h-8 w-8" />
                     </div>
                     <h2 className="text-lg font-bold text-center leading-tight mb-1">{group.name}</h2>
                     <div className="flex items-center gap-1 mb-5">
                        <Badge variant={group.is_private ? "destructive" : "secondary"} className="text-[10px] uppercase font-semibold">
                          {group.is_private ? t("groups.private") : t("groups.public")}
                       </Badge>
                       {(group.job_category || group.position || group.experience_level || group.location) && (
                          <div className="group relative flex items-center justify-center ml-1">
                            <Badge variant="outline" className="px-1.5 py-0 h-5 cursor-pointer hover:bg-muted transition-colors">
                              <Eye className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                            </Badge>
                            <div className="absolute top-full mt-2 right-0 hidden group-hover:flex flex-col gap-1 w-max max-w-[200px] rounded-md border border-border bg-card px-3 py-2 text-xs text-card-foreground shadow-xl z-50">
                              {group.job_category && <div><span className="font-semibold">{t("groups.industryLabel")}</span> {group.job_category}</div>}
                              {group.position && <div><span className="font-semibold">{t("groups.positionLabel")}</span> {group.position}</div>}
                              {group.experience_level && <div><span className="font-semibold">{t("groups.expLabel")}</span> {group.experience_level}</div>}
                              {group.location && <div><span className="font-semibold">{t("groups.locationLabel")}</span> {group.location}</div>}
                            </div>
                          </div>
                       )}
                     </div>

                     <div className="flex justify-center gap-4 w-full">
                       <button onClick={() => setShowCreatePost(true)} className="flex flex-col items-center gap-1.5 group">
                         <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors text-foreground">
                           <Plus className="h-4 w-4" />
                         </div>
                          <span className="text-[11px] text-center text-muted-foreground font-medium">{t("groups.writePost")}</span>
                       </button>
                          <button onClick={() => setShowAddMember(true)} className="flex flex-col items-center gap-1.5 group">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors text-foreground">
                              <UserPlus className="h-4 w-4" />
                            </div>
                            <span className="text-[11px] text-center text-muted-foreground font-medium">{t("groups.addMemberShort")}</span>
                          </button>

                       <button onClick={() => setShowQRCodeModal(true)} className="flex flex-col items-center gap-1.5 group">
                         <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors text-foreground">
                           <QrCode className="h-4 w-4" />
                         </div>
                          <span className="text-[11px] text-center text-muted-foreground font-medium">{t("groups.qrCode")}</span>
                       </button>
                        {false && (
                          <button onClick={() => setShowAddMember(true)} className="flex flex-col items-center gap-1.5 group">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors text-foreground">
                              <UserPlus className="h-4 w-4" />
                            </div>
                            <span className="text-[11px] text-center text-muted-foreground font-medium">{t("groups.addMemberShort")}</span>
                          </button>
                        )}
                       {isAdmin ? (
                         <button onClick={() => setShowEditGroup(true)} className="flex flex-col items-center gap-1.5 group">
                           <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors text-foreground">
                             <Pencil className="h-4 w-4" />
                           </div>
                            <span className="text-[11px] text-center text-muted-foreground font-medium">{t("groups.manage")}</span>
                         </button>
                       ) : (
                         <button onClick={() => void handleLeaveGroup()} className="flex flex-col items-center gap-1.5 group">
                           <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-destructive/10 group-hover:text-destructive transition-colors text-foreground">
                             <ArrowLeft className="h-4 w-4" />
                           </div>
                            <span className="text-[11px] text-center text-muted-foreground font-medium">{t("groups.leaveGroup")}</span>
                         </button>
                       )}
                     </div>
                  </div>

                  <div className="px-4 py-4 border-b border-border/50 bg-card">
                    <div className="flex items-center justify-between cursor-pointer group mb-1" onClick={() => setShowSidebarMembers((v) => !v)}>
                      <h3 className="text-[13px] font-bold group-hover:text-primary transition-colors">{t("groups.memberList", { count: members.length })}</h3>
                      <ChevronRight className={`h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform ${showSidebarMembers ? "rotate-90" : ""}`} />
                    </div>
                    {showSidebarMembers && (
                      <div className="mt-3 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
                        {/* Search input for sidebar members */}
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <input
                            type="text"
                            value={memberSearch}
                            onChange={(e) => setMemberSearch(e.target.value)}
                            placeholder={t("groups.searchMember")}
                            className="pl-8 pr-7 h-8 w-full rounded-lg border border-input bg-muted/30 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          />
                          {memberSearch && (
                            <button 
                              onClick={() => setMemberSearch("")} 
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full hover:bg-muted"
                              title={t("groups.clearSearch")}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-none">
                          {filteredMembers.map((m) => {
                            const isGroupCreator = m.user_id === group.creator_id;
                            const isSelf = m.user_id === user?.id;
                            const isMemberAdmin = m.role === "admin";
                            return (
                              <div key={m.id} className="flex items-center justify-between text-xs py-1 rounded hover:bg-muted/30 px-1 transition-colors">
                                <div className="flex items-center gap-2 min-w-0">
                                  {m.avatar_url ? (
                                    <img src={m.avatar_url} alt="" className="h-7 w-7 rounded-full object-cover border border-border" />
                                  ) : (
                                    <div className="h-7 w-7 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-[10px] font-bold shrink-0 uppercase">
                                      {(m.name || m.email).charAt(0)}
                                    </div>
                                  )}
                                  <span className="truncate font-semibold text-foreground">
                                    {m.name || m.email} {isSelf && <span className="text-[9px] text-muted-foreground font-normal">{t("groups.youLabel")}</span>}
                                  </span>
                                </div>
                                <span className="text-[10px] text-muted-foreground shrink-0 font-medium">
                                  {isGroupCreator ? t("groups.groupLeader") : isMemberAdmin ? t("groups.groupModerator") : ""}
                                </span>
                              </div>
                            );
                          })}
                          {filteredMembers.length === 0 && (
                            <p className="text-center text-xs text-muted-foreground py-3">{t("groups.noMembersFound")}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {group.description && (
                    <div className="px-4 py-4 border-b border-border/50 bg-card">
                      <h3 className="text-[13px] font-bold mb-2">{t("groups.groupDescription")}</h3>
                      <p className="text-[13px] text-muted-foreground whitespace-pre-wrap leading-relaxed">{group.description}</p>
                    </div>
                  )}

                  <div className="px-4 py-4 border-b border-border/50 bg-card">
                    <div className="flex items-center justify-between cursor-pointer group" onClick={() => setActiveTab("posts")}>
                      <h3 className="text-[13px] font-bold group-hover:text-primary transition-colors">{t("groups.communityFeed")}</h3>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-3 text-[13px] text-muted-foreground hover:bg-muted p-2 rounded-md cursor-pointer transition-colors" onClick={() => setActiveTab("posts")}>
                        <MessageSquare className="h-4 w-4" />
                        <span>{t("groups.postsPublished", { count: posts.length })}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[13px] text-muted-foreground hover:bg-muted p-2 rounded-md cursor-pointer transition-colors" onClick={() => setActiveTab("posts")}>
                        <FileText className="h-4 w-4" />
                        <span>{t("groups.notesPinned")}</span>
                      </div>
                    </div>
                  </div>
                  
                  {isCreator && (
                    <div className="px-4 py-4 mt-auto mb-4">
                      <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 border-destructive/20" onClick={() => void handleDeleteGroup()}>
                        <Trash2 className="h-4 w-4 mr-2"/> {t("groups.deleteGroup")}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col h-full min-h-0 bg-background">
                  {/* Search in chat panel header */}
                  <div className="h-16 border-b border-border flex items-center justify-between px-4 shrink-0 bg-card sticky top-0 z-10">
                    <h2 className="font-bold text-sm text-foreground">{t("groups.searchChat")}</h2>
                    <button
                      onClick={() => setShowRightPane(false)}
                      className="rounded-lg p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title={t("groups.closeSearch")}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-4 space-y-4 flex-1 flex flex-col min-h-0 overflow-y-auto">
                    {/* Search input with clear button */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={chatSearchQuery}
                        onChange={(e) => setChatSearchQuery(e.target.value)}
                        placeholder={t("groups.searchPlaceholder")}
                        className="pl-9 pr-12 h-10 w-full rounded-xl border border-input bg-muted/30 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                      {chatSearchQuery && (
                        <button 
                          onClick={() => setChatSearchQuery("")} 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary hover:text-primary-hover bg-muted/60 hover:bg-muted px-2 py-1 rounded"
                          title={t("groups.clearSearch")}
                        >
                          {t("groups.clear")}
                        </button>
                      )}
                    </div>

                    {/* Filters: sender and date */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground">{t("groups.filterBy")}</p>
                      <div className="flex gap-2">
                        {/* Sender filter select dropdown */}
                        <div className="flex-1 min-w-0">
                          <select
                            value={searchSenderId}
                            onChange={(e) => setSearchSenderId(e.target.value)}
                            className="w-full h-8 px-2 rounded-lg border border-input bg-muted/40 text-xs font-medium outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          >
                            <option value="">{t("groups.senderFilter")}</option>
                            {members.map((m) => (
                              <option key={m.id} value={m.user_id}>
                                {m.name || m.email}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Date filter select dropdown */}
                        <div className="flex-1 min-w-0">
                          <select
                            value={searchDateFilter}
                            onChange={(e) => setSearchDateFilter(e.target.value as any)}
                            className="w-full h-8 px-2 rounded-lg border border-input bg-muted/40 text-xs font-medium outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          >
                            <option value="all">{t("groups.dateFilter")}</option>
                            <option value="today">{t("groups.today")}</option>
                            <option value="week">{t("groups.last7Days")}</option>
                            <option value="month">{t("groups.last30Days")}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Search Results list */}
                    <div className="flex-1 flex flex-col min-h-0">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{t("groups.messages")}</p>
                      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-none">
                        {(() => {
                          // Perform filtering
                          const results = messages.filter((msg) => {
                            // Filter by text query
                            if (chatSearchQuery.trim()) {
                              if (!msg.message.toLowerCase().includes(chatSearchQuery.trim().toLowerCase())) {
                                return false;
                              }
                            }
                            // Filter by sender
                            if (searchSenderId) {
                              if (msg.sender_id !== searchSenderId) {
                                return false;
                              }
                            }
                            // Filter by date
                            if (searchDateFilter !== "all") {
                              const msgDate = new Date(msg.created_at);
                              const now = new Date();
                              const diffTime = Math.abs(now.getTime() - msgDate.getTime());
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                              
                              if (searchDateFilter === "today") {
                                const isToday = msgDate.toDateString() === now.toDateString();
                                if (!isToday) return false;
                              } else if (searchDateFilter === "week") {
                                if (diffDays > 7) return false;
                              } else if (searchDateFilter === "month") {
                                if (diffDays > 30) return false;
                              }
                            }
                            return true;
                          });

                          // If no filters are active and search query is empty, show prompt
                          if (!chatSearchQuery.trim() && !searchSenderId && searchDateFilter === "all") {
                            return (
                              <div className="py-12 text-center text-muted-foreground">
                                <Search className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                                <p className="text-sm font-semibold">{t("groups.searchResults")}</p>
                                <p className="text-xs text-muted-foreground/80 mt-1">{t("groups.searchResultsDesc")}</p>
                              </div>
                            );
                          }

                          if (results.length === 0) {
                            return (
                              <div className="py-12 text-center text-muted-foreground">
                                <p className="text-sm">{t("groups.noResults")}</p>
                              </div>
                            );
                          }

                          return results.map((msg) => {
                            // Find sender avatar
                            const initials = (msg.sender_name || msg.sender_email || "U").charAt(0).toUpperCase();
                            const dateStr = formatTimeAgo(msg.created_at);
                            
                            // Highlight matches
                            const messageText = msg.message;
                            const query = chatSearchQuery.trim();
                            let contentNode: React.ReactNode = messageText;
                            
                            if (query) {
                              const index = messageText.toLowerCase().indexOf(query.toLowerCase());
                              if (index !== -1) {
                                const before = messageText.substring(0, index);
                                const match = messageText.substring(index, index + query.length);
                                const after = messageText.substring(index + query.length);
                                contentNode = (
                                  <>
                                    {before}
                                    <span className="text-blue-600 font-extrabold bg-blue-100/50 px-0.5 rounded">{match}</span>
                                    {after}
                                  </>
                                );
                              }
                            }

                            return (
                              <div 
                                key={msg.id} 
                                onClick={() => {
                                  // Scroll to message in the main feed
                                  const el = document.getElementById(`msg-${msg.id}`);
                                  if (el) {
                                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                                    el.classList.add("bg-primary/20", "transition-all", "duration-1000");
                                    setTimeout(() => {
                                      el.classList.remove("bg-primary/20");
                                    }, 2000);
                                  }
                                }}
                                className="flex items-start gap-3 p-2.5 rounded-xl border border-border/50 hover:bg-muted/40 transition-colors cursor-pointer"
                              >
                                {msg.sender_avatar ? (
                                  <img src={msg.sender_avatar} alt="" className="h-8 w-8 rounded-full object-cover border border-border shrink-0" />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-bold shrink-0 uppercase">
                                    {initials}
                                  </div>
                                )}
                                <div className="min-w-0 flex-1 space-y-0.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="text-xs font-bold text-foreground truncate">{msg.sender_name || msg.sender_email}</p>
                                    <p className="text-[10px] text-muted-foreground shrink-0">{dateStr}</p>
                                  </div>
                                  <p className="text-xs text-muted-foreground break-words line-clamp-3">
                                    {contentNode}
                                  </p>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      {showCreatePost && group && (
        <CreatePostModal
          groupName={group.name}
          authorName={user?.name || user?.email || t("groups.member")}
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
          <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddMember(false)} aria-label={t("groups.close")} />
          <div className="relative w-full max-w-md rounded-xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/50 p-5">
              <div>
                <h2 className="text-lg font-bold">{t("groups.inviteFriends")}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{t("groups.inviteDesc")}</p>
              </div>
              <button onClick={() => setShowAddMember(false)} className="rounded-lg p-2 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 border-b border-border/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={friendSearchQuery}
                  onChange={(e) => setFriendSearchQuery(e.target.value)}
                  placeholder={t("groups.searchFriends")}
                  className="pl-9 pr-4 h-10 w-full rounded-lg border border-input bg-muted/30 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-[360px] overflow-y-auto">
              {loadingFriends ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                </div>
              ) : (() => {
                const filtered = friendsToInvite.filter((f) => {
                  const q = friendSearchQuery.trim().toLowerCase();
                  if (!q) return true;
                  return (f.name?.toLowerCase().includes(q) || f.email.toLowerCase().includes(q));
                });
                if (filtered.length === 0) {
                  return (
                    <div className="py-12 text-center">
                      <Users className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
                      <p className="text-sm text-muted-foreground font-medium">
                        {friendsToInvite.length === 0 ? t("groups.noFriends") : t("groups.noFriendsFound")}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">{t("groups.noFriendsDesc")}</p>
                    </div>
                  );
                }
                return filtered.map((friend) => (
                  <div key={friend.id} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/40 transition-colors border-b border-border/30 last:border-b-0">
                    <div className="flex items-center gap-3 min-w-0">
                      {friend.avatar_url ? (
                        <img src={friend.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover border border-border" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-sm font-bold shrink-0">
                          {(friend.name || friend.email).charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{friend.name || friend.email}</p>
                        {friend.job_title && <p className="text-xs text-muted-foreground truncate">{friend.job_title}</p>}
                      </div>
                    </div>
                    {friend.invite_status === "member" ? (
                      <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-medium shrink-0">{t("groups.joined")}</span>
                    ) : friend.invite_status === "invited" ? (
                      <span className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full font-medium shrink-0 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {t("groups.invited")}
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => void handleInviteFriend(friend.id)}
                        disabled={invitingFriendId === friend.id}
                        className="h-8 px-3 rounded-lg text-xs font-semibold gap-1.5 shrink-0"
                      >
                        {invitingFriendId === friend.id ? (
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-b-white" />
                        ) : (
                          <UserPlus className="h-3.5 w-3.5" />
                        )}
                        {t("groups.invite")}
                      </Button>
                    )}
                  </div>
                ));
              })()}
            </div>
            <div className="p-4 border-t border-border/50">
              <Button variant="outline" onClick={() => setShowAddMember(false)} className="w-full">{t("groups.close")}</Button>
            </div>
          </div>
        </div>
      )}

      {showQRCodeModal && group && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowQRCodeModal(false)} aria-label={t("groups.close")} />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Top accent gradient bar */}
            <div className="h-2 w-full bg-gradient-to-r from-primary via-primary-hover to-accent-mint" />

            <div className="flex items-center justify-between border-b border-border/50 p-5">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold">{t("groups.qrCodeTitle")}</h2>
              </div>
              <button onClick={() => setShowQRCodeModal(false)} className="rounded-lg p-2 hover:bg-muted text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 text-center space-y-6">
              <div>
                <h3 className="font-extrabold text-lg text-foreground">{group.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{t("groups.qrCodeDesc")}</p>
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
                      <span className="text-xs text-green-500 font-semibold">{t("groups.copied")}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span className="text-xs">{t("groups.copyLink")}</span>
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
                  {t("groups.close")}
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
                      {t("groups.loading")}
                    </>
                  ) : (
                    <>
                      {t("groups.downloadQR")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
