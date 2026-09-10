import { SignIn } from "@clerk/clerk-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthForm } from "@/components/auth/auth-form";
import { useTranslation } from "react-i18next";

const hasClerk = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

export function LoginPage() {
  const { t } = useTranslation();
  const urlParams = new URLSearchParams(window.location.search);
  const timeoutReason = urlParams.get("reason") === "timeout";

  if (hasClerk) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/register"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "mx-auto shadow-2xl rounded-2xl",
              card: "shadow-xl border border-border bg-card",
            },
          }}
        />
      </div>
    );
  }

  return (
    <AuthShell
      eyebrow={timeoutReason ? t("auth.sessionExpired") : t("auth.welcomeBack")}
      title={timeoutReason ? t("auth.loginAgainTitle") : t("auth.loginTitle")}
      description={
        timeoutReason
          ? t("auth.sessionExpiredDesc")
          : t("auth.loginDesc")
      }
      showTimeoutWarning={timeoutReason}
    >
      <AuthForm mode="login" />
    </AuthShell>
  );
}
