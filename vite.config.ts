import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  esbuild: {
    drop: process.env.NODE_ENV === "production" ? ["console", "debugger"] : [],
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:3001",
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            if (err.message.includes("ECONNREFUSED")) {
              console.log("⏳ [Vite Proxy] Đang chờ Express server (port 3001) khởi động...");
            } else {
              console.error("Proxy error:", err);
            }
          });
        },
      },
      "/uploads": {
        target: process.env.VITE_API_URL || "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
