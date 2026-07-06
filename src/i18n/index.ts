import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import vi from "./locales/vi.json";
import en from "./locales/en.json";

i18n
  .use(initReactI18next)
  .init({
    resources: { vi: { translation: vi }, en: { translation: en } },
    lng: "vi", // Default to Vietnamese, will be updated when user info loads
    fallbackLng: "vi",
    interpolation: { escapeValue: false },
  });

/**
 * Load user's language preference from localStorage first, then API
 * Should be called after user authentication
 */
export async function loadUserLanguage(userId: string) {
  try {
    // Check localStorage first for instant load
    const cachedLang = localStorage.getItem(`user_${userId}_language`);
    if (cachedLang && (cachedLang === "vi" || cachedLang === "en")) {
      await i18n.changeLanguage(cachedLang);
      // Still fetch from API in background to sync
      fetch("/api/auth/language", {
        headers: { "x-user-id": userId },
      })
        .then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            const language = data.language || "vi";
            if (language !== cachedLang) {
              // Update if server has different value
              localStorage.setItem(`user_${userId}_language`, language);
              await i18n.changeLanguage(language);
            }
          }
        })
        .catch(console.error);
      return cachedLang;
    }
    
    // If no cache, fetch from API
    const response = await fetch("/api/auth/language", {
      headers: {
        "x-user-id": userId,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const language = data.language || "vi";
      localStorage.setItem(`user_${userId}_language`, language);
      await i18n.changeLanguage(language);
      return language;
    }
  } catch (error) {
    console.error("Failed to load user language:", error);
  }
  
  // Fallback to Vietnamese if API fails
  await i18n.changeLanguage("vi");
  return "vi";
}

/**
 * Update user's language preference in API and localStorage
 * Should be called when user changes language in settings
 */
export async function updateUserLanguage(userId: string, language: "vi" | "en") {
  try {
    // Change language immediately in memory
    await i18n.changeLanguage(language);
    
    // Save to localStorage for instant access on next page
    localStorage.setItem(`user_${userId}_language`, language);
    
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
