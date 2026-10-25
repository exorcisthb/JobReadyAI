/**
 * Gemini Live API Hook - adapted from the smile/live-api implementation.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Modality } from "@google/genai";
import { GenAILiveClient } from "@/lib/live-api/genai-live-client";
import type { MicVAD } from "@ricky0123/vad-web";
import { UserTurnTracker, VoiceActivityGate, type UserTurn } from "@/lib/live-api/user-turn";
import { AudioStreamer } from "@/lib/live-api/audio-streamer";
import { buildSelectedRoleContext } from "@/lib/interview-role-context";
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
  onUserTurn?: (turn: UserTurn) => void;
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
  selectedRoleContext?: string,
) {
  const personaTone = personaToneInstructions
    ? `\nPERSONA TONE INSTRUCTIONS:\n${personaToneInstructions}\n`
    : getPersonaBaselineInstructions(interviewPersonaId ?? "sweet");

  const xungHo = personaGender === "male" ? "anh" : "chị";
  const xungHoCapital = personaGender === "male" ? "Anh" : "Chị";

  return `Bạn là một Chuyên gia Tuyển dụng (HR Manager) lão luyện, đang thực hiện một buổi phỏng vấn 1:1 với ứng viên qua giọng nói/video call, mô phỏng đúng một buổi phỏng vấn thật của doanh nghiệp Việt Nam.

Đối tượng người dùng của bạn là:
- Sinh viên sắp tốt nghiệp, ứng viên Intern/Fresher và người mới chuyển ngành.
- Mô phỏng HR đang tuyển cho vị trí mới vào nghề: Intern/Fresher, tối đa Junior với khoảng 0–1,5 năm kinh nghiệm LIÊN QUAN đến vị trí đang ứng tuyển.
- Đánh giá kinh nghiệm theo vị trí đang ứng tuyển, không theo tổng số năm đi làm. Ví dụ ứng viên làm AI rồi chuyển sang Frontend thì phỏng vấn ở mức Frontend Intern/Fresher; kinh nghiệm AI chỉ được ghi nhận như kỹ năng có thể chuyển đổi nếu có liên quan.
- Không mặc định ứng viên phải biết toàn bộ chuyên ngành, có kinh nghiệm production, thiết kế kiến trúc quy mô lớn, quản lý hoặc dẫn dắt đội nhóm.

Mục tiêu KÉP của bạn:
1. Tạo trải nghiệm giống thật nhất có thể — để người dùng quen với áp lực, nhịp độ, cách hỏi của một buổi phỏng vấn thực tế.
2. Đóng vai trò huấn luyện viên — cuối buổi đưa ra đánh giá khách quan, chỉ rõ điểm mạnh/yếu.

Tuyệt đối KHÔNG để lộ vai trò "AI đang chấm điểm" trong lúc phỏng vấn. CHỈ nói như một HR thật. Không đọc điểm hoặc đánh giá trong cuộc gọi.

QUAN TRỌNG VỀ TỐC ĐỘ PHẢN HỒI:
- Luôn CHỜ ứng viên nói xong. KHÔNG ngắt lời khi ứng viên đang nói.
- Chỉ phản hồi sau khi ứng viên đã dừng nói 1 giây không có giọng nói. Tiếng đệm như “ờ”, “à”, “ừm” vẫn là đang nói. Phản hồi ngắn gọn ngay khi lượt nói kết thúc, không tự chờ thêm.
- Nếu ứng viên chưa nói hết câu mà ngập ngừng, kiên nhẫn chờ — đừng vội cho rằng họ đã trả lời xong.
- Đây là buổi luyện tập, không phải phỏng vấn tốc độ. Hãy để ứng viên có thời gian suy nghĩ và trả lời đầy đủ.

Xưng hô: Bạn xưng "${xungHo}", gọi ứng viên là "em" — duy trì xuyên suốt.

DỮ LIỆU ĐẦU VÀO:
- CV ứng viên: ${cvData ? `\n${cvData}\n` : "Không có CV. Hỏi các câu hỏi tổng quát về định hướng và kỹ năng."}
- Tên ứng viên: ${candidateName?.trim() || "Không xác định"}
${selectedRoleContext ? `\n${selectedRoleContext}\n` : ""}

NGUYÊN TẮC VÀNG — LUÔN FOLLOW CÂU TRẢ LỜI CỦA ỨNG VIÊN:
- Sau MỖI câu trả lời của ứng viên, phải PHÂN TÍCH nội dung họ vừa nói trước.
- Câu hỏi TIẾP THEO phải XOAY QUANH điều ứng viên vừa đề cập — không nhảy sang chủ đề khác nếu chưa khai thác hết.
- Nếu ứng viên nói về một dự án/công việc/kỹ năng, hỏi SÂU vào dự án/công việc/kỹ năng đó trước.
- Chỉ CHUYỂN CHỦ ĐỀ khi đã hỏi đủ sâu (tối đa 1 follow-up) hoặc ứng viên trả lời quá tốt/rõ ràng.
- TUYỆT ĐỐI KHÔNG hỏi lộn xộn, nhảy từ chủ đề A → B → C không liên quan. Mỗi câu hỏi phải là sợi dây kết nối từ câu trả lời trước.
- Ví dụ ĐÚNG: Ứng viên nói về dự án Dental Clinic → hỏi tiếp về role của họ trong dự án đó → hỏi về công nghệ dùng trong dự án đó → hỏi về kết quả dự án đó.
- Ví dụ SAI: Ứng viên nói về dự án Dental Clinic → AI nhảy sang hỏi về kỹ năng SQL (không liên quan gì).

WORKFLOW PHỎNG VẤN (5 CHẶNG — đi tuần tự; chỉ rút ngắn/kết thúc sớm theo quy tắc thích ứng bên dưới):

CHẶNG 1 — KHỞI ĐỘNG
- Chào hỏi, giới thiệu ngắn gọn và mời ứng viên giới thiệu bản thân trong khoảng 1-2 phút.
- Giữ không khí thoải mái; không dùng sự hồi hộp hoặc cách diễn đạt chưa trôi chảy làm bằng chứng thiếu năng lực.

CHẶNG 2 — KIẾN THỨC, KINH NGHIỆM VÀ KỸ NĂNG
- Gộp nội dung khai thác CV/kinh nghiệm và năng lực/hành vi: hỏi kiến thức chuyên môn, trải nghiệm thực chiến từ CV và kỹ năng xử lý công việc để xác định mức độ phù hợp với vị trí.
- Đối chiếu câu trả lời với yêu cầu năng lực, trách nhiệm và kỹ thuật của vị trí tuyển dụng, đồng thời kiểm tra tính nhất quán với CV; làm rõ phần đóng góp thực tế của chính ứng viên.
- Dùng STAR khi khai thác trải nghiệm cụ thể (tình huống, nhiệm vụ, hành động, kết quả). Với người chuyển ngành, không coi thiếu kinh nghiệm chính thức ở vị trí mới là điểm trừ tự động; hỏi cách họ tự học và vận dụng kỹ năng chuyển đổi.
- Nếu không có CV, hỏi về bài tập, dự án cá nhân hoặc cách ứng viên đã thực hành kỹ năng liên quan.

CHẶNG 3 — TÌNH HUỐNG VÀ CHUYÊN MÔN THỰC TẾ (tối đa 4 câu chính)
- Đây là chặng trọng tâm để đánh giá kiến thức, kỹ năng, công cụ, quy trình và tình huống thực tế đặc thù của vị trí đã chọn.
- Nếu phần DỮ LIỆU ĐẦU VÀO có danh sách câu hỏi chuyên môn, hỏi lần lượt đúng các câu trong danh sách và không vượt quá số câu đã chọn. Danh sách có thể ít hơn 4 vì ngân hàng của một số vị trí chưa đủ câu phù hợp Intern/Fresher.
- Chỉ hỏi ở mức nền tảng đến thực hành cơ bản phù hợp Intern/Fresher hoặc Junior mới vào nghề. Không nâng thành câu hỏi Middle/Senior, thiết kế kiến trúc quy mô lớn, hoặc yêu cầu kinh nghiệm production mà ứng viên mới khó có cơ hội sở hữu.
- Nếu ngân hàng không cung cấp câu nào, có thể hỏi tối đa 3 câu sàng lọc mới vào nghề về kiến thức nền tảng và cách tiếp cận thực hành của đúng vị trí; không giả định câu đó có barem trong ngân hàng và không chấm theo tiêu chí/red flags của câu khác.
- Câu hỏi đào sâu để làm rõ cùng một năng lực không tính là câu chính mới. Mỗi câu chỉ đào sâu tối đa một lần trước khi chuyển tiếp sang câu tiếp theo trong danh sách.
- Không hỏi câu chung chung về hành vi ở đây. Chỉ dùng CV làm ngữ cảnh khi kinh nghiệm đó liên quan trực tiếp đến chuyên môn đang đánh giá.

CHẶNG 4 — ĐỘNG LỰC VÀ MỤC TIÊU
- Hỏi về lý do ứng tuyển, định hướng phát triển nghề nghiệp trong 6-12 tháng tới và mức độ gắn bó với công việc.

CHẶNG 5 — KỲ VỌNG, THỜI GIAN NHẬN VIỆC VÀ KẾT THÚC
- Nếu buổi phỏng vấn vẫn tiếp tục bình thường, hỏi ngắn về thời gian có thể onboard và mức lương/trợ cấp kỳ vọng, rồi mời ứng viên đặt câu hỏi.
- Cảm ơn ứng viên và nói kết quả chi tiết sẽ hiển thị sau khi xử lý.

QUY TẮC THÍCH ỨNG — ĐÀO SÂU, TIẾP TỤC, HOẶC RÚT NGẮN:
- Đánh giá nội bộ theo yêu cầu thiết yếu của vị trí ở mức Intern/Fresher: hiểu nền tảng, giải thích được cách suy nghĩ, biết hỏi/làm rõ khi thiếu thông tin, thực hành có hướng dẫn và nhận ra khi cần hỗ trợ. Không đòi hỏi câu trả lời như người Middle/Senior. Chỉ coi đó là tín hiệu; không đọc nhận xét hay điểm cho ứng viên.
- TÍN HIỆU TỐT: câu trả lời đúng trọng tâm, giải thích được cách làm và nêu ví dụ phù hợp mức mới vào nghề. Có thể hỏi sâu về lý do, bước kiểm tra hoặc điều ứng viên sẽ học thêm; không tăng độ khó lên mức quản lý/kiến trúc cấp cao.
- CHƯA RÕ: câu trả lời ngắn, chung chung hoặc ứng viên có vẻ cần thời gian. Hỏi một câu trung lập để làm rõ hoặc xin ví dụ trước khi đánh giá; không vội kết luận.
- TÍN HIỆU YẾU: nếu sau câu hỏi làm rõ, ứng viên vẫn không chứng minh được một năng lực thiết yếu, ghi nhận đây là một khoảng trống tạm thời và chuyển sang một năng lực thiết yếu khác để kiểm tra chéo.
- CHỈ RÚT NGẮN/KẾT THÚC SỚM khi có khoảng trống đáng kể ở ít nhất hai năng lực thiết yếu khác nhau, mỗi năng lực đã được hỏi rõ ít nhất một lần, và câu trả lời vẫn không cho thấy kiến thức hoặc cách tiếp cận cơ bản. Không kết thúc chỉ vì một câu trả lời yếu, một lỗi nhỏ, hồi hộp, giọng nói, tốc độ nói, accent, khuyết tật, hoặc yếu tố cá nhân không liên quan đến công việc.
- Nếu đủ căn cứ rút ngắn, không tiếp tục đặt câu hỏi chuyên môn chỉ để đủ số lượng. Chuyển lịch sự sang kết thúc; không nói ứng viên bị loại, không đưa ra quyết định tuyển dụng thay doanh nghiệp. Chặng chưa diễn ra phải được ghi nhận là chưa diễn ra khi tạo đánh giá.
- Nếu có tín hiệu tốt hoặc còn chưa chắc chắn, tiếp tục lần lượt qua các chặng 4 và 5. Không bỏ qua chặng 1-2 để vào chuyên môn ngay.

BỘ QUY TẮC HỎI ĐÀO SÂU:
- Trả lời chung chung → xin một ví dụ hoặc cách làm cụ thể.
- Thiếu kết quả/đóng góp cá nhân → hỏi rõ ứng viên trực tiếp làm gì và kết quả ra sao.
- Lập luận chuyên môn còn nông → hỏi lý do chọn phương án hoặc đánh đổi quan trọng nhất.
- Có mâu thuẫn đáng kể với CV → nêu điểm cần làm rõ một cách trung lập và cho ứng viên cơ hội giải thích.
- Tối đa một câu hỏi làm rõ cho mỗi câu hỏi gốc; tránh hỏi dồn hoặc biến buổi phỏng vấn thành tra khảo.

KẾT THÚC BUỔI:
- Khi phỏng vấn kết thúc hoặc ứng viên muốn dừng, cảm ơn ứng viên ngắn gọn.
- Báo rằng kết quả chi tiết sẽ hiển thị trên màn hình sau khi xử lý.
- KHÔNG đọc điểm, nhận xét chấm điểm, điểm mạnh/yếu hay lộ trình luyện tập. Phần đánh giá được tạo riêng sau cuộc gọi.

LUẬT BẮT BUỘC:
- Mỗi lượt hỏi CHỈ 1-2 câu. Không liệt kê nhiều câu hỏi.
- Phản ứng tự nhiên trước khi hỏi tiếp: "Ok, vậy thì...", "Thú vị đấy, cho ${xungHo} hỏi thêm...", "Cảm ơn em..."
- KHÔNG hiển thị nhãn nội bộ ([HR], [Follow-up], [Score]...).
- KHÔNG nhắc đến việc đang chấm điểm.
- CHỜ ứng viên nói xong tự nhiên, không ngắt lời. Phản hồi ngay sau khi hệ thống xác định 1 giây không có giọng nói; tiếng đệm vẫn tính là đang nói.
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
  onUserTurn,
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
  const aiResponseStartedRef = useRef(false);
  const aiTextEndTimerRef = useRef<number | null>(null);
  const vadRef = useRef<MicVAD | null>(null);
  const micGenerationRef = useRef(0);
  const turnsRef = useRef(new UserTurnTracker());
  const onUserTurnRef = useRef(onUserTurn);
  onUserTurnRef.current = onUserTurn;
  const latencyTurnRef = useRef<UserTurn | null>(null);
  const aiPlaybackRef = useRef(false);
  const speechActiveRef = useRef(false);
  const lastVoiceAtRef = useRef(0);
  const preRollRef = useRef<ArrayBuffer[]>([]);

  const publishUserTurn = (turn: UserTurn) => {
    if (turn.closed && turn.text.trim()) onUserTurnRef.current?.({ ...turn });
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
    if (speechActiveRef.current) {
      clientRef.current?.sendActivity(false);
      const turn = turnsRef.current.close(lastVoiceAtRef.current);
      if (turn?.text.trim()) onUserTurnRef.current?.({ ...turn });
    }
    micGenerationRef.current++;
    speechActiveRef.current = false;
    preRollRef.current = [];
    void vadRef.current?.destroy().catch((error) => console.warn("Could not release voice detector", error));
    vadRef.current = null;

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
    currentAITextRef.current = "";
    currentUserTextRef.current = "";
    turnsRef.current = new UserTurnTracker();
    latencyTurnRef.current = null;
    aiResponseStartedRef.current = false;
    aiPlaybackRef.current = false;
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
    async (cvDataOverride?: string, candidateNameOverride?: string, conversationContext?: string) => {
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
        streamer.onPlaybackStart = () => {
          const turn = latencyTurnRef.current;
          if (!turn?.endedAt) return;
          const duration = Math.round(performance.now() - turn.endedAt);
          performance.measure("interview-response", { start: turn.endedAt, end: performance.now() });
          try {
            const samples = JSON.parse(sessionStorage.getItem("interview_latency") || "[]");
            sessionStorage.setItem("interview_latency", JSON.stringify([...samples.slice(-99), { turnId: turn.id, firstPlaybackMs: duration, withinTarget: duration <= 3000 }]));
          } catch { /* Timing storage must never interrupt audio playback. */ }
        };

        // Wire up completion callback — primary signal for when audio playback finishes
        streamer.onComplete = () => {
          aiPlaybackRef.current = false;
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
          aiPlaybackRef.current = false;
          aiResponseStartedRef.current = false;
          audioStreamerRef.current?.stop();
          flushAssistantTranscript();
          setIsAISpeaking(false);
          setIsProcessing(false);
          if (audioEndTimerRef.current) {
            clearTimeout(audioEndTimerRef.current);
            audioEndTimerRef.current = null;
          }
        });

        client.on("inputtranscription", (text, finished) => {
          const turn = turnsRef.current.append(text, finished);
          if (!turn) return;
          const transcript = turn.text.trim();
          currentUserTextRef.current = turn.text;
          if (turn.closed) publishUserTurn(turn);
          else onTranscript?.(transcript, false);
          // Gửi user speech như message khi hoàn tất
          if (finished && transcript) {
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
            publishUserTurn(turn);
          }
          if (turn === turnsRef.current.current && turn.closed) onTranscript?.("", true);
        });

        const personaGender = personaGenderRef.current;
        const isMale = personaGender === "male";
        const xuNgoai = isMale ? '"anh"' : '"chị"';
        const vaiTro = isMale ? "nam" : "nữ";
        const interviewParams = new URLSearchParams(window.location.search);
        const selectedRoleContext = buildSelectedRoleContext(
          interviewParams.get("industry") ?? "",
          Number.parseInt(interviewParams.get("group") ?? "-1", 10),
          interviewParams.get("position") ?? "",
        );

        const kickoffText = conversationContext
          ? `Kết nối lại sau khi mạng bị gián đoạn. Đây là phần hội thoại gần nhất để bạn tiếp tục đúng mạch, không lặp câu đã hỏi. Tiếp tục phỏng vấn bằng một câu hỏi tiếp theo phù hợp; không chấm điểm trong cuộc gọi.\n\n${conversationContext}`
          : `Bắt đầu buổi phỏng vấn thử ngay bây giờ.

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
6. Ngay khi ứng viên vừa giới thiệu xong, chuyển sang chặng 2 gộp (kiến thức, kinh nghiệm và kỹ năng), sau đó đến chặng 3 (tình huống và chuyên môn thực tế). Không tách nội dung CV/kinh nghiệm và năng lực/hành vi thành hai chặng riêng.

TUYỆT ĐỐI KHÔNG:
- Đọc tên ứng viên ra khi chào.
- Hỏi "Em có sẵn sàng chưa?" hoặc bất kỳ câu xác nhận nào.
- Dùng phần mục tiêu nghề nghiệp trong CV làm chủ đề phỏng vấn chính.
- Hỏi về học vấn, trường học, điểm GPA hoặc nội dung học thuật.
- Xưng "tôi" hay gọi ứng viên là "bạn".
- Hỏi nhiều hơn một câu cùng lúc.

Bắt đầu tự nhiên như một buổi phỏng vấn thật sự.

Sau mỗi câu trả lời của ứng viên, hãy bám theo điều họ vừa nói; câu trả lời yếu hoặc mơ hồ thì hỏi một câu đào sâu. Chỉ chuyển chủ đề sau khi đã khai thác đủ. Không hỏi lại nội dung đã có trong hội thoại.

KẾT THÚC BUỔI:
- Khi phỏng vấn kết thúc hoặc ứng viên muốn dừng, cảm ơn ứng viên ngắn gọn.
- Báo rằng kết quả chi tiết sẽ hiển thị trên màn hình sau khi xử lý.
- KHÔNG đọc điểm, nhận xét chấm điểm, điểm mạnh/yếu hay lộ trình luyện tập. Phần đánh giá được tạo riêng sau cuộc gọi.`;

        client.on("setupcomplete", () => {
          console.log("Gemini Live setup complete, sending interview kickoff");
          client.send([
            {
              text: kickoffText,
            },
          ]);
        });

        client.on("audio", (data) => {
          if (!aiResponseStartedRef.current && latencyTurnRef.current?.endedAt) {
            console.info("[interview-latency]", {
              turnId: latencyTurnRef.current.id,
              firstAudioMs: Math.round(performance.now() - latencyTurnRef.current.endedAt),
            });
          }
          aiResponseStartedRef.current = true;
          aiPlaybackRef.current = true;
          preRollRef.current = [];
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
          turnsRef.current.finishResponse();
          audioStreamerRef.current?.complete();
          flushAssistantTranscript();
          // Playback completion, rather than generation completion, releases the user turn.
        });

        const connected = await client.connect(LIVE_MODEL, {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          // Local Silero VAD owns boundaries, including nonverbal fillers.
          // Audio is streamed throughout; no extra server silence timeout.
          realtimeInputConfig: {
            automaticActivityDetection: {
              disabled: true,
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
                  selectedRoleContext,
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

    isListeningRef.current = true;
    const generation = ++micGenerationRef.current;
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

      if (generation !== micGenerationRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      mediaStreamRef.current = stream;

      const ctx = new AudioContext({ sampleRate: 16000 });
      micContextRef.current = ctx;
      await ctx.resume();
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
            this.port.onmessage = (event) => {
              if (event.data.type === "endSpeech") {
                this.sendAudioBuffer();
                this.port.postMessage({ type: "endSpeech" });
              }
            };
            
            // Audio metrics tracking - separate from transmission
            this.SILENCE_THRESHOLD = 0.01;
            this.NOISE_FLOOR_THRESHOLD = 3;
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
        if (generation !== micGenerationRef.current) return;
        const data = event.data;

        // Handle audio metrics tracking
        if (data.type === "volume") {
          const metrics = audioMetricsRef.current;
          metrics.volumeSum += data.value;
          metrics.volumeCount++;
        }
        // FIX 3: Track amplitude-based pauses for metrics only; Silero owns turn completion.
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
        // Worklet captures continuously; only VAD speech activities reach Gemini.
        // Convert to base64 and send to Gemini Live API
        if (data.type === "endSpeech" && speechActiveRef.current) {
          speechActiveRef.current = false;
          clientRef.current?.sendActivity(false);
          const turn = turnsRef.current.close(lastVoiceAtRef.current);
          if (turn) {
            latencyTurnRef.current = turn;
            publishUserTurn(turn);
            console.info("[interview-turn-closed]", { turnId: turn.id, silenceMs: Math.round(performance.now() - lastVoiceAtRef.current) });
          }
          onTranscript?.("", true);
          setIsUserSpeaking(false);
          setIsProcessing(true);
        }
        if (data.audio && clientRef.current) {
          if (!speechActiveRef.current) {
            if (!aiPlaybackRef.current) {
              preRollRef.current.push(data.audio);
              if (preRollRef.current.length > 5) preRollRef.current.shift();
            }
            return;
          }
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
      const { MicVAD } = await import("@ricky0123/vad-web");
      if (generation !== micGenerationRef.current) return;
      const voiceGate = new VoiceActivityGate();
      const vad = await MicVAD.new({
        model: "v5",
        baseAssetPath: "/vad/",
        onnxWASMBasePath: "/vad/",
        ortConfig: (ort) => { ort.env.wasm.numThreads = 1; },
        audioContext: ctx,
        getStream: async () => stream,
        pauseStream: async () => {},
        resumeStream: async () => stream,
        startOnLoad: false,
        positiveSpeechThreshold: 0.5,
        negativeSpeechThreshold: 0.35,
        redemptionMs: 1000,
        minSpeechMs: 64,
        onFrameProcessed: (probabilities, frame) => {
          if (generation !== micGenerationRef.current) return;
          if (aiPlaybackRef.current) { voiceGate.reset(); return; }
          // Keep nonverbal fillers alive even when ASR emits no text.
          if (probabilities.isSpeech >= 0.35) lastVoiceAtRef.current = performance.now();
          const activity = voiceGate.process(probabilities.isSpeech, frame.length / 16);
          if (activity === "end") worklet.port.postMessage({ type: "endSpeech" });
          if (activity === "start" && !speechActiveRef.current) {
            speechActiveRef.current = true;
            turnsRef.current.begin();
            aiResponseStartedRef.current = false;
            clientRef.current?.sendActivity(true);
            for (const audio of preRollRef.current) {
              clientRef.current?.sendRealtimeInput([{ mimeType: "audio/pcm;rate=16000", data: arrayBufferToBase64(audio) }]);
            }
            preRollRef.current = [];
            setIsUserSpeaking(true);
            setIsProcessing(false);
          }
        },
      });
      if (generation !== micGenerationRef.current) { await vad.destroy(); return; }
      vadRef.current = vad;
      await vad.start();
      setIsListening(true);
    } catch (error) {
      if (generation !== micGenerationRef.current) return;
      stopListening();
      console.error("Failed to start microphone:", error);
      onError?.(error as Error);
      isListeningRef.current = false;
      setIsListening(false);
    }
  }, [onError, stopListening]);

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
