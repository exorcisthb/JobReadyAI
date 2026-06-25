import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, CreditCard, RefreshCw, ShieldCheck, Users, Wrench } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader, type NavItem } from "@/components/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const adminNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <BarChart3 className="h-5 w-5" />, href: "/admin/dashboard" },
  { label: "Người dùng", icon: <Users className="h-5 w-5" />, href: "/admin/users" },
  { label: "Tài chính", icon: <CreditCard className="h-5 w-5" />, href: "/admin/finance" },
  { label: "Bảo mật", icon: <ShieldCheck className="h-5 w-5" />, href: "/admin/security" },
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
  const [type, setType] = useState<"ip" | "email_domain">("ip");
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const headers = useMemo(
    () => ({ "Content-Type": "application/json", "x-user-role": user?.role ?? "", "x-user-id": user?.id ?? "" }),
    [user?.id, user?.role],
  );

  const loadData = useCallback(async () => {
    setLoading(true);
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

  async function saveBlocklist(nextType: "ip" | "email_domain", nextValue: string, nextReason: string) {
    setMessage(null);
    const response = await fetch("/api/admin/security/blocklist", {
      method: "POST",
      headers,
      body: JSON.stringify({ type: nextType, value: nextValue, reason: nextReason }),
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
    setMessage(nextType === "ip" ? `Đã chặn IP ${nextValue}.` : `Đã chặn domain ${nextValue}.`);
    await loadData();
  }

  async function addBlocklist() {
    if (!value.trim()) return;
    await saveBlocklist(type, value.trim(), reason.trim());
    setValue("");
    setReason("");
  }

  async function blockIp(ipAddress: string, note: string) {
    setType("ip");
    setValue(ipAddress);
    setReason(note);
    await saveBlocklist("ip", ipAddress, note);
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
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant={type === "ip" ? "default" : "outline"} onClick={() => setType("ip")}>IP</Button>
                  <Button variant={type === "email_domain" ? "default" : "outline"} onClick={() => setType("email_domain")}>Email domain</Button>
                </div>
                <Input value={value} onChange={(event) => setValue(event.target.value)} placeholder={type === "ip" ? "VD: 113.23.10.8" : "VD: spam.com"} />
                <Textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Lý do chặn" />
                <Button onClick={() => void addBlocklist()} disabled={!value.trim()}>Thêm / cập nhật</Button>
                <div className="space-y-2 pt-2">
                  {(data?.blocklist ?? []).map((item) => (
                    <div key={item.id} className="rounded-xl border border-border/50 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold">{item.value}</span>
                        <Badge variant="secondary">{item.type}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{item.reason || "Không có lý do"}</p>
                    </div>
                  ))}
                </div>
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
                    {(data?.auditLogs ?? []).map((log) => (
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
              </CardContent>
            </Card>
          </div>

          <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>IP gần đây</CardTitle>
              <CardDescription>Danh sách IP đăng ký/đăng nhập mới nhất, dùng để chặn nhanh khi phát hiện spam.</CardDescription>
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
                        <td>{ipAddress && <Button size="sm" variant="outline" onClick={() => void blockIp(ipAddress, `Blocked user ${item.email ?? item.id}`)}>Chặn IP</Button>}</td>
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
                      <Button size="sm" variant="outline" onClick={() => void blockIp(item.ip_address, "Blocked multi-account IP")}>Chặn</Button>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{(item.emails ?? []).slice(0, 5).join(", ")}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
