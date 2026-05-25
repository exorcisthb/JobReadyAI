import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthShell } from "@/components/auth/auth-shell";

export function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Quên mật khẩu"
      title="Khôi phục quyền truy cập tài khoản"
      description="Kiểm tra Gmail đã đăng ký, xác minh OTP, rồi tạo mật khẩu mới an toàn cho tài khoản JobReady AI."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
