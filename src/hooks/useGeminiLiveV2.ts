/**
 * Gemini Live API Hook - adapted from the smile/live-api implementation.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Modality } from '@google/genai';
import { GenAILiveClient } from '@/lib/live-api/genai-live-client';
import { AudioStreamer } from '@/lib/live-api/audio-streamer';
import { audioContext } from '@/lib/live-api/utils';

interface UseGeminiLiveV2Props {
  apiKey: string;
  onMessage?: (message: string, role: 'user' | 'assistant') => void;
  onError?: (error: Error) => void;
  onSessionEnd?: (reason: 'identity_mismatch') => void;
  onTranscript?: (text: string, isFinal: boolean) => void;
  onAudioMetrics?: (metrics: AudioMetrics) => void; // Callback để nhận metrics
  cvData?: string;
  candidateName?: string;
}

interface AudioMetrics {
  volume: number; // 0-100, âm lượng trung bình
  speechRate: number; // words per minute
  pauseCount: number; // số lần ngắt quãng
  avgPauseDuration: number; // thời gian ngắt quãng trung bình (ms)
  pitchVariation: number; // 0-100, độ biến thiên cao độ
  confidence: 'low' | 'medium' | 'high'; // đánh giá tổng thể
}

const LIVE_MODEL = 'models/gemini-2.5-flash-native-audio-latest';
const BLUETOOTH_MIC_KEYWORDS = [
  'bluetooth',
  'headset',
  'headphone',
  'headphones',
  'hands-free',
  'handsfree',
  'airpods',
  'earbuds',
  'buds',
  'wireless',
  'jabra',
  'sony',
  'bose',
  'anker',
  'soundcore',
  'realtek bluetooth',
];

const BASE_MIC_CONSTRAINTS: MediaTrackConstraints = {
  sampleRate: 16000,
  channelCount: 1,
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};
const IDENTITY_MISMATCH_MESSAGE =
  'Tên bạn vừa đọc không khớp với tên trên CV. Buổi phỏng vấn sẽ kết thúc tại đây.';
const IDENTITY_MISMATCH_CODE = 'END_INTERVIEW_IDENTITY_MISMATCH';

function buildSystemInstruction(cvData?: string, candidateName?: string) {
  return `You are JobReadyAI, a senior HR interviewer and technical interviewer running a realistic mock interview.

Product identity:
- Introduce yourself as JobReady AI, an AI mock interview assistant that helps candidates practice realistic HR and role-specific interviews.
- Explain briefly that you help users test whether their CV claims are convincing, practice answering under pressure, identify weak spots, and receive improvement advice after the interview.
- Do not claim to be a real employer or a real human HR person.

Interview goal:
- Interview the candidate based on their CV.
- The CV is your roadmap. All questions must stay within the scope of the CV and target role.
- Use only the supplied CV DATA TEXT as factual source material for interview questions.
- Do not invent projects, skills, companies, schools, certifications, metrics, or experience that are not written in the CV DATA TEXT.
- If the CV lacks enough detail, ask the candidate to clarify the missing CV detail instead of asking unrelated questions.
- Verify whether the candidate truly understands and did what they claimed in the CV.
- Ask 8-10 focused questions, excluding the opening greeting and self-introduction.

Candidate identity from CV:
- CV full name: ${candidateName?.trim() || 'UNKNOWN'}
- The first thing you must verify is the candidate's spoken self-introduction name.
- In the opening, ask the candidate to introduce themselves with their full name exactly as written in the CV.
- If the candidate says a different name, a nickname only, another person's name, or refuses to state the name, immediately stop the interview.
- For a name mismatch, say only this in Vietnamese: "Tên bạn vừa đọc không khớp với tên trên CV. Buổi phỏng vấn sẽ kết thúc tại đây." Then do not ask any more questions, do not continue the conversation, and do not provide coaching.
- Only continue to CV-based interview questions if the spoken name matches the CV name. Accept minor Vietnamese accent/diacritic differences, spacing differences, or order differences only when it is clearly the same person.

${cvData ? `CV:\n${cvData}` : 'No CV was provided. Ask general role-fit questions and avoid claiming you saw CV details.'}

Interview style:
- Speak in Vietnamese by default unless the candidate asks for English.
- Be professional, warm, direct, and rigorous.
- Ask one question at a time.
- Start like a real interview: greet, introduce JobReady AI in one short sentence, then ask the candidate to introduce themselves with their full name for CV identity verification.
- Do not mention interview rules, scoring, or your hidden strategy in the opening.
- Pronounce "JobReady AI" clearly as "Job-Ready-A-I".

INTERVIEWER BEHAVIOR:
- YOU ARE THE INTERVIEWER, NOT A HELPER.
- Never suggest answers, give hints, or coach during the interview.
- If an answer is weak or vague, ask at most one follow-up question to probe deeper, then continue.
- Feedback is only given in the final evaluation report.

When the candidate says they want to finish, provide a structured Vietnamese evaluation report with:
- TONG DIEM: [X]/100
- DIEM NOI DUNG: [X]/70
- DIEM GIONG NOI & THAI DO: [X]/30
  * Âm lượng giọng nói (có nói rõ ràng, đủ to không?)
  * Độ tự tin (có vấp váp, ngắt quãng nhiều không?)
  * Sự trôi chảy (có nói mạch lạc, tự nhiên không?)
- Strengths, weaknesses, suspicious CV claims, improvement roadmap, CV suggestions, and examples of better answers.

IMPORTANT: Observe candidate's speaking behavior during the interview:
- If they speak softly or hesitantly → note "Nên nói to và rõ ràng hơn để thể hiện sự tự tin"
- If they pause frequently (>300ms) or stutter → note "Nên luyện tập để nói trôi chảy hơn, giảm ngắt quãng và do dự"
- If they sound nervous or uncertain → note "Nên thư giãn và tự tin hơn khi trả lời, tránh giọng run hoặc yếu"
- If they speak clearly and confidently → praise "Giọng nói rõ ràng, tự tin, thể hiện sự chuẩn bị tốt"`;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function normalizeVietnameseText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function transcriptMatchesCvName(transcript: string, candidateName?: string) {
  const normalizedName = normalizeVietnameseText(candidateName || '');
  const normalizedTranscript = normalizeVietnameseText(transcript);

  console.log('🔍 Name verification:');
  console.log('  CV name:', candidateName);
  console.log('  Normalized CV:', normalizedName);
  console.log('  Transcript:', transcript);
  console.log('  Normalized transcript:', normalizedTranscript);

  if (!normalizedName || !normalizedTranscript) {
    console.log('  ✓ Empty check - passed');
    return true;
  }

  // Kiểm tra exact match
  if (normalizedTranscript.includes(normalizedName)) {
    console.log('  ✓ Exact match - passed');
    return true;
  }

  // Kiểm tra từng token
  const transcriptTokens = new Set(normalizedTranscript.split(' ').filter(Boolean));
  const nameTokens = normalizedName.split(' ').filter((token) => token.length > 1);
  
  console.log('  Name tokens:', nameTokens);
  console.log('  Transcript tokens:', Array.from(transcriptTokens));
  
  const allTokensMatch = nameTokens.length > 0 && nameTokens.every((token) => transcriptTokens.has(token));
  
  if (allTokensMatch) {
    console.log('  ✓ All tokens match - passed');
  } else {
    console.log('  ✗ Token mismatch - failed');
    const missingTokens = nameTokens.filter(token => !transcriptTokens.has(token));
    console.log('  Missing tokens:', missingTokens);
  }
  
  return allTokensMatch;
}

async function getAudioInputDevices() {
  let devices = await navigator.mediaDevices.enumerateDevices();
  let audioInputs = devices.filter((device) => device.kind === 'audioinput');

  if (audioInputs.some((device) => device.label)) {
    return audioInputs;
  }

  const permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  permissionStream.getTracks().forEach((track) => track.stop());

  devices = await navigator.mediaDevices.enumerateDevices();
  audioInputs = devices.filter((device) => device.kind === 'audioinput');
  return audioInputs;
}

async function getPreferredMicConstraints() {
  const audioInputs = await getAudioInputDevices();
  const bluetoothMic = audioInputs.find((device) => {
    const label = device.label.toLowerCase();
    return BLUETOOTH_MIC_KEYWORDS.some((keyword) => label.includes(keyword));
  });

  if (!bluetoothMic?.deviceId) {
    console.log('Using default computer microphone');
    return BASE_MIC_CONSTRAINTS;
  }

  console.log(`Using preferred headset microphone: ${bluetoothMic.label}`);
  return {
    ...BASE_MIC_CONSTRAINTS,
    deviceId: { exact: bluetoothMic.deviceId },
  };
}

export function useGeminiLiveV2({
  apiKey,
  onMessage,
  onError,
  onSessionEnd,
  onTranscript,
  onAudioMetrics,
  cvData,
  candidateName,
}: UseGeminiLiveV2Props) {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const clientRef = useRef<GenAILiveClient | null>(null);
  const audioStreamerRef = useRef<AudioStreamer | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioWorkletRef = useRef<AudioWorkletNode | null>(null);
  const isListeningRef = useRef(false);
  const restartMicTimerRef = useRef<number | null>(null);
  const identityCheckedRef = useRef(false);
  
  // Audio metrics tracking
  const audioMetricsRef = useRef({
    volumeSum: 0,
    volumeCount: 0,
    speechStartTime: 0,
    wordCount: 0,
    silenceStartTime: 0,
    pauseCount: 0,
    pauseDurations: [] as number[],
    isSpeaking: false,
  });

  const stopListening = useCallback(() => {
    isListeningRef.current = false;

    if (audioWorkletRef.current) {
      audioWorkletRef.current.disconnect();
      audioWorkletRef.current = null;
    }
    if (micContextRef.current) {
      void micContextRef.current.close();
      micContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsListening(false);
  }, []);

  const disconnect = useCallback(() => {
    stopListening();

    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
    }

    if (audioStreamerRef.current) {
      audioStreamerRef.current.dispose();
      audioStreamerRef.current = null;
    }

    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsConnected(false);
  }, [stopListening]);

  const terminateForIdentityMismatch = useCallback(() => {
    if (identityCheckedRef.current) {
      return;
    }

    identityCheckedRef.current = true;
    onMessage?.(IDENTITY_MISMATCH_MESSAGE, 'assistant');
    onSessionEnd?.('identity_mismatch');
    disconnect();
  }, [disconnect, onMessage, onSessionEnd]);

  const connect = useCallback(async () => {
    try {
      if (!apiKey) {
        throw new Error('Missing VITE_GEMINI_API_KEY');
      }

      disconnect();
      identityCheckedRef.current = false;
      console.log('Connecting to Gemini Live API...');

      const ctx = await audioContext({ sampleRate: 24000 });
      audioContextRef.current = ctx;

      const streamer = new AudioStreamer(ctx);
      audioStreamerRef.current = streamer;

      const client = new GenAILiveClient({ apiKey });
      clientRef.current = client;

      client.on('open', () => {
        console.log('Gemini Live connection opened');
        setIsConnected(true);
      });

      client.on('close', () => {
        console.log('Gemini Live connection closed');
        setIsConnected(false);
      });

      client.on('error', (error) => {
        console.error('Gemini Live error:', error);
        onError?.(new Error(error.message || 'Gemini Live error'));
      });

      client.on('interrupted', () => {
        audioStreamerRef.current?.stop();
      });

      client.on('inputtranscription', (text, finished) => {
        // Gửi transcript realtime để hiển thị cho user
        onTranscript?.(text, finished);
        
        if (identityCheckedRef.current || !finished || !candidateName?.trim()) {
          return;
        }

        if (transcriptMatchesCvName(text, candidateName)) {
          identityCheckedRef.current = true;
          return;
        }

        terminateForIdentityMismatch();
      });

      client.on('outputtranscription', (text) => {
        if (
          text.includes(IDENTITY_MISMATCH_CODE) ||
          normalizeVietnameseText(text).includes(normalizeVietnameseText(IDENTITY_MISMATCH_MESSAGE))
        ) {
          terminateForIdentityMismatch();
        }
      });

      client.on('setupcomplete', () => {
        console.log('Gemini Live setup complete, sending interview kickoff');
        client.send([{
          text: `Start the mock interview now.

You are the INTERVIEWER, not a helper.
Opening only:
1. Greet the candidate in Vietnamese.
2. Introduce yourself as JobReady AI in one short sentence.
3. Immediately ask the candidate to introduce themselves with their full name exactly as written in the CV.

If their spoken name does not match "${candidateName?.trim() || 'the CV full name'}", say: "Tên bạn vừa đọc không khớp với tên trên CV. Buổi phỏng vấn sẽ kết thúc tại đây." Then stop the interview and do not continue.

Do not mention scoring, screening notes, question strategy, or give hints. Just begin naturally.`
        }]);
      });

      client.on('audio', (data) => {
        audioStreamerRef.current?.addPCM16(new Uint8Array(data));
      });

      client.on('content', (content) => {
        const parts = content.modelTurn?.parts || [];
        for (const part of parts) {
          if (part.text) {
            onMessage?.(part.text, 'assistant');
          }
        }
      });

      const connected = await client.connect(LIVE_MODEL, {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: 'Aoede',
            },
          },
        },
        systemInstruction: {
          parts: [{ text: buildSystemInstruction(cvData, candidateName) }],
        },
      });

      if (!connected) {
        throw new Error('Failed to connect to Gemini Live');
      }

      await streamer.resume();
    } catch (error) {
      console.error('Failed to connect to Gemini Live:', error);
      onError?.(error as Error);
      setIsConnected(false);
    }
  }, [apiKey, candidateName, cvData, disconnect, onError, onMessage, terminateForIdentityMismatch]);

  const startListening = useCallback(async () => {
    if (isListeningRef.current || !clientRef.current) {
      return;
    }

    try {
      const preferredConstraints = await getPreferredMicConstraints();
      let stream: MediaStream;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: preferredConstraints,
        });
      } catch (error) {
        console.warn('Preferred microphone unavailable, falling back to default mic:', error);
        stream = await navigator.mediaDevices.getUserMedia({
          audio: BASE_MIC_CONSTRAINTS,
        });
      }

      mediaStreamRef.current = stream;

      const ctx = new AudioContext({ sampleRate: 16000 });
      micContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);

      const workletCode = `
        class AudioProcessor extends AudioWorkletProcessor {
          constructor() {
            super();
            this.GAIN = 2.5; // Tăng từ 1.5 lên 2.5 để nghe rõ hơn
            this.audioBuffer = new Int16Array(1024);
            this.bufferWriteIndex = 0;
            
            // Audio metrics tracking
            this.SILENCE_THRESHOLD = 0.01; // Ngưỡng im lặng
            this.SILENCE_DURATION = 300; // 300ms im lặng = pause
            this.silenceFrames = 0;
            this.isSpeaking = false;
            this.lastSpeakTime = 0;
          }

          convertFloat32ToInt16(float32Array) {
            const int16Array = new Int16Array(float32Array.length);
            for (let i = 0; i < float32Array.length; i++) {
              const s = Math.max(-1, Math.min(1, float32Array[i] * this.GAIN));
              int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }
            return int16Array;
          }
          
          calculateRMS(float32Array) {
            let sum = 0;
            for (let i = 0; i < float32Array.length; i++) {
              sum += float32Array[i] * float32Array[i];
            }
            return Math.sqrt(sum / float32Array.length);
          }

          sendAudioBuffer() {
            const data = this.audioBuffer.slice(0, this.bufferWriteIndex);
            this.port.postMessage({ audio: data.buffer }, [data.buffer]);
            this.audioBuffer = new Int16Array(1024);
            this.bufferWriteIndex = 0;
          }

          process(inputs) {
            const input = inputs[0];
            if (!input || !input[0]) return true;

            const float32Data = input[0];
            
            // Tính RMS (volume)
            const rms = this.calculateRMS(float32Data);
            const volume = Math.min(100, rms * 100 * 3); // Scale to 0-100
            
            // Phát hiện speech/silence
            const isSilent = rms < this.SILENCE_THRESHOLD;
            
            if (isSilent) {
              this.silenceFrames++;
              const silenceDuration = (this.silenceFrames * 128) / 16000 * 1000; // ms
              
              if (this.isSpeaking && silenceDuration > this.SILENCE_DURATION) {
                // Phát hiện pause
                this.port.postMessage({ 
                  type: 'pause',
                  duration: silenceDuration 
                });
                this.isSpeaking = false;
              }
            } else {
              if (!this.isSpeaking && this.silenceFrames > 0) {
                // Bắt đầu nói lại sau pause
                this.port.postMessage({ type: 'speechStart' });
              }
              this.silenceFrames = 0;
              this.isSpeaking = true;
              this.lastSpeakTime = currentTime;
              
              // Gửi volume metrics
              this.port.postMessage({ 
                type: 'volume',
                value: volume 
              });
            }

            const int16Data = this.convertFloat32ToInt16(float32Data);
            for (let i = 0; i < int16Data.length; i++) {
              this.audioBuffer[this.bufferWriteIndex++] = int16Data[i];
              if (this.bufferWriteIndex >= this.audioBuffer.length) {
                this.sendAudioBuffer();
              }
            }

            return true;
          }
        }
        registerProcessor('audio-processor', AudioProcessor);
      `;

      const blob = new Blob([workletCode], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      await ctx.audioWorklet.addModule(url);
      URL.revokeObjectURL(url);

      const worklet = new AudioWorkletNode(ctx, 'audio-processor');
      audioWorkletRef.current = worklet;

      worklet.port.onmessage = (event) => {
        const data = event.data;
        
        // Xử lý audio metrics
        if (data.type === 'volume') {
          const metrics = audioMetricsRef.current;
          metrics.volumeSum += data.value;
          metrics.volumeCount++;
        } else if (data.type === 'pause') {
          const metrics = audioMetricsRef.current;
          metrics.pauseCount++;
          metrics.pauseDurations.push(data.duration);
          
          // Tính toán và gửi metrics sau mỗi pause
          const avgVolume = metrics.volumeCount > 0 
            ? metrics.volumeSum / metrics.volumeCount 
            : 0;
          
          const speakingDuration = (Date.now() - metrics.speechStartTime) / 1000;
          const speechRate = speakingDuration > 0 && metrics.wordCount > 0
            ? (metrics.wordCount / speakingDuration) * 60
            : 0;
          
          const avgPauseDuration = metrics.pauseDurations.length > 0
            ? metrics.pauseDurations.reduce((a, b) => a + b, 0) / metrics.pauseDurations.length
            : 0;
          
          // Đánh giá confidence
          let confidence: 'low' | 'medium' | 'high' = 'medium';
          if (avgVolume < 30 || metrics.pauseCount > 5) {
            confidence = 'low';
          } else if (avgVolume > 50 && metrics.pauseCount <= 2) {
            confidence = 'high';
          }
          
          // Gửi metrics
          onAudioMetrics?.({
            volume: Math.round(avgVolume),
            speechRate: Math.round(speechRate),
            pauseCount: metrics.pauseCount,
            avgPauseDuration: Math.round(avgPauseDuration),
            pitchVariation: 50,
            confidence,
          });
          
          console.log('🎤 Audio metrics:', {
            volume: Math.round(avgVolume),
            pauseCount: metrics.pauseCount,
            avgPauseDuration: Math.round(avgPauseDuration),
            confidence,
          });
        } else if (data.type === 'speechStart') {
          const metrics = audioMetricsRef.current;
          if (metrics.speechStartTime === 0) {
            metrics.speechStartTime = Date.now();
          }
          metrics.isSpeaking = true;
          // Estimate word count based on speaking duration (rough estimate: 2-3 words per second)
          metrics.wordCount = Math.floor((Date.now() - metrics.speechStartTime) / 1000 * 2.5);
        }
        
        // Xử lý audio data
        if (data.audio && clientRef.current) {
          clientRef.current.sendRealtimeInput([{
            mimeType: 'audio/pcm;rate=16000',
            data: arrayBufferToBase64(data.audio),
          }]);
        }
      };

      source.connect(worklet);
      isListeningRef.current = true;
      setIsListening(true);
    } catch (error) {
      console.error('Failed to start microphone:', error);
      onError?.(error as Error);
      isListeningRef.current = false;
      setIsListening(false);
    }
  }, [onError]);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !clientRef.current || !isConnected) {
      return;
    }

    clientRef.current.send([{ text: trimmed }], true);
    onMessage?.(trimmed, 'user');
  }, [isConnected, onMessage]);

  const setSpeakerEnabled = useCallback((enabled: boolean) => {
    const gainNode = audioStreamerRef.current?.gainNode;
    if (!gainNode) {
      return;
    }

    gainNode.gain.setValueAtTime(enabled ? 1 : 0, gainNode.context.currentTime);
  }, []);

  useEffect(() => {
    const handleDeviceChange = () => {
      if (!clientRef.current || !isListeningRef.current) {
        return;
      }

      if (restartMicTimerRef.current) {
        window.clearTimeout(restartMicTimerRef.current);
      }

      stopListening();
      restartMicTimerRef.current = window.setTimeout(() => {
        void startListening();
      }, 350);
    };

    navigator.mediaDevices?.addEventListener?.('devicechange', handleDeviceChange);
    return () => {
      navigator.mediaDevices?.removeEventListener?.('devicechange', handleDeviceChange);
      if (restartMicTimerRef.current) {
        window.clearTimeout(restartMicTimerRef.current);
        restartMicTimerRef.current = null;
      }
    };
  }, [startListening, stopListening]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isListening,
    connect,
    disconnect,
    startListening,
    stopListening,
    sendMessage,
    setSpeakerEnabled,
  };
}
