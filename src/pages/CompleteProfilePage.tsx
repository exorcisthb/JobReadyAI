import { useState } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Loader2,
  MapPin,
  Phone,
  Sparkles,
  User,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { completeProfile } from "@/lib/api";

type ProfileMessage = {
  text: string;
  type: "success" | "error";
};

const messageClassName = {
  success:
    "mt-4 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-cyan-50 px-4 py-3 text-sm font-medium text-emerald-800",
  error:
    "mt-4 rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50 to-orange-50 px-4 py-3 text-sm font-medium text-rose-800",
};

const experienceOptions = [
  "Sinh viên / Mới ra trường",
  "Dưới 1 năm",
  "1-3 năm",
  "3-5 năm",
  "Trên 5 năm",
  "Quản lý / Lead",
];

export function CompleteProfilePage() {
  const { user, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<ProfileMessage | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user?.id) {
      setMessage({
        text: "Hoàn thành profile thất bại. Phiên đăng nhập không hợp lệ.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const jobTitle = String(formData.get("jobTitle") ?? "").trim();
    const industry = String(formData.get("industry") ?? "").trim();
    const experienceLevel = String(formData.get("experienceLevel") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const skills = String(formData.get("skills") ?? "").trim();
    const careerGoal = String(formData.get("careerGoal") ?? "").trim();

    try {
      await completeProfile({
        userId: user.id,
        fullName,
        phone,
        jobTitle,
        industry,
        experienceLevel,
        location,
        skills,
        careerGoal,
      });

      login({
        ...user,
        name: fullName,
        profileCompleted: true,
        profile: {
          phone,
          jobTitle,
          industry,
          experienceLevel,
          location,
          skills,
          careerGoal,
        },
      });
      setMessage({ text: "Hoàn thành profile thành công. Đang chuyển trang...", type: "success" });
      window.setTimeout(() => {
        window.location.assign("/dashboard");
      }, 700);
    } catch (error) {
      setMessage({
        text:
          "Hoàn thành profile thất bại. " +
          (error instanceof Error ? error.message : "Không thể lưu profile."),
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
          <a href="/" className="flex items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground"
              style={{ background: "var(--gradient-hero)" }}
            >
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              JobReady<span className="text-primary"> AI</span>
            </span>
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Profile</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Hoàn thành thông tin của bạn</h1>
          <p className="mt-4 text-muted-foreground">
            Thông tin này giúp JobReady AI gợi ý CV, kỹ năng và nội dung ứng tuyển sát hơn với mục
            tiêu nghề nghiệp của bạn.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-elegant)] sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              icon={<User className="h-4 w-4" />}
              label="Họ tên"
              name="fullName"
              required
              defaultValue={user?.name}
            />
            <Field icon={<Phone className="h-4 w-4" />} label="Số điện thoại" name="phone" />
            <Field
              icon={<BriefcaseBusiness className="h-4 w-4" />}
              label="Vị trí mong muốn"
              name="jobTitle"
              required
              placeholder="Frontend Developer"
            />
            <Field label="Ngành nghề" name="industry" required placeholder="Công nghệ thông tin" />
            <label className="block">
              <span className="text-sm font-medium text-foreground">Kinh nghiệm</span>
              <select
                name="experienceLevel"
                className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                defaultValue=""
              >
                <option value="" disabled>
                  Chọn mức kinh nghiệm
                </option>
                {experienceOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <Field icon={<MapPin className="h-4 w-4" />} label="Địa điểm" name="location" />
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-foreground">Kỹ năng chính</span>
            <textarea
              name="skills"
              rows={3}
              placeholder="React, Node.js, SQL, giao tiếp, làm việc nhóm..."
              className="mt-2 w-full resize-none rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-foreground">Mục tiêu nghề nghiệp</span>
            <textarea
              name="careerGoal"
              rows={4}
              placeholder="Ví dụ: Tìm vị trí fresher frontend để phát triển sản phẩm web thực tế..."
              className="mt-2 w-full resize-none rounded-xl border border-input bg-background px-3 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </label>

          {message && <div className={messageClassName[message.type]}>{message.text}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            style={{ background: "var(--gradient-hero)" }}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Hoàn thành profile
            {!isLoading ? <ArrowRight className="h-4 w-4" /> : null}
          </button>
        </form>
      </section>
    </main>
  );
}

type FieldProps = {
  defaultValue?: string;
  icon?: React.ReactNode;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
};

function Field({
  defaultValue,
  icon,
  label,
  name,
  placeholder,
  required,
  type = "text",
}: FieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
        {icon ? <span className="text-muted-foreground">{icon}</span> : null}
        <input
          name={name}
          type={type}
          required={required}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </span>
    </label>
  );
}
