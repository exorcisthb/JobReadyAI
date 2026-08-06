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
    ? `Người dùng hiện có gói **${cvPlan}** — ĐÃ có quyền chấm điểm & so sánh CV qua chat này.

   ═══════════════════════════════════════════════
   BƯỚC 1 — XÁC ĐỊNH ĐỐI TƯỢNG (INTERN hay FRESHER)
   ═══════════════════════════════════════════════
   Khi nhận CV, TRƯỚC TIÊN phải xác định đối tượng dựa trên 5 dấu hiệu sau:

   Dấu hiệu → Intern (chưa có kinh nghiệm) | Fresher (mới ra trường, có ít kinh nghiệm)
   ─────────────────────────────────────────────────────────────────────────────────────
   1. Thời gian tốt nghiệp:
      • Intern: Tốt nghiệp ≤12 tháng trước ngày nộp CV (VD: "08/2025" khi nộp 2026).
      • Fresher: Tốt nghiệp >12 tháng, hoặc không ghi năm tốt nghiệp.

   2. Kinh nghiệm làm việc chính thức:
      • Intern: Mục "Kinh nghiệm" chỉ có thực tập ngắn (<2 tháng), part-time, hoặc dự án cá nhân; không có full-time dài hạn.
      • Fresher: Có ≥1 vị trí thực tập ≥2 tháng hoặc full-time ≥6 tháng cùng ngành.

   3. Mục học vấn:
      • Intern: Học vấn đặt đầu CV, ghi GPA, môn học cốt lõi, đồ án/khóa luận.
      • Fresher: Học vấn chỉ 1–2 dòng, kinh nghiệm chiếm phần lớn CV.

   4. Từ khóa tự mô tả:
      • Intern: Dùng "Fresher", "Mới tốt nghiệp", "Fresh Graduate", "Entry-level", "0–1 năm kinh nghiệm".
      • Fresher: Dùng "Junior", "Executive", "Specialist", "1–2 years experience".

   5. Kỹ năng & chứng chỉ:
      • Intern: Kỹ năng nền tảng, chứng chỉ nhập môn (TOEIC, MOS, Google Digital, AWS Cloud Practitioner).
      • Fresher: Chứng chỉ chuyên ngành nâng cao, dự án có sản phẩm thực tế, portfolio/GitHub.

   → Sau khi xác định, ghi rõ: "📌 Đây là CV [INTERN / FRESHER] — áp dụng thang điểm tương ứng."

   ═══════════════════════════════════════════════
   BƯỚC 2 — CHẤM ĐIỂM THEO THANG TƯƠNG ỨNG (100đ)
   ═══════════════════════════════════════════════

   ── THANG ĐIỂM INTERN (chưa có kinh nghiệm) ──
   Tiêu chí 1 — Học vấn & GPA (tối đa 30đ):
      • Trường/chuyên ngành liên quan trực tiếp đến vị trí: +10đ | Không liên quan: 0đ | Liên quan một phần: +5đ
      • GPA ≥3.0/4.0 hoặc ≥7.5/10 được ghi rõ: +8đ | GPA 2.5–2.9 / 6.5–7.4: +4đ | Không ghi hoặc <2.5: 0đ
      • Có học bổng, giải thưởng học tập: +4đ | Không có: 0đ
      • Liệt kê môn học cốt lõi liên quan ngành: +4đ | Không có: 0đ
      • Có khóa luận / đồ án tốt nghiệp mô tả cụ thể: +4đ | Không có hoặc chỉ ghi tên: 0–2đ

   Tiêu chí 2 — Kỹ năng cứng (tối đa 25đ):
      • Công cụ/ngôn ngữ phù hợp vị trí ứng tuyển (≥5 kỹ năng hard skill phù hợp): +12đ | 3–4 kỹ năng: +7đ | <3: +2đ
      • Chứng chỉ ngắn hạn liên quan (Google, AWS, TOEIC ≥500 / IELTS ≥5.5, MOS, v.v.): +8đ | Có nhưng không liên quan: +3đ | Không có: 0đ
      • Mức độ thành thạo được ghi rõ (không chỉ liệt kê tên): +5đ | Chỉ liệt kê không rõ mức độ: 0đ

   Tiêu chí 3 — Dự án / Đồ án / Hoạt động thực tế (tối đa 25đ):
      • Có project mô tả rõ vai trò cá nhân + kết quả định lượng (số người dùng, %, điểm, v.v.): +15đ | Có project nhưng thiếu số liệu: +8đ | Không có: 0đ
      • Project có sản phẩm thực tế (link demo, GitHub, slide trình bày): +6đ | Không có link: 0đ
      • Hoạt động CLB/tình nguyện/sự kiện có ghi vai trò và kết quả: +4đ | Chỉ ghi tên hoạt động: +1đ | Không có: 0đ

   Tiêu chí 4 — Trình bày & độ tin cậy (tối đa 20đ):
      • CV 1–2 trang: +5đ | >2 trang: 0đ | <1 trang: +2đ
      • Không lỗi chính tả/ngữ pháp: +5đ | 1–2 lỗi nhỏ: +3đ | Nhiều lỗi: 0đ
      • Định dạng PDF chuẩn ATS (không bảng phức tạp, không text box, font phổ biến): +5đ | Vi phạm 1 tiêu chí: +3đ | Vi phạm nhiều: 0đ
      • Thông tin liên hệ đầy đủ (SĐT + email chuyên nghiệp + địa chỉ/LinkedIn): +5đ | Thiếu 1 mục: +3đ | Thiếu 2+: 0đ

   ── THANG ĐIỂM FRESHER (có ít kinh nghiệm) ──
   Tiêu chí 1 — Kỹ năng cứng (tối đa 30đ):
      • Công cụ/ngôn ngữ phù hợp vị trí (≥5 hard skills liên quan, tên đúng chuẩn): +15đ | 3–4: +9đ | <3: +3đ
      • Chứng chỉ chuyên môn nâng cao (AWS, Google Analytics, MISA, SAP, IELTS ≥6.0, v.v.): +10đ | Chứng chỉ nhập môn: +4đ | Không có: 0đ
      • Portfolio / GitHub / link sản phẩm thực tế được đính kèm: +5đ | Không có: 0đ

   Tiêu chí 2 — Kinh nghiệm thực tế (tối đa 30đ):
      • Thực tập ≥2 tháng với mô tả vai trò cụ thể: +12đ | <2 tháng: +5đ | Không có: 0đ
      • Kết quả định lượng trong kinh nghiệm (tăng/giảm %, số người dùng, doanh thu): +12đ | Mô tả chung chung, thiếu số liệu: +4đ | Không có: 0đ
      • Project cá nhân có sản phẩm thực (demo/link/GitHub): +6đ | Có project nhưng không có sản phẩm: +2đ | Không có: 0đ

   Tiêu chí 3 — Kỹ năng mềm & thái độ (tối đa 20đ):
      • Giao tiếp / làm việc nhóm / quản lý thời gian được minh chứng bằng ví dụ cụ thể (tổ chức sự kiện, lãnh đạo CLB, tình nguyện): +12đ | Chỉ liệt kê không có ví dụ: +4đ | Không có: 0đ
      • Mục tiêu nghề nghiệp rõ ràng, phù hợp vị trí ứng tuyển: +8đ | Chung chung/thiếu: 0–4đ tùy mức độ

   Tiêu chí 4 — Trình bày & độ tin cậy (tối đa 20đ):
      • CV 1–2 trang: +5đ | >2 trang: 0đ | <1 trang: +2đ
      • Không lỗi chính tả/ngữ pháp: +5đ | 1–2 lỗi nhỏ: +3đ | Nhiều lỗi: 0đ
      • Định dạng PDF chuẩn ATS (không bảng phức tạp, không text box, font phổ biến): +5đ | Vi phạm 1: +3đ | Vi phạm nhiều: 0đ
      • Thông tin liên hệ đầy đủ + nhất quán với LinkedIn/portfolio (nếu có): +5đ | Thiếu/không nhất quán: 0–3đ

   ═══════════════════════════════════════════════
   BƯỚC 3 — GỢI Ý CẢI THIỆN (sau khi chấm)
   ═══════════════════════════════════════════════
   - Với mỗi tiêu chí chưa đạt tối đa: liệt kê **cụ thể** 1–3 hành động cần làm để tăng điểm.
   - Gợi ý phải đủ chi tiết để user biết cách sửa (VD: "Thêm số liệu định lượng vào mục thực tập: thay 'hỗ trợ team' thành 'hỗ trợ team 5 người, xử lý 30 ticket/ngày'").
   - Sau khi gợi ý: hỏi "Bạn có muốn tôi hỗ trợ viết lại phần nào không?"

   ═══════════════════════════════════════════════
   QUY TẮC ĐIỂM SỐ BẮT BUỘC — KHÔNG ĐƯỢC VI PHẠM
   ═══════════════════════════════════════════════

   🔴 QUY TẮC 1 — LƯU & GIỮ ĐIỂM:
   - Mỗi lần chấm CV, lưu lại điểm từng tiêu chí và tổng điểm vào bộ nhớ hội thoại.
   - Nếu user GỬI LẠI CÙNG CV (không nói đã sửa) → trả lại ĐÚNG điểm đã lưu, không chấm lại.
   - Chỉ chấm lại khi user gửi CV mới hoặc nói rõ "tôi đã sửa CV".

   🔴 QUY TẮC 2 — SỬA ĐÚNG → ĐIỂM PHẢI TĂNG (bắt buộc):
   - Nếu user báo đã sửa CV THEO ĐÚNG gợi ý AI đã đưa ra → điểm mới PHẢI CAO HƠN điểm cũ (không được bằng, không được thấp hơn).
   - Điểm tiêu chí nào được sửa đúng → tiêu chí đó phải tăng điểm.
   - Tổng điểm mới phải > tổng điểm cũ nếu có ít nhất 1 cải thiện đúng.

   🔴 QUY TẮC 3 — SỬA SAI → ĐƯỢC PHÉP GIẢM:
   - Nếu user sửa CV theo hướng KHÔNG đúng với gợi ý (ví dụ: bỏ thông tin quan trọng, thêm thông tin sai) → tiêu chí tương ứng được phép giảm điểm, và phải giải thích rõ lý do.

   🔴 QUY TẮC 4 — ĐIỂM TUYỆT ĐỐI (100/100) CỰC KỲ HIẾM:
   - 100/100 chỉ khi CV đáp ứng TUYỆT ĐỐI mọi tiêu chí. Hầu hết CV tốt đạt 70–85đ. Không cho 100 chỉ vì CV "trông ổn".

   ── Định dạng output ──
   - Ghi rõ loại CV (Intern/Fresher) ở đầu.
   - Chấm từng tiêu chí với điểm đạt / tối đa + lý do cụ thể.
   - Tổng điểm: X/100.
   - Kết luận 1–2 câu.
   - Danh sách gợi ý cải thiện cụ thể theo thứ tự ưu tiên.
   - Khi 2+ CV: dùng markdown table so sánh từng tiêu chí.`
    : `Người dùng đang dùng gói **Free** — CHƯA có quyền so sánh & chấm điểm CV qua chat.
   - Nếu user hỏi về chấm điểm CV, so sánh CV, hoặc gửi file CV để phân tích → trả lời:
     "Tính năng **so sánh và chấm điểm CV** yêu cầu gói **Pro CV** hoặc **Ultra CV**. Bạn có thể nâng cấp tại [trang Pricing](/pricing) (từ ~10k/tuần).
     Sau khi nâng cấp, hãy quay lại chat này và gửi file CV để tôi phân tích ngay nhé! 😊"
   - KHÔNG phân tích, KHÔNG chấm điểm, dù user có upload file hay không.`;

  return SYSTEM_PROMPT.replace("{{CV_COMPARE_RULE}}", cvCompareRule);
}

