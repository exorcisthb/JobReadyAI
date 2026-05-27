import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export function LoginPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const timeoutReason = urlParams.get("reason") === "timeout";

  return (
    <AuthShell
      eyebrow={timeoutReason ? "Phiên đã hết hạn" : "Chào mừng trở lại"}
      title={timeoutReason ? "Đăng nhập lại để tiếp tục" : "Đăng nhập vào JobReady AI"}
      description={
        timeoutReason
          ? "Phiên đăng nhập của bạn đã hết hạn do không hoạt động trong 15 phút. Vui lòng đăng nhập lại."
          : "Tiếp tục hành trình chinh phục công việc mơ ước của bạn."
      }
      showTimeoutWarning={timeoutReason}
    >
      <AuthForm mode="login" />
    </AuthShell>
  );
}
