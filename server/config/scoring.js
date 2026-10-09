export const MIN_ANSWER_TURNS = 3;
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
  { min: 0, label: "Cần cải thiện nhiều" },
  { min: 50, label: "Trung bình" },
  { min: 70, label: "Khá" },
  { min: 85, label: "Tốt" },
];

export function scoreLevel(score) {
  if (!Number.isFinite(score)) return "Chưa đủ căn cứ đánh giá";
  return [...SCORE_LEVELS].reverse().find((level) => score >= level.min)?.label ?? SCORE_LEVELS[0].label;
}

export function convertCriterionScore(score) {
  if (score === null || score === undefined) return null;
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    throw new Error("Điểm tiêu chí phải là số nguyên từ 1 đến 5 hoặc null.");
  }
  return Math.round((score / 5) * 100);
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
    const score100 = (rawScore / 5) * 100;
    const normalizedWeight = item.weight / sumWeight;
    return total + score100 * normalizedWeight;
  }, 0);

  return Math.round(weightedTotal);
}

export function calculateTotalScore(interviewScore, matchScore) {
  if (!Number.isFinite(interviewScore)) return null;
  if (!Number.isFinite(matchScore)) return interviewScore;
  return Math.round(interviewScore * INTERVIEW_SCORE_WEIGHT + matchScore * MATCH_SCORE_WEIGHT);
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
