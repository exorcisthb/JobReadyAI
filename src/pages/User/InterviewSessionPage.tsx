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
  ArrowLeft,
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
    isProcessing,
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
        <div className="flex flex-col items-center gap-4 text-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang tải thông tin phỏng vấn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col justify-between font-sans">
      {/* Strong background gradient overlay so transparent panels show glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 pointer-events-none -z-10" />
      {/* Large glowing blobs using primary color */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none -z-10 bg-primary/25 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none -z-10 bg-primary/20 blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none -z-10 bg-accent-mint/15 blur-[80px]" />

      {/* Header */}
      <header className="border-b border-border/30 bg-background/60 backdrop-blur-xl sticky top-0 z-10 w-full">
        <div className="w-full px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">Phỏng vấn với JobReady AI</h1>
              <p className="text-xs text-muted-foreground min-w-[120px]">
                {isCallActive && !isConnected ? "Đang kết nối..." : isConnected ? "Đã kết nối" : "Sẵn sàng bắt đầu"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                {interviewPersona.id === 'tough' ? '💼 Bà Hương Khó Tính'
                 : interviewPersona.id === 'mentor' ? '🧑‍💻 Anh Minh Mentor'
                 : '🌸 Chị Linh Dịu Dàng'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              window.location.assign(`/interview/persona?${params.toString()}`);
            }}
            className="inline-flex items-center gap-1.5 border-border hover:bg-muted text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Chọn lại model
          </Button>
        </div>
      </header>

      <div className="w-full px-8 py-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch lg:h-[calc(100vh-170px)] min-h-[600px]">
          {/* Instructions */}
          <div className="lg:col-span-3 h-full">
            <div className="h-full p-6 bg-foreground/5 backdrop-blur-xl border border-border/50 flex flex-col justify-between shadow-lg rounded-3xl">
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Hướng dẫn sử dụng
                </h3>
                <ul className="space-y-3.5 text-sm text-muted-foreground">
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
                    <span><strong className="text-foreground">QUAN TRỌNG:</strong> Khi AI hỏi tên, hãy đọc <strong className="text-yellow-600 font-semibold">chính xác tên đầy đủ</strong> như trong CV. Nếu không khớp, phỏng vấn sẽ kết thúc</span>
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
              </div>
              
              <div className="mt-auto pt-4 border-t border-border/30 space-y-3">
                {!geminiApiKey && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                    <p className="text-xs text-rose-600 font-medium">
                      ⚠️ Chưa cấu hình Google Gemini API Key. Vui lòng thêm VITE_GEMINI_API_KEY vào file .env.local
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="p-3 bg-muted/50 border border-border/30 rounded-lg flex items-center gap-2">
                    <Loader2 className="h-3 w-3 text-muted-foreground animate-spin" />
                    <p className="text-xs text-muted-foreground font-medium">
                      Đang tải dữ liệu CV...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Video/Avatar Section */}
          <div className="lg:col-span-6 h-full">
            <div className="relative overflow-hidden bg-foreground/5 backdrop-blur-xl border border-border/50 shadow-lg rounded-3xl h-full flex flex-col justify-between">
              <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
                {/* AI Avatar */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={`relative ${isCallActive ? "animate-pulse" : ""}`}
                  >
                    <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-blue-400 to-emerald-300 opacity-30 blur-md" />
                    <div className="h-40 w-40 rounded-full bg-gradient-to-br from-primary to-accent-mint flex items-center justify-center shadow-[0_0_50px_rgba(var(--color-primary-rgb),0.2)] border border-white relative z-10">
                      <Bot className="h-20 w-20 text-white" />
                    </div>
                    {isCallActive && (
                      <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping z-0" />
                    )}
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="absolute top-6 left-6">
                  <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${isCallActive ? "bg-emerald-400 animate-pulse" : "bg-slate-400"}`}
                    />
                    <span className="text-xs text-white font-semibold tracking-wide">
                      {isCallActive ? "Đang phỏng vấn" : "Chưa bắt đầu"}
                    </span>
                  </div>
                </div>

                {/* Dynamic Status Banner */}
                {isCallActive && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                    {!hasAISpoken ? (
                      <div className="flex items-center gap-2.5 bg-blue-600/95 backdrop-blur-md rounded-full px-5 py-2.5 shadow-lg">
                        <Loader2 className="h-4 w-4 text-white animate-spin" />
                        <span className="text-sm text-white font-semibold">Đang kết nối với AI...</span>
                      </div>
                    ) : isAISpeaking ? (
                      <div className="flex items-center gap-2.5 bg-emerald-600/95 backdrop-blur-md rounded-full px-5 py-2.5 shadow-lg">
                        <Bot className="h-4 w-4 text-white animate-pulse" />
                        <span className="text-sm text-white font-semibold">AI đang nói...</span>
                      </div>
                    ) : isProcessing ? (
                      <div className="flex items-center gap-2.5 bg-amber-600/95 backdrop-blur-md rounded-full px-5 py-2.5 shadow-lg">
                        <Loader2 className="h-4 w-4 text-white animate-spin" />
                        <span className="text-sm text-white font-semibold">AI đang xử lí...</span>
                      </div>
                    ) : isListening ? (
                      <div className="flex items-center gap-2.5 bg-rose-600/95 backdrop-blur-md rounded-full px-5 py-2.5 shadow-lg">
                        <Mic className="h-4 w-4 text-white animate-pulse" />
                        <span className="text-sm text-white font-semibold">AI đang nghe...</span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Control Buttons */}
              <div className="p-6 bg-foreground/5 border-t border-border/40">
                <div className="flex items-center justify-center gap-4">
                  {!isCallActive ? (
          <div className="flex flex-col items-center gap-3 min-h-[64px] justify-center">
            <Button
              size="default"
              onClick={startCall}
              disabled={!geminiApiKey || loading}
              className="rounded-full h-16 w-16 bg-emerald-500 hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-transform duration-150 shadow-lg shadow-emerald-500/20 p-0 flex items-center justify-center text-white"
            >
              <Phone className="h-6 w-6" />
            </Button>

            {loading && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang tải CV...</span>
              </div>
            )}
          </div>
                  ) : (
                    <div className="flex items-center justify-center gap-4 min-h-[64px]">
                      <Button
                        size="default"
                        variant={isMicOn ? "default" : "secondary"}
                        onClick={toggleMic}
                        className={`rounded-full h-14 w-14 p-0 hover:scale-105 active:scale-95 transition-transform ${
                          isMicOn
                            ? "bg-slate-800 text-white border border-slate-700 hover:bg-slate-700"
                            : "bg-rose-100 text-rose-600 border border-rose-200 hover:bg-rose-200"
                        }`}
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
                        className="rounded-full h-16 w-16 bg-rose-600 hover:bg-rose-700 hover:scale-105 active:scale-95 transition-transform duration-150 shadow-lg shadow-rose-600/20 p-0 flex items-center justify-center text-white"
                      >
                        <PhoneOff className="h-6 w-6" />
                      </Button>

                      <Button
                        size="default"
                        variant={isSpeakerOn ? "default" : "secondary"}
                        onClick={toggleSpeaker}
                        className={`rounded-full h-14 w-14 p-0 hover:scale-105 active:scale-95 transition-transform ${
                          isSpeakerOn
                            ? "bg-slate-800 text-white border border-slate-700 hover:bg-slate-700"
                            : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {isSpeakerOn ? (
                          <Volume2 className="h-5 w-5" />
                        ) : (
                          <VolumeX className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Chat History */}
          <div className="lg:col-span-3 h-full">
            <div className="h-full flex flex-col bg-foreground/5 backdrop-blur-xl border border-border/50 shadow-lg rounded-3xl">
              <div className="p-4 border-b border-border/40 bg-foreground/5 rounded-t-3xl">
                <h3 className="font-semibold flex items-center gap-2 text-foreground">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Lịch sử trò chuyện
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && !isCallActive ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <p className="text-sm text-muted-foreground">
                      Bắt đầu cuộc gọi để xem lịch sử trò chuyện
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.role === "user"
                              ? "bg-primary/20 text-white border border-primary/30"
                              : "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30"
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
                                : "bg-muted text-foreground border border-border/20"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-1 px-2">
                            {msg.timestamp.toLocaleTimeString("vi-VN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isAISpeaking && (streamingMessage || lastAIText) && (
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-500/20 text-emerald-600 border border-emerald-500/30">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="inline-block rounded-2xl px-4 py-2 max-w-[85%] bg-muted text-foreground border border-primary/30">
                            <p className="text-sm">{streamingMessage || lastAIText}</p>
                            <span className="inline-block w-1.5 h-3 bg-primary ml-1 animate-pulse" />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
