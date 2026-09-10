import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { useTranslation } from "react-i18next";

export function LoginPage() {
  const { t } = useTranslation();
  const urlParams = new URLSearchParams(window.location.search);
  const timeoutReason = urlParams.get("reason") === "timeout";

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
