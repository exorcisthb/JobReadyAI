import test from "node:test";
import assert from "node:assert/strict";
import {
  findQuestionBankForRole,
  trackAndMatchSessionQuestions,
  selectDefaultSessionQuestions,
  buildRoleEvaluationContext,
} from "../service/questionBankHelper.js";
import { parseAndValidate } from "../service/InterviewEvaluationService.js";
import { calculateInterviewScore, calculateTotalScore, scoreLevel } from "../config/scoring.js";

test("findQuestionBankForRole finds exact and alias roles", () => {
  const fe = findQuestionBankForRole("Frontend Developer");
  assert.ok(fe, "Should find Frontend Developer");
  assert.equal(fe.role, "Frontend Developer");

  const feAlias = findQuestionBankForRole("lap trinh vien frontend");
  assert.ok(feAlias, "Should find by alias");
  assert.equal(feAlias.role, "Frontend Developer");

  const cv = findQuestionBankForRole("Computer Vision Engineer");
  assert.ok(cv, "Should find Computer Vision Engineer");
  assert.equal(cv.role, "Computer Vision Engineer");
});

test("Vị trí không khớp: role mismatch returns role_verified false and does not throw", () => {
  const result = trackAndMatchSessionQuestions({
    position: "Phi hành gia vũ trụ / Astronaut",
    transcript: [{ role: "assistant", content: "Bạn có thích bay vào không gian không?" }],
  });
  assert.equal(result.role_verified, false);
  assert.equal(result.criteria_context, "");
  assert.equal(result.planned_questions.length, 0);

  const context = buildRoleEvaluationContext("Nonexistent Unknown Position");
  assert.equal(context, "");
});

test("Chỉ chọn câu mới vào nghề; không fallback sang Middle/Senior khi thiếu câu", () => {
  const bank = findQuestionBankForRole("Frontend Developer");
  assert.ok(bank);

  const questions = selectDefaultSessionQuestions(bank, "invalid_super_senior_level_99");
  assert.ok(questions.length <= 4, "Should return no more than four questions");
  assert.ok(questions.length > 0, "Frontend bank has some entry-level questions");
  assert.ok(questions.every((q) => ["fresher_intern", "junior"].includes(q.seniority)));
  assert.ok(questions.every((q) => q.difficulty !== "advanced"));
  assert.equal(new Set(questions.map((q) => q.id)).size, questions.length, "Question IDs should not repeat");
});

test("Vị trí cấp cao đã bị loại khỏi ngân hàng luyện phỏng vấn Intern/Fresher", () => {
  assert.equal(findQuestionBankForRole("Security Architect"), null);
});

test("Câu Gemini diễn đạt lại: rephrased question detected with confidence >= 0.65 and answered", () => {
  const bank = findQuestionBankForRole("Frontend Developer");
  const planned = selectDefaultSessionQuestions(bank);
  const target = planned[0];
  const transcript = [
    {
      role: "assistant",
      content: `Anh muốn hỏi em: ${target.question}`,
    },
    {
      role: "user",
      content: "Dạ, em hiểu nội dung này và có thể giải thích các khái niệm chính, kèm ví dụ em từng học hoặc thực hành trong dự án cá nhân.",
    },
  ];

  const result = trackAndMatchSessionQuestions({
    position: "Frontend Developer",
    plannedQuestions: planned,
    transcript,
  });

  assert.equal(result.role_verified, true);
  const asked = result.asked_questions.find((q) => q.id === target.id);
  assert.ok(asked, `Should match ${target.id}`);
  assert.ok(asked.confidence >= 0.65, `Confidence ${asked.confidence} should be >= 0.65`);
  assert.equal(asked.answered, true, "Candidate answered with >= 5 words");
  assert.ok(result.criteria_context.includes(target.id), `Criteria context should contain ${target.id}`);
  assert.ok(result.criteria_context.includes(`Red flag (${target.id})`), "Should include red flags for asked question");
});

