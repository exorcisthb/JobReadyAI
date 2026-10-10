import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { useUserNavItems } from "@/pages/User/user-nav-items";
import { useTranslation } from "react-i18next";import { useAuth } from "@/components/auth-provider";

export function PaymentCancelPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const navItems = useUserNavItems();

  const handleLogout = () => {
    logout();
    window.location.assign("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <DashboardHeader
        navItems={navItems}
        activePath="/pricing"
        role="user"
        onLogout={handleLogout}
      />

      <main
        className="px-4 pb-16 pt-16 sm:px-6"
        style={{ paddingLeft: "calc(var(--sidebar-width, 0px) + clamp(1rem, 2.5vw, 1.5rem))" }}
      >
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Cancel Header with Gradient */}
            <div className="bg-gradient-to-r from-slate-500 to-slate-600 p-5 sm:p-8 text-white text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm mb-4"
              >
                <XCircle className="h-12 w-12" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-2">
                {t("payment.cancel.title")}
              </h1>
              <p className="text-slate-100 text-lg">
                {t("payment.cancel.subtitle")}
              </p>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-8">
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 mb-6">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground mb-2">
                    {t("payment.cancel.noCharge")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("payment.cancel.description")}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6 p-6 rounded-xl bg-muted/30 border border-border/40">
                <h3 className="text-sm font-bold text-foreground">
                  {t("payment.cancel.helpTitle")}
                </h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{t("payment.cancel.help1")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{t("payment.cancel.help2")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{t("payment.cancel.help3")}</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate("/user/pricing")}
                  className="flex-1 rounded-xl bg-primary text-primary-foreground py-3.5 text-sm font-bold hover:opacity-90 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  {t("payment.cancel.tryAgain")}
                </button>
                <button
                  onClick={() => navigate("/user/dashboard")}
                  className="flex-1 rounded-xl border border-border bg-muted/30 py-3.5 text-sm font-semibold hover:bg-muted transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("payment.cancel.backToDashboard")}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      </main>
    </div>
  );
}
