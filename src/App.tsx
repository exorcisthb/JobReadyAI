import { lazy, Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { IdleTimeoutProvider } from "@/components/idle-timeout-provider";
import { BlogPage, prefetchBlogPosts } from "@/pages/Common/BlogPage";
const ForgotPasswordPage = lazy(() => import("@/pages/Common/ForgotPasswordPage").then((module) => ({ default: module.ForgotPasswordPage })));
const HomePage = lazy(() => import("@/pages/Common/HomePage").then((module) => ({ default: module.HomePage })));
const LoginPage = lazy(() => import("@/pages/Common/LoginPage").then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import("@/pages/Common/RegisterPage").then((module) => ({ default: module.RegisterPage })));
const NotFoundPage = lazy(() => import("@/pages/Common/NotFoundPage").then((module) => ({ default: module.NotFoundPage })));
const CompleteProfilePage = lazy(() => import("@/pages/Common/CompleteProfilePage").then((module) => ({ default: module.CompleteProfilePage })));
const PrivacyPolicyPage = lazy(() => import("@/pages/Common/PrivacyPolicyPage").then((module) => ({ default: module.PrivacyPolicyPage })));
const AdminDashboard = lazy(() => import("@/pages/Admin/AdminDashboard"));
const UserManagementPage = lazy(() => import("@/pages/Admin/UserManagementPage"));
const CreateContentManager = lazy(() => import("@/pages/Admin/CreateContentManager"));
const FinanceDashboardPage = lazy(() => import("@/pages/Admin/FinanceDashboardPage"));
const SecurityAdminPage = lazy(() => import("@/pages/Admin/SecurityAdminPage"));
const MaintenanceAdminPage = lazy(() => import("@/pages/Admin/MaintenanceAdminPage"));
const GroupModerationPage = lazy(() => import("@/pages/Manager/GroupModerationPage"));
const ArticleManagementPage = lazy(() => import("@/pages/Manager/ArticleManagementPage"));
const NewsManagementPage = lazy(() => import("@/pages/Manager/NewsManagementPage"));
const UserActivityAdminPage = lazy(() => import("@/pages/Admin/UserActivityAdminPage"));
const PromotionsAdminPage = lazy(() => import("@/pages/Admin/PromotionsAdminPage").then((module) => ({ default: module.PromotionsAdminPage })));
import { PromotionalBanner } from "@/components/PromotionalBanner";
import { DiscountOfferPopup } from "@/components/DiscountOfferPopup";

const UserDashboard = lazy(() => import("@/pages/User/UserDashboard"));
const CMDashboard = lazy(() => import("@/pages/Manager/CMDashboard"));
const InterviewSetupPage = lazy(() => import("@/pages/User/InterviewSetupPage"));
const InterviewPositionsPage = lazy(() => import("@/pages/User/InterviewSetupPage").then((module) => ({ default: module.InterviewPositionsPage })));
const InterviewSessionPage = lazy(() => import("@/pages/User/InterviewSessionPage"));
const InterviewPersonaSelectPage = lazy(() => import("@/pages/User/InterviewPersonaSelectPage"));
const InterviewHistoryPage = lazy(() => import("@/pages/User/InterviewHistoryPage"));
const InterviewResultPage = lazy(() => import("@/pages/User/InterviewResultPage"));
const ProfilePageWrapper = lazy(() => import("@/pages/Common/ProfilePageWrapper"));
const ViewProfilePage = lazy(() => import("@/pages/Common/ViewProfilePage"));
const CVListPage = lazy(() => import("@/pages/User/CVListPage"));
const CVBuilderPage = lazy(() => import("@/pages/User/CVBuilderPage"));
const CVPreviewPage = lazy(() => import("@/pages/User/CVPreviewPage"));
const CVPrintPage = lazy(() => import("@/pages/CVPrintPage"));
const DraftCVPage = lazy(() => import("@/pages/User/DraftCVPage"));
const GroupsPage = lazy(() => import("@/pages/User/GroupsPage"));
const GroupDetailPage = lazy(() => import("@/pages/User/GroupDetailPage"));
const GroupInvitePage = lazy(() => import("@/pages/User/GroupInvitePage"));
const CreatePostPage = lazy(() => import("@/pages/User/CreatePostPage"));
const CreateArticle = lazy(() => import("@/pages/Manager/CreateArticle"));
const PricingPage = lazy(() => import("@/pages/User/PricingPage"));
const PaymentSuccessPage = lazy(() => import("@/pages/User/PaymentSuccessPage").then((module) => ({ default: module.PaymentSuccessPage })));
const PaymentCancelPage = lazy(() => import("@/pages/User/PaymentCancelPage").then((module) => ({ default: module.PaymentCancelPage })));
const MessagesPage = lazy(() => import("@/pages/User/MessagesPage"));
const SettingsPage = lazy(() => import("@/pages/User/SettingsPage"));
import { CustomerSupportBubble } from "@/components/CustomerSupportBubble";
import { MaintenancePage } from "@/components/ui/maintenance-page";
import { useHeartbeat } from "@/hooks/useHeartbeat";

type MaintenanceState = {
  enabled: boolean;
  message: string;
};

function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
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

  const currentPath = location.pathname.replace(/\/$/, "") || "/";
  const publicPaths = ["/", "/login", "/register", "/authentication/login", "/authentication/register", "/authentication/forgot-password", "/chinh-sach"];
  const isPublicPath = publicPaths.includes(currentPath) || currentPath.startsWith("/blog") || currentPath.startsWith("/news");

  if (maintenance?.enabled && user?.role === "user" && !user.isTestUser && !isPublicPath) {
    return <MaintenancePage message={maintenance.message} />;
  }

  return <>{children}</>;
}

