import { useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
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

const demoUsers = new Map([
  ["demo@jobredy.com", { name: "Demo User", email: "demo@jobredy.com" }],
  ["john@example.com", { name: "John Doe", email: "john@example.com" }],
]);

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID as string | undefined;

export function AuthForm({ mode }: AuthFormProps) {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<"google" | "facebook" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isRegister = mode === "register";
  const title = isRegister ? "Đăng ký tài khoản" : "Đăng nhập";
  const subtitle = isRegister
    ? "Tạo tài khoản JobReady AI bằng email và mật khẩu."
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

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const name = String(formData.get("name") ?? "").trim();

    window.setTimeout(() => {
      if (password.length < 8) {
        setMessage("Mật khẩu cần có ít nhất 8 ký tự.");
        setIsLoading(false);
        return;
      }

      if (isRegister && password !== confirmPassword) {
        setMessage("Mật khẩu xác minh không khớp.");
        setIsLoading(false);
        return;
      }

      const existingUser = demoUsers.get(email);
      const user = {
        name: isRegister ? name || email.split("@")[0] : existingUser?.name || email.split("@")[0],
        email,
        provider: "email" as const,
      };

      login(user);
      window.location.assign("/dashboard");
    }, 450);
  }

  function handleGoogleLogin() {
    setMessage(null);

    if (!googleClientId) {
      setMessage("Thiếu VITE_GOOGLE_CLIENT_ID trong .env.local.");
      return;
    }

    if (!window.google?.accounts.oauth2) {
      setMessage("Google SDK đang tải. Vui lòng thử lại sau vài giây.");
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

        setMessage(error.message ?? "Không mở được cửa sổ đăng nhập Google.");
      },
      callback: async (response) => {
        if (!response.access_token) {
          stopGoogleLoading();
          setMessage(response.error_description ?? "Google không trả về access token.");
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
            setMessage("Không đọc được email từ Google.");
            stopGoogleLoading();
            return;
          }

          login({
            name: profile.name ?? profile.email.split("@")[0],
            email: profile.email,
            image: profile.picture,
            provider: "google",
          });
          window.location.assign("/dashboard");
        } catch {
          stopGoogleLoading();
          setMessage("Không thể lấy thông tin tài khoản Google.");
        }
      },
    });

    tokenClient.requestAccessToken({ prompt: "select_account" });
  }

  function handleFacebookLogin() {
    setMessage(null);

    if (!facebookAppId) {
      setMessage("Thiếu VITE_FACEBOOK_APP_ID trong .env.local.");
      return;
    }

    if (!window.FB) {
      setMessage("Facebook SDK đang tải. Vui lòng thử lại sau vài giây.");
      return;
    }

    setOauthProvider("facebook");
    window.FB.login(
      (response) => {
        if (response.status !== "connected") {
          setOauthProvider(null);
          setMessage("Bạn chưa hoàn tất đăng nhập Facebook.");
          return;
        }

        window.FB?.api("/me", { fields: "id,name,email,picture" }, (profile) => {
          const email = profile.email ?? `${profile.id ?? "facebook"}@facebook.local`;

          login({
            name: profile.name ?? "Facebook User",
            email,
            image: profile.picture?.data?.url,
            provider: "facebook",
          });
          window.location.assign("/dashboard");
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
        {isRegister && (
          <label className="block">
            <span className="text-sm font-medium text-foreground">Họ tên</span>
            <span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
              <User className="h-4 w-4 text-muted-foreground" />
              <input
                name="name"
                type="text"
                required
                minLength={2}
                placeholder="Nguyễn Văn A"
                className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </span>
          </label>
        )}

        <label className="block">
          <span className="text-sm font-medium text-foreground">Email</span>
          <span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              defaultValue={isRegister ? "" : "demo@jobredy.com"}
              className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Mật khẩu</span>
          <span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              placeholder="Tối thiểu 8 ký tự"
              defaultValue={isRegister ? "" : "password"}
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

        {isRegister && (
          <label className="block">
            <span className="text-sm font-medium text-foreground">Xác minh mật khẩu</span>
            <span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={8}
                placeholder="Nhập lại mật khẩu"
                className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="text-muted-foreground transition hover:text-foreground"
                aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>
        )}

        {message && (
          <div className="rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || oauthProvider !== null}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          style={{ background: "var(--gradient-hero)" }}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isRegister ? "Tạo tài khoản" : "Đăng nhập"}
          {!isLoading ? <ArrowRight className="h-4 w-4" /> : null}
        </button>
      </form>

      {!isRegister && (
        <a
          href="/authentication/forgot-password"
          className="mt-6 block w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-sm font-semibold text-foreground transition hover:bg-secondary"
        >
          Quên mật khẩu?
        </a>
      )}

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
