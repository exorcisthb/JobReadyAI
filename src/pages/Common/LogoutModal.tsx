import { useState } from "react";
import { LogOut, AlertTriangle, X } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogout = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("jobready_demo_session") || "{}");
      
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userData.id || "",
          "x-user-role": userData.role || "",
        },
        body: JSON.stringify({}),
      });
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md mx-4 animate-slide-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Đăng xuất</h2>
              <p className="text-xs text-slate-400">Xác nhận thao tác</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-300 text-sm leading-relaxed">
            Bạn có chắc chắn muốn <span className="font-semibold text-slate-100">đăng xuất</span> khỏi tài khoản không?
          </p>
          <p className="text-slate-500 text-xs mt-2">
            Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng dịch vụ.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700/50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang đăng xuất...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
