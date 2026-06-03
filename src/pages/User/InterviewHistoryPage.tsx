import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, TrendingUp, Mic, Calendar, Eye, X, Award, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";

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

interface DetailedSession extends InterviewSession {
  conversation: string | any[];
  feedback: string;
  strengths: string[] | string;
  weaknesses: string[] | string;
  improvements: string[] | string;
  avg_volume: number;
  pause_count: number;
  avg_pause_duration: number;
}

export default function InterviewHistoryPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [detailSession, setDetailSession] = useState<DetailedSession | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

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

  const handleViewDetail = async (id: string) => {
    setSelectedSessionId(id);
    setLoadingDetail(true);
    setDetailSession(null);
    try {
      const response = await fetch(`/api/interview/${id}`, {
        headers: {
          'x-user-id': user?.id ?? '',
          'x-user-role': user?.role ?? '',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDetailSession(data);
      }
    } catch (err) {
      console.error("Error fetching detail:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

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

  const parseJsonArray = (val: any): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
      return [String(val)];
    }
  };

  const parseConversation = (val: any): any[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
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
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-muted-foreground text-sm">Đang tải lịch sử...</p>
        </div>
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
          <Button onClick={() => window.location.assign('/dashboard')}>
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
            <Button onClick={() => window.location.assign('/cv')}>
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
                    onClick={() => void handleViewDetail(session.id)}
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

      {/* Details Modal */}
      {selectedSessionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-card rounded-2xl border border-border shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Kết quả phỏng vấn chi tiết
                </h2>
                {detailSession && (
                  <p className="text-xs text-muted-foreground mt-1">
                    CV: {detailSession.cv_name} · Ngày {formatDate(detailSession.started_at)}
                  </p>
                )}
              </div>
              <button 
                onClick={() => { setSelectedSessionId(null); setDetailSession(null); }}
                className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {loadingDetail ? (
                <div className="py-20 flex flex-col items-center gap-2">
                  <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary" />
                  <p className="text-muted-foreground text-xs">Đang phân tích dữ liệu buổi phỏng vấn...</p>
                </div>
              ) : !detailSession ? (
                <p className="text-center text-muted-foreground text-sm">Không thể tải thông tin chi tiết.</p>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Left Column: Scores & Metrics */}
                  <div className="space-y-4 md:col-span-1">
                    <Card className="p-4 bg-primary/5 border-primary/20 space-y-4 text-center">
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tổng điểm đánh giá</p>
                        <h3 className="text-4xl font-extrabold text-primary mt-1">
                          {detailSession.total_score !== null ? `${detailSession.total_score}/100` : 'Chưa chấm'}
                        </h3>
                      </div>
                      <div className="border-t border-border/60 pt-3 grid grid-cols-2 gap-2 text-left">
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">Nội dung</p>
                          <p className="text-sm font-semibold">{detailSession.content_score !== null ? `${detailSession.content_score}/100` : '--'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">Giọng nói</p>
                          <p className="text-sm font-semibold">{detailSession.voice_score !== null ? `${detailSession.voice_score}/30` : '--'}</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 space-y-3">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Chỉ số âm thanh</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Độ tự tin:</span>
                          <span className="font-semibold">{getConfidenceBadge(detailSession.confidence_level)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Thời gian:</span>
                          <span className="font-semibold">{formatDuration(detailSession.duration_seconds)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Số lần dừng ngập ngừng:</span>
                          <span className="font-semibold">{detailSession.pause_count || 0} lần</span>
                        </div>
                        {detailSession.avg_pause_duration > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Thời gian ngừng TB:</span>
                            <span className="font-semibold">{detailSession.avg_pause_duration} ms</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>

                  {/* Right Column: AI Feedback, Strengths/Weaknesses, Transcript */}
                  <div className="space-y-6 md:col-span-2">
                    {/* General Feedback */}
                    {detailSession.feedback && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-amber-500" />
                          Nhận xét tổng quan của AI
                        </h4>
                        <p className="text-sm leading-relaxed text-muted-foreground bg-muted/40 p-4 rounded-xl whitespace-pre-wrap border border-border/50">
                          {detailSession.feedback}
                        </p>
                      </div>
                    )}

                    {/* Strengths & Weaknesses */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Strengths */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          Điểm mạnh
                        </h4>
                        <ul className="space-y-1.5 text-xs text-muted-foreground bg-emerald-500/5 border border-emerald-500/10 p-3.5 rounded-xl min-h-[100px]">
                          {parseJsonArray(detailSession.strengths).length > 0 ? (
                            parseJsonArray(detailSession.strengths).map((str, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-emerald-500 font-bold">•</span>
                                <span>{str}</span>
                              </li>
                            ))
                          ) : (
                            <p className="text-muted-foreground italic text-xs">Chưa ghi nhận.</p>
                          )}
                        </ul>
                      </div>

                      {/* Weaknesses / Improvements */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          Cần cải thiện
                        </h4>
                        <ul className="space-y-1.5 text-xs text-muted-foreground bg-amber-500/5 border border-amber-500/10 p-3.5 rounded-xl min-h-[100px]">
                          {parseJsonArray(detailSession.weaknesses).length > 0 ? (
                            parseJsonArray(detailSession.weaknesses).map((wk, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-amber-500 font-bold">•</span>
                                <span>{wk}</span>
                              </li>
                            ))
                          ) : (
                            <p className="text-muted-foreground italic text-xs">Chưa ghi nhận.</p>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Conversation Transcript */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-bold text-foreground">Hội thoại chi tiết</h4>
                      <div className="space-y-3 max-h-[300px] overflow-y-auto border border-border rounded-xl p-4 bg-muted/10">
                        {parseConversation(detailSession.conversation).length > 0 ? (
                          parseConversation(detailSession.conversation).map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                              <span className="text-[10px] text-muted-foreground font-semibold mb-0.5">
                                {msg.role === 'user' ? 'Bạn' : 'AI'}
                              </span>
                              <div className={`px-3.5 py-2 rounded-2xl text-xs max-w-[80%] whitespace-pre-wrap leading-normal shadow-sm ${
                                msg.role === 'user' 
                                  ? 'bg-primary text-primary-foreground rounded-tr-none' 
                                  : 'bg-card text-foreground rounded-tl-none border border-border/80'
                              }`}>
                                {msg.content}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground italic text-xs text-center py-6">Không có dữ liệu hội thoại.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border flex justify-end bg-muted/30">
              <Button onClick={() => { setSelectedSessionId(null); setDetailSession(null); }}>
                Đóng kết quả
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

