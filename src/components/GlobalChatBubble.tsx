"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, MessageCircle, Plus, Send, Users, X } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";

interface Group {
  id: string;
  name: string;
  is_private: boolean;
  is_member: boolean;
  member_count: number;
}

interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string | null;
  sender_email: string;
  message: string;
  created_at: string;
}

export function GlobalChatBubble() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [showBubble, setShowBubble] = useState(false);
  const [chatGroupId, setChatGroupId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});
  const [showGroupList, setShowGroupList] = useState(true);
  const [showHiddenMenu, setShowHiddenMenu] = useState(false);
  const [hiddenGroupIds, setHiddenGroupIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("global_chat_hidden_groups");
      return saved ? JSON.parse(saved) as string[] : [];
    } catch {
      return [];
    }
  });
  const prevLenRef = useRef<Record<string, number>>({});
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  const [pathname, setPathname] = useState(() => typeof window !== "undefined" ? window.location.pathname : "");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleLocationChange = () => {
      setPathname(window.location.pathname);
    };
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

  const isGroupsPage = pathname.startsWith("/groups");
  const isCVPage = pathname.startsWith("/cv");

  const headers = {
    "Content-Type": "application/json",
    "x-user-id": user?.id ?? "",
    "x-user-role": user?.role ?? "user",
  };

  const chatGroup = groups.find((g) => g.id === chatGroupId) ?? null;
  const visibleGroups = groups.filter((g) => !hiddenGroupIds.includes(g.id));
  const hiddenGroups = groups.filter((g) => hiddenGroupIds.includes(g.id));
  const totalUnread = Object.values(unreadMap).reduce((a, b) => a + b, 0);

  const handleHideGroup = (id: string) => {
    setHiddenGroupIds((prev) => {
      const next = [...prev.filter((x) => x !== id), id];
      try {
        localStorage.setItem("global_chat_hidden_groups", JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
    if (chatGroupId === id) {
      const nextGroup = groups.find((g) => g.id !== id && !hiddenGroupIds.includes(g.id) && g.id !== id);
      setChatGroupId(nextGroup?.id ?? null);
    }
  };

  const handleUnhideGroup = (id: string) => {
    setHiddenGroupIds((prev) => {
      const next = prev.filter((x) => x !== id);
      try {
        localStorage.setItem("global_chat_hidden_groups", JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
    setChatGroupId(id);
  };

  // Fetch joined groups
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const res = await fetch("/api/groups?filter=my", { headers });
        if (!res.ok) return;
        const data = await res.json() as { groups?: Group[] };
        setGroups(data.groups ?? []);
      } catch { /* ignore */ }
    };
    void load();
    const iv = window.setInterval(() => { void load(); }, 30000);
    return () => window.clearInterval(iv);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Poll messages for selected group
  useEffect(() => {
    if (!chatGroupId) return;
    const fetch_ = async () => {
      try {
        const res = await fetch(`/api/groups/${chatGroupId}/messages`, { headers });
        if (!res.ok) return;
        const data = await res.json() as { messages?: ChatMessage[] };
        const msgs = data.messages ?? [];
        setChatMessages(msgs);
        setTimeout(() => { chatScrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, 60);
      } catch { /* ignore */ }
    };
    void fetch_();
    const iv = window.setInterval(() => { void fetch_(); }, 4000);
    return () => window.clearInterval(iv);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatGroupId, user?.id]);

  // Poll unread for all groups when bubble is closed or open
  const pollUnread = useCallback(async () => {
    for (const g of groups) {
      try {
        const res = await fetch(`/api/groups/${g.id}/messages`, { headers });
        if (!res.ok) continue;
        const data = await res.json() as { messages?: { id: string }[] };
        const len = (data.messages ?? []).length;
        const prev = prevLenRef.current[g.id] ?? len;
        if (len > prev) {
          setUnreadMap((m) => ({ ...m, [g.id]: (m[g.id] ?? 0) + (len - prev) }));
          // Auto unhide group when it has new messages
          setHiddenGroupIds((prevHidden) => {
            if (prevHidden.includes(g.id)) {
              const next = prevHidden.filter((id) => id !== g.id);
              try {
                localStorage.setItem("global_chat_hidden_groups", JSON.stringify(next));
              } catch { /* ignore */ }
              return next;
            }
            return prevHidden;
          });
        }
        prevLenRef.current[g.id] = len;
      } catch { /* ignore */ }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups.length, user?.id]);

  useEffect(() => {
    if (groups.length === 0) return;
    void pollUnread();
    const iv = window.setInterval(() => { void pollUnread(); }, 8000);
    return () => window.clearInterval(iv);
  }, [groups.length, pollUnread]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !chatGroupId) return;
    const msg = chatInput.trim();
    setChatInput("");
    try {
      await fetch(`/api/groups/${chatGroupId}/messages`, {
        method: "POST",
        headers,
        body: JSON.stringify({ message: msg }),
      });
    } catch { /* ignore */ }
  };

  if (!user || groups.length === 0 || isGroupsPage || isCVPage) return null;

  return (
    <div className="fixed bottom-10 right-6 z-[90] flex flex-col items-end gap-3 select-none">
      {/* Chat panel */}
      {showBubble && (
        <div className="w-[390px] rounded-2xl border border-border bg-card/95 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200"
          style={{ maxHeight: "540px" }}>

          {/* Header */}
          <div className="bg-gradient-to-r from-primary via-primary-hover to-accent-mint p-3.5 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <div>
                <p className="text-[10px] font-bold opacity-75 uppercase tracking-wider">Tin nhắn nhóm</p>
                <p className="text-sm font-extrabold truncate max-w-[190px]">{chatGroup?.name ?? "Chọn nhóm"}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* Toggle group list */}
              <button
                onClick={() => setShowGroupList((v) => !v)}
                className="h-7 w-7 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition"
                title={showGroupList ? "Ẩn danh sách nhóm" : "Hiện danh sách nhóm"}
              >
                {showGroupList ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => setShowBubble(false)}
                className="h-7 w-7 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Group selector tabs — collapsible */}
          {showGroupList && (
            <div className="flex items-center justify-between gap-1.5 px-3 py-2 border-b border-border bg-muted/40 shrink-0 relative">
              <div className="flex-1 flex overflow-x-auto gap-1.5 scrollbar-none pr-8">
                {visibleGroups.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      setChatGroupId(g.id);
                      setChatMessages([]);
                      setUnreadMap((prev) => ({ ...prev, [g.id]: 0 }));
                    }}
                    className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all relative group ${
                      chatGroupId === g.id
                        ? "bg-primary text-white shadow-sm"
                        : "bg-background text-muted-foreground hover:bg-muted border border-border"
                    }`}
                  >
                    <Users className="h-3 w-3 shrink-0" />
                    <span className="truncate max-w-[70px]">{g.name}</span>
                    {unreadMap[g.id] ? (
                      <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                        {unreadMap[g.id]}
                      </span>
                    ) : null}
                    {/* Hide button */}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHideGroup(g.id);
                      }}
                      className="p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 ml-0.5 transition-colors opacity-60 hover:opacity-100"
                      title="Ẩn tạm khỏi bong bóng"
                    >
                      <X className="h-2.5 w-2.5" />
                    </span>
                  </button>
                ))}
              </div>

              {/* Plus button to show list of hidden groups */}
              {hiddenGroups.length > 0 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                  <button
                    onClick={() => setShowHiddenMenu((v) => !v)}
                    className={`h-7 w-7 rounded-full flex items-center justify-center border transition-all ${
                      showHiddenMenu
                        ? "bg-primary text-white border-primary"
                        : "bg-background text-muted-foreground hover:bg-muted border-border"
                    }`}
                    title="Hiện nhóm đã ẩn"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>

                  {/* Dropdown menu */}
                  {showHiddenMenu && (
                    <div className="absolute right-0 top-8 w-48 rounded-lg border border-border bg-card p-1 shadow-lg z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <p className="text-[10px] font-bold text-muted-foreground px-2 py-1 uppercase tracking-wider border-b border-border mb-1">
                        Nhóm đã ẩn ({hiddenGroups.length})
                      </p>
                      <div className="max-h-40 overflow-y-auto">
                        {hiddenGroups.map((g) => (
                          <button
                            key={g.id}
                            onClick={() => {
                              handleUnhideGroup(g.id);
                              setShowHiddenMenu(false);
                            }}
                            className="w-full text-left px-2 py-1.5 rounded text-xs hover:bg-muted text-foreground transition-colors flex items-center justify-between"
                          >
                            <span className="truncate max-w-[120px] font-medium">{g.name}</span>
                            <span className="text-[10px] text-primary font-bold hover:underline shrink-0">Hiện lại</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-card min-h-0" style={{ maxHeight: showGroupList ? "280px" : "360px" }}>
            {!chatGroupId ? (
              <div className="h-32 flex flex-col items-center justify-center text-center text-muted-foreground">
                <MessageCircle className="h-8 w-8 text-muted-foreground/20 mb-2" />
                <p className="text-xs">{showGroupList ? "Chọn một nhóm ở trên để bắt đầu chat" : "Chưa chọn nhóm"}</p>
              </div>
            ) : chatMessages.length === 0 ? (
              <div className="h-32 flex flex-col items-center justify-center text-center text-muted-foreground">
                <MessageCircle className="h-8 w-8 text-muted-foreground/20 mb-2" />
                <p className="text-xs font-semibold">Chưa có tin nhắn</p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">Hãy gửi tin nhắn đầu tiên!</p>
              </div>
            ) : (
              chatMessages.map((msg) => {
                const isSelf = msg.sender_id === user.id;
                return (
                  <div key={msg.id} className={`flex items-end gap-2 ${isSelf ? "flex-row-reverse" : ""}`}>
                    <div className="h-7 w-7 shrink-0 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold uppercase">
                      {(msg.sender_name || msg.sender_email).charAt(0)}
                    </div>
                    <div className={`max-w-[65%] flex flex-col gap-0.5 ${isSelf ? "items-end" : "items-start"}`}>
                      {!isSelf && (
                        <p className="text-[9px] font-semibold text-muted-foreground ml-1">
                          {msg.sender_name || msg.sender_email}
                        </p>
                      )}
                      <div className={`px-3 py-2 rounded-2xl text-xs break-words shadow-sm ${
                        isSelf
                          ? "bg-gradient-to-r from-primary to-primary-hover text-white rounded-br-none"
                          : "bg-muted text-foreground rounded-bl-none"
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatScrollRef} />
          </div>

          {/* Input */}
          {chatGroupId && (
            <div className="border-t border-border/50 p-3 bg-muted/20 shrink-0">
              <form onSubmit={(e) => { void sendMessage(e); }} className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Nhắn vào ${chatGroup?.name ?? "nhóm"}...`}
                  className="flex-1 h-9 px-3 rounded-full border border-input bg-background text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button
                  type="submit"
                  disabled={!chatInput.trim()}
                  size="icon"
                  className="h-9 w-9 rounded-full shrink-0 cursor-pointer"
                  style={{ background: "var(--gradient-hero)" }}
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Bubble trigger button */}
      <button
        onClick={() => {
          const next = !showBubble;
          setShowBubble(next);
          if (next && groups.length > 0 && !chatGroupId) {
            const firstVisible = groups.find((g) => !hiddenGroupIds.includes(g.id));
            setChatGroupId(firstVisible?.id ?? null);
          }
        }}
        className={`h-14 w-14 rounded-full flex items-center justify-center text-white shadow-2xl transition hover:scale-105 cursor-pointer relative ${
          showBubble
            ? "bg-destructive shadow-destructive/20"
            : "bg-gradient-to-tr from-primary via-primary-hover to-accent-mint shadow-primary/30"
        }`}
        title="Tin nhắn nhóm"
      >
        {showBubble ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!showBubble && totalUnread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 h-6 min-w-6 px-1.5 rounded-full bg-rose-600 text-white text-xs font-black flex items-center justify-center border-2 border-card shadow-md animate-bounce">
            {totalUnread}
          </span>
        )}
        {!showBubble && (
          <span className="absolute inset-0 rounded-full border border-primary animate-ping opacity-40" style={{ animationDuration: "2.5s" }} />
        )}
      </button>
    </div>
  );
}
