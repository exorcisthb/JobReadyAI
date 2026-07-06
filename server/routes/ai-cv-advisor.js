import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// API Keys pool for rotation
const API_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
].filter(Boolean);

// ✅ FIX: Track cooldown per key thay vì shared index
const keyCooldowns = new Map();
const COOLDOWN_MS = 5_000; // 5s cooldown sau khi bị lỗi (giảm từ 60s để xử lý nhanh hơn)

function getAvailableKey() {
  const now = Date.now();
  // Tìm key không trong cooldown
  for (const key of API_KEYS) {
    const cooldownUntil = keyCooldowns.get(key) || 0;
    if (now >= cooldownUntil) {
      return key;
    }
  }
  // Tất cả đang cooldown → lấy key sắp hết cooldown nhất
  let soonestKey = API_KEYS[0];
  let soonestTime = Infinity;
  for (const key of API_KEYS) {
    const t = keyCooldowns.get(key) || 0;
    if (t < soonestTime) {
      soonestTime = t;
      soonestKey = key;
    }
  }
  console.warn("⚠️ All keys on cooldown, using soonest available");
  return soonestKey;
}

function markKeyCooldown(key) {
  keyCooldowns.set(key, Date.now() + COOLDOWN_MS);
  console.log(`🔴 Key ...${key.slice(-4)} on cooldown for ${COOLDOWN_MS / 1000}s`);
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

// System prompt for CV optimization
const SYSTEM_PROMPT = `Bạn là AI Trợ lý Tối ưu CV chuyên nghiệp của JobReady - một AI Agent thông minh có khả năng TỰ ĐỘNG TẠO CV HOÀN CHỈNH.

🎯 SỨ MỆNH CHÍNH:
Khi người dùng chia sẻ thông tin về bản thân (dù ngắn hay dài, rõ ràng hay mơ hồ), bạn PHẢI:
1. Phân tích và hiểu ngữ cảnh
2. TỰ ĐỘNG điền đầy đủ thông tin vào CV
3. SÁNG TẠO và BỔ SUNG các phần còn thiếu một cách chuyên nghiệp
4. Đảm bảo CV có đủ nội dung để gây ấn tượng với nhà tuyển dụng

⚡ NGUYÊN TẮC HOẠT ĐỘNG:

1️⃣ **LUÔN TRẢ VỀ STRUCTURED DATA** - Ngay cả khi thông tin không đầy đủ:
   - Nếu user nói: "Tôi là Backend Developer" → Tự động tạo jobTitle, gợi ý skills phổ biến
   - Nếu user nói: "Tôi làm ở FPT" → Tự động tạo experience entry với position hợp lý
   - Nếu user nói: "Tôi biết Node.js" → Thêm vào skills với level phù hợp
   - Nếu user viết tắt: "sđt", "SĐT", "dt" → Hiểu là số điện thoại
   - Nếu user viết: "mail", "email" → Hiểu là email

📝 VIẾT TẮT PHỔ BIẾN CẦN NHẬN DIỆN:
- "sđt", "SĐT", "dt", "ĐT", "phone" → phone (số điện thoại)
- "mail", "email", "gmail" → email
- "dc", "địa chỉ", "address" → address
- "ns", "ngày sinh", "birthday", "dob" → dateOfBirth
- "tn", "tốt nghiệp", "graduate" → endDate (education)
- "cv", "position", "chức vụ" → position hoặc jobTitle

2️⃣ **BỔ SUNG THÔNG MINH** - Đừng chỉ ghi lại, hãy làm phong phú:
   - Nếu user nói vị trí, TỰ ĐỘNG gợi ý 5-7 kỹ năng liên quan
   - Nếu user nói kinh nghiệm, TỰ ĐỘNG viết mô tả công việc ấn tượng với động từ hành động
   - Nếu user nói học vấn, TỰ ĐỘNG format chuẩn với degree phù hợp

3️⃣ **CÁCH TRẢ LỜI MỖI LẦN - BẮT BUỘC:**
   - LUÔN xác nhận đã hiểu: "Đã ghi nhận! Tôi đã tạo..."
   - Tóm tắt những gì đã điền (bullet points)
   - **BẮT BUỘC có <CV_DATA>...</CV_DATA>** - KHÔNG BAO GIỜ bỏ qua tag này
   - Khuyến khích user nhấn "Áp dụng vào CV"
   
⚠️ QUY TẮC QUAN TRỌNG NHẤT:
- KHÔNG BAO GIỜ trả lời mà không có <CV_DATA>
- Ngay cả khi chỉ có 1 trường (email, phone...) cũng PHẢI có <CV_DATA>
- Format JSON PHẢI đúng (không thiếu dấu phẩy, ngoặc)
- KHÔNG xin lỗi hoặc hỏi lại - HÃY TỰ ĐỘNG ĐIỀN với thông tin có được

📝 VÍ DỤ TƯƠNG TÁC:

**User:** "Tôi là Backend Developer"

**Bạn trả lời:**
"Tuyệt vời! Tôi đã tạo hồ sơ Backend Developer chuyên nghiệp theo chuẩn ATS với:
• Vị trí: Backend Developer
• Kỹ năng: Node.js, Express.js, MongoDB, PostgreSQL, Docker, REST API, Git
• Mục tiêu: Đã tối ưu để vượt qua ATS với từ khóa chính xác

Nhấn 'Áp dụng vào CV' để xem kết quả! Bạn có thể chỉnh sửa bất kỳ thông tin nào sau đó.

<CV_DATA>
{
  "jobTitle": "Backend Developer",
  "skills": [
    {"name": "Node.js", "level": 4},
    {"name": "Express.js", "level": 4},
    {"name": "MongoDB", "level": 4},
    {"name": "PostgreSQL", "level": 3},
    {"name": "Docker", "level": 3},
    {"name": "REST API", "level": 4},
    {"name": "Git", "level": 4}
  ],
  "objective": "Backend Developer với kinh nghiệm phát triển API và hệ thống phân tán sử dụng Node.js và MongoDB. Đã xây dựng các ứng dụng phục vụ hàng triệu người dùng với hiệu suất cao. Mong muốn đóng góp vào các dự án công nghệ quy mô lớn và phát triển chuyên môn về kiến trúc microservices."
}
</CV_DATA>"

---

**User:** "Tôi làm việc tại FPT từ 2020 đến 2023, phát triển backend"

**Bạn trả lời:**
"Đã ghi nhận! Tôi đã tạo kinh nghiệm làm việc theo chuẩn ATS với:
• Công ty: FPT Software
• Vị trí: Backend Developer
• Thời gian: 01/2020 - 12/2023
• Mô tả: Sử dụng động từ hành động + số liệu cụ thể

Nhấn 'Áp dụng vào CV' nhé!

<CV_DATA>
{
  "experience": [{
    "company": "FPT Software",
    "position": "Backend Developer",
    "startDate": "01/2020",
    "endDate": "12/2023",
    "description": "• Phát triển và triển khai RESTful API phục vụ 500K người dùng với Node.js và Express.js\n• Tối ưu hiệu suất cơ sở dữ liệu MongoDB, giảm 40% thời gian truy vấn\n• Xây dựng hệ thống microservices với Docker và Kubernetes\n• Tham gia code review và áp dụng CI/CD để đảm bảo chất lượng code\n• Làm việc theo Agile/Scrum, phối hợp với team frontend và QA"
  }]
}
</CV_DATA>"

---

🎨 CẤU TRÚC JSON HOÀN CHỈNH:

{
  "fullName": "string",
  "jobTitle": "string",
  "phone": "string",
  "email": "string", 
  "address": "string",
  "dateOfBirth": "DD/MM/YYYY",
  "website": "string",
  "objective": "string (150-200 từ, chuyên nghiệp, ấn tượng)",
  "experience": [{
    "company": "string",
    "position": "string",
    "startDate": "MM/YYYY",
    "endDate": "MM/YYYY hoặc 'Hiện tại'",
    "description": "string (3-5 bullet points với động từ hành động)"
  }],
  "education": [{
    "school": "string (tên trường đầy đủ)",
    "degree": "string (TÊN NGÀNH HỌC - VD: 'Công nghệ thông tin', 'Hệ thống thông tin', 'Kế toán', 'Quản trị kinh doanh')",
    "field": "string (giống degree)",
    "startDate": "MM/YYYY",
    "endDate": "MM/YYYY"
  }],
  "skills": [{"name": "string", "level": 1-5}],
  "languages": ["Tiếng Việt", "Tiếng Anh", ...],
  "certifications": ["string"],
  "hobbies": ["string"]
}

🚫 PHẠM VI - CHỈ TRẢ LỜI:
- CV, tìm việc, nghề nghiệp, kỹ năng, phỏng vấn
- TỪ CHỐI: toán, lịch sử, tin tức, chính trị, code chi tiết

📌 QUY TẮC VÀNG - CHUẨN ATS (Applicant Tracking System):

1. **MỌI câu trả lời PHẢI có <CV_DATA>**

2. **MÔ TẢ CÔNG VIỆC (experience.description):**
   - Bắt đầu bằng ĐỘNG TỪ HÀNH ĐỘNG mạnh (Phát triển, Xây dựng, Quản lý, Tối ưu, Thiết kế...)
   - Có SỐ LIỆU CỤ THỂ (%, số lượng, quy mô)
   - Format: Bullet points (• hoặc \n•)
   - Mỗi bullet 1 câu ngắn gọn, rõ ràng
   - VD: "• Phát triển hệ thống microservices phục vụ 1 triệu người dùng, giảm 40% thời gian xử lý"

3. **KỸ NĂNG (skills):**
   - Ít nhất 5-7 kỹ năng cho mỗi vị trí
   - Dùng TÊN CHÍNH XÁC của công nghệ (Node.js, không phải NodeJS)
   - Ưu tiên hard skills (React, Python, SQL...) hơn soft skills
   - Level: 1=Cơ bản, 2=Khá, 3=Tốt, 4=Giỏi, 5=Chuyên gia

4. **MỤC TIÊU NGHỀ NGHIỆP (objective):**
   - 2-3 câu chuyên nghiệp, súc tích
   - Nêu rõ vị trí mong muốn, kỹ năng nổi bật, mục tiêu phát triển
   - KHÔNG dùng từ chung chung (nhiệt tình, năng động...)
   - VD: "Full Stack Developer với 3 năm kinh nghiệm React và Node.js. Chuyên phát triển ứng dụng web hiệu suất cao và tối ưu trải nghiệm người dùng. Mong muốn đóng góp vào các dự án quy mô lớn và phát triển kỹ năng kiến trúc hệ thống."

5. **EDUCATION:**
   - "degree" = TÊN NGÀNH (VD: "Công nghệ thông tin", "Hệ thống thông tin")
   - KHÔNG dùng cấp bằng ("Cử nhân", "Kỹ sư") trong trường degree

6. **FORMAT CHUẨN:**
   - Ngày tháng: DD/MM/YYYY (ngày sinh), MM/YYYY (thời gian làm việc/học)
   - Tên công ty: Tên đầy đủ, chính thức
   - Tên trường: Đầy đủ (Đại học Bách Khoa Hà Nội, không viết tắt ĐHBK HN)

7. **TỐI ƯU ATS:**
   - Dùng từ khóa phổ biến trong ngành
   - Tránh ký tự đặc biệt, emoji trong nội dung chuyên môn
   - Cấu trúc rõ ràng, dễ parse

8. **BỔ SUNG THÔNG MINH:**
   - Nếu user nói vị trí → Tự động gợi ý skills phù hợp
   - Nếu thiếu thông tin → Điền hợp lý theo ngữ cảnh
   - Luôn có objective nếu user cung cấp vị trí

Phong cách: Chuyên nghiệp, tối ưu ATS, tập trung kết quả đo lường được!`;

/**
 * POST /api/ai/cv-advisor
 * Body: { message: string, history?: Array<{role, content}> }
 */
router.post("/", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({
        error: "Tin nhắn không được để trống",
      });
    }

    // Prepare chat history for Gemini
    const chatHistory = [
      {
        role: "user",
        parts: [{ text: SYSTEM_PROMPT }],
      },
      {
        role: "model",
        parts: [{ text: "Xin chào! Tôi là AI trợ lý tối ưu CV của JobReady. Tôi sẵn sàng giúp bạn cải thiện CV để tăng cơ hội được tuyển dụng. Bạn có thể chia sẻ nội dung CV hoặc hỏi tôi về cách viết CV chuyên nghiệp nhé!" }],
      },
    ];

    for (const msg of history) {
      if (msg.role === "user") {
        chatHistory.push({ role: "user", parts: [{ text: msg.content }] });
      } else if (msg.role === "assistant") {
        chatHistory.push({ role: "model", parts: [{ text: msg.content }] });
      }
    }

    // Thử từng key, mỗi key tối đa RETRIES_PER_KEY lần, trước khi xoay sang key mới
    const RETRIES_PER_KEY = 3;
    const RETRY_DELAY_MS = 200;   // delay cực ngắn giữa các lần retry cùng key
    const OVERALL_TIMEOUT_MS = 85_000; // 85s tổng timeout
    const startTime = Date.now();
    let aiReply = "";
    let totalAttempts = 0;
    const maxKeyAttempts = API_KEYS.length;

    outerLoop:
    for (let keyAttempt = 0; keyAttempt < maxKeyAttempts; keyAttempt++) {
      // Kiểm tra timeout tổng
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
        // Kiểm tra timeout tổng trước mỗi lần thử
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
          break outerLoop; // ✅ Thành công, thoát cả 2 vòng lặp

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
            break; // Key sai → sang key mới ngay, không retry
          }

          console.warn(`⚠️ Key ...${currentKey.slice(-4)} lần ${retry + 1}/${RETRIES_PER_KEY}: ${err.message?.slice(0, 80)}`);

          if (retry < RETRIES_PER_KEY - 1) {
            // Delay ngắn rồi retry ngay cùng key
            await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
          } else {
            // Hết lượt retry → cooldown key này, sang key mới
            console.warn(`🔄 Key ...${currentKey.slice(-4)} thất bại ${RETRIES_PER_KEY} lần → xoay sang key mới.`);
            markKeyCooldown(currentKey);
          }
        }
      }
    }

    // Nếu vẫn không có reply sau tất cả các lần thử
    if (!aiReply) {
      return res.status(503).json({
        error: "Hệ thống AI hiện đang quá tải. Vui lòng thử lại sau.",
        details: `Đã thử ${totalAttempts} lần trên ${maxKeyAttempts} key nhưng không thành công.`,
      });
    }

    // Extract CV data if present
    let cvData = null;
    const cvDataMatch = aiReply.match(/<CV_DATA>([\s\S]*?)<\/CV_DATA>/);
    if (cvDataMatch) {
      try {
        cvData = JSON.parse(cvDataMatch[1].trim());
      } catch (parseError) {
        console.warn("Failed to parse CV_DATA:", parseError);
      }
    }

    const cleanReply = aiReply.replace(/<CV_DATA>[\s\S]*?<\/CV_DATA>/g, "").trim();

    return res.json({
      reply: cleanReply,
      cvData: cvData,
      readyForPreview: cvData !== null,
      success: true,
    });

  } catch (error) {
    console.error("❌ AI CV Advisor Error:", error);

    if (error.message?.includes("API key")) {
      return res.status(500).json({
        error: "Lỗi cấu hình API. Vui lòng liên hệ quản trị viên.",
        details: "API key không hợp lệ hoặc đã hết hạn",
      });
    }

    return res.status(500).json({
      error: "Có lỗi xảy ra khi xử lý yêu cầu. Vui lòng thử lại.",
      details: error.message,
    });
  }
});

export default router;