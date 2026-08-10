// ─── CORS Configuration (Centralized) ──────────────────────────────────────────
// Single source of truth for allowed origins and CORS options.
// Used by server/index.js and server/middleware/ErrorMiddleware.js

export const allowedOrigins = [
  process.env.FRONTEND_URL,              // e.g. https://jobready.ai (custom domain)
  process.env.RENDER_EXTERNAL_URL,       // e.g. https://jobreadyai-xxxx.onrender.com (auto-set by Render)
  "https://jobreadyai.vn",               // Hard-coded production domain (fallback nếu env var thiếu/sai)
  "https://www.jobreadyai.vn",           // Phòng trường hợp có bản www
  "http://localhost:3000",               // Frontend Vite dev server
  "http://localhost:3001",               // Server port (same-origin)
].filter(Boolean);

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow same-origin requests (no Origin header) and known origins
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.error(`[CORS] Blocked origin: "${origin}". Allowed origins:`, allowedOrigins);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-user-id", "x-user-role"],
};
