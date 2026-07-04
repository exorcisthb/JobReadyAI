import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  CreditCard,
  FileText,
  RefreshCw,
  ShieldCheck,
  Star,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader, type NavItem } from "@/components/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const adminNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <BarChart3 className="h-5 w-5" />, href: "/admin/dashboard" },
  { label: "Người dùng", icon: <Users className="h-5 w-5" />, href: "/admin/users" },
  { label: "Tài chính", icon: <CreditCard className="h-5 w-5" />, href: "/admin/finance" },
  { label: "Bảo mật", icon: <ShieldCheck className="h-5 w-5" />, href: "/admin/security" },
  { label: "Bảo trì", icon: <Wrench className="h-5 w-5" />, href: "/admin/maintenance" },
];

type Transaction = {
  id: string;
  item: string;
  amount: number;
  status: string;
  created_at: string;
  email: string | null;
};

type FinanceData = {
  summary: {
    today_revenue: number;
    week_revenue: number;
    month_revenue: number;
    total_revenue: number;
    today_interview_revenue: number;
    week_interview_revenue: number;
    month_interview_revenue: number;
    today_cv_revenue: number;
    week_cv_revenue: number;
    month_cv_revenue: number;
    mrr: number;
    mrr_interview: number;
    mrr_cv: number;
    conversion_rate: number;
    pro_users: number;
    ultra_users: number;
    interview_users: number;
    cv_users: number;
    expiring_soon: number;
  };
  dailyRevenue: { date: string; interview_revenue: number; cv_revenue: number }[];
  interviewTransactions: Transaction[];
  cvTransactions: Transaction[];
  expiringUsers: {
    id: string;
    email: string | null;
    subscription_plan: string;
    subscription_expires_at: string;
  }[];
  activeUsers: {
    id: string;
    email: string | null;
    sub_plan_interview: string | null;
    sub_plan_cv: string | null;
    sub_expires_interview: string | null;
    sub_expires_cv: string | null;
  }[];
};

const currency = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

function fmt(v: number | undefined) {
  return currency.format(v ?? 0);
}

