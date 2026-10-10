import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const QUESTIONS_DIR = path.resolve(__dirname, "../../src/data/interview-questions");

const BANK_FILES = [
  "web-mobile.ts",
  "data-ai.ts",
  "testing-qa.ts",
  "cybersecurity.ts",
  "product-ux.ts",
  "additional-it-roles.ts",
  "communications.ts",
  "marketing.ts",
];

let cachedBanks = null;

export function loadQuestionBanks() {
  if (cachedBanks) return cachedBanks;
  const banks = [];
  try {
    for (const f of BANK_FILES) {
      const filePath = path.join(QUESTIONS_DIR, f);
      if (!fs.existsSync(filePath)) continue;
      const content = fs.readFileSync(filePath, "utf8");
      const eqIdx = content.indexOf("=");
      const startBracket = content.indexOf("[", eqIdx);
      const endBracket = content.lastIndexOf("]");
      if (startBracket !== -1 && endBracket !== -1) {
        const jsonStr = content.substring(startBracket, endBracket + 1);
        banks.push(...JSON.parse(jsonStr));
      }
    }
    cachedBanks = banks;
  } catch (err) {
    console.warn("Lỗi khi tải ngân hàng câu hỏi:", err.message);
    cachedBanks = [];
  }
  return cachedBanks;
}

