import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Bắt đầu ngay"
      title="Tạo tài khoản JobReadyAI trong vài giây"
      description="Đăng ký để tạo CV chuẩn ATS, tối ưu nội dung bằng AI và sẵn sàng ứng tuyển nhanh hơn."
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}
