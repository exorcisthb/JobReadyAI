import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, CreditCard, RefreshCw, Search, ShieldCheck, Users, Wrench } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader, type NavItem } from "@/components/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const adminNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <BarChart3 className="h-5 w-5" />, href: "/admin/dashboard" },
  { label: "Người dùng", icon: <Users className="h-5 w-5" />, href: "/admin/users" },
  { label: "Tài chính", icon: <CreditCard className="h-5 w-5" />, href: "/admin/finance" },
  { label: "Bảo mật", icon: <ShieldCheck className="h-5 w-5" />, href: "/admin/security" },
  { label: "User Activity", icon: <Activity className="h-5 w-5" />, href: "/admin/user-activity" },
  { label: "Bảo trì", icon: <Wrench className="h-5 w-5" />, href: "/admin/maintenance" },
];

type UserLog = {
  id: number;
  action: string;
  target_type: string | null;
  target_id: string | null;
  ip_address: string | null;
  created_at: string;
  user_email: string | null;
  user_id: string | null;
};

type IpActivity = {
  id: string;
  email: string | null;
  registration_ip: string | null;
  last_login_ip: string | null;
  last_login_at: string | null;
  created_at: string;
};

type SameIpAccount = {
  ip_address: string;
  account_count: number;
  emails: string[] | null;
};

type ActivityLog = {
  id: number;
  ip_address: string | null;
  page_url: string | null;
  created_at: string;
  user_email: string | null;
  user_id: string | null;
};

type UserActivityData = {
  userLogs: UserLog[];
  activityLogs: ActivityLog[];
  recentIpActivity: IpActivity[];
  sameIpAccounts: SameIpAccount[];
  blockedIps: string[];
};


