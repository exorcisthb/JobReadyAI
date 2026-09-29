import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Check,
  Laptop,
  TrendingUp,
  GraduationCap,
  Landmark,
  Users,
  Palette,
  Cpu,
  HeartPulse,
  Briefcase,
  ShoppingCart,
  Shield,
  Bot,
  Database,
  Globe,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuotaExceededPromoModal } from "@/components/QuotaExceededPromoModal";

type RoleGroup = {
  groupLabel: string;
  roles: string[];
};

type IndustryItem = {
  id: string;
  label: string;
  code: string;
  icon: React.ElementType;
  iconBg: string;
  iconSelected: string;
  sidebarSelected: string;
  badgeColor: string;
  activeText: string;
  roleGroups: RoleGroup[];
};

// ─── Industry + Role Data ────────────────────────────────────────────────────
const INDUSTRIES_DATA: IndustryItem[] = [
  {
    id: "it",
    label: "Công nghệ thông tin",
    code: "IT / Software / AI / Security",
    icon: Laptop,
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    iconSelected: "bg-blue-600 text-white border-blue-600",
    sidebarSelected: "bg-blue-500/10 border-l-[3px] border-l-blue-500 text-blue-700 dark:text-blue-300",
    badgeColor: "border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/10",
    activeText: "text-blue-600 dark:text-blue-400",
    roleGroups: [
      {
        groupLabel: "Lập trình Web & Mobile",
        roles: ["Frontend Developer", "Backend Developer", "Fullstack Developer", "Mobile Developer (iOS/Android/Flutter)", "React Native Developer", "Vue.js / Angular Developer", "TypeScript / Node.js Developer"],
      },
      {
        groupLabel: "Hạ tầng, DevOps & Cloud",
        roles: ["DevOps Engineer", "SRE (Site Reliability Engineer)", "Cloud Engineer (AWS/GCP/Azure)", "Platform Engineer", "Kubernetes / Docker Specialist", "System Administrator", "Network Engineer", "Infrastructure Engineer", "Database Administrator (DBA)"],
      },
      {
        groupLabel: "Kiểm thử & Chất lượng",
        roles: ["QA Engineer", "Automation Tester (Selenium/Playwright)", "Performance Tester", "QC Specialist", "SDET (Software Dev Engineer in Test)"],
      },
      {
        groupLabel: "Dữ liệu & Trí tuệ nhân tạo (AI)",
        roles: ["Data Engineer", "Data Analyst", "Data Scientist", "Machine Learning Engineer", "AI / LLM Engineer", "NLP Engineer", "Computer Vision Engineer", "Business Intelligence (BI)", "MLOps Engineer", "Analytics Engineer", "AI Product Manager"],
      },
      {
        groupLabel: "An toàn thông tin (Cybersecurity)",
        roles: ["Security Engineer", "Penetration Tester (PenTest)", "SOC Analyst (L1/L2/L3)", "Application Security (AppSec)", "Cloud Security Engineer", "DevSecOps Engineer", "Threat Intelligence Analyst", "Incident Response Analyst", "Red Team Engineer", "GRC Analyst", "Security Architect"],
      },
      {
        groupLabel: "Sản phẩm & Quản trị",
        roles: ["Product Manager (IT)", "Technical Lead", "Engineering Manager", "CTO / VP Engineering", "Scrum Master / Agile Coach", "Business Analyst (IT)", "Project Manager (IT)"],
      },
      {
        groupLabel: "Thiết kế Sản phẩm & UX",
        roles: ["UI Designer", "UX Designer", "UX Researcher", "Product Designer", "Design System Lead", "UI/UX Lead"],
      },
    ],
  },
  {
    id: "marketing",
    label: "Kinh doanh & Marketing",
    code: "Marketing / Sales",
    icon: TrendingUp,
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    iconSelected: "bg-amber-500 text-white border-amber-500",
    sidebarSelected: "bg-amber-500/10 border-l-[3px] border-l-amber-500 text-amber-700 dark:text-amber-300",
    badgeColor: "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10",
    activeText: "text-amber-600 dark:text-amber-400",
    roleGroups: [
      {
        groupLabel: "Digital Marketing",
        roles: ["Digital Marketing Specialist", "SEO Specialist", "SEM / Google Ads Specialist", "Social Media Marketing", "Email Marketing Specialist", "Performance Marketing"],
      },
      {
        groupLabel: "Content & Brand",
        roles: ["Content Marketing Manager", "Content Writer / Copywriter", "Brand Manager", "PR Specialist", "Influencer Marketing"],
      },
      {
        groupLabel: "Sales & Kinh doanh",
        roles: ["Sales Executive", "Account Executive (B2B)", "Business Development Manager", "Sales Manager", "Key Account Manager"],
      },
      {
        groupLabel: "E-commerce & Growth",
        roles: ["E-commerce Manager", "Growth Hacker", "Product Marketing Manager", "CRM Specialist", "Marketing Analytics"],
      },
    ],
  },
  {
    id: "ecommerce",
    label: "Thương mại điện tử",
    code: "E-commerce / Retail",
    icon: ShoppingCart,
    iconBg: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    iconSelected: "bg-orange-500 text-white border-orange-500",
    sidebarSelected: "bg-orange-500/10 border-l-[3px] border-l-orange-500 text-orange-700 dark:text-orange-300",
    badgeColor: "border-orange-500/30 text-orange-600 dark:text-orange-400 bg-orange-500/10",
    activeText: "text-orange-600 dark:text-orange-400",
    roleGroups: [
      {
        groupLabel: "Vận hành Sàn & Shop",
        roles: ["E-commerce Executive", "Shopee / Lazada / TikTok Shop Specialist", "Marketplace Manager", "Category Manager", "Seller Account Manager"],
      },
      {
        groupLabel: "Kho vận & Logistics",
        roles: ["Logistics Coordinator", "Supply Chain Analyst", "Warehouse Manager", "Last-mile Delivery Manager"],
      },
      {
        groupLabel: "Customer & Growth",
        roles: ["Customer Success Manager", "CRM Specialist", "Retention Marketing", "Growth Hacker (E-com)"],
      },
    ],
  },
  {
    id: "finance",
    label: "Tài chính & Ngân hàng",
    code: "Finance / Banking",
    icon: Landmark,
    iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    iconSelected: "bg-purple-600 text-white border-purple-600",
    sidebarSelected: "bg-purple-500/10 border-l-[3px] border-l-purple-500 text-purple-700 dark:text-purple-300",
    badgeColor: "border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10",
    activeText: "text-purple-600 dark:text-purple-400",
    roleGroups: [
      {
        groupLabel: "Ngân hàng & Tín dụng",
        roles: ["Chuyên viên tín dụng", "Chuyên viên thẩm định", "Giao dịch viên", "Relationship Manager", "Branch Manager"],
      },
      {
        groupLabel: "Kế toán & Kiểm toán",
        roles: ["Kế toán tổng hợp", "Kế toán thuế", "Kiểm toán nội bộ", "Kiểm toán viên (Big4)", "Chief Accountant"],
      },
      {
        groupLabel: "Đầu tư & Tài chính",
        roles: ["Chuyên viên đầu tư", "Financial Analyst", "Quản lý rủi ro", "Actuarial Analyst", "Fund Manager"],
      },
      {
        groupLabel: "FinTech & Bảo hiểm",
        roles: ["FinTech Product Manager", "Payment Specialist", "Chuyên viên bảo hiểm nhân thọ", "Claims Specialist"],
      },
    ],
  },
  {
    id: "hr",
    label: "Nhân sự",
    code: "Human Resources",
    icon: Users,
    iconBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    iconSelected: "bg-rose-600 text-white border-rose-600",
    sidebarSelected: "bg-rose-500/10 border-l-[3px] border-l-rose-500 text-rose-700 dark:text-rose-300",
    badgeColor: "border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10",
    activeText: "text-rose-600 dark:text-rose-400",
    roleGroups: [
      {
        groupLabel: "Tuyển dụng",
        roles: ["Recruiter (IT/Non-IT)", "Headhunter / Executive Search", "Talent Acquisition Manager", "Employer Branding Specialist"],
      },
      {
        groupLabel: "Đào tạo & Phát triển",
        roles: ["Training Specialist", "L&D Manager", "Organizational Development"],
      },
      {
        groupLabel: "C&B & Hành chính",
        roles: ["C&B Specialist", "Payroll Specialist", "HR Admin", "HRBP (HR Business Partner)", "HR Manager", "HR Director"],
      },
    ],
  },
  {
    id: "design",
    label: "Thiết kế & Sáng tạo",
    code: "Design / Creative",
    icon: Palette,
    iconBg: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20",
    iconSelected: "bg-fuchsia-600 text-white border-fuchsia-600",
    sidebarSelected: "bg-fuchsia-500/10 border-l-[3px] border-l-fuchsia-500 text-fuchsia-700 dark:text-fuchsia-300",
    badgeColor: "border-fuchsia-500/30 text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-500/10",
    activeText: "text-fuchsia-600 dark:text-fuchsia-400",
    roleGroups: [
      {
        groupLabel: "UI/UX & Product Design",
        roles: ["UI Designer", "UX Designer", "Product Designer", "UX Researcher", "Design System Lead"],
      },
      {
        groupLabel: "Visual & Graphic",
        roles: ["Graphic Designer", "Brand Designer", "Visual Designer", "Motion Designer", "Illustration Artist"],
      },
      {
        groupLabel: "Video & 3D",
        roles: ["Video Editor", "3D Artist", "3D Animator", "VFX Artist", "Content Creator (Video)"],
      },
    ],
  },
  {
    id: "education",
    label: "Giáo dục & Đào tạo",
    code: "Education / EdTech",
    icon: GraduationCap,
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    iconSelected: "bg-emerald-600 text-white border-emerald-600",
    sidebarSelected: "bg-emerald-500/10 border-l-[3px] border-l-emerald-500 text-emerald-700 dark:text-emerald-300",
    badgeColor: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    activeText: "text-emerald-600 dark:text-emerald-400",
    roleGroups: [
      {
        groupLabel: "Giảng dạy",
        roles: ["Giáo viên Tiểu học / THCS / THPT", "Giảng viên Đại học", "Giáo viên ngoại ngữ", "Gia sư chuyên môn"],
      },
      {
        groupLabel: "Tư vấn & Tuyển sinh",
        roles: ["Tư vấn tuyển sinh", "Tư vấn du học", "Academic Advisor"],
      },
      {
        groupLabel: "EdTech & Nội dung",
        roles: ["Content Creator (Education)", "Curriculum Developer", "Instructional Designer", "E-learning Developer", "Product Manager (EdTech)"],
      },
    ],
  },
  {
    id: "engineering",
    label: "Kỹ thuật & Xây dựng",
    code: "Engineering / Construction",
    icon: Cpu,
    iconBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    iconSelected: "bg-sky-600 text-white border-sky-600",
    sidebarSelected: "bg-sky-500/10 border-l-[3px] border-l-sky-500 text-sky-700 dark:text-sky-300",
    badgeColor: "border-sky-500/30 text-sky-600 dark:text-sky-400 bg-sky-500/10",
    activeText: "text-sky-600 dark:text-sky-400",
    roleGroups: [
      {
        groupLabel: "Cơ khí & Điện",
        roles: ["Kỹ sư cơ khí", "Kỹ sư điện", "Kỹ sư tự động hóa", "Kỹ sư điều khiển PLC/SCADA", "Kỹ sư bảo trì"],
      },
      {
        groupLabel: "Xây dựng & Địa ốc",
        roles: ["Kỹ sư xây dựng", "Kỹ sư kết cấu", "Kỹ sư M&E", "Giám sát công trình", "Kỹ sư BIM/CAD"],
      },
      {
        groupLabel: "Hóa & Môi trường",
        roles: ["Kỹ sư hóa", "Kỹ sư môi trường", "Kỹ sư công nghiệp", "Project Engineer"],
      },
    ],
  },
  {
    id: "healthcare",
    label: "Y tế & Sức khỏe",
    code: "Healthcare / Medical",
    icon: HeartPulse,
    iconBg: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    iconSelected: "bg-pink-600 text-white border-pink-600",
    sidebarSelected: "bg-pink-500/10 border-l-[3px] border-l-pink-500 text-pink-700 dark:text-pink-300",
    badgeColor: "border-pink-500/30 text-pink-600 dark:text-pink-400 bg-pink-500/10",
    activeText: "text-pink-600 dark:text-pink-400",
    roleGroups: [
      {
        groupLabel: "Lâm sàng",
        roles: ["Bác sĩ đa khoa", "Bác sĩ chuyên khoa", "Điều dưỡng", "Dược sĩ", "Kỹ thuật viên xét nghiệm"],
      },
      {
        groupLabel: "Quản lý & Vận hành",
        roles: ["Quản lý phòng khám", "Hospital Administrator", "Medical Director"],
      },
      {
        groupLabel: "HealthTech & Marketing",
        roles: ["Marketing y tế", "Medical Representative (MR)", "Health Tech Product Manager", "Medical Writer"],
      },
    ],
  },
  {
    id: "global",
    label: "Quốc tế & Ngoại thương",
    code: "International / Trade",
    icon: Globe,
    iconBg: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    iconSelected: "bg-teal-600 text-white border-teal-600",
    sidebarSelected: "bg-teal-500/10 border-l-[3px] border-l-teal-500 text-teal-700 dark:text-teal-300",
    badgeColor: "border-teal-500/30 text-teal-600 dark:text-teal-400 bg-teal-500/10",
    activeText: "text-teal-600 dark:text-teal-400",
    roleGroups: [
      {
        groupLabel: "Xuất nhập khẩu",
        roles: ["Chuyên viên xuất nhập khẩu", "Customs Specialist", "Logistics Coordinator", "Freight Forwarder", "Import/Export Manager"],
      },
      {
        groupLabel: "Quan hệ Quốc tế",
        roles: ["International Business Developer", "Foreign Trade Specialist", "Interpreter / Translator (EN/JP/KR/CN)", "Country Manager"],
      },
    ],
  },
  {
    id: "other",
    label: "Vị trí khác",
    code: "Other Roles",
    icon: Briefcase,
    iconBg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    iconSelected: "bg-indigo-600 text-white border-indigo-600",
    sidebarSelected: "bg-indigo-500/10 border-l-[3px] border-l-indigo-500 text-indigo-700 dark:text-indigo-300",
    badgeColor: "border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
    activeText: "text-indigo-600 dark:text-indigo-400",
    roleGroups: [
      {
        groupLabel: "Quản lý & Điều hành",
        roles: ["Trưởng phòng / Department Manager", "Giám đốc điều hành (CEO/COO)", "Project Manager", "PMO Specialist"],
      },
      {
        groupLabel: "Pháp lý & Tuân thủ",
        roles: ["Luật sư", "Legal Counsel", "Compliance Officer", "Contract Manager"],
      },
      {
        groupLabel: "Vận hành & Hành chính",
        roles: ["Operations Manager", "Office Manager", "Executive Assistant", "Customer Service", "Call Center Agent"],
      },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function InterviewSetupPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const searchParams = new URLSearchParams(window.location.search);
  const cvId = searchParams.get("cv_id") || "";
  const paramPosition = searchParams.get("position") || "";

  const initialIndustry =
    INDUSTRIES_DATA.find((ind) =>
      ind.roleGroups.some((g) =>
        g.roles.some((r) => r.toLowerCase() === (paramPosition || "").toLowerCase())
      )
    )?.id || "it";

  const [selectedIndustry, setSelectedIndustry] = useState<string>(initialIndustry);
  const [position, setPosition] = useState<string>(
    paramPosition || INDUSTRIES_DATA[0].roleGroups[0].roles[0]
  );

  const [quota, setQuota] = useState<{ remaining: number | "unlimited"; limit: number; plan?: string } | null>(null);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    fetch("/api/interview/quota", {
      headers: { "x-user-id": user.id, "x-user-role": user.role ?? "user" },
    })
      .then((r) => r.json())
      .then((data) => setQuota(data))
      .catch(console.error);
  }, [user?.id, user?.role]);

  const currentIndustryObj =
    INDUSTRIES_DATA.find((ind) => ind.id === selectedIndustry) || INDUSTRIES_DATA[0];

  const handleSelectIndustry = (indId: string) => {
    setSelectedIndustry(indId);
    const ind = INDUSTRIES_DATA.find((i) => i.id === indId);
    if (ind) {
      const firstRole = ind.roleGroups[0]?.roles[0];
      const hasCurrentPos = ind.roleGroups.some((g) => g.roles.includes(position));
      if (!hasCurrentPos && firstRole) setPosition(firstRole);
    }
  };

  const handleProceedToPersonaSelect = () => {
    if (!position) {
      setErrorMessage("Vui lòng chọn vị trí ứng tuyển mong muốn.");
      return;
    }
    if (quota !== null && quota.remaining !== "unlimited" && quota.remaining <= 0) {
      setShowPromoModal(true);
      return;
    }
    sessionStorage.setItem(
      "interview_setup",
      JSON.stringify({
        cvId,
        industry: selectedIndustry,
        industryLabel: currentIndustryObj.label,
        position,
        model: "gemini-2.5-flash",
      })
    );
    const params = new URLSearchParams({ cv_id: cvId, position });
    window.location.assign(`/interview/persona?${params.toString()}`);
  };

  const CurrentIcon = currentIndustryObj.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 text-foreground flex flex-col">
      {showPromoModal && (
        <QuotaExceededPromoModal
          onClose={() => setShowPromoModal(false)}
          onSuccess={() => {
            if (user?.id) {
              fetch("/api/interview/quota", {
                headers: { "x-user-id": user.id, "x-user-role": user.role ?? "user" },
              })
                .then((r) => r.json())
                .then((data) => setQuota(data))
                .catch(console.error);
            }
          }}
        />
      )}

      {/* Top Navigation Bar */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.assign("/cv")}
              className="gap-2 rounded-xl text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t("nav.viewCV") || "Quay lại"}</span>
            </Button>
            <div className="h-4 w-[1px] bg-border/60 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h1 className="text-sm font-semibold leading-none">Chọn Vị Trí Phỏng Vấn</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Xác định vai trò bạn muốn luyện tập</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {quota && (
              <Badge
                variant="outline"
                className={`text-xs py-1 px-2.5 rounded-full ${
                  quota.remaining === "unlimited"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : quota.remaining > 0
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-red-500/30 bg-red-500/10 text-red-500"
                }`}
              >
                🎯 Còn lại:{" "}
                <span className="font-bold ml-1">
                  {quota.remaining === "unlimited" ? "∞" : `${quota.remaining}/${quota.limit}`}
                </span>
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Main Content — full width, px-6 */}
      <main className="px-6 py-5 flex-1 w-full">
        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setErrorMessage(null)} className="text-xs h-7 text-destructive hover:bg-destructive/10">
              Đóng
            </Button>
          </div>
        )}

        {/* Title */}
        <div className="text-center mb-6 space-y-1.5">
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
            Mục tiêu phỏng vấn
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Chọn Ngành Nghề & Vị Trí Ứng Tuyển
          </h2>
          <p className="text-sm text-muted-foreground">
            Chọn ngành bên trái → chọn vị trí cụ thể bên phải. AI sẽ phỏng vấn chuyên sâu theo mảng ngách của vị trí đó.
          </p>
        </div>

        {/* Two-panel Layout — full height */}
        <div className="flex gap-0 h-[calc(100vh-220px)] rounded-2xl border border-border/40 overflow-hidden shadow-sm">

          {/* LEFT SIDEBAR — 1/5 full height, no gap */}
          <div className="w-[22%] shrink-0 flex flex-col gap-0.5 overflow-y-auto bg-muted/30 dark:bg-muted/10 border-r border-border/40 p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 pt-1 pb-3">Ngành nghề</p>
            {INDUSTRIES_DATA.map((ind) => {
              const isSelected = selectedIndustry === ind.id;
              const Icon = ind.icon;
              return (
                <button
                  key={ind.id}
                  type="button"
                  onClick={() => handleSelectIndustry(ind.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                    isSelected
                      ? ind.sidebarSelected + " font-semibold"
                      : "hover:bg-muted/60 text-foreground/80 hover:text-foreground"
                  }`}
                >
                  <div
                    className={`h-7 w-7 shrink-0 rounded-lg flex items-center justify-center border transition-all ${
                      isSelected ? ind.iconSelected : ind.iconBg + " group-hover:scale-105"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs leading-tight line-clamp-2">{ind.label}</span>
                  {isSelected && <ChevronRight className={`h-3.5 w-3.5 ml-auto shrink-0 ${ind.activeText}`} />}
                </button>
              );
            })}
          </div>

          {/* RIGHT PANEL — 4/5 full height */}
          <div className="flex-1 overflow-y-auto bg-card/50 dark:bg-card/30 p-6 space-y-6">
            {/* Panel Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-border/40">
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center border ${currentIndustryObj.iconSelected}`}>
                <CurrentIcon className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className={`text-base font-bold ${currentIndustryObj.activeText}`}>
                  {currentIndustryObj.label}
                </h3>
                <p className="text-xs text-muted-foreground">{currentIndustryObj.code} — Chọn vị trí bạn muốn phỏng vấn</p>
              </div>
            </div>

            {/* Role Groups */}
            <div className="space-y-5">
              {currentIndustryObj.roleGroups.map((group) => (
                <div key={group.groupLabel} className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {group.groupLabel}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {group.roles.map((r) => {
                      const isSelected = position === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setPosition(r)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-sm font-semibold"
                              : "bg-background/80 border-border hover:border-primary/40 hover:bg-muted text-foreground"
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                          {r}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Summary + CTA */}
        <div className="mt-4 p-4 rounded-2xl border border-border bg-card/80 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Vị trí đã chọn:</span>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className={`font-semibold text-sm gap-1.5 py-1 px-3 ${currentIndustryObj.badgeColor}`}>
                🎯 {position}
              </Badge>
              <span className="text-xs text-muted-foreground">— {currentIndustryObj.label}</span>
            </div>
          </div>

          <Button
            size="lg"
            onClick={handleProceedToPersonaSelect}
            disabled={!position}
            className="rounded-xl px-8 font-bold gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:opacity-95 text-white shadow-lg shadow-emerald-500/25 cursor-pointer text-base shrink-0"
          >
            <span>Tiếp Tục Chọn HR Phỏng Vấn</span>
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </main>
    </div>
  );
}

export default InterviewSetupPage;
