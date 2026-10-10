import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Clock3, MailCheck, RefreshCw } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUserNavItems } from "@/pages/User/user-nav-items";
import { getSupportCategoryLabel } from "@/lib/support-category";

type SupportRequest = {
  id: string;
  category: string;
  subject: string;
  message: string;
  status: "received" | "processing" | "resolved";
  email_sent: boolean;
  created_at: string;
  updated_at: string;
};

const STATUS_LABELS: Record<SupportRequest["status"], string> = {
  received: "Đã nhận",
  processing: "Đang xử lý",
  resolved: "Đã xử lý",
};

const STATUS_STYLES: Record<SupportRequest["status"], string> = {
  received: "border-sky-200 bg-sky-50 text-sky-700",
  processing: "border-amber-200 bg-amber-50 text-amber-700",
  resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export default function SentSupportPage() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navItems = useUserNavItems();
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const headers = useMemo(() => ({ "x-user-id": user?.id ?? "", "x-user-role": user?.role ?? "user" }), [user?.id, user?.role]);

  const loadRequests = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const response = await fetch("/api/support/sent", { headers, cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Không tải được thư đã gửi.");
      setRequests(data.requests || []);
      setError("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Không tải được thư đã gửi.");
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    void loadRequests();
    const interval = window.setInterval(() => void loadRequests(), 30000);
    return () => window.clearInterval(interval);
  }, [loadRequests]);

  const handleLogout = () => { logout(); window.location.assign("/"); };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950">
      <DashboardHeader navItems={navItems} activePath="/support" role="user" onLogout={handleLogout} />
      <main
        className="px-4 pb-8 pt-24 sm:px-6 lg:pb-12"
        style={{ paddingLeft: "calc(var(--sidebar-width, 0px) + clamp(1rem, 2.5vw, 1.5rem))" }}
      >
        <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Thư đã gửi</h1>
            <p className="mt-1 text-sm text-muted-foreground">Theo dõi tiến độ xử lý các yêu cầu hỗ trợ của bạn.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.assign("/support")}><ArrowLeft className="mr-2 h-4 w-4" />Quay lại hỗ trợ</Button>
            <Button variant="outline" onClick={() => void loadRequests(true)} disabled={loading}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />Làm mới</Button>
          </div>
        </div>

        {error && <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {loading ? (
          <Card className="p-10 text-center text-sm text-muted-foreground">Đang tải thư đã gửi...</Card>
        ) : requests.length === 0 ? (
          <Card className="flex flex-col items-center p-6 sm:p-12 text-center">
            <MailCheck className="mb-3 h-10 w-10 text-emerald-600" />
            <h2 className="font-semibold">Bạn chưa gửi yêu cầu nào</h2>
            <p className="mt-1 text-sm text-muted-foreground">Các thư hỗ trợ bạn gửi sẽ xuất hiện ở đây.</p>
            <Button className="mt-5" onClick={() => window.location.assign("/support")}>Viết thư hỗ trợ</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="border-emerald-100 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/70 p-5 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{getSupportCategoryLabel(request.category, t)}</p>
                    <h2 className="mt-1 break-words text-lg font-bold text-slate-900">{request.subject}</h2>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[request.status]}`}>
                    <Clock3 className="h-3.5 w-3.5" />{STATUS_LABELS[request.status]}
                  </span>
                </div>
                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{request.message}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-emerald-100 pt-3 text-xs text-slate-500">
                  <span>Gửi lúc {new Date(request.created_at).toLocaleString("vi-VN")}</span>
                  <span>{request.email_sent ? "Email đã gửi tới admin" : "Yêu cầu đã được ghi nhận trên hệ thống"}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
