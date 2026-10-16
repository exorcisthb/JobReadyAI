import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import assert from "node:assert/strict";
import puppeteer from "puppeteer";

// Exercise the production bundle and its local assets without using a microphone or API key.
const chunk = fs.readdirSync("dist/assets").find((file) => file.endsWith(".js") && fs.readFileSync(`dist/assets/${file}`, "utf8").includes("silero_vad_v5.onnx"));
assert.ok(chunk, "Build the project before running this check");
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' blob:; worker-src 'self' blob:");
    return res.end("<html><body>VAD runtime verification</body></html>");
  }
  const file = path.resolve("dist", `.${req.url}`);
  if (!file.startsWith(path.resolve("dist") + path.sep) || !fs.existsSync(file)) {
    res.writeHead(404);
    return res.end();
  }
  res.setHeader("Content-Type", file.endsWith(".wasm") ? "application/wasm" : /\.(mjs|js)$/.test(file) ? "text/javascript" : "application/octet-stream");
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
let browser;
try {
  browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    args: ["--autoplay-policy=no-user-gesture-required"],
  });
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const result = await page.evaluate(async (filename) => {
    const module = await import(`/assets/${filename}`);
    const library = Object.values(module).find((entry) => entry?.MicVAD);
    if (!library) throw new Error("MicVAD export missing");
    const ctx = new AudioContext({ sampleRate: 16000 });
    await ctx.resume();
    const destination = ctx.createMediaStreamDestination();
    let frames = 0;
    let max = 0;
    const vad = await library.MicVAD.new({
      model: "v5", baseAssetPath: "/vad/", onnxWASMBasePath: "/vad/",
      ortConfig: (ort) => { ort.env.wasm.numThreads = 1; },
      audioContext: ctx, getStream: async () => destination.stream,
      pauseStream: async () => {}, resumeStream: async () => destination.stream,
      startOnLoad: false,
      onFrameProcessed: (probability) => { frames++; max = Math.max(max, probability.isSpeech); },
    });
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    oscillator.connect(gain);
    gain.connect(destination);
    oscillator.start();
    await vad.start();
    await new Promise((resolve, reject) => {
      const start = Date.now();
      const timer = setInterval(() => {
        if (frames >= 10) { clearInterval(timer); resolve(); }
        else if (Date.now() - start > 5000) { clearInterval(timer); reject(new Error("No VAD frames processed")); }
      }, 50);
    });
    await vad.destroy();
    oscillator.stop();
    destination.stream.getTracks().forEach((track) => track.stop());
    await ctx.close();
    return { frames, maxSilenceSpeechProbability: max };
  }, chunk);
  assert.ok(result.frames >= 10);
  assert.ok(result.maxSilenceSpeechProbability < 0.35);
  console.log("PASS browser VAD runtime:", result);
} finally {
  await browser?.close();
  server.close();
}
