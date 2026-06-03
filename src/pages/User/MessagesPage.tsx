"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MessageCircle,
  MessageSquare,
  Users,
  UserPlus,
  Send,
  Check,
  X,
  UserMinus,
  Search,
  User,
  MoreVertical,
  Trash2,
  Clock,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { DashboardHeader, type NavItem } from "@/components/dashboard-header";
import { userNavItems } from "@/pages/user/user-nav-items";
import {
  BarChart3,
  BookOpen as BookOpenNav,
  Newspaper as NewspaperNav,
  HelpCircle as HelpCircleNav,
  Users as UsersNav,
  MessageCircle as MessageCircleNav,
} from "lucide-react";

// Nav items cho Content Manager (bao gồm Trò chuyện)
const cmNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <BarChart3 className="h-5 w-5" />, href: "/content-manager/dashboard" },
  { label: "Quản lý bài viết", icon: <BookOpenNav className="h-5 w-5" />, href: "/content-manager/dashboard#articles" },
  { label: "Quản lý bài báo", icon: <NewspaperNav className="h-5 w-5" />, href: "/content-manager/dashboard#news" },
  { label: "Quản lý câu hỏi", icon: <HelpCircleNav className="h-5 w-5" />, href: "/content-manager/dashboard#questions" },
  { label: "Trò chuyện", icon: <MessageCircleNav className="h-5 w-5" />, href: "/messages" },
  { label: "Blog Career", icon: <BookOpenNav className="h-5 w-5" />, href: "/blog" },
  { label: "Điểm Tin Báo Chí", icon: <NewspaperNav className="h-5 w-5" />, href: "/news" },
];

// Nav items cho Admin (bao gồm Trò chuyện)
const adminNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <BarChart3 className="h-5 w-5" />, href: "/admin/dashboard" },
  { label: "Quản lý người dùng", icon: <UsersNav className="h-5 w-5" />, href: "/admin/dashboard#users" },
  { label: "Trò chuyện", icon: <MessageCircleNav className="h-5 w-5" />, href: "/messages" },
  { label: "Blog Career", icon: <BookOpenNav className="h-5 w-5" />, href: "/blog" },
  { label: "Điểm Tin Báo Chí", icon: <NewspaperNav className="h-5 w-5" />, href: "/news" },
];
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Friend {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  job_title: string | null;
  location: string | null;
}

interface FriendRequest {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  job_title: string | null;
  friendship_id: string;
  created_at: string;
}

interface DirectMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface SearchUser {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  job_title: string | null;
  friendship_status: "none" | "pending_incoming" | "pending_outgoing" | "accepted";
}

