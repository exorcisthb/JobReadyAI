import { InterviewQuestion, RoleQuestionBank, SeniorityLevel, QuestionCategory } from './types';
import { webMobileQuestionBanks } from './web-mobile';
import { dataAIQuestionBanks } from './data-ai';
import { testingQAQuestionBanks } from './testing-qa';
import { cybersecurityQuestionBanks } from './cybersecurity';
import { productUXQuestionBanks } from './product-ux';

export * from './types';

// Tổng hợp ngân hàng câu hỏi cho các vị trí phù hợp Intern/Fresher
export const ALL_QUESTION_BANKS: RoleQuestionBank[] = [
  ...webMobileQuestionBanks,
  ...dataAIQuestionBanks,
  ...testingQAQuestionBanks,
  ...cybersecurityQuestionBanks,
  ...productUXQuestionBanks
];

/**
 * Chuẩn hóa chuỗi tìm kiếm để khớp alias
 */
function normalizeRoleName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/**
 * Tìm ngân hàng câu hỏi theo tên vị trí hoặc alias
 */
export function getQuestionBankByRole(roleName: string): RoleQuestionBank | undefined {
  if (!roleName) return undefined;
  const target = normalizeRoleName(roleName);

  // 1. Khớp chính xác tên chuẩn
  const exact = ALL_QUESTION_BANKS.find(b => normalizeRoleName(b.role) === target);
  if (exact) return exact;

  // 2. Khớp alias chuẩn xác
  return ALL_QUESTION_BANKS.find(b =>
    b.aliases.some(alias => normalizeRoleName(alias) === target)
  );
}

/**
 * Lấy danh sách câu hỏi phù hợp theo vị trí, cấp độ và danh mục
 */
export function getQuestionsForRole(
  roleName: string,
  options?: {
    seniority?: SeniorityLevel;
    category?: QuestionCategory;
    limit?: number;
  }
): InterviewQuestion[] {
  const bank = getQuestionBankByRole(roleName);
  if (!bank) return [];

  let results = [...bank.questions];

  if (options?.category) {
    results = results.filter(q => q.category === options.category);
  }

  if (options?.seniority) {
    // Ưu tiên cấp độ tương đương hoặc cận dưới
    const priority = results.filter(q => q.seniority === options.seniority);
    if (priority.length > 0) {
      results = priority;
    }
  }

  if (options?.limit && options.limit > 0) {
    results = results.slice(0, options.limit);
  }

  return results;
}

/**
 * Lựa chọn danh mục câu hỏi chuyên môn cố định cho một phiên phỏng vấn (Chặng 4)
 * - Đảm bảo đủ các khía cạnh: 1 Nền tảng (Foundation), 2 Kỹ năng thực tế (Practical Skills) không trùng chủ đề, 1 Tình huống (Scenario).
 * - Chỉ chọn câu mức Intern/Fresher hoặc Junior mới vào nghề, không advanced.
 * - Không dùng câu Middle/Senior để bù thiếu dữ liệu của vị trí.
 */
export function selectSessionQuestions(
  roleName: string,
  _seniority?: SeniorityLevel,
  count = 4,
): InterviewQuestion[] {
  const bank = getQuestionBankByRole(roleName);
  if (!bank) return [];

  // JobReady AI simulates hiring for entry-level roles. Never fall back to
  // middle/senior questions when the bank has no matching entry-level item.
  const eligible = bank.questions.filter((q) =>
    (q.seniority === 'fresher_intern' || q.seniority === 'junior') && q.difficulty !== 'advanced'
  );
  const foundationPool = eligible.filter((q) => q.category === 'foundation');
  const practicalPool = eligible.filter((q) => q.category === 'practical_skills');
  const scenarioPool = eligible.filter((q) => q.category === 'scenario');

  const selected: InterviewQuestion[] = [];

  // 1. Một câu Foundation
  if (foundationPool.length > 0) {
    selected.push(foundationPool[0]);
  }

  // 2. Hai câu Practical Skills khác nhau về mảng kiến thức/tags để tránh trùng ý
  if (practicalPool.length > 0) {
    selected.push(practicalPool[0]);
    const firstTag = practicalPool[0].tags[0] || "";
    // Tìm câu thứ 2 có tag khác với câu 1 nếu có
    const secondPractical = practicalPool.slice(1).find((q) => !q.tags.includes(firstTag)) || practicalPool[1];
    if (secondPractical) {
      selected.push(secondPractical);
    }
  }

  // 3. Một câu Scenario
  if (scenarioPool.length > 0) {
    selected.push(scenarioPool[0]);
  }

  // Some role banks do not yet contain an entry-level scenario. Fill only
  // from other eligible questions for this role, never from middle/senior.
  for (const question of eligible) {
    if (selected.length >= count) break;
    if (!selected.some((item) => item.id === question.id)) selected.push(question);
  }

  return selected.slice(0, count);
}

/**
 * Tạo chỉ thị kịch bản 4 câu hỏi chuyên môn cố định cho Chặng 4 của Gemini Live
 */
export function buildRoleQuestionsBrief(roleName: string, _seniority?: SeniorityLevel): string {
  const bank = getQuestionBankByRole(roleName);
  if (!bank) return "";

  const selectedQuestions = selectSessionQuestions(roleName, undefined, 4);
  if (selectedQuestions.length === 0) return "";

  const seniorityNote = " (mức Intern/Fresher, tối đa Junior)";

  const questionLines = selectedQuestions.map((q, idx) => {
    const categoryLabel =
      q.category === 'foundation'
        ? 'NỀN TẢNG CỐT LÕI'
        : q.category === 'practical_skills'
        ? 'KỸ NĂNG & QUY TRÌNH THỰC TẾ'
        : 'TÌNH HUỐNG & GIẢI QUYẾT VẤN ĐỀ';
    const followUp = q.followUps && q.followUps.length > 0 ? q.followUps[0] : "";
    return [
      `Câu ${idx + 1} [${categoryLabel}]: "${q.question}"`,
      followUp ? `  ↳ Gợi ý câu hỏi đào sâu nếu ứng viên trả lời tốt hoặc cần làm rõ: "${followUp}"` : "",
    ].filter(Boolean).join("\n");
  });

  return [
    `KỊCH BẢN CÂU HỎI CHUYÊN MÔN CỐ ĐỊNH CHO CHẶNG 4 - VỊ TRÍ: ${bank.role.toUpperCase()}${seniorityNote}:`,
    `Nhóm ngành: ${bank.groupLabel}`,
    `Dưới đây là ${selectedQuestions.length} câu hỏi chuyên môn phù hợp cấp độ mới vào nghề được chọn cho phiên này. Hãy hỏi lần lượt các câu được liệt kê; không tự tăng độ khó lên Middle/Senior:`,
    "",
    questionLines.join("\n\n"),
    "",
    `QUY TẮC BẮT BUỘC THỰC HIỆN TRONG CHẶNG 4:`,
    `- Chỉ hỏi các câu hỏi trong danh sách cố định trên; không tự ý sáng tác câu hỏi chuyên môn khác ngoài danh sách.`,
    `- Hỏi từng câu một theo thứ tự, lắng nghe phản hồi của ứng viên rồi mới dùng câu hỏi đào sâu (nếu cần) trước khi chuyển sang câu tiếp theo.`,
    `- Mỗi câu hỏi chính chỉ đào sâu tối đa một lần để đảm bảo nhịp độ phỏng vấn.`,
    `- TUYỆT ĐỐI KHÔNG đọc barem điểm, tiêu chí đánh giá hay red flags trong cuộc gọi.`
  ].join("\n");
}
