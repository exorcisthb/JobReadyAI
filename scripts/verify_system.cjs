const fs = require('fs');
const path = require('path');
const { ALL_ROLES_CONFIG } = require('./roles_config.cjs');

const OUT_DIR = path.join(__dirname, '..', 'src', 'data', 'interview-questions');

const files = [
  'web-mobile.ts',
  'data-ai.ts',
  'testing-qa.ts',
  'cybersecurity.ts',
  'product-ux.ts'
];

let allBanks = [];

files.forEach(f => {
  const filePath = path.join(OUT_DIR, f);
  if (!fs.existsSync(filePath)) {
    console.error(`Không tìm thấy file: ${filePath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const eqIdx = content.indexOf('=');
  const startBracket = content.indexOf('[', eqIdx);
  const endBracket = content.lastIndexOf(']');
  const jsonStr = content.substring(startBracket, endBracket + 1);
  const parsed = JSON.parse(jsonStr);
  allBanks.push(...parsed);
});

console.log("=== BẮT ĐẦU XÁC MINH HỆ THỐNG NGÂN HÀNG CÂU HỎI PHỎNG VẤN ===");
console.log(`Số ngân hàng vị trí đã đọc: ${allBanks.length} / ${ALL_ROLES_CONFIG.length}`);

let errors = [];
let allIds = new Set();
let totalQuestions = 0;
const normalizedQuestions = new Map();
const allQuestionEntries = [];

// Thống kê nguồn tham chiếu
let totalUrlSources = 0;
let totalInternalSources = 0;
const verifiedExternalDomains = new Set();
const entryLevelCoverage = [];

function normalizeTokens(text) {
  const norm = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').trim();
  return new Set(norm.split(/\s+/).filter(w => w.length >= 2));
}

// 1. Kiểm tra từng vai trò theo cấu hình
ALL_ROLES_CONFIG.forEach(rc => {
  const bank = allBanks.find(b => b.role === rc.role);
  if (!bank) {
    errors.push(`Thiếu ngân hàng cho vị trí: "${rc.role}"`);
    return;
  }

  // Khớp group và groupLabel
  if (bank.group !== rc.group) {
    errors.push(`[${rc.role}] Sai group: nhận "${bank.group}", kỳ vọng "${rc.group}"`);
  }
  if (bank.groupLabel !== rc.groupLabel) {
    errors.push(`[${rc.role}] Sai groupLabel: nhận "${bank.groupLabel}", kỳ vọng "${rc.groupLabel}"`);
  }

  const qs = bank.questions;
  totalQuestions += qs.length;
  const entryLevelQuestionCount = qs.filter(
    (q) => ["fresher_intern", "junior"].includes(q.seniority) && q.difficulty !== "advanced"
  ).length;
  const entryLevelCategoryCounts = Object.fromEntries(
    ["foundation", "practical_skills", "scenario"].map((category) => [
      category,
      qs.filter((q) => ["fresher_intern", "junior"].includes(q.seniority)
        && q.difficulty !== "advanced" && q.category === category).length,
    ])
  );
  entryLevelCoverage.push({ role: rc.role, count: entryLevelQuestionCount, categories: entryLevelCategoryCounts });

  if (qs.length !== 30) {
    errors.push(`Vị trí "${rc.role}" có ${qs.length} câu (kỳ vọng chính xác 30 câu)`);
  }

  const counts = {
    foundation: qs.filter(q => q.category === 'foundation').length,
    practical_skills: qs.filter(q => q.category === 'practical_skills').length,
    scenario: qs.filter(q => q.category === 'scenario').length,
    cv_validation: qs.filter(q => q.category === 'cv_validation').length,
    behavioral: qs.filter(q => q.category === 'behavioral').length
  };

  if (counts.foundation !== 6) errors.push(`[${rc.role}] foundation: ${counts.foundation} != 6`);
  if (counts.practical_skills !== 8) errors.push(`[${rc.role}] practical_skills: ${counts.practical_skills} != 8`);
  if (counts.scenario !== 6) errors.push(`[${rc.role}] scenario: ${counts.scenario} != 6`);
  if (counts.cv_validation !== 5) errors.push(`[${rc.role}] cv_validation: ${counts.cv_validation} != 5`);
  if (counts.behavioral !== 5) errors.push(`[${rc.role}] behavioral: ${counts.behavioral} != 5`);

  const validDifficulties = new Set(['basic', 'intermediate', 'advanced']);
  const validSeniorities = new Set(['fresher_intern', 'junior', 'middle', 'senior_lead']);

  qs.forEach((q) => {
    // ID duy nhất
    if (allIds.has(q.id)) {
      errors.push(`Trùng lặp ID: ${q.id} tại ${rc.role}`);
    }
    allIds.add(q.id);

    // Tiền tố ID khớp cấu hình
    if (!q.id.startsWith(rc.prefix + '-')) {
      errors.push(`[${rc.role}] ID ${q.id} không bắt đầu bằng tiền tố ${rc.prefix}-`);
    }

    // Role trong question khớp role của bank
    if (q.role !== rc.role) {
      errors.push(`[${q.id}] question.role ("${q.role}") != bank.role ("${rc.role}")`);
    }

    // Câu hỏi hợp lệ
    if (!q.question || typeof q.question !== 'string' || q.question.trim().length < 15) {
      errors.push(`[${q.id}] Câu hỏi quá ngắn hoặc không hợp lệ: "${q.question}"`);
    }

    // Độ khó & cấp độ
    if (!validDifficulties.has(q.difficulty)) {
      errors.push(`[${q.id}] difficulty không hợp lệ: "${q.difficulty}"`);
    }
    if (!validSeniorities.has(q.seniority)) {
      errors.push(`[${q.id}] seniority không hợp lệ: "${q.seniority}"`);
    }

    // evaluationCriteria >= 3
    if (!Array.isArray(q.evaluationCriteria) || q.evaluationCriteria.length < 3) {
      errors.push(`[${q.id}] evaluationCriteria < 3 (${q.evaluationCriteria?.length || 0})`);
    } else {
      q.evaluationCriteria.forEach((crit, cIdx) => {
        if (!crit || typeof crit !== 'string' || crit.trim().length < 10) {
          errors.push(`[${q.id}] evaluationCriteria[${cIdx}] quá ngắn hoặc rỗng`);
        }
      });
    }

    // followUps >= 1
    if (!Array.isArray(q.followUps) || q.followUps.length < 1) {
      errors.push(`[${q.id}] followUps < 1`);
    } else {
      q.followUps.forEach((fu, fIdx) => {
        if (!fu || typeof fu !== 'string' || fu.trim().length < 5) {
          errors.push(`[${q.id}] followUps[${fIdx}] không hợp lệ`);
        }
      });
    }

    // tags >= 1
    if (!Array.isArray(q.tags) || q.tags.length === 0) {
      errors.push(`[${q.id}] thiếu tags`);
    }

    // redFlags >= 1
    if (!Array.isArray(q.redFlags) || q.redFlags.length === 0) {
      errors.push(`[${q.id}] thiếu redFlags`);
    } else {
      q.redFlags.forEach((rf, rIdx) => {
        if (!rf || typeof rf !== 'string' || rf.trim().length < 5) {
          errors.push(`[${q.id}] redFlags[${rIdx}] không hợp lệ`);
        }
      });
    }

    // Kiểm tra và phân loại sourceRefs
    if (!Array.isArray(q.sourceRefs) || q.sourceRefs.length === 0) {
      errors.push(`[${q.id}] thiếu sourceRefs`);
    } else {
      q.sourceRefs.forEach((src, sIdx) => {
        if (!src || typeof src !== 'string' || src.trim().length === 0) {
          errors.push(`[${q.id}] sourceRefs[${sIdx}] không hợp lệ hoặc rỗng`);
          return;
        }

        if (src.startsWith('http://') || src.startsWith('https://')) {
          try {
            const parsedUrl = new URL(src);
            if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
              errors.push(`[${q.id}] URL có protocol không hợp lệ: ${src}`);
            } else if (!parsedUrl.hostname || !parsedUrl.hostname.includes('.') || parsedUrl.hostname.endsWith('.')) {
              errors.push(`[${q.id}] URL có hostname không hợp lệ: ${src}`);
            } else {
              totalUrlSources++;
              verifiedExternalDomains.add(parsedUrl.hostname);
            }
          } catch (e) {
            errors.push(`[${q.id}] URL bị lỗi cú pháp: "${src}" (${e.message})`);
          }
        } else if (src.includes('JobReady AI')) {
          // Nguồn tình huống thực tế / câu hỏi tự biên soạn nội bộ
          totalInternalSources++;
        } else {
          // Không phải URL hợp lệ cũng không phải nguồn tự biên soạn có nhãn
          errors.push(`[${q.id}] sourceRefs[${sIdx}] "${src}" không phải URL hợp lệ hay nguồn tự biên soạn JobReady AI`);
        }
      });
    }

    // Trùng lặp nguyên văn
    const norm = q.question.toLowerCase().replace(/[^a-z0-9àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/g, ' ').trim();
    if (normalizedQuestions.has(norm)) {
      const prev = normalizedQuestions.get(norm);
      errors.push(`Trùng câu hỏi nguyên văn giữa [${prev.id} - ${prev.role}] và [${q.id} - ${rc.role}]`);
    } else {
      normalizedQuestions.set(norm, { id: q.id, role: rc.role, text: q.question });
    }

    allQuestionEntries.push({
      id: q.id,
      role: rc.role,
      question: q.question,
      tokens: normalizeTokens(q.question)
    });
  });
});

// 2. Kiểm định câu hỏi gần trùng lặp trên cả 2 phạm vi: Intra-role và Cross-role
// Dùng cùng cơ chế chuẩn hóa và công thức Jaccard similarity
const SIMILARITY_THRESHOLD = 0.70; // Ngưỡng cảnh báo/lỗi 70% tương đồng từ vựng
let nearDupsWithinRole = [];
let nearDupsAcrossRoles = [];

for (let i = 0; i < allQuestionEntries.length; i++) {
  for (let j = i + 1; j < allQuestionEntries.length; j++) {
    const q1 = allQuestionEntries[i];
    const q2 = allQuestionEntries[j];

    let inter = 0;
    for (const t of q1.tokens) {
      if (q2.tokens.has(t)) inter++;
    }
    const union = q1.tokens.size + q2.tokens.size - inter;
    const sim = union === 0 ? 0 : inter / union;

    if (sim >= SIMILARITY_THRESHOLD) {
      const pairInfo = {
        role1: q1.role,
        id1: q1.id,
        role2: q2.role,
        id2: q2.id,
        similarity: (sim * 100).toFixed(1) + '%',
        text1: q1.question.slice(0, 70),
        text2: q2.question.slice(0, 70)
      };
      if (q1.role === q2.role) {
        nearDupsWithinRole.push(pairInfo);
        errors.push(`Gần trùng cùng vị trí [${q1.role}]: ${q1.id} & ${q2.id} (${pairInfo.similarity})`);
      } else {
        nearDupsAcrossRoles.push(pairInfo);
        errors.push(`Gần trùng khác vị trí [${q1.role} / ${q2.role}]: ${q1.id} & ${q2.id} (${pairInfo.similarity})`);
      }
    }
  }
}

console.log("\n--- BÁO CÁO KIỂM TRA ĐỘ TRÙNG LẶP (LEXICAL SIMILARITY) ---");
const expectedQuestionCount = ALL_ROLES_CONFIG.length * 30;
console.log(`- Tổng số câu hỏi kiểm tra: ${totalQuestions} / ${expectedQuestionCount}`);
console.log(`- Tổng số ID duy nhất: ${allIds.size} / ${expectedQuestionCount}`);
console.log(`- Trùng lặp nguyên văn (Exact Duplicates): ${totalQuestions - normalizedQuestions.size}`);
console.log(`- Gần trùng trong cùng vị trí (Intra-role, Jaccard >= ${(SIMILARITY_THRESHOLD * 100)}%): ${nearDupsWithinRole.length}`);
console.log(`- Gần trùng giữa các vị trí khác nhau (Cross-role, Jaccard >= ${(SIMILARITY_THRESHOLD * 100)}%): ${nearDupsAcrossRoles.length}`);
console.log(`[LƯU Ý]: Đây là kiểm định tương đồng từ vựng (lexical / token-based Jaccard similarity); kiểm định này không tuyên bố phát hiện được toàn bộ các trường hợp trùng lặp về mặt ý nghĩa ngữ nghĩa (semantic similarity).`);

console.log("\n--- BÁO CÁO XÁC MINH NGUỒN THAM CHIẾU (SOURCE REFERENCES) ---");
console.log(`- Tổng số lượt tham chiếu URL tài liệu kỹ thuật bên ngoài: ${totalUrlSources}`);
console.log(`- Số domain kỹ thuật uy tín đã xác thực cú pháp: ${verifiedExternalDomains.size}`);
console.log(`- Tổng số lượt tham chiếu tình huống nghiệp vụ tự biên soạn JobReady AI: ${totalInternalSources}`);
console.log(`[GIỚI HẠN KIỂM ĐỊNH NGUỒN]: Script tự động kiểm tra định dạng cú pháp URL và nhãn chuẩn hóa. Việc xác thực nội dung chi tiết của tài liệu kỹ thuật có tương thích 100% với chủ đề câu hỏi đòi hỏi chuyên gia chuyên môn review thủ công.`);

const rolesBelowInterviewMinimum = entryLevelCoverage.filter(({ categories }) =>
  categories.foundation < 1 || categories.practical_skills < 2 || categories.scenario < 1
);
console.log("\n--- KIỂM TRA MỨC PHÙ HỢP INTERN/FRESHER ---");
console.log(`- Vị trí có tối thiểu 1 Foundation, 2 Practical Skills và 1 Scenario phù hợp: ${entryLevelCoverage.length - rolesBelowInterviewMinimum.length} / ${entryLevelCoverage.length}`);
if (rolesBelowInterviewMinimum.length > 0) {
  console.warn("[CẦN BIÊN SOẠN BỔ SUNG] Một số vị trí chưa đủ cấu trúc câu hỏi chuyên môn mới vào nghề:");
  rolesBelowInterviewMinimum.forEach(({ role, categories }) => console.warn(
    `- ${role}: Foundation ${categories.foundation}, Practical ${categories.practical_skills}, Scenario ${categories.scenario}`
  ));
}

if (errors.length > 0) {
  console.error("\n❌ PHÁT HIỆN CÁC LỖI HỆ THỐNG:");
  errors.slice(0, 30).forEach(e => console.error("- " + e));
  if (errors.length > 30) console.error(`... và còn ${errors.length - 30} lỗi khác.`);
  process.exit(1);
} else {
  console.log("\n✅ XÁC MINH CẤU TRÚC NGÂN HÀNG THÀNH CÔNG.");
  console.log(`✅ Đủ ${ALL_ROLES_CONFIG.length} vị trí cấu hình chuẩn.`);
  console.log("✅ Đúng 30 câu mỗi vị trí với phân bổ chính xác 6 Foundation / 8 Practical / 6 Scenario / 5 CV Validation / 5 Behavioral.");
  console.log("✅ 100% ID duy nhất và có tiền tố chuẩn.");
  console.log("✅ 0 câu trùng lặp nguyên văn hoặc gần trùng từ vựng (ngưỡng 70%).");
  console.log("✅ 100% câu hỏi có >= 3 tiêu chí đánh giá, >= 1 câu hỏi đào sâu, tags, redFlags và nguồn tham chiếu hợp lệ.");
  if (rolesBelowInterviewMinimum.length > 0) {
    console.warn(`⚠️ Chưa sẵn sàng hoàn toàn cho phỏng vấn Intern/Fresher: ${rolesBelowInterviewMinimum.length} vị trí thiếu cấu trúc chuyên môn.`);
  } else {
    console.log(`✅ Cả ${ALL_ROLES_CONFIG.length} vị trí đều có đủ 4 câu chuyên môn mới vào nghề theo cấu trúc Foundation / 2 Practical / Scenario.`);
  }
}
