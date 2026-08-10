// Theme initialization script
// Moved from inline <script> in index.html to avoid CSP 'unsafe-inline'
// This runs before React mounts to prevent FOUC (flash of unstyled content)

(function () {
  // Migration: reset theme về light nếu chưa có version mới
  const VER = "v2-light";
  if (localStorage.getItem("theme-ver") !== VER) {
    localStorage.removeItem("homepage-theme");
    localStorage.setItem("theme-ver", VER);
  }
  const t = localStorage.getItem("homepage-theme");
  if (t === "dark") {
    document.documentElement.classList.add("dark");
  } else if (t === "rose") {
    document.documentElement.classList.add("rose");
  }
  // else: light theme (no class needed)
})();
