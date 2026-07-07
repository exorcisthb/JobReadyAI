export function errorMiddleware(error, request, response, _next) {
  console.error("Error occurred:", error);
  
  // Always set CORS headers for error responses to prevent CORS errors in browser
  const origin = request.headers.origin;
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.RENDER_EXTERNAL_URL,
    "http://localhost:3000",
    "http://localhost:3001",
  ].filter(Boolean);
  
  if (!origin || allowedOrigins.includes(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin || "*");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-user-id, x-user-role");
  }
  
  const status = error.status ?? 500;
  const message = error.status === 503
    ? "Chưa cấu hình DATABASE_URL."
    : (error.message ?? "Máy chủ đang gặp lỗi.");
  
  response.status(status).json({ error: message });
}
