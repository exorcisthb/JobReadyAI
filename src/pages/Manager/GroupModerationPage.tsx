"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, BookOpen, Flag, HelpCircle, MessageCircle, Newspaper } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader, type NavItem } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const managerNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <BarChart3 className="h-5 w-5" />, href: "/content-manager/dashboard" },
  { label: "Nhóm vi phạm", icon: <Flag className="h-5 w-5" />, href: "/content-manager/groups" },
  { label: "Quản lý bài viết", icon: <BookOpen className="h-5 w-5" />, href: "/content-manager/dashboard#articles" },
  { label: "Quản lý bài báo", icon: <Newspaper className="h-5 w-5" />, href: "/content-manager/dashboard#news" },
  { label: "Quản lý câu hỏi", icon: <HelpCircle className="h-5 w-5" />, href: "/content-manager/dashboard#questions" },
  { label: "Trò chuyện", icon: <MessageCircle className="h-5 w-5" />, href: "/messages" },
];

interface AdminGroup {
  id: string;
  name: string;
  description: string | null;
  creator_name: string | null;
  status: "active" | "warning" | "temp_banned" | "permanent_banned";
  warning_message: string | null;
  warning_until: string | null;
  ban_until: string | null;
  member_count: number;
  post_count: number;
  violation_count: number;
  pending_appeal_count: number;
  pending_group_report_count: number;
}

interface GroupAppeal {
  id: string;
  appellant_name: string | null;
  reason: string;
  evidence_link: string | null;
  status: "pending" | "approved" | "rejected";
  admin_note: string | null;
  created_at: string;
}

interface GroupReport {
  id: string;
  group_id?: string;
  reporter_name: string | null;
  reason: string;
  evidence_image_url: string | null;
  evidence_link: string | null;
  status: string;
  created_at: string;
  target_type?: string;
}

interface GroupReportDetail extends GroupReport {
  group_id: string;
  group_name: string;
  group_link: string;
}

function isImageEvidence(url: string | null | undefined) {
  return Boolean(url && /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(url));
}

