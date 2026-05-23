export function errorMiddleware(error, _request, response, _next) {
  console.error(error);
  response.status(error.status ?? 500).json({
    error:
      error.status === 503
        ? "Chưa cấu hình DATABASE_URL."
        : (error.message ?? "Máy chủ đang gặp lỗi."),
  });
}
