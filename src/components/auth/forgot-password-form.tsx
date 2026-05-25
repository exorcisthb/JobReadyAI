import { useMemo, useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import {
  checkEmailExists,
  requestPasswordResetOTP,
  resetPassword,
  verifyOTP,
} from "@/lib/api";

type Step = "email" | "otp" | "password" | "success";

type FormMessage = {
  text: string;
  type: "success" | "error";
};

const messageClassName = {
  success:
    "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800",
  error:
    "rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800",
};

const visibleSteps: Array<{ id: Exclude<Step, "success">; label: string }> = [
  { id: "email", label: "Gmail" },
  { id: "otp", label: "Xác minh" },
  { id: "password", label: "Mật khẩu" },
];

export function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<FormMessage | null>(null);

  const normalizedEmail = email.trim().toLowerCase();
  const currentStepIndex = Math.max(
    visibleSteps.findIndex((item) => item.id === step),
    step === "success" ? visibleSteps.length : 0,
  );

  const passwordRules = useMemo(
    () => [
      { id: "len", label: "Ít nhất 8 ký tự", ok: password.length >= 8 },
      { id: "upper", label: "1 chữ hoa (A-Z)", ok: /[A-Z]/.test(password) },
      { id: "num", label: "1 chữ số (0-9)", ok: /[0-9]/.test(password) },
      { id: "spec", label: "1 ký tự đặc biệt", ok: /[^A-Za-z0-9]/.test(password) },
    ],
    [password],
  );
  const passwordScore = passwordRules.filter((rule) => rule.ok).length;
  const passwordReady = passwordRules.every((rule) => rule.ok);
  const confirmMatches = confirmPassword.length > 0 && confirmPassword === password;
  const canReset = passwordReady && confirmMatches;
  const strengthPercent = ["0%", "30%", "55%", "80%", "100%"][passwordScore];
  const strengthClassName = [
    "bg-rose-500",
    "bg-amber-400",
    "bg-amber-400",
    "bg-primary",
    "bg-emerald-500",
  ][passwordScore];

  async function sendResetOTP(emailAddress: string) {
    await requestPasswordResetOTP(emailAddress);
    setOtp("");
    setStep("otp");
    setMessage({
      text: `Đã tìm thấy tài khoản ${emailAddress}. OTP đã được gửi tới Gmail của bạn.`,
      type: "success",
    });
  }

  async function handleCheckEmail(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await checkEmailExists(normalizedEmail);

      if (!result.exists) {
        setMessage({
          text: "Không tìm thấy tài khoản với Gmail này.",
          type: "error",
        });
        return;
      }

      await sendResetOTP(normalizedEmail);
    } catch (error) {
      setMessage({
        text:
          "Không thể kiểm tra tài khoản. " +
          (error instanceof Error ? error.message : "Vui lòng thử lại sau."),
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyOTP(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (!/^\d{6}$/.test(otp.trim())) {
        setMessage({ text: "Mã OTP phải gồm 6 chữ số.", type: "error" });
        return;
      }

      await verifyOTP(normalizedEmail, otp.trim());
      setStep("password");
      setMessage({
        text: "Xác minh thành công. Vui lòng tạo mật khẩu mới.",
        type: "success",
      });
    } catch (error) {
      setMessage({
        text:
          "Xác minh OTP thất bại. " +
          (error instanceof Error ? error.message : "Vui lòng thử lại sau."),
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendOTP() {
    setIsLoading(true);
    setMessage(null);

    try {
      await sendResetOTP(normalizedEmail);
    } catch (error) {
      setMessage({
        text:
          "Không thể gửi lại OTP. " +
          (error instanceof Error ? error.message : "Vui lòng thử lại sau."),
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResetPassword(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (!canReset) {
        setMessage({
          text: "Mật khẩu mới chưa đạt yêu cầu hoặc xác nhận chưa khớp.",
          type: "error",
        });
        return;
      }

      await resetPassword(normalizedEmail, password);
      setStep("success");
      window.setTimeout(() => {
        window.location.assign("/authentication/login");
      }, 1800);
    } catch (error) {
      setMessage({
        text:
          "Đổi mật khẩu thất bại. " +
          (error instanceof Error ? error.message : "Vui lòng thử lại sau."),
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function goBack() {
    setMessage(null);

    if (step === "otp") {
      setStep("email");
      setOtp("");
    }

    if (step === "password") {
      setStep("otp");
      setPassword("");
      setConfirmPassword("");
    }
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-elegant)] sm:p-8">
      <StepIndicator currentStepIndex={currentStepIndex} />

      <a
        href="/authentication/login"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại đăng nhập
      </a>

      {step === "email" && (
        <form onSubmit={handleCheckEmail} className="space-y-5">
          <StepHeading
            icon={<Mail className="h-5 w-5" />}
            title="Nhập Gmail"
            description="Nhập địa chỉ Gmail đã đăng ký tài khoản để tiếp tục."
          />

          <label className="block">
            <span className="text-sm font-semibold text-foreground">Địa chỉ Gmail *</span>
            <span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="example@gmail.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                disabled={isLoading}
              />
            </span>
          </label>

          {message && <div className={messageClassName[message.type]}>{message.text}</div>}

          <PrimaryButton disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Kiểm tra tài khoản
            {!isLoading ? <ArrowRight className="h-4 w-4" /> : null}
          </PrimaryButton>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerifyOTP} className="space-y-5">
          <StepHeading
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Xác minh OTP"
            description={`Nhập mã OTP 6 chữ số đã gửi tới ${normalizedEmail}.`}
          />

          <div className="block">
            <span className="text-sm font-semibold text-foreground">Mã OTP *</span>
            <div className="mt-2">
              <OtpInput
                value={otp}
                onChange={setOtp}
                disabled={isLoading}
              />
            </div>
          </div>

          {message && <div className={messageClassName[message.type]}>{message.text}</div>}

          <div className="grid gap-3 sm:grid-cols-[0.8fr_1.2fr]">
            <SecondaryButton type="button" onClick={goBack} disabled={isLoading}>
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </SecondaryButton>
            <PrimaryButton disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Xác minh
              {!isLoading ? <ArrowRight className="h-4 w-4" /> : null}
            </PrimaryButton>
          </div>

          <button
            type="button"
            onClick={handleResendOTP}
            disabled={isLoading}
            className="w-full text-center text-sm font-semibold text-primary transition hover:underline disabled:cursor-not-allowed disabled:opacity-60"
          >
            Gửi lại OTP
          </button>
        </form>
      )}

      {step === "password" && (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <StepHeading
            icon={<Lock className="h-5 w-5" />}
            title="Tạo mật khẩu mới"
            description="Mật khẩu cần đủ mạnh để bảo vệ tài khoản của bạn."
          />

          <PasswordField
            label="Mật khẩu mới *"
            value={password}
            showPassword={showPassword}
            onChange={setPassword}
            onToggle={() => setShowPassword((value) => !value)}
            invalid={password.length > 0 && !passwordReady}
            valid={passwordReady}
            autoFocus
          />

          <div className="h-1 overflow-hidden rounded-full bg-border">
            <div
              className={`h-full rounded-full transition-all duration-300 ${strengthClassName}`}
              style={{ width: strengthPercent }}
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {passwordRules.map((rule) => (
              <div
                key={rule.id}
                className={`flex items-center gap-2 text-xs font-medium transition ${
                  rule.ok ? "text-emerald-600" : "text-muted-foreground"
                }`}
              >
                {rule.ok ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="h-4 w-4 text-center">○</span>
                )}
                {rule.label}
              </div>
            ))}
          </div>

          <PasswordField
            label="Xác nhận mật khẩu mới *"
            value={confirmPassword}
            showPassword={showConfirmPassword}
            onChange={setConfirmPassword}
            onToggle={() => setShowConfirmPassword((value) => !value)}
            invalid={confirmPassword.length > 0 && !confirmMatches}
            valid={confirmMatches}
          />

          <p
            className={`min-h-5 text-xs font-medium ${
              confirmPassword.length === 0
                ? "text-transparent"
                : confirmMatches
                  ? "text-emerald-600"
                  : "text-rose-600"
            }`}
          >
            {confirmMatches ? "Mật khẩu khớp" : "Mật khẩu chưa khớp"}
          </p>

          {message && <div className={messageClassName[message.type]}>{message.text}</div>}

          <div className="grid gap-3 sm:grid-cols-[0.8fr_1.2fr]">
            <SecondaryButton type="button" onClick={goBack} disabled={isLoading}>
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </SecondaryButton>
            <PrimaryButton disabled={isLoading || !canReset}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Cập nhật mật khẩu
            </PrimaryButton>
          </div>
        </form>
      )}

      {step === "success" && (
        <div className="space-y-6 py-8 text-center">
          <div className="mx-auto flex h-16 w-16 animate-success-pulse items-center justify-center rounded-full bg-primary text-primary-foreground">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Đổi mật khẩu thành công</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Bạn sẽ được chuyển về trang đăng nhập để sử dụng mật khẩu mới.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function StepIndicator({ currentStepIndex }: { currentStepIndex: number }) {
  return (
    <div className="mb-8 flex items-center">
      {visibleSteps.map((item, index) => {
        const isActive = index <= currentStepIndex;

        return (
          <div key={item.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "border border-input bg-background text-muted-foreground"
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`hidden text-xs font-bold sm:inline ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </div>
            {index < visibleSteps.length - 1 && (
              <span
                className={`mx-3 h-px flex-1 transition ${
                  index < currentStepIndex ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepHeading({
  description,
  icon,
  title,
}: {
  description: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div>
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-secondary text-primary">
        {icon}
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

function PasswordField({
  autoFocus = false,
  invalid,
  label,
  onChange,
  onToggle,
  showPassword,
  valid,
  value,
}: {
  autoFocus?: boolean;
  invalid: boolean;
  label: string;
  onChange: (value: string) => void;
  onToggle: () => void;
  showPassword: boolean;
  valid: boolean;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <span
        className={`mt-2 flex h-12 items-center gap-3 rounded-xl border bg-background px-3 transition focus-within:ring-2 ${
          valid
            ? "border-emerald-400 focus-within:ring-emerald-100"
            : invalid
              ? "border-rose-400 focus-within:ring-rose-100"
              : "border-input focus-within:ring-ring"
        }`}
      >
        <Lock className="h-4 w-4 text-muted-foreground" />
        <input
          type={showPassword ? "text" : "password"}
          required
          minLength={8}
          placeholder="Tối thiểu 8 ký tự"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          autoFocus={autoFocus}
        />
        <button
          type="button"
          onClick={onToggle}
          className="text-muted-foreground transition hover:text-foreground"
          aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </span>
    </label>
  );
}

function PrimaryButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
      style={{ background: "var(--gradient-hero)" }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  disabled,
  onClick,
  type,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  type: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-bold text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

function OtpInput({ value, onChange, disabled }: OtpInputProps) {
  const inputsRef = useRef<HTMLInputElement[]>([]);

  // Split string into array of 6 elements
  const values = value.padEnd(6, " ").slice(0, 6).split("");

  // Keep first input focused on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, "");
    if (!cleanVal) {
      const newValues = [...values];
      newValues[index] = "";
      onChange(newValues.join("").trim());
      return;
    }

    const char = cleanVal.slice(-1);
    const newValues = [...values];
    newValues[index] = char;
    const nextValue = newValues.join("").trim();
    onChange(nextValue);

    if (index < 5 && char) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
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

  return (
    <div className="flex justify-between gap-2 sm:gap-3 py-2">
      {Array.from({ length: 6 }).map((_, index) => {
        const val = values[index] === " " ? "" : values[index];
        return (
          <input
            key={index}
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
            className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-xl border border-input bg-background focus:border-primary focus:ring-2 focus:ring-ring outline-none transition-all duration-200 shadow-sm"
          />
        );
      })}
    </div>
  );
}
