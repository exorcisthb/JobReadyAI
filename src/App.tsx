import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { IdleTimeoutProvider } from "@/components/idle-timeout-provider";
import { ForgotPasswordPage } from "@/pages/Common/ForgotPasswordPage";
import { HomePage } from "@/pages/Common/HomePage";
import { LoginPage } from "@/pages/Common/LoginPage";
import { RegisterPage } from "@/pages/Common/RegisterPage";
import { BlogPage } from "@/pages/Common/BlogPage";
import { NotFoundPage } from "@/pages/Common/NotFoundPage";
import { CompleteProfilePage } from "@/pages/Common/CompleteProfilePage";
import { PrivacyPolicyPage } from "@/pages/Common/PrivacyPolicyPage";
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import UserManagementPage from "@/pages/Admin/UserManagementPage";
import CreateContentManager from "@/pages/Admin/CreateContentManager";
import FinanceDashboardPage from "@/pages/Admin/FinanceDashboardPage";
import SecurityAdminPage from "@/pages/Admin/SecurityAdminPage";
import MaintenanceAdminPage from "@/pages/Admin/MaintenanceAdminPage";
import GroupModerationPage from "@/pages/Manager/GroupModerationPage";
import ArticleManagementPage from "@/pages/Manager/ArticleManagementPage";
import NewsManagementPage from "@/pages/Manager/NewsManagementPage";
import UserActivityAdminPage from "@/pages/Admin/UserActivityAdminPage";
import UserDashboard from "@/pages/User/UserDashboard";
import CMDashboard from "@/pages/Manager/CMDashboard";
import InterviewSessionPage from "@/pages/User/InterviewSessionPage";
import InterviewPersonaSelectPage from "@/pages/User/InterviewPersonaSelectPage";
import InterviewHistoryPage from "@/pages/User/InterviewHistoryPage";
import ProfilePageWrapper from "@/pages/Common/ProfilePageWrapper";
import ViewProfilePage from "@/pages/Common/ViewProfilePage";
import CVListPage from "@/pages/User/CVListPage";
import CVBuilderPage from "@/pages/User/CVBuilderPage";
import CVPreviewPage from "@/pages/User/CVPreviewPage";
import CVPrintPage from "@/pages/CVPrintPage";
import DraftCVPage from "@/pages/User/DraftCVPage";
import GroupsPage from "@/pages/User/GroupsPage";
import GroupDetailPage from "@/pages/User/GroupDetailPage";
import GroupInvitePage from "@/pages/User/GroupInvitePage";
import CreatePostPage from "@/pages/User/CreatePostPage";
import CreateArticle from "@/pages/Manager/CreateArticle";
import PricingPage from "@/pages/User/PricingPage";
import { PaymentSuccessPage } from "@/pages/User/PaymentSuccessPage";
import { PaymentCancelPage } from "@/pages/User/PaymentCancelPage";
import MessagesPage from "@/pages/User/MessagesPage";
import SettingsPage from "@/pages/User/SettingsPage";
import { CustomerSupportBubble } from "@/components/CustomerSupportBubble";
import { MaintenancePage } from "@/components/ui/maintenance-page";
import { useHeartbeat } from "@/hooks/useHeartbeat";

type MaintenanceState = {
  enabled: boolean;
  message: string;
};

