import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

const API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
].filter(Boolean);

const disabledKeys = new Set();
const keyCooldowns = new Map();
const COOLDOWN_MS = 5_000; // 5s cooldown (giảm từ 60s để xử lý nhanh hơn)

function getAvailableKey() {
  const now = Date.now();
  const usableKeys = API_KEYS.filter(k => !disabledKeys.has(k));
  for (const key of usableKeys) {
    const cooldownUntil = keyCooldowns.get(key) || 0;
    if (now >= cooldownUntil) return key;
  }
  if (usableKeys.length === 0) return null;
  let soonestKey = usableKeys[0];
  let soonestTime = Infinity;
  for (const key of usableKeys) {
    const t = keyCooldowns.get(key) || 0;
    if (t < soonestTime) { soonestTime = t; soonestKey = key; }
  }
  return soonestKey;
}

function markKeyCooldown(key) {
  keyCooldowns.set(key, Date.now() + COOLDOWN_MS);
}

function initializeAI(apiKey) {
  return new GoogleGenerativeAI(apiKey);
}

const GENERATION_CONFIG = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 2048,
};

const SYSTEM_PROMPT = `Bạn là AI Hỗ trợ Khách hàng (Customer Support) của JobReady - một nền tảng AI về việc làm, phỏng vấn, CV tại Việt Nam.

🎯 NHIỆM VỤ CHÍNH:
Hỗ trợ người dùng về CÁC TÍNH NĂNG của website JobReady, bao gồm:

1. 📝 **Tạo CV (CV Builder):**
   - Hướng dẫn tạo CV, chỉnh sửa CV, tải CV
   - Giải thích các mục trong CV builder
   - Gợi ý cách viết CV ấn tượng

2. 🎙️ **Phỏng vấn AI (Interview):**
   - Giải thích các gói phỏng vấn (Free: 2/tuần, Pro: 10/tuần, Ultra: không giới hạn)
   - Hướng dẫn cách phỏng vấn, các bước thực hiện
   - Giải thích điểm số, feedback sau phỏng vấn
   - ⚠️ CHỈ có giọng nói (thâu âm/audio), KHÔNG có camera/quay video

3. 👥 **Tính năng Nhóm/Cộng đồng:**
   - Hướng dẫn tạo nhóm, tham gia nhóm, chat nhóm
   - Tính năng kết bạn, nhắn tin

4. 💳 **Gói dịch vụ & Thanh toán:**
   - So sánh các gói Free/Pro/Ultra
   - Hướng dẫn nâng cấp gói, thanh toán
   - Giải thích hạn mức sử dụng

5. 🔧 **Kỹ thuật & Tài khoản:**
   - Đăng nhập, đăng ký, quên mật khẩu
   - Cập nhật hồ sơ cá nhân
   - Bảo mật tài khoản

⚠️ QUY TẮC ỨNG XỬ:
- Luôn lịch sự, thân thiện như nhân viên CSKH chuyên nghiệp
- Trả lời NGẮN GỌN, DỄ HIỂU, tập trung vào giải pháp
- Nếu không biết câu trả lời, hướng dẫn user liên hệ admin
- KHÔNG tự ý tạo CV hay gợi ý nội dung CV chuyên sâu
- KHÔNG nói về camera, quay video, hay ghi hình trong phỏng vấn AI — chỉ có ghi âm giọng nói
- KHÔNG trả lời câu hỏi ngoài phạm vi website JobReady
- Giọng văn: thân thiện, hỗ trợ, tận tình (như nhân viên CSKH thực thụ)
- Khi cần, có thể dùng emoji nhẹ nhàng để tăng thân thiện`;

/**
 * POST /api/ai/customer-support
 * Body: { message: string, history?: Array<{role, content}> }
 */
