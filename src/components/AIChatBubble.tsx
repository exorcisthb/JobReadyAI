"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Sparkles, ChevronDown, ChevronUp, Check } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import logoJr from "@/assets/logo-jr.png";

// Custom animations for bubble
const bubbleAnimationStyles = `
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  @keyframes rotate-in {
    from { 
      transform: scale(1) rotate(0deg); 
      opacity: 1; 
    }
    to { 
      transform: scale(1.1) rotate(180deg); 
      opacity: 0; 
    }
  }
  
  @keyframes rotate-out {
    from { 
      transform: scale(0.8) rotate(-180deg); 
      opacity: 0; 
    }
    to { 
      transform: scale(1) rotate(0deg); 
      opacity: 1; 
    }
  }
  
  .bubble-breathe {
    animation: breathe 3s ease-in-out infinite;
  }
  
  .logo-rotate-in {
    animation: rotate-in 0.3s ease-out forwards;
  }
  
  .logo-rotate-out {
    animation: rotate-out 0.3s ease-out forwards;
  }
  
  .bubble-hover-glow {
    transition: all 0.3s ease;
  }
  
  .bubble-hover-glow:hover {
    filter: drop-shadow(0 0 20px rgba(99, 102, 241, 0.6));
  }
  
  .dark .bubble-hover-glow:hover {
    filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.6));
  }
`;

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  cvData?: any;
  isPreview?: boolean;
  showApplyButton?: boolean;
}