test("Câu bị bỏ qua: unasked questions excluded from criteria and flagged as unasked", () => {
  const bank = findQuestionBankForRole("Frontend Developer");
  const planned = selectDefaultSessionQuestions(bank);
  const target = planned[0];
  // Chỉ hỏi câu đầu tiên, bỏ qua các câu còn lại
  const transcript = [
    {
      role: "assistant",
      content: target.question,
    },
    {
      role: "user",
      content: "Dạ có 4 cấp độ là Read Uncommitted, Read Committed, Repeatable Read và Serializable. Serializable là mức cao nhất tránh hoàn toàn dirty read và phantom read.",
    },
  ];

  const result = trackAndMatchSessionQuestions({
    position: "Frontend Developer",
    plannedQuestions: planned,
    transcript,
  });

  assert.equal(result.asked_questions.length, 1);
  assert.equal(result.unasked_questions.length, planned.length - 1);
  assert.ok(result.criteria_context.includes("CÁC CÂU CHƯA ĐƯỢC HỎI HOẶC BỊ BỎ QUA TRONG PHIÊN"));
  assert.ok(result.criteria_context.includes("TUYỆT ĐỐI KHÔNG trừ điểm"));

  // Các câu bị bỏ qua không được có tiêu chí riêng trong THAM CHIẾU
  for (const unasked of result.unasked_questions) {
    assert.ok(!result.criteria_context.includes(`[Câu đã hỏi - ${unasked.id}]`));
  }
});

test("Câu hỏi ngoài kế hoạch: detects unplanned questions in transcript", () => {
  const transcript = [
    {
      role: "assistant",
      content: "Ngoài nội dung chính, bạn thích du lịch ở đâu nhất, thường chọn phương tiện gì, thích đi cùng ai, và hoạt động nào khiến chuyến đi cuối tuần trở nên đáng nhớ nhất?",
    },
    {
      role: "user",
      content: "Dạ em từng chạy giải VnExpress Marathon 21km và điều đó giúp em giữ được kỷ luật cao.",
    },
  ];

  const result = trackAndMatchSessionQuestions({
    position: "Frontend Developer",
    transcript,
  });

  assert.ok(result.unplanned_questions_detected > 0, "Should detect at least 1 unplanned question");
});

test("Transcript thiếu câu trả lời: candidate gives short or no answer marked as answered: false", () => {
  const bank = findQuestionBankForRole("Frontend Developer");
  const planned = selectDefaultSessionQuestions(bank);
  const target = planned[0];
  const transcript = [
    {
      role: "assistant",
      content: target.question,
    },
    {
      role: "user",
      content: "Dạ em...", // < 5 words
    },
    {
      role: "assistant",
      content: "Chúng ta sẽ chuyển sang phần tiếp theo nhé.",
    },
  ];

  const result = trackAndMatchSessionQuestions({
    position: "Frontend Developer",
    plannedQuestions: planned,
    transcript,
  });

  const asked = result.asked_questions.find((q) => q.id === target.id);
  assert.ok(asked, "Question was asked");
  assert.equal(asked.answered, false, "Candidate did not provide a substantial answer (<5 words)");

  // Khi 0 câu hỏi có answered: true, criteria_context phải chứa cảnh báo kiểm định phiên
  assert.ok(result.criteria_context.includes("CẢNH BÁO KIỂM ĐỊNH PHIÊN"));
  assert.ok(result.criteria_context.includes("BẮT BUỘC để score=null, status=\"insufficient_evidence\""));
});

