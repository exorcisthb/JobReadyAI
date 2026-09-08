import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Users, Shield, UserPlus, HelpCircle, Lock, Unlock,
  Activity, AlertTriangle, BarChart3, CreditCard, ShieldAlert, Wrench, ChevronLeft,
  ChevronRight, TrendingUp, Server, X, Zap, Database, Globe, Crown, Mail, CheckCircle2, Facebook, Flame,
  Search,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DashboardHeader, type NavItem } from "@/components/dashboard-header";

interface AdminUser {
  id: string;
  email: string;
  role: "user" | "content_manager" | "admin";
  status: "active" | "locked";
  created_at: string;
  auth_provider: string;
  sub_plan_interview: string | null;
  sub_expires_interview: string | null;
  sub_plan_cv: string | null;
  sub_expires_cv: string | null;
}

const AUTH_PROVIDER_CONFIG = {
  google: {
    label: "Google",
    icon: Globe,
    className: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30",
  },
  facebook: {
    label: "Facebook",
    icon: Facebook,
    className: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30",
  },
  email: {
    label: "Email",
    icon: Mail,
    className: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-950/20 dark:text-slate-400 dark:border-slate-800",
  },
} as const;

function getAuthProviderConfig(provider?: string) {
  const key = provider?.toLowerCase() as keyof typeof AUTH_PROVIDER_CONFIG;
  return AUTH_PROVIDER_CONFIG[key] || AUTH_PROVIDER_CONFIG.email;
}

interface UsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  counts?: {
    total: number;
    user: number;
    manager: number;
    admin: number;
    locked: number;
  };
}

const isUltraPermanent = (u: AdminUser): boolean =>
  u.sub_plan_interview === "ultra_interview" &&
  u.sub_expires_interview === null &&
  u.sub_plan_cv === "ultra_cv" &&
  u.sub_expires_cv === null;

function renderPlanBadges(u: AdminUser) {
  const freeClass = "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950/20 dark:text-slate-400";
  const proClass = "border-indigo-500/30 bg-indigo-50 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-950/20 dark:text-indigo-400";
  const ultraClass = "border-amber-500/30 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-400";
  const interviewLabel = u.sub_plan_interview === "pro_interview" ? "Interview Pro"
    : u.sub_plan_interview === "ultra_interview" ? "Interview Ultra"
    : "Interview Free";
  const interviewClass = u.sub_plan_interview === "pro_interview" ? proClass
    : u.sub_plan_interview === "ultra_interview" ? ultraClass
    : freeClass;
  const cvLabel = u.sub_plan_cv === "pro_cv" ? "CV Pro"
    : u.sub_plan_cv === "ultra_cv" ? "CV Ultra"
    : "CV Free";
  const cvClass = u.sub_plan_cv === "pro_cv" ? proClass
    : u.sub_plan_cv === "ultra_cv" ? ultraClass
    : freeClass;
  return (
    <div className="flex flex-wrap gap-1.5">
      <Badge variant="outline" className={`font-semibold text-xs ${interviewClass}`}>{interviewLabel}</Badge>
      <Badge variant="outline" className={`font-semibold text-xs ${cvClass}`}>{cvLabel}</Badge>
    </div>
  );
}

const PAGE_SIZE = 10;

// Ngưỡng cảnh báo tải
const SCALE_THRESHOLDS = [
  {
    min: 500,
    max: 999,
    level: "warning" as const,
    color: "amber",
    icon: TrendingUp,
    title: "⚠️ Cảnh báo: Lượng người dùng đang tăng",
    desc: "Hệ thống đang có {n} người dùng. Cần theo dõi hiệu suất server và cân nhắc tối ưu hóa database.",
    actions: ["Kiểm tra query performance", "Thêm database index nếu cần", "Monitor RAM/CPU server"],
  },
  {
    min: 1000,
    max: 4999,
    level: "alert" as const,
    color: "orange",
    icon: Server,
    title: "🔶 Cảnh báo cao: Cần mở rộng hệ thống",
    desc: "Hệ thống đang có {n} người dùng. Đây là thời điểm cần nâng cấp để tránh sập web.",
    actions: [
      "Nâng cấp plan hosting/cloud (RAM ≥ 4GB)",
      "Bật connection pooling cho PostgreSQL (PgBouncer)",
      "Cân nhắc CDN cho static assets",
      "Thiết lập Redis cache cho session",
    ],
  },
  {
    min: 5000,
    max: Infinity,
    level: "critical" as const,
    color: "rose",
    icon: Zap,
    title: "🚨 NGHIÊM TRỌNG: Cần mở rộng ngay lập tức",
    desc: "Hệ thống đang có {n} người dùng — ngưỡng rủi ro cao. Web có thể bị sập nếu không hành động.",
    actions: [
      "Nâng cấp server lên ít nhất 8GB RAM, 4 CPU cores",
      "Triển khai Load Balancer (Nginx / AWS ALB)",
      "Sharding hoặc Read Replica cho PostgreSQL",
      "Bật auto-scaling trên cloud provider",
      "Thiết lập monitoring & alerting (Grafana/Datadog)",
      "Cân nhắc microservices cho các module nặng (AI, interview)",
    ],
  },
];

const adminNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <BarChart3 className="h-5 w-5" />, href: "/admin/dashboard" },
  { label: "Quản lý người dùng", icon: <Users className="h-5 w-5" />, href: "/admin/users" },
  { label: "Tài chính", icon: <CreditCard className="h-5 w-5" />, href: "/admin/finance" },
  { label: "Khuyến mãi", icon: <Flame className="h-5 w-5" />, href: "/admin/promotions" },
  { label: "Bảo mật", icon: <ShieldAlert className="h-5 w-5" />, href: "/admin/security" },
  { label: "User Activity", icon: <Activity className="h-5 w-5" />, href: "/admin/user-activity" },
  { label: "Bảo trì", icon: <Wrench className="h-5 w-5" />, href: "/admin/maintenance" },
];

const TabButton = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer ${
      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    }`}
  >
    {label}
  </button>
);

export default function UserManagementPage() {
  const { user, logout } = useAuth();
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"user" | "manager" | "admin" | "locked">("user");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [tabCounts, setTabCounts] = useState<{ total: number; user: number; manager: number; admin: number; locked: number }>({
    total: 0,
    user: 0,
    manager: 0,
    admin: 0,
    locked: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const [confirmStatusAction, setConfirmStatusAction] = useState<{ user: AdminUser; targetStatus: "active" | "locked" } | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [confirmGrantUltra, setConfirmGrantUltra] = useState<AdminUser | null>(null);
  const [grantingUltra, setGrantingUltra] = useState(false);
  const [confirmRevokeUltra, setConfirmRevokeUltra] = useState<AdminUser | null>(null);
  const [revokingUltra, setRevokingUltra] = useState(false);
  const [showScaleModal, setShowScaleModal] = useState(false);
  const [dismissedAlert, setDismissedAlert] = useState(false);

  const [onlineUsers, setOnlineUsers] = useState(0);
  const [maxConcurrentLimit, setMaxConcurrentLimit] = useState(200);
  const [updatingCapacity, setUpdatingCapacity] = useState(false);

  const adminHeaders = useMemo(
    () => ({ "x-user-role": user?.role ?? "", "x-user-id": user?.id ?? "" }),
    [user?.id, user?.role],
  );

  const loadStats = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/stats", { headers: adminHeaders });
      if (response.ok) {
        const stats = await response.json();
        setOnlineUsers(stats.online_users ?? 0);
        setMaxConcurrentLimit(stats.max_concurrent_limit ?? 200);
      }
    } catch (err) {
      console.error("Lỗi khi tải stats:", err);
    }
  }, [adminHeaders]);

  const loadData = useCallback(async (page = 1, tab = activeTab, search = searchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        page: String(page),
        tab,
      });
      if (search.trim()) {
        params.set("search", search.trim());
      }
      const response = await fetch(`/api/admin/users?${params.toString()}`, { headers: adminHeaders });
      if (!response.ok) throw new Error("Không thể tải danh sách người dùng.");
      const data = (await response.json()) as UsersResponse;
      setAllUsers(data.users);
      setTotalUsers(data.total);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.page || page);
      if (data.counts) {
        setTabCounts(data.counts);
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Đã có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  }, [adminHeaders, activeTab, searchQuery]);

  const updateCapacityLimit = useCallback(async (limitVal: number) => {
    setUpdatingCapacity(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/settings/capacity", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...adminHeaders,
        },
        body: JSON.stringify({ limit: limitVal }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Không thể cập nhật giới hạn tải trọng.");
      }
      const data = await response.json();
      setMaxConcurrentLimit(data.limit);
      await loadStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    } finally {
      setUpdatingCapacity(false);
    }
  }, [adminHeaders, loadStats]);

  useEffect(() => {
    void loadData(1, "user", "");
    void loadStats();
  }, [loadStats]);

  const handleTabChange = (newTab: "user" | "manager" | "admin" | "locked") => {
    setActiveTab(newTab);
    setCurrentPage(1);
    void loadData(1, newTab, searchQuery);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const queryTerm = searchInput.trim();
    setSearchQuery(queryTerm);
    setCurrentPage(1);
    void loadData(1, activeTab, queryTerm);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
    void loadData(1, activeTab, "");
  };

  const handleConfirmStatusAction = useCallback(async () => {
    if (!confirmStatusAction) return;
    const { user, targetStatus } = confirmStatusAction;
    setStatusUpdating(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/users/${user.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...adminHeaders },
        body: JSON.stringify({ status: targetStatus }),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || errData.message || "Cập nhật trạng thái thất bại.");
      }
      setConfirmStatusAction(null);
      await loadData(currentPage, activeTab, searchQuery);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    } finally {
      setStatusUpdating(false);
    }
  }, [confirmStatusAction, adminHeaders, loadData, currentPage, activeTab, searchQuery]);

  const handleConfirmGrantUltra = useCallback(async () => {
    if (!confirmGrantUltra) return;
    setGrantingUltra(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/users/${confirmGrantUltra.id}/grant-ultra`, {
        method: "POST",
        headers: adminHeaders,
      });
      if (!response.ok) throw new Error("Nâng cấp Ultra thất bại.");
      setConfirmGrantUltra(null);
      setSuccessMessage(`Đã nâng cấp ${confirmGrantUltra.email} lên Ultra vĩnh viễn thành công!`);
      await loadData(currentPage, activeTab, searchQuery);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    } finally {
      setGrantingUltra(false);
    }
  }, [confirmGrantUltra, adminHeaders, loadData, currentPage, activeTab, searchQuery]);

  const handleConfirmRevokeUltra = useCallback(async () => {
    if (!confirmRevokeUltra) return;
    setRevokingUltra(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/users/${confirmRevokeUltra.id}/revoke-ultra`, {
        method: "POST",
        headers: adminHeaders,
      });
      if (!response.ok) throw new Error("Hủy Ultra thất bại.");
      setConfirmRevokeUltra(null);
      setSuccessMessage(`Đã hủy gói Ultra của ${confirmRevokeUltra.email}, tài khoản đã chuyển về Free.`);
      await loadData(currentPage, activeTab, searchQuery);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    } finally {
      setRevokingUltra(false);
    }
  }, [confirmRevokeUltra, adminHeaders, loadData, currentPage, activeTab, searchQuery]);

  const handleLogout = useCallback(() => {
    logout();
    window.location.assign("/");
  }, [logout]);

  const filteredUsers = allUsers;
  const lockedCount = tabCounts.locked;

  // Tìm ngưỡng cảnh báo phù hợp dựa trên số lượng người dùng đồng thời (online)
  const activeThreshold = useMemo(() => {
    const ratio = onlineUsers / (maxConcurrentLimit || 1);
    if (ratio >= 1.0) {
      return {
        level: "critical" as const,
        color: "rose" as const,
        icon: Zap,
        title: "🚨 NGHIÊM TRỌNG: Quá tải hệ thống!",
        desc: `Hệ thống đang có ${onlineUsers} người dùng online (Giới hạn hiện tại: ${maxConcurrentLimit === 999999 ? "Vô hạn" : maxConcurrentLimit}). Web có thể bị sập nếu không hành động.`,
        actions: [
          "Tăng giới hạn tải trọng hệ thống lập tức (Click nút 'Mở rộng tải trọng')",
          "Nâng cấp server lên ít nhất 8GB RAM, 4 CPU cores",
          "Bật auto-scaling trên cloud provider",
          "Thiết lập Load Balancer (Nginx / AWS ALB)",
        ],
      };
    } else if (ratio >= 0.9) {
      return {
        level: "alert" as const,
        color: "orange" as const,
        icon: Server,
        title: "🔶 Cảnh báo cao: Hệ thống gần đạt giới hạn tải trọng",
        desc: `Hệ thống đang có ${onlineUsers} người dùng online (Giới hạn hiện tại: ${maxConcurrentLimit === 999999 ? "Vô hạn" : maxConcurrentLimit}). Cần nâng cấp để tránh sập web.`,
        actions: [
          "Nâng cấp giới hạn tải trọng hệ thống lên mức cao hơn",
          "Nâng cấp plan hosting/cloud (RAM ≥ 4GB)",
          "Bật connection pooling cho PostgreSQL (PgBouncer)",
          "Thiết lập Redis cache cho session",
        ],
      };
    } else if (ratio >= 0.8) {
      return {
        level: "warning" as const,
        color: "amber" as const,
        icon: TrendingUp,
        title: "⚠️ Cảnh báo: Lượng người dùng online đang tăng",
        desc: `Hệ thống đang có ${onlineUsers} người dùng online (Giới hạn hiện tại: ${maxConcurrentLimit === 999999 ? "Vô hạn" : maxConcurrentLimit}). Cần theo dõi hiệu suất.`,
        actions: [
          "Kiểm tra query performance",
          "Thêm database index nếu cần",
          "Monitor RAM/CPU server",
          "Cân nhắc mở rộng giới hạn tải trọng hệ thống",
        ],
      };
    }
    return null;
  }, [onlineUsers, maxConcurrentLimit]);

  const colorMap = {
    amber: { bg: "bg-amber-50 dark:bg-amber-950/20", border: "border-amber-400/40", text: "text-amber-700 dark:text-amber-400", btn: "bg-amber-500 hover:bg-amber-600" },
    orange: { bg: "bg-orange-50 dark:bg-orange-950/20", border: "border-orange-400/40", text: "text-orange-700 dark:text-orange-400", btn: "bg-orange-500 hover:bg-orange-600" },
    rose:   { bg: "bg-rose-50 dark:bg-rose-950/20",   border: "border-rose-400/40",   text: "text-rose-700 dark:text-rose-400",   btn: "bg-rose-500 hover:bg-rose-600" },
  } as const;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader navItems={adminNavItems} activePath="/admin/users" role="admin" onLogout={handleLogout} />

      <main className="pt-16 min-h-screen transition-all duration-300">
        <div className="p-6 lg:p-8 space-y-6" style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}>

          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                <Users className="h-4 w-4" /> Quản lý người dùng
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Tài khoản hệ thống</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Tổng cộng <span className="font-bold text-foreground">{(tabCounts.total || totalUsers).toLocaleString("vi-VN")}</span> tài khoản
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowScaleModal(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  activeThreshold
                    ? `${colorMap[activeThreshold.color].bg} ${colorMap[activeThreshold.color].border} ${colorMap[activeThreshold.color].text} animate-pulse`
                    : "bg-secondary border-border text-foreground hover:bg-secondary/80 hover:text-foreground"
                }`}
              >
                {activeThreshold ? <activeThreshold.icon className="h-4 w-4" /> : <Server className="h-4 w-4" />}
                Quản lý tải trọng ({onlineUsers}/{maxConcurrentLimit === 999999 ? "∞" : maxConcurrentLimit})
              </button>
              <Button
                onClick={() => window.location.assign("/admin/create-content-manager")}
                className="rounded-xl flex items-center gap-2 bg-gradient-to-r from-primary to-accent-mint hover:opacity-90 text-white shadow-md shadow-primary/20 transition-all duration-300"
              >
                <UserPlus className="h-4 w-4" /> Tạo Manager
              </Button>
            </div>
          </div>

          {/* Scale alert banner */}
          {activeThreshold && !dismissedAlert && (
            <div className={`flex items-start gap-4 rounded-2xl border p-4 ${colorMap[activeThreshold.color].bg} ${colorMap[activeThreshold.color].border}`}>
              <activeThreshold.icon className={`h-5 w-5 shrink-0 mt-0.5 ${colorMap[activeThreshold.color].text}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${colorMap[activeThreshold.color].text}`}>{activeThreshold.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {activeThreshold.desc}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowScaleModal(true)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-colors ${colorMap[activeThreshold.color].btn}`}
                >
                  Xem hướng dẫn
                </button>
                <button onClick={() => setDismissedAlert(true)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <Card className="border-destructive/30 bg-destructive/10">
              <CardContent className="flex items-center gap-3 p-4">
                <Shield className="h-5 w-5 text-destructive shrink-0" />
                <div>
                  <h4 className="font-bold text-destructive text-sm">Lỗi thao tác</h4>
                  <p className="text-sm text-destructive/70">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success Toast */}
          {successMessage && (
            <div className="fixed top-4 right-4 z-[200] animate-slide-in-up">
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-400/40 bg-emerald-50 p-4 shadow-lg dark:bg-emerald-950/20 max-w-sm">
                <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200 flex-1">{successMessage}</p>
                <button onClick={() => setSuccessMessage(null)} className="text-emerald-600/50 hover:text-emerald-700 dark:text-emerald-300/50 dark:hover:text-emerald-200 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Users table */}
          <Card className="border border-border/40 bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-4 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 border border-primary/20 p-2.5">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold">
                      {activeTab === "user"
                        ? "Tài khoản User"
                        : activeTab === "manager"
                        ? "Tài khoản Content Manager"
                        : activeTab === "admin"
                        ? "Tài khoản Administrator"
                        : "Tài khoản Bị khóa"}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Trang {currentPage}/{totalPages} — {allUsers.length} hiển thị / {totalUsers.toLocaleString("vi-VN")}{" "}
                      {activeTab === "user" ? "user" : "tài khoản"}
                      {searchQuery && <span className="font-medium text-primary"> (khớp từ khóa "{searchQuery}")</span>}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex bg-muted/30 rounded-xl p-1 border border-border/30 flex-wrap gap-1">
                  <TabButton
                    label={`User${tabCounts.user > 0 ? ` (${tabCounts.user})` : ""}`}
                    isActive={activeTab === "user"}
                    onClick={() => handleTabChange("user")}
                  />
                  <TabButton
                    label={`Managers${tabCounts.manager > 0 ? ` (${tabCounts.manager})` : ""}`}
                    isActive={activeTab === "manager"}
                    onClick={() => handleTabChange("manager")}
                  />
                  <TabButton
                    label={`Admins${tabCounts.admin > 0 ? ` (${tabCounts.admin})` : ""}`}
                    isActive={activeTab === "admin"}
                    onClick={() => handleTabChange("admin")}
                  />
                  <TabButton
                    label={`Bị khóa${tabCounts.locked > 0 ? ` (${tabCounts.locked})` : ""}`}
                    isActive={activeTab === "locked"}
                    onClick={() => handleTabChange("locked")}
                  />
                </div>
              </div>

              {/* Search Bar section */}
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm theo email, ID tài khoản..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-9 pr-9 h-10 rounded-xl bg-background border-border/60 text-sm focus-visible:ring-primary"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                      title="Xóa tìm kiếm"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium flex items-center gap-2 w-full sm:w-auto shrink-0 shadow-sm transition-all cursor-pointer"
                >
                  <Search className="h-4 w-4" />
                  Tìm kiếm
                </Button>
                {searchQuery && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClearSearch}
                    className="h-10 px-4 rounded-xl border-border/60 text-muted-foreground hover:text-foreground text-xs shrink-0 cursor-pointer"
                  >
                    Xóa lọc
                  </Button>
                )}
              </form>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
              ) : allUsers.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <HelpCircle className="h-10 w-10 text-muted-foreground/30 mx-auto" />
                  <p className="text-muted-foreground font-medium text-sm">
                    {searchQuery
                      ? `Không tìm thấy tài khoản nào khớp với từ khóa "${searchQuery}"`
                      : "Không có tài khoản nào trong danh mục này"}
                  </p>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearSearch}
                      className="rounded-xl text-xs cursor-pointer"
                    >
                      Xóa bộ lọc tìm kiếm
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-muted/20 border-b border-border/30 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      <tr>
                        <th className="px-5 py-4">Tài khoản</th>
                        <th className="px-5 py-4">Vai trò</th>
                        <th className="px-5 py-4">Trạng thái</th>
                        <th className="px-5 py-4">Gói User</th>
                        <th className="px-5 py-4 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y border-border/30">
                      {allUsers.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/5 transition-colors duration-150">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/20 text-sm font-bold text-primary">
                                {item.email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{item.email}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-2">
                                  <span>ID: {item.id.slice(0, 8)}</span>
                                  {(() => {
                                    const providerConfig = getAuthProviderConfig(item.auth_provider);
                                    const ProviderIcon = providerConfig.icon;
                                    return (
                                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border ${providerConfig.className}`}>
                                        <ProviderIcon className="h-3 w-3" />
                                        {providerConfig.label}
                                      </span>
                                    );
                                  })()}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <Badge variant="outline" className={`font-semibold text-xs ${
                              item.role === "content_manager"
                                ? "border-purple-500/30 bg-purple-50 text-purple-700 dark:border-purple-500/30 dark:bg-purple-950/20 dark:text-purple-400"
                                : item.role === "admin"
                                  ? "border-rose-500/30 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/20 dark:text-rose-400"
                                  : "border-slate-500/30 bg-slate-50 text-slate-700 dark:border-slate-500/30 dark:bg-slate-950/20 dark:text-slate-400"
                            }`}>
                              {item.role === "content_manager" ? "Content Manager" : item.role === "admin" ? "Administrator" : "User"}
                            </Badge>
                          </td>
                          <td className="px-5 py-4">
                            <Badge variant="outline" className={`font-semibold text-xs ${
                              item.status === "active"
                                ? "border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/20 dark:text-emerald-400"
                                : "border-amber-500/30 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-400"
                            }`}>
                              {item.status === "active" ? "Đang hoạt động" : "Bị khóa"}
                            </Badge>
                          </td>
                          <td className="px-5 py-4">
                            {renderPlanBadges(item)}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2 justify-center flex-wrap">
                              {/* Khóa — chỉ với user/manager đang active */}
                              {item.status === "active" && item.role !== "admin" && (
                                <button
                                  onClick={() => setConfirmStatusAction({ user: item, targetStatus: "locked" })}
                                  disabled={item.id === user?.id}
                                  title={item.id === user?.id ? "Không thể tự khóa chính mình" : "Khóa tài khoản"}
                                  className={`flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-950/40 transition-all duration-200 cursor-pointer ${item.id === user?.id ? "opacity-40 cursor-not-allowed" : ""}`}
                                >
                                  <Lock className="h-3.5 w-3.5" /> Khóa
                                </button>
                              )}
                              {/* Mở khóa — cho tất cả bị locked (kể cả admin bị lỡ) */}
                              {item.status === "locked" && (
                                <button
                                  onClick={() => setConfirmStatusAction({ user: item, targetStatus: "active" })}
                                  disabled={item.id === user?.id}
                                  title={item.role === "admin" ? "Mở khóa tài khoản Admin" : "Mở khóa tài khoản"}
                                  className={`flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-950/20 dark:text-emerald-400 dark:hover:bg-emerald-950/40 transition-all duration-200 cursor-pointer ${item.id === user?.id ? "opacity-40 cursor-not-allowed" : ""}`}
                                >
                                  <Unlock className="h-3.5 w-3.5" /> Mở khóa
                                </button>
                              )}
                              {/* Nhãn bảo vệ cho admin đang active */}
                              {item.status === "active" && item.role === "admin" && item.id !== user?.id && (
                                <span className="flex items-center gap-1 text-xs text-rose-500/70 font-medium italic">
                                  <Shield className="h-3 w-3" /> Được bảo vệ
                                </span>
                              )}
                              {item.role === "user" && (
                                isUltraPermanent(item) ? (
                                    <button
                                      onClick={() => setConfirmRevokeUltra(item)}
                                      className="flex items-center gap-1.5 rounded-md border border-rose-500/30 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-all duration-200 cursor-pointer"
                                    >
                                      <X className="h-3.5 w-3.5" /> Hủy Ultra
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => setConfirmGrantUltra(item)}
                                      className="flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-950/40 transition-all duration-200 cursor-pointer"
                                    >
                                      <Crown className="h-3.5 w-3.5" /> Nâng Ultra vĩnh viễn
                                    </button>
                                  )
                                )}

                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {!loading && totalUsers > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-border/30">
                  <span className="text-xs text-muted-foreground">
                    Trang <span className="font-semibold text-foreground">{currentPage}</span> / {totalPages} &nbsp;·&nbsp;
                    Hiển thị <span className="font-semibold text-foreground">{Math.min((currentPage - 1) * PAGE_SIZE + 1, totalUsers)}</span> - <span className="font-semibold text-foreground">{Math.min(currentPage * PAGE_SIZE, totalUsers)}</span> trên tổng <span className="font-semibold text-foreground">{totalUsers.toLocaleString("vi-VN")}</span> tài khoản
                  </span>
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => void loadData(currentPage - 1, activeTab, searchQuery)}
                        disabled={currentPage <= 1 || loading}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border/40 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" /> Trước
                      </button>
                      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                        const p = totalPages <= 7 ? i + 1 : currentPage <= 4 ? i + 1 : currentPage >= totalPages - 3 ? totalPages - 6 + i : currentPage - 3 + i;
                        return (
                          <button
                            key={p}
                            onClick={() => void loadData(p, activeTab, searchQuery)}
                            className={`w-8 h-8 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                              p === currentPage ? "bg-primary text-white font-bold" : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => void loadData(currentPage + 1, activeTab, searchQuery)}
                        disabled={currentPage >= totalPages || loading}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border/40 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                      >
                        Tiếp <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Grant Ultra confirm modal */}
      {confirmGrantUltra && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !grantingUltra && setConfirmGrantUltra(null)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slide-in-up">
            <div className="flex items-center gap-4 p-6 border-b border-border/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
                <Crown className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Nâng cấp lên Ultra vĩnh viễn</h2>
                <p className="text-xs text-muted-foreground">Thao tác này sẽ cấp gói Ultra không giới hạn thời gian</p>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-sm leading-relaxed">
                Tài khoản <span className="font-bold">{confirmGrantUltra.email}</span> sẽ được cấp gói Ultra (Phỏng vấn + Tạo CV){" "}
                <span className="font-semibold text-amber-600 dark:text-amber-400">KHÔNG GIỚI HẠN THỜI GIAN</span>, không qua thanh toán.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border/50">
              <button
                onClick={() => setConfirmGrantUltra(null)}
                disabled={grantingUltra}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => void handleConfirmGrantUltra()}
                disabled={grantingUltra}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white transition-colors cursor-pointer disabled:opacity-70"
              >
                {grantingUltra ? <div className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Crown className="h-3.5 w-3.5" />}
                {grantingUltra ? "Đang nâng cấp..." : "Xác nhận nâng cấp"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Ultra confirm modal */}
      {confirmRevokeUltra && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !revokingUltra && setConfirmRevokeUltra(null)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slide-in-up">
            <div className="flex items-center gap-4 p-6 border-b border-border/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 shrink-0">
                <AlertTriangle className="h-6 w-6 text-rose-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Hủy gói Ultra</h2>
                <p className="text-xs text-muted-foreground">Thao tác này sẽ thu hồi gói Ultra ngay lập tức</p>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-sm leading-relaxed">
                Tài khoản <span className="font-bold">{confirmRevokeUltra.email}</span> sẽ bị thu hồi gói Ultra và{" "}
                <span className="font-semibold text-rose-600 dark:text-rose-400">CHUYỂN VỀ GÓI MIỄN PHÍ NGAY LẬP TỨC</span>.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border/50">
              <button
                onClick={() => setConfirmRevokeUltra(null)}
                disabled={revokingUltra}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => void handleConfirmRevokeUltra()}
                disabled={revokingUltra}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-rose-500 hover:bg-rose-600 text-white transition-colors cursor-pointer disabled:opacity-70"
              >
                {revokingUltra ? <div className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <X className="h-3.5 w-3.5" />}
                {revokingUltra ? "Đang hủy..." : "Xác nhận hủy"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status change confirm modal (Lock/Unlock) */}
      {confirmStatusAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !statusUpdating && setConfirmStatusAction(null)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slide-in-up">
            {confirmStatusAction.targetStatus === "locked" ? (
              <>
                <div className="flex items-center gap-4 p-6 border-b border-border/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
                    <Lock className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Khóa tài khoản</h2>
                    <p className="text-xs text-muted-foreground">Thao tác này sẽ vô hiệu hóa đăng nhập</p>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <p className="text-sm leading-relaxed">
                    Bạn có chắc chắn muốn khóa tài khoản{" "}
                    <span className="font-bold">{confirmStatusAction.user.email}</span>?
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Tài khoản này sẽ không thể đăng nhập cho đến khi được mở khóa lại.
                  </p>
                </div>
                <div className="flex items-center justify-end gap-3 p-6 border-t border-border/50">
                  <button onClick={() => setConfirmStatusAction(null)} disabled={statusUpdating} className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50">
                    Hủy bỏ
                  </button>
                  <button onClick={() => void handleConfirmStatusAction()} disabled={statusUpdating} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white transition-colors cursor-pointer disabled:opacity-70">
                    {statusUpdating ? <div className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Lock className="h-3.5 w-3.5" />}
                    {statusUpdating ? "Đang khóa..." : "Xác nhận khóa"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 p-6 border-b border-border/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                    <Unlock className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Mở khóa tài khoản</h2>
                    <p className="text-xs text-muted-foreground">Thao tác này sẽ khôi phục quyền đăng nhập</p>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <p className="text-sm leading-relaxed">
                    Bạn có chắc chắn muốn mở khóa tài khoản{" "}
                    <span className="font-bold">{confirmStatusAction.user.email}</span>?
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Tài khoản sẽ có thể đăng nhập trở lại bình thường.
                  </p>
                </div>
                <div className="flex items-center justify-end gap-3 p-6 border-t border-border/50">
                  <button onClick={() => setConfirmStatusAction(null)} disabled={statusUpdating} className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50">
                    Hủy bỏ
                  </button>
                  <button onClick={() => void handleConfirmStatusAction()} disabled={statusUpdating} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-colors cursor-pointer disabled:opacity-70">
                    {statusUpdating ? <div className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Unlock className="h-3.5 w-3.5" />}
                    {statusUpdating ? "Đang mở khóa..." : "Xác nhận mở khóa"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Scale alert modal */}
      {showScaleModal && (() => {
        const modalInfo = activeThreshold || {
          level: "normal" as const,
          color: "amber" as const,
          icon: Server,
          title: "⚙️ Quản lý tải trọng hệ thống",
          desc: `Hệ thống đang hoạt động bình thường với ${onlineUsers} người dùng online (Giới hạn hiện tại: ${maxConcurrentLimit === 999999 ? "Vô hạn" : maxConcurrentLimit}).`,
          actions: [
            "Bạn có thể mở rộng tải trọng hệ thống trước khi có lượng truy cập lớn.",
            "Thực hiện tối ưu hóa database index định kỳ để tránh quá tải database.",
            "Theo dõi mức sử dụng RAM/CPU của máy chủ định kỳ.",
          ],
        };

        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowScaleModal(false)} />
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
              <div className={`flex items-center gap-4 p-6 border-b border-border/50 rounded-t-2xl ${colorMap[modalInfo.color].bg}`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${colorMap[modalInfo.color].bg} border ${colorMap[modalInfo.color].border}`}>
                  <modalInfo.icon className={`h-6 w-6 ${colorMap[modalInfo.color].text}`} />
                </div>
                <div className="flex-1">
                  <h2 className={`text-base font-bold ${colorMap[modalInfo.color].text}`}>{modalInfo.title}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {modalInfo.desc}
                  </p>
                </div>
                <button onClick={() => setShowScaleModal(false)} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-muted/40 border border-border/30 p-3 text-center">
                    <p className="text-lg font-black">{onlineUsers.toLocaleString("vi-VN")}</p>
                    <p className="text-xs text-muted-foreground">Người dùng online</p>
                  </div>
                  <div className="rounded-xl bg-muted/40 border border-border/30 p-3 text-center">
                    <p className="text-lg font-black">{maxConcurrentLimit === 999999 ? "∞" : maxConcurrentLimit.toLocaleString("vi-VN")}</p>
                    <p className="text-xs text-muted-foreground">Giới hạn tải trọng</p>
                  </div>
                  <div className="rounded-xl bg-muted/40 border border-border/30 p-3 text-center">
                    <p className={`text-lg font-black ${colorMap[modalInfo.color].text}`}>
                      {modalInfo.level === "warning" ? "⚠️" : modalInfo.level === "alert" ? "🔶" : modalInfo.level === "critical" ? "🚨" : "✅"}
                    </p>
                    <p className="text-xs text-muted-foreground">Mức cảnh báo</p>
                  </div>
                </div>

                {/* Capacity Upgrade Area */}
                <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
                  <h3 className="text-sm font-bold flex items-center gap-2 text-primary">
                    <Zap className="h-4 w-4" /> Mở rộng tải trọng dự án
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Chọn giới hạn số lượng người dùng cùng lúc (concurrent users) để nâng cấp hạ tầng ảo của hệ thống.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[200, 500, 1000, 5000, 999999].map((limitVal) => {
                      const label = limitVal === 999999 ? "Vô hạn (Enterprise)" : `${limitVal} Users`;
                      const isActive = maxConcurrentLimit === limitVal;
                      return (
                        <button
                          key={limitVal}
                          disabled={updatingCapacity}
                          onClick={() => void updateCapacityLimit(limitVal)}
                          className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                            isActive
                              ? "bg-primary text-white border-primary shadow-sm"
                              : "bg-background hover:bg-secondary border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {limitVal === 999999 && updatingCapacity && maxConcurrentLimit !== limitVal ? (
                            <div className="h-3 w-3 border-2 border-primary/20 border-t-primary rounded-full animate-spin inline-block mr-1" />
                          ) : null}
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <Server className="h-4 w-4 text-primary" /> Hành động được khuyến nghị
                  </h3>
                  <div className="space-y-2">
                    {modalInfo.actions.map((action, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl bg-muted/30 border border-border/30 px-4 py-3">
                        <span className={`text-xs font-black shrink-0 mt-0.5 ${colorMap[modalInfo.color].text}`}>{i + 1}.</span>
                        <p className="text-sm">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick links */}
                <div>
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" /> Tài nguyên tham khảo
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "NeonDB Scaling", href: "https://neon.tech/docs/guides/scaling" },
                      { label: "Render.com Plans", href: "https://render.com/pricing" },
                      { label: "PgBouncer Setup", href: "https://www.pgbouncer.org/config.html" },
                      { label: "Redis Cache", href: "https://redis.io/docs/getting-started/" },
                      { label: "Cloudflare CDN", href: "https://www.cloudflare.com/cdn/" },
                      { label: "Database Indexes", href: "https://www.postgresql.org/docs/current/indexes.html" },
                    ].map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-border/40 px-3 py-2 text-xs font-medium hover:bg-muted/30 transition-colors"
                      >
                        <Database className="h-3 w-3 text-primary" /> {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 border-t border-border/50">
                <button
                  onClick={() => { setShowScaleModal(false); setDismissedAlert(true); }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Đóng & ẩn cảnh báo hôm nay
                </button>
                <button
                  onClick={() => setShowScaleModal(false)}
                  className="px-5 py-2 rounded-lg text-sm font-medium bg-primary hover:bg-primary/90 text-white transition-colors cursor-pointer"
                >
                  Đã hiểu
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