function renderMessage(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent inline-block font-extrabold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function CVPreviewCard({ cvData }: { cvData: any }) {
  return (
    <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-[#1e1e3a] dark:to-[#1a1a2e] border border-blue-200 dark:border-[#6366f1]/30 rounded-xl p-4 space-y-3 text-sm shadow-sm">
      {/* Personal Info */}
      <div>
        <p className="font-bold text-base text-foreground">{cvData.fullName || "Chưa có tên"}</p>
        <p className="text-primary font-medium">{cvData.jobTitle || "Chưa có vị trí"}</p>
      </div>
      {(cvData.phone || cvData.email || cvData.address) && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-muted-foreground text-xs">
          {cvData.phone && <span>📞 {cvData.phone}</span>}
          {cvData.email && <span>📧 {cvData.email}</span>}
          {cvData.address && <span>📍 {cvData.address}</span>}
        </div>
      )}
      <hr className="border-blue-200/50 dark:border-white/10" />
      {/* Objective */}
      {cvData.objective && (
        <div>
          <p className="font-semibold text-foreground mb-1">🎯 Mục tiêu</p>
          <p className="text-muted-foreground leading-relaxed text-xs">{cvData.objective}</p>
        </div>
      )}
      {/* Experience */}
      {cvData.experience && cvData.experience.length > 0 && (
        <div>
          <p className="font-semibold text-foreground mb-1">💼 Kinh nghiệm</p>
          {cvData.experience.map((exp: any, i: number) => (
            <div key={i} className="mb-1.5 last:mb-0">
              <p className="font-medium text-foreground text-xs">
                {exp.position}{exp.company ? <span className="text-muted-foreground font-normal"> — {exp.company}</span> : ""}
              </p>
              {(exp.startDate || exp.endDate) && (
                <p className="text-[11px] text-muted-foreground">{exp.startDate || "?"} - {exp.endDate || "Hiện tại"}</p>
              )}
              {exp.description && (
                <p className="text-muted-foreground text-[11px] leading-relaxed mt-0.5 whitespace-pre-line line-clamp-3">
                  {exp.description.replace(/•\s*/g, '• ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Education */}
      {cvData.education && cvData.education.length > 0 && (
        <div>
          <p className="font-semibold text-foreground mb-1">🎓 Học vấn</p>
          {cvData.education.map((edu: any, i: number) => (
            <div key={i} className="mb-1.5 last:mb-0">
              <p className="font-medium text-foreground text-xs">{edu.school}</p>
              <p className="text-muted-foreground text-[11px]">
                {edu.degree || edu.field || ""}
                {edu.degree && edu.field && " — "}
                {edu.field || ""}
              </p>
              {(edu.startDate || edu.endDate) && (
                <p className="text-[11px] text-muted-foreground">{edu.startDate || "?"} - {edu.endDate || "?"}</p>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Skills */}
      {cvData.skills && cvData.skills.length > 0 && (
        <div>
          <p className="font-semibold text-foreground mb-1">⚡ Kỹ năng</p>
          <div className="flex flex-wrap gap-1.5">
            {cvData.skills.map((skill: any, i: number) => (
              <span key={i} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                {skill.name || skill}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Languages */}
      {cvData.languages && cvData.languages.length > 0 && (
        <div>
          <p className="font-semibold text-foreground mb-1">🌐 Ngôn ngữ</p>
          <div className="flex flex-wrap gap-1.5">
            {cvData.languages.map((lang: string, i: number) => (
              <span key={i} className="px-2 py-0.5 rounded-full bg-primary/5 text-muted-foreground text-[11px]">
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Hobbies */}
      {cvData.hobbies && cvData.hobbies.length > 0 && (
        <div>
          <p className="font-semibold text-foreground mb-1">❤️ Sở thích</p>
          <p className="text-muted-foreground text-xs">{cvData.hobbies.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

const CONFIRM_KEYWORDS = [
  "ok", "đồng ý", "được", "áp dụng", "yes", "ừ", "tốt", "được rồi",
  "oke", "oki", "okay", "okie", "có", "apply", "chuẩn", "tuyệt vời",
  "đúng rồi", "ưng ý", "triển", "tiến hành"
];

const EDIT_KEYWORDS = [
  "sửa", "thay đổi", "cập nhật", "chỉnh", "thêm", "bớt", "xóa",
  "đổi", "điều chỉnh", "edit", "update", "change"
];

function isConfirmIntent(text: string): boolean {
  const lower = text.toLowerCase().trim();
  // If very short, check for exact match
  if (lower.length <= 5) {
    return CONFIRM_KEYWORDS.some(kw => lower === kw || lower.startsWith(kw));
  }
  // Check if message contains edit keywords first
  const hasEditIntent = EDIT_KEYWORDS.some(kw => lower.includes(kw));
  if (hasEditIntent) return false;
  // For longer messages, only confirm if it's clearly affirmative
  return CONFIRM_KEYWORDS.some(kw => {
    if (kw === "có") return lower.match(/^có\b/);
    if (kw === "được") return lower.match(/^(được rồi|được)\b/);
    if (kw === "ok" || kw === "oke" || kw === "oki") return lower.match(/^(ok|oke|oki|okay|okie)\b/);
    return lower.includes(kw);
  });
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "👋 Xin chào! Tôi là AI Trợ lý Tạo CV Tự Động của JobReady.\n\n🚀 **Cách dùng cực đơn giản:**\nChỉ cần kể về bản thân bạn (tên, công việc, kinh nghiệm, kỹ năng...), tôi sẽ TỰ ĐỘNG tạo CV hoàn chỉnh cho bạn!\n\n✨ **Ví dụ:**\n• \"Tôi là Backend Developer\"\n• \"Tôi làm việc tại FPT từ 2020-2023\"\n• \"Tôi biết Node.js, React và MongoDB\"\n\n💾 **Lưu trữ hội thoại:**\n• Ấn **\"Lưu nháp\"**: Giữ lại lịch sử chat (kể cả khi đăng xuất).\n• Ấn **\"Lưu CV\"**: Xóa sạch lịch sử chat để bắt đầu CV mới.\n\n💬 Hãy bắt đầu kể về bản thân nhé!"
  }
];

interface AIChatBubbleProps {
  onApplyCVData?: (cvData: any) => void;
  draftId?: string | null;
  savedCvId?: string | null;
  isSaved?: boolean;
}

export function AIChatBubble({ onApplyCVData, draftId = null, savedCvId = null, isSaved = false }: AIChatBubbleProps) {
  const { user } = useAuth();
  const [showChat, setShowChat] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const userId = user?.id || "guest";
  const storageKey = draftId
    ? `jobready_cv_advisor_session_draft_${userId}_${draftId}`
    : savedCvId
      ? `jobready_cv_advisor_session_cv_${userId}_${savedCvId}`
      : `jobready_cv_advisor_session_new_${userId}`;

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("Đang phân tích dữ liệu...");
  const [pendingCVData, setPendingCVData] = useState<any>(null);
  const [awaitingConfirm, setAwaitingConfirm] = useState<boolean>(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(true);

  useEffect(() => {
    if (showChat && !isMinimized) {
      const timer = setTimeout(() => {
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [messages, showChat, isMinimized]);

  // Load session state from localStorage when key changes
  useEffect(() => {
    isLoadingRef.current = true;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setMessages(parsed.messages || INITIAL_MESSAGES);
        setPendingCVData(parsed.pendingCVData || null);
        setAwaitingConfirm(parsed.awaitingConfirm || false);
      } else {
        setMessages(INITIAL_MESSAGES);
        setPendingCVData(null);
        setAwaitingConfirm(false);
      }
    } catch {
      setMessages(INITIAL_MESSAGES);
      setPendingCVData(null);
      setAwaitingConfirm(false);
    }
  }, [storageKey]);

  // Save session state to localStorage
  // Skip save during key transitions to prevent deleting data before it's loaded
  useEffect(() => {
    if (isLoadingRef.current) {
      isLoadingRef.current = false;
      return;
    }
    try {
      if (messages.length > 1) {
        const dataToSave = {
          messages,
          pendingCVData,
          awaitingConfirm
        };
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch { /* ignore */ }
  }, [messages, pendingCVData, awaitingConfirm, storageKey]);

  // When transition to draft, copy the temp session to draft session
  useEffect(() => {
    if (draftId) {
      const newKey = `jobready_cv_advisor_session_draft_${userId}_${draftId}`;
      const oldRaw = localStorage.getItem(`jobready_cv_advisor_session_new_${userId}`);
      if (oldRaw && !localStorage.getItem(newKey)) {
        localStorage.setItem(newKey, oldRaw);
        localStorage.removeItem(`jobready_cv_advisor_session_new_${userId}`);
      }
    }
  }, [draftId, userId]);

  // When CV is saved, clear the chat advisor session and reset
  useEffect(() => {
    if (isSaved) {
      localStorage.removeItem(`jobready_cv_advisor_session_new_${userId}`);
      if (draftId) {
        localStorage.removeItem(`jobready_cv_advisor_session_draft_${userId}_${draftId}`);
      }
      if (savedCvId) {
        localStorage.removeItem(`jobready_cv_advisor_session_cv_${userId}_${savedCvId}`);
      }
      localStorage.removeItem(storageKey);
      setMessages(INITIAL_MESSAGES);
      setPendingCVData(null);
      setAwaitingConfirm(false);
    }
  }, [isSaved, storageKey, draftId, savedCvId, userId]);

  const prevUserIdRef = useRef<string | undefined>(undefined);

  // Clear React local state when active user ID changes (login/logout)
  // (We do NOT delete history from localStorage, allowing draft chat history to persist permanently across sessions)
  useEffect(() => {
    const currentId = user?.id;
    if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== currentId) {
      isLoadingRef.current = true; // Lock save effect during logout/login transitions
      setMessages(INITIAL_MESSAGES);
      setPendingCVData(null);
      setAwaitingConfirm(false);
    }
    prevUserIdRef.current = currentId;
  }, [user?.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userText
    };

    // If awaiting confirmation, check intent
    if (awaitingConfirm && pendingCVData) {
      if (isConfirmIntent(userText)) {
        // User confirmed - show apply button, DON'T call API
        setMessages(prev => [...prev, userMessage]);
        setInput("");

        const confirmResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "✅ Tuyệt vời! Nhấn nút **Áp dụng vào CV** bên dưới để điền toàn bộ thông tin vào CV của bạn nhé!",
          cvData: pendingCVData,
          showApplyButton: true
        };
        setMessages(prev => [...prev, confirmResponse]);
        setAwaitingConfirm(false);
        return;
      }

      // User wants edits - reset confirm state and proceed with API call
      setAwaitingConfirm(false);
      setPendingCVData(null);
    }

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setLoadingStatus("Đang phân tích dữ liệu...");

    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 90000); // 90 seconds timeout

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= 60000) {
        setLoadingStatus("⏳ Hệ thống đang bận, đang thử lại lần 3/3...");
      } else if (elapsed >= 30000) {
        setLoadingStatus("⏳ Hệ thống đang bận, đang thử lại lần 2/3...");
      } else if (elapsed >= 10000) {
        setLoadingStatus("⏳ Hệ thống đang bận, đang thử lại lần 1/3...");
      } else {
        setLoadingStatus("Đang phân tích dữ liệu...");
      }
    }, 1000);

    try {
      // Prepare conversation history (exclude welcome and non-text messages)
      const history = messages
        .filter(msg => msg.id !== "welcome" && !msg.isPreview)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const response = await fetch("/api/ai/cv-advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userText,
          history: history
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const httpError = new Error(errorData.error || "Không thể kết nối với AI");
        (httpError as any).status = response.status;
        throw httpError;
      }

      const data = await response.json();
      const reply = data.reply || "Xin lỗi, tôi không thể trả lời lúc này.";

      // Ensure minimum display time of 10s
      const elapsed = Date.now() - startTime;
      if (elapsed < 10000) {
        await new Promise(resolve => setTimeout(resolve, 10000 - elapsed));
      }

      if (data.readyForPreview && data.cvData) {
        // Step 2: Show preview card and ask for confirmation
        const confirmPrompt = reply
          .replace(/Nhấn ['“]?Áp dụng vào CV['“]?[^\n]*/gi, "")
          .trim()
          || "📋 **Thông tin trên đã đúng chưa?** Nếu đúng thì nhắn ok hoặc xác nhận, tôi sẽ hiển thị nút áp dụng ngay! Nếu cần sửa gì cứ nói nhé.";

        const previewMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: confirmPrompt,
          cvData: data.cvData,
          isPreview: true,
          showApplyButton: false
        };
        setMessages(prev => [...prev, previewMessage]);
        setPendingCVData(data.cvData);
        setAwaitingConfirm(true);
      } else {
        // Step 1: Normal conversation (no preview, no apply button)
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: reply,
          cvData: data.cvData || null
        };
        setMessages(prev => [...prev, aiResponse]);
      }

    } catch (error: any) {
      console.error("AI Error:", error);
      
      const elapsed = Date.now() - startTime;
      if (elapsed < 10000) {
        await new Promise(resolve => setTimeout(resolve, 10000 - elapsed));
      }

      const isAborted = error.name === "AbortError";
      const errorMessageContent = isAborted
        ? "❌ Xin lỗi, hệ thống AI mất quá nhiều thời gian phản hồi (vượt quá 90 giây). Vui lòng thử lại."
        : `❌ Xin lỗi, hệ thống AI tạm thời gặp sự cố. Vui lòng thử lại sau.\n\nChi tiết: ${error instanceof Error ? error.message : "Không thể kết nối"}`;

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorMessageContent
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3">
      {/* Chat panel */}
      {showChat && (
        <div
          className={`w-[380px] rounded-3xl border-2 border-primary/20 bg-card dark:bg-[#1a1a2e] dark:border-[#6366f1]/40 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${isMinimized ? "h-[80px]" : "h-[650px]"
            } animate-in fade-in slide-in-from-bottom-4`}
        >
          {/* Header */}
          <div className="bg-primary p-5 text-primary-foreground dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#8b5cf6] dark:text-white flex items-center justify-between shrink-0 cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-primary-foreground/30 dark:bg-white/20 dark:ring-white/30">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base font-bold flex items-center gap-2">
                  <span className="whitespace-nowrap">CHAT VỚI AI TỐI ƯU CV</span>
                  <Sparkles className="h-4 w-4 animate-pulse shrink-0" />
                </p>
                <p className="text-xs opacity-90 font-medium">Trợ lý AI chuyên nghiệp</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(!isMinimized);
                }}
                className="h-9 w-9 rounded-full bg-primary-foreground/15 hover:bg-primary-foreground/30 dark:bg-white/15 dark:hover:bg-white/30 dark:text-white flex items-center justify-center transition"
              >
                {isMinimized ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowChat(false);
                }}
                className="h-9 w-9 rounded-full bg-primary-foreground/15 hover:bg-primary-foreground/30 dark:bg-white/15 dark:hover:bg-white/30 dark:text-white flex items-center justify-center transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div
                ref={chatScrollRef}
                className="flex-1 overflow-y-auto p-5 space-y-4 bg-background dark:bg-[#12121f]"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center shadow-md ${msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary text-primary-foreground"
                      }`}>
                      {msg.role === "user" ? (
                        <span className="text-sm font-bold">U</span>
                      ) : (
                        <Bot className="h-5 w-5" />
                      )}
                    </div>
                    <div className={`max-w-[85%] flex flex-col gap-2 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                      {msg.isPreview ? (
                        <>
                          {msg.content && (
                            <div className="px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap break-words shadow-md bg-card text-card-foreground rounded-tl-none border border-border dark:bg-[#252540] dark:text-white dark:border-white/10 dark:shadow-[0_2px_8px_rgba(99,102,241,0.15)]">
                              {renderMessage(msg.content)}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap break-words shadow-md ${msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-card text-card-foreground rounded-tl-none border border-border dark:bg-[#252540] dark:text-white dark:border-white/10 dark:shadow-[0_2px_8px_rgba(99,102,241,0.15)]"
                          }`}>
                          {renderMessage(msg.content)}
                        </div>
                      )}
                      {/* Apply button (only for showApplyButton messages) */}
                      {msg.showApplyButton && msg.cvData && onApplyCVData && (
                        <button
                          onClick={() => {
                            onApplyCVData(msg.cvData);
                            setPendingCVData(null);
                            setAwaitingConfirm(false);
                          }}
                          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all animate-in fade-in"
                        >
                          <Check className="h-4 w-4" />
                          Áp dụng vào CV ngay
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-start gap-3 animate-in fade-in-50 duration-300">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div className="bg-card border border-border dark:bg-[#252540] dark:border-white/10 px-4 py-3 rounded-2xl rounded-tl-none shadow-md flex flex-col gap-2 min-w-[120px]">
                      <span className="text-[11px] text-muted-foreground font-medium whitespace-pre-wrap">{loadingStatus}</span>
                      <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-border p-4 bg-card dark:bg-[#1a1a2e] dark:border-white/10 shrink-0">
                <form onSubmit={handleSend} className="flex items-end gap-3">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e);
                      }
                    }}
                    placeholder="Nhắn vào AI tối ưu CV..."
                    disabled={loading}
                    rows={1}
                    className="flex-1 min-h-[44px] max-h-[120px] px-4 py-3 rounded-2xl border-2 border-input bg-background text-sm outline-none focus:border-primary focus:bg-card transition disabled:opacity-50 resize-none overflow-y-auto dark:bg-[#12121f] dark:text-white dark:placeholder:text-white/40 dark:border-white/20 dark:focus:border-primary"
                    style={{
                      fieldSizing: 'content'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="h-11 w-11 rounded-full shrink-0 bg-primary text-primary-foreground dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#8b5cf6] dark:border-0 flex items-center justify-center shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
                <p className="text-[10px] text-muted-foreground dark:text-white/40 text-center mt-2">
                  AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Inject custom animations */}
      <style>{bubbleAnimationStyles}</style>

      {/* Bubble trigger button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className={`group h-16 w-16 rounded-full flex items-center justify-center shadow-2xl dark:shadow-[0_4px_20px_rgba(99,102,241,0.5)] transition-all hover:scale-110 active:scale-95 cursor-pointer relative overflow-hidden bubble-hover-glow ${!showChat ? 'bubble-breathe' : ''}`}
        title="Chat với AI tối ưu CV"
      >
        {showChat ? (
          <div className="absolute inset-0 bg-primary dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#8b5cf6] flex items-center justify-center logo-rotate-out">
            <X className="h-7 w-7 text-white" />
          </div>
        ) : (
          <img
            src={logoJr}
            alt="JobReady AI"
            className="w-full h-full object-cover rounded-full logo-rotate-out"
          />
        )}
        {!showChat && (
          <span
            className="absolute inset-0 rounded-full border-2 border-primary dark:border-[#8b5cf6] animate-ping opacity-40"
            style={{ animationDuration: "2s" }}
          />
        )}
      </button>
    </div>
  );
}
