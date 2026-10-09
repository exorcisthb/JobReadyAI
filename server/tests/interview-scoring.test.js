import test from "node:test";
import assert from "node:assert/strict";
import {
  SCORING_RUBRIC,
  calculateInterviewScore,
  calculateTotalScore,
  convertCriterionScore,
  criteriaScoresForStorage,
  scoreLevel,
} from "../config/scoring.js";

test("rubric weights sum to 100 and raw score 1/5 maps to 20 percent", () => {
  assert.equal(SCORING_RUBRIC.reduce((sum, item) => sum + item.weight, 0), 100);
  const scores = SCORING_RUBRIC.map(({ key, name }) => ({ key, name, score: 1, comment: "", evidence: "" }));
  assert.equal(calculateInterviewScore(scores), 20);
});

test("criterion conversion maps 5/5 to 100 and null to null", () => {
  assert.equal(convertCriterionScore(5), 100);
  assert.equal(convertCriterionScore(null), null);
  assert.equal(convertCriterionScore(undefined), null);
});

test("5/5 criterion maps to 100 and interview aggregation is weighted", () => {
  const scores = SCORING_RUBRIC.map(({ key, name }) => ({ key, name, score: key === "knowledge" ? 5 : 1, comment: "", evidence: "" }));
  assert.equal(calculateInterviewScore(scores), 48);
});

test("missing criteria with null score do not penalize evaluated criteria", () => {
  // Only knowledge (score 5, weight 35) and communication (score 5, weight 20) are evaluated.
  // problem_solving and position_fit are null.
  // Normalized score should be 100%, not dragged down.
  const partialScores = [
    { key: "knowledge", score: 5 },
    { key: "problem_solving", score: null },
    { key: "communication", score: 5 },
    { key: "position_fit", score: null },
  ];
  assert.equal(calculateInterviewScore(partialScores), 100);
});

test("all null criteria return null interview score and null total score", () => {
  const allNullScores = SCORING_RUBRIC.map(({ key }) => ({ key, score: null }));
  assert.equal(calculateInterviewScore(allNullScores), null);
  assert.equal(calculateTotalScore(null, 50), null);
});

test("total score applies 70/30 match blend and uses interview score without match data", () => {
  assert.equal(calculateTotalScore(62, 29), 52);
  assert.equal(calculateTotalScore(62, null), 62);
});

test("score labels respect configured boundary values and handle null gracefully", () => {
  assert.equal(scoreLevel(null), "Chưa đủ căn cứ đánh giá");
  assert.equal(scoreLevel(undefined), "Chưa đủ căn cứ đánh giá");
  assert.equal(scoreLevel(49), "Cần cải thiện nhiều");
  assert.equal(scoreLevel(50), "Trung bình");
  assert.equal(scoreLevel(69), "Trung bình");
  assert.equal(scoreLevel(70), "Khá");
  assert.equal(scoreLevel(84), "Khá");
  assert.equal(scoreLevel(85), "Tốt");
});

test("criteriaScoresForStorage marks insufficient_evidence when score is null", () => {
  const stored = criteriaScoresForStorage([
    { key: "knowledge", score: 4 },
    { key: "problem_solving", score: null },
  ]);
  assert.equal(stored[0].status, "evaluated");
  assert.equal(stored[0].score_100, 80);
  assert.equal(stored[1].status, "insufficient_evidence");
  assert.equal(stored[1].score_100, null);
});
