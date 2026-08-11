import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, ArrowUpDown, BarChart3, Bot, Calendar, CheckCircle2, ChevronLeft, ChevronRight, Clock, CreditCard, Crown, DollarSign, FileText, Filter, Layers, MousePointerClick, PieChart, RefreshCw, Save, Search, ShieldCheck, Sparkles, Tag, TrendingUp, Users, Wrench, X, Zap } from "lucide-react";
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
  [key: string]: { name?: string; weeklyPrice: number; monthlyPrice: number; discount?: number | null };
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
    const proVal = dataPoint.pro_revenue ?? 0;
    const ultraVal = dataPoint.ultra_revenue ?? 0;
    const totalVal = dataPoint.revenue ?? (proVal + ultraVal);

    const proCount = dataPoint.pro_count ?? 0;
    const ultraCount = dataPoint.ultra_count ?? 0;
    const totalCount = dataPoint.total_count ?? (proCount + ultraCount);

    const proPercent = totalVal > 0 ? Math.round((proVal / totalVal) * 100) : 0;
    const ultraPercent = totalVal > 0 ? 100 - proPercent : 0;

    const dateObj = new Date(label);
    const dateFormatted = `Ngày ${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;

    return (
      <div className="min-w-[220px] space-y-2.5 rounded-xl border border-primary/30 bg-card/95 p-3.5 text-xs text-foreground shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-border/60 pb-1.5 font-bold text-muted-foreground">
          <span>{dateFormatted}</span>
          <span className="flex items-center gap-1 text-[10px] font-medium text-primary">
            <MousePointerClick className="h-3 w-3" /> Click chọn
          </span>
        </div>

        {viewMode === "revenue" ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 font-medium text-emerald-500">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Gói Pro:
              </span>
              <div className="text-right">
                <span className="font-bold">{currency.format(proVal)}</span>
                {totalVal > 0 && <span className="ml-1.5 text-[10px] text-muted-foreground">({proPercent}%)</span>}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 font-medium text-purple-500">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                Gói Ultra:
              </span>
              <div className="text-right">
                <span className="font-bold">{currency.format(ultraVal)}</span>
                {totalVal > 0 && <span className="ml-1.5 text-[10px] text-muted-foreground">({ultraPercent}%)</span>}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-1.5 text-xs font-black">
              <span>Tổng ngày:</span>
              <span className="text-primary">{currency.format(totalVal)}</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 font-medium text-emerald-500">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Gói Pro:
              </span>
              <span className="font-bold">{proCount} lượt mua</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 font-medium text-purple-500">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                Gói Ultra:
              </span>
              <span className="font-bold">{ultraCount} lượt mua</span>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-1.5 text-xs font-black">
              <span>Tổng lượt mua:</span>
              <span className="text-primary">{totalCount} lượt</span>
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
    planKey: "pro_interview" | "ultra_interview" | "pro_cv" | "ultra_cv";
    period: "weeklyPrice" | "monthlyPrice";
    name: string;
    periodLabel: string;
    badgeColor: string;
  } | null;

  const [editingPlanTarget, setEditingPlanTarget] = useState<EditPlanTarget>(null);
  const [singlePriceInput, setSinglePriceInput] = useState<number | string>(0);
  const [singleDiscountInput, setSingleDiscountInput] = useState<number | string>(0);

  const handleOpenSinglePriceEdit = (target: NonNullable<EditPlanTarget>) => {
    setEditingPlanTarget(target);
    const price = planPrices[target.planKey]?.[target.period] ?? 0;
    const discount = planPrices[target.planKey]?.discount ?? 0;
    setSinglePriceInput(price);
    setSingleDiscountInput(discount ?? 0);
  };

  const currentMonthStr = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);
  const [selectedDay, setSelectedDay] = useState<string>("");

  const headers = useMemo(() => ({ "x-user-role": user?.role ?? "", "x-user-id": user?.id ?? "" }), [user?.id, user?.role]);

  const [planPrices, setPlanPrices] = useState<PlanPriceMap>({
    pro_interview: { name: "Gói Pro Phỏng vấn AI", weeklyPrice: 15000, monthlyPrice: 50000, discount: 20 },
    ultra_interview: { name: "Gói Ultra Phỏng vấn AI", weeklyPrice: 30000, monthlyPrice: 100000, discount: 25 },
    pro_cv: { name: "Gói Pro Tạo CV AI", weeklyPrice: 10000, monthlyPrice: 30000, discount: 20 },
    ultra_cv: { name: "Gói Ultra Tạo CV AI", weeklyPrice: 20000, monthlyPrice: 60000, discount: 25 },
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
    const finalPrice = Number(singlePriceInput) || 0;
    const finalDiscount = Number(singleDiscountInput) || 0;
    const updatedPlanPrices = {
      ...planPrices,
      [editingPlanTarget.planKey]: {
        ...planPrices[editingPlanTarget.planKey],
        [editingPlanTarget.period]: finalPrice,
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
      setPriceSuccessMsg(`Đã cập nhật ${editingPlanTarget.name} (${editingPlanTarget.periodLabel}): Giá ${currency.format(finalPrice)}, Giảm giá ${finalDiscount}%!`);
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

  const monthProSharePercent = useMemo(() => {
    if (totalSelectedMonthRevenue === 0) return 0;
    return Math.round((monthProRevenueTotal / totalSelectedMonthRevenue) * 100);
  }, [monthProRevenueTotal, totalSelectedMonthRevenue]);

  const monthUltraSharePercent = useMemo(() => {
    if (totalSelectedMonthRevenue === 0) return 0;
    return 100 - monthProSharePercent;
  }, [monthProSharePercent, totalSelectedMonthRevenue]);

  const monthProVolumePercent = useMemo(() => {
    if (monthTransactions.length === 0) return 0;
    return Math.round((monthProTx.length / monthTransactions.length) * 100);
  }, [monthProTx.length, monthTransactions.length]);

  const monthUltraVolumePercent = useMemo(() => {
    if (monthTransactions.length === 0) return 0;
    return 100 - monthProVolumePercent;
  }, [monthProVolumePercent, monthTransactions.length]);

  const highestRevenueDayDate = useMemo(() => {
    if (!data?.dailyRevenue || data.dailyRevenue.length === 0) return null;
    const sorted = [...data.dailyRevenue].sort((a, b) => {
      const revA = a.revenue ?? ((a.pro_revenue ?? 0) + (a.ultra_revenue ?? 0));
      const revB = b.revenue ?? ((b.pro_revenue ?? 0) + (b.ultra_revenue ?? 0));
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
      const proCount = dayTx.filter((t) => t.item_id?.includes("pro") || t.item?.toLowerCase().includes("pro")).length;
      const ultraCount = dayTx.filter((t) => t.item_id?.includes("ultra") || t.item?.toLowerCase().includes("ultra")).length;
      return {
        ...item,
        pro_revenue: item.pro_revenue ?? 0,
        ultra_revenue: item.ultra_revenue ?? 0,
        revenue: item.revenue ?? ((item.pro_revenue ?? 0) + (item.ultra_revenue ?? 0)),
        pro_count: proCount,
        ultra_count: ultraCount,
        total_count: proCount + ultraCount,
      };
    });
  }, [data?.dailyRevenue, data?.monthTransactions]);

  // Tìm kiếm và Lọc Danh sách giao dịch
  const [txSearchQuery, setTxSearchQuery] = useState("");
  const [txServiceFilter, setTxServiceFilter] = useState<"all" | "interview" | "cv">("all");
  const [txTierFilter, setTxTierFilter] = useState<"all" | "pro" | "ultra">("all");
  const [txAmountFilter, setTxAmountFilter] = useState<"all" | "under100" | "100to500" | "over500">("all");
  const [txSortOrder, setTxSortOrder] = useState<"newest" | "amount_desc" | "amount_asc">("newest");
  const [txPage, setTxPage] = useState(1);

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
  }, [rawTransactionsList, txSearchQuery, txServiceFilter, txTierFilter, txAmountFilter, txSortOrder]);

  const filteredTxTotalRevenue = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  const isTxFiltered =
    txSearchQuery !== "" ||
    txServiceFilter !== "all" ||
    txTierFilter !== "all" ||
    txAmountFilter !== "all" ||
    txSortOrder !== "newest";

  const handleResetTxFilters = () => {
    setTxSearchQuery("");
    setTxServiceFilter("all");
    setTxTierFilter("all");
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
            <MetricCard title="Doanh thu tháng này" value={currency.format(data?.summary.month_revenue ?? 0)} note={`Tuần này: ${currency.format(data?.summary.week_revenue ?? 0)}`} />
            <MetricCard title="MRR ước tính" value={currency.format(data?.summary.mrr ?? 0)} note="Tính từ user Pro/Ultra active" />
            <MetricCard title="Conversion" value={`${data?.summary.conversion_rate ?? 0}%`} note={`Pro: ${data?.summary.pro_users ?? 0} • Ultra: ${data?.summary.ultra_users ?? 0}`} />
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
                    ? `Phân tích doanh thu tháng ${selectedMonthLabel}`
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

                {/* Badge tổng ngày khi ở chế độ Doanh thu Ngày */}
                {revenueDisplayTab === "day" && (
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1.5 shadow-sm">
                    Tổng ngày {selectedDayFormatted}: {currency.format(selectedDayTotalRevenue)}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-8">
              {/* 1. CHẾ ĐỘ XEM 'TẤT CẢ': CHỈ CÓ BIỂU ĐỒ DOANH THU THUẦN TÚY (CHỈ CÓ BIỂU ĐỒ KHÔNG THÔI) */}
              {revenueDisplayTab === "all" && (
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" />
                      Biểu đồ {chartViewMode === "revenue" ? "doanh thu" : "lượt mua"} tháng {selectedMonthLabel}
                    </h3>

                    <div className="flex items-center gap-3">
                      {/* Switch chế độ xem biểu đồ (Doanh thu / Lượt mua) */}
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

                      {/* Badge Hiển thị Tổng tiền thẳng hàng với VNĐ / Lượt mua */}
                      <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 text-xs font-extrabold px-3 py-1 shadow-sm">
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
                            <linearGradient id="proRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id="ultraRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.6} />
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
                            formatter={(value) => <span className="text-xs font-bold">{value}</span>}
                          />
                          <Area
                            type="monotone"
                            dataKey={chartViewMode === "revenue" ? "pro_revenue" : "pro_count"}
                            name={
                              chartViewMode === "revenue"
                                ? `Gói Pro (${currency.format(monthProRevenueTotal)})`
                                : `Gói Pro (${monthProTx.length} lượt)`
                            }
                            stroke="#10b981"
                            strokeWidth={2.5}
                            activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                            fill="url(#proRevenue)"
                          />
                          <Area
                            type="monotone"
                            dataKey={chartViewMode === "revenue" ? "ultra_revenue" : "ultra_count"}
                            name={
                              chartViewMode === "revenue"
                                ? `Gói Ultra (${currency.format(monthUltraRevenueTotal)})`
                                : `Gói Ultra (${monthUltraTx.length} lượt)`
                            }
                            stroke="#8b5cf6"
                            strokeWidth={2.5}
                            activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                            fill="url(#ultraRevenue)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* THANH THỊ PHẦN (ĐỒNG BỘ THEO DOANH THU HOẶC LƯỢT MUA) */}
                  <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-2 pt-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-2 text-foreground">
                        <Layers className="h-4 w-4 text-indigo-500" />
                        Tỉ trọng đóng góp {chartViewMode === "revenue" ? "doanh thu" : "lượt mua"} tháng {selectedMonthLabel}:
                      </span>
                      <div className="flex items-center gap-4 text-[11px]">
                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          {chartViewMode === "revenue"
                            ? `Gói Pro: ${monthProSharePercent}% (${currency.format(monthProRevenueTotal)})`
                            : `Gói Pro: ${monthProVolumePercent}% (${monthProTx.length} lượt)`}
                        </span>
                        <span className="text-purple-600 dark:text-purple-400 font-extrabold flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-purple-500" />
                          {chartViewMode === "revenue"
                            ? `Gói Ultra: ${monthUltraSharePercent}% (${currency.format(monthUltraRevenueTotal)})`
                            : `Gói Ultra: ${monthUltraVolumePercent}% (${monthUltraTx.length} lượt)`}
                        </span>
                      </div>
                    </div>
                    {/* Dual Progress Bar */}
                    <div className="h-3.5 w-full rounded-full bg-muted overflow-hidden flex p-0.5 border border-border/40 shadow-inner">
                      <div
                        className="h-full bg-emerald-500 rounded-l-full transition-all duration-500"
                        style={{
                          width: `${chartViewMode === "revenue" ? monthProSharePercent : monthProVolumePercent}%`,
                        }}
                        title={`Gói Pro: ${chartViewMode === "revenue" ? monthProSharePercent : monthProVolumePercent}%`}
                      />
                      <div
                        className="h-full bg-purple-500 rounded-r-full transition-all duration-500"
                        style={{
                          width: `${chartViewMode === "revenue" ? monthUltraSharePercent : monthUltraVolumePercent}%`,
                        }}
                        title={`Gói Ultra: ${chartViewMode === "revenue" ? monthUltraSharePercent : monthUltraVolumePercent}%`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. NỘI DUNG XEM THEO THÁNG (CHỈ TẬP TRUNG PHÂN TÍCH CÁC GÓI CƯỚC THÁNG) */}
              {revenueDisplayTab === "month" && (
                <div className="space-y-6">
                  {/* PHÂN TÍCH DOANH THU THEO GÓI (THÁNG) */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-foreground">
                      <PieChart className="h-4 w-4 text-indigo-500" />
                      Phân tích chi tiết các gói cước tháng {selectedMonthLabel}
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Gói Pro */}
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3 shadow-sm hover:border-emerald-500/50 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                            <h4 className="font-extrabold text-sm text-emerald-700 dark:text-emerald-400">Gói Pro</h4>
                          </div>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                            {monthProTx.length} lượt mua
                          </span>
                        </div>
                        <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                          {currency.format(monthProRevenueTotal)}
                        </p>
                        <div className="space-y-2 pt-2 border-t border-emerald-500/20 text-xs text-muted-foreground">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-foreground/80 font-medium">
                              <Bot className="h-3.5 w-3.5 text-emerald-500" /> Pro Phỏng vấn AI:
                            </span>
                            <span className="font-bold text-foreground">{monthProInterviewCount} lượt ({currency.format(monthProInterviewCount * 50000)})</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-foreground/80 font-medium">
                              <FileText className="h-3.5 w-3.5 text-emerald-500" /> Pro Tạo CV AI:
                            </span>
                            <span className="font-bold text-foreground">{monthProCvCount} lượt ({currency.format(monthProCvCount * 50000)})</span>
                          </div>
                        </div>
                      </div>

                      {/* Gói Ultra */}
                      <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4 space-y-3 shadow-sm hover:border-purple-500/50 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50" />
                            <h4 className="font-extrabold text-sm text-purple-700 dark:text-purple-400">Gói Ultra</h4>
                          </div>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                            {monthUltraTx.length} lượt mua
                          </span>
                        </div>
                        <p className="text-2xl font-black text-purple-600 dark:text-purple-400 tracking-tight">
                          {currency.format(monthUltraRevenueTotal)}
                        </p>
                        <div className="space-y-2 pt-2 border-t border-purple-500/20 text-xs text-muted-foreground">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-foreground/80 font-medium">
                              <Crown className="h-3.5 w-3.5 text-purple-500" /> Ultra Phỏng vấn AI:
                            </span>
                            <span className="font-bold text-foreground">{monthUltraInterviewCount} lượt ({currency.format(monthUltraInterviewCount * 100000)})</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-foreground/80 font-medium">
                              <Sparkles className="h-3.5 w-3.5 text-purple-500" /> Ultra Tạo CV AI:
                            </span>
                            <span className="font-bold text-foreground">{monthUltraCvCount} lượt ({currency.format(monthUltraCvCount * 100000)})</span>
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
                          className="px-2.5 py-1 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-500/20 transition-all flex items-center gap-1 shadow-sm"
                          title="Chọn ngày có doanh thu cao nhất trong tháng"
                        >
                          🏆 Ngày doanh thu cao nhất
                        </button>
                      )}
                    </div>
                  </div>

                  {/* THẺ CHỈ SỐ NGÀY */}
                  <div className="grid gap-3 sm:grid-cols-3">
                    {/* Tổng ngày */}
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-1 shadow-sm">
                      <p className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-primary" /> Tổng doanh thu ngày
                      </p>
                      <p className="text-xl font-black text-primary tracking-tight">{currency.format(selectedDayTotalRevenue)}</p>
                    </div>

                    {/* Gói Pro Ngày */}
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-1 shadow-sm">
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Zap className="h-4 w-4 text-emerald-500" /> Gói Pro ngày
                      </p>
                      <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">{currency.format(selectedDayProRevenue)}</p>
                    </div>

                    {/* Gói Ultra Ngày */}
                    <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4 space-y-1 shadow-sm">
                      <p className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                        <Crown className="h-4 w-4 text-purple-500" /> Gói Ultra ngày
                      </p>
                      <p className="text-xl font-black text-purple-600 dark:text-purple-400 tracking-tight">{currency.format(selectedDayUltraRevenue)}</p>
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
                onClick={() => setShowTxModal(true)}
                variant="outline"
                className="border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 font-bold text-xs shadow-sm transition-all h-9 px-4"
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

            {/* BỘ LỌC VÀ TÌM KIẾM THEO GÓI CƯỚC & EMAIL */}
            <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl border border-border bg-muted/20">
              {/* Ô tìm kiếm Email / Dịch vụ */}
              <div className="relative w-full sm:w-72">
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

              {/* Lọc theo Loại dịch vụ (Phỏng vấn / CV) */}
              <div className="flex items-center gap-1 w-full sm:w-44">
                <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <select
                  value={txServiceFilter}
                  onChange={(e) => {
                    setTxServiceFilter(e.target.value as any);
                    setTxPage(1);
                  }}
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="all">Tất cả dịch vụ</option>
                  <option value="interview">Gói Phỏng vấn AI</option>
                  <option value="cv">Gói Tạo CV AI</option>
                </select>
              </div>

              {/* Lọc theo Hạng gói (Pro / Ultra) */}
              <div className="flex items-center gap-1 w-full sm:w-40">
                <select
                  value={txTierFilter}
                  onChange={(e) => {
                    setTxTierFilter(e.target.value as any);
                    setTxPage(1);
                  }}
                  className="h-9 w-full rounded-md border border-input bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="all">Tất cả hạng gói</option>
                  <option value="pro">Gói Pro</option>
                  <option value="ultra">Gói Ultra</option>
                </select>
              </div>

              {isTxFiltered && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResetTxFilters}
                  className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground shrink-0"
                  title="Đặt lại bộ lọc"
                >
                  <X className="h-4 w-4 mr-1" /> Đặt lại
                </Button>
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
                                tx.item?.toLowerCase().includes("ultra") ? "bg-purple-500" : "bg-emerald-500"
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
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl p-6 space-y-6">
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

            {/* BỘ 2 NÚT CHỌN LOẠI DỊCH VỤ (PHỎNG VẤN & TẠO CV) */}
            <div className="grid grid-cols-2 gap-3 p-1.5 rounded-xl border border-border bg-muted/30">
              <button
                type="button"
                onClick={() => setPricingCategory("interview")}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-extrabold text-sm transition-all cursor-pointer ${
                  pricingCategory === "interview"
                    ? "bg-emerald-500 text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <span>🎯</span>
                <span>1. Gói Phỏng vấn AI</span>
              </button>
              <button
                type="button"
                onClick={() => setPricingCategory("cv")}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-extrabold text-sm transition-all cursor-pointer ${
                  pricingCategory === "cv"
                    ? "bg-purple-500 text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <span>📄</span>
                <span>2. Gói Tạo CV AI</span>
              </button>
            </div>

            {priceSuccessMsg && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {priceSuccessMsg}
              </div>
            )}

            {/* NỘI DUNG THẺ CẬP NHẬT GIÁ DỰA THEO NÚT ĐANG CHỌN */}
            {pricingCategory === "interview" ? (
              <div className="grid gap-6 md:grid-cols-2">
                {/* 1. KHUNG GÓI PRO PHỎNG VẤN AI (1 Ô TỔNG THỂ) */}
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-4 shadow-md">
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                    <h4 className="font-black text-base text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-emerald-500" />
                      Gói Pro Phỏng vấn AI
                    </h4>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 text-xs font-extrabold">2 Chu Kỳ Cước</Badge>
                  </div>

                  {/* 2 NÚT BẤM BÊN TRONG 1 Ô */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Nút 1: Pro Phỏng vấn - Tuần */}
                    <button
                      type="button"
                      onClick={() => handleOpenSinglePriceEdit({
                        planKey: "pro_interview",
                        period: "weeklyPrice",
                        name: "Gói Pro Phỏng vấn AI (Tuần)",
                        periodLabel: "Theo tuần",
                        badgeColor: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
                      })}
                      className="group text-left rounded-xl border border-emerald-500/30 bg-card p-3.5 space-y-2 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-foreground">Gói Tuần</span>
                        <Badge variant="outline" className="border-border text-[10px] text-muted-foreground px-1.5 py-0 font-semibold">Gốc</Badge>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground font-medium">Giá theo tuần:</p>
                        <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                          {currency.format(planPrices.pro_interview?.weeklyPrice ?? 15000)}
                        </p>
                      </div>
                      <div className="pt-1.5 border-t border-border/50 flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                        <span>Chỉnh giá</span>
                        <span>✏️</span>
                      </div>
                    </button>

                    {/* Nút 2: Pro Phỏng vấn - Tháng */}
                    <button
                      type="button"
                      onClick={() => handleOpenSinglePriceEdit({
                        planKey: "pro_interview",
                        period: "monthlyPrice",
                        name: "Gói Pro Phỏng vấn AI (Tháng)",
                        periodLabel: "Theo tháng",
                        badgeColor: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
                      })}
                      className="group text-left rounded-xl border border-emerald-500/30 bg-card p-3.5 space-y-2 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-foreground">Gói Tháng</span>
                        <Badge className="bg-emerald-500 text-white text-[10px] px-1.5 py-0 font-bold">Giảm {planPrices.pro_interview?.discount ?? 20}%</Badge>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground font-medium">Giá theo tháng:</p>
                        <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                          {currency.format(planPrices.pro_interview?.monthlyPrice ?? 50000)}
                        </p>
                      </div>
                      <div className="pt-1.5 border-t border-border/50 flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                        <span>Sửa giá & discount</span>
                        <span>✏️</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. KHUNG GÓI ULTRA PHỎNG VẤN AI (1 Ô TỔNG THỂ) */}
                <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-5 space-y-4 shadow-md">
                  <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                    <h4 className="font-black text-base text-purple-700 dark:text-purple-400 flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-purple-500" />
                      Gói Ultra Phỏng vấn AI
                    </h4>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-600 text-xs font-extrabold">2 Chu Kỳ Cước</Badge>
                  </div>

                  {/* 2 NÚT BẤM BÊN TRONG 1 Ô */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Nút 1: Ultra Phỏng vấn - Tuần */}
                    <button
                      type="button"
                      onClick={() => handleOpenSinglePriceEdit({
                        planKey: "ultra_interview",
                        period: "weeklyPrice",
                        name: "Gói Ultra Phỏng vấn AI (Tuần)",
                        periodLabel: "Theo tuần",
                        badgeColor: "border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10",
                      })}
                      className="group text-left rounded-xl border border-purple-500/30 bg-card p-3.5 space-y-2 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-foreground">Gói Tuần</span>
                        <Badge variant="outline" className="border-border text-[10px] text-muted-foreground px-1.5 py-0 font-semibold">Gốc</Badge>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground font-medium">Giá theo tuần:</p>
                        <p className="text-base font-black text-purple-600 dark:text-purple-400">
                          {currency.format(planPrices.ultra_interview?.weeklyPrice ?? 30000)}
                        </p>
                      </div>
                      <div className="pt-1.5 border-t border-border/50 flex items-center justify-between text-[11px] font-bold text-purple-600 dark:text-purple-400 group-hover:underline">
                        <span>Chỉnh giá</span>
                        <span>✏️</span>
                      </div>
                    </button>

                    {/* Nút 2: Ultra Phỏng vấn - Tháng */}
                    <button
                      type="button"
                      onClick={() => handleOpenSinglePriceEdit({
                        planKey: "ultra_interview",
                        period: "monthlyPrice",
                        name: "Gói Ultra Phỏng vấn AI (Tháng)",
                        periodLabel: "Theo tháng",
                        badgeColor: "border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10",
                      })}
                      className="group text-left rounded-xl border border-purple-500/30 bg-card p-3.5 space-y-2 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-foreground">Gói Tháng</span>
                        <Badge className="bg-purple-500 text-white text-[10px] px-1.5 py-0 font-bold">Giảm {planPrices.ultra_interview?.discount ?? 25}%</Badge>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground font-medium">Giá theo tháng:</p>
                        <p className="text-base font-black text-purple-600 dark:text-purple-400">
                          {currency.format(planPrices.ultra_interview?.monthlyPrice ?? 100000)}
                        </p>
                      </div>
                      <div className="pt-1.5 border-t border-border/50 flex items-center justify-between text-[11px] font-bold text-purple-600 dark:text-purple-400 group-hover:underline">
                        <span>Sửa giá & discount</span>
                        <span>✏️</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {/* 3. KHUNG GÓI PRO TẠO CV AI (1 Ô TỔNG THỂ) */}
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-4 shadow-md">
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                    <h4 className="font-black text-base text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-emerald-500" />
                      Gói Pro Tạo CV AI
                    </h4>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 text-xs font-extrabold">2 Chu Kỳ Cước</Badge>
                  </div>

                  {/* 2 NÚT BẤM BÊN TRONG 1 Ô */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Nút 1: Pro CV - Tuần */}
                    <button
                      type="button"
                      onClick={() => handleOpenSinglePriceEdit({
                        planKey: "pro_cv",
                        period: "weeklyPrice",
                        name: "Gói Pro Tạo CV AI (Tuần)",
                        periodLabel: "Theo tuần",
                        badgeColor: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
                      })}
                      className="group text-left rounded-xl border border-emerald-500/30 bg-card p-3.5 space-y-2 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-foreground">Gói Tuần</span>
                        <Badge variant="outline" className="border-border text-[10px] text-muted-foreground px-1.5 py-0 font-semibold">Gốc</Badge>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground font-medium">Giá theo tuần:</p>
                        <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                          {currency.format(planPrices.pro_cv?.weeklyPrice ?? 10000)}
                        </p>
                      </div>
                      <div className="pt-1.5 border-t border-border/50 flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                        <span>Chỉnh giá</span>
                        <span>✏️</span>
                      </div>
                    </button>

                    {/* Nút 2: Pro CV - Tháng */}
                    <button
                      type="button"
                      onClick={() => handleOpenSinglePriceEdit({
                        planKey: "pro_cv",
                        period: "monthlyPrice",
                        name: "Gói Pro Tạo CV AI (Tháng)",
                        periodLabel: "Theo tháng",
                        badgeColor: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
                      })}
                      className="group text-left rounded-xl border border-emerald-500/30 bg-card p-3.5 space-y-2 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-foreground">Gói Tháng</span>
                        <Badge className="bg-emerald-500 text-white text-[10px] px-1.5 py-0 font-bold">Giảm {planPrices.pro_cv?.discount ?? 20}%</Badge>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground font-medium">Giá theo tháng:</p>
                        <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                          {currency.format(planPrices.pro_cv?.monthlyPrice ?? 30000)}
                        </p>
                      </div>
                      <div className="pt-1.5 border-t border-border/50 flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                        <span>Sửa giá & discount</span>
                        <span>✏️</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 4. KHUNG GÓI ULTRA TẠO CV AI (1 Ô TỔNG THỂ) */}
                <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-5 space-y-4 shadow-md">
                  <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                    <h4 className="font-black text-base text-purple-700 dark:text-purple-400 flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-purple-500" />
                      Gói Ultra Tạo CV AI
                    </h4>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-600 text-xs font-extrabold">2 Chu Kỳ Cước</Badge>
                  </div>

                  {/* 2 NÚT BẤM BÊN TRONG 1 Ô */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Nút 1: Ultra CV - Tuần */}
                    <button
                      type="button"
                      onClick={() => handleOpenSinglePriceEdit({
                        planKey: "ultra_cv",
                        period: "weeklyPrice",
                        name: "Gói Ultra Tạo CV AI (Tuần)",
                        periodLabel: "Theo tuần",
                        badgeColor: "border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10",
                      })}
                      className="group text-left rounded-xl border border-purple-500/30 bg-card p-3.5 space-y-2 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-foreground">Gói Tuần</span>
                        <Badge variant="outline" className="border-border text-[10px] text-muted-foreground px-1.5 py-0 font-semibold">Gốc</Badge>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground font-medium">Giá theo tuần:</p>
                        <p className="text-base font-black text-purple-600 dark:text-purple-400">
                          {currency.format(planPrices.ultra_cv?.weeklyPrice ?? 20000)}
                        </p>
                      </div>
                      <div className="pt-1.5 border-t border-border/50 flex items-center justify-between text-[11px] font-bold text-purple-600 dark:text-purple-400 group-hover:underline">
                        <span>Chỉnh giá</span>
                        <span>✏️</span>
                      </div>
                    </button>

                    {/* Nút 2: Ultra CV - Tháng */}
                    <button
                      type="button"
                      onClick={() => handleOpenSinglePriceEdit({
                        planKey: "ultra_cv",
                        period: "monthlyPrice",
                        name: "Gói Ultra Tạo CV AI (Tháng)",
                        periodLabel: "Theo tháng",
                        badgeColor: "border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10",
                      })}
                      className="group text-left rounded-xl border border-purple-500/30 bg-card p-3.5 space-y-2 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-foreground">Gói Tháng</span>
                        <Badge className="bg-purple-500 text-white text-[10px] px-1.5 py-0 font-bold">Giảm {planPrices.ultra_cv?.discount ?? 25}%</Badge>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground font-medium">Giá theo tháng:</p>
                        <p className="text-base font-black text-purple-600 dark:text-purple-400">
                          {currency.format(planPrices.ultra_cv?.monthlyPrice ?? 60000)}
                        </p>
                      </div>
                      <div className="pt-1.5 border-t border-border/50 flex items-center justify-between text-[11px] font-bold text-purple-600 dark:text-purple-400 group-hover:underline">
                        <span>Sửa giá & discount</span>
                        <span>✏️</span>
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

              {/* Ô nhập Phần trăm Giảm giá (Discount) - CHỈ CHO GÓI THÁNG */}
              {editingPlanTarget.period === "monthlyPrice" ? (
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
                    placeholder="Ví dụ: 20"
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
                  <p className="text-[11px] text-muted-foreground">
                    Phần trăm giảm giá này sẽ hiển thị nhãn khuyến mãi trên trang Nâng cấp (/upgrade) cho người dùng.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  ℹ️ Gói theo tuần bán theo giá niêm yết cố định (không có giảm giá).
                </div>
              )}

              {/* Ô nhập Giá tiền mới */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground font-semibold">Giá tiền mới (VNĐ):</Label>
                <Input
                  type="number"
                  step="1000"
                  value={singlePriceInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setSinglePriceInput("");
                    } else {
                      const cleaned = val.replace(/^0+(?=\d)/, "");
                      setSinglePriceInput(cleaned);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void handleSaveSinglePrice();
                    }
                  }}
                  className="text-lg font-bold h-11 border-primary/50 focus:border-primary"
                  autoFocus
                />
                <div className="flex items-center justify-between text-xs font-bold pt-0.5">
                  <span className="text-muted-foreground">Xem trước định dạng:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-sm">{currency.format(Number(singlePriceInput) || 0)}</span>
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
