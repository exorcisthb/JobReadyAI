import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  MAX_EVALUATION_ATTEMPTS,
  SCORING_RUBRIC,
  calculateInterviewScore,
  criteriaScoresForStorage,
  convertCriterionScore,
} from "../config/scoring.js";
import { trackAndMatchSessionQuestions } from "./questionBankHelper.js";

const stages = [
  "Khởi động",
  "CV và kinh nghiệm",
  "Năng lực và hành vi",
  "Tình huống và chuyên môn",
  "Động lực và phù hợp văn hóa",
  "Lương và kết thúc",
];

export function parseAndValidate(raw, trackingResult = null) {
  const clean = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const data = JSON.parse(clean);

  if (
    !Array.isArray(data.criteria_scores) ||
    !Array.isArray(data.stage_feedback) ||
    !Array.isArray(data.strengths) ||
    !Array.isArray(data.weaknesses) ||
    !Array.isArray(data.action_plan) ||
    !Array.isArray(data.sample_improvements) ||
    typeof data.overall_comment !== "string"
  ) {
    throw new Error("Thiếu trường trong kết quả đánh giá.");
  }

  const scores = SCORING_RUBRIC.map((rubric) => {
    const item = data.criteria_scores.find((entry) => entry.key === rubric.key);
    const hasValidScore = Number.isInteger(item?.score) && item.score >= 1 && item.score <= 5;
    const isInsufficient = item?.score === null || item?.score === undefined || item?.status === "insufficient_evidence";

    if (!hasValidScore && !isInsufficient) {
      throw new Error(`Điểm ${rubric.key} không hợp lệ.`);
    }

    const score = hasValidScore ? item.score : null;
    const comment = typeof item?.comment === "string" && item.comment.trim()
      ? item.comment
      : score === null
      ? "Chưa đủ căn cứ trong transcript để đánh giá tiêu chí này."
      : "";
    const evidence = typeof item?.evidence === "string"
      ? item.evidence
      : score === null
      ? "Chưa đủ dữ liệu trong transcript"
      : "";

    return {
      key: rubric.key,
      name: rubric.name,
      score,
      status: score === null ? "insufficient_evidence" : "evaluated",
      comment,
      evidence,
    };
  });

  const stageFeedback = stages.map((stageName, index) => {
    const entry = data.stage_feedback.find((item) => item.stage === index + 1);
    let covered = entry?.covered === true;
    let score = covered && Number.isInteger(entry.score) && entry.score >= 1 && entry.score <= 5 ? entry.score : null;
    let comment = typeof entry?.comment === "string" ? entry.comment : "Chưa có dữ liệu để nhận xét.";

    // Bảo đảm bằng code: Chặng 4 chuyên môn nếu không có câu hỏi nào được hỏi và trả lời thì không được đánh dấu đã diễn ra
    if (index === 3 && trackingResult && trackingResult.role_verified) {
      const answeredCount = trackingResult.asked_questions?.filter((q) => q.answered).length || 0;
      if (answeredCount === 0) {
        covered = false;
        score = null;
        comment = "Chưa có câu hỏi chuyên môn nào từ kế hoạch được hỏi và trả lời trong transcript.";
      }
    }

    if (!covered) {
      score = null;
    }

    return {
      stage: index + 1,
      stage_name: stageName,
      covered,
      score,
      comment,
    };
  });

  const actions = data.action_plan.slice(0, 3).map((item, index) => ({
    priority: index + 1,
    action: String(item.action ?? "").slice(0, 500),
    why: String(item.why ?? "").slice(0, 500),
    how: String(item.how ?? "").slice(0, 1000),
  }));

  if (actions.length !== 3 || actions.some((item) => !item.action || !item.why || !item.how)) {
    throw new Error("Lộ trình phải có đúng ba hành động đầy đủ.");
  }

  const posFitItem = scores.find((item) => item.key === "position_fit");
  const positionFitScore = posFitItem && posFitItem.score !== null ? convertCriterionScore(posFitItem.score) : null;
  const evaluatedCount = scores.filter((item) => item.score !== null).length;

  return {
    criteria_scores: criteriaScoresForStorage(scores),
    interview_score: calculateInterviewScore(scores),
    position_fit_score: positionFitScore,
    evaluated_criteria_count: evaluatedCount,
    total_criteria_count: SCORING_RUBRIC.length,
    stage_feedback: stageFeedback,
    strengths: data.strengths.filter((item) => typeof item === "string").slice(0, 5),
    weaknesses: data.weaknesses.filter((item) => typeof item === "string").slice(0, 5),
    action_plan: actions,
    sample_improvements: data.sample_improvements.filter((item) => item && typeof item === "object").slice(0, 5),
    overall_comment: data.overall_comment.slice(0, 3000),
  };
}