function Router() {
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname.replace(/\/$/, "") || "/";

  useHeartbeat();

  useEffect(() => {
    if (user?.id && user.role === "user") {
      void prefetchBlogPosts(user.id, user.role);
    }
  }, [user?.id, user?.role]);

  // Keep this list at the router boundary so every role uses the same rule:
  // no active browser session means no private page can render from a copied URL.
  const isProtectedPath =
    [
      "/complete-profile", "/dashboard",
      "/admin/dashboard", "/admin/users", "/admin/groups", "/admin/finance",
      "/admin/security", "/admin/maintenance", "/admin/user-activity", "/admin/create-content-manager",
      "/content/articles/new", "/user/dashboard", "/content-manager/dashboard",
      "/content-manager/groups", "/content-manager/articles", "/content-manager/news",
      "/interview/setup", "/interview/persona", "/interview/session", "/interview/history",
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
  if (path === "/admin/promotions") {
    if (!user || user.role !== "admin") return <NotFoundPage />;
    return <PromotionsAdminPage />;
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
  if (path === "/interview/setup") {
    if (!user || user.role !== "user") return <NotFoundPage />;
    return <InterviewSetupPage />;
  }
  if (path === "/interview/positions") {
    if (!user || user.role !== "user") return <NotFoundPage />;
    return <InterviewPositionsPage />;
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
    return <BlogPage key="blog-career" type="internal" />;
  }
  const interviewResultMatch = path.match(/^\/interview\/result\/([^/]+)$/);
  if (interviewResultMatch) {
    if (!user || user.role !== "user") return <NotFoundPage />;
    return <InterviewResultPage sessionId={interviewResultMatch[1]} />;
  }
  if (path === "/news" || path.startsWith("/news/")) {
    return <BlogPage key="press-news" type="external" />;
  }

  return <NotFoundPage />;
}

function ConditionalChatBubble() {
  const { user } = useAuth();
  const location = useLocation();

  // Hide chat bubble for admin role
  if (user?.role === "admin" || ["/interview/setup", "/interview/positions"].includes(location.pathname)) {
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
            <PromotionalBanner />
            <DiscountOfferPopup />
            <Suspense
              fallback={(
                <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground" role="status">
                  Đang tải trang...
                </div>
              )}
            >
              <Router />
            </Suspense>
            <ConditionalChatBubble />
          </MaintenanceGate>
        </IdleTimeoutProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}





