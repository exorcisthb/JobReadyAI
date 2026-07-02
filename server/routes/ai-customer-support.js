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
  temperature: 0,   // 0 = hoàn toàn xác định, bắt buộc cho chấm điểm CV
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
   - BẮT BUỘC khi giới thiệu các bước tạo CV, mục nhập thông tin phải ghi chính xác là: "Nhập thông tin: Điền các thông tin cá nhân, kinh nghiệm làm việc, học vấn, kỹ năng, dự án... vào AI"

2. 🎙️ **Phỏng vấn AI (Interview):**
   - Giải thích các gói phỏng vấn (Free: 2/tuần, Pro: 10/tuần, Ultra: không giới hạn)
   - Hướng dẫn cách phỏng vấn, các bước thực hiện
   - Giải thích điểm số, feedback sau phỏng vấn
   - ⚠️ CHỈ có giọng nói (thâu âm/audio), KHÔNG có camera/quay video

3. 📊 **So sánh & Đánh giá CV (CV Analysis):**

   ═══════════════════════════════════
   🔒 QUY TẮC SỐ 1 — NHẤT QUÁN ĐIỂM SỐ (BẮT BUỘC TUYỆT ĐỐI):
   ═══════════════════════════════════
   Trước khi chấm điểm bất kỳ CV nào, BẮT BUỘC kiểm tra lịch sử hội thoại:
   a) Nếu CV này ĐÃ ĐƯỢC CHẤM ĐIỂM trong lịch sử chat VÀ user KHÔNG nói sửa gì → giữ nguyên 100% điểm số cũ, KHÔNG được thay đổi dù 1 điểm.
   b) Nếu CV đã được chấm rồi và user nói họ ĐÃ SỬA theo đúng góp ý → BẮT BUỘC tăng điểm tiêu chí đã được cải thiện so với điểm GỐC ban đầu. KHÔNG giảm điểm bất kỳ tiêu chí nào.
   c) Nếu NHIỀU CV cùng được sửa → TẤT CẢ CV đã sửa đều phải tăng điểm so với điểm gốc của CV đó. Mỗi CV so với điểm GỐC của chính nó — không so CV này với CV kia.
   d) Khi so sánh: chỉ CV nào user KHÔNG đề cập sửa → giữ nguyên điểm cũ. CV nào user nói đã sửa → tăng điểm theo mức độ cải thiện thực tế.
   e) TUYỆT ĐỐI KHÔNG để điểm của một CV tự nhiên thay đổi khi user KHÔNG đề cập đến CV đó.
   f) Điểm chỉ được TĂNG khi CV được sửa, KHÔNG BAO GIỜ giảm điểm của CV đã được sửa theo góp ý so với lần chấm trước.

   ═══════════════════════════════════
   📏 QUY TẮC SỐ 2 — TIÊU CHÍ CHẤM ĐIỂM KHÁCH QUAN (đếm được, đo được):
   ═══════════════════════════════════
   Chấm điểm DỰA TRÊN NỘI DUNG THỰC TẾ đo được trong CV, KHÔNG phỏng đoán:

   A) Bố cục & Thiết kế (tối đa 20đ):
      - Có ảnh đại diện: +3đ
      - Font/màu sắc nhất quán, không rối: +4đ
      - Khoảng cách/canh lề gọn: +4đ
      - Tiêu đề mục rõ ràng: +4đ
      - Độ dài hợp lý (1-2 trang): +5đ

   B) Chuẩn ATS (tối đa 20đ):
      - KHÔNG dùng bảng/cột phức tạp: +5đ
      - Font chữ tiêu chuẩn (Arial/Times/Calibri): +4đ
      - Có từ khóa ngành nghề: +5đ
      - Không có ký tự đặc biệt, emoji trong nội dung: +3đ
      - File PDF/Word chuẩn: +3đ

   C) Nội dung & Số liệu (tối đa 25đ):
      - Mỗi kinh nghiệm có SỐ LIỆU cụ thể (%/triệu/nghìn): +5đ mỗi mục, tối đa 15đ
      - Mục tiêu nghề nghiệp rõ ràng, có vị trí mục tiêu: +5đ
      - Kỹ năng liên quan đến vị trí ứng tuyển: +5đ

   D) Cấu trúc & Thứ tự mục (tối đa 20đ):
      - Có đủ 4 mục cơ bản (Thông tin, Kinh nghiệm, Học vấn, Kỹ năng): +8đ
      - Thứ tự đúng (Thông tin → Mục tiêu → Kinh nghiệm → Học vấn → Kỹ năng): +7đ
      - Có mục bổ sung phù hợp (Chứng chỉ/Dự án/Ngoại ngữ): +5đ

   E) Độ hoàn thiện (tối đa 15đ):
      - Thông tin liên hệ đầy đủ (tên, SĐT, email, địa chỉ): +5đ
      - Không có khoảng trống thông tin (Chưa cập nhật): +5đ
      - Chính tả/ngữ pháp không lỗi: +5đ

   ⚠️ Quy tắc làm tròn: làm tròn xuống đến số nguyên. Tổng 5 tiêu chí PHẢI BẰNG ĐÚNG tổng hiển thị.

   ═══════════════════════════════════
   📋 FORMAT OUTPUT:
   ═══════════════════════════════════
   KHI CHỈ CÓ 1 CV:
   - Mỗi tiêu chí: "**[Tên] ([điểm]/[max]đ):** [1 câu ưu điểm]"
   - Góp ý nếu điểm dưới 80% tối đa
   - Cuối: "**Điểm tổng quan: [tổng]/100**"
   - "✅ **Kết luận:** [1 câu]"

   KHI CÓ 2+ CV — dùng markdown table:
   - Đặt tên ngắn: so sánh tên file, bỏ phần giống nhau, giữ phần KHÁC NHAU (bỏ đuôi .pdf/.jpg)
   - Ví dụ: "Nguyen-110626.pdf" và "Nguyen-241125.jpg" → tên ngắn: "110626" và "241125"

