import { useEffect, useState, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/components/auth-provider";
import {
  checkEmailExists,
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
  key: string;
  params?: Record<string, string>;
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
  authResponse?: {
    accessToken?: string;
    userID?: string;
    expiresIn?: number;
    signedRequest?: string;
  };
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
        options: { scope?: string; config_id?: string },
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
const rawFacebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID as string | undefined;
const facebookAppId = (rawFacebookAppId && rawFacebookAppId !== "1634134427842293" && !rawFacebookAppId.includes("VITE_"))
  ? rawFacebookAppId
  : "4673960412882033";

const messageClassName = {
  success: "message-success",
  error: "message-error",
};

export function AuthForm({ mode }: AuthFormProps) {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<"google" | "facebook" | null>(null);
  const [message, setMessage] = useState<AuthMessage | null>(null);
  const [registrationStep, setRegistrationStep] = useState<"email" | "otp" | "password" | null>(
    null,
  );
  const [otpRowRef] = useState(() => ({ current: null as HTMLDivElement | null }));
  const [emailAddress, setEmailAddress] = useState("");
  const [otp, setOtp] = useState("");
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (registrationStep === "otp" && resendCooldown === 0) {
      setResendCooldown(30);
    }
  }, [registrationStep]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  function dispatchOtpValidate(success: boolean) {
    const el = otpRowRef.current;
    if (!el) return;
    el.dispatchEvent(new CustomEvent("otp-validate", { detail: { success }, bubbles: true }));
  }

  async function handleResendOTP() {
    if (resendCooldown > 0 || isLoading) return;
    setIsLoading(true);
    setMessage(null);
    setOtp("");
    setIsVerified(false);
    try {
      await registerWithEmail(emailAddress);
      setResendCooldown(30);
      setMessage({ key: "auth.otpSent", type: "success" });
    } catch (error) {
      setMessage({
        key: "auth.authFailed",
        params: {
          mode: t("auth.resendOtp"),
          reason: error instanceof Error ? error.message : "",
        },
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const isRegister = mode === "register";
  const showPolicyCheckbox = !isRegister || (isRegister && registrationStep === "email");
  const title = isRegister
    ? registrationStep === "password"
      ? t("auth.createPassword")
      : registrationStep === "otp"
        ? t("auth.verifyOtp")
        : t("auth.register")
    : t("auth.login");
  const subtitle = isRegister
    ? registrationStep === "password"
      ? t("auth.passwordSubtitle")
      : registrationStep === "otp"
        ? t("auth.otpSubtitle", { email: emailAddress })
        : t("auth.registerSubtitle")
    : t("auth.loginSubtitle");

  useEffect(() => {
    const appId = facebookAppId || "4673960412882033";
    if (window.FB) return;

    window.fbAsyncInit = () => {
      window.FB?.init({
        appId: appId,
        cookie: true,
        version: "v21.0",
        xfbml: true,
      });
    };

    if (document.getElementById("facebook-jssdk")) return;

    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    
    // Retrieve the per-request CSP nonce from the meta tag
    const nonce = document.querySelector('meta[name="csp-nonce"]')?.getAttribute("content");
    if (nonce) {
      script.nonce = nonce;
    }
    
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
      setMessage({ key: "auth.registerSuccess", type: "success" });
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [isRegister, t]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);

    try {
      if (isRegister && registrationStep === "email") {
        const email = String(formData.get("email") ?? "")
          .trim()
          .toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
          setMessage({ key: "auth.emailInvalid", type: "error" });
          return;
        }

        const emailStatus = await checkEmailExists(email);
        if (emailStatus.exists) {
          setMessage({ key: "auth.emailExists", type: "error" });
          return;
        }

        await registerWithEmail(email);
        setEmailAddress(email);
        setRegistrationStep("otp");
        setMessage({ key: "auth.otpSent", type: "success" });
        return;
      }

      if (isRegister && registrationStep === "otp") {
        const otpVal = String(formData.get("otp") ?? "").trim();

        if (!/^\d{6}$/.test(otpVal)) {
          dispatchOtpValidate(false);
          setMessage({ key: "auth.otpDigits", type: "error" });
          return;
        }

        if (isVerified) {
          dispatchOtpValidate(true);
          setTimeout(() => {
            setRegistrationStep("password");
            setMessage({ key: "auth.otpAlreadyVerified", type: "success" });
          }, 600);
          return;
        }

        try {
          await verifyOTP(emailAddress, otpVal);
          setIsVerified(true);
          dispatchOtpValidate(true);
          setTimeout(() => {
            setRegistrationStep("password");
            setMessage({ key: "auth.otpValid", type: "success" });
          }, 2200);
        } catch (error) {
          dispatchOtpValidate(false);
          const errMsg = error instanceof Error ? error.message : "";
          if (errMsg.includes("OTP_ALREADY_VERIFIED") || errMsg.includes("xác thực") || errMsg.includes("already")) {
            setIsVerified(true);
            setTimeout(() => {
              setRegistrationStep("password");
              setMessage({ key: "auth.otpAlreadyVerified", type: "success" });
            }, 600);
            return;
          }
          setMessage({
            key: "auth.authFailed",
            params: {
              mode: t("auth.verifyOtp"),
              reason: errMsg,
            },
            type: "error",
          });
        }
        return;
      }

      if (isRegister && registrationStep === "password") {
        const password = String(formData.get("password") ?? "");
        const confirmPassword = String(formData.get("confirmPassword") ?? "");

        if (password.length < 8) {
          setMessage({ key: "auth.passwordMinLength", type: "error" });
          return;
        }

        if (!/[A-Z]/.test(password)) {
          setMessage({ key: "auth.passwordUpper", type: "error" });
          return;
        }

        if (!/[0-9]/.test(password)) {
          setMessage({ key: "auth.passwordDigit", type: "error" });
          return;
        }

        if (!/[^A-Za-z0-9]/.test(password)) {
          setMessage({ key: "auth.passwordSpecial", type: "error" });
          return;
        }

        if (password !== confirmPassword) {
          setMessage({ key: "auth.passwordMismatch", type: "error" });
          return;
        }

        const result = await completeRegistration(emailAddress, password);
        login(result.user);
        setMessage({ key: "auth.registerSuccess", type: "success" });
        window.setTimeout(() => {
          window.location.assign("/complete-profile");
        }, 1200);
        return;
      }

      if (!isRegister) {
        const email = String(formData.get("email") ?? "")
          .trim()
          .toLowerCase();
        const password = String(formData.get("password") ?? "");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
          setMessage({ key: "auth.emailInvalid", type: "error" });
          return;
        }

        if (password.length < 8) {
          setMessage({ key: "auth.passwordMinLength", type: "error" });
          return;
        }

        const result = await loginWithEmail(email, password);
        login(result.user);
        setMessage({ key: "auth.loginSuccess", type: "success" });
        window.setTimeout(() => {
          window.location.assign(result.user.profileCompleted ? "/dashboard" : "/complete-profile");
        }, 700);
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "";
      if (errMsg.includes("RATE_LIMITED") || errMsg.includes("Quá nhiều yêu cầu")) {
        setMessage({ key: "auth.rateLimited", type: "error" });
      } else {
        setMessage({
          key: "auth.authFailed",
          params: {
            mode: isRegister ? t("auth.register") : t("auth.login"),
            reason: errMsg,
          },
          type: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoogleLogin() {
    setMessage(null);

    if (showPolicyCheckbox && !acceptedPolicy) {
      setMessage({ key: "auth.policyError", type: "error" });
      return;
    }

    if (!googleClientId) {
      setMessage({ key: "auth.authFailed", params: { mode: "Google", reason: "Missing VITE_GOOGLE_CLIENT_ID" }, type: "error" });
      return;
    }

    if (!window.google?.accounts.oauth2) {
      setMessage({ key: "auth.authFailed", params: { mode: "Google", reason: "SDK loading" }, type: "error" });
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
          key: "auth.authFailed",
          params: { mode: "Google", reason: error.message ?? "" },
          type: "error",
        });
      },
      callback: async (response) => {
        if (!response.access_token) {
          stopGoogleLoading();
          setMessage({
            key: "auth.authFailed",
            params: { mode: "Google", reason: response.error_description ?? "" },
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
              key: "auth.authFailed",
              params: { mode: "Google", reason: "Could not read email" },
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
            key: "auth.authFailed",
            params: { mode: "Google", reason: error instanceof Error ? error.message : "" },
            type: "error",
          });
        }
      },
    });

    tokenClient.requestAccessToken({ prompt: "select_account" });
  }

  function handleFacebookLogin(e?: React.MouseEvent<HTMLButtonElement>) {
    if (e) {
      e.preventDefault();
    }
    setMessage(null);

    if (showPolicyCheckbox && !acceptedPolicy) {
      setMessage({ key: "auth.policyError", type: "error" });
      return;
    }

    if (typeof window.FB === "undefined" || !window.FB) {
      console.error("[FB Login] SDK chưa sẵn sàng");
      setMessage({ key: "auth.authFailed", params: { mode: "Facebook", reason: "SDK loading" }, type: "error" });
      return;
    }

    console.log("[FB Login] Bắt đầu gọi FB.login với scope: public_profile,email");

    setOauthProvider("facebook");

    window.FB.login(
      function (response) {
        console.log("[FB Login] Response:", response);
        if (response.authResponse || response.status === "connected") {
          window.FB?.api("/me", { fields: "name, email, picture" }, function (userInfo: any) {
            console.log("[FB Login] User info:", userInfo);

            const email = userInfo.email ?? `${userInfo.id ?? "facebook"}@facebook.local`;

            loginWithOAuth({
              name: userInfo.name ?? "Facebook User",
              email,
              image: userInfo.picture?.data?.url,
              provider: "facebook",
              facebookId: userInfo.id,
              accessToken: response.authResponse?.accessToken,
            })
              .then((result) => {
                console.log("[FB Login] loginWithOAuth thành công, user:", result.user);
                login(result.user);
                window.location.assign(
                  result.user.profileCompleted ? "/dashboard" : "/complete-profile",
                );
              })
              .catch((error: unknown) => {
                console.error("[FB Login] Lỗi khi gọi loginWithOAuth:", error);
                setMessage({
                  key: "auth.authFailed",
                  params: { mode: "Facebook", reason: error instanceof Error ? error.message : "" },
                  type: "error",
                });
              })
              .finally(() => {
                setOauthProvider(null);
              });
          });
        } else {
          console.warn("[FB Login] User huỷ hoặc từ chối quyền:", response);
          setOauthProvider(null);
          setMessage({ key: "auth.authFailed", params: { mode: "Facebook", reason: "Login cancelled" }, type: "error" });
        }
      },
      { scope: "public_profile,email" },
    );
  }

  return (
    <div className="relative rounded-3xl border-2 border-border bg-card p-6 shadow-[var(--shadow-elegant)] sm:p-8 overflow-hidden hover:border-primary/30 transition-all duration-500">
      {/* Animated background gradient - MORE VISIBLE */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-full h-full opacity-40"
          style={{
            background:
              "radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.25) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.25) 0%, transparent 50%)",
            animation: "pulse 4s ease-in-out infinite",
          }}
        />
        {/* Additional animated gradient layer */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
            animation: "pulse-slow 6s ease-in-out infinite",
          }}
        />
      </div>

      <div className="relative z-10">
        <h2
          className="text-2xl sm:text-3xl font-bold tracking-tight animate-fade-in-up"
          style={{
            background: "linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(16, 185, 129) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 0 30px rgba(99, 102, 241, 0.3)",
          }}
        >
          {title}
        </h2>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 animate-fade-in-up animation-delay-100">
          {subtitle}
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="relative z-10 mt-6 space-y-4"
      >
        {isRegister && registrationStep === "email" && <EmailField autoFocus />}

        {isRegister && registrationStep === "otp" && (
          <div className="block animate-fade-in-up space-y-3">
            <span className="text-sm font-medium text-foreground">{t("auth.otpLabel")}</span>
            <div className="mt-2">
              <OtpInput value={otp} onChange={setOtp} disabled={isLoading} rowRef={otpRowRef} />
              <input type="hidden" name="otp" value={otp} />
            </div>
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isLoading || resendCooldown > 0}
                className="text-xs font-semibold text-primary hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                {resendCooldown > 0
                  ? t("auth.resendOtpCountdown", { seconds: String(resendCooldown) })
                  : t("auth.resendOtp")}
              </button>
            </div>
          </div>
        )}

        {isRegister && registrationStep === "password" && (
          <>
            <PasswordField
              name="password"
              label={t("auth.passwordLabel")}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              autoFocus
            />
            <PasswordField
              name="confirmPassword"
              label={t("auth.confirmPasswordLabel")}
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
              label={t("auth.passwordLabel")}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          </>
        )}

        {message && <div className={messageClassName[message.type]}>{t(message.key, message.params)}</div>}

        {showPolicyCheckbox && (
          <div className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors">
            <input
              id="accept-policy"
              type="checkbox"
              checked={acceptedPolicy}
              onChange={(e) => setAcceptedPolicy(e.target.checked)}
              className="mt-0.5 h-5 w-5 rounded border-border text-primary focus:ring-ring focus:ring-offset-background cursor-pointer"
            />
            <label
              htmlFor="accept-policy"
              className="text-sm text-foreground select-none cursor-pointer leading-relaxed"
            >
              {t("auth.policyAgree")}{" "}
              <a
                href={`/chinh-sach?from=${isRegister ? "register" : "login"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                {t("auth.policyName")}
              </a>{" "}
              {t("auth.policySuffix")}
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || oauthProvider !== null || (showPolicyCheckbox && !acceptedPolicy)}
          className="group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgba(99,102,241,0.5)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 animate-fade-in-up"
          style={{
            background: "linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(16, 185, 129) 100%)",
            boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4)",
          }}
        >
          {/* Animated shine effect - MORE VISIBLE */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
              animation: "shine 1.5s infinite",
            }}
          />

          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          <span className="relative z-10">
            {isRegister
              ? registrationStep === "otp"
                ? t("auth.verifyOtp")
                : registrationStep === "password"
                  ? t("auth.completeRegister")
                  : t("auth.continue")
              : t("auth.login")}
          </span>
          {!isLoading ? (
            <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-2 group-hover:scale-125" />
          ) : null}
        </button>

        {isRegister && registrationStep !== "email" && (
          <button
            type="button"
            onClick={() => {
              setRegistrationStep("email");
              setMessage(null);
              setOtp("");
              setIsVerified(false);
            }}
            className="w-full rounded-xl border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
          >
            {t("auth.back")}
          </button>
        )}
      </form>

      {!isRegister && (
        <a
          href="/authentication/forgot-password"
          className="mt-6 block w-full rounded-xl border border-border bg-background px-4 py-3 text-center text-sm font-semibold text-foreground transition hover:bg-secondary"
        >
          {t("auth.forgotPassword")}
        </a>
      )}

      {!isRegister && (
        <div className="mt-6 grid grid-cols-2 gap-3 relative z-10">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={oauthProvider !== null || isLoading}
            className="group relative inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-4 text-sm font-semibold text-black transition-all duration-300 hover:border-primary hover:bg-gray-50 hover:scale-105 hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 z-10"
          >
            {oauthProvider === "google" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                <GoogleIcon />
              </div>
            )}
            <span className="transition-transform group-hover:translate-x-1">Google</span>
          </button>
          <button
            type="button"
            onClick={handleFacebookLogin}
            disabled={oauthProvider !== null || isLoading}
            className="group relative inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-[#1877F2] bg-[#1877F2] px-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#166fe5] hover:scale-105 hover:shadow-[0_4px_20px_rgba(24,119,242,0.4)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 z-10"
          >
            {oauthProvider === "facebook" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                <FacebookIcon />
              </div>
            )}
            <span className="transition-transform group-hover:translate-x-1">Facebook</span>
          </button>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isRegister ? t("auth.alreadyHaveAccount") : t("auth.noAccount")}{" "}
        <a
          href={isRegister ? "/authentication/login" : "/authentication/register"}
          className="font-semibold text-primary"
        >
          {isRegister ? t("auth.login") : t("auth.registerNow")}
        </a>
      </p>
    </div>
  );
}

function EmailField({ autoFocus = false }: { autoFocus?: boolean }) {
  return (
    <label className="block group animate-fade-in-up">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
        Email
      </span>
      <span className="mt-2 flex h-12 items-center gap-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 transition-all duration-300 focus-within:border-primary focus-within:shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:border-primary/50">
        <Mail className="h-4 w-4 text-gray-400 transition-all duration-300 group-focus-within:text-primary group-focus-within:scale-125 group-focus-within:rotate-12" />
        <input
          name="email"
          type="email"
          required
          placeholder="example@gmail.com"
          autoFocus={autoFocus}
          className="h-full flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 outline-none placeholder:text-gray-400"
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
  const { t } = useTranslation();
  return (
    <label className="block group animate-fade-in-up">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-300">
        {label}
      </span>
      <span className="mt-2 flex h-12 items-center gap-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 transition-all duration-300 focus-within:border-primary focus-within:shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:border-primary/50">
        <Lock className="h-4 w-4 text-gray-400 transition-all duration-300 group-focus-within:text-primary group-focus-within:scale-125 group-focus-within:rotate-12" />
        <input
          name={name}
          type={showPassword ? "text" : "password"}
          required
          minLength={8}
          placeholder={t("auth.passwordPlaceholder")}
          autoFocus={autoFocus}
          className="h-full flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 outline-none placeholder:text-gray-400"
        />
        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          className="text-gray-400 transition-all duration-300 hover:text-primary hover:scale-150 hover:rotate-180 active:scale-95"
          aria-label={showPassword ? "Hide password" : "Show password"}
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
  rowRef?: React.RefObject<HTMLDivElement | null>;
};

function OtpInput({ value, onChange, disabled, rowRef: externalRowRef }: OtpInputProps) {
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const internalRowRef = useRef<HTMLDivElement>(null);
  const rowRef = externalRowRef ?? internalRowRef;
  const [boxStates, setBoxStates] = useState<Array<"idle" | "success" | "error">>(
    Array(6).fill("idle"),
  );
  const [rippleActive, setRippleActive] = useState(false);
  const [rippleError, setRippleError] = useState(false);
  const [glowActive, setGlowActive] = useState(false);
  const [glowError, setGlowError] = useState(false);

  // Split string into array of 6 elements
  const values = value.padEnd(6, " ").slice(0, 6).split("");

  // Keep first input focused on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

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
    // Clear error state on edit
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
    const nextValue = newValues.join("").trim();
    onChange(nextValue);

    if (index < 5 && char) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      // Clear error states on backspace
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

  // Expose a way for parent to trigger success/error visuals via imperative handle
  // But since this is controlled, we watch value length + a validation prop
  // We expose a ref-based trigger via custom event on the row element
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
        // shake row
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
              animation:
                rippleActive
                  ? `otpRippleOut 1.8s ease-out ${i * 0.35}s both`
                  : "none",
            }}
          />
        ))}
      </div>

      {/* OTP boxes row */}
      <div ref={rowRef} className="otp-boxes-row relative z-10 flex gap-2 sm:gap-2.5 py-2">
        {Array.from({ length: 6 }).map((_, index) => {
          const val = values[index] === " " ? "" : values[index];
          const state = boxStates[index];
          const isFilled = state === "success";
          return (
            <div
              key={index}
              className="relative flex items-center justify-center"
              style={{
                width: "clamp(40px, 10vw, 56px)",
                height: "clamp(48px, 12vw, 68px)",
                borderRadius: "14px",
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
                  fontSize: "clamp(18px, 4vw, 26px)",
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
                  width: 22,
                  height: 22,
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
