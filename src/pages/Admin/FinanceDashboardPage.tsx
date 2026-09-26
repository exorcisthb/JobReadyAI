import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, ArrowUpDown, BarChart3, Bot, Calendar, CheckCircle2, ChevronLeft, ChevronRight, Clock, CreditCard, Crown, DollarSign, FileText, Filter, Flame, Layers, Lock, MousePointerClick, PieChart, RefreshCw, RotateCcw, Save, Search, ShieldCheck, Sparkles, Tag, TrendingUp, Users, Wrench, X, Zap } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader, type NavItem } from "@/components/dashboard-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const adminNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <BarChart3 className="h-5 w-5" />, href: "/admin/dashboard" },
  { label: "Người dùng", icon: <Users className="h-5 w-5" />, href: "/admin/users" },
  { label: "Tài chính", icon: <CreditCard className="h-5 w-5" />, href: "/admin/finance" },
  { label: "Khuyến mãi", icon: <Flame className="h-5 w-5" />, href: "/admin/promotions" },
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
  billing_cycle?: string;
};

function isWeeklyTransaction(t: MonthTransaction) {
  if (t.billing_cycle === "weekly") return true;
  if (t.billing_cycle === "monthly") return false;
  if (t.item?.toLowerCase().includes("tuần")) return true;
  if (t.item?.toLowerCase().includes("tháng")) return false;
  if (t.item_id === "pro_interview") return t.amount < 30000;
  if (t.item_id === "ultra_interview") return t.amount < 60000;
  if (t.item_id === "pro_cv") return t.amount < 20000;
  if (t.item_id === "ultra_cv") return t.amount < 40000;
  return t.amount < 50000;
}

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
  [key: string]: { name?: string; weeklyPrice: number; monthlyPrice: number; discount?: number | null; originalPrice?: number | null };
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

