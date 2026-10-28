import "../server/config/env.js";
import assert from "node:assert/strict";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import express from "express";
import pg from "pg";
import * as scoring from "../server/config/scoring.js";

// Use the real route SQL against temporary tables; never change account data.
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});
const source = fs.readFileSync(new URL("../server/routes/interview.js", import.meta.url), "utf8")
  .replace(/import\s+[\s\S]*?from\s+["'][^"']+["'];/g, "")
  .replace("export default router;", "return { router, getWeekStart };");
const create = new Function("express", "query", "scoring", `
  const { MAX_EVALUATION_ATTEMPTS, classifyInterviewSession, calculateTotalScore, scoreLevel } = scoring;
  const rateLimit = () => (_req, _res, next) => next();
  const ensureInterviewStatusSchema = async () => {};
  const getUserPlanCached = async () => ({ sub_plan_interview: "free" });
  const evaluateInterview = async () => { throw new Error("Short interviews must not reach the evaluator"); };
  ${source}
`);
const { router, getWeekStart } = create(express, client.query.bind(client), scoring);

async function request(method, path, userId, body = {}, params = {}) {
  const handler = router.stack.find((layer) => layer.route?.path === path && layer.route.methods[method])
    .route.stack.at(-1).handle;
  let status = 200;
  let payload;
  await handler({ user: { id: userId }, body, params }, {
    status(value) { status = value; return this; },
    json(value) { payload = value; },
  }, (error) => { throw error; });
  return { status, payload };
}

await client.connect();
try {
  await client.query("BEGIN");
  await client.query("CREATE TEMP TABLE interview_sessions (LIKE public.interview_sessions INCLUDING DEFAULTS) ON COMMIT DROP");
  // Support both legacy enum and varchar production schemas without migrating either.
  await client.query("ALTER TABLE interview_sessions ALTER COLUMN status DROP DEFAULT");
  await client.query("ALTER TABLE interview_sessions ALTER COLUMN status TYPE text USING status::text");
  await client.query("CREATE TEMP TABLE cvs (id uuid, cv_text_cache text, content jsonb, type text) ON COMMIT DROP");
  const cvId = randomUUID();
  await client.query("INSERT INTO cvs VALUES ($1, 'CV test', '{}', 'uploaded')", [cvId]);

  async function seed(userId, seconds = 40, status = "in_progress", createdAt = new Date()) {
    const id = randomUUID();
    await client.query(
      `INSERT INTO interview_sessions (id, user_id, cv_id, level, status, started_at, created_at)
       VALUES ($1, $2, $3, 'junior', $4, NOW() - ($5 * INTERVAL '1 second'), $6)`,
      [id, userId, cvId, status, seconds + 1, createdAt],
    );
    return id;
  }
  const quota = async (userId) => (await request("get", "/quota", userId)).payload;
  const finish = async (userId, id, seconds, reason = "user_ended", conversation = []) =>
    (await request("put", "/:id/end", userId, {
      duration_seconds: seconds, ended_reason: reason, conversation,
    }, { id })).payload;

  const owner = randomUUID();
  const first = await seed(owner, 40);
  const second = await seed(owner, 19);
  assert.equal((await quota(owner)).remaining, 2, "In-progress sessions are not finished attempts");
  assert.equal((await finish(owner, first, 40)).status, "abandoned");
  assert.equal((await quota(owner)).remaining, 1, "Ending a 40-second interview must consume one turn");
  await finish(owner, first, 40);
  assert.equal((await quota(owner)).used, 1, "Retrying the same end request must not consume another turn");
  assert.equal((await finish(owner, second, 19)).status, "abandoned");
  assert.equal((await quota(owner)).remaining, 0, "The 40- and 19-second interviews must exhaust free quota");
  assert.equal((await request("post", "/start", owner, { cv_id: cvId })).status, 429,
    "The start endpoint must enforce the same quota as the counter");

  for (const reason of ["user_ended", "ai_ended", "disconnected", "tab_closed"]) {
    const userId = randomUUID();
    await finish(userId, await seed(userId), 40, reason);
    assert.equal((await quota(userId)).used, 1, `Ending via ${reason} must consume one turn`);
  }

  const shortAnswers = [
    { role: "assistant", content: "Câu hỏi 1" }, { role: "user", content: "Trả lời ngắn" },
    { role: "assistant", content: "Câu hỏi 2" }, { role: "user", content: "Trả lời ngắn" },
  ];
  for (const seconds of [119, 120]) {
    const userId = randomUUID();
    const result = await finish(userId, await seed(userId, seconds), seconds, "user_ended", shortAnswers);
    assert.equal(result.status, "insufficient_data");
    assert.equal((await quota(userId)).used, 1, "Quota must not depend on a two-minute or scoring threshold");
  }

  for (const status of ["completed", "abandoned", "insufficient_data", "evaluating", "evaluation_failed"]) {
    const userId = randomUUID();
    await seed(userId, 40, status);
    await seed(userId, 40, "completed", new Date(getWeekStart().getTime() - 1000));
    await seed(randomUUID(), 40, "completed");
    assert.equal((await quota(userId)).used, 1, `${status} must count only for its owner and current cycle`);
  }
  console.log("PASS PostgreSQL quota: 2/2 -> 1/2 -> 0/2; end retries, all outcomes, end reasons, cycle boundaries and start blocking");
} finally {
  await client.query("ROLLBACK");
  await client.end();
}
