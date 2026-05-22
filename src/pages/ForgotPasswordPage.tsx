import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthShell } from "@/components/auth/auth-shell";

export function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Quên mật khẩu"
      title="Đặt lại mật khẩu"
      description="Nhập email tài khoản để nhận hướng dẫn đặt lại mật khẩu."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
