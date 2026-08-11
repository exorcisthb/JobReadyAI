import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, Calendar, CheckCircle2, ChevronLeft, ChevronRight, CreditCard, Filter, PieChart, RefreshCw, Save, ShieldCheck, Tag, Users, Wrench } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader, type NavItem } from "@/components/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const adminNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <BarChart3 className="h-5 w-5" />, href: "/admin/dashboard" },
  { label: "Người dùng", icon: <Users className="h-5 w-5" />, href: "/admin/users" },
  { label: "Tài chính", icon: <CreditCard className="h-5 w-5" />, href: "/admin/finance" },
  { label: "Bảo mật", icon: <ShieldCheck className="h-5 w-5" />, href: "/admin/security" },
  { label: "User Activity", icon: <Activity className="h-5 w-5" />, href: "/admin/user-activity" },
  { label: "Bảo trì", icon: <Wrench className="h-5 w-5" />, href: "/admin/maintenance" },
];

type MonthTransaction = {
  id: string;
  item_id?: string;
  item: string;
  amount: number;
  status: string;
  created_at: string;
  date?: string;
  email?: string;
};

type DailyRevenueItem = {
  date: string;
  pro_revenue?: number;
  ultra_revenue?: number;
  revenue?: number;
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
    free_users: number;
    expiring_soon: number;
  };
  dailyRevenue: DailyRevenueItem[];
  monthTransactions: MonthTransaction[];
  transactions: MonthTransaction[];
  interviewTransactions: { id: string; item: string; amount: number; status: string; created_at: string; email?: string }[];
  cvTransactions: { id: string; item: string; amount: number; status: string; created_at: string; email?: string }[];
  expiringUsers: { id: string; email: string; subscription_plan: string; subscription_expires_at: string }[];
  activeUsers: { id: string; email: string; sub_plan_interview: string; sub_plan_cv: string; sub_expires_interview: string; sub_expires_cv: string }[];
};

