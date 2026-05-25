import { useEffect, useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "@/components/auth-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UserDashboardData {
  profile: {
    full_name: string | null;
    avatar_url: string | null;
    profile_completed: boolean;
  };
  stats: {
    total_sessions: number;
    avg_score: number | null;
    total_cv_uploads: number;
    total_cv_built: number;
    total_practice_sessions: number;
  };
  recent_sessions: Array<{
    id: string;
    level: string;
    avg_score: number | null;
    started_at: string;
    status: string;
  }>;
  progress: Array<{
    session_date: string;
    avg_score: number;
  }>;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<UserDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const headers = useMemo(
    () => ({
      "x-user-id": user?.id ?? "",
      "x-user-role": user?.role ?? "user",
    }),
    [user?.id, user?.role],
  );

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/dashboard/me", { headers });
        if (!response.ok) throw new Error("Không thể tải dashboard.");
        const payload = (await response.json()) as UserDashboardData;
        setData(payload);
      } catch (loadError) {
        const message = loadError instanceof Error ? loadError.message : "Đã có lỗi xảy ra.";
        setError(message);
      }
    }
    void load();
  }, []);

  const displayName = data?.profile.full_name ?? user?.name ?? "Bạn";

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={data?.profile.avatar_url ?? undefined} alt={displayName} />
            <AvatarFallback>{displayName.slice(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">Xin chào, {displayName}!</h1>
            <p className="text-sm text-muted-foreground">Tổng quan học tập và hồ sơ của bạn</p>
          </div>
        </div>

        {error ? <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm">{error}</p> : null}

        {data && !data.profile.profile_completed ? (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTitle>Hoàn thiện hồ sơ</AlertTitle>
            <AlertDescription>Hoàn thiện hồ sơ để nhận gợi ý phù hợp.</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Số buổi phỏng vấn" value={String(data?.stats.total_sessions ?? 0)} />
          <StatCard title="Điểm trung bình" value={data?.stats.avg_score != null ? String(data.stats.avg_score) : "--"} />
          <StatCard title="CV đã tạo" value={String(data?.stats.total_cv_built ?? 0)} />
          <StatCard title="Buổi luyện tập" value={String(data?.stats.total_practice_sessions ?? 0)} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Biểu đồ tiến độ</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.progress ?? []}>
                <XAxis dataKey="session_date" tickFormatter={(value: string) => new Date(value).toLocaleDateString()} />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="avg_score" stroke="var(--color-primary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lịch sử gần đây</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Level</th>
                  <th className="p-2">Điểm</th>
                  <th className="p-2">Thời gian</th>
                  <th className="p-2">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recent_sessions ?? []).slice(0, 5).map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{item.level}</td>
                    <td className="p-2">{item.avg_score ?? "--"}</td>
                    <td className="p-2">{new Date(item.started_at).toLocaleString()}</td>
                    <td className="p-2">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => window.location.assign("/interview/config")}>Bắt đầu phỏng vấn</Button>
            <Button variant="outline" onClick={() => window.location.assign("/cv/builder")}>
              Tạo CV mới
            </Button>
            <Button variant="secondary" onClick={() => window.location.assign("/practice")}>
              Luyện tập câu hỏi
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