test("Tiêu chí thiếu bằng chứng: parseAndValidate accepts null scores and normalizes weighted score", () => {
  const sampleEvaluationJson = JSON.stringify({
    criteria_scores: [
      { key: "communication", score: 4, comment: "Giao tiếp rõ ràng", evidence: "Trình bày mạch lạc" },
      { key: "knowledge", score: null, status: "insufficient_evidence", comment: "Chưa đủ căn cứ", evidence: "Chưa hỏi" },
      { key: "problem_solving", score: null, status: "insufficient_evidence", comment: "Chưa đủ căn cứ", evidence: "Chưa hỏi" },
      { key: "position_fit", score: 3, comment: "Khá phù hợp", evidence: "Đáp ứng 70%" },
    ],
    stage_feedback: [
      { stage: 1, stage_name: "Khởi động", covered: true, score: 4, comment: "Tốt" },
      { stage: 2, stage_name: "CV và kinh nghiệm", covered: true, score: 4, comment: "Tốt" },
      { stage: 3, stage_name: "Năng lực và hành vi", covered: true, score: 4, comment: "Tốt" },
      { stage: 4, stage_name: "Tình huống và chuyên môn", covered: false, score: null, comment: "Chưa diễn ra" },
      { stage: 5, stage_name: "Động lực và phù hợp văn hóa", covered: true, score: 4, comment: "Tốt" },
      { stage: 6, stage_name: "Lương và kết thúc", covered: true, score: 4, comment: "Tốt" },
    ],
    strengths: ["Giao tiếp tự tin", "Có kinh nghiệm thực tế"],
    weaknesses: ["Chưa được đánh giá sâu chuyên môn"],
    action_plan: [
      { priority: 1, action: "Ôn tập chuyên môn", why: "Để hoàn thiện kiến thức", how: "Đọc thêm tài liệu" },
      { priority: 2, action: "Luyện phỏng vấn tình huống", why: "Tăng phản xạ", how: "Thực hành mock interview" },
      { priority: 3, action: "Chuẩn bị portfolio", why: "Minh chứng năng lực", how: "Cập nhật GitHub" },
    ],
    sample_improvements: [],
    overall_comment: "Ứng viên có tiềm năng, cần bổ sung kiểm tra chuyên môn.",
  });

  const parsed = parseAndValidate(sampleEvaluationJson);

  assert.equal(parsed.evaluated_criteria_count, 2);
  assert.equal(parsed.total_criteria_count, 4);

  // Kiểm tra điểm tiêu chí knowledge và problem_solving là null
  const knowledge = parsed.criteria_scores.find((c) => c.key === "knowledge");
  assert.equal(knowledge.score, null);
  assert.equal(knowledge.score_100, null);

  const problemSolving = parsed.criteria_scores.find((c) => c.key === "problem_solving");
  assert.equal(problemSolving.score, null);
  assert.equal(problemSolving.score_100, null);

  // Điểm phỏng vấn được chuẩn hóa trên các tiêu chí có điểm (không bị kéo tụt thành điểm 1)
  assert.ok(parsed.interview_score !== null);
  assert.ok(parsed.interview_score >= 60, `Điểm chuẩn hóa ${parsed.interview_score} phải >= 60 (không bị trừ điểm ảo)`);

  // Điểm tổng được tính từ interview_score chuẩn hóa
  const total = calculateTotalScore(parsed.interview_score, 80);
  assert.ok(total !== null && total >= 60);
});

