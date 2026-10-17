import "../server/config/env.js";
import fs from "node:fs";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import pg from "pg";
import express from "express";
import * as scoring from "../server/config/scoring.js";
import { ensureInterviewStatusValues } from "../server/config/interviewSchema.js";

// All writes are confined to temporary tables on this connection and rolled back.
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 5000, ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined });
const source = fs.readFileSync("server/routes/interview.js", "utf8")
  .replace(/import\s+[\s\S]*?from\s+["'][^"']+["'];/g, "")
  .replace("export default router;", "return { router, runEvaluation };");
const create = new Function("express", "query", "evaluateInterview", "scoring", `
  const { MAX_EVALUATION_ATTEMPTS, classifyInterviewSession, calculateTotalScore, scoreLevel } = scoring;
  const rateLimit = () => (_req, _res, next) => next();
  const ensureInterviewStatusSchema = async () => {};
  ${source}
`);
let aiCalls = 0;
let insufficient = false;
const routes = create(express, client.query.bind(client), async () => {
  aiCalls++;
  if (insufficient) return { status: "insufficient_evidence", interview_score: null, attempts: 1 };
  return { status: "evaluated", interview_score: 40, position_fit_score: 40, attempts: 1, criteria_scores: [], stage_feedback: [], action_plan: [], sample_improvements: [], overall_comment: "Có bằng chứng nhưng cần cải thiện", strengths: [], weaknesses: [] };
}, scoring);
await client.connect();
try {
  await client.query("CREATE TEMP TABLE interview_sessions (LIKE public.interview_sessions INCLUDING DEFAULTS)");
  await client.query("CREATE TYPE pg_temp.interview_status_check AS ENUM ('in_progress', 'completed', 'abandoned')");
  await client.query("ALTER TABLE interview_sessions ALTER COLUMN status DROP DEFAULT");
  await client.query("ALTER TABLE interview_sessions ALTER COLUMN status TYPE pg_temp.interview_status_check USING status::text::pg_temp.interview_status_check");
  await ensureInterviewStatusValues(client.query.bind(client));
  await client.query("CREATE TEMP TABLE cvs (id uuid, cv_text_cache text, content jsonb, type text)");
  await client.query("BEGIN");
  const owner = randomUUID();
  const cv = randomUUID();
  await client.query("INSERT INTO cvs VALUES ($1, 'CV test', '{}', 'uploaded')", [cv]);
  const finish = routes.router.stack.find((layer) => layer.route?.path === "/:id/end").route.stack.at(-1).handle;
  for (const [seconds, count, words, flag, expected, score] of [
    [29, 4, 50, false, "abandoned", 0], [120, 1, 100, false, "abandoned", 0],
    [89, 4, 50, false, "insufficient_data", null], [120, 4, 49, false, "insufficient_data", null],
    [90, 4, 50, true, "insufficient_data", null], [90, 4, 50, false, "completed", 40],
  ]) {
    const id = randomUUID();
    const conversation = Array.from({ length: count }, () => [{ role: "assistant", content: "Câu hỏi" }, { role: "user", content: Array(words).fill("nội-dung").join(" ") }]).flat();
    await client.query("INSERT INTO interview_sessions (id, user_id, cv_id, level, status, started_at, conversation, match_score) VALUES ($1, $2, $3, 'junior', 'in_progress', NOW() - ($4 * INTERVAL '1 second'), $5::jsonb, 0)", [id, owner, cv, seconds + 1, JSON.stringify(conversation)]);
    insufficient = flag;
    let payload;
    await finish({ user: { id: owner }, params: { id }, body: { conversation, duration_seconds: seconds } }, { status() { return this; }, json(value) { payload = value; } }, (error) => { throw error; });
    assert.equal(payload.status, expected);
    assert.equal(payload.total_score, score);
    if (expected !== "completed") assert.equal(payload.score_level, null);
    const stored = await client.query("SELECT status, total_score FROM interview_sessions WHERE id = $1", [id]);
    assert.equal(stored.rows[0].status, expected);
    assert.equal(stored.rows[0].total_score, score);
  }
  assert.equal(aiCalls, 2, "Only the two eligible sessions reach the evaluator");
  console.log("PASS PostgreSQL: abandoned=0, insufficient=null, completed>=40, and no AI calls for ineligible sessions");
} finally {
  await client.query("ROLLBACK");
  await client.end();
}
