import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import i18n from "./i18n";
import App from "./App";
import "./styles.css";

const root = createRoot(document.getElementById("root")!);
const render = () => root.render(<StrictMode><App /></StrictMode>);

if (i18n.isInitialized) {
  render();
} else {
  i18n.on("initialized", render);
}
