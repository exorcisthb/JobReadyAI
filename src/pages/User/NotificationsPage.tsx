import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, Info, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { useAuth } from "@/components/auth-provider";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserNavItems } from "@/pages/User/user-nav-items";

type Notification = {
  id: string;
  sender_name: string;
  sender_role: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  is_read: boolean;
  created_at: string;
  link?: string;
};

const PAGE_SIZE = 5;

export default function NotificationsPage() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const userNavItems = useUserNavItems();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetch("/api/notification", {
        headers: { "x-user-id": user.id, "x-user-role": user.role || "user" },
      });
      if (response.ok) setNotifications((await response.json()).notifications || []);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.role]);

  useEffect(() => {
    void fetchNotifications();
    const interval = window.setInterval(fetchNotifications, 30000);
    return () => window.clearInterval(interval);
  }, [fetchNotifications]);

  const totalPages = Math.max(1, Math.ceil(notifications.length / PAGE_SIZE));
  const visibleNotifications = useMemo(
    () => notifications.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [notifications, page],
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const setReadState = async (notification: Notification, isRead: boolean) => {
    if (notification.is_read === isRead || !user?.id) return;
    try {
      const response = await fetch("/api/notification/read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
          "x-user-role": user.role || "user",
        },
        body: JSON.stringify({ id: notification.id, is_read: isRead }),
      });
      if (response.ok) {
        const updatedNotifications = notifications.map((item) => item.id === notification.id ? { ...item, is_read: isRead } : item);
        setNotifications(updatedNotifications);
        window.dispatchEvent(new CustomEvent("jobready:notification-status-changed", {
          detail: {
            id: notification.id,
            is_read: isRead,
            unreadCount: updatedNotifications.filter((item) => !item.is_read).length,
          },
        }));
      }
    } catch (error) {
      console.error("Failed to update notification status:", error);
    }
  };

  const openNotification = async (notification: Notification) => {
    await setReadState(notification, true);
    if (notification.link) {
      if (/^https?:\/\//i.test(notification.link)) window.open(notification.link, "_blank", "noopener,noreferrer");
      else window.location.assign(notification.link);
    }
  };

  const role = user?.role === "admin" || user?.role === "content_manager" ? user.role : "user";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader navItems={userNavItems} activePath="/notifications" role={role} onLogout={logout} hideSidebar={role !== "user"} />
      <main className="min-h-screen pt-16 transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8" style={role === "user" ? { paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" } : undefined}>
        <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{t("header.allNotifications")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("header.notificationPageDesc")}</p>
        </div>

        {loading ? (
          <Card className="p-10 text-center text-sm text-muted-foreground">{t("interview.history.loading")}</Card>
        ) : notifications.length === 0 ? (
          <Card className="flex flex-col items-center p-6 sm:p-12 text-center">
            <Bell className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">{t("header.notificationPageEmpty")}</p>
          </Card>
        ) : (
          <>
            <div className="space-y-3">
              {visibleNotifications.map((notification) => {
                const TypeIcon = notification.type === "success" ? CheckCircle2 : notification.type === "warning" || notification.type === "error" ? AlertTriangle : Info;
                const iconTone = notification.type === "success" ? "bg-emerald-500/10 text-emerald-600" : notification.type === "warning" || notification.type === "error" ? "bg-amber-500/10 text-amber-600" : "bg-primary/10 text-primary";
                return (
                  <Card key={notification.id} className={`flex gap-3 p-4 transition-colors sm:gap-4 sm:p-5 ${notification.is_read ? "" : "border-primary/30 bg-primary/[0.03]"}`}>
                    <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${iconTone}`}>
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <button type="button" onClick={() => void openNotification(notification)} className="min-w-0 flex-1 text-left">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${notification.sender_role === "admin" ? "bg-rose-500/10 text-rose-600" : notification.sender_role === "content_manager" || notification.sender_role === "manager" ? "bg-purple-500/10 text-purple-600" : "bg-blue-500/10 text-blue-600"}`}>
                          {notification.sender_role === "admin" ? t("header.admin") : notification.sender_role === "content_manager" || notification.sender_role === "manager" ? t("header.manager") : t("header.member")}
                        </span>
                        <span className="text-xs text-muted-foreground">{notification.sender_name}</span>
                        {!notification.is_read && <span className="h-2 w-2 rounded-full bg-primary" aria-label={t("header.unread")} />}
                      </div>
                      <h2 className="font-semibold leading-snug">{notification.title}</h2>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{notification.message}</p>
                      <time className="mt-2 block text-xs text-muted-foreground">
                        {new Date(notification.created_at).toLocaleString(i18n.language.startsWith("en") ? "en-US" : "vi-VN", { dateStyle: "medium", timeStyle: "short" })}
                      </time>
                    </button>
                    <button type="button" onClick={() => void setReadState(notification, !notification.is_read)} aria-label={notification.is_read ? t("header.markUnread") : t("header.markRead")} title={notification.is_read ? t("header.markUnread") : t("header.markRead")} className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-2 text-xs text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary sm:px-3">
                      {notification.is_read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="hidden sm:inline">{notification.is_read ? t("header.markUnread") : t("header.markRead")}</span>
                    </button>
                  </Card>
                );
              })}
            </div>
            <div className="flex flex-col gap-3 border-t border-border/50 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">{t("header.notificationPage", { current: page, total: totalPages, count: notifications.length })}</p>
              <nav className="flex items-center gap-2" aria-label={t("header.allNotifications")}>
                <Button variant="outline" size="sm" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1}>
                  <ChevronLeft className="mr-1 h-4 w-4" />{t("header.previousPage")}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages}>
                  {t("header.nextPage")}<ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </nav>
            </div>
          </>
        )}
        </div>
        </div>
      </main>
    </div>
  );
}
