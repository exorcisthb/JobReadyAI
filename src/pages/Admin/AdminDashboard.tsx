import { useEffect, useMemo, useState } from "react";
import { BookOpen, FileText, MessageSquare, Users } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SystemStats {
  total_users: number;
  locked_users: number;
  total_sessions: number;
  total_cv_uploads: number;
  total_cv_built: number;
  total_jd_comparisons: number;
  active_questions: number;
  published_articles: number;
}

interface AdminUser {
  id: string;
  email: string;
  role: "user" | "content_manager" | "admin";
  status: "active" | "locked";
  created_at: string;
}

const roleBadgeMap: Record<AdminUser["role"], string> = {
  user: "border-blue-200 bg-blue-50 text-blue-700",
  content_manager: "border-purple-200 bg-purple-50 text-purple-700",
  admin: "border-red-200 bg-red-50 text-red-700",
};

const statusBadgeMap: Record<AdminUser["status"], string> = {
  active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  locked: "border-slate-200 bg-slate-100 text-slate-700",
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const adminHeaders = useMemo(
    () => ({
      "x-user-role": user?.role ?? "",
      "x-user-id": user?.id ?? "",
    }),
    [user?.id, user?.role],
  );

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [statsResponse, usersResponse] = await Promise.all([
        fetch("/api/admin/stats", { headers: adminHeaders }),
        fetch("/api/admin/users?limit=10", { headers: adminHeaders }),
      ]);

      if (!statsResponse.ok || !usersResponse.ok) {
        throw new Error("Không thể tải dữ liệu dashboard admin.");
      }

      const statsData = (await statsResponse.json()) as SystemStats;
      const usersData = (await usersResponse.json()) as AdminUser[];
      setStats(statsData);
      setRecentUsers(usersData);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Đã có lỗi xảy ra.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function updateUserStatus(id: string, status: AdminUser["status"]) {
    const response = await fetch(`/api/admin/users/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...adminHeaders },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error("Cập nhật trạng thái thất bại.");
    }
    await loadData();
  }

  async function updateUserRole(id: string, role: AdminUser["role"]) {
    const response = await fetch(`/api/admin/users/${id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...adminHeaders },
      body: JSON.stringify({ role }),
    });
    if (!response.ok) {
      throw new Error("Cập nhật vai trò thất bại.");
    }
    await loadData();
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Admin dashboard</p>
          <h1 className="text-3xl font-bold">Tổng quan hệ thống</h1>
        </div>

        {error ? <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm">{error}</p> : null}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Tổng Users" value={stats?.total_users ?? 0} icon={<Users className="h-5 w-5" />} />
          <StatCard title="Tổng Buổi Phỏng Vấn" value={stats?.total_sessions ?? 0} icon={<MessageSquare className="h-5 w-5" />} />
          <StatCard title="CV Đã Upload" value={stats?.total_cv_uploads ?? 0} icon={<FileText className="h-5 w-5" />} />
          <StatCard title="Bài Viết Đã Xuất Bản" value={stats?.published_articles ?? 0} icon={<BookOpen className="h-5 w-5" />} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Gần Đây</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {loading ? (
              <p className="text-sm text-muted-foreground">Đang tải...</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2">Email</th>
                    <th className="p-2">Vai trò</th>
                    <th className="p-2">Trạng thái</th>
                    <th className="p-2">Ngày tạo</th>
                    <th className="p-2">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">{item.email}</td>
                      <td className="p-2">
                        <Badge className={roleBadgeMap[item.role]}>{item.role}</Badge>
                      </td>
                      <td className="p-2">
                        <Badge className={statusBadgeMap[item.status]}>{item.status}</Badge>
                      </td>
                      <td className="p-2">{new Date(item.created_at).toLocaleDateString()}</td>
                      <td className="space-x-2 p-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const nextStatus = item.status === "active" ? "locked" : "active";
                            void updateUserStatus(item.id, nextStatus).catch((statusError: unknown) => {
                              const message =
                                statusError instanceof Error ? statusError.message : "Cập nhật trạng thái thất bại.";
                              setError(message);
                            });
                          }}
                        >
                          {item.status === "active" ? "Khóa" : "Mở khóa"}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            const nextRole = item.role === "user" ? "content_manager" : "user";
                            void updateUserRole(item.id, nextRole).catch((roleError: unknown) => {
                              const message =
                                roleError instanceof Error ? roleError.message : "Cập nhật vai trò thất bại.";
                              setError(message);
                            });
                          }}
                        >
                          Phân quyền
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => window.location.assign("/admin/create-content-manager")}>
              Tạo tài khoản Content Manager
            </Button>
            <Button variant="outline" onClick={() => window.location.assign("/admin/questions")}>
              Quản lý câu hỏi
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
