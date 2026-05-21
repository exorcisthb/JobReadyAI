import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Bắt đầu ngay"
      title="Tạo tài khoản Jobredy AI trong vài giây"
      description="Đăng ký để tạo CV chuẩn ATS, tối ưu nội dung bằng AI và sẵn sàng ứng tuyển nhanh hơn."
    >
      <Suspense>
        <AuthForm mode="register" />
      </Suspense>
    </AuthShell>
  );
}
