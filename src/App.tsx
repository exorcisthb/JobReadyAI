import { AuthProvider, useAuth } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { IdleTimeoutProvider } from "@/components/idle-timeout-provider";
import { ForgotPasswordPage } from "@/pages/Common/ForgotPasswordPage";
import { HomePage } from "@/pages/Common/HomePage";
import { LoginPage } from "@/pages/Common/LoginPage";
import { RegisterPage } from "@/pages/Common/RegisterPage";
import { BlogPage } from "@/pages/Common/BlogPage";
import { DashboardPage } from "@/pages/user/DashboardPage";
import { NotFoundPage } from "@/pages/Common/NotFoundPage";
import { CompleteProfilePage } from "@/pages/Common/CompleteProfilePage";
import { PrivacyPolicyPage } from "@/pages/Common/PrivacyPolicyPage";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import CreateContentManager from "@/pages/Admin/CreateContentManager";
import UserDashboard from "@/pages/user/UserDashboard";
import CMDashboard from "@/pages/Manager/CMDashboard";
import SelectInterviewConfig from "@/pages/user/SelectInterviewConfig";
import InterviewSessionPage from "@/pages/user/InterviewSessionPage";
import ProfilePageWrapper from "@/pages/Common/ProfilePageWrapper";
import CVListPage from "@/pages/user/CVListPage";
import CVBuilderPage from "@/pages/user/CVBuilderPage";
import GroupsPage from "@/pages/user/GroupsPage";
import GroupDetailPage from "@/pages/user/GroupDetailPage";
import CreatePostPage from "@/pages/user/CreatePostPage";
import CreateArticle from "@/pages/Manager/CreateArticle";
import PricingPage from "@/pages/user/PricingPage";

function Router() {
  const { user } = useAuth();
  const path = window.location.pathname.replace(/\/$/, "") || "/";

  if (path === "/") return <HomePage />;
  if (path === "/chinh-sach") return <PrivacyPolicyPage />;
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
  if (path === "/content/articles/new") {
    if (!user || (user.role !== "admin" && user.role !== "content_manager")) return <NotFoundPage />;
    return <CreateArticle />;
  }
  const editArticleMatch = path.match(/^\/content\/articles\/([^/]+)\/edit$/);
  if (editArticleMatch) {
    if (!user || (user.role !== "admin" && user.role !== "content_manager")) return <NotFoundPage />;
    return <CreateArticle articleId={editArticleMatch[1]} />;
  }
  if (path === "/user/dashboard") {
    if (!user || user.role !== "user") return <NotFoundPage />;
    return <UserDashboard />;
  }
  if (path === "/content-manager/dashboard") {
    if (!user || (user.role !== "content_manager" && user.role !== "admin")) return <NotFoundPage />;
    return <CMDashboard />;
  }
  if (path === "/interview/config") {
    if (!user || user.role !== "user") return <NotFoundPage />;
    return <SelectInterviewConfig />;
  }
  if (path === "/interview/session") {
    if (!user || user.role !== "user") return <NotFoundPage />;
    return <InterviewSessionPage />;
  }
  if (path === "/profile") {
    if (!user) return <LoginPage />;
    return <ProfilePageWrapper />;
  }
  if (path === "/cv") {
    if (!user) return <LoginPage />;
    return <CVListPage />;
  }
  if (path === "/cv/create") {
    if (!user) return <LoginPage />;
    return <CVBuilderPage />;
  }
  if (path === "/groups") {
    if (!user) return <LoginPage />;
    return <GroupsPage />;
  }
  if (path === "/groups/detail") {
    if (!user) return <LoginPage />;
    return <GroupDetailPage />;
  }
  if (path === "/groups/create-post") {
    if (!user) return <LoginPage />;
    return <CreatePostPage />;
  }
  if (path === "/pricing") {
    if (!user) return <LoginPage />;
    return <PricingPage />;
  }
  if (path === "/blog" || path.startsWith("/blog/")) {
    return <BlogPage type="internal" />;
  }
  if (path === "/news" || path.startsWith("/news/")) {
    return <BlogPage type="external" />;
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