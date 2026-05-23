import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { checkEmailExists, resetPassword } from "@/lib/api";

type Step = "email" | "password" | "success";

type FormMessage = {
  text: string;
  type: "success" | "error";
};

const messageClassName = {
  success:
    "rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-cyan-50 px-4 py-3 text-sm font-medium text-emerald-800",
  error:
    "rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50 to-orange-50 px-4 py-3 text-sm font-medium text-rose-800",
};

export function ForgotPasswordForm() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<FormMessage | null>(null);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  async function handleCheckEmail(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const result = await checkEmailExists(normalizedEmail);

      if (!result.exists) {
        setMessage({
          text: "Kiểm tra thất bại. Email không tồn tại trong hệ thống.",
          type: "error",
        });
        return;
      }

      setDirection("forward");
      setStep("password");
    } catch (error) {
      setMessage({
        text:
          "Kiểm tra thất bại. " +
          (error instanceof Error ? error.message : "Không thể kết nối máy chủ."),
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
      if (password !== confirmPassword) {
        setMessage({
          text: "Đặt lại mật khẩu thất bại. Mật khẩu xác minh không khớp.",
          type: "error",
        });
        return;
      }

      await resetPassword(email, password);

      setDirection("forward");
      setStep("success");

      window.setTimeout(() => {
        window.location.assign("/authentication/login");
      }, 2200);
    } catch (error) {
      setMessage({
        text:
          "Đặt lại mật khẩu thất bại. " +
          (error instanceof Error ? error.message : "Không thể kết nối máy chủ."),
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleBack() {
    setDirection("backward");
    setStep("email");
    setPassword("");
    setConfirmPassword("");
    setMessage(null);
  }

  const steps: Step[] = ["email", "password", "success"];
  const currentStepIndex = steps.indexOf(step);

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-elegant)] sm:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Đặt lại mật khẩu</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {step === "email" && "Nhập email tài khoản để kiểm tra thông tin đăng nhập."}
          {step === "password" && "Tạo mật khẩu mới cho tài khoản email của bạn."}
          {step === "success" && "Mật khẩu đã được đặt lại thành công."}
        </p>
      </div>

      <div className="mb-8 flex items-center justify-between">
        {steps.map((item, idx) => (
          <div key={item} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all duration-300 ${
                idx <= currentStepIndex
                  ? "bg-primary text-primary-foreground"
                  : "border-2 border-border bg-background text-muted-foreground"
              }`}
            >
              {idx + 1}
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`mx-2 h-1 w-12 transition-all duration-300 ${
                  idx < currentStepIndex ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden">
        <div
          className={`transition-all duration-500 ease-out ${
            step === "email"
              ? "relative opacity-100"
              : direction === "forward"
                ? "pointer-events-none absolute -right-full opacity-0"
                : "pointer-events-none absolute -left-full opacity-0"
          }`}
        >
          <form onSubmit={handleCheckEmail} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-foreground">Email</span>
              <span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="demo@jobredy.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  disabled={isLoading}
                />
              </span>
            </label>

            {message && <div className={messageClassName[message.type]}>{message.text}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              style={{ background: "var(--gradient-hero)" }}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Tiếp tục
              {!isLoading ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </form>
        </div>

        <div
          className={`transition-all duration-500 ease-out ${
            step === "password"
              ? "relative opacity-100"
              : direction === "forward"
                ? "pointer-events-none absolute -right-full opacity-0"
                : "pointer-events-none absolute -left-full opacity-0"
          }`}
        >
          <form onSubmit={handleResetPassword} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-foreground">Mật khẩu mới</span>
              <span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="Tối thiểu 8 ký tự"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="text-muted-foreground transition hover:text-foreground"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-foreground">Xác minh mật khẩu</span>
              <span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="text-muted-foreground transition hover:text-foreground"
                  aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </span>
            </label>

            {message && <div className={messageClassName[message.type]}>{message.text}</div>}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleBack}
                disabled={isLoading}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                style={{ background: "var(--gradient-hero)" }}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Đặt lại
                {!isLoading ? <ArrowRight className="h-4 w-4" /> : null}
              </button>
            </div>
          </form>
        </div>

        <div
          className={`transition-all duration-500 ease-out ${
            step === "success"
              ? "relative opacity-100"
              : direction === "forward"
                ? "pointer-events-none absolute -right-full opacity-0"
                : "pointer-events-none absolute -left-full opacity-0"
          }`}
        >
          <div className="space-y-6 py-8 text-center">
            <div className="flex justify-center">
              <div className="inline-flex h-16 w-16 animate-success-pulse items-center justify-center rounded-full bg-primary">
                <Check className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground">Thành công!</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Mật khẩu của bạn đã được đặt lại. Vui lòng đăng nhập bằng mật khẩu mới.
              </p>
            </div>

            <a
              href="/authentication/login"
              className="inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              style={{ background: "var(--gradient-hero)" }}
            >
              Quay về trang đăng nhập
            </a>
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Nhớ mật khẩu rồi?{" "}
        <a href="/authentication/login" className="font-semibold text-primary hover:underline">
          Quay lại đăng nhập
        </a>
      </p>
    </div>
  );
}
