import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Bot, CheckCircle2 } from "lucide-react";
import {
  SweetLinhAvatar,
  ToughHuongAvatar,
  MentorMinhAvatar,
} from "@/components/PersonaAvatars";

interface Persona {
  id: "sweet" | "tough" | "mentor";
  name: string;
  subtitle: string;
  description: string;
  voiceName: string;
  emoji: string;
  color: string;
  badge: string;
  badgeColor: string;
  gender: "female" | "male";
  systemPromptOverride: string;
  avatar: React.ComponentType;
}

const PERSONAS: Persona[] = [
  {
    id: "sweet",
    name: "Chị Linh Dịu Dàng",
    subtitle: "Chuyên viên Tuyển dụng (HR Recruiter)",
    description:
      "Ấm áp, kiên nhẫn, luôn khuyến khích. Phù hợp để luyện tập phỏng vấn sơ loại (screening interview), giúp bạn làm quen và tự tin hơn.",
    voiceName: "Aoede",
    emoji: "🌸",
    color: "from-pink-500/20 to-rose-500/10",
    badge: "⭐ Dễ",
    badgeColor: "bg-green-500/20 text-green-400 border-green-500/30",
    gender: "female",
    avatar: SweetLinhAvatar,
    systemPromptOverride: `PERSONA TONE:
- You are a warm, encouraging, and patient HR Recruiter. Speak softly and warmly.
- When the candidate struggles, gently guide them with supportive phrases.
- Use nurturing language: "Em làm tốt lắm", "Không sao, thử lại nhé".
- Your tone is like a caring senior HR colleague helping a junior.
- Keep energy positive and never intimidating.
- Always refer to yourself as "chị" and the candidate as "em".
- NEVER use "tôi", "mình", "bạn", or "anh" for yourself.`,
  },
  {
    id: "tough",
    name: "Bà Hương Khó Tính",
    subtitle: "Trưởng phòng Nhân sự cấp cao (HR Manager)",
    description:
      "Nghiêm khắc, đòi hỏi cao, không chấp nhận câu trả lời mơ hồ. Phù hợp để rèn luyện kỹ năng đàm phán và xử lý câu hỏi hóc búa.",
    voiceName: "Kore",
    emoji: "💼",
    color: "from-slate-500/20 to-gray-700/10",
    badge: "⭐⭐⭐ Khó",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/30",
    gender: "female",
    avatar: ToughHuongAvatar,
    systemPromptOverride: `PERSONA TONE:
- You are a strict, demanding, and uncompromising HR Manager. Your tone is direct and firm.
- You have zero patience for vague answers. Immediately challenge: "Cụ thể hơn được không?"
- Use terse, authoritative language. No encouragement during the interview.
- Interrupt if the candidate rambles: "Đủ rồi. Câu hỏi tiếp theo."
- Your expressions of displeasure are subtle but clear: "Hmm...", "Vậy thôi à?"
- Only soften slightly in the final evaluation report.
- Make the candidate feel real interview pressure.
- Always refer to yourself as "chị" and the candidate as "em".
- NEVER use "tôi", "mình", "bạn", or "anh" for yourself.`,
  },
  {
    id: "mentor",
    name: "Anh Minh Mentor",
    subtitle: "Trưởng nhóm Tuyển dụng Công nghệ (IT Recruiter)",
    description:
      "Chuyên sâu kỹ thuật dưới góc nhìn của chuyên gia nhân sự công nghệ. Hỏi đào sâu chi tiết dự án và giải quyết vấn đề.",
    voiceName: "Charon",
    emoji: "🧑‍💻",
    color: "from-blue-500/20 to-indigo-600/10",
    badge: "⭐⭐ Trung bình",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    gender: "male",
    avatar: MentorMinhAvatar,
    systemPromptOverride: `PERSONA TONE:
- You are a calm, methodical IT Recruiter. You think before speaking.
- You go deep on technical details, project architecture, and problem-solving skills.
- Always refer to yourself as "anh" and the candidate as "em".
- Ask probing follow-ups: "Tại sao chọn cách đó?", "Trade-off là gì?"
- You respect candidates who admit what they don't know honestly.
- Occasionally share brief insights like a real HR technical mentor would.
- Your tone is thoughtful, never rushed, always precise.
- NEVER use "tôi", "mình", "bạn", or "chị" for yourself.`,
  },
];

