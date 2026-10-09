import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BrandLogo } from "@/components/BrandLogo";
import { Loader2, ArrowLeft, RotateCcw } from "lucide-react";

type ScoreCriterion = { key: string; name: string; score: number | null; score_100: number | null; status?: string; comment: string; evidence: string };
type StageFeedback = { stage: number; stage_name: string; covered: boolean; score: number | null; comment: string };
type QuestionTracking = {
  role_verified: boolean;
  role: string;
  planned_questions: { id: string; category: string; question: string }[];
  asked_questions: { id: string; category: string; confidence: number; answered: boolean; question: string }[];
  unasked_questions: { id: string; category: string; question: string; reason?: string }[];
  unplanned_questions_detected: number;
};
type SessionResult = {
  id: string; status: string; cv_id: string; position: string | null; started_at: string;
  score_level?: string | null;
  total_score: number | null; interview_score: number | null; match_score: number | null; position_fit_score: number | null;
  criteria_scores: ScoreCriterion[] | string | null; stage_feedback: StageFeedback[] | string | null;
  question_tracking?: QuestionTracking | string | null;
  strengths: string[] | string | null; weaknesses: string[] | string | null;
  gaps?: string[] | string | null; transferable_skills?: string[] | string | null;
  suggested_position?: string | null;
  action_plan: { priority: number; action: string; why: string; how: string }[] | string | null;
  sample_improvements: { question: string; candidate_answer_summary: string; better_answer_hint: string }[] | string | null;
  overall_comment: string | null; feedback: string | null; conversation: { role: string; content: string; timestamp?: string }[] | string;
  avg_volume: number | null; pause_count: number | null; confidence_level: string | null; ended_reason: string | null;
};

function parseArray<T>(value: T[] | string | null | undefined): T[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
}

function MarkdownText({ text }: { text: string }) {
  const lines = text.split("\n");
  const inline = (line: string) => line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index} className="rounded bg-muted px-1">{part.slice(1, -1)}</code>;
    return part;
  });
  return <div className="space-y-2 whitespace-pre-wrap">{lines.map((line, index) => {
    if (/^#{1,3}\s/.test(line)) return <h4 key={index} className="font-semibold">{inline(line.replace(/^#{1,3}\s/, ""))}</h4>;
    if (/^[-*]\s/.test(line)) return <p key={index} className="pl-3">• {inline(line.slice(2))}</p>;
    return <p key={index}>{inline(line)}</p>;
  })}</div>;
}

function transcriptArray(value: SessionResult["conversation"]) {
  return parseArray<{ role: string; content: string }>(value);
}

