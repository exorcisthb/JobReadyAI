import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Activity, BarChart3, CheckCircle2, CreditCard, Flame, Headset, RefreshCw, ShieldCheck, Users, Wrench } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader, type NavItem } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSupportCategoryLabel } from "@/lib/support-category";

type SupportRequest = {
  id: string;
  user_id: string;
  sender_name: string;
  sender_email: string;
  category: string;
  subject: string;
  message: string;
  status: "received" | "processing" | "resolved";
  email_sent: boolean;
  created_at: string;
  updated_at: string;
};

const adminNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <BarChart3 className="h-5 w-5" />, href: "/admin/dashboard" },
  { label: "Người dùng", icon: <Users className="h-5 w-5" />, href: "/admin/users" },
  { label: "Tài chính", icon: <CreditCard className="h-5 w-5" />, href: "/admin/finance" },
  { label: "Khuyến mãi", icon: <Flame className="h-5 w-5" />, href: "/admin/promotions" },
  { label: "Bảo mật", icon: <ShieldCheck className="h-5 w-5" />, href: "/admin/security" },
  { label: "User Activity", icon: <Activity className="h-5 w-5" />, href: "/admin/user-activity" },
  { label: "Hỗ trợ", icon: <Headset className="h-5 w-5" />, href: "/admin/support" },
  { label: "Bảo trì", icon: <Wrench className="h-5 w-5" />, href: "/admin/maintenance" },
];

const STATUS_LABELS: Record<SupportRequest["status"], string> = {
  received: "Đã nhận",
  processing: "Đang xử lý",
  resolved: "Đã xử lý",
};

export default function SupportInboxPage() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const headers = useMemo(() => ({ "Content-Type": "application/json", "x-user-id": user?.id ?? "", "x-user-role": user?.role ?? "" }), [user?.id, user?.role]);

  const loadRequests = useCallback(async () => {
    try {
      const response = await fetch("/api/support/admin/requests", { headers, cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Không tải được thư hỗ trợ.");
      setRequests(data.requests || []);
      setError("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Không tải được thư hỗ trợ.");
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    void loadRequests();
    const interval = window.setInterval(() => void loadRequests(), 30000);
    return () => window.clearInterval(interval);
  }, [loadRequests]);

  const updateStatus = async (request: SupportRequest, status: SupportRequest["status"]) => {
    if (request.status === status) return;
    setUpdatingId(request.id);
    try {
      const response = await fetch(`/api/support/admin/requests/${request.id}/status`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Không thể cập nhật trạng thái.");
      setRequests((current) => current.map((item) => item.id === request.id ? { ...item, status: data.request.status, updated_at: data.request.updated_at } : item));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Không thể cập nhật trạng thái.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader navItems={adminNavItems} activePath="/admin/support" role="admin" onLogout={() => { logout(); window.location.assign("/"); }} />
      <main className="min-h-screen pt-16">
        <div className="space-y-6 p-4 sm:p-6 lg:p-8" style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary"><Headset className="h-4 w-4" />Hỗ trợ người dùng</div>
              <h1 className="text-3xl font-black tracking-tight">Thư hỗ trợ</h1>
              <p className="mt-1 text-sm text-muted-foreground">Tiếp nhận yêu cầu và cập nhật trạng thái để người dùng theo dõi.</p>
            </div>
            <Button variant="outline" onClick={() => void loadRequests()} disabled={loading}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />Làm mới</Button>
          </div>
          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {loading ? <Card className="p-10 text-center text-sm text-muted-foreground">Đang tải thư hỗ trợ...</Card> : requests.length === 0 ? (
            <Card className="flex flex-col items-center p-6 sm:p-12 text-center"><CheckCircle2 className="mb-3 h-10 w-10 text-emerald-600" /><h2 className="font-semibold">Chưa có thư hỗ trợ mới</h2><p className="mt-1 text-sm text-muted-foreground">Thư người dùng gửi sẽ xuất hiện tại đây.</p></Card>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{getSupportCategoryLabel(request.category, t)}</span>
                        <span className="text-xs text-muted-foreground">{new Date(request.created_at).toLocaleString("vi-VN")}</span>
                      </div>
                      <h2 className="mt-2 break-words text-lg font-bold">{request.subject}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{request.sender_name} · <a className="text-primary hover:underline" href={`mailto:${request.sender_email}`}>{request.sender_email || "Không có email"}</a> · ID: {request.user_id}</p>
                    </div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Trạng thái
                      <select value={request.status} disabled={updatingId === request.id} onChange={(event) => void updateStatus(request, event.target.value as SupportRequest["status"])} className="mt-1 block min-w-40 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary">
                        {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                      </select>
                    </label>
                  </div>
                  <div className="mt-4 whitespace-pre-wrap break-words rounded-xl bg-muted/40 p-4 text-sm leading-6">{request.message}</div>
                  <p className="mt-3 text-xs text-muted-foreground">{request.email_sent ? "Email thông báo tới admin đã gửi thành công." : "Thư đã được lưu và admin đã nhận thông báo trong hệ thống; email có thể chưa gửi được."}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
