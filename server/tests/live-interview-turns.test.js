import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";

async function loadSource(file, preamble = "") {
  const source = fs.readFileSync(new URL(`../../src/lib/live-api/${file}`, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
  const standalone = compiled.replace(/import\s+[\s\S]*?from\s+["'][^"']+["'];/g, "");
  return import(`data:text/javascript;base64,${Buffer.from(preamble + standalone).toString("base64")}`);
}

const { cleanUserTranscript, UserTurnTracker, VoiceActivityGate } = await loadSource("user-turn.ts");

test("a brief sound cannot start a turn, and a thinking pause keeps it open", () => {
  const gate = new VoiceActivityGate();
  assert.equal(gate.process(0.9, 32), null);
  assert.equal(gate.process(0.05, 32), null);
  assert.equal(gate.process(0.9, 32), null);
  assert.equal(gate.process(0.9, 32), "start");
  for (let i = 0; i < 56; i++) assert.equal(gate.process(0.05, 32), null);
  assert.equal(gate.process(0.05, 32), "end");
});

test("quiet fillers reset the silence window without transcription", () => {
  const gate = new VoiceActivityGate();
  gate.process(0.9, 32);
  gate.process(0.9, 32);
  for (let i = 0; i < 50; i++) gate.process(0.05, 32);
  assert.equal(gate.process(0.4, 32), null);
  for (let i = 0; i < 56; i++) assert.equal(gate.process(0.05, 32), null);
  assert.equal(gate.process(0.05, 32), "end");
});

test("noise markers split across packets disappear without dropping the surrounding words", () => {
  const turns = new UserTurnTracker();
  turns.begin();
  turns.append("Lớp đầu tiên là network <noi", false);
  const turn = turns.append("se> security <noise>.", true);
  assert.equal(cleanUserTranscript(turn.text), "Lớp đầu tiên là network security.");
  assert.equal(cleanUserTranscript("<noise>"), "");
});

test("a punctuation-only Live transcript is recovered from the exact audio for that turn", async () => {
  const { UserTurnAudio } = await loadSource("user-turn-audio.ts", `${cleanUserTranscript.toString()}\n`);
  const audio = new UserTurnAudio();
  const turns = new UserTurnTracker();
  const first = turns.begin();
  audio.append(first, Uint8Array.of(1, 2).buffer);
  audio.append(first, Uint8Array.of(3, 4).buffer);
  turns.close(100);
  turns.append(".", true);
  const second = turns.begin();
  audio.append(second, Uint8Array.of(5, 6).buffer);
  turns.append("Em đã xác nhận kết quả.", true);
  turns.close(200);
  const published = [];
  let requests = 0;
  const transcribe = async (wav) => {
    requests++;
    const header = new DataView(wav);
    assert.equal(header.getUint32(24, true), 16000);
    assert.equal(header.getUint32(40, true), 4);
    assert.deepEqual([...new Uint8Array(wav, 44)], [1, 2, 3, 4]);
    return "Em phối hợp với Dev và Tester.";
  };
  await audio.recoverClosedTurns(transcribe, (turn) => published.push(turn));
  await audio.recoverClosedTurns(transcribe, (turn) => published.push(turn));
  assert.equal(requests, 1);
  assert.equal(published.length, 1);
  assert.equal(published[0].id, first.id);
  assert.equal(published[0].startedAt, first.startedAt);
  assert.equal(published[0].text, "Em phối hợp với Dev và Tester.");
  assert.equal(cleanUserTranscript(first.text), "");
});

test("late Live words take precedence over an in-flight recovery", async () => {
  const { UserTurnAudio } = await loadSource("user-turn-audio.ts", `${cleanUserTranscript.toString()}\n`);
  const audio = new UserTurnAudio();
  const turns = new UserTurnTracker();
  const turn = turns.begin();
  audio.append(turn, Uint8Array.of(1, 2).buffer);
  turns.close(100);
  const published = [];
  const pending = audio.recoverClosedTurns(async () => "Bản chép dự phòng.", (result) => published.push(result));
  turns.append("Bản chép đến muộn.", true);
  await pending;
  assert.equal(published.length, 0);
});

test("non-speech noise probabilities never open a user turn", () => {
  const gate = new VoiceActivityGate();
  for (let i = 0; i < 300; i++) assert.equal(gate.process(0.1, 32), null);
  assert.equal(gate.active, false);
});

test("late transcription completes the existing closed message without splitting words", () => {
  const turns = new UserTurnTracker();
  const first = turns.begin();
  turns.append("Em làm mộ", false);
  turns.close(100);
  const final = turns.append("t dự án Node.js.", true);
  assert.equal(final.id, first.id);
  assert.equal(final.closed, true);
  assert.equal(final.text, "Em làm một dự án Node.js.");
  assert.equal(turns.close(200), undefined);
});

test("ASR segment completion cannot close an ongoing spoken answer", () => {
  const turns = new UserTurnTracker();
  const first = turns.begin();
  turns.append("Em", true);
  assert.equal(first.closed, false);
  assert.equal(turns.append(" đang suy nghĩ", false).id, first.id);
  assert.equal(turns.close(100).text, "Em đang suy nghĩ");
});

test("an empty ASR turn can receive its text after silence and retain its ID", () => {
  const turns = new UserTurnTracker();
  const first = turns.begin();
  turns.close(100);
  assert.equal(turns.append("Ừm", true).id, first.id);
  turns.finishResponse();
  const second = turns.begin();
  assert.notEqual(second.id, first.id);
  assert.equal(turns.append("Câu tiếp theo", true).id, second.id);
});

test("multiple final ASR segments after silence do not invent extra spoken turns", () => {
  const turns = new UserTurnTracker();
  const first = turns.begin();
  turns.close(100);
  turns.append("Em làm ", true);
  const last = turns.append("Node.js.", true);
  assert.equal(last.id, first.id);
  assert.equal(last.text, "Em làm Node.js.");
});

test("AI playback completion waits for the last scheduled audio sample", async () => {
  const { AudioStreamer } = await loadSource("audio-streamer.ts", "const registeredWorklets = new Map(); const window = globalThis;\n");
  const sources = [];
  const context = {
    currentTime: 0,
    createGain: () => ({ gain: { setValueAtTime() {}, linearRampToValueAtTime() {} }, connect() {}, disconnect() {} }),
    createBufferSource: () => {
      const source = { connect() {}, start() {}, stop() {}, onended: null };
      sources.push(source);
      return source;
    },
    createBuffer: () => ({ duration: 0.02, getChannelData: () => ({ set() {} }) }),
  };
  const streamer = new AudioStreamer(context);
  let completed = 0;
  streamer.onComplete = () => completed++;
  streamer.addPCM16(new Uint8Array(960));
  streamer.complete();
  assert.equal(completed, 0);
  sources.at(-1).onended();
  assert.equal(completed, 1);
  streamer.dispose();
});

test("a packet with audio and turnComplete emits both events in order", async () => {
  const { GenAILiveClient } = await loadSource("genai-live-client.ts", `
    import { EventEmitter } from 'node:events';
    class GoogleGenAI { constructor() {} }
    const base64ToArrayBuffer = (value) => Uint8Array.from(Buffer.from(value, 'base64')).buffer;
  `);
  const client = new GenAILiveClient({ apiKey: "test" });
  const events = [];
  client.on("audio", () => events.push("audio"));
  client.on("turncomplete", () => events.push("complete"));
  await client.onmessage({ serverContent: { modelTurn: { parts: [{ inlineData: { mimeType: "audio/pcm", data: "AAA=" } }] }, turnComplete: true } });
  assert.deepEqual(events, ["audio", "complete"]);
  await client.onmessage({ serverContent: { turnComplete: false } });
  assert.equal(events.length, 2);
});

test("interrupted=false must not discard the remaining audio or transcript", async () => {
  const { GenAILiveClient } = await loadSource("genai-live-client.ts", `
    import { EventEmitter } from 'node:events';
    class GoogleGenAI { constructor() {} }
    const base64ToArrayBuffer = (value) => Uint8Array.from(Buffer.from(value, 'base64')).buffer;
  `);
  const client = new GenAILiveClient({ apiKey: "test" });
  const events = [];
  client.on("interrupted", () => events.push("interrupted"));
  client.on("audio", () => events.push("audio"));
  client.on("outputtranscription", (text) => events.push(text));
  client.on("turncomplete", () => events.push("complete"));
  await client.onmessage({ serverContent: {
    interrupted: false,
    outputTranscription: { text: "và Boundary Value Analysis khác nhau thế nào?" },
    modelTurn: { parts: [{ inlineData: { mimeType: "audio/pcm", data: "AAA=" } }] },
    turnComplete: true,
  } });
  assert.deepEqual(events, ["và Boundary Value Analysis khác nhau thế nào?", "audio", "complete"]);
});

test("a real interruption keeps both transcripts but discards canceled AI audio", async () => {
  const { GenAILiveClient } = await loadSource("genai-live-client.ts", `
    import { EventEmitter } from 'node:events';
    class GoogleGenAI { constructor() {} }
    const base64ToArrayBuffer = (value) => Uint8Array.from(Buffer.from(value, 'base64')).buffer;
  `);
  const client = new GenAILiveClient({ apiKey: "test" });
  const events = [];
  client.on("inputtranscription", (text) => events.push(text));
  client.on("outputtranscription", (text) => events.push(text));
  client.on("interrupted", () => events.push("interrupted"));
  client.on("audio", () => events.push("audio"));
  client.on("turncomplete", () => events.push("complete"));
  await client.onmessage({ serverContent: {
    interrupted: true,
    inputTranscription: { text: "Cho em hỏi lại", finished: true },
    outputTranscription: { text: "và vì sao?" },
    modelTurn: { parts: [{ inlineData: { mimeType: "audio/pcm", data: "AAA=" } }] },
    turnComplete: true,
  } });
  assert.deepEqual(events, ["Cho em hỏi lại", "và vì sao?", "interrupted", "complete"]);
});

test("stop and immediate new reply keep the same output gain and mute setting", async () => {
  const { AudioStreamer } = await loadSource("audio-streamer.ts", "const registeredWorklets = new Map(); const window = globalThis;\n");
  const sources = [];
  const context = {
    currentTime: 0,
    createGain: () => ({ gain: { value: 0, setValueAtTime() {}, linearRampToValueAtTime() {} }, connect() {}, disconnect() {} }),
    createBufferSource: () => {
      const source = { connect(node) { this.output = node; }, start() {}, stop() { this.stopped = true; }, onended: null };
      sources.push(source);
      return source;
    },
    createBuffer: () => ({ duration: 0.02, getChannelData: () => ({ set() {} }) }),
  };
  const streamer = new AudioStreamer(context);
  const output = streamer.gainNode;
  try {
    streamer.addPCM16(new Uint8Array(960));
    const previous = sources.at(-1);
    streamer.stop();
    streamer.addPCM16(new Uint8Array(960));
    const next = sources.at(-1);
    await new Promise((resolve) => setTimeout(resolve, 250));
    assert.equal(previous.stopped, true);
    assert.equal(streamer.gainNode, output);
    assert.equal(next.output, streamer.gainNode);
    assert.equal(streamer.gainNode.gain.value, 0);
  } finally { streamer.dispose(); }
});
