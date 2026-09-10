import { createClerkClient } from "@clerk/backend";

let _clerk = null;

function getClerk() {
  if (!_clerk) {
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      throw new Error("CLERK_SECRET_KEY is not set in environment variables.");
    }
    _clerk = createClerkClient({ secretKey });
  }
  return _clerk;
}

/**
 * Middleware: Verify Clerk JWT token from Authorization header.
 * If valid, attaches req.clerkUserId (the verified Clerk user ID).
 * Rejects with 401 if token is missing or invalid.
 */
export async function verifyClerkToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Missing or invalid Authorization header.",
      });
    }

    const token = authHeader.slice(7); // Remove "Bearer "
    const clerk = getClerk();

    // Verify the session token
    const payload = await clerk.verifyToken(token);

    if (!payload || !payload.sub) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Invalid Clerk token.",
      });
    }

    // Attach verified clerkId to request (cannot be spoofed)
    req.clerkUserId = payload.sub;
    next();
  } catch (err) {
    console.error("[verifyClerkToken] Token verification failed:", err.message);
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Clerk token verification failed.",
    });
  }
}
