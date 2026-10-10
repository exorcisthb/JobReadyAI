import { useCallback, useState, useEffect } from "react";
import logoJr from "@/assets/logo.png";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth } from "@/components/auth-provider";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  Laptop,
  TrendingUp,
  Landmark,
  Users,
  Palette,
  Briefcase,
  ShoppingCart,
  Shield,
  Bot,
  Database,
  Globe,
  Megaphone,
  ChevronRight,
  History,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type RoleGroup = {
  groupLabel: string;
  roles: string[];
};

export type IndustryItem = {
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
export const INDUSTRIES_DATA: IndustryItem[] = [
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
        roles: ["DevOps Engineer", "Cloud Engineer (AWS/GCP/Azure)", "System Administrator", "Network Engineer", "Infrastructure Engineer"],
      },
      {
        groupLabel: "Kiểm thử & Chất lượng",
        roles: ["QA Engineer", "Automation Tester (Selenium/Playwright)", "QC Specialist", "SDET (Software Dev Engineer in Test)"],
      },
      {
        groupLabel: "Dữ liệu & Trí tuệ nhân tạo (AI)",
        roles: ["Data Engineer", "Data Analyst", "Data Scientist", "Machine Learning Engineer", "AI / LLM Engineer", "NLP Engineer", "Computer Vision Engineer", "Business Intelligence (BI)", "Analytics Engineer"],
      },
      {
        groupLabel: "An toàn thông tin (Cybersecurity)",
        roles: ["Security Engineer", "Penetration Tester (PenTest)", "SOC Analyst (L1/L2/L3)", "DevSecOps Engineer", "GRC Analyst"],
      },
      {
        groupLabel: "Sản phẩm & Quản trị",
        roles: [     "Business Analyst (IT)"],
      },
    ],
  },
  {
    id: "marketing",
    label: "Kinh doanh & Marketing",
    code: "Marketing / Sales · Intern, Fresher, Junior (dưới 2 năm)",
    icon: TrendingUp,
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    iconSelected: "bg-amber-500 text-white border-amber-500",
    sidebarSelected: "bg-amber-500/10 border-l-[3px] border-l-amber-500 text-amber-700 dark:text-amber-300",
    badgeColor: "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10",
    activeText: "text-amber-600 dark:text-amber-400",
    roleGroups: [
      {
        groupLabel: "Digital Marketing",
        roles: ["Digital Marketing Specialist", "SEO Specialist", "SEM / Google Ads Specialist", "Email Marketing Specialist", "Performance Marketing"],
      },
      {
        groupLabel: "Sales & Kinh doanh",
        roles: ["Sales Executive", "Account Executive (B2B)"],
      },
      {
        groupLabel: "E-commerce & Growth",
        roles: [ "Growth Hacker", "CRM Specialist", "Marketing Analytics"],
      },
      {
        groupLabel: "Thương hiệu & Sản phẩm",
        roles: ["Brand Marketing Assistant (Intern/Fresher)", "Product Marketing Associate (Junior)"],
      },
      {
        groupLabel: "Trade & Nghiên cứu thị trường",
        roles: ["Trade Marketing Assistant (Intern/Fresher)", "Market Research Assistant (Intern/Fresher)"],
      },
      {
        groupLabel: "Media & Affiliate",
        roles: ["Media Planning Assistant (Intern/Fresher)", "Affiliate Marketing Executive (Junior)"],
      },
    ],
  },
  {
    id: "communications",
    label: "Truyền thông",
    code: "PR / Báo chí / Nội dung · Intern, Fresher, Junior (dưới 2 năm)",
    icon: Megaphone,
    iconBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    iconSelected: "bg-cyan-600 text-white border-cyan-600",
    sidebarSelected: "bg-cyan-500/10 border-l-[3px] border-l-cyan-500 text-cyan-700 dark:text-cyan-300",
    badgeColor: "border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10",
    activeText: "text-cyan-600 dark:text-cyan-400",
    roleGroups: [
      {
        groupLabel: "PR & Quan hệ báo chí",
        roles: ["PR / Communications Executive", "Media Relations Assistant", "Journalist / Reporter"],
      },
      {
        groupLabel: "Nội dung & Biên tập",
        roles: ["Content Writer / Copywriter", "Editorial Assistant", "Communications Assistant (Internal/External)"],
      },
      {
        groupLabel: "Mạng xã hội & Cộng đồng",
        roles: ["Social Media Executive", "Community Executive", "Influencer/KOL Coordinator"],
      },
      {
        groupLabel: "Sự kiện & Truyền thông thương hiệu",
        roles: ["Event Communications Coordinator"],
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
        roles: ["E-commerce Executive", "Shopee / Lazada / TikTok Shop Specialist"],
      },
      {
        groupLabel: "Kho vận & Logistics",
        roles: ["Logistics Coordinator", "Supply Chain Analyst"],
      },
      {
        groupLabel: "Customer & Growth",
        roles: [ "CRM Specialist", "Retention Marketing", "Growth Hacker (E-com)"],
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
        roles: ["Chuyên viên tín dụng", "Chuyên viên thẩm định"],
      },
      {
        groupLabel: "Kế toán & Kiểm toán",
        roles: ["Kiểm toán nội bộ", "Kiểm toán viên (Big4)"],
      },
      {
        groupLabel: "Đầu tư & Tài chính",
        roles: ["Chuyên viên đầu tư", "Financial Analyst", "Actuarial Analyst"],
      },
      {
        groupLabel: "FinTech & Bảo hiểm",
        roles: [ "Payment Specialist", "Claims Specialist"],
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
        roles: ["Recruiter (IT/Non-IT)", "Employer Branding Specialist"],
      },
      {
        groupLabel: "Đào tạo & Phát triển",
        roles: ["Training Specialist"],
      },
      {
        groupLabel: "C&B & Hành chính",
        roles: ["C&B Specialist", "Payroll Specialist", "HR Admin"],
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
        roles: ["UI Designer", "UX Designer", "Product Designer", "UX Researcher"],
      },
      {
        groupLabel: "Visual & Graphic",
        roles: ["Graphic Designer", "Brand Designer", "Visual Designer", "Motion Designer"],
      },
      {
        groupLabel: "Video & 3D",
        roles: ["Video Editor", "3D Artist", "3D Animator", "Content Creator (Video)"],
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
        roles: ["Chuyên viên xuất nhập khẩu", "Customs Specialist", "Logistics Coordinator", "Freight Forwarder"],
      },
      {
        groupLabel: "Quan hệ Quốc tế",
        roles: ["International Business Developer", "Foreign Trade Specialist", "Interpreter / Translator (EN/JP/KR/CN)"],
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
        groupLabel: "Vận hành & Hành chính",
        roles: [  "Executive Assistant", "Customer Service", "Call Center Agent"],
      },
    ],
  },
];

