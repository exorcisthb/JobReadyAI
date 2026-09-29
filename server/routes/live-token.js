import express from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();
const apiKey = process.env.GEMINI_API_KEY;
const limiter = rateLimit({
  windowMs: 60_000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip || "unknown"),
});

router.post("/live-token", limiter, async (req, res, next) => {
  if (!req.header("x-user-id")) return res.status(401).json({ error: "Unauthorized" });
  if (!apiKey) return res.status(503).json({ error: "Gemini Live is not configured." });

  try {
    const ai = new GoogleGenAI({ apiKey });
    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        newSessionExpireTime: new Date(Date.now() + 60 * 1000).toISOString(),
        liveConnectConstraints: { model: "models/gemini-2.5-flash-native-audio-latest" },
      },
    });
    res.json({ token: token.name });
  } catch (error) {
    next(error);
  }
});

export default router;
