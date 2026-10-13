import { useState, useEffect, memo, useCallback } from "react";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Target,
  Edit3,
  Save,
  Loader2,
  Award,
  Building2,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

interface ProfileData {
  full_name: string;
  phone: string;
  job_title: string;
  industry: string;
  experience_level: string;
  location: string;
  skills: string;
  career_goal: string;
}

interface ViewProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name?: string;
    email?: string;
    phone?: string;
    jobTitle?: string;
    industry?: string;
    experienceLevel?: string;
    location?: string;
    skills?: string;
    careerGoal?: string;
    avatar_url?: string;
    profile_completed?: boolean;
  };
  onSave?: (data: ProfileData) => Promise<void>;
  readonly?: boolean;
}

const experienceLevels = ["Fresher", "Junior", "Mid-Level", "Senior", "Lead", "Manager"];
const industries = [
  "Công nghệ thông tin",
  "Tài chính - Ngân hàng",
  "Kinh doanh - Marketing",
  "Kỹ thuật",
  "Nhân sự",
  "Giáo dục",
  "Y tế",
  "Khác",
];

function ViewProfileModal({ isOpen, onClose, user, onSave, readonly = false }: ViewProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    full_name: "", phone: "", job_title: "", industry: "",
    experience_level: "", location: "", skills: "", career_goal: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        full_name: user?.name || "", phone: user?.phone || "",
        job_title: user?.jobTitle || "", industry: user?.industry || "",
        experience_level: user?.experienceLevel || "", location: user?.location || "",
        skills: user?.skills || "", career_goal: user?.careerGoal || "",
      });
      setIsEditing(false);
      setClosing(false);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      setClosing(false);
    }
  }, [isOpen, user]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setVisible(false);
    setTimeout(() => { setClosing(false); onClose(); }, 400);
  }, [onClose]);

  const initials = (user?.name || "U").charAt(0).toUpperCase();

  const handleSave = useCallback(async () => {
    if (!onSave) return;
    setLoading(true);
    try { await onSave(formData); setIsEditing(false); }
    catch (e) { console.error("Failed to save:", e); }
    finally { setLoading(false); }
  }, [formData, onSave]);

  const handleFieldChange = useCallback((field: keyof ProfileData, value: string) => {
    setFormData((p) => ({ ...p, [field]: value }));
  }, []);

  if (!isOpen && !closing) return null;

  const InfoRow = ({
    icon: Icon, label, value, delay = 0,
  }: { icon: React.ComponentType<{ className?: string }>; label: string; value?: string | null; delay?: number }) => (
    <div
      className="flex items-center gap-3 py-1.5 transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider leading-none mb-1">{label}</p>
        <p className="text-[13px] font-semibold text-foreground truncate leading-snug" title={value || ""}>{value || "Chưa cập nhật"}</p>
      </div>
    </div>
  );

  const cardStyle = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
    transitionDelay: `${delay}ms`,
    minHeight: "230px",
  });

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <style>{`
        .vp-screen {
          transition: transform 0.45s cubic-bezier(0.32,0.72,0,1), opacity 0.35s ease;
        }
        .vp-screen-enter  { transform: translateX(100%); opacity: 0; }
        .vp-screen-active { transform: translateX(0);    opacity: 1; }
        .vp-screen-exit   { transform: translateX(100%); opacity: 0; }
        .vp-backdrop { transition: opacity 0.4s ease; }
        .vp-card {
          transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.32,0.72,0,1);
        }
        .vp-avatar {
          transition: opacity 0.55s ease, transform 0.55s cubic-bezier(0.34,1.56,0.64,1);
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm vp-backdrop"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={handleClose}
      />

      {/* Slide-in panel */}
      <div
        className={`absolute inset-0 flex flex-col bg-background vp-screen ${
          visible ? "vp-screen-active" : closing ? "vp-screen-exit" : "vp-screen-enter"
        }`}
      >
        {/* Header */}
        <header className="shrink-0 h-14 flex items-center px-5 border-b border-border bg-card/80 backdrop-blur-md z-10">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </button>
        </header>

        {/* Scrollable body */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 py-5 sm:px-8 sm:py-6">



            {!isEditing ? (
              <>
                {/*
                  ┌──────────────┐   ┌──────────────┐
                  │   CÁ NHÂN   │   │  NGHỀ NGHIỆP │
                  │             │ ◉ │              │
                  └──────────────┘   └──────────────┘
                  ┌──────────────┐   ┌──────────────┐
                  │   KỸ NĂNG   │   │  MỤC TIÊU   │
                  │             │   │              │
                  └──────────────┘   └──────────────┘

                  Avatar sits in the center gap, z-index above cards.
                  Cards use border-radius only on outer corners via
                  clip-path so the inner corners point toward the avatar.
                */}

                {/* Mobile avatar & name */}
                <div
                  className="sm:hidden flex flex-col items-center justify-center mb-6 text-center vp-card"
                  style={{ opacity: visible ? 1 : 0, transitionDelay: "120ms" }}
                >
                  <h2 className="text-base font-bold text-foreground leading-tight mb-2.5">
                    {user?.name || "User"}
                  </h2>
                  <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-accent shadow-md flex items-center justify-center">
                    <div className="w-full h-full rounded-full overflow-hidden bg-background flex items-center justify-center">
                      {user?.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xl font-bold text-primary-foreground bg-primary">
                          {initials}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* AVATAR SIZE = 160px; gap-x = 260px gives 50px clearance each side */}
                <div className="relative" style={{ gap: 0 }}>
                  {/* Grid – wide 260px column gap and 240px row gap so name and avatar are completely below row 1 */}
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-[260px] sm:gap-y-[240px]"
                  >
                    {/* ── Card 1: Cá nhân (top-left) ── */}
                    <div
                      className="rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-6 vp-card shadow-sm overflow-hidden flex flex-col justify-between"
                      style={{
                        ...cardStyle(140),
                        borderBottomRightRadius: "28px",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
                          <User className="h-3.5 w-3.5 text-blue-500" />
                        </div>
                        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Cá nhân</h3>
                      </div>
                      <InfoRow icon={User}  label="Họ tên"     value={user?.name}  delay={240} />
                      <InfoRow icon={Mail}  label="Email"      value={user?.email} delay={290} />
                      <InfoRow icon={Phone} label="Điện thoại" value={user?.phone} delay={340} />
                    </div>

                    {/* ── Card 2: Nghề nghiệp (top-right) ── */}
                    <div
                      className="rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-6 vp-card shadow-sm overflow-hidden flex flex-col justify-between"
                      style={{
                        ...cardStyle(190),
                        borderBottomLeftRadius: "28px",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-500/10">
                          <Briefcase className="h-3.5 w-3.5 text-pink-500" />
                        </div>
                        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Nghề nghiệp</h3>
                      </div>
                      <InfoRow icon={Target}        label="Vị trí"     value={user?.jobTitle}         delay={290} />
                      <InfoRow icon={Building2}     label="Ngành nghề" value={user?.industry}          delay={340} />
                      <InfoRow icon={GraduationCap} label="Cấp bậc"    value={user?.experienceLevel}  delay={390} />
                    </div>

                    {/* ── Card 3: Kỹ năng (bottom-left) ── */}
                    <div
                      className="rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-6 vp-card shadow-sm overflow-hidden flex flex-col justify-between"
                      style={{
                        ...cardStyle(240),
                        borderTopRightRadius: "28px",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
                          <Award className="h-3.5 w-3.5 text-emerald-500" />
                        </div>
                        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Kỹ năng</h3>
                      </div>
                      {user?.skills ? (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {user.skills.split(",").map((s, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/15 transition-all duration-500"
                              style={{
                                opacity: visible ? 1 : 0,
                                transform: visible ? "scale(1)" : "scale(0.8)",
                                transitionDelay: `${390 + i * 50}ms`,
                              }}
                            >
                              {s.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground/50 flex items-center gap-1.5 mt-1">
                          <Sparkles className="h-3 w-3" /> Chưa cập nhật kỹ năng
                        </p>
                      )}
                    </div>

                    {/* ── Card 4: Mục tiêu & Địa điểm (bottom-right) ── */}
                    <div
                      className="rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-6 vp-card shadow-sm overflow-hidden flex flex-col justify-between"
                      style={{
                        ...cardStyle(290),
                        borderTopLeftRadius: "28px",
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10">
                          <Target className="h-3.5 w-3.5 text-amber-500" />
                        </div>
                        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Mục tiêu & Địa điểm</h3>
                      </div>
                      <InfoRow icon={MapPin} label="Địa điểm" value={user?.location} delay={390} />
                      {user?.careerGoal && (
                        <div
                          className="mt-2 pt-2 border-t border-border transition-all duration-500"
                          style={{ opacity: visible ? 1 : 0, transitionDelay: "440ms" }}
                        >
                          <p className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider mb-1">Mục tiêu nghề nghiệp</p>
                          <p className="text-[13px] text-foreground leading-relaxed break-words line-clamp-3">{user.careerGoal}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Avatar & Name flex container shifted down so name sits completely below row 1 ── */}
                  <div
                    className="hidden sm:flex flex-col items-center absolute z-20 vp-avatar pointer-events-none"
                    style={{
                      left: "50%",
                      top: "50%",
                      opacity: visible ? 1 : 0,
                      transform: visible
                        ? "translate(-50%, calc(-50% + 22px)) scale(1)"
                        : "translate(-50%, calc(-50% + 22px)) scale(0.3)",
                      transitionDelay: "320ms",
                    }}
                  >
                    {/* Name on top of avatar – shifted down into the clear gap between rows */}
                    <div
                      className="text-center px-4 mb-2 vp-card max-w-[320px]"
                      style={{ opacity: visible ? 1 : 0, transitionDelay: "360ms" }}
                    >
                      <h2
                        className="text-base sm:text-lg font-bold text-foreground leading-snug tracking-tight break-words"
                        title={user?.name || "User"}
                      >
                        {user?.name || "User"}
                      </h2>
                    </div>

                    {/* Avatar circle */}
                    <div className="relative pointer-events-auto">
                      <div
                        className="rounded-full bg-background shadow-2xl flex items-center justify-center"
                        style={{ width: 148, height: 148, padding: 6 }}
                      >
                        {/* Gradient ring */}
                        <div
                          className="rounded-full flex items-center justify-center"
                          style={{
                            width: "100%",
                            height: "100%",
                            background: "var(--gradient-hero, linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent))))",
                            padding: 2.5,
                          }}
                        >
                          {/* Inner white + photo */}
                          <div className="rounded-full overflow-hidden bg-background w-full h-full flex items-center justify-center">
                            {user?.avatar_url ? (
                              <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-primary-foreground bg-primary">
                                {initials}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {user?.profile_completed && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-6 w-6 bg-emerald-500 rounded-full border-[3px] border-background flex items-center justify-center shadow-md">
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit button */}
                {!readonly && onSave && (
                  <div
                    className="mt-6 vp-card"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(10px)",
                      transitionDelay: "480ms",
                    }}
                  >
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <Edit3 className="h-4 w-4" /> Chỉnh sửa thông tin
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* ── Edit form ── */
              <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Họ và tên *",      field: "full_name" as const,         placeholder: "Nhập họ và tên",          type: "text" },
                    { label: "Số điện thoại",     field: "phone" as const,             placeholder: "0xxx xxx xxx",            type: "text" },
                    { label: "Vị trí mong muốn", field: "job_title" as const,         placeholder: "VD: Frontend Developer",  type: "text" },
                    { label: "Địa điểm",          field: "location" as const,          placeholder: "VD: Hồ Chí Minh",        type: "text" },
                  ].map(({ label, field, placeholder }) => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
                      <input
                        type="text"
                        value={formData[field]}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Ngành nghề</label>
                    <select value={formData.industry} onChange={(e) => handleFieldChange("industry", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all cursor-pointer">
                      <option value="">Chọn ngành nghề</option>
                      {industries.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Cấp bậc</label>
                    <select value={formData.experience_level} onChange={(e) => handleFieldChange("experience_level", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all cursor-pointer">
                      <option value="">Chọn cấp bậc</option>
                      {experienceLevels.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Kỹ năng</label>
                  <textarea value={formData.skills} onChange={(e) => handleFieldChange("skills", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all min-h-[70px] resize-none"
                    placeholder="VD: React, TypeScript, Node.js,..." />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Mục tiêu nghề nghiệp</label>
                  <textarea value={formData.career_goal} onChange={(e) => handleFieldChange("career_goal", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all min-h-[70px] resize-none"
                    placeholder="Mô tả mục tiêu nghề nghiệp..." />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
                    Hủy
                  </button>
                  <button onClick={handleSave} disabled={loading}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer">
                    {loading
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> Đang lưu...</>
                      : <><Save className="h-4 w-4" /> Lưu thay đổi</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default memo(ViewProfileModal);
