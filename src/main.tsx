// Theme initialization (must run before React mounts to prevent FOUC)
import "./theme-init";
// Facebook SDK initialization
import "./fb-sdk-init";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import i18n from "./i18n";
import App from "./App";
import "./styles.css";
import { ClerkProvider } from "@clerk/clerk-react";

// Keep the app's existing relative API calls working in development and production.
// Vercel builds point VITE_API_URL at the separately hosted Express service.
const apiBaseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "");
if (apiBaseUrl) {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    if (typeof input === "string" && (input.startsWith("/api/") || input.startsWith("/uploads/"))) {
      input = `${apiBaseUrl}${input}`;
      init = { credentials: "include", ...init };
    }
    return nativeFetch(input, init);
  };
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkEnabled = Boolean(PUBLISHABLE_KEY && (PUBLISHABLE_KEY.startsWith("pk_test_") || PUBLISHABLE_KEY.startsWith("pk_live_")));

const root = createRoot(document.getElementById("root")!);
const render = () =>
  root.render(
    <StrictMode>
      {isClerkEnabled ? (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY!} afterSignOutUrl="/">
          <App />
        </ClerkProvider>
      ) : (
        <App />
      )}
    </StrictMode>,
  );

if (i18n.isInitialized) {
  render();
} else {
  i18n.on("initialized", render);
}
