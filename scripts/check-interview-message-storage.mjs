import "../server/config/env.js";
import fs from "node:fs";
import assert from "node:assert/strict";
import pg from "pg";

// A private temporary table shadows the real table on this connection.
// No interview or user records are created or changed in the application schema.
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});
const source = fs.readFileSync("server/routes/interview.js", "utf8");
const body = source.match(/router\.put\("\/:id\/messages", requireAuth, async \(req, res, next\) => \{([\s\S]*?)\n\}\);/)[1];
const handle = new (Object.getPrototypeOf(async () => {}).constructor)("req", "res", "next", "query", body);
await client.connect();
try {
  await client.query("BEGIN");
  await client.query("CREATE TEMP TABLE interview_sessions (id text, user_id text, status text, conversation jsonb, updated_at timestamptz) ON COMMIT DROP");
  await client.query("INSERT INTO interview_sessions VALUES ('session', 'owner', 'in_progress', '[]', NOW())");
  const send = async (message, owner = "owner") => {
    let status = 200;
    const res = { status(value) { status = value; return this; }, json() {} };
    await handle({ params: { id: "session" }, user: { id: owner }, body: message }, res, (error) => { throw error; }, client.query.bind(client));
    return status;
  };
  const message = (id, role, content, revision = 1) => ({ id, role, content, revision, timestamp: new Date().toISOString() });
  assert.equal(await send(message("ai-1", "assistant", "Câu hỏi")), 200);
  assert.equal(await send(message("user-1", "user", "Em làm mộ")), 200);
  assert.equal(await send(message("ai-2", "assistant", "Câu tiếp theo")), 200);
  assert.equal(await send(message("user-1", "user", "Em làm một dự án", 2)), 200);
  assert.equal(await send(message("user-1", "user", "Bản cũ", 1)), 200);
  assert.equal(await send(message("user-2", "user", "Không được ghi"), "other-user"), 409);
  assert.equal(await send(message("user-2", "user", "")), 400);
  const result = await client.query("SELECT conversation FROM interview_sessions");
  assert.deepEqual(result.rows[0].conversation.map((item) => item.id), ["ai-1", "user-1", "ai-2"]);
  assert.equal(result.rows[0].conversation[1].content, "Em làm một dự án");
  const earlier = message("late-asr", "user", "Chữ đến sau nhưng lời nói xảy ra trước");
  earlier.timestamp = new Date(Date.parse(result.rows[0].conversation[0].timestamp) - 100).toISOString();
  assert.equal(await send(earlier), 200);
  const ordered = await client.query("SELECT conversation FROM interview_sessions");
  assert.equal(ordered.rows[0].conversation[0].id, "late-asr");
  await client.query("UPDATE interview_sessions SET status = 'completed'");
  assert.equal(await send(message("user-1", "user", "Không được ghi", 3)), 409);
  console.log("PASS PostgreSQL: ordered upsert, late ASR, stale retries, owner isolation, validation and completed-session protection");
} finally {
  await client.query("ROLLBACK");
  await client.end();
}
