"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Filter, MessageSquare, Plus, QrCode, ScanLine, Search, Sparkles, UserPlus, Users, X } from "lucide-react";
import jsQR from "jsqr";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader } from "@/components/dashboard-header";
import { useUserNavItems } from "@/pages/User/user-nav-items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import GroupDetailPage from "./GroupDetailPage";

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
  member_count: number;
  post_count: number;
  my_role: string;
  is_member: boolean;
  created_at: string;
}

interface GroupInvitation {
  invitation_id: string;
  group_id: string;
  inviter_id: string;
  status: string;
  created_at: string;
  group_name: string;
  group_description: string | null;
  is_private: boolean;
  member_count: number;
  inviter_name: string;
  inviter_avatar: string | null;
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

function normalizeSearchText(value: unknown = "") {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "");
}

function CreateGroupModal({
  onClose,
  onSubmit,
}: {
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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [jobCategory, setJobCategory] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();
  const jobTitles = jobCategory ? jobTitlesByIndustry[jobCategory] || [] : [];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError(t("groups.errorNameRequired"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const industryLabel = industries.find((item) => item.value === jobCategory)?.label || "";
      const positionLabel = jobTitles.find((item) => item.value === position)?.label || "";
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
      setError(err instanceof Error ? err.message : t("groups.errorCreate"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button data-square-button="true" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label={t("groups.closePopup")} />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/50 p-5">
          <h2 className="text-lg font-bold">{t("groups.createTitle")}</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={(event) => void handleSubmit(event)}>
          <div className="space-y-4 p-5">
            {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
            <div>
              <label className="mb-1.5 block text-sm font-medium">{t("groups.createName")}</label>
              <Input value={name} onChange={(event) => setName(event.target.value)} autoFocus />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">{t("groups.jobCategory")}</label>
                <select
                  value={jobCategory}
                  onChange={(event) => { setJobCategory(event.target.value); setPosition(""); }}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">{t("groups.selectIndustry")}</option>
                  {industries.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">{t("groups.experienceLevel")}</label>
                <select value={experienceLevel} onChange={(event) => setExperienceLevel(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
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
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm disabled:cursor-not-allowed disabled:bg-muted/50 disabled:text-muted-foreground/50"
                >
                  <option value="">{t("groups.selectPosition")}</option>
                  {jobTitles.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                {!jobCategory && <p className="mt-1 text-xs text-muted-foreground">{t("groups.selectIndustryFirst")}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">{t("groups.location")}</label>
                <select value={location} onChange={(event) => setLocation(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="">{t("groups.selectLocation")}</option>
                  {locations.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">{t("groups.description")}</label>
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} />
            </div>
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium">{t("groups.privacy")}</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${!isPrivate
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-background hover:bg-muted/40"
                    }`}
                >
                  <input
                    type="radio"
                    name="group-privacy"
                    checked={!isPrivate}
                    onChange={() => setIsPrivate(false)}
                    className="mt-0.5 h-4 w-4 accent-primary"
                  />
                  <span>
                    <span className="block text-sm font-semibold">{t("groups.public")}</span>
                    <span className="block text-xs text-muted-foreground">
                      {t("groups.publicDesc")}
                    </span>
                  </span>
                </label>
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${isPrivate
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-background hover:bg-muted/40"
                    }`}
                >
                  <input
                    type="radio"
                    name="group-privacy"
                    checked={isPrivate}
                    onChange={() => setIsPrivate(true)}
                    className="mt-0.5 h-4 w-4 accent-primary"
                  />
                  <span>
                    <span className="block text-sm font-semibold">{t("groups.private")}</span>
                    <span className="block text-xs text-muted-foreground">
                      {t("groups.privateDesc")}
                    </span>
                  </span>
                </label>
              </div>
            </fieldset>
          </div>
          <div className="flex justify-end gap-3 border-t border-border/50 p-5">
            <Button type="button" variant="outline" onClick={onClose}>{t("groups.cancel")}</Button>
            <Button type="submit" disabled={loading}>{loading ? t("groups.creating") : t("groups.createButton")}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function GroupsPage() {
  const { user, logout } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "my" | "created">("my");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQRScannerModal, setShowQRScannerModal] = useState(false);
  const { t } = useTranslation();

  const [error, setError] = useState("");
  const [activeGroupId, setActiveGroupId] = useState<string | null>(
    new URLSearchParams(window.location.search).get("id")
  );
  // unread badge map for group list sidebar
  const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});
  const prevLenRef = useRef<Record<string, number>>({});
  const fetchSeqRef = useRef(0);
  const [invitations, setInvitations] = useState<GroupInvitation[]>([]);
  const [processingInvId, setProcessingInvId] = useState<string | null>(null);

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      "x-user-id": user?.id ?? "",
      "x-user-role": user?.role ?? "user",
    }),
    [user?.id, user?.role],
  );

  const fetchGroups = useCallback(async () => {
    const requestSeq = ++fetchSeqRef.current;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      // When searching: expand to all groups so public ones appear too
      const activeFilter = search.trim() ? "all" : filter;
      if (activeFilter !== "all") params.set("filter", activeFilter);

      if (selectedIndustry) {
        const industryLabel = industries.find((item) => item.value === selectedIndustry)?.label || "";
        if (industryLabel) params.set("job_category", industryLabel);
      }
      if (selectedExperience) params.set("experience_level", selectedExperience);
      if (selectedPosition) params.set("position", selectedPosition);
      if (selectedLocation) params.set("location", selectedLocation);

      const response = await fetch(`/api/groups?${params.toString()}`, { headers });
      if (!response.ok)         throw new Error(t("groups.errorLoad"));
      const data = await response.json();
      if (requestSeq !== fetchSeqRef.current) return;
      setGroups(data.groups || []);
    } catch (err) {
      if (requestSeq !== fetchSeqRef.current) return;
      setError(err instanceof Error ? err.message : t("groups.errorLoad"));
    } finally {
      setLoading(false);
    }
  }, [filter, headers, search, selectedIndustry, selectedExperience, selectedPosition, selectedLocation]);

  useEffect(() => {
    const timeout = window.setTimeout(() => { void fetchGroups(); }, 250);
    return () => window.clearTimeout(timeout);
  }, [fetchGroups]);

  // Fetch pending group invitations
  const fetchInvitations = useCallback(async () => {
    try {
      const response = await fetch("/api/groups/my-invitations", { headers });
      if (response.ok) {
        const data = await response.json();
        setInvitations(data.invitations || []);
      }
    } catch (err) {
      console.error("Lỗi khi tải lời mời nhóm:", err);
    }
  }, [headers]);

  useEffect(() => {
    void fetchInvitations();
  }, [fetchInvitations]);

  const handleAcceptInvitation = async (invitation: GroupInvitation) => {
    setProcessingInvId(invitation.invitation_id);
    try {
      const response = await fetch(
        `/api/groups/${invitation.group_id}/invitations/${invitation.invitation_id}/accept`,
        { method: "POST", headers }
      );
      if (response.ok) {
        setInvitations((prev) => prev.filter((inv) => inv.invitation_id !== invitation.invitation_id));
        await fetchGroups();
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data.error || t("groups.errorAcceptInvitation"));
      }
    } catch (err) {
      console.error("Lỗi khi chấp nhận lời mời:", err);
    } finally {
      setProcessingInvId(null);
    }
  };

  const handleDeclineInvitation = async (invitation: GroupInvitation) => {
    setProcessingInvId(invitation.invitation_id);
    try {
      const response = await fetch(
        `/api/groups/${invitation.group_id}/invitations/${invitation.invitation_id}/decline`,
        { method: "POST", headers }
      );
      if (response.ok) {
        setInvitations((prev) => prev.filter((inv) => inv.invitation_id !== invitation.invitation_id));
      }
    } catch (err) {
      console.error("Lỗi khi từ chối lời mời:", err);
    } finally {
      setProcessingInvId(null);
    }
  };

  // Poll unread message counts for joined groups (sidebar badges)
  useEffect(() => {
    const myGroups = groups.filter((g) => g.is_member);
    if (myGroups.length === 0) return;
    const poll = async () => {
      for (const g of myGroups) {
        if (g.id === activeGroupId) continue; // Skip currently viewed group
        try {
          const res = await fetch(`/api/groups/${g.id}/messages`, { headers });
          if (!res.ok) continue;
          const data = await res.json() as { messages?: { id: string }[] };
          const len = (data.messages ?? []).length;
          const prev = prevLenRef.current[g.id] ?? len;
          if (len > prev) {
            setUnreadMap((m) => ({ ...m, [g.id]: (m[g.id] ?? 0) + (len - prev) }));
          }
          prevLenRef.current[g.id] = len;
        } catch { /* ignore */ }
      }
    };
    void poll();
    const iv = window.setInterval(() => { void poll(); }, 10000);
    return () => window.clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups.length, activeGroupId, headers]);

  const handleCreateGroup = async (payload: {
    name: string;
    description: string;
    job_category: string;
    experience_level: string;
    position: string;
    location: string;
    is_private: boolean;
  }) => {
    const response = await fetch("/api/groups", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || t("groups.errorCreate"));
    }
    setShowCreateModal(false);
    await fetchGroups();
  };

  const handleLogout = () => {
    logout();
    window.location.assign("/");
  };

  const normalizedSearch = normalizeSearchText(search);
  const visibleGroups = normalizedSearch
    ? groups.filter((group) => normalizeSearchText(group.name).includes(normalizedSearch))
    : groups;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader
        navItems={useUserNavItems()}
        activePath="/groups"
        role="user"
        onLogout={handleLogout}
      />

      <main
        className="flex h-screen pt-16 overflow-hidden transition-all duration-300"
        style={{ paddingLeft: "var(--sidebar-width)" }}
      >
        {/* Left Pane: Group list */}
        <div className={`relative flex w-full shrink-0 flex-col border-r border-border bg-card overflow-hidden md:w-[360px] ${activeGroupId ? "hidden md:flex" : "flex"}`}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3.5">
            <h1 className="text-base font-bold">{t("groups.myGroups")}</h1>
            <div className="flex items-center gap-1.5">

              <button
                onClick={() => setShowCreateModal(true)}
                className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition shadow-sm"
                title={t("groups.createGroup")}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Search + Filter bar */}
          <div className="px-3 py-2.5 border-b border-border/40 space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("groups.searchPlaceholder")}
                  className="h-8 w-full rounded-full border border-input bg-muted/50 pl-8 pr-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`h-8 px-3 rounded-full text-xs font-semibold flex items-center gap-1.5 border transition ${showFilters ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"}`}
              >
                <Filter className="h-3 w-3" /> {t("groups.filter")}
              </button>
            </div>
          </div>

          {/* Advanced Filters Overlay */}
          {showFilters && (
            <div className="absolute top-[108px] left-4 right-4 z-20 bg-card border border-border/80 shadow-xl rounded-xl p-4 space-y-3 animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("groups.filterTitle")}</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowFilters(false)}><X className="h-4 w-4" /></Button>
              </div>
              <div className="space-y-3">
                <select
                  value={filter}
                  onChange={(event) => setFilter(event.target.value as "all" | "my" | "created")}
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="all">{t("groups.allGroups")}</option>
                  <option value="my">{t("groups.myGroups")}</option>
                  <option value="created">{t("groups.createdGroups")}</option>
                </select>
                <select value={selectedIndustry} onChange={(e) => { setSelectedIndustry(e.target.value); setSelectedPosition(""); }} className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs">
                  <option value="">{t("groups.allIndustries")}</option>
                  {industries.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                <select value={selectedExperience} onChange={(e) => setSelectedExperience(e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs">
                  <option value="">{t("groups.allLevels")}</option>
                  {experienceLevels.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs">
                  <option value="">{t("groups.allLocations")}</option>
                  {locations.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => {
                    setSelectedIndustry(""); setSelectedExperience(""); setSelectedPosition(""); setSelectedLocation(""); setFilter("my");
                  }}
                >
                  {t("groups.clearFilters")}
                </Button>
              </div>
            </div>
          )}

          {/* Group list */}
          <div className="flex-1 overflow-y-auto p-2">
            {/* Pending invitations section */}
            {invitations.length > 0 && (
              <div className="mb-3">
                <p className="px-2 py-1.5 text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <UserPlus className="h-3 w-3" />
                  {t("groups.invitations", { count: invitations.length })}
                </p>
                <div className="space-y-1.5">
                  {invitations.map((inv) => (
                    <div
                      key={inv.invitation_id}
                      className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary border border-primary/20">
                          <Users className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold truncate">{inv.group_name}</h4>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {t("groups.invitedYou", { name: inv.inviter_name })} · {inv.member_count} {t("groups.members")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pl-[52px]">
                        <button
                          onClick={() => void handleAcceptInvitation(inv)}
                          disabled={processingInvId === inv.invitation_id}
                          className="flex-1 h-8 rounded-lg bg-primary text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-primary-hover transition disabled:opacity-60"
                        >
                          {processingInvId === inv.invitation_id ? (
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-b-white" />
                        ) : (
                          <Check className="h-3.5 w-3.5" />
                        )}
                          {t("groups.accept")}
                        </button>
                        <button
                          onClick={() => void handleDeclineInvitation(inv)}
                          disabled={processingInvId === inv.invitation_id}
                          className="flex-1 h-8 rounded-lg border border-border bg-background text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition disabled:opacity-60 flex items-center justify-center gap-1.5"
                        >
                          <X className="h-3.5 w-3.5" />
                          {t("groups.decline")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="my-3 border-t border-border/50" />
              </div>
            )}
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary" />
              </div>
            ) : error ? (
              <div className="p-4 text-center text-sm text-destructive">{error}</div>
            ) : visibleGroups.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm font-semibold text-muted-foreground">{t("groups.noGroups")}</p>
              </div>
            ) : (
              <div className="space-y-1">
                {visibleGroups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => {
                      if (group.is_member) {
                        setActiveGroupId(group.id);
                        setUnreadMap((prev) => ({ ...prev, [group.id]: 0 }));
                        window.history.pushState({}, "", `/groups?id=${group.id}`);
                      } else {
                        window.location.assign(`/groups/invite?id=${group.id}`);
                      }
                    }}
                    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${activeGroupId === group.id ? "bg-primary/10 hover:bg-primary/15" : "hover:bg-muted"
                      }`}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary border border-primary/20">
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className={`text-sm font-semibold truncate ${activeGroupId === group.id ? "text-primary" : ""}`}>
                          {group.name}
                        </h3>
                        {unreadMap[group.id] ? (
                          <span className="shrink-0 h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                            {unreadMap[group.id]}
                          </span>
                        ) : null}
                      </div>
                      <p className={`text-xs font-medium truncate mt-0.5 ${group.is_private ? "text-destructive/70" : "text-emerald-500"}`}>
                        {group.is_private ? <>🔒 {t("groups.private")}</> : <>🌐 {t("groups.public")}</>}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{group.member_count}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{group.post_count}</span>
                        {group.is_member && search.trim() && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[9px] leading-none">
✓ {t("groups.yourGroup")}
                            </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Group Detail */}
        <div className={`flex-1 overflow-hidden bg-background ${!activeGroupId ? "hidden lg:flex" : "flex"}`}>
          {activeGroupId ? (
            <GroupDetailPage id={activeGroupId} key={activeGroupId} onBack={() => setActiveGroupId(null)} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-muted/20">
              <div className="h-24 w-24 rounded-full bg-card shadow-sm border border-border flex items-center justify-center mb-6">
                <MessageSquare className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <h2 className="text-xl font-bold mb-2">{t("groups.welcome")}</h2>
              <p className="text-sm text-muted-foreground max-w-md text-center mb-6">
                {t("groups.welcomeDesc")}
              </p>
              <Button onClick={() => setShowQRScannerModal(true)} variant="outline" size="lg" className="flex items-center gap-3 px-6 py-6 text-base rounded-xl">
                <ScanLine className="h-5 w-5" />
                {t("groups.scanQRButton")}
              </Button>
            </div>
          )}
        </div>
      </main>

      {showCreateModal && <CreateGroupModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreateGroup} />}
      {showQRScannerModal && <QRScannerModal onClose={() => setShowQRScannerModal(false)} />}
    </div>
  );
}

