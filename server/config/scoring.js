export const MIN_ANSWER_TURNS = 4;
export const MIN_ANSWER_WORDS = 50;
export const MIN_EVALUATION_DURATION = 90;
export const MIN_COMPLETED_SCORE = 40;
export const MAX_EVALUATION_ATTEMPTS = 3;
export const MATCH_SCORE_WEIGHT = 0.3;
export const INTERVIEW_SCORE_WEIGHT = 0.7;

export const SCORING_RUBRIC = [
  { key: "knowledge", name: "Kiến thức và nội dung trả lời", weight: 35 },
  { key: "problem_solving", name: "Giải quyết vấn đề", weight: 25 },
  { key: "communication", name: "Giao tiếp và cấu trúc câu trả lời (STAR)", weight: 20 },
  { key: "position_fit", name: "Mức độ phù hợp CV và vị trí", weight: 20 },
];

export const SCORE_LEVELS = [
  { min: 0, label: "Cần cải thiện" },
  { min: 70, label: "Khá" },
  { min: 85, label: "Tốt" },
  { min: 95, label: "Xuất sắc" },
];

export function classifyInterviewSession(conversation, duration) {
  let messages = conversation;
  if (typeof messages === "string") {
    try { messages = JSON.parse(messages); } catch { messages = []; }
  }
  const answers = [];
  let currentAnswer = "";
  for (const message of Array.isArray(messages) ? messages : []) {
    if (message?.role === "user" && typeof message.content === "string") {
      currentAnswer += ` ${message.content}`;
    } else if (message?.role === "assistant" && currentAnswer.trim()) {
      answers.push(currentAnswer.trim());
      currentAnswer = "";
    }
  }
  if (currentAnswer.trim()) answers.push(currentAnswer.trim());
  const answerCount = answers.length;
  const qualityAnswerCount = answers.filter((answer) =>
    answer.split(/\s+/u).filter((word) => /[\p{L}\p{N}]/u.test(word)).length >= MIN_ANSWER_WORDS
  ).length;
  const seconds = Number.isFinite(duration) ? Math.max(0, duration) : 0;
  const status = seconds < 30 || answerCount <= 1
    ? "abandoned"
    : seconds < MIN_EVALUATION_DURATION || qualityAnswerCount < MIN_ANSWER_TURNS
    ? "insufficient_data"
    : "eligible";
  return { status, answerCount, qualityAnswerCount };
}

export function hasSufficientDataForEvaluation(conversation, duration) {
  return classifyInterviewSession(conversation, duration).status === "eligible";
}

export function scoreLevel(score) {
  if (!Number.isFinite(score)) return "Chưa đủ căn cứ đánh giá";
  return [...SCORE_LEVELS].reverse().find((level) => score >= level.min)?.label ?? SCORE_LEVELS[0].label;
}

export function convertCriterionScore(score) {
  if (score === null || score === undefined) return null;
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    throw new Error("Điểm tiêu chí phải là số nguyên từ 1 đến 5 hoặc null.");
  }
  return Math.round(MIN_COMPLETED_SCORE + ((score - 1) / 4) * (100 - MIN_COMPLETED_SCORE));
}

/**
 * Tính điểm phỏng vấn tổng hợp:
 * - Chỉ tính trên các tiêu chí CÓ ĐỦ BẰNG CHỨNG (điểm số nguyên 1-5).
 * - Chuẩn hóa trọng số của các tiêu chí có điểm về 100% (không kéo điểm xuống vì thiếu bằng chứng).
 * - Nếu không có tiêu chí nào đủ bằng chứng, trả về null.
 */
export function calculateInterviewScore(criteriaScores) {
  const values = new Map(criteriaScores.map(({ key, score }) => [key, score]));

  // Lọc ra các tiêu chí có điểm hợp lệ (1-5)
  const evaluatedItems = SCORING_RUBRIC.filter((item) => {
    const score = values.get(item.key);
    return Number.isInteger(score) && score >= 1 && score <= 5;
  });

  // Nếu không có tiêu chí nào có đủ dữ liệu, không tạo điểm giả
  if (evaluatedItems.length === 0) {
    return null;
  }

  // Chuẩn hóa trọng số trên tổng trọng số các tiêu chí đã được đánh giá
  const sumWeight = evaluatedItems.reduce((sum, item) => sum + item.weight, 0);
  const weightedTotal = evaluatedItems.reduce((total, item) => {
    const rawScore = values.get(item.key);
    const score100 = convertCriterionScore(rawScore);
    const normalizedWeight = item.weight / sumWeight;
    return total + score100 * normalizedWeight;
  }, 0);

  return Math.round(weightedTotal);
}

export function calculateTotalScore(interviewScore, matchScore) {
  if (!Number.isFinite(interviewScore)) return null;
  const score = !Number.isFinite(matchScore)
    ? interviewScore
    : interviewScore * INTERVIEW_SCORE_WEIGHT + matchScore * MATCH_SCORE_WEIGHT;
  return Math.max(MIN_COMPLETED_SCORE, Math.min(100, Math.round(score)));
}

export function criteriaScoresForStorage(criteriaScores) {
  return criteriaScores.map((item) => {
    const isValid = Number.isInteger(item.score) && item.score >= 1 && item.score <= 5;
    return {
      ...item,
      score: isValid ? item.score : null,
      score_100: isValid ? convertCriterionScore(item.score) : null,
      status: isValid ? "evaluated" : "insufficient_evidence",
    };
  });
}
