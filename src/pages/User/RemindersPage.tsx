import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader } from "@/components/dashboard-header";
import { useUserNavItems } from "@/pages/User/user-nav-items";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Plus,
  Clock,
  Calendar,
  Trash2,
  Edit2,
  Check,
  X,
  Repeat,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Info,
} from "lucide-react";

interface Reminder {
  id: string;
  title: string;
  description: string | null;
  reminder_type: "once" | "recurring";
  frequency: string;
  day_of_week: number | null;
  day_of_month: number | null;
  time_of_day: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  next_send_at: string | null;
  last_sent_at: string | null;
  created_at: string;
}

interface ReminderLog {
  id: string;
  reminder_id: string;
  sent_at: string;
  status: "sent" | "failed";
  error_message: string | null;
}

type ToastState = {
  type: "success" | "error";
  message: string;
};

const WEEKDAYS = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];

const FREQUENCY_OPTIONS = [
  { value: "once", label: "Một lần", icon: "📅", desc: "Nhắc một lần rồi tự động tắt" },
  { value: "daily", label: "Hàng ngày", icon: "🔄", desc: "Lặp lại mỗi ngày vào giờ đã chọn" },
  { value: "weekly", label: "Hàng tuần", icon: "📆", desc: "Lặp lại vào một ngày cố định trong tuần" },
  { value: "monthly", label: "Hàng tháng", icon: "📅", desc: "Lặp lại vào một ngày cố định trong tháng" },
];

function formatTime(time: string): string {
  if (!time) return "";
  const parts = time.split(":");
  return `${parts[0]}:${parts[1]}`;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getFrequencyLabel(reminder: Reminder): string {
  if (reminder.frequency === "once") return "Một lần";
  if (reminder.frequency === "daily") return "Hàng ngày";
  if (reminder.frequency === "weekly") {
    const dayName = reminder.day_of_week !== null ? WEEKDAYS[reminder.day_of_week] : WEEKDAYS[1];
    return `Hàng tuần (${dayName})`;
  }
  if (reminder.frequency === "monthly") {
    return `Hàng tháng (ngày ${reminder.day_of_month || 1})`;
  }
  return reminder.frequency;
}

async function readApiError(response: Response, fallback: string): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data?.message === "string") return data.message;
    if (typeof data?.error === "string") return data.error;
  } catch {
    // Keep the fallback when the API returns an empty or non-JSON body.
  }
  return fallback;
}