export function normalizeRole(name) {
  if (!name || typeof name !== "string") return "";
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/**
 * Tìm ngân hàng câu hỏi theo tên vị trí hoặc alias chuẩn xác
 */
export function findQuestionBankForRole(roleName) {
  if (!roleName) return null;
  const banks = loadQuestionBanks();
  const target = normalizeRole(roleName);

  const exact = banks.find((b) => normalizeRole(b.role) === target);
  if (exact) return exact;

  return (
    banks.find(
      (b) => Array.isArray(b.aliases) && b.aliases.some((a) => normalizeRole(a) === target)
    ) || null
  );
}

/**
 * Tách từ khóa chuẩn hóa Unicode cho việc so khớp từ vựng
 */
export function tokenizeText(text) {
  if (!text || typeof text !== "string") return new Set();
  const norm = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").trim();
  return new Set(norm.split(/\s+/).filter((w) => w.length >= 2));
}

/**
 * Tính tỷ lệ bao hàm từ vựng (Containment) của questionTokens trong messageTokens
 */
export function calculateContainment(questionTokens, messageTokens) {
  if (!questionTokens.size || !messageTokens.size) return 0;
  let matches = 0;
  for (const t of questionTokens) {
    if (messageTokens.has(t)) matches++;
  }
  return matches / questionTokens.size;
}

/**
 * Chọn 4 câu hỏi chuyên môn cố định chuẩn hóa cho vị trí
 */
export function selectDefaultSessionQuestions(bank, _seniority) {
  if (!bank || !Array.isArray(bank.questions)) return [];

  // This product simulates hiring for Intern/Fresher and early Junior roles.
  // Do not silently fall back to middle/senior questions if a role bank is sparse.
  const eligible = bank.questions.filter(
    (q) => ["fresher_intern", "junior"].includes(q.seniority) && q.difficulty !== "advanced"
  );
  const foundationPool = eligible.filter((q) => q.category === "foundation");
  const practicalPool = eligible.filter((q) => q.category === "practical_skills");
  const scenarioPool = eligible.filter((q) => q.category === "scenario");

  const selected = [];

  // 1 Foundation
  if (foundationPool.length > 0) selected.push(foundationPool[0]);

  // 2 Practical Skills (khác tags)
  if (practicalPool.length > 0) {
    selected.push(practicalPool[0]);
    const firstTag = practicalPool[0].tags?.[0] || "";
    const second = practicalPool.slice(1).find((q) => !q.tags?.includes(firstTag)) || practicalPool[1];
    if (second) selected.push(second);
  }

  // 1 Scenario
  if (scenarioPool.length > 0) selected.push(scenarioPool[0]);

  // Some banks lack an entry-level question in one category. Fill only from
  // other beginner-appropriate questions for this same role.
  for (const question of eligible) {
    if (selected.length >= 4) break;
    if (!selected.some((item) => item.id === question.id)) selected.push(question);
  }

  return selected.slice(0, 4);
}

/**
 * Đối chiếu transcript và theo dõi câu hỏi trong phiên phỏng vấn
 * - Xác thực planned questions đối chiếu với ngân hàng câu hỏi của vị trí (không tin client mù quáng)
 * - Xác định câu nào thực sự được hỏi với ngưỡng tin cậy (confidence >= 0.65)
 * - Kiểm tra xem ứng viên có thực sự trả lời sau câu hỏi đó không (answered: true)
 * - Phát hiện câu bị bỏ qua (unasked) và câu ngoài kế hoạch (unplanned)
 * - CHỈ xuất tiêu chí và redFlags của các câu ĐÃ ĐƯỢC HỎI VÀ ĐÃ TRẢ LỜI
 */
export function trackAndMatchSessionQuestions({ position, plannedQuestions = [], transcript = [], seniority }) {
  const bank = findQuestionBankForRole(position);
  if (!bank) {
    return {
      role_verified: false,
      role: position || "Unknown",
      planned_questions: [],
      asked_questions: [],
      unasked_questions: [],
      unplanned_questions_detected: 0,
      criteria_context: "",
    };
  }

  // 1. Xác thực plannedQuestions từ client; nếu không hợp lệ hoặc thiếu thì tự lấy câu chuẩn từ bank
  let resolvedPlanned = [];
  if (Array.isArray(plannedQuestions) && plannedQuestions.length > 0) {
    for (const item of plannedQuestions) {
      const qId = typeof item === "string" ? item : item?.id;
      const matchedInBank = bank.questions.find((q) => q.id === qId);
      if (matchedInBank) {
        resolvedPlanned.push(matchedInBank);
      }
    }
  }

  if (resolvedPlanned.length === 0) {
    resolvedPlanned = selectDefaultSessionQuestions(bank, seniority);
  }

  // Chuẩn hóa transcript dạng mảng tin nhắn
  const rawTranscript = Array.isArray(transcript) ? transcript : [];
  const turns = rawTranscript.filter(
    (m) => m && (m.role === "assistant" || m.role === "user") && typeof m.content === "string"
  );

  const askedQuestions = [];
  const unaskedQuestions = [];
  const matchedAssistantTurnIndexes = new Set();

  // 2. Đối chiếu từng câu hỏi kế hoạch với các lượt hỏi của trợ lý
  for (const plannedQ of resolvedPlanned) {
    const qTokens = tokenizeText(plannedQ.question);
    const qTags = Array.isArray(plannedQ.tags) ? plannedQ.tags.map((t) => t.toLowerCase()) : [];

    let bestMatch = null;

    for (let i = 0; i < turns.length; i++) {
      const turn = turns[i];
      if (turn.role !== "assistant") continue;

      const mTokens = tokenizeText(turn.content);
      const mText = turn.content.toLowerCase();

      // Tính toán độ tương đồng
      const containment = calculateContainment(qTokens, mTokens);

      // Đếm số tags kỹ thuật xuất hiện trong câu nói của AI
      let matchedTagCount = 0;
      for (const tag of qTags) {
        if (mText.includes(tag)) matchedTagCount++;
      }

      // Kiểm tra sự trùng khớp đoạn văn bản (nếu Gemini trích dẫn câu hỏi)
      const qSnippet = plannedQ.question.toLowerCase().slice(0, 30);
      const hasDirectSnippet = mText.includes(qSnippet);

      // Trích xuất các cụm trong ngoặc nếu có: ví dụ (Transaction Isolation Levels)
      const parenMatches = plannedQ.question.match(/\(([^)]+)\)/g);
      const hasKeyPhraseMatch = Array.isArray(parenMatches) && parenMatches.some((p) => {
        const clean = p.slice(1, -1).trim().toLowerCase();
        return clean.length >= 8 && mText.includes(clean);
      });

      const sharedDistinctiveCount = [...qTokens].filter((t) => mTokens.has(t) && t.length >= 3).length;

      let confidence = 0;
      if (hasDirectSnippet) {
        confidence = 0.95;
      } else if (hasKeyPhraseMatch && (sharedDistinctiveCount >= 4 || matchedTagCount >= 1)) {
        confidence = 0.90;
      } else if (sharedDistinctiveCount >= 6 && matchedTagCount >= 1) {
        confidence = 0.85;
      } else if (containment >= 0.40 && matchedTagCount >= 1) {
        confidence = Math.min(0.90, 0.50 + containment * 0.4 + matchedTagCount * 0.1);
      } else if (sharedDistinctiveCount >= 5 && containment >= 0.25) {
        confidence = 0.75;
      } else if (containment >= 0.45) {
        confidence = 0.75;
      } else if (sharedDistinctiveCount >= 5 && matchedTagCount >= 2) {
        confidence = 0.70;
      } else if (containment >= 0.35 && matchedTagCount >= 2) {
        confidence = 0.68;
      } else if (containment >= 0.25) {
        confidence = 0.50; // Dưới ngưỡng tin cậy
      }

      // Ngưỡng tin cậy chấp nhận: >= 0.65
      if (confidence >= 0.65) {
        // Kiểm tra xem ứng viên có trả lời ở lượt ngay sau đó không
        let candidateAnswer = "";
        for (let j = i + 1; j < turns.length; j++) {
          if (turns[j].role === "user") {
            candidateAnswer = turns[j].content.trim();
            break;
          }
          if (turns[j].role === "assistant") break;
        }

        const isAnswered = candidateAnswer.split(/\s+/).filter(Boolean).length >= 5;

        if (!bestMatch || confidence > bestMatch.confidence) {
          bestMatch = {
            id: plannedQ.id,
            category: plannedQ.category,
            question: plannedQ.question,
            confidence: Number(confidence.toFixed(2)),
            turn_index: i,
            assistant_question_excerpt: turn.content.slice(0, 150),
            answered: isAnswered,
            candidate_answer_excerpt: candidateAnswer ? candidateAnswer.slice(0, 150) : null,
            evaluationCriteria: plannedQ.evaluationCriteria,
            redFlags: plannedQ.redFlags,
          };
        }
      }
    }

    if (bestMatch) {
      matchedAssistantTurnIndexes.add(bestMatch.turn_index);
      askedQuestions.push(bestMatch);
    } else {
      unaskedQuestions.push({
        id: plannedQ.id,
        category: plannedQ.category,
        question: plannedQ.question,
        reason: "Không tìm thấy trong transcript hoặc độ tin cậy dưới ngưỡng 65%",
      });
    }
  }

  // 3. Đếm số câu hỏi trợ lý đặt ra mà không thuộc kế hoạch
  let unplannedCount = 0;
  for (let i = 0; i < turns.length; i++) {
    const turn = turns[i];
    if (turn.role !== "assistant") continue;
    if (matchedAssistantTurnIndexes.has(i)) continue;

    // Lọc bỏ chào hỏi ngắn ở chặng 1 hoặc kết thúc ngắn ở chặng 6
    const wordCount = turn.content.split(/\s+/).filter(Boolean).length;
    if (wordCount >= 25 && turn.content.includes("?")) {
      unplannedCount++;
    }
  }

  // 4. Xây dựng nội dung tiêu chí CHỈ cho các câu ĐÃ ĐƯỢC HỎI VÀ ĐÃ ĐƯỢC TRẢ LỜI
  const validForScoring = askedQuestions.filter((q) => q.answered === true);
  let criteriaContext = "";

  if (validForScoring.length === 0) {
    criteriaContext = `
CẢNH BÁO KIỂM ĐỊNH PHIÊN:
- Không có câu hỏi chuyên môn nào từ kế hoạch phỏng vấn được xác định là đã hỏi và được ứng viên trả lời trong transcript.
- YÊU CẦU:
  1. Chặng 4 (Tình huống và chuyên môn) BẮT BUỘC đánh dấu: covered=false, score=null, comment="Chưa có câu hỏi chuyên môn nào được hỏi và trả lời trong transcript."
  2. Đối với tiêu chí "knowledge" (Kiến thức) và "problem_solving" (Giải quyết vấn đề): Nếu không có nội dung chuyên môn tương ứng, BẮT BUỘC để score=null, status="insufficient_evidence", comment="Chưa đủ căn cứ trong transcript để đánh giá."
  3. TUYỆT ĐỐI KHÔNG tự bịa tiêu chí hoặc trừ điểm ứng viên khi chưa được hỏi.
`;
  } else {
    const criteriaItems = [];
    const redFlagItems = [];

    validForScoring.forEach((q, idx) => {
      criteriaItems.push(`\n[Câu đã hỏi ${idx + 1} - ${q.id} (${q.category})]: "${q.question}"`);
      if (Array.isArray(q.evaluationCriteria)) {
        q.evaluationCriteria.forEach((crit) => {
          criteriaItems.push(`  + Tiêu chí: ${crit}`);
        });
      }
      if (Array.isArray(q.redFlags)) {
        q.redFlags.forEach((rf) => {
          redFlagItems.push(`  ! Red flag (${q.id}): ${rf}`);
        });
      }
    });

    const unaskedNotice =
      unaskedQuestions.length > 0
        ? `\nCÁC CÂU CHƯA ĐƯỢC HỎI HOẶC BỊ BỎ QUA TRONG PHIÊN (${unaskedQuestions.map((q) => q.id).join(", ")}):\n- Ứng viên chưa được hỏi các câu này. TUYỆT ĐỐI KHÔNG trừ điểm hay đánh giá tiêu cực dựa trên các câu chưa diễn ra.\n`
        : "";

    criteriaContext = `
THAM CHIẾU TIÊU CHÍ CHUYÊN MÔN THEO CÂU ĐÃ HỎI TRONG PHIÊN (Vị trí: ${bank.role.toUpperCase()}):
(CHỈ áp dụng tiêu chí cho ${validForScoring.length} câu đã thực sự được hỏi và có câu trả lời bên dưới)

${criteriaItems.join("\n")}

Dấu hiệu cảnh báo năng lực yếu (Red flags cho các câu đã hỏi):
${redFlagItems.join("\n")}
${unaskedNotice}
QUY TẮC ĐÁNH GIÁ:
1. Chỉ đối chiếu câu trả lời chuyên môn với đúng ${validForScoring.length} câu đã hỏi ở trên.
2. Với các tiêu chí hoặc kỹ năng chưa xuất hiện trong transcript, đánh dấu score=null (insufficient_evidence) thay vì suy đoán hoặc trừ điểm.
`;
  }

  return {
    role_verified: true,
    role: bank.role,
    group: bank.group,
    groupLabel: bank.groupLabel,
    planned_questions: resolvedPlanned.map((q) => ({ id: q.id, category: q.category, question: q.question })),
    asked_questions: askedQuestions.map((q) => ({
      id: q.id,
      category: q.category,
      confidence: q.confidence,
      answered: q.answered,
      question: q.question,
    })),
    unasked_questions: unaskedQuestions,
    unplanned_questions_detected: unplannedCount,
    criteria_context: criteriaContext,
  };
}

/**
 * Hàm tương thích xây dựng ngữ cảnh đánh giá theo vị trí và transcript
 */
export function buildRoleEvaluationContext(position, transcript = []) {
  const result = trackAndMatchSessionQuestions({ position, transcript });
  return result.criteria_context;
}