export default function InterviewResultPage({ sessionId }: { sessionId: string }) {
  const { user } = useAuth();
  const [result, setResult] = useState<SessionResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [timedOut, setTimedOut] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const load = useCallback(async () => {
    if (!user?.id) return;
    const response = await fetch(`/api/interview/${sessionId}`, { headers: { "x-user-id": user.id, "x-user-role": user.role ?? "user" } });
    if (!response.ok) throw new Error("Không tải được kết quả phỏng vấn.");
    setResult(await response.json());
    setError("");
  }, [sessionId, user?.id, user?.role]);

  useEffect(() => {
    let alive = true;
    const started = Date.now();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = async () => {
      try {
        await load();
        if (!alive) return;
        setLoading(false);
        if (Date.now() - started >= 60_000) { setTimedOut(true); return; }
        timer = setTimeout(tick, 3000);
      } catch (e) {
        if (alive) { setError(e instanceof Error ? e.message : "Có lỗi khi tải kết quả."); setLoading(false); }
      }
    };
    void tick();
    return () => { alive = false; if (timer) clearTimeout(timer); };
  }, [load]);

  const retryEvaluation = async () => {
    setRetrying(true); setError("");
    try {
      const response = await fetch(`/api/interview/${sessionId}/re-evaluate`, {
        method: "POST", headers: { "x-user-id": user?.id ?? "", "x-user-role": user?.role ?? "user" },
      });
      if (!response.ok) throw new Error("Chưa thể chấm lại. Vui lòng thử lại sau.");
      setResult(await response.json());
      setTimedOut(false);
    } catch (e) { setError(e instanceof Error ? e.message : "Có lỗi khi chấm lại."); }
    finally { setRetrying(false); }
  };

  if (loading && !result) return <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-3 p-6"><Loader2 className="h-8 w-8 animate-spin text-primary"/><p>Đang tải kết quả...</p></main>;
  if (!result && error) return <main className="mx-auto max-w-3xl p-6"><Card className="p-8 text-center"><p role="alert">{error}</p><Button className="mt-4" onClick={() => { setLoading(true); void load().catch((e) => setError(e.message)).finally(() => setLoading(false)); }}>Thử lại</Button></Card></main>;
  if (!result) return null;

  const criteria = parseArray<ScoreCriterion>(result.criteria_scores);
  const stages = parseArray<StageFeedback>(result.stage_feedback);
  const strengths = parseArray<string>(result.strengths);
  const weaknesses = parseArray<string>(result.weaknesses);
  const gaps = parseArray<string>(result.gaps);
  const transferableSkills = parseArray<string>(result.transferable_skills);
  const actions = parseArray<SessionResult["action_plan"] extends (infer T)[] | string | null ? T : never>(result.action_plan);
  const examples = parseArray<NonNullable<SessionResult["sample_improvements"]> extends (infer T)[] | string ? T : never>(result.sample_improvements);
  const transcript = transcriptArray(result.conversation);
  const oldFeedback = result.feedback;
  const questionTracking: QuestionTracking | null = result.question_tracking
    ? (typeof result.question_tracking === "string" ? JSON.parse(result.question_tracking) : result.question_tracking)
    : null;
  const evaluatedCount = criteria.filter((c) => c.score_100 !== null).length;
  const retryInterview = () => {
    const params = new URLSearchParams({ cv_id: result.cv_id });
    if (result.position) params.set("position", result.position);
    window.location.assign(`/interview/persona?${params.toString()}`);
  };

  return <div className="min-h-screen bg-background">
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border/40 bg-background/90 px-4 backdrop-blur-md sm:px-6">
      <BrandLogo />
      <Button variant="outline" size="sm" onClick={() => window.location.assign(`/interview/setup?cv_id=${result?.cv_id ?? ""}`)} className="gap-2 rounded-xl">
        <ArrowLeft className="h-4 w-4" />
        <span>Chọn vị trí khác</span>
      </Button>
    </header>
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl space-y-5 p-4 pb-12 sm:p-8">
    <header className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm text-muted-foreground">{result.position || "Phỏng vấn thử"}</p><h1 className="text-2xl font-bold">Kết quả phỏng vấn</h1></div><Button variant="outline" onClick={() => window.location.assign("/interview/history")}><ArrowLeft className="mr-2 h-4 w-4"/>Lịch sử</Button></header>
    {error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
    {result.status === "evaluating" && <Card className="flex items-center gap-3 p-5" role="status"><Loader2 className="h-5 w-5 animate-spin"/><div><p className="font-semibold">Đang chấm điểm...</p>{timedOut && <p className="text-sm text-muted-foreground">Mất nhiều thời gian hơn dự kiến, bạn có thể xem lại sau trong Lịch sử.</p>}</div></Card>}
    {result.status === "evaluation_failed" && <Card className="space-y-3 p-5"><h2 className="font-semibold">Chưa thể tạo đánh giá</h2><p className="text-sm text-muted-foreground">Transcript đã được lưu. Bạn có thể yêu cầu chấm lại.</p><Button onClick={() => void retryEvaluation()} disabled={retrying}>{retrying && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Thử chấm lại</Button></Card>}
    {(result.status === "insufficient_data" || result.status === "abandoned") && <Card className="space-y-3 p-5"><h2 className="font-semibold">{result.status === "abandoned" ? "Phiên phỏng vấn chưa có câu trả lời" : "Chưa đủ dữ liệu để đánh giá"}</h2><p className="text-sm text-muted-foreground">{result.status === "abandoned" ? "Bạn có thể bắt đầu một phiên mới bất cứ lúc nào." : "Hãy tiếp tục phỏng vấn thêm để nhận đánh giá có căn cứ."}</p><Button onClick={retryInterview}><RotateCcw className="mr-2 h-4 w-4"/>Phỏng vấn lại</Button></Card>}
    {result.status === "completed" && <>
      {oldFeedback && <p className="w-fit rounded-full bg-muted px-3 py-1 text-xs">Phiên cũ</p>}
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <section className="grid items-start gap-4 sm:grid-cols-2">
          {result.match_score !== null && result.match_score !== undefined && <Card className="p-5 text-center"><p className="text-sm text-muted-foreground">Điểm khớp hồ sơ</p><strong className="text-3xl">{result.match_score}/100</strong></Card>}
          <Card className="p-5 text-center">
            <p className="text-sm text-muted-foreground">Điểm phỏng vấn</p>
            <strong className="text-3xl">{result.interview_score !== null ? `${result.interview_score}/100` : "Chưa đủ căn cứ"}</strong>
            {result.interview_score !== null && criteria.length > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">({evaluatedCount}/{criteria.length} tiêu chí đủ căn cứ)</p>
            )}
          </Card>
          <Card className="p-5 text-center">
            <p className="text-sm text-muted-foreground">Điểm tổng</p>
            <strong className="text-3xl text-primary">{result.total_score !== null ? `${result.total_score}/100` : "Chưa đủ căn cứ"}</strong>
            <p className="text-sm">{result.score_level || (result.total_score === null ? "Chưa đủ căn cứ đánh giá" : "")}</p>
          </Card>
          {result.overall_comment && <Card className="p-5"><h2 className="mb-3 font-semibold">Nhận xét tổng quan</h2><MarkdownText text={result.overall_comment}/></Card>}
          <Card className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Điểm theo tiêu chí</h2>
              <span className="text-xs text-muted-foreground">{evaluatedCount}/{criteria.length} tiêu chí đủ căn cứ</span>
            </div>
            {criteria.map((item) => (
              <div key={item.key} className="space-y-1">
                <div className="flex justify-between gap-3 text-sm">
                  <strong>{item.name}</strong>
                  <span>{item.score_100 !== null ? `${item.score_100}/100` : <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">Chưa đủ căn cứ</span>}</span>
                </div>
                {item.score_100 !== null ? (
                  <progress className="h-2 w-full accent-primary" max={100} value={item.score_100}/>
                ) : (
                  <div className="h-2 w-full rounded bg-muted/40"/>
                )}
                <MarkdownText text={item.comment}/>
                {item.evidence && <p className="border-l-2 pl-3 text-xs text-muted-foreground">Bằng chứng: “{item.evidence}”</p>}
              </div>
            ))}
          </Card>
          {questionTracking && (
            <Card className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Theo dõi câu hỏi chuyên môn</h2>
                <span className="text-xs text-muted-foreground">{questionTracking.role_verified ? "Đã đối chiếu ngân hàng" : "Chưa khớp ngân hàng vị trí"}</span>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-xs text-muted-foreground">
                  Đã hỏi & trả lời: {questionTracking.asked_questions.filter((q) => q.answered).length}/{questionTracking.planned_questions.length} câu kế hoạch
                  {questionTracking.unplanned_questions_detected > 0 && ` · ${questionTracking.unplanned_questions_detected} câu ngoài kế hoạch`}
                </p>
                {questionTracking.asked_questions.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-foreground">Câu hỏi đã diễn ra trong phiên:</p>
                    <ul className="space-y-1 pl-1">
                      {questionTracking.asked_questions.map((q) => (
                        <li key={q.id} className="flex items-start gap-2 text-xs">
                          <span className={`rounded px-1.5 py-0.5 font-mono ${q.answered ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}`}>
                            {q.id}
                          </span>
                          <span className="flex-1 text-muted-foreground">
                            {q.question} {q.answered ? "✓ (Đã trả lời)" : "⚠️ (Chưa có câu trả lời)"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {questionTracking.unasked_questions.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <p className="text-xs font-medium text-muted-foreground">Câu kế hoạch chưa diễn ra:</p>
                    <ul className="space-y-1 pl-1">
                      {questionTracking.unasked_questions.map((q) => (
                        <li key={q.id} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-muted-foreground">
                            {q.id}
                          </span>
                          <span className="flex-1">
                            {q.question} <em>(Không trừ điểm câu chưa được hỏi)</em>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}
          <Card className="p-5"><h2 className="mb-3 font-semibold">Điểm mạnh</h2><ul className="list-disc space-y-2 pl-5">{strengths.map((item, i) => <li key={i}><MarkdownText text={item}/></li>)}</ul></Card>
          <Card className="p-5"><h2 className="mb-3 font-semibold">Điểm cần cải thiện</h2><ul className="list-disc space-y-2 pl-5">{weaknesses.map((item, i) => <li key={i}><MarkdownText text={item}/></li>)}</ul></Card>
          <Card className="p-5"><h2 className="mb-3 font-semibold">Nhận xét theo từng chặng</h2><div className="space-y-3">{Array.from({ length: 6 }, (_, i) => stages.find((stage) => stage.stage === i + 1)).map((stage, i) => <div key={i} className="border-b pb-3 last:border-0"><div className="flex justify-between gap-3"><strong>{i + 1}. {stage?.stage_name || ["Khởi động", "CV và kinh nghiệm", "Năng lực và hành vi", "Tình huống và chuyên môn", "Động lực và phù hợp văn hóa", "Lương và kết thúc"][i]}</strong><span className="shrink-0 text-sm text-muted-foreground">{!stage?.covered ? "Chưa diễn ra" : stage.score ? `${stage.score}/5` : "Đã diễn ra"}</span></div>{stage?.covered && <MarkdownText text={stage.comment}/>}{!stage?.covered && <p className="text-xs italic text-muted-foreground">Chặng này chưa diễn ra trong phiên phỏng vấn (không tính điểm).</p>}</div>)}</div></Card>
          {examples.length > 0 && <Card className="space-y-3 p-5"><h2 className="font-semibold">Ví dụ cải thiện câu trả lời</h2>{examples.map((item: any, i) => <div key={i} className="space-y-1"><strong>{item.question}</strong><p className="text-sm text-muted-foreground">Câu trả lời: {item.candidate_answer_summary}</p><MarkdownText text={item.better_answer_hint}/></div>)}</Card>}
          <Card className="space-y-3 p-5"><h2 className="font-semibold">Lộ trình hành động</h2>{actions.map((item: any, i) => <div key={i} className="rounded-lg bg-muted/40 p-3"><strong>{i + 1}. {item.action}</strong><p className="mt-1 text-sm">Vì sao: {item.why}</p><p className="mt-1 text-sm text-muted-foreground">Cách làm: {item.how}</p></div>)}</Card>
          {(result.match_score !== null && result.match_score !== undefined) && <Card className="grid gap-4 p-5 sm:grid-cols-2"><div><h2 className="font-semibold">Kỹ năng còn thiếu</h2><ul className="mt-2 list-disc pl-5 text-sm">{gaps.map((item, i) => <li key={i}>{item}</li>)}</ul></div><div><h2 className="font-semibold">Kỹ năng chuyển giao</h2><ul className="mt-2 list-disc pl-5 text-sm">{transferableSkills.map((item, i) => <li key={i}>{item}</li>)}</ul></div><div className="sm:col-span-2"><h2 className="font-semibold">Vị trí khớp hơn</h2><p className="mt-2 text-sm">{result.suggested_position || "Chưa có gợi ý vị trí khác."}</p></div></Card>}
          <Card className="p-5"><h2 className="mb-2 font-semibold">Chỉ số giọng nói <span className="text-xs font-normal text-muted-foreground">(tham khảo)</span></h2><p className="text-sm">Âm lượng trung bình: {result.avg_volume ?? "—"} · Số lần ngắt quãng: {result.pause_count ?? "—"} · Độ tự tin: {result.confidence_level ?? "—"}</p></Card>
        </section>
        <Card className="p-5 lg:sticky lg:top-4 lg:flex lg:max-h-[calc(100vh-2rem)] lg:flex-col">
          <h2 className="mb-4 shrink-0 font-semibold">Transcript cuộc phỏng vấn</h2>
          <div className="max-h-[65vh] space-y-3 overflow-y-auto pr-1 lg:max-h-none lg:min-h-0 lg:flex-1">{transcript.map((message, i) => <div key={i} className={message.role === "user" ? "text-right" : "text-left"}><span className="text-xs text-muted-foreground">{message.role === "user" ? "Bạn" : "AI"}</span><p className="whitespace-pre-wrap rounded-xl bg-muted/50 p-3 text-sm">{message.content}</p></div>)}</div>
        </Card>
      </div>
    </>}
    {result.status !== "completed" && oldFeedback && <Card className="p-5"><span className="mb-2 inline-block rounded-full bg-muted px-3 py-1 text-xs">Phiên cũ</span><MarkdownText text={oldFeedback}/></Card>}
    {result.status !== "completed" && <Card className="p-5"><h2 className="mb-4 font-semibold">Transcript cuộc phỏng vấn</h2><div className="max-h-[480px] space-y-3 overflow-y-auto">{transcript.map((message, i) => <div key={i} className={message.role === "user" ? "text-right" : "text-left"}><span className="text-xs text-muted-foreground">{message.role === "user" ? "Bạn" : "AI"}</span><p className="whitespace-pre-wrap rounded-xl bg-muted/50 p-3 text-sm">{message.content}</p></div>)}</div></Card>}
    <Button onClick={retryInterview} className="fixed bottom-5 right-5 z-40 gap-2 rounded-xl shadow-lg sm:bottom-8 sm:right-8">
      <RotateCcw className="h-4 w-4" />
      Phỏng vấn lại cùng vị trí
    </Button>
    </main>
  </div>;
}
