/**
 * Gemini Live API Hook - adapted from the smile/live-api implementation.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Modality } from '@google/genai';
import { GenAILiveClient } from '@/lib/live-api/genai-live-client';
import { AudioStreamer } from '@/lib/live-api/audio-streamer';
import { audioContext } from '@/lib/live-api/utils';

interface InterviewPersona {
  id: 'sweet' | 'tough' | 'mentor';
  gender?: 'female' | 'male';
  voiceName: string;
  systemPromptOverride?: string;
}

interface UseGeminiLiveV2Props {
  apiKey: string;
  interviewPersona?: InterviewPersona;
  personaGender?: 'female' | 'male';
  onMessage?: (message: string, role: 'user' | 'assistant') => void;
  onPartialMessage?: (text: string) => void; // streaming chunk
  onError?: (error: Error) => void;
  onSessionEnd?: () => void;
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

function buildSystemInstruction(cvData?: string, candidateName?: string, personaToneInstructions?: string, personaGender?: 'female' | 'male') {
  console.log('[buildSystemInstruction] cvData length:', cvData?.length ?? 0);
  console.log('[buildSystemInstruction] candidateName:', candidateName);
  console.log('[buildSystemInstruction] personaToneInstructions:', personaToneInstructions ? 'provided' : 'none');
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

Language support:
- The CV may be provided in English or Vietnamese.
- Accept candidate responses in either English or Vietnamese.
- ALWAYS respond in Vietnamese only, regardless of the CV language or candidate's language choice.
- If the candidate speaks English, still respond in Vietnamese to maintain consistency.

Candidate identity from CV:
- CV full name: ${candidateName?.trim() || 'UNKNOWN'}

${cvData ? `CV:\n${cvData}` : 'No CV was provided. Ask general role-fit questions and avoid claiming you saw CV details.'}

Interview style:
- Speak in Vietnamese only, throughout the entire interview.
- You are a ${personaGender === 'male' ? 'male technical' : 'female HR'} interviewer. Always refer to yourself as "${personaGender === 'male' ? 'anh' : 'chị'}" and the candidate as "em". NEVER use "tôi", "mình", "bạn", ${personaGender === 'male' ? '"chị" for yourself or "anh/chị"' : '"anh/chị"'} for the candidate.
- Correct examples: "${personaGender === 'male' ? 'Anh' : 'Chị'} là JobReady AI...", "Em có thể kể về...", "${personaGender === 'male' ? 'Anh' : 'Chị'} muốn hỏi em..."
- Be professional, warm, direct, and rigorous.
- Ask one question at a time.
- Start like a real interview:
  1. Greet the candidate warmly in Vietnamese — say "Chào em" or similar. Do NOT say the candidate's name out loud when greeting.
  2. Introduce yourself as JobReady AI in one short sentence, using "${personaGender === 'male' ? 'anh' : 'chị'}".
  3. Ask the candidate to briefly introduce themselves and their background.
  4. If the candidate only gives a very short self-introduction such as just their name, accept it and move on immediately.
  5. Do not keep asking for missing self-introduction details.
  6. Right after the self-introduction, if the candidate mentioned their name, you MAY use it when speaking to them occasionally. Mix between using the name they just said and "em" naturally — no need to always use the name. Do NOT use the CV name for addressing — only use the name the candidate says themselves.
- Prioritize questions ONLY about: technical skills, work experience, project experience, tools used, responsibilities, decisions made, challenges faced, and measurable results written in the CV.
- NEVER ask questions about education, school, university, GPA, or academic background. Education section exists in CV only as context, not as an interview topic.
- Do not use the career objective section as an interview topic.
- Do not ask deep follow-up questions about career goals, personal objectives, or generic aspirations.
- If the CV has both objective and concrete experience/skills, ignore the objective and focus on experience and skills.
- Do not mention interview rules, scoring, or your hidden strategy in the opening.
- Pronounce "JobReady AI" clearly as "Job-Ready-A-I".

CRITICAL THINKING AS A REAL HR (TƯ DUY PHẢN BIỆN NHƯ HR THẬT):
- YOU ARE THE INTERVIEWER, NOT A HELPER OR GRADING MACHINE.
- Never judge answers based on "correct" or "incorrect" templates.
- Judge based on: LOGIC, CLARITY, RELEVANCE, AUTHENTICITY, and DEPTH.
- Accept multiple valid perspectives - there is NO single "correct" answer.
- Prefer questions that verify real experience from the CV, especially skills, projects, responsibilities, tools, problem-solving, and outcomes.
- Do not spend interview time probing the career objective section.
- If an answer is logical and well-explained, it deserves high marks even if different from your expectation.
- If an answer is weak or vague, ask at most one follow-up question to probe deeper, then continue.
- Never suggest answers, give hints, or coach during the interview.
- Feedback is only given in the final evaluation report.

EVALUATION CRITERIA (3 MAIN ASPECTS):

1. CV ALIGNMENT SCORE (Điểm khớp với CV): /30 điểm
   - Does the candidate's answer match what's written in their CV?
   - Can they explain their CV claims in detail?
   - Are their experiences and skills consistent with CV?
   - Do they demonstrate real understanding of what they claimed?
   
   Scoring:
   - 25-30: Perfect alignment, deep understanding, can explain all CV details clearly
   - 20-24: Good alignment, most CV claims verified, minor inconsistencies
   - 15-19: Some alignment, but several CV claims not well explained
   - 10-14: Weak alignment, many CV claims questionable
   - 0-9: Poor alignment, major inconsistencies or cannot explain CV

2. CONTENT & LOGIC SCORE (Điểm nội dung & logic): /40 điểm
   - Is the answer logical, clear, and well-structured?
   - Does it demonstrate critical thinking?
   - Is it relevant to the question?
   - Does it show depth of knowledge?
   - IMPORTANT: Judge the LOGIC and CLARITY, not whether it matches a template answer
   
   Scoring:
   - 35-40: Excellent logic, clear structure, deep insights, highly relevant
   - 30-34: Good logic, well-explained, relevant, shows understanding
   - 25-29: Acceptable logic, somewhat clear, mostly relevant
   - 20-24: Weak logic, unclear, partially relevant
   - 15-19: Poor logic, confusing, barely relevant
   - 0-14: No clear logic, irrelevant, or cannot answer

3. SPEAKING QUALITY SCORE (Điểm chất lượng giọng nói): /30 điểm
   Based on audio metrics and speaking behavior:
   
   a) Âm lượng (Volume) - 10 điểm:
      - 9-10: Clear, confident volume (60-100 on scale)
      - 7-8: Adequate volume (40-59)
      - 5-6: Soft but audible (20-39)
      - 0-4: Too soft or inconsistent (<20)
   
   b) Độ trôi chảy (Fluency & Confidence) - 10 điểm:
      - 9-10: Smooth, minimal pauses (<2 pauses), natural flow
      - 7-8: Mostly fluent (2-3 pauses), some hesitation
      - 5-6: Somewhat hesitant (4-5 pauses), noticeable breaks
      - 0-4: Very hesitant (>5 pauses), frequent stuttering
   
   c) Tốc độ nói (Speaking Rate) - 10 điểm:
      - 9-10: Natural pace (120-160 words/min), easy to follow
      - 7-8: Acceptable pace (100-119 or 161-180 wpm)
      - 5-6: Too slow (<100 wpm) or too fast (>180 wpm)
      - 0-4: Extremely slow or rushed, hard to follow

FINAL EVALUATION FORMAT (when candidate asks to finish):

Provide a detailed Vietnamese evaluation report:

---
📊 ĐÁNH GIÁ PHỎNG VẤN

**TỔNG ĐIỂM: [X]/100**

**1. ĐIỂM KHỚP VỚI CV: [X]/30**
- [Đánh giá chi tiết về sự khớp với CV]
- [Những điểm CV được xác thực tốt]
- [Những điểm CV còn yếu hoặc không rõ ràng]

**2. ĐIỂM NỘI DUNG & LOGIC: [X]/40**
- [Đánh giá về logic và độ rõ ràng]
- [Những câu trả lời tốt nhất]
- [Những câu trả lời cần cải thiện]

**3. ĐIỂM CHẤT LƯỢNG GIỌNG NÓI: [X]/30**
- Âm lượng: [X]/10 - [Nhận xét]
- Độ trôi chảy: [X]/10 - [Nhận xét]
- Tốc độ nói: [X]/10 - [Nhận xét]

---
💪 ĐIỂM MẠNH:
- [Liệt kê 3-5 điểm mạnh cụ thể]

---
⚠️ ĐIỂM YẾU:
- [Liệt kê 3-5 điểm yếu cụ thể]

---
🚩 CV CLAIMS CẦN LÀM RÕ:
- [Những phần CV chưa thuyết phục hoặc cần bổ sung]

---
📈 LỘ TRÌNH PHÁT TRIỂN:
1. [Kỹ năng/kiến thức cần bổ sung]
2. [Cách cải thiện kỹ năng phỏng vấn]
3. [Đề xuất học tập/thực hành]

---
✏️ ĐỀ XUẤT SỬA CV:
- [Những phần nên bổ sung hoặc làm rõ hơn trong CV]

---
💡 VÍ DỤ CÂU TRẢ LỜI TỐT HƠN:
Câu hỏi: [Câu hỏi yếu nhất]
Bạn đã trả lời: [Tóm tắt]
Nên trả lời: [Ví dụ cải thiện]
---
${personaToneInstructions ? `\nPERSONA TONE INSTRUCTIONS:\n${personaToneInstructions}\n` : ''}
REMEMBER: You are evaluating like a REAL HR with critical thinking, not a grading machine with fixed answers. Judge the QUALITY OF THINKING and COMMUNICATION, not whether it matches your expected answer.`;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
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
  interviewPersona,
  personaGender,
  onMessage,
  onPartialMessage,
  onError,
  onSessionEnd,
  onTranscript,
  onAudioMetrics,
  cvData,
  candidateName,
}: UseGeminiLiveV2Props) {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);

  const clientRef = useRef<GenAILiveClient | null>(null);
  const audioStreamerRef = useRef<AudioStreamer | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioWorkletRef = useRef<AudioWorkletNode | null>(null);
  const isListeningRef = useRef(false);
  const cvDataRef = useRef(cvData);
  const candidateNameRef = useRef(candidateName);
  const personaRef = useRef(interviewPersona);
  const personaGenderRef = useRef(personaGender);
  const restartMicTimerRef = useRef<number | null>(null);
  const audioEndTimerRef = useRef<number | null>(null);
  const currentAITextRef = useRef('');
  const aiTextEndTimerRef = useRef<number | null>(null);
  
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

  useEffect(() => {
    cvDataRef.current = cvData ?? '';
  }, [cvData]);

  useEffect(() => {
    candidateNameRef.current = candidateName ?? '';
  }, [candidateName]);

  useEffect(() => {
    personaRef.current = interviewPersona;
  }, [interviewPersona]);

  useEffect(() => {
    personaGenderRef.current = personaGender ?? interviewPersona?.gender;
  }, [personaGender, interviewPersona]);

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

    if (audioEndTimerRef.current) {
      clearTimeout(audioEndTimerRef.current);
      audioEndTimerRef.current = null;
    }
    if (aiTextEndTimerRef.current) {
      clearTimeout(aiTextEndTimerRef.current);
      aiTextEndTimerRef.current = null;
    }
    currentAITextRef.current = '';
    setIsAISpeaking(false);

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



  const connect = useCallback(async (cvDataOverride?: string, candidateNameOverride?: string) => {
    try {
      if (!apiKey) {
        throw new Error('Missing VITE_GEMINI_API_KEY');
      }

      disconnect();
      console.log('Connecting to Gemini Live API...');

      const cvText = cvDataOverride ?? cvDataRef.current ?? '';
      const resolvedCandidateName = candidateNameOverride ?? candidateNameRef.current ?? '';

      const ctx = await audioContext({ sampleRate: 24000 });
      audioContextRef.current = ctx;

      const streamer = new AudioStreamer(ctx);
      audioStreamerRef.current = streamer;

      // Wire up completion callback — primary signal for when audio playback finishes
      streamer.onComplete = () => {
        setIsAISpeaking(false);
        if (audioEndTimerRef.current) {
          clearTimeout(audioEndTimerRef.current);
          audioEndTimerRef.current = null;
        }
      };

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
        setIsAISpeaking(false);
        if (audioEndTimerRef.current) {
          clearTimeout(audioEndTimerRef.current);
          audioEndTimerRef.current = null;
        }
      });

      client.on('inputtranscription', (text, finished) => {
        // Gửi user speech như message khi hoàn tất
        if (finished && text?.trim()) {
          onMessage?.(text.trim(), 'user');
        }
        onTranscript?.(text, finished);
      });



      const personaGender = personaGenderRef.current;
      const isMale = personaGender === 'male';
      const xuNgoai = isMale ? '"anh"' : '"chị"';
      const vaiTro = isMale ? 'nam' : 'nữ';

      client.on('setupcomplete', () => {
        console.log('Gemini Live setup complete, sending interview kickoff');
        client.send([{
          text: `Bắt đầu buổi phỏng vấn thử ngay bây giờ.

VAI TRÒ VÀ XƯNG HÔ:
- Bạn là người phỏng vấn ${vaiTro}, xưng ${xuNgoai}, gọi ứng viên là "em" xuyên suốt toàn bộ buổi phỏng vấn.
- KHÔNG BAO GIỜ xưng "tôi", "mình", hay gọi ứng viên là "bạn" hoặc ${isMale ? '"chị"' : '"anh/chị"'}.
- Ví dụ đúng: "${isMale ? 'Anh' : 'Chị'} là JobReady AI...", "Em có thể giới thiệu...", "${isMale ? 'Anh' : 'Chị'} muốn hỏi em về..."
- Giữ xưng hô nhất quán từ đầu đến cuối.

QUAN TRỌNG: Luôn trả lời bằng tiếng Việt, bất kể ứng viên nói ngôn ngữ gì.

Trình tự mở đầu (thực hiện đúng thứ tự, không bỏ bước):
1. Chào ứng viên bằng tiếng Việt, thân thiện và chuyên nghiệp — chỉ nói "Chào em" hoặc tương tự, KHÔNG đọc tên ứng viên ra khi chào.
2. Giới thiệu bản thân là JobReady AI trong đúng một câu ngắn, xưng ${xuNgoai}.
3. Mời ứng viên tự giới thiệu ngắn gọn về bản thân và background.
4. Nếu ứng viên chỉ giới thiệu rất ngắn, ví dụ chỉ nói tên, vẫn phải chấp nhận và chuyển tiếp ngay.
5. Không được hỏi bù các ý còn thiếu trong phần tự giới thiệu.
6. Ngay khi ứng viên vừa giới thiệu xong — KHÔNG hỏi thêm, KHÔNG xác nhận, KHÔNG chờ — chuyển NGAY sang câu hỏi phỏng vấn đầu tiên dựa trên kỹ năng, kinh nghiệm, dự án trong CV. Nếu ứng viên đã nói tên, từ bước này trở đi có thể lẫn lộn giữa gọi tên (tên ứng viên vừa nói, KHÔNG phải tên từ CV) và xưng "em" một cách tự nhiên — không bắt buộc lúc nào cũng gọi tên.

TUYỆT ĐỐI KHÔNG:
- Đọc tên ứng viên ra khi chào.
- Hỏi "Em có sẵn sàng chưa?" hoặc bất kỳ câu xác nhận nào.
- Dùng phần mục tiêu nghề nghiệp trong CV làm chủ đề phỏng vấn chính.
- Hỏi về học vấn, trường học, điểm GPA hoặc nội dung học thuật.
- Xưng "tôi" hay gọi ứng viên là "bạn".
- Hỏi nhiều hơn một câu cùng lúc.

Bắt đầu tự nhiên như một buổi phỏng vấn thật sự.`
        }]);
      });

      client.on('audio', (data) => {
        audioStreamerRef.current?.addPCM16(new Uint8Array(data));
        setIsAISpeaking(true);
        // Reset the end timer whenever new audio comes in
        if (audioEndTimerRef.current) {
          clearTimeout(audioEndTimerRef.current);
        }
        // Fallback only — streamer.onComplete is the primary signal
        audioEndTimerRef.current = window.setTimeout(() => {
          setIsAISpeaking(false);
          audioEndTimerRef.current = null;
        }, 8000);
      });

      client.on('content', (_content) => {
        // Audio model: text comes via outputtranscription, not modelTurn parts
        // No-op: keep handler registered to avoid EventEmitter warnings
      });

      client.on('outputtranscription', (text, finished) => {
        if (text) {
          currentAITextRef.current += text;
          // Emit partial update immediately for streaming display
          onPartialMessage?.(currentAITextRef.current);
        }
        if (finished) {
          if (aiTextEndTimerRef.current) {
            clearTimeout(aiTextEndTimerRef.current);
            aiTextEndTimerRef.current = null;
          }
          const toEmit = currentAITextRef.current.trim();
          currentAITextRef.current = ''; // clear BEFORE emitting to prevent double-flush
          if (toEmit) {
            onMessage?.(toEmit, 'assistant');
          }
        } else {
          // Safety fallback only — 3000ms, not the primary flush path
          if (aiTextEndTimerRef.current) clearTimeout(aiTextEndTimerRef.current);
          aiTextEndTimerRef.current = window.setTimeout(() => {
            const toEmit = currentAITextRef.current.trim();
            currentAITextRef.current = '';
            aiTextEndTimerRef.current = null;
            if (toEmit) {
              onMessage?.(toEmit, 'assistant');
            }
          }, 3000);
        }
      });

      client.on('turncomplete', () => {
        // AI finished speaking - flush any accumulated text
        if (aiTextEndTimerRef.current) {
          clearTimeout(aiTextEndTimerRef.current);
          aiTextEndTimerRef.current = null;
        }
        const toEmit = currentAITextRef.current.trim();
        currentAITextRef.current = ''; // clear first
        if (toEmit) {
          onMessage?.(toEmit, 'assistant');
        }
        // Clear streaming display
        onPartialMessage?.('');
        // isAISpeaking stays true — audioEndTimer will handle it at 2500ms after last audio
      });

      const connected = await client.connect(LIVE_MODEL, {
        responseModalities: [Modality.AUDIO],
        inputAudioTranscription: {},
        outputAudioTranscription: {},
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: personaRef.current?.voiceName ?? 'Aoede',
            },
          },
        },
        systemInstruction: {
          parts: [{ text: buildSystemInstruction(cvText, resolvedCandidateName, personaRef.current?.systemPromptOverride, personaGenderRef.current) }],
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
  }, [apiKey, disconnect, onError, onMessage]);

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
            this.GAIN = 2.5;
            this.audioBuffer = new Int16Array(1024);
            this.bufferWriteIndex = 0;
            
            // Audio metrics tracking - separate from transmission
            this.SILENCE_THRESHOLD = 0.01;
            this.NOISE_FLOOR_THRESHOLD = 3; // For metrics/pause detection only, NOT for audio gating
            this.SILENCE_DURATION = 1000; // 1000ms = pause detection threshold (ms)
            this.silenceFrames = 0;
            this.isSpeaking = false;
            this.pauseSent = false; // Prevent duplicate pause messages
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
            if (this.bufferWriteIndex > 0) {
              const data = this.audioBuffer.slice(0, this.bufferWriteIndex);
              this.port.postMessage({ audio: data.buffer }, [data.buffer]);
              this.audioBuffer = new Int16Array(1024);
              this.bufferWriteIndex = 0;
            }
          }

          process(inputs) {
            const input = inputs[0];
            if (!input || !input[0]) return true;

            const float32Data = input[0];
            
            // Calculate volume for metrics only
            const rms = this.calculateRMS(float32Data);
            const volume = Math.min(100, rms * 100 * 3);
            
            // Detect speech/silence for pause detection and metrics
            const isSilent = volume < this.NOISE_FLOOR_THRESHOLD;
            
            if (isSilent) {
              this.silenceFrames++;
              const silenceDuration = (this.silenceFrames * 128) / 16000 * 1000; // ms
              
              // Send pause signal once when silence exceeds threshold
              if (this.isSpeaking && silenceDuration > this.SILENCE_DURATION && !this.pauseSent) {
                // Flush any remaining audio before pause signal
                this.sendAudioBuffer();
                this.port.postMessage({ 
                  type: 'pause',
                  duration: silenceDuration 
                });
                this.pauseSent = true;
                this.isSpeaking = false;
              }
            } else {
              if (!this.isSpeaking && this.silenceFrames > 0) {
                // Speech resumed after silence
                this.port.postMessage({ type: 'speechStart' });
                this.pauseSent = false;
              }
              this.silenceFrames = 0;
              this.isSpeaking = true;
              
              // Send volume metrics for analytics
              this.port.postMessage({ 
                type: 'volume',
                value: volume 
              });
            }

            // FIX 1: ALWAYS send ALL audio data to Gemini unconditionally
            // Gemini Live handles its own voice activity detection internally
            // Do NOT gate audio transmission based on client-side thresholds
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
        
        // Handle audio metrics tracking
        if (data.type === 'volume') {
          const metrics = audioMetricsRef.current;
          metrics.volumeSum += data.value;
          metrics.volumeCount++;
        } 
        // FIX 3: Send turn-complete signal when user finishes speaking (pause detected)
        else if (data.type === 'pause') {
          const metrics = audioMetricsRef.current;
          metrics.pauseCount++;
          metrics.pauseDurations.push(data.duration);
          
          // Calculate metrics
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
          
          // Evaluate confidence
          let confidence: 'low' | 'medium' | 'high' = 'medium';
          if (avgVolume < 30 || metrics.pauseCount > 5) {
            confidence = 'low';
          } else if (avgVolume > 50 && metrics.pauseCount <= 2) {
            confidence = 'high';
          }
          
          // Send metrics callback
          onAudioMetrics?.({
            volume: Math.round(avgVolume),
            speechRate: Math.round(speechRate),
            pauseCount: metrics.pauseCount,
            avgPauseDuration: Math.round(avgPauseDuration),
            pitchVariation: 50,
            confidence,
          });
          
          console.log('🎤 Pause detected - Audio metrics:', {
            volume: Math.round(avgVolume),
            pauseCount: metrics.pauseCount,
            avgPauseDuration: Math.round(avgPauseDuration),
            confidence,
          });
        } 
        else if (data.type === 'speechStart') {
          const metrics = audioMetricsRef.current;
          if (metrics.speechStartTime === 0) {
            metrics.speechStartTime = Date.now();
          }
          metrics.isSpeaking = true;
          // Estimate word count: ~2.5 words per second average speech rate
          metrics.wordCount = Math.floor((Date.now() - metrics.speechStartTime) / 1000 * 2.5);
        }
        
        // FIX 1 & 2: Handle audio data transmission
        // Audio data is sent unconditionally from worklet
        // Convert to base64 and send to Gemini Live API
        if (data.audio && clientRef.current) {
          const audioBase64 = arrayBufferToBase64(data.audio);
          console.log('📨 Sending audio chunk to Gemini:', audioBase64.length, 'bytes');
          clientRef.current.sendRealtimeInput([{
            mimeType: 'audio/pcm;rate=16000',
            data: audioBase64,
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
    isAISpeaking,
    connect,
    disconnect,
    startListening,
    stopListening,
    sendMessage,
    setSpeakerEnabled,
  };
}
