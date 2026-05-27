import { useEffect, useRef, useState, memo, useCallback } from "react";
import { User, Lock, FileText, LogOut, Settings } from "lucide-react";

interface AvatarMenuProps {
  user: {
    id?: string;
    name: string;
    email: string;
    image?: string;
    profileCompleted?: boolean;
    authProvider?: string;
  };
  onChangePassword: () => void;
  onUploadCV: () => void;
  onLogout: () => void;
}

function AvatarMenu({ user, onChangePassword, onUploadCV, onLogout }: AvatarMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const initials = (user?.name || "U").charAt(0).toUpperCase();

  const MenuButton = ({
    icon,
    label,
    onClick,
    variant = "default",
  }: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    variant?: "default" | "danger";
  }) => (
    <button
      onClick={() => {
        setIsOpen(false);
        onClick();
      }}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
        variant === "danger"
          ? "text-destructive hover:bg-destructive/10"
          : "text-foreground hover:bg-muted"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button - Click to open menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full transition-all cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative group">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-border"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-mint text-sm font-bold text-primary-foreground ring-2 ring-border">
              {initials}
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Settings className="h-4 w-4 text-white" />
          </div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-popover shadow-xl overflow-hidden animate-slide-in-up z-50">
          {/* Header with avatar */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="relative">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-mint text-lg font-bold text-primary-foreground">
                    {initials}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{user.name || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <MenuButton
              icon={<User className="h-4 w-4" />}
              label="Xem trang cá nhân"
              onClick={() => {
                window.location.href = "/profile";
              }}
            />
            {user.authProvider !== "google" && (
              <MenuButton
                icon={<Lock className="h-4 w-4" />}
                label="Đổi mật khẩu"
                onClick={onChangePassword}
              />
            )}
            <MenuButton
              icon={<FileText className="h-4 w-4" />}
              label="Tải lên CV"
              onClick={onUploadCV}
              variant="default"
            />
          </div>

          {/* Footer - Logout */}
          <div className="border-t border-border p-2">
            <MenuButton
              icon={<LogOut className="h-4 w-4" />}
              label="Đăng xuất"
              onClick={onLogout}
              variant="danger"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(AvatarMenu);
