"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function AIChatBubble() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Xin chào! Tôi là AI trợ lý CV của JobReady. Tôi có thể giúp bạn:\n• Tối ưu nội dung CV\n• Gợi ý cách viết mô tả công việc\n• Đánh giá và cải thiện CV\n• Tư vấn về cấu trúc CV\n\nBạn cần tôi hỗ trợ gì?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

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

    // TODO: Integrate with AI API (Gemini/OpenAI)
    // For now, use a simple response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Cảm ơn bạn đã chia sẻ! Để tôi giúp bạn tối ưu CV, bạn có thể:\n\n1. **Bổ sung thông tin cụ thể**: Thêm số liệu, kết quả đạt được vào mô tả công việc\n2. **Sử dụng động từ hành động**: Bắt đầu mỗi bullet point bằng động từ mạnh (Quản lý, Phát triển, Tối ưu...)\n3. **Tùy chỉnh theo vị trí**: Điều chỉnh nội dung phù hợp với công việc bạn ứng tuyển\n\nBạn muốn tôi xem xét phần nào cụ thể không?"
      };
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3 select-none">
      {/* Chat panel */}
      {showChat && (
        <div 
          className="w-[400px] h-[550px] rounded-2xl border-2 border-primary/20 bg-card/95 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary via-purple-600 to-accent-mint p-4 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold flex items-center gap-2">
                  AI Trợ lý CV
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                </p>
                <p className="text-xs opacity-90">Tối ưu CV của bạn</p>
              </div>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="h-8 w-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-card via-card to-muted/20"
          >
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${
                  msg.role === "user" 
                    ? "bg-primary/15 text-primary" 
                    : "bg-gradient-to-br from-purple-500 to-primary text-white"
                }`}>
                  {msg.role === "user" ? (
                    <span className="text-xs font-bold">U</span>
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div className={`max-w-[75%] flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap shadow-sm ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-muted text-foreground rounded-tl-none border border-border"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-primary text-white flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted px-4 py-2.5 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border/50 p-3 bg-muted/30 shrink-0">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi AI về cách tối ưu CV..."
                disabled={loading}
                className="flex-1 h-10 px-4 rounded-full border border-input bg-background text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              />
              <Button
                type="submit"
                disabled={!input.trim() || loading}
                size="icon"
                className="h-10 w-10 rounded-full shrink-0"
                style={{ background: "var(--gradient-hero)" }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              AI có thể mắc lỗi. Hãy kiểm tra thông tin quan trọng.
            </p>
          </div>
        </div>
      )}

      {/* Bubble trigger button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className={`group h-14 w-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer relative ${
          showChat
            ? "bg-destructive"
            : "bg-gradient-to-tr from-purple-600 via-primary to-accent-mint"
        }`}
        title="Chat với AI"
      >
        {showChat ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <Bot className="h-6 w-6" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-pulse" />
          </>
        )}
        {!showChat && (
          <span 
            className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-40" 
            style={{ animationDuration: "2s" }}
          />
        )}
      </button>
    </div>
  );
}
