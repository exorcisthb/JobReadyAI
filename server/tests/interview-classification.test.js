import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import express from "express";
import ts from "typescript";
import * as scoring from "../config/scoring.js";
import { parseAndValidate } from "../service/InterviewEvaluationService.js";
import { ensureInterviewStatusValues } from "../config/interviewSchema.js";

const answer = (words = 50) => Array.from({ length: words }, (_, i) => `nội${i}`).join(" ");
const conversation = (count, words = 50) => Array.from({ length: count }, (_, i) => [
  { role: "assistant", content: `Câu hỏi ${i + 1}` }, { role: "user", content: answer(words) },
]).flat();

test("eligibility prioritizes abandoned, then duration and four substantive answers", () => {
  for (const [seconds, count, words, expected] of [
    [29, 4, 50, "abandoned"], [30, 1, 100, "abandoned"],
    [30, 2, 50, "insufficient_data"], [89, 4, 50, "insufficient_data"],
    [90, 3, 50, "insufficient_data"], [90, 4, 49, "insufficient_data"],
    [90, 4, 50, "eligible"], [120, 4, 80, "eligible"],
  ]) {
    assert.equal(scoring.classifyInterviewSession(conversation(count, words), seconds).status, expected);
    assert.equal(scoring.hasSufficientDataForEvaluation(conversation(count, words), seconds), expected === "eligible");
  }
});

test("short greetings, silence, malformed transcripts and fragmented messages cannot inflate answer count", () => {
  assert.equal(scoring.classifyInterviewSession(conversation(10, 2), 200).qualityAnswerCount, 0);
  assert.equal(scoring.classifyInterviewSession([], 200).status, "abandoned");
  assert.equal(scoring.classifyInterviewSession("broken JSON", 200).status, "abandoned");
  assert.equal(scoring.classifyInterviewSession(conversation(4), Number.NaN).status, "abandoned");
  const chunks = [{ role: "assistant", content: "Câu hỏi" }, ...Array.from({ length: 4 }, () => ({ role: "user", content: answer() }))];
  assert.equal(scoring.classifyInterviewSession(chunks, 200).answerCount, 1);
  assert.equal(scoring.classifyInterviewSession(JSON.stringify(conversation(4)), 90).status, "eligible");
});

test("Gemini insufficient evidence skips fabricated scores and action plans", () => {
  const parsed = parseAndValidate(JSON.stringify({ insufficient_evidence: true, interview_score: 20 }));
  assert.equal(parsed.status, "insufficient_evidence");
  assert.equal(parsed.interview_score, null);
  assert.ok(parsed.criteria_scores.every((item) => item.score === null && item.score_100 === null));
  assert.deepEqual(parsed.action_plan, []);
});

test("a single covered stage cannot produce a score even if Gemini supplied numeric criteria", () => {
  const parsed = parseAndValidate(JSON.stringify({
    criteria_scores: scoring.SCORING_RUBRIC.map(({ key }) => ({ key, score: 1 })),
    stage_feedback: [{ stage: 1, covered: true, score: 1 }],
    strengths: [], weaknesses: [], action_plan: [], sample_improvements: [], overall_comment: "Chưa đủ dữ liệu",
  }));
  assert.equal(parsed.status, "insufficient_evidence");
  assert.equal(scoring.calculateTotalScore(parsed.interview_score, 100), null);
});

test("criterion insufficient_evidence flags override contradictory numeric scores", () => {
  const parsed = parseAndValidate(JSON.stringify({
    criteria_scores: scoring.SCORING_RUBRIC.map(({ key }) => ({ key, score: 1, status: "insufficient_evidence" })),
    stage_feedback: [{ stage: 1, covered: true, score: 1 }, { stage: 2, covered: true, score: 1 }],
    strengths: [], weaknesses: [], action_plan: [], sample_improvements: [], overall_comment: "Chưa đủ căn cứ",
  }));
  assert.equal(parsed.interview_score, null);
  assert.equal(parsed.status, "insufficient_evidence");
});

