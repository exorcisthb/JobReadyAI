export function getRequestIp(request) {
  const forwardedFor = request.headers["x-forwarded-for"];
  const rawIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(",")[0];
  return (rawIp || request.ip || request.socket?.remoteAddress || "")
    .trim()
    .replace(/^::ffff:/, "") || null;
}
