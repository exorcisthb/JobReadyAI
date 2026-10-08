"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, Sparkles, ChevronDown, ChevronUp, CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/components/auth-provider";
import logoJr from "@/assets/logo.png";

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
  const { t } = useTranslation();
  return (
    <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-[#1e1e3a] dark:to-[#1a1a2e] border border-blue-200 dark:border-[#6366f1]/30 rounded-xl p-4 space-y-3 text-sm shadow-sm">
      {/* Personal Info */}
      <div>
        <p className="font-bold text-base text-foreground">{cvData.fullName || t("cvAdvisor.noName")}</p>
        <p className="text-primary font-medium">{cvData.jobTitle || t("cvAdvisor.noTitle")}</p>
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
          <p className="font-semibold text-foreground mb-1">{t("cvAdvisor.cardObjective")}</p>
          <p className="text-muted-foreground leading-relaxed text-xs">{cvData.objective}</p>
        </div>
      )}
      {/* Experience */}
      {cvData.experience && cvData.experience.length > 0 && (
        <div>
          <p className="font-semibold text-foreground mb-1">{t("cvAdvisor.cardExperience")}</p>
          {cvData.experience.map((exp: any, i: number) => (
            <div key={i} className="mb-1.5 last:mb-0">
              <p className="font-medium text-foreground text-xs">
                {exp.position}{exp.company ? <span className="text-muted-foreground font-normal"> — {exp.company}</span> : ""}
              </p>
              {(exp.startDate || exp.endDate) && (
                <p className="text-[11px] text-muted-foreground">{exp.startDate || "?"} - {exp.endDate || t("cvAdvisor.present")}</p>
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
          <p className="font-semibold text-foreground mb-1">{t("cvAdvisor.cardEducation")}</p>
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
          <p className="font-semibold text-foreground mb-1">{t("cvAdvisor.cardSkills")}</p>
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
          <p className="font-semibold text-foreground mb-1">{t("cvAdvisor.cardLanguages")}</p>
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
          <p className="font-semibold text-foreground mb-1">{t("cvAdvisor.cardHobbies")}</p>
          <p className="text-muted-foreground text-xs">{cvData.hobbies.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

function isConfirmIntent(text: string): boolean {
  const normalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return false;

  // A correction request or an explicit refusal always takes precedence.
  if (/\b(khong|chua|don't|dont|do not|not)\b/.test(normalized)) return false;
  if (/\b(sua|thay doi|cap nhat|chinh|them|bot|xoa|dieu chinh|edit|update|change|modify)\b/.test(normalized)) return false;
  if (/\b(nhung|but|however|wait|khoan)\b/.test(normalized)) return false;

  const affirmativePatterns = [
    /^(ok|oke|oki|okay|okie)\b/,
    /^(yes|yep|yeah|sure|correct|looks good)\b/,
    /^(toi |minh |em )?(dong y|chap nhan|xac nhan|ung y)\b/,
    /^(dung)( r| roi)?( a| nhe)?$/,
    /^(chuan)( roi)?( a| nhe)?$/,
    /^(duoc)( roi| a| nhe)?$/,
    /^(ap dung|apply)\b/,
    /^(trien( di)?|tien hanh|chot)\b/,
    /^(u|uh|uhm|vang)( roi| a| nhe)?$/,
    /^da (dong y|xac nhan|chap nhan)\b/,
  ];

  return affirmativePatterns.some((pattern) => pattern.test(normalized));
}

interface AIChatBubbleProps {
  onApplyCVData?: (cvData: any) => void | Promise<void>;
  draftId?: string | null;
  savedCvId?: string | null;
  isSaved?: boolean;
}

function AIChatBubbleInner({ onApplyCVData, draftId = null, savedCvId = null, isSaved = false }: AIChatBubbleProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [showChat, setShowChat] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const userId = user?.id || "guest";

  const storageKey = draftId
    ? `jobready_cv_advisor_session_draft_${userId}_${draftId}`
    : savedCvId
      ? `jobready_cv_advisor_session_cv_${userId}_${savedCvId}`
      : `jobready_cv_advisor_session_new_${userId}`;

  const initialMessages: Message[] = [
    {
      id: "welcome",
      role: "assistant",
      content: t("cvAdvisor.welcome")
    }
  ];

  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    setMessages(prev => {
      if (prev.length > 0 && prev[0].id === "welcome") {
        const updated = [...prev];
        updated[0] = { ...updated[0], content: t("cvAdvisor.welcome") };
        return updated;
      }
      return prev;
    });
  }, [i18n.language, t]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(() => t("cvAdvisor.analyzing"));
  const [pendingCVData, setPendingCVData] = useState<any>(null);
  const [awaitingConfirm, setAwaitingConfirm] = useState<boolean>(false);
  const [applyStatus, setApplyStatus] = useState<"idle" | "applying" | "success" | "error">("idle");
  const [applyProgress, setApplyProgress] = useState(0);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(true);
  const applyStartedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (applyStatus !== "applying") return;

    const updateProgress = () => {
      const elapsed = Math.max(0, Date.now() - (applyStartedAtRef.current ?? Date.now()));
      let progress: number;
      if (elapsed < 1200) {
        progress = 1 + (elapsed / 1200) * 49;
      } else if (elapsed < 3600) {
        progress = 50 + ((elapsed - 1200) / 2400) * 40;
      } else {
        progress = 90 + (Math.min(elapsed - 3600, 1400) / 1400) * 9;
      }
      setApplyProgress(Math.min(99, Math.max(1, Math.floor(progress))));
    };

    const timer = window.setInterval(updateProgress, 40);
    return () => window.clearInterval(timer);
  }, [applyStatus]);

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

  useEffect(() => {
    isLoadingRef.current = true;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setMessages(parsed.messages || initialMessages);
        setPendingCVData(parsed.pendingCVData || null);
        setAwaitingConfirm(parsed.awaitingConfirm || false);
      } else {
        setMessages(initialMessages);
        setPendingCVData(null);
        setAwaitingConfirm(false);
      }
    } catch {
      setMessages(initialMessages);
      setPendingCVData(null);
      setAwaitingConfirm(false);
    }
  }, [storageKey]);

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
      setMessages(initialMessages);
      setPendingCVData(null);
      setAwaitingConfirm(false);
    }
  }, [isSaved, storageKey, draftId, savedCvId, userId]);

  const prevUserIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const currentId = user?.id;
    if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== currentId) {
      isLoadingRef.current = true;
      setMessages(initialMessages);
      setPendingCVData(null);
      setAwaitingConfirm(false);
    }
    prevUserIdRef.current = currentId;
  }, [user?.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || applyStatus === "applying") return;

    const userText = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userText
    };

    if (awaitingConfirm && pendingCVData) {
      if (isConfirmIntent(userText) && onApplyCVData) {
        setInput("");
        setMessages(prev => [...prev, userMessage]);
        setApplyProgress(1);
        const startedAt = Date.now();
        applyStartedAtRef.current = startedAt;
        setApplyStatus("applying");

        try {
          await onApplyCVData(pendingCVData);
          const remainingAnimation = Math.max(0, 5000 - (Date.now() - startedAt));
          if (remainingAnimation > 0) {
            await new Promise(resolve => window.setTimeout(resolve, remainingAnimation));
          }

          setApplyProgress(100);
          setApplyStatus("success");
          setPendingCVData(null);
          setAwaitingConfirm(false);
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: t("cvAdvisor.autoAppliedSuccess")
          }]);
          window.setTimeout(() => {
            setApplyStatus("idle");
            setApplyProgress(0);
            applyStartedAtRef.current = null;
          }, 1800);
        } catch (error) {
          console.error("Failed to apply AI CV data:", error);
          setApplyStatus("error");
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: t("cvAdvisor.applyFailedDescription")
          }]);
          window.setTimeout(() => {
            setApplyStatus("idle");
            setApplyProgress(0);
            applyStartedAtRef.current = null;
          }, 2600);
        }
        return;
      }

      setAwaitingConfirm(false);
      setPendingCVData(null);
    }

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setLoadingStatus(t("cvAdvisor.analyzing"));

    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 90000);

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= 60000) {
        setLoadingStatus(t("cvAdvisor.busyRetry3"));
      } else if (elapsed >= 30000) {
        setLoadingStatus(t("cvAdvisor.busyRetry2"));
      } else if (elapsed >= 10000) {
        setLoadingStatus(t("cvAdvisor.busyRetry1"));
      } else {
        setLoadingStatus(t("cvAdvisor.analyzing"));
      }
    }, 1000);

    try {
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
          history: history,
          language: i18n.language || "vi",
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
      const reply = data.reply || t("cvAdvisor.defaultNoReply");

      const elapsed = Date.now() - startTime;
      if (elapsed < 10000) {
        await new Promise(resolve => setTimeout(resolve, 10000 - elapsed));
      }

      if (data.readyForPreview && data.cvData) {
        const confirmPrompt = reply
          .replace(/Nhấn ['"]?Áp dụng vào CV['"]?[^\n]*/gi, "")
          .trim()
          || t("cvAdvisor.previewPrompt");

        const previewMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: confirmPrompt,
          cvData: data.cvData,
          isPreview: true
        };
        setMessages(prev => [...prev, previewMessage]);
        setPendingCVData(data.cvData);
        setAwaitingConfirm(true);
      } else {
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
        ? t("cvAdvisor.timeoutError")
        : t("cvAdvisor.serverError", { reason: error instanceof Error ? error.message : "" });

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
    <>
    {applyStatus !== "idle" && (
      <div
        className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-live="polite"
        aria-label={t(applyStatus === "applying" ? "cvAdvisor.applyProgressTitle" : applyStatus === "success" ? "cvAdvisor.applyCompleteTitle" : "cvAdvisor.applyFailedTitle")}
      >
        <div className="w-full max-w-sm rounded-3xl border border-border bg-card px-7 py-8 text-center shadow-2xl animate-in fade-in zoom-in-95">
          <div
            className="mx-auto mb-6 flex h-36 w-36 items-center justify-center rounded-full p-2 transition-[background] duration-100"
            style={{ background: `conic-gradient(${applyStatus === "error" ? "#ef4444" : "#10b981"} ${applyProgress * 3.6}deg, #e2e8f0 0deg)` }}
          >
            <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-card">
              {applyStatus === "success" && <CheckCircle2 className="mb-1 h-7 w-7 text-emerald-500" />}
              {applyStatus === "error" && <AlertCircle className="mb-1 h-7 w-7 text-destructive" />}
              <span className={`text-2xl font-bold tabular-nums ${applyStatus === "error" ? "text-destructive" : "text-foreground"}`}>
                {applyProgress}%
              </span>
            </div>
          </div>
          <h2 className="text-lg font-bold text-foreground">
            {t(applyStatus === "applying" ? "cvAdvisor.applyProgressTitle" : applyStatus === "success" ? "cvAdvisor.applyCompleteTitle" : "cvAdvisor.applyFailedTitle")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t(applyStatus === "applying" ? "cvAdvisor.applyProgressDescription" : applyStatus === "success" ? "cvAdvisor.applyCompleteDescription" : "cvAdvisor.applyFailedDescription")}
          </p>
        </div>
      </div>
    )}
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3">
      {showChat && (
        <div
          className={`w-[380px] rounded-3xl border-2 border-primary/20 bg-card dark:bg-[#1a1a2e] dark:border-[#6366f1]/40 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${isMinimized ? "h-[80px]" : "h-[650px]"
            } animate-in fade-in slide-in-from-bottom-4`}
        >
          <div className="bg-primary p-5 text-primary-foreground dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#8b5cf6] dark:text-white flex items-center justify-between shrink-0 cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 rounded-full flex items-center justify-center">
                <img src={logoJr} alt="JobReady AI" className="h-12 w-12 rounded-full object-contain" />
              </div>
              <div>
                <p className="text-base font-bold flex items-center gap-2">
                  <span className="whitespace-nowrap">{t("cvAdvisor.title")}</span>
                  <Sparkles className="h-4 w-4 animate-pulse shrink-0" />
                </p>
                <p className="text-xs opacity-90 font-medium">{t("cvAdvisor.subtitle")}</p>
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
              <div
                ref={chatScrollRef}
                className="flex-1 overflow-y-auto p-5 space-y-4 bg-background dark:bg-[#12121f]"
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center ${msg.role === "user"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : ""
                      }`}>
                      {msg.role === "user" ? (
                        <span className="text-sm font-bold" aria-label={user?.name || "Guest"}>
                          {Array.from(user?.name?.trim() || "Guest")[0]?.toLocaleUpperCase("vi-VN") || "G"}
                        </span>
                      ) : (
                        <img src={logoJr} alt="JobReady AI" className="h-9 w-9 rounded-full object-contain" />
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
                          {renderMessage(msg.id === "welcome" ? t("cvAdvisor.welcome") : msg.content)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-start gap-3 animate-in fade-in-50 duration-300">
                    <div className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center">
                      <img src={logoJr} alt="JobReady AI" className="h-9 w-9 rounded-full object-contain" />
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
                    placeholder={t("cvAdvisor.inputPlaceholder")}
                    disabled={loading || applyStatus === "applying"}
                    rows={1}
                    className="flex-1 min-h-[44px] max-h-[120px] px-4 py-3 rounded-2xl border-2 border-input bg-background text-sm outline-none focus:border-primary focus:bg-card transition disabled:opacity-50 resize-none overflow-y-auto dark:bg-[#12121f] dark:text-white dark:placeholder:text-white/40 dark:border-white/20 dark:focus:border-primary"
                    style={{
                      fieldSizing: 'content'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading || applyStatus === "applying"}
                    className="h-11 w-11 rounded-full shrink-0 bg-primary text-primary-foreground dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#8b5cf6] dark:border-0 flex items-center justify-center shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
                <p className="text-[10px] text-muted-foreground dark:text-white/40 text-center mt-2">
                  {t("cvAdvisor.disclaimer")}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <style>{bubbleAnimationStyles}</style>

      <button
        onClick={() => setShowChat(!showChat)}
        className={`group h-16 w-16 rounded-full flex items-center justify-center shadow-2xl dark:shadow-[0_4px_20px_rgba(99,102,241,0.5)] transition-all hover:scale-110 active:scale-95 cursor-pointer relative overflow-hidden bubble-hover-glow ${!showChat ? 'bubble-breathe' : ''}`}
        title={t("cvAdvisor.bubbleTitle")}
      >
        {showChat ? (
          <div className="absolute inset-0 bg-primary dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#8b5cf6] flex items-center justify-center logo-rotate-out">
            <X className="h-7 w-7 text-white" />
          </div>
        ) : (
          <img
            src={logoJr}
            alt="JobReady AI"
            className="w-full h-full object-contain rounded-full opacity-100"
          />
        )}
      </button>
    </div>
    </>
  );
}

// Outer wrapper - gates rendering by CV plan. All hooks here run unconditionally.
export function AIChatBubble({ onApplyCVData, draftId = null, savedCvId = null, isSaved = false }: AIChatBubbleProps) {
  const { user } = useAuth();
  const [cvPlan, setCvPlan] = useState<string>("free");
  const [loadingPlan, setLoadingPlan] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) {
      setCvPlan("free");
      setLoadingPlan(false);
      return;
    }

    const fetchPlan = async () => {
      try {
        const response = await fetch("/api/subscription/me", {
          headers: {
            "x-user-id": user.id || "",
            "x-user-role": user.role || "user",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCvPlan(data.planCv || "free");
        }
      } catch (err) {
        console.error("Error fetching CV plan:", err);
      } finally {
        setLoadingPlan(false);
      }
    };

    void fetchPlan();
  }, [user?.id, user?.role]);

  // Only show the AI bubble for Pro and Ultra CV plans
  if (loadingPlan || (cvPlan !== "pro_cv" && cvPlan !== "ultra_cv")) {
    return null;
  }

  return (
    <AIChatBubbleInner
      onApplyCVData={onApplyCVData}
      draftId={draftId}
      savedCvId={savedCvId}
      isSaved={isSaved}
    />
  );
}
