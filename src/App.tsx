import { AuthProvider, useAuth } from "@/components/auth-provider";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { CompleteProfilePage } from "@/pages/CompleteProfilePage";
import { AdminDashboardPage } from "@/pages/Admin/DashboardPage";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import CreateContentManager from "@/pages/Admin/CreateContentManager";
import UserDashboard from "@/pages/user/UserDashboard";
import CMDashboard from "@/pages/content-manager/CMDashboard";

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
    if (user.role === "admin") return <AdminDashboardPage />;
    return user.profileCompleted ? <DashboardPage /> : <CompleteProfilePage />;
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

  return <NotFoundPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