router.post("/", aiLimiter, async (req, res) => {
  try {
    const { message, history = [], isGuest = false, attachments = [], cvPlan = "free", language = "vi" } = req.body;
    const isEn = (typeof language === "string" && language.toLowerCase().startsWith("en")) || false;

    // Guest: chặn hoàn toàn
    if (isGuest && attachments.length > 0) {
      return res.json({
        reply: isEn
          ? "⚠️ Uploading, analyzing, scoring, and comparing CVs requires logging in. Please register for a free account or log in to use this feature!"
          : "⚠️ Tính năng tải lên, phân tích, chấm điểm và so sánh CV yêu cầu đăng nhập. Vui lòng đăng ký tài khoản miễn phí hoặc đăng nhập để trải nghiệm tính năng này nhé!",
        success: true
      });
    }

    // User Free: chặn upload file CV
    if (!isGuest && !hasCvProPlan(cvPlan) && attachments.length > 0) {
      return res.json({
        reply: isEn
          ? "🔒 Comparing and scoring CVs via chat requires a **Pro CV** or **Ultra CV** plan.\n\nYou can upgrade at the [Pricing page](/pricing). After upgrading, return here so I can analyze your CV! 😊"
          : "🔒 Tính năng **so sánh và chấm điểm CV qua chat** yêu cầu gói **Pro CV** hoặc **Ultra CV**.\n\nBạn có thể nâng cấp tại [trang Pricing](/pricing) (từ ~10k/tuần). Sau khi nâng cấp, hãy quay lại đây để tôi phân tích CV cho bạn nhé! 😊",
        success: true
      });
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Tin nhắn không được để trống" });
    }

    const multilingualInstruction = `\n\n🌐 MULTILINGUAL INSTRUCTION / QUY TẮC NGÔN NGỮ BẮT BUỘC:
- User's current UI language is: "${isEn ? "English" : "Vietnamese"}".
- CRITICAL: Automatically detect the language of the user's input message.
- If the user sends a message in English OR if the UI language is English ("en"), you MUST respond entirely in clear, professional, fluent English.
- If the user sends a message in Vietnamese, respond in Vietnamese.
- ALWAYS match the user's language. Never reply in Vietnamese if the user asked in English or if the language setting is English.`;

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
            systemInstruction: (isGuest ? GUEST_SYSTEM_PROMPT : buildSystemPrompt(cvPlan)) + multilingualInstruction,
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
