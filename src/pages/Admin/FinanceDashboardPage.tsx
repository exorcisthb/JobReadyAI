import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, CreditCard, RefreshCw, ShieldCheck, Users, Wrench } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader, type NavItem } from "@/components/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const adminNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <BarChart3 className="h-5 w-5" />, href: "/admin/dashboard" },
  { label: "Người dùng", icon: <Users className="h-5 w-5" />, href: "/admin/users" },
  { label: "Tài chính", icon: <CreditCard className="h-5 w-5" />, href: "/admin/finance" },
  { label: "Bảo mật", icon: <ShieldCheck className="h-5 w-5" />, href: "/admin/security" },
  { label: "User Activity", icon: <Activity className="h-5 w-5" />, href: "/admin/user-activity" },
  { label: "Bảo trì", icon: <Wrench className="h-5 w-5" />, href: "/admin/maintenance" },
];

type FinanceData = {
  summary: {
    today_revenue: number;
    week_revenue: number;
    month_revenue: number;
    mrr: number;
    conversion_rate: number;
    pro_users: number;
    ultra_users: number;
    expiring_soon: number;
  };
  dailyRevenue: { date: string; revenue: number }[];
  transactions: { id: string; item: string; amount: number; status: string; created_at: string; email: string | null }[];
  expiringUsers: { id: string; email: string | null; subscription_plan: string; subscription_expires_at: string }[];
};

const currency = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

function MetricCard({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-extrabold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{note}</p>
      </CardContent>
    </Card>
  );
}

export default function FinanceDashboardPage() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const headers = useMemo(() => ({ "x-user-role": user?.role ?? "", "x-user-id": user?.id ?? "" }), [user?.id, user?.role]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/finance", { headers });
      if (!response.ok) throw new Error("Không thể tải dashboard tài chính.");
      setData((await response.json()) as FinanceData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Đã có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader navItems={adminNavItems} activePath="/admin/finance" role="admin" onLogout={() => { logout(); window.location.assign("/"); }} />
      <main className="min-h-screen pt-16">
        <div className="space-y-8 p-6 lg:p-8" style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <CreditCard className="h-4 w-4" /> Finance & Subscription
              </div>
              <h1 className="text-3xl font-black tracking-tight">Dashboard tài chính</h1>
              <p className="mt-1 text-sm text-muted-foreground">Theo dõi doanh thu, MRR, giao dịch và user sắp hết hạn gói.</p>
            </div>
            <Button onClick={() => void loadData()} disabled={loading} variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Làm mới</Button>
          </div>

          {error && <Card className="border-destructive/30 bg-destructive/5"><CardContent className="p-4 text-sm text-destructive">{error}</CardContent></Card>}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard title="Doanh thu hôm nay" value={currency.format(data?.summary.today_revenue ?? 0)} note="Từ giao dịch add-on thành công" />
            <MetricCard title="Doanh thu tháng" value={currency.format(data?.summary.month_revenue ?? 0)} note={`Tuần này: ${currency.format(data?.summary.week_revenue ?? 0)}`} />
            <MetricCard title="MRR ước tính" value={currency.format(data?.summary.mrr ?? 0)} note="Tính từ user Pro/Ultra active" />
            <MetricCard title="Conversion" value={`${data?.summary.conversion_rate ?? 0}%`} note={`Pro: ${data?.summary.pro_users ?? 0} • Ultra: ${data?.summary.ultra_users ?? 0}`} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
            <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
              <CardHeader><CardTitle>Doanh thu 14 ngày</CardTitle><CardDescription>Biểu đồ doanh thu giao dịch thành công</CardDescription></CardHeader>
              <CardContent className="h-80">
                {loading ? <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Đang tải...</div> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data?.dailyRevenue ?? []}>
                      <defs><linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                      <XAxis dataKey="date" tickFormatter={(value: string) => `${new Date(value).getDate()}/${new Date(value).getMonth() + 1}`} tickLine={false} axisLine={false} />
                      <YAxis tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} tickLine={false} axisLine={false} />
                      <Tooltip formatter={(value: number) => currency.format(value)} labelFormatter={(label) => new Date(label).toLocaleDateString("vi-VN")} />
                      <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
              <CardHeader><CardTitle>User sắp hết hạn</CardTitle><CardDescription>{data?.summary.expiring_soon ?? 0} user hết hạn trong 7 ngày</CardDescription></CardHeader>
              <CardContent className="space-y-3">
                {(data?.expiringUsers ?? []).length === 0 ? <p className="text-sm text-muted-foreground">Chưa có user sắp hết hạn.</p> : data?.expiringUsers.map((item) => (
                  <div key={item.id} className="rounded-xl border border-border/50 p-3">
                    <div className="flex items-center justify-between gap-3"><p className="truncate text-sm font-semibold">{item.email ?? "Không có email"}</p><Badge variant="secondary">{item.subscription_plan}</Badge></div>
                    <p className="mt-1 text-xs text-muted-foreground">Hết hạn: {new Date(item.subscription_expires_at).toLocaleDateString("vi-VN")}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader><CardTitle>Danh sách giao dịch</CardTitle><CardDescription>Giao dịch thành công / thất bại / hoàn tiền khi đã tích hợp cổng thanh toán thật.</CardDescription></CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-left text-sm"><thead className="text-xs uppercase text-muted-foreground"><tr><th className="py-3">User</th><th>Dịch vụ</th><th>Số tiền</th><th>Trạng thái</th><th>Thời gian</th></tr></thead><tbody className="divide-y divide-border">
                {(data?.transactions ?? []).map((tx) => <tr key={tx.id}><td className="py-3 pr-4">{tx.email ?? "Ẩn danh"}</td><td className="pr-4">{tx.item}</td><td className="pr-4 font-semibold">{currency.format(tx.amount)}</td><td className="pr-4"><Badge variant={tx.status === "completed" ? "default" : "outline"}>{tx.status}</Badge></td><td className="text-muted-foreground">{new Date(tx.created_at).toLocaleString("vi-VN")}</td></tr>)}
              </tbody></table>
              {(data?.transactions ?? []).length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Chưa có giao dịch.</p>}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
