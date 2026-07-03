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
 * Load user's language preference from API
 * Should be called after user authentication
 */
export async function loadUserLanguage(userId: string) {
  try {
    const response = await fetch("/api/auth/language", {
      headers: {
        "x-user-id": userId,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const language = data.language || "vi";
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
 * Update user's language preference in API
 * Should be called when user changes language in settings
 */
export async function updateUserLanguage(userId: string, language: "vi" | "en") {
  try {
    const response = await fetch("/api/auth/language", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId,
      },
      body: JSON.stringify({ language }),
    });

    if (response.ok) {
      await i18n.changeLanguage(language);
      return true;
    }
  } catch (error) {
    console.error("Failed to update user language:", error);
  }
  
  return false;
}

export default i18n;
