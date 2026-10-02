import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  MAX_EVALUATION_ATTEMPTS,
  SCORING_RUBRIC,
  calculateInterviewScore,
  criteriaScoresForStorage,
  convertCriterionScore,
} from "../config/scoring.js";

const stages = ["Khởi động", "CV và kinh nghiệm", "Năng lực và hành vi", "Tình huống và chuyên môn", "Động lực và phù hợp văn hóa", "Lương và kết thúc"];

function parseAndValidate(raw) {
  const clean = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const data = JSON.parse(clean);
  if (!Array.isArray(data.criteria_scores) || !Array.isArray(data.stage_feedback) || !Array.isArray(data.strengths) || !Array.isArray(data.weaknesses) || !Array.isArray(data.action_plan) || !Array.isArray(data.sample_improvements) || typeof data.overall_comment !== "string") {
    throw new Error("Thiếu trường trong kết quả đánh giá.");
  }
  const scores = SCORING_RUBRIC.map((rubric) => {
    const item = data.criteria_scores.find((entry) => entry.key === rubric.key);
    if (!Number.isInteger(item?.score) || item.score < 1 || item.score > 5 || typeof item.comment !== "string" || typeof item.evidence !== "string") {
      throw new Error(`Điểm ${rubric.key} không hợp lệ.`);
    }
    return { key: rubric.key, name: rubric.name, score: item.score, comment: item.comment, evidence: item.evidence };
  });
  const stageFeedback = stages.map((stageName, index) => {
    const entry = data.stage_feedback.find((item) => item.stage === index + 1);
    return {
      stage: index + 1,
      stage_name: stageName,
      covered: entry?.covered === true,
      score: entry?.covered === true && Number.isInteger(entry.score) && entry.score >= 1 && entry.score <= 5 ? entry.score : null,
      comment: typeof entry?.comment === "string" ? entry.comment : "Chưa có dữ liệu để nhận xét.",
    };
  });
  const actions = data.action_plan.slice(0, 3).map((item, index) => ({
    priority: index + 1,
    action: String(item.action ?? "").slice(0, 500),
    why: String(item.why ?? "").slice(0, 500),
    how: String(item.how ?? "").slice(0, 1000),
  }));
  if (actions.length !== 3 || actions.some((item) => !item.action || !item.why || !item.how)) throw new Error("Lộ trình phải có đúng ba hành động đầy đủ.");
  return {
    criteria_scores: criteriaScoresForStorage(scores),
    interview_score: calculateInterviewScore(scores),
    position_fit_score: convertCriterionScore(scores.find((item) => item.key === "position_fit").score),
    stage_feedback: stageFeedback,
    strengths: data.strengths.filter((item) => typeof item === "string").slice(0, 5),
    weaknesses: data.weaknesses.filter((item) => typeof item === "string").slice(0, 5),
    action_plan: actions,
    sample_improvements: data.sample_improvements.filter((item) => item && typeof item === "object").slice(0, 5),
    overall_comment: data.overall_comment.slice(0, 3000),
  };
}

export async function evaluateInterview({ transcript, cvData, position }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini API chưa được cấu hình.");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });
  const rubric = SCORING_RUBRIC.map(({ key, name }) => `${key}: ${name} (1-5)`).join("\n");
  const prompt = `Đánh giá cuộc phỏng vấn bằng tiếng Việt. Chỉ sử dụng transcript và CV bên dưới; không suy đoán hay bịa kỹ năng, dự án, kinh nghiệm. Điểm thô từng tiêu chí là số nguyên 1-5. Không tự tính điểm tổng. Bám sát bằng chứng trích ngắn trong transcript. Chặng chưa xảy ra phải covered=false, score=null. action_plan phải đúng 3 việc cụ thể, khả thi. Trả JSON thuần theo schema: {"criteria_scores":[{"key":"...","score":1,"comment":"...","evidence":"..."}],"stage_feedback":[{"stage":1,"stage_name":"...","covered":true,"score":1,"comment":"..."}],"strengths":["..."],"weaknesses":["..."],"action_plan":[{"priority":1,"action":"...","why":"...","how":"..."}],"sample_improvements":[{"question":"...","candidate_answer_summary":"...","better_answer_hint":"..."}],"overall_comment":"..."}. Bao gồm đủ các key rubric sau:\n${rubric}\nVị trí ứng tuyển: ${position || "Không được cung cấp"}\nCV:\n${cvData || "Không có CV văn bản"}\nTranscript:\n${transcript}`;
  let lastError;
  for (let attempt = 1; attempt <= MAX_EVALUATION_ATTEMPTS; attempt += 1) {
    try {
      const result = await model.generateContent(prompt);
      return { ...parseAndValidate(result.response.text()), attempts: attempt };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}
