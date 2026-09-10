import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { useTranslation } from "react-i18next";

export function RegisterPage() {
  const { t } = useTranslation();

  return (
    <AuthShell
      eyebrow={t("auth.registerEyebrow")}
      title={t("auth.registerTitle")}
      description={t("auth.registerDesc")}
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}
