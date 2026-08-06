import { useEffect, useRef, useState, useCallback } from "react";
import {
  Palette,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Shield,
  User,
  PenLine,
  Home,
  Bell,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Info,
  Settings,
  Globe,
  Check,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import logoJr from "@/assets/logo.png";
import { useTheme } from "@/components/theme-provider";
import { useTranslation } from "react-i18next";
import AvatarMenu from "@/components/AvatarMenu";
import ChangePasswordModal from "@/pages/Common/ChangePasswordModal";
import UploadCVModal from "@/pages/Common/UploadCVModal";
import type { Theme } from "@/components/theme-provider";
import i18n, { updateUserLanguage } from "@/i18n";

export interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

interface DashboardHeaderProps {
  navItems: NavItem[];
  activePath?: string;
  role: "admin" | "content_manager" | "user";
  onLogout: () => void;
  hideSidebar?: boolean;
}

function ThemeOptionButton({
  opt,
  currentTheme,
  onSelect,
}: {
  opt: { value: Theme; label: string; icon: React.ReactNode };
  currentTheme: Theme;
  onSelect: (value: Theme) => void;
}) {
  const { t } = useTranslation();
  return (
    <button
      onClick={() => onSelect(opt.value)}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium cursor-pointer ${
        currentTheme === opt.value
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      {opt.icon}
      {t("header.themeInterface", { label: opt.label })}
    </button>
  );
}

// Nav Item
function NavItemComponent({
  item,
  isActive,
  collapsed,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onClick: (href: string) => void;
}) {
  const isNavCV = item.href === "/cv";
  return (
    <li>
      <button
        onClick={() => onClick(item.href)}
        data-onboarding={isNavCV ? "nav-cv" : undefined}
        data-nav-label={item.label}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium w-full cursor-pointer ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        } ${collapsed ? "justify-center" : ""}`}
        title={collapsed ? item.label : undefined}
      >
        <span className={isActive ? "text-primary" : "text-muted-foreground"}>{item.icon}</span>
        {!collapsed && <span>{item.label}</span>}
      </button>
    </li>
  );
}

export function DashboardHeader({ navItems, activePath, role, onLogout, hideSidebar = false }: DashboardHeaderProps) {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarReady, setSidebarReady] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<"vi" | "en">(
    i18n.language?.startsWith("en") ? "en" : "vi"
  );
  const [currentHref, setCurrentHref] = useState(() => window.location.pathname + window.location.hash);

  useEffect(() => {
    const onLangChange = (lng: string) => {
      setCurrentLang(lng.startsWith("en") ? "en" : "vi");
    };
    i18n.on("languageChanged", onLangChange);
    return () => i18n.off("languageChanged", onLangChange);
  }, []);

  const handleLangChange = async (lang: "vi" | "en") => {
    if (lang === currentLang) return;
    if (user?.id) {
      await updateUserLanguage(user.id, lang);
    }
    setCurrentLang(lang);
    setThemeDropdownOpen(false);
  };

  interface UIIDNotification {
    id: string;
    sender_name: string;
    sender_role: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    is_read: boolean;
    created_at: string;
    link?: string;
  }

  // Notification state
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<UIIDNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Time formatter helper
  const formatRelativeTime = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return t("header.justNow");
    if (diffMins < 60) return t("header.minutesAgo", { count: diffMins });
    
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return t("header.hoursAgo", { count: diffHrs });
    
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays === 1) return t("header.yesterday");
    if (diffDays < 7) return t("header.daysAgo", { count: diffDays });
    
    return date.toLocaleDateString("vi-VN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }, [t]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetch("/api/notification", {
        headers: {
          "x-user-id": user.id,
          "x-user-role": user.role || "user",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [user]);

  // Mark all as read
  const handleMarkAllRead = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch("/api/notification/read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
          "x-user-role": user.role || "user",
        },
      });
      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  // Mark single as read
  const handleMarkOneRead = async (id: string) => {
    if (!user?.id) return;
    try {
      const response = await fetch("/api/notification/read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
          "x-user-role": user.role || "user",
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Delete notification
  const handleDeleteNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user?.id) return;
    try {
      const response = await fetch(`/api/notification/${id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": user.id,
          "x-user-role": user.role || "user",
        },
      });
      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        void fetchNotifications();
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  // Modal states
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showUploadCV, setShowUploadCV] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // User data state
  const [userData, setUserData] = useState<{
    id?: string;
    email?: string;
    name?: string;
    avatar_url?: string | null;
    auth_provider?: string;
  } | null>(null);
  const [userProfile, setUserProfile] = useState<Record<string, unknown> | null>(null);
  const [userCVs, setUserCVs] = useState<
    Array<{ id: string; title: string; file_name: string; uploaded_at: string }>
  >([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // Memoized theme options
  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: t("header.light"), icon: <Sun className="h-4 w-4 text-amber-500" /> },
    { value: "dark", label: t("header.dark"), icon: <Moon className="h-4 w-4 text-blue-400" /> },
    { value: "rose", label: t("header.rose"), icon: <Palette className="h-4 w-4 text-rose-500" /> },
  ];

  // Fetch user profile - only once
  const fetchProfile = useCallback(async () => {
    if (!user?.id || initializedRef.current) return;
    initializedRef.current = true;

    try {
      const response = await fetch("/api/dashboard/me", {
        headers: {
          "x-user-id": user.id,
          "x-user-role": user.role || "user",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        setUserProfile(data.profile);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  }, [user]);

  // Fetch user CVs
  const fetchCVs = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetch("/api/cv", {
        headers: {
          "x-user-id": user.id,
          "x-user-role": user.role || "user",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserCVs(data.cvs || []);
      }
    } catch (error) {
      console.error("Failed to fetch CVs:", error);
    }
  }, [user?.id, user?.role]);

  useEffect(() => {
    fetchProfile();
    fetchCVs();
    fetchNotifications();

    // Poll notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [fetchProfile, fetchCVs, fetchNotifications]);

  // Handle click outside for theme dropdown and notification
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setThemeDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle sidebar width
  useEffect(() => {
    setSidebarReady(false);
    const t = setTimeout(() => setSidebarReady(true), 250);
    document.documentElement.style.setProperty(
      "--sidebar-width",
      hideSidebar ? "0px" : (sidebarCollapsed ? "4rem" : "15rem"),
    );
    return () => clearTimeout(t);
  }, [sidebarCollapsed, hideSidebar]);

  useEffect(() => {
    const syncCurrentHref = () => {
      setCurrentHref(window.location.pathname + window.location.hash);
    };

    window.addEventListener("hashchange", syncCurrentHref);
    window.addEventListener("popstate", syncCurrentHref);
    return () => {
      window.removeEventListener("hashchange", syncCurrentHref);
      window.removeEventListener("popstate", syncCurrentHref);
    };
  }, []);

  // Memoized handlers
  const handleLogoutConfirm = useCallback(() => {
    setShowLogoutModal(false);
    logout();
    window.location.assign("/");
  }, [logout]);

  const handleSaveProfile = useCallback(
    async (data: Record<string, unknown>) => {
      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "",
          "x-user-role": user?.role || "",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(t("header.updateProfileFailed"));
      }

      await fetchProfile();
    },
    [user?.id, user?.role, fetchProfile],
  );


  const handleUploadCV = useCallback(
    async (file: File, title: string) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);

      const response = await fetch("/api/cv", {
        method: "POST",
        headers: {
          "x-user-id": user?.id || "",
          "x-user-role": user?.role || "",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(t("header.uploadCvFailed"));
      }

      await fetchCVs();
    },
    [user?.id, user?.role, fetchCVs],
  );

  const handleDeleteCV = useCallback(
    async (id: string) => {
      const response = await fetch(`/api/cv/${id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": user?.id || "",
          "x-user-role": user?.role || "",
        },
      });

      if (!response.ok) {
        throw new Error(t("header.deleteCvFailed"));
      }

      await fetchCVs();
    },
    [user?.id, user?.role, fetchCVs],
  );

  const handleNavClick = useCallback((href: string) => {
    window.location.assign(href);
  }, []);

  const overviewHref =
    navItems.find((item) => item.label.toLowerCase().includes("tổng quan"))?.href ||
    (role === "admin"
      ? "/admin/dashboard"
      : role === "content_manager"
        ? "/content-manager/dashboard"
        : "/user/dashboard");

  const handleThemeSelect = useCallback(
    (value: Theme) => {
      setTheme(value);
      setThemeDropdownOpen(false);
    },
    [setTheme],
  );

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  const RoleIcon = role === "admin" ? Shield : role === "content_manager" ? PenLine : User;
  const resolvedActivePath = currentHref || activePath;

  return (
    <>
      {/* Top Header Bar - Fixed, không bị ảnh hưởng bởi sidebar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-card/95 backdrop-blur-sm"
      >
        <div className="flex h-full items-center justify-between px-4 gap-4">
          {/* Left: Logo + Role Badge */}
          <div className="flex items-center gap-3">
            <a
              href={overviewHref}
              className="flex items-center gap-2 group logo-sparkle-link"
              onClick={(e) => {
                e.preventDefault();
                window.location.assign(overviewHref);
              }}
            >
              <div className="logo-sparkle-wrapper">
                <div className="logo-glow-ring" />
                <span className="logo-spark logo-spark-1" />
                <span className="logo-spark logo-spark-2" />
                <span className="logo-spark logo-spark-3" />
                <span className="logo-spark logo-spark-4" />
                <span className="logo-spark logo-spark-5" />
                <span className="logo-spark logo-spark-6" />
                <img src={logoJr} alt="JobReady AI Logo" className="logo-img" />
              </div>
              <span className="text-lg font-bold tracking-tight hidden sm:block logo-brand-text">JobReady AI</span>
            </a>

            {/* Role Badge */}
            <div
              className={`hidden lg:flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                role === "admin"
                  ? "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  : role === "content_manager"
                    ? "border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400"
                    : "border-primary/20 bg-primary/10 text-primary"
              }`}
            >
              <RoleIcon className="h-4 w-4" />
              {role === "admin"
                ? t("header.admin")
                : role === "content_manager"
                  ? t("header.contentManager")
                  : t("header.user")}
            </div>
          </div>

          {/* Right: Theme Switcher + Bell Notification + Avatar Menu */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/85 text-muted-foreground transition-all duration-300 hover:bg-secondary hover:text-foreground cursor-pointer shadow-[var(--shadow-soft)]"
                title={t("header.notifications")}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card/95 shadow-[var(--shadow-elegant)] backdrop-blur-xl animate-slide-in-up z-50">
                  <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                    <h3 className="text-sm font-semibold">{t("header.notifications")}</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-primary hover:underline cursor-pointer"
                      >
                        {t("header.markAllRead")}
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <Bell className="h-8 w-8 mb-2 opacity-30" />
                        <p className="text-xs">{t("header.noNotifications")}</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={async () => {
                            if (!notif.is_read) {
                              await handleMarkOneRead(notif.id);
                            }
                            if (notif.link) {
                              if (notif.link.startsWith("http://") || notif.link.startsWith("https://")) {
                                window.open(notif.link, "_blank");
                              } else {
                                window.location.assign(notif.link);
                              }
                            }
                          }}
                          className={`group flex gap-3 px-4 py-3 hover:bg-muted/40 transition-colors cursor-pointer border-b border-border/30 last:border-0 relative ${
                            !notif.is_read ? "bg-primary/5 font-semibold" : ""
                          }`}
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                              notif.type === "success"
                                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : notif.type === "warning"
                                  ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                  : notif.type === "error"
                                    ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                    : "bg-primary/10 text-primary"
                            }`}
                          >
                            {notif.type === "success" ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : notif.type === "warning" ? (
                              <AlertTriangle className="h-4 w-4" />
                            ) : notif.type === "error" ? (
                              <AlertTriangle className="h-4 w-4" />
                            ) : (
                              <Info className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                                notif.sender_role === "admin"
                                  ? "bg-rose-500/10 text-rose-500 font-bold"
                                  : notif.sender_role === "content_manager" || notif.sender_role === "manager"
                                  ? "bg-purple-500/10 text-purple-500 font-bold"
                                  : "bg-blue-500/10 text-blue-500 font-bold"
                              }`}>
                                {notif.sender_role === "admin"
                                  ? t("header.admin")
                                  : notif.sender_role === "content_manager" || notif.sender_role === "manager"
                                  ? t("header.manager")
                                  : t("header.member")}
                              </span>
                              <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">
                                {notif.sender_name}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-foreground truncate leading-snug">{notif.title}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal break-words">{notif.message}</p>
                            <p className="text-[9px] text-muted-foreground mt-1">{formatRelativeTime(notif.created_at)}</p>
                          </div>
                          <div className="flex flex-col items-center justify-between shrink-0 self-stretch">
                            {!notif.is_read ? (
                              <div className="h-2 w-2 rounded-full bg-primary mt-1" />
                            ) : (
                              <div className="w-2" />
                            )}
                            <button
                              onClick={(e) => handleDeleteNotification(e, notif.id)}
                              className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all p-1 rounded-md hover:bg-secondary/80 cursor-pointer"
                              title={t("header.deleteNotification")}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Combined Settings Dropdown (Theme + Language) */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="group flex items-center gap-1.5 rounded-full border border-border bg-card/85 px-3 py-1.5 text-xs font-semibold text-foreground transition-all duration-300 hover:bg-secondary cursor-pointer shadow-[var(--shadow-soft)]"
                title={t("settings.title") || "Cài đặt"}
              >
                <Settings className="h-3.5 w-3.5 text-primary transition-transform duration-500 group-hover:rotate-90" />
                <span className="hidden sm:inline">{t("settings.title") || "Cài đặt"}</span>
                <ChevronDown
                  className={`h-3 w-3 text-muted-foreground transition-transform duration-300 ${themeDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-border bg-card/95 shadow-[var(--shadow-elegant)] backdrop-blur-xl animate-slide-in-up z-50 overflow-hidden">
                  {/* Section: Giao diện */}
                  <div className="px-3 pt-3 pb-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-1.5">
                      <Palette className="h-3.5 w-3.5 text-purple-500" />
                      {t("settings.display") || "Giao diện"}
                    </p>
                    <div className="space-y-0.5">
                      {themeOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleThemeSelect(opt.value)}
                          className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                            theme === opt.value
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          {opt.icon}
                          <span className="flex-1 text-left">{opt.label}</span>
                          {theme === opt.value && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="mx-3 my-2 h-px bg-border" />

                  {/* Section: Ngôn ngữ */}
                  <div className="px-3 pb-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 mb-1.5">
                      <Globe className="h-3.5 w-3.5 text-blue-500" />
                      {t("settings.language") || "Ngôn ngữ"}
                    </p>
                    <div className="space-y-0.5">
                      {[
                        { id: "vi" as const, label: t("language.vi") || "Tiếng Việt", flag: "VN" },
                        { id: "en" as const, label: t("language.en") || "English", flag: "US" },
                      ].map(({ id, label, flag }) => (
                        <button
                          key={id}
                          onClick={() => void handleLangChange(id)}
                          className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                            currentLang === id
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${
                            id === "vi"
                              ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                              : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                          }`}>
                            {flag}
                          </span>
                          <span className="flex-1 text-left">{label}</span>
                          {currentLang === id && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar Menu */}
            <AvatarMenu
              user={{
                id: user?.id,
                name: userData?.name || user?.name || "User",
                email: userData?.email || user?.email || "",
                image: (userData?.avatar_url || userProfile?.avatar_url || user?.image) as
                  | string
                  | undefined,
                profileCompleted: userProfile?.profile_completed as boolean | undefined,
                authProvider: userData?.auth_provider,
                role: user?.role,
              }}
              onUploadCV={() => setShowUploadCV(true)}
              onLogout={() => setShowLogoutModal(true)}
            />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      {!hideSidebar && (
        <aside
          data-sidebar-ready={sidebarReady ? "true" : "false"}
          className={`fixed left-0 top-16 bottom-0 z-40 flex flex-col border-r border-border bg-card/95 backdrop-blur-sm transition-all duration-200 ${
            sidebarCollapsed ? "w-16" : "w-60"
          }`}
        >
          {/* Collapse Toggle */}
          <button
            onClick={handleToggleSidebar}
            className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-sm text-muted-foreground hover:text-foreground cursor-pointer transition-all"
            aria-label={sidebarCollapsed ? t("header.expandSidebar") : t("header.collapseSidebar")}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </button>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <NavItemComponent
                  key={item.href}
                  item={item}
                  isActive={resolvedActivePath === item.href}
                  collapsed={sidebarCollapsed}
                  onClick={handleNavClick}
                />
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          {!sidebarCollapsed && (
            <div className="border-t border-border/40 p-4">
              <p className="text-[10px] font-medium text-center text-muted-foreground/40 uppercase tracking-wider">
                JobReady AI
              </p>
            </div>
          )}
        </aside>
      )}

      {/* Modals */}
      {showChangePassword && (
        <ChangePasswordModal
          isOpen={showChangePassword}
          onClose={() => setShowChangePassword(false)}
          userEmail={user?.email}
        />
      )}

      {showUploadCV && (
        <UploadCVModal
          isOpen={showUploadCV}
          onClose={() => setShowUploadCV(false)}
          onUpload={handleUploadCV}
          existingCVs={userCVs}
          onDelete={handleDeleteCV}
        />
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slide-in-up">
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 border border-destructive/20">
                  <span className="text-lg">⚠️</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold">{t("header.logoutTitle")}</h2>
                  <p className="text-xs text-muted-foreground">{t("header.logoutConfirm")}</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm leading-relaxed">
                {t("header.logoutBody")}
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border/50">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                {t("header.cancel")}
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-5 py-2 rounded-lg text-sm font-medium bg-destructive hover:bg-destructive/90 text-white transition-colors cursor-pointer"
              >
                {t("header.logout")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
