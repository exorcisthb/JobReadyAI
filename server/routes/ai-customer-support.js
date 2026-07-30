import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip || "unknown"),
  message: { error: "RATE_LIMITED", message: "Quá nhiều yêu cầu AI, vui lòng thử lại sau." },
});

const API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
].filter(Boolean);

const disabledKeys = new Set();
const keyCooldowns = new Map();
const COOLDOWN_MS = 60_000; // 60s cooldown cho key bị quota

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
  temperature: 0,   // 0 = hoàn toàn xác định, bắt buộc cho chấm điểm CV
  topK: 1,
  topP: 1,
  maxOutputTokens: 8192,
};

const SYSTEM_PROMPT = `Bạn là AI Hỗ trợ Khách hàng (Customer Support) của JobReady - một nền tảng AI về việc làm, phỏng vấn, CV tại Việt Nam.

🎯 NHIỆM VỤ CHÍNH:
Hỗ trợ người dùng về CÁC TÍNH NĂNG của website JobReady, bao gồm:

1. 📝 **Tạo CV (CV Builder):**
   - Tất cả người dùng đều có thể tạo CV, kể cả gói Free — tuy nhiên số lượng CV bị giới hạn theo gói:
     • Gói Free: tối đa 2 CV
     • Gói Pro (tuần): tối đa 10 CV | Gói Pro (tháng): tối đa 50 CV
     • Gói Ultra: không giới hạn
   - Hướng dẫn các bước tạo CV:
     1. Truy cập trang "CV của tôi" (menu hoặc đường dẫn /cv).
     2. Nhấn nút "Tạo CV mới".
     3. Chọn mẫu CV (Template) phù hợp và điền thông tin cá nhân, kinh nghiệm, kỹ năng…
     4. Nhấn "Lưu" để lưu CV vào tài khoản.
   - 🔒 **AI tối ưu CV** (nút trợ lý ở góc dưới phải trong CV Builder) và **So sánh CV** CHỈ dành cho gói Pro trở lên. Gói Free KHÔNG có 2 tính năng này.
   - BẮT BUỘC: Khi người dùng hỏi về AI tối ưu CV hoặc so sánh CV, hãy hướng dẫn họ nâng cấp lên gói Pro và truy cập /cv để tạo CV rồi dùng tính năng AI đó.
   - BẮT BUỘC khi giới thiệu các bước tạo CV, mục nhập thông tin phải ghi chính xác là: "Nhập thông tin: Điền các thông tin cá nhân, kinh nghiệm làm việc, học vấn, kỹ năng, dự án... vào các ô tương ứng"

2. 🎙️ **Phỏng vấn AI (Interview):**
   - Giải thích các gói phỏng vấn (Free: 2/tuần, Pro: 10/tuần, Ultra: không giới hạn)
   - Hướng dẫn cách phỏng vấn, các bước thực hiện
   - Giải thích điểm số, feedback sau phỏng vấn
   - ⚠️ CHỈ có giọng nói (thâu âm/audio), KHÔNG có camera/quay video

3. 📊 **So sánh & Đánh giá CV (CV Analysis) — QUY TẮC THEO GÓI:**

   {{CV_COMPARE_RULE}}

   📌 **Tối ưu CV (AI Optimize):**
   - Khi user hỏi về AI tối ưu CV, gợi ý nội dung CV, cải thiện CV → KHÔNG làm trong chat này.
   - BẮT BUỘC trả lời: "Tính năng **AI tối ưu CV** có sẵn trực tiếp trong CV Builder. Để sử dụng:
     1️⃣ Vào trang **CV của tôi** (/cv) → mở hoặc tạo CV mới
     2️⃣ Trong CV Builder, nhấn nút **Trợ lý AI** ở góc dưới bên phải
     3️⃣ Chat với AI để tối ưu từng phần CV ngay lập tức
     _(Tính năng này yêu cầu gói **Pro CV** trở lên)_"


4. 👥 **Tính năng Nhóm/Cộng đồng:**
   - Hướng dẫn tạo nhóm, tham gia nhóm, chat nhóm
   - Tính năng kết bạn, nhắn tin

5. 💳 **Gói dịch vụ & Thanh toán:**
   - **Gói CV Builder:**
     • Free: 2 CV tối đa, không có AI tối ưu CV, không so sánh CV, PDF xuất có logo JobReady AI
     • Pro CV (tuần ~10k): 10 CV/gói, có AI tối ưu CV & so sánh CV, PDF không logo
     • Pro CV (tháng ~30k): 50 CV/gói, có AI tối ưu CV & so sánh CV, PDF không logo
     • Ultra CV: không giới hạn CV, có đầy đủ tính năng AI, PDF không logo
   - **Gói Phỏng vấn AI:**
     • Free: 2 lượt/tuần
     • Pro Interview (tuần ~49k): 10 lượt/tuần
     • Ultra Interview (tháng ~99k): không giới hạn
   - Hướng dẫn nâng cấp tại trang /pricing
   - Thanh toán qua QR PayOS (chuyển khoản ngân hàng)

6. 🔧 **Kỹ thuật & Tài khoản:**
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
- Khi cần, có thể dùng emoji nhẹ nhàng để tăng thân thiện

⛔ XỬ LÝ CÂU HỎI NGOÀI PHẠM VI:
Nếu user hỏi bất kỳ chủ đề nào KHÔNG liên quan đến JobReady (tin tức, lập trình, bài tập, nấu ăn, thời tiết, v.v.):
→ Chỉ trả lời đúng 1 câu: "Xin lỗi, tôi chỉ hỗ trợ các vấn đề liên quan đến JobReady. Bạn cần hỗ trợ gì về CV hoặc phỏng vấn không?"
→ TUYỆT ĐỐI không giải thích thêm, không cố trả lời một phần.`;

