import { useEffect, useState, useRef } from "react";
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
  const [cvData, setCvData] = useState<string>("");
  const [candidateName, setCandidateName] = useState("");
  const [loading, setLoading] = useState(true);
  const [startError, setStartError] = useState<string | null>(null);
  const [audioMetrics, setAudioMetrics] = useState<{
    volume: number;
    speechRate: number;
    pauseCount: number;
    avgPauseDuration: number;
    confidence: 'low' | 'medium' | 'high';
  }[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hasAISpoken, setHasAISpoken] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [lastAIText, setLastAIText] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get Gemini API key from environment
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

  // Read persona from sessionStorage
  const savedPersona = sessionStorage.getItem('interview_persona');
  const interviewPersona = savedPersona ? JSON.parse(savedPersona) : {
    id: 'sweet' as const,
    gender: 'female' as const,
    voiceName: 'Aoede',
    systemPromptOverride: undefined,
  };

  // Use Gemini Live hook V2 (complete implementation from smile-clinic)
  const {
    isConnected,
    isListening,
    isAISpeaking,
    connect,
    disconnect,
    startListening,
    stopListening,
    sendMessage,
    setSpeakerEnabled,
  } = useGeminiLiveV2({
    apiKey: geminiApiKey,
    interviewPersona,
    personaGender: interviewPersona?.gender,
    cvData: cvData,
    candidateName,
    onMessage: (message, role) => {
      if (role === 'assistant') {
        setStreamingMessage(''); // clear streaming bubble
        setLastAIText(message); // save for "now playing" display while audio plays
        // Filter out internal thinking/planning blocks
        // These are English meta-commentary about what the AI will do
        // Real interview speech is always in Vietnamese
        const isThinkingBlock = (
          // Starts with markdown bold thinking header
          /^\*\*[A-Z]/.test(message.trim()) ||
          // Pure English paragraphs (thinking blocks are always in English)
          // Real responses are Vietnamese — check if >70% ASCII letters = English
          (() => {
            const letters = message.replace(/[^a-zA-ZÀ-ỹ]/g, '');
            if (letters.length < 20) return false;
            const asciiLetters = message.replace(/[^a-zA-Z]/g, '').length;
            const totalLetters = letters.length;
            return asciiLetters / totalLetters > 0.85;
          })()
        );
        if (isThinkingBlock) return;
      }
      addMessage(role, message);
    },
    onPartialMessage: (text) => {
      setStreamingMessage(text);
      if (!text) setLastAIText(''); // clear when turncomplete resets it
    },
    onError: (error) => {
      console.error("Gemini error:", error);
      addMessage("assistant", "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.");
    },
    onSessionEnd: () => {
      // Session ended
      setIsCallActive(false);
      setIsMicOn(false);
      setHasAISpoken(false);
    },
    onTranscript: (text, isFinal) => {
      // Model gemini-2.5-flash-native-audio-latest does not emit inputtranscription
      // User transcript is not available — do nothing here
    },
    onAudioMetrics: (metrics) => {
      setAudioMetrics(prev => [...prev, metrics]);
    },
  });

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Track when AI starts speaking for the first time
  useEffect(() => {
    if (isAISpeaking && !hasAISpoken) {
      setHasAISpoken(true);
    }
  }, [isAISpeaking, hasAISpoken]);

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
    if (isCallActive) return;
    setIsCallActive(true);
    setIsMicOn(true);
    setStartError(null);
    addMessage("assistant", "Đang kết nối với JobReady AI...");
    setLoading(false);
    
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const cvId = urlParams.get('cv_id');
      
      if (!cvId) {
        throw new Error("Thiếu cv_id");
      }
      
      const response = await fetch('/api/interview/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id ?? '',
          'x-user-role': user?.role ?? '',
        },
        body: JSON.stringify({ cv_id: cvId }),
      });
      
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Không thể bắt đầu phiên phỏng vấn");
      }
      
      const data = await response.json();
      setSessionId(data.session_id);

      // Use cv_text from interview/start response
      // Fall back to cvData already loaded from useEffect if server didn't return it
      const cvText = data.cv_text?.trim() || cvData?.trim() || '';
      const resolvedCandidateName = data.candidate_name || candidateName || '';

      if (!cvText || cvText.length < 10) {
        throw new Error("CV không có đủ dữ liệu để tạo text. Vui lòng kiểm tra lại nội dung CV.");
      }

      setCvData(cvText);
      setCandidateName(resolvedCandidateName);

      // Pass cv_text directly — no race condition
      await connect(cvText, resolvedCandidateName);
      setSpeakerEnabled(true);
    } catch (error) {
      console.error("Failed to start call:", error);
      const msg = error instanceof Error ? error.message : "Đã có lỗi xảy ra";
      setStartError(msg);
      addMessage("assistant", `Xin lỗi, không thể kết nối: ${msg}. Vui lòng kiểm tra API key và thử lại.`);
      setIsCallActive(false);
      setIsMicOn(false);
      setHasAISpoken(false);
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

        // Try to extract scores from the final evaluation report
        // The AI outputs scores in format like "TỔNG ĐIỂM: X/100"
        let totalScore: number | null = null;
        let contentScore: number | null = null;
        let voiceScore: number | null = null;
        let strengths: string[] = [];
        let weaknesses: string[] = [];
        let improvements: string[] = [];

        if (feedback) {
          const totalMatch = feedback.match(/TỔNG ĐIỂM[:\s]+(\d+)\s*\/\s*100/i);
          if (totalMatch) totalScore = parseInt(totalMatch[1]);

          const contentMatch = feedback.match(/NỘI DUNG[^:]*[:\s]+(\d+)\s*\/\s*40/i);
          if (contentMatch) contentScore = parseInt(contentMatch[1]);

          const voiceMatch = feedback.match(/GIỌNG NÓI[^:]*[:\s]+(\d+)\s*\/\s*30/i);
          if (voiceMatch) voiceScore = parseInt(voiceMatch[1]);

          // Extract strengths (lines after ĐIỂM MẠNH section)
          const strengthsMatch = feedback.match(/ĐIỂM MẠNH[:\s]*([\s\S]*?)(?=ĐIỂM YẾU|⚠️|$)/i);
          if (strengthsMatch) {
            strengths = strengthsMatch[1]
              .split('\n')
              .map(l => l.replace(/^[-•*]\s*/, '').trim())
              .filter(l => l.length > 5)
              .slice(0, 5);
          }

          // Extract weaknesses
          const weaknessMatch = feedback.match(/ĐIỂM YẾU[:\s]*([\s\S]*?)(?=CV CLAIMS|🚩|LỘ TRÌNH|📈|$)/i);
          if (weaknessMatch) {
            weaknesses = weaknessMatch[1]
              .split('\n')
              .map(l => l.replace(/^[-•*]\s*/, '').trim())
              .filter(l => l.length > 5)
              .slice(0, 5);
          }

          // Extract improvements
          const improvementsMatch = feedback.match(/LỘ TRÌNH[^:]*[:\s]*([\s\S]*?)(?=ĐỀ XUẤT|✏️|VÍ DỤ|💡|$)/i);
          if (improvementsMatch) {
            improvements = improvementsMatch[1]
              .split('\n')
              .map(l => l.replace(/^\d+\.\s*/, '').replace(/^[-•*]\s*/, '').trim())
              .filter(l => l.length > 5)
              .slice(0, 5);
          }
        }
        
        await fetch(`/api/interview/${sessionId}/end`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user?.id ?? '',
            'x-user-role': user?.role ?? '',
          },
          body: JSON.stringify({
            conversation: messages,
            total_score: totalScore,
            content_score: contentScore,
            voice_score: voiceScore,
            audio_metrics: avgMetrics,
            feedback: feedback,
            strengths,
            weaknesses,
            improvements,
          }),
        });
        
        console.log('✅ Interview session saved with scores:', { totalScore, contentScore, voiceScore });
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
              <p className="text-xs text-muted-foreground">
                {interviewPersona.id === 'tough' ? '💼 Bà Hương Khó Tính'
                 : interviewPersona.id === 'mentor' ? '🧑‍💻 Anh Minh Mentor'
                 : '🌸 Chị Linh Dịu Dàng'}
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

                {/* Dynamic Status Banner */}
                {isCallActive && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    {!hasAISpoken ? (
                      <div className="flex items-center gap-2 bg-blue-500/90 backdrop-blur-sm rounded-full px-4 py-2">
                        <Loader2 className="h-4 w-4 text-white animate-spin" />
                        <span className="text-sm text-white font-medium">Đang kết nối với AI...</span>
                      </div>
                    ) : isAISpeaking ? (
                      <div className="flex items-center gap-2 bg-green-500/90 backdrop-blur-sm rounded-full px-4 py-2">
                        <Bot className="h-4 w-4 text-white animate-pulse" />
                        <span className="text-sm text-white font-medium">AI đang nói...</span>
                      </div>
                    ) : isListening ? (
                      <div className="flex items-center gap-2 bg-red-500/90 backdrop-blur-sm rounded-full px-4 py-2">
                        <Mic className="h-4 w-4 text-white animate-pulse" />
                        <span className="text-sm text-white font-medium">AI đang nghe...</span>
                      </div>
                    ) : null}
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
                {isAISpeaking && (streamingMessage || lastAIText) && (
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 bg-accent-mint/10 text-accent-mint">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="inline-block rounded-2xl px-4 py-2 max-w-[85%] bg-muted border border-primary/20">
                        <p className="text-sm">{streamingMessage || lastAIText}</p>
                        <span className="inline-block w-1.5 h-3 bg-primary ml-1 animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
