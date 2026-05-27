import { AuthProvider, useAuth } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { IdleTimeoutProvider } from "@/components/idle-timeout-provider";
import { ForgotPasswordPage } from "@/pages/Common/ForgotPasswordPage";
import { HomePage } from "@/pages/Common/HomePage";
import { LoginPage } from "@/pages/Common/LoginPage";
import { RegisterPage } from "@/pages/Common/RegisterPage";
import { DashboardPage } from "@/pages/User/DashboardPage";
import { NotFoundPage } from "@/pages/Common/NotFoundPage";
import { CompleteProfilePage } from "@/pages/Common/CompleteProfilePage";
import { AdminDashboardPage } from "@/pages/Admin/DashboardPage";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import CreateContentManager from "@/pages/Admin/CreateContentManager";
import UserDashboard from "@/pages/User/UserDashboard";
import CMDashboard from "@/pages/Manager/CMDashboard";
import SelectInterviewConfig from "@/pages/User/SelectInterviewConfig";
import ProfilePageWrapper from "@/pages/Common/ProfilePageWrapper";

function Router() {
  const { user } = useAuth();
  const path = window.location.pathname.replace(/\/$/, "") || "/";

  if (path === "/") return <HomePage />;
  if (path === "/authentication/login" || path === "/login") return <LoginPage />;
  if (path === "/authentication/register" || path === "/register") return <RegisterPage />;
  if (path === "/authentication/forgot-password") return <ForgotPasswordPage />;
  if (path === "/complete-profile") return user ? <CompleteProfilePage /> : <LoginPage />;
  if (path === "/dashboard") {
    if (!user) return <LoginPage />;
    if (user.role === "admin") return <AdminDashboard />;
    if (user.role === "content_manager") return <CMDashboard />;
    return user.profileCompleted ? <UserDashboard /> : <CompleteProfilePage />;
  }
  if (path === "/admin/dashboard") {
    if (!user || user.role !== "admin") return <NotFoundPage />;
    return <AdminDashboard />;
  }
  if (path === "/admin/create-content-manager") {
    if (!user || user.role !== "admin") return <NotFoundPage />;
    return <CreateContentManager />;
  }
  if (path === "/user/dashboard") {
    if (!user || user.role !== "user") return <NotFoundPage />;
    return <UserDashboard />;
  }
  if (path === "/content-manager/dashboard") {
    if (!user || user.role !== "content_manager") return <NotFoundPage />;
    return <CMDashboard />;
  }
  if (path === "/interview/config") {
    if (!user || user.role !== "user") return <NotFoundPage />;
    return <SelectInterviewConfig />;
  }
  if (path === "/profile") {
    if (!user) return <LoginPage />;
    return <ProfilePageWrapper />;
  }

  return <NotFoundPage />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <IdleTimeoutProvider>
          <Router />
        </IdleTimeoutProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
