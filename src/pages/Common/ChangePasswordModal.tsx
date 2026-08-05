import { useState, memo, useCallback, useEffect } from "react";
import { X, Lock, Eye, EyeOff, Save, Loader2, AlertCircle, ShieldCheck, Mail, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userEmail?: string;
}

function ChangePasswordModal({
  isOpen,
  onClose,
  onSuccess,
  userEmail,
}: ChangePasswordModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [verifyingOld, setVerifyingOld] = useState(false);
  const [isOldVerified, setIsOldVerified] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setIsOldVerified(false);
      setVerifyingOld(false);
      setError("");
      setSuccess("");
      setShowOld(false);
      setShowNew(false);
      setShowConfirm(false);
    }
  }, [isOpen]);

  // Handle Verify Old Password
  const handleVerifyOldPassword = useCallback(async () => {
    if (!formData.oldPassword) {
      setError("Vui lòng nhập mật khẩu hiện tại");
      return;
    }

    setVerifyingOld(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/change-password/verify-old", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "",
        },
        body: JSON.stringify({
          old_password: formData.oldPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Mật khẩu hiện tại không đúng");
      }

      setIsOldVerified(true);
      setSuccess("Xác minh mật khẩu thành công! Vui lòng nhập mật khẩu mới bên dưới.");
    } catch (err) {
      setIsOldVerified(false);
      setError(err instanceof Error ? err.message : "Mật khẩu hiện tại không đúng");
    } finally {
      setVerifyingOld(false);
    }
  }, [formData.oldPassword, user?.id]);

  // Handle Submit New Password
  const handleSubmitNewPassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isOldVerified) return;

      setError("");
      setSuccess("");

      if (formData.newPassword.length < 6) {
        setError("Mật khẩu mới phải có ít nhất 6 ký tự");
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError("Xác nhận mật khẩu mới không khớp");
        return;
      }

      if (formData.oldPassword === formData.newPassword) {
        setError("Mật khẩu mới phải khác mật khẩu hiện tại");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("/api/auth/change-password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user?.id || "",
          },
          body: JSON.stringify({
            old_password: formData.oldPassword,
            new_password: formData.newPassword,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Đổi mật khẩu thất bại");
        }

        setSuccess(data.message || "Đổi mật khẩu thành công!");
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đổi mật khẩu thất bại");
      } finally {
        setLoading(false);
      }
    },
    [formData, isOldVerified, onClose, onSuccess, user?.id],
  );

  if (!isOpen) return null;

  const passwordStrength =
    formData.newPassword.length < 6
      ? "Yếu"
      : formData.newPassword.length < 10
        ? "Trung bình"
        : "Mạnh";
  const strengthColor =
    formData.newPassword.length < 6
      ? "bg-red-500"
      : formData.newPassword.length < 10
        ? "bg-amber-500"
        : "bg-emerald-500";
  const strengthWidth =
    formData.newPassword.length < 6
      ? "w-1/4"
      : formData.newPassword.length < 10
        ? "w-2/4"
        : "w-full";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Đổi mật khẩu</h2>
              <p className="text-xs text-muted-foreground">Cập nhật mật khẩu bảo vệ tài khoản</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Email Display */}
          {userEmail && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm text-foreground font-medium">{userEmail}</span>
            </div>
          )}

          {/* STEP 1: Old Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-foreground">
                Mật khẩu hiện tại <span className="text-red-500">*</span>
              </label>
              {isOldVerified && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Đã xác thực
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type={showOld ? "text" : "password"}
                value={formData.oldPassword}
                disabled={isOldVerified || verifyingOld}
                onChange={(e) => {
                  setFormData({ ...formData, oldPassword: e.target.value });
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isOldVerified) {
                    e.preventDefault();
                    void handleVerifyOldPassword();
                  }
                }}
                className={`w-full h-11 pl-10 pr-10 rounded-xl border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring transition-colors ${
                  isOldVerified
                    ? "border-emerald-500 bg-emerald-500/5 cursor-not-allowed text-emerald-600 dark:text-emerald-400 font-medium"
                    : "border-input"
                }`}
                placeholder="Nhập mật khẩu hiện tại"
                required
              />
              {!isOldVerified && (
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              )}
            </div>
          </div>

          {/* Verify Button for Step 1 */}
          {!isOldVerified && (
            <button
              type="button"
              onClick={handleVerifyOldPassword}
              disabled={verifyingOld || !formData.oldPassword}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors disabled:opacity-50 cursor-pointer"
            >
              {verifyingOld ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang kiểm tra...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Xác minh mật khẩu
                </>
              )}
            </button>
          )}

          {/* STEP 2: New Password Fields - Revealed ONLY when isOldVerified is true */}
          {isOldVerified && (
            <form onSubmit={handleSubmitNewPassword} className="space-y-4 pt-2 border-t border-border animate-slide-in-up">
              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showNew ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full h-11 pl-10 pr-10 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring"
                    placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Password strength indicator */}
              {formData.newPassword && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full transition-all ${strengthColor} ${strengthWidth}`} />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      formData.newPassword.length < 6
                        ? "text-red-500"
                        : formData.newPassword.length < 10
                          ? "text-amber-500"
                          : "text-emerald-500"
                    }`}
                  >
                    {passwordStrength}
                  </span>
                </div>
              )}

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full h-11 pl-10 pr-10 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring"
                    placeholder="Nhập lại mật khẩu mới"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.newPassword &&
                  formData.confirmPassword &&
                  formData.newPassword !== formData.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Mật khẩu xác nhận không khớp
                    </p>
                  )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.newPassword ||
                    formData.newPassword !== formData.confirmPassword ||
                    formData.newPassword.length < 6
                  }
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Cập nhật mật khẩu
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Cancel button if step 1 is active */}
          {!isOldVerified && (
            <div className="flex justify-start pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(ChangePasswordModal);
