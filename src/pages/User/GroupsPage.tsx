"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Filter, MessageSquare, Plus, Search, Users, X, SlidersHorizontal, Trash2 } from "lucide-react";
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
  member_count: number;
  post_count: number;
  my_role: string;
  is_member: boolean;
  created_at: string;
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
      setError(err instanceof Error ? err.message : "Không thể tạo nhóm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-label="Đóng popup" />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/50 p-5">
          <h2 className="text-lg font-bold">Tạo nhóm mới</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-muted">
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
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Chọn ngành nghề</option>
                  {industries.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Kinh nghiệm</label>
                <select value={experienceLevel} onChange={(event) => setExperienceLevel(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
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
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm disabled:cursor-not-allowed disabled:bg-muted/50 disabled:text-muted-foreground/50"
                >
                  <option value="">Chọn vị trí</option>
                  {jobTitles.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                {!jobCategory && <p className="mt-1 text-xs text-muted-foreground">Chọn ngành trước</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Nơi ở</label>
                <select value={location} onChange={(event) => setLocation(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="">Chọn nơi ở</option>
                  {locations.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Mô tả</label>
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isPrivate} onChange={(event) => setIsPrivate(event.target.checked)} className="accent-primary" />
              Nhóm riêng tư
            </label>
          </div>
          <div className="flex justify-end gap-3 border-t border-border/50 p-5">
            <Button type="button" variant="outline" onClick={onClose}>Hủy</Button>
            <Button type="submit" disabled={loading}>{loading ? "Đang tạo..." : "Tạo nhóm"}</Button>
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
  const [filter, setFilter] = useState<"all" | "my" | "created">("all");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState("");

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      "x-user-id": user?.id ?? "",
      "x-user-role": user?.role ?? "user",
    }),
    [user?.id, user?.role],
  );

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (filter !== "all") params.set("filter", filter);

      if (selectedIndustry) {
        const industryLabel = industries.find((item) => item.value === selectedIndustry)?.label || "";
        if (industryLabel) params.set("job_category", industryLabel);
      }
      if (selectedExperience) params.set("experience_level", selectedExperience);
      if (selectedPosition) params.set("position", selectedPosition);
      if (selectedLocation) params.set("location", selectedLocation);

      const response = await fetch(`/api/groups?${params.toString()}`, { headers });
      if (!response.ok) throw new Error("Không thể tải danh sách nhóm.");
      const data = await response.json();
      setGroups(data.groups || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách nhóm.");
    } finally {
      setLoading(false);
    }
  }, [filter, headers, search, selectedIndustry, selectedExperience, selectedPosition, selectedLocation]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchGroups();
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [fetchGroups]);

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
      throw new Error(data.error || "Không thể tạo nhóm.");
    }
    setShowCreateModal(false);
    await fetchGroups();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader navItems={userNavItems} activePath="/groups" role="user" onLogout={logout} />

      <main className="pt-16 min-h-screen">
        <div className="p-6 lg:p-8 space-y-6" style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Nhóm của tôi</h1>
              <p className="mt-1 text-sm text-muted-foreground">Quản lý nhóm, thành viên và bài viết theo từng cộng đồng.</p>
            </div>
            <Button onClick={() => setShowCreateModal(true)} className="gap-2" style={{ background: "var(--gradient-hero)" }}>
              <Plus className="h-4 w-4" />
              Tạo nhóm mới
            </Button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm kiếm nhóm..." className="pl-10" />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select value={filter} onChange={(event) => setFilter(event.target.value as "all" | "my" | "created")} className="h-10 rounded-md border border-input bg-background px-3 text-sm mr-1">
                <option value="all">Tất cả nhóm</option>
                <option value="my">Nhóm của tôi</option>
                <option value="created">Nhóm đã tạo</option>
              </select>
              <Button
                variant={showFilters || selectedIndustry || selectedExperience || selectedPosition || selectedLocation ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 h-10 px-4 text-sm font-semibold cursor-pointer"
                id="btn-toggle-filters"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Bộ lọc
                {(selectedIndustry || selectedExperience || selectedPosition || selectedLocation) && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-[10px] bg-primary-foreground text-primary rounded-full">
                    !
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Advanced Collapsible Filter Panel */}
          {showFilters && (
            <Card className="border border-border/80 bg-card/60 backdrop-blur-sm shadow-md rounded-xl animate-in slide-in-from-top-3 duration-200">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                    Bộ lọc tìm kiếm nâng cao
                  </h3>
                  {(selectedIndustry || selectedExperience || selectedPosition || selectedLocation) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedIndustry("");
                        setSelectedExperience("");
                        setSelectedPosition("");
                        setSelectedLocation("");
                      }}
                      className="text-xs text-destructive hover:bg-destructive/10 h-8 gap-1 rounded-lg cursor-pointer"
                      id="btn-clear-filters"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Xóa bộ lọc
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                  {/* Ngành nghề */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Ngành nghề</label>
                    <select
                      value={selectedIndustry}
                      onChange={(event) => {
                        setSelectedIndustry(event.target.value);
                        setSelectedPosition(""); // Reset position cascading
                      }}
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      id="select-filter-industry"
                    >
                      <option value="">Tất cả ngành nghề</option>
                      {industries.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Vị trí công việc (Cascading) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Vị trí công việc</label>
                    <select
                      value={selectedPosition}
                      onChange={(event) => setSelectedPosition(event.target.value)}
                      disabled={!selectedIndustry}
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:bg-muted/50 disabled:text-muted-foreground/50"
                      id="select-filter-position"
                    >
                      <option value="">Tất cả vị trí</option>
                      {(selectedIndustry ? jobTitlesByIndustry[selectedIndustry] || [] : []).map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Kinh nghiệm */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Cấp bậc kinh nghiệm</label>
                    <select
                      value={selectedExperience}
                      onChange={(event) => setSelectedExperience(event.target.value)}
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      id="select-filter-experience"
                    >
                      <option value="">Tất cả cấp bậc</option>
                      {experienceLevels.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Nơi ở */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Khu vực nơi ở</label>
                    <select
                      value={selectedLocation}
                      onChange={(event) => setSelectedLocation(event.target.value)}
                      className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      id="select-filter-location"
                    >
                      <option value="">Tất cả khu vực</option>
                      {locations.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
            </div>
          ) : error ? (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground">{error}</CardContent>
            </Card>
          ) : groups.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <Users className="mx-auto mb-4 h-14 w-14 text-muted-foreground/30" />
                <h2 className="text-lg font-semibold">Chưa có nhóm nào</h2>
                <p className="mt-1 text-sm text-muted-foreground">Tạo nhóm mới để bắt đầu đăng bài và trao đổi với thành viên.</p>
                <Button onClick={() => setShowCreateModal(true)} className="mt-5 gap-2">
                  <Plus className="h-4 w-4" />
                  Tạo nhóm đầu tiên
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {groups.map((group) => (
                <Card
                  key={group.id}
                  className="cursor-pointer border-border/60 transition hover:-translate-y-0.5 hover:shadow-md"
                  onClick={() => {
                    if (group.is_member) {
                      window.location.assign(`/groups/detail?id=${group.id}`);
                    } else {
                      window.location.assign(`/groups/invite?id=${group.id}`);
                    }
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Users className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="truncate text-base">{group.name}</CardTitle>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {group.creator_name || "Người tạo"} · {new Date(group.created_at).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {group.description && <p className="line-clamp-2 text-sm text-muted-foreground">{group.description}</p>}
                    <div className="flex flex-wrap gap-2">
                      {group.job_category && <Badge variant="secondary">{group.job_category}</Badge>}
                      {group.position && <Badge variant="outline">{group.position}</Badge>}
                      <Badge variant={group.is_private ? "destructive" : "default"}>{group.is_private ? "Riêng tư" : "Công khai"}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{group.member_count} thành viên</span>
                      <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{group.post_count} bài viết</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {showCreateModal && <CreateGroupModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreateGroup} />}
    </div>
  );
}
