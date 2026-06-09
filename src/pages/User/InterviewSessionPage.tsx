import { useEffect, useState, useRef, type FormEvent } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
  MessageSquare,
  User,
  Bot,
  Loader2,
  Send,
} from "lucide-react";
import { useGeminiLiveV2 } from "@/hooks/useGeminiLiveV2";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function InterviewSessionPage() {
  const { user } = useAuth();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [cvData, setCvData] = useState<string>("");
  const [candidateName, setCandidateName] = useState("");
  const [loading, setLoading] = useState(true);
  const [audioMetrics, setAudioMetrics] = useState<{
    volume: number;
    speechRate: number;
    pauseCount: number;
    avgPauseDuration: number;
    confidence: 'low' | 'medium' | 'high';
  }[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get Gemini API key from environment
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

  // Use Gemini Live hook V2 (complete implementation from smile-clinic)
  const {
    isConnected,
    isListening,
    connect,
    disconnect,
    startListening,
    stopListening,
    sendMessage,
    setSpeakerEnabled,
  } = useGeminiLiveV2({
    apiKey: geminiApiKey,
    cvData: cvData,
    candidateName,
    onMessage: (message, role) => {
      addMessage(role, message);
    },
    onError: (error) => {
      console.error("Gemini error:", error);
      addMessage("assistant", "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.");
    },
    onSessionEnd: () => {
      // Session ended
      setIsCallActive(false);
      setIsMicOn(false);
    },
    onTranscript: (text, isFinal) => {
      // Chạy ngầm, không hiển thị gì
      // Chỉ log để debug
      if (isFinal) {
        console.log('📝 User said:', text);
      }
    },
    onAudioMetrics: (metrics) => {
      // Lưu metrics để phân tích sau
      setAudioMetrics(prev => [...prev, metrics]);
      console.log('📊 Audio metrics:', metrics);
    },
  });

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isCallActive || !isConnected || !isMicOn || isListening) {
      return;
    }

    void startListening();
  }, [isCallActive, isConnected, isMicOn, isListening, startListening]);

  const addMessage = (role: "user" | "assistant", content: string) => {
    setMessages((prev) => [...prev, { role, content, timestamp: new Date() }]);
  };

  // Load CV data
  useEffect(() => {
    async function loadCVData() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const cvId = urlParams.get('cv_id');

        const endpoint = cvId ? `/api/cv/${cvId}` : '/api/cv/latest';
        const rowRes = await fetch(endpoint, {
          headers: {
            'x-user-id': user?.id ?? '',
            'x-user-role': user?.role ?? '',
          },
        });

        if (!rowRes.ok) {
          setCvData('Không thể tải thông tin CV');
          return;
        }

        const row = await rowRes.json();
        const resolvedCvId = row.id;

        let name = '';
        if (row.type === 'created' && row.content) {
          const c = typeof row.content === 'string'
            ? JSON.parse(row.content)
            : row.content;
          name = c.fullName || '';
        } else {
          name = row.full_name || '';
        }
        setCandidateName(name);

        const textRes = await fetch(`/api/cv/text/${resolvedCvId}`, {
          headers: {
            'x-user-id': user?.id ?? '',
            'x-user-role': user?.role ?? '',
          },
        });

        if (!textRes.ok) {
          setCvData('Không thể tải nội dung CV');
          return;
        }

        const textData = await textRes.json();
        setCvData(textData.text || '');

        console.log('[CV Load] candidateName:', name);
        console.log('[CV Load] cvData length:', textData.text?.length);
        console.log('[CV Load] cvData preview:', textData.text?.slice(0, 300));
      } catch (error) {
        console.error('Error loading CV:', error);
        setCvData('Không thể tải thông tin CV');
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) {
      void loadCVData();
    }
  }, [user?.id, user?.role]);

  const startCall = async () => {
    setIsCallActive(true);
    setIsMicOn(true);
    addMessage("assistant", "Đang kết nối với JobReady AI...");
    
    try {
      // Tạo session trong DB
      const urlParams = new URLSearchParams(window.location.search);
      const cvId = urlParams.get('cv_id');
      
      if (cvId) {
        const response = await fetch('/api/interview/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user?.id ?? '',
            'x-user-role': user?.role ?? '',
          },
          body: JSON.stringify({ cv_id: cvId }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setSessionId(data.session_id);
          console.log('📝 Interview session created:', data.session_id);
        }
      }
      
      console.log('[startCall] cvData length:', cvData.length);
      console.log('[startCall] candidateName:', candidateName);
      await connect();
      setSpeakerEnabled(true);
      // Message will be added when AI responds
    } catch (error) {
      console.error("Failed to start call:", error);
      addMessage("assistant", "Xin lỗi, không thể kết nối. Vui lòng kiểm tra API key và thử lại.");
      setIsCallActive(false);
      setIsMicOn(false);
    }
  };

  const endCall = async () => {
    setIsCallActive(false);
    setIsMicOn(false);
    disconnect();
    
    // Lưu kết quả vào DB
    if (sessionId && messages.length > 0) {
      try {
        // Tính điểm từ audio metrics
        const avgMetrics = audioMetrics.length > 0 ? {
          avg_volume: Math.round(audioMetrics.reduce((sum, m) => sum + m.volume, 0) / audioMetrics.length),
          pause_count: audioMetrics.reduce((sum, m) => sum + m.pauseCount, 0),
          avg_pause_duration: Math.round(audioMetrics.reduce((sum, m) => sum + m.avgPauseDuration, 0) / audioMetrics.length),
          confidence_level: audioMetrics[audioMetrics.length - 1]?.confidence || 'medium',
        } : null;
        
        // Extract feedback từ tin nhắn cuối của AI (nếu có)
        const lastAiMessage = messages.filter(m => m.role === 'assistant').pop();
        const feedback = lastAiMessage?.content || '';
        
        await fetch(`/api/interview/${sessionId}/end`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user?.id ?? '',
            'x-user-role': user?.role ?? '',
          },
          body: JSON.stringify({
            conversation: messages,
            total_score: null, // AI sẽ đánh giá trong feedback
            content_score: null,
            voice_score: null,
            audio_metrics: avgMetrics,
            feedback: feedback,
            strengths: [],
            weaknesses: [],
            improvements: [],
          }),
        });
        
        console.log('✅ Interview session saved');
      } catch (error) {
        console.error('Failed to save interview session:', error);
      }
    }
  };

  const toggleMic = async () => {
    if (!isCallActive) return;
    
    const newMicState = !isMicOn;
    setIsMicOn(newMicState);

    if (newMicState) {
      await startListening();
    } else {
      stopListening();
    }
  };

  const toggleSpeaker = () => {
    const nextSpeakerState = !isSpeakerOn;
    setIsSpeakerOn(nextSpeakerState);
    setSpeakerEnabled(nextSpeakerState);
  };

  const submitTextMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = userInput.trim();
    if (!text || !isConnected) return;

    sendMessage(text);
    setUserInput("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang tải thông tin phỏng vấn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Phỏng vấn với JobReady AI</h1>
              <p className="text-xs text-muted-foreground">
                {isCallActive && !isConnected ? "Đang kết nối..." : isConnected ? "Đã kết nối" : "Sẵn sàng bắt đầu"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.assign("/user/dashboard")}
          >
            Quay lại Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video/Avatar Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-accent-mint/5 border-border/50">
              <div className="aspect-video flex items-center justify-center relative">
                {/* AI Avatar */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={`relative ${isCallActive ? "animate-pulse" : ""}`}
                  >
                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary to-accent-mint flex items-center justify-center shadow-2xl">
                      <Bot className="h-16 w-16 text-white" />
                    </div>
                    {isCallActive && (
                      <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
                    )}
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
                    <div
                      className={`h-2 w-2 rounded-full ${isCallActive ? "bg-green-500 animate-pulse" : "bg-gray-500"}`}
                    />
                    <span className="text-xs text-white font-medium">
                      {isCallActive ? "Đang phỏng vấn" : "Chưa bắt đầu"}
                    </span>
                  </div>
                </div>

                {/* Listening Indicator */}
                {isListening && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-2 bg-red-500/90 backdrop-blur-sm rounded-full px-4 py-2">
                      <Mic className="h-4 w-4 text-white animate-pulse" />
                      <span className="text-sm text-white font-medium">Đang lắng nghe...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Control Buttons */}
              <div className="p-6 bg-card/80 backdrop-blur-sm border-t border-border/50">
                <div className="flex items-center justify-center gap-4">
                  {!isCallActive ? (
                    <div className="flex flex-col items-center gap-3">
                      <Button
                        size="default"
                        onClick={startCall}
                        disabled={!geminiApiKey || loading}
                        className="rounded-full h-16 w-16 bg-green-500 hover:bg-green-600 shadow-lg p-0"
                      >
                        <Phone className="h-6 w-6" />
                      </Button>

                      {loading && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Đang tải CV...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <Button
                        size="default"
                        variant={isMicOn ? "default" : "secondary"}
                        onClick={toggleMic}
                        className="rounded-full h-14 w-14 p-0"
                      >
                        {isMicOn ? (
                          <Mic className="h-5 w-5" />
                        ) : (
                          <MicOff className="h-5 w-5" />
                        )}
                      </Button>

                      <Button
                        size="default"
                        onClick={endCall}
                        className="rounded-full h-16 w-16 bg-red-500 hover:bg-red-600 shadow-lg p-0"
                      >
                        <PhoneOff className="h-6 w-6" />
                      </Button>

                      <Button
                        size="default"
                        variant={isSpeakerOn ? "default" : "secondary"}
                        onClick={toggleSpeaker}
                        className="rounded-full h-14 w-14 p-0"
                      >
                        {isSpeakerOn ? (
                          <Volume2 className="h-5 w-5" />
                        ) : (
                          <VolumeX className="h-5 w-5" />
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>

            {/* Instructions */}
            {!isCallActive && (
              <Card className="p-6 bg-primary/5 border-primary/20">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Hướng dẫn sử dụng
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <span>Nhấn nút gọi màu xanh để bắt đầu phỏng vấn với Google Gemini AI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <span>Bật micro và <strong className="text-foreground">nói to, rõ ràng</strong> để AI nghe chính xác</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <span><strong className="text-foreground">QUAN TRỌNG:</strong> Khi AI hỏi tên, hãy đọc <strong className="text-yellow-600">chính xác tên đầy đủ</strong> như trong CV. Nếu không khớp, phỏng vấn sẽ kết thúc</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">4.</span>
                    <span>AI sẽ phân tích CV của bạn và đặt câu hỏi phù hợp với giọng nữ tiếng Việt tự nhiên</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">5.</span>
                    <span>Nhấn nút đỏ để kết thúc phỏng vấn bất cứ lúc nào</span>
                  </li>
                </ul>
                
                {!geminiApiKey && (
                  <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive font-medium">
                      ⚠️ Chưa cấu hình Google Gemini API Key. Vui lòng thêm VITE_GEMINI_API_KEY vào file .env.local
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />
                    <p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
                      Đang tải dữ liệu CV...
                    </p>

                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Chat History */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <div className="p-4 border-b border-border bg-muted/30">
                <h3 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Lịch sử trò chuyện
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <p className="text-sm text-muted-foreground">
                      Bắt đầu cuộc gọi để xem lịch sử trò chuyện
                    </p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          msg.role === "user"
                            ? "bg-primary/10 text-primary"
                            : "bg-accent-mint/10 text-accent-mint"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={`flex-1 ${msg.role === "user" ? "text-right" : "text-left"}`}
                      >
                        <div
                          className={`inline-block rounded-2xl px-4 py-2 max-w-[85%] ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 px-2">
                          {msg.timestamp.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={submitTextMessage} className="border-t border-border p-3">
                <div className="flex gap-2">
                  <input
                    value={userInput}
                    onChange={(event) => setUserInput(event.target.value)}
                    disabled={!isConnected}
                    placeholder={isConnected ? "Nhap cau hoi..." : "Ket noi de hoi bot"}
                    className="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button
                    type="submit"
                    size="default"
                    disabled={!isConnected || !userInput.trim()}
                    aria-label="Gui tin nhan"
                    className="h-10 w-10 shrink-0 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
