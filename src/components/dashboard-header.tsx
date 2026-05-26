import { useEffect, useRef, useState, useCallback } from "react";
import {
  Palette,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Shield,
  User,
  PenLine,
  Home,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useTheme } from "@/components/theme-provider";
import AvatarMenu from "@/components/AvatarMenu";
import ChangePasswordModal from "@/pages/Common/ChangePasswordModal";
import UploadCVModal from "@/pages/Common/UploadCVModal";
import type { Theme } from "@/components/theme-provider";

export interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

interface DashboardHeaderProps {
  navItems: NavItem[];
  activePath?: string;
  role: "admin" | "content_manager" | "user";
  onLogout: () => void;
}

// Theme Option Button
function ThemeOptionButton({
  opt,
  currentTheme,
  onSelect
}: {
  opt: { value: Theme; label: string; icon: React.ReactNode };
  currentTheme: Theme;
  onSelect: (value: Theme) => void;
}) {
  return (
    <button
      onClick={() => onSelect(opt.value)}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium cursor-pointer ${
        currentTheme === opt.value
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      {opt.icon}
      Giao diện {opt.label}
    </button>
  );
}

// Nav Item
function NavItemComponent({
  item,
  isActive,
  collapsed,
  onClick
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onClick: (href: string) => void;
}) {
  return (
    <li>
      <button
        onClick={() => onClick(item.href)}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium w-full cursor-pointer ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        } ${collapsed ? "justify-center" : ""}`}
        title={collapsed ? item.label : undefined}
      >
        <span className={isActive ? "text-primary" : "text-muted-foreground"}>
          {item.icon}
        </span>
        {!collapsed && <span>{item.label}</span>}
      </button>
    </li>
  );
}

export function DashboardHeader({ navItems, activePath, role, onLogout }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  // Modal states
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showUploadCV, setShowUploadCV] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // User data state
  const [userData, setUserData] = useState<{ id?: string; email?: string; name?: string; avatar_url?: string | null; auth_provider?: string } | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userCVs, setUserCVs] = useState<any[]>([]);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // Memoized theme options
  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Sáng", icon: <Sun className="h-4 w-4 text-amber-500" /> },
    { value: "dark", label: "Tối", icon: <Moon className="h-4 w-4 text-blue-400" /> },
    { value: "rose", label: "Hồng", icon: <Palette className="h-4 w-4 text-rose-500" /> },
  ];

  // Fetch user profile - only once
  const fetchProfile = useCallback(async () => {
    if (!user?.id || initializedRef.current) return;
    initializedRef.current = true;

    try {
      const response = await fetch("/api/dashboard/me", {
        headers: {
          "x-user-id": user.id,
          "x-user-role": user.role || "user",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        setUserProfile(data.profile);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  }, [user?.id, user?.role, user]);

  // Fetch user CVs
  const fetchCVs = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetch("/api/cv", {
        headers: {
          "x-user-id": user.id,
          "x-user-role": user.role || "user",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserCVs(data.cvs || []);
      }
    } catch (error) {
      console.error("Failed to fetch CVs:", error);
    }
  }, [user?.id, user?.role]);

  useEffect(() => {
    fetchProfile();
    fetchCVs();
  }, [fetchProfile, fetchCVs]);

  // Handle click outside for theme dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle sidebar width
  useEffect(() => {
    document.documentElement.style.setProperty("--sidebar-width", sidebarCollapsed ? "4rem" : "15rem");
  }, [sidebarCollapsed]);

  // Memoized handlers
  const handleLogoutConfirm = useCallback(() => {
    setShowLogoutModal(false);
    logout();
    window.location.assign("/");
  }, [logout]);

  const handleSaveProfile = useCallback(async (data: any) => {
    const response = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user?.id || "",
        "x-user-role": user?.role || "",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error("Cập nhật hồ sơ thất bại");
    }
    
    await fetchProfile();
  }, [user?.id, user?.role, fetchProfile]);

  const handleSendOTP = useCallback(async () => {
    const response = await fetch("/api/auth/change-password/send-otp", {
      method: "POST",
      headers: {
        "x-user-id": user?.id || "",
        "x-user-role": user?.role || "",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Gửi OTP thất bại");
    }

    const data = await response.json();
    return data;
  }, [user?.id, user?.role]);

  const handleUploadCV = useCallback(async (file: File, title: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    
    const response = await fetch("/api/cv", {
      method: "POST",
      headers: {
        "x-user-id": user?.id || "",
        "x-user-role": user?.role || "",
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error("Tải lên CV thất bại");
    }
    
    await fetchCVs();
  }, [user?.id, user?.role, fetchCVs]);

  const handleDeleteCV = useCallback(async (id: string) => {
    const response = await fetch(`/api/cv/${id}`, {
      method: "DELETE",
      headers: {
        "x-user-id": user?.id || "",
        "x-user-role": user?.role || "",
      },
    });
    
    if (!response.ok) {
      throw new Error("Xóa CV thất bại");
    }
    
    await fetchCVs();
  }, [user?.id, user?.role, fetchCVs]);

  const handleNavClick = useCallback((href: string) => {
    window.location.assign(href);
  }, []);

  const handleThemeSelect = useCallback((value: Theme) => {
    setTheme(value);
    setThemeDropdownOpen(false);
  }, [setTheme]);

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  const RoleIcon = role === "admin" ? Shield : role === "content_manager" ? PenLine : User;

  return (
    <>
      {/* Top Header Bar */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-card/95 backdrop-blur-sm transition-all duration-200"
        style={{ paddingLeft: "var(--sidebar-width)" }}
      >
        <div className="flex h-full items-center justify-between px-4 gap-4">
          {/* Left: Logo + Role Badge */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
            <a
              href="/"
              className="flex items-center gap-2 group"
              onClick={(e) => {
                e.preventDefault();
                window.location.assign("/");
              }}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md"
                style={{ background: "var(--gradient-hero)" }}
              >
                <RoleIcon className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight hidden sm:block">
                JobReady<span className="text-primary"> AI</span>
              </span>
            </a>

            {/* Role Badge */}
            <div className={`hidden lg:flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
              role === "admin" ? "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                : role === "content_manager" ? "border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400"
                : "border-primary/20 bg-primary/10 text-primary"
            }`}>
              <RoleIcon className="h-4 w-4" />
              {role === "admin" ? "Quản trị viên" : role === "content_manager" ? "Content Manager" : "Người dùng"}
            </div>
          </div>

          {/* Right: Theme Switcher + Avatar Menu */}
          <div className="flex items-center gap-2">
            {/* Theme Switcher - Dropdown style like homepage */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                className="flex items-center gap-1.5 rounded-full border border-border bg-card/90 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer transition-colors"
                title="Chọn giao diện"
              >
                {theme === "light" && <Sun className="h-3.5 w-3.5 text-amber-500" />}
                {theme === "dark" && <Moon className="h-3.5 w-3.5 text-blue-400" />}
                {theme === "rose" && <Palette className="h-3.5 w-3.5 text-rose-500" />}
                <span className="hidden sm:inline capitalize">{theme === "light" ? "Sáng" : theme === "dark" ? "Tối" : "Hồng"}</span>
                <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform duration-300 ${themeDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl border border-border bg-card p-1.5 shadow-lg z-50">
                  <button
                    onClick={() => {
                      setTheme("light");
                      setThemeDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium cursor-pointer ${theme === "light"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                  >
                    <Sun className="h-4 w-4 text-amber-500" />
                    Giao diện sáng
                  </button>
                  <button
                    onClick={() => {
                      setTheme("dark");
                      setThemeDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium cursor-pointer ${theme === "dark"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                  >
                    <Moon className="h-4 w-4 text-blue-400" />
                    Giao diện tối
                  </button>
                  <button
                    onClick={() => {
                      setTheme("rose");
                      setThemeDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium cursor-pointer ${theme === "rose"
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                  >
                    <Palette className="h-4 w-4 text-rose-500" />
                    Giao diện hồng
                  </button>
                </div>
              )}
            </div>

            {/* Avatar Menu */}
            <AvatarMenu
              user={{
                id: user?.id,
                name: userData?.name || user?.name || "User",
                email: userData?.email || user?.email || "",
                image: userData?.avatar_url || userProfile?.avatar_url || user?.image,
                profileCompleted: userProfile?.profile_completed,
                authProvider: userData?.auth_provider,
              }}
              onChangePassword={() => setShowChangePassword(true)}
              onUploadCV={() => setShowUploadCV(true)}
              onLogout={() => setShowLogoutModal(true)}
            />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 z-40 flex flex-col border-r border-border bg-card/95 backdrop-blur-sm transition-all duration-200 ${
          sidebarCollapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Collapse Toggle */}
        <button
          onClick={handleToggleSidebar}
          className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-sm text-muted-foreground hover:text-foreground cursor-pointer transition-all"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <NavItemComponent
                key={item.href}
                item={item}
                isActive={activePath === item.href}
                collapsed={sidebarCollapsed}
                onClick={handleNavClick}
              />
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <div className="border-t border-border/40 p-4">
            <p className="text-[10px] font-medium text-center text-muted-foreground/40 uppercase tracking-wider">
              JobReady AI v1.0
            </p>
          </div>
        )}
      </aside>

      {/* Modals */}
      {showChangePassword && (
        <ChangePasswordModal
          isOpen={showChangePassword}
          onClose={() => setShowChangePassword(false)}
          onSendOTP={handleSendOTP}
          userEmail={user?.email}
        />
      )}

      {showUploadCV && (
        <UploadCVModal
          isOpen={showUploadCV}
          onClose={() => setShowUploadCV(false)}
          onUpload={handleUploadCV}
          existingCVs={userCVs}
          onDelete={handleDeleteCV}
        />
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slide-in-up">
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 border border-destructive/20">
                  <span className="text-lg">⚠️</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold">Đăng xuất</h2>
                  <p className="text-xs text-muted-foreground">Xác nhận thao tác</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm leading-relaxed">
                Bạn có chắc chắn muốn <span className="font-semibold">đăng xuất</span> khỏi tài khoản không?
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border/50">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-5 py-2 rounded-lg text-sm font-medium bg-destructive hover:bg-destructive/90 text-white transition-colors cursor-pointer"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