type InterviewQuota = { remaining: number | "unlimited"; limit: number; plan?: string };

function QuotaCounter({ quota }: { quota: InterviewQuota | null }) {
  if (!quota) return null;
  return (
    <Badge
      variant="outline"
      className={`fixed bottom-5 right-5 z-40 rounded-full bg-background/95 px-3 py-2 text-xs shadow-md backdrop-blur ${
        quota.remaining === "unlimited"
          ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
          : quota.remaining > 0
            ? "border-primary/30 text-primary"
            : "border-red-500/30 text-red-500"
      }`}
    >
      Còn lại: <span className="ml-1 font-bold">{quota.remaining === "unlimited" ? "∞" : `${quota.remaining}/${quota.limit}`}</span>
    </Badge>
  );
}

function useInterviewQuota() {
  const { user } = useAuth();
  const [quota, setQuota] = useState<InterviewQuota | null>(null);

  const refreshQuota = useCallback(() => {
    if (!user?.id) return;
    fetch("/api/interview/quota", {
      headers: { "x-user-id": user.id, "x-user-role": user.role ?? "user" },
    })
      .then((response) => response.json())
      .then(setQuota)
      .catch(console.error);
  }, [user?.id, user?.role]);

  useEffect(() => {
    refreshQuota();
  }, [refreshQuota]);

  return { user, quota, refreshQuota };
}

