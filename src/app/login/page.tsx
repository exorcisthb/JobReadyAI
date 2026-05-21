import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Chào mừng trở lại"
      title="Đăng nhập để tiếp tục tạo CV thông minh"
      description="Quản lý CV, template và các bản tối ưu theo JD trong một không gian gọn gàng."
    >
      <Suspense>
        <AuthForm mode="login" />
      </Suspense>
    </AuthShell>
  );
}