test("Bảo đảm bằng code: Chặng 4 bị ép covered=false khi 0 câu chuyên môn được trả lời", () => {
  const sampleJsonWithLyingStage4 = JSON.stringify({
    criteria_scores: [
      { key: "communication", score: 4, comment: "Tốt", evidence: "Rõ" },
      { key: "knowledge", score: 3, comment: "Bình thường", evidence: "N/A" },
      { key: "problem_solving", score: 3, comment: "Bình thường", evidence: "N/A" },
      { key: "position_fit", score: 4, comment: "Tốt", evidence: "Khớp" },
    ],
    stage_feedback: [
      { stage: 1, stage_name: "Khởi động", covered: true, score: 4, comment: "Tốt" },
      { stage: 2, stage_name: "CV và kinh nghiệm", covered: true, score: 4, comment: "Tốt" },
      { stage: 3, stage_name: "Năng lực và hành vi", covered: true, score: 4, comment: "Tốt" },
      // LLM gian lận tuyên bố chặng 4 đã diễn ra và cho điểm 3 dù thực tế không có câu hỏi nào
      { stage: 4, stage_name: "Tình huống và chuyên môn", covered: true, score: 3, comment: "Đã trả lời câu hỏi" },
      { stage: 5, stage_name: "Động lực và phù hợp văn hóa", covered: true, score: 4, comment: "Tốt" },
      { stage: 6, stage_name: "Lương và kết thúc", covered: true, score: 4, comment: "Tốt" },
    ],
    strengths: ["Tự tin"],
    weaknesses: ["Cần rèn luyện"],
    action_plan: [
      { priority: 1, action: "Hành động 1", why: "Lý do 1", how: "Cách 1" },
      { priority: 2, action: "Hành động 2", why: "Lý do 2", how: "Cách 2" },
      { priority: 3, action: "Hành động 3", why: "Lý do 3", how: "Cách 3" },
    ],
    sample_improvements: [],
    overall_comment: "Đánh giá chung.",
  });

  const mockTrackingResult = {
    role_verified: true,
    asked_questions: [
      { id: "FE-FD-01", answered: false }, // chưa trả lời
    ],
  };

  const parsed = parseAndValidate(sampleJsonWithLyingStage4, mockTrackingResult);

  const stage4 = parsed.stage_feedback.find((s) => s.stage === 4);
  assert.equal(stage4.covered, false, "Code guarantee: stage 4 MUST be covered = false");
  assert.equal(stage4.score, null, "Code guarantee: stage 4 MUST have score = null");
  assert.ok(stage4.comment.includes("Chưa có câu hỏi chuyên môn"));
});

test("Dữ liệu session cũ: tương thích hoàn toàn khi không có trackingResult và điểm null", () => {
  const legacyJson = JSON.stringify({
    criteria_scores: [
      { key: "communication", score: 4, comment: "Tốt", evidence: "Rõ" },
      { key: "knowledge", score: 4, comment: "Tốt", evidence: "Biết" },
      { key: "problem_solving", score: 4, comment: "Tốt", evidence: "Xử lý tốt" },
      { key: "position_fit", score: 4, comment: "Tốt", evidence: "Khớp" },
    ],
    stage_feedback: [
      { stage: 1, stage_name: "Khởi động", covered: true, score: 4, comment: "Tốt" },
      { stage: 2, stage_name: "CV và kinh nghiệm", covered: true, score: 4, comment: "Tốt" },
      { stage: 3, stage_name: "Năng lực và hành vi", covered: true, score: 4, comment: "Tốt" },
      { stage: 4, stage_name: "Tình huống và chuyên môn", covered: true, score: 4, comment: "Tốt" },
      { stage: 5, stage_name: "Động lực và phù hợp văn hóa", covered: true, score: 4, comment: "Tốt" },
      { stage: 6, stage_name: "Lương và kết thúc", covered: true, score: 4, comment: "Tốt" },
    ],
    strengths: ["Kinh nghiệm"],
    weaknesses: ["Tiếng Anh"],
    action_plan: [
      { priority: 1, action: "Học thêm", why: "Tốt hơn", how: "Đọc sách" },
      { priority: 2, action: "Luyện nghe", why: "Giao tiếp", how: "Xem video" },
      { priority: 3, action: "Thực hành", why: "Nâng cao", how: "Làm lab" },
    ],
    sample_improvements: [],
    overall_comment: "Phiên cũ thành công.",
  });

  // Không truyền trackingResult (session cũ)
  const parsed = parseAndValidate(legacyJson, null);
  assert.equal(parsed.evaluated_criteria_count, 4);
  assert.ok(parsed.interview_score !== null);

  // Thử trường hợp tất cả tiêu chí đều null
  const emptyCriteria = [
    { key: "communication", score: null },
    { key: "knowledge", score: null },
    { key: "problem_solving", score: null },
    { key: "position_fit", score: null },
  ];
  assert.equal(calculateInterviewScore(emptyCriteria), null);
  assert.equal(calculateTotalScore(null, 70), null);
  assert.equal(scoreLevel(null), "Chưa đủ căn cứ đánh giá");
});