export default function MessagesPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"chats" | "contacts">("chats");

  // Friends & Requests lists
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);

  // Chat state
  const [activeChatFriendId, setActiveChatFriendId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<DirectMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  // Search/Add Friend Modal state
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Query parameter support
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chatParam = params.get("chat");
    if (chatParam) {
      setActiveChatFriendId(chatParam);
      setActiveTab("chats");
    }
  }, []);

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      "x-user-id": user?.id ?? "",
      "x-user-role": user?.role ?? "user",
    }),
    [user?.id, user?.role]
  );

  // Fetch Friends and Requests lists
  const fetchFriendsList = useCallback(async () => {
    try {
      const response = await fetch("/api/friends", { headers });
      if (!response.ok) throw new Error("Lỗi tải danh sách bạn bè");
      const data = await response.json() as { friends: Friend[]; incoming: FriendRequest[]; outgoing: FriendRequest[] };
      setFriends(data.friends || []);
      setIncomingRequests(data.incoming || []);
      setOutgoingRequests(data.outgoing || []);
    } catch { /* ignore */ }
    finally {
      setLoadingLists(false);
    }
  }, [headers]);

  // Fetch unread message counts
  const fetchUnreadCounts = useCallback(async () => {
    try {
      const response = await fetch("/api/messages/unread", { headers });
      if (!response.ok) return;
      const data = await response.json() as { unread: { sender_id: string; unread_count: number }[] };
      const counts: Record<string, number> = {};
      for (const item of data.unread || []) {
        counts[item.sender_id] = Number(item.unread_count);
      }
      setUnreadCounts(counts);
    } catch { /* ignore */ }
  }, [headers]);

  // Initialize and poll list data
  useEffect(() => {
    void fetchFriendsList();
    void fetchUnreadCounts();

    const interval = setInterval(() => {
      void fetchFriendsList();
      void fetchUnreadCounts();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchFriendsList, fetchUnreadCounts]);

  // Fetch and poll messages for selected chat
  useEffect(() => {
    if (!activeChatFriendId) {
      setChatMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/direct/${activeChatFriendId}`, { headers });
        if (!response.ok) return;
        const data = await response.json() as { messages: DirectMessage[] };
        setChatMessages(data.messages || []);
        // Reset unread count for this friend locally
        setUnreadCounts(prev => ({ ...prev, [activeChatFriendId]: 0 }));
      } catch { /* ignore */ }
    };

    void fetchMessages();
    setTimeout(() => { chatScrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, 150);

    const interval = setInterval(() => {
      void fetchMessages();
    }, 4000);

    return () => clearInterval(interval);
  }, [activeChatFriendId, headers]);

  // Auto-scroll on new messages
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages.length]);

  // Send a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChatFriendId) return;

    const messageContent = chatInput.trim();
    setChatInput("");

    try {
      const response = await fetch(`/api/messages/direct/${activeChatFriendId}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ message: messageContent }),
      });
      if (!response.ok) {
        const errData = await response.json() as { error?: string };
        alert(errData.error || "Không thể gửi tin nhắn.");
        return;
      }
      const data = await response.json() as { message: DirectMessage };
      setChatMessages(prev => [...prev, data.message]);
    } catch {
      alert("Đã xảy ra lỗi kết nối.");
    }
  };

  // Search users for adding friends
  const handleSearchUsers = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    setSearchError("");
    try {
      const response = await fetch(`/api/friends/search?q=${encodeURIComponent(searchQuery.trim())}`, { headers });
      if (!response.ok) throw new Error("Lỗi tìm kiếm");
      const data = await response.json() as { users: SearchUser[] };
      setSearchResults(data.users || []);
    } catch {
      setSearchError("Không thể hoàn tất tìm kiếm.");
    } finally {
      setSearching(false);
    }
  }, [headers, searchQuery]);

  // Trigger search on query change
  useEffect(() => {
    const timeout = setTimeout(() => {
      void handleSearchUsers();
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, handleSearchUsers]);

  // Send a friend request
  const handleSendFriendRequest = async (targetId: string) => {
    try {
      const response = await fetch("/api/friends/request", {
        method: "POST",
        headers,
        body: JSON.stringify({ friend_id: targetId }),
      });
      if (!response.ok) {
        const data = await response.json() as { error?: string };
        alert(data.error || "Không thể gửi lời mời kết bạn.");
        return;
      }
      await fetchFriendsList();
      void handleSearchUsers();
    } catch {
      alert("Đã xảy ra lỗi.");
    }
  };

  // Accept a friend request
  const handleAcceptFriendRequest = async (requestId: string) => {
    try {
      const response = await fetch("/api/friends/accept", {
        method: "POST",
        headers,
        body: JSON.stringify({ friendship_id: requestId }),
      });
      if (!response.ok) throw new Error("Chấp nhận thất bại");
      await fetchFriendsList();
    } catch {
      alert("Không thể chấp nhận lời mời.");
    }
  };

  // Decline/Cancel a friend request
  const handleDeclineFriendRequest = async (requestId: string) => {
    try {
      const response = await fetch("/api/friends/decline", {
        method: "POST",
        headers,
        body: JSON.stringify({ friendship_id: requestId }),
      });
      if (!response.ok) throw new Error("Hủy yêu cầu thất bại");
      await fetchFriendsList();
    } catch {
      alert("Không thể từ chối lời mời.");
    }
  };

  // Unfriend a user
  const handleUnfriend = async (friendId: string) => {
    if (!confirm("Bạn có chắc chắn muốn hủy kết bạn với người này không?")) return;
    try {
      const response = await fetch(`/api/friends/${friendId}`, {
        method: "DELETE",
        headers,
      });
      if (!response.ok) throw new Error("Hủy kết bạn thất bại");
      if (activeChatFriendId === friendId) {
        setActiveChatFriendId(null);
      }
      await fetchFriendsList();
    } catch {
      alert("Không thể hủy kết bạn.");
    }
  };

  // Format time helper
  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  // Derived conversations list based on existing friends
  const activeChatFriend = friends.find(f => f.id === activeChatFriendId) || null;

  // Chọn navItems và role phù hợp với vai trò của người dùng
  const currentRole: "user" | "admin" | "content_manager" =
    user?.role === "admin" || user?.role === "content_manager"
      ? user.role
      : "user";
  const currentNavItems = currentRole === "admin"
    ? adminNavItems
    : currentRole === "content_manager"
      ? cmNavItems
      : userNavItems;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <DashboardHeader
        navItems={currentNavItems}
        activePath="/messages"
        role={currentRole}
        onLogout={() => { logout(); window.location.assign("/"); }}
      />

      <main
        className="flex h-screen pt-16 overflow-hidden transition-all duration-300"
        style={{ paddingLeft: "var(--sidebar-width)" }}
      >
        {/* Sidebar: Zalo Style */}
        <div className="w-[360px] shrink-0 border-r border-border bg-card flex flex-col overflow-hidden relative">
          
          {/* Top Panel: Add Friend & General Search */}
          <div className="px-4 py-3.5 border-b border-border/60 flex items-center justify-between gap-3">
            <h1 className="text-base font-bold tracking-tight">Trò chuyện</h1>
            <button
              onClick={() => { setShowAddFriendModal(true); setSearchQuery(""); setSearchResults([]); }}
              className="h-8 px-3 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold flex items-center gap-1.5 transition"
              title="Tìm kiếm & kết bạn"
            >
              <UserPlus className="h-3.5 w-3.5" /> Kết bạn
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border/40 p-1 bg-muted/20 shrink-0">
            <button
              onClick={() => setActiveTab("chats")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "chats"
                  ? "bg-card text-primary shadow-sm border border-border/30"
                  : "text-muted-foreground hover:bg-muted/40"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" /> Hội thoại
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "contacts"
                  ? "bg-card text-primary shadow-sm border border-border/30"
                  : "text-muted-foreground hover:bg-muted/40"
              }`}
            >
              <Users className="h-3.5 w-3.5" /> Danh bạ
              {(incomingRequests.length > 0) && (
                <span className="h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                  {incomingRequests.length}
                </span>
              )}
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto">
            {loadingLists ? (
              <div className="flex justify-center p-8">
                <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary" />
              </div>
            ) : activeTab === "chats" ? (
              // TAB 1: CONVERSATIONS LIST
              <div className="p-2 space-y-0.5">
                {friends.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <MessageCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground/20" />
                    <p className="text-xs font-semibold">Chưa có cuộc trò chuyện nào</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">Kết bạn để bắt đầu trò chuyện trực tiếp</p>
                  </div>
                ) : (
                  friends.map((friend) => {
                    const isSelected = activeChatFriendId === friend.id;
                    const unread = unreadCounts[friend.id] || 0;
                    return (
                      <div
                        key={friend.id}
                        onClick={() => {
                          setActiveChatFriendId(friend.id);
                          window.history.pushState({}, "", `/messages?chat=${friend.id}`);
                        }}
                        className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                          isSelected ? "bg-primary/10 border-l-4 border-l-primary" : "hover:bg-muted"
                        }`}
                      >
                        <div className="relative shrink-0">
                          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary border border-primary/20 flex items-center justify-center text-sm font-bold uppercase overflow-hidden">
                            {friend.avatar_url ? (
                              <img src={friend.avatar_url} alt={friend.name || friend.email} className="h-full w-full object-cover" />
                            ) : (
                              (friend.name || friend.email).charAt(0)
                            )}
                          </div>
                          {unread > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-pulse">
                              {unread}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className={`text-sm font-semibold truncate ${isSelected ? "text-primary" : ""}`}>
                              {friend.name || friend.email.split("@")[0]}
                            </h3>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {friend.job_title || friend.email}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              // TAB 2: CONTACTS & REQUESTS LIST
              <div className="p-3 space-y-5">
                {/* 1. Lời mời kết bạn đến (Incoming Requests) */}
                {incomingRequests.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      Lời mời kết bạn ({incomingRequests.length})
                    </h3>
                    <div className="space-y-1.5">
                      {incomingRequests.map((req) => (
                        <div key={req.id} className="p-2.5 rounded-xl border border-border/60 bg-muted/10 flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                            {req.avatar_url ? (
                              <img src={req.avatar_url} alt={req.name || req.email} className="h-full w-full object-cover" />
                            ) : (
                              (req.name || req.email).charAt(0)
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{req.name || req.email.split("@")[0]}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{req.job_title || req.email}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => void handleAcceptFriendRequest(req.friendship_id)}
                              className="h-7 w-7 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow transition-all cursor-pointer"
                              title="Đồng ý"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => void handleDeclineFriendRequest(req.friendship_id)}
                              className="h-7 w-7 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive flex items-center justify-center transition-all cursor-pointer"
                              title="Từ chối"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Lời mời đã gửi (Outgoing Requests) */}
                {outgoingRequests.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Đã gửi lời mời ({outgoingRequests.length})
                    </h3>
                    <div className="space-y-1.5">
                      {outgoingRequests.map((req) => (
                        <div key={req.id} className="p-2.5 rounded-xl border border-border/30 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                              {req.avatar_url ? (
                                <img src={req.avatar_url} alt={req.name || req.email} className="h-full w-full object-cover" />
                              ) : (
                                (req.name || req.email).charAt(0)
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate">{req.name || req.email.split("@")[0]}</p>
                              <p className="text-[9px] text-muted-foreground truncate">Đang chờ phản hồi</p>
                            </div>
                          </div>
                          <button
                            onClick={() => void handleDeclineFriendRequest(req.friendship_id)}
                            className="text-[10px] text-destructive hover:underline font-medium shrink-0 px-2 py-1 rounded bg-destructive/5 hover:bg-destructive/10"
                          >
                            Hủy
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Danh sách bạn bè (Friends List) */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Bạn bè ({friends.length})
                  </h3>
                  {friends.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic text-center py-4">Chưa có bạn bè nào.</p>
                  ) : (
                    <div className="space-y-1">
                      {friends.map((friend) => (
                        <div key={friend.id} className="group p-2 rounded-xl hover:bg-muted/40 flex items-center justify-between gap-3 transition">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                              {friend.avatar_url ? (
                                <img src={friend.avatar_url} alt={friend.name || friend.email} className="h-full w-full object-cover" />
                              ) : (
                                (friend.name || friend.email).charAt(0)
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold truncate">{friend.name || friend.email.split("@")[0]}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{friend.job_title || "Thành viên"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setActiveChatFriendId(friend.id);
                                setActiveTab("chats");
                                window.history.pushState({}, "", `/messages?chat=${friend.id}`);
                              }}
                              className="text-[10px] bg-primary/10 hover:bg-primary/20 text-primary font-bold px-2 py-1 rounded-md transition cursor-pointer"
                            >
                              Nhắn tin
                            </button>
                            <button
                              onClick={() => void handleUnfriend(friend.id)}
                              className="p-1 text-muted-foreground hover:text-destructive rounded hover:bg-destructive/10 transition cursor-pointer"
                              title="Hủy kết bạn"
                            >
                              <UserMinus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Message Pane: Zalo Style */}
        <div className="flex-1 overflow-hidden bg-background flex flex-col relative">
          {activeChatFriend ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Chat Header */}
              <div className="h-14 border-b border-border/60 bg-card px-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/20 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                    {activeChatFriend.avatar_url ? (
                      <img src={activeChatFriend.avatar_url} alt={activeChatFriend.name || activeChatFriend.email} className="h-full w-full object-cover" />
                    ) : (
                      (activeChatFriend.name || activeChatFriend.email).charAt(0)
                    )}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold truncate max-w-[200px]">
                      {activeChatFriend.name || activeChatFriend.email.split("@")[0]}
                    </h2>
                    <p className="text-[10px] text-muted-foreground">
                      {activeChatFriend.job_title ? `${activeChatFriend.job_title} • ` : ""}{activeChatFriend.location || "Đang hoạt động"}
                    </p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => void handleUnfriend(activeChatFriend.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition cursor-pointer"
                    title="Hủy kết bạn"
                  >
                    <UserMinus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5 min-h-0">
                {chatMessages.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center text-muted-foreground">
                    <MessageSquare className="h-10 w-10 text-muted-foreground/20 mb-3" />
                    <p className="text-sm font-semibold">Bắt đầu cuộc trò chuyện</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Gửi tin nhắn để chia sẻ kiến thức và kết nối.</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isSelf = msg.sender_id === user?.id;
                    return (
                      <div key={msg.id} className={`flex items-end gap-2.5 ${isSelf ? "flex-row-reverse" : ""}`}>
                        <div className="h-7 w-7 shrink-0 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-bold uppercase overflow-hidden">
                          {isSelf ? (
                            user?.image ? (
                              <img src={user.image} alt="Avatar" className="h-full w-full object-cover" />
                            ) : (
                              (user.name || user.email).charAt(0)
                            )
                          ) : (
                            activeChatFriend.avatar_url ? (
                              <img src={activeChatFriend.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                            ) : (
                              (activeChatFriend.name || activeChatFriend.email).charAt(0)
                            )
                          )}
                        </div>
                        <div className={`max-w-[60%] flex flex-col gap-0.5 ${isSelf ? "items-end" : "items-start"}`}>
                          <div className={`px-3.5 py-2.5 rounded-2xl text-xs break-words shadow-sm ${
                            isSelf
                              ? "bg-gradient-to-r from-primary to-primary-hover text-white rounded-br-none"
                              : "bg-card text-foreground border border-border/40 rounded-bl-none"
                          }`}>
                            {msg.message}
                          </div>
                          <span className="text-[9px] text-muted-foreground/60 px-1 mt-0.5 flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" /> {formatTime(msg.created_at)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={chatScrollRef} />
              </div>

              {/* Chat Input */}
              <div className="border-t border-border/60 p-3 bg-card shrink-0">
                <form onSubmit={(e) => { void handleSendMessage(e); }} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 h-10 px-4 rounded-full border border-input bg-muted/30 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <Button
                    type="submit"
                    disabled={!chatInput.trim()}
                    size="icon"
                    className="h-10 w-10 rounded-full shrink-0 cursor-pointer"
                    style={{ background: "var(--gradient-hero)" }}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            // No chat selected fallback
            <div className="flex-1 flex flex-col items-center justify-center bg-muted/10 p-6">
              <div className="h-24 w-24 rounded-full bg-card shadow-sm border border-border flex items-center justify-center mb-6">
                <MessageCircle className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-2">Hộp thư trò chuyện</h2>
              <p className="text-sm text-muted-foreground max-w-sm text-center">
                Chọn một bạn bè bên trái hoặc nhấp "Kết bạn" để kết nối với các thành viên khác trên JobReady AI.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Add Friend / Search Modal */}
      {showAddFriendModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddFriendModal(false)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/50 p-4">
              <h2 className="text-base font-bold">Tìm kiếm bạn bè</h2>
              <button onClick={() => setShowAddFriendModal(false)} className="rounded-lg p-2 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nhập tên hoặc email..."
                  className="pl-9 h-10 text-xs"
                  autoFocus
                />
              </div>

              {searchError && (
                <div className="p-3 bg-destructive/10 rounded-lg text-xs text-destructive">{searchError}</div>
              )}

              {/* Search Results */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {searching ? (
                  <div className="flex justify-center py-8">
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary" />
                  </div>
                ) : searchResults.length === 0 ? (
                  searchQuery.trim() ? (
                    <p className="text-xs text-muted-foreground text-center py-6">Không tìm thấy kết quả phù hợp.</p>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-6">Nhập từ khóa để tìm thành viên khác.</p>
                  )
                ) : (
                  searchResults.map((sUser) => (
                    <div key={sUser.id} className="p-2.5 rounded-xl border border-border bg-muted/5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase overflow-hidden">
                          {sUser.avatar_url ? (
                            <img src={sUser.avatar_url} alt={sUser.name || sUser.email} className="h-full w-full object-cover" />
                          ) : (
                            (sUser.name || sUser.email).charAt(0)
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">{sUser.name || sUser.email.split("@")[0]}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{sUser.job_title || sUser.email}</p>
                        </div>
                      </div>

                      {/* Friendship Actions */}
                      <div className="shrink-0">
                        {sUser.friendship_status === "none" && (
                          <button
                            onClick={() => void handleSendFriendRequest(sUser.id)}
                            className="text-[10px] bg-primary hover:bg-primary-hover text-white font-bold px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                          >
                            Kết bạn
                          </button>
                        )}
                        {sUser.friendship_status === "pending_outgoing" && (
                          <span className="text-[10px] text-muted-foreground font-semibold px-2.5 py-1.5 rounded-lg bg-muted border border-border">
                            Đã gửi yêu cầu
                          </span>
                        )}
                        {sUser.friendship_status === "pending_incoming" && (
                          <button
                            onClick={() => {
                              // Chấp nhận yêu cầu từ modal
                              const incomingReq = incomingRequests.find(r => r.id === sUser.id);
                              if (incomingReq) {
                                void handleAcceptFriendRequest(incomingReq.friendship_id);
                              } else {
                                void fetchFriendsList();
                              }
                            }}
                            className="text-[10px] bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                          >
                            Chấp nhận
                          </button>
                        )}
                        {sUser.friendship_status === "accepted" && (
                          <button
                            onClick={() => {
                              setActiveChatFriendId(sUser.id);
                              setShowAddFriendModal(false);
                              setActiveTab("chats");
                              window.history.pushState({}, "", `/messages?chat=${sUser.id}`);
                            }}
                            className="text-[10px] bg-primary/10 hover:bg-primary/20 text-primary font-bold px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                          >
                            Nhắn tin
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="border-t border-border/50 p-3 bg-muted/10 flex justify-end">
              <Button size="sm" variant="outline" className="text-xs" onClick={() => setShowAddFriendModal(false)}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