function CustomTooltip({ active, payload, label, viewMode = "revenue" }: { active?: boolean; payload?: any[]; label?: string; viewMode?: "revenue" | "volume" }) {
  if (active && payload && payload.length && label) {
    const dataPoint = payload[0].payload;
    const ultraInterviewRev = dataPoint.ultra_interview_revenue ?? 0;
    const ultraInterviewCount = dataPoint.ultra_interview_count ?? 0;
    const ultraCvRev = dataPoint.ultra_cv_revenue ?? 0;
    const ultraCvCount = dataPoint.ultra_cv_count ?? 0;

    const totalVal = dataPoint.revenue ?? (ultraInterviewRev + ultraCvRev);
    const totalCount = dataPoint.total_count ?? (ultraInterviewCount + ultraCvCount);

    const dateObj = new Date(label);
    const dateFormatted = `Ngày ${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;

    return (
      <div className="min-w-[240px] space-y-2.5 rounded-xl border border-primary/30 bg-card/95 p-3.5 text-xs text-foreground shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-border/60 pb-1.5 font-bold text-muted-foreground">
          <span>{dateFormatted}</span>
          <span className="flex items-center gap-1 text-[10px] font-medium text-primary">
            <MousePointerClick className="h-3 w-3" /> Click chọn
          </span>
        </div>

        {viewMode === "revenue" ? (
          <>
            {/* ULTRA PHỎNG VẤN AI */}
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 font-bold text-orange-600 dark:text-orange-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                  Ultra Phỏng vấn AI:
                </span>
                <span className="font-bold text-foreground">{currency.format(ultraInterviewRev)}</span>
              </div>
            </div>

            {/* ULTRA TẠO CV AI */}
            <div className="space-y-1 pt-1.5 border-t border-border/40">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 font-bold text-purple-600 dark:text-purple-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                  Ultra Tạo CV AI:
                </span>
                <span className="font-bold text-foreground">{currency.format(ultraCvRev)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-2 text-xs font-black">
              <span>Tổng ngày:</span>
              <span className="text-primary font-bold">{currency.format(totalVal)}</span>
            </div>
          </>
        ) : (
          <>
            {/* VIEW MODE = VOLUME */}
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 font-bold text-orange-600 dark:text-orange-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                  Ultra Phỏng vấn AI:
                </span>
                <span className="font-bold text-foreground">{ultraInterviewCount} lượt</span>
              </div>
            </div>

            <div className="space-y-1 pt-1.5 border-t border-border/40">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 font-bold text-purple-600 dark:text-purple-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                  Ultra Tạo CV AI:
                </span>
                <span className="font-bold text-foreground">{ultraCvCount} lượt</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-2 text-xs font-black">
              <span>Tổng lượt mua:</span>
              <span className="text-primary font-bold">{totalCount} lượt</span>
            </div>
          </>
        )}
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
  const [chartViewMode, setChartViewMode] = useState<"revenue" | "volume">("revenue");
  const [revenueDisplayTab, setRevenueDisplayTab] = useState<"all" | "month" | "day">("all");
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [pricingCategory, setPricingCategory] = useState<"interview" | "cv">("interview");
  const [showExpiringModal, setShowExpiringModal] = useState(false);

  type EditPlanTarget = {
    planKey: "ultra_interview" | "ultra_cv";
    period: "weeklyPrice" | "monthlyPrice";
    name: string;
    periodLabel: string;
    badgeColor: string;
  } | null;

  const [editingPlanTarget, setEditingPlanTarget] = useState<EditPlanTarget>(null);
  const [singleOriginalPriceInput, setSingleOriginalPriceInput] = useState<number | string>(0);
  const [singleDiscountInput, setSingleDiscountInput] = useState<number | string>(0);

  const handleOpenSinglePriceEdit = (target: NonNullable<EditPlanTarget>) => {
    setEditingPlanTarget(target);
    const origPrice = planPrices[target.planKey]?.[target.period] ?? 0;
    const discount = planPrices[target.planKey]?.discount ?? 0;

    setSingleOriginalPriceInput(origPrice);
    setSingleDiscountInput(discount ?? 0);
  };

  const computedNewPrice = useMemo(() => {
    const orig = Number(singleOriginalPriceInput) || 0;
    const disc = Number(singleDiscountInput) || 0;
    if (disc <= 0) return orig;
    if (disc >= 100) return 0;
    return Math.round(orig * (1 - disc / 100));
  }, [singleOriginalPriceInput, singleDiscountInput]);

  const currentMonthStr = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);
  const [selectedDay, setSelectedDay] = useState<string>("");

  const headers = useMemo(() => ({ "x-user-role": user?.role ?? "", "x-user-id": user?.id ?? "" }), [user?.id, user?.role]);

  const [planPrices, setPlanPrices] = useState<PlanPriceMap>({
    ultra_interview: { name: "Gói Ultra Phỏng vấn AI", weeklyPrice: 30000, monthlyPrice: 100000, discount: 25, originalPrice: 100000 },
    ultra_cv: { name: "Gói Ultra Tạo CV AI", weeklyPrice: 20000, monthlyPrice: 60000, discount: 25, originalPrice: 60000 },
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

  const handleSaveSinglePrice = async () => {
    if (!editingPlanTarget) return;
    const origPrice = Number(singleOriginalPriceInput) || 0;
    const finalDiscount = Number(singleDiscountInput) || 0;
    const finalPrice = computedNewPrice;

    const updatedPlanPrices = {
      ...planPrices,
      [editingPlanTarget.planKey]: {
        ...planPrices[editingPlanTarget.planKey],
        [editingPlanTarget.period]: origPrice,
        discount: finalDiscount,
      },
    };
    setPlanPrices(updatedPlanPrices);

    setSavingPrices(true);
    try {
      const res = await fetch("/api/admin/plan-prices", {
        method: "PUT",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prices: updatedPlanPrices }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Cập nhật giá thất bại.");
      setPriceSuccessMsg(`Đã cập nhật ${editingPlanTarget.name} (${editingPlanTarget.periodLabel}): Giá gốc ${currency.format(origPrice)}, Giảm giá ${finalDiscount}% -> Giá mới ${currency.format(finalPrice)}!`);
      setEditingPlanTarget(null);
      setTimeout(() => setPriceSuccessMsg(null), 4000);
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

  // Thống kê chi tiết tháng theo gói Ultra
  const monthTransactions = useMemo(() => data?.monthTransactions ?? [], [data?.monthTransactions]);

  const monthUltraTx = useMemo(() => monthTransactions.filter((t) => t.item_id?.includes("ultra") || t.item?.toLowerCase().includes("ultra")), [monthTransactions]);
  const monthUltraRevenueTotal = useMemo(() => monthUltraTx.reduce((sum, t) => sum + t.amount, 0), [monthUltraTx]);

  const monthUltraInterviewTx = useMemo(() => monthTransactions.filter((t) => t.item_id === "ultra_interview" || t.item?.includes("Phỏng vấn")), [monthTransactions]);
  const monthUltraCvTx = useMemo(() => monthTransactions.filter((t) => t.item_id === "ultra_cv" || t.item?.includes("CV")), [monthTransactions]);

  const monthUltraInterviewCount = monthUltraInterviewTx.length;
  const monthUltraInterviewRevenue = useMemo(() => monthUltraInterviewTx.reduce((sum, t) => sum + t.amount, 0), [monthUltraInterviewTx]);

  const monthUltraCvCount = monthUltraCvTx.length;
  const monthUltraCvRevenue = useMemo(() => monthUltraCvTx.reduce((sum, t) => sum + t.amount, 0), [monthUltraCvTx]);

  // Thống kê chi tiết theo ngày được chọn
  const selectedDayTransactions = useMemo(() => {
    if (!selectedDay) return [];
    return monthTransactions.filter((t) => t.date === selectedDay);
  }, [monthTransactions, selectedDay]);

  const selectedDayUltraInterviewTx = useMemo(() => selectedDayTransactions.filter((t) => t.item_id === "ultra_interview" || t.item?.includes("Phỏng vấn")), [selectedDayTransactions]);
  const selectedDayUltraCvTx = useMemo(() => selectedDayTransactions.filter((t) => t.item_id === "ultra_cv" || t.item?.includes("CV")), [selectedDayTransactions]);
  const selectedDayUltraInterviewRevenue = useMemo(() => selectedDayUltraInterviewTx.reduce((s, t) => s + t.amount, 0), [selectedDayUltraInterviewTx]);
  const selectedDayUltraCvRevenue = useMemo(() => selectedDayUltraCvTx.reduce((s, t) => s + t.amount, 0), [selectedDayUltraCvTx]);

  const selectedDayInfo = useMemo(() => {
    return (data?.dailyRevenue ?? []).find((r) => r.date === selectedDay);
  }, [data?.dailyRevenue, selectedDay]);

  const selectedDayTotalRevenue = selectedDayInfo?.revenue ?? (selectedDayUltraInterviewRevenue + selectedDayUltraCvRevenue);

  const selectedDayFormatted = useMemo(() => {
    if (!selectedDay) return "";
    const d = new Date(selectedDay);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  }, [selectedDay]);

  const monthInterviewSharePercent = useMemo(() => {
    if (totalSelectedMonthRevenue === 0) return 0;
    return Math.round((monthUltraInterviewRevenue / totalSelectedMonthRevenue) * 100);
  }, [monthUltraInterviewRevenue, totalSelectedMonthRevenue]);

  const monthCvSharePercent = useMemo(() => {
    if (totalSelectedMonthRevenue === 0) return 0;
    return 100 - monthInterviewSharePercent;
  }, [monthInterviewSharePercent, totalSelectedMonthRevenue]);

  const monthInterviewVolumePercent = useMemo(() => {
    if (monthTransactions.length === 0) return 0;
    return Math.round((monthUltraInterviewCount / monthTransactions.length) * 100);
  }, [monthUltraInterviewCount, monthTransactions.length]);

  const monthCvVolumePercent = useMemo(() => {
    if (monthTransactions.length === 0) return 0;
    return 100 - monthInterviewVolumePercent;
  }, [monthInterviewVolumePercent, monthTransactions.length]);

  const highestRevenueDayDate = useMemo(() => {
    if (!data?.dailyRevenue || data.dailyRevenue.length === 0) return null;
    const sorted = [...data.dailyRevenue].sort((a, b) => {
      const revA = a.revenue ?? 0;
      const revB = b.revenue ?? 0;
      return revB - revA;
    });
    return sorted[0]?.revenue && sorted[0].revenue > 0 ? sorted[0].date : null;
  }, [data?.dailyRevenue]);

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
    return (data?.dailyRevenue ?? []).map((item) => {
      const dayTx = (data?.monthTransactions ?? []).filter((t) => t.date === item.date);

      const ultraInterviewTx = dayTx.filter((t) => t.item_id === "ultra_interview" || t.item?.includes("Phỏng vấn"));
      const ultraCvTx = dayTx.filter((t) => t.item_id === "ultra_cv" || t.item?.includes("CV"));
      const ultraInterviewRev = ultraInterviewTx.reduce((s, t) => s + t.amount, 0);
      const ultraCvRev = ultraCvTx.reduce((s, t) => s + t.amount, 0);

      const ultraRev = item.ultra_revenue ?? (ultraInterviewRev + ultraCvRev);

      return {
        ...item,
        ultra_revenue: ultraRev,
        revenue: item.revenue ?? (ultraInterviewRev + ultraCvRev),

        total_count: ultraInterviewTx.length + ultraCvTx.length,

        ultra_interview_count: ultraInterviewTx.length,
        ultra_interview_revenue: ultraInterviewRev,
        ultra_cv_count: ultraCvTx.length,
        ultra_cv_revenue: ultraCvRev,
      };
    });
  }, [data?.dailyRevenue, data?.monthTransactions]);

  // Tìm kiếm và Lọc Danh sách giao dịch
  const [showTxFilters, setShowTxFilters] = useState(false);
  const [txSearchQuery, setTxSearchQuery] = useState("");
  const [txServiceFilter, setTxServiceFilter] = useState<"all" | "interview" | "cv">("all");
  const [txTierFilter, setTxTierFilter] = useState<"all" | "pro" | "ultra">("all");
  const [txCycleFilter, setTxCycleFilter] = useState<"all" | "weekly" | "monthly">("all");
  const [txDateFilter, setTxDateFilter] = useState<string>("");

  // Các trạng thái chờ xác nhận bộ lọc (Draft Filters)
  const [pendingTxServiceFilter, setPendingTxServiceFilter] = useState<"all" | "interview" | "cv">("all");
  const [pendingTxTierFilter, setPendingTxTierFilter] = useState<"all" | "pro" | "ultra">("all");
  const [pendingTxCycleFilter, setPendingTxCycleFilter] = useState<"all" | "weekly" | "monthly">("all");
  const [pendingTxDateFilter, setPendingTxDateFilter] = useState<string>("");

  const [txAmountFilter, setTxAmountFilter] = useState<"all" | "under100" | "100to500" | "over500">("all");
  const [txSortOrder, setTxSortOrder] = useState<"newest" | "amount_desc" | "amount_asc">("newest");
  const [txPage, setTxPage] = useState(1);

  const handleApplyTxFilters = () => {
    setTxServiceFilter(pendingTxServiceFilter);
    setTxTierFilter(pendingTxTierFilter);
    setTxCycleFilter(pendingTxCycleFilter);
    setTxDateFilter(pendingTxDateFilter);
    setTxPage(1);
  };

  const rawTransactionsList = useMemo(() => data?.transactions ?? [], [data?.transactions]);

  const filteredTransactions = useMemo(() => {
    let list = [...rawTransactionsList];

    // Lọc theo từ khóa tìm kiếm (Email, tên gói, ID)
    if (txSearchQuery.trim()) {
      const q = txSearchQuery.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.email?.toLowerCase().includes(q) ||
          t.item?.toLowerCase().includes(q) ||
          t.item_id?.toLowerCase().includes(q) ||
          String(t.amount).includes(q)
      );
    }

    // 1. Lọc theo Loại dịch vụ (Phỏng vấn AI / Tạo CV AI)
    if (txServiceFilter === "interview") {
      list = list.filter(
        (t) =>
          t.item_id?.includes("interview") ||
          t.item?.toLowerCase().includes("phỏng vấn") ||
          t.item?.toLowerCase().includes("interview")
      );
    } else if (txServiceFilter === "cv") {
      list = list.filter(
        (t) =>
          t.item_id?.includes("cv") ||
          t.item?.toLowerCase().includes("cv")
      );
    }

    // 2. Lọc theo Hạng gói (Pro / Ultra)
    if (txTierFilter === "pro") {
      list = list.filter(
        (t) =>
          t.item_id?.includes("pro") ||
          t.item?.toLowerCase().includes("pro")
      );
    } else if (txTierFilter === "ultra") {
      list = list.filter(
        (t) =>
          t.item_id?.includes("ultra") ||
          t.item?.toLowerCase().includes("ultra")
      );
    }

    // 3. Lọc theo Chu kỳ cước (Gói Tuần / Gói Tháng)
    if (txCycleFilter === "weekly") {
      list = list.filter((t) => isWeeklyTransaction(t));
    } else if (txCycleFilter === "monthly") {
      list = list.filter((t) => !isWeeklyTransaction(t));
    }

    // 4. Lọc theo Tháng / Năm phát sinh giao dịch
    if (txDateFilter) {
      list = list.filter((t) => {
        if (t.date && t.date.startsWith(txDateFilter)) return true;
        if (t.created_at) {
          if (t.created_at.startsWith(txDateFilter)) return true;
          const d = new Date(t.created_at);
          if (!isNaN(d.getTime())) {
            const yyyymm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            return yyyymm === txDateFilter;
          }
        }
        return false;
      });
    }

    // Lọc theo khoảng doanh thu / số tiền
    if (txAmountFilter === "under100") {
      list = list.filter((t) => t.amount < 100000);
    } else if (txAmountFilter === "100to500") {
      list = list.filter((t) => t.amount >= 100000 && t.amount <= 500000);
    } else if (txAmountFilter === "over500") {
      list = list.filter((t) => t.amount > 500000);
    }

    // Sắp xếp
    if (txSortOrder === "amount_desc") {
      list.sort((a, b) => b.amount - a.amount);
    } else if (txSortOrder === "amount_asc") {
      list.sort((a, b) => a.amount - b.amount);
    } else if (txSortOrder === "newest") {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return list;
  }, [rawTransactionsList, txSearchQuery, txServiceFilter, txTierFilter, txCycleFilter, txDateFilter, txAmountFilter, txSortOrder]);

  const filteredTxTotalRevenue = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const isTxFiltered =
    txSearchQuery !== "" ||
    txServiceFilter !== "all" ||
    txTierFilter !== "all" ||
    txCycleFilter !== "all" ||
    txDateFilter !== "" ||
    txAmountFilter !== "all" ||
    txSortOrder !== "newest";

  const handleResetTxFilters = () => {
    setTxSearchQuery("");
    setPendingTxServiceFilter("all");
    setPendingTxTierFilter("all");
    setPendingTxCycleFilter("all");
    setPendingTxDateFilter("");
    setTxServiceFilter("all");
    setTxTierFilter("all");
    setTxCycleFilter("all");
    setTxDateFilter("");
    setTxAmountFilter("all");
    setTxSortOrder("newest");
    setTxPage(1);
  };

  // Phân trang Danh sách giao dịch (5 giao dịch / trang)
  const txTotalPages = useMemo(() => Math.ceil(filteredTransactions.length / 5) || 1, [filteredTransactions]);
  const paginatedTransactions = useMemo(() => {
    const start = (txPage - 1) * 5;
    return filteredTransactions.slice(start, start + 5);
  }, [filteredTransactions, txPage]);

  // Phân trang User sắp hết hạn (5 user / trang)
  const [expPage, setExpPage] = useState(1);
  const expiringUsersList = useMemo(() => data?.expiringUsers ?? [], [data?.expiringUsers]);
  const expTotalPages = useMemo(() => Math.ceil(expiringUsersList.length / 5) || 1, [expiringUsersList]);
  const paginatedExpiringUsers = useMemo(() => {
    const start = (expPage - 1) * 5;
    return expiringUsersList.slice(start, start + 5);
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
              <p className="mt-1 text-sm text-muted-foreground">Theo dõi doanh thu, MRR, giao dịch và quản lý bảng giá, user sắp hết hạn.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                onClick={() => window.location.assign("/admin/promotions")}
                variant="outline"
                className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 font-semibold shadow-sm transition-all"
              >
                <Flame className="mr-2 h-4 w-4 text-amber-500" />
                Khuyến mãi Ngày (Flash Sales)
              </Button>
              <Button
                onClick={() => setShowPricingModal(true)}
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 font-semibold shadow-sm transition-all"
              >
                <Tag className="mr-2 h-4 w-4 text-emerald-500" />
                Bảng giá gói
              </Button>
              <Button
                onClick={() => setShowExpiringModal(true)}
                variant="outline"
                className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 font-semibold shadow-sm transition-all"
              >
                <Clock className="mr-2 h-4 w-4 text-amber-500" />
                User sắp hết hạn ({data?.summary.expiring_soon ?? 0})
              </Button>
              <Button onClick={() => void loadData(selectedMonth)} disabled={loading} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" /> Làm mới
              </Button>
            </div>
          </div>

          {error && <Card className="border-destructive/30 bg-destructive/5"><CardContent className="p-4 text-sm text-destructive">{error}</CardContent></Card>}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard title="Doanh thu hôm nay" value={currency.format(data?.summary.today_revenue ?? 0)} note="Từ giao dịch add-on thành công" />
            <MetricCard
              title={isCurrentMonth ? "Doanh thu tháng này" : `Doanh thu tháng ${selectedMonthLabel}`}
              value={currency.format(totalSelectedMonthRevenue)}
              note={isCurrentMonth ? `Tuần này: ${currency.format(data?.summary.week_revenue ?? 0)}` : `Theo tháng ${selectedMonthLabel}`}
            />
            <MetricCard title="MRR ước tính" value={currency.format(data?.summary.mrr ?? 0)} note="Tính từ user Pro/Ultra active" />
            <MetricCard title="Conversion" value={`${data?.summary.conversion_rate ?? 0}%`} note={`Ultra: ${data?.summary.ultra_users ?? 0} • Free: ${data?.summary.free_users ?? 0}`} />
          </div>

          {/* GỘP BÁO CÁO DOANH THU THÀNH 1 THÀNH PHẦN DUY NHẤT VỚI BỘ CHỌN THÁNG / NGÀY / TẤT CẢ */}
          <Card className="border border-border/40 bg-card/80 backdrop-blur-md shadow-xl overflow-hidden transition-all duration-300">
            <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/40 pb-4 bg-muted/20">
              <div>
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  {revenueDisplayTab === "all"
                    ? `Biểu đồ doanh thu tháng ${selectedMonthLabel}`
                    : revenueDisplayTab === "month"
                    ? `Chi tiết doanh thu tháng ${selectedMonthLabel}`
                    : `Chi tiết doanh thu ngày ${selectedDayFormatted}`}
                </CardTitle>
                <CardDescription className="text-xs">
                  {revenueDisplayTab === "all"
                    ? "Biểu đồ theo dõi doanh thu & giao dịch thành công trong tháng"
                    : revenueDisplayTab === "month"
                    ? "Biểu đồ và phân tích chi tiết doanh thu các gói cước trong tháng"
                    : "Thống kê chỉ số và danh sách chi tiết các giao dịch phát sinh trong ngày"}
                </CardDescription>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* NÚT CHỌN TẤT CẢ / THEO THÁNG / THEO NGÀY */}
                <div className="flex items-center rounded-lg border border-primary/30 bg-background/90 p-1 shadow-sm text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setRevenueDisplayTab("all")}
                    className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                      revenueDisplayTab === "all"
                        ? "bg-primary text-primary-foreground shadow-md font-extrabold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    📊 Tất cả
                  </button>
                  <button
                    type="button"
                    onClick={() => setRevenueDisplayTab("month")}
                    className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                      revenueDisplayTab === "month"
                        ? "bg-primary text-primary-foreground shadow-md font-extrabold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    📅 Doanh thu Tháng
                  </button>
                  <button
                    type="button"
                    onClick={() => setRevenueDisplayTab("day")}
                    className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                      revenueDisplayTab === "day"
                        ? "bg-primary text-primary-foreground shadow-md font-extrabold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    📆 Doanh thu Ngày
                  </button>
                </div>

                {/* Bộ chọn tháng: Hiển thị ở chế độ Tất cả hoặc Doanh thu Tháng */}
                {(revenueDisplayTab === "all" || revenueDisplayTab === "month") && (
                  <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-background/80 p-1 shadow-sm">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 hover:bg-accent"
                      onClick={handlePrevMonth}
                      title="Tháng trước"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="h-7 border-0 bg-transparent px-2 text-xs font-bold text-foreground focus:outline-none cursor-pointer"
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
                      className="h-7 w-7 hover:bg-accent"
                      onClick={handleNextMonth}
                      disabled={isCurrentMonth}
                      title={isCurrentMonth ? "Không thể xem tháng tương lai" : "Tháng sau"}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Bộ chọn ngày: Chỉ hiển thị ở chế độ Doanh thu Ngày */}
                {revenueDisplayTab === "day" && (
                  <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/80 px-2.5 py-1 shadow-sm">
                    <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                    <input
                      type="date"
                      key={selectedDay}
                      defaultValue={selectedDay}
                      max={currentMonthStr + "-31"}
                      onBlur={(e) => {
                        const val = e.target.value;
                        if (val && val !== selectedDay) {
                          setSelectedDay(val);
                          const newMonth = val.substring(0, 7);
                          if (newMonth !== selectedMonth && newMonth <= currentMonthStr) {
                            setSelectedMonth(newMonth);
                          }
                        }
                      }}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val && val.length === 10) {
                          setSelectedDay(val);
                          const newMonth = val.substring(0, 7);
                          if (newMonth !== selectedMonth && newMonth <= currentMonthStr) {
                            setSelectedMonth(newMonth);
                          }
                        }
                      }}
                      className="h-6 border-0 bg-transparent text-xs font-bold text-foreground focus:outline-none cursor-pointer"
                    />
                  </div>
                )}
                {revenueDisplayTab === "day" && (
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1.5 shadow-sm">
                    Tổng ngày {selectedDayFormatted}: {currency.format(selectedDayTotalRevenue)}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-8">
              {revenueDisplayTab === "all" && (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" />
                      Biểu đồ {chartViewMode === "revenue" ? "doanh thu" : "lượt mua"} tháng {selectedMonthLabel}
                    </h3>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center rounded-lg border border-border/60 bg-muted/30 p-0.5 shadow-sm text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setChartViewMode("revenue")}
                          className={`px-2.5 py-0.5 rounded-md transition-all ${
                            chartViewMode === "revenue"
                              ? "bg-primary text-primary-foreground shadow-sm font-bold"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          VNĐ
                        </button>
                        <button
                          type="button"
                          onClick={() => setChartViewMode("volume")}
                          className={`px-2.5 py-0.5 rounded-md transition-all ${
                            chartViewMode === "volume"
                              ? "bg-primary text-primary-foreground shadow-sm font-bold"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          Lượt mua
                        </button>
                      </div>
                      <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30 text-xs font-extrabold px-3 py-1 shadow-sm">
                        Tổng tiền: {currency.format(totalSelectedMonthRevenue)}
                      </Badge>
                    </div>
                  </div>

                  <div className="h-80 w-full pt-2">
                    {loading ? (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Đang tải biểu đồ...</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={chartData}
                          onClick={(nextState) => {
                            if (nextState?.activePayload?.[0]?.payload?.date) {
                              setSelectedDay(nextState.activePayload[0].payload.date);
                              setRevenueDisplayTab("day");
                            }
                          }}
                        >
                          <defs>
                            <linearGradient id="ultraInterviewRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                              <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                            </linearGradient>
                            <linearGradient id="ultraCvRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                          <XAxis
                            dataKey="date"
                            ticks={visibleTicks}
                            tickFormatter={(value: string) => `${new Date(value).getDate()}/${new Date(value).getMonth() + 1}`}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 11, fontWeight: 500 }}
                          />
                          <YAxis
                            tickFormatter={(value: number) =>
                              chartViewMode === "revenue" ? `${Math.round(value / 1000)}k` : `${value}`
                            }
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 11, fontWeight: 500 }}
                          />
                          <Tooltip content={<CustomTooltip viewMode={chartViewMode} />} />
                          <Legend
                            verticalAlign="top"
                            height={36}
                            formatter={(value) => <span className="text-xs font-semibold">{value}</span>}
                          />
                          <Area
                            type="monotone"
                            dataKey={chartViewMode === "revenue" ? "ultra_interview_revenue" : "ultra_interview_count"}
                            name={
                              chartViewMode === "revenue"
                                ? `Ultra Phỏng vấn AI (${currency.format(monthUltraInterviewRevenue)})`
                                : `Ultra Phỏng vấn AI (${monthUltraInterviewCount} lượt)`
                            }
                            stroke="#f97316"
                            strokeWidth={2}
                            activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
                            fill="url(#ultraInterviewRevenue)"
                          />
                          <Area
                            type="monotone"
                            dataKey={chartViewMode === "revenue" ? "ultra_cv_revenue" : "ultra_cv_count"}
                            name={
                              chartViewMode === "revenue"
                                ? `Ultra Tạo CV AI (${currency.format(monthUltraCvRevenue)})`
                                : `Ultra Tạo CV AI (${monthUltraCvCount} lượt)`
                            }
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
                            fill="url(#ultraCvRevenue)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* THANH THỊ PHẦN (ĐỒNG BỘ THEO DOANH THU HOẶC LƯỢT MUA) */}
                  <div className="rounded-2xl border border-border/50 bg-gradient-to-r from-muted/30 via-muted/15 to-muted/30 p-4 space-y-2.5 backdrop-blur-sm shadow-2xs">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center gap-2 text-foreground/90">
                        <Layers className="h-4 w-4 text-orange-500" />
                        Tỉ trọng đóng góp {chartViewMode === "revenue" ? "doanh thu" : "lượt mua"} tháng {selectedMonthLabel}:
                      </span>
                      <div className="flex items-center gap-4 text-[11px]">
                        <span className="text-orange-600 dark:text-orange-400 font-bold flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-orange-500 shadow-xs shadow-orange-500/50" />
                          {chartViewMode === "revenue"
                            ? `Ultra Phỏng vấn AI: ${monthInterviewSharePercent}% • ${currency.format(monthUltraInterviewRevenue)}`
                            : `Ultra Phỏng vấn AI: ${monthInterviewVolumePercent}% • ${monthUltraInterviewCount} lượt`}
                        </span>
                        <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-purple-500 shadow-xs shadow-purple-500/50" />
                          {chartViewMode === "revenue"
                            ? `Ultra Tạo CV AI: ${monthCvSharePercent}% • ${currency.format(monthUltraCvRevenue)}`
                            : `Ultra Tạo CV AI: ${monthCvVolumePercent}% • ${monthUltraCvCount} lượt`}
                        </span>
                      </div>
                    </div>
                    {/* Dual Progress Bar with sleek modern gradient */}
                    <div className="h-3 w-full rounded-full bg-muted/60 overflow-hidden flex p-0.5 border border-border/40 shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-l-full transition-all duration-500 shadow-sm"
                        style={{
                          width: `${chartViewMode === "revenue" ? monthInterviewSharePercent : monthInterviewVolumePercent}%`,
                        }}
                        title={`Ultra Phỏng vấn AI: ${chartViewMode === "revenue" ? monthInterviewSharePercent : monthInterviewVolumePercent}%`}
                      />
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 rounded-r-full transition-all duration-500 shadow-sm"
                        style={{
                          width: `${chartViewMode === "revenue" ? monthCvSharePercent : monthCvVolumePercent}%`,
                        }}
                        title={`Ultra Tạo CV AI: ${chartViewMode === "revenue" ? monthCvSharePercent : monthCvVolumePercent}%`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. NỘI DUNG XEM THEO THÁNG */}
              {revenueDisplayTab === "month" && (
                <div className="space-y-6">
                  {/* PHÂN TÍCH DOANH THU THEO GÓI (THÁNG) */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-foreground">
                      <PieChart className="h-4 w-4 text-orange-500" />
                      Phân tích chi tiết các gói cước tháng {selectedMonthLabel}
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Ultra Phỏng vấn */}
                      <div className="rounded-2xl border border-orange-200/80 dark:border-orange-900/50 bg-gradient-to-br from-orange-500/[0.07] via-amber-500/[0.02] to-transparent p-5 space-y-4 shadow-sm hover:border-orange-400 dark:hover:border-orange-700 hover:shadow-md hover:shadow-orange-500/5 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="h-3 w-3 rounded-full bg-orange-500 shadow-xs shadow-orange-500/50" />
                            <h4 className="font-extrabold text-sm text-orange-700 dark:text-orange-400">Ultra Phỏng vấn AI</h4>
                          </div>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/60 shadow-2xs">
                            {monthUltraInterviewCount} lượt mua
                          </span>
                        </div>
                        <p className="text-3xl font-black text-orange-600 dark:text-orange-400 tracking-tight">
                          {currency.format(monthUltraInterviewRevenue)}
                        </p>

                        <div className="space-y-2.5 pt-3.5 border-t border-orange-500/15 text-sm">
                          <div className="flex items-center justify-between text-muted-foreground hover:bg-orange-500/5 p-1 rounded-lg transition-colors">
                            <span className="flex items-center gap-2 text-foreground/90 font-semibold text-xs sm:text-sm">
                              <span className="p-1 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400"><Crown className="h-3.5 w-3.5" /></span> Tỷ trọng doanh thu:
                            </span>
                            <span className="font-bold text-foreground text-xs sm:text-sm">{monthInterviewSharePercent}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Ultra CV */}
                      <div className="rounded-2xl border border-purple-200/80 dark:border-purple-900/50 bg-gradient-to-br from-purple-500/[0.07] via-fuchsia-500/[0.02] to-transparent p-5 space-y-4 shadow-sm hover:border-purple-400 dark:hover:border-purple-700 hover:shadow-md hover:shadow-purple-500/5 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span className="h-3 w-3 rounded-full bg-purple-500 shadow-xs shadow-purple-500/50" />
                            <h4 className="font-extrabold text-sm text-purple-700 dark:text-purple-400">Ultra Tạo CV AI</h4>
                          </div>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 shadow-2xs">
                            {monthUltraCvCount} lượt mua
                          </span>
                        </div>
                        <p className="text-3xl font-black text-purple-600 dark:text-purple-400 tracking-tight">
                          {currency.format(monthUltraCvRevenue)}
                        </p>

                        <div className="space-y-2.5 pt-3.5 border-t border-purple-500/15 text-sm">
                          <div className="flex items-center justify-between text-muted-foreground hover:bg-purple-500/5 p-1 rounded-lg transition-colors">
                            <span className="flex items-center gap-2 text-foreground/90 font-semibold text-xs sm:text-sm">
                              <span className="p-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400"><Sparkles className="h-3.5 w-3.5" /></span> Tỷ trọng doanh thu:
                            </span>
                            <span className="font-bold text-foreground text-xs sm:text-sm">{monthCvSharePercent}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. NỘI DUNG XEM THEO NGÀY */}
              {revenueDisplayTab === "day" && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      Chi tiết doanh thu ngày {selectedDayFormatted}
                    </h3>

                    {/* Phím chọn nhanh ngày */}
                    <div className="flex items-center gap-1 text-[11px]">
                      {highestRevenueDayDate && (
                        <button
                          type="button"
                          onClick={() => setSelectedDay(highestRevenueDayDate)}
                          className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-700 dark:text-amber-300 font-bold hover:from-amber-500/25 hover:to-orange-500/25 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                          title="Chọn ngày có doanh thu cao nhất trong tháng"
                        >
                          🏆 Ngày doanh thu cao nhất
                        </button>
                      )}
                    </div>
                  </div>

                  {/* THẺ CHỈ SỐ NGÀY */}
                  <div className="grid gap-3.5 sm:grid-cols-3">
                    {/* Tổng ngày */}
                    <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-gradient-to-br from-blue-500/[0.07] via-sky-500/[0.02] to-transparent p-5 space-y-3 shadow-sm hover:border-blue-400 dark:hover:border-blue-700 transition-all">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                          <span className="p-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400"><DollarSign className="h-3.5 w-3.5" /></span> Tổng doanh thu ngày
                        </p>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 shadow-2xs">
                          {selectedDayTransactions.length} giao dịch
                        </span>
                      </div>
                      <p className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">{currency.format(selectedDayTotalRevenue)}</p>
                      <div className="pt-2.5 border-t border-blue-500/15 text-xs text-muted-foreground flex items-center justify-between">
                        <span>Ngày ghi nhận:</span>
                        <span className="font-bold text-foreground">{selectedDayFormatted}</span>
                      </div>
                    </div>

                    {/* Ultra Phỏng vấn Ngày */}
                    <div className="rounded-2xl border border-orange-200/80 dark:border-orange-900/50 bg-gradient-to-br from-orange-500/[0.07] via-amber-500/[0.02] to-transparent p-5 space-y-3 shadow-sm hover:border-orange-400 dark:hover:border-orange-700 transition-all">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-orange-700 dark:text-orange-400 flex items-center gap-1.5">
                          <span className="p-1 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400"><Crown className="h-3.5 w-3.5" /></span> Ultra Phỏng vấn AI
                        </p>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/60 shadow-2xs">
                          {selectedDayUltraInterviewTx.length} lượt mua
                        </span>
                      </div>
                      <p className="text-2xl font-black text-orange-600 dark:text-orange-400 tracking-tight">{currency.format(selectedDayUltraInterviewRevenue)}</p>
                      <div className="pt-2.5 border-t border-orange-500/15 text-xs space-y-1.5 text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>Chi tiết giao dịch:</span>
                          <span className="font-bold text-foreground">{selectedDayUltraInterviewTx.length} lượt</span>
                        </div>
                      </div>
                    </div>

                    {/* Ultra CV Ngày */}
                    <div className="rounded-2xl border border-purple-200/80 dark:border-purple-900/50 bg-gradient-to-br from-purple-500/[0.07] via-fuchsia-500/[0.02] to-transparent p-5 space-y-3 shadow-sm hover:border-purple-400 dark:hover:border-purple-700 transition-all">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                          <span className="p-1 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400"><Sparkles className="h-3.5 w-3.5" /></span> Ultra Tạo CV AI
                        </p>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 shadow-2xs">
                          {selectedDayUltraCvTx.length} lượt mua
                        </span>
                      </div>
                      <p className="text-2xl font-black text-purple-600 dark:text-purple-400 tracking-tight">{currency.format(selectedDayUltraCvRevenue)}</p>
                      <div className="pt-2.5 border-t border-purple-500/15 text-xs space-y-1.5 text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>Chi tiết giao dịch:</span>
                          <span className="font-bold text-foreground">{selectedDayUltraCvTx.length} lượt</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            {/* NÚT DANH SÁCH GIAO DỊCH Ở PHÍA DƯỚI BIỂU ĐỒ */}
            <CardFooter className="flex items-center justify-between border-t border-border/40 bg-muted/20 px-6 py-3.5">
              <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                <span>Tổng giao dịch phát sinh:</span>
                <Badge variant="secondary" className="font-extrabold text-foreground px-2 py-0.5 text-xs">{filteredTransactions.length} giao dịch</Badge>
              </div>
              <Button
                type="button"
                onClick={() => {
                  setShowTxModal(true);
                }}
                variant="outline"
                className="border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 font-bold text-xs shadow-sm transition-all h-9 px-4 cursor-pointer"
              >
                <CreditCard className="mr-2 h-4 w-4 text-primary" />
                Danh sách giao dịch
              </Button>
            </CardFooter>
          </Card>

        </div>
      </main>

      {/* MODAL DANH SÁCH GIAO DỊCH */}
      {showTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Danh sách giao dịch phát sinh
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Quản lý, tìm kiếm và lọc danh sách các giao dịch phát sinh trong hệ thống.
                </p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full shrink-0" onClick={() => setShowTxModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* BỘ LỌC VÀ TÌM KIẾM THEO GÓI CƯỚC, CHU KỲ & THÁNG NĂM */}
            <div className="space-y-3 p-3.5 rounded-xl border border-border/60 bg-muted/20">
              <div className="flex items-center gap-2">
                {/* Ô tìm kiếm Email / Dịch vụ */}
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Tìm theo email, tên gói..."
                    value={txSearchQuery}
                    onChange={(e) => {
                      setTxSearchQuery(e.target.value);
                      setTxPage(1);
                    }}
                    className="pl-9 pr-8 h-9 text-xs font-medium"
                  />
                  {txSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setTxSearchQuery("");
                        setTxPage(1);
                      }}
                      className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* NÚT TẮT / BẬT BỘ LỌC 🔻 */}
                <Button
                  type="button"
                  variant={showTxFilters ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowTxFilters(!showTxFilters)}
                  className="h-9 px-3 text-xs font-bold gap-1.5 cursor-pointer shrink-0 transition-all shadow-xs"
                  title="Tắt/Mở bộ lọc nâng cao"
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span>Bộ lọc</span>
                  {isTxFiltered && (
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </Button>

                {isTxFiltered && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleResetTxFilters}
                    className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground shrink-0 font-semibold"
                    title="Đặt lại tất cả bộ lọc"
                  >
                    <RotateCcw className="mr-1 h-3.5 w-3.5" /> Đặt lại
                  </Button>
                )}
              </div>

              {/* TẤT CẢ CÁC BỘ LỌC (TẮT / BẬT KHI NHẤN NÚT FILTER 🔻) */}
              {showTxFilters && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60 animate-in fade-in slide-in-from-top-1 duration-150">
                  {/* 1. Lọc theo Loại dịch vụ (Phỏng vấn / CV) */}
                  <select
                    value={pendingTxServiceFilter}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setPendingTxServiceFilter(val);
                      setTxServiceFilter(val);
                      setTxPage(1);
                    }}
                    className="h-9 rounded-md border border-input bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="all">Tất cả dịch vụ</option>
                    <option value="interview">Phỏng vấn AI</option>
                    <option value="cv">Tạo CV AI</option>
                  </select>

                  {/* 2. Lọc theo Hạng gói */}
                  <select
                    value={pendingTxTierFilter}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setPendingTxTierFilter(val);
                      setTxTierFilter(val);
                      setTxPage(1);
                    }}
                    className="h-9 rounded-md border border-input bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="all">Tất cả hạng gói</option>
                    <option value="ultra">Gói Ultra</option>
                  </select>



                  {/* 4. Lọc theo Tháng & Năm (Dropdown Tháng/Năm rõ ràng) */}
                  <select
                    value={pendingTxDateFilter}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPendingTxDateFilter(val);
                      setTxDateFilter(val);
                      setTxPage(1);
                    }}
                    className="h-9 rounded-md border border-input bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="">Tất cả tháng/năm</option>
                    {monthOptions.map((m) => (
                      <option key={m.val} value={m.val}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs font-bold px-2.5 py-1">
                Hiển thị {filteredTransactions.length} / {rawTransactionsList.length} giao dịch
              </Badge>
              {filteredTransactions.length > 0 && (
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-extrabold px-3 py-1">
                  Tổng doanh thu lọc được: {currency.format(filteredTxTotalRevenue)}
                </Badge>
              )}
            </div>

            {/* BẢNG GIAO DỊCH */}
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left text-sm font-sans">
                <thead className="text-xs uppercase text-muted-foreground border-b border-border bg-muted/40">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="pr-4">Dịch vụ</th>
                    <th className="pr-4">Doanh thu</th>
                    <th className="pr-4">Trạng thái</th>
                    <th className="pr-4">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                        {isTxFiltered
                          ? "Không tìm thấy giao dịch nào phù hợp với bộ lọc hiện tại."
                          : "Chưa có giao dịch."}
                      </td>
                    </tr>
                  ) : (
                    paginatedTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-semibold text-foreground">{tx.email ?? "Ẩn danh"}</td>
                        <td className="pr-4">
                          <span className="flex items-center gap-1.5">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                tx.item?.toLowerCase().includes("ultra") ? "bg-orange-500" : "bg-emerald-500"
                              }`}
                            />
                            {tx.item}
                          </span>
                        </td>
                        <td className="pr-4 font-black text-emerald-600 dark:text-emerald-400">
                          {currency.format(tx.amount)}
                        </td>
                        <td className="pr-4">
                          <Badge variant={tx.status === "completed" ? "default" : "outline"}>{tx.status}</Badge>
                        </td>
                        <td className="pr-4 text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleString("vi-VN")}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PHÂN TRANG 5 ITEM / TRANG */}
            {txTotalPages > 1 && (
              <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground">
                <div className="font-medium text-foreground">
                  Trang {txPage} / {txTotalPages}
                </div>
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

            <div className="flex items-center justify-end pt-3 border-t border-border">
              <Button variant="outline" onClick={() => setShowTxModal(false)}>Đóng</Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL QUẢN LÝ BẢNG GIÁ GÓI */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                  <Tag className="h-5 w-5 text-emerald-500" />
                  {pricingCategory === "interview" ? "Quản lý Bảng giá Gói Phỏng vấn AI" : "Quản lý Bảng giá Gói Tạo CV AI"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Cập nhật giá tiền và phần trăm giảm giá. Thay đổi sẽ hiển thị tức thì trên trang Nâng cấp.
                </p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full shrink-0" onClick={() => setShowPricingModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* CHỌN DANH MỤC GÓI DỊCH VỤ - THEO 2 MÀU INDIGO & PURPLE */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-muted/40 rounded-2xl border border-border/50">
              <button
                type="button"
                onClick={() => setPricingCategory("interview")}
                className={`flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-extrabold text-sm transition-all cursor-pointer ${
                  pricingCategory === "interview"
                    ? "bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <span>🎯</span>
                <span>1. Gói Phỏng vấn AI</span>
              </button>
              <button
                type="button"
                onClick={() => setPricingCategory("cv")}
                className={`flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-extrabold text-sm transition-all cursor-pointer ${
                  pricingCategory === "cv"
                    ? "bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white shadow-md shadow-purple-500/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <span>📄</span>
                <span>2. Gói Tạo CV AI</span>
              </button>
            </div>

            {priceSuccessMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                {priceSuccessMsg}
              </div>
            )}

            {/* NỘI DUNG THẺ CẬP NHẬT GIÁ DỰA THEO NÚT ĐANG CHỌN */}
            {pricingCategory === "interview" ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-card via-muted/20 to-card p-6 space-y-4 shadow-sm transition-all">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <h4 className="font-extrabold text-base text-foreground flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-orange-500 shadow-xs shadow-orange-500/50" />
                      Bảng giá Gói Ultra (Phỏng vấn AI)
                    </h4>
                    <Badge variant="outline" className="border-orange-500/30 text-orange-700 dark:text-orange-300 bg-orange-500/10 text-xs font-bold px-3 py-0.5 rounded-full">Chu kỳ 7 ngày</Badge>
                  </div>

                  <div className="max-w-md mx-auto">
                    {/* Ultra Tuần */}
                    <button
                      type="button"
                      onClick={() => handleOpenSinglePriceEdit({
                        planKey: "ultra_interview",
                        period: "weeklyPrice",
                        name: "Gói Ultra Phỏng vấn AI",
                        periodLabel: "Theo tuần",
                        badgeColor: "border-orange-500/30 text-orange-600 dark:text-orange-400 bg-orange-500/10",
                      })}
                      className="w-full group text-left rounded-2xl border border-orange-200/80 dark:border-orange-900/50 bg-gradient-to-br from-orange-500/[0.08] via-amber-500/[0.03] to-card p-6 space-y-4 hover:border-orange-400 dark:hover:border-orange-600 hover:shadow-xl hover:shadow-orange-500/10 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🔥</span>
                          <span className="font-black text-base text-orange-700 dark:text-orange-400">Gói Ultra Phỏng Vấn</span>
                        </div>
                        <Badge className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white text-xs px-3 py-1 font-bold shadow-xs rounded-full">
                          {planPrices.ultra_interview?.discount ? `Giảm ${planPrices.ultra_interview.discount}%` : "Theo tuần"}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">Giá niêm yết: {currency.format(planPrices.ultra_interview?.weeklyPrice ?? 30000)}</p>
                        <p className="text-3xl font-black text-orange-600 dark:text-orange-400 tracking-tight">
                          {currency.format(
                            Math.round(((planPrices.ultra_interview?.weeklyPrice ?? 30000) * (1 - (planPrices.ultra_interview?.discount ?? 0) / 100)) / 1000) * 1000
                          )} <span className="text-sm text-muted-foreground font-normal">/tuần</span>
                        </p>
                      </div>
                      <div className="pt-3 border-t border-orange-500/15 flex items-center justify-between text-xs font-bold text-orange-600 dark:text-orange-400 group-hover:underline">
                        <span>Chỉnh sửa giá & chiết khấu</span>
                        <span>✏️ Nhấn để chỉnh giá</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-card via-muted/20 to-card p-6 space-y-4 shadow-sm transition-all">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <h4 className="font-extrabold text-base text-foreground flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-purple-500 shadow-xs shadow-purple-500/50" />
                      Bảng giá Gói Ultra (Tạo CV AI)
                    </h4>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-700 dark:text-purple-300 bg-purple-500/10 text-xs font-bold px-3 py-0.5 rounded-full">Chu kỳ 7 ngày</Badge>
                  </div>

                  <div className="max-w-md mx-auto">
                    {/* Ultra CV Tuần */}
                    <button
                      type="button"
                      onClick={() => handleOpenSinglePriceEdit({
                        planKey: "ultra_cv",
                        period: "weeklyPrice",
                        name: "Gói Ultra Tạo CV AI",
                        periodLabel: "Theo tuần",
                        badgeColor: "border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10",
                      })}
                      className="w-full group text-left rounded-2xl border border-purple-200/80 dark:border-purple-900/50 bg-gradient-to-br from-purple-500/[0.08] via-fuchsia-500/[0.03] to-card p-6 space-y-4 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-xl hover:shadow-purple-500/10 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">✨</span>
                          <span className="font-black text-base text-purple-700 dark:text-purple-400">Gói Ultra Tạo CV</span>
                        </div>
                        <Badge className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-600 text-white text-xs px-3 py-1 font-bold shadow-xs rounded-full">
                          {planPrices.ultra_cv?.discount ? `Giảm ${planPrices.ultra_cv.discount}%` : "Theo tuần"}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">Giá niêm yết: {currency.format(planPrices.ultra_cv?.weeklyPrice ?? 30000)}</p>
                        <p className="text-3xl font-black text-purple-600 dark:text-purple-400 tracking-tight">
                          {currency.format(
                            Math.round(((planPrices.ultra_cv?.weeklyPrice ?? 30000) * (1 - (planPrices.ultra_cv?.discount ?? 0) / 100)) / 1000) * 1000
                          )} <span className="text-sm text-muted-foreground font-normal">/tuần</span>
                        </p>
                      </div>
                      <div className="pt-3 border-t border-purple-500/15 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:underline">
                        <span>Chỉnh sửa giá & chiết khấu</span>
                        <span>✏️ Nhấn để chỉnh giá</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={() => setShowPricingModal(false)}>Đóng</Button>
            </div>
          </div>
        </div>
      )}

      {/* POP-UP SUB-MODAL CHỈNH SỬA TỪNG GÓI */}
      {editingPlanTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/25 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSaveSinglePrice();
            }}
            className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-6 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Tag className="h-4 w-4 text-emerald-500" />
                Cập nhật {editingPlanTarget.name}
              </h3>
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={() => setEditingPlanTarget(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between bg-muted/40 p-3 rounded-xl border border-border/50">
                <div>
                  <p className="text-sm font-extrabold text-foreground">{editingPlanTarget.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Chu kỳ: {editingPlanTarget.periodLabel}</p>
                </div>
                <Badge className={editingPlanTarget.badgeColor}>{editingPlanTarget.periodLabel}</Badge>
              </div>

              {/* 1. Ô nhập Giá gốc (VNĐ) */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground font-semibold">Giá gốc (VNĐ):</Label>
                  <span className="text-xs font-bold text-primary">{currency.format(Number(singleOriginalPriceInput) || 0)}</span>
                </div>
                <Input
                  type="number"
                  step="1000"
                  placeholder="Ví dụ: 100000"
                  value={singleOriginalPriceInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setSingleOriginalPriceInput("");
                    } else {
                      const cleaned = val.replace(/^0+(?=\d)/, "");
                      setSingleOriginalPriceInput(cleaned);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void handleSaveSinglePrice();
                    }
                  }}
                  className="text-base font-bold h-10 border-input focus:border-primary"
                  autoFocus
                />
              </div>

              {/* 2. Ô nhập Phần trăm Giảm giá (Discount) */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground font-semibold">Phần trăm giảm giá (% Discount):</Label>
                  <Badge variant="secondary" className="text-[10px] font-mono">Giảm {singleDiscountInput || 0}%</Badge>
                </div>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  placeholder="Ví dụ: 25"
                  value={singleDiscountInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setSingleDiscountInput("");
                    } else {
                      const cleaned = val.replace(/^0+(?=\d)/, "");
                      setSingleDiscountInput(cleaned);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void handleSaveSinglePrice();
                    }
                  }}
                  className="text-base font-bold h-10"
                />
              </div>

              {/* 3. Ô Giá tiền mới (VNĐ) - Nhãn và số tiền CÙNG HÀNG */}
              <div className="pt-1">
                <div className="flex items-center justify-between h-10 px-3.5 rounded-md border border-input bg-muted/40 font-bold">
                  <Label className="text-xs text-muted-foreground font-semibold">Giá tiền mới (VNĐ):</Label>
                  <span className="text-[#6667ab] dark:text-[#9395d3] text-base font-black tracking-tight">{currency.format(computedNewPrice)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingPlanTarget(null)}>Hủy</Button>
              <Button type="submit" size="sm" disabled={savingPrices} className="font-semibold shadow-sm">
                <Save className="mr-1.5 h-4 w-4" />
                {savingPrices ? "Đang lưu..." : "Xác nhận cập nhật"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL USER SẮP HẾT HẠN */}
      {showExpiringModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl p-6 space-y-6">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
                  <Clock className="h-5 w-5 text-amber-500" />
                  User sắp hết hạn
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Danh sách {data?.summary.expiring_soon ?? 0} người dùng sẽ hết hạn gói trong 7 ngày tới.
                </p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full shrink-0" onClick={() => setShowExpiringModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {expiringUsersList.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3 opacity-60" />
                <p className="font-medium text-base">Hiện không có user nào sắp hết hạn gói.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedExpiringUsers.map((item) => (
                    <div key={item.id} className="rounded-xl border border-border/60 p-4 bg-muted/20 hover:bg-muted/40 transition-all space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-bold text-foreground" title={item.email}>{item.email ?? "Không có email"}</p>
                        <Badge variant="secondary" className="font-mono text-xs shrink-0">{item.subscription_plan}</Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Hết hạn: {new Date(item.subscription_expires_at).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {expTotalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-border/40 text-xs text-muted-foreground">
                    <span>Trang {expPage} / {expTotalPages}</span>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={expPage === 1}
                        onClick={() => setExpPage((p) => Math.max(p - 1, 1))}
                        className="h-8 px-2.5"
                      >
                        <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Trước
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={expPage >= expTotalPages}
                        onClick={() => setExpPage((p) => Math.min(p + 1, expTotalPages))}
                        className="h-8 px-2.5"
                      >
                        Sau <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-border">
              <Button variant="outline" onClick={() => setShowExpiringModal(false)}>Đóng</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
