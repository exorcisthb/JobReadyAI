"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, Sparkles, Phone, Paperclip } from "lucide-react";
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
    filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.6));
  }
  
  .dark .bubble-hover-glow:hover {
    filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.6));
  }
`;

function renderTable(text: string) {
  const lines = text.split("\n");
  const tableLines = lines.filter(l => l.trim().startsWith("|"));
  if (tableLines.length < 2) return null;

  const rows = tableLines.map(l =>
    l.trim().replace(/^\||\|$/g, "").split("|").map(cell => cell.trim())
  ).filter(r => !r.every(c => /^[-:]+$/.test(c)));

  const [header, ...body] = rows;
  return (
    <div className="my-2 rounded-xl border border-border dark:border-white/10 overflow-hidden w-full">
      <table className="w-full text-[11px] border-collapse table-fixed">
        <thead>
          <tr className="bg-primary/10 dark:bg-[#6366f1]/20">
            {header.map((h, i) => (
              <th
                key={i}
                className={`px-2 py-2 text-left font-bold bg-gradient-to-r from-cyan-600 to-emerald-500 bg-clip-text text-transparent dark:text-[#a78bfa] border-b border-border dark:border-white/10 break-words ${
                  i === 0 ? "w-[28%]" : i === header.length - 1 ? "w-[30%]" : "w-[14%]"
                }`}
              >
                {h.replace(/\*\*/g, "")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} className={ri % 2 === 0 ? "bg-background dark:bg-[#12121f]" : "bg-muted/30 dark:bg-white/5"}>
              {row.map((cell, ci) => {
                const isTotal = row[0]?.replace(/\*\*/g, "") === "Tổng";
                const cleaned = cell.replace(/\*\*/g, "");
                const parts = cleaned.split(/(\d+\/100|\d+đ|🏆[^|]*)/g);
                return (
                  <td
                    key={ci}
                    className={`px-2 py-2 border-b border-border dark:border-white/10 break-words align-top leading-relaxed ${
                      isTotal ? "font-bold text-foreground dark:text-white" : "text-foreground dark:text-white/80"
                    } ${ci === 0 ? "font-medium" : ""}`}
                  >
                    {parts.map((part, pi) =>
                      /\d+\/100|\d+đ/.test(part)
                        ? <span key={pi} className="font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent dark:text-[#a78bfa]">{part}</span>
                        : part.startsWith("🏆")
                        ? <span key={pi} className="font-bold text-emerald-500 dark:text-emerald-400">{part}</span>
                        : part
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderMessage(text: string, isUser = false) {
  // Tách block bảng ra render riêng
  const blocks = text.split(/(\n?\|.+\|(?:\n\|.+\|)*)/g);
  if (blocks.length > 1) {
    return blocks.map((block, bi) => {
      if (block.trim().startsWith("|")) {
        return <div key={bi}>{renderTable(block)}</div>;
      }
      return <div key={bi}>{block.split("\n").map((line, lineIdx) => renderLine(line, lineIdx, isUser))}</div>;
    });
  }
  return text.split("\n").map((line, lineIdx) => renderLine(line, lineIdx, isUser));
}

function renderLine(line: string, lineIdx: number, isUser = false) {
  const trimmed = line.trim();

  // Dòng trống
  if (trimmed === "") return <div key={lineIdx} className="h-1.5" />;

  // Dòng separator ---
  if (trimmed === "---") return <hr key={lineIdx} className={isUser ? "border-white/20 my-2" : "border-border dark:border-white/10 my-2"} />;

  // Tiêu đề nhóm: **Tên (tối đa Xđ):** hoặc **Tên:**
  if (/^\*\*[^*]+\*\*:?$/.test(trimmed)) {
    return (
      <p key={lineIdx} className={isUser ? "font-bold text-sm mt-3 mb-0.5 text-white" : "font-bold text-sm mt-3 mb-0.5 bg-gradient-to-r from-cyan-600 to-emerald-500 bg-clip-text text-transparent dark:from-[#a78bfa] dark:to-[#a78bfa]"}>
        {trimmed.replace(/\*\*/g, "")}
      </p>
    );
  }

  // Dòng CV1: Xđ | CV2: Yđ
  if (/^CV\d+:/.test(trimmed)) {
    const parts = trimmed.split("|").map(s => s.trim());
    return (
      <p key={lineIdx} className={isUser ? "text-sm flex flex-wrap gap-3 my-0.5 text-white" : "text-sm flex flex-wrap gap-3 my-0.5"}>
        {parts.map((part, i) => {
          const [label, score] = part.split(":").map(s => s.trim());
          return (
            <span key={i} className="flex items-center gap-1">
              <strong className={isUser ? "text-white" : "text-foreground dark:text-white"}>{label}:</strong>
              <span className={isUser ? "text-white font-semibold" : "text-primary dark:text-[#a78bfa] font-semibold"}>{score}</span>
            </span>
          );
        })}
      </p>
    );
  }

  // Dòng góp ý: → Góp ý CV...:
  if (/^→/.test(trimmed)) {
    const content = trimmed.replace(/^→\s*/, "");
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={lineIdx} className={isUser ? "text-sm text-white/90 pl-3 border-l-2 border-white my-1 italic" : "text-sm text-muted-foreground dark:text-white/60 pl-3 border-l-2 border-orange-400 dark:border-orange-500 my-1 italic"}>
        {parts.map((part, i) =>
          part.startsWith("**") && part.endsWith("**")
            ? <strong key={i} className={isUser ? "text-white font-bold" : "bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent dark:from-orange-400 dark:to-amber-400 not-italic"}>{part.slice(2, -2)}</strong>
            : part
        )}
      </p>
    );
  }

  // Dòng tổng: **Tổng: CV1 X/100 | CV2 Y/100**
  if (/^\*\*Tổng:/.test(trimmed)) {
    const content = trimmed.replace(/\*\*/g, "");
    return (
      <p key={lineIdx} className={isUser ? "text-sm font-bold mt-3 pt-2 border-t border-white/20 text-white" : "text-sm font-bold mt-3 pt-2 border-t border-border dark:border-white/10 text-foreground dark:text-white"}>
        {content}
      </p>
    );
  }

  // Dòng kết quả 🏆
  if (trimmed.startsWith("🏆")) {
    const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={lineIdx} className={isUser ? "text-sm font-bold mt-2 text-white" : "text-sm font-bold mt-2 text-emerald-600 dark:text-emerald-400"}>
        {parts.map((part, i) =>
          part.startsWith("**") && part.endsWith("**")
            ? <span key={i}>{part.slice(2, -2)}</span>
            : part
        )}
      </p>
    );
  }

  // Dòng bullet •
  if (/^[•\-\*]\s+/.test(trimmed)) {
    const content = trimmed.replace(/^[•\-\*]\s+/, "");
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={lineIdx} className="text-sm pl-3 py-0.5 flex gap-1.5">
        <span className={isUser ? "shrink-0 font-bold text-white" : "shrink-0 font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent"}>•</span>
        <span className={isUser ? "text-white" : ""}>
          {parts.map((part, i) =>
            part.startsWith("**") && part.endsWith("**")
              ? <strong key={i} className={isUser ? "font-semibold text-white" : "font-semibold bg-gradient-to-r from-cyan-600 to-emerald-500 bg-clip-text text-transparent dark:from-[#a78bfa] dark:to-[#a78bfa]"}>{part.slice(2, -2)}</strong>
              : part
          )}
        </span>
      </p>
    );
  }

  // Dòng thường có inline bold
  const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p key={lineIdx} className="text-sm py-0.5">
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**")
          ? <strong key={i} className={isUser ? "text-white font-bold" : "text-blue-600 dark:text-[#a78bfa] font-bold"}>{part.slice(2, -2)}</strong>
          : <span key={i} className={isUser ? "text-white" : "text-gray-900 dark:text-white"}>{part}</span>
      )}
    </p>
  );
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function CustomerSupportBubble() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const STORAGE_KEY = "jobready_support_session";

  const [pathname, setPathname] = useState(() => typeof window !== "undefined" ? window.location.pathname : "");
  const [showChat, setShowChat] = useState(false);
  const [cvPlan, setCvPlan] = useState<string>("free");

  useEffect(() => {
    const openSupportChat = () => setShowChat(true);
    window.addEventListener("jobready:open-support", openSupportChat);
    return () => window.removeEventListener("jobready:open-support", openSupportChat);
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    fetch("/api/subscription/me", {
      headers: { "x-user-id": user.id, "x-user-role": user.role || "user" },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.planCv) setCvPlan(data.planCv); })
      .catch(() => {});
  }, [user?.id, user?.role]);

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Message[];
          if (parsed.length > 0 && parsed[0].id === "welcome") {
            parsed[0].content = t("customerSupport.welcome");
          }
          return parsed;
        }
      }
    } catch { /* ignore */ }
    return [{ id: "welcome", role: "assistant", content: t("customerSupport.welcome") }];
  });

  useEffect(() => {
    setMessages(prev => {
      if (prev.length > 0 && prev[0].id === "welcome") {
        const updated = [...prev];
        updated[0] = { ...updated[0], content: t("customerSupport.welcome") };
        return updated;
      }
      return prev;
    });
  }, [i18n.language, t]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(() => t("customerSupport.analyzing"));
  const chatScrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    if (!showChat) return;
    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }, 50);
  }, [showChat]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<Array<{name: string; mimeType: string; data: string; preview?: string}>>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    try {
      if (messages.length > 1) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch { /* ignore */ }
  }, [messages]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleLocationChange = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", handleLocationChange);
    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;
    window.history.pushState = function (...args) {
      originalPush.apply(this, args);
      handleLocationChange();
    };
    window.history.replaceState = function (...args) {
      originalReplace.apply(this, args);
      handleLocationChange();
    };
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
    };
  }, []);

  const prevUserIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const currentId = user?.id;
    if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== currentId) {
      // Chỉ reset khi user thực sự thay đổi (login/logout), không reset khi reload
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch { /* ignore */ }
      setMessages([{ id: "welcome", role: "assistant", content: t("customerSupport.welcome") }]);
      setAttachments([]);
    }
    prevUserIdRef.current = currentId;
  }, [user?.id]);

  // Keep all hooks above this route-based render branch. The bubble stays mounted
  // during SPA navigation, so returning early before hooks would change hook order.
  if (
    pathname.startsWith("/cv/create") ||
    pathname.startsWith("/cv/preview") ||
    pathname.startsWith("/user/cv-builder") ||
    pathname.startsWith("/interview/persona") ||
    pathname.startsWith("/interview/session")
  ) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 3 - attachments.length;
    if (remaining <= 0) {
      alert(t("customerSupport.maxFilesAlert"));
      e.target.value = "";
      return;
    }
    const limitedFiles = files.slice(0, remaining);
    const results: Array<{name: string; mimeType: string; data: string; preview?: string}> = [];
    for (const file of files) {
      const base64 = await new Promise<string>((res) => {
        const reader = new FileReader();
        reader.onload = () => res((reader.result as string).split(",")[1]);
        reader.readAsDataURL(file);
      });
      const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
      results.push({ name: file.name, mimeType: file.type, data: base64, preview });
    }
    setAttachments(prev => [...prev, ...results]);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(
      f => f.type.startsWith("image/") || f.type === "application/pdf"
    );
    if (!files.length) return;
    const remaining = 3 - attachments.length;
    if (remaining <= 0) {
      alert(t("customerSupport.maxFilesAlert"));
      return;
    }
    const limitedFiles = files.slice(0, remaining);
    const results: Array<{name: string; mimeType: string; data: string; preview?: string}> = [];
    for (const file of limitedFiles) {
      const base64 = await new Promise<string>((res) => {
        const reader = new FileReader();
        reader.onload = () => res((reader.result as string).split(",")[1]);
        reader.readAsDataURL(file);
      });
      const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
      results.push({ name: file.name, mimeType: file.type, data: base64, preview });
    }
    setAttachments(prev => [...prev, ...results]);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const attachmentNote = attachments.length > 0
      ? `\n📎 File: ${attachments.map(a => a.name).join(", ")}`
      : "";
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim() + attachmentNote
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setLoadingStatus(t("customerSupport.analyzing"));

    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 90000); // 90 seconds timeout

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= 60000) {
        setLoadingStatus(t("customerSupport.busyRetry3"));
      } else if (elapsed >= 30000) {
        setLoadingStatus(t("customerSupport.busyRetry2"));
      } else if (elapsed >= 10000) {
        setLoadingStatus(t("customerSupport.busyRetry1"));
      } else {
        setLoadingStatus(t("customerSupport.analyzing"));
      }
    }, 1000);

    const history = messages
      .filter(msg => msg.id !== "welcome")
      .map(msg => ({ role: msg.role, content: msg.content }));

    try {
      const response = await fetch("/api/ai/customer-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history,
          isGuest: !user,
          attachments,
          cvPlan: cvPlan,
          language: i18n.language || "vi",
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Không thể kết nối với AI");
      }

      const data = await response.json();

      setAttachments([]);

      // Ensure minimum display time of 10s
      const elapsed = Date.now() - startTime;
      if (elapsed < 10000) {
        await new Promise(resolve => setTimeout(resolve, 10000 - elapsed));
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || t("customerSupport.defaultNoReply")
      }]);

    } catch (error: any) {
      console.error("AI Error:", error);

      const elapsed = Date.now() - startTime;
      if (elapsed < 10000) {
        await new Promise(resolve => setTimeout(resolve, 10000 - elapsed));
      }

      const isAborted = error.name === "AbortError";
      const errorMessageContent = isAborted
        ? t("customerSupport.timeoutError")
        : t("customerSupport.serverError", { reason: error instanceof Error ? error.message : "" });

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorMessageContent
      }]);
    } finally {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-3 right-3 z-[90] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {showChat && (
          <div className="h-[min(600px,calc(100dvh-5rem))] w-[calc(100vw-1.5rem)] max-w-[380px] rounded-3xl border-2 border-blue-200/50 bg-white dark:bg-[#1a1a2e] dark:border-[#6366f1]/40 shadow-2xl overflow-hidden flex flex-col sm:w-[380px] animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 p-5 text-white dark:bg-gradient-to-r dark:from-[#6366f1] dark:via-[#7c3aed] dark:to-[#8b5cf6] dark:text-white flex items-center justify-between shrink-0 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 rounded-full flex items-center justify-center">
                <img src={logoJr} alt="JobReady AI" className="h-12 w-12 rounded-full object-contain" />
              </div>
              <div>
                <p className="text-sm font-bold flex items-center gap-2 whitespace-nowrap tracking-wide">
                  {t("customerSupport.title")}
                  <Sparkles className="h-4 w-4 animate-pulse text-yellow-300" />
                </p>
                <p className="text-xs opacity-90 font-medium">{t("customerSupport.subtitle")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => e.stopPropagation()}
                className="h-9 w-9 rounded-full bg-white/20 hover:bg-white/35 dark:bg-white/15 dark:hover:bg-white/30 dark:text-white flex items-center justify-center transition backdrop-blur-sm"
              >
                <Phone className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowChat(false)}
                className="h-9 w-9 rounded-full bg-white/20 hover:bg-white/35 dark:bg-white/15 dark:hover:bg-white/30 dark:text-white flex items-center justify-center transition backdrop-blur-sm"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <>
            <div
              ref={chatScrollRef}
              className={`flex-1 overflow-y-auto p-5 bg-gray-50 dark:bg-[#12121f] select-text relative transition-all ${isDragging ? "ring-2 ring-inset ring-blue-400 dark:ring-[#6366f1]" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isDragging && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-primary/10 dark:bg-[#6366f1]/20 backdrop-blur-sm pointer-events-none rounded-sm">
                  <Paperclip className="h-10 w-10 text-primary dark:text-[#a78bfa] mb-3 animate-bounce" />
                  <p className="text-sm font-semibold text-primary dark:text-[#a78bfa]">{t("customerSupport.dropTitle")}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t("customerSupport.dropSub")}</p>
                </div>
              )}
              <div className="flex flex-col gap-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
                        : ""
                    }`}>
                      {msg.role === "user" ? (
                        <span className="text-sm font-bold">U</span>
                      ) : (
                        <img src={logoJr} alt="JobReady AI" className="h-9 w-9 rounded-full object-contain" />
                      )}
                    </div>
                    <div className={`max-w-[85%] flex flex-col gap-2 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                      <div className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap break-words ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-none shadow-md"
                          : "bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-md dark:bg-[#252540] dark:text-white dark:border-white/10 dark:shadow-[0_2px_12px_rgba(99,102,241,0.2)]"
                      }`}>
                        {renderMessage(msg.id === "welcome" ? t("customerSupport.welcome") : msg.content, msg.role === "user")}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-start gap-3 animate-in fade-in-50 duration-300">
                    <div className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center">
                      <img src={logoJr} alt="JobReady AI" className="h-9 w-9 rounded-full object-contain" />
                    </div>
                    <div className="bg-white border border-gray-100 dark:bg-[#252540] dark:border-white/10 px-4 py-3 rounded-2xl rounded-tl-none shadow-md flex flex-col gap-2 min-w-[120px]">
                      <span className="text-[11px] text-gray-500 dark:text-muted-foreground font-medium whitespace-pre-wrap">{loadingStatus}</span>
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 bg-white dark:bg-[#1a1a2e] dark:border-white/10 shrink-0">
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 px-4 pt-3">
                  {attachments.map((att, i) => (
                    <div key={i} className="relative flex items-center gap-1.5 bg-muted dark:bg-white/10 rounded-xl px-3 py-1.5 text-xs max-w-[160px]">
                      {att.preview
                        ? <img src={att.preview} className="h-6 w-6 rounded object-cover shrink-0" />
                        : <span className="text-lg shrink-0">📄</span>
                      }
                      <span className="truncate text-foreground dark:text-white/80">{att.name}</span>
                      <button
                        type="button"
                        onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                        className="ml-1 shrink-0 text-muted-foreground hover:text-destructive dark:text-white/40 dark:hover:text-red-400"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="p-4">
                <form onSubmit={handleSend} className="flex items-end gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="h-11 w-11 rounded-full shrink-0 bg-muted dark:bg-white/10 text-muted-foreground dark:text-white/60 flex items-center justify-center hover:bg-muted/80 transition disabled:opacity-50"
                    title={t("customerSupport.attachTitle")}
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e);
                      }
                    }}
                    placeholder={t("customerSupport.inputPlaceholder")}
                    disabled={loading}
                    rows={1}
                    className="flex-1 min-h-[44px] max-h-[120px] px-4 py-3 rounded-2xl border-2 border-input bg-background text-sm outline-none focus:border-primary focus:bg-card transition disabled:opacity-50 resize-none overflow-y-auto dark:bg-[#12121f] dark:text-white dark:placeholder:text-white/40 dark:border-white/20 dark:focus:border-primary"
                    style={{ fieldSizing: 'content' }}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="h-11 w-11 rounded-full shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#8b5cf6] dark:border-0 flex items-center justify-center shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
                <p className="text-[10px] text-muted-foreground dark:text-white/40 text-center mt-2">
                  {t("customerSupport.disclaimer")}
                </p>
              </div>
            </div>
            </>
          </div>
      )}

      {/* Inject custom animations */}
      <style>{bubbleAnimationStyles}</style>

      <button
        onClick={() => setShowChat(!showChat)}
        className={`group h-16 w-16 rounded-full flex items-center justify-center shadow-2xl dark:shadow-[0_4px_20px_rgba(99,102,241,0.5)] transition-all hover:scale-110 active:scale-95 cursor-pointer relative overflow-hidden bubble-hover-glow ${!showChat ? 'bubble-breathe' : ''}`}
        title={t("customerSupport.bubbleTitle")}
      >
        {showChat ? (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#8b5cf6] flex items-center justify-center logo-rotate-out">
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
            className="absolute inset-0 rounded-full border-2 border-blue-400 dark:border-[#8b5cf6] animate-ping opacity-40"
            style={{ animationDuration: "2s" }}
          />
        )}
      </button>
    </div>
  );
}
