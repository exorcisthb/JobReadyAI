"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

function renderMessage(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-primary dark:text-[#a78bfa]">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function CustomerSupportBubble() {
  const [pathname, setPathname] = useState(() => typeof window !== "undefined" ? window.location.pathname : "");
  const [showChat, setShowChat] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Chào bạn! Tôi là trợ lý hỗ trợ khách hàng của **JobReady**.\n\nTôi có thể giúp bạn về:\n• 📝 Tạo CV, chỉnh sửa CV\n• 🎙️ Phỏng vấn AI\n• 👥 Nhóm & Cộng đồng\n• 💳 Gói dịch vụ & Thanh toán\n• 🔧 Kỹ thuật & Tài khoản\n\nBạn cần hỗ trợ gì hôm nay?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("Đang phân tích dữ liệu...");
  const chatScrollRef = useRef<HTMLDivElement>(null);

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

  if (
    pathname.startsWith("/cv/create") ||
    pathname.startsWith("/cv/preview") ||
    pathname.startsWith("/user/cv-builder")
  ) return null;

  useEffect(() => {
    if (chatScrollRef.current && !isMinimized) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim()
    };

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

    const history = messages
      .filter(msg => msg.id !== "welcome")
      .map(msg => ({ role: msg.role, content: msg.content }));

    try {
      const response = await fetch("/api/ai/customer-support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content, history }),
        signal: controller.signal
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Không thể kết nối với AI");
      }

      const data = await response.json();

      // Ensure minimum display time of 10s
      const elapsed = Date.now() - startTime;
      if (elapsed < 10000) {
        await new Promise(resolve => setTimeout(resolve, 10000 - elapsed));
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "Xin lỗi, tôi không thể trả lời lúc này."
      }]);

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
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3">
      {showChat && (
        <div className={`w-[380px] rounded-3xl border-2 border-primary/20 bg-card dark:bg-[#1a1a2e] dark:border-[#6366f1]/40 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isMinimized ? "h-[80px]" : "h-[600px]"
        } animate-in fade-in slide-in-from-bottom-4`}>
          <div className="bg-primary p-5 text-primary-foreground dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#8b5cf6] dark:text-white flex items-center justify-between shrink-0 cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-primary-foreground/30 dark:bg-white/20 dark:ring-white/30">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold flex items-center gap-2 whitespace-nowrap">
                  HỖ TRỢ KHÁCH HÀNG
                  <Sparkles className="h-4 w-4 animate-pulse" />
                </p>
                <p className="text-xs opacity-90 font-medium">Trợ lý AI JobReady</p>
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
                onClick={() => setShowChat(false)}
                className="h-9 w-9 rounded-full bg-primary-foreground/15 hover:bg-primary-foreground/30 dark:bg-white/15 dark:hover:bg-white/30 dark:text-white flex items-center justify-center transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-background dark:bg-[#12121f] select-text">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center shadow-md ${
                      msg.role === "user"
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
                      <div className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap break-words shadow-md ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-card text-card-foreground rounded-tl-none border border-border dark:bg-[#252540] dark:text-white dark:border-white/10 dark:shadow-[0_2px_8px_rgba(99,102,241,0.15)]"
                      }`}>
                        {renderMessage(msg.content)}
                      </div>
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
                    placeholder="Nhập câu hỏi của bạn..."
                    disabled={loading}
                    rows={1}
                    className="flex-1 min-h-[44px] max-h-[120px] px-4 py-3 rounded-2xl border-2 border-input bg-background text-sm outline-none focus:border-primary focus:bg-card transition disabled:opacity-50 resize-none overflow-y-auto dark:bg-[#12121f] dark:text-white dark:placeholder:text-white/40 dark:border-white/20 dark:focus:border-primary"
                    style={{ fieldSizing: 'content' }}
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
                  AI có thể mắc lỗi. Thông tin quan trọng vui lòng liên hệ admin.
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <button
        onClick={() => setShowChat(!showChat)}
        className="group h-16 w-16 rounded-full flex items-center justify-center text-white shadow-2xl dark:shadow-[0_4px_20px_rgba(99,102,241,0.5)] transition-all hover:scale-110 active:scale-95 cursor-pointer relative bg-primary dark:bg-gradient-to-r dark:from-[#6366f1] dark:to-[#8b5cf6]"
        title="Hỗ trợ khách hàng"
      >
        {showChat ? (
          <X className="h-7 w-7" />
        ) : (
          <>
            <Bot className="h-7 w-7" />
            <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-yellow-300 animate-pulse" />
          </>
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