router.post("/", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Tin nhắn không được để trống" });
    }

    const chatHistory = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      { role: "model", parts: [{ text: "Chào bạn! Tôi là trợ lý hỗ trợ khách hàng của JobReady. Tôi có thể giúp gì cho bạn về các tính năng trên website?" }] },
    ];

    for (const msg of history) {
      if (msg.role === "user") {
        chatHistory.push({ role: "user", parts: [{ text: msg.content }] });
      } else if (msg.role === "assistant") {
        chatHistory.push({ role: "model", parts: [{ text: msg.content }] });
      }
    }

    if (API_KEYS.length === 0) {
      return res.status(500).json({
        error: "Hệ thống chưa cấu hình API Key. Vui lòng liên hệ quản trị viên.",
      });
    }

    if (API_KEYS.every(k => disabledKeys.has(k))) {
      console.error("❌ All API keys are permanently disabled");
      return res.status(503).json({
        error: "Hệ thống AI hiện không khả dụng. Vui lòng thử lại sau.",
        details: "All API keys are invalid",
      });
    }

    // Thử từng key, mỗi key tối đa RETRIES_PER_KEY lần, trước khi xoay sang key mới
    const RETRIES_PER_KEY = 3;
    const RETRY_DELAY_MS = 200;   // delay cực ngắn giữa các lần retry cùng key
    const OVERALL_TIMEOUT_MS = 85_000;
    const startTime = Date.now();
    let aiReply = "";
    let totalAttempts = 0;
    const maxKeyAttempts = API_KEYS.length;

    outerLoop:
    for (let keyAttempt = 0; keyAttempt < maxKeyAttempts; keyAttempt++) {
      if (Date.now() - startTime >= OVERALL_TIMEOUT_MS) {
        console.warn("⏰ Đã vượt quá timeout 85s, dừng retry.");
        return res.status(503).json({
          error: "Hệ thống AI mất quá nhiều thời gian. Vui lòng thử lại.",
          details: "Overall timeout exceeded",
        });
      }

      const currentKey = getAvailableKey();
      if (!currentKey) {
        console.warn("⚠️ No available keys, skipping this request");
        return res.status(429).json({
          error: "Hệ thống AI đang quá tải. Vui lòng thử lại sau ít phút.",
          details: "All API keys exhausted or on cooldown",
        });
      }

      console.log(`🔑 Thử key ...${currentKey.slice(-4)} (key ${keyAttempt + 1}/${maxKeyAttempts})`);

      for (let retry = 0; retry < RETRIES_PER_KEY; retry++) {
        if (Date.now() - startTime >= OVERALL_TIMEOUT_MS) {
          console.warn("⏰ Timeout tổng, dừng.");
          break outerLoop;
        }

        totalAttempts++;
        try {
          if (retry > 0) {
            console.log(`🔁 Thử lại key ...${currentKey.slice(-4)} lần ${retry}/${RETRIES_PER_KEY - 1} (tổng: ${totalAttempts})`);
          }

          const genAI = initializeAI(currentKey);
          const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: GENERATION_CONFIG,
          });
          const chat = model.startChat({ history: chatHistory });

          const result = await chat.sendMessage(message);
          aiReply = result.response.text();
          console.log(`✅ Thành công sau ${totalAttempts} lần thử (${Date.now() - startTime}ms)`);
          break outerLoop;

        } catch (err) {
          const isInvalidKey = err.message?.includes("API_KEY_INVALID");
          if (isInvalidKey) {
            disabledKeys.add(currentKey);
            console.log(`🔴 Key ...${currentKey.slice(-4)} permanently disabled (invalid key)`);
            if (API_KEYS.every(k => disabledKeys.has(k))) {
              console.error("❌ All API keys are permanently disabled");
              return res.status(503).json({
                error: "Hệ thống AI hiện không khả dụng. Vui lòng thử lại sau.",
                details: "All API keys are invalid",
              });
            }
            break; // Key sai → sang key mới ngay
          }

          console.warn(`⚠️ Key ...${currentKey.slice(-4)} lần ${retry + 1}/${RETRIES_PER_KEY}: ${err.message?.slice(0, 80)}`);

          if (retry < RETRIES_PER_KEY - 1) {
            await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
          } else {
            console.warn(`🔄 Key ...${currentKey.slice(-4)} thất bại ${RETRIES_PER_KEY} lần → xoay sang key mới.`);
            markKeyCooldown(currentKey);
          }
        }
      }
    }

    if (!aiReply) {
      return res.status(503).json({
        error: "Hệ thống AI hiện đang quá tải. Vui lòng thử lại sau.",
        details: `Đã thử ${totalAttempts} lần trên ${maxKeyAttempts} key nhưng không thành công.`,
      });
    }

    return res.json({ reply: aiReply, success: true });

  } catch (error) {
    console.error("Customer Support AI Error:", error);

    if (error.message?.includes("API key")) {
      return res.status(500).json({
        error: "Lỗi cấu hình API. Vui lòng liên hệ quản trị viên.",
      });
    }

    return res.status(500).json({
      error: "Có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại.",
    });
  }
});

// Startup health check — validate all API keys
(async () => {
  if (API_KEYS.length === 0) {
    console.warn("⚠️ No Gemini API keys configured");
    return;
  }
  let validCount = 0;
  for (const key of API_KEYS) {
    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      await model.generateContent("ping");
      validCount++;
    } catch (err) {
      if (err.message?.includes("API_KEY_INVALID")) {
        disabledKeys.add(key);
        console.log(`🔴 Key ...${key.slice(-4)} permanently disabled (invalid key)`);
      } else {
        console.warn(`⚠️ Key ...${key.slice(-4)} health check failed:`, err.message?.slice(0, 60));
        validCount++;
      }
    }
  }
  console.log(`✅ ${validCount}/${API_KEYS.length} keys are valid and active`);
})();

export default router;
