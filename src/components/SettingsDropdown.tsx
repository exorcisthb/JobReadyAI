import { useEffect, useRef, useState } from "react";
import { Check, Globe, Moon, Palette, Settings, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/components/theme-provider";
import { setGuestLanguage, updateUserLanguage } from "@/i18n";

export function SettingsDropdown({ userId }: { userId?: string }) {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const currentLang = i18n.language?.startsWith("en") ? "en" : "vi";

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const changeLanguage = async (language: "vi" | "en") => {
    if (language === currentLang) return;
    if (userId) await updateUserLanguage(userId, language);
    else await setGuestLanguage(language);
    setOpen(false);
  };

  const themeOptions = [
    { id: "light" as const, label: t("header.light"), icon: <Sun className="h-4 w-4 text-amber-500" /> },
    { id: "dark" as const, label: t("header.dark"), icon: <Moon className="h-4 w-4 text-blue-400" /> },
    { id: "rose" as const, label: t("header.rose"), icon: <Palette className="h-4 w-4 text-rose-500" /> },
  ];
  const languages = [
    { id: "vi" as const, label: t("language.vi"), flag: "VN" },
    { id: "en" as const, label: t("language.en"), flag: "US" },
  ];

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-label={t("settings.title")}
        title={t("settings.title")}
        onClick={() => setOpen((value) => !value)}
        className="group flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/85 text-muted-foreground shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-secondary active:scale-95"
      >
        <Settings className="h-4 w-4 fill-primary/35 text-primary transition-transform duration-500 group-hover:rotate-90 [&>circle]:fill-card" />
      </button>
      {open && (
        <div className="absolute right-0 z-[60] mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-card/95 shadow-[var(--shadow-elegant)] backdrop-blur-xl">
          <div className="px-3 pb-1 pt-3">
            <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Palette className="h-3.5 w-3.5 text-purple-500" />{t("settings.display")}
            </p>
            {themeOptions.map((option) => (
              <button key={option.id} type="button" onClick={() => { setTheme(option.id); setOpen(false); }} className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium ${theme === option.id ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                {option.icon}<span className="flex-1 text-left">{option.label}</span>{theme === option.id && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
          <div className="mx-3 my-2 h-px bg-border" />
          <div className="px-3 pb-3">
            <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Globe className="h-3.5 w-3.5 text-blue-500" />{t("settings.language")}
            </p>
            {languages.map((language) => (
              <button key={language.id} type="button" onClick={() => void changeLanguage(language.id)} className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium ${currentLang === language.id ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                <span className={`rounded border px-1.5 py-0.5 text-[10px] font-bold ${language.id === "vi" ? "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400" : "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400"}`}>{language.flag}</span>
                <span className="flex-1 text-left">{language.label}</span>{currentLang === language.id && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