function InterviewTopBar({
  title,
  onBack,
  backText,
  showHistory = false,
}: {
  title?: string;
  onBack?: () => void;
  backText?: string;
  showHistory?: boolean;
}) {
  const { t } = useTranslation();
  return (
    <header className="z-30 flex h-16 shrink-0 items-center justify-between border-b border-border/40 bg-background/90 px-4 backdrop-blur-md sm:px-6">
      {/* Logo – left with sparkles animation & role dashboard navigation */}
      <BrandLogo />

      {/* Page action – far right */}
      <Button
        variant={showHistory ? "outline" : "ghost"}
        size="sm"
        onClick={showHistory ? () => window.location.assign("/interview/history") : onBack || (() => window.location.assign("/cv"))}
        className="gap-2 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
      >
        {showHistory ? <History className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
        <span>{showHistory ? "Lịch sử phỏng vấn" : backText || t("nav.viewCV") || "Quay lại"}</span>
      </Button>
    </header>
  );
}

// ─── Industry and role overview ──────────────────────────────────────────────
export function InterviewSetupPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const cvId = searchParams.get("cv_id") || "";
  const paramPosition = searchParams.get("position") || "";
  const requestedIndustry = searchParams.get("industry") || "";
  const industryFromPosition = INDUSTRIES_DATA.find((industry) =>
    industry.roleGroups.some((group) => group.roles.some((role) => role.toLowerCase() === paramPosition.toLowerCase()))
  )?.id;
  const initialIndustry = INDUSTRIES_DATA.some((industry) => industry.id === requestedIndustry)
    ? requestedIndustry
    : industryFromPosition || "it";
  const [selectedIndustry, setSelectedIndustry] = useState(initialIndustry);
  const [selectedPosition, setSelectedPosition] = useState<string>(() => paramPosition || "");
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(0);
  const [roleSearch, setRoleSearch] = useState("");
  const { quota } = useInterviewQuota();
  const currentIndustry = INDUSTRIES_DATA.find((industry) => industry.id === selectedIndustry) || INDUSTRIES_DATA[0];
  const normalizedRoleSearch = roleSearch.trim().toLocaleLowerCase("vi");
  const visibleRoleGroups = currentIndustry.roleGroups
    .map((group) => ({
      ...group,
      visibleRoles: normalizedRoleSearch
        ? group.roles.filter((role) => role.toLocaleLowerCase("vi").includes(normalizedRoleSearch))
        : group.roles,
    }))
    .filter((group) => group.visibleRoles.length > 0);

  const handleSelectRole = (role: string, groupIndex: number) => {
    setSelectedPosition(role);
    setSelectedGroupIndex(groupIndex);
  };

  const handleContinue = () => {
    if (!selectedPosition) return;
    sessionStorage.setItem("interview_setup", JSON.stringify({
      cvId,
      industry: currentIndustry.id,
      industryLabel: currentIndustry.label,
      position: selectedPosition,
      model: "gemini-2.5-flash",
    }));
    const params = new URLSearchParams({
      cv_id: cvId,
      position: selectedPosition,
      industry: currentIndustry.id,
      group: String(selectedGroupIndex),
    });
    window.location.assign(`/interview/persona?${params.toString()}`);
  };

  const openRoleGroup = (groupIndex: number) => {
    const params = new URLSearchParams({ cv_id: cvId, industry: currentIndustry.id, group: String(groupIndex) });
    if (selectedPosition) params.set("position", selectedPosition);
    else if (paramPosition) params.set("position", paramPosition);
    window.location.assign(`/interview/positions?${params.toString()}`);
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <InterviewTopBar title="Chọn Vị Trí Phỏng Vấn" showHistory />
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <aside className="flex h-36 w-full shrink-0 flex-col border-b border-border/50 bg-muted/20 md:h-auto md:w-72 md:border-b-0 md:border-r">
          <div className="flex h-12 shrink-0 items-center border-b border-border/40 px-4 md:h-[76px] md:px-5">
            <h2 className="text-base font-semibold">Chuyển ngành nghề</h2>
          </div>
          <nav aria-label="Ngành nghề" className="flex min-h-0 flex-1 flex-row gap-1 overflow-x-auto p-2 md:flex-col md:space-y-1 md:overflow-x-hidden md:overflow-y-auto md:p-3">
            {INDUSTRIES_DATA.map((industry) => {
              const Icon = industry.icon;
              const selected = industry.id === selectedIndustry;
              return (
                <button
                  key={industry.id}
                  type="button"
                  aria-current={selected ? "page" : undefined}
                  onClick={() => { setSelectedIndustry(industry.id); setSelectedPosition(""); }}
                  className={`flex min-w-40 shrink-0 items-center gap-2 rounded-lg border-l-2 px-2.5 py-2 text-left text-xs transition-colors md:w-full md:min-w-0 md:gap-3 md:px-3 md:py-3 md:text-sm ${
                    selected
                      ? `${industry.sidebarSelected} border-l-current font-semibold`
                      : "border-l-transparent text-foreground/75 hover:bg-muted/70 hover:text-foreground"
                  }`}
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${selected ? industry.iconSelected : industry.iconBg}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1 leading-snug">{industry.label}</span>
                  {selected && <ChevronRight className={`h-4 w-4 shrink-0 ${industry.activeText}`} />}
                </button>
              );
            })}
          </nav>
          <div className="flex shrink-0 items-center justify-center border-t border-border/60 bg-background/95 px-4 py-3.5 md:px-5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.assign("/cv")}
              className="h-11 gap-2 border border-white/30 bg-gradient-to-b from-sky-500 to-sky-600 px-8 text-white shadow-[0_6px_16px_-4px_rgba(14,165,233,0.55)] transition-all hover:-translate-y-0.5 hover:from-sky-400 hover:to-sky-500 hover:text-white hover:shadow-[0_10px_22px_-4px_rgba(14,165,233,0.65)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Xem CV
            </Button>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex min-h-[76px] shrink-0 items-center justify-between gap-4 border-b border-border/40 px-5 sm:px-8">
            <div>
              <h2 className="text-base font-semibold sm:text-lg">Chọn vị trí phỏng vấn</h2>
              <p className="mt-1 text-xs text-muted-foreground">{currentIndustry.label} · {currentIndustry.code}</p>
            </div>
            <span className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
              Chọn một nhóm nghề để xem toàn bộ vị trí
            </span>
          </div>

          <div className="shrink-0 border-b border-border/40 px-5 py-3 sm:px-8">
            <label className="relative block w-full">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={roleSearch}
                onChange={(event) => setRoleSearch(event.target.value)}
                placeholder="Tìm kiếm vị trí..."
                aria-label="Tìm kiếm vị trí phỏng vấn"
                className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </label>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4 pb-24 sm:p-6 sm:pb-24">
            {visibleRoleGroups.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
              {visibleRoleGroups.map((group) => {
                const groupIndex = currentIndustry.roleGroups.findIndex((item) => item.groupLabel === group.groupLabel);
                const rolesToShow = normalizedRoleSearch ? group.visibleRoles : group.roles.slice(0, 4);
                return (
                <section
                  key={group.groupLabel}
                  className="group relative flex min-h-52 flex-col rounded-xl border border-border/70 bg-card p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <div className="relative flex min-h-6 items-center justify-center">
                    <h3 className="text-center text-sm font-bold text-foreground">{group.groupLabel}</h3>
                    <span className="absolute right-0 text-[11px] font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md border border-border/40">
                      {group.visibleRoles.length} vị trí
                    </span>
                  </div>

                  {/* Chia rõ 2 vị trí trong 1 khung (2 cột rõ ràng, đều đặn) */}
                  <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {rolesToShow.map((role) => {
                      const isSelected = selectedPosition === role;
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => handleSelectRole(role, groupIndex)}
                          title={`Chọn vị trí "${role}"`}
                          className={`flex items-center justify-center rounded-xl px-3.5 py-2.5 text-center text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                            isSelected
                              ? "border-2 border-primary bg-primary/10 text-primary font-semibold shadow-sm ring-2 ring-primary/20"
                              : "border border-border/80 bg-background/80 text-foreground/85 hover:border-primary/50 hover:bg-muted/50"
                          }`}
                        >
                          <span className="truncate">{role}</span>
                          {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-1.5" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Phần + thêm vị trí để lại ngay bên dưới */}
                  <div className="mt-auto flex min-h-8 items-center justify-center pt-3">
                    {!normalizedRoleSearch && group.roles.length > 4 ? (
                      <button
                        type="button"
                        onClick={() => openRoleGroup(groupIndex)}
                        title="Xem toàn bộ các vị trí trong nhóm này"
                        className="inline-flex items-center text-center text-xs font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer py-1"
                      >
                        +{group.roles.length - 4} vị trí
                      </button>
                    ) : <span />}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openRoleGroup(groupIndex)}
                      className="absolute right-4 bottom-4 gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs rounded-lg"
                    >
                      Xem thêm <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </section>
              );
              })}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
                Không tìm thấy vị trí phù hợp.
              </p>
            )}
          </div>

          {/* Sticky Bottom Bar với nút Tiếp tục chọn HR phỏng vấn */}
          <div className="sticky bottom-0 flex shrink-0 items-center justify-between gap-4 border-t border-border/60 bg-background/95 px-5 py-3.5 backdrop-blur sm:px-8 z-30 shadow-sm">
            <div className="flex min-w-0 items-center gap-3">
              <div className="min-w-0">
              <p className="truncate text-sm text-foreground">
                {selectedPosition ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                    Đã chọn: <strong className="font-semibold text-primary">{selectedPosition}</strong>
                  </span>
                ) : (
                  <span className="text-muted-foreground text-xs sm:text-sm">Chọn một vị trí để tiếp tục</span>
                )}
              </p>
              {quota && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Lượt còn: {quota.remaining === "unlimited" ? "∞" : `${quota.remaining}/${quota.limit}`}
                </p>
              )}
              </div>
            </div>
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!selectedPosition}
              className="shrink-0 gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 font-semibold text-white shadow-md transition-all hover:from-amber-400 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Tiếp tục chọn HR phỏng vấn <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Full role list for one selected group ───────────────────────────────────

