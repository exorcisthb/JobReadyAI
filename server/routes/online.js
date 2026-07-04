import express from "express";
import { getOnlineUserIds, trackActivity } from "../utils/authUtils.js";
const router = express.Router();

// GET /api/online/ids — returns array of online user IDs (public, no auth needed)
router.get("/online/ids", (_req, res) => {
  res.json({ onlineIds: getOnlineUserIds() });
});

// POST /api/online/heartbeat — client marks itself as online (auth required)
router.post("/online/heartbeat", (req, res) => {
  const userId = req.headers["x-user-id"];
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  trackActivity(userId);
  res.json({ ok: true });
});

export default router;
