import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, CreditCard, Flame, RefreshCw, ShieldCheck, Users, Wrench } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader, type NavItem } from "@/components/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const adminNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <BarChart3 className="h-5 w-5" />, href: "/admin/dashboard" },
  { label: "Người dùng", icon: <Users className="h-5 w-5" />, href: "/admin/users" },
  { label: "Tài chính", icon: <CreditCard className="h-5 w-5" />, href: "/admin/finance" },
  { label: "Khuyến mãi", icon: <Flame className="h-5 w-5" />, href: "/admin/promotions" },
  { label: "Bảo mật", icon: <ShieldCheck className="h-5 w-5" />, href: "/admin/security" },
  { label: "User Activity", icon: <Activity className="h-5 w-5" />, href: "/admin/user-activity" },
  { label: "Bảo trì", icon: <Wrench className="h-5 w-5" />, href: "/admin/maintenance" },
];

type SecurityData = {
  auditLogs: {
    id: number;
    action: string;
    target_type: string | null;
    target_id: string | null;
    ip_address: string | null;
    created_at: string;
    admin_email: string | null;
  }[];
  blocklist: { id: number; type: "ip" | "email_domain"; value: string; reason: string | null; created_at: string }[];
  sameIpAccounts: { ip_address: string; account_count: number; emails: string[] | null }[];
  recentIpActivity: {
    id: string;
    email: string | null;
    registration_ip: string | null;
    last_login_ip: string | null;
    last_login_at: string | null;
    created_at: string;
  }[];
};

export default function SecurityAdminPage() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<SecurityData | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [auditPage, setAuditPage] = useState(1);
  const AUDIT_PAGE_SIZE = 8;
  const pagedLogs = (data?.auditLogs ?? []).slice((auditPage - 1) * AUDIT_PAGE_SIZE, auditPage * AUDIT_PAGE_SIZE);
  const auditTotalPages = Math.max(1, Math.ceil((data?.auditLogs ?? []).length / AUDIT_PAGE_SIZE));

  const headers = useMemo(
    () => ({ "Content-Type": "application/json", "x-user-role": user?.role ?? "", "x-user-id": user?.id ?? "" }),
    [user?.id, user?.role],
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setAuditPage(1);
    try {
      const response = await fetch("/api/admin/security", { headers });
      if (!response.ok) throw new Error("Không thể tải dữ liệu bảo mật.");
      setData((await response.json()) as SecurityData);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể tải dữ liệu bảo mật.");
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function unblockItem(id: number, value: string) {
    setMessage(null);
    const response = await fetch(`/api/admin/security/blocklist/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) {
      try {
        const errData = await response.json();
        setMessage(`Lỗi: ${errData.error || "Không thể mở chặn."}`);
      } catch {
        setMessage("Không thể mở chặn.");
      }
      return;
    }
    setMessage(`Đã mở chặn ${value}.`);
    await loadData();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader
        navItems={adminNavItems}
        activePath="/admin/security"
        role="admin"
        onLogout={() => {
          logout();
          window.location.assign("/");
        }}
      />
      <main className="min-h-screen pt-16">
        <div className="space-y-8 p-6 lg:p-8" style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <ShieldCheck className="h-4 w-4" /> Security
              </div>
              <h1 className="text-3xl font-black tracking-tight">Bảo mật admin</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Hệ thống tự lưu IP khi user đăng ký/đăng nhập, admin có thể chặn trực tiếp từ dữ liệu thật.
              </p>
            </div>
            <Button onClick={() => void loadData()} disabled={loading} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Làm mới
            </Button>
          </div>

          {message && (
            <Card>
              <CardContent className="p-4 text-sm text-muted-foreground">{message}</CardContent>
            </Card>
          )}

          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.2fr]">
            <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Blacklist IP / email domain</CardTitle>
                <CardDescription>Chặn spam đăng ký theo IP hoặc domain email.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {(data?.blocklist ?? []).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Chưa có mục nào trong blacklist.</p>
                ) : (data?.blocklist ?? []).map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl border border-border/50 p-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold truncate">{item.value}</span>
                        <Badge variant="secondary">{item.type}</Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground truncate">{item.reason || "Không có lý do"}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => void unblockItem(item.id, item.value)}>Mở</Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Audit log</CardTitle>
                <CardDescription>Ai làm gì, lúc mấy giờ — đặc biệt cho hành động nhạy cảm.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase text-muted-foreground">
                    <tr><th className="py-3">Admin</th><th>Hành động</th><th>Target</th><th>IP</th><th>Thời gian</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pagedLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="py-3 pr-4">{log.admin_email ?? "System"}</td>
                        <td className="pr-4 font-semibold">{log.action}</td>
                        <td className="pr-4 text-muted-foreground">{log.target_type ?? "-"}:{log.target_id ?? "-"}</td>
                        <td className="pr-4">{log.ip_address ?? "-"}</td>
                        <td className="text-muted-foreground">{new Date(log.created_at).toLocaleString("vi-VN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(data?.auditLogs ?? []).length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Chưa có audit log.</p>}
                {(data?.auditLogs ?? []).length > 0 && (
                  <div className="flex items-center justify-between pt-4">
                    <p className="text-xs text-muted-foreground">Trang {auditPage} / {auditTotalPages}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" disabled={auditPage <= 1} onClick={() => setAuditPage((p) => p - 1)}>Trước</Button>
                      <Button size="sm" variant="outline" disabled={auditPage >= auditTotalPages} onClick={() => setAuditPage((p) => p + 1)}>Sau</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>


        </div>
      </main>
    </div>
  );
}