interface QRScannerModalProps {
  onClose: () => void;
}

function QRScannerModal({ onClose }: QRScannerModalProps) {
  const [activeTab, setActiveTab] = useState<"camera" | "upload">("camera");
  const [cameraError, setCameraError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [scanning, setScanning] = useState(false);
  const { t } = useTranslation();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  }, []);

  // Start camera stream
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError("");
    setScanning(true);
    try {
      const constraints = { video: { facingMode: "environment" } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        requestAnimationFrame(tick);
      }
    } catch (err) {
      console.error("Lỗi truy cập camera:", err);
      setCameraError(t("groups.cameraError"));
      setScanning(false);
    }
  }, [stopCamera]);

  useEffect(() => {
    if (activeTab === "camera") {
      void startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeTab, startCamera, stopCamera]);

  // Handle URL parsing and redirection
  const handleDecodedText = (text: string) => {
    if (text.includes("/groups/invite?id=") || text.includes("?id=")) {
      let id = "";
      try {
        const urlObj = new URL(text);
        id = urlObj.searchParams.get("id") || "";
      } catch {
        const match = text.match(/[?&]id=([^&]+)/);
        id = match ? match[1] : "";
      }

      id = id.trim().replace(/^\//, "");
      if (id) {
        stopCamera();
        window.location.assign(`/groups/invite?id=${id}`);
        return true;
      }
    }
    return false;
  };

  // Animation frame tick loop for camera decoding
  const tick = () => {
    if (!videoRef.current || !canvasRef.current || !streamRef.current) return;

    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        canvas.height = videoRef.current.videoHeight;
        canvas.width = videoRef.current.videoWidth;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (code && code.data) {
          const success = handleDecodedText(code.data);
          if (success) return;
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(tick);
  };

  // Handle file upload selection
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          const success = handleDecodedText(code.data);
          if (!success) {
            setUploadError(t("groups.invalidQR"));
          }
        } else {
          setUploadError(t("groups.qrNotFound"));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label={t("groups.closePopup")} />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="h-2 w-full bg-gradient-to-r from-primary via-primary-hover to-accent-mint" />
        <div className="flex items-center justify-between border-b border-border/50 p-5">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary animate-pulse" />
            <h2 className="text-lg font-bold">{t("groups.scanQR")}</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-muted text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-border bg-muted/20 p-1">
          <button
            onClick={() => setActiveTab("camera")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === "camera"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            {t("groups.useCamera")}
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === "upload"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            {t("groups.uploadQR")}
          </button>
        </div>

        <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
          {activeTab === "camera" && (
            <div className="w-full flex flex-col items-center gap-4">
              {cameraError ? (
                <div className="text-center p-6 border border-dashed border-destructive/40 rounded-xl bg-destructive/5 text-destructive max-w-xs">
                  <p className="text-xs font-semibold">{cameraError}</p>
                </div>
                  ) : (
                    <div className="relative w-[260px] h-[260px] rounded-2xl overflow-hidden border border-border shadow-inner bg-black flex items-center justify-center">
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        playsInline
                        muted
                      />
                      <canvas ref={canvasRef} className="hidden" />

                      {scanning && (
                        <div className="absolute inset-6 border border-primary/40 rounded-xl pointer-events-none flex items-center justify-center">
                          <div className="absolute inset-0 border-2 border-dashed border-primary/20 animate-pulse rounded-xl" />
                          <div className="h-0.5 w-full bg-primary/70 absolute top-1/2 left-0 -translate-y-1/2 animate-bounce" />
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground text-center font-medium">
                    {t("groups.scanHint")}
                  </p>
                </div>
              )}

              {activeTab === "upload" && (
                <div className="w-full flex flex-col items-center gap-4 py-4">
                  <label className="w-full max-w-[280px] h-32 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Sparkles className="h-6 w-6 text-muted-foreground/55" />
                    <div>
                      <p className="text-xs font-bold">{t("groups.selectQRImage")}</p>
                      <p className="text-[10px] text-muted-foreground/75 mt-0.5">{t("groups.supportedFormats")}</p>
                    </div>
                  </label>

                  {uploadError && (
                    <div className="text-center p-3.5 border border-dashed border-destructive/40 rounded-xl bg-destructive/5 text-destructive max-w-xs mt-2">
                      <p className="text-xs font-medium leading-relaxed">{uploadError}</p>
                    </div>
                  )}
                </div>
              )}
        </div>

        <div className="border-t border-border/50 p-4 bg-muted/10 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-lg">
            {t("groups.close")}
          </Button>
        </div>
      </div>
    </div>
  );
}