export async function evaluateInterview({ transcript, cvData, position, plannedQuestions = [], seniority }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini API chưa được cấu hình.");

  // Theo dõi và so khớp câu hỏi trong phiên
  const trackingResult = trackAndMatchSessionQuestions({
    position,
    plannedQuestions,
    transcript,
    seniority,
  });

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  });

  const rubric = SCORING_RUBRIC.map(({ key, name }) => `${key}: ${name} (1-5 hoặc null nếu thiếu bằng chứng)`).join("\n");
  const transcriptFormatted = typeof transcript === "string" ? transcript : JSON.stringify(transcript, null, 2);

  const prompt = `Đánh giá cuộc phỏng vấn bằng tiếng Việt. Chỉ sử dụng transcript và CV bên dưới; không suy đoán hay bịa kỹ năng, dự án, kinh nghiệm. Điểm thô từng tiêu chí là số nguyên 1-5, hoặc null nếu transcript không đủ bằng chứng. Không tự tính điểm tổng. Bám sát bằng chứng trích ngắn trong transcript.

QUY TẮC ĐÁNH GIÁ KHÁCH QUAN & CHỐNG SUY ĐOÁN:
1. TIÊU CHÍ THIẾU BẰNG CHỨNG: Nếu transcript không có câu hỏi hoặc ứng viên chưa được hỏi về một tiêu chí nào đó (đặc biệt là knowledge hoặc problem_solving khi câu chuyên môn chưa được hỏi), BẮT BUỘC để score=null, comment="Chưa đủ căn cứ trong transcript để đánh giá". Tuyệt đối KHÔNG gán điểm 1 hay điểm thấp cho tiêu chí chưa được kiểm tra.
2. ĐỒNG BỘ CÁC CHẶNG CHƯA DIỄN RA: Bất kỳ chặng nào chưa xảy ra hoặc chưa hoàn thành (ví dụ chặng 4, 5, 6 nếu phỏng vấn kết thúc sớm hoặc rút ngắn), BẮT BUỘC để covered=false, score=null, comment="Chặng này chưa diễn ra trong phiên phỏng vấn."
3. CHUYÊN MÔN THEO CÂU ĐÃ HỎI: Chỉ đối chiếu câu trả lời chuyên môn với tiêu chí và red flags của các câu hỏi ĐÃ ĐƯỢC HỎI VÀ ĐÃ TRẢ LỜI (được liệt kê trong phần THAM CHIẾU bên dưới). Tuyệt đối không trừ điểm vì các câu chưa được hỏi.
4. action_plan phải đúng 3 việc cụ thể, khả thi.

Trả JSON thuần theo schema: {"criteria_scores":[{"key":"...","score":1,"comment":"...","evidence":"..."}],"stage_feedback":[{"stage":1,"stage_name":"...","covered":true,"score":1,"comment":"..."}],"strengths":["..."],"weaknesses":["..."],"action_plan":[{"priority":1,"action":"...","why":"...","how":"..."}],"sample_improvements":[{"question":"...","candidate_answer_summary":"...","better_answer_hint":"..."}],"overall_comment":"..."}.

Bao gồm đủ các key rubric sau (score có thể là số 1-5 hoặc null):
${rubric}

Vị trí ứng tuyển: ${position || "Không được cung cấp"}
${trackingResult.criteria_context ? `\n${trackingResult.criteria_context}\n` : ""}
CV:
${cvData || "Không có CV văn bản"}

Transcript:
${transcriptFormatted}`;

  let lastError;
  for (let attempt = 1; attempt <= MAX_EVALUATION_ATTEMPTS; attempt += 1) {
    try {
      const result = await model.generateContent(prompt);
      const parsed = parseAndValidate(result.response.text(), trackingResult);
      return {
        ...parsed,
        question_tracking: {
          role_verified: trackingResult.role_verified,
          role: trackingResult.role,
          planned_questions: trackingResult.planned_questions,
          asked_questions: trackingResult.asked_questions,
          unasked_questions: trackingResult.unasked_questions,
          unplanned_questions_detected: trackingResult.unplanned_questions_detected,
        },
        attempts: attempt,
      };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}
