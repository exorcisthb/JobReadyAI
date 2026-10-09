import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, CreditCard, DatabaseBackup, Flame, Headset, RefreshCw, ShieldCheck, Trash2, Users, Wrench } from "lucide-react";
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
  { label: "Khuyến mãi", icon: <Flame className="h-5 w-5" />, href: "/admin/promotions" },
  { label: "Bảo mật", icon: <ShieldCheck className="h-5 w-5" />, href: "/admin/security" },
  { label: "User Activity", icon: <Activity className="h-5 w-5" />, href: "/admin/user-activity" },
  { label: "Hỗ trợ", icon: <Headset className="h-5 w-5" />, href: "/admin/support" },
  { label: "Bảo trì", icon: <Wrench className="h-5 w-5" />, href: "/admin/maintenance" },
];

type MaintenanceState = { enabled: boolean; message: string };
type TestUser = { id: string; email: string; status: string; created_at: string; full_name: string | null };

export default function MaintenanceAdminPage() {
  const { user, logout } = useAuth();
  const [maintenance, setMaintenance] = useState<MaintenanceState>({ enabled: false, message: "Hệ thống đang bảo trì, vui lòng quay lại sau." });
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [testUsers, setTestUsers] = useState<TestUser[]>([]);
  const [testEmail, setTestEmail] = useState("");
  const [testPassword, setTestPassword] = useState("");
  const [testName, setTestName] = useState("");

  const headers = useMemo(
    () => ({ "Content-Type": "application/json", "x-user-role": user?.role ?? "", "x-user-id": user?.id ?? "" }),
    [user?.id, user?.role],
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/maintenance", { headers });
      const data = (await response.json()) as { maintenance: MaintenanceState; updatedAt: string | null };
      setMaintenance(data.maintenance);
      setUpdatedAt(data.updatedAt);

      const testResponse = await fetch("/api/admin/test-users", { headers });
      if (testResponse.ok) setTestUsers((await testResponse.json()) as TestUser[]);
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function saveMaintenance(nextState = maintenance) {
    setStatus(null);
    const response = await fetch("/api/admin/maintenance", { method: "PUT", headers, body: JSON.stringify(nextState) });
    if (!response.ok) return setStatus("Không thể cập nhật maintenance mode.");
    const data = (await response.json()) as { maintenance: MaintenanceState; updatedAt: string };
    setMaintenance(data.maintenance);
    setUpdatedAt(data.updatedAt);
    setStatus("Đã cập nhật chế độ bảo trì.");
  }

  async function createTestUser() {
    setStatus(null);
    const normalizedEmail = testEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setStatus("Email không hợp lệ.");
      return;
    }
    if (testPassword.length < 8) {
      setStatus("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }
    const response = await fetch("/api/admin/test-users", {
      method: "POST",
      headers,
      body: JSON.stringify({ email: normalizedEmail, password: testPassword, full_name: testName }),
    });
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) return setStatus(data.error || "Không thể tạo tài khoản test.");
    setStatus("Đã tạo tài khoản User Test. Tài khoản này bypass maintenance nhưng vẫn là role user.");
    setTestEmail("");
    setTestPassword("");
    setTestName("");
    await loadData();
  }


  async function deleteTestUser(item: TestUser) {
    const confirmed = window.confirm(`Xóa User Test ${item.email}? Tài khoản này sẽ bị xóa vĩnh viễn.`);
    if (!confirmed) return;

    setStatus(null);
    const response = await fetch(`/api/admin/test-users/${item.id}`, { method: "DELETE", headers });
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) return setStatus(data.error || "Không thể xóa User Test.");
    setStatus(`Đã xóa User Test ${item.email}.`);
    await loadData();
  }
  async function runAction(path: string) {
    setStatus(null);
    const response = await fetch(path, { method: "POST", headers, body: JSON.stringify({ note: "Triggered from admin panel" }) });
    const data = (await response.json()) as { message?: string };
    setStatus(data.message ?? (response.ok ? "Thao tác hoàn tất." : "Thao tác thất bại."));
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader navItems={adminNavItems} activePath="/admin/maintenance" role="admin" onLogout={() => { logout(); window.location.assign("/"); }} />
      <main className="min-h-screen pt-16">
        <div className="space-y-8 p-6 lg:p-8" style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary"><Wrench className="h-4 w-4" /> Maintenance</div>
              <h1 className="text-3xl font-black tracking-tight">Bảo trì hệ thống</h1>
              <p className="mt-1 text-sm text-muted-foreground">Bật bảo trì, tạo User Test bypass và chạy tác vụ vận hành.</p>
            </div>
            <Button onClick={() => void loadData()} disabled={loading} variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Làm mới</Button>
          </div>

          {status && <Card><CardContent className="p-4 text-sm text-muted-foreground">{status}</CardContent></Card>}

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle>Maintenance mode</CardTitle>
                    <CardDescription>User thật sẽ bị chặn khi bật. Admin và User Test vẫn vào được để kiểm thử.</CardDescription>
                  </div>
                  <Badge variant={maintenance.enabled ? "destructive" : "secondary"}>{maintenance.enabled ? "Đang bật" : "Đang tắt"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea value={maintenance.message} onChange={(event) => setMaintenance((current) => ({ ...current, message: event.target.value }))} placeholder="Thông báo bảo trì" className="min-h-28" />
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => { const nextState = { ...maintenance, enabled: !maintenance.enabled }; setMaintenance(nextState); void saveMaintenance(nextState); }}>{maintenance.enabled ? "Tắt bảo trì" : "Bật bảo trì"}</Button>
                  <Button variant="outline" onClick={() => void saveMaintenance()}>Lưu thông báo</Button>
                </div>
                <p className="text-xs text-muted-foreground">Cập nhật gần nhất: {updatedAt ? new Date(updatedAt).toLocaleString("vi-VN") : "Chưa có"}</p>
              </CardContent>
            </Card>

            <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
              <CardHeader><CardTitle>Tác vụ vận hành</CardTitle><CardDescription>Các tác vụ nhạy cảm được ghi audit log.</CardDescription></CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => void runAction("/api/admin/maintenance/backup")} className="rounded-2xl border border-border/60 p-5 text-left transition hover:bg-muted/40"><DatabaseBackup className="mb-4 h-7 w-7 text-primary" /><p className="font-semibold">Trigger backup DB</p><p className="mt-1 text-xs text-muted-foreground">Ghi nhận yêu cầu backup thủ công cho NeonDB.</p></button>
                <button type="button" onClick={() => void runAction("/api/admin/maintenance/cache/clear")} className="rounded-2xl border border-border/60 p-5 text-left transition hover:bg-muted/40"><Trash2 className="mb-4 h-7 w-7 text-primary" /><p className="font-semibold">Xoá cache</p><p className="mt-1 text-xs text-muted-foreground">Clear cache app/CDN khi đã nối cache layer thật.</p></button>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>User Test bypass bảo trì</CardTitle>
              <CardDescription>Tài khoản vẫn là role user để test đúng UI/flow, nhưng không bị chặn bởi maintenance và không nằm trong danh sách quản lý user thường.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 md:grid-cols-3">
                <Input value={testEmail} onChange={(event) => setTestEmail(event.target.value)} placeholder="Email test user" />
                <Input value={testPassword} onChange={(event) => setTestPassword(event.target.value)} placeholder="Mật khẩu" type="password" />
                <Input value={testName} onChange={(event) => setTestName(event.target.value)} placeholder="Tên hiển thị (tuỳ chọn)" />
              </div>
              <Button onClick={() => void createTestUser()} disabled={!testEmail.trim() || testPassword.length < 8}>Tạo User Test</Button>
              <div className="overflow-x-auto rounded-2xl border border-border/50">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                    <tr><th className="px-4 py-3">Tên</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3">Ngày tạo</th><th className="px-4 py-3">Thao tác</th></tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {testUsers.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 font-medium">{item.full_name || "Test User"}</td>
                        <td className="px-4 py-3">{item.email}</td>
                        <td className="px-4 py-3"><Badge variant="secondary">{item.status}</Badge></td>
                        <td className="px-4 py-3 text-muted-foreground">{new Date(item.created_at).toLocaleString("vi-VN")}</td>
                        <td className="px-4 py-3"><Button variant="destructive" size="sm" onClick={() => void deleteTestUser(item)}>Xóa</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {testUsers.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Chưa có User Test.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}



