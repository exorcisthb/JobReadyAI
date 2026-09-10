import { SignUp } from "@clerk/clerk-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthForm } from "@/components/auth/auth-form";
import { useTranslation } from "react-i18next";

const hasClerk = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

export function RegisterPage() {
  const { t } = useTranslation();

  if (hasClerk) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <SignUp
          routing="path"
          path="/register"
          signInUrl="/login"
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
      eyebrow={t("auth.registerEyebrow")}
      title={t("auth.registerTitle")}
      description={t("auth.registerDesc")}
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}
