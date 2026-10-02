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
  return [...SCORE_LEVELS].reverse().find((level) => score >= level.min)?.label ?? SCORE_LEVELS[0].label;
}

export function convertCriterionScore(score) {
  if (!Number.isInteger(score) || score < 1 || score > 5) throw new Error("Điểm tiêu chí phải là số nguyên từ 1 đến 5.");
  return Math.round((score / 5) * 100);
}

export function calculateInterviewScore(criteriaScores) {
  const values = new Map(criteriaScores.map(({ key, score }) => [key, score]));
  if (SCORING_RUBRIC.some(({ key }) => !Number.isInteger(values.get(key)) || values.get(key) < 1 || values.get(key) > 5)) {
    throw new Error("Thiếu điểm hợp lệ cho rubric phỏng vấn.");
  }
  return Math.round(SCORING_RUBRIC.reduce((total, item) => total + (values.get(item.key) / 5) * 100 * item.weight / 100, 0));
}

export function calculateTotalScore(interviewScore, matchScore) {
  if (!Number.isFinite(matchScore)) return interviewScore;
  return Math.round(interviewScore * INTERVIEW_SCORE_WEIGHT + matchScore * MATCH_SCORE_WEIGHT);
}

export function criteriaScoresForStorage(criteriaScores) {
  return criteriaScores.map((item) => ({
    ...item,
    score_100: convertCriterionScore(item.score),
  }));
}
