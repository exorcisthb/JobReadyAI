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
  temperature: 0.1,
  topK: 1,
  topP: 1,
  maxOutputTokens: 8192,
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

3. 📊 **So sánh & Đánh giá CV (CV Analysis):**

   THANG ĐIỂM (tổng 100đ):
   - Bố cục & Thiết kế: tối đa 20đ
   - Chuẩn ATS: tối đa 20đ
   - Nội dung & Số liệu: tối đa 25đ
   - Cấu trúc & Thứ tự mục: tối đa 20đ
   - Độ hoàn thiện: tối đa 15đ

   KHI CÓ 2+ CV — BẮT BUỘC dùng format sau, KHÔNG được dùng format khác:
Bố cục & Thiết kế (tối đa 20đ):

CV1: Xđ | CV2: Yđ

→ Góp ý CV[số yếu hơn]: [1 câu]
Chuẩn ATS (tối đa 20đ):

CV1: Xđ | CV2: Yđ

→ Góp ý CV[số yếu hơn]: [1 câu]
Nội dung & Số liệu (tối đa 25đ):

CV1: Xđ | CV2: Yđ

→ Góp ý CV[số yếu hơn]: [1 câu]
Cấu trúc & Thứ tự mục (tối đa 20đ):

CV1: Xđ | CV2: Yđ

→ Góp ý CV[số yếu hơn]: [1 câu]
Độ hoàn thiện (tối đa 15đ):

CV1: Xđ | CV2: Yđ

→ Góp ý CV[số yếu hơn]: [1 câu]
Tổng: CV1 [tổng]/100 | CV2 [tổng]/100

🏆 CV tốt nhất: CV[số] — [lý do 1 câu]

   QUY TẮC BẮT BUỘC khi so sánh:
   - TUYỆT ĐỐI không phân tích từng CV riêng biệt theo kiểu "CV1: ... CV2: ..."
   - Nếu 2 CV bằng điểm ở tiêu chí đó → bỏ dòng Góp ý
   - Nếu CV nào điểm cao hơn ở tiêu chí đó → KHÔNG góp ý CV đó
   - Tổng phải bằng đúng tổng cộng 5 tiêu chí, kiểm tra lại trước khi ghi

   KHI CHỈ CÓ 1 CV:
   - Mỗi tiêu chí: "**[Tên] ([điểm]/[max]đ):** [1 câu ưu điểm]"
   - Góp ý nếu điểm dưới 80% tối đa
   - Cuối: "**Điểm tổng quan: [tổng]/100**"
   - "✅ **Kết luận:** [1 câu]"

   - Nếu chưa có file → nhắc: "Đính kèm 2-3 file CV (PDF hoặc ảnh) để tôi phân tích nhé!"
   - Chỉ hỗ trợ người dùng đã đăng nhập
   - Chỉ giải thích khi được hỏi, không chủ động nhắc
   - Toàn bộ kết quả so sánh PHẢI hoàn thành trong 1 response duy nhất, không được cắt giữa chừng
   - Khi so sánh nhiều CV, đặt tên ngắn cho mỗi CV bằng cách: so sánh tên các file với nhau, bỏ hết phần giống nhau, chỉ giữ lại phần KHÁC NHAU giữa các tên file (bỏ đuôi .pdf/.jpg)
   - Ví dụ: "Nguyen-110626.pdf" và "Nguyen-241125.jpg" → phần khác nhau là "110626" và "241125" → dùng làm tên ngắn
   - Format output bảng như sau (dùng markdown table):
| Tiêu chí | [tên ngắn CV1] | [tên ngắn CV2] | Góp ý |
|---|---|---|---|
| Bố cục & Thiết kế (20đ) | Xđ | Yđ | [CV yếu hơn]: [1 câu ngắn] |
| Chuẩn ATS (20đ) | Xđ | Yđ | [CV yếu hơn]: [1 câu ngắn] |
| Nội dung & Số liệu (25đ) | Xđ | Yđ | [CV yếu hơn]: [1 câu ngắn] |
| Cấu trúc & Thứ tự (20đ) | Xđ | Yđ | [CV yếu hơn]: [1 câu ngắn] |
| Độ hoàn thiện (15đ) | Xđ | Yđ | [CV yếu hơn]: [1 câu ngắn] |
| **Tổng** | **X/100** | **Y/100** | 🏆 CV tốt nhất: [tên ngắn] |
   - Nếu 2 CV bằng điểm ở tiêu chí đó → cột Góp ý để trống
   - Sau bảng ghi thêm 1 dòng: "✅ **Kết luận:** [1 câu nhận xét tổng]"
   - Mỗi dòng Góp ý tối đa 15 từ, không giải thích dài dòng

