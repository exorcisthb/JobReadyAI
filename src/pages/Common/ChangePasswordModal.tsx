import { useState, memo, useCallback, useEffect } from "react";
import { X, Lock, Eye, EyeOff, Save, Loader2, AlertCircle, ShieldCheck, Mail } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSendOTP: () => Promise<void>;
  userEmail?: string;
}

function ChangePasswordModal({
  isOpen,
  onClose,
  onSuccess,
  onSendOTP,
  userEmail,
}: ChangePasswordModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({ otp: "", newPassword: "", confirmPassword: "" });
      setOtpSent(false);
      setOtpVerified(false);
      setCountdown(0);
      setError("");
      setSuccess("");
    }
  }, [isOpen]);

  const handleSendOTP = useCallback(async () => {
    setSendingOTP(true);
    setError("");
    try {
      await onSendOTP();
      setOtpSent(true);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gửi OTP thất bại");
    } finally {
      setSendingOTP(false);
    }
  }, [onSendOTP]);

  const handleVerifyOTP = useCallback(async () => {
    if (formData.otp.length !== 6) {
      setError("Mã OTP phải có 6 chữ số");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/change-password/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id || "",
        },
        body: JSON.stringify({
          otp: formData.otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Mã OTP không hợp lệ");
        return;
      }

      setOtpVerified(true);
      setSuccess("Xác minh OTP thành công! Vui lòng nhập mật khẩu mới.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xác minh OTP thất bại");
    } finally {
      setLoading(false);
    }
  }, [formData.otp, user?.id]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setSuccess("");

      // Validate new password
      if (formData.newPassword.length < 6) {
        setError("Mật khẩu mới phải có ít nhất 6 ký tự");
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError("Mật khẩu mới không khớp");
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
            otp: formData.otp,
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
    [formData, onClose, onSuccess, user?.id],
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

      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Đổi mật khẩu</h2>
              <p className="text-xs text-muted-foreground">Cập nhật mật khẩu của bạn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              {success}
            </div>
          )}

          {/* Email Display */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20">
            <Mail className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm text-foreground">{userEmail || "email@example.com"}</span>
          </div>

          {/* OTP Section - Always visible */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Mã xác minh OTP <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.otp}
                  onChange={(e) =>
                    setFormData({ ...formData, otp: e.target.value.replace(/\D/g, "").slice(0, 6) })
                  }
                  className="w-full h-10 pl-10 pr-3 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  placeholder="Nhập mã OTP"
                  maxLength={6}
                  required
                  disabled={otpVerified}
                />
              </div>
              {!otpVerified && (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={sendingOTP || countdown > 0}
                  className="h-10 px-4 rounded-xl text-sm font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
                >
                  {sendingOTP ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : countdown > 0 ? (
                    `${countdown}s`
                  ) : (
                    "Gửi mã"
                  )}
                </button>
              )}
            </div>
            {!otpSent && (
              <p className="text-xs text-muted-foreground mt-1">
                Nhấn "Gửi mã" để nhận mã OTP qua email
              </p>
            )}
            {otpSent && !otpVerified && countdown > 0 && (
              <p className="text-xs text-green-600 mt-1">
                Mã OTP đã được gửi. Vui lòng kiểm tra email.
              </p>
            )}
          </div>

          {/* Verify OTP Button - Only if OTP not verified */}
          {!otpVerified && (
            <button
              type="button"
              onClick={handleVerifyOTP}
              disabled={loading || formData.otp.length !== 6}
              className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xác minh...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Xác minh OTP
                </>
              )}
            </button>
          )}

          {/* Password Fields - Only show after OTP verified */}
          {otpVerified && (
            <div className="space-y-4 pt-2 border-t border-border animate-slide-in-up">
              <h3 className="text-sm font-semibold text-foreground">Nhập mật khẩu mới</h3>

              {/* New Password */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showNew ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full h-10 pl-10 pr-10 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                    required
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

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full h-10 pl-10 pr-10 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
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
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Mật khẩu không khớp
                    </p>
                  )}
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
                          : "text-green-500"
                    }`}
                  >
                    {passwordStrength}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer"
          >
            Hủy bỏ
          </button>
          {otpVerified && (
            <button
              onClick={handleSubmit}
              disabled={
                loading ||
                formData.newPassword !== formData.confirmPassword ||
                formData.newPassword.length < 6
              }
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground transition-colors disabled:opacity-50 cursor-pointer"
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
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {success && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-xl text-sm font-medium shadow-lg animate-in slide-in-from-bottom-4 duration-300 bg-green-50 border border-green-200 text-green-700">
          {success}
        </div>
      )}
    </div>
  );
}

export default memo(ChangePasswordModal);