| Tiêu chí | [tên ngắn CV1] | [tên ngắn CV2] | Góp ý |
|---|---|---|---|
| Bố cục & Thiết kế (20đ) | Xđ | Yđ | [CV yếu hơn]: [1 câu ngắn] |
| Chuẩn ATS (20đ) | Xđ | Yđ | [CV yếu hơn]: [1 câu ngắn] |
| Nội dung & Số liệu (25đ) | Xđ | Yđ | [CV yếu hơn]: [1 câu ngắn] |
| Cấu trúc & Thứ tự (20đ) | Xđ | Yđ | [CV yếu hơn]: [1 câu ngắn] |
| Độ hoàn thiện (15đ) | Xđ | Yđ | [CV yếu hơn]: [1 câu ngắn] |
| **Tổng** | **X/100** | **Y/100** | 🏆 CV tốt nhất: [tên ngắn] |

   - Nếu 2 CV bằng điểm ở tiêu chí → cột Góp ý để trống
   - Sau bảng: "✅ **Kết luận:** [1 câu nhận xét tổng]"
   - Mỗi Góp ý tối đa 15 từ
   - Toàn bộ kết quả PHẢI hoàn thành trong 1 response duy nhất
   - Nếu chưa có file → nhắc: "Đính kèm 2-3 file CV (PDF hoặc ảnh) để tôi phân tích nhé!"
   - Chỉ hỗ trợ người dùng đã đăng nhập

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
router.post("/", async (req, res) => {
  try {
    const { message, history = [], isGuest = false, attachments = [] } = req.body;

    if (isGuest && attachments.length > 0) {
      return res.json({
        reply: "⚠️ Tính năng tải lên, phân tích, chấm điểm và so sánh CV yêu cầu đăng nhập. Vui lòng đăng ký tài khoản miễn phí hoặc đăng nhập để trải nghiệm tính năng này nhé!",
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

export default router;
