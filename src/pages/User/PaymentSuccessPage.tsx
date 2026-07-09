import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, PartyPopper, ArrowRight, Home } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { useUserNavItems } from "@/pages/User/user-nav-items";
import { useTranslation } from "react-i18next";import { useAuth } from "@/components/auth-provider";

export function PaymentSuccessPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderStatus, setOrderStatus] = useState<"loading" | "success" | "pending">("loading");
  const [countdown, setCountdown] = useState(3);
  const { logout } = useAuth();
  const navItems = useUserNavItems();

  const handleLogout = () => {
    logout();
    window.location.assign("/");
  };

  const orderCode = searchParams.get("orderCode");

  useEffect(() => {
    if (orderStatus !== "success") return;

    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/user/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orderStatus, navigate]);

  useEffect(() => {
    if (!orderCode) {
      setOrderStatus("pending");
      return;
    }

    const checkOrder = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        const response = await fetch(`/api/payment/check/${orderCode}`, {
          headers: {
            "x-user-id": userId || "",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.order?.status === "paid") {
            setOrderStatus("success");
            return true;
          }
        }
      } catch (error) {
        console.error("Error checking order:", error);
      }
      return false;
    };

    // First check immediate
    void checkOrder();

    // Poll every 3 seconds
    const interval = setInterval(async () => {
      const isPaid = await checkOrder();
      if (isPaid) {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderCode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <DashboardHeader
        navItems={navItems}
        activePath="/pricing"
        role="user"
        onLogout={handleLogout}
      />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {orderStatus === "loading" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-3xl shadow-2xl p-12 text-center"
            >
              <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-6" />
              <h1 className="text-2xl font-bold mb-2">{t("payment.success.checking")}</h1>
              <p className="text-muted-foreground">
                {t("payment.success.verifying")}
              </p>
            </motion.div>
          ) : orderStatus === "success" ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Success Header with Gradient */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm mb-4"
                >
                  <PartyPopper className="h-12 w-12" />
                </motion.div>
                <h1 className="text-3xl font-bold mb-2">
                  {t("payment.success.title")}
                </h1>
                <p className="text-emerald-50 text-lg">
                  {t("payment.success.subtitle")}
                </p>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 mb-6">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
                      {t("payment.success.activated")}
                    </p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
                      {t("payment.success.description")}
                    </p>
                  </div>
                </div>

                {orderCode && (
                  <div className="rounded-xl bg-muted/30 border border-border/40 p-4 mb-6">
                    <p className="text-xs text-muted-foreground mb-1">
                      {t("payment.success.orderCode")}
                    </p>
                    <p className="text-sm font-mono font-bold text-foreground">
                      {orderCode}
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate("/user/pricing")}
                    className="flex-1 rounded-xl bg-primary text-primary-foreground py-3.5 text-sm font-bold hover:opacity-90 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {t("payment.success.viewPlans")}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => navigate("/user/dashboard")}
                    className="flex-1 rounded-xl border border-border bg-muted/30 py-3.5 text-sm font-semibold hover:bg-muted transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    {t("payment.success.backToDashboard")} {countdown > 0 && `(${countdown}s)`}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-3xl shadow-2xl p-12 text-center"
            >
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 mx-auto mb-6">
                <Loader2 className="h-10 w-10" />
              </div>
              <h1 className="text-2xl font-bold mb-2">
                {t("payment.success.processing")}
              </h1>
              <p className="text-muted-foreground mb-6">
                {t("payment.success.waitingConfirmation")}
              </p>
              <button
                onClick={() => navigate("/user/dashboard")}
                className="rounded-xl bg-primary text-primary-foreground px-6 py-3 text-sm font-bold hover:opacity-90 transition-all duration-300 cursor-pointer"
              >
                {t("payment.success.backToDashboard")}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
