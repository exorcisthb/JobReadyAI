import { useEffect, useRef, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";

export interface ChiLinhPlayback {
  turn: number;
  playing: boolean;
  time: number;
  level: number;
  bufferedDuration: number;
  text: string;
}

interface ChiLinhAvatarProps {
  active: boolean;
  speaking: boolean;
  listening: boolean;
  getPlayback: () => ChiLinhPlayback | null;
}

const CHANNEL = "jobready.chilinh.v1";
const DEFAULT_MODEL_URL = "https://pub-f6001b97e5cc46cdaf48b42c033220e9.r2.dev/Model%20Linh/ChiLinh_Gesture_ArmFix_Final.glb";

/** Isolates the approved Three.js runtime from interview/auth/audio UI state. */
export function ChiLinhAvatar(props: ChiLinhAvatarProps) {
  const frame = useRef<HTMLIFrameElement>(null);
  const current = useRef(props);
  current.current = props;
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ready = false;
    const send = (message: Record<string, unknown>) => frame.current?.contentWindow?.postMessage({ channel: CHANNEL, ...message }, window.location.origin);
    const initialize = () => send({ type: "init", modelUrl: import.meta.env.VITE_CHILINH_MODEL_URL || DEFAULT_MODEL_URL });
    const update = () => {
      if (!ready) return;
      const state = current.current;
      send({ type: "state", state: {
        active: state.active,
        speaking: state.speaking,
        listening: state.listening,
        playback: state.active ? state.getPlayback() : null,
      } });
    };
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.current?.contentWindow || event.data?.channel !== CHANNEL) return;
      if (event.data.type === "boot") initialize();
      if (event.data.type === "progress") setProgress(typeof event.data.progress === "number" ? event.data.progress : null);
      if (event.data.type === "ready") { ready = true; setStatus("ready"); update(); }
      if (event.data.type === "error") { ready = false; setError(String(event.data.message || "Không tải được nhân vật 3D.")); setStatus("error"); }
    };
    window.addEventListener("message", receive);
    const onLoad = () => initialize();
    const iframe = frame.current;
    iframe?.addEventListener("load", onLoad);
    const timer = window.setInterval(update, 40);
    const timeout = window.setTimeout(() => {
      if (!ready) { setError("Tải nhân vật hơi lâu. Hãy kiểm tra kết nối rồi thử lại."); setStatus("error"); }
    }, 90000);
    return () => {
      window.removeEventListener("message", receive);
      iframe?.removeEventListener("load", onLoad);
      window.clearInterval(timer);
      window.clearTimeout(timeout);
      send({ type: "state", state: { active: false, speaking: false, playback: null } });
    };
  }, [attempt]);

  return (
    <div className="absolute inset-0" data-testid="chilinh-avatar" aria-busy={status === "loading"}>
      <iframe
        key={attempt}
        ref={frame}
        src={`${import.meta.env.BASE_URL}chilinh/stage.html`}
        title="Chị Linh 3D — phỏng vấn JobReady AI"
        className="h-full w-full border-0"
        tabIndex={-1}
      />
      {status === "loading" && (
        <div role="status" className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/75 text-muted-foreground">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <span className="text-sm">Đang tải Chị Linh{progress === null ? "…" : ` ${Math.round(progress * 100)}%`}</span>
        </div>
      )}
      {status === "error" && (
        <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/90 px-8 text-center">
          <p className="max-w-md text-sm text-muted-foreground">{error}</p>
          <button type="button" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-muted" onClick={() => { setStatus("loading"); setProgress(null); setAttempt(value => value + 1); }}>
            <RefreshCw className="h-4 w-4" /> Tải lại nhân vật
          </button>
        </div>
      )}
    </div>
  );
}
