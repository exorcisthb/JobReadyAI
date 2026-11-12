import { cleanUserTranscript, type UserTurn } from "./user-turn";

const SAMPLE_RATE = 16000;
const BYTES_PER_SECOND = SAMPLE_RATE * 2;
// A four-minute PCM clip remains below Gemini's inline request limit after base64 encoding.
const MAX_PCM_BYTES = BYTES_PER_SECOND * 240;

export class UserTurnAudio {
  private clips = new Map<UserTurn, { chunks: ArrayBuffer[]; bytes: number }>();

  append(turn: UserTurn, chunk: ArrayBuffer) {
    const clip = this.clips.get(turn) ?? { chunks: [], bytes: 0 };
    if (clip.bytes + chunk.byteLength > MAX_PCM_BYTES) return;
    clip.chunks.push(chunk);
    clip.bytes += chunk.byteLength;
    this.clips.set(turn, clip);
  }

  async recoverClosedTurns(
    transcribe: (wav: ArrayBuffer) => Promise<string>,
    publish: (turn: UserTurn) => void,
  ) {
    const pending: Promise<void>[] = [];
    for (const [turn, clip] of this.clips) {
      if (!turn.closed) continue;
      this.clips.delete(turn);
      if (cleanUserTranscript(turn.text)) continue;
      pending.push(transcribe(encodeWav(clip.chunks, clip.bytes)).then((result) => {
        const text = cleanUserTranscript(result);
        // A late Live transcript takes precedence over a recovery in progress.
        if (text && !cleanUserTranscript(turn.text)) publish({ ...turn, text });
      }).catch((error) => console.warn("Could not recover interview answer transcript", error)));
    }
    await Promise.all(pending);
  }
}

function encodeWav(chunks: ArrayBuffer[], bytes: number) {
  const wav = new ArrayBuffer(44 + bytes);
  const header = new DataView(wav);
  header.setUint32(0, 0x52494646); // RIFF
  header.setUint32(4, wav.byteLength - 8, true);
  header.setUint32(8, 0x57415645); // WAVE
  header.setUint32(12, 0x666d7420); // fmt
  header.setUint32(16, 16, true);
  header.setUint16(20, 1, true); // PCM
  header.setUint16(22, 1, true); // Mono
  header.setUint32(24, SAMPLE_RATE, true);
  header.setUint32(28, BYTES_PER_SECOND, true);
  header.setUint16(32, 2, true);
  header.setUint16(34, 16, true);
  header.setUint32(36, 0x64617461); // data
  header.setUint32(40, bytes, true);
  let offset = 44;
  const samples = new Uint8Array(wav);
  for (const chunk of chunks) {
    samples.set(new Uint8Array(chunk), offset);
    offset += chunk.byteLength;
  }
  return wav;
}