type PlanPriceMap = {
  [key: string]: { name?: string; weeklyPrice: number; monthlyPrice: number };
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

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (active && payload && payload.length && label) {
    const dataPoint = payload[0].payload;
    const proVal = dataPoint.pro_revenue ?? 0;
    const ultraVal = dataPoint.ultra_revenue ?? 0;
    const totalVal = dataPoint.revenue ?? (proVal + ultraVal);
    const dateObj = new Date(label);
    const dateFormatted = `Ngày ${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;

    return (
      <div className="min-w-[200px] space-y-2 rounded-xl border border-border/80 bg-card/95 p-3.5 text-xs text-foreground shadow-xl backdrop-blur-md">
        <p className="border-b border-border/50 pb-1 font-bold text-muted-foreground">
          {dateFormatted}
        </p>
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 font-medium text-emerald-500">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Gói Pro:
          </span>
          <span className="font-bold">{currency.format(proVal)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 font-medium text-purple-500">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
            Gói Ultra:
          </span>
          <span className="font-bold">{currency.format(ultraVal)}</span>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border/50 pt-1.5 text-xs font-black">
          <span>Tổng ngày:</span>
          <span className="text-primary">{currency.format(totalVal)}</span>
        </div>
      </div>
    );
  }
  return null;
}

export default function FinanceDashboardPage() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentMonthStr = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);
  const [selectedDay, setSelectedDay] = useState<string>("");

  const headers = useMemo(() => ({ "x-user-role": user?.role ?? "", "x-user-id": user?.id ?? "" }), [user?.id, user?.role]);

  const [planPrices, setPlanPrices] = useState<PlanPriceMap>({
    pro_interview: { name: "Gói Pro Phỏng vấn AI", weeklyPrice: 15000, monthlyPrice: 50000 },
    ultra_interview: { name: "Gói Ultra Phỏng vấn AI", weeklyPrice: 30000, monthlyPrice: 100000 },
    pro_cv: { name: "Gói Pro Tạo CV AI", weeklyPrice: 10000, monthlyPrice: 30000 },
    ultra_cv: { name: "Gói Ultra Tạo CV AI", weeklyPrice: 20000, monthlyPrice: 60000 },
  });
  const [savingPrices, setSavingPrices] = useState(false);
  const [priceSuccessMsg, setPriceSuccessMsg] = useState<string | null>(null);

  const loadPlanPrices = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/plan-prices", { headers });
      if (res.ok) {
        const resJson = await res.json();
        if (resJson.prices) {
          setPlanPrices(resJson.prices);
        }
      }
    } catch (e) {
      console.error("Lỗi tải bảng giá:", e);
    }
  }, [headers]);

  useEffect(() => {
    void loadPlanPrices();
  }, [loadPlanPrices]);

  const handleSavePrices = async () => {
    setSavingPrices(true);
    setPriceSuccessMsg(null);
    try {
      const res = await fetch("/api/admin/plan-prices", {
        method: "PUT",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prices: planPrices }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Cập nhật giá thất bại.");
      setPriceSuccessMsg("Đã cập nhật bảng giá nâng cấp thành công! Người dùng vào trang Nâng cấp (/upgrade) sẽ thấy giá mới lập tức.");
      setTimeout(() => setPriceSuccessMsg(null), 5000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
    } finally {
      setSavingPrices(false);
    }
  };

  const loadData = useCallback(async (monthParam?: string) => {
    setLoading(true);
    setError(null);
    const targetMonth = monthParam ?? selectedMonth;
    try {
      const response = await fetch(`/api/admin/finance?month=${targetMonth}`, { headers });
      if (!response.ok) throw new Error("Không thể tải dashboard tài chính.");
      const resJson = (await response.json()) as FinanceData;
      setData(resJson);
      
      // Mặc định chọn ngày cuối hoặc ngày có revenue trong danh sách dailyRevenue
      if (resJson.dailyRevenue && resJson.dailyRevenue.length > 0) {
        const revDays = resJson.dailyRevenue.filter((r) => (r.revenue ?? ((r.pro_revenue ?? 0) + (r.ultra_revenue ?? 0))) > 0);
        if (revDays.length > 0) {
          setSelectedDay(revDays[revDays.length - 1].date);
        } else {
          setSelectedDay(resJson.dailyRevenue[0].date);
        }
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Đã có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  }, [headers, selectedMonth]);

  useEffect(() => {
    void loadData(selectedMonth);
  }, [loadData, selectedMonth]);

  const handlePrevMonth = () => {
    const [yearStr, monthStr] = selectedMonth.split("-");
    let year = parseInt(yearStr, 10);
    let month = parseInt(monthStr, 10) - 1;
    if (month < 1) {
      month = 12;
      year -= 1;
    }
    setSelectedMonth(`${year}-${String(month).padStart(2, "0")}`);
  };

  const handleNextMonth = () => {
    const [yearStr, monthStr] = selectedMonth.split("-");
    let year = parseInt(yearStr, 10);
    let month = parseInt(monthStr, 10) + 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
    const nextMonthStr = `${year}-${String(month).padStart(2, "0")}`;
    if (nextMonthStr <= currentMonthStr) {
      setSelectedMonth(nextMonthStr);
    }
  };

  const isCurrentMonth = selectedMonth >= currentMonthStr;

  const [sYear, sMonth] = selectedMonth.split("-");
  const selectedMonthLabel = `${sMonth}/${sYear}`;
  const yearNum = parseInt(sYear, 10);
  const monthNum = parseInt(sMonth, 10);

  // Số ngày trong tháng được chọn (28, 29, 30, 31 ngày)
  const daysInSelectedMonth = useMemo(() => new Date(yearNum, monthNum, 0).getDate(), [yearNum, monthNum]);
  const isEvenDaysMonth = daysInSelectedMonth % 2 === 0;

  // Lọc hiển thị nhãn trục X: Tháng 30/28 ngày -> hiển thị ngày chẵn; Tháng 31/29 ngày -> hiển thị ngày lẻ
  const visibleTicks = useMemo(() => {
    return (data?.dailyRevenue ?? [])
      .map((item) => item.date)
      .filter((dateStr) => {
        const day = new Date(dateStr).getDate();
        return isEvenDaysMonth ? day % 2 === 0 : day % 2 !== 0;
      });
  }, [data?.dailyRevenue, isEvenDaysMonth]);

  // Tổng doanh thu của tháng được chọn
  const totalSelectedMonthRevenue = useMemo(() => {
    return (data?.dailyRevenue ?? []).reduce((sum, item) => {
      const itemTotal = item.revenue ?? ((item.pro_revenue ?? 0) + (item.ultra_revenue ?? 0));
      return sum + itemTotal;
    }, 0);
  }, [data?.dailyRevenue]);

  // Thống kê chi tiết tháng theo gói
  const monthTransactions = useMemo(() => data?.monthTransactions ?? [], [data?.monthTransactions]);
  const monthProTx = useMemo(() => monthTransactions.filter((t) => t.item_id?.includes("pro") || t.item?.toLowerCase().includes("pro")), [monthTransactions]);
  const monthUltraTx = useMemo(() => monthTransactions.filter((t) => t.item_id?.includes("ultra") || t.item?.toLowerCase().includes("ultra")), [monthTransactions]);
  
  const monthProRevenueTotal = useMemo(() => monthProTx.reduce((sum, t) => sum + t.amount, 0), [monthProTx]);
  const monthUltraRevenueTotal = useMemo(() => monthUltraTx.reduce((sum, t) => sum + t.amount, 0), [monthUltraTx]);

  const monthProInterviewCount = useMemo(() => monthProTx.filter((t) => t.item_id === "pro_interview" || t.item?.includes("Phỏng vấn")).length, [monthProTx]);
  const monthProCvCount = useMemo(() => monthProTx.filter((t) => t.item_id === "pro_cv" || t.item?.includes("CV")).length, [monthProTx]);

  const monthUltraInterviewCount = useMemo(() => monthUltraTx.filter((t) => t.item_id === "ultra_interview" || t.item?.includes("Phỏng vấn")).length, [monthUltraTx]);
  const monthUltraCvCount = useMemo(() => monthUltraTx.filter((t) => t.item_id === "ultra_cv" || t.item?.includes("CV")).length, [monthUltraTx]);

  // Thống kê chi tiết theo ngày được chọn
  const selectedDayTransactions = useMemo(() => {
    if (!selectedDay) return [];
    return monthTransactions.filter((t) => t.date === selectedDay);
  }, [monthTransactions, selectedDay]);

  const selectedDayInfo = useMemo(() => {
    return (data?.dailyRevenue ?? []).find((r) => r.date === selectedDay);
  }, [data?.dailyRevenue, selectedDay]);

  const selectedDayProRevenue = selectedDayInfo?.pro_revenue ?? selectedDayTransactions.filter((t) => t.item_id?.includes("pro") || t.item?.toLowerCase().includes("pro")).reduce((sum, t) => sum + t.amount, 0);
  const selectedDayUltraRevenue = selectedDayInfo?.ultra_revenue ?? selectedDayTransactions.filter((t) => t.item_id?.includes("ultra") || t.item?.toLowerCase().includes("ultra")).reduce((sum, t) => sum + t.amount, 0);
  const selectedDayTotalRevenue = selectedDayInfo?.revenue ?? (selectedDayProRevenue + selectedDayUltraRevenue);

  const selectedDayFormatted = useMemo(() => {
    if (!selectedDay) return "";
    const d = new Date(selectedDay);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }, [selectedDay]);

  // Danh sách các tháng có thể chọn (12 tháng gần nhất đến tháng hiện tại)
  const monthOptions = useMemo(() => {
    const options: { val: string; label: string }[] = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = `Tháng ${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
      options.push({ val, label });
    }
    return options;
  }, []);

  const chartData = useMemo(() => {
    return (data?.dailyRevenue ?? []).map((item) => ({
      ...item,
      pro_revenue: item.pro_revenue ?? 0,
      ultra_revenue: item.ultra_revenue ?? 0,
      revenue: item.revenue ?? ((item.pro_revenue ?? 0) + (item.ultra_revenue ?? 0)),
    }));
  }, [data?.dailyRevenue]);

  // Phân trang Danh sách giao dịch (10 giao dịch / trang)
  const [txPage, setTxPage] = useState(1);
  const transactionsList = useMemo(() => data?.transactions ?? [], [data?.transactions]);
  const txTotalPages = useMemo(() => Math.ceil(transactionsList.length / 10) || 1, [transactionsList]);
  const paginatedTransactions = useMemo(() => {
    const start = (txPage - 1) * 10;
    return transactionsList.slice(start, start + 10);
  }, [transactionsList, txPage]);

  // Phân trang User sắp hết hạn (10 user / trang)
  const [expPage, setExpPage] = useState(1);
  const expiringUsersList = useMemo(() => data?.expiringUsers ?? [], [data?.expiringUsers]);
  const expTotalPages = useMemo(() => Math.ceil(expiringUsersList.length / 10) || 1, [expiringUsersList]);
  const paginatedExpiringUsers = useMemo(() => {
    const start = (expPage - 1) * 10;
    return expiringUsersList.slice(start, start + 10);
  }, [expiringUsersList, expPage]);

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
            <Button onClick={() => void loadData(selectedMonth)} disabled={loading} variant="outline"><RefreshCw className="mr-2 h-4 w-4" /> Làm mới</Button>
          </div>

          {error && <Card className="border-destructive/30 bg-destructive/5"><CardContent className="p-4 text-sm text-destructive">{error}</CardContent></Card>}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard title="Doanh thu hôm nay" value={currency.format(data?.summary.today_revenue ?? 0)} note="Từ giao dịch add-on thành công" />
            <MetricCard title="Doanh thu tháng này" value={currency.format(data?.summary.month_revenue ?? 0)} note={`Tuần này: ${currency.format(data?.summary.week_revenue ?? 0)}`} />
            <MetricCard title="MRR ước tính" value={currency.format(data?.summary.mrr ?? 0)} note="Tính từ user Pro/Ultra active" />
            <MetricCard title="Conversion" value={`${data?.summary.conversion_rate ?? 0}%`} note={`Pro: ${data?.summary.pro_users ?? 0} • Ultra: ${data?.summary.ultra_users ?? 0}`} />
          </div>

          {/* QUẢN LÝ BẢNG GIÁ GÓI NÂNG CẤP */}
          <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Tag className="h-5 w-5 text-emerald-500" />
                  Quản lý Bảng giá Gói Nâng cấp (Pro & Ultra)
                </CardTitle>
                <CardDescription>
                  Thay đổi giá tiền các gói Phỏng vấn AI và Tạo CV AI. Giá mới sẽ hiển thị lập tức trên trang Nâng cấp (/upgrade) của người dùng.
                </CardDescription>
              </div>
              <Button onClick={handleSavePrices} disabled={savingPrices} className="font-semibold shadow-sm">
                <Save className="mr-2 h-4 w-4" />
                {savingPrices ? "Đang lưu..." : "Lưu thay đổi giá"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {priceSuccessMsg && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  {priceSuccessMsg}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {/* Gói Pro Phỏng vấn */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      Gói Pro Phỏng vấn AI
                    </h4>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 font-mono">pro_interview</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <Label className="text-muted-foreground block mb-1 font-medium">Giá theo tuần (VNĐ):</Label>
                      <Input
                        type="number"
                        step="1000"
                        value={planPrices.pro_interview?.weeklyPrice ?? 15000}
                        onChange={(e) => setPlanPrices((prev) => ({
                          ...prev,
                          pro_interview: { ...prev.pro_interview, weeklyPrice: Number(e.target.value) }
                        }))}
                        className="font-bold"
                      />
                    </div>
                    <div>
                      <Label className="text-muted-foreground block mb-1 font-medium">Giá theo tháng (VNĐ):</Label>
                      <Input
                        type="number"
                        step="1000"
                        value={planPrices.pro_interview?.monthlyPrice ?? 50000}
                        onChange={(e) => setPlanPrices((prev) => ({
                          ...prev,
                          pro_interview: { ...prev.pro_interview, monthlyPrice: Number(e.target.value) }
                        }))}
                        className="font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Gói Ultra Phỏng vấn */}
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-purple-700 dark:text-purple-400 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                      Gói Ultra Phỏng vấn AI
                    </h4>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-600 font-mono">ultra_interview</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <Label className="text-muted-foreground block mb-1 font-medium">Giá theo tuần (VNĐ):</Label>
                      <Input
                        type="number"
                        step="1000"
                        value={planPrices.ultra_interview?.weeklyPrice ?? 30000}
                        onChange={(e) => setPlanPrices((prev) => ({
                          ...prev,
                          ultra_interview: { ...prev.ultra_interview, weeklyPrice: Number(e.target.value) }
                        }))}
                        className="font-bold"
                      />
                    </div>
                    <div>
                      <Label className="text-muted-foreground block mb-1 font-medium">Giá theo tháng (VNĐ):</Label>
                      <Input
                        type="number"
                        step="1000"
                        value={planPrices.ultra_interview?.monthlyPrice ?? 100000}
                        onChange={(e) => setPlanPrices((prev) => ({
                          ...prev,
                          ultra_interview: { ...prev.ultra_interview, monthlyPrice: Number(e.target.value) }
                        }))}
                        className="font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Gói Pro CV */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      Gói Pro Tạo CV AI
                    </h4>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 font-mono">pro_cv</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <Label className="text-muted-foreground block mb-1 font-medium">Giá theo tuần (VNĐ):</Label>
                      <Input
                        type="number"
                        step="1000"
                        value={planPrices.pro_cv?.weeklyPrice ?? 10000}
                        onChange={(e) => setPlanPrices((prev) => ({
                          ...prev,
                          pro_cv: { ...prev.pro_cv, weeklyPrice: Number(e.target.value) }
                        }))}
                        className="font-bold"
                      />
                    </div>
                    <div>
                      <Label className="text-muted-foreground block mb-1 font-medium">Giá theo tháng (VNĐ):</Label>
                      <Input
                        type="number"
                        step="1000"
                        value={planPrices.pro_cv?.monthlyPrice ?? 30000}
                        onChange={(e) => setPlanPrices((prev) => ({
                          ...prev,
                          pro_cv: { ...prev.pro_cv, monthlyPrice: Number(e.target.value) }
                        }))}
                        className="font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Gói Ultra CV */}
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-purple-700 dark:text-purple-400 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                      Gói Ultra Tạo CV AI
                    </h4>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-600 font-mono">ultra_cv</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <Label className="text-muted-foreground block mb-1 font-medium">Giá theo tuần (VNĐ):</Label>
                      <Input
                        type="number"
                        step="1000"
                        value={planPrices.ultra_cv?.weeklyPrice ?? 20000}
                        onChange={(e) => setPlanPrices((prev) => ({
                          ...prev,
                          ultra_cv: { ...prev.ultra_cv, weeklyPrice: Number(e.target.value) }
                        }))}
                        className="font-bold"
                      />
                    </div>
                    <div>
                      <Label className="text-muted-foreground block mb-1 font-medium">Giá theo tháng (VNĐ):</Label>
                      <Input
                        type="number"
                        step="1000"
                        value={planPrices.ultra_cv?.monthlyPrice ?? 60000}
                        onChange={(e) => setPlanPrices((prev) => ({
                          ...prev,
                          ultra_cv: { ...prev.ultra_cv, monthlyPrice: Number(e.target.value) }
                        }))}
                        className="font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Biểu đồ doanh thu toàn màn hình */}
          <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Doanh thu tháng</CardTitle>
                <CardDescription>Biểu đồ doanh thu giao dịch thành công</CardDescription>
              </div>
              <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-muted/40 p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handlePrevMonth}
                  title="Tháng trước"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="h-8 border-0 bg-transparent px-2 text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
                >
                  {monthOptions.map((m) => (
                    <option key={m.val} value={m.val} disabled={m.val > currentMonthStr}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleNextMonth}
                  disabled={isCurrentMonth}
                  title={isCurrentMonth ? "Không thể xem tháng tương lai" : "Tháng sau"}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-84">
              {loading ? <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Đang tải...</div> : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="proRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="ultraRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                    <XAxis
                      dataKey="date"
                      ticks={visibleTicks}
                      tickFormatter={(value: string) => `${new Date(value).getDate()}/${new Date(value).getMonth() + 1}`}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="top" height={36} formatter={(value) => <span className="text-xs font-semibold">{value}</span>} />
                    <Area type="monotone" dataKey="pro_revenue" name="Gói Pro (Xanh lá)" stroke="#10b981" strokeWidth={2.5} fill="url(#proRevenue)" />
                    <Area type="monotone" dataKey="ultra_revenue" name="Gói Ultra (Tím)" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#ultraRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* PHẦN 1: XEM DOANH THU THÁNG CỦA CÁC GÓI (PRO VS ULTRA) */}
          <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-indigo-500" />
                  Phân tích doanh thu tháng {selectedMonthLabel} theo gói
                </CardTitle>
                <CardDescription>Chi tiết số lượng và doanh thu từng gói cước khách hàng đã mua trong tháng</CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Chọn tháng:
                  </span>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="h-9 rounded-lg border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {monthOptions.map((m) => (
                      <option key={m.val} value={m.val} disabled={m.val > currentMonthStr}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 border-indigo-500/20 text-xs font-semibold px-3 py-2">
                  Tổng tháng: {currency.format(totalSelectedMonthRevenue)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Gói Pro */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-emerald-500" />
                      <h3 className="font-bold text-base text-emerald-700 dark:text-emerald-400">Gói Pro</h3>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                      {monthProTx.length} lượt mua
                    </span>
                  </div>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {currency.format(monthProRevenueTotal)}
                  </p>
                  <div className="space-y-1.5 pt-2 border-t border-emerald-500/20 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>• Pro Phỏng vấn AI:</span>
                      <span className="font-semibold text-foreground">{monthProInterviewCount} lượt ({currency.format(monthProInterviewCount * 50000)})</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Pro Tạo CV AI:</span>
                      <span className="font-semibold text-foreground">{monthProCvCount} lượt ({currency.format(monthProCvCount * 50000)})</span>
                    </div>
                  </div>
                </div>

                {/* Gói Ultra */}
                <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-purple-500" />
                      <h3 className="font-bold text-base text-purple-700 dark:text-purple-400">Gói Ultra</h3>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-700 dark:text-purple-300">
                      {monthUltraTx.length} lượt mua
                    </span>
                  </div>
                  <p className="text-2xl font-black text-purple-600 dark:text-purple-400">
                    {currency.format(monthUltraRevenueTotal)}
                  </p>
                  <div className="space-y-1.5 pt-2 border-t border-purple-500/20 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>• Ultra Phỏng vấn AI:</span>
                      <span className="font-semibold text-foreground">{monthUltraInterviewCount} lượt ({currency.format(monthUltraInterviewCount * 100000)})</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• Ultra Tạo CV AI:</span>
                      <span className="font-semibold text-foreground">{monthUltraCvCount} lượt ({currency.format(monthUltraCvCount * 100000)})</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PHẦN 2: XEM DOANH THU CỦA NGÀY CỤ THỂ */}
          <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Chi tiết doanh thu theo ngày {selectedDayFormatted}
                </CardTitle>
                <CardDescription>Chọn ngày để xem chi tiết doanh thu từng gói trong ngày</CardDescription>
              </div>
              
              {/* Bộ chọn Ngày gộp (Month & Day in 1 control) */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-primary" /> Chọn ngày:
                </span>
                <input
                  type="date"
                  value={selectedDay}
                  max={currentMonthStr + "-31"}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) return;
                    const newMonth = val.substring(0, 7);
                    if (newMonth !== selectedMonth && newMonth <= currentMonthStr) {
                      setSelectedMonth(newMonth);
                    }
                    setSelectedDay(val);
                  }}
                  className="h-9 rounded-lg border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                />
              </div>
            </CardHeader>
            <CardContent>
              {/* Thống kê nhanh theo ngày */}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border/50 bg-muted/20 p-3.5">
                  <p className="text-xs font-medium text-muted-foreground">Tổng doanh thu ngày</p>
                  <p className="text-xl font-extrabold text-primary mt-1">{currency.format(selectedDayTotalRevenue)}</p>
                </div>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5">
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Doanh thu gói Pro</p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{currency.format(selectedDayProRevenue)}</p>
                </div>
                <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5">
                  <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Doanh thu gói Ultra</p>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">{currency.format(selectedDayUltraRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User sắp hết hạn ở phía dưới */}
          <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader><CardTitle>User sắp hết hạn</CardTitle><CardDescription>{data?.summary.expiring_soon ?? 0} user hết hạn trong 7 ngày</CardDescription></CardHeader>
            <CardContent>
              {expiringUsersList.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có user sắp hết hạn.</p>
              ) : (
                <>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {paginatedExpiringUsers.map((item) => (
                      <div key={item.id} className="rounded-xl border border-border/50 p-3 bg-muted/20">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate text-sm font-semibold">{item.email ?? "Không có email"}</p>
                          <Badge variant="secondary">{item.subscription_plan}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Hết hạn: {new Date(item.subscription_expires_at).toLocaleDateString("vi-VN")}</p>
                      </div>
                    ))}
                  </div>

                  {expTotalPages > 1 && (
                    <div className="mt-4 flex items-center justify-end gap-3 pt-3 border-t border-border/40 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={expPage === 1}
                          onClick={() => setExpPage((p) => Math.max(p - 1, 1))}
                          className="h-8 px-2.5 text-xs"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </Button>
                        <span className="font-semibold px-2 text-foreground">Trang {expPage} / {expTotalPages}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={expPage >= expTotalPages}
                          onClick={() => setExpPage((p) => Math.min(p + 1, expTotalPages))}
                          className="h-8 px-2.5 text-xs"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Danh sách giao dịch có Phân trang 10 giao dịch / trang */}
          <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader><CardTitle>Danh sách giao dịch</CardTitle><CardDescription>Giao dịch thành công trong hệ thống.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm font-sans">
                  <thead className="text-xs uppercase text-muted-foreground border-b border-border/60">
                    <tr>
                      <th className="py-3 pr-4">User</th>
                      <th className="pr-4">Dịch vụ</th>
                      <th className="pr-4">Số tiền</th>
                      <th className="pr-4">Trạng thái</th>
                      <th>Thời gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {transactionsList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                          Chưa có giao dịch.
                        </td>
                      </tr>
                    ) : (
                      paginatedTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 pr-4 font-semibold text-foreground">{tx.email ?? "Ẩn danh"}</td>
                          <td className="pr-4">{tx.item}</td>
                          <td className="pr-4 font-black text-foreground">{currency.format(tx.amount)}</td>
                          <td className="pr-4">
                            <Badge variant={tx.status === "completed" ? "default" : "outline"}>{tx.status}</Badge>
                          </td>
                          <td className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleString("vi-VN")}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {txTotalPages > 1 && (
                <div className="flex items-center justify-end gap-4 pt-3 border-t border-border/40 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={txPage === 1}
                      onClick={() => setTxPage((p) => Math.max(p - 1, 1))}
                      className="h-8 px-3 text-xs"
                    >
                      <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Trước
                    </Button>
                    <div className="flex items-center gap-1 font-semibold px-2 text-foreground">
                      Trang {txPage} / {txTotalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={txPage >= txTotalPages}
                      onClick={() => setTxPage((p) => Math.min(p + 1, txTotalPages))}
                      className="h-8 px-3 text-xs"
                    >
                      Sau <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
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