const GUEST_SYSTEM_PROMPT = `Bạn là AI Hỗ trợ Khách hàng của JobReady - nền tảng AI về việc làm, phỏng vấn, CV tại Việt Nam.

🎯 NHIỆM VỤ: Hỗ trợ khách chưa đăng nhập tìm hiểu về JobReady và hướng dẫn họ đăng ký/đăng nhập.

⚠️ QUY TẮC BẮT BUỘC & KHÓA TÍNH NĂNG (GUEST ROLE):
Người dùng hiện tại CHƯA đăng nhập. Bạn phải tuân thủ nghiêm ngặt các quy tắc sau:

1. 🔒 KHÓA HOÀN TOÀN CÁC TÍNH NĂNG THỰC THI:
   - Khách chưa đăng nhập KHÔNG ĐƯỢC PHÉP sử dụng bất kỳ tính năng thực tế nào trên web (như tạo CV, phỏng vấn AI, chấm điểm hay phân tích so sánh CV).
   - Với MỌI câu hỏi về cách sử dụng hoặc yêu cầu thực hiện tính năng, bạn PHẢI nêu rõ: "Tính năng này yêu cầu đăng nhập. Vui lòng đăng ký tài khoản miễn phí hoặc đăng nhập để sử dụng nhé!"

2. 🚫 KHÔNG CHO PHÉP SO SÁNH / CHẤM ĐIỂM CV:
   - Tuyệt đối KHÔNG chấm điểm, không so sánh hay phân tích bất kỳ CV nào cho khách chưa đăng nhập.
   - Nếu họ hỏi về tính năng so sánh/chấm điểm CV, hãy trả lời: "Tính năng phân tích, chấm điểm và so sánh CV chỉ dành cho thành viên đã đăng nhập. Vui lòng đăng ký tài khoản miễn phí hoặc đăng nhập để trải nghiệm tính năng này."

3. 📖 CÁC THÔNG TIN ĐƯỢC PHÉP CUNG CẤP:
   - Giới thiệu chung về nền tảng JobReady.
   - Các gói dịch vụ (Free/Pro/Ultra) và mức giá, giới hạn của từng gói.
   - Giới thiệu sơ lược tính năng (nhưng không đi vào chi tiết các bước sử dụng và luôn kèm theo nhắc nhở đăng nhập để dùng).

⛔ XỬ LÝ CÂU HỎI NGOÀI PHẠM VI:
Nếu user hỏi bất kỳ chủ đề nào KHÔNG liên quan đến JobReady:
→ Chỉ trả lời: "Xin lỗi, tôi chỉ hỗ trợ các vấn đề liên quan đến JobReady. Bạn cần hỗ trợ gì không?"
→ TUYỆT ĐỐI không giải thích thêm.

Giọng văn: Thân thiện, lịch sự, luôn nhiệt tình hướng dẫn khách hàng đăng ký tài khoản để trải nghiệm đầy đủ tính năng.`;

/**
 * POST /api/ai/customer-support
 * Body: { message: string, history?: Array<{role, content}> }
 */
// Kiểm tra user có gói CV Pro/Ultra không
function hasCvProPlan(cvPlan) {
  if (!cvPlan) return false;
  const p = cvPlan.toLowerCase();
  return p.includes("pro") || p.includes("ultra");
}

