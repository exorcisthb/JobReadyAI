"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import i18n, { updateUserLanguage } from "@/i18n";
import { Type, Lock, ChevronRight, Globe } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard-header";
import { useUserNavItems } from "@/pages/User/user-nav-items";
import { useAuth } from "@/components/auth-provider";
import ChangePasswordModal from "@/pages/Common/ChangePasswordModal";

function DisplaySettings() {
  const { t } = useTranslation();
  const [scale, setScale] = useState(() => {
    try { return parseFloat(localStorage.getItem("jobready_font_scale") || "1"); }
    catch { return 1; }
  });

  useEffect(() => {
    document.documentElement.style.fontSize = `${scale * 100}%`;
  }, []);

  const apply = (val: number) => {
    const clamped = Math.min(2, Math.max(0.5, Math.round(val * 100) / 100));
    setScale(clamped);
    document.documentElement.style.fontSize = `${clamped * 100}%`;
    try { localStorage.setItem("jobready_font_scale", String(clamped)); } catch { /* ignore */ }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-xl font-bold mb-1">{t("display.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("display.subtitle")}</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <div>
          <p className="font-semibold text-sm mb-1">{t("display.fontSize")}</p>
          <p className="text-xs text-muted-foreground mb-5">{t("display.sliderHint")}</p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => apply(scale - 0.05)}
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-xl font-bold hover:bg-muted transition shrink-0"
            >−</button>

            <div className="flex-1 relative h-2 bg-muted rounded-full cursor-pointer">
              <div
                className="absolute left-0 top-0 h-2 bg-primary rounded-full transition-all"
                style={{ width: `${((scale - 0.5) / 1.5) * 100}%` }}
              />
              <input
                type="range" min={0.5} max={2} step={0.05}
                value={scale}
                onChange={e => apply(parseFloat(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
              />
            </div>

            <button
              onClick={() => apply(scale + 0.05)}
              className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-xl font-bold hover:bg-muted transition shrink-0"
            >+</button>

            <span className="w-14 text-center font-bold text-primary text-sm border border-border rounded-xl py-1.5 shrink-0">
              {Math.round(scale * 100)}%
            </span>

            <button
              onClick={() => apply(1)}
              className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-muted transition font-medium shrink-0"
            >{t("display.reset")}</button>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-muted/40 border border-border">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-semibold">{t("display.preview")}</p>
            <p style={{ fontSize: `${scale}em` }} className="font-medium leading-relaxed">
              {t("display.previewText")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const isOAuth = user?.provider === "google" || user?.provider === "facebook";

  const handleSendOTP = useCallback(async () => {
    const res = await fetch("/api/auth/change-password/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user?.id || "",
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || t("security.sendOtpFailed"));
  }, [user?.id, t]);

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-xl font-bold mb-1">{t("security.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("security.subtitle")}</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">{t("security.password")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isOAuth
                ? "Tài khoản đăng nhập bằng Facebook / Google được xác thực trực tiếp qua nhà cung cấp, không sử dụng mật khẩu trên hệ thống."
                : t("security.passwordDesc")}
            </p>
          </div>
          {!isOAuth && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition cursor-pointer"
            >
              {t("security.changePassword")}
            </button>
          )}
        </div>
      </div>

      {!isOAuth && (
        <ChangePasswordModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSendOTP={handleSendOTP}
          userEmail={user?.email}
          onSuccess={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

function LanguageSettings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [updating, setUpdating] = useState(false);

  const currentLang = i18n.language?.startsWith("en") ? "en" : "vi";

  const LANGS = [
    {
      id: "vi" as const,
      label: t("language.vi"),
      flag: "🇻🇳",
      desc: t("language.viDesc"),
    },
    {
      id: "en" as const,
      label: t("language.en"),
      flag: "🇺🇸",
      desc: t("language.enDesc"),
    },
  ];

  const handleChangeLanguage = async (languageId: "vi" | "en") => {
    if (!user?.id || updating) return;
    
    setUpdating(true);
    try {
      const success = await updateUserLanguage(user.id, languageId);
      if (!success) {
        console.error("Failed to update language preference");
      }
    } catch (error) {
      console.error("Error updating language:", error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-xl font-bold mb-1">{t("language.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("language.subtitle")}</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
        {LANGS.map(({ id, label, flag, desc }) => (
          <button
            key={id}
            onClick={() => handleChangeLanguage(id)}
            disabled={updating}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl border-2 transition text-left ${
              (currentLang === id)
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-muted"
            } ${updating ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span className="text-3xl">{flag}</span>
            <div className="flex-1">
              <p className={`font-semibold text-sm ${currentLang === id ? "text-primary dark:text-[#a78bfa]" : "text-foreground"}`}>
                {label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </div>
            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
              currentLang === id ? "border-primary" : "border-border"
            }`}>
              {currentLang === id && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [active, setActive] = useState("display");

  const handleLogout = useCallback(() => {
    logout();
    window.location.assign("/");
  }, [logout]);

  const MENU_ITEMS = [
    { id: "display", label: t("settings.display"), icon: Type },
    { id: "security", label: t("settings.security"), icon: Lock },
    { id: "language", label: t("settings.language"), icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader
        navItems={useUserNavItems()}
        activePath="/user/settings"
        role="user"
        onLogout={handleLogout}
      />

      <main className="pt-16 min-h-screen">
        <div
          className="flex min-h-[calc(100vh-64px)]"
          style={{ paddingLeft: "var(--sidebar-width)" }}
        >
          <aside className="w-64 shrink-0 border-r border-border bg-card/50 p-4 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
              {t("settings.title")}
            </p>
            {MENU_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  active === id
                    ? "bg-primary/10 text-primary dark:text-[#a78bfa]"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
                <ChevronRight className={`h-4 w-4 transition-transform ${active === id ? "rotate-90 text-primary" : "text-muted-foreground"}`} />
              </button>
            ))}
          </aside>

          <div className="flex-1 p-8">
            {active === "display" && <DisplaySettings />}
            {active === "security" && <SecuritySettings />}
            {active === "language" && <LanguageSettings />}
          </div>
        </div>
      </main>
    </div>
  );
}
