import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, TrendingUp, Mic, Calendar, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface InterviewSession {
  id: string;
  started_at: string;
  ended_at: string;
  duration_seconds: number;
  total_score: number | null;
  content_score: number | null;
  voice_score: number | null;
  confidence_level: string;
  cv_name: string;
}

export default function InterviewHistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetch('/api/interview/history', {
          headers: {
            'x-user-id': user?.id ?? '',
            'x-user-role': user?.role ?? '',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSessions(data);
        }
      } catch (error) {
        console.error('Error loading interview history:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) {
      void loadHistory();
    }
  }, [user?.id, user?.role]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getConfidenceBadge = (level: string) => {
    const colors = {
      low: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      high: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };
    const labels = {
      low: 'Cần cải thiện',
      medium: 'Khá tốt',
      high: 'Xuất sắc',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level as keyof typeof colors] || colors.medium}`}>
        {labels[level as keyof typeof labels] || level}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Đang tải lịch sử...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Lịch sử phỏng vấn</h1>
            <p className="text-muted-foreground mt-2">
              Xem lại các buổi phỏng vấn và theo dõi tiến độ của bạn
            </p>
          </div>
          <Button onClick={() => navigate('/user/dashboard')}>
            Quay lại Dashboard
          </Button>
        </div>

        {sessions.length === 0 ? (
          <Card className="p-12 text-center">
            <Mic className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Chưa có buổi phỏng vấn nào</h3>
            <p className="text-muted-foreground mb-6">
              Bắt đầu buổi phỏng vấn đầu tiên của bạn để xem kết quả tại đây
            </p>
            <Button onClick={() => navigate('/user/cv-list')}>
              Bắt đầu phỏng vấn
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sessions.map((session) => (
              <Card key={session.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">{session.cv_name || 'CV không xác định'}</h3>
                      {getConfidenceBadge(session.confidence_level)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(session.started_at)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(session.duration_seconds)}</span>
                      </div>

                      {session.total_score !== null && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <TrendingUp className="h-4 w-4" />
                          <span>Điểm: {session.total_score}/100</span>
                        </div>
                      )}

                      {session.voice_score !== null && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mic className="h-4 w-4" />
                          <span>Giọng nói: {session.voice_score}/30</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/user/interview-detail/${session.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Xem chi tiết
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
