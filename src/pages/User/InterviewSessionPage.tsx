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
import { useTranslation } from "react-i18next";
import { QuotaExceededPromoModal } from "@/components/QuotaExceededPromoModal";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function InterviewSessionPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
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
  const [userTranscript, setUserTranscript] = useState('');
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [quota, setQuota] = useState<{
    used: number;
    limit: number | "unlimited";
    remaining: number | "unlimited";
    reset_at: string;
    plan: string;
  } | null>(null);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const browserRecognitionRef = useRef<SpeechRecognition | null>(null);
  const browserRecognitionRunningRef = useRef(false);
  const shouldRunBrowserRecognitionRef = useRef(false);
  const browserRecognitionRestartTimerRef = useRef<number | null>(null);
  const browserTranscriptRef = useRef('');
  const browserTranscriptCommitTimerRef = useRef<number | null>(null);

  // Chrome/Edge expose this API with the prefixed name.  It is used only for
  // the visible Vietnamese transcript; Gemini Live still receives the audio.
  const browserSpeechSupported = typeof window !== 'undefined' && Boolean(
    window.SpeechRecognition || window.webkitSpeechRecognition,
  );


  const addMessage = (role: "user" | "assistant", content: string) => {
    const normalizedContent = content.trim();
    if (!normalizedContent) return;
    setMessages((prev) => [...prev, { role, content: normalizedContent, timestamp: new Date() }]);
  };

  const clearBrowserTranscriptCommitTimer = () => {
    if (browserTranscriptCommitTimerRef.current !== null) {
      window.clearTimeout(browserTranscriptCommitTimerRef.current);
      browserTranscriptCommitTimerRef.current = null;
    }
  };

  const commitBrowserTranscript = () => {
    clearBrowserTranscriptCommitTimer();
    const transcript = browserTranscriptRef.current.trim();
    if (!transcript) return;

    browserTranscriptRef.current = '';
    setUserTranscript('');
    addMessage('user', transcript);
  };

  const scheduleBrowserTranscriptCommit = () => {
    clearBrowserTranscriptCommitTimer();
    // Keep short pauses inside one answer, while still committing the answer
    // before Gemini has time to send the next question.
    browserTranscriptCommitTimerRef.current = window.setTimeout(() => {
      commitBrowserTranscript();
    }, 700);
  };

  // Read persona from sessionStorage
  const savedPersona = sessionStorage.getItem('interview_persona');
  const interviewPersona = savedPersona ? JSON.parse(savedPersona) : {
    id: 'sweet' as const,
    gender: 'female' as const,
    voiceName: 'Aoede',
    systemPromptOverride: undefined,
  };

  // Read interview setup from sessionStorage (saved by InterviewSetupPage) or query params
  const savedSetup = sessionStorage.getItem('interview_setup');
  const interviewSetup = savedSetup ? JSON.parse(savedSetup) : null;
  const urlParams = new URLSearchParams(window.location.search);
  const setupCompany: string = interviewSetup?.company || urlParams.get('company') || '';
  const setupPosition: string = interviewSetup?.position || urlParams.get('position') || '';
  const setupLevel: string = interviewSetup?.level || urlParams.get('level') || '';
  const setupModel: string = interviewSetup?.model || urlParams.get('model') || 'gemini-2.5-flash';
  const setupQuestions = interviewSetup?.questions || [];

  // Use Gemini Live hook V2 (complete implementation from smile-clinic)
  const {
    isConnected,
    isListening,
    isAISpeaking,
    isProcessing,
    isUserSpeaking,
    connect,
    disconnect,
    startListening,
    stopListening,
    sendMessage,
    setSpeakerEnabled,
  } = useGeminiLiveV2({
    userId: user?.id,
    userRole: user?.role,
    interviewPersona,
    personaGender: interviewPersona?.gender,
    cvData: cvData,
    candidateName,
    targetCompany: setupCompany,
    targetPosition: setupPosition,
    targetLevel: setupLevel,
    selectedModel: setupModel,
    customQuestions: setupQuestions.length > 0 ? setupQuestions : undefined,
    onMessage: (message, role) => {
      // Web Speech API is the source of truth for the user's Vietnamese text.
      // Do not render Gemini's input transcription as another user bubble.
      if (role === 'user' && browserSpeechSupported) return;

      if (role === 'assistant') {
        // If the browser has already finalized an answer, place it in history
        // immediately before the following AI message.
        if (browserSpeechSupported) commitBrowserTranscript();
        setStreamingMessage(''); // clear streaming bubble
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
    },
    onError: (error) => {
      console.error("Gemini error:", error);
      if (["NotAllowedError", "PermissionDeniedError", "SecurityError"].includes(error.name)) {
        setIsMicOn(false);
        setStartError(t(
          "interview.session.error.microphonePermission",
          "Trình duyệt đang chặn micro. Hãy cho phép Microphone trong cài đặt trang web, sau đó bật micro lại.",
        ));
        return;
      }
      addMessage("assistant", t("interview.session.chat.errorGeneric"));
    },
    onSessionEnd: () => {
      // Session ended
      setIsCallActive(false);
      setIsMicOn(false);
      setHasAISpoken(false);
    },
    onTranscript: (text, isFinal) => {
      if (browserSpeechSupported) return;
      if (isFinal) {
        setUserTranscript('');
      } else if (text?.trim()) {
        setUserTranscript(text.trim());
      }
    },
    onAudioMetrics: (metrics) => {
      setAudioMetrics(prev => [...prev, metrics]);
    },
  });

  // Scroll only the chat panel. Using scrollIntoView here also scrolls the
  // whole page, which makes the interview layout jump on every new message.
  const scrollToBottom = () => {
    const chatPanel = chatScrollRef.current;
    if (!chatPanel) return;
    chatPanel.scrollTo({ top: chatPanel.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage, userTranscript]);

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

  // Browser speech recognition gives a Vietnamese transcript independent from
  // Gemini Live's multilingual input transcription (which can mis-detect Thai).
  useEffect(() => {
    if (!browserSpeechSupported) return;

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;

    const recognition = new Recognition();
    browserRecognitionRef.current = recognition;
    recognition.lang = 'vi-VN';
    recognition.continuous = true;
    recognition.interimResults = true;
    // Ask the browser for a few candidates. It improves common mixed
    // Vietnamese/English technical terms when the browser supports it.
    recognition.maxAlternatives = 3;

    const appendFinalText = (text: string) => {
      const next = text.trim();
      if (!next) return;
      const previous = browserTranscriptRef.current.trim();
      if (!previous) {
        browserTranscriptRef.current = next;
      } else if (next.startsWith(previous)) {
        browserTranscriptRef.current = next;
      } else if (!previous.endsWith(next)) {
        browserTranscriptRef.current = `${previous} ${next}`;
      }
    };

    recognition.onstart = () => {
      browserRecognitionRunningRef.current = true;
    };

    recognition.onresult = (event) => {
      let interim = '';
      let receivedFinalText = false;

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const text = event.results[index][0]?.transcript?.trim() || '';
        if (!text) continue;
        if (event.results[index].isFinal) {
          appendFinalText(text);
          receivedFinalText = true;
        } else {
          interim = `${interim} ${text}`.trim();
        }
      }

      const visibleTranscript = [browserTranscriptRef.current, interim]
        .filter(Boolean)
        .join(' ')
        .trim();
      setUserTranscript(visibleTranscript);

      if (receivedFinalText) scheduleBrowserTranscriptCommit();
    };

    recognition.onerror = (event) => {
      browserRecognitionRunningRef.current = false;
      // Permission errors cannot be solved by restarting in a loop.
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        shouldRunBrowserRecognitionRef.current = false;
        console.warn('Web Speech API does not have microphone permission.');
      }
    };

    recognition.onend = () => {
      browserRecognitionRunningRef.current = false;
      if (!shouldRunBrowserRecognitionRef.current) return;

      browserRecognitionRestartTimerRef.current = window.setTimeout(() => {
        if (!shouldRunBrowserRecognitionRef.current || browserRecognitionRunningRef.current) return;
        try {
          recognition.start();
        } catch {
          // A start while Chrome is closing the previous recognition is ignored.
        }
      }, 150);
    };

    return () => {
      shouldRunBrowserRecognitionRef.current = false;
      clearBrowserTranscriptCommitTimer();
      if (browserRecognitionRestartTimerRef.current !== null) {
        window.clearTimeout(browserRecognitionRestartTimerRef.current);
        browserRecognitionRestartTimerRef.current = null;
      }
      recognition.abort();
      browserRecognitionRef.current = null;
      browserRecognitionRunningRef.current = false;
    };
  }, [browserSpeechSupported]);

  useEffect(() => {
    if (!browserSpeechSupported || !browserRecognitionRef.current) return;

    const shouldRecognize = isCallActive && isConnected && isMicOn && !isAISpeaking;
    shouldRunBrowserRecognitionRef.current = shouldRecognize;
    const recognition = browserRecognitionRef.current;

    if (shouldRecognize && !browserRecognitionRunningRef.current) {
      try {
        recognition.start();
      } catch {
        // Recognition is already starting/running; onend will retry if needed.
      }
      return;
    }

    if (!shouldRecognize && browserRecognitionRunningRef.current) {
      recognition.stop();
    }
  }, [browserSpeechSupported, isCallActive, isConnected, isMicOn, isAISpeaking]);

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
          setCvData(t("interview.session.error.loadInfo"));
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
          setCvData(t("interview.session.error.loadContent"));
          return;
        }

        const textData = await textRes.json();
        setCvData(textData.text || '');
      } catch (error) {
        console.error('Error loading CV:', error);
        setCvData(t("interview.session.error.loadInfo"));
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) {
      void loadCVData();
    }
  }, [user?.id, user?.role]);

  // Fetch interview quota & check promo auto-show
  useEffect(() => {
    if (!user?.id) return;
    fetch('/api/interview/quota', {
      headers: { 'x-user-id': user.id, 'x-user-role': user.role ?? 'user' },
    })
      .then(r => r.json())
      .then(async (data) => {
        setQuota(data);
        if (data.plan === "free" && data.remaining === 0) {
          try {
            const promoRes = await fetch("/api/promotions/quota-exceeded-promo");
            const promoData = await promoRes.json();
            if (promoData.success && promoData.promo && promoData.promo.enabled) {
              const storageKey = "quota_promo_deadline";
              const storedDeadline = localStorage.getItem(storageKey);
              let deadline: number;

              if (storedDeadline) {
                deadline = parseInt(storedDeadline, 10);
                // Nếu deadline cũ đã hết hạn → đây là lần hết lượt MỚI (quota đã reset tuần mới)
                // → Xóa deadline cũ và tạo deadline mới để popup hiển thị lại
                if (Date.now() >= deadline) {
                  deadline = Date.now() + promoData.promo.countdownMinutes * 60 * 1000;
                  localStorage.setItem(storageKey, String(deadline));
                }
              } else {
                deadline = Date.now() + promoData.promo.countdownMinutes * 60 * 1000;
                localStorage.setItem(storageKey, String(deadline));
              }

              const isExpired = Date.now() >= deadline;

              // Trong thời gian đếm ngược -> Vẫn hiển thị popup. Hết hạn đếm ngược -> K hiển thị nữa.
              if (!isExpired) {
                setShowPromoModal(true);
              }
            }
          } catch (err) {
            console.error("Error checking promo status:", err);
          }
        }
      })
      .catch(console.error);
  }, [user?.id, user?.role]);

  const refreshQuota = () => {
    if (!user?.id) return;
    fetch('/api/interview/quota', {
      headers: { 'x-user-id': user.id, 'x-user-role': user.role ?? 'user' },
    })
      .then(r => r.json())
      .then(setQuota)
      .catch(console.error);
  };

  const startCall = async () => {
    if (isCallActive) return;

    // Reset toàn bộ state từ phiên cũ
    setMessages([]);
    setHasAISpoken(false);
    setStreamingMessage('');
    setUserTranscript('');
    setSessionId(null);
    setStartError(null);
    setAudioMetrics([]);

    // Check quota trước — nếu hết lượt thì mở popup ưu đãi (nếu chưa hết hạn đếm ngược)
    if (quota !== null && quota.remaining !== "unlimited" && quota.remaining <= 0) {
      const storedDeadline = localStorage.getItem("quota_promo_deadline");
      let isExpired = false;
      if (storedDeadline) {
        isExpired = Date.now() >= parseInt(storedDeadline, 10);
        // Nếu deadline cũ đã expired → tạo deadline mới (quota đã reset tuần mới)
        if (isExpired) {
          // Fetch promo config để tạo deadline mới
          try {
            const promoRes = await fetch("/api/promotions/quota-exceeded-promo");
            const promoData = await promoRes.json();
            if (promoData.success && promoData.promo && promoData.promo.enabled) {
              const newDeadline = Date.now() + promoData.promo.countdownMinutes * 60 * 1000;
              localStorage.setItem("quota_promo_deadline", String(newDeadline));
              isExpired = false; // Deadline mới, chưa hết hạn
            }
          } catch {
            // Nếu không fetch được promo, vẫn hiển thị lỗi
          }
        }
      }
      if (!isExpired) {
        setShowPromoModal(true);
      } else {
        setStartError(t("interview.session.error.quotaExceeded", "Bạn đã sử dụng hết lượt phỏng vấn miễn phí tuần này. Vui lòng nâng cấp gói!"));
      }
      return;
    }

    setIsCallActive(true);
    setIsMicOn(true);
    setStartError(null);
    addMessage("assistant", t("interview.session.chat.connecting"));
    
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const cvId = urlParams.get('cv_id');
      
      if (!cvId) {
        throw new Error(t("interview.session.error.missingCV"));
      }
      
      const response = await fetch('/api/interview/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?.id ?? '',
          'x-user-role': user?.role ?? '',
        },
        body: JSON.stringify({
          cv_id: cvId,
          company: setupCompany || undefined,
          position: setupPosition || undefined,
          level: setupLevel || undefined,
          model: setupModel || undefined,
          questions: setupQuestions.length > 0 ? setupQuestions : undefined,
        }),
      });
      
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || t("interview.session.error.startFailed"));
      }
      
      const data = await response.json();
      setSessionId(data.session_id);

      // Use cv_text from interview/start response
      // Fall back to cvData already loaded from useEffect if server didn't return it
      const cvText = data.cv_text?.trim() || cvData?.trim() || '';
      const resolvedCandidateName = data.candidate_name || candidateName || '';

      if (!cvText || cvText.length < 10) {
        throw new Error(t("interview.session.error.noData"));
      }

      setCvData(cvText);
      setCandidateName(resolvedCandidateName);

      // Pass cv_text directly — no race condition
      await connect(cvText, resolvedCandidateName);
      setSpeakerEnabled(true);
    } catch (error) {
      console.error("Failed to start call:", error);
      const msg = error instanceof Error ? error.message : t("interview.session.error.generic");
      setStartError(msg);
      addMessage("assistant", t("interview.session.error.connectionFailed", { error: msg }));
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
            ended_by_user: true,
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
    refreshQuota();
  };

  const toggleMic = async () => {
    if (!isCallActive) return;
    
    const newMicState = !isMicOn;
    setIsMicOn(newMicState);
    setStartError(null);

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
          <p className="text-muted-foreground">{t("interview.session.loadingInfo")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-[100dvh] lg:min-h-0 bg-background text-foreground relative lg:overflow-hidden flex flex-col font-sans">
      {/* Strong background gradient overlay so transparent panels show glassmorphism effect (fixed to viewport) */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 pointer-events-none -z-10" />
      {/* Large glowing blobs using primary color (fixed to viewport — not affected by reflow) */}
      <div className="fixed -top-32 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none -z-10 bg-primary/25 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="fixed -bottom-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none -z-10 bg-primary/20 blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none -z-10 bg-accent-mint/15 blur-[80px]" />

      {/* Header */}
      <header className="border-b border-border/30 bg-background/60 backdrop-blur-xl z-10 w-full shrink-0">
        <div className="w-full px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">{t("interview.session.title")}</h1>
              <p className="text-xs text-muted-foreground min-w-[120px]">
                {isCallActive && !isConnected ? t("interview.session.status.connectingAI") : isConnected ? t("interview.session.connected") : t("interview.session.ready")}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                {interviewPersona.id === 'tough' ? t("interview.session.persona.huong")
                 : interviewPersona.id === 'mentor' ? t("interview.session.persona.minh")
                 : t("interview.session.persona.linh")}
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
            {t("interview.session.changeModel")}
          </Button>
        </div>
      </header>

      <div className="w-full px-8 py-8 flex-1 min-h-0 overflow-y-auto lg:overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch lg:h-full lg:min-h-0 min-h-[600px]">
          {/* Instructions */}
          <div className="lg:col-span-3 h-full min-h-0">
            <div className="h-full min-h-0 p-6 bg-foreground/5 backdrop-blur-xl border border-border/50 flex flex-col justify-between shadow-lg rounded-3xl">
              <div>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
                  <MessageSquare className="h-5 w-5 text-primary" />
                   {t("interview.session.guideTitle")}
                </h3>
                <ul className="space-y-3.5 text-sm text-muted-foreground">
                   <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <span>{t("interview.session.guide.step1")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <span>{t("interview.session.guide.step2")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <span>{t("interview.session.guide.step3")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">4.</span>
                    <span>{t("interview.session.guide.step4")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">5.</span>
                    <span>{t("interview.session.guide.step5")}</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-auto pt-4 border-t border-border/30 space-y-3">
                {quota !== null && (
                  <div
                    onClick={() => {
                      if (quota.remaining === 0) setShowPromoModal(true);
                    }}
                    className={`p-3 rounded-lg border transition-all ${
                      quota.remaining === "unlimited"
                        ? 'bg-emerald-500/10 border-emerald-500/20'
                        : quota.remaining === 0
                        ? 'bg-rose-500/10 border-rose-500/20 cursor-pointer hover:bg-rose-500/20 hover:scale-[1.02]'
                        : quota.remaining === 1
                        ? 'bg-amber-500/10 border-amber-500/20'
                        : 'bg-emerald-500/10 border-emerald-500/20'
                    }`}
                  >
                    <p className={`text-xs font-medium ${
                      quota.remaining === "unlimited" ? 'text-emerald-600'
                      : quota.remaining === 0 ? 'text-rose-600 font-semibold'
                      : quota.remaining === 1 ? 'text-amber-600'
                      : 'text-emerald-600'
                    }`}>
                      {quota.remaining === "unlimited"
                        ? "🎯 Không giới hạn lượt phỏng vấn"
                        : quota.remaining === 0
                        ? t("interview.session.warning.quotaExceeded", {
                            resetDate: new Date(quota.reset_at).toLocaleDateString('vi-VN', {
                              weekday: 'long', day: 'numeric', month: 'numeric',
                            })
                          })
                        : t("interview.session.warning.quotaRemaining", {
                            remaining: quota.remaining,
                            limit: quota.limit,
                          })
                      }
                    </p>
                    {quota.remaining === 0 && quota.plan === 'free' && (
                      <p className="text-xs text-rose-500 font-bold mt-1 underline">
                        👉 {t("interview.session.warning.upgrade")} (Nhận ưu đãi giảm giá)
                      </p>
                    )}
                  </div>
                )}

                {loading && (
                  <div className="p-3 bg-muted/50 border border-border/30 rounded-lg flex items-center gap-2">
                    <Loader2 className="h-3 w-3 text-muted-foreground animate-spin" />
                    <p className="text-xs text-muted-foreground font-medium">
                      {t("interview.session.loadingCVData")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Video/Avatar Section */}
          <div className="lg:col-span-6 h-full min-h-0">
            <div className="relative overflow-hidden bg-foreground/5 backdrop-blur-xl border border-border/50 shadow-lg rounded-3xl h-full min-h-0 flex flex-col justify-between">
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
                      {isCallActive ? t("interview.session.status.interviewing") : t("interview.session.status.notStarted")}
                    </span>
                  </div>
                </div>

                {/* Dynamic Status Banner */}
                {isCallActive && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                    {(!isConnected || !hasAISpoken) ? (
                      // Trạng thái 1: Mới ấn gọi, đang kết nối hoặc AI chưa nói lần nào
                      <div className="flex items-center gap-2.5 bg-blue-600/95 backdrop-blur-md rounded-full px-5 py-2.5 shadow-lg">
                        <Loader2 className="h-4 w-4 text-white animate-spin" />
                        <span className="text-sm text-white font-semibold">{t("interview.session.status.connectingAI")}</span>
                      </div>
                    ) : isAISpeaking ? (
                      // Trạng thái 2: AI đang phát âm thanh
                      <div className="flex items-center gap-2.5 bg-emerald-600/95 backdrop-blur-md rounded-full px-5 py-2.5 shadow-lg">
                        <Bot className="h-4 w-4 text-white animate-pulse" />
                        <span className="text-sm text-white font-semibold">{t("interview.session.status.aiSpeaking")}</span>
                      </div>
                    ) : (isListening || isUserSpeaking) ? (
                      // Trạng thái 3: Mic bật chờ user nói HOẶC user đang nói — gộp chung 1 màu đỏ
                      <div className="flex items-center gap-2.5 bg-rose-600/95 backdrop-blur-md rounded-full px-5 py-2.5 shadow-lg">
                        <Mic className="h-4 w-4 text-white animate-pulse" />
                        <span className="text-sm text-white font-semibold">{t("interview.session.status.aiListening")}</span>
                      </div>
                    ) : isProcessing ? (
                      // Trạng thái 4: User nói xong, AI đang xử lí trước khi trả lời
                      <div className="flex items-center gap-2.5 bg-amber-600/95 backdrop-blur-md rounded-full px-5 py-2.5 shadow-lg">
                        <Loader2 className="h-4 w-4 text-white animate-spin" />
                        <span className="text-sm text-white font-semibold">{t("interview.session.status.aiProcessing")}</span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Control Buttons */}
              <div className="p-6 bg-foreground/5 border-t border-border/40">
                {startError && (
                  <p role="alert" className="mx-auto mb-4 max-w-xl rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-center text-sm text-destructive">
                    {startError}
                  </p>
                )}
                <div className="flex items-center justify-center gap-4">
                  {!isCallActive ? (
          <div className="flex flex-col items-center gap-3 min-h-[64px] justify-center">
            <Button
              size="default"
              onClick={startCall}
              disabled={loading}
              className="rounded-full h-16 w-16 bg-emerald-500 hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-transform duration-150 shadow-lg shadow-emerald-500/20 p-0 flex items-center justify-center text-white"
            >
              <Phone className="h-6 w-6" />
            </Button>

            {loading && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t("interview.session.loadingCV")}</span>
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
          <div className="lg:col-span-3 h-full min-h-0">
            <div className="h-full min-h-0 flex flex-col bg-foreground/5 backdrop-blur-xl border border-border/50 shadow-lg rounded-3xl overflow-hidden">
              <div className="p-4 border-b border-border/40 bg-foreground/5 rounded-t-3xl">
                <h3 className="font-semibold flex items-center gap-2 text-foreground">
                  <MessageSquare className="h-5 w-5 text-primary" />
                   {t("interview.session.history")}
                </h3>
              </div>

              <div
                ref={chatScrollRef}
                className="flex-1 overflow-y-scroll overscroll-contain p-4 space-y-4 min-h-0"
                style={{ scrollbarGutter: 'stable' }}
              >
                {messages.length === 0 && !isCallActive ? (
                  <div className="h-full flex items-center justify-center text-center">
                    <p className="text-sm text-muted-foreground">
                      {t("interview.session.empty.history")}
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
                            className={`inline-block rounded-2xl px-4 py-2 max-w-[85%] text-left ${
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
                    {isAISpeaking && streamingMessage && (
                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-500/20 text-emerald-600 border border-emerald-500/30">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="inline-block rounded-2xl px-4 py-2 max-w-[85%] bg-muted text-foreground border border-primary/30">
                            <p className="text-sm">{streamingMessage}</p>
                            <span className="inline-block w-1.5 h-3 bg-primary ml-1 animate-pulse" />
                          </div>
                        </div>
                      </div>
                    )}
                    {userTranscript && (
                      <div className="flex gap-3 flex-row-reverse">
                        <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/20 text-white border border-primary/30">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="flex-1 text-right">
                          <div className="inline-block rounded-2xl px-4 py-2 max-w-[85%] text-left bg-muted text-muted-foreground border border-dashed border-primary/30">
                            <p className="text-sm italic">{userTranscript}</p>
                            <span className="inline-block w-1.5 h-3 bg-primary ml-1 animate-pulse" />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPromoModal && (
        <QuotaExceededPromoModal
          onClose={() => setShowPromoModal(false)}
          onSuccess={refreshQuota}
        />
      )}
    </div>
  );
}