function toAbsoluteAppLink(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${window.location.origin}${path}`;
}

function getManagerGroupPath(groupId: string) {
  return `/content-manager/groups?groupId=${groupId}`;
}

function getManagerGroupLink(groupId: string) {
  return toAbsoluteAppLink(getManagerGroupPath(groupId));
}

function statusLabel(status: AdminGroup["status"]) {
  if (status === "warning") return "Cảnh báo";
  if (status === "temp_banned") return "Ban 7 ngày";
  if (status === "permanent_banned") return "Ban vĩnh viễn";
  return "Đang hoạt động";
}

function reportStatusLabel(status?: string | null) {
  if (status === "pending") return "Chờ xử lý";
  if (status === "resolved") return "Đã xử lý";
  if (status === "dismissed") return "Hủy";
  return status || "Không rõ";
}

function appealStatusLabel(status?: string | null) {
  if (status === "pending") return "Chờ xử lý";
  if (status === "approved") return "Đã duyệt";
  if (status === "rejected") return "Từ chối";
  return status || "Không rõ";
}

export default function GroupModerationPage() {
  const { user, logout } = useAuth();
  const [groups, setGroups] = useState<AdminGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<AdminGroup | null>(null);
  const [appealGroup, setAppealGroup] = useState<AdminGroup | null>(null);
  const [appeals, setAppeals] = useState<GroupAppeal[]>([]);
  const [reportGroup, setReportGroup] = useState<AdminGroup | null>(null);
  const [groupReports, setGroupReports] = useState<GroupReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<GroupReportDetail | null>(null);
  const [focusedGroupId, setFocusedGroupId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const headers = useMemo(
    () => ({ "Content-Type": "application/json", "x-user-id": user?.id ?? "", "x-user-role": user?.role ?? "" }),
    [user?.id, user?.role],
  );

  const loadGroups = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/admin/groups", { headers });
    if (response.ok) {
      const data = await response.json();
      setGroups(data.groups || []);
    }
    setLoading(false);
  }, [headers]);

  useEffect(() => {
    void loadGroups();
  }, [loadGroups]);

  const loadReportDetail = useCallback(async (reportId: string) => {
    const response = await fetch(`/api/admin/group-reports/${reportId}`, { headers });
    if (response.ok) {
      const data = await response.json();
      setSelectedReport(data.report || null);
    }
  }, [headers]);

  useEffect(() => {
    if (!user?.id) return;
    const params = new URLSearchParams(window.location.search);
    const reportId = params.get("reportId");
    setFocusedGroupId(params.get("groupId"));
    if (reportId) void loadReportDetail(reportId);
  }, [loadReportDetail, user?.id]);

  const visibleGroups = useMemo(
    () => focusedGroupId ? groups.filter((group) => group.id === focusedGroupId) : groups,
    [focusedGroupId, groups],
  );

  const closeReportDetail = () => {
    setSelectedReport(null);
    const url = new URL(window.location.href);
    if (url.searchParams.has("reportId")) {
      url.searchParams.delete("reportId");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }
  };

  const clearFocusedGroup = () => {
    setFocusedGroupId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("groupId");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  };

  const handleViolation = async () => {
    if (!selectedGroup || !message.trim()) return;
    setSubmitting(true);
    const response = await fetch(`/api/admin/groups/${selectedGroup.id}/violations`, {
      method: "POST",
      headers,
      body: JSON.stringify({ message: message.trim() }),
    });
    setSubmitting(false);
    if (response.ok) {
      setSelectedGroup(null);
      setMessage("");
      await loadGroups();
    } else {
      const data = await response.json().catch(() => ({}));
      alert(data.error || "Không thể xử lý vi phạm nhóm.");
    }
  };

  const handleUnban = async (groupId: string) => {
    const response = await fetch(`/api/admin/groups/${groupId}/unban`, { method: "PATCH", headers });
    if (response.ok) await loadGroups();
  };

  const openAppeals = async (group: AdminGroup) => {
    setAppealGroup(group);
    setAdminNote("");
    const response = await fetch(`/api/admin/groups/${group.id}/appeals`, { headers });
    if (response.ok) {
      const data = await response.json();
      setAppeals(data.appeals || []);
    } else {
      setAppeals([]);
    }
  };

  const reviewAppeal = async (appealId: string, status: "approved" | "rejected") => {
    if (!appealGroup) return;
    const response = await fetch(`/api/admin/groups/${appealGroup.id}/appeals/${appealId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status, admin_note: adminNote }),
    });
    if (response.ok) {
      await openAppeals(appealGroup);
      await loadGroups();
    }
  };

  const openGroupReports = async (group: AdminGroup) => {
    setReportGroup(group);
    const response = await fetch(`/api/admin/groups/${group.id}/reports`, { headers });
    if (response.ok) {
      const data = await response.json();
      setGroupReports((data.reports || []).filter((item: GroupReport) => item.target_type === "general"));
    } else {
      setGroupReports([]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader navItems={managerNavItems} activePath="/content-manager/groups" role="content_manager" onLogout={() => { logout(); window.location.assign("/"); }} />
      <main className="mx-auto max-w-6xl px-4 pb-8 pt-24">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Quản lý vi phạm nhóm</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manager Web xử lý nhóm vi phạm: cảnh báo, ban 7 ngày, ban vĩnh viễn.</p>
          </div>
          <Button variant="outline" onClick={() => void loadGroups()}>Tải lại</Button>
        </div>
        {focusedGroupId && (
          <div className="mb-4 flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">Dang chi xem nhom duoc report</p>
              <p className="mt-1 break-all text-xs text-muted-foreground">{getManagerGroupLink(focusedGroupId)}</p>
            </div>
            <Button size="sm" variant="outline" onClick={clearFocusedGroup}>Xem tat ca nhom</Button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" /></div>
        ) : (
          <div className="grid gap-4">
            {visibleGroups.length === 0 ? (
              <Card className="rounded-lg">
                <CardContent className="p-6 text-sm text-muted-foreground">Khong tim thay nhom theo link report nay.</CardContent>
              </Card>
            ) : visibleGroups.map((group) => (
              <Card key={group.id} className="rounded-lg">
                <CardHeader className="flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">Người tạo: {group.creator_name || "Không rõ"} · {group.member_count} thành viên · {group.post_count} bài viết</p>
                  </div>
                  <Badge variant={group.status === "active" ? "secondary" : "destructive"}>{statusLabel(group.status)}</Badge>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-muted-foreground">
                    Số lần vi phạm: <span className="font-semibold text-foreground">{group.violation_count}</span>
                    {group.warning_message ? <span className="ml-2">· {group.warning_message}</span> : null}
                    {group.pending_group_report_count ? <span className="ml-2">· {group.pending_group_report_count} report nhóm</span> : null}
                    {group.pending_appeal_count ? <span className="ml-2">· {group.pending_appeal_count} kháng cáo</span> : null}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setSelectedGroup(group)}>Xử lý vi phạm</Button>
                    <Button size="sm" variant="outline" onClick={() => void openGroupReports(group)}>Report nhóm</Button>
                    <Button size="sm" variant="outline" onClick={() => void openAppeals(group)}>Kháng cáo</Button>
                    {group.status !== "active" && <Button size="sm" variant="outline" onClick={() => void handleUnban(group.id)}>Gỡ khóa</Button>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {selectedGroup && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedGroup(null)} aria-label="Đóng popup" />
          <div className="relative w-full max-w-md rounded-xl border border-border bg-card shadow-2xl">
            <div className="border-b border-border/50 p-5">
              <h2 className="text-lg font-bold">Xử lý nhóm {selectedGroup.name}</h2>
              <p className="mt-1 text-xs text-muted-foreground">Lần tiếp theo sẽ là lần {Math.min(selectedGroup.violation_count + 1, 3)}.</p>
            </div>
            <div className="space-y-3 p-5">
              <p className="text-xs text-muted-foreground">Lần 1: cảnh báo 3 ngày. Lần 2: ban nhóm 7 ngày. Lần 3: ban nhóm vĩnh viễn.</p>
              <Textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={5} placeholder="Nhập hành vi vi phạm của nhóm..." />
            </div>
            <div className="flex justify-end gap-3 border-t border-border/50 p-5">
              <Button variant="outline" onClick={() => setSelectedGroup(null)}>Hủy</Button>
              <Button onClick={() => void handleViolation()} disabled={submitting || !message.trim()}>{submitting ? "Đang xử lý..." : "Xác nhận"}</Button>
            </div>
          </div>
        </div>
      )}

      {reportGroup && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setReportGroup(null)} aria-label="Dong popup" />
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card shadow-2xl">
            <div className="border-b border-border/50 p-5">
              <h2 className="text-lg font-bold">Report nhom {reportGroup.name}</h2>
              <p className="mt-1 text-xs text-muted-foreground">Day la cac bao cao "Hanh vi chung cua nhom" gui len Manager Web.</p>
              <a href={getManagerGroupPath(reportGroup.id)} className="mt-2 inline-block break-all text-xs font-semibold text-primary hover:underline">
                {getManagerGroupLink(reportGroup.id)}
              </a>
            </div>
            <div className="space-y-3 p-5">
              {groupReports.length === 0 ? (
                <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">Chua co report nhom.</p>
              ) : (
                groupReports.map((report) => (
                  <div key={report.id} className="rounded-lg border border-border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{report.reporter_name || "Thanh vien"}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{report.reason}</p>
                        <a href={getManagerGroupPath(report.group_id || reportGroup.id)} className="mt-2 inline-block break-all text-xs font-semibold text-primary hover:underline">
                          {getManagerGroupLink(report.group_id || reportGroup.id)}
                        </a>
                        <div className="mt-2 flex flex-wrap gap-3">
                          {report.evidence_image_url && (
                            <a href={report.evidence_image_url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary hover:underline">
                              File bang chung
                            </a>
                          )}
                          {report.evidence_link && (
                            <a href={report.evidence_link} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary hover:underline">
                              Link lien quan
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <Badge variant={report.status === "pending" ? "secondary" : "default"}>{reportStatusLabel(report.status)}</Badge>
                        <Button size="sm" variant="outline" onClick={() => void loadReportDetail(report.id)}>Xem chi tiết</Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end border-t border-border/50 p-5">
              <Button variant="outline" onClick={() => setReportGroup(null)}>Dong</Button>
            </div>
          </div>
        </div>
      )}

      {appealGroup && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setAppealGroup(null)} aria-label="Dong popup" />
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-card shadow-2xl">
            <div className="border-b border-border/50 p-5">
              <h2 className="text-lg font-bold">Khang cao nhom {appealGroup.name}</h2>
              <p className="mt-1 text-xs text-muted-foreground">Duyet khang cao se tu dong go ban nhom.</p>
            </div>
            <div className="space-y-3 p-5">
              <Textarea value={adminNote} onChange={(event) => setAdminNote(event.target.value)} rows={3} placeholder="Ghi chu xu ly cua admin..." />
              {appeals.length === 0 ? (
                <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">Chua co khang cao.</p>
              ) : (
                appeals.map((appeal) => (
                  <div key={appeal.id} className="rounded-lg border border-border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{appeal.appellant_name || "Manager nhom"}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{appeal.reason}</p>
                        {appeal.evidence_link && (
                          <a href={appeal.evidence_link} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">
                            Link bang chung
                          </a>
                        )}
                      </div>
                      <Badge variant={appeal.status === "pending" ? "secondary" : appeal.status === "approved" ? "default" : "destructive"}>
                        {appealStatusLabel(appeal.status)}
                      </Badge>
                    </div>
                    {appeal.status === "pending" && (
                      <div className="mt-3 flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => void reviewAppeal(appeal.id, "rejected")}>Tu choi</Button>
                        <Button size="sm" onClick={() => void reviewAppeal(appeal.id, "approved")}>Duyet va go ban</Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-end border-t border-border/50 p-5">
              <Button variant="outline" onClick={() => setAppealGroup(null)}>Dong</Button>
            </div>
          </div>
        </div>
      )}

      {selectedReport && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeReportDetail} aria-label="Dong popup" />
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl border border-border bg-card shadow-2xl">
            <div className="border-b border-border/50 p-5">
              <h2 className="text-lg font-bold">Chi tiết report nhóm</h2>
              <p className="mt-1 text-xs text-muted-foreground">Report này được gửi lên Manager Web để xem xét trước khi ghi nhận cảnh báo.</p>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Tên nhóm</p>
                <p className="mt-1 text-base font-bold">{selectedReport.group_name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Lý do vi phạm</p>
                <p className="mt-1 rounded-lg border border-border bg-muted/30 p-3 text-sm leading-relaxed">{selectedReport.reason}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">File minh hoa / file bang chung</p>
                {selectedReport.evidence_image_url ? (
                  isImageEvidence(selectedReport.evidence_image_url) ? (
                    <a href={selectedReport.evidence_image_url} target="_blank" rel="noreferrer" className="mt-2 block overflow-hidden rounded-lg border border-border">
                      <img src={selectedReport.evidence_image_url} alt="File bang chung report nhom" className="max-h-72 w-full object-contain bg-muted/30" />
                    </a>
                  ) : (
                    <a href={selectedReport.evidence_image_url} target="_blank" rel="noreferrer" className="mt-2 inline-block break-all rounded-lg border border-border px-3 py-2 text-sm font-semibold text-primary hover:underline">
                      {toAbsoluteAppLink(selectedReport.evidence_image_url)}
                    </a>
                  )
                ) : (
                  <p className="mt-2 rounded-lg border border-border p-3 text-sm text-muted-foreground">Report nay chua co file, chi co link bang chung.</p>
                )}
              </div>
              {selectedReport.evidence_link && (
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Link bằng chứng</p>
                  <a href={selectedReport.evidence_link} target="_blank" rel="noreferrer" className="mt-1 inline-block break-all text-sm font-semibold text-primary hover:underline">
                    {selectedReport.evidence_link}
                  </a>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">Link nhom</p>
                <a href={selectedReport.group_link} className="mt-1 inline-block break-all text-sm font-semibold text-primary hover:underline">
                  {toAbsoluteAppLink(selectedReport.group_link)}
                </a>
                <p className="mt-1 text-xs text-muted-foreground">Link nay chi mo trang Manager va loc ra nhom bi report, khong truy cap vao trang nhom user.</p>
              </div>
            </div>
            <div className="flex justify-end border-t border-border/50 p-5">
              <Button variant="outline" onClick={closeReportDetail}>Đóng</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
