import { BrandLogo } from "@/components/BrandLogo";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/components/auth-provider";

import { useOnboarding } from "@/hooks/useOnboarding";
import { OnboardingTour } from "@/components/OnboardingTour";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { linhImg, huongImg, minhImg, logoImg } from "@/components/PersonaAvatars";

interface Persona {
  id: "sweet" | "tough" | "mentor";
  name: string;
  subtitle: string;
  description: string;
  voiceName: string;
  gender: "female" | "male";
  systemPromptOverride: string;
  theme: "pink" | "blue" | "green";
  img: string;
}

const PERSONAS: Persona[] = [
  {
    id: "sweet",
    name: i18n.t("interview.persona.linh.name"),
    subtitle: i18n.t("interview.persona.linh.subtitle"),
    description: i18n.t("interview.persona.linh.desc"),
    voiceName: "Aoede",
    gender: "female",
    theme: "pink",
    img: linhImg,
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
    name: i18n.t("interview.persona.huong.name"),
    subtitle: i18n.t("interview.persona.huong.subtitle"),
    description: i18n.t("interview.persona.huong.desc"),
    voiceName: "Kore",
    gender: "female",
    theme: "blue",
    img: huongImg,
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
    name: i18n.t("interview.persona.minh.name"),
    subtitle: i18n.t("interview.persona.minh.subtitle"),
    description: i18n.t("interview.persona.minh.desc"),
    voiceName: "Charon",
    gender: "male",
    theme: "green",
    img: minhImg,
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

const THEME_BG: Record<string, string> = {
  pink:  "radial-gradient(circle at 50% 30%, #f45090 0%, #a11350 55%, #4d0524 100%)",
  blue:  "radial-gradient(circle at 50% 30%, #4b7bff 0%, #17389c 55%, #0d1e56 100%)",
  green: "radial-gradient(circle at 50% 30%, #30d175 0%, #0d6b35 55%, #043819 100%)",
};
const THEME_GLOW: Record<string, string> = {
  pink:  "rgba(244,80,144,0.55)",
  blue:  "rgba(75,123,255,0.55)",
  green: "rgba(48,209,117,0.55)",
};
const THEME_SPOTLIGHT: Record<string, string> = {
  pink:  "rgba(255,180,220,0.45)",
  blue:  "rgba(160,200,255,0.45)",
  green: "rgba(160,255,200,0.45)",
};

function mod(n: number, m: number) { return ((n % m) + m) % m; }

export default function InterviewPersonaSelectPage() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { isTourActive, activeStepType, advanceTour, skipTour, currentStep } = useOnboarding(
    user?.id || "anonymous"
  );

  const [centerIdx, setCenterIdx] = useState(0);
  const [animKey, setAnimKey]     = useState(0);
  const [infoFade, setInfoFade]   = useState(false);
  const [dispIdx, setDispIdx]     = useState(0);
  const busy = useRef(false);
  const N = PERSONAS.length;

  const go = useCallback((dir: 1 | -1) => {
    if (busy.current) return;
    busy.current = true;
    const next = mod(centerIdx + dir, N);
    setCenterIdx(next);
    setAnimKey(k => k + 1);
    setInfoFade(true);
    setTimeout(() => { setDispIdx(next); setInfoFade(false); busy.current = false; }, 210);
  }, [centerIdx, N]);

  const jumpTo = useCallback((idx: number) => {
    if (busy.current || idx === centerIdx) return;
    busy.current = true;
    setCenterIdx(idx);
    setAnimKey(k => k + 1);
    setInfoFade(true);
    setTimeout(() => { setDispIdx(idx); setInfoFade(false); busy.current = false; }, 210);
  }, [centerIdx]);

  // Keyboard nav
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "ArrowRight") go(1); else if (e.key === "ArrowLeft") go(-1); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [go]);

  const handleStart = (persona: Persona) => {
    sessionStorage.setItem("interview_persona", JSON.stringify({
      id: persona.id, gender: persona.gender,
      voiceName: persona.voiceName, systemPromptOverride: persona.systemPromptOverride,
    }));
    window.location.assign(`/interview/session?${new URLSearchParams(window.location.search)}`);
  };

  const handleLogout = () => { logout(); window.location.assign("/"); };

  const center = PERSONAS[centerIdx];
  const left   = PERSONAS[mod(centerIdx - 1, N)];
  const right  = PERSONAS[mod(centerIdx + 1, N)];
  const disp   = PERSONAS[dispIdx];

  return (
    <div style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {isTourActive && activeStepType === "persona_select" && currentStep === 3 && (
        <OnboardingTour userId={user?.id || "anonymous"} currentStep="persona_select" onAdvance={advanceTour} onSkip={skipTour} />
      )}

      {/* Full-screen stage */}
      <div
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          background: THEME_BG[center.theme],
          transition: "background 0.75s cubic-bezier(0.25,1,0.5,1)",
          height: "100vh",
        }}
      >
        {/* ── TOP BAR ── */}
        <div style={{ position: "absolute", top: 20, left: 32, right: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start", zIndex: 20 }}>
          {/* Logo — top left with sparkles animation & role dashboard navigation */}
          <BrandLogo size={36} />
          {/* Back to CV — top right */}
          <button onClick={() => window.location.assign("/cv")}
            style={{
              background: "rgba(251,191,36,0.08)",
              border: "1.5px solid rgba(251,191,36,0.55)",
              borderRadius: 24,
              cursor: "pointer",
              color: "#fbbf24",
              fontSize: 11,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 5,
              letterSpacing: 0.5,
              padding: "7px 16px",
              backdropFilter: "blur(10px)",
              transition: "all 0.22s ease",
              boxShadow: "0 0 12px rgba(251,191,36,0.15)",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(251,191,36,0.20)";
              el.style.borderColor = "#fbbf24";
              el.style.color = "#fef3c7";
              el.style.boxShadow = "0 0 20px rgba(251,191,36,0.35)";
              el.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "rgba(251,191,36,0.08)";
              el.style.borderColor = "rgba(251,191,36,0.55)";
              el.style.color = "#fbbf24";
              el.style.boxShadow = "0 0 12px rgba(251,191,36,0.15)";
              el.style.transform = "translateY(0)";
            }}
          >
            <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            {t("interview.personaSelect.backToCV")}
          </button>
        </div>

        {/* ── CENTERED TITLE ── */}
        <div style={{ position: "absolute", top: 82, left: 0, right: 0, textAlign: "center", zIndex: 15, pointerEvents: "none" }}>
          <div style={{
            fontSize: 14, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase",
            color: "#fbbf24", marginBottom: 6,
            textShadow: "0 0 20px rgba(251,191,36,0.5), 0 2px 4px rgba(0,0,0,0.4)",
          }}>
            {t("interview.personaSelect.subtitle")}
          </div>
          <div style={{
            fontSize: 32, fontWeight: 900, letterSpacing: 1,
            color: "#f59e0b",
            textShadow: "0 0 30px rgba(245,158,11,0.6), 0 2px 8px rgba(0,0,0,0.5)",
          }}>
            {t("interview.personaSelect.title")}
          </div>
        </div>

        {/* ── SPOTLIGHT ── */}
        <div style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", pointerEvents: "none", zIndex: 2,
          width: "45%", height: 180,
          background: `radial-gradient(ellipse at center, ${THEME_SPOTLIGHT[center.theme]} 0%, transparent 70%)`,
          transition: "background 0.7s ease",
        }} />
        {/* Floor shadow */}
        <div style={{
          position: "absolute", bottom: 68, left: "50%", transform: "translateX(-50%)", pointerEvents: "none", zIndex: 2,
          width: 360, height: 32,
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 75%)",
        }} />

        {/* ── CHARACTERS ROW (Flexbox — guaranteed center) ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "center",   /* center everything */
            gap: 0,
            zIndex: 4,
            paddingBottom: 90,
          }}
        >
          {/* LEFT: nudged inward toward center */}
          <div
            key={`L-${animKey}`}
            onClick={() => go(-1)}
            style={{
              width: "20%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              paddingRight: "0%",
              cursor: "pointer",
              animation: "sideIn 0.42s ease-out both",
              zIndex: 3,
              position: "relative",
              left: 90,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <img src={left.img} alt={left.name} draggable={false}
                style={{
                  height: "clamp(240px, 48vh, 520px)",
                  width: "auto", objectFit: "contain",
                  opacity: 0.65, filter: "brightness(0.65) blur(0.4px) drop-shadow(0 18px 22px rgba(0,0,0,0.4))",
                  transform: "rotateY(12deg)",
                  transformOrigin: "bottom center",
                  transition: "all 0.65s cubic-bezier(0.34,1.45,0.64,1)",
                  userSelect: "none",
                }}
              />
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginTop: 4 }}>
                {left.name}
              </div>
            </div>
          </div>

          {/* CENTER: takes 60% — character is perfectly centered */}
          <div
            key={`C-${animKey}`}
            style={{
              width: "60%",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
              zIndex: 10,
              animation: "popIn 0.52s cubic-bezier(0.34,1.56,0.64,1) both",
            }}
          >
            <img src={center.img} alt={center.name} draggable={false}
              style={{
                height: "clamp(360px, 72vh, 780px)",
                width: "auto", objectFit: "contain",
                filter: `drop-shadow(0 30px 40px rgba(0,0,0,0.55)) drop-shadow(0 0 60px ${THEME_GLOW[center.theme]})`,
                userSelect: "none",
              }}
            />
          </div>

          {/* RIGHT: nudged inward toward center */}
          <div
            key={`R-${animKey}`}
            onClick={() => go(1)}
            style={{
              width: "20%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-end",
              paddingLeft: "0%",
              cursor: "pointer",
              animation: "sideIn 0.42s ease-out both",
              zIndex: 3,
              position: "relative",
              right: 90,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <img src={right.img} alt={right.name} draggable={false}
                style={{
                  height: "clamp(240px, 48vh, 520px)",
                  width: "auto", objectFit: "contain",
                  opacity: 0.65, filter: "brightness(0.65) blur(0.4px) drop-shadow(0 18px 22px rgba(0,0,0,0.4))",
                  transform: "rotateY(-12deg)",
                  transformOrigin: "bottom center",
                  transition: "all 0.65s cubic-bezier(0.34,1.45,0.64,1)",
                  userSelect: "none",
                }}
              />
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginTop: 4 }}>
                {right.name}
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM INFO BAR ── */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 40px 24px" }}>
          {/* Info + nav buttons */}
          <div style={{ maxWidth: 360 }}>
            <div style={{ opacity: infoFade ? 0 : 1, transform: infoFade ? "translateY(8px)" : "translateY(0)", transition: "opacity 0.2s ease, transform 0.2s ease" }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 3 }}>
                {disp.subtitle}
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, color: "#fff", marginBottom: 8 }}>
                {disp.name}
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.82)", marginBottom: 18, maxWidth: 300 }}>
                {disp.description}
              </div>
            </div>
            {/* Prev / Next */}
            <div style={{ display: "flex", gap: 10 }}>
              {([-1, 1] as const).map((dir) => (
                <button key={dir} onClick={() => go(dir)} aria-label={dir === -1 ? "Trước" : "Sau"}
                  style={{
                    width: 44, height: 44, borderRadius: "50%", cursor: "pointer",
                    border: "1.5px solid rgba(255,255,255,0.38)", background: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.35)"; (e.currentTarget as HTMLElement).style.borderColor = "#fff"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.38)"; }}
                >
                  <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    {dir === -1 ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Start button — right side */}
          <div style={{ paddingBottom: 4 }}>
            <button
              onClick={() => handleStart(PERSONAS[centerIdx])}
              data-onboarding="persona-card"
              style={{
                padding: "13px 30px", borderRadius: 30, cursor: "pointer",
                background: "rgba(251,191,36,0.12)",
                border: "1.5px solid rgba(251,191,36,0.65)",
                color: "#fbbf24",
                fontSize: 11, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase",
                backdropFilter: "blur(12px)", transition: "all 0.28s ease",
                boxShadow: "0 0 18px rgba(251,191,36,0.20)",
                textShadow: "0 0 12px rgba(251,191,36,0.5)",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "#fbbf24";
                el.style.color = "#1a0a00";
                el.style.borderColor = "#fbbf24";
                el.style.boxShadow = "0 0 32px rgba(251,191,36,0.55), 0 4px 16px rgba(0,0,0,0.3)";
                el.style.textShadow = "none";
                el.style.transform = "translateY(-3px) scale(1.02)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(251,191,36,0.12)";
                el.style.color = "#fbbf24";
                el.style.borderColor = "rgba(251,191,36,0.65)";
                el.style.boxShadow = "0 0 18px rgba(251,191,36,0.20)";
                el.style.textShadow = "0 0 12px rgba(251,191,36,0.5)";
                el.style.transform = "translateY(0) scale(1)";
              }}
            >
              {t("interview.personaSelect.start")} →
            </button>
          </div>
        </div>

        {/* Keyframe animations */}
        <style>{`
          @keyframes floatY {
            0%   { transform: translateY(0px); }
            100% { transform: translateY(-20px); }
          }
          @keyframes popIn {
            0%   { opacity: 0; transform: scale(0.4); filter: blur(12px) brightness(0.3); }
            55%  { opacity: 1; transform: scale(1.06); filter: blur(0px) brightness(1.2); }
            100% { opacity: 1; transform: scale(1); filter: blur(0px) brightness(1); }
          }
          @keyframes sideIn {
            0%   { opacity: 0; filter: blur(6px); }
            100% { opacity: 1; filter: blur(0px); }
          }
        `}</style>
      </div>
    </div>
  );
}
