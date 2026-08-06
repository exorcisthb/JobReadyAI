import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import vi from "./locales/vi.json";
import en from "./locales/en.json";

const GUEST_LANG_KEY = "jobready_guest_language";

/** Đọc ngôn ngữ guest từ localStorage (trước khi đăng nhập) */
function getGuestLanguage(): "vi" | "en" {
  try {
    const lang = localStorage.getItem(GUEST_LANG_KEY);
    if (lang === "vi" || lang === "en") return lang;
  } catch {
    /* ignore */
  }
  return "vi";
}

i18n
  .use(initReactI18next)
  .init({
    resources: { vi: { translation: vi }, en: { translation: en } },
    lng: getGuestLanguage(), // Đọc từ localStorage ngay khi khởi động
    fallbackLng: "vi",
    interpolation: { escapeValue: false },
  });

/**
 * Đổi ngôn ngữ cho guest (không cần đăng nhập).
 * Lưu vào localStorage để nhớ qua các lần reload / tab mới.
 */
export async function setGuestLanguage(lang: "vi" | "en") {
  try {
    localStorage.setItem(GUEST_LANG_KEY, lang);
  } catch {
    /* ignore */
  }
  await i18n.changeLanguage(lang);
}

/**
 * Load user's language preference from localStorage first, then API.
 * Should be called after user authentication.
 * Falls back to guest_language if user has no preference saved.
 */
export async function loadUserLanguage(userId: string) {
  try {
    // Check user-specific localStorage first for instant load
    const cachedLang = localStorage.getItem(`user_${userId}_language`);
    if (cachedLang && (cachedLang === "vi" || cachedLang === "en")) {
      await i18n.changeLanguage(cachedLang);
      // Sync guest_language so logout keeps the same lang
      try { localStorage.setItem(GUEST_LANG_KEY, cachedLang); } catch { /* ignore */ }
      // Still fetch from API in background to sync
      fetch("/api/auth/language", {
        headers: { "x-user-id": userId },
      })
        .then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            const language = data.language || "vi";
            if (language !== cachedLang) {
              localStorage.setItem(`user_${userId}_language`, language);
              try { localStorage.setItem(GUEST_LANG_KEY, language); } catch { /* ignore */ }
              await i18n.changeLanguage(language);
            }
          }
        })
        .catch(console.error);
      return cachedLang;
    }

    // If no user cache, fetch from API
    const response = await fetch("/api/auth/language", {
      headers: { "x-user-id": userId },
    });

    if (response.ok) {
      const data = await response.json();
      // If server has no preference, fall back to guest_language
      const guestLang = getGuestLanguage();
      const language = (data.language && data.language !== "vi") ? data.language : guestLang;
      localStorage.setItem(`user_${userId}_language`, language);
      try { localStorage.setItem(GUEST_LANG_KEY, language); } catch { /* ignore */ }
      await i18n.changeLanguage(language);
      return language;
    }
  } catch (error) {
    console.error("Failed to load user language:", error);
  }

  // Fallback to guest_language, then "vi"
  const fallback = getGuestLanguage();
  await i18n.changeLanguage(fallback);
  return fallback;
}

/**
 * Update user's language preference in API and localStorage.
 * Should be called when user changes language in settings.
 */
export async function updateUserLanguage(userId: string, language: "vi" | "en") {
  try {
    // Change language immediately in memory
    await i18n.changeLanguage(language);

    // Save to localStorage (both user-specific and guest key for logout continuity)
    localStorage.setItem(`user_${userId}_language`, language);
    try { localStorage.setItem(GUEST_LANG_KEY, language); } catch { /* ignore */ }

    // Save to database for persistence across devices
    const response = await fetch("/api/auth/language", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
      body: JSON.stringify({ language }),
    });

    if (response.ok) {
      return true;
    }
  } catch (error) {
    console.error("Failed to update user language:", error);
  }

  return false;
}

export default i18n;