// ── Metric Card ─────────────────────────────────────────────────────────────
function MetricCard({
  title,
  value,
  note,
  accent = "indigo",
  icon,
}: {
  title: string;
  value: string;
  note: string;
  accent?: "indigo" | "violet" | "emerald" | "amber" | "sky";
  icon?: React.ReactNode;
}) {
  const gradients: Record<string, string> = {
    indigo: "from-indigo-500/10 to-indigo-500/5 border-indigo-500/20",
    violet: "from-violet-500/10 to-violet-500/5 border-violet-500/20",
    emerald: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20",
    amber: "from-amber-500/10 to-amber-500/5 border-amber-500/20",
    sky: "from-sky-500/10 to-sky-500/5 border-sky-500/20",
  };
  const iconColors: Record<string, string> = {
    indigo: "text-indigo-400",
    violet: "text-violet-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    sky: "text-sky-400",
  };
  return (
    <Card className={`border bg-gradient-to-br ${gradients[accent]} backdrop-blur-sm`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {icon && <span className={iconColors[accent]}>{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-extrabold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{note}</p>
      </CardContent>
    </Card>
  );
}

// ── Revenue Split Card ───────────────────────────────────────────────────────
function RevenueCard({
  title,
  description,
  icon,
  color,
  today,
  week,
  month,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: "violet" | "sky";
  today: number;
  week: number;
  month: number;
}) {
  const border = color === "violet" ? "border-violet-500/20" : "border-sky-500/20";
  const gradient = color === "violet"
    ? "from-violet-500/10 to-violet-500/5"
    : "from-sky-500/10 to-sky-500/5";
  const iconColor = color === "violet" ? "text-violet-400" : "text-sky-400";
  const valueBg = color === "violet" ? "bg-violet-500/10" : "bg-sky-500/10";
  const valueColor = color === "violet" ? "text-violet-300" : "text-sky-300";

  return (
    <Card className={`border ${border} bg-gradient-to-br ${gradient} backdrop-blur-sm`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <span className={iconColor}>{icon}</span>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className={`flex items-center justify-between rounded-lg ${valueBg} px-4 py-3`}>
          <span className="text-sm text-muted-foreground">Hôm nay</span>
          <span className={`text-xl font-bold ${valueColor}`}>{fmt(today)}</span>
        </div>
        <div className={`flex items-center justify-between rounded-lg ${valueBg} px-4 py-3`}>
          <span className="text-sm text-muted-foreground">Tuần này</span>
          <span className={`text-xl font-bold ${valueColor}`}>{fmt(week)}</span>
        </div>
        <div className={`flex items-center justify-between rounded-lg ${valueBg} px-4 py-3`}>
          <span className="text-sm text-muted-foreground">Tháng này</span>
          <span className={`text-xl font-bold ${valueColor}`}>{fmt(month)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Transaction Table ────────────────────────────────────────────────────────
function TransactionTable({ rows, emptyText }: { rows: Transaction[]; emptyText: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase text-muted-foreground">
          <tr>
            <th className="py-3">User</th>
            <th>Gói</th>
            <th>Số tiền</th>
            <th>Trạng thái</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((tx) => (
            <tr key={tx.id}>
              <td className="py-3 pr-4 max-w-[180px] truncate">{tx.email ?? "Ẩn danh"}</td>
              <td className="pr-4 max-w-[200px] truncate">{tx.item}</td>
              <td className="pr-4 font-semibold">{currency.format(tx.amount)}</td>
              <td className="pr-4">
                <Badge variant={tx.status === "completed" ? "default" : "outline"}>
                  {tx.status}
                </Badge>
              </td>
              <td className="text-muted-foreground whitespace-nowrap">
                {new Date(tx.created_at).toLocaleString("vi-VN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">{emptyText}</p>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function FinanceDashboardPage() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState("");

  const monthOptions = useMemo(() => {
    const options: { value: string; label: string }[] = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = i === 0 ? "Tháng này" : `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`;
      options.push({ value: val, label });
    }
    return options;
  }, []);

  const headers = useMemo(
    () => ({ "x-user-role": user?.role ?? "", "x-user-id": user?.id ?? "" }),
    [user?.id, user?.role],
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = selectedMonth ? `/api/admin/finance?month=${selectedMonth}` : "/api/admin/finance";
      const response = await fetch(url, { headers });
      if (!response.ok) throw new Error("Không thể tải dashboard tài chính.");
      setData((await response.json()) as FinanceData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Đã có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  }, [headers, selectedMonth]);

  useEffect(() => {
    void loadData();
  }, [loadData]);
  const hasDataRevenues =
    data?.dailyRevenue &&
    data.dailyRevenue.length > 0 &&
    data.dailyRevenue.some((d) => d.interview_revenue > 0 || d.cv_revenue > 0);
  const chartTicks = useMemo(() => {
    if (!data?.dailyRevenue || data.dailyRevenue.length === 0) return [];
    const totalDays = data.dailyRevenue.length;
    const isOddMonth = totalDays % 2 !== 0;
    
    return data.dailyRevenue
      .filter((item) => {
        const dateObj = new Date(item.date);
        const day = dateObj.getUTCDate();
        return isOddMonth ? day % 2 !== 0 : day % 2 === 0;
      })
      .map((item) => item.date);
  }, [data?.dailyRevenue]);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader
        navItems={adminNavItems}
        activePath="/admin/finance"
        role="admin"
        onLogout={() => {
          logout();
          window.location.assign("/");
        }}
      />
      <main className="min-h-screen pt-16">
        <div className="space-y-8 p-6 lg:p-8" style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}>

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <CreditCard className="h-4 w-4" /> Finance &amp; Subscription
              </div>
              <h1 className="text-3xl font-black tracking-tight">Dashboard tài chính</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Theo dõi doanh thu Interview &amp; CV, MRR, giao dịch và user sắp hết hạn.
              </p>
            </div>
            <Button onClick={() => void loadData()} disabled={loading} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Làm mới
            </Button>
          </div>

          {error && (
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="p-4 text-sm text-destructive">{error}</CardContent>
            </Card>
          )}

          {/* KPI tổng hợp */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Tổng doanh thu hôm nay"
              value={fmt(data?.summary.today_revenue)}
              note="Interview + CV"
              accent="indigo"
              icon={<CreditCard className="h-3.5 w-3.5" />}
            />
            <MetricCard
              title="Tổng doanh thu"
              value={fmt(data?.summary.total_revenue)}
              note="Tích lũy trọn đời"
              accent="violet"
              icon={<BarChart3 className="h-3.5 w-3.5" />}
            />
            <MetricCard
              title="MRR ước tính"
              value={fmt(data?.summary.mrr)}
              note={`Interview: ${fmt(data?.summary.mrr_interview)} • CV: ${fmt(data?.summary.mrr_cv)}`}
              accent="emerald"
              icon={<Zap className="h-3.5 w-3.5" />}
            />
            <MetricCard
              title="Conversion"
              value={`${data?.summary.conversion_rate ?? 0}%`}
              note={`Interview: ${data?.summary.interview_users ?? 0} • CV: ${data?.summary.cv_users ?? 0}`}
              accent="amber"
              icon={<Star className="h-3.5 w-3.5" />}
            />
          </div>

          {/* 2 card doanh thu riêng */}
          <div className="grid gap-4 md:grid-cols-2">
            <RevenueCard
              title="Doanh thu Interview"
              description="Pro Interview · Ultra Interview"
              icon={<BookOpen className="h-4 w-4" />}
              color="violet"
              today={data?.summary.today_interview_revenue ?? 0}
              week={data?.summary.week_interview_revenue ?? 0}
              month={data?.summary.month_interview_revenue ?? 0}
            />
            <RevenueCard
              title="Doanh thu CV"
              description="Pro CV · Ultra CV"
              icon={<FileText className="h-4 w-4" />}
              color="sky"
              today={data?.summary.today_cv_revenue ?? 0}
              week={data?.summary.week_cv_revenue ?? 0}
              month={data?.summary.month_cv_revenue ?? 0}
            />
          </div>

          {/* Biểu đồ + User sắp hết hạn xếp chồng hàng dọc */}
          <div className="grid gap-6">
            <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>Doanh thu theo loại gói</CardTitle>
                  <CardDescription>
                    <span className="inline-flex items-center gap-1 mr-4">
                      <span className="inline-block h-2 w-3 rounded-sm bg-violet-500" /> Interview
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="inline-block h-2 w-3 rounded-sm bg-sky-400" /> CV
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="month-select" className="text-xs font-semibold text-muted-foreground">Xem tháng:</label>
                  <select
                    id="month-select"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="h-9 rounded-xl border border-input bg-background px-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {monthOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </CardHeader>
              <CardContent className="h-80">
                {loading ? (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Đang tải...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data?.dailyRevenue ?? []} margin={{ top: 10, right: 15, left: -15, bottom: 5 }}>
                      <defs>
                        <linearGradient id="gradInterview" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradCV" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(v: string) => `${new Date(v).getUTCDate()}/${new Date(v).getUTCMonth() + 1}`}
                        tickLine={false}
                        axisLine={false}
                        ticks={chartTicks}
                        interval={0}
                        padding={{ left: 15, right: 15 }}
                        tick={{ fontSize: 10 }}
                        tickMargin={8}
                      />
                      <YAxis
                        tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                        tickLine={false}
                        axisLine={false}
                        domain={hasDataRevenues ? [0, "auto"] : [0, 100000]}
                        tick={{ fontSize: 10 }}
                        tickMargin={8}
                      />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          currency.format(value),
                          name === "interview_revenue" ? "Interview" : "CV",
                        ]}
                        labelFormatter={(label) => new Date(label).toLocaleDateString("vi-VN")}
                      />
                      <Legend
                        formatter={(value) => (value === "interview_revenue" ? "Interview" : "CV")}
                      />
                      <Area
                        type="monotone"
                        dataKey="interview_revenue"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        fill="url(#gradInterview)"
                      />
                      <Area
                        type="monotone"
                        dataKey="cv_revenue"
                        stroke="#38bdf8"
                        strokeWidth={2}
                        fill="url(#gradCV)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Quản lý thời hạn gói User */}
            <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle>Thời hạn gói của User</CardTitle>
                <CardDescription>
                  Danh sách thành viên sắp hết hạn và đang còn hạn gói Premium
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex flex-col">
                <Tabs defaultValue="expiring" className="flex-1 flex flex-col">
                  <TabsList className="grid w-full grid-cols-2 mb-3">
                    <TabsTrigger value="expiring" className="cursor-pointer">
                      Sắp hết hạn ({data?.summary.expiring_soon ?? 0})
                    </TabsTrigger>
                    <TabsTrigger value="active" className="cursor-pointer">
                      Còn hạn ({(data?.activeUsers ?? []).length})
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="expiring" className="flex-1 overflow-y-auto space-y-3 max-h-64 pr-1">
                    {(data?.expiringUsers ?? []).length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">Chưa có user nào sắp hết hạn.</p>
                    ) : (
                      data?.expiringUsers.map((item) => (
                        <div key={item.id} className="rounded-xl border border-border/50 p-3 bg-muted/10">
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate text-sm font-semibold text-foreground/90">
                              {item.email ?? "Không có email"}
                            </p>
                            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-none font-bold">
                              {item.subscription_plan}
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Hết hạn: {new Date(item.subscription_expires_at).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="active" className="flex-1 overflow-y-auto space-y-3 max-h-64 pr-1">
                    {(data?.activeUsers ?? []).length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">Chưa có user nào còn hạn.</p>
                    ) : (
                      data?.activeUsers.map((item) => {
                        const plans: { name: string; expiry: string | null }[] = [];
                        if (item.sub_plan_interview && item.sub_plan_interview !== "free") {
                          plans.push({
                            name: item.sub_plan_interview,
                            expiry: item.sub_expires_interview,
                          });
                        }
                        if (item.sub_plan_cv && item.sub_plan_cv !== "free") {
                          plans.push({
                            name: item.sub_plan_cv,
                            expiry: item.sub_expires_cv,
                          });
                        }
                        
                        return (
                          <div key={item.id} className="rounded-xl border border-border/50 p-3 bg-muted/10">
                            <div className="flex items-center justify-between gap-3">
                              <p className="truncate text-sm font-semibold text-foreground/90">
                                {item.email ?? "Không có email"}
                              </p>
                              <div className="flex flex-col gap-1 items-end">
                                {plans.map((p, idx) => (
                                  <Badge key={idx} variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none font-bold">
                                    {p.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="mt-1.5 text-xs text-muted-foreground space-y-0.5">
                              {plans.map((p, idx) => (
                                <p key={idx}>
                                  <span className="font-semibold text-foreground/80">{p.name}:</span>{" "}
                                  {p.expiry ? `Hết hạn: ${new Date(p.expiry).toLocaleDateString("vi-VN")}` : "Gia hạn tự động"}
                                </p>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Bảng giao dịch — 2 tab Interview / CV */}
          <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Danh sách giao dịch</CardTitle>
              <CardDescription>Chia theo loại gói: Interview và CV</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="interview">
                <TabsList className="mb-4">
                  <TabsTrigger value="interview" className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-violet-400" />
                    Interview
                    {(data?.interviewTransactions?.length ?? 0) > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {data?.interviewTransactions?.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="cv" className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-sky-400" />
                    CV
                    {(data?.cvTransactions?.length ?? 0) > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {data?.cvTransactions?.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="interview">
                  <TransactionTable
                    rows={data?.interviewTransactions ?? []}
                    emptyText="Chưa có giao dịch gói Interview."
                  />
                </TabsContent>
                <TabsContent value="cv">
                  <TransactionTable
                    rows={data?.cvTransactions ?? []}
                    emptyText="Chưa có giao dịch gói CV."
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