const displaySource = fs.readFileSync(new URL("../../src/lib/interview-score-display.ts", import.meta.url), "utf8");
const displayJS = ts.transpileModule(displaySource, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { getInterviewOutcome } = await import(`data:text/javascript;base64,${Buffer.from(displayJS).toString("base64")}`);

test("history and result display ignore stale scores and praise for unscored statuses", () => {
  assert.deepEqual(getInterviewOutcome({ status: "abandoned", total_score: 90 }), { kind: "abandoned", score: 0, badge: null });
  assert.deepEqual(getInterviewOutcome({ status: "insufficient_data", total_score: 20 }), { kind: "insufficient_data", score: null, badge: null });
  assert.equal(getInterviewOutcome({ status: "evaluating", total_score: 90 }).badge, null);
  assert.equal(getInterviewOutcome({ status: "completed", total_score: null }).badge, null);
  assert.equal(getInterviewOutcome({ status: "completed", total_score: 40 }).badge, "improve");
  assert.equal(getInterviewOutcome({ status: "completed", total_score: 70 }).badge, "good");
  assert.equal(getInterviewOutcome({ status: "completed", total_score: 85 }).badge, "great");
  assert.equal(getInterviewOutcome({ status: "completed", total_score: 100 }).badge, "excellent");
});

// Exercise the route functions with controlled database and Gemini dependencies.
const routeSource = fs.readFileSync(new URL("../routes/interview.js", import.meta.url), "utf8")
  .replace(/import\s+[\s\S]*?from\s+["'][^"']+["'];/g, "")
  .replace("export default router;", "return { router, runEvaluation, withScoreLevel };");
const createRoutes = new Function("express", "query", "evaluateInterview", "scoring", `
  const { MAX_EVALUATION_ATTEMPTS, classifyInterviewSession, calculateTotalScore, scoreLevel } = scoring;
  const rateLimit = () => (_req, _res, next) => next();
  const ensureInterviewStatusSchema = async () => {};
  ${routeSource}
`);

function harness(duration, replies, words = 50, evaluation = null) {
  const session = { id: "session", user_id: "owner", status: "in_progress", conversation: conversation(replies, words), duration_seconds: duration, started_at: new Date(Date.now() - duration * 1000).toISOString(), match_score: 0, cv_text_cache: "CV text", evaluation_attempts: 0 };
  let calls = 0;
  const query = async (sql, params) => {
    if (sql.startsWith("SELECT")) return { rows: [{ ...session }], rowCount: 1 };
    if (sql.includes("ended_at = NOW()")) {
      session.status = params[0]; session.duration_seconds = params[2]; session.conversation = JSON.parse(params[7]);
      session.total_score = session.status === "abandoned" ? 0 : null;
    } else if (sql.includes("status = 'completed'")) {
      session.status = "completed"; session.total_score = params[7]; session.interview_score = params[5];
    } else if (sql.includes("status = $1, total_score = $2")) {
      session.status = params[0]; session.total_score = params[1]; session.interview_score = null;
    } else if (sql.includes("status = 'evaluating'")) session.status = "evaluating";
    else throw new Error(`Unexpected SQL: ${sql}`);
    return { rows: [{ id: session.id }], rowCount: 1 };
  };
  const routes = createRoutes(express, query, async () => { calls++; return evaluation; }, scoring);
  const finish = async (reportedDuration = duration) => {
    let payload;
    const req = { user: { id: "owner" }, params: { id: "session" }, body: { conversation: session.conversation, duration_seconds: reportedDuration } };
    const res = { status() { return this; }, json(value) { payload = value; } };
    const route = routes.router.stack.find((layer) => layer.route?.path === "/:id/end").route;
    await route.stack.at(-1).handle(req, res, (error) => { throw error; });
    return payload;
  };
  return { session, finish, routes, calls: () => calls };
}

test("end route never calls Gemini for abandoned or insufficient sessions", async () => {
  for (const [seconds, count, words, expected] of [[29, 4, 50, "abandoned"], [120, 1, 100, "abandoned"], [89, 4, 50, "insufficient_data"], [120, 4, 49, "insufficient_data"]]) {
    const app = harness(seconds, count, words);
    const result = await app.finish();
    assert.equal(result.status, expected);
    assert.equal(result.total_score, expected === "abandoned" ? 0 : null);
    assert.equal(result.score_level, null);
    assert.equal(app.calls(), 0);
  }
});

test("client duration cannot turn a short session into an eligible interview", async () => {
  const app = harness(10, 4);
  assert.equal((await app.finish(120)).status, "abandoned");
  assert.equal(app.calls(), 0);
});

test("qualified session rejected by Gemini evidence flag remains unscored", async () => {
  const app = harness(90, 4, 50, { status: "insufficient_evidence", interview_score: null, attempts: 1 });
  const result = await app.finish();
  assert.equal(app.calls(), 1);
  assert.equal(result.status, "insufficient_data");
  assert.equal(result.total_score, null);
});

test("qualified session completes at minimum 40 even with CV match zero", async () => {
  const app = harness(90, 4, 50, { status: "evaluated", interview_score: 40, position_fit_score: 40, criteria_scores: [], stage_feedback: [], action_plan: [], sample_improvements: [], strengths: [], weaknesses: [], attempts: 1 });
  const result = await app.finish();
  assert.equal(result.status, "completed");
  assert.equal(result.total_score, 40);
  assert.equal(result.score_level, "Cần cải thiện");
});

test("retry path rechecks eligibility and cannot grade an old short session", async () => {
  const app = harness(20, 4);
  app.session.status = "evaluation_failed";
  await app.routes.runEvaluation("session", "owner");
  assert.equal(app.session.status, "abandoned");
  assert.equal(app.session.total_score, 0);
  assert.equal(app.calls(), 0);
});

test("legacy enum migration adds missing states and leaves varchar schemas untouched", async () => {
  const changes = [];
  await ensureInterviewStatusValues(async (sql) => {
    if (sql.includes("pg_attribute")) return { rows: [{ schema_name: "public", type_name: "session_status", labels: ["in_progress", "completed", "abandoned"] }] };
    changes.push(sql);
    return { rows: [] };
  });
  assert.equal(changes.length, 3);
  assert.ok(changes.some((sql) => sql.includes("'insufficient_data'")));
  await ensureInterviewStatusValues(async (sql) => {
    assert.ok(sql.includes("pg_attribute"));
    return { rows: [] };
  });
});
