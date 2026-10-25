import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from "node:fs";

const vadAssets = {
  "vad.worklet.bundle.min.js": "@ricky0123/vad-web/dist/vad.worklet.bundle.min.js",
  "silero_vad_v5.onnx": "@ricky0123/vad-web/dist/silero_vad_v5.onnx",
  "ort-wasm-simd-threaded.mjs": "onnxruntime-web/dist/ort-wasm-simd-threaded.mjs",
  "ort-wasm-simd-threaded.wasm": "onnxruntime-web/dist/ort-wasm-simd-threaded.wasm",
};

export default defineConfig({
  plugins: [react(), {
    name: "interview-vad-assets",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const name = req.url?.split("?")[0]?.replace(/^\/vad\//, "");
        const asset = name && vadAssets[name as keyof typeof vadAssets];
        if (!req.url?.startsWith("/vad/") || !asset) return next();
        res.setHeader("Content-Type", name.endsWith(".wasm") ? "application/wasm" : name.endsWith(".onnx") ? "application/octet-stream" : "text/javascript");
        fs.createReadStream(path.resolve("node_modules", asset)).pipe(res);
      });
    },
    generateBundle() {
      for (const [name, asset] of Object.entries(vadAssets)) {
        this.emitFile({ type: "asset", fileName: `vad/${name}`, source: fs.readFileSync(path.resolve("node_modules", asset)) });
      }
    },
  }],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/lucide-react/dist/esm/icons/")) {
            return "lucide-icons";
          }
          if (id.includes("node_modules/@clerk/")) {
            return "clerk-vendor";
          }
          if (id.includes("node_modules/@radix-ui/")) {
            return "radix-vendor";
          }
        },
      },
    },
  },
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