export default function InterviewPersonaSelectPage() {
  const { user } = useAuth();
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  const handleStartInterview = () => {
    if (!selectedPersona) return;

    sessionStorage.setItem(
      "interview_persona",
      JSON.stringify({
        id: selectedPersona.id,
        gender: selectedPersona.gender,
        voiceName: selectedPersona.voiceName,
        systemPromptOverride: selectedPersona.systemPromptOverride,
      })
    );

    const params = new URLSearchParams(window.location.search);
    window.location.assign(`/interview/session?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col justify-between">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 -z-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl -z-20 animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent-mint/5 blur-3xl -z-20 animate-pulse" style={{ animationDuration: '6s' }} />

      {/* Header */}
      <div className="relative z-10 px-6 pt-16 pb-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20 backdrop-blur-sm animate-fade-in">
          <Bot className="h-4 w-4" />
          <span>Người phỏng vấn AI (HR Team)</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
          Chọn người phỏng vấn của bạn
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto font-medium">
          Mỗi chuyên viên nhân sự (HR) có một phong thái và mức độ thử thách khác biệt. Hãy chọn người phù hợp để bắt đầu buổi phỏng vấn.
        </p>
      </div>

      {/* Persona Cards */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full flex-1 flex flex-col justify-center pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {PERSONAS.map((persona) => {
            const AvatarComponent = persona.avatar;
            const isSelected = selectedPersona?.id === persona.id;

            return (
              <button
                key={persona.id}
                onClick={() => setSelectedPersona(persona)}
                className={`
                  relative group text-left rounded-3xl border p-8 flex flex-col justify-between min-h-[500px] transition-all duration-500 ease-out cursor-pointer overflow-hidden
                  hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]
                  ${
                    isSelected
                      ? "border-primary bg-card/90 shadow-2xl shadow-primary/10 ring-1 ring-primary/20"
                      : "border-border/40 bg-card/30 backdrop-blur-md hover:border-primary/40 hover:bg-card/50"
                  }
                `}
              >
                {/* Glow Background Light */}
                <div
                  className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10
                    bg-gradient-to-br ${persona.color} blur-3xl
                  `}
                />

                {/* Selected Checkmark */}
                {isSelected && (
                  <div className="absolute top-4 right-4 h-7 w-7 rounded-full bg-primary flex items-center justify-center shadow-lg animate-scale-in">
                    <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}

                <div>
                  {/* Badge & Emoji Header */}
                  <div className="flex justify-between items-center w-full mb-6">
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${persona.badgeColor}`}
                    >
                      {persona.badge}
                    </div>
                    <span className="text-2xl select-none opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                      {persona.emoji}
                    </span>
                  </div>

                  {/* Avatar Box */}
                  <div className="relative w-full aspect-[4/3.2] flex items-end justify-center mb-6 overflow-hidden rounded-2xl bg-muted/15 border border-border/5 group-hover:border-primary/10 group-hover:bg-muted/20 transition-all duration-500">
                    <div className="w-[150px] h-[185px] z-10">
                      <AvatarComponent />
                    </div>
                  </div>
                </div>

                {/* Persona Text Details */}
                <div className="mt-auto">
                  <h3 className="font-extrabold text-2xl mb-1.5 group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                    {persona.name}
                  </h3>
                  <p className="text-sm font-semibold text-primary/80 mb-3 tracking-wide">
                    {persona.subtitle}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {persona.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Start Button */}
        <div className="mt-12 flex justify-center w-full">
          <Button
            size="lg"
            disabled={!selectedPersona}
            onClick={handleStartInterview}
            className={`
              px-10 py-7 text-lg font-bold rounded-2xl transition-all duration-300
              ${
                selectedPersona
                  ? "bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:scale-[1.03]"
                  : "bg-muted text-muted-foreground cursor-not-allowed border border-border/20"
              }
            `}
          >
            {selectedPersona ? (
              <div className="flex items-center gap-3">
                <span>Bắt đầu phỏng vấn với {selectedPersona.name}</span>
                <span className="text-2xl animate-bounce" style={{ animationDuration: '1.5s' }}>
                  {selectedPersona.emoji}
                </span>
              </div>
            ) : (
              "Chọn một người phỏng vấn để bắt đầu"
            )}
          </Button>
        </div>
      </div>

      {/* Styled Animations */}
      <style>{`
        @keyframes scale-in {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </main>
  );
}

