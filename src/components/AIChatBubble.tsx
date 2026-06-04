"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Sparkles, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  cvData?: any;  // Structured CV data from AI
}

interface AIChatBubbleProps {
  onApplyCVData?: (cvData: any) => void;  // Callback to apply CV data
}

export function AIChatBubble({ onApplyCVData }: AIChatBubbleProps) {
  const [showChat, setShowChat] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Xin chào! Tôi là AI Trợ lý Tạo CV Tự Động của JobReady.\n\n🚀 **Cách dùng cực đơn giản:**\nChỉ cần kể về bản thân bạn (tên, công việc, kinh nghiệm, kỹ năng...), tôi sẽ TỰ ĐỘNG tạo CV hoàn chỉnh cho bạn!\n\n✨ **Ví dụ:**\n• \"Tôi là Backend Developer\"\n• \"Tôi làm việc tại FPT từ 2020-2023\"\n• \"Tôi biết Node.js, React và MongoDB\"\n\nSau đó nhấn nút **'Áp dụng vào CV'** là xong! Bạn có thể chỉnh sửa bất kỳ thông tin nào sau đó.\n\n💬 Hãy bắt đầu bằng cách giới thiệu về bản thân nhé!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

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

    // Auto-retry logic
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        // Prepare conversation history
        const history = messages
          .filter(msg => msg.id !== "welcome")
          .map(msg => ({
            role: msg.role,
            content: msg.content
          }));

        // Call Gemini AI API
        const response = await fetch("/api/ai/cv-advisor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: userMessage.content,
            history: history
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          
          // If rate limit or server error, retry
          if (response.status === 429 || response.status >= 500) {
            retryCount++;
            if (retryCount < maxRetries) {
              // Show retry message
              const retryMsg: Message = {
                id: `retry-${Date.now()}`,
                role: "assistant",
                content: `⏳ Hệ thống đang bận, đang thử lại lần ${retryCount}/${maxRetries}...`
              };
              setMessages(prev => [...prev, retryMsg]);
              
              // Wait before retry (exponential backoff)
              await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
              
              // Remove retry message
              setMessages(prev => prev.filter(m => m.id !== retryMsg.id));
              continue;
            }
          }
          
          throw new Error(errorData.error || "Không thể kết nối với AI");
        }

        const data = await response.json();
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reply || "Xin lỗi, tôi không thể trả lời lúc này.",
          cvData: data.cvData || null
        };
        
        setMessages(prev => [...prev, aiResponse]);
        break; // Success, exit retry loop

      } catch (error) {
        retryCount++;
        console.error(`AI Error (attempt ${retryCount}/${maxRetries}):`, error);
        
        if (retryCount >= maxRetries) {
          // Max retries reached
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: `❌ Xin lỗi, hệ thống AI tạm thời quá tải. Vui lòng thử lại sau ít phút.\n\nLỗi: ${error instanceof Error ? error.message : "Không thể kết nối"}`
          };
          setMessages(prev => [...prev, errorMessage]);
          break;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3 select-none">
      {/* Chat panel */}
      {showChat && (
        <div 
          className={`w-[380px] rounded-3xl border-2 border-primary/20 bg-white shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
            isMinimized ? "h-[80px]" : "h-[650px]"
          } animate-in fade-in slide-in-from-bottom-4`}
        >
          {/* Header - Gradient với icon AI */}
          <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-400 p-5 text-white flex items-center justify-between shrink-0 cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-2 ring-white/30">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base font-bold flex items-center gap-2">
                  CHAT VỚI AI TỐI ƯU CV
                  <Sparkles className="h-4 w-4 animate-pulse" />
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
                className="h-9 w-9 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition"
              >
                {isMinimized ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowChat(false);
                }}
                className="h-9 w-9 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition"
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
                className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 via-white to-gray-50"
              >
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center shadow-md ${
                      msg.role === "user" 
                        ? "bg-gradient-to-br from-blue-500 to-cyan-400 text-white" 
                        : "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white"
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
                          ? "bg-gradient-to-br from-blue-500 to-cyan-400 text-white rounded-tr-none"
                          : "bg-white text-gray-800 rounded-tl-none border border-gray-200"
                      }`}>
                        {msg.content}
                      </div>
                      {/* Apply CV Data Button */}
                      {msg.role === "assistant" && msg.cvData && onApplyCVData && (
                        <button
                          onClick={() => onApplyCVData(msg.cvData)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                        >
                          <Sparkles className="h-4 w-4" />
                          Áp dụng vào CV
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white flex items-center justify-center shadow-md">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-md">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-4 bg-white shrink-0">
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
                    className="flex-1 min-h-[44px] max-h-[120px] px-4 py-3 rounded-2xl border-2 border-gray-200 bg-gray-50 text-sm outline-none focus:border-cyan-400 focus:bg-white transition disabled:opacity-50 resize-none overflow-y-auto"
                    style={{
                      fieldSizing: 'content'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="h-11 w-11 rounded-full shrink-0 bg-gradient-to-br from-cyan-400 to-blue-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
                <p className="text-[10px] text-gray-400 text-center mt-2">
                  AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Bubble trigger button - Màu đỏ với sparkles */}
      <button
        onClick={() => setShowChat(!showChat)}
        className={`group h-16 w-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer relative ${
          showChat
            ? "bg-gradient-to-br from-red-500 to-red-600"
            : "bg-gradient-to-br from-red-500 to-pink-500"
        }`}
        title="Chat với AI tối ưu CV"
      >
        {showChat ? (
          <X className="h-7 w-7" />
        ) : (
          <>
            <MessageCircle className="h-7 w-7" />
            <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-yellow-300 animate-pulse" />
          </>
        )}
        {!showChat && (
          <span 
            className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-40" 
            style={{ animationDuration: "2s" }}
          />
        )}
      </button>
    </div>
  );
}