export default function UserActivityAdminPage() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<UserActivityData | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [logPage, setLogPage] = useState(1);
  const [searchEmail, setSearchEmail] = useState("");
  const LOG_PAGE_SIZE = 15;

  const headers = useMemo(
    () => ({ "Content-Type": "application/json", "x-user-role": user?.role ?? "", "x-user-id": user?.id ?? "" }),
    [user?.id, user?.role],
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setLogPage(1);
    try {
      const params = new URLSearchParams();
      if (searchEmail.trim()) params.set("email", searchEmail.trim());
      const response = await fetch(`/api/admin/user-activity?${params.toString()}`, { headers });
      if (!response.ok) throw new Error("Không thể tải dữ liệu.");
      setData((await response.json()) as UserActivityData);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Lỗi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, [headers, searchEmail]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const blockedIpsSet = useMemo(() => new Set((data?.blockedIps ?? []).map((ip) => ip.replace(/^::ffff:/, ""))), [data?.blockedIps]);

  async function toggleBlockIp(ipAddress: string, note: string) {
    setMessage(null);
    const ip = ipAddress.replace(/^::ffff:/, "");
    const isBlocked = blockedIpsSet.has(ip);

    if (isBlocked) {
      const blocklistResponse = await fetch("/api/admin/security", { headers });
      if (!blocklistResponse.ok) return;
      const blocklistData = await blocklistResponse.json() as { blocklist: { id: number; value: string }[] };
      const item = blocklistData.blocklist.find((b) => b.value.replace(/^::ffff:/, "") === ip);
      if (!item) { setMessage("Không tìm thấy IP trong blocklist."); return; }
      const response = await fetch(`/api/admin/security/blocklist/${item.id}`, {
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
      setMessage(`Đã mở chặn IP ${ip}.`);
    } else {
      const response = await fetch("/api/admin/security/blocklist", {
        method: "POST",
        headers,
        body: JSON.stringify({ type: "ip", value: ip, reason: note }),
      });
      if (!response.ok) {
        try {
          const errData = await response.json();
          setMessage(`Lỗi: ${errData.error || errData.message || "Không thể cập nhật blacklist."}`);
        } catch {
          setMessage("Không thể cập nhật blacklist.");
        }
        return;
      }
      setMessage(`Đã chặn IP ${ip}.`);
    }
    await loadData();
  }

  const pagedLogs = (data?.activityLogs ?? []).slice((logPage - 1) * LOG_PAGE_SIZE, logPage * LOG_PAGE_SIZE);
  const logTotalPages = Math.max(1, Math.ceil((data?.activityLogs ?? []).length / LOG_PAGE_SIZE));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader
        navItems={adminNavItems}
        activePath="/admin/user-activity"
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
                <Activity className="h-4 w-4" /> User Activity
              </div>
              <h1 className="text-3xl font-black tracking-tight">Hoạt động người dùng</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Theo dõi IP và hoạt động của người dùng, phát hiện hành vi đáng ngờ.
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

          <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>IP gần đây (User)</CardTitle>
              <CardDescription>Danh sách IP đăng ký/đăng nhập mới nhất của người dùng, dùng để chặn nhanh khi phát hiện spam.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-muted-foreground">
                  <tr><th className="py-3">User</th><th>IP đăng ký</th><th>IP đăng nhập cuối</th><th>Thời gian</th><th></th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {(data?.recentIpActivity ?? []).map((item) => {
                    const ipAddress = item.last_login_ip ?? item.registration_ip;
                    return (
                      <tr key={item.id}>
                        <td className="py-3 pr-4">{item.email ?? "Không có email"}</td>
                        <td className="pr-4">{item.registration_ip ?? "-"}</td>
                        <td className="pr-4 font-semibold">{item.last_login_ip ?? "-"}</td>
                        <td className="pr-4 text-muted-foreground">{new Date(item.last_login_at ?? item.created_at).toLocaleString("vi-VN")}</td>
                        <td>{ipAddress && (() => { const isBlocked = blockedIpsSet.has(ipAddress.replace(/^::ffff:/, "")); return (<Button size="sm" variant={isBlocked ? "secondary" : "outline"} onClick={() => void toggleBlockIp(ipAddress, `Blocked user ${item.email ?? item.id}`)}>{isBlocked ? "Mở" : "Chặn"}</Button>); })()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {(data?.recentIpActivity ?? []).length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Chưa có IP nào. IP sẽ xuất hiện sau khi user đăng ký hoặc đăng nhập lại.</p>}
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Tài khoản cùng IP</CardTitle>
              <CardDescription>Phát hiện nhiều tài khoản đăng ký/đăng nhập từ cùng IP.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {(data?.sameIpAccounts ?? []).length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có dữ liệu IP hoặc chưa phát hiện trùng.</p>
              ) : data?.sameIpAccounts.map((item) => (
                <div key={item.ip_address} className="rounded-xl border border-border/50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{item.ip_address}</span>
                    <div className="flex items-center gap-2">
                      <Badge>{item.account_count} accounts</Badge>
                      <Button size="sm" variant="outline" onClick={() => void toggleBlockIp(item.ip_address, "Blocked multi-account IP")}>{blockedIpsSet.has(item.ip_address.replace(/^::ffff:/, "")) ? "Mở" : "Chặn"}</Button>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{(item.emails ?? []).slice(0, 5).join(", ")}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>User Activity Log</CardTitle>
              <CardDescription>Lịch sử truy cập và hoạt động của người dùng trên web.</CardDescription>
              <div className="flex gap-2 pt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    placeholder="Tìm kiếm theo email..."
                    className="pl-9"
                    onKeyDown={(e) => { if (e.key === "Enter") void loadData(); }}
                  />
                </div>
                <Button size="sm" variant="secondary" onClick={() => void loadData()}>Tìm</Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-muted-foreground">
                  <tr><th className="py-3">User</th><th>Trang/API</th><th>IP</th><th>Thời gian</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pagedLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="py-3 pr-4">{log.user_email ?? "N/A"}</td>
                      <td className="pr-4 font-mono text-xs max-w-[300px] truncate">{log.page_url ?? "-"}</td>
                      <td className="pr-4">{log.ip_address ?? "-"}</td>
                      <td className="text-muted-foreground whitespace-nowrap">{new Date(log.created_at).toLocaleString("vi-VN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(data?.activityLogs ?? []).length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Chưa có hoạt động nào.</p>}
              {(data?.activityLogs ?? []).length > 0 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-xs text-muted-foreground">Trang {logPage} / {logTotalPages}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" disabled={logPage <= 1} onClick={() => setLogPage((p) => p - 1)}>Trước</Button>
                    <Button size="sm" variant="outline" disabled={logPage >= logTotalPages} onClick={() => setLogPage((p) => p + 1)}>Sau</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
