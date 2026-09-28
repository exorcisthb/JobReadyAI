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