// ─── Chi tiết mô tả & kỹ năng trọng tâm của các vị trí ────────────────────────
export const ROLE_DETAILS_MAP: Record<string, { description: string; skills: string[] }> = {
  // Web & Mobile
  "Frontend Developer": {
    description: "Phát triển giao diện web tương tác mượt mà, tối ưu hóa trải nghiệm người dùng (UX) và hiệu năng hiển thị; chuyển đổi thiết kế Figma thành code responsive chuẩn SEO.",
    skills: ["React / Vue / Next.js", "TypeScript / JavaScript", "HTML5 & Tailwind CSS", "State & API Integration"],
  },
  "Backend Developer": {
    description: "Thiết kế kiến trúc hệ thống máy chủ, xây dựng RESTful / GraphQL API bảo mật, xử lý cơ sở dữ liệu quy mô lớn và tối ưu hóa hiệu năng nghiệp vụ backend.",
    skills: ["Node.js / Java / Go / Python", "PostgreSQL / MySQL / MongoDB", "Microservices & Caching", "API Security & Docker"],
  },
  "Fullstack Developer": {
    description: "Lập trình toàn diện từ giao diện người dùng (Client-side) đến logic máy chủ, database và triển khai hệ thống (Server-side) cho các ứng dụng web phức tạp.",
    skills: ["Frontend & Backend", "System Architecture", "Database Modeling", "CI/CD & Cloud Deployment"],
  },
  "Mobile Developer (iOS/Android/Flutter)": {
    description: "Xây dựng ứng dụng di động đa nền tảng hoặc native, tối ưu trải nghiệm cảm ứng mượt mà, tích hợp push notification và API dịch vụ.",
    skills: ["Flutter / React Native", "Swift / Kotlin", "Mobile UI/UX", "Offline Storage & APIs"],
  },
  "React Native Developer": {
    description: "Chuyên sâu phát triển ứng dụng di động đa nền tảng iOS & Android với React Native, tối ưu hiệu năng native bridge và trải nghiệm người dùng.",
    skills: ["React Native & Redux", "Mobile Components", "Native Modules Bridge", "Cross-platform Debugging"],
  },
  "Vue.js / Angular Developer": {
    description: "Xây dựng các ứng dụng đơn trang (SPA) hoặc quy mô doanh nghiệp với kiến trúc component hiện đại của Vue.js hoặc Angular.",
    skills: ["Vue 3 / Angular", "State Management (Pinia/NgRx)", "Routing & Component Lifecycle", "TypeScript"],
  },
  "TypeScript / Node.js Developer": {
    description: "Phát triển các ứng dụng mạng, microservices và API thời gian thực tốc độ cao với nền tảng Node.js và hệ thống kiểu dữ liệu an toàn TypeScript.",
    skills: ["Node.js & Express / NestJS", "TypeScript Strict Types", "Async / Event Loop", "ORM & Database"],
  },

  // DevOps & Cloud
  "DevOps Engineer": {
    description: "Tự động hóa toàn bộ quy trình CI/CD, thiết lập hạ tầng dưới dạng mã (IaC), giám sát vận hành hệ thống và đảm bảo tính sẵn sàng cao.",
    skills: ["Docker & Kubernetes", "CI/CD Pipelines", "AWS / Azure / GCP", "Terraform & Linux"],
  },
  "Cloud Engineer (AWS/GCP/Azure)": {
    description: "Thiết kế, triển khai và tối ưu chi phí hạ tầng trên các nền tảng đám mây lớn; thiết lập mạng VPC an toàn và bảo mật dữ liệu.",
    skills: ["Cloud Architecture", "VPC & Networking", "Cost Optimization", "IAM & Cloud Security"],
  },

  // Truyền thông (Intern/Fresher/Junior, dưới 2 năm kinh nghiệm)
  "Brand Marketing Assistant (Intern/Fresher)": {
    description: "Hỗ trợ triển khai hoạt động thương hiệu, nội dung chiến dịch, theo dõi tiến độ và tổng hợp kết quả ở cấp độ đầu vào.",
    skills: ["Brand Guideline", "Campaign Brief", "Content Coordination", "Basic Reporting"],
  },
  "Product Marketing Associate (Junior)": {
    description: "Hỗ trợ nghiên cứu khách hàng và đối thủ, chuẩn bị thông điệp sản phẩm và phối hợp triển khai hoạt động ra mắt, truyền thông sản phẩm.",
    skills: ["Customer Persona", "Value Proposition", "Competitive Research", "Go-to-Market Support"],
  },
  "Trade Marketing Assistant (Intern/Fresher)": {
    description: "Hỗ trợ chương trình khuyến mãi và kích hoạt tại điểm bán, chuẩn bị POSM và tổng hợp dữ liệu sell-in/sell-out cơ bản.",
    skills: ["POSM", "Retail Activation", "Promotion Tracking", "Excel Reporting"],
  },
  "Market Research Assistant (Intern/Fresher)": {
    description: "Hỗ trợ nghiên cứu thị trường từ xác định câu hỏi, thu thập dữ liệu đến kiểm tra kết quả và trình bày insight ban đầu.",
    skills: ["Desk Research", "Survey Support", "Data Checking", "Insight Presentation"],
  },
  "Media Planning Assistant (Intern/Fresher)": {
    description: "Hỗ trợ lập kế hoạch kênh truyền thông, theo dõi ngân sách và tiến độ quảng cáo, kiểm tra số liệu phân phối chiến dịch.",
    skills: ["Media Mix", "Reach & Frequency", "CPM / CPC", "Campaign Reporting"],
  },
  "Affiliate Marketing Executive (Junior)": {
    description: "Hỗ trợ kết nối publisher/creator, theo dõi link và đơn hàng, đối soát chuyển đổi và tổng hợp hiệu quả chiến dịch affiliate.",
    skills: ["Affiliate Tracking", "UTM Links", "CPA / Conversion", "Publisher Coordination"],
  },
  "PR / Communications Executive": {
    description: "Hỗ trợ triển khai hoạt động PR, chuẩn bị thông cáo báo chí, theo dõi tin tức và phối hợp xử lý yêu cầu truyền thông ở cấp độ đầu vào.",
    skills: ["Press Release", "Media Monitoring", "Fact Checking", "PR Planning"],
  },
  "Media Relations Assistant": {
    description: "Hỗ trợ cập nhật danh sách báo chí, gửi thông tin đúng đối tượng, theo dõi phản hồi và sắp xếp lịch trao đổi với phóng viên.",
    skills: ["Media List", "Pitch Email", "Press Clipping", "Follow-up & Coordination"],
  },
  "Journalist / Reporter": {
    description: "Tìm đề tài, xác minh thông tin, phỏng vấn nguồn tin và viết tin/bài theo yêu cầu chính xác, cân bằng và đúng thời hạn.",
    skills: ["Interviewing", "Source Verification", "News Writing", "Editorial Ethics"],
  },
  "Content Writer / Copywriter": {
    description: "Nghiên cứu đối tượng và viết nội dung rõ ràng, đúng giọng thương hiệu cho bài viết, mạng xã hội, email hoặc chiến dịch truyền thông.",
    skills: ["Research & Fact Checking", "Headline Writing", "Brand Voice", "Editing & Proofreading"],
  },
  "Editorial Assistant": {
    description: "Hỗ trợ biên tập viên kiểm tra bản thảo, chuẩn hóa nguồn, sửa lỗi trình bày và theo dõi lịch xuất bản nội dung.",
    skills: ["Proofreading", "Source & Citation Checks", "CMS Publishing", "Editorial Calendar"],
  },
  "Communications Assistant (Internal/External)": {
    description: "Hỗ trợ soạn và đăng thông tin nội bộ hoặc bên ngoài, kiểm tra tính nhất quán và phối hợp lấy xác nhận từ các bên liên quan.",
    skills: ["Internal Updates", "Message Clarity", "Stakeholder Coordination", "Content Calendar"],
  },
  "Social Media Executive": {
    description: "Lên lịch nội dung mạng xã hội, viết caption, theo dõi chỉ số cơ bản và phối hợp phản hồi bình luận theo hướng dẫn thương hiệu.",
    skills: ["Platform Publishing", "Caption Writing", "Content Calendar", "Engagement Metrics"],
  },
  "Community Executive": {
    description: "Hỗ trợ chăm sóc cộng đồng trực tuyến, phản hồi câu hỏi thường gặp, chuyển tiếp vấn đề và tổng hợp phản hồi người dùng.",
    skills: ["Community Guidelines", "Moderation", "Response Tone", "Issue Escalation"],
  },
  "Influencer Marketing": {
    description: "Hỗ trợ tìm kiếm và điều phối creator/KOL, theo dõi nội dung được duyệt, thời hạn đăng và kết quả chiến dịch ở cấp độ đầu vào.",
    skills: ["Creator Research", "Brief & Deliverables", "Disclosure Checks", "Campaign Tracking"],
  },
  "Influencer/KOL Coordinator": {
    description: "Hỗ trợ tìm kiếm và điều phối creator/KOL, theo dõi nội dung được duyệt, thời hạn đăng và kết quả chiến dịch ở cấp độ đầu vào.",
    skills: ["Creator Research", "Brief & Deliverables", "Disclosure Checks", "Campaign Tracking"],
  },
  "Event Communications Coordinator": {
    description: "Hỗ trợ nội dung và thông tin cho sự kiện: cập nhật lịch, chuẩn bị thông báo, phối hợp đầu mối và tổng hợp phản hồi sau chương trình.",
    skills: ["Event Brief", "Run of Show", "Audience Updates", "Post-event Recap"],
  },

  // QA & Testing
  "QA Engineer": {
    description: "Lập kế hoạch kiểm thử, thiết kế test case chi tiết và thực thi kiểm thử phần mềm để đảm bảo chất lượng và độ ổn định trước khi release.",
    skills: ["Test Plan & Test Cases", "Manual Testing", "API Testing (Postman)", "Bug Tracking (Jira)"],
  },
  "Automation Tester (Selenium/Playwright)": {
    description: "Xây dựng và duy trì framework kiểm thử tự động cho web, mobile và API, giảm thiểu lỗi hồi quy trong chu kỳ phát triển liên tục.",
    skills: ["Playwright / Selenium", "Automation Frameworks", "CI/CD Integration", "Test Scripting"],
  },
  "QC Specialist": {
    description: "Kiểm soát chất lượng quy trình phát triển sản phẩm, đối chiếu yêu cầu kỹ thuật và nghiệm thu tính năng phần mềm theo tiêu chuẩn.",
    skills: ["Quality Control", "Requirements Analysis", "Regression Testing", "Process Auditing"],
  },

  // Data & AI
  "Data Engineer": {
    description: "Thiết kế, xây dựng và vận hành đường ống dữ liệu (ETL/ELT), kho dữ liệu quy mô lớn (Data Warehouse) phục vụ phân tích dữ liệu và AI.",
    skills: ["Data Pipeline (ETL/ELT)", "SQL & BigQuery / Snowflake", "Python & Apache Spark", "Data Warehousing"],
  },
  "Data Analyst": {
    description: "Thu thập, làm sạch và trực quan hóa dữ liệu kinh doanh; phân tích xu hướng và cung cấp insight chiến lược giúp doanh nghiệp ra quyết định.",
    skills: ["SQL & Python / R", "Power BI / Tableau", "Data Visualization", "Business Analytics"],
  },
  "Data Scientist": {
    description: "Nghiên cứu các thuật toán toán học, xây dựng mô hình dự báo và khai phá dữ liệu chuyên sâu để giải quyết bài toán phức tạp của doanh nghiệp.",
    skills: ["Machine Learning & Statistics", "Python (Pandas, Scikit-learn)", "Predictive Modeling", "A/B Testing"],
  },
  "Machine Learning Engineer": {
    description: "Nghiên cứu, huấn luyện và đưa các mô hình học máy, Deep Learning và LLM vào môi trường production ổn định với độ trễ thấp.",
    skills: ["PyTorch / TensorFlow", "MLOps Pipelines", "Model Deployment & Serving", "Deep Learning & NLP"],
  },
  "AI / LLM Engineer": {
    description: "Phát triển các giải pháp Generative AI, RAG (Retrieval-Augmented Generation), fine-tuning và ứng dụng mô hình ngôn ngữ lớn vào nghiệp vụ thực tế.",
    skills: ["LLM & Prompt Engineering", "LangChain / LlamaIndex", "Vector Database", "RAG Architecture"],
  },

  // Security
  "Security Engineer": {
    description: "Bảo vệ hạ tầng mạng và dữ liệu doanh nghiệp; kiểm tra lỗ hổng bảo mật, thiết lập tường lửa và phản ứng với các mối đe dọa an ninh mạng.",
    skills: ["Cybersecurity Fundamentals", "Vulnerability Assessment", "Firewall & Network Security", "Security Compliance"],
  },

  // Product & Design

  "UI/UX Designer": {
    description: "Nghiên cứu hành vi người dùng, thiết kế wireframe, prototype tương tác và hoàn thiện giao diện đồ họa đẹp mắt, chuẩn trải nghiệm.",
    skills: ["Figma & Prototyping", "Design System", "User Research", "Wireframing & UI Kit"],
  },
};

