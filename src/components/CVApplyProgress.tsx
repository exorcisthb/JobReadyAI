import { AlertCircle, ArrowDown, Check } from "lucide-react";

type CVApplyProgressProps = {
  progress: number;
  status: "applying" | "success" | "error";
  title: string;
  description: string;
};

const CIRCUMFERENCE = 2 * Math.PI * 48;

export function CVApplyProgress({ progress, status, title, description }: CVApplyProgressProps) {
  const safeProgress = Math.min(100, Math.max(0, progress));
  const isComplete = status === "success";
  const isError = status === "error";
  const strokeColor = isError ? "#ef4444" : "#8b5cf6";

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      aria-label={title}
    >
      <section className="relative w-full max-w-sm overflow-hidden rounded-[32px] border border-purple-50/60 bg-white px-8 py-8 text-center shadow-[0_20px_40px_-10px_rgba(124,58,237,0.08),0_10px_25px_-5px_rgba(0,0,0,0.04)] animate-in fade-in zoom-in-95">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-indigo-200/40 blur-3xl" />

        <h2 className="relative z-10 mb-6 text-sm font-extrabold text-slate-800">{title}</h2>

        <div className="relative z-10 mx-auto flex h-36 w-36 items-center justify-center">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 120 120" aria-hidden="true">
            <circle cx="60" cy="60" r="48" fill="none" stroke="#ebdcfc" strokeWidth="7" />
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke={strokeColor}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE - (safeProgress / 100) * CIRCUMFERENCE}
              style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 80ms linear, stroke 200ms ease" }}
            />
          </svg>

          <div className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg transition-colors duration-200 ${isError ? "bg-red-500 shadow-red-500/30" : "bg-purple-600 shadow-purple-600/30"}`}>
            <ArrowDown className={`absolute h-7 w-7 transition-all duration-300 ${isComplete || isError ? "scale-50 -rotate-45 opacity-0" : "scale-100 rotate-0 opacity-100"}`} />
            <Check className={`absolute h-7 w-7 transition-all duration-300 ${isComplete ? "scale-100 rotate-0 opacity-100" : "scale-50 rotate-[-45deg] opacity-0"}`} />
            <AlertCircle className={`absolute h-7 w-7 transition-all duration-300 ${isError ? "scale-100 rotate-0 opacity-100" : "scale-50 rotate-[-45deg] opacity-0"}`} />
          </div>
        </div>

        <div className="relative z-10 mt-5">
          <span
            className={`inline-block min-w-[56px] rounded-full px-4 py-1.5 text-xs font-extrabold text-white shadow-md transition-transform duration-200 ${isError ? "bg-red-500 shadow-red-500/20" : "bg-purple-600 shadow-purple-600/20"} ${isComplete ? "scale-110" : "scale-100"}`}
          >
            {Math.round(safeProgress)}%
          </span>
        </div>

        <p className="relative z-10 mt-5 text-sm text-slate-600">{description}</p>
      </section>
    </div>
  );
}
