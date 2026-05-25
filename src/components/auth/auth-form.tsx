import { useEffect, useState, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import {
  completeRegistration,
  loginWithOAuth,
  loginWithEmail,
  registerWithEmail,
  verifyOTP,
} from "@/lib/api";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
};

type AuthMessage = {
  text: string;
  type: "success" | "error";
};

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GooglePopupError = {
  message?: string;
  type?: "popup_failed_to_open" | "popup_closed" | "unknown";
};

type GoogleProfile = {
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
};

type FacebookLoginResponse = {
  authResponse?: unknown;
  status?: string;
};

type FacebookProfile = {
  email?: string;
  id?: string;
  name?: string;
  picture?: {
    data?: {
      url?: string;
    };
  };
};

declare global {
  interface Window {
    FB?: {
      api: (
        path: string,
        params: { fields: string },
        callback: (profile: FacebookProfile) => void,
      ) => void;
      init: (options: { appId: string; cookie: boolean; version: string; xfbml: boolean }) => void;
      login: (
        callback: (response: FacebookLoginResponse) => void,
        options: { scope: string },
      ) => void;
    };
    fbAsyncInit?: () => void;
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (options: {
            callback: (response: GoogleTokenResponse) => void;
            client_id: string;
            error_callback?: (error: GooglePopupError) => void;
            scope: string;
          }) => {
            requestAccessToken: (options?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID as string | undefined;

const messageClassName = {
  success: "message-success",
  error: "message-error",
};

export function AuthForm({ mode }: AuthFormProps) {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<"google" | "facebook" | null>(null);
  const [message, setMessage] = useState<AuthMessage | null>(null);
  const [registrationStep, setRegistrationStep] = useState<"email" | "otp" | "password" | null>(
    null,
  );
  const [emailAddress, setEmailAddress] = useState("");
  const [otp, setOtp] = useState("");

  const isRegister = mode === "register";
  const title = isRegister
    ? registrationStep === "password"
      ? "Tạo mật khẩu"
      : registrationStep === "otp"
        ? "Xác thực OTP"
        : "Đăng ký tài khoản"
    : "Đăng nhập";
  const subtitle = isRegister
    ? registrationStep === "password"
      ? "Nhập mật khẩu để hoàn tất đăng ký."
      : registrationStep === "otp"
        ? `Nhập mã OTP gửi đến ${emailAddress}`
        : "Đăng ký bằng email để xác thực tài khoản."
    : "Đăng nhập bằng email, Google hoặc Facebook để tiếp tục.";

  useEffect(() => {
    if (!facebookAppId || window.FB) return;

    window.fbAsyncInit = () => {
      window.FB?.init({
        appId: facebookAppId,
        cookie: true,
        version: "v21.0",
        xfbml: false,
      });
    };

    if (document.getElementById("facebook-jssdk")) return;

    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (isRegister && registrationStep === null) {
      setRegistrationStep("email");
    }
  }, [isRegister, registrationStep]);

  useEffect(() => {
    if (isRegister) return;

    const params = new URLSearchParams(window.location.search);

    if (params.get("registered") === "1") {
      setMessage({ text: "Đăng ký thành công. Vui lòng đăng nhập để tiếp tục.", type: "success" });
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [isRegister]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);

    try {
      if (isRegister && registrationStep === "email") {
        const email = String(formData.get("email") ?? "").trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
          setMessage({ text: "Email không hợp lệ.", type: "error" });
          return;
        }

        await registerWithEmail(email);
        setEmailAddress(email);
        setRegistrationStep("otp");
        setMessage({ text: "OTP đã được gửi. Vui lòng kiểm tra email.", type: "success" });
        return;
      }

      if (isRegister && registrationStep === "otp") {
        const otp = String(formData.get("otp") ?? "").trim();

        if (!/^\d{6}$/.test(otp)) {
          setMessage({ text: "Mã OTP phải có 6 chữ số.", type: "error" });
          return;
        }

        await verifyOTP(emailAddress, otp);
        setRegistrationStep("password");
        setMessage({ text: "OTP hợp lệ. Vui lòng tạo mật khẩu.", type: "success" });
        return;
      }

      if (isRegister && registrationStep === "password") {
        const password = String(formData.get("password") ?? "");
        const confirmPassword = String(formData.get("confirmPassword") ?? "");

        if (password.length < 8) {
          setMessage({ text: "Mật khẩu cần có ít nhất 8 ký tự.", type: "error" });
          return;
        }

        if (password !== confirmPassword) {
          setMessage({ text: "Mật khẩu xác nhận không khớp.", type: "error" });
          return;
        }

        const result = await completeRegistration(emailAddress, password);
        login(result.user);
        setMessage({
          text: "Đăng ký thành công. Đang chuyển sang trang hoàn thành profile...",
          type: "success",
        });
        window.setTimeout(() => {
          window.location.assign("/complete-profile");
        }, 1200);
        return;
      }

      if (!isRegister) {
        const email = String(formData.get("email") ?? "").trim().toLowerCase();
        const password = String(formData.get("password") ?? "");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
          setMessage({ text: "Email không hợp lệ.", type: "error" });
          return;
        }

        if (password.length < 8) {
          setMessage({ text: "Mật khẩu cần có ít nhất 8 ký tự.", type: "error" });
          return;
        }

        const result = await loginWithEmail(email, password);
        login(result.user);
        setMessage({ text: "Đăng nhập thành công. Đang chuyển trang...", type: "success" });
        window.setTimeout(() => {
          window.location.assign(result.user.profileCompleted ? "/dashboard" : "/complete-profile");
        }, 700);
      }
    } catch (error) {
      setMessage({
        text:
          (isRegister ? "Đăng ký" : "Đăng nhập") +
          " thất bại. " +
          (error instanceof Error ? error.message : "Không thể kết nối máy chủ."),
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoogleLogin() {
    setMessage(null);

    if (!googleClientId) {
      setMessage({ text: "Đăng nhập thất bại. Thiếu VITE_GOOGLE_CLIENT_ID.", type: "error" });
      return;
    }

    if (!window.google?.accounts.oauth2) {
      setMessage({ text: "Đăng nhập thất bại. Google SDK đang tải.", type: "error" });
      return;
    }

    setOauthProvider("google");

    let googleResponseReceived = false;
    const fallbackTimer = window.setTimeout(() => {
      if (!googleResponseReceived) {
        setOauthProvider(null);
      }
    }, 60_000);

    const stopGoogleLoading = () => {
      googleResponseReceived = true;
      window.clearTimeout(fallbackTimer);
      setOauthProvider(null);
    };

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: googleClientId,
      scope: "openid email profile",
      error_callback: (error) => {
        stopGoogleLoading();

        if (error.type === "popup_closed") {
          return;
        }

        setMessage({
          text: error.message ?? "Đăng nhập thất bại. Không mở được cửa sổ Google.",
          type: "error",
        });
      },
      callback: async (response) => {
        if (!response.access_token) {
          stopGoogleLoading();
          setMessage({
            text:
              response.error_description ?? "Đăng nhập thất bại. Google không trả về access token.",
            type: "error",
          });
          return;
        }

        try {
          const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          });
          const profile = (await profileResponse.json()) as GoogleProfile;

          if (!profile.email) {
            setMessage({
              text: "Đăng nhập thất bại. Không đọc được email từ Google.",
              type: "error",
            });
            stopGoogleLoading();
            return;
          }

          const result = await loginWithOAuth({
            googleId: profile.sub,
            name: profile.name ?? profile.email.split("@")[0],
            email: profile.email,
            image: profile.picture,
            provider: "google",
          });
          login(result.user);
          window.location.assign(result.user.profileCompleted ? "/dashboard" : "/complete-profile");
        } catch (error) {
          stopGoogleLoading();
          setMessage({
            text:
              "Đăng nhập thất bại. " +
              (error instanceof Error
                ? error.message
                : "Không thể lấy thông tin tài khoản Google."),
            type: "error",
          });
        }
      },
    });

    tokenClient.requestAccessToken({ prompt: "select_account" });
  }

  function handleFacebookLogin() {
    setMessage(null);

    if (!facebookAppId) {
      setMessage({ text: "Đăng nhập thất bại. Thiếu VITE_FACEBOOK_APP_ID.", type: "error" });
      return;
    }

    if (!window.FB) {
      setMessage({ text: "Đăng nhập thất bại. Facebook SDK đang tải.", type: "error" });
      return;
    }

    setOauthProvider("facebook");
    window.FB.login(
      (response) => {
        if (response.status !== "connected") {
          setOauthProvider(null);
          setMessage({ text: "Đăng nhập thất bại. Bạn chưa hoàn tất Facebook.", type: "error" });
          return;
        }

        window.FB?.api("/me", { fields: "id,name,email,picture" }, (profile) => {
          const email = profile.email ?? `${profile.id ?? "facebook"}@facebook.local`;

          loginWithOAuth({
            name: profile.name ?? "Facebook User",
            email,
            image: profile.picture?.data?.url,
            provider: "facebook",
          })
            .then((result) => {
              login(result.user);
              window.location.assign("/dashboard");
            })
            .catch((error: unknown) => {
              setMessage({
                text:
                  "Đăng nhập thất bại. " +
                  (error instanceof Error ? error.message : "Không thể kết nối máy chủ."),
                type: "error",
              });
            })
            .finally(() => {
              setOauthProvider(null);
            });
        });
      },
      { scope: "public_profile,email" },
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-elegant)] sm:p-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {isRegister && registrationStep === "email" && (
          <EmailField autoFocus />
        )}

        {isRegister && registrationStep === "otp" && (
          <div className="block">
            <span className="text-sm font-medium text-foreground">Mã OTP *</span>
            <div className="mt-2">
              <OtpInput
                value={otp}
                onChange={setOtp}
                disabled={isLoading}
              />
              <input type="hidden" name="otp" value={otp} />
            </div>
          </div>
        )}

        {isRegister && registrationStep === "password" && (
          <>
            <PasswordField
              name="password"
              label="Mật khẩu"
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              autoFocus
            />
            <PasswordField
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
            />
          </>
        )}

        {!isRegister && (
          <>
            <EmailField autoFocus />
            <PasswordField
              name="password"
              label="Mật khẩu"
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          </>
        )}

        {message && <div className={messageClassName[message.type]}>{message.text}</div>}

        <button
          type="submit"
          disabled={isLoading || oauthProvider !== null}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          style={{ background: "var(--gradient-hero)" }}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isRegister
            ? registrationStep === "otp"
              ? "Xác thực OTP"
              : registrationStep === "password"
                ? "Hoàn tất đăng ký"
                : "Tiếp tục"
            : "Đăng nhập"}
          {!isLoading ? <ArrowRight className="h-4 w-4" /> : null}
        </button>

        {isRegister && registrationStep !== "email" && (
          <button
            type="button"
            onClick={() => {
              setRegistrationStep(registrationStep === "password" ? "otp" : "email");
              setMessage(null);
            }}
            className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
          >
            Quay lại
          </button>
        )}
      </form>

      {!isRegister && (
        <a
          href="/authentication/forgot-password"
          className="mt-6 block w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-sm font-semibold text-foreground transition hover:bg-secondary"
        >
          Quên mật khẩu?
        </a>
      )}

      {!isRegister && (
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={oauthProvider !== null || isLoading}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {oauthProvider === "google" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={handleFacebookLogin}
            disabled={oauthProvider !== null || isLoading}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#1877F2] bg-[#1877F2] px-4 text-sm font-semibold text-white transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {oauthProvider === "facebook" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FacebookIcon />
            )}
            <span>Facebook</span>
          </button>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
        <a
          href={isRegister ? "/authentication/login" : "/authentication/register"}
          className="font-semibold text-primary"
        >
          {isRegister ? "Đăng nhập" : "Đăng ký ngay"}
        </a>
      </p>
    </div>
  );
}

function EmailField({ autoFocus = false }: { autoFocus?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">Email</span>
      <span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
        <Mail className="h-4 w-4 text-muted-foreground" />
        <input
          name="email"
          type="email"
          required
          placeholder="example@gmail.com"
          autoFocus={autoFocus}
          className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </span>
    </label>
  );
}

function PasswordField({
  autoFocus = false,
  label,
  name,
  setShowPassword,
  showPassword,
}: {
  autoFocus?: boolean;
  label: string;
  name: string;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
  showPassword: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
        <Lock className="h-4 w-4 text-muted-foreground" />
        <input
          name={name}
          type={showPassword ? "text" : "password"}
          required
          minLength={8}
          placeholder="Tối thiểu 8 ký tự"
          autoFocus={autoFocus}
          className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          className="text-muted-foreground transition hover:text-foreground"
          aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </span>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
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
