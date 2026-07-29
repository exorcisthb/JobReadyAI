import { useState, memo, useCallback, useEffect, useRef } from "react";
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-muted-foreground">
                Mã xác minh OTP <span className="text-red-500">*</span>
              </label>
              {!otpVerified && (
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={sendingOTP || countdown > 0}
                  className="h-8 px-3 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                >
                  {sendingOTP ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : countdown > 0 ? (
                    `Gửi lại (${countdown}s)`
                  ) : (
                    "Gửi mã"
                  )}
                </button>
              )}
            </div>
            <OtpBoxInput
              value={formData.otp}
              onChange={(val) => setFormData({ ...formData, otp: val })}
              disabled={otpVerified}
            />
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

type OtpBoxInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

function OtpBoxInput({ value, onChange, disabled }: OtpBoxInputProps) {
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const rowRef = useRef<HTMLDivElement>(null);
  const [boxStates, setBoxStates] = useState<Array<"idle" | "success" | "error">>(
    Array(6).fill("idle"),
  );
  const [rippleActive, setRippleActive] = useState(false);
  const [rippleError, setRippleError] = useState(false);
  const [glowActive, setGlowActive] = useState(false);
  const [glowError, setGlowError] = useState(false);

  const values = value.padEnd(6, " ").slice(0, 6).split("");

  const fireRipple = (isError: boolean) => {
    setRippleError(isError);
    setRippleActive(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setRippleActive(true));
    });
    setTimeout(() => setRippleActive(false), 1900);
  };

  const handleChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, "");
    setBoxStates((prev) => {
      const next = [...prev];
      next[index] = "idle";
      return next;
    });
    setGlowActive(false);
    setGlowError(false);

    if (!cleanVal) {
      const newValues = [...values];
      newValues[index] = "";
      onChange(newValues.join("").trim());
      return;
    }

    const char = cleanVal.slice(-1);
    const newValues = [...values];
    newValues[index] = char;
    onChange(newValues.join("").trim());

    if (index < 5 && char) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      setBoxStates((prev) => {
        const next = [...prev];
        next[index] = "idle";
        return next;
      });
      setGlowActive(false);
      setGlowError(false);

      if (!values[index] || values[index] === " ") {
        if (index > 0) {
          const newValues = [...values];
          newValues[index - 1] = "";
          onChange(newValues.join("").trim());
          inputsRef.current[index - 1]?.focus();
        }
      } else {
        const newValues = [...values];
        newValues[index] = "";
        onChange(newValues.join("").trim());
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData) {
      onChange(pastedData);
      const focusIndex = Math.min(pastedData.length, 5);
      inputsRef.current[focusIndex]?.focus();
    }
  };

  // Listen for custom validation events dispatched by parent
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ success: boolean }>;
      const isSuccess = ce.detail.success;
      if (isSuccess) {
        setGlowError(false);
        setGlowActive(true);
        fireRipple(false);
        setBoxStates(Array(6).fill("idle"));
        Array.from({ length: 6 }).forEach((_, i) => {
          setTimeout(() => {
            setBoxStates((prev) => {
              const next = [...prev];
              next[i] = "success";
              return next;
            });
          }, i * 90);
        });
      } else {
        setGlowActive(false);
        setGlowError(true);
        fireRipple(true);
        setBoxStates(Array(6).fill("error"));
        el.classList.add("otp-shake");
        setTimeout(() => el.classList.remove("otp-shake"), 350);
      }
    };
    el.addEventListener("otp-validate", handler);
    return () => el.removeEventListener("otp-validate", handler);
  }, []);

  const rippleBase =
    "absolute top-0 left-0 w-[90px] h-[90px] -ml-[45px] -mt-[45px] rounded-full opacity-0 pointer-events-none border-[1.5px]";

  return (
    <div className="relative flex flex-col items-center">
      {/* Glow backdrop */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[120%] rounded-full pointer-events-none transition-opacity duration-700"
        style={{
          opacity: glowActive || glowError ? 1 : 0,
          background: glowError
            ? "radial-gradient(circle, color-mix(in oklch, var(--error) 16%, transparent), transparent 65%)"
            : "radial-gradient(circle, color-mix(in oklch, var(--primary) 16%, transparent), transparent 65%)",
          filter: "blur(10px)",
        }}
      />
      {/* Ripple rings */}
      <div className="absolute top-1/2 left-1/2 w-0 h-0 pointer-events-none">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={rippleBase}
            style={{
              borderColor: rippleError ? "var(--error)" : "var(--primary)",
              animation: rippleActive
                ? `otpRippleOut 1.8s ease-out ${i * 0.35}s both`
                : "none",
            }}
          />
        ))}
      </div>

      {/* OTP boxes row */}
      <div ref={rowRef} className="otp-boxes-row relative z-10 flex gap-1.5 sm:gap-2 py-2">
        {Array.from({ length: 6 }).map((_, index) => {
          const val = values[index] === " " ? "" : values[index];
          const state = boxStates[index];
          const isFilled = state === "success";
          return (
            <div
              key={index}
              className="relative flex items-center justify-center"
              style={{
                width: "clamp(36px, 9vw, 48px)",
                height: "clamp(42px, 11vw, 56px)",
                borderRadius: "12px",
                border: `1.5px solid ${
                  state === "success"
                    ? "var(--success)"
                    : state === "error"
                      ? "var(--error)"
                      : "var(--border)"
                }`,
                background:
                  state === "success"
                    ? "color-mix(in oklch, var(--success) 10%, var(--background))"
                    : state === "error"
                      ? "color-mix(in oklch, var(--error) 8%, var(--background))"
                      : "var(--background)",
                boxShadow:
                  state === "success"
                    ? "0 0 0 1px color-mix(in oklch, var(--success) 35%, transparent)"
                    : "none",
                transition: "border-color 0.55s ease, background 0.6s ease",
              }}
            >
              <input
                ref={(el) => {
                  if (el) inputsRef.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={val}
                disabled={disabled}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                onFocus={(e) => e.target.select()}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  textAlign: "center",
                  fontSize: "clamp(16px, 3.5vw, 22px)",
                  fontWeight: 700,
                  color: state === "error" ? "var(--error)" : "var(--foreground)",
                  opacity: isFilled ? 0 : 1,
                  transition: "opacity 0.3s ease",
                  cursor: disabled ? "not-allowed" : "text",
                }}
              />
              {/* Checkmark SVG - shown on success */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  width: 18,
                  height: 18,
                  stroke: "var(--success)",
                  opacity: isFilled ? 1 : 0,
                  transform: isFilled ? "scale(1)" : "scale(0.6)",
                  transition: "opacity 0.45s ease, transform 0.45s cubic-bezier(.34,1.56,.64,1)",
                  pointerEvents: "none",
                }}
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes otpRippleOut {
          0% { transform: scale(0.4); opacity: 0.8; }
          100% { transform: scale(3.6); opacity: 0; }
        }
        .otp-shake {
          animation: otpShake 0.32s ease;
        }
        @keyframes otpShake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}

export default memo(ChangePasswordModal);
