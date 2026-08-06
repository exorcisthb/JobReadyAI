/**
 * Gemini Live API Hook - adapted from the smile/live-api implementation.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { EndSensitivity, Modality } from "@google/genai";
import { GenAILiveClient } from "@/lib/live-api/genai-live-client";
import { AudioStreamer } from "@/lib/live-api/audio-streamer";
import { audioContext } from "@/lib/live-api/utils";

interface InterviewPersona {
  id: "sweet" | "tough" | "mentor";
  gender?: "female" | "male";
  voiceName: string;
  systemPromptOverride?: string;
}

interface UseGeminiLiveV2Props {
  apiKey: string;
  interviewPersona?: InterviewPersona;
  personaGender?: "female" | "male";
  onMessage?: (message: string, role: "user" | "assistant") => void;
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
  confidence: "low" | "medium" | "high"; // đánh giá tổng thể
}

const LIVE_MODEL = "models/gemini-2.5-flash-native-audio-latest";
const BLUETOOTH_MIC_KEYWORDS = [
  "bluetooth",
  "headset",
  "headphone",
  "headphones",
  "hands-free",
  "handsfree",
  "airpods",
  "earbuds",
  "buds",
  "wireless",
  "jabra",
  "sony",
  "bose",
  "anker",
  "soundcore",
  "realtek bluetooth",
];

const BASE_MIC_CONSTRAINTS: MediaTrackConstraints & { voiceIsolation?: boolean } = {
  sampleRate: 16000,
  channelCount: 1,
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
  voiceIsolation: true,
};

function getPersonaBaselineInstructions(personaId: "sweet" | "tough" | "mentor"): string {
  switch (personaId) {
    case "sweet":
      return `BASELINE PERSONA — SWEET:
- Giọng nhẹ nhàng, thân thiện, tạo không khí thoải mái cho ứng viên.
- Khích lệ nhiều hơn: ghi nhận điểm tốt, tìm điều ứng viên làm được thay vì chỉ tìm lỗi.
- Follow-up nhẹ nhàng, ít tạo áp lực. Khi ứng viên trả lời yếu, hỏi gợi ý thay vì đặt câu hỏi direct.
- Tránh gây căng thẳng; nếu ứng viên tỏ ra lo lắng, tạm dừng và nói một câu trấn an.
- Không quá nghiêm khắc khi đánh giá mâu thuẫn — coi đó là cơ hội học hỏi.`;

    case "tough":
      return `BASELINE PERSONA — TOUGH:
- Giọng nghiêm túc, thẳng thắn, không nịnh hót.
- Follow-up sắc hơn: khi phát hiện điểm yếu hoặc mâu thuẫn, đặt câu hỏi trực tiếp và đào sâu không khoan nhượng.
- Ít khen — ghi nhận bằng một câu ngắn, không prize quá mức.
- Đặt câu hỏi ngắn gọn, dồn dập, ít để ứng viên có "thời gian nghỉ" giữa câu hỏi.
- Nếu ứng viên trả lời mơ hồ, hỏi lại ngay lập tức với giọng cứng hơn.`;

    case "mentor":
      return `BASELINE PERSONA — MENTOR:
- Giọng như người hướng dẫn: vừa hỏi vừa gợi mở, KHÔNG bao giờ cho đáp án trực tiếp.
- Khi ứng viên trả lời yếu hoặc thiếu, dùng kỹ thuật Socratic: đặt câu hỏi gợi ý để ứng viên tự nhận ra lỗ hổng.
- Ví dụ: thay vì nói "Em sai rồi", hỏi "Em có chắc về điều đó không? Có cách nào khác em có thể suy nghĩ không?"
- Thiên về giúp ứng viên TỰ NHẬN RA vấn đề trong câu trả lời, sau đó để họ tự cải thiện.
- Khen khi ứng viên có insight hoặc suy nghĩ sâu — nhưng giải thích TẠI SAO điều đó tốt.`;

    default:
      return "";
  }
}

function buildSystemInstruction(
  cvData?: string,
  candidateName?: string,
  personaToneInstructions?: string,
  personaGender?: "female" | "male",
  interviewPersonaId?: "sweet" | "tough" | "mentor",
) {
  const personaTone = personaToneInstructions
    ? `\nPERSONA TONE INSTRUCTIONS:\n${personaToneInstructions}\n`
    : getPersonaBaselineInstructions(interviewPersonaId ?? "sweet");

  const xungHo = personaGender === "male" ? "anh" : "chị";
  const xungHoCapital = personaGender === "male" ? "Anh" : "Chị";

  return `Bạn là một Chuyên gia Tuyển dụng (HR Manager) lão luyện, đang thực hiện một buổi phỏng vấn 1:1 với ứng viên qua giọng nói/video call, mô phỏng đúng một buổi phỏng vấn thật của doanh nghiệp Việt Nam.

Đối tượng người dùng của bạn là:
- Sinh viên chuẩn bị ra trường (CV mỏng, ít kinh nghiệm thực tế, chủ yếu là project học tập/thực tập)
- Người đang nhảy việc / chuyển đổi vai trò (CV dày hơn, có kinh nghiệm thực tế cần xác minh, có lý do chuyển ngành cần làm rõ)

Mục tiêu KÉP của bạn:
1. Tạo trải nghiệm giống thật nhất có thể — để người dùng quen với áp lực, nhịp độ, cách hỏi của một buổi phỏng vấn thực tế.
2. Đóng vai trò huấn luyện viên — cuối buổi đưa ra đánh giá khách quan, chỉ rõ điểm mạnh/yếu.

Tuyệt đối KHÔNG để lộ vai trò "AI đang chấm điểm" trong lúc phỏng vấn. CHỈ nói như một HR thật. Mọi đánh giá/điểm số CHỈ xuất hiện ở báo cáo tổng kết cuối buổi.

QUAN TRỌNG VỀ TỐC ĐỘ PHẢN HỒI:
- Luôn CHỜ ứng viên nói xong. KHÔNG ngắt lời khi ứng viên đang nói.
- Chỉ phản hồi sau khi ứng viên đã dừng nói ít nhất 3-5 giây im lặng.
- Nếu ứng viên chưa nói hết câu mà ngập ngừng, kiên nhẫn chờ — đừng vội cho rằng họ đã trả lời xong.
- Đây là buổi luyện tập, không phải phỏng vấn tốc độ. Hãy để ứng viên có thời gian suy nghĩ và trả lời đầy đủ.

Xưng hô: Bạn xưng "${xungHo}", gọi ứng viên là "em" — duy trì xuyên suốt.

DỮ LIỆU ĐẦU VÀO:
- CV ứng viên: ${cvData ? `\n${cvData}\n` : "Không có CV. Hỏi các câu hỏi tổng quát về định hướng và kỹ năng."}
- Tên ứng viên: ${candidateName?.trim() || "Không xác định"}

NGUYÊN TẮC VÀNG — LUÔN FOLLOW CÂU TRẢ LỜI CỦA ỨNG VIÊN:
- Sau MỖI câu trả lời của ứng viên, phải PHÂN TÍCH nội dung họ vừa nói trước.
- Câu hỏi TIẾP THEO phải XOAY QUANH điều ứng viên vừa đề cập — không nhảy sang chủ đề khác nếu chưa khai thác hết.
- Nếu ứng viên nói về một dự án/công việc/kỹ năng, hỏi SÂU vào dự án/công việc/kỹ năng đó trước.
- Chỉ CHUYỂN CHỦ ĐỀ khi đã hỏi đủ sâu (tối đa 1 follow-up) hoặc ứng viên trả lời quá tốt/rõ ràng.
- TUYỆT ĐỐI KHÔNG hỏi lộn xộn, nhảy từ chủ đề A → B → C không liên quan. Mỗi câu hỏi phải là sợi dây kết nối từ câu trả lời trước.
- Ví dụ ĐÚNG: Ứng viên nói về dự án Dental Clinic → hỏi tiếp về role của họ trong dự án đó → hỏi về công nghệ dùng trong dự án đó → hỏi về kết quả dự án đó.
- Ví dụ SAI: Ứng viên nói về dự án Dental Clinic → AI nhảy sang hỏi về kỹ năng SQL (không liên quan gì).

WORKFLOW PHỎNG VẤN (6 CHẶNG — thực hiện TUẦN TỰ, KHÔNG nhảy cóc):

CHẶNG 1 — ICE-BREAKING (Khởi động, ~1-2 câu hỏi)
- Chào đón ấm áp, giới thiệu ngắn về buổi phỏng vấn.
- Yêu cầu ứng viên giới thiệu bản thân ngắn gọn (1-2 phút), nhấn mạnh điều gì KHÔNG có trong CV.
- Mục đích: giảm căng thẳng, đánh giá sơ bộ kỹ năng giao tiếp, độ tự tin.

CHẶNG 2 — CV DEEP DIVE (Xác thực CV, 2-4 câu hỏi)
- "Nhặt" thông tin từ CV và câu giới thiệu để hỏi sâu.
- Với sinh viên: tập trung đồ án, project học tập, thực tập, hoạt động ngoại khóa.
- Với người chuyển việc: tập trung thành tích có số liệu, lý do nghỉ việc, kỹ năng chuyển đổi.

CHẶNG 3 — COMPETENCY ASSESSMENT (Năng lực & Hành vi — STAR, 2-3 câu hỏi)
- Dùng mô hình STAR (Situation-Task-Action-Result) để khai thác trải nghiệm thực tế.
- Nếu câu trả lời thiếu một phần, hỏi tiếp đúng phần còn thiếu.

CHẶNG 4 — SITUATIONAL & TECHNICAL THEO NGÀNH (1-3 câu hỏi)
- Đặt 1-2 tình huống giả định gắn với vị trí ứng tuyển.
- Nếu CV có kỹ năng/công nghệ cụ thể, hỏi sâu kiến thức nền.

CHẶNG 5 — CULTURE FIT & MOTIVATION (1-2 câu hỏi)
- Kiểm tra động lực, mức độ tìm hiểu công ty, phong cách làm việc, cam kết lâu dài.

CHẶNG 6 — SALARY, AVAILABILITY & CLOSING (1-2 câu hỏi)
- Hỏi mức lương kỳ vọng và thời gian có thể bắt đầu.
- Mời ứng viên đặt câu hỏi ngược lại.
- Thông báo kết thúc và chuyển sang báo cáo đánh giá.

BỘ QUY TẮC "VẶN LẠI" (PROBING RULES):
Chỉ vặn lại khi có dấu hiệu:
- Trả lời chung chung → hỏi "bằng cách nào cụ thể?"
- Thiếu STAR (thiếu Result) → hỏi "kết quả cuối cùng thế nào?"
- Trả lời bề mặt về kỹ thuật → hỏi "giải thích sâu hơn / cho ví dụ?"
- Mâu thuẫn CV vs câu trả lời → yêu cầu làm rõ
- Tối đa 1 lần vặn lại cho mỗi câu hỏi gốc, rồi chuyển tiếp.

HỆ THỐNG CHẤM ĐIỂM (nội bộ, chỉ hiện ở báo cáo cuối):
- Nội dung trả lời (50%): độ liên quan, cấu trúc, độ sâu, tư duy giải quyết vấn đề
- Độ khớp với CV (25%): nhất quán, bổ sung chi tiết, không phóng đại
- Phong cách trình bày & tốc độ nói (25%): tốc độ (lý tưởng 110-150 wpm), độ trôi chảy, độ dài phù hợp
- Điểm tổng = trung bình tất cả câu hỏi chính (thang 10)

BÁO CÁO TỔNG KẾT CUỐI BUỔI (chỉ hiện SAU khi Chặng 6 kết thúc):

📊 BÁO CÁO TỔNG KẾT PHỎNG VẤN

Điểm tổng: X/10

1. Nội dung trả lời: X/10
   - Điểm mạnh: ...
   - Điểm cần cải thiện: ...

2. Độ khớp với CV: X/10
   - Nhận xét: ...

3. Phong cách trình bày & tốc độ nói: X/10
   - Nhận xét: ...

4. Top 3 câu hỏi em trả lời tốt nhất: ...
5. Top 2-3 câu hỏi cần luyện lại: ... (gợi ý cách trả lời tốt hơn)
6. Gợi ý luyện tập tiếp theo: ...

Giữ tông góp ý xây dựng, khích lệ. Nếu là sinh viên mới ra trường, nhấn mạnh hướng phát triển. Nếu là người chuyển việc, nhấn mạnh cách kết nối kinh nghiệm cũ với vai trò mới.

LUẬT BẮT BUỘC:
- Mỗi lượt hỏi CHỈ 1-2 câu. Không liệt kê nhiều câu hỏi.
- Phản ứng tự nhiên trước khi hỏi tiếp: "Ok, vậy thì...", "Thú vị đấy, cho ${xungHo} hỏi thêm...", "Cảm ơn em..."
- KHÔNG hiển thị nhãn nội bộ ([HR], [Follow-up], [Score]...).
- KHÔNG nhắc đến việc đang chấm điểm.
- CHỜ ứng viên nói xong tự nhiên, không ngắt lời. Chỉ phản hồi sau 3-5 giây im lặng.
- Luôn trả lời bằng tiếng Việt.
- Ứng viên có thể xen các thuật ngữ tiếng Anh như Java, React, SQL, Jira, API, BA hoặc tên riêng. Hãy hiểu đúng ngữ cảnh của các từ này, không suy diễn chúng thành một ngôn ngữ khác.

${personaTone}
Remember: Bạn là HR thật, không phải máy đọc CV. Hãy phỏng vấn như một người thật — linh hoạt, biết lắng nghe, và biết khi nào nên chờ đợi.`;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function getAudioInputDevices() {
  let devices = await navigator.mediaDevices.enumerateDevices();
  let audioInputs = devices.filter((device) => device.kind === "audioinput");

  if (audioInputs.some((device) => device.label)) {
    return audioInputs;
  }

  const permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  permissionStream.getTracks().forEach((track) => track.stop());

  devices = await navigator.mediaDevices.enumerateDevices();
  audioInputs = devices.filter((device) => device.kind === "audioinput");
  return audioInputs;
}

async function getPreferredMicConstraints() {
  const audioInputs = await getAudioInputDevices();
  const bluetoothMic = audioInputs.find((device) => {
    const label = device.label.toLowerCase();
    return BLUETOOTH_MIC_KEYWORDS.some((keyword) => label.includes(keyword));
  });

  if (!bluetoothMic?.deviceId) {
    console.log("Using default computer microphone");
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);

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
  const currentAITextRef = useRef("");
  const currentUserTextRef = useRef("");
  const userTurnCommittedRef = useRef(false);
  const aiResponseStartedRef = useRef(false);
  const userTranscriptCommitTimerRef = useRef<number | null>(null);
  const aiTextEndTimerRef = useRef<number | null>(null);

  const appendTranscriptChunk = (current: string, incoming: string) => {
    const next = incoming.trim();
    if (!next) return current;
    if (!current) return next;
    if (next.startsWith(current)) return next;
    if (current.startsWith(next)) return current;
    return `${current} ${next}`.replace(/\s+/g, " ").trim();
  };

  const commitUserTranscript = () => {
    if (userTranscriptCommitTimerRef.current) {
      clearTimeout(userTranscriptCommitTimerRef.current);
      userTranscriptCommitTimerRef.current = null;
    }
    const transcript = currentUserTextRef.current.trim();
    if (!transcript || userTurnCommittedRef.current) return;

    onMessage?.(transcript, "user");
    onTranscript?.("", true);
    currentUserTextRef.current = "";
    userTurnCommittedRef.current = true;
  };

  const queueUserTranscriptCommit = () => {
    if (!currentUserTextRef.current.trim() || userTurnCommittedRef.current) return;
    if (userTranscriptCommitTimerRef.current) {
      clearTimeout(userTranscriptCommitTimerRef.current);
    }
    userTranscriptCommitTimerRef.current = window.setTimeout(() => {
      userTranscriptCommitTimerRef.current = null;
      commitUserTranscript();
    }, 900);
  };

  // Audio metrics tracking
  const audioMetricsRef = useRef({
    volumeSum: 0,
    volumeCount: 0,
    speechStartTime: 0,
    wordCount: 0,
    currentTranscript: "",
    silenceStartTime: 0,
    pauseCount: 0,
    pauseDurations: [] as number[],
    isSpeaking: false,
  });

  useEffect(() => {
    cvDataRef.current = cvData ?? "";
  }, [cvData]);

  useEffect(() => {
    candidateNameRef.current = candidateName ?? "";
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
    if (userTranscriptCommitTimerRef.current) {
      clearTimeout(userTranscriptCommitTimerRef.current);
      userTranscriptCommitTimerRef.current = null;
    }
    currentAITextRef.current = "";
    currentUserTextRef.current = "";
    userTurnCommittedRef.current = false;
    aiResponseStartedRef.current = false;
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

  const connect = useCallback(
    async (cvDataOverride?: string, candidateNameOverride?: string) => {
      try {
        if (!apiKey) {
          throw new Error("Missing VITE_GEMINI_API_KEY");
        }

        disconnect();
        console.log("Connecting to Gemini Live API...");

        const cvText = cvDataOverride ?? cvDataRef.current ?? "";
        const resolvedCandidateName = candidateNameOverride ?? candidateNameRef.current ?? "";

        const ctx = await audioContext({ sampleRate: 24000 });
        audioContextRef.current = ctx;

        const streamer = new AudioStreamer(ctx);
        audioStreamerRef.current = streamer;

        // Wire up completion callback — primary signal for when audio playback finishes
        streamer.onComplete = () => {
          aiResponseStartedRef.current = false;
          setIsAISpeaking(false);
          setIsProcessing(false);
          if (audioEndTimerRef.current) {
            clearTimeout(audioEndTimerRef.current);
            audioEndTimerRef.current = null;
          }
        };

        const client = new GenAILiveClient({ apiKey });
        clientRef.current = client;

        // Gemini can mark small audio/transcript segments as finished while it
        // is still composing the same reply.  Only flush when the whole turn
        // completes so one AI reply becomes one history message.
        const flushAssistantTranscript = () => {
          if (aiTextEndTimerRef.current) {
            clearTimeout(aiTextEndTimerRef.current);
            aiTextEndTimerRef.current = null;
          }
          const toEmit = currentAITextRef.current.trim();
          currentAITextRef.current = "";
          if (toEmit) onMessage?.(toEmit, "assistant");
          onPartialMessage?.("");
        };

        client.on("open", () => {
          console.log("Gemini Live connection opened");
          setIsConnected(true);
        });

        client.on("close", (event: CloseEvent) => {
          console.log("Gemini Live connection closed - code:", event.code, "reason:", event.reason);
          if (clientRef.current === client) {
            stopListening();
            clientRef.current = null;
            setIsAISpeaking(false);
            setIsProcessing(false);
            setIsConnected(false);
          }
        });

        client.on("error", (error) => {
          console.error("Gemini Live error:", error);
          onError?.(new Error(error.message || "Gemini Live error"));
        });

        client.on("interrupted", () => {
          audioStreamerRef.current?.stop();
          setIsAISpeaking(false);
          setIsProcessing(false);
          if (audioEndTimerRef.current) {
            clearTimeout(audioEndTimerRef.current);
            audioEndTimerRef.current = null;
          }
        });

        client.on("inputtranscription", (text, finished) => {
          if (userTurnCommittedRef.current) {
            if (finished) {
              userTurnCommittedRef.current = false;
              return;
            }
            userTurnCommittedRef.current = false;
            aiResponseStartedRef.current = false;
          }
          const transcript = appendTranscriptChunk(currentUserTextRef.current, text);
          currentUserTextRef.current = transcript;
          if (!finished) {
            onTranscript?.(transcript, false);
            if (aiResponseStartedRef.current) queueUserTranscriptCommit();
            setIsUserSpeaking(true); // user đang nói
          }
          // Gửi user speech như message khi hoàn tất
          if (finished && transcript) {
            setIsUserSpeaking(false); // user nói xong
            setIsProcessing(true);   // AI bắt đầu xử lí
            const metrics = audioMetricsRef.current;
            metrics.currentTranscript = transcript;
            // Tính wordCount thực tế từ transcript
            metrics.wordCount = transcript.split(/\s+/).length;
            // Tính speechRate từ thời gian nói thực tế + wordCount thực
            const speakingDuration = (Date.now() - metrics.speechStartTime) / 1000;
            const speechRate =
              speakingDuration > 0 ? (metrics.wordCount / speakingDuration) * 60 : 0;
            // Gửi metrics
            onAudioMetrics?.({
              volume:
                metrics.volumeCount > 0 ? Math.round(metrics.volumeSum / metrics.volumeCount) : 0,
              speechRate: Math.round(speechRate),
              pauseCount: metrics.pauseCount,
              avgPauseDuration:
                metrics.pauseDurations.length > 0
                  ? Math.round(
                      metrics.pauseDurations.reduce((a, b) => a + b, 0) /
                        metrics.pauseDurations.length,
                    )
                  : 0,
              pitchVariation: 50,
              confidence:
                speechRate > 0
                  ? speechRate > 180 || speechRate < 80
                    ? "medium"
                    : "high"
                  : "medium",
            });
            // Reset all per-turn metrics so the NEXT turn starts fresh
            metrics.speechStartTime = 0;
            metrics.wordCount = 0;
            metrics.currentTranscript = "";
            metrics.volumeSum = 0;
            metrics.volumeCount = 0;
            metrics.pauseCount = 0;
            metrics.pauseDurations = [];
            metrics.isSpeaking = false;
            // Persist the user turn before Gemini can emit its next answer.
            // This keeps the transcript order strictly AI → user → AI.
            commitUserTranscript();
          }
          if (finished) onTranscript?.("", true);
        });

        const personaGender = personaGenderRef.current;
        const isMale = personaGender === "male";
        const xuNgoai = isMale ? '"anh"' : '"chị"';
        const vaiTro = isMale ? "nam" : "nữ";

        client.on("setupcomplete", () => {
          console.log("Gemini Live setup complete, sending interview kickoff");
          client.send([
            {
              text: `Bắt đầu buổi phỏng vấn thử ngay bây giờ.

VAI TRÒ VÀ XƯNG HÔ:
- Bạn là người phỏng vấn ${vaiTro}, xưng ${xuNgoai}, gọi ứng viên là "em" xuyên suốt toàn bộ buổi phỏng vấn.
- KHÔNG BAO GIỜ xưng "tôi", "mình", hay gọi ứng viên là "bạn" hoặc ${isMale ? '"chị"' : '"anh/chị"'}.
- Ví dụ đúng: "${isMale ? "Anh" : "Chị"} là JobReady AI...", "Em có thể giới thiệu...", "${isMale ? "Anh" : "Chị"} muốn hỏi em về..."
- Giữ xưng hô nhất quán từ đầu đến cuối.

QUAN TRỌNG: Luôn trả lời bằng tiếng Việt, bất kể ứng viên nói ngôn ngữ gì. Ứng viên có thể dùng xen kẽ thuật ngữ tiếng Anh hoặc tên công nghệ; hãy hiểu đúng ngữ cảnh của chúng.

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

Bắt đầu tự nhiên như một buổi phỏng vấn thật sự.

NHẮC LẠI QUY TẮC QUAN TRỌNG NHẤT (áp dụng cho toàn bộ buổi phỏng vấn):
- Sau mỗi câu trả lời của ứng viên, chị PHẢI quyết định:
  "Câu này yếu/thú vị/mâu thuẫn/tốt?" → TỪ ĐÓ mới quyết định hỏi gì tiếp
- KHÔNG bao giờ đọc xuống CV item tiếp theo một cách máy móc
- Cuộc phỏng vấn phải cảm giác như conversation thật, không phải checklist
- Nếu ứng viên đề cập đến thứ gì đó cụ thể và thú vị → THEO ĐÓ, không bỏ qua
- Câu trả lời yếu/vague → hỏi 1 follow-up đào sâu. Đủ rồi mới chuyển chủ đề.
- Không bao giờ hỏi nhiều hơn 1 câu trong 1 lượt nói.`,
            },
          ]);
        });

        client.on("audio", (data) => {
          aiResponseStartedRef.current = true;
          queueUserTranscriptCommit();
          audioStreamerRef.current?.addPCM16(new Uint8Array(data));
          setIsProcessing(false);
          setIsUserSpeaking(false);
          setIsAISpeaking(true);
          // Reset the end timer whenever new audio comes in
          if (audioEndTimerRef.current) {
            clearTimeout(audioEndTimerRef.current);
          }
          // Fallback only — streamer.onComplete is the primary signal
          audioEndTimerRef.current = window.setTimeout(() => {
            setIsAISpeaking(false);
            setIsProcessing(false);
            audioEndTimerRef.current = null;
          }, 60000);
        });

        client.on("content", (_content) => {
          // Audio model: text comes via outputtranscription, not modelTurn parts
          // No-op: keep handler registered to avoid EventEmitter warnings
        });

        client.on("outputtranscription", (text, finished) => {
          if (text) {
            currentAITextRef.current += text;
            // Emit partial update immediately for streaming display
            onPartialMessage?.(currentAITextRef.current);
          }
          // `finished` means a transcription segment, not necessarily the
          // end of the model turn. `turncomplete` below is the authoritative
          // boundary. Keep a long fallback only for a disconnected event.
          if (aiTextEndTimerRef.current) clearTimeout(aiTextEndTimerRef.current);
          aiTextEndTimerRef.current = window.setTimeout(() => {
            flushAssistantTranscript();
          }, finished ? 8000 : 12000);
        });

        client.on("turncomplete", () => {
          audioStreamerRef.current?.complete();
          flushAssistantTranscript();
          // isAISpeaking stays true — audioEndTimer will handle it at 2500ms after last audio
        });

        const connected = await client.connect(LIVE_MODEL, {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          // The server owns turn detection. Do not let a brief breath or a
          // natural pause end an answer: require a full two seconds of silence.
          realtimeInputConfig: {
            automaticActivityDetection: {
              endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_LOW,
              silenceDurationMs: 2000,
              prefixPaddingMs: 300,
            },
          },
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: personaRef.current?.voiceName ?? "Aoede",
              },
            },
          },
          systemInstruction: {
            parts: [
              {
                text: buildSystemInstruction(
                  cvText,
                  resolvedCandidateName,
                  personaRef.current?.systemPromptOverride,
                  personaGenderRef.current,
                  personaRef.current?.id,
                ),
              },
            ],
          },
        });

        if (!connected) {
          throw new Error("Failed to connect to Gemini Live");
        }

        await streamer.resume();
      } catch (error) {
        console.error("Failed to connect to Gemini Live:", error);
        onError?.(error as Error);
        setIsConnected(false);
      }
    },
    [apiKey, disconnect, onError, onMessage],
  );

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
        console.warn("Preferred microphone unavailable, falling back to default mic:", error);
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
            // Browser auto gain is already enabled. Extra amplification here
            // clipped headset audio and made speech recognition less accurate.
            this.GAIN = 1.15;
            this.audioBuffer = new Int16Array(1024);
            this.bufferWriteIndex = 0;
            
            // Audio metrics tracking - separate from transmission
            this.SILENCE_THRESHOLD = 0.01;
            this.NOISE_FLOOR_THRESHOLD = 3;
            this.SILENCE_DURATION = 2000; // 2000ms = pause detection threshold (ms)
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
              if (!this.isSpeaking) {
                // Speech started (either after silence, or as the very first speech of the session)
                this.port.postMessage({ type: "speechStart" });
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

      const blob = new Blob([workletCode], { type: "application/javascript" });
      const url = URL.createObjectURL(blob);
      await ctx.audioWorklet.addModule(url);
      URL.revokeObjectURL(url);

      const worklet = new AudioWorkletNode(ctx, "audio-processor");
      audioWorkletRef.current = worklet;

      worklet.port.onmessage = (event) => {
        const data = event.data;

        // Handle audio metrics tracking
        if (data.type === "volume") {
          const metrics = audioMetricsRef.current;
          metrics.volumeSum += data.value;
          metrics.volumeCount++;
        }
        // FIX 3: Send turn-complete signal when user finishes speaking (pause detected)
        else if (data.type === "pause") {
          const metrics = audioMetricsRef.current;
          metrics.pauseCount++;
          metrics.pauseDurations.push(data.duration);

          // Note: full metrics (including speechRate) are sent from inputtranscription(finished=true)
          // after ASR provides the actual wordCount. This pause handler only tracks pauseCount.
          console.log("🎤 Pause detected - pauseCount:", metrics.pauseCount);
        } else if (data.type === "speechStart") {
          const metrics = audioMetricsRef.current;
          if (metrics.speechStartTime === 0) {
            metrics.speechStartTime = Date.now();
          }
          metrics.isSpeaking = true;
          // wordCount is set from inputtranscription when speech ends — not estimated here
        }

        // FIX 1 & 2: Handle audio data transmission
        // Audio data is sent unconditionally from worklet
        // Convert to base64 and send to Gemini Live API
        if (data.audio && clientRef.current) {
          // Skip if connection is no longer open (prevents "CLOSING/CLOSED" error spam)
          const wsReady = clientRef.current.status === "connected";
          if (!wsReady) return;
          const audioBase64 = arrayBufferToBase64(data.audio);
          console.log("📨 Sending audio chunk to Gemini:", audioBase64.length, "bytes");
          clientRef.current.sendRealtimeInput([
            {
              mimeType: "audio/pcm;rate=16000",
              data: audioBase64,
            },
          ]);
        }
      };

      source.connect(worklet);
      isListeningRef.current = true;
      setIsListening(true);
    } catch (error) {
      console.error("Failed to start microphone:", error);
      onError?.(error as Error);
      isListeningRef.current = false;
      setIsListening(false);
    }
  }, [onError]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !clientRef.current || !isConnected) {
        return;
      }

      clientRef.current.send([{ text: trimmed }], true);
      onMessage?.(trimmed, "user");
    },
    [isConnected, onMessage],
  );

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

    navigator.mediaDevices?.addEventListener?.("devicechange", handleDeviceChange);
    return () => {
      navigator.mediaDevices?.removeEventListener?.("devicechange", handleDeviceChange);
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
    isProcessing,
    isUserSpeaking,
    connect,
    disconnect,
    startListening,
    stopListening,
    sendMessage,
    setSpeakerEnabled,
  };
}
