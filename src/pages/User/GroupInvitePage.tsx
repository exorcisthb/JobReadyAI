"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Crown,
  Lock,
  MapPin,
  MessageSquare,
  Sparkles,
  Unlock,
  Users,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader } from "@/components/dashboard-header";
import { userNavItems } from "@/pages/User/user-nav-items";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Group {
  id: string;
  name: string;
  description: string;
  job_category: string;
  experience_level: string;
  position: string;
  location: string;
  is_private: boolean;
  creator_id: string;
  creator_name: string | null;
  creator_email: string;
  member_count: number;
  post_count: number;
  created_at: string;
}

export default function GroupInvitePage() {
  const { user, logout } = useAuth();
  const rawGroupId = new URLSearchParams(window.location.search).get("id");
  const groupId = rawGroupId ? rawGroupId.replace(/^\//, "") : "";
  const [group, setGroup] = useState<Group | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Mời tham gia nhóm | JobReady AI";
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchInviteData = useCallback(async () => {
    if (!groupId) {
      setLoading(false);
      setError("Thiếu mã nhóm trong liên kết.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/groups/${groupId}/invite`, {
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id ?? "",
          "x-user-role": user?.role ?? "user",
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Không thể tải thông tin lời mời.");
      }

      const data = await response.json();
      setGroup(data.group);
      setIsMember(data.is_member);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi lấy thông tin nhóm.");
    } finally {
      setLoading(false);
    }
  }, [groupId, user?.id, user?.role]);

  useEffect(() => {
    void fetchInviteData();
  }, [fetchInviteData]);

  const handleJoinGroup = async () => {
    if (!groupId || joining) return;

    setJoining(true);
    try {
      const response = await fetch(`/api/groups/${groupId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id ?? "",
          "x-user-role": user?.role ?? "user",
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Không thể tham gia nhóm.");
      }

      showToast("success", "Tham gia nhóm thành công! Đang chuyển hướng...");
      setIsMember(true);
      setTimeout(() => {
        window.location.assign(`/groups/detail?id=${groupId}`);
      }, 1500);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Lỗi khi tham gia nhóm.");
    } finally {
      setJoining(false);
    }
  };

  // Using global userNavItems imported at the top

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <DashboardHeader navItems={userNavItems} activePath="/groups" role="user" onLogout={logout} />

      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-4 md:px-8" style={{ paddingLeft: "calc(var(--sidebar-width) + 1rem)" }}>
        <div className="w-full max-w-xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => window.location.assign("/groups")}
            className="gap-2 text-muted-foreground hover:text-foreground mb-2"
            id="btn-back-to-groups"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay về danh sách nhóm
          </Button>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-primary" />
              <p className="text-sm text-muted-foreground">Đang tải thông tin lời mời...</p>
            </div>
          ) : error || !group ? (
            <Card className="border-dashed border-destructive/50">
              <CardContent className="py-12 text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                  <Unlock className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-bold text-destructive">Lời mời không hợp lệ</h2>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  {error || "Không tìm thấy thông tin nhóm tương ứng với mã liên kết này."}
                </p>
                <Button onClick={() => window.location.assign("/groups")} className="mt-2">
                  Quay về danh sách nhóm
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-border/80 bg-card/85 backdrop-blur-md shadow-2xl overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-primary/5">
              {/* Top Accent Gradient Line */}
              <div className="h-2 w-full bg-gradient-to-r from-primary via-primary-hover to-accent-mint" />

              <CardHeader className="text-center pb-2 pt-8">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent-mint/10 border border-primary/20 flex items-center justify-center text-primary mb-4 shadow-inner">
                  <Users className="h-8 w-8" />
                </div>
                <Badge variant="secondary" className="mx-auto mb-2 tracking-wide font-semibold text-xs py-1 px-3">
                  LỜI MỜI THAM GIA CỘNG ĐỒNG
                </Badge>
                <CardTitle className="text-2xl font-extrabold tracking-tight mt-2 text-foreground px-4">
                  {group.name}
                </CardTitle>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-2">
                  <Crown className="h-3.5 w-3.5 text-amber-500" />
                  Người tạo: <span className="font-semibold text-foreground">{group.creator_name || "Thành viên"}</span>
                </p>
              </CardHeader>

              <CardContent className="space-y-6 px-6 md:px-8 pb-8">
                {/* Description Box */}
                {group.description ? (
                  <div className="bg-muted/40 border border-border/50 rounded-xl p-4 text-sm text-muted-foreground leading-relaxed italic text-center">
                    "{group.description}"
                  </div>
                ) : (
                  <div className="text-center text-sm text-muted-foreground/60 italic">
                    Nhóm này chưa có mô tả.
                  </div>
                )}

                {/* Badges and tags */}
                <div className="flex flex-wrap justify-center gap-2">
                  {group.job_category && (
                    <Badge variant="secondary" className="gap-1 text-xs py-1 px-2.5 font-medium">
                      <Briefcase className="h-3.5 w-3.5" />
                      {group.job_category}
                    </Badge>
                  )}
                  {group.position && (
                    <Badge variant="outline" className="gap-1 text-xs py-1 px-2.5 font-medium border-border/80">
                      {group.position}
                    </Badge>
                  )}
                  {group.experience_level && (
                    <Badge variant="outline" className="gap-1 text-xs py-1 px-2.5 font-medium border-border/80">
                      {group.experience_level}
                    </Badge>
                  )}
                  {group.location && (
                    <Badge variant="outline" className="gap-1 text-xs py-1 px-2.5 font-medium border-border/80">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {group.location}
                    </Badge>
                  )}
                  <Badge variant={group.is_private ? "destructive" : "default"} className="gap-1 text-xs py-1 px-2.5 font-medium">
                    {group.is_private ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                    {group.is_private ? "Riêng tư" : "Công khai"}
                  </Badge>
                </div>

                <hr className="border-border/40" />

                {/* Metadata counts */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
                    <p className="text-2xl font-bold text-foreground">{group.member_count}</p>
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                      <Users className="h-3.5 w-3.5" />
                      Thành viên
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
                    <p className="text-2xl font-bold text-foreground">{group.post_count}</p>
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Bài viết
                    </p>
                  </div>
                </div>

                {/* Creation date */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Cộng đồng được thành lập vào {new Date(group.created_at).toLocaleDateString("vi-VN")}</span>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2">
                  {isMember ? (
                    <Button
                      id="btn-goto-group"
                      onClick={() => window.location.assign(`/groups/detail?id=${group.id}`)}
                      className="w-full h-12 text-base font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl gap-2 shadow-lg transition hover:-translate-y-0.5 cursor-pointer"
                    >
                      Bạn đã là thành viên - Vào nhóm ngay
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  ) : (
                    <Button
                      id="btn-join-group"
                      onClick={() => void handleJoinGroup()}
                      disabled={joining}
                      className="w-full h-12 text-base font-bold rounded-xl gap-2 shadow-lg transition hover:-translate-y-0.5 cursor-pointer hover:shadow-primary/20"
                      style={{ background: "var(--gradient-hero)" }}
                    >
                      {joining ? (
                        <>
                          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Đang tham gia...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 animate-pulse" />
                          Tham gia cộng đồng ngay
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground/60 border-t border-border/40 max-w-4xl mx-auto w-full">
        © {new Date().getFullYear()} JobReady AI. Kiến tạo sự nghiệp vững vàng bằng công nghệ trí tuệ nhân tạo.
      </footer>

      {/* Toast popup */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-xl text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-4 duration-300 border flex items-center gap-2 ${
            toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-950/30 dark:border-green-900/50 dark:text-green-400"
              : "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400"
          }`}
        >
          {toast.type === "success" && <CheckCircle className="h-4 w-4" />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