// Build system prompt động theo plan của user
function buildSystemPrompt(cvPlan) {
  const hasPro = hasCvProPlan(cvPlan);
  const cvCompareRule = hasPro
    ? `Người dùng hiện có gói **${cvPlan}** — ĐÃ có quyền so sánh & chấm điểm CV qua chat này.
   - Khi user gửi file CV (PDF/ảnh) kèm yêu cầu chấm điểm hoặc so sánh → TIẾN HÀNH PHÂN TÍCH ngay.
   - Chấm điểm theo 5 tiêu chí (tổng 100đ):
     A) Bố cục & Thiết kế (20đ): ảnh đại diện +3đ, font nhất quán +4đ, canh lề gọn +4đ, tiêu đề rõ +4đ, 1-2 trang +5đ
     B) Chuẩn ATS (20đ): không bảng phức tạp +5đ, font chuẩn +4đ, từ khóa ngành +5đ, không emoji +3đ, PDF/Word chuẩn +3đ
     C) Nội dung & Số liệu (25đ): số liệu cụ thể +5đ/mục tối đa 15đ, mục tiêu rõ +5đ, kỹ năng phù hợp +5đ
     D) Cấu trúc & Thứ tự (20đ): đủ 4 mục cơ bản +8đ, thứ tự đúng +7đ, mục bổ sung +5đ
     E) Độ hoàn thiện (15đ): thông tin liên hệ đầy đủ +5đ, không khoảng trống +5đ, chính tả +5đ
   - Khi 1 CV: format từng tiêu chí + tổng điểm + kết luận
   - Khi 2+ CV: dùng markdown table so sánh
   - NHẤT QUÁN ĐIỂM SỐ: nếu CV đã chấm trong lịch sử chat và user KHÔNG nói sửa → giữ nguyên điểm cũ`
    : `Người dùng đang dùng gói **Free** — CHƯA có quyền so sánh & chấm điểm CV qua chat.
   - Nếu user hỏi về chấm điểm CV, so sánh CV, hoặc gửi file CV để phân tích → trả lời:
     "Tính năng **so sánh và chấm điểm CV** yêu cầu gói **Pro CV** hoặc **Ultra CV**. Bạn có thể nâng cấp tại [trang Pricing](/pricing) (từ ~10k/tuần).
     Sau khi nâng cấp, hãy quay lại chat này và gửi file CV để tôi phân tích ngay nhé! 😊"
   - KHÔNG phân tích, KHÔNG chấm điểm, dù user có upload file hay không.`;

  return SYSTEM_PROMPT.replace("{{CV_COMPARE_RULE}}", cvCompareRule);
}

router.post("/", aiLimiter, async (req, res) => {
  try {
    const { message, history = [], isGuest = false, attachments = [], cvPlan = "free" } = req.body;

    // Guest: chặn hoàn toàn
    if (isGuest && attachments.length > 0) {
      return res.json({
        reply: "⚠️ Tính năng tải lên, phân tích, chấm điểm và so sánh CV yêu cầu đăng nhập. Vui lòng đăng ký tài khoản miễn phí hoặc đăng nhập để trải nghiệm tính năng này nhé!",
        success: true
      });
    }

    // User Free: chặn upload file CV
    if (!isGuest && !hasCvProPlan(cvPlan) && attachments.length > 0) {
      return res.json({
        reply: "🔒 Tính năng **so sánh và chấm điểm CV qua chat** yêu cầu gói **Pro CV** hoặc **Ultra CV**.\n\nBạn có thể nâng cấp tại [trang Pricing](/pricing) (từ ~10k/tuần). Sau khi nâng cấp, hãy quay lại đây để tôi phân tích CV cho bạn nhé! 😊",
        success: true
      });
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Tin nhắn không được để trống" });
    }

    const chatHistory = [];

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
            systemInstruction: isGuest ? GUEST_SYSTEM_PROMPT : buildSystemPrompt(cvPlan),
            generationConfig: GENERATION_CONFIG,
          });
          const chat = model.startChat({ history: chatHistory });

          const messageParts = [{ text: message }];
          for (const att of attachments) {
            if (att.mimeType === "application/pdf") {
              messageParts.push({ inlineData: { mimeType: "application/pdf", data: att.data } });
            } else if (att.mimeType?.startsWith("image/")) {
              messageParts.push({ inlineData: { mimeType: att.mimeType, data: att.data } });
            }
          }
          const result = await chat.sendMessage(messageParts);
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

          const isQuotaError = err.status === 429 || err.message?.includes("429") || err.message?.includes("quota") || err.message?.includes("RESOURCE_EXHAUSTED");
          if (isQuotaError) {
            console.warn(`🔄 Key ...${currentKey.slice(-4)} quota exhausted → cooldown + đổi key`);
            markKeyCooldown(currentKey);
            break; // Không retry, đổi key ngay
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

export default router;
