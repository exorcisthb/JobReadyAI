import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Get started"
      title="Tao tai khoan Jobredy AI trong vai giay"
      description="Dang ky de tao CV chuan ATS, toi uu noi dung bang AI va san sang ung tuyen nhanh hon."
    >
      <Suspense>
        <AuthForm mode="register" />
      </Suspense>
    </AuthShell>
  );
}
