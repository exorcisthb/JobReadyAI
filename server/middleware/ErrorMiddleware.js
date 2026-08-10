import { allowedOrigins } from "../config/cors.js";

export function errorMiddleware(error, request, response, _next) {
  console.error("Error occurred:", error);
  
  // SECURITY FIX (OWASP ZAP): Only set CORS headers when Origin is valid
  // Do NOT emit Access-Control-Allow-Origin: * with credentials enabled
  const origin = request.headers.origin;
  
  // Only set CORS headers if:
  // 1. Origin header is present AND is in the allowlist, OR
  // 2. No Origin header (same-origin request)
  if (origin && allowedOrigins.includes(origin)) {
    // Valid origin — reflect it back
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-user-id, x-user-role");
  } else if (!origin) {
    // Same-origin request (no Origin header) — no CORS headers needed
    // Do nothing — browser will allow same-origin response
  } else {
    // Invalid origin — do NOT set Access-Control-Allow-Origin
    // Browser will block the response due to CORS policy
    console.error(`[ErrorMiddleware] Blocked invalid origin: "${origin}". Allowed origins:`, allowedOrigins);
  }
  
  const status = error.status ?? 500;
  const message = error.status === 503
    ? "Chưa cấu hình DATABASE_URL."
    : (error.message ?? "Máy chủ đang gặp lỗi.");
  
  response.status(status).json({ error: message });
}
