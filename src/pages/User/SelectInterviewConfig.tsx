import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Sparkles,
  MessageSquare,
  Mic,
  BookOpen,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Industry {
  id: number;
  name: string;
}

const LEVELS = [
  { value: "intern", label: "Thực tập sinh (Intern)", desc: "Dành cho sinh viên mới đi làm" },
  {
    value: "fresher",
    label: "Fresher",
    desc: "Dành cho người mới tốt nghiệp, chưa có kinh nghiệm",
  },
  { value: "junior", label: "Junior", desc: "Kinh nghiệm từ 1 - 2 năm" },
  { value: "middle", label: "Middle", desc: "Kinh nghiệm từ 2 - 4 năm" },
  { value: "senior", label: "Senior", desc: "Kinh nghiệm trên 4 năm, khả năng tự lập cao" },
];

const MODES = [
  {
    value: "text",
    label: "Phỏng vấn bằng Text",
    icon: <MessageSquare className="h-5 w-5" />,
    desc: "Gõ câu trả lời trực tiếp",
  },
  {
    value: "voice",
    label: "Phỏng vấn bằng Giọng nói",
    icon: <Mic className="h-5 w-5" />,
    desc: "Trả lời bằng âm thanh & đàm thoại",
  },
];

export default function SelectInterviewConfig() {
  const { user } = useAuth();
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("fresher");
  const [selectedMode, setSelectedMode] = useState<string>("text");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successSession, setSuccessSession] = useState<Record<string, unknown> | null>(null);

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      "x-user-id": user?.id ?? "",
      "x-user-role": user?.role ?? "",
    }),
    [user?.id, user?.role],
  );

  useEffect(() => {
    async function loadIndustries() {
      try {
        const res = await fetch("/api/interview/industries", { headers });
        if (!res.ok) throw new Error("Không thể lấy danh sách ngành nghề.");
        const data = (await res.json()) as Industry[];
        setIndustries(data);
        if (data.length > 0) {
          setSelectedIndustry(String(data[0].id));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    }
    void loadIndustries();
  }, [headers]);

  async function handleStartInterview(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedIndustry) {
      setError("Vui lòng chọn ngành nghề.");
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/interview/session", {
        method: "POST",
        headers,
        body: JSON.stringify({
          industry_id: Number.parseInt(selectedIndustry, 10),
          level: selectedLevel,
          mode: selectedMode,
          job_description: jobDescription,
        }),
      });

      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(errData.error ?? "Không thể bắt đầu buổi phỏng vấn.");
      }

      const session = await res.json();
      setSuccessSession(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    } finally {
      setSubmitting(false);
    }
  }

  if (successSession) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-6 py-12 text-foreground">
        <Card className="w-full max-w-lg border-2 border-primary/20 bg-card/80 backdrop-blur-md shadow-[var(--shadow-elegant)] relative overflow-hidden transition-all duration-300 transform hover:scale-[1.01]">
          {/* Decorative glowing gradient circle */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
          <CardHeader className="text-center pt-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-4 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Cấu hình hoàn tất!</CardTitle>
            <CardDescription className="text-base text-muted-foreground mt-2">
              Hệ thống AI đã thiết lập phòng phỏng vấn dành riêng cho bạn.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pb-8">
            <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
              <div className="flex justify-between text-sm border-b pb-2 border-border/40">
                <span className="text-muted-foreground">Ngành nghề:</span>
                <span className="font-semibold">
                  {industries.find((i) => String(i.id) === selectedIndustry)?.name}
                </span>
              </div>
              <div className="flex justify-between text-sm border-b pb-2 border-border/40">
                <span className="text-muted-foreground">Cấp độ:</span>
                <span className="font-semibold capitalize text-primary">
                  {LEVELS.find((l) => l.value === selectedLevel)?.label}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Hình thức:</span>
                <span className="font-semibold text-primary">
                  {MODES.find((m) => m.value === selectedMode)?.label}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Alert className="bg-primary/5 border-primary/20 text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                <AlertTitle className="font-semibold">Sẵn sàng bắt đầu!</AlertTitle>
                <AlertDescription className="text-xs text-muted-foreground mt-0.5">
                  Hệ thống đã chuẩn bị sẵn phòng phỏng vấn. Nhấn nút bên dưới để bắt đầu phỏng vấn với AI.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  className="flex-1 bg-gradient-to-r from-primary to-primary-hover shadow-md"
                  onClick={() => window.location.assign("/interview/session")}
                >
                  Bắt đầu phỏng vấn ngay
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSuccessSession(null)}
                >
                  Cấu hình lại
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground relative overflow-hidden">
      {/* Decorative Blur Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-3xl space-y-6 relative z-10">
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => window.location.assign("/dashboard")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          Quay lại Dashboard
        </button>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Cấu hình buổi phỏng vấn</h1>
          <p className="text-muted-foreground">
            Lựa chọn ngành nghề, cấp độ và phương thức phỏng vấn mong muốn trước khi bắt đầu thử
            thách cùng AI.
          </p>
        </div>

        {error ? (
          <Alert variant="destructive" className="border-destructive/30 bg-destructive/10">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi cấu hình</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Đang tải danh sách ngành nghề...</p>
          </div>
        ) : (
          <form onSubmit={(e) => void handleStartInterview(e)} className="space-y-6">
            <Card className="border border-border/60 bg-card/75 backdrop-blur-sm shadow-[var(--shadow-elegant)]">
              <CardContent className="p-6 space-y-6">
                {/* Industry Selection */}
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-base font-semibold">
                    1. Chọn ngành nghề của bạn
                  </Label>
                  <div className="relative">
                    <select
                      id="industry"
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-background/50 hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition duration-150 cursor-pointer appearance-none font-medium"
                    >
                      {industries.map((ind) => (
                        <option key={ind.id} value={String(ind.id)}>
                          {ind.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                      <BookOpen className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Level Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">2. Chọn cấp độ phỏng vấn</Label>
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {LEVELS.map((lvl) => {
                      const isSelected = selectedLevel === lvl.value;
                      return (
                        <button
                          key={lvl.value}
                          type="button"
                          onClick={() => setSelectedLevel(lvl.value)}
                          className={`p-4 rounded-xl text-left border text-sm transition-all duration-200 flex flex-col justify-between h-28 hover:border-primary/50 relative overflow-hidden group ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.1)]"
                              : "border-border bg-background/40 hover:bg-background/80"
                          }`}
                        >
                          <span
                            className={`font-bold transition-colors ${isSelected ? "text-primary" : "text-foreground"}`}
                          >
                            {lvl.label}
                          </span>
                          <span className="text-xs text-muted-foreground leading-relaxed mt-1 line-clamp-2">
                            {lvl.desc}
                          </span>
                          {/* Inner glowing hover effect */}
                          <div
                            className={`absolute top-0 right-0 w-8 h-8 rounded-full bg-primary/10 blur-md transition-opacity duration-300 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mode Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">3. Phương thức trả lời</Label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {MODES.map((mode) => {
                      const isSelected = selectedMode === mode.value;
                      return (
                        <button
                          key={mode.value}
                          type="button"
                          onClick={() => setSelectedMode(mode.value)}
                          className={`p-5 rounded-2xl text-left border flex items-start gap-4 transition-all duration-200 relative overflow-hidden ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.1)]"
                              : "border-border bg-background/40 hover:bg-background/80"
                          }`}
                        >
                          <div
                            className={`rounded-xl p-3 border transition-all duration-200 ${
                              isSelected
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-muted/40 text-muted-foreground"
                            }`}
                          >
                            {mode.icon}
                          </div>
                          <div className="space-y-1">
                            <h3
                              className={`font-bold text-sm ${isSelected ? "text-primary" : "text-foreground"}`}
                            >
                              {mode.label}
                            </h3>
                            <p className="text-xs text-muted-foreground leading-normal">
                              {mode.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Optional Job Description */}
                <div className="space-y-2">
                  <Label htmlFor="jd" className="text-base font-semibold">
                    4. Mô tả công việc (JD) - Không bắt buộc
                  </Label>
                  <textarea
                    id="jd"
                    rows={4}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Dán JD của vị trí bạn chuẩn bị ứng tuyển vào đây. AI sẽ phân tích và đưa ra các câu hỏi bám sát theo mô tả công việc của bạn."
                    className="w-full p-4 rounded-xl border border-border bg-background/50 hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition duration-150 text-sm font-medium leading-relaxed resize-y placeholder:text-muted-foreground/60"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.location.assign("/dashboard")}
                className="h-11 px-6 font-semibold"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="h-11 px-8 font-semibold bg-gradient-to-r from-primary to-primary-hover text-primary-foreground shadow-[0_4px_14px_rgba(var(--color-primary-rgb),0.3)] group relative overflow-hidden"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Đang thiết lập...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    Bắt đầu phỏng vấn
                    <Sparkles className="h-4 w-4 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-200" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