export default function RemindersPage() {
  const { user, logout } = useAuth();

  const headers = useMemo(
    () => ({
      "x-user-id": user?.id ?? "",
      "x-user-role": user?.role ?? "user",
    }),
    [user?.id, user?.role],
  );

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Logs state
  const [visibleLogs, setVisibleLogs] = useState<Record<string, ReminderLog[]>>({});
  const [loadingLogs, setLoadingLogs] = useState<Record<string, boolean>>({});

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reminder_type: "once" as "once" | "recurring",
    frequency: "once",
    day_of_week: 1,
    day_of_month: 1,
    time_of_day: "09:00",
    start_date: "",
    end_date: "",
  });

  const fetchReminders = useCallback(async () => {
    try {
      const res = await fetch("/api/reminders", { headers });
      if (!res.ok) {
        throw new Error(
          await readApiError(res, `Không tải được lịch nhắc (HTTP ${res.status})`),
        );
      }

      const data = await res.json();
      setReminders(data);
    } catch (error) {
      console.error("Failed to fetch reminders:", error);
      setToast({
        type: "error",
        message: error instanceof Error ? error.message : "Không tải được lịch nhắc",
      });
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    if (!toast) return;
    const timeoutId = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  useEffect(() => {
    if (!user) {
      window.location.assign("/login");
      return;
    }
    void fetchReminders();
  }, [user, fetchReminders]);

  const handleLogout = useCallback(() => {
    logout();
    window.location.assign("/");
  }, [logout]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      reminder_type: "once",
      frequency: "once",
      day_of_week: 1,
      day_of_month: 1,
      time_of_day: "09:00",
      start_date: "",
      end_date: "",
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleFrequencySelect = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      frequency: value,
      reminder_type: value === "once" ? "once" : "recurring",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.time_of_day) return;

    try {
      const url = editingId ? `/api/reminders/${editingId}` : "/api/reminders";
      const method = editingId ? "PUT" : "POST";

      const payload: Record<string, unknown> = {
        title: formData.title,
        description: formData.description || null,
        reminder_type: formData.reminder_type,
        frequency: formData.frequency,
        time_of_day: formData.time_of_day,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      };

      if (formData.frequency === "weekly") {
        payload.day_of_week = formData.day_of_week;
      }
      if (formData.frequency === "monthly") {
        payload.day_of_month = formData.day_of_month;
      }

      const res = await fetch(url, {
        method,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(
          await readApiError(res, `Không lưu được lịch nhắc (HTTP ${res.status})`),
        );
      }

      void fetchReminders();
      resetForm();
      setToast({
        type: "success",
        message: editingId ? "Đã cập nhật lịch nhắc" : "Đã kích hoạt lịch nhắc",
      });
    } catch (error) {
      console.error("Failed to save reminder:", error);
      setToast({
        type: "error",
        message: error instanceof Error ? error.message : "Không lưu được lịch nhắc",
      });
    }
  };

  const handleEdit = (reminder: Reminder) => {
    setFormData({
      title: reminder.title,
      description: reminder.description || "",
      reminder_type: reminder.reminder_type,
      frequency: reminder.frequency,
      day_of_week: reminder.day_of_week !== null ? reminder.day_of_week : 1,
      day_of_month: reminder.day_of_month !== null ? reminder.day_of_month : 1,
      time_of_day: formatTime(reminder.time_of_day),
      start_date: reminder.start_date || "",
      end_date: reminder.end_date || "",
    });
    setEditingId(reminder.id);
    setShowForm(true);
    // Scroll form to view
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await fetch(`/api/reminders/${id}/toggle`, {
        method: "PATCH",
        headers,
      });
      if (!res.ok) {
        throw new Error(
          await readApiError(res, `Không đổi được trạng thái lịch nhắc (HTTP ${res.status})`),
        );
      }

      void fetchReminders();
      setToast({ type: "success", message: "Đã cập nhật trạng thái lịch nhắc" });
    } catch (error) {
      console.error("Failed to toggle reminder:", error);
      setToast({
        type: "error",
        message: error instanceof Error ? error.message : "Không đổi được trạng thái lịch nhắc",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/reminders/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) {
        throw new Error(
          await readApiError(res, `Không xóa được lịch nhắc (HTTP ${res.status})`),
        );
      }

      void fetchReminders();
      setShowDeleteConfirm(null);
      setToast({ type: "success", message: "Đã xóa lịch nhắc" });
    } catch (error) {
      console.error("Failed to delete reminder:", error);
      setToast({
        type: "error",
        message: error instanceof Error ? error.message : "Không xóa được lịch nhắc",
      });
    }
  };

  const fetchLogs = async (reminderId: string) => {
    if (visibleLogs[reminderId]) {
      // Thu lại nếu đang mở
      setVisibleLogs((prev) => {
        const copy = { ...prev };
        delete copy[reminderId];
        return copy;
      });
      return;
    }

    setLoadingLogs((prev) => ({ ...prev, [reminderId]: true }));
    try {
      const res = await fetch(`/api/reminders/${reminderId}/logs`, { headers });
      if (!res.ok) {
        throw new Error(
          await readApiError(res, `Không tải được nhật ký gửi nhắc (HTTP ${res.status})`),
        );
      }

      const data = await res.json();
      setVisibleLogs((prev) => ({ ...prev, [reminderId]: data }));
    } catch (error) {
      console.error("Failed to fetch logs:", error);
      setToast({
        type: "error",
        message: error instanceof Error ? error.message : "Không tải được nhật ký gửi nhắc",
      });
    } finally {
      setLoadingLogs((prev) => ({ ...prev, [reminderId]: false }));
    }
  };

  const activeReminders = reminders.filter((r) => r.is_active);
  const inactiveReminders = reminders.filter((r) => !r.is_active);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {toast && (
        <div
          className={`fixed right-4 top-20 z-50 max-w-sm rounded-xl border px-4 py-3 text-sm font-semibold shadow-lg ${
            toast.type === "success"
              ? "border-emerald-500/30 bg-emerald-50 text-emerald-700"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          }`}
          role="status"
        >
          {toast.message}
        </div>
      )}

      {/* Dashboard Header Bar + Left Sidebar */}
      <DashboardHeader
        navItems={useUserNavItems()}
        activePath="/reminders"
        role="user"
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="pt-16 min-h-screen transition-all duration-300">
        <div
          className="p-6 lg:p-8 space-y-8"
          style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}
        >
          {/* Page Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-primary/5 via-card to-accent-mint/5 p-6 lg:p-8">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                  <Bell className="h-4 w-4 text-primary animate-bounce" />
                  Hệ thống nhắc nhở luyện tập
                </div>
                <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">Đặt lịch nhắc định kỳ</h1>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-xl leading-relaxed">
                  Tạo thói quen rèn luyện đều đặn. Hệ thống sẽ gửi email thông báo chi tiết khi đến giờ hẹn để giúp bạn không bao giờ bỏ lỡ lộ trình chuẩn bị sự nghiệp.
                </p>
              </div>

              <Button
                onClick={() => setShowForm(!showForm)}
                className="shrink-0 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/95 hover:to-primary/75 text-white font-semibold shadow-md rounded-xl py-5 px-6 transition-all duration-300"
              >
                {showForm ? (
                  <>
                    <X className="h-4.5 w-4.5" />
                    Đóng bảng nhập
                  </>
                ) : (
                  <>
                    <Plus className="h-4.5 w-4.5" />
                    Tạo lịch nhắc mới
                  </>
                )}
              </Button>
            </div>
            {/* Decorative blurry backgrounds */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          </div>

          {/* Quick Informational Alert Box */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex gap-3 text-sm text-muted-foreground leading-relaxed">
            <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground">Kênh thông báo:</span> Tất cả lời nhắc sẽ được gửi trực tiếp đến hộp thư điện tử đã đăng ký của bạn (<span className="text-primary font-medium">{user?.email}</span>) với giao diện dễ nhìn, kèm theo liên kết nhanh truy cập vào khoang luyện tập phỏng vấn hoặc tối ưu hồ sơ CV.
            </div>
          </div>

          {/* Create/Edit Form Collapse View */}
          {showForm && (
            <Card className="border border-border/40 bg-card/90 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden animate-slide-in-up">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle className="flex items-center gap-2.5 text-lg font-bold">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Bell className="h-5 w-5" />
                  </div>
                  {editingId ? "Chỉnh sửa lịch nhắc của bạn" : "Thiết lập lịch nhắc mới"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title & Time inputs */}
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tiêu đề nhắc nhở *</label>
                      <Input
                        placeholder="Ví dụ: Nhắc luyện tập phỏng vấn AI, Tối ưu CV chuẩn ATS..."
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="rounded-xl border-border/50 py-5 focus-visible:ring-primary"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Giờ gửi thông báo *</label>
                      <Input
                        type="time"
                        value={formData.time_of_day}
                        onChange={(e) =>
                          setFormData({ ...formData, time_of_day: e.target.value })
                        }
                        className="rounded-xl border-border/50 py-5 focus-visible:ring-primary"
                        required
                      />
                    </div>
                  </div>

                  {/* Description input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nội dung / Mô tả mục tiêu</label>
                    <Textarea
                      placeholder="Ghi lại lưu ý cụ thể, ví dụ: Luyện tập 15 phút với AI chủ đề 'Hành vi khách hàng'..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="rounded-xl border-border/50 focus-visible:ring-primary"
                      rows={3}
                    />
                  </div>

                  {/* Frequency Selecting Grid */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">Tần suất thông báo</label>
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                      {FREQUENCY_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleFrequencySelect(opt.value)}
                          className={`flex flex-col items-start text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                            formData.frequency === opt.value
                              ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                              : "border-border/60 hover:border-primary/50 hover:bg-muted/30"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 mb-1.5">
                            <span className="text-lg bg-background rounded-lg h-7 w-7 flex items-center justify-center shadow-sm">{opt.icon}</span>
                            <span className="font-bold text-sm">{opt.label}</span>
                          </div>
                          <span className="text-xs text-muted-foreground font-medium leading-relaxed">{opt.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Frequency Custom Parameters (Week / Month) */}
                  {(formData.frequency === "weekly" || formData.frequency === "monthly") && (
                    <div className="p-5 rounded-xl bg-muted/30 border border-border/40 animate-slide-in-up">
                      {formData.frequency === "weekly" && (
                        <div className="space-y-3">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Chọn ngày trong tuần</label>
                          <div className="flex flex-wrap gap-2">
                            {WEEKDAYS.map((day, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() =>
                                  setFormData({ ...formData, day_of_week: index })
                                }
                                className={`rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                                  formData.day_of_week === index
                                    ? "bg-primary text-white shadow-md shadow-primary/15"
                                    : "bg-card border border-border/50 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                }`}
                              >
                                {day}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {formData.frequency === "monthly" && (
                        <div className="space-y-2 max-w-xs">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ngày cụ thể trong tháng</label>
                          <Input
                            type="number"
                            min="1"
                            max="31"
                            value={formData.day_of_month}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                day_of_month: parseInt(e.target.value) || 1,
                              })
                            }
                            className="rounded-xl border-border/50 focus-visible:ring-primary font-bold"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex justify-end gap-3 border-t border-border/40 pt-5">
                    <Button type="button" variant="outline" onClick={resetForm} className="rounded-xl py-5 px-6 font-medium">
                      Hủy bỏ
                    </Button>
                    <Button type="submit" className="rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold py-5 px-8 shadow-md">
                      {editingId ? "Lưu thay đổi" : "Kích hoạt lịch nhắc"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Statistics Grid */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <Card className="border border-border/40 bg-card/85 backdrop-blur-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-black">{reminders.length}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Tổng số lịch nhắc</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border/40 bg-card/85 backdrop-blur-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-black text-emerald-500">{activeReminders.length}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Đang hoạt động</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border/40 bg-card/85 backdrop-blur-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted border border-border">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-black text-muted-foreground">{inactiveReminders.length}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Đã tạm dừng</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reminders List & Main logic */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : reminders.length === 0 ? (
            <Card className="border border-border/40 bg-card/80 backdrop-blur-sm py-16">
              <CardContent className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Bell className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-bold">Bạn chưa thiết lập lịch nhắc nào</h3>
                <p className="mb-6 text-sm text-muted-foreground max-w-sm leading-relaxed">
                  Đặt lịch đầu tiên ngay hôm nay để nhận thông báo thúc giục luyện tập và tối ưu năng lực của bản thân!
                </p>
                <Button onClick={() => setShowForm(true)} className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-md rounded-xl">
                  <Plus className="h-4.5 w-4.5" />
                  Bắt đầu tạo lịch nhắc
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Active list section */}
              {activeReminders.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-base font-bold flex items-center gap-2 text-foreground">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    Đang hoạt động ({activeReminders.length})
                  </h2>
                  <div className="grid gap-4">
                    {activeReminders.map((reminder) => (
                      <ReminderCard
                        key={reminder.id}
                        reminder={reminder}
                        onEdit={() => handleEdit(reminder)}
                        onToggle={() => handleToggle(reminder.id)}
                        onDelete={() => setShowDeleteConfirm(reminder.id)}
                        showDeleteConfirm={showDeleteConfirm === reminder.id}
                        onConfirmDelete={() => handleDelete(reminder.id)}
                        onCancelDelete={() => setShowDeleteConfirm(null)}
                        onToggleLogs={() => fetchLogs(reminder.id)}
                        showLogs={!!visibleLogs[reminder.id]}
                        logs={visibleLogs[reminder.id]}
                        loadingLogs={loadingLogs[reminder.id]}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Inactive list section */}
              {inactiveReminders.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-base font-bold flex items-center gap-2 text-muted-foreground">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/50" />
                    Đã tạm dừng ({inactiveReminders.length})
                  </h2>
                  <div className="grid gap-4 opacity-75">
                    {inactiveReminders.map((reminder) => (
                      <ReminderCard
                        key={reminder.id}
                        reminder={reminder}
                        onEdit={() => handleEdit(reminder)}
                        onToggle={() => handleToggle(reminder.id)}
                        onDelete={() => setShowDeleteConfirm(reminder.id)}
                        showDeleteConfirm={showDeleteConfirm === reminder.id}
                        onConfirmDelete={() => handleDelete(reminder.id)}
                        onCancelDelete={() => setShowDeleteConfirm(null)}
                        onToggleLogs={() => fetchLogs(reminder.id)}
                        showLogs={!!visibleLogs[reminder.id]}
                        logs={visibleLogs[reminder.id]}
                        loadingLogs={loadingLogs[reminder.id]}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ReminderCard({
  reminder,
  onEdit,
  onToggle,
  onDelete,
  showDeleteConfirm,
  onConfirmDelete,
  onCancelDelete,
  onToggleLogs,
  showLogs,
  logs,
  loadingLogs,
}: {
  reminder: Reminder;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
  showDeleteConfirm: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  onToggleLogs: () => void;
  showLogs: boolean;
  logs: ReminderLog[] | undefined;
  loadingLogs: boolean | undefined;
}) {
  return (
    <Card className="border border-border/40 bg-card/90 backdrop-blur-sm transition-all duration-300 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Left Icon box */}
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
              reminder.is_active
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-muted text-muted-foreground border border-border"
            }`}
          >
            {reminder.frequency === "once" ? (
              <Calendar className="h-6 w-6" />
            ) : (
              <Repeat className="h-6 w-6" />
            )}
          </div>

          {/* Core Info details */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-base text-foreground leading-snug">{reminder.title}</h3>
                {reminder.description && (
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                    {reminder.description}
                  </p>
                )}
              </div>
              <Badge
                variant={reminder.is_active ? "default" : "secondary"}
                className={`shrink-0 rounded-lg text-xs font-semibold px-2.5 py-0.5 ${
                  reminder.is_active ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : ""
                }`}
              >
                {reminder.is_active ? "Đang hoạt động" : "Đã tạm dừng"}
              </Badge>
            </div>

            {/* Time schedules metadata */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5 bg-muted/40 rounded-lg py-1 px-2.5 border border-border/20">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {formatTime(reminder.time_of_day)}
              </span>
              <span className="flex items-center gap-1.5 bg-muted/40 rounded-lg py-1 px-2.5 border border-border/20">
                <Repeat className="h-3.5 w-3.5 text-primary" />
                {getFrequencyLabel(reminder)}
              </span>
              {reminder.is_active && reminder.next_send_at && (
                <span className="flex items-center gap-1.5 bg-primary/5 text-primary rounded-lg py-1 px-2.5 border border-primary/10">
                  <Calendar className="h-3.5 w-3.5" />
                  Mốc gửi tiếp theo: {formatDate(reminder.next_send_at)}
                </span>
              )}
            </div>

            {/* Logs Collapse toggler */}
            <div className="mt-4">
              <button
                onClick={onToggleLogs}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                <Clock className="h-3.5 w-3.5" />
                {showLogs ? "Ẩn nhật ký gửi nhắc" : "Xem nhật ký gửi nhắc"}
              </button>
            </div>
          </div>

          {/* Action buttons controls */}
          <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
            <Button
              variant="ghost"
              className="h-9 w-9 p-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={onToggle}
              title={reminder.is_active ? "Tạm dừng gửi" : "Kích hoạt gửi"}
            >
              {reminder.is_active ? (
                <AlertCircle className="h-4.5 w-4.5 text-amber-500" />
              ) : (
                <CheckCircle className="h-4.5 w-4.5 text-emerald-500" />
              )}
            </Button>
            <Button
              variant="ghost"
              className="h-9 w-9 p-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={onEdit}
              title="Chỉnh sửa lịch nhắc"
            >
              <Edit2 className="h-4.5 w-4.5" />
            </Button>
            {showDeleteConfirm ? (
              <div className="flex items-center gap-1 bg-destructive/10 border border-destructive/20 rounded-lg p-0.5 animate-slide-in-up">
                <Button
                  variant="destructive"
                  className="h-8 px-2 text-xs font-bold flex gap-1 rounded"
                  onClick={onConfirmDelete}
                >
                  <Check className="h-3.5 w-3.5" />
                  Xóa
                </Button>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded text-muted-foreground hover:bg-transparent hover:text-foreground"
                  onClick={onCancelDelete}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="h-9 w-9 p-0 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={onDelete}
                title="Xóa lịch nhắc"
              >
                <Trash2 className="h-4.5 w-4.5 text-destructive" />
              </Button>
            )}
          </div>
        </div>

        {/* Real-time Email Logs Sub-view */}
        {showLogs && (
          <div className="mt-5 pt-4 border-t border-border/40 animate-slide-in-up">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Nhật ký lịch sử gửi mail nhắc nhở (Gần đây nhất)
            </h4>
            {loadingLogs ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground py-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Đang nạp dữ liệu nhật ký...
              </div>
            ) : !logs || logs.length === 0 ? (
              <p className="text-xs text-muted-foreground italic py-2">
                Chưa ghi nhận lịch sử gửi email cho lời nhắc này. Email đầu tiên sẽ được ghi nhật ký sau khi đến mốc gửi.
              </p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between text-xs p-3 rounded-xl bg-muted/40 border border-border/30"
                  >
                    <span className="font-semibold text-muted-foreground">
                      ⏰ Đã xử lý lúc:{" "}
                      <span className="text-foreground font-bold">
                        {new Date(log.sent_at).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </span>
                    <Badge
                      className={`text-[10px] rounded-lg py-0.5 px-2 font-bold ${
                        log.status === "sent"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-destructive/10 text-destructive border border-destructive/20"
                      }`}
                    >
                      {log.status === "sent" ? "Đã gửi Email" : "Gửi thất bại"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
