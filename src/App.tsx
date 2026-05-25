import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { CompleteProfilePage } from "@/pages/CompleteProfilePage";
import { AdminDashboardPage } from "@/pages/Admin/DashboardPage";

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
    return <AdminDashboardPage />;
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
