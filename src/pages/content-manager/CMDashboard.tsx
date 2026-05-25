import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Clock, FileText, HelpCircle } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CMDashboardData {
  stats: {
    total_questions: number;
    total_articles: number;
    published_articles: number;
    draft_articles: number;
  };
  recent_articles: Array<{
    id: string;
    title: string;
    status: "draft" | "published" | "archived";
    category: string;
    created_at: string;
  }>;
  recent_questions: Array<{
    id: string;
    content: string;
    level: string;
    type: string;
    created_at: string;
  }>;
}

export default function CMDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<CMDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const headers = useMemo(
    () => ({
      "x-user-id": user?.id ?? "",
      "x-user-role": user?.role ?? "",
    }),
    [user?.id, user?.role],
  );

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/dashboard/cm", { headers });
        if (!response.ok) throw new Error("Không thể tải dashboard content manager.");
        setData((await response.json()) as CMDashboardData);
      } catch (loadError) {
        const message = loadError instanceof Error ? loadError.message : "Đã có lỗi xảy ra.";
        setError(message);
      }
    }
    void load();
  }, []);

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <p className="text-sm text-muted-foreground">Content manager dashboard</p>
          <h1 className="text-3xl font-bold">Tổng quan nội dung</h1>
        </div>

        {error ? <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm">{error}</p> : null}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Tổng câu hỏi" value={data?.stats.total_questions ?? 0} icon={<HelpCircle className="h-5 w-5" />} />
          <StatCard title="Tổng bài viết" value={data?.stats.total_articles ?? 0} icon={<FileText className="h-5 w-5" />} />
          <StatCard title="Đã xuất bản" value={data?.stats.published_articles ?? 0} icon={<CheckCircle className="h-5 w-5" />} />
          <StatCard title="Bản nháp" value={data?.stats.draft_articles ?? 0} icon={<Clock className="h-5 w-5" />} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bài viết gần đây</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data?.recent_articles ?? []).slice(0, 5).map((article) => (
              <div key={article.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3">
                <div className="space-y-1">
                  <p className="font-medium">{article.title}</p>
                  <div className="flex items-center gap-2">
                    <Badge className="border-slate-200 bg-slate-50 text-slate-700">{article.category}</Badge>
                    <Badge className="border-blue-200 bg-blue-50 text-blue-700">{article.status}</Badge>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => window.location.assign(`/content/articles/${article.id}/edit`)}>
                  Sửa
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Câu hỏi gần đây</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data?.recent_questions ?? []).slice(0, 5).map((question) => (
              <div key={question.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3">
                <div className="space-y-1">
                  <p className="font-medium">{question.content.length > 80 ? `${question.content.slice(0, 80)}...` : question.content}</p>
                  <div className="flex items-center gap-2">
                    <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">{question.level}</Badge>
                    <Badge className="border-amber-200 bg-amber-50 text-amber-700">{question.type}</Badge>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => window.location.assign(`/content/questions/${question.id}/edit`)}>
                  Sửa
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button onClick={() => window.location.assign("/content/questions/new")}>Thêm câu hỏi mới</Button>
            <Button variant="outline" onClick={() => window.location.assign("/content/articles/new")}>
              Viết bài mới
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