4. 👥 **Tính năng Nhóm/Cộng đồng:**
   - Hướng dẫn tạo nhóm, tham gia nhóm, chat nhóm
   - Tính năng kết bạn, nhắn tin

5. 💳 **Gói dịch vụ & Thanh toán:**
   - So sánh các gói Free/Pro/Ultra
   - Hướng dẫn nâng cấp gói, thanh toán
   - Giải thích hạn mức sử dụng

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

⚠️ QUY TẮC QUAN TRỌNG NHẤT:
Người dùng hiện chưa đăng nhập (khách vãng lai). Với MỌI câu hỏi liên quan đến việc SỬ DỤNG tính năng (tạo CV, phỏng vấn, v.v.), hãy:
1. Trả lời ngắn gọn tính năng đó là gì / làm được gì
2. Ngay lập tức hướng dẫn: "Để sử dụng, bạn cần **đăng ký** (miễn phí) hoặc **đăng nhập** tại trang chủ JobReady trước nhé!"
3. KHÔNG hướng dẫn chi tiết các bước thực hiện — vì họ chưa có tài khoản

✅ CÓ THỂ trả lời đầy đủ:
- Giới thiệu chung về JobReady là gì
- Các gói dịch vụ Free/Pro/Ultra giá bao nhiêu, khác nhau thế nào
- Tính năng nào có trong từng gói
- Tại sao nên dùng JobReady
- Nếu guest hỏi về So sánh CV: giải thích ngắn gọn tính năng này giúp chấm điểm và chọn CV tốt nhất, nhưng **bắt buộc phải đăng nhập mới sử dụng được** → hướng dẫn đăng ký miễn phí
- TUYỆT ĐỐI không cho phép guest upload hoặc so sánh CV dù họ có đính kèm file
- Nếu guest gửi file CV kèm yêu cầu so sánh → từ chối và nhắc đăng nhập: "Tính năng So sánh CV yêu cầu đăng nhập. Bạn hãy đăng ký miễn phí hoặc đăng nhập để sử dụng nhé!"

⛔ XỬ LÝ CÂU HỎI NGOÀI PHẠM VI:
Nếu user hỏi bất kỳ chủ đề nào KHÔNG liên quan đến JobReady:
→ Chỉ trả lời: "Xin lỗi, tôi chỉ hỗ trợ các vấn đề liên quan đến JobReady. Bạn cần hỗ trợ gì không?"
→ TUYỆT ĐỐI không giải thích thêm.

Giọng văn: thân thiện, ngắn gọn, luôn khuyến khích đăng ký dùng thử miễn phí.`;

/**
 * POST /api/ai/customer-support
 * Body: { message: string, history?: Array<{role, content}> }
 */
router.post("/", async (req, res) => {
  try {
    const { message, history = [], isGuest = false, attachments = [] } = req.body;

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
            systemInstruction: isGuest ? GUEST_SYSTEM_PROMPT : SYSTEM_PROMPT,
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

// Startup health check — disabled to avoid unnecessary API calls at boot
// (async () => {
//   if (API_KEYS.length === 0) {
//     console.warn("⚠️ No Gemini API keys configured");
//     return;
//   }
//   let validCount = 0;
//   for (const key of API_KEYS) {
//     try {
//       const genAI = new GoogleGenerativeAI(key);
//       const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
//       await model.generateContent("ping");
//       validCount++;
//     } catch (err) {
//       if (err.message?.includes("API_KEY_INVALID")) {
//         disabledKeys.add(key);
//         console.log(`🔴 Key ...${key.slice(-4)} permanently disabled (invalid key)`);
//       } else {
//         console.warn(`⚠️ Key ...${key.slice(-4)} health check failed:`, err.message?.slice(0, 60));
//         validCount++;
//       }
//     }
//   }
//   console.log(`✅ ${validCount}/${API_KEYS.length} keys are valid and active`);
// })();

export default router;