function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [maintenance, setMaintenance] = useState<MaintenanceState | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadMaintenance() {
      try {
        const response = await fetch("/api/system/maintenance", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as MaintenanceState;
        if (!cancelled) setMaintenance(data);
      } catch {
        if (!cancelled) setMaintenance(null);
      }
    }

    void loadMaintenance();
    const interval = window.setInterval(loadMaintenance, 30000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
  const publicPaths = ["/", "/login", "/register", "/authentication/login", "/authentication/register", "/authentication/forgot-password", "/chinh-sach"];
  const isPublicPath = publicPaths.includes(currentPath) || currentPath.startsWith("/blog") || currentPath.startsWith("/news");

  if (maintenance?.enabled && user?.role === "user" && !user.isTestUser && !isPublicPath) {
    return <MaintenancePage message={maintenance.message} />;
  }

  return <>{children}</>;
}

function Router() {
  const { user } = useAuth();
  const path = window.location.pathname.replace(/\/$/, "") || "/";

  useHeartbeat();

  // Keep this list at the router boundary so every role uses the same rule:
  // no active browser session means no private page can render from a copied URL.
  const isProtectedPath =
    [
      "/complete-profile", "/dashboard",
      "/admin/dashboard", "/admin/users", "/admin/groups", "/admin/finance",
      "/admin/security", "/admin/maintenance", "/admin/user-activity", "/admin/create-content-manager",
      "/content/articles/new", "/user/dashboard", "/content-manager/dashboard",
      "/content-manager/groups", "/content-manager/articles", "/content-manager/news",
      "/interview/persona", "/interview/session", "/interview/history",
      "/profile", "/cv", "/cv/create", "/cv/drafts", "/cv/preview", "/user/cv-builder",
      "/groups", "/groups/detail", "/groups/invite", "/groups/create-post", "/messages",
      "/pricing", "/pricing/interview", "/pricing/cv", "/payment/success", "/payment/cancel", "/user/settings",
    ].includes(path) ||
    ["/admin/", "/content-manager/", "/content/articles/", "/user/", "/interview/", "/profile/", "/cv/", "/groups/"].some(
      (prefix) => path.startsWith(prefix),
    ) ||
    /^\/profile\/[^/]+$/.test(path) ||
    /^\/content\/articles\/[^/]+\/edit$/.test(path);

  if (!user && isProtectedPath) return <LoginPage />;

  if (path === "/") return <HomePage />;
  if (path === "/chinh-sach") return <PrivacyPolicyPage />;
  
  // Public CV print route for Puppeteer PDF rendering (no auth required)
  if (path === "/cv-print") return <CVPrintPage />;
  
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
  if (path === "/admin/users") {
    if (!user || user.role !== "admin") return <NotFoundPage />;
    return <UserManagementPage />;
  }
  if (path === "/admin/groups") return <NotFoundPage />;
  if (path === "/admin/finance") {
    if (!user || user.role !== "admin") return <NotFoundPage />;
    return <FinanceDashboardPage />;
  }
  if (path === "/admin/security") {
    if (!user || user.role !== "admin") return <NotFoundPage />;
    return <SecurityAdminPage />;
  }
  if (path === "/admin/maintenance") {
    if (!user || user.role !== "admin") return <NotFoundPage />;
    return <MaintenanceAdminPage />;
  }
  if (path === "/admin/user-activity") {
    if (!user || user.role !== "admin") return <NotFoundPage />;
    return <UserActivityAdminPage />;
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
  if (path === "/content-manager/groups") {
    if (!user || user.role !== "content_manager") return <NotFoundPage />;
    return <GroupModerationPage />;
  }
  if (path === "/content-manager/articles") {
    if (!user || (user.role !== "content_manager" && user.role !== "admin")) return <NotFoundPage />;
    return <ArticleManagementPage />;
  }
  if (path === "/content-manager/news") {
    if (!user || (user.role !== "content_manager" && user.role !== "admin")) return <NotFoundPage />;
    return <NewsManagementPage />;
  }
  if (path === "/interview/persona") {
    if (!user || user.role !== "user") return <NotFoundPage />;
    return <InterviewPersonaSelectPage />;
  }
  if (path === "/interview/session") {
    if (!user || user.role !== "user") return <NotFoundPage />;
    return <InterviewSessionPage />;
  }
  if (path === "/interview/history") {
    if (!user || user.role !== "user") return <NotFoundPage />;
    return <InterviewHistoryPage />;
  }
  const profileMatch = path.match(/^\/profile\/([^/]+)$/);
  if (profileMatch) {
    if (!user) return <LoginPage />;
    return <ViewProfilePage userId={profileMatch[1]} />;
  }
  if (path === "/profile") {
    if (!user) return <LoginPage />;
    return <ProfilePageWrapper />;
  }
  if (path === "/cv") {
    if (!user || user.role !== "user") return <NotFoundPage />;
    return <CVListPage />;
  }
  if (path === "/cv/create") {
    if (!user || user.role !== "user") return <NotFoundPage />;
    return <CVBuilderPage />;
  }
  if (path === "/cv/drafts") {
    if (!user || user.role !== "user") return <NotFoundPage />;
    return <DraftCVPage />;
  }
  if (path === "/cv/preview") {
    if (!user || user.role !== "user") return <NotFoundPage />;
    return <CVPreviewPage />;
  }
  if (path === "/user/cv-builder") {
    if (!user || user.role !== "user") return <NotFoundPage />;
    return <CVBuilderPage />;
  }
  if (path === "/groups") {
    if (!user) return <LoginPage />;
    return <GroupsPage />;
  }
  if (path === "/groups/detail") {
    if (!user) return <LoginPage />;
    return <GroupDetailPage onBack={() => window.location.assign("/groups")} />;
  }
  if (path === "/messages") {
    if (!user) return <LoginPage />;
    return <MessagesPage />;
  }
  if (path === "/groups/invite") {
    if (!user) return <LoginPage />;
    return <GroupInvitePage />;
  }
  if (path === "/groups/create-post") {
    if (!user) return <LoginPage />;
    return <CreatePostPage />;
  }
  if (path === "/pricing") {
    if (!user) return <LoginPage />;
    return <PricingPage mode="portal" />;
  }
  if (path === "/pricing/interview") {
    if (!user) return <LoginPage />;
    return <PricingPage mode="interview" />;
  }
  if (path === "/pricing/cv") {
    if (!user) return <LoginPage />;
    return <PricingPage mode="cv" />;
  }
  if (path === "/payment/success") {
    if (!user) return <LoginPage />;
    return <PaymentSuccessPage />;
  }
  if (path === "/payment/cancel") {
    if (!user) return <LoginPage />;
    return <PaymentCancelPage />;
  }
  if (path === "/user/settings") {
    if (!user) return <LoginPage />;
    return <SettingsPage />;
  }
  if (path === "/blog" || path.startsWith("/blog/")) {
    return <BlogPage type="internal" />;
  }
  if (path === "/news" || path.startsWith("/news/")) {
    return <BlogPage type="external" />;
  }

  return <NotFoundPage />;
}

function ConditionalChatBubble() {
  const { user } = useAuth();

  // Hide chat bubble for admin role
  if (user?.role === "admin") {
    return null;
  }

  return <CustomerSupportBubble />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <IdleTimeoutProvider>
          <MaintenanceGate>
            <Router />
            <ConditionalChatBubble />
          </MaintenanceGate>
        </IdleTimeoutProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}