export function getRoleDetails(role: string, groupLabel: string, industryLabel: string) {
  if (ROLE_DETAILS_MAP[role]) {
    return ROLE_DETAILS_MAP[role];
  }
  // Smart fallback cho các vị trí khác
  return {
    description: `Đảm nhận vai trò chuyên môn ${role} thuộc nhóm ${groupLabel}. Kiểm tra năng lực thực chiến, kỹ năng nghiệp vụ thực tế và tư duy giải quyết vấn đề.`,
    skills: [`Chuyên môn ${role}`, "Kỹ năng thực chiến", "Quy trình & Tiêu chuẩn", "Phối hợp đội ngũ"],
  };
}

export function InterviewPositionsPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const cvId = searchParams.get("cv_id") || "";
  const industryId = searchParams.get("industry") || "";
  const groupIndex = Number(searchParams.get("group"));
  const initialPosition = searchParams.get("position") || "";
  const industry = INDUSTRIES_DATA.find((item) => item.id === industryId);
  const group = Number.isInteger(groupIndex) ? industry?.roleGroups[groupIndex] : undefined;
  const [position, setPosition] = useState(() => group?.roles.includes(initialPosition) ? initialPosition : "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user, quota } = useInterviewQuota();

  if (!industry || !group) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <InterviewTopBar onBack={() => window.location.assign(`/interview/setup?cv_id=${encodeURIComponent(cvId)}`)} backText="Quay lại" />
        <div className="m-auto flex flex-col items-center gap-4 px-6 text-center">
          <h2 className="text-lg font-semibold">Không tìm thấy nhóm vị trí</h2>
          <Button onClick={() => window.location.assign(`/interview/setup?cv_id=${encodeURIComponent(cvId)}`)}>
            Quay lại chọn ngành
          </Button>
        </div>
      </div>
    );
  }

  const handleSelectPosition = (selectedRole: string) => {
    setPosition(selectedRole);
    setErrorMessage(null);
    sessionStorage.setItem("interview_setup", JSON.stringify({
      cvId,
      industry: industry.id,
      industryLabel: industry.label,
      position: selectedRole,
      model: "gemini-2.5-flash",
    }));
    const params = new URLSearchParams({
      cv_id: cvId,
      position: selectedRole,
      industry: industry.id,
      group: String(groupIndex),
    });
    window.location.assign(`/interview/persona?${params.toString()}`);
  };

  const handleContinue = () => {
    if (!position) {
      setErrorMessage("Vui lòng chọn vị trí ứng tuyển mong muốn.");
      return;
    }
    sessionStorage.setItem("interview_setup", JSON.stringify({
      cvId,
      industry: industry.id,
      industryLabel: industry.label,
      position,
      model: "gemini-2.5-flash",
    }));
    const params = new URLSearchParams({
      cv_id: cvId,
      position,
      industry: industry.id,
      group: String(groupIndex),
    });
    window.location.assign(`/interview/persona?${params.toString()}`);
  };

  const backToOverview = () => {
    const params = new URLSearchParams({ cv_id: cvId, industry: industry.id });
    window.location.assign(`/interview/setup?${params.toString()}`);
  };

  return (
    <div className="interview-role-selection-page flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <header className="z-30 flex h-16 shrink-0 items-center justify-between border-b border-border/40 bg-background/90 px-4 backdrop-blur-md sm:px-6">
        <BrandLogo />
        <Button variant="outline" size="sm" onClick={backToOverview} className="gap-2 rounded-xl">
          <ArrowLeft className="h-4 w-4" />
          Quay lại chọn ngành nghề
        </Button>
      </header>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-[76px] shrink-0 items-center justify-between gap-4 border-b border-border/40 px-5 sm:px-8">
          <div>
            <h2 className="text-base font-semibold sm:text-lg">Chọn vị trí phỏng vấn</h2>
            <p className="mt-1 text-xs text-muted-foreground">{industry.label} · {group.groupLabel}</p>
          </div>
          <span className="hidden text-xs text-muted-foreground sm:block">{group.roles.length} vị trí</span>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 pb-28 sm:p-8 sm:pb-28">
          {errorMessage && <p role="alert" className="mb-4 text-sm text-destructive">{errorMessage}</p>}
          <div className="mx-auto grid max-w-[1600px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {group.roles.map((role) => {
              const selected = position === role;
              const info = getRoleDetails(role, group.groupLabel, industry.label);
              return (
                <button
                  key={role}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => { setPosition(role); setErrorMessage(null); }}
                  className={`group relative flex flex-col justify-between rounded-2xl border-2 p-5 text-center transition-all duration-200 cursor-pointer min-h-[175px] ${
                    selected
                      ? "border-primary bg-primary/[0.04] dark:bg-primary/[0.08] shadow-md ring-2 ring-primary/20 scale-[1.01]"
                      : "border-border/80 bg-card hover:border-primary/40 hover:shadow-sm hover:bg-muted/20"
                  }`}
                >
                  <div>
                    {/* Header: Title + Radio Checkbox */}
                    <div className="relative flex items-start justify-center gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className={`text-center text-base font-bold tracking-tight transition-colors ${selected ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
                          {role}
                        </h3>
                      </div>
                      <span className={`absolute right-0 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all mt-0.5 ${
                        selected 
                          ? "border-primary bg-primary text-primary-foreground" 
                          : "border-muted-foreground/30 bg-muted/20 group-hover:border-primary/50"
                      }`}>
                        {selected && <Check className="h-3 w-3 stroke-[3]" />}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mt-2.5 text-center text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {info.description}
                    </p>
                  </div>

                  {/* Skills / Focus tags */}
                  {info.skills && info.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap justify-center gap-1.5 pt-3 border-t border-border/40">
                      {info.skills.map((skill) => (
                        <span
                          key={skill}
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors ${
                            selected
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "bg-muted/60 text-muted-foreground border border-border/50"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="sticky bottom-0 flex shrink-0 items-center justify-between gap-4 border-t border-border/50 bg-background/95 px-5 py-3 backdrop-blur sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0">
            <p className="truncate text-sm text-foreground">
              {position ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                  Đã chọn: <strong className="font-semibold text-primary">{position}</strong>
                </span>
              ) : (
                <span className="text-muted-foreground text-xs sm:text-sm">Chọn một vị trí để tiếp tục</span>
              )}
            </p>
            {quota && <p className="mt-1 text-xs text-muted-foreground">Lượt còn: {quota.remaining === "unlimited" ? "∞" : `${quota.remaining}/${quota.limit}`}</p>}
            </div>
          </div>
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!position}
            className="shrink-0 gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-6 font-semibold text-white shadow-md transition-all hover:from-amber-400 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Tiếp tục chọn HR phỏng vấn <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InterviewSetupPage;
