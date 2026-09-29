// ─── CORS Configuration (Centralized) ──────────────────────────────────────────
// Single source of truth for allowed origins and CORS options.
// Used by server/index.js and server/middleware/ErrorMiddleware.js

const configuredOrigins = (process.env.ALLOWED_ORIGINS || "https://jobreadyai.vn,https://www.jobreadyai.vn,https://*.vercel.app,http://localhost:3000,http://localhost:5173")
  .split(",").map((origin) => origin.trim()).filter(Boolean);
export const allowedOrigins = configuredOrigins;

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow same-origin requests (no Origin header) and known origins
    const hostname = origin ? new URL(origin).hostname : "";
    const allowsVercelPreviews = allowedOrigins.includes("https://*.vercel.app");
    const isVercelPreview = allowsVercelPreviews && origin?.startsWith("https://") && hostname.endsWith(".vercel.app");
    if (!origin || allowedOrigins.includes(origin) || isVercelPreview) {
      return callback(null, true);
    }
    console.error(`[CORS] Blocked origin: "${origin}". Allowed origins:`, allowedOrigins);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-user-id", "x-user-role"],
};
