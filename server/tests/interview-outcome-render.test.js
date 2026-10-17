import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const locale = JSON.parse(fs.readFileSync(new URL("../../src/i18n/locales/vi.json", import.meta.url), "utf8"));
const helper = fs.readFileSync(new URL("../../src/lib/interview-score-display.ts", import.meta.url), "utf8");
const compiledHelper = ts.transpileModule(helper, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { getInterviewOutcome } = await import(`data:text/javascript;base64,${Buffer.from(compiledHelper).toString("base64")}`);

// Render the real page JSX with fixed hook state; effects and external UI providers are excluded.
function renderPage(name, values) {
  const source = fs.readFileSync(new URL(`../../src/pages/User/${name}.tsx`, import.meta.url), "utf8");
  const imports = [...source.matchAll(/import\s*\{([\s\S]*?)\}\s*from\s*["'][^"']+["'];/g)];
  const dependencies = {};
  for (const [, names] of imports) for (const symbol of names.split(",").map((value) => value.trim()).filter(Boolean)) {
    dependencies[symbol] = ({ children }) => React.createElement("div", null, children);
  }
  let state = 0;
  Object.assign(dependencies, {
    React, getInterviewOutcome,
    useState: (initial) => [state < values.length ? values[state++] : (state++, initial), () => {}],
    useEffect: () => {}, useCallback: (callback) => callback, useRef: (value) => ({ current: value }),
    useAuth: () => ({ user: { id: "owner" } }),
    useTranslation: () => ({ i18n: { language: "vi" }, t: (key) => key.split(".").reduce((value, part) => value?.[part], locale) || key }),
    displayInterviewRole: (value) => value,
  });
  const compiled = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.React, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
    .replace(/import\s+[\s\S]*?from\s*["'][^"']+["'];/g, "")
    .replace(`export default function ${name}`, `function ${name}`);
  const Component = new Function(...Object.keys(dependencies), `${compiled}; return ${name};`)(...Object.values(dependencies));
  return renderToStaticMarkup(React.createElement(Component, { sessionId: "session" }));
}

const fixture = (status, score) => ({
  id: "session", status, total_score: score, interview_score: score, confidence_level: "high", position_fit_score: score,
  cv_id: "cv", position: "Frontend Developer", cv_name: "CV", started_at: "2026-10-17T00:00:00Z", duration_seconds: 20,
  content_score: null, voice_score: null, criteria_scores: [], stage_feedback: [], strengths: [], weaknesses: [],
  action_plan: [], sample_improvements: [], conversation: [], feedback: "Khá tốt từ báo cáo cũ", overall_comment: null,
});

test("history shows abandoned as zero and insufficient as ungraded without praise badges", () => {
  const abandoned = renderPage("InterviewHistoryPage", [[fixture("abandoned", 85)], false]);
  assert.match(abandoned, /Đã bỏ dở/);
  assert.match(abandoned, /0\/100/);
  assert.doesNotMatch(abandoned, /85\/100|Xuất sắc|Khá tốt/);
  const insufficient = renderPage("InterviewHistoryPage", [[fixture("insufficient_data", 20)], false]);
  assert.match(insufficient, /Chưa đủ tiêu chí đánh giá/);
  assert.match(insufficient, /Chưa chấm/);
  assert.doesNotMatch(insufficient, /20\/100|Xuất sắc|Khá tốt/);
});

test("result banners replace old scores and old feedback on ineligible sessions", () => {
  const abandoned = renderPage("InterviewResultPage", [fixture("abandoned", 85), "", false]);
  assert.match(abandoned, /Điểm số: 0 điểm/);
  assert.doesNotMatch(abandoned, /85\/100|Khá tốt từ báo cáo cũ/);
  const insufficient = renderPage("InterviewResultPage", [fixture("insufficient_data", 20), "", false]);
  assert.match(insufficient, /khung tiêu chí STAR và chuyên môn/);
  assert.match(insufficient, /Điểm: Chưa chấm/);
  assert.doesNotMatch(insufficient, /20\/100|Khá tốt từ báo cáo cũ/);
});

test("completed history badges follow total score instead of voice confidence", () => {
  const html = renderPage("InterviewHistoryPage", [[fixture("completed", 40)], false]);
  assert.match(html, /40\/100/);
  assert.match(html, /Cần cải thiện/);
  assert.doesNotMatch(html, /Xuất sắc/);
});
