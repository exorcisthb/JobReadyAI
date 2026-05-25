import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/components/auth-provider";
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
import UserDashboard from "@/pages/user/UserDashboard";
import CMDashboard from "@/pages/content-manager/CMDashboard";

function Router() {
  const { user } = useAuth();
  const path = window.location.pathname.replace(/\/$/, "") || "/";

  useEffect(() => {
    const savedTheme = localStorage.getItem("homepage-theme") as "light" | "dark" | "rose" | null;
    const theme = savedTheme || "light";
    document.documentElement.classList.remove("light", "dark", "rose");
    if (theme !== "light") {
      document.documentElement.classList.add(theme);
    }
  }, [path]); // Re-apply theme when navigating paths

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
  useEffect(() => {
    // Initial load
    const savedTheme = localStorage.getItem("homepage-theme") as "light" | "dark" | "rose" | null;
    const theme = savedTheme || "light";
    document.documentElement.classList.remove("light", "dark", "rose");
    if (theme !== "light") {
      document.documentElement.classList.add(theme);
    }
  }, []);

  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
