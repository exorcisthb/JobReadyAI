"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Filter, MessageSquare, Plus, Search, Users, X } from "lucide-react";
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

const industries = ["Công nghệ thông tin", "Marketing", "Kinh doanh", "Tài chính", "Nhân sự", "Thiết kế", "Giáo dục"];
const experienceLevels = ["Fresher", "Junior", "Middle", "Senior", "Lead/Manager"];
const locations = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Remote", "Khác"];

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Tên nhóm không được để trống.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        job_category: jobCategory,
        experience_level: experienceLevel,
        position: position.trim(),
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
                <select value={jobCategory} onChange={(event) => setJobCategory(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="">Chọn ngành nghề</option>
                  {industries.map((item) => <option key={item} value={item}>{item}</option>)}
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
                <Input value={position} onChange={(event) => setPosition(event.target.value)} placeholder="Frontend, Marketing Intern..." />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Khu vực</label>
                <select value={location} onChange={(event) => setLocation(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="">Chọn khu vực</option>
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

      const response = await fetch(`/api/groups?${params.toString()}`, { headers });
      if (!response.ok) throw new Error("Không thể tải danh sách nhóm.");
      const data = await response.json();
      setGroups(data.groups || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách nhóm.");
    } finally {
      setLoading(false);
    }
  }, [filter, headers, search]);

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
              <select value={filter} onChange={(event) => setFilter(event.target.value as "all" | "my" | "created")} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="all">Tất cả nhóm</option>
                <option value="my">Nhóm của tôi</option>
                <option value="created">Nhóm đã tạo</option>
              </select>
            </div>
          </div>

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
                  onClick={() => window.location.assign(`/groups/detail?id=${group.id}`)}
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
