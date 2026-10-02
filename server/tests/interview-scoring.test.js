import test from "node:test";
import assert from "node:assert/strict";
import {
  SCORING_RUBRIC,
  calculateInterviewScore,
  calculateTotalScore,
  convertCriterionScore,
  scoreLevel,
} from "../config/scoring.js";

test("rubric weights sum to 100 and raw score 1/5 maps to 20 percent", () => {
  assert.equal(SCORING_RUBRIC.reduce((sum, item) => sum + item.weight, 0), 100);
  const scores = SCORING_RUBRIC.map(({ key, name }) => ({ key, name, score: 1, comment: "", evidence: "" }));
  assert.equal(calculateInterviewScore(scores), 20);
});

test("criterion conversion maps 5/5 to 100", () => {
  assert.equal(convertCriterionScore(5), 100);
});

test("5/5 criterion maps to 100 and interview aggregation is weighted", () => {
  const scores = SCORING_RUBRIC.map(({ key, name }) => ({ key, name, score: key === "knowledge" ? 5 : 1, comment: "", evidence: "" }));
  assert.equal(calculateInterviewScore(scores), 48);
});

test("total score applies 70/30 match blend and uses interview score without match data", () => {
  assert.equal(calculateTotalScore(62, 29), 52);
  assert.equal(calculateTotalScore(62, null), 62);
});

test("score labels respect configured boundary values", () => {
  assert.equal(scoreLevel(49), "Cần cải thiện nhiều");
  assert.equal(scoreLevel(50), "Trung bình");
  assert.equal(scoreLevel(69), "Trung bình");
  assert.equal(scoreLevel(70), "Khá");
  assert.equal(scoreLevel(84), "Khá");
  assert.equal(scoreLevel(85), "Tốt");
});
