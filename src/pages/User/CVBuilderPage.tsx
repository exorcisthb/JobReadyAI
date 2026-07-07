import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowLeft,
  Download,
  Save,
  Eye,
  Plus,
  Trash2,
  X,
  Check,
  Sparkles,
  PlusCircle,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Code,
  Target,
  Heart,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  FileText,
  Home,
  UserCircle,
  BookOpen,
  GraduationCap as InterviewIcon,
  Settings,
  LogOut,
  Menu,
  List,
  Newspaper,
  Upload,
  Palette,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/dashboard-header";
import { useUserNavItems } from "@/pages/User/user-nav-items";
import { AIChatBubble } from "@/components/AIChatBubble";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { saveDraft, deleteDraft } from "@/lib/draft-storage";
import type { DraftCV } from "@/lib/draft-storage";
import type { NavItem } from "@/components/dashboard-header";

interface CVTemplateColor {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
}

interface CVTemplate {
  id: string;
  name: string;
  description: string;
  style: "simple" | "impressive" | "professional" | "harvard" | "it" | "designer";
  layout: "sidebar" | "single" | "two-column" | "centered" | "impressive" | "modern-split" | "sidebar-light" | "timeline-blue" | "sidebar-dark" | "gradient-header" | "passion-clean" | "bright-split" | "clarity-standard" | "basic-split" | "elegant-classic" | "executive-banner" | "corporate-blue" | "soft-pink" | "maroon-classic" | "ocean-grid" | "minimal-line";
  tags: string[];
  colors: CVTemplateColor[];
}

interface SelectedCVTemplate extends CVTemplate {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface Skill {
  name: string;
  level: number;
}

interface CVData {
  id?: string;
  title: string;
  fullName: string;
  jobTitle: string;
  dateOfBirth: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  objective?: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: string[];
  hobbies: string[];
  certifications: string[];
  avatar?: string;
  sectionOrder?: string[]; // Controls render order of main content sections
  fontFamily?: string;
  fontSize?: "small" | "medium" | "large" | "xlarge";
  lineHeight?: number;
  background?: string;
  sectionColumns?: Record<string, "left" | "right">;
}

type TemplateFilter = "all" | "simple" | "professional" | "modern" | "impressive" | "harvard" | "ats";

export const cvTemplates: CVTemplate[] = [
  {
    id: "modern-1",
    name: i18n.t("cv.builder.templateModern1"),
    description: i18n.t("cv.builder.templateModern1Desc"),
    style: "simple",
    layout: "modern-split",
    tags: ["ATS", i18n.t("cv.builder.filterSimple")],
    colors: [
      { primaryColor: "#991b1b", secondaryColor: "#c2410c", accentColor: "#f97316", textColor: "#FFFFFF" },
      { primaryColor: "#1e3a8a", secondaryColor: "#2563eb", accentColor: "#60a5fa", textColor: "#FFFFFF" },
      { primaryColor: "#115e59", secondaryColor: "#0f766e", accentColor: "#14b8a6", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "impressive-4",
    name: i18n.t("cv.builder.templateImpressive4"),
    description: i18n.t("cv.builder.templateImpressive4Desc"),
    style: "impressive",
    layout: "sidebar-light",
    tags: ["ATS", i18n.t("cv.builder.filterSimple"), i18n.t("cv.builder.filterModern")],
    colors: [
      { primaryColor: "#065f46", secondaryColor: "#047857", accentColor: "#10b981", textColor: "#FFFFFF" },
      { primaryColor: "#581c87", secondaryColor: "#6b21a8", accentColor: "#a855f7", textColor: "#FFFFFF" },
      { primaryColor: "#374151", secondaryColor: "#4b5563", accentColor: "#9ca3af", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "student-3",
    name: i18n.t("cv.builder.templateStudent3"),
    description: i18n.t("cv.builder.templateStudent3Desc"),
    style: "designer",
    layout: "timeline-blue",
    tags: ["ATS", i18n.t("cv.builder.filterProfessional"), i18n.t("cv.builder.filterModern")],
    colors: [
      { primaryColor: "#1d4ed8", secondaryColor: "#1e40af", accentColor: "#3b82f6", textColor: "#FFFFFF" },
      { primaryColor: "#b45309", secondaryColor: "#d97706", accentColor: "#f59e0b", textColor: "#FFFFFF" },
      { primaryColor: "#7c2d12", secondaryColor: "#9a3412", accentColor: "#ea580c", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "outstanding-10",
    name: i18n.t("cv.builder.templateOutstanding10"),
    description: i18n.t("cv.builder.templateOutstanding10Desc"),
    style: "professional",
    layout: "sidebar-dark",
    tags: ["ATS", i18n.t("cv.builder.filterProfessional")],
    colors: [
      { primaryColor: "#0f766e", secondaryColor: "#115e59", accentColor: "#14b8a6", textColor: "#FFFFFF" },
      { primaryColor: "#1e293b", secondaryColor: "#334155", accentColor: "#64748b", textColor: "#FFFFFF" },
      { primaryColor: "#311084", secondaryColor: "#3730a3", accentColor: "#6366f1", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "gradient-1",
    name: i18n.t("cv.builder.templateGradient1"),
    description: i18n.t("cv.builder.templateGradient1Desc"),
    style: "impressive",
    layout: "gradient-header",
    tags: ["ATS", i18n.t("cv.builder.filterImpressive")],
    colors: [
      { primaryColor: "#4f46e5", secondaryColor: "#db2777", accentColor: "#f43f5e", textColor: "#FFFFFF" },
      { primaryColor: "#0f766e", secondaryColor: "#0284c7", accentColor: "#06b6d4", textColor: "#FFFFFF" },
      { primaryColor: "#111827", secondaryColor: "#374151", accentColor: "#9ca3af", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "passion-1",
    name: i18n.t("cv.builder.templatePassion"),
    description: i18n.t("cv.builder.templatePassionDesc"),
    style: "harvard",
    layout: "passion-clean",
    tags: ["ATS", i18n.t("cv.builder.filterImpressive")],
    colors: [
      { primaryColor: "#1f2937", secondaryColor: "#4b5563", accentColor: "#f59e0b", textColor: "#FFFFFF" },
      { primaryColor: "#881337", secondaryColor: "#9f1239", accentColor: "#fb7185", textColor: "#FFFFFF" },
      { primaryColor: "#064e3b", secondaryColor: "#047857", accentColor: "#34d399", textColor: "#FFFFFF" }
    ]
  },
  // ===== NEW TEMPLATES FOR PAGE 2 =====
  {
    id: "executive-banner",
    name: i18n.t("cv.builder.templateExecutiveBanner"),
    description: i18n.t("cv.builder.templateExecutiveBannerDesc"),
    style: "professional",
    layout: "executive-banner",
    tags: ["ATS", i18n.t("cv.builder.filterProfessional"), i18n.t("cv.builder.filterModern")],
    colors: [
      { primaryColor: "#1d4ed8", secondaryColor: "#1e3a8a", accentColor: "#3b82f6", textColor: "#FFFFFF" },
      { primaryColor: "#0f766e", secondaryColor: "#115e59", accentColor: "#14b8a6", textColor: "#FFFFFF" },
      { primaryColor: "#1f2937", secondaryColor: "#374151", accentColor: "#9ca3af", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "corporate-blue",
    name: i18n.t("cv.builder.templateCorporateBlue"),
    description: i18n.t("cv.builder.templateCorporateBlueDesc"),
    style: "professional",
    layout: "corporate-blue",
    tags: ["ATS", i18n.t("cv.builder.filterProfessional")],
    colors: [
      { primaryColor: "#1d4ed8", secondaryColor: "#1e3a8a", accentColor: "#3b82f6", textColor: "#FFFFFF" },
      { primaryColor: "#0f766e", secondaryColor: "#115e59", accentColor: "#14b8a6", textColor: "#FFFFFF" },
      { primaryColor: "#1f2937", secondaryColor: "#374151", accentColor: "#9ca3af", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "soft-pink",
    name: i18n.t("cv.builder.templateSoftPink"),
    description: i18n.t("cv.builder.templateSoftPinkDesc"),
    style: "designer",
    layout: "soft-pink",
    tags: ["ATS", i18n.t("cv.builder.filterModern"), i18n.t("cv.builder.filterDesigner")],
    colors: [
      { primaryColor: "#be185d", secondaryColor: "#fce7f3", accentColor: "#f472b6", textColor: "#FFFFFF" },
      { primaryColor: "#9333ea", secondaryColor: "#f3e8ff", accentColor: "#c084fc", textColor: "#FFFFFF" },
      { primaryColor: "#ea580c", secondaryColor: "#ffedd5", accentColor: "#fb923c", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "maroon-classic",
    name: i18n.t("cv.builder.templateMaroonClassic"),
    description: i18n.t("cv.builder.templateMaroonClassicDesc"),
    style: "professional",
    layout: "maroon-classic",
    tags: ["ATS", i18n.t("cv.builder.filterProfessional"), i18n.t("cv.builder.filterClassic")],
    colors: [
      { primaryColor: "#7f1d1d", secondaryColor: "#991b1b", accentColor: "#dc2626", textColor: "#FFFFFF" },
      { primaryColor: "#0f172a", secondaryColor: "#1e293b", accentColor: "#64748b", textColor: "#FFFFFF" },
      { primaryColor: "#065f46", secondaryColor: "#047857", accentColor: "#10b981", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "ocean-grid",
    name: i18n.t("cv.builder.templateOceanGrid"),
    description: i18n.t("cv.builder.templateOceanGridDesc"),
    style: "it",
    layout: "ocean-grid",
    tags: ["ATS", i18n.t("cv.builder.filterModern"), i18n.t("cv.builder.filterTech")],
    colors: [
      { primaryColor: "#0e7490", secondaryColor: "#155e75", accentColor: "#06b6d4", textColor: "#FFFFFF" },
      { primaryColor: "#1e3a8a", secondaryColor: "#1e40af", accentColor: "#3b82f6", textColor: "#FFFFFF" },
      { primaryColor: "#0f172a", secondaryColor: "#334155", accentColor: "#64748b", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "minimal-line",
    name: i18n.t("cv.builder.templateMinimalLine"),
    description: i18n.t("cv.builder.templateMinimalLineDesc"),
    style: "simple",
    layout: "minimal-line",
    tags: ["ATS", i18n.t("cv.builder.filterSimple"), i18n.t("cv.builder.filterModern")],
    colors: [
      { primaryColor: "#1f2937", secondaryColor: "#4b5563", accentColor: "#0ea5e9", textColor: "#FFFFFF" },
      { primaryColor: "#0f172a", secondaryColor: "#1e293b", accentColor: "#06b6d4", textColor: "#FFFFFF" },
      { primaryColor: "#374151", secondaryColor: "#6b7280", accentColor: "#9ca3af", textColor: "#FFFFFF" }
    ]
  }
];

const requestedSecondPageTemplateIds = ["executive-banner", "corporate-blue", "soft-pink", "maroon-classic", "ocean-grid", "minimal-line"] as const;
const templatePages: CVTemplate[][] = [
  cvTemplates.filter((template) => !requestedSecondPageTemplateIds.includes(template.id as (typeof requestedSecondPageTemplateIds)[number])),
  cvTemplates.filter((template) => requestedSecondPageTemplateIds.includes(template.id as (typeof requestedSecondPageTemplateIds)[number])),
];

const templateFilterOptions: { id: TemplateFilter; label: string; icon: React.ReactElement }[] = [
  { id: "all", label: i18n.t("cv.builder.filterAll"), icon: <LayoutGrid className="h-4 w-4" /> },
  { id: "simple", label: i18n.t("cv.builder.filterSimple"), icon: <FileText className="h-4 w-4" /> },
  { id: "professional", label: i18n.t("cv.builder.filterProfessional"), icon: <Briefcase className="h-4 w-4" /> },
  { id: "modern", label: i18n.t("cv.builder.filterModern"), icon: <Sparkles className="h-4 w-4" /> },
  { id: "impressive", label: i18n.t("cv.builder.filterImpressive"), icon: <Award className="h-4 w-4" /> },
  { id: "harvard", label: i18n.t("cv.builder.filterHarvard"), icon: <GraduationCap className="h-4 w-4" /> },
  { id: "ats", label: i18n.t("cv.builder.filterAts"), icon: <Check className="h-4 w-4" /> },
];

const matchesTemplateFilter = (template: CVTemplate, filter: TemplateFilter) => {
  if (filter === "all") return true;
  if (filter === "ats") return template.tags.some((tag) => tag.toLowerCase() === "ats");
  if (filter === "modern") return template.tags.some((tag) => tag.toLowerCase().includes("hi")) || template.layout.includes("modern");
  if (filter === "impressive") return template.style === "impressive";
  return template.style === filter;
};

const defaultCVData: CVData = {
  title: "",
  fullName: "",
  jobTitle: "",
  dateOfBirth: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  objective: "", // Empty so placeholder is shown, and edit doesn't require deleting spaces
  experience: [
    { id: "1", company: "", position: "", startDate: "", endDate: "", description: "" },
    { id: "2", company: "", position: "", startDate: "", endDate: "", description: "" }
  ],
  education: [
    { id: "1", school: "", degree: "", field: "", startDate: "", endDate: "" }
  ],
  skills: [
    { name: "", level: 70 },
    { name: "", level: 70 },
    { name: "", level: 70 }
  ],
  languages: ["", "", ""],
  hobbies: ["", "", ""],
  certifications: ["", ""],
  sectionOrder: ["objective", "experience", "education", "certifications", "skills", "languages", "hobbies"],
};

// ============ SAMPLE CV DATA FOR EACH TEMPLATE ============

const sampleCVData: Record<string, CVData> = {
  "modern-1": {
    title: "CV Hành chính Tổng hợp",
    fullName: "Đỗ Quỳnh Mai",
    jobTitle: "Nhân Viên Lễ Tân Hành Chính",
    dateOfBirth: "25/08/1998",
    address: "Ba Đình, Hà Nội",
    phone: "(024) 6580 5055",
    email: "mai.dq@email.com",
    website: "linkedin.com/in/quynhmai",
    objective: "Với 5 năm kinh nghiệm làm Lễ tân Hành chính Văn phòng, tôi mong muốn được phát triển chuyên môn trong lĩnh vực hành chính - nhân sự, đặc biệt là nâng cao quản lý hồ sơ, tối ưu hóa quy trình hành chính và tổ chức công việc hiệu quả. Trong 2-3 năm tới, tôi đặt mục tiêu trở thành Chuyên viên Hành chính Tổng hợp, đóng góp cho sự vận hành chuyên nghiệp và ổn định của doanh nghiệp.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    experience: [
      { id: "e1", company: "SVT Investment & Development Co., Ltd", position: "Nhân Viên Lễ Tân Hành Chính", startDate: "09/2023", endDate: "Hiện tại", description: "• Tiếp đón và hỗ trợ khách hàng, đối tác. Quản lý hệ thống điện thoại, giải đáp thắc mắc cơ bản từ khách hàng, đối tác.\n• Tiếp nhận và xử lý khoảng 80-100 cuộc gọi/ngày, đảm bảo các kết nối nhanh chóng, tỷ lệ phản hồi đúng bộ phận đạt 98%.\n• Thực hiện đăng ký tài khoản đăng ký vé máy bay, khách sạn cho cán bộ đi công tác.\n• Theo dõi và cấp phát hơn 200 văn phòng phẩm hàng tháng, giúp giảm lãng phí 15% so với trước.\n• Hỗ trợ chuẩn bị tài liệu họp, tài liệu chuẩn bị cho các cuộc họp hội thảo, sự kiện của SVT.\n• Quản lý tài khoản taxi, ăn uống nghệ thuật cho nhân viên đi công tác: thực hiện đề nghị thanh toán các chi phí liên quan.\n• Theo dõi và nhận hơn 10 loại chi phí cố định hàng tháng (điện, nước, internet, điện thoại...), đảm bảo không xảy ra trường hợp ngắt dịch vụ làm ảnh hưởng đến hoạt động công ty." },
      { id: "e2", company: "MW Finance Innovation Co.", position: "Nhân Viên Hành Chính Văn Phòng", startDate: "08/2020", endDate: "07/2023", description: "• Lưu trữ và bảo mật tài liệu hợp đồng, quyết định nhân sự.\n• Theo dõi công văn đi/đến thường nhật cho 120+ nhân viên, đảm bảo thanh toán đúng hạn.\n• Lưu trữ và cập nhật hợp đồng, quyết định nhân sự.\n• Hỗ trợ tổ chức 10+ sự kiện nội bộ, tăng gắn kết đội ngũ." }
    ],
    education: [
      { id: "ed1", school: "Đại học Ngoại thương", degree: "Cử nhân Quản trị Kinh doanh", field: "Quản trị Kinh doanh", startDate: "2016", endDate: "2020" }
    ],
    skills: [
      { name: "Tin học văn phòng", level: 90 },
      { name: "Giao tiếp & Đàm phán", level: 85 },
      { name: "Quản lý thời gian", level: 80 }
    ],
    languages: ["Tiếng Anh giao tiếp"],
    hobbies: ["Đọc sách", "Yoga"],
    certifications: ["Chứng chỉ Nghiệp vụ Hành chính Văn phòng"]
  },
  "impressive-4": {
    title: "CV Giáo viên tiếng Anh",
    fullName: "Nguyễn Lê Tú Anh",
    jobTitle: "Giáo viên Tiếng Anh",
    dateOfBirth: "15/12/1997",
    address: "Ba Đình, Hà Nội",
    phone: "0912 456 789",
    email: "tuanh.nguyen@email.com",
    website: "tuanh-english.io",
    objective: "Là Giáo viên Tiếng Anh với hơn 3 năm kinh nghiệm giảng dạy. Dưới sự nhiệt huyết, chăm chỉ và kiên trì giúp học viên nâng cao điểm số và nâng cao trình độ. Mục tiêu trong 1-2 năm tới là đạt được vị trí Giảng dạy chính, hỗ trợ học viên chinh phục mục tiêu tiếng Anh đồng thời đóng góp các phương pháp giảng dạy mới cho trung tâm.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    experience: [
      { id: "e1", company: "CÔNG TY CỔ PHẦN GIÁO DỤC EDU | Giáo Viên Tiếng Anh", position: "Giáo Viên Tiếng Anh", startDate: "01/2021", endDate: "Hiện tại", description: "• Trực tiếp giảng dạy 20+ lớp học bao gồm luyện thi TOEIC, IELTS và tiếng Anh giao tiếp theo chỉ đạo của trung tâm.\n• Biên soạn giáo án kỹ và biên soạn tài liệu học tập theo syllabus.\n• Chăm sóc học viên kỹ lưỡng, hỗ trợ giải đáp thắc mắc ngoài giờ qua các khóa của từng học viên.\n• Tham gia các chương trình đào tạo, cuộc họp chuyên môn và các chương trình, sự kiện do trung tâm tổ chức.\n• Tham gia phát triển chương trình đào tạo và đề xuất các phương pháp giảng dạy sáng tạo, giúp nâng cao chất lượng đào tạo của trung tâm.\n• Thành tích:\n- Hướng dẫn 95% học viên hoàn thành khóa học và hơn 80% học viên đạt được mục tiêu học tập ban đầu.\n- Hỗ trợ 200+ học viên đạt điểm TOEIC và đạt thành tích trung bình 750 điểm." },
      { id: "e2", company: "TRUNG TÂM ANH NGỮ KIMS", position: "Gia sư tiếng Anh", startDate: "01/2019", endDate: "07/2021", description: "• Dạy kèm 1-1 môn tiếng Anh cho học sinh cấp 2 trong vòng 2 năm.\n• Hỗ trợ học sinh củng cố kiến thức nền tảng, làm bài tập về nhà và bổ trợ các kỹ năng nghe, nói, đọc, viết.\n• Đồng hành và cải thiện điểm trung bình môn tiếng Anh từ 5.5 lên 8.0 sau 2 kỳ học." }
    ],
    education: [
      { id: "ed1", school: "Đại học Ngoại ngữ - ĐHQGHN", degree: "Cử nhân Sư phạm Tiếng Anh", field: "Sư phạm Tiếng Anh", startDate: "2015", endDate: "2019" }
    ],
    skills: [
      { name: "Soạn bài + Thiết kế bài giảng", level: 90 },
      { name: "Kỹ năng giảng dạy TOEIC/IELTS", level: 85 },
      { name: "Quản lý lớp & Tương tác học viên", level: 80 }
    ],
    languages: ["Tiếng Anh - IELTS 8.0", "Tiếng Trung giao tiếp"],
    hobbies: ["Xem phim", "Nghe nhạc"],
    certifications: ["Chứng chỉ TESOL quốc tế", "Chứng chỉ Sư phạm"]
  },
  "student-3": {
    title: "CV Thực tập sinh",
    fullName: "Vũ Hoàng Việt",
    jobTitle: "Thực Tập Sinh Kiểm Toán",
    dateOfBirth: "05/12/2003",
    address: "Thanh Xuân, Hà Nội",
    phone: "(024) 612 5512",
    email: "vietvh@email.com",
    website: "",
    objective: "Tự tin với khả năng nghiên cứu, phân tích tốt và tinh thần học hỏi cao, sẵn lòng tiếp thu kiến thức và trách nhiệm trong công việc. Mục tiêu ngắn hạn: Được làm việc và học tập trong môi trường kiểm toán chuyên nghiệp để phát triển kỹ năng thực tế. Mục tiêu dài hạn: Tốt nghiệp đại học với loại giỏi, hướng đến học các chứng chỉ quốc tế như ACCA/CPA.",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
    experience: [
      { id: "e1", company: "Phó hiệu trưởng", position: "Nhân viên bán hàng part-time", startDate: "2024", endDate: "Hiện tại", description: "• Thu ngân và hướng dẫn khách hàng." }
    ],
    education: [
      { id: "ed1", school: "Đại học Ngoại thương Hà Nội", degree: "Cử nhân chuyên ngành Ngân hàng và Tài chính quốc tế", field: "Ngân hàng & Tài chính", startDate: "2021", endDate: "2025" }
    ],
    skills: [
      { name: "Phân tích và tổng hợp thông tin", level: 80 },
      { name: "Thành thạo kỹ năng xử lý tình huống", level: 80 },
      { name: "Thành thạo tư duy phản biện", level: 75 }
    ],
    languages: ["Tiếng Anh - IELTS 7.5"],
    hobbies: ["Bóng đá", "Đọc sách kinh tế"],
    certifications: ["Giải Nhì cuộc thi tài năng sinh viên"]
  },
  "outstanding-10": {
    title: "CV Nhân sự Chuyên nghiệp",
    fullName: "Trương Mỹ Linh",
    jobTitle: "Giám đốc Nhân sự (CHRO)",
    dateOfBirth: "12/05/1988",
    address: "Quận 1, TP. Hồ Chí Minh",
    phone: "(028) 5555 8888",
    email: "linh.truong@email.com",
    website: "linkedin.com/in/mylinh-chro",
    objective: "Giám đốc Nhân sự với hơn 15 năm kinh nghiệm xây dựng hệ thống nhân sự cho các doanh nghiệp từ 500-2000 nhân sự. Có thế mạnh trong tái cấu trúc tổ chức, chuyển đổi số nhân sự, phát triển đội ngũ kế thừa và xây dựng văn hóa doanh nghiệp bền vững.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    experience: [
      { id: "e1", company: "Tập đoàn Công nghệ NDS", position: "Giám đốc Nhân sự (CHRO)", startDate: "2020", endDate: "Hiện tại", description: "• Dẫn dắt chiến lược nhân sự toàn diện, tái cấu trúc sơ đồ tổ chức giúp tăng hiệu suất làm việc toàn công ty thêm 20%.\n• Xây dựng và triển khai hệ thống OKRs/KPIs giúp đo lường hiệu quả công việc chính xác cho 800+ nhân viên.\n• Tuyển dụng thành công các vị trí C-Level then chốt." },
      { id: "e2", company: "Công ty Cổ phần Bán lẻ & Chuỗi cửa hàng ABC", position: "Trưởng phòng Nhân sự", startDate: "2015", endDate: "2020", description: "• Quản lý và vận hành toàn bộ hoạt động nhân sự cho 120+ nhân viên kinh doanh.\n• Xây dựng quy chế lương thưởng doanh số mới giúp tăng 18% doanh số bán hàng trong 6 tháng đầu tiên." }
    ],
    education: [
      { id: "ed1", school: "Đại học Luật TP.HCM", degree: "Thạc sĩ Luật chuyên ngành Quản trị Nhân sự", field: "Luật & Nhân sự", startDate: "2006", endDate: "2010" }
    ],
    skills: [
      { name: "Chiến lược nhân sự", level: 95 },
      { name: "Tuyển dụng nhân tài", level: 90 },
      { name: "Giải quyết xung đột", level: 85 }
    ],
    languages: ["Tiếng Anh giao tiếp thành thạo", "Tiếng Nhật giao tiếp"],
    hobbies: ["Yoga", "Đọc sách quản trị"],
    certifications: ["Chứng chỉ CHRO quốc tế", "Chứng chỉ Quản trị Nhân sự SHRM"]
  },
  "gradient-1": {
    title: "CV Kế toán Kho",
    fullName: "Đỗ Quỳnh Mai",
    jobTitle: "Kế toán kho",
    dateOfBirth: "24/08/1995",
    address: "Hạ Đình, Hà Nội",
    phone: "(024) 6580 5055",
    email: "mai.dq@email.com",
    website: "",
    objective: "Kế toán kho với hơn 3 năm làm việc tại các doanh nghiệp sản xuất và bán lẻ. Có khả năng quản lý kho hàng chính xác số liệu, kiểm soát hao hụt và xử lý chứng từ nhanh chóng qua các phần mềm ERP. Mong muốn cống hiến năng lực giúp tối ưu quy trình kho hàng và tiết giảm chi phí vận hành.",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150",
    experience: [
      { id: "e1", company: "Công ty MW Việt Nam", position: "Kế toán kho", startDate: "2021", endDate: "Hiện tại", description: "• Kiểm tra tính hợp lệ của hóa đơn, chứng từ và hạch toán chính xác các giao dịch.\n• Thực hiện kiểm kê định kỳ và đột xuất hàng hóa nhằm phát hiện, xử lý kịp thời chênh lệch.\n• Đảm bảo chứng từ hợp lệ phục vụ công tác thanh tra thuế.\n• Hỗ trợ bộ phận mua hàng trong việc theo dõi đơn hàng." }
    ],
    education: [
      { id: "ed1", school: "Đại học Kinh tế Quốc dân", degree: "Cử nhân chuyên ngành Kế toán tổng hợp", field: "Kế toán", startDate: "2013", endDate: "2017" }
    ],
    skills: [
      { name: "Kỹ năng giao tiếp", level: 85 },
      { name: "Kỹ năng giải quyết vấn đề", level: 80 },
      { name: "Phần mềm MISA", level: 90 }
    ],
    languages: ["Tiếng Anh giao tiếp cơ bản"],
    hobbies: ["Đọc sách", "Xem phim"],
    certifications: ["Chứng chỉ Kế toán Tổng hợp"]
  },

  "passion-1": {
    title: "CV Chuyên viên Tuyển dụng",
    fullName: "Nguyễn Kim Tuyến",
    jobTitle: "Chuyên viên tuyển dụng",
    dateOfBirth: "26/04/1997",
    address: "Cầu Giấy, Hà Nội",
    phone: "0976 567 890",
    email: "tuyennk@email.com",
    website: "linkedin.com/in/kimtuyen",
    objective: "Chuyên viên Tuyển dụng với hơn 4 năm kinh nghiệm tìm kiếm và thu hút nhân tài cho các doanh nghiệp công nghệ và dịch vụ. Thành thạo quy trình phỏng vấn, xây dựng thương hiệu tuyển dụng và tạo trải nghiệm ứng viên tuyệt vời.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    experience: [
      { id: "e1", company: "SVT Financial Group, Inc.", position: "Chuyên viên tuyển dụng và đào tạo", startDate: "07/2022", endDate: "Hiện tại", description: "• Xây dựng và triển khai kế hoạch tuyển dụng tháng/quý/năm, đáp ứng 100% nhu cầu nhân sự của công ty.\n• Hợp tác với các trường đại học tổ chức ngày hội việc làm.\n• Soạn tài liệu đào tạo hội nhập cho nhân sự mới." }
    ],
    education: [
      { id: "ed1", school: "Đại học Ngoại thương", degree: "Cử nhân Quản trị nhân sự", field: "Hành chính - Nhân sự", startDate: "2015", endDate: "2019" }
    ],
    skills: [
      { name: "Kỹ năng phỏng vấn", level: 90 },
      { name: "Sàng lọc hồ sơ", level: 92 },
      { name: "Xây dựng nguồn ứng viên", level: 85 }
    ],
    languages: ["Tiếng Anh giao tiếp trôi chảy"],
    hobbies: ["Đọc sách", "Nấu ăn"],
    certifications: ["Chứng chỉ Tuyển dụng chuyên nghiệp"]
  },
  // ===== SAMPLE DATA FOR NEW TEMPLATES (PAGE 2) =====
  "executive-banner": {
    title: "CV Quản lý Dự án",
    fullName: "Nguyễn Minh Quân",
    jobTitle: "Quản lý Dự án Senior",
    dateOfBirth: "18/03/1990",
    address: "Quận Cầu Giấy, Hà Nội",
    phone: "0987 123 456",
    email: "quan.nguyen@email.com",
    website: "linkedin.com/in/minhquan-pm",
    objective: "Quản lý dự án với hơn 8 năm kinh nghiệm dẫn dắt các dự án chuyển đổi số và triển khai hệ thống quy mô lớn cho doanh nghiệp. Thành thạo Agile/Scrum, quản lý đa nhóm và tối ưu hóa quy trình. Mục tiêu dẫn dắt các dự án chiến lược giúp doanh nghiệp tăng trưởng 30% hiệu suất.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    experience: [
      { id: "e1", company: "Công ty Cổ phần Công nghệ NovaTech", position: "Senior Project Manager", startDate: "03/2021", endDate: "Hiện tại", description: "• Quản lý 8+ dự án chuyển đổi số với tổng ngân sách 50 tỷ đồng, đảm bảo 95% dự án hoàn thành đúng hạn.\n• Dẫn dắt đội ngũ 45 thành viên đa phòng ban áp dụng Agile/Scrum.\n• Xây dựng quy trình quản lý rủi ro giúp giảm 30% chi phí phát sinh cho dự án." },
      { id: "e2", company: "Tập đoàn Viễn thông FPT", position: "Project Manager", startDate: "06/2017", endDate: "02/2021", description: "• Triển khai thành công 12 dự án phần mềm quản lý doanh nghiệp.\n• Phối hợp chặt chẽ với khách hàng Nhật Bản trong các dự án outsource." }
    ],
    education: [
      { id: "ed1", school: "Đại học Bách Khoa Hà Nội", degree: "Kỹ sư Công nghệ Thông tin", field: "CNTT", startDate: "2008", endDate: "2012" },
      { id: "ed2", school: "Đại học Quốc gia", degree: "Thạc sĩ Quản trị Kinh doanh (MBA)", field: "Quản trị", startDate: "2015", endDate: "2017" }
    ],
    skills: [
      { name: "Quản lý dự án Agile/Scrum", level: 95 },
      { name: "Lập kế hoạch chiến lược", level: 90 },
      { name: "Quản lý rủi ro", level: 85 },
      { name: "Đàm phán & thuyết phục", level: 88 }
    ],
    languages: ["Tiếng Anh - TOEIC 850", "Tiếng Nhật - N3"],
    hobbies: ["Đọc sách", "Chạy bộ", "Du lịch"],
    certifications: ["PMP", "PSM I (Scrum Master)", "PMI-ACP"]
  },
  "corporate-blue": {
    title: "CV Kỹ sư Phần mềm",
    fullName: "Trần Đức Anh",
    jobTitle: "Senior Backend Engineer",
    dateOfBirth: "22/07/1993",
    address: "Quận 2, TP. Hồ Chí Minh",
    phone: "0905 888 222",
    email: "ducanh.tran@email.com",
    website: "github.com/ducanhtran",
    objective: "Kỹ sư phần mềm với 7 năm kinh nghiệm phát triển hệ thống backend quy mô lớn. Chuyên sâu về Java, Spring Boot, Microservices, Kafka. Đam mê xây dựng kiến trúc bền vững, hiệu năng cao và clean code. Mong muốn gia nhập đội ngũ kỹ thuật chuyên nghiệp để giải quyết các bài toán phức tạp.",
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150",
    experience: [
      { id: "e1", company: "Công ty TNHH Shopee Việt Nam", position: "Senior Backend Engineer", startDate: "04/2020", endDate: "Hiện tại", description: "• Thiết kế và phát triển hệ thống xử lý đơn hàng phục vụ 5 triệu+ người dùng/ngày với độ trễ dưới 200ms.\n• Tối ưu hóa database giúp giảm 40% thời gian response trung bình.\n• Mentor cho 5 lập trình viên junior trong team." },
      { id: "e2", company: "Công ty FPT Software", position: "Backend Developer", startDate: "07/2017", endDate: "03/2020", description: "• Tham gia phát triển hệ thống core banking cho khách hàng Nhật Bản.\n• Xây dựng RESTful API với Spring Boot và triển khai trên AWS." }
    ],
    education: [
      { id: "ed1", school: "Đại học Công nghệ - ĐHQGHN", degree: "Kỹ sư Khoa học Máy tính", field: "Khoa học Máy tính", startDate: "2011", endDate: "2015" }
    ],
    skills: [
      { name: "Java/Spring Boot", level: 95 },
      { name: "Microservices & Kafka", level: 90 },
      { name: "PostgreSQL/Redis", level: 88 },
      { name: "AWS/Docker/K8s", level: 82 }
    ],
    languages: ["Tiếng Anh - TOEIC 780", "Tiếng Nhật - N2"],
    hobbies: ["Code open-source", "Đọc tech blog", "Chơi cờ vua"],
    certifications: ["AWS Certified Developer", "Oracle Certified Java Programmer"]
  },
  "soft-pink": {
    title: "CV Content Marketing",
    fullName: "Phạm Hồng Nhung",
    jobTitle: "Content Marketing Specialist",
    dateOfBirth: "12/09/1996",
    address: "Quận Phú Nhuận, TP. Hồ Chí Minh",
    phone: "0938 765 432",
    email: "nhung.pham@email.com",
    website: "nhungwrites.com",
    objective: "Content Marketing Specialist với 4 năm kinh nghiệm sáng tạo nội dung đa kênh, đặc biệt trong ngành thời trang và làm đẹp. Có khả năng viết bài SEO, xây dựng chiến lược nội dung và tăng tương tác hữu cơ. Mong muốn sáng tạo nội dung truyền cảm hứng giúp thương hiệu kết nối sâu sắc với khách hàng.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    experience: [
      { id: "e1", company: "Công ty CP Đầu tư Thời trang EVA", position: "Content Marketing Specialist", startDate: "05/2021", endDate: "Hiện tại", description: "• Quản lý sản xuất 50+ bài viết blog thời trang/tháng, tăng traffic organic 180% trong 6 tháng.\n• Xây dựng chiến lược content cho fanpage 500K followers, tăng engagement 65%.\n• Phối hợp với team SEO để tối ưu bài viết đạt top 3 Google." },
      { id: "e2", company: "Brand Agency Sao Mai", position: "Content Creator", startDate: "08/2019", endDate: "04/2021", description: "• Sáng tạo nội dung cho 8+ thương hiệu thuộc ngành FMCG và thời trang.\n• Viết kịch bản video ngắn cho chiến dịch TikTok đạt 2M+ views." }
    ],
    education: [
      { id: "ed1", school: "Đại học Khoa học Xã hội & Nhân văn - ĐHQG TPHCM", degree: "Cử nhân Ngữ văn", field: "Truyền thông", startDate: "2014", endDate: "2018" }
    ],
    skills: [
      { name: "Sáng tạo nội dung", level: 95 },
      { name: "SEO Copywriting", level: 88 },
      { name: "Quản lý fanpage & social", level: 85 },
      { name: "Chụp ảnh/Quay video", level: 75 }
    ],
    languages: ["Tiếng Anh - IELTS 7.0", "Tiếng Trung giao tiếp"],
    hobbies: ["Đọc sách", "Nấu ăn", "Du lịch"],
    certifications: ["HubSpot Content Marketing", "Google Analytics"]
  },
  "maroon-classic": {
    title: "CV Giám đốc Tài chính",
    fullName: "Lê Hoàng Nam",
    jobTitle: "Chief Financial Officer (CFO)",
    dateOfBirth: "05/11/1980",
    address: "Quận 1, TP. Hồ Chí Minh",
    phone: "0903 111 999",
    email: "nam.le@email.com",
    website: "linkedin.com/in/hoangnam-cfo",
    objective: "CFO với hơn 18 năm kinh nghiệm quản lý tài chính doanh nghiệp quy mô 50-500 tỷ doanh thu. Thành thạo hoạch định chiến lược tài chính, M&A, quan hệ nhà đầu tư và chuyển đổi số tài chính. Mong muốn đóng góp cho sự tăng trưởng bền vững của doanh nghiệp trong giai đoạn IPO/mở rộng quốc tế.",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
    experience: [
      { id: "e1", company: "Tập đoàn Đầu tư Hoàng Gia", position: "Chief Financial Officer (CFO)", startDate: "01/2018", endDate: "Hiện tại", description: "• Dẫn dắt chiến lược tài chính toàn tập đoàn với doanh thu 2000 tỷ đồng, lợi nhuận tăng 28% qua từng năm.\n• Hoàn tất 3 thương vụ M&A tổng giá trị 150 triệu USD.\n• Thiết lập hệ thống ERP - tài chính cho 15 công ty con." },
      { id: "e2", company: "Công ty CP Vinamilk", position: "Deputy CFO", startDate: "06/2012", endDate: "12/2017", description: "• Phụ trách báo cáo tài chính hợp nhất theo chuẩn IFRS.\n• Quản lý quan hệ với các quỹ đầu tư nước ngoài." }
    ],
    education: [
      { id: "ed1", school: "Đại học Kinh tế Quốc dân", degree: "Cử nhân Tài chính - Ngân hàng", field: "Tài chính", startDate: "1998", endDate: "2002" },
      { id: "ed2", school: "INSEAD (Pháp)", degree: "MBA Tài chính", field: "Quản trị", startDate: "2008", endDate: "2010" }
    ],
    skills: [
      { name: "Hoạch định tài chính chiến lược", level: 98 },
      { name: "M&A & Đầu tư", level: 92 },
      { name: "IFRS & Báo cáo tài chính", level: 95 },
      { name: "Quản lý rủi ro", level: 90 }
    ],
    languages: ["Tiếng Anh - TOEIC 950", "Tiếng Pháp giao tiếp"],
    hobbies: ["Đọc sách", "Chơi golf", "Sưu tầm rượu vang"],
    certifications: ["CPA Việt Nam", "CFA Level III", "Chứng chỉ Kế toán trưởng"]
  },
  "ocean-grid": {
    title: "CV Kỹ sư DevOps",
    fullName: "Bùi Quang Huy",
    jobTitle: "DevOps Engineer",
    dateOfBirth: "30/04/1995",
    address: "Quận Nam Từ Liêm, Hà Nội",
    phone: "0966 333 888",
    email: "huy.bui@email.com",
    website: "github.com/quanghuy-devops",
    objective: "DevOps Engineer với 5 năm kinh nghiệm xây dựng hạ tầng Cloud, CI/CD pipeline và tự động hóa vận hành. Thành thạo AWS, Kubernetes, Terraform, Jenkins/GitLab CI. Đam mê áp dụng SRE và GitOps để nâng cao độ tin cậy và tốc độ triển khai hệ thống.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    experience: [
      { id: "e1", company: "Công ty TNHH Tiki", position: "Senior DevOps Engineer", startDate: "08/2021", endDate: "Hiện tại", description: "• Thiết kế kiến trúc microservices trên Kubernetes phục vụ 30+ services với 99.95% SLA.\n• Xây dựng GitOps pipeline với ArgoCD giảm 70% thời gian deploy.\n• Tối ưu chi phí AWS giúp tiết kiệm 35% (~ $50K/năm)." },
      { id: "e2", company: "VNG Corporation", position: "DevOps Engineer", startDate: "03/2019", endDate: "07/2021", description: "• Vận hành hệ thống ZaloPay với lưu lượng 50K+ transactions/giây.\n• Tự động hóa provisioning hạ tầng với Terraform/Ansible." }
    ],
    education: [
      { id: "ed1", school: "Đại học Bách Khoa Hà Nội", degree: "Kỹ sư Công nghệ Thông tin", field: "CNTT", startDate: "2013", endDate: "2017" }
    ],
    skills: [
      { name: "Kubernetes & Docker", level: 95 },
      { name: "AWS/GCP", level: 90 },
      { name: "Terraform & Ansible", level: 92 },
      { name: "CI/CD (Jenkins/GitLab)", level: 93 },
      { name: "Python/Bash scripting", level: 88 }
    ],
    languages: ["Tiếng Anh - TOEIC 800"],
    hobbies: ["Open-source contribution", "Mountain biking", "Học công nghệ mới"],
    certifications: ["CKA (Certified Kubernetes Administrator)", "AWS Solutions Architect Associate", "Terraform Associate"]
  },
  "minimal-line": {
    title: "CV Nhân viên Kế toán",
    fullName: "Ngô Thanh Hằng",
    jobTitle: "Kế toán Tổng hợp",
    dateOfBirth: "14/06/1997",
    address: "Quận Hai Bà Trưng, Hà Nội",
    phone: "0977 555 666",
    email: "hang.ngo@email.com",
    website: "",
    objective: "Kế toán viên với 3 năm kinh nghiệm làm việc tại doanh nghiệp sản xuất và thương mại. Thành thạo phần mềm MISA, Excel nâng cao, SAP. Mong muốn phát triển chuyên môn sâu về kế toán quản trị và đạt chứng chỉ CPA trong tương lai gần.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    experience: [
      { id: "e1", company: "Công ty CP Sản xuất Thương mại Hoàng Long", position: "Kế toán Tổng hợp", startDate: "09/2021", endDate: "Hiện tại", description: "• Hạch toán các nghiệp vụ kế toán phát sinh hàng ngày, đảm bảo chính xác và tuân thủ chuẩn mực kế toán Việt Nam.\n• Lập báo cáo thuế hàng tháng/quý và báo cáo tài chính cuối năm.\n• Đối chiếu công nợ phải thu/phải trả, kiểm soát dòng tiền." },
      { id: "e2", company: "Công ty TNHH Dịch vụ Tài chính Vina", position: "Kế toán viên", startDate: "01/2020", endDate: "08/2021", description: "• Xử lý nghiệp vụ thu chi, lập phiếu thu chi, báo cáo quỹ tiền mặt.\n• Hỗ trợ công tác kiểm toán định kỳ." }
    ],
    education: [
      { id: "ed1", school: "Đại học Kinh tế Quốc dân", degree: "Cử nhân Kế toán", field: "Kế toán", startDate: "2015", endDate: "2019" }
    ],
    skills: [
      { name: "Phần mềm MISA/SAP", level: 90 },
      { name: "Excel nâng cao", level: 88 },
      { name: "Báo cáo tài chính", level: 85 },
      { name: "Thuế & Luật kế toán", level: 82 }
    ],
    languages: ["Tiếng Anh giao tiếp cơ bản"],
    hobbies: ["Đọc sách kế toán", "Yoga"],
    certifications: ["Chứng chỉ Kế toán trưởng", "Chứng chỉ MISA"]
  }
};

// ============ INLINE EDITOR ============

const InlineInput = ({
  value,
  onChange,
  placeholder = i18n.t("cv.builder.placeholderClickToType"),
  className = "",
  style = {},
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const [editing, setEditing] = useState(false);
  const [localVal, setLocalVal] = useState(value);

  useEffect(() => {
    setLocalVal(value);
  }, [value]);

  if (!editing) {
    return (
      <span
        onClick={() => setEditing(true)}
        className={`cursor-text border-b border-dashed border-gray-400 hover:border-primary hover:bg-blue-50 px-0.5 py-0.5 transition-all ${!value ? "text-gray-400 italic" : "text-gray-800"} ${className}`}
        style={style}
        title={i18n.t("cv.builder.placeholderClickToEdit")}
      >
        {value || placeholder}
      </span>
    );
  }

  return (
    <input
      autoFocus
      value={localVal}
      onChange={(e) => setLocalVal(e.target.value)}
      onBlur={() => {
        setEditing(false);
        if (localVal !== value) onChange(localVal);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          setEditing(false);
          if (localVal !== value) onChange(localVal);
        }
      }}
      className={`outline-none border-b-2 border-primary bg-blue-50 px-1 py-0.5 rounded ${className}`}
      style={style}
    />
  );
};

const InlineTextarea = ({
  value,
  onChange,
  placeholder = i18n.t("cv.builder.placeholderClickToType"),
  className = "",
  style = {},
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const [editing, setEditing] = useState(false);
  const [localVal, setLocalVal] = useState(value);

  useEffect(() => {
    setLocalVal(value);
  }, [value]);

  if (!editing) {
    const displayValue = value.trim();
    return (
      <span
        onClick={() => setEditing(true)}
        className={`cursor-text border-b border-dashed border-gray-400 hover:border-primary hover:bg-blue-50 px-0.5 py-0.5 transition-all ${!displayValue ? "text-gray-400 italic" : "text-gray-700"} ${className}`}
        style={style}
        title={i18n.t("cv.builder.placeholderClickToEdit")}
      >
        {displayValue || placeholder}
      </span>
    );
  }

  return (
    <textarea
      autoFocus
      value={localVal}
      onChange={(e) => setLocalVal(e.target.value)}
      onBlur={() => {
        setEditing(false);
        if (localVal !== value) onChange(localVal);
      }}
      className={`w-full outline-none border-2 border-primary rounded bg-white p-2 text-xs min-h-[50px] resize-none shadow-md ${className}`}
      style={style}
      rows={3}
    />
  );
};

// ============ SECTION TEMPLATES ============

// ============ HELPER COMPONENTS ============

// Avatar Upload Component
const AvatarUploadButton = ({ data, onChange, size = "default" }: { data: any; onChange: (d: any) => void; size?: "small" | "default" | "large" }) => {
  const sizeClasses = {
    small: "w-12 h-12",
    default: "w-16 h-16",
    large: "w-20 h-20"
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(i18n.t("cv.builder.errorImage"));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(i18n.t("cv.builder.errorImageSize"));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange({ ...data, avatar: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full border-2 border-border bg-muted flex items-center justify-center overflow-hidden shrink-0 relative group cursor-pointer`}>
      {data.avatar ? (
        <img src={data.avatar} alt="Avatar" className="w-full h-full object-cover" />
      ) : (
        <User className="h-8 w-8 text-muted-foreground" />
      )}
      <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
        <Upload className="h-5 w-5 text-white" />
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </label>
    </div>
  );
};


// ============ SECTION ORDER HELPER ============

export const DEFAULT_SECTION_ORDER = ["objective", "experience", "education", "certifications", "skills", "languages", "hobbies"];

// Returns a map of sectionKey → JSX renderer for main (orderable) sections
// Templates call this and loop through data.sectionOrder to render in correct order
const makeSectionBlocks = (
  data: any,
  onChange: (d: any) => void,
  primary: string,
  accent: string,
  styleVariant: "default" | "sidebar" | "dark" | "timeline" = "default"
): Record<string, () => React.ReactNode> => {
  const headerCls = styleVariant === "dark"
    ? "font-bold text-[11px] uppercase tracking-wider mb-2 pb-1 border-b border-white/20 text-white"
    : "font-bold text-[11px] uppercase tracking-wider mb-2 pb-1 border-b-2";
  const headerStyle = styleVariant === "dark"
    ? {}
    : { borderColor: `${primary}20`, color: primary };

  const SectionHeader = ({ label }: { label: string }) => (
    <h3 className={headerCls} style={headerStyle}>{label}</h3>
  );

  return {
    objective: () => data.objective === undefined ? null : (
      <div key="objective">
        <SectionHeader label={i18n.t("cv.builder.sectionObjective")} />
        <div className={`text-[10.5px] leading-relaxed ${styleVariant === "dark" ? "text-slate-300" : "text-slate-600"}`}>
          <InlineTextarea value={data.objective} onChange={(v) => onChange({ ...data, objective: v })} placeholder={i18n.t("cv.builder.placeholderObjective")} className="!text-[10.5px]" />
        </div>
      </div>
    ),
    experience: () => !data.experience?.length ? null : (
      <div key="experience">
        <SectionHeader label={i18n.t("cv.builder.sectionExperience")} />
        <div className="space-y-3.5">
          {data.experience.map((exp: any, i: number) => (
            <div key={exp.id} className="group relative border-l-2 pl-3 pb-0.5" style={{ borderColor: accent }}>
              <button onClick={() => { const e = data.experience.filter((_: any, idx: number) => idx !== i); onChange({ ...data, experience: e }); }}
                className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
              <div className="flex justify-between items-start text-[10.5px] pr-7">
                <span className={`font-bold ${styleVariant === "dark" ? "text-white" : "text-slate-800"}`}>
                  <InlineInput value={exp.position} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], position: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderPosition")} />
                </span>
                <span className={`text-[9.5px] shrink-0 ${styleVariant === "dark" ? "text-slate-400" : "text-slate-400"}`}>
                  <InlineInput value={exp.startDate} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], startDate: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderFrom")} className="w-8 !text-[9.5px]" /> – <InlineInput value={exp.endDate} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderTo")} className="w-12 !text-[9.5px]" />
                </span>
              </div>
              <div className="text-[10px] font-semibold mt-0.5" style={{ color: primary }}>
                <InlineInput value={exp.company} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], company: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderCompany")} />
              </div>
              <div className={`text-[9.5px] mt-1 leading-relaxed ${styleVariant === "dark" ? "text-slate-300" : "text-slate-500"}`}>
                <InlineTextarea value={exp.description} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], description: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderDescription")} className="!text-[9.5px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    education: () => !data.education?.length ? null : (
      <div key="education">
        <SectionHeader label={i18n.t("cv.builder.sectionEducation")} />
        <div className="space-y-3">
          {data.education.map((edu: any, i: number) => (
            <div key={edu.id} className="group relative border-l-2 pl-3" style={{ borderColor: accent }}>
              <button onClick={() => { const e = data.education.filter((_: any, idx: number) => idx !== i); onChange({ ...data, education: e }); }}
                className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
              <div className="flex justify-between items-baseline text-[10.5px]">
                <span className={`font-bold ${styleVariant === "dark" ? "text-white" : "text-slate-800"}`}>
                  <InlineInput value={edu.degree} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], degree: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderMajor")} />
                </span>
                <span className="text-[9px] text-slate-400 shrink-0">
                  <InlineInput value={edu.endDate} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderGradYear")} className="w-10 !text-[9px]" />
                </span>
              </div>
              <div className={`text-[10px] mt-0.5 ${styleVariant === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                <InlineInput value={edu.school} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], school: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderSchool")} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    certifications: () => !data.certifications?.length ? null : (
      <div key="certifications">
        <SectionHeader label={i18n.t("cv.builder.sectionCertifications")} />
        <div className="space-y-1.5">
          {data.certifications.map((cert: string, i: number) => (
            <div key={i} className={`group relative text-[10px] flex items-center gap-2 ${styleVariant === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              <Award className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
              <InlineInput value={cert} onChange={(v) => { const c = [...data.certifications]; c[i] = v; onChange({ ...data, certifications: c }); }} className="flex-1 !pr-8 !text-[10px]" />
              <button onClick={() => { const c = data.certifications.filter((_: any, idx: number) => idx !== i); onChange({ ...data, certifications: c }); }}
                className="absolute right-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 bg-white rounded-full p-0.5 shadow-sm"><Trash2 className="h-3 w-3" /></button>
            </div>
          ))}
        </div>
      </div>
    ),
    skills: () => !data.skills?.length ? null : (
      <div key="skills">
        <SectionHeader label={i18n.t("cv.builder.sectionSkills")} />
        <div className="flex flex-wrap gap-1.5">
          {data.skills.map((skill: any, i: number) => (
            <span key={i} className={`group relative flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium ${styleVariant === "dark" ? "bg-white/10 text-white" : "bg-slate-100 text-slate-700"}`}>
              <InlineInput value={skill.name} onChange={(v) => { const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s }); }} placeholder={i18n.t("cv.builder.placeholderSkill")} className="!text-[10px]" />
              <button onClick={() => { const s = data.skills.filter((_: any, idx: number) => idx !== i); onChange({ ...data, skills: s }); }}
                className="absolute right-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 bg-white rounded-full p-0.5 shadow-sm"><Trash2 className="h-2.5 w-2.5" /></button>
            </span>
          ))}
        </div>
      </div>
    ),
    languages: () => !data.languages?.length ? null : (
      <div key="languages">
        <SectionHeader label={i18n.t("cv.builder.sectionLanguages")} />
        <div className="space-y-1">
          {data.languages.map((lang: string, i: number) => (
            <div key={i} className={`group relative text-[10px] flex items-center gap-1.5 ${styleVariant === "dark" ? "text-slate-300" : "text-slate-600"}`}>
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accent }} />
              <InlineInput value={lang} onChange={(v) => { const l = [...data.languages]; l[i] = v; onChange({ ...data, languages: l }); }} className="flex-1 !pr-8 !text-[10px]" />
              <button onClick={() => { const l = data.languages.filter((_: any, idx: number) => idx !== i); onChange({ ...data, languages: l }); }}
                className="absolute right-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 bg-white rounded-full p-0.5 shadow-sm"><Trash2 className="h-3 w-3" /></button>
            </div>
          ))}
        </div>
      </div>
    ),
    hobbies: () => !data.hobbies?.length ? null : (
      <div key="hobbies">
        <SectionHeader label={i18n.t("cv.builder.sectionHobbies")} />
        <div className="flex flex-wrap gap-1.5">
          {data.hobbies.map((h: string, i: number) => (
            <span key={i} className={`group relative flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${styleVariant === "dark" ? "bg-white/10 text-white" : "bg-slate-100 text-slate-600"}`}>
              <InlineInput value={h} onChange={(v) => { const ho = [...data.hobbies]; ho[i] = v; onChange({ ...data, hobbies: ho }); }} placeholder={i18n.t("cv.builder.placeholderHobby")} className="!text-[10px]" />
              <button onClick={() => { const ho = data.hobbies.filter((_: any, idx: number) => idx !== i); onChange({ ...data, hobbies: ho }); }}
                className="absolute right-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 bg-white rounded-full p-0.5 shadow-sm"><Trash2 className="h-2.5 w-2.5" /></button>
            </span>
          ))}
        </div>
      </div>
    ),
  };
};

// Helper to determine which column a section should render in
export const getSectionColumn = (key: string, layout: string, sectionColumns?: Record<string, "left" | "right">) => {
  if (sectionColumns?.[key]) {
    return sectionColumns[key];
  }
  // Default values for each template layout
  const defaults: Record<string, Record<string, "left" | "right">> = {
    "modern-split": { education: "left", skills: "left", languages: "left", objective: "right", experience: "right", certifications: "right", hobbies: "right" },
    "sidebar-light": { skills: "left", languages: "left", hobbies: "left", objective: "right", experience: "right", education: "right", certifications: "right" },
    "timeline-blue": { objective: "left", skills: "left", experience: "right", education: "right", certifications: "right", languages: "left", hobbies: "left" },
    "sidebar-dark": { education: "left", skills: "left", languages: "left", objective: "right", experience: "right", certifications: "right", hobbies: "left" },
    "gradient-header": { skills: "left", languages: "left", hobbies: "left", objective: "right", experience: "right", education: "right", certifications: "right" },
    "bright-split": { skills: "left", languages: "left", hobbies: "left", objective: "right", experience: "right", education: "right", certifications: "right" },
    "clarity-standard": { education: "left", skills: "left", objective: "right", experience: "right", certifications: "right", languages: "left", hobbies: "left" },
    "basic-split": { skills: "right", languages: "right", hobbies: "right", objective: "left", experience: "left", education: "left", certifications: "left" },
    "elegant-classic": { education: "left", skills: "left", languages: "left", objective: "right", experience: "right", certifications: "right", hobbies: "right" },
    "executive-banner": { education: "left", skills: "left", languages: "left", objective: "right", experience: "right", certifications: "right", hobbies: "right" },
    "corporate-blue": { education: "left", skills: "left", languages: "left", objective: "right", experience: "right", certifications: "right", hobbies: "right" },
    "soft-pink": { education: "left", skills: "left", languages: "left", objective: "right", experience: "right", certifications: "right", hobbies: "right" },
    "maroon-classic": { education: "left", skills: "left", languages: "left", objective: "right", experience: "right", certifications: "right", hobbies: "right" },
    "ocean-grid": { education: "left", skills: "left", languages: "left", objective: "right", experience: "right", certifications: "right", hobbies: "right" },
  };
  return defaults[layout]?.[key] || "right";
};

// Renders sections in the order specified by data.sectionOrder
const OrderedSections = ({ data, onChange, primary, accent, styleVariant = "default", className = "", allowedSections, blocks: customBlocks }: {
  data: any; onChange: (d: any) => void; primary: string; accent: string;
  styleVariant?: "default" | "sidebar" | "dark" | "timeline"; className?: string;
  allowedSections?: string[];
  blocks?: Record<string, () => React.ReactNode>;
}) => {
  const order: string[] = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER;
  const filteredOrder = allowedSections
    ? order.filter(key => allowedSections.includes(key))
    : order;
  const blocks = customBlocks || makeSectionBlocks(data, onChange, primary, accent, styleVariant);
  return (
    <div className={`space-y-4 ${className}`}>
      {filteredOrder.map(key => {
        const renderer = blocks[key];
        if (!renderer) return null;
        const node = renderer();
        if (!node) return null;
        return <React.Fragment key={key}>{node}</React.Fragment>;
      })}
    </div>
  );
};

// ============ CV TEMPLATE COMPONENTS (16 templates) ============

// 1. MODERN SPLIT (Hiện Đại 1)
const CVTemplateModernSplit = ({ data, onChange, template }: { data: any; onChange: (d: any) => void; template: SelectedCVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER;
  const leftSections = order.filter(key => getSectionColumn(key, template.layout, data.sectionColumns) === "left");
  const rightSections = order.filter(key => getSectionColumn(key, template.layout, data.sectionColumns) === "right");

  return (
    <div className="w-full h-full bg-white flex flex-col text-slate-800" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Top Header */}
      <div className="p-6 border-b border-slate-100 flex gap-5 items-center shrink-0">
        <AvatarUploadButton data={data} onChange={onChange} size="default" />
        <div className="flex-1">
          <h2 className="text-xl font-bold tracking-tight" style={{ color: primaryColor }}>
            <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder={i18n.t("cv.builder.placeholderName")} className="!font-bold !text-xl" />
          </h2>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mt-0.5">
            <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder={i18n.t("cv.builder.placeholderJobTitle")} />
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-[10px] text-slate-500">
            <span className="flex items-center gap-1.5"><Phone className="h-3 w-3 shrink-0" style={{ color: primaryColor }} /><InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder={i18n.t("cv.builder.placeholderPhone")} className="flex-1 !text-[10px]" /></span>
            <span className="flex items-center gap-1.5"><Mail className="h-3 w-3 shrink-0" style={{ color: primaryColor }} /><InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder={i18n.t("cv.builder.placeholderEmail")} className="flex-1 !text-[10px]" /></span>
            <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 shrink-0" style={{ color: primaryColor }} /><InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder={i18n.t("cv.builder.placeholderAddress")} className="flex-1 !text-[10px]" /></span>
            {data.website && <span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3 shrink-0" style={{ color: primaryColor }} /><InlineInput value={data.website} onChange={(v) => onChange({ ...data, website: v })} placeholder={i18n.t("cv.builder.placeholderWebsite")} className="flex-1 !text-[10px]" /></span>}
          </div>
        </div>
      </div>

      {/* Body split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column (40%) */}
        <div className="w-[215px] shrink-0 p-5 bg-slate-50/50 border-r border-slate-100 flex flex-col gap-4 overflow-y-auto">
          <OrderedSections
            data={data}
            onChange={onChange}
            primary={primaryColor}
            accent={accentColor}
            allowedSections={leftSections}
            styleVariant="default"
          />
        </div>

        {/* Right Column (60%) */}
        <div className="flex-1 p-5 overflow-y-auto">
          <OrderedSections
            data={data}
            onChange={onChange}
            primary={primaryColor}
            accent={accentColor}
            allowedSections={rightSections}
            styleVariant="default"
          />
        </div>
      </div>
    </div>
  );
};

// 2. SIDEBAR LIGHT (Ấn tượng 4)
const CVTemplateSidebarLight = ({ data, onChange, template }: { data: any; onChange: (d: any) => void; template: SelectedCVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER;
  const leftSections = order.filter(key => getSectionColumn(key, template.layout, data.sectionColumns) === "left");
  const rightSections = order.filter(key => getSectionColumn(key, template.layout, data.sectionColumns) === "right");

  const customBlocks = {
    skills: () => !data.skills?.length ? null : (
      <div>
        <h4 className="font-bold text-[10.5px] uppercase tracking-wider mb-2" style={{ color: primaryColor }}>{i18n.t("cv.builder.sectionSkills")}</h4>
        <div className="space-y-2">
          {data.skills.map((skill: any, i: number) => (
            <div key={i} className="group relative">
              <div className="flex justify-between items-center text-[10px]">
                <InlineInput value={skill.name} onChange={(v) => { const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s }); }} placeholder={i18n.t("cv.builder.placeholderSkill")} className="!text-[10px]" />
                <button onClick={() => { const s = data.skills.filter((_: any, idx: number) => idx !== i); onChange({ ...data, skills: s }); }}
                  className="absolute right-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 bg-white rounded-full p-0.5 shadow-sm"><Trash2 className="h-2.5 w-2.5" /></button>
              </div>
              <div className="flex gap-1 items-center mt-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <button key={idx} onClick={() => {
                    const s = [...data.skills];
                    s[i] = { ...s[i], level: (idx + 1) * 20 };
                    onChange({ ...data, skills: s });
                  }} className="w-2.5 h-2.5 rounded-full cursor-pointer hover:scale-125 transition-transform" style={{ backgroundColor: idx < Math.round(skill.level / 20) ? primaryColor : `${primaryColor}30` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  };

  return (
    <div className="w-full h-full bg-white flex text-slate-800" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Sidebar trái */}
      <div className="w-[210px] shrink-0 p-5 flex flex-col gap-4 border-r overflow-y-auto" style={{ backgroundColor: `${primaryColor}08`, borderColor: `${primaryColor}15` }}>
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <AvatarUploadButton data={data} onChange={onChange} size="large" />
          <div className="text-[14px] font-bold text-center mt-3" style={{ color: primaryColor }}>
            <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder={i18n.t("cv.builder.placeholderName")} className="!font-bold !text-[14px] text-center" />
          </div>
          <div className="text-[10px] text-slate-500 text-center font-medium mt-0.5">
            <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder={i18n.t("cv.builder.placeholderPosition")} className="text-center" />
          </div>
        </div>

        {/* Contact info list with rounded outline icons */}
        <div className="space-y-2 mt-2">
          <div className="flex items-center gap-2 text-[10px] text-slate-600">
            <div className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0" style={{ borderColor: `${primaryColor}40`, color: primaryColor }}><Phone className="h-2.5 w-2.5" /></div>
            <InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder={i18n.t("cv.builder.placeholderPhone")} className="flex-1 !text-[10px]" />
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-600">
            <div className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0" style={{ borderColor: `${primaryColor}40`, color: primaryColor }}><Mail className="h-2.5 w-2.5" /></div>
            <InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder={i18n.t("cv.builder.placeholderEmail")} className="flex-1 !text-[10px]" />
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-600">
            <div className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0" style={{ borderColor: `${primaryColor}40`, color: primaryColor }}><MapPin className="h-2.5 w-2.5" /></div>
            <InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder={i18n.t("cv.builder.placeholderAddress")} className="flex-1 !text-[10px]" />
          </div>
        </div>

        <OrderedSections
          data={data}
          onChange={onChange}
          primary={primaryColor}
          accent={accentColor}
          allowedSections={leftSections}
          styleVariant="sidebar"
          blocks={{
            ...makeSectionBlocks(data, onChange, primaryColor, accentColor, "sidebar"),
            ...customBlocks
          }}
        />
      </div>

      {/* Main content right */}
      <div className="flex-1 p-6 overflow-y-auto">
        <OrderedSections
          data={data}
          onChange={onChange}
          primary={primaryColor}
          accent={accentColor}
          allowedSections={rightSections}
          styleVariant="default"
        />
      </div>
    </div>
  );
};

// 3. TIMELINE BLUE (Sinh viên 3)
const CVTemplateTimelineBlue = ({ data, onChange, template }: { data: any; onChange: (d: any) => void; template: SelectedCVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER;
  const leftSections = order.filter(key => getSectionColumn(key, template.layout, data.sectionColumns) === "left");
  const rightSections = order.filter(key => getSectionColumn(key, template.layout, data.sectionColumns) === "right");

  const customBlocks = {
    skills: () => !data.skills?.length ? null : (
      <div>
        <h4 className="font-bold text-[10px] uppercase tracking-wider mb-2" style={{ color: primaryColor }}>{i18n.t("cv.builder.sectionSkills")}</h4>
        <div className="flex flex-wrap gap-1.5">
          {data.skills.map((skill: any, i: number) => (
            <span key={i} className="group relative inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9.5px] font-semibold text-white transition-all" style={{ backgroundColor: primaryColor }}>
              <InlineInput value={skill.name} onChange={(v) => { const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s }); }} placeholder={i18n.t("cv.builder.placeholderSkill")} className="!text-white !text-[9.5px] !border-white/30" />
              <button onClick={() => { const s = data.skills.filter((_: any, idx: number) => idx !== i); onChange({ ...data, skills: s }); }}
                className="opacity-0 group-hover:opacity-100 text-white/70 hover:text-white"><Trash2 className="h-2.5 w-2.5" /></button>
            </span>
          ))}
        </div>
      </div>
    ),
    education: () => !data.education?.length ? null : (
      <div>
        <h3 className="font-bold text-[11px] uppercase tracking-wider mb-3" style={{ color: primaryColor }}>{i18n.t("cv.builder.sectionEducation")}</h3>
        <div className="space-y-3 relative pl-4 border-l-2" style={{ borderColor: `${primaryColor}25` }}>
          {data.education.map((edu: any, i: number) => (
            <div key={edu.id} className="group relative">
              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: primaryColor }} />
              <button onClick={() => { const e = data.education.filter((_: any, idx: number) => idx !== i); onChange({ ...data, education: e }); }}
                className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
              <div className="flex justify-between items-baseline text-[10.5px]">
                <span className="font-bold text-slate-800">
                  <InlineInput value={edu.degree} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], degree: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderMajor")} />
                </span>
                <span className="text-[9px] text-slate-400 shrink-0">
                  <InlineInput value={edu.endDate} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderGradYear")} className="w-10 !text-[9px]" />
                </span>
              </div>
              <div className="text-[10px] text-slate-600 mt-0.5">
                <InlineInput value={edu.school} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], school: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderSchool")} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    experience: () => !data.experience?.length ? null : (
      <div>
        <h3 className="font-bold text-[11px] uppercase tracking-wider mb-3" style={{ color: primaryColor }}>{i18n.t("cv.builder.sectionExperience")}</h3>
        <div className="space-y-4 relative pl-4 border-l-2" style={{ borderColor: `${primaryColor}25` }}>
          {data.experience.map((exp: any, i: number) => (
            <div key={exp.id} className="group relative">
              <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: primaryColor }} />
              <button onClick={() => { const e = data.experience.filter((_: any, idx: number) => idx !== i); onChange({ ...data, experience: e }); }}
                className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
              <div className="flex justify-between items-start text-[10.5px] pr-7">
                <span className="font-bold text-slate-800">
                  <InlineInput value={exp.position} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], position: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderPosition")} />
                </span>
                <span className="text-[9.5px] text-slate-400 shrink-0">
                  <InlineInput value={exp.startDate} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], startDate: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderFrom")} className="w-8 !text-[9.5px]" /> – <InlineInput value={exp.endDate} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderTo")} className="w-12 !text-[9.5px]" />
                </span>
              </div>
              <div className="text-[10px] font-semibold mt-0.5" style={{ color: primaryColor }}>
                <InlineInput value={exp.company} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], company: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderCompany")} />
              </div>
              <div className="text-[9.5px] text-slate-500 mt-1 leading-relaxed">
                <InlineTextarea value={exp.description} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], description: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderDescription")} className="!text-[9.5px] !text-slate-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div className="w-full h-full bg-white flex text-slate-800" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Left Column (38%) */}
      <div className="w-[215px] shrink-0 p-5 flex flex-col gap-4 overflow-y-auto" style={{ backgroundColor: `${primaryColor}06` }}>
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: primaryColor }}>
            <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder={i18n.t("cv.builder.placeholderName")} className="!font-bold !text-xl" />
          </h2>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mt-1">
            <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder={i18n.t("cv.builder.placeholderJobTitle")} />
          </p>
        </div>

        <AvatarUploadButton data={data} onChange={onChange} size="large" />

        {/* Contact info */}
        <div className="space-y-1.5 text-[9.5px] text-slate-600">
          <div className="flex items-center gap-2"><Phone className="h-3 w-3 shrink-0" style={{ color: primaryColor }} /><InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder={i18n.t("cv.builder.placeholderPhone")} className="flex-1 !text-[9.5px]" /></div>
          <div className="flex items-center gap-2"><Mail className="h-3 w-3 shrink-0" style={{ color: primaryColor }} /><InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder={i18n.t("cv.builder.placeholderEmail")} className="flex-1 !text-[9.5px]" /></div>
          <div className="flex items-center gap-2"><MapPin className="h-3 w-3 shrink-0" style={{ color: primaryColor }} /><InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder={i18n.t("cv.builder.placeholderAddress")} className="flex-1 !text-[9.5px]" /></div>
        </div>

        <OrderedSections
          data={data}
          onChange={onChange}
          primary={primaryColor}
          accent={accentColor}
          allowedSections={leftSections}
          styleVariant="sidebar"
          blocks={{
            ...makeSectionBlocks(data, onChange, primaryColor, accentColor, "sidebar"),
            ...customBlocks
          }}
        />
      </div>

      {/* Right Column (62%) - Timeline layout */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        <OrderedSections
          data={data}
          onChange={onChange}
          primary={primaryColor}
          accent={accentColor}
          allowedSections={rightSections}
          styleVariant="default"
          blocks={{
            ...makeSectionBlocks(data, onChange, primaryColor, accentColor, "default"),
            ...customBlocks
          }}
        />
      </div>
    </div>
  );
};

// 4. SIDEBAR DARK (Outstanding 10)
const CVTemplateSidebarDark = ({ data, onChange, template }: { data: any; onChange: (d: any) => void; template: SelectedCVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  const darkBg = "#1e293b"; // Dark slate background
  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER;
  const leftSections = order.filter(key => getSectionColumn(key, template.layout, data.sectionColumns) === "left");
  const rightSections = order.filter(key => getSectionColumn(key, template.layout, data.sectionColumns) === "right");

  const customBlocks = {
    education: () => !data.education?.length ? null : (
      <div className="border-t border-white/10 pt-3">
        <h4 className="font-bold text-[10px] uppercase tracking-wider mb-2 text-white">{i18n.t("cv.builder.sectionEducation")}</h4>
        <div className="space-y-2.5">
          {data.education.map((edu: any, i: number) => (
            <div key={edu.id} className="group relative text-[9.5px]">
              <button onClick={() => { const e = data.education.filter((_: any, idx: number) => idx !== i); onChange({ ...data, education: e }); }}
                className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 text-white/50 hover:text-white"><Trash2 className="h-3 w-3" /></button>
              <div className="font-bold text-white">
                <InlineInput value={edu.degree} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], degree: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderMajor")} className="!text-white !font-bold" />
              </div>
              <div className="text-slate-300 mt-0.5">
                <InlineInput value={edu.school} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], school: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderSchool")} className="!text-slate-300" />
              </div>
              <div className="text-slate-400 text-[8.5px]">
                <InlineInput value={edu.endDate} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderGradYear")} className="!text-slate-400 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    skills: () => !data.skills?.length ? null : (
      <div className="border-t border-white/10 pt-3">
        <h4 className="font-bold text-[10px] uppercase tracking-wider mb-2 text-white">{i18n.t("cv.builder.sectionSkills")}</h4>
        <div className="space-y-2">
          {data.skills.map((skill: any, i: number) => (
            <div key={i} className="group relative">
              <div className="flex justify-between items-center text-[9.5px]">
                <InlineInput value={skill.name} onChange={(v) => { const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s }); }} placeholder={i18n.t("cv.builder.placeholderSkill")} className="!text-slate-200" />
                <button onClick={() => { const s = data.skills.filter((_: any, idx: number) => idx !== i); onChange({ ...data, skills: s }); }}
                  className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-white"><Trash2 className="h-2.5 w-2.5" /></button>
              </div>
              <div className="h-1 bg-white/20 rounded-full mt-1.5">
                <div className="h-full rounded-full bg-white" style={{ width: `${skill.level}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div className="w-full h-full bg-white flex text-slate-800" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Sidebar trái (tối) */}
      <div className="w-[210px] shrink-0 p-5 flex flex-col gap-4 text-slate-200 overflow-y-auto" style={{ backgroundColor: darkBg }}>
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <AvatarUploadButton data={data} onChange={onChange} size="large" />
          <div className="text-[14px] font-bold text-center mt-3 text-white">
            <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder={i18n.t("cv.builder.placeholderName")} className="!text-white !font-bold !text-[14px] text-center" />
          </div>
          <div className="text-[10px] text-slate-400 text-center font-medium mt-0.5">
            <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder={i18n.t("cv.builder.placeholderPosition")} className="text-center !text-slate-400" />
          </div>
        </div>

        {/* Contact info list */}
        <div className="space-y-2 mt-1.5 text-[9.5px] text-slate-300 border-t border-white/10 pt-3">
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 shrink-0 text-slate-400" />
            <InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder={i18n.t("cv.builder.placeholderPhone")} className="flex-1 !text-[9.5px] !text-slate-300" />
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 shrink-0 text-slate-400" />
            <InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder={i18n.t("cv.builder.placeholderEmail")} className="flex-1 !text-[9.5px] !text-slate-300" />
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
            <InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder={i18n.t("cv.builder.placeholderAddress")} className="flex-1 !text-[9.5px] !text-slate-300" />
          </div>
        </div>

        <OrderedSections
          data={data}
          onChange={onChange}
          primary={primaryColor}
          accent={accentColor}
          allowedSections={leftSections}
          styleVariant="dark"
          blocks={{
            ...makeSectionBlocks(data, onChange, primaryColor, accentColor, "dark"),
            ...customBlocks
          }}
        />
      </div>

      {/* Main content right */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        <OrderedSections
          data={data}
          onChange={onChange}
          primary={primaryColor}
          accent={accentColor}
          allowedSections={rightSections}
          styleVariant="default"
        />
      </div>
    </div>
  );
};

// 5. GRADIENT HEADER (Gradient 1)
const CVTemplateGradientHeader = ({ data, onChange, template }: { data: any; onChange: (d: any) => void; template: SelectedCVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER;
  const leftSections = order.filter(key => getSectionColumn(key, template.layout, data.sectionColumns) === "left");
  const rightSections = order.filter(key => getSectionColumn(key, template.layout, data.sectionColumns) === "right");

  const customBlocks = {
    skills: () => !data.skills?.length ? null : (
      <div>
        <h4 className="font-bold text-[10.5px] uppercase tracking-wider mb-2.5" style={{ color: primaryColor }}>{i18n.t("cv.builder.sectionSkills")}</h4>
        <div className="space-y-2">
          {data.skills.map((skill: any, i: number) => (
            <div key={i} className="group relative">
              <div className="flex justify-between items-center text-[10px]">
                <InlineInput value={skill.name} onChange={(v) => { const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s }); }} placeholder={i18n.t("cv.builder.placeholderSkill")} />
                <button onClick={() => { const s = data.skills.filter((_: any, idx: number) => idx !== i); onChange({ ...data, skills: s }); }}
                  className="absolute right-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 bg-white rounded-full p-0.5 shadow-sm"><Trash2 className="h-2.5 w-2.5" /></button>
              </div>
              <div className="h-1.5 bg-slate-200 rounded-full mt-1.5">
                <div className="h-full rounded-full" style={{ width: `${skill.level}%`, backgroundColor: primaryColor }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    hobbies: () => !data.hobbies?.length ? null : (
      <div>
        <h4 className="font-bold text-[10.5px] uppercase tracking-wider mb-2" style={{ color: primaryColor }}>{i18n.t("cv.builder.sectionHobbies")}</h4>
        <div className="flex flex-wrap gap-1">
          {data.hobbies.map((h: any, i: number) => (
            <span key={i} className="group relative inline-flex items-center gap-1 text-[9.5px] px-2 py-0.5 rounded" style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}>
              <InlineInput value={h} onChange={(v) => { const ho = [...data.hobbies]; ho[i] = v; onChange({ ...data, hobbies: ho }); }} className="!text-[9.5px]" />
              <button onClick={() => { const ho = data.hobbies.filter((_: any, idx: number) => idx !== i); onChange({ ...data, hobbies: ho }); }}
                className="absolute right-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 bg-white rounded-full p-0.5 shadow-sm"><Trash2 className="h-2.5 w-2.5" /></button>
            </span>
          ))}
        </div>
      </div>
    )
  };

  return (
    <div className="w-full h-full bg-white flex flex-col text-slate-800" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Tall Gradient Header */}
      <div className="px-6 py-6 flex items-center gap-4 text-white relative shrink-0" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
        <AvatarUploadButton data={data} onChange={onChange} size="default" />
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder={i18n.t("cv.builder.placeholderName")} className="!text-white !font-bold !text-xl" />
          </h2>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80 mt-0.5">
            <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder={i18n.t("cv.builder.placeholderJobTitle")} className="!text-white/80" />
          </p>
        </div>
      </div>

      {/* Horizontal white contact bar below header */}
      <div className="flex justify-center flex-wrap gap-x-6 gap-y-1 py-2 px-6 bg-slate-50 border-b border-slate-100 text-[10px] text-slate-500 shrink-0">
        <span className="flex items-center gap-1"><Phone className="h-3 w-3" style={{ color: primaryColor }} /><InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder={i18n.t("cv.builder.placeholderPhone")} className="!text-slate-500 !text-[10px]" /></span>
        <span className="flex items-center gap-1"><Mail className="h-3 w-3" style={{ color: primaryColor }} /><InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder={i18n.t("cv.builder.placeholderEmail")} className="!text-slate-500 !text-[10px]" /></span>
        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" style={{ color: primaryColor }} /><InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder={i18n.t("cv.builder.placeholderAddress")} className="!text-slate-500 !text-[10px]" /></span>
      </div>

      {/* Two-column body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column (38%) */}
        <div className="w-[205px] shrink-0 p-5 bg-slate-50/30 border-r border-slate-100 flex flex-col gap-4 overflow-y-auto">
          <OrderedSections
            data={data}
            onChange={onChange}
            primary={primaryColor}
            accent={accentColor}
            allowedSections={leftSections}
            styleVariant="default"
            blocks={{
              ...makeSectionBlocks(data, onChange, primaryColor, accentColor, "default"),
              ...customBlocks
            }}
          />
        </div>

        {/* Right Column (62%) */}
        <div className="flex-1 p-5 overflow-y-auto">
          <OrderedSections
            data={data}
            onChange={onChange}
            primary={primaryColor}
            accent={accentColor}
            allowedSections={rightSections}
            styleVariant="default"
            blocks={{
              ...makeSectionBlocks(data, onChange, primaryColor, accentColor, "default"),
              ...customBlocks
            }}
          />
        </div>
      </div>
    </div>
  );
};

// 6. PASSION CLEAN (Đam mê)
const CVTemplatePassionClean = ({ data, onChange, template }: { data: any; onChange: (d: any) => void; template: SelectedCVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER;
  const leftSections = order.filter(key => getSectionColumn(key, template.layout, data.sectionColumns) === "left");
  const rightSections = order.filter(key => getSectionColumn(key, template.layout, data.sectionColumns) === "right");

  const customBlocks = {
    objective: () => data.objective === undefined ? null : (
      <div>
        <div className="border-b-2 border-double pb-1 mb-2 font-bold text-[11px] uppercase" style={{ borderColor: primaryColor, color: primaryColor }}>{i18n.t("cv.builder.sectionObjective")}</div>
        <div className="text-[10px] text-slate-600 leading-relaxed">
          <InlineTextarea value={data.objective} onChange={(v) => onChange({ ...data, objective: v })} placeholder="Mô tả mục tiêu..." className="!text-[10px]" />
        </div>
      </div>
    ),
    experience: () => !data.experience?.length ? null : (
      <div>
        <div className="border-b-2 border-double pb-1 mb-2.5 font-bold text-[11px] uppercase" style={{ borderColor: primaryColor, color: primaryColor }}>{i18n.t("cv.builder.sectionExperience")}</div>
        <div className="space-y-3">
          {data.experience.map((exp: any, i: number) => (
            <div key={exp.id} className="group relative">
              <button onClick={() => { const e = data.experience.filter((_: any, idx: number) => idx !== i); onChange({ ...data, experience: e }); }}
                className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
              <div className="flex justify-between items-start text-[10px]">
                <div>
                  <span className="font-bold text-slate-800">
                    <InlineInput value={exp.position} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], position: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderPosition")} className="!font-bold" />
                  </span>
                  <span className="text-slate-500 mx-2">|</span>
                  <span className="font-semibold text-slate-600">
                    <InlineInput value={exp.company} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], company: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderCompany")} className="!font-semibold" />
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 shrink-0">
                  <InlineInput value={exp.startDate} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], startDate: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderFrom")} className="w-8 !text-[9px]" /> – <InlineInput value={exp.endDate} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderTo")} className="w-12 !text-[9px]" />
                </span>
              </div>
              <div className="text-[9.5px] text-slate-500 mt-1 leading-relaxed">
                <InlineTextarea value={exp.description} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], description: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderDescription")} className="!text-[9.5px] !text-slate-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    education: () => !data.education?.length ? null : (
      <div>
        <div className="border-b-2 border-double pb-1 mb-2.5 font-bold text-[11px] uppercase" style={{ borderColor: primaryColor, color: primaryColor }}>{i18n.t("cv.builder.sectionEducation")}</div>
        <div className="space-y-2">
          {data.education.map((edu: any, i: number) => (
            <div key={edu.id} className="group relative flex justify-between items-baseline text-[10px]">
              <button onClick={() => { const e = data.education.filter((_: any, idx: number) => idx !== i); onChange({ ...data, education: e }); }}
                className="absolute -right-4 top-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
              <div>
                <span className="font-bold text-slate-800">
                  <InlineInput value={edu.degree} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], degree: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderMajor")} className="!font-bold" />
                </span>
                <span className="text-slate-500 mx-2">|</span>
                <span className="text-slate-600">
                <InlineInput value={edu.school} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], school: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderSchool")} />
                </span>
              </div>
              <span className="text-[9px] text-slate-400 shrink-0">
                <InlineInput value={edu.endDate} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderGradYear")} className="w-10 !text-[9px]" />
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    skills: () => !data.skills?.length ? null : (
      <div>
        <div className="border-b-2 border-double pb-1 mb-2.5 font-bold text-[11px] uppercase" style={{ borderColor: primaryColor, color: primaryColor }}>{i18n.t("cv.builder.sectionSkills")}</div>
        <div className="flex flex-wrap gap-1.5">
          {data.skills.map((skill: any, i: number) => (
            <span key={i} className="group relative inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9.5px]" style={{ backgroundColor: `${primaryColor}12`, color: primaryColor }}>
              <InlineInput value={skill.name} onChange={(v) => { const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s }); }} placeholder={i18n.t("cv.builder.placeholderSkill")} className="!text-[9.5px]" style={{ color: primaryColor }} />
              <button onClick={() => { const s = data.skills.filter((_: any, idx: number) => idx !== i); onChange({ ...data, skills: s }); }}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500"><Trash2 className="h-2.5 w-2.5" /></button>
            </span>
          ))}
        </div>
      </div>
    ),
    languages: () => !data.languages?.length ? null : (
      <div>
        <div className="border-b-2 border-double pb-1 mb-2.5 font-bold text-[11px] uppercase" style={{ borderColor: primaryColor, color: primaryColor }}>Ngôn ngữ</div>
        <div className="space-y-1.5 text-[9.5px]">
          {data.languages.map((lang: string, i: number) => (
            <div key={i} className="text-slate-600 flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-slate-400" />
              <InlineInput value={lang} onChange={(v) => { const l = [...data.languages]; l[i] = v; onChange({ ...data, languages: l }); }} className="flex-1 !text-[9.5px]" />
            </div>
          ))}
        </div>
      </div>
    ),
    certifications: () => !data.certifications?.length ? null : (
      <div>
        <div className="border-b-2 border-double pb-1 mb-2.5 font-bold text-[11px] uppercase" style={{ borderColor: primaryColor, color: primaryColor }}>Chứng chỉ</div>
        <div className="space-y-1.5 text-[9.5px]">
          {data.certifications.map((cert: string, i: number) => (
            <div key={i} className="text-slate-600 flex items-center gap-1">
              <Award className="h-3 w-3 shrink-0" style={{ color: accentColor }} />
              <InlineInput value={cert} onChange={(v) => { const c = [...data.certifications]; c[i] = v; onChange({ ...data, certifications: c }); }} className="flex-1 !text-[9.5px]" />
            </div>
          ))}
        </div>
      </div>
    ),
    hobbies: () => !data.hobbies?.length ? null : (
      <div>
        <div className="border-b-2 border-double pb-1 mb-2.5 font-bold text-[11px] uppercase" style={{ borderColor: primaryColor, color: primaryColor }}>Sở thích</div>
        <div className="flex flex-wrap gap-1.5">
          {data.hobbies.map((h: string, i: number) => (
            <span key={i} className="group relative inline-flex items-center gap-1 text-[9.5px] px-2 py-0.5 rounded" style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}>
              <InlineInput value={h} onChange={(v) => { const ho = [...data.hobbies]; ho[i] = v; onChange({ ...data, hobbies: ho }); }} className="!text-[9.5px]" />
              <button onClick={() => { const ho = data.hobbies.filter((_: any, idx: number) => idx !== i); onChange({ ...data, hobbies: ho }); }}
                className="absolute right-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 bg-white rounded-full p-0.5 shadow-sm"><Trash2 className="h-2.5 w-2.5" /></button>
            </span>
          ))}
        </div>
      </div>
    )
  };

  return (
    <div className="w-full h-full bg-white p-7 text-slate-800 overflow-y-auto" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center gap-6 mb-5 pb-4 border-b border-slate-200 shrink-0">
        <AvatarUploadButton data={data} onChange={onChange} size="default" />
        <div className="flex-1">
          <h2 className="text-xl font-bold tracking-tight" style={{ color: primaryColor }}>
            <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder={i18n.t("cv.builder.placeholderName")} className="!font-bold !text-xl" />
          </h2>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mt-0.5">
            <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder={i18n.t("cv.builder.placeholderJobTitle")} />
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-[9.5px] text-slate-500">
            <span className="flex items-center gap-1"><Phone className="h-2.5 w-2.5" style={{ color: primaryColor }} /><InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder={i18n.t("cv.builder.placeholderPhone")} className="!text-slate-500 !text-[9.5px]" /></span>
            <span className="flex items-center gap-1"><Mail className="h-2.5 w-2.5" style={{ color: primaryColor }} /><InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder={i18n.t("cv.builder.placeholderEmail")} className="!text-slate-500 !text-[9.5px]" /></span>
            <span className="flex items-center gap-1"><MapPin className="h-2.5 w-2.5" style={{ color: primaryColor }} /><InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder={i18n.t("cv.builder.placeholderAddress")} className="!text-slate-500 !text-[9.5px]" /></span>
          </div>
        </div>
      </div>

      {/* Body: Single column stack, but supports left/right dynamic sections if customized */}
      {leftSections.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <OrderedSections
              data={data}
              onChange={onChange}
              primary={primaryColor}
              accent={accentColor}
              allowedSections={leftSections}
              blocks={customBlocks}
            />
          </div>
          <div className="space-y-4">
            <OrderedSections
              data={data}
              onChange={onChange}
              primary={primaryColor}
              accent={accentColor}
              allowedSections={rightSections}
              blocks={customBlocks}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <OrderedSections
            data={data}
            onChange={onChange}
            primary={primaryColor}
            accent={accentColor}
            allowedSections={rightSections}
            blocks={customBlocks}
          />
        </div>
      )}
    </div>
  );
};

// 7. BRIGHT (Bright)
const CVTemplateBright = ({ data, onChange, template }: { data: any; onChange: (d: any) => void; template: SelectedCVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER;
  const leftSections = order.filter(key => getSectionColumn(key, template.layout, data.sectionColumns) === "left");
  const rightSections = order.filter(key => getSectionColumn(key, template.layout, data.sectionColumns) === "right");

  const customBlocks = {
    skills: () => !data.skills?.length ? null : (
      <div>
        <h4 className="font-bold text-[10px] uppercase tracking-wider mb-2" style={{ color: primaryColor }}>{i18n.t("cv.builder.sectionSkills")}</h4>
        <div className="space-y-2">
          {data.skills.map((skill: any, i: number) => (
            <div key={i} className="group relative text-[9.5px]">
              <div className="flex justify-between items-center">
                <InlineInput value={skill.name} onChange={(v) => { const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s }); }} placeholder={i18n.t("cv.builder.placeholderSkill")} />
                <button onClick={() => { const s = data.skills.filter((_: any, idx: number) => idx !== i); onChange({ ...data, skills: s }); }}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500"><Trash2 className="h-2.5 w-2.5" /></button>
              </div>
              <div className="h-1 bg-slate-300/50 rounded-full mt-1">
                <div className="h-full rounded-full" style={{ width: `${skill.level}%`, backgroundColor: primaryColor }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    certifications: () => !data.certifications?.length ? null : (
      <div>
        <h4 className="font-bold text-[10px] uppercase tracking-wider mb-1.5" style={{ color: primaryColor }}>Chứng chỉ</h4>
        <div className="space-y-1.5 text-[9px] text-slate-600">
          {data.certifications.map((cert: string, i: number) => (
            <div key={i} className="group relative flex items-center gap-1">
              <Award className="h-3 w-3 shrink-0" style={{ color: primaryColor }} />
              <InlineInput value={cert} onChange={(v) => { const c = [...data.certifications]; c[i] = v; onChange({ ...data, certifications: c }); }} className="flex-1 !text-[9px]" />
              <button onClick={() => { const c = data.certifications.filter((_, idx) => idx !== i); onChange({ ...data, certifications: c }); }}
                className="absolute right-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 bg-white rounded-full p-0.5 shadow-sm"><Trash2 className="h-3 w-3" /></button>
            </div>
          ))}
        </div>
      </div>
    ),
    objective: () => data.objective === undefined ? null : (
      <div>
        <div className="text-[10.5px] text-slate-600 leading-relaxed italic">
          <InlineTextarea value={data.objective} onChange={(v) => onChange({ ...data, objective: v })} placeholder={i18n.t("cv.builder.placeholderObjective")} className="!text-[10.5px]" />
        </div>
      </div>
    )
  };

  return (
    <div className="w-full h-full bg-white flex text-slate-800" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Left Sidebar (Beige) */}
      <div className="w-[205px] shrink-0 p-4 flex flex-col gap-4 border-r overflow-y-auto" style={{ backgroundColor: "#f5ece1", borderColor: "#e6d7c3" }}>
        <div className="flex flex-col items-center">
          <AvatarUploadButton data={data} onChange={onChange} size="large" />
        </div>

        {/* Contact info in sidebar */}
        <div className="space-y-2 text-[9.5px] text-slate-600 border-t border-slate-300 pt-3">
          <div className="flex items-center gap-2"><Phone className="h-3 w-3 text-slate-500" /><InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder={i18n.t("cv.builder.placeholderPhone")} className="flex-1 !text-[9.5px] !text-slate-600" /></div>
          <div className="flex items-center gap-2"><Mail className="h-3 w-3 text-slate-500" /><InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder={i18n.t("cv.builder.placeholderEmail")} className="flex-1 !text-[9.5px] !text-slate-600" /></div>
          <div className="flex items-center gap-2"><MapPin className="h-3 w-3 text-slate-500" /><InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder={i18n.t("cv.builder.placeholderAddress")} className="flex-1 !text-[9.5px] !text-slate-600" /></div>
          {data.dateOfBirth && <div className="flex items-center gap-2"><Sparkles className="h-3 w-3 text-slate-500" /><InlineInput value={data.dateOfBirth} onChange={(v) => onChange({ ...data, dateOfBirth: v })} placeholder={i18n.t("cv.builder.placeholderDob")} className="flex-1 !text-[9.5px] !text-slate-600" /></div>}
        </div>

        <OrderedSections
          data={data}
          onChange={onChange}
          primary={primaryColor}
          accent={accentColor}
          allowedSections={leftSections}
          styleVariant="sidebar"
          blocks={{
            ...makeSectionBlocks(data, onChange, primaryColor, accentColor, "sidebar"),
            ...customBlocks
          }}
        />
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dark Header Banner */}
        <div className="p-5 text-white shrink-0" style={{ backgroundColor: primaryColor }}>
          <h2 className="text-xl font-bold tracking-wide text-white">
            <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder={i18n.t("cv.builder.placeholderName")} className="!text-white !font-bold !text-xl" />
          </h2>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/80 mt-1">
            <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder={i18n.t("cv.builder.placeholderJobTitle")} className="!text-white/80" />
          </p>
        </div>

        {/* Body content */}
        <div className="flex-1 p-5 space-y-4 overflow-y-auto">
          <OrderedSections
            data={data}
            onChange={onChange}
            primary={primaryColor}
            accent={accentColor}
            allowedSections={rightSections}
            styleVariant="default"
            blocks={{
              ...makeSectionBlocks(data, onChange, primaryColor, accentColor, "default"),
              ...customBlocks
            }}
          />
        </div>
      </div>
    </div>
  );
};

// 8. CLARITY (Clarity)
const CVTemplateClarity = ({ data, onChange, template }: { data: any; onChange: (d: any) => void; template: SelectedCVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER;
  const leftSections = order.filter((key: string) => getSectionColumn(key, template.layout, data.sectionColumns) === "left");
  const rightSections = order.filter((key: string) => getSectionColumn(key, template.layout, data.sectionColumns) === "right");

  const clarityLabelBlock = (label: string) => (
    <div className="bg-slate-800 text-white text-[9px] font-bold py-1 px-2 mb-2 tracking-wide text-center uppercase" style={{ backgroundColor: primaryColor }}>{label}</div>
  );

  const customBlocks = {
    ...makeSectionBlocks(data, onChange, primaryColor, accentColor, "default"),
    education: () => !data.education?.length ? null : (
      <div>
        {clarityLabelBlock(i18n.t("cv.builder.sectionEducation"))}
        <div className="space-y-2">
          {data.education.map((edu: any, i: number) => (
            <div key={edu.id} className="group relative text-[9px]">
              <button onClick={() => { const e = data.education.filter((_: any, idx: number) => idx !== i); onChange({ ...data, education: e }); }}
                className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
              <div className="font-bold text-slate-800"><InlineInput value={edu.degree} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], degree: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderMajor")} /></div>
              <div className="text-slate-500"><InlineInput value={edu.school} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], school: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderSchool")} /></div>
              <div className="text-slate-400 text-[8.5px]"><InlineInput value={edu.endDate} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderGradYear")} className="w-8" /></div>
            </div>
          ))}
        </div>
      </div>
    ),
    skills: () => !data.skills?.length ? null : (
      <div>
          {clarityLabelBlock(i18n.t("cv.builder.sectionSkills"))}
        <div className="space-y-1.5">
          {data.skills.map((skill: any, i: number) => (
            <div key={i} className="group relative text-[9px] flex justify-between items-center">
              <InlineInput value={skill.name} onChange={(v) => { const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s }); }} placeholder={i18n.t("cv.builder.placeholderSkill")} />
              <button onClick={() => { const s = data.skills.filter((_: any, idx: number) => idx !== i); onChange({ ...data, skills: s }); }}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500"><Trash2 className="h-2.5 w-2.5" /></button>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div className="w-full h-full bg-white flex text-slate-800" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Left Column (35%) */}
      <div className="w-[200px] shrink-0 p-4 bg-slate-50 border-r flex flex-col gap-4 overflow-y-auto" style={{ borderColor: "#e2e8f0" }}>
        <div>
          <h2 className="text-base font-bold tracking-wide" style={{ color: primaryColor }}>
            <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder={i18n.t("cv.builder.placeholderName")} className="!font-bold" />
          </h2>
          <p className="text-[10px] text-slate-500 font-medium mt-0.5">
            <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder={i18n.t("cv.builder.placeholderPosition")} />
          </p>
        </div>

        <AvatarUploadButton data={data} onChange={onChange} size="large" />

        <div>
          {clarityLabelBlock(i18n.t("cv.builder.personalInfo"))}
          <div className="space-y-1.5 text-[9px] text-slate-600">
            <div className="flex items-center gap-1.5"><Phone className="h-3 w-3 shrink-0" /><InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder={i18n.t("cv.builder.placeholderPhone")} className="flex-1" /></div>
            <div className="flex items-center gap-1.5"><Mail className="h-3 w-3 shrink-0" /><InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder={i18n.t("cv.builder.placeholderEmail")} className="flex-1" /></div>
            <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3 shrink-0" /><InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder={i18n.t("cv.builder.placeholderAddress")} className="flex-1" /></div>
            {data.dateOfBirth && <div className="flex items-center gap-1.5"><Sparkles className="h-3 w-3 shrink-0" /><InlineInput value={data.dateOfBirth} onChange={(v) => onChange({ ...data, dateOfBirth: v })} placeholder={i18n.t("cv.builder.placeholderDob")} className="flex-1" /></div>}
          </div>
        </div>

        {data.education.length > 0 && (
          <div>
            <div className="bg-slate-800 text-white text-[9px] font-bold py-1 px-2 mb-2 tracking-wide text-center uppercase" style={{ backgroundColor: primaryColor }}>{i18n.t("cv.builder.sectionEducation")}</div>
            <div className="space-y-2">
              {data.education.map((edu, i) => (
                <div key={edu.id} className="group relative text-[9px]">
                  <button onClick={() => { const e = data.education.filter((_, idx) => idx !== i); onChange({ ...data, education: e }); }}
                    className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
                  <div className="font-bold text-slate-800">
                    <InlineInput value={edu.degree} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], degree: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderMajor")} />
                  </div>
                  <div className="text-slate-500">
                    <InlineInput value={edu.school} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], school: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderSchool")} />
                  </div>
                  <div className="text-slate-400 text-[8.5px]">
                    <InlineInput value={edu.endDate} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderGradYear")} className="w-8" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.skills.length > 0 && (
          <div>
            <div className="bg-slate-800 text-white text-[9px] font-bold py-1 px-2 mb-2 tracking-wide text-center uppercase" style={{ backgroundColor: primaryColor }}>{i18n.t("cv.builder.sectionSkills")}</div>
            <div className="space-y-1.5">
              {data.skills.map((skill, i) => (
                <div key={i} className="group relative text-[9px] flex justify-between items-center">
                  <InlineInput value={skill.name} onChange={(v) => { const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s }); }} placeholder={i18n.t("cv.builder.placeholderSkill")} />
                  <button onClick={() => { const s = data.skills.filter((_, idx) => idx !== i); onChange({ ...data, skills: s }); }}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500"><Trash2 className="h-2.5 w-2.5" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
        <OrderedSections
          data={data}
          onChange={onChange}
          primary={primaryColor}
          accent={accentColor}
          allowedSections={leftSections}
          blocks={customBlocks}
        />
      </div>

      {/* Right Column (65%) */}
      <div className="flex-1 p-5 space-y-4 overflow-y-auto">
        <OrderedSections
          data={data}
          onChange={onChange}
          primary={primaryColor}
          accent={accentColor}
          allowedSections={rightSections}
          blocks={customBlocks}
        />
      </div>
    </div>
  );
};

// 9. BASIC 5 (Basic 5 - Right Sidebar)
const CVTemplateBasic5 = ({ data, onChange, template }: { data: any; onChange: (d: any) => void; template: SelectedCVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER;
  const leftSections = order.filter((key: string) => getSectionColumn(key, template.layout, data.sectionColumns) === "left");
  const rightSections = order.filter((key: string) => getSectionColumn(key, template.layout, data.sectionColumns) === "right");

  const customBlocks = {
    ...makeSectionBlocks(data, onChange, primaryColor, accentColor, "default"),
    skills: () => !data.skills?.length ? null : (
      <div>
        <h4 className="font-bold text-[10px] uppercase tracking-wider mb-2" style={{ color: primaryColor }}>{i18n.t("cv.builder.sectionSkills")}</h4>
        <div className="flex flex-wrap gap-1.5">
          {data.skills.map((skill: any, i: number) => (
            <span key={i} className="group relative inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px]" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
              <InlineInput value={skill.name} onChange={(v) => { const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s }); }} placeholder={i18n.t("cv.builder.placeholderSkill")} className="!text-[9.5px]" style={{ color: primaryColor }} />
              <button onClick={() => { const s = data.skills.filter((_: any, idx: number) => idx !== i); onChange({ ...data, skills: s }); }}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500"><Trash2 className="h-2.5 w-2.5" /></button>
            </span>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div className="w-full h-full bg-white flex text-slate-800" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Left Column (65%) */}
      <div className="flex-1 p-5 overflow-y-auto">
        <OrderedSections
          data={data}
          onChange={onChange}
          primary={primaryColor}
          accent={accentColor}
          allowedSections={leftSections}
          blocks={customBlocks}
        />
      </div>

      {/* Right Column Sidebar (35%) */}
      <div className="w-[205px] shrink-0 p-4 border-l flex flex-col gap-4 overflow-y-auto" style={{ borderColor: "#e2e8f0" }}>
        <div className="flex flex-col items-center">
          <AvatarUploadButton data={data} onChange={onChange} size="large" />
          <div className="text-[13px] font-bold text-center mt-3" style={{ color: primaryColor }}>
            <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder={i18n.t("cv.builder.placeholderName")} className="!font-bold text-center" />
          </div>
          <div className="text-[9.5px] text-slate-500 text-center font-medium mt-0.5">
            <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder={i18n.t("cv.builder.placeholderPosition")} className="text-center" />
          </div>
        </div>
        <div className="text-[9.5px] text-slate-600 space-y-1.5 border-t pt-3">
          <div className="flex items-center gap-1.5"><Phone className="h-3 w-3 shrink-0" style={{ color: primaryColor }} /><InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder={i18n.t("cv.builder.placeholderPhone")} className="flex-1" /></div>
          <div className="flex items-center gap-1.5"><Mail className="h-3 w-3 shrink-0" style={{ color: primaryColor }} /><InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder={i18n.t("cv.builder.placeholderEmail")} className="flex-1" /></div>
          <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3 shrink-0" style={{ color: primaryColor }} /><InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder={i18n.t("cv.builder.placeholderAddress")} className="flex-1" /></div>
        </div>
        <OrderedSections
          data={data}
          onChange={onChange}
          primary={primaryColor}
          accent={accentColor}
          allowedSections={rightSections}
          blocks={customBlocks}
        />
      </div>
    </div>
  );
};

// 10. ELEGANT 1 (Thanh Lịch 1)
const CVTemplateElegant1 = ({ data, onChange, template }: { data: any; onChange: (d: any) => void; template: SelectedCVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER;
  const leftSections = order.filter((key: string) => getSectionColumn(key, template.layout, data.sectionColumns) === "left");
  const rightSections = order.filter((key: string) => getSectionColumn(key, template.layout, data.sectionColumns) === "right");

  const customBlocks = {
    ...makeSectionBlocks(data, onChange, primaryColor, accentColor, "default"),
    objective: () => data.objective === undefined ? null : (
      <div>
        <h3 className="font-bold text-[10.5px] uppercase tracking-wider mb-1.5" style={{ color: primaryColor }}>{i18n.t("cv.builder.sectionObjective")}</h3>
        <div className="text-[10px] text-slate-600 leading-relaxed border-l-2 pl-3" style={{ borderColor: accentColor }}>
          <InlineTextarea value={data.objective} onChange={(v) => onChange({ ...data, objective: v })} placeholder={i18n.t("cv.builder.placeholderObjective")} className="!text-[10px]" />
        </div>
      </div>
    ),
    experience: () => !data.experience?.length ? null : (
      <div>
        <h3 className="font-bold text-[10.5px] uppercase tracking-wider mb-2" style={{ color: primaryColor }}>{i18n.t("cv.builder.sectionExperience")}</h3>
        <div className="space-y-3.5 pl-3 border-l-2" style={{ borderColor: accentColor }}>
          {data.experience.map((exp: any, i: number) => (
            <div key={exp.id} className="group relative">
              <button onClick={() => { const e = data.experience.filter((_: any, idx: number) => idx !== i); onChange({ ...data, experience: e }); }}
                className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
              <div className="flex justify-between items-start text-[10px] font-bold">
                <span className="text-slate-800"><InlineInput value={exp.position} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], position: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderPosition")} /></span>
                <span className="text-[9px] text-slate-400 font-normal shrink-0"><InlineInput value={exp.startDate} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], startDate: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderFrom")} className="w-8 !text-[9px]" /> – <InlineInput value={exp.endDate} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderTo")} className="w-12 !text-[9px]" /></span>
              </div>
              <div className="text-[9.5px] font-semibold mt-0.5" style={{ color: primaryColor }}><InlineInput value={exp.company} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], company: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderCompany")} /></div>
              <div className="text-[9px] text-slate-500 mt-1 leading-relaxed"><InlineTextarea value={exp.description} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], description: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderDescription")} className="!text-[9px]" /></div>
            </div>
          ))}
        </div>
      </div>
    ),
    education: () => !data.education?.length ? null : (
      <div>
        <h3 className="font-bold text-[10.5px] uppercase tracking-wider mb-2" style={{ color: primaryColor }}>{i18n.t("cv.builder.sectionEducation")}</h3>
        <div className="space-y-3 pl-3 border-l-2" style={{ borderColor: accentColor }}>
          {data.education.map((edu: any, i: number) => (
            <div key={edu.id} className="group relative">
              <button onClick={() => { const e = data.education.filter((_: any, idx: number) => idx !== i); onChange({ ...data, education: e }); }}
                className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
              <div className="flex justify-between items-baseline text-[10px] font-bold">
                <span className="text-slate-800"><InlineInput value={edu.degree} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], degree: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderMajor")} /></span>
                <span className="text-[9px] text-slate-400 font-normal shrink-0"><InlineInput value={edu.endDate} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderGradYear")} className="w-10 !text-[9px]" /></span>
              </div>
              <div className="text-[9.5px] text-slate-600 mt-0.5"><InlineInput value={edu.school} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], school: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderSchool")} /></div>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div className="w-full h-full bg-white flex flex-col text-slate-800" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Top Banner Header */}
      <div className="p-5 flex items-center gap-4 text-white shrink-0" style={{ backgroundColor: primaryColor }}>
        <AvatarUploadButton data={data} onChange={onChange} size="default" />
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder={i18n.t("cv.builder.placeholderName")} className="!text-white !font-bold !text-xl" />
          </h2>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/80 mt-1">
            <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder={i18n.t("cv.builder.placeholderJobTitle")} className="!text-white/80" />
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-[9px] text-white/75">
            <span className="flex items-center gap-1"><Phone className="h-2.5 w-2.5 text-white/60" /><InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder={i18n.t("cv.builder.placeholderPhone")} className="!text-white/75" /></span>
            <span className="flex items-center gap-1"><Mail className="h-2.5 w-2.5 text-white/60" /><InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder={i18n.t("cv.builder.placeholderEmail")} className="!text-white/75" /></span>
            <span className="flex items-center gap-1"><MapPin className="h-2.5 w-2.5 text-white/60" /><InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder={i18n.t("cv.builder.placeholderAddress")} className="!text-white/75" /></span>
          </div>
        </div>
      </div>
      {/* Body: dynamic columns */}
      {leftSections.length > 0 ? (
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-5 overflow-y-auto"><OrderedSections data={data} onChange={onChange} primary={primaryColor} accent={accentColor} allowedSections={leftSections} blocks={customBlocks} /></div>
          <div className="w-[220px] shrink-0 p-5 border-l overflow-y-auto" style={{ borderColor: `${primaryColor}15` }}><OrderedSections data={data} onChange={onChange} primary={primaryColor} accent={accentColor} allowedSections={rightSections} blocks={customBlocks} /></div>
        </div>
      ) : (
        <div className="flex-1 p-5 space-y-4 overflow-y-auto">
          <OrderedSections data={data} onChange={onChange} primary={primaryColor} accent={accentColor} allowedSections={rightSections} blocks={customBlocks} />
        </div>
      )}
    </div>
  );
};


// 11. EXECUTIVE BANNER (Banner thông tin kề vai avatar, nền tối sang trọng)
const CVTemplateExecutiveBanner = ({ data, onChange, template }: { data: any; onChange: (d: any) => void; template: SelectedCVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER;
  const leftSections = order.filter((key: string) => getSectionColumn(key, template.layout, data.sectionColumns) === "left");
  const rightSections = order.filter((key: string) => getSectionColumn(key, template.layout, data.sectionColumns) === "right");

  const customBlocks = {
    ...makeSectionBlocks(data, onChange, primaryColor, accentColor, "default"),
    skills: () => !data.skills?.length ? null : (
      <div>
        <h4 className="font-bold text-[10px] uppercase tracking-wider mb-2 pb-1 border-b-2" style={{ borderColor: accentColor, color: primaryColor }}>{i18n.t("cv.builder.sectionSkills")}</h4>
        <div className="space-y-1.5">
          {data.skills.map((skill: any, i: number) => (
            <div key={i} className="group relative">
              <div className="flex justify-between items-center text-[9.5px]">
                <InlineInput value={skill.name} onChange={(v) => { const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s }); }} placeholder={i18n.t("cv.builder.placeholderSkill")} />
                <button onClick={() => { const s = data.skills.filter((_: any, idx: number) => idx !== i); onChange({ ...data, skills: s }); }}
                  className="absolute right-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 bg-white rounded-full p-0.5 shadow-sm"><Trash2 className="h-2.5 w-2.5" /></button>
              </div>
              <div className="flex gap-0.5 items-center mt-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <button key={idx} onClick={() => { const s = [...data.skills]; s[i] = { ...s[i], level: (idx + 1) * 20 }; onChange({ ...data, skills: s }); }}
                    className="w-2 h-2 rounded-sm cursor-pointer hover:scale-125 transition-transform" style={{ backgroundColor: idx < Math.round(skill.level / 20) ? primaryColor : `${primaryColor}25` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div className="w-full h-full bg-white flex flex-col text-slate-800" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Dark Top Banner with avatar + contact info side by side */}
      <div className="px-6 py-5 flex items-center gap-4 text-white shrink-0" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
        <AvatarUploadButton data={data} onChange={onChange} size="default" />
        <div className="flex-1">
          <h2 className="text-xl font-bold tracking-tight text-white">
            <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder={i18n.t("cv.builder.placeholderName")} className="!text-white !font-bold !text-xl" />
          </h2>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/80 mt-0.5">
            <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder={i18n.t("cv.builder.placeholderJobTitle")} className="!text-white/80" />
          </p>
        </div>
        <div className="text-[9px] text-white/80 space-y-1 shrink-0 border-l border-white/20 pl-4">
          <div className="flex items-center gap-1.5"><Phone className="h-2.5 w-2.5 text-white/60" /><InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder={i18n.t("cv.builder.placeholderPhone")} className="!text-white/80" /></div>
          <div className="flex items-center gap-1.5"><Mail className="h-2.5 w-2.5 text-white/60" /><InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder={i18n.t("cv.builder.placeholderEmail")} className="!text-white/80" /></div>
          <div className="flex items-center gap-1.5"><MapPin className="h-2.5 w-2.5 text-white/60" /><InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder={i18n.t("cv.builder.placeholderAddress")} className="!text-white/80" /></div>
        </div>
      </div>

      {/* Two-column body */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[210px] shrink-0 p-4 border-r flex flex-col gap-4 overflow-y-auto" style={{ borderColor: `${primaryColor}15`, backgroundColor: `${primaryColor}04` }}>
          <OrderedSections data={data} onChange={onChange} primary={primaryColor} accent={accentColor} allowedSections={leftSections} blocks={customBlocks} />
        </div>
        <div className="flex-1 p-5 overflow-y-auto">
          <OrderedSections data={data} onChange={onChange} primary={primaryColor} accent={accentColor} allowedSections={rightSections} blocks={customBlocks} />
        </div>
      </div>
    </div>
  );
};

// 12. CORPORATE BLUE (Header tiêu đề lớn, sidebar trái)
const CVTemplateCorporateBlue = ({ data, onChange, template }: { data: any; onChange: (d: any) => void; template: SelectedCVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER;
  const leftSections = order.filter((key: string) => getSectionColumn(key, template.layout, data.sectionColumns) === "left");
  const rightSections = order.filter((key: string) => getSectionColumn(key, template.layout, data.sectionColumns) === "right");

  const customBlocks = {
    ...makeSectionBlocks(data, onChange, primaryColor, accentColor, "default"),
    education: () => !data.education?.length ? null : (
      <div>
        <h4 className="font-bold text-[10px] uppercase tracking-wider mb-2 pb-1" style={{ color: primaryColor, borderBottom: `2px solid ${primaryColor}` }}>{i18n.t("cv.builder.sectionEducation")}</h4>
        <div className="space-y-2.5">
          {data.education.map((edu: any, i: number) => (
            <div key={edu.id} className="group relative text-[9.5px]">
              <button onClick={() => { const e = data.education.filter((_: any, idx: number) => idx !== i); onChange({ ...data, education: e }); }}
                className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
              <div className="font-bold text-slate-800"><InlineInput value={edu.degree} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], degree: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderMajor")} className="!font-bold" /></div>
              <div className="text-slate-500"><InlineInput value={edu.school} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], school: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderSchool")} /></div>
              <div className="text-slate-400 text-[8.5px]"><InlineInput value={edu.endDate} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderGradYear")} className="w-10 !text-[8.5px]" /></div>
            </div>
          ))}
        </div>
      </div>
    ),
    skills: () => !data.skills?.length ? null : (
      <div>
        <h4 className="font-bold text-[10px] uppercase tracking-wider mb-2 pb-1" style={{ color: primaryColor, borderBottom: `2px solid ${primaryColor}` }}>{i18n.t("cv.builder.sectionSkills")}</h4>
        <div className="space-y-1.5">
          {data.skills.map((skill: any, i: number) => (
            <div key={i} className="group relative text-[9.5px] flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-sm shrink-0" style={{ backgroundColor: primaryColor }} />
              <InlineInput value={skill.name} onChange={(v) => { const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s }); }} placeholder={i18n.t("cv.builder.placeholderSkill")} className="flex-1 !text-[9.5px]" />
              <button onClick={() => { const s = data.skills.filter((_: any, idx: number) => idx !== i); onChange({ ...data, skills: s }); }}
                className="absolute right-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 bg-white rounded-full p-0.5 shadow-sm"><Trash2 className="h-2.5 w-2.5" /></button>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div className="w-full h-full bg-white flex flex-col text-slate-800" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Top Blue Header */}
      <div className="px-6 py-5 text-white shrink-0" style={{ backgroundColor: primaryColor }}>
        <h2 className="text-[22px] font-bold tracking-tight text-white">
          <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder={i18n.t("cv.builder.placeholderName")} className="!text-white !font-bold !text-[22px] uppercase tracking-wider" />
        </h2>
        <p className="text-[11px] font-medium uppercase tracking-widest text-white/85 mt-1">
          <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder={i18n.t("cv.builder.placeholderJobTitle")} className="!text-white/85" />
        </p>
      </div>

      {/* Two-column body */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[210px] shrink-0 p-4 flex flex-col gap-4 overflow-y-auto" style={{ backgroundColor: `${primaryColor}08` }}>
          {/* Avatar + contact */}
          <div className="flex flex-col items-center gap-3">
            <AvatarUploadButton data={data} onChange={onChange} size="large" />
          </div>
          <div className="space-y-1.5 text-[9.5px] text-slate-600">
            <div className="flex items-center gap-1.5"><Phone className="h-3 w-3 shrink-0" style={{ color: primaryColor }} /><InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder={i18n.t("cv.builder.placeholderPhone")} className="flex-1 !text-[9.5px]" /></div>
            <div className="flex items-center gap-1.5"><Mail className="h-3 w-3 shrink-0" style={{ color: primaryColor }} /><InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder={i18n.t("cv.builder.placeholderEmail")} className="flex-1 !text-[9.5px]" /></div>
            <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3 shrink-0" style={{ color: primaryColor }} /><InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder={i18n.t("cv.builder.placeholderAddress")} className="flex-1 !text-[9.5px]" /></div>
          </div>

          <OrderedSections data={data} onChange={onChange} primary={primaryColor} accent={accentColor} allowedSections={leftSections} blocks={customBlocks} />
        </div>
        <div className="flex-1 p-5 overflow-y-auto">
          <OrderedSections data={data} onChange={onChange} primary={primaryColor} accent={accentColor} allowedSections={rightSections} blocks={customBlocks} />
        </div>
      </div>
    </div>
  );
};

// 13. SOFT PINK (Tông hồng pastel, header bo cong mềm mại)
const CVTemplateSoftPink = ({ data, onChange, template }: { data: any; onChange: (d: any) => void; template: SelectedCVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER;
  const leftSections = order.filter((key: string) => getSectionColumn(key, template.layout, data.sectionColumns) === "left");
  const rightSections = order.filter((key: string) => getSectionColumn(key, template.layout, data.sectionColumns) === "right");

  const customBlocks = {
    ...makeSectionBlocks(data, onChange, primaryColor, accentColor, "default"),
    skills: () => !data.skills?.length ? null : (
      <div>
        <h4 className="font-bold text-[10px] uppercase tracking-wider mb-2" style={{ color: primaryColor }}>{i18n.t("cv.builder.sectionSkills")}</h4>
        <div className="flex flex-wrap gap-1.5">
          {data.skills.map((skill: any, i: number) => (
            <span key={i} className="group relative inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-medium text-white" style={{ backgroundColor: primaryColor }}>
              <InlineInput value={skill.name} onChange={(v) => { const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s }); }} placeholder={i18n.t("cv.builder.placeholderSkill")} className="!text-white !text-[9.5px] !border-white/30" />
              <button onClick={() => { const s = data.skills.filter((_: any, idx: number) => idx !== i); onChange({ ...data, skills: s }); }}
                className="opacity-0 group-hover:opacity-100 text-white/70 hover:text-white"><Trash2 className="h-2.5 w-2.5" /></button>
            </span>
          ))}
        </div>
      </div>
    ),
    experience: () => !data.experience?.length ? null : (
      <div>
        <h3 className="font-bold text-[11px] uppercase tracking-wider mb-2.5" style={{ color: primaryColor }}>{i18n.t("cv.builder.sectionExperience")}</h3>
        <div className="space-y-3.5">
          {data.experience.map((exp: any, i: number) => (
            <div key={exp.id} className="group relative pl-3 border-l-2" style={{ borderColor: accentColor }}>
              <button onClick={() => { const e = data.experience.filter((_: any, idx: number) => idx !== i); onChange({ ...data, experience: e }); }}
                className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
              <div className="flex justify-between items-start text-[10.5px] pr-7">
                <span className="font-bold text-slate-800"><InlineInput value={exp.position} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], position: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderPosition")} /></span>
                <span className="text-[9.5px] text-slate-400 shrink-0"><InlineInput value={exp.startDate} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], startDate: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderFrom")} className="w-8 !text-[9.5px]" /> – <InlineInput value={exp.endDate} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderTo")} className="w-12 !text-[9.5px]" /></span>
              </div>
              <div className="text-[10px] font-semibold mt-0.5" style={{ color: primaryColor }}><InlineInput value={exp.company} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], company: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderCompany")} /></div>
              <div className="text-[9.5px] text-slate-500 mt-1 leading-relaxed"><InlineTextarea value={exp.description} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], description: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderDescription")} className="!text-[9.5px]" /></div>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div className="w-full h-full bg-white flex flex-col text-slate-800" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Centered Header with rounded bottom */}
      <div className="px-6 pt-5 pb-7 text-white shrink-0 relative" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, borderBottomLeftRadius: "32px", borderBottomRightRadius: "32px" }}>
        <div className="flex flex-col items-center text-center">
          <AvatarUploadButton data={data} onChange={onChange} size="large" />
          <h2 className="text-[20px] font-bold tracking-tight text-white mt-3">
            <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder={i18n.t("cv.builder.placeholderName")} className="!text-white !font-bold !text-[20px]" />
          </h2>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/85 mt-1">
            <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder={i18n.t("cv.builder.placeholderJobTitle")} className="!text-white/85" />
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2 text-[9.5px] text-white/85">
            <span className="flex items-center gap-1"><Phone className="h-2.5 w-2.5" /><InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder={i18n.t("cv.builder.placeholderPhone")} className="!text-white/85" /></span>
            <span className="flex items-center gap-1"><Mail className="h-2.5 w-2.5" /><InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder={i18n.t("cv.builder.placeholderEmail")} className="!text-white/85" /></span>
            <span className="flex items-center gap-1"><MapPin className="h-2.5 w-2.5" /><InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder={i18n.t("cv.builder.placeholderAddress")} className="!text-white/85" /></span>
          </div>
        </div>
      </div>

      {/* Two-column body */}
      <div className="flex-1 flex overflow-hidden -mt-4">
        <div className="w-[200px] shrink-0 p-4 mx-3 mb-3 mt-1 flex flex-col gap-3.5 overflow-y-auto bg-white rounded-2xl shadow-sm border" style={{ borderColor: `${primaryColor}20` }}>
          <OrderedSections data={data} onChange={onChange} primary={primaryColor} accent={accentColor} allowedSections={leftSections} blocks={customBlocks} />
        </div>
        <div className="flex-1 p-5 overflow-y-auto">
          <OrderedSections data={data} onChange={onChange} primary={primaryColor} accent={accentColor} allowedSections={rightSections} blocks={customBlocks} />
        </div>
      </div>
    </div>
  );
};

// 14. MAROON CLASSIC (Sidebar đỏ đô cổ điển)
const CVTemplateMaroonClassic = ({ data, onChange, template }: { data: any; onChange: (d: any) => void; template: SelectedCVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER;
  const leftSections = order.filter((key: string) => getSectionColumn(key, template.layout, data.sectionColumns) === "left");
  const rightSections = order.filter((key: string) => getSectionColumn(key, template.layout, data.sectionColumns) === "right");

  const customBlocks = {
    ...makeSectionBlocks(data, onChange, primaryColor, accentColor, "dark"),
    education: () => !data.education?.length ? null : (
      <div className="border-t border-white/20 pt-3">
        <h4 className="font-bold text-[10px] uppercase tracking-wider mb-2 text-white">{i18n.t("cv.builder.sectionEducation")}</h4>
        <div className="space-y-2.5">
          {data.education.map((edu: any, i: number) => (
            <div key={edu.id} className="group relative text-[9.5px]">
              <button onClick={() => { const e = data.education.filter((_: any, idx: number) => idx !== i); onChange({ ...data, education: e }); }}
                className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 text-white/50 hover:text-white"><Trash2 className="h-3 w-3" /></button>
              <div className="font-bold text-white"><InlineInput value={edu.degree} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], degree: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderMajor")} className="!text-white !font-bold" /></div>
              <div className="text-white/80"><InlineInput value={edu.school} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], school: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderSchool")} className="!text-white/80" /></div>
              <div className="text-white/60 text-[8.5px]"><InlineInput value={edu.endDate} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderGradYear")} className="!text-white/60 w-8" /></div>
            </div>
          ))}
        </div>
      </div>
    ),
    skills: () => !data.skills?.length ? null : (
      <div className="border-t border-white/20 pt-3">
        <h4 className="font-bold text-[10px] uppercase tracking-wider mb-2 text-white">{i18n.t("cv.builder.sectionSkills")}</h4>
        <div className="space-y-2">
          {data.skills.map((skill: any, i: number) => (
            <div key={i} className="group relative">
              <div className="flex justify-between items-center text-[9.5px]">
                <InlineInput value={skill.name} onChange={(v) => { const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s }); }} placeholder={i18n.t("cv.builder.placeholderSkill")} className="!text-white/90" />
                <button onClick={() => { const s = data.skills.filter((_: any, idx: number) => idx !== i); onChange({ ...data, skills: s }); }}
                  className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-white"><Trash2 className="h-2.5 w-2.5" /></button>
              </div>
              <div className="h-1 bg-white/20 rounded-full mt-1">
                <div className="h-full rounded-full bg-white" style={{ width: `${skill.level}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    languages: () => !data.languages?.length ? null : (
      <div className="border-t border-white/20 pt-3">
        <h4 className="font-bold text-[10px] uppercase tracking-wider mb-2 text-white">{i18n.t("cv.builder.sectionLanguages")}</h4>
        <div className="space-y-1">
          {data.languages.map((lang: string, i: number) => (
            <div key={i} className="group relative text-[9.5px] text-white/85 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
              <InlineInput value={lang} onChange={(v) => { const l = [...data.languages]; l[i] = v; onChange({ ...data, languages: l }); }} className="flex-1 !text-[9.5px] !text-white/85" />
              <button onClick={() => { const l = data.languages.filter((_: any, idx: number) => idx !== i); onChange({ ...data, languages: l }); }}
                className="absolute right-0 opacity-0 group-hover:opacity-100 text-white/50 hover:text-red-400 bg-slate-700 rounded-full p-0.5 shadow-sm"><Trash2 className="h-3 w-3" /></button>
            </div>
          ))}
        </div>
      </div>
    ),
    objective: () => data.objective === undefined ? null : (
      <div className="border-t border-white/20 pt-3">
        <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/85 mb-0.5">{i18n.t("cv.builder.sectionObjective")}</h3>
        <div className="text-[10px] text-white/85 italic leading-relaxed">
          <InlineTextarea value={data.objective} onChange={(v) => onChange({ ...data, objective: v })} placeholder={i18n.t("cv.builder.placeholderObjective")} className="!text-[10px] !text-white/85" />
        </div>
      </div>
    ),
  };

  // Right side uses standard blocks (light background)
  const rightBlocks = makeSectionBlocks(data, onChange, primaryColor, accentColor, "default");

  return (
    <div className="w-full h-full bg-white flex text-slate-800" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Left Sidebar (Maroon) */}
      <div className="w-[215px] shrink-0 p-5 flex flex-col gap-4 text-white overflow-y-auto" style={{ backgroundColor: primaryColor }}>
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <AvatarUploadButton data={data} onChange={onChange} size="large" />
          <div className="text-[14px] font-bold text-center mt-3 text-white">
            <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder={i18n.t("cv.builder.placeholderName")} className="!text-white !font-bold !text-[14px] text-center" />
          </div>
          <div className="text-[10px] text-white/75 text-center font-medium mt-0.5">
            <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder={i18n.t("cv.builder.placeholderPosition")} className="text-center !text-white/75" />
          </div>
        </div>
        {/* Contact */}
        <div className="space-y-1.5 mt-2 text-[9.5px] text-white/85 border-t border-white/20 pt-3">
          <div className="flex items-center gap-2"><Phone className="h-3 w-3 shrink-0 text-white/60" /><InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder={i18n.t("cv.builder.placeholderPhone")} className="flex-1 !text-[9.5px] !text-white/85" /></div>
          <div className="flex items-center gap-2"><Mail className="h-3 w-3 shrink-0 text-white/60" /><InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder={i18n.t("cv.builder.placeholderEmail")} className="flex-1 !text-[9.5px] !text-white/85" /></div>
          <div className="flex items-center gap-2"><MapPin className="h-3 w-3 shrink-0 text-white/60" /><InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder={i18n.t("cv.builder.placeholderAddress")} className="flex-1 !text-[9.5px] !text-white/85" /></div>
        </div>

        <OrderedSections data={data} onChange={onChange} primary={primaryColor} accent={accentColor} allowedSections={leftSections} blocks={customBlocks} />
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Banner header on right side */}
        <div className="p-4 text-white shrink-0" style={{ backgroundColor: secondaryColor }}>
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/85 mb-0.5">{i18n.t("cv.builder.sectionObjective")}</h3>
          {data.objective !== undefined && (
            <div className="text-[10px] text-white/85 italic leading-relaxed">
              <InlineTextarea value={data.objective} onChange={(v) => onChange({ ...data, objective: v })} placeholder={i18n.t("cv.builder.placeholderObjective")} className="!text-[10px] !text-white/85" />
            </div>
          )}
        </div>
        <div className="flex-1 p-5 overflow-y-auto">
          <OrderedSections data={data} onChange={onChange} primary={primaryColor} accent={accentColor} allowedSections={rightSections.filter((k: string) => k !== "objective")} blocks={rightBlocks} />
        </div>
      </div>
    </div>
  );
};

// 15. OCEAN GRID (Lưới icon gradient xanh dương, sidebar liên hệ)
const CVTemplateOceanGrid = ({ data, onChange, template }: { data: any; onChange: (d: any) => void; template: SelectedCVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER;
  const leftSections = order.filter((key: string) => getSectionColumn(key, template.layout, data.sectionColumns) === "left");
  const rightSections = order.filter((key: string) => getSectionColumn(key, template.layout, data.sectionColumns) === "right");

  const sidebarBlocks = {
    ...makeSectionBlocks(data, onChange, primaryColor, accentColor, "dark"),
    skills: () => !data.skills?.length ? null : (
      <div>
        <h4 className="font-bold text-[10px] uppercase tracking-wider mb-2 text-white">{i18n.t("cv.builder.sectionSkills")}</h4>
        <div className="space-y-1.5">
          {data.skills.map((skill: any, i: number) => (
            <div key={i} className="group relative">
              <div className="text-[9.5px] text-white/90 mb-1">
                <InlineInput value={skill.name} onChange={(v) => { const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s }); }} placeholder={i18n.t("cv.builder.placeholderSkill")} className="!text-white/90" />
              </div>
              <div className="h-1 bg-white/20 rounded-full">
                <div className="h-full rounded-full bg-white" style={{ width: `${skill.level}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    languages: () => !data.languages?.length ? null : (
      <div>
        <h4 className="font-bold text-[10px] uppercase tracking-wider mb-2 text-white">{i18n.t("cv.builder.sectionLanguages")}</h4>
        <div className="space-y-1">
          {data.languages.map((lang: string, i: number) => (
            <div key={i} className="group relative text-[9.5px] text-white/90 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
              <InlineInput value={lang} onChange={(v) => { const l = [...data.languages]; l[i] = v; onChange({ ...data, languages: l }); }} className="flex-1 !text-[9.5px] !text-white/90" />
              <button onClick={() => { const l = data.languages.filter((_: any, idx: number) => idx !== i); onChange({ ...data, languages: l }); }}
                className="absolute right-0 opacity-0 group-hover:opacity-100 text-white/50 hover:text-red-400 bg-slate-700 rounded-full p-0.5 shadow-sm"><Trash2 className="h-3 w-3" /></button>
            </div>
          ))}
        </div>
      </div>
    ),
    education: () => !data.education?.length ? null : (
      <div>
        <h4 className="font-bold text-[10px] uppercase tracking-wider mb-2 text-white">{i18n.t("cv.builder.sectionEducation")}</h4>
        <div className="space-y-2">
          {data.education.map((edu: any, i: number) => (
            <div key={edu.id} className="group relative text-[9.5px]">
              <button onClick={() => { const e = data.education.filter((_: any, idx: number) => idx !== i); onChange({ ...data, education: e }); }}
                className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 text-white/50 hover:text-white"><Trash2 className="h-3 w-3" /></button>
              <div className="font-semibold text-white"><InlineInput value={edu.degree} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], degree: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderMajor")} className="!text-white" /></div>
              <div className="text-white/75"><InlineInput value={edu.school} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], school: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderSchool")} className="!text-white/75" /></div>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  const mainBlocks = {
    ...makeSectionBlocks(data, onChange, primaryColor, accentColor, "default"),
    objective: () => data.objective === undefined ? null : (
      <div>
        <h3 className="font-bold text-[11px] uppercase tracking-wider mb-1.5 flex items-center gap-2" style={{ color: primaryColor }}>
          <Target className="h-3 w-3" /> {i18n.t("cv.builder.sectionObjective")}
        </h3>
        <div className="text-[10px] text-slate-600 leading-relaxed">
          <InlineTextarea value={data.objective} onChange={(v) => onChange({ ...data, objective: v })} placeholder="Mô tả mục tiêu..." className="!text-[10px]" />
        </div>
      </div>
    ),
    experience: () => !data.experience?.length ? null : (
      <div>
        <h3 className="font-bold text-[11px] uppercase tracking-wider mb-2.5 flex items-center gap-2" style={{ color: primaryColor }}>
          <Briefcase className="h-3 w-3" /> {i18n.t("cv.builder.sectionExperience")}
        </h3>
        <div className="space-y-3.5">
          {data.experience.map((exp: any, i: number) => (
            <div key={exp.id} className="group relative">
              <button onClick={() => { const e = data.experience.filter((_: any, idx: number) => idx !== i); onChange({ ...data, experience: e }); }}
                className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
              <div className="flex justify-between items-start text-[10.5px] pr-7">
                <span className="font-bold text-slate-800"><InlineInput value={exp.position} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], position: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderPosition")} /></span>
                <span className="text-[9.5px] text-slate-400 shrink-0"><InlineInput value={exp.startDate} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], startDate: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderFrom")} className="w-8 !text-[9.5px]" /> – <InlineInput value={exp.endDate} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderTo")} className="w-12 !text-[9.5px]" /></span>
              </div>
              <div className="text-[10px] font-semibold mt-0.5" style={{ color: primaryColor }}><InlineInput value={exp.company} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], company: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderCompany")} /></div>
              <div className="text-[9.5px] text-slate-500 mt-1 leading-relaxed"><InlineTextarea value={exp.description} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], description: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderDescription")} className="!text-[9.5px]" /></div>
            </div>
          ))}
        </div>
      </div>
    ),
    education: () => !data.education?.length ? null : (
      <div>
        <h3 className="font-bold text-[11px] uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: primaryColor }}>
          <GraduationCap className="h-3 w-3" /> {i18n.t("cv.builder.sectionEducation")}
        </h3>
        <div className="space-y-2.5">
          {data.education.map((edu: any, i: number) => (
            <div key={edu.id} className="group relative">
              <button onClick={() => { const e = data.education.filter((_: any, idx: number) => idx !== i); onChange({ ...data, education: e }); }}
                className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
              <div className="flex justify-between items-baseline text-[10.5px] font-bold pr-7">
                <span className="text-slate-800"><InlineInput value={edu.degree} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], degree: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderMajor")} /></span>
                <span className="text-[9px] text-slate-400 font-normal shrink-0"><InlineInput value={edu.endDate} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderGradYear")} className="w-10 !text-[9px]" /></span>
              </div>
              <div className="text-[10px] text-slate-600 mt-0.5"><InlineInput value={edu.school} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], school: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderSchool")} /></div>
            </div>
          ))}
        </div>
      </div>
    ),
    certifications: () => !data.certifications?.length ? null : (
      <div>
        <h3 className="font-bold text-[11px] uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: primaryColor }}>
          <Award className="h-3 w-3" /> {i18n.t("cv.builder.sectionCertifications")}
        </h3>
        <div className="space-y-1">
          {data.certifications.map((cert: string, i: number) => (
            <div key={i} className="group relative text-[9.5px] text-slate-600 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-sm shrink-0" style={{ backgroundColor: accentColor }} />
              <InlineInput value={cert} onChange={(v) => { const c = [...data.certifications]; c[i] = v; onChange({ ...data, certifications: c }); }} className="flex-1 !pr-8 !text-[9.5px]" />
              <button onClick={() => { const c = data.certifications.filter((_: any, idx: number) => idx !== i); onChange({ ...data, certifications: c }); }}
                className="absolute right-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 bg-white rounded-full p-0.5 shadow-sm"><Trash2 className="h-3 w-3" /></button>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div className="w-full h-full bg-white flex text-slate-800" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Sidebar trái */}
      <div className="w-[200px] shrink-0 p-4 text-white flex flex-col gap-4 overflow-y-auto" style={{ background: `linear-gradient(180deg, ${primaryColor}, ${secondaryColor})` }}>
        <div className="flex flex-col items-center">
          <AvatarUploadButton data={data} onChange={onChange} size="large" />
        </div>
        <div className="space-y-2 text-[9.5px]">
          <div className="flex items-center gap-2 p-2 rounded bg-white/10">
            <Phone className="h-3 w-3 shrink-0 text-white" />
            <InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder={i18n.t("cv.builder.placeholderPhone")} className="flex-1 !text-[9.5px] !text-white" />
          </div>
          <div className="flex items-center gap-2 p-2 rounded bg-white/10">
            <Mail className="h-3 w-3 shrink-0 text-white" />
            <InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder={i18n.t("cv.builder.placeholderEmail")} className="flex-1 !text-[9.5px] !text-white" />
          </div>
          <div className="flex items-center gap-2 p-2 rounded bg-white/10">
            <MapPin className="h-3 w-3 shrink-0 text-white" />
            <InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder={i18n.t("cv.builder.placeholderAddress")} className="flex-1 !text-[9.5px] !text-white" />
          </div>
          {data.dateOfBirth && (
            <div className="flex items-center gap-2 p-2 rounded bg-white/10">
              <Sparkles className="h-3 w-3 shrink-0 text-white" />
              <InlineInput value={data.dateOfBirth} onChange={(v) => onChange({ ...data, dateOfBirth: v })} placeholder={i18n.t("cv.builder.placeholderDob")} className="flex-1 !text-[9.5px] !text-white" />
            </div>
          )}
        </div>
        <OrderedSections data={data} onChange={onChange} primary={primaryColor} accent={accentColor} allowedSections={leftSections} blocks={sidebarBlocks} />
      </div>

      {/* Main content right */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-5 shrink-0 border-b-2" style={{ borderColor: primaryColor }}>
          <h2 className="text-[22px] font-bold tracking-tight" style={{ color: primaryColor }}>
            <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder={i18n.t("cv.builder.placeholderName")} className="!font-bold !text-[22px] uppercase tracking-wider" style={{ color: primaryColor }} />
          </h2>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mt-1">
            <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder={i18n.t("cv.builder.placeholderJobTitle")} />
          </p>
        </div>
        <div className="flex-1 p-5 overflow-y-auto">
          <OrderedSections data={data} onChange={onChange} primary={primaryColor} accent={accentColor} allowedSections={rightSections} blocks={mainBlocks} />
        </div>
      </div>
    </div>
  );
};



// 16. MINIMAL LINE (Tối giản, đường line mảnh, header căn giữa)
const CVTemplateMinimalLine = ({ data, onChange, template }: { data: any; onChange: (d: any) => void; template: SelectedCVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  const order = data.sectionOrder?.length ? data.sectionOrder : DEFAULT_SECTION_ORDER;
  const leftSections = order.filter((key: string) => getSectionColumn(key, template.layout, data.sectionColumns) === "left");
  const rightSections = order.filter((key: string) => getSectionColumn(key, template.layout, data.sectionColumns) === "right");

  const minimalLineBlocks = {
    ...makeSectionBlocks(data, onChange, primaryColor, accentColor, "default"),
    objective: () => data.objective === undefined ? null : (
      <div>
        <h3 className="font-bold text-[10.5px] uppercase tracking-widest mb-1.5 pb-1" style={{ color: primaryColor, borderBottom: `1px solid ${primaryColor}30` }}>{i18n.t("cv.builder.sectionObjective")}</h3>
        <div className="text-[10px] text-slate-600 leading-relaxed">
          <InlineTextarea value={data.objective} onChange={(v) => onChange({ ...data, objective: v })} placeholder="Mô tả mục tiêu..." className="!text-[10px]" />
        </div>
      </div>
    ),
    experience: () => !data.experience?.length ? null : (
      <div>
        <h3 className="font-bold text-[10.5px] uppercase tracking-widest mb-2.5 pb-1" style={{ color: primaryColor, borderBottom: `1px solid ${primaryColor}30` }}>{i18n.t("cv.builder.sectionExperience")}</h3>
        <div className="space-y-3">
          {data.experience.map((exp: any, i: number) => (
            <div key={exp.id} className="group relative">
              <button onClick={() => { const e = data.experience.filter((_: any, idx: number) => idx !== i); onChange({ ...data, experience: e }); }}
                className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
              <div className="flex justify-between items-baseline text-[10.5px]">
                <div>
                  <span className="font-bold text-slate-800"><InlineInput value={exp.position} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], position: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderPosition")} className="!font-bold" /></span>
                  <span className="text-slate-500 mx-1.5">·</span>
                  <span className="font-medium" style={{ color: accentColor }}><InlineInput value={exp.company} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], company: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderCompany")} className="!font-medium" style={{ color: accentColor }} /></span>
                </div>
                <span className="text-[9px] text-slate-400 shrink-0"><InlineInput value={exp.startDate} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], startDate: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderFrom")} className="w-8 !text-[9px]" /> – <InlineInput value={exp.endDate} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderTo")} className="w-12 !text-[9px]" /></span>
              </div>
              <div className="text-[9.5px] text-slate-500 mt-1 leading-relaxed"><InlineTextarea value={exp.description} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], description: v }; onChange({ ...data, experience: e }); }} placeholder={i18n.t("cv.builder.placeholderDescription")} className="!text-[9.5px] !text-slate-500" /></div>
            </div>
          ))}
        </div>
      </div>
    ),
    education: () => !data.education?.length ? null : (
      <div>
        <h3 className="font-bold text-[10.5px] uppercase tracking-widest mb-2 pb-1" style={{ color: primaryColor, borderBottom: `1px solid ${primaryColor}30` }}>{i18n.t("cv.builder.sectionEducation")}</h3>
        <div className="space-y-2">
          {data.education.map((edu: any, i: number) => (
            <div key={edu.id} className="group relative flex justify-between items-baseline text-[10.5px]">
              <button onClick={() => { const e = data.education.filter((_: any, idx: number) => idx !== i); onChange({ ...data, education: e }); }}
                className="absolute -right-4 top-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500"><Trash2 className="h-3 w-3" /></button>
              <div>
                <span className="font-bold text-slate-800"><InlineInput value={edu.degree} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], degree: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderMajor")} className="!font-bold" /></span>
                <span className="text-slate-500 mx-1.5">·</span>
                <span className="text-slate-600"><InlineInput value={edu.school} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], school: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderSchool")} /></span>
              </div>
              <span className="text-[9px] text-slate-400 shrink-0"><InlineInput value={edu.endDate} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, education: e }); }} placeholder={i18n.t("cv.builder.placeholderGradYear")} className="w-10 !text-[9px]" /></span>
            </div>
          ))}
        </div>
      </div>
    ),
    skills: () => !data.skills?.length ? null : (
      <div>
        <h3 className="font-bold text-[10.5px] uppercase tracking-widest mb-2 pb-1" style={{ color: primaryColor, borderBottom: `1px solid ${primaryColor}30` }}>{i18n.t("cv.builder.sectionSkills")}</h3>
        <div className="space-y-1.5">
          {data.skills.map((skill: any, i: number) => (
            <div key={i} className="group relative">
              <div className="flex justify-between items-center text-[9.5px]">
                <InlineInput value={skill.name} onChange={(v) => { const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s }); }} placeholder={i18n.t("cv.builder.placeholderSkill")} />
                <button onClick={() => { const s = data.skills.filter((_: any, idx: number) => idx !== i); onChange({ ...data, skills: s }); }}
                  className="absolute right-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 bg-white rounded-full p-0.5 shadow-sm"><Trash2 className="h-2.5 w-2.5" /></button>
              </div>
              <div className="h-px bg-slate-200 mt-1 relative">
                <div className="h-px absolute left-0 top-0" style={{ width: `${skill.level}%`, backgroundColor: primaryColor }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    languages: () => !data.languages?.length ? null : (
      <div>
        <h3 className="font-bold text-[10.5px] uppercase tracking-widest mb-1 pb-1" style={{ color: primaryColor, borderBottom: `1px solid ${primaryColor}30` }}>Ngôn ngữ</h3>
        <div className="space-y-1">
          {data.languages.map((lang: string, i: number) => (
            <div key={i} className="group relative text-[9.5px] text-slate-600">
              <InlineInput value={lang} onChange={(v) => { const l = [...data.languages]; l[i] = v; onChange({ ...data, languages: l }); }} className="flex-1 !pr-8 !text-[9.5px]" />
              <button onClick={() => { const l = data.languages.filter((_: any, idx: number) => idx !== i); onChange({ ...data, languages: l }); }}
                className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 bg-white rounded-full p-0.5 shadow-sm"><Trash2 className="h-3 w-3" /></button>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  return (
    <div className="w-full h-full bg-white p-7 text-slate-800 overflow-y-auto" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Centered Header */}
      <div className="text-center mb-5 pb-4 border-b border-slate-200 shrink-0">
        <div className="flex justify-center mb-3">
          <AvatarUploadButton data={data} onChange={onChange} size="large" />
        </div>
        <h2 className="text-[22px] font-light tracking-wide" style={{ color: primaryColor }}>
          <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder={i18n.t("cv.builder.placeholderName")} className="!font-light !text-[22px] uppercase tracking-widest" style={{ color: primaryColor }} />
        </h2>
        <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500 mt-1.5">
          <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder={i18n.t("cv.builder.placeholderJobTitle")} />
        </p>
        <div className="flex items-center justify-center gap-4 mt-2.5 text-[9.5px] text-slate-500">
          <span className="flex items-center gap-1"><Phone className="h-2.5 w-2.5" /><InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder={i18n.t("cv.builder.placeholderPhone")} className="!text-slate-500 !text-[9.5px]" /></span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1"><Mail className="h-2.5 w-2.5" /><InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder={i18n.t("cv.builder.placeholderEmail")} className="!text-slate-500 !text-[9.5px]" /></span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1"><MapPin className="h-2.5 w-2.5" /><InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder={i18n.t("cv.builder.placeholderAddress")} className="!text-slate-500 !text-[9.5px]" /></span>
        </div>
      </div>

      {/* Body: Dynamic columns */}
      {leftSections.length > 0 ? (
        <div className="flex gap-5">
          <div className="flex-1"><OrderedSections data={data} onChange={onChange} primary={primaryColor} accent={accentColor} allowedSections={leftSections} blocks={minimalLineBlocks} /></div>
          <div className="w-[220px] shrink-0"><OrderedSections data={data} onChange={onChange} primary={primaryColor} accent={accentColor} allowedSections={rightSections} blocks={minimalLineBlocks} /></div>
        </div>
      ) : (
        <div className="space-y-4">
          <OrderedSections data={data} onChange={onChange} primary={primaryColor} accent={accentColor} allowedSections={rightSections} blocks={minimalLineBlocks} />
        </div>
      )}
    </div>
  );
};



// ============ ADD SECTION BUTTONS ============

const AddSectionButton = ({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-primary hover:text-primary transition-all text-xs"
  >
    {icon}
    {label}
  </button>
);

// ============ HELPER FUNCTION TO GET TEMPLATE COMPONENT ============

export const getTemplateComponent = (layout: string) => {
  switch (layout) {
    case "modern-split":
      return CVTemplateModernSplit;
    case "sidebar-light":
      return CVTemplateSidebarLight;
    case "timeline-blue":
      return CVTemplateTimelineBlue;
    case "sidebar-dark":
      return CVTemplateSidebarDark;
    case "gradient-header":
      return CVTemplateGradientHeader;
    case "passion-clean":
      return CVTemplatePassionClean;
    case "bright-split":
      return CVTemplateBright;
    case "clarity-standard":
      return CVTemplateClarity;
    case "basic-split":
      return CVTemplateBasic5;
    case "elegant-classic":
      return CVTemplateElegant1;
    case "executive-banner":
      return CVTemplateExecutiveBanner;
    case "corporate-blue":
      return CVTemplateCorporateBlue;
    case "soft-pink":
      return CVTemplateSoftPink;
    case "maroon-classic":
      return CVTemplateMaroonClassic;
    case "ocean-grid":
      return CVTemplateOceanGrid;
    case "minimal-line":
      return CVTemplateMinimalLine;
    default:
      return CVTemplateModernSplit;
  }
};

// ============ TEMPLATE THUMBNAIL ============

// ============ TEMPLATE THUMBNAIL ============

const TemplateThumbnail = ({
  template,
  onSelect,
  onPreview,
}: {
  template: CVTemplate;
  onSelect: (colorsIndex: number) => void;
  onPreview: (colorsIndex: number) => void;
}) => {
  const [colorsIndex, setColorsIndex] = useState(0);
  const activeColor = template.colors[colorsIndex] || template.colors[0];
  const { primaryColor, secondaryColor, accentColor } = activeColor;

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setScale(width / 595);
      }
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const customizedTemplate: SelectedCVTemplate = {
    ...template,
    primaryColor: activeColor.primaryColor,
    secondaryColor: activeColor.secondaryColor,
    accentColor: activeColor.accentColor,
    textColor: activeColor.textColor,
  };

  const sampleData = sampleCVData[template.id] || defaultCVData;

  const TemplateComponent =
    template.layout === "modern-split" ? CVTemplateModernSplit
      : template.layout === "sidebar-light" ? CVTemplateSidebarLight
        : template.layout === "timeline-blue" ? CVTemplateTimelineBlue
          : template.layout === "sidebar-dark" ? CVTemplateSidebarDark
            : template.layout === "gradient-header" ? CVTemplateGradientHeader
              : template.layout === "passion-clean" ? CVTemplatePassionClean
                : template.layout === "bright-split" ? CVTemplateBright
                  : template.layout === "clarity-standard" ? CVTemplateClarity
                    : template.layout === "basic-split" ? CVTemplateBasic5
                      : template.layout === "elegant-classic" ? CVTemplateElegant1
                        : template.layout === "executive-banner" ? CVTemplateExecutiveBanner
                          : template.layout === "corporate-blue" ? CVTemplateCorporateBlue
                            : template.layout === "soft-pink" ? CVTemplateSoftPink
                              : template.layout === "maroon-classic" ? CVTemplateMaroonClassic
                                : template.layout === "ocean-grid" ? CVTemplateOceanGrid
                                  : template.layout === "minimal-line" ? CVTemplateMinimalLine
                                    : CVTemplateModernSplit;

  return (
    <div className="group flex flex-col bg-card/40 border border-border hover:border-border/80 rounded-3xl p-3.5 hover:shadow-xl transition-all duration-300 relative">
      {/* Preview box wrapper */}
      <div
        ref={containerRef}
        className="relative mx-auto aspect-[210/297] w-full overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)] ring-1 ring-slate-200/50"
      >
        <div
          className="absolute top-0 left-0 w-[595px] h-[842px] origin-top-left pointer-events-none select-none"
          style={{ transform: `scale(${scale})` }}
        >
          <TemplateComponent
            data={sampleData}
            onChange={() => { }}
            template={customizedTemplate}
          />
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center gap-2.5 transition-all duration-300 z-30 backdrop-blur-[2px]">
          <button
            type="button"
            onClick={() => onSelect(colorsIndex)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer transform hover:scale-105"
          >
            {i18n.t("cv.builder.useTemplate")}
          </button>
          <button
            type="button"
            onClick={() => onPreview(colorsIndex)}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg hover:shadow-white/10 transition-all cursor-pointer transform hover:scale-105"
          >
            {i18n.t("cv.builder.preview")}
          </button>
        </div>
      </div>

      {/* Colors Indicator Dots Under Image */}
      <div className="flex items-center justify-center gap-1.5 mt-3.5">
        {template.colors.map((color, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setColorsIndex(idx)}
            className={`w-3.5 h-3.5 rounded-full border border-white shadow-sm transition-all duration-200 transform hover:scale-110 cursor-pointer ${colorsIndex === idx
              ? "ring-2 ring-offset-2 ring-slate-400 scale-110"
              : "opacity-70 hover:opacity-100"
              }`}
            style={{ backgroundColor: color.primaryColor }}
            title={i18n.t("cv.builder.colorN", { n: idx + 1 })}
          />
        ))}
      </div>

      {/* Title & Description */}
      <h3 className="text-foreground font-bold text-center text-sm mt-3 line-clamp-1 group-hover:text-primary transition-colors duration-200 px-1">
        {template.name}
      </h3>

      {/* Tags Row */}
      <div className="flex flex-wrap items-center justify-center gap-1 mt-2">
        {template.tags.map((tag) => (
          <span
            key={tag}
            className="bg-[#e6f2ff] text-[#0066cc] text-[10px] font-semibold px-2.5 py-0.5 rounded-md uppercase tracking-wider"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

// ============ TEMPLATE PREVIEW MODAL ============

interface TemplatePreviewModalProps {
  template: CVTemplate;
  initialColorsIndex: number;
  onClose: () => void;
  onSelect: (colorsIndex: number) => void;
}

const TemplatePreviewModal = ({
  template,
  initialColorsIndex,
  onClose,
  onSelect,
}: TemplatePreviewModalProps) => {
  const [colorsIndex, setColorsIndex] = useState(initialColorsIndex);
  const activeColor = template.colors[colorsIndex] || template.colors[0];

  const customizedTemplate: SelectedCVTemplate = {
    ...template,
    primaryColor: activeColor.primaryColor,
    secondaryColor: activeColor.secondaryColor,
    accentColor: activeColor.accentColor,
    textColor: activeColor.textColor,
  };

  const sampleData = sampleCVData[template.id] || defaultCVData;

  const TemplateComponent =
    template.layout === "modern-split" ? CVTemplateModernSplit
      : template.layout === "sidebar-light" ? CVTemplateSidebarLight
        : template.layout === "timeline-blue" ? CVTemplateTimelineBlue
          : template.layout === "sidebar-dark" ? CVTemplateSidebarDark
            : template.layout === "gradient-header" ? CVTemplateGradientHeader
              : template.layout === "passion-clean" ? CVTemplatePassionClean
                : template.layout === "bright-split" ? CVTemplateBright
                  : template.layout === "clarity-standard" ? CVTemplateClarity
                    : template.layout === "basic-split" ? CVTemplateBasic5
                      : template.layout === "elegant-classic" ? CVTemplateElegant1
                        : template.layout === "executive-banner" ? CVTemplateExecutiveBanner
                          : template.layout === "corporate-blue" ? CVTemplateCorporateBlue
                            : template.layout === "soft-pink" ? CVTemplateSoftPink
                              : template.layout === "maroon-classic" ? CVTemplateMaroonClassic
                                : template.layout === "ocean-grid" ? CVTemplateOceanGrid
                                  : template.layout === "minimal-line" ? CVTemplateMinimalLine
                                    : CVTemplateModernSplit;

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.8);

  useEffect(() => {
    if (!previewContainerRef.current) return;
    const updateScale = () => {
      if (previewContainerRef.current) {
        const height = previewContainerRef.current.clientHeight;
        const width = previewContainerRef.current.clientWidth;
        const maxW = width - 32;
        const maxH = height - 32;
        const scaleW = maxW / 595;
        const scaleH = maxH / 842;
        setScale(Math.min(scaleW, scaleH, 1.2));
      }
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(previewContainerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 dark:bg-black/85 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-card border border-border rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col md:flex-row text-foreground animate-in zoom-in-95 duration-200">
        {/* Left Panel: Dynamic CV Preview */}
        <div
          ref={previewContainerRef}
          className="flex-1 bg-muted/30 dark:bg-slate-950/40 p-4 flex items-center justify-center min-h-0 relative overflow-hidden"
        >
          <div
            className="w-[595px] h-[842px] shadow-2xl rounded-lg overflow-hidden flex-shrink-0 bg-white transition-all duration-300"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "center center"
            }}
          >
            <TemplateComponent
              data={sampleData}
              onChange={() => { }}
              template={customizedTemplate}
            />
          </div>
        </div>

        {/* Right Panel: Template details and actions */}
        <div className="w-full md:w-80 bg-card border-t md:border-t-0 md:border-l border-border p-6 flex flex-col justify-between shrink-0 backdrop-blur-md">
          <div>
            {/* Header info */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  {i18n.t("cv.builder.styleLabel", { style: template.style })}
                </span>
                <h3 className="text-xl font-bold text-foreground mt-2">{template.name}</h3>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground bg-muted hover:bg-accent p-1.5 rounded-lg transition-colors cursor-pointer border border-border/50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {template.description}
            </p>

            {/* Colors Section */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {i18n.t("cv.builder.mainColors")}
              </h4>
              <div className="flex items-center gap-3">
                {template.colors.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setColorsIndex(idx)}
                    className={`w-6 h-6 rounded-full border-2 border-background shadow-md transition-all duration-200 transform hover:scale-110 cursor-pointer ${colorsIndex === idx
                      ? "ring-2 ring-primary scale-110"
                      : "opacity-60 hover:opacity-100"
                      }`}
                    style={{ backgroundColor: color.primaryColor }}
                    title={i18n.t("cv.builder.colorN", { n: idx + 1 })}
                  />
                ))}
              </div>
            </div>

            {/* Tags Section */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {i18n.t("cv.builder.features")}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-muted text-muted-foreground text-[10px] font-medium px-2.5 py-0.5 rounded-md uppercase tracking-wider border border-border/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons at the bottom */}
          <div className="mt-8 space-y-2">
            <Button
              onClick={() => onSelect(colorsIndex)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold h-11 rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-200 border-0"
            >
              {i18n.t("cv.builder.useThisTemplate")}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-border text-foreground hover:bg-muted h-11 rounded-xl transition-all"
            >
              {i18n.t("cv.builder.backToList")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============

export default function CVBuilderPage() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navItems = useUserNavItems();

  // Clear active session on FRESH navigation (not reload)
  // This ensures "Tạo CV mới" always starts fresh, but reload preserves data
  const [_navChecked] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
        const isReload = navEntries.length > 0 && navEntries[0].type === "reload";
        if (!isReload) {
          sessionStorage.removeItem("jobready_active_cv_builder_session");
          // Clear temporary AI chat for new CVs (draft chats stay in localStorage)
          const userId = user?.id || "guest";
          localStorage.removeItem(`jobready_cv_advisor_session_new_${userId}`);
        }
      } catch {}
    }
    return true;
  });

  const [step, setStep] = useState<"select" | "build">(() => {
    if (typeof window !== "undefined") {
      try {
        const session = sessionStorage.getItem("jobready_active_cv_builder_session");
        if (session) {
          const parsed = JSON.parse(session);
          if (parsed.step) return parsed.step;
        }
      } catch {}
    }
    return "select";
  });
  const [selectedTemplate, setSelectedTemplate] = useState<SelectedCVTemplate | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const session = sessionStorage.getItem("jobready_active_cv_builder_session");
        if (session) {
          const parsed = JSON.parse(session);
          if (parsed.selectedTemplate) return parsed.selectedTemplate;
        }
      } catch {}
    }
    return null;
  });
  const [cvData, setCVData] = useState<CVData>(() => {
    if (typeof window !== "undefined") {
      try {
        const session = sessionStorage.getItem("jobready_active_cv_builder_session");
        if (session) {
          const parsed = JSON.parse(session);
          if (parsed.cvData) return parsed.cvData;
        }
      } catch {}
    }
    return defaultCVData;
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showDraftSaveToast, setShowDraftSaveToast] = useState(false);
  const [skillInput, setSkillInput] = useState(false);
  const [skillValue, setSkillValue] = useState("");
  const [langValue, setLangValue] = useState("");
  const [hobbyValue, setHobbyValue] = useState("");
  const [certValue, setCertValue] = useState("");
  const [currentTemplatePage, setCurrentTemplatePage] = useState(0);
  const [activeTemplateFilter, setActiveTemplateFilter] = useState<TemplateFilter>("all");

  // Draft management
  const [draftId, setDraftId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const session = sessionStorage.getItem("jobready_active_cv_builder_session");
        if (session) {
          const parsed = JSON.parse(session);
          if (parsed.draftId !== undefined) return parsed.draftId;
        }
      } catch {}
    }
    return null;
  });
  const [savedCvId, setSavedCvId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const session = sessionStorage.getItem("jobready_active_cv_builder_session");
        if (session) {
          const parsed = JSON.parse(session);
          if (parsed.savedCvId !== undefined) return parsed.savedCvId;
        }
      } catch {}
    }
    return null;
  });
  const [tabColorsIndex, setTabColorsIndex] = useState<Record<string, number>>({});

  // Modal preview states
  const [previewTemplate, setPreviewTemplate] = useState<CVTemplate | null>(null);
  const [previewColorsIndex, setPreviewColorsIndex] = useState<number>(0);

  // Sidebar editor states
  const [activeTab, setActiveTab] = useState<"design" | "sections" | "layout" | "templates" | null>("design");
  const [cvFontFamily, setCvFontFamily] = useState<string>("'Segoe UI', sans-serif");
  const [cvFontSize, setCvFontSize] = useState<"small" | "medium" | "large" | "xlarge">("medium");
  const [cvLineHeight, setCvLineHeight] = useState<number>(1.4);
  const [cvBackground, setCvBackground] = useState<string>("none");

  // Sync design settings from cvData when cvData is loaded/updated
  useEffect(() => {
    if (cvData) {
      if (cvData.fontFamily) setCvFontFamily(cvData.fontFamily);
      if (cvData.fontSize) setCvFontSize(cvData.fontSize);
      if (cvData.lineHeight) setCvLineHeight(cvData.lineHeight);
      if (cvData.background) setCvBackground(cvData.background);
    }
  }, [cvData?.id, cvData?.fontFamily, cvData?.fontSize, cvData?.lineHeight, cvData?.background]);

  // Sync active CV Builder session to sessionStorage
  useEffect(() => {
    if (step === "build" && selectedTemplate) {
      const activeSession = {
        step,
        selectedTemplate,
        cvData,
        draftId,
        savedCvId
      };
      sessionStorage.setItem("jobready_active_cv_builder_session", JSON.stringify(activeSession));
    } else {
      sessionStorage.removeItem("jobready_active_cv_builder_session");
    }
  }, [step, selectedTemplate, cvData, draftId, savedCvId]);

  // Tab change handler
  const handleTabClick = (tab: "design" | "sections" | "layout" | "templates") => {
    setActiveTab(prev => prev === tab ? null : tab);
  };

  // Color change helper
  const handleColorChange = (primary: string, secondary?: string, accent?: string) => {
    if (!selectedTemplate) return;
    setSelectedTemplate((prev: any) => {
      if (!prev) return null;
      return {
        ...prev,
        primaryColor: primary,
        secondaryColor: secondary || prev.secondaryColor,
        accentColor: accent || prev.accentColor,
      };
    });
  };

  // Reordering helpers
  const moveExperience = (index: number, direction: "up" | "down") => {
    const list = [...cvData.experience];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < list.length) {
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      setCVData((p) => ({ ...p, experience: list }));
    }
  };

  const moveEducation = (index: number, direction: "up" | "down") => {
    const list = [...cvData.education];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < list.length) {
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      setCVData((p) => ({ ...p, education: list }));
    }
  };

  // Sidebar components rendering functions
  const renderDesignTab = () => {
    const FONTS = [
      { value: "'Segoe UI', sans-serif", label: i18n.t("cv.builder.fontDefault") },
      { value: "Arial, sans-serif", label: "Arial" },
      { value: "'Roboto', sans-serif", label: "Roboto" },
      { value: "'Inter', sans-serif", label: "Inter" },
      { value: "'Times New Roman', serif", label: "Times New Roman" },
      { value: "Georgia, serif", label: "Georgia" }
    ];

    const BACKGROUNDS = [
      { id: "none", name: i18n.t("cv.builder.bgWhite"), value: "none" },
      { id: "blue", name: i18n.t("cv.builder.bgBlue"), value: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)" },
      { id: "pink", name: i18n.t("cv.builder.bgPink"), value: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)" },
      { id: "purple", name: i18n.t("cv.builder.bgPurple"), value: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)" },
      { id: "pattern", name: i18n.t("cv.builder.bgPattern"), value: "radial-gradient(#cbd5e1 1px, transparent 1px), #ffffff" }
    ];

    return (
      <div className="space-y-6">
        {/* Font Select */}
        <div>
          <label className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">{i18n.t("cv.builder.fontLabel")}</label>
          <select
            value={cvFontFamily}
            onChange={(e) => {
              const val = e.target.value;
              setCvFontFamily(val);
              setCVData(p => ({ ...p, fontFamily: val }));
            }}
            className="w-full h-10 px-3 border border-border bg-background text-foreground rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          >
            {FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>

        {/* Font Size Slider */}
        <div>
          <label className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">{i18n.t("cv.builder.fontSizeLabel")}</label>
          <input
            type="range"
            min="0"
            max="3"
            step="1"
            value={cvFontSize === "small" ? 0 : cvFontSize === "medium" ? 1 : cvFontSize === "large" ? 2 : 3}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              const size = val === 0 ? "small" : val === 1 ? "medium" : val === 2 ? "large" : "xlarge";
              setCvFontSize(size);
              setCVData(p => ({ ...p, fontSize: size }));
            }}
            className="w-full accent-primary h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-muted-foreground mt-1.5 px-0.5">
            <span>{i18n.t("cv.builder.fontSizeSmall")}</span>
            <span>{i18n.t("cv.builder.fontSizeMedium")}</span>
            <span>{i18n.t("cv.builder.fontSizeLarge")}</span>
            <span>{i18n.t("cv.builder.fontSizeXlarge")}</span>
          </div>
        </div>

        {/* Line Spacing Slider */}
        <div>
          <label className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">{i18n.t("cv.builder.lineSpacingLabel")}</label>
          <input
            type="range"
            min="1.0"
            max="2.0"
            step="0.2"
            value={cvLineHeight}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setCvLineHeight(val);
              setCVData(p => ({ ...p, lineHeight: val }));
            }}
            className="w-full accent-primary h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-muted-foreground mt-1.5 px-0.5">
            <span>1.0</span>
            <span>1.4</span>
            <span>2.0</span>
          </div>
        </div>

        {/* Primary Color Picker - TopCV style: template color schemes */}
        <div>
          <label className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">{i18n.t("cv.builder.themeColorLabel")}</label>

          {/* Template color scheme swatches */}
          {selectedTemplate && selectedTemplate.colors && selectedTemplate.colors.length > 0 && (
            <div className="mb-3">
              <p className="text-[9.5px] text-muted-foreground mb-2">{i18n.t("cv.builder.templateColors")}</p>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.colors.map((colorScheme, idx) => {
                  const isActive = selectedTemplate.primaryColor === colorScheme.primaryColor;
                  return (
                    <button
                      key={idx}
                      type="button"
                      title={i18n.t("cv.builder.colorNPrimary", { n: idx + 1, color: colorScheme.primaryColor })}
                      onClick={() => {
                        setSelectedTemplate(prev => prev ? {
                          ...prev,
                          primaryColor: colorScheme.primaryColor,
                          secondaryColor: colorScheme.secondaryColor,
                          accentColor: colorScheme.accentColor,
                          textColor: colorScheme.textColor,
                        } : prev);
                      }}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all transform hover:scale-110 cursor-pointer shadow-sm ${isActive ? "border-primary scale-110 ring-2 ring-primary ring-offset-1" : "border-border hover:border-primary/50"
                        }`}
                      style={{ backgroundColor: colorScheme.primaryColor }}
                    >
                      {isActive && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick preset colors */}
          <p className="text-[9.5px] text-muted-foreground mb-2">{i18n.t("cv.builder.customColors")}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {["#1e293b", "#4f46e5", "#059669", "#be123c", "#d97706", "#0369a1", "#7c3aed", "#b45309"].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorChange(color)}
                className={`w-7 h-7 rounded-full border-2 shadow-sm transition-all transform hover:scale-110 cursor-pointer ${selectedTemplate?.primaryColor === color ? "border-primary ring-2 ring-primary ring-offset-1 scale-110" : "border-border hover:border-primary/50"
                  }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-border shadow-sm shrink-0">
              <input
                type="color"
                value={selectedTemplate?.primaryColor || "#4f46e5"}
                onChange={(e) => handleColorChange(e.target.value)}
                className="absolute inset-0 w-[200%] h-[200%] -translate-x-[25%] -translate-y-[25%] cursor-pointer"
              />
            </div>
            <div className="flex-1 h-8 px-2 border border-border bg-background rounded-lg flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground uppercase">{i18n.t("cv.builder.hex")}</span>
              <input
                type="text"
                value={selectedTemplate?.primaryColor?.replace('#', '') || ''}
                onChange={(e) => handleColorChange('#' + e.target.value)}
                className="w-20 text-xs font-bold text-right outline-none bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* CV Background Options */}
        <div>
          <label className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">{i18n.t("cv.builder.cvBackground")}</label>
          <div className="grid grid-cols-1 gap-2">
            {BACKGROUNDS.map((bg) => (
              <button
                key={bg.id}
                type="button"
                onClick={() => {
                  setCvBackground(bg.value);
                  setCVData(p => ({ ...p, background: bg.value }));
                }}
                className={`flex items-center gap-2.5 p-2 border border-border bg-card hover:bg-accent text-[11px] rounded-lg transition-all text-left ${cvBackground === bg.value ? "border-primary font-semibold ring-1 ring-primary" : "border-border text-muted-foreground"
                  }`}
              >
                <div className="w-5 h-5 rounded border border-border shrink-0" style={{ background: bg.value === "none" ? "#ffffff" : bg.value, backgroundSize: bg.id === "pattern" ? "6px 6px" : "auto" }} />
                <span className="line-clamp-1">{bg.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSectionsTab = () => {
    const activeSections: { id: string; label: string; action: () => void }[] = [];
    const inactiveSections: { id: string; label: string; action: () => void }[] = [];

    // Objective
    const hasObjective = cvData.objective !== undefined;
    const objectiveItem = {
      id: "objective",
      label: i18n.t("cv.builder.sectionObjective"),
      action: () => {
        setCVData(p => ({ ...p, objective: hasObjective ? undefined : "" }));
      }
    };
    if (hasObjective) activeSections.push(objectiveItem);
    else inactiveSections.push(objectiveItem);

    // Experience
    const hasExperience = cvData.experience && cvData.experience.length > 0;
    const experienceItem = {
      id: "experience",
      label: i18n.t("cv.builder.sectionExperience"),
      action: () => {
        setCVData(p => ({
          ...p,
          experience: hasExperience ? [] : [{ id: Date.now().toString(), company: i18n.t("cv.builder.placeholderCompany"), position: i18n.t("cv.builder.placeholderPosition"), startDate: "", endDate: "", description: "" }]
        }));
      }
    };
    if (hasExperience) activeSections.push(experienceItem);
    else inactiveSections.push(experienceItem);

    // Education
    const hasEducation = cvData.education && cvData.education.length > 0;
    const educationItem = {
      id: "education",
      label: i18n.t("cv.builder.sectionEducation"),
      action: () => {
        setCVData(p => ({
          ...p,
          education: hasEducation ? [] : [{ id: Date.now().toString(), school: i18n.t("cv.builder.placeholderSchool"), degree: i18n.t("cv.builder.placeholderMajorDegree"), field: "", startDate: "", endDate: "" }]
        }));
      }
    };
    if (hasEducation) activeSections.push(educationItem);
    else inactiveSections.push(educationItem);

    // Skills
    const hasSkills = cvData.skills && cvData.skills.length > 0;
    const skillsItem = {
      id: "skills",
      label: i18n.t("cv.builder.sectionSkills"),
      action: () => {
        setCVData(p => ({
          ...p,
          skills: hasSkills ? [] : [{ name: i18n.t("cv.builder.sampleSkill"), level: 70 }]
        }));
      }
    };
    if (hasSkills) activeSections.push(skillsItem);
    else inactiveSections.push(skillsItem);

    // Languages
    const hasLanguages = cvData.languages && cvData.languages.length > 0;
    const languagesItem = {
      id: "languages",
      label: i18n.t("cv.builder.sectionLanguages"),
      action: () => {
        setCVData(p => ({
          ...p,
          languages: hasLanguages ? [] : [i18n.t("cv.builder.sampleEnglish")]
        }));
      }
    };
    if (hasLanguages) activeSections.push(languagesItem);
    else inactiveSections.push(languagesItem);

    // Hobbies
    const hasHobbies = cvData.hobbies && cvData.hobbies.length > 0;
    const hobbiesItem = {
      id: "hobbies",
      label: i18n.t("cv.builder.sectionHobbies"),
      action: () => {
        setCVData(p => ({
          ...p,
          hobbies: hasHobbies ? [] : [i18n.t("cv.builder.sampleReading")]
        }));
      }
    };
    if (hasHobbies) activeSections.push(hobbiesItem);
    else inactiveSections.push(hobbiesItem);

    // Certifications
    const hasCertifications = cvData.certifications && cvData.certifications.length > 0;
    const certificationsItem = {
      id: "certifications",
      label: i18n.t("cv.builder.sectionCertifications"),
      action: () => {
        setCVData(p => ({
          ...p,
          certifications: hasCertifications ? [] : [i18n.t("cv.builder.sampleCert")]
        }));
      }
    };
    if (hasCertifications) activeSections.push(certificationsItem);
    else inactiveSections.push(certificationsItem);

    return (
      <div className="space-y-6">
        <div>
          <h4 className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">{i18n.t("cv.builder.unusedSections")}</h4>
          {inactiveSections.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">{i18n.t("cv.builder.allSectionsUsed")}</p>
          ) : (
            <div className="space-y-2">
              {inactiveSections.map(sec => (
                <div key={sec.id} className="flex items-center justify-between p-3 bg-muted/45 border border-border rounded-xl">
                  <span className="text-xs font-semibold text-foreground">{sec.label}</span>
                  <button
                    onClick={sec.action}
                    type="button"
                    className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs cursor-pointer flex items-center justify-center border-0 shadow-sm transition-all hover:scale-105"
                    title={i18n.t("cv.builder.addSection")}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">{i18n.t("cv.builder.usedSections")}</h4>
          {activeSections.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">{i18n.t("cv.builder.noSectionsVisible")}</p>
          ) : (
            <div className="space-y-2">
              {activeSections.map(sec => (
                <div key={sec.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
                  <span className="text-xs font-semibold text-foreground">{sec.label}</span>
                  <button
                    onClick={sec.action}
                    type="button"
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs cursor-pointer flex items-center justify-center border-0 transition-colors"
                    title={i18n.t("cv.builder.hideSection")}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLayoutTab = () => {
    const sectionLabels: Record<string, string> = {
      objective: i18n.t("cv.builder.sectionObjective"),
      experience: i18n.t("cv.builder.sectionExperience"),
      education: i18n.t("cv.builder.sectionEducation"),
      certifications: i18n.t("cv.builder.sectionCertifications"),
      skills: i18n.t("cv.builder.sectionSkills"),
      languages: i18n.t("cv.builder.sectionLanguages"),
      hobbies: i18n.t("cv.builder.sectionHobbies"),
    };

    const currentOrder: string[] = cvData.sectionOrder?.length
      ? cvData.sectionOrder
      : DEFAULT_SECTION_ORDER;

    // Determine which sections are "active" (have content)
    const isSectionActive = (key: string): boolean => {
      if (key === "objective") return !!(cvData.objective && cvData.objective.trim());
      if (key === "experience") return cvData.experience?.length > 0;
      if (key === "education") return cvData.education?.length > 0;
      if (key === "certifications") return cvData.certifications?.length > 0;
      if (key === "skills") return cvData.skills?.length > 0;
      if (key === "languages") return cvData.languages?.length > 0;
      if (key === "hobbies") return cvData.hobbies?.length > 0;
      return false;
    };

    const moveSectionOrder = (idx: number, dir: "up" | "down") => {
      const newOrder = [...currentOrder];
      const targetIdx = dir === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= newOrder.length) return;
      [newOrder[idx], newOrder[targetIdx]] = [newOrder[targetIdx], newOrder[idx]];
      setCVData(p => ({ ...p, sectionOrder: newOrder }));
    };

    const activeSections = currentOrder.filter(isSectionActive);
    const inactiveSections = currentOrder.filter(k => !isSectionActive(k));

    return (
      <div className="space-y-5">
        <div>
          <h4 className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{i18n.t("cv.builder.layoutTitle")}</h4>
          <p className="text-[10px] text-muted-foreground">{i18n.t("cv.builder.layoutDescription")}</p>
        </div>

        {/* Active sections — reorderable */}
        <div className="space-y-2">
          <p className="text-[9.5px] font-bold text-foreground/60 uppercase tracking-wider">{i18n.t("cv.builder.showingSections")}</p>
          {activeSections.length === 0 ? (
            <p className="text-[10px] text-muted-foreground italic px-1">{i18n.t("cv.builder.noSections")}</p>
          ) : (
            activeSections.map((key) => {
              const idx = currentOrder.indexOf(key);
              const activeIdx = activeSections.indexOf(key);
              const isTwoColumn = selectedTemplate && selectedTemplate.layout !== "passion-clean" && selectedTemplate.layout !== "minimal-line";
              const currentColumn = isTwoColumn ? getSectionColumn(key, selectedTemplate.layout, cvData.sectionColumns) : "right";
              return (
                <div
                  key={key}
                  className="flex flex-col gap-2 p-3 bg-card border border-border rounded-xl shadow-sm transition-all hover:border-primary/30"
                >
                  <div className="flex items-center justify-between min-w-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      <span className="text-[11px] font-semibold text-foreground truncate">
                        {sectionLabels[key] || key}
                      </span>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={activeIdx === 0}
                        onClick={() => moveSectionOrder(idx, "up")}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-muted hover:bg-accent disabled:opacity-25 cursor-pointer border border-border/50 text-[11px] transition-colors"
                      >▲</button>
                      <button
                        type="button"
                        disabled={activeIdx === activeSections.length - 1}
                        onClick={() => moveSectionOrder(idx, "down")}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-muted hover:bg-accent disabled:opacity-25 cursor-pointer border border-border/50 text-[11px] transition-colors"
                      >▼</button>
                    </div>
                  </div>
                  {isTwoColumn && (
                    <div className="flex items-center justify-between border-t border-border/50 pt-2 mt-1">
                      <span className="text-[9px] text-muted-foreground">{i18n.t("cv.builder.displayColumn")}</span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const newCols = { ...cvData.sectionColumns, [key]: "left" as const };
                            setCVData(p => ({ ...p, sectionColumns: newCols }));
                          }}
                          className={`px-2 py-0.5 text-[9px] font-semibold rounded cursor-pointer transition-colors ${currentColumn === "left" ? "bg-primary text-white" : "bg-muted text-muted-foreground border border-border/50 hover:bg-accent"}`}
                        >
                          {i18n.t("cv.builder.columnLeft")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newCols = { ...cvData.sectionColumns, [key]: "right" as const };
                            setCVData(p => ({ ...p, sectionColumns: newCols }));
                          }}
                          className={`px-2 py-0.5 text-[9px] font-semibold rounded cursor-pointer transition-colors ${currentColumn === "right" ? "bg-primary text-white" : "bg-muted text-muted-foreground border border-border/50 hover:bg-accent"}`}
                        >
                          {i18n.t("cv.builder.columnRight")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Inactive sections — shown as greyed out */}
        {inactiveSections.length > 0 && (
          <div className="space-y-2">
            <p className="text-[9.5px] font-bold text-foreground/40 uppercase tracking-wider">{i18n.t("cv.builder.noContent")}</p>
            {inactiveSections.map((key) => (
              <div
                key={key}
                className="flex items-center gap-2.5 p-3 bg-muted/30 border border-border/50 rounded-xl"
              >
                <div className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
                <span className="text-[11px] text-muted-foreground truncate">
                  {sectionLabels[key] || key}
                </span>
                <span className="ml-auto text-[9px] text-muted-foreground/60 italic">{i18n.t("cv.builder.empty")}</span>
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-border pt-4">
          <p className="text-[9.5px] font-bold text-foreground/60 uppercase tracking-wider mb-3">{i18n.t("cv.builder.itemOrder")}</p>

          {/* Experience Items Reordering */}
          {cvData.experience && cvData.experience.length > 1 && (
            <div className="space-y-2 mb-4">
              <h5 className="text-[9.5px] font-semibold text-muted-foreground">{i18n.t("cv.builder.sectionExperience")}</h5>
              <div className="space-y-1.5">
                {cvData.experience.map((exp, i) => (
                  <div key={exp.id || i} className="flex items-center justify-between p-2.5 bg-muted/20 border border-border rounded-lg text-xs">
                    <span className="font-semibold text-foreground truncate max-w-[170px]">{exp.company || `${i18n.t("cv.builder.job")} ${i + 1}`}</span>
                    <div className="flex gap-1 shrink-0">
                      <button type="button" disabled={i === 0} onClick={() => moveExperience(i, "up")}
                        className="p-1 rounded hover:bg-muted disabled:opacity-30 cursor-pointer text-foreground border border-border/50 text-[10px]">▲</button>
                      <button type="button" disabled={i === cvData.experience.length - 1} onClick={() => moveExperience(i, "down")}
                        className="p-1 rounded hover:bg-muted disabled:opacity-30 cursor-pointer text-foreground border border-border/50 text-[10px]">▼</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Items Reordering */}
          {cvData.education && cvData.education.length > 1 && (
            <div className="space-y-2 mb-4">
              <h5 className="text-[9.5px] font-semibold text-muted-foreground">{i18n.t("cv.builder.sectionEducation")}</h5>
              <div className="space-y-1.5">
                {cvData.education.map((edu, i) => (
                  <div key={edu.id || i} className="flex items-center justify-between p-2.5 bg-muted/20 border border-border rounded-lg text-xs">
                    <span className="font-semibold text-foreground truncate max-w-[170px]">{edu.school || `${i18n.t("cv.builder.school")} ${i + 1}`}</span>
                    <div className="flex gap-1 shrink-0">
                      <button type="button" disabled={i === 0} onClick={() => moveEducation(i, "up")}
                        className="p-1 rounded hover:bg-muted disabled:opacity-30 cursor-pointer text-foreground border border-border/50 text-[10px]">▲</button>
                      <button type="button" disabled={i === cvData.education.length - 1} onClick={() => moveEducation(i, "down")}
                        className="p-1 rounded hover:bg-muted disabled:opacity-30 cursor-pointer text-foreground border border-border/50 text-[10px]">▼</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTemplatesTab = () => {
    const THUMB_WIDTH = 595;
    const THUMB_HEIGHT = 842;
    const DISPLAY_WIDTH = 180;
    const thumbScale = DISPLAY_WIDTH / THUMB_WIDTH;

    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{i18n.t("cv.builder.templatesTabTitle")}</h4>
          <p className="text-[10px] text-muted-foreground mb-3">{i18n.t("cv.builder.templatesTabDesc")}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {cvTemplates.map((template) => {
            const isSelected = selectedTemplate?.id === template.id;
            const cIdx = tabColorsIndex[template.id] || 0;
            const activeColor = template.colors[cIdx] || template.colors[0];
            const customizedTemplate: SelectedCVTemplate = {
              ...template,
              primaryColor: activeColor.primaryColor,
              secondaryColor: activeColor.secondaryColor,
              accentColor: activeColor.accentColor,
              textColor: activeColor.textColor,
            };
            const TemplateComp = getTemplateComponent(template.layout);
            const sampleData = sampleCVData[template.id] || defaultCVData;
            return (
              <div
                key={template.id}
                className={`group flex flex-col bg-card border rounded-2xl p-2 shadow-sm hover:shadow-md transition-all relative ${isSelected ? "border-primary ring-1 ring-primary/30" : "border-border hover:border-primary/20"
                  }`}
              >
                {/* Thumbnail */}
                <div
                  className="relative overflow-hidden w-full bg-white rounded-lg border border-border aspect-[210/297] cursor-pointer"
                  onClick={() => {
                    handleSelectTemplate(template, cIdx);
                  }}
                >
                  <div
                    className="absolute top-0 left-0 origin-top-left pointer-events-none select-none"
                    style={{
                      width: `${THUMB_WIDTH}px`,
                      height: `${THUMB_HEIGHT}px`,
                      transform: `scale(${thumbScale})`,
                    }}
                  >
                    <TemplateComp
                      data={sampleData}
                      onChange={() => { }}
                      template={customizedTemplate}
                    />
                  </div>
                  {/* Selected checkmark overlay */}
                  {isSelected && (
                    <div className="absolute bottom-3 right-3 z-10">
                      <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                  {/* Click to select overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/40 flex items-center justify-center transition-colors">
                    <span className="opacity-0 group-hover:opacity-100 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-md transition-all transform hover:scale-105">
                      {i18n.t("cv.builder.useTemplate")}
                    </span>
                  </div>
                </div>



                {/* Title */}
                <h3 className="text-foreground font-bold text-center text-[11px] mt-2.5 line-clamp-1">
                  {template.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Handle AI CV Data Application
  const handleApplyAIData = useCallback((aiData: any) => {
    if (!aiData) return;

    setCVData((prev) => {
      const updated = { ...prev };

      // Apply basic info
      if (aiData.fullName) updated.fullName = aiData.fullName;
      if (aiData.jobTitle) updated.jobTitle = aiData.jobTitle;
      if (aiData.phone) updated.phone = aiData.phone;
      if (aiData.email) updated.email = aiData.email;
      if (aiData.address) updated.address = aiData.address;
      if (aiData.dateOfBirth) updated.dateOfBirth = aiData.dateOfBirth;
      if (aiData.website) updated.website = aiData.website;
      if (aiData.objective) updated.objective = aiData.objective;

      // REPLACE experience (not append)
      if (aiData.experience && Array.isArray(aiData.experience)) {
        updated.experience = aiData.experience.map((exp: any, index: number) => ({
          id: `exp-${Date.now()}-${index}`,
          company: exp.company || "",
          position: exp.position || "",
          startDate: exp.startDate || "",
          endDate: exp.endDate || "",
          description: exp.description || ""
        }));
      }

      // REPLACE education (not append)
      if (aiData.education && Array.isArray(aiData.education)) {
        updated.education = aiData.education.map((edu: any, index: number) => ({
          id: `edu-${Date.now()}-${index}`,
          school: edu.school || "",
          degree: edu.degree || "",
          field: edu.field || "",
          startDate: edu.startDate || "",
          endDate: edu.endDate || ""
        }));
      }

      // REPLACE skills (not append)
      if (aiData.skills && Array.isArray(aiData.skills)) {
        updated.skills = aiData.skills.map((skill: any) => ({
          name: skill.name || skill,
          level: typeof skill === 'object' ? (skill.level || 3) : 3
        }));
      }

      // REPLACE languages
      if (aiData.languages && Array.isArray(aiData.languages)) {
        updated.languages = aiData.languages;
      }

      // REPLACE certifications
      if (aiData.certifications && Array.isArray(aiData.certifications)) {
        updated.certifications = aiData.certifications;
      }

      // REPLACE hobbies
      if (aiData.hobbies && Array.isArray(aiData.hobbies)) {
        updated.hobbies = aiData.hobbies;
      }

      return updated;
    });

    // Show success notification
    alert(i18n.t("cv.builder.aiApplied"));
  }, []);

  const filteredTemplatePages = templatePages
    .map((pageTemplates) => pageTemplates.filter((template) => matchesTemplateFilter(template, activeTemplateFilter)))
    .filter((pageTemplates) => pageTemplates.length > 0);
  const visibleTemplates = filteredTemplatePages[currentTemplatePage] || filteredTemplatePages[0] || [];

  // Load draft from sessionStorage on mount
  useEffect(() => {
    const draftData = sessionStorage.getItem("resume-draft");
    if (draftData) {
      try {
        const parsed = JSON.parse(draftData);
        if (parsed.data && parsed.template) {
          setCVData(parsed.data);
          setSelectedTemplate(parsed.template);
          setDraftId(parsed.draftId || null);
          setStep("build");
        }
        sessionStorage.removeItem("resume-draft");
      } catch (err) {
        console.error("Error loading draft:", err);
      }
    }
  }, []);

  // Load CV from API if ID is in URL
  useEffect(() => {
    const loadCVFromId = async () => {
      const params = new URLSearchParams(window.location.search);
      const cvId = params.get("id");

      if (cvId && user) {
        // Skip fetching if session already has this CV's data (preserves unsaved edits on reload)
        try {
          const activeSession = sessionStorage.getItem("jobready_active_cv_builder_session");
          if (activeSession) {
            const parsed = JSON.parse(activeSession);
            if (parsed.savedCvId === cvId && parsed.step === "build") return;
          }
        } catch {}

        try {
          const response = await fetch(`/api/cv/${cvId}`, {
            headers: {
              "x-user-id": user.id || "",
              "x-user-role": user.role || "user",
            },
          });

          if (response.ok) {
            const cv = await response.json();
            if (cv.content && cv.template_id) {
              // Find the template in cvTemplates
              const template = cvTemplates.find((t) => t.id === cv.template_id);
              if (template) {
                // Use the first color scheme or the saved one
                const templateWithColors = {
                  ...template,
                  primaryColor: template.colors[0]?.primaryColor || "#6366f1",
                  secondaryColor: template.colors[0]?.secondaryColor || "#4f46e5",
                  accentColor: template.colors[0]?.accentColor || "#a5b4fc",
                  textColor: template.colors[0]?.textColor || "#ffffff",
                };
                setSelectedTemplate(templateWithColors);
                setCVData(cv.content);
                setStep("build");
              }
            }
          }
        } catch (err) {
          console.error("Error loading CV:", err);
        }
      }
    };

    loadCVFromId();
  }, [user]);

  // Auto-save draft every 10 seconds when editing
  useEffect(() => {
    if (step !== "build" || !selectedTemplate || !user?.id) return;

    const autoSave = () => {
      if (!user?.id) return;

      const draftEntry: DraftCV = {
        id: draftId || "",
        title: cvData.title || cvData.fullName || i18n.t("cv.builder.untitledCV"),
        templateName: selectedTemplate.name,
        lastModified: new Date().toISOString(),
        data: cvData,
        template: selectedTemplate
      };

      const saved = saveDraft(user.id, draftEntry);
      if (!draftId) {
        setDraftId(saved.id);
        // Synchronously copy AI chat data to new draft key
        try {
          const chatData = localStorage.getItem(`jobready_cv_advisor_session_new_${user.id}`);
          if (chatData) {
            localStorage.setItem(`jobready_cv_advisor_session_draft_${user.id}_${saved.id}`, chatData);
            localStorage.removeItem(`jobready_cv_advisor_session_new_${user.id}`);
          }
        } catch {}
      }
    };

    const interval = setInterval(autoSave, 10000); // Auto-save every 10s
    return () => clearInterval(interval);
  }, [step, selectedTemplate, cvData, draftId, user?.id]);

  useEffect(() => {
    setCurrentTemplatePage(0);
  }, [activeTemplateFilter]);

  useEffect(() => {
    if (step !== "build" || !selectedTemplate) return;
    setSaved(false);
  }, [step, selectedTemplate, cvData]);

  const handleSelectTemplate = (template: CVTemplate, colorsIndex: number = 0) => {
    const activeColor = template.colors[colorsIndex];
    const customized: SelectedCVTemplate = {
      ...template,
      primaryColor: activeColor.primaryColor,
      secondaryColor: activeColor.secondaryColor,
      accentColor: activeColor.accentColor,
      textColor: activeColor.textColor,
    };
    setSelectedTemplate(customized);

    // Only reset cvData to default if the user hasn't typed anything meaningful yet.
    setCVData((prev) => {
      if (prev && (prev.fullName || prev.jobTitle || prev.experience.some(e => e.company) || prev.education.some(edu => edu.school))) {
        return prev;
      }
      return { ...defaultCVData };
    });
    setStep("build");
  };

  const handleSave = async () => {
    if (!selectedTemplate || !user) return;
    setSaving(true);
    setSaved(false);
    try {
      const endpoint = savedCvId ? `/api/cv/${savedCvId}` : "/api/cv";
      const method = savedCvId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id || "",
          "x-user-role": user.role || "user",
        },
        body: JSON.stringify({
          title: cvData.title || cvData.fullName || i18n.t("cv.builder.myCV"),
          template_id: selectedTemplate.id,
          content: cvData,
          type: "created",
        }),
      });
      if (response.ok) {
        setSaved(true);
        const resData = await response.json();
        if (resData.cv?.id) {
          setSavedCvId(resData.cv.id);
          const url = new URL(window.location.href);
          url.searchParams.set("id", resData.cv.id);
          window.history.replaceState({}, "", url.toString());
        }
        // Remove draft after successful save to API
        if (draftId && user?.id) {
          deleteDraft(user.id, draftId);
          // Synchronously clear AI chat data for this draft
          try {
            localStorage.removeItem(`jobready_cv_advisor_session_draft_${user.id}_${draftId}`);
          } catch {}
          setDraftId(null);
        }
        // Also clear any temporary chat session
        try {
          const userId = user?.id || "guest";
          localStorage.removeItem(`jobready_cv_advisor_session_new_${userId}`);
          if (resData.cv?.id) {
            localStorage.removeItem(`jobready_cv_advisor_session_cv_${userId}_${resData.cv.id}`);
          }
        } catch {}
        // Show success toast for 3s then navigate to CV list page (/cv)
        setShowSaveToast(true);
        setTimeout(() => {
          setShowSaveToast(false);
          setSaved(false);
          window.location.href = "/cv";
        }, 3000);
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = () => {
    if (!user?.id) {
      window.location.href = "/login";
      return;
    }
    if (!selectedTemplate) return;

    const draftEntry: DraftCV = {
      id: draftId || "",
      title: cvData.title || cvData.fullName || i18n.t("cv.builder.untitledCV"),
      templateName: selectedTemplate.name,
      lastModified: new Date().toISOString(),
      data: cvData,
      template: selectedTemplate,
    };

    const saved = saveDraft(user.id, draftEntry);

    // Synchronously copy AI chat data to the new draft key BEFORE navigating
    const userId = user.id;
    const newDraftChatKey = `jobready_cv_advisor_session_draft_${userId}_${saved.id}`;
    const currentChatKey = draftId
      ? `jobready_cv_advisor_session_draft_${userId}_${draftId}`
      : `jobready_cv_advisor_session_new_${userId}`;
    try {
      const chatData = localStorage.getItem(currentChatKey);
      if (chatData && currentChatKey !== newDraftChatKey) {
        localStorage.setItem(newDraftChatKey, chatData);
        localStorage.removeItem(currentChatKey);
      }
    } catch { /* ignore */ }

    setDraftId(saved.id);
    setShowDraftSaveToast(true);
    setTimeout(() => {
      setShowDraftSaveToast(false);
      window.location.href = "/cv/drafts";
    }, 3000);
  };

  const addExperience = () => {
    setCVData((prev) => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now().toString(), company: "", position: "", startDate: "", endDate: "", description: "" }],
    }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(i18n.t("cv.builder.errorImage"));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(i18n.t("cv.builder.errorImageSize"));
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setCVData((prev) => ({ ...prev, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const addEducation = () => {
    setCVData((prev) => ({
      ...prev,
      education: [...prev.education, { id: Date.now().toString(), school: "", degree: "", field: "", startDate: "", endDate: "" }],
    }));
  };

  const addSkill = () => {
    if (skillValue.trim()) {
      setCVData((prev) => ({ ...prev, skills: [...prev.skills, { name: skillValue.trim(), level: 70 }] }));
      setSkillValue("");
      setSkillInput(false);
    }
  };

  const addLanguage = () => {
    if (langValue.trim()) {
      setCVData((prev) => ({ ...prev, languages: [...prev.languages, langValue.trim()] }));
      setLangValue("");
    }
  };

  const addHobby = () => {
    if (hobbyValue.trim()) {
      setCVData((prev) => ({ ...prev, hobbies: [...prev.hobbies, hobbyValue.trim()] }));
      setHobbyValue("");
    }
  };

  const addCert = () => {
    if (certValue.trim()) {
      setCVData((prev) => ({ ...prev, certifications: [...prev.certifications, certValue.trim()] }));
      setCertValue("");
    }
  };

  // ============ STEP 1: TEMPLATE SELECTOR ============
  if (step === "select") {
    return (
      <div className="h-screen bg-background flex flex-col overflow-hidden">
        <DashboardHeader
          navItems={navItems}
          activePath="/cv/create"
          role="user"
          onLogout={() => { logout(); window.location.assign("/"); }}
          hideSidebar={true}
        />
        {/* Content */}
        <div className="flex-1 w-full overflow-hidden flex flex-col pt-16">
          {/* Header below nav */}
          <div className="bg-card border-b border-border px-8 py-5 shrink-0 flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">{i18n.t("cv.builder.chooseTemplate")}</h1>
              <p className="text-sm text-muted-foreground">{i18n.t("cv.builder.chooseTemplateDesc")}</p>
            </div>
            <button
              onClick={() => window.location.assign("/cv")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{i18n.t("cv.builder.backToCvList")}</span>
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Template grid - Full width without sidebar */}
            <div className="flex-1 overflow-auto px-6 py-8">
              <div className="mx-auto max-w-7xl">
                <div className="mb-7 flex flex-wrap items-center justify-center gap-3">
                  {templateFilterOptions.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setActiveTemplateFilter(filter.id)}
                      className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold shadow-sm ring-1 transition-all hover:-translate-y-0.5 hover:shadow-md ${activeTemplateFilter === filter.id
                        ? "bg-emerald-500 text-white ring-emerald-500"
                        : "bg-card text-foreground ring-border hover:bg-accent"
                        }`}
                    >
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full ${activeTemplateFilter === filter.id ? "bg-white/20" : "bg-emerald-50 text-emerald-600"
                        }`}>
                        {filter.icon}
                      </span>
                      {filter.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {visibleTemplates.map((template) => (
                    <TemplateThumbnail
                      key={template.id}
                      template={template}
                      onSelect={(colorsIndex) => handleSelectTemplate(template, colorsIndex)}
                      onPreview={(colorsIndex) => {
                        setPreviewTemplate(template);
                        setPreviewColorsIndex(colorsIndex);
                      }}
                    />
                  ))}
                </div>

                {filteredTemplatePages.length > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2 pb-4">
                    {filteredTemplatePages.map((_, pageIndex) => (
                      <button
                        key={pageIndex}
                        type="button"
                        onClick={() => setCurrentTemplatePage(pageIndex)}
                        className={`h-10 min-w-10 rounded-full px-4 text-sm font-bold transition-all ${currentTemplatePage === pageIndex
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "bg-card text-muted-foreground ring-1 ring-border hover:bg-accent"
                          }`}
                        aria-label={i18n.t("cv.builder.pageN", { n: pageIndex + 1 })}
                      >
                        {pageIndex + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {previewTemplate && (
          <TemplatePreviewModal
            template={previewTemplate}
            initialColorsIndex={previewColorsIndex}
            onClose={() => setPreviewTemplate(null)}
            onSelect={(colorsIndex) => {
              handleSelectTemplate(previewTemplate, colorsIndex);
              setPreviewTemplate(null);
            }}
          />
        )}
        <AIChatBubble onApplyCVData={handleApplyAIData} draftId={draftId} savedCvId={savedCvId} isSaved={saved} />
      </div>
    );
  }

  // ============ STEP 2: WYSIWYG EDITOR ============
  const TemplateComponent =
    selectedTemplate?.layout === "modern-split" ? CVTemplateModernSplit
      : selectedTemplate?.layout === "sidebar-light" ? CVTemplateSidebarLight
        : selectedTemplate?.layout === "timeline-blue" ? CVTemplateTimelineBlue
          : selectedTemplate?.layout === "sidebar-dark" ? CVTemplateSidebarDark
            : selectedTemplate?.layout === "gradient-header" ? CVTemplateGradientHeader
              : selectedTemplate?.layout === "passion-clean" ? CVTemplatePassionClean
                : selectedTemplate?.layout === "bright-split" ? CVTemplateBright
                  : selectedTemplate?.layout === "clarity-standard" ? CVTemplateClarity
                    : selectedTemplate?.layout === "basic-split" ? CVTemplateBasic5
                      : selectedTemplate?.layout === "elegant-classic" ? CVTemplateElegant1
                        : selectedTemplate?.layout === "executive-banner" ? CVTemplateExecutiveBanner
                          : selectedTemplate?.layout === "corporate-blue" ? CVTemplateCorporateBlue
                            : selectedTemplate?.layout === "soft-pink" ? CVTemplateSoftPink
                              : selectedTemplate?.layout === "maroon-classic" ? CVTemplateMaroonClassic
                                : selectedTemplate?.layout === "ocean-grid" ? CVTemplateOceanGrid
                                  : selectedTemplate?.layout === "minimal-line" ? CVTemplateMinimalLine
                                    : CVTemplateModernSplit;

  const TabButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
    <button
      onClick={onClick}
      type="button"
      className={`w-full flex flex-col items-center justify-center py-3 px-1 text-center cursor-pointer transition-all gap-1 border-l-4 ${active
        ? "border-primary bg-primary/5 text-primary font-bold"
        : "border-transparent text-muted-foreground hover:text-foreground"
        }`}
    >
      {icon}
      <span className="text-[10px] mt-1.5 leading-snug px-1">{label}</span>
    </button>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-[#12121f]">
      {/* Secondary Header with back button and template info */}
      <div className="h-12 bg-gray-50 dark:bg-card border-b border-gray-200 dark:border-border flex items-center px-6 shrink-0 z-10">
        <button
          onClick={() => setStep("select")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-muted-foreground dark:hover:text-foreground transition-colors mr-3"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{i18n.t("cv.builder.chooseTemplate")}</span>
        </button>
        <div className="h-4 w-px bg-gray-300 dark:bg-border mr-3" />
        <button
          onClick={() => setStep("select")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-muted-foreground dark:hover:text-foreground transition-colors"
        >
          <LayoutGrid className="h-4 w-4" />
          <span>{i18n.t("cv.builder.changeTemplate")}</span>
        </button>
        <div className="flex items-center gap-2 ml-3">
          <div className="w-5 h-5 rounded border border-border" style={{ background: selectedTemplate?.primaryColor }} />
          <span className="text-sm font-medium text-foreground">{selectedTemplate?.name}</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {i18n.t("cv.builder.clickToEditHint")}
          </span>
          <Button
            onClick={handleSaveDraft}
            size="sm"
            variant="outline"
            className="gap-1 text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:text-foreground dark:border-border dark:bg-card dark:hover:bg-muted"
          >
            <Save className="h-4 w-4" />
            {i18n.t("cv.builder.saveDraft")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
            className="gap-1 text-white"
            style={{ background: "var(--gradient-hero)" }}
          >
            {saving ? (
              <span className="animate-spin">⟳</span>
            ) : saved ? (
              <Check className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saved ? i18n.t("cv.builder.saved") : saving ? i18n.t("cv.builder.saving") : i18n.t("cv.builder.saveCV")}
          </Button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar Menu */}
        <div className="w-[88px] bg-white dark:bg-card border-r border-gray-200 dark:border-border flex flex-col items-center py-6 gap-3 shrink-0 z-25">
          <TabButton active={activeTab === "design"} onClick={() => handleTabClick("design")} icon={<Palette className="h-5 w-5" />} label={i18n.t("cv.builder.tabDesign")} />
          <TabButton active={activeTab === "sections"} onClick={() => handleTabClick("sections")} icon={<Plus className="h-5 w-5" />} label={i18n.t("cv.builder.tabSections")} />
          <TabButton active={activeTab === "layout"} onClick={() => handleTabClick("layout")} icon={<List className="h-5 w-5" />} label={i18n.t("cv.builder.tabLayout")} />
          <TabButton active={activeTab === "templates"} onClick={() => handleTabClick("templates")} icon={<LayoutGrid className="h-5 w-5" />} label={i18n.t("cv.builder.tabTemplates")} />
        </div>

        {/* Tab Drawer Content Panels */}
        {activeTab && (
          <div className={`${
            activeTab === "templates" ? "w-[440px]" : "w-[340px]"
          } bg-white dark:bg-card border-r border-gray-200 dark:border-border flex flex-col shrink-0 z-20 shadow-lg animate-in slide-in-from-left duration-200`}>
            {/* Drawer Header */}
            <div className="h-14 border-b border-gray-100 dark:border-border px-6 flex items-center justify-between shrink-0">
              <span className="font-bold text-foreground text-xs uppercase tracking-wider">
                {activeTab === "design" ? i18n.t("cv.builder.tabDesign")
                  : activeTab === "sections" ? i18n.t("cv.builder.tabSections")
                    : activeTab === "layout" ? i18n.t("cv.builder.tabLayoutFull")
                      : i18n.t("cv.builder.templatesTabTitle")}
              </span>
              <button
                type="button"
                onClick={() => setActiveTab(null)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className={`flex-1 overflow-y-auto ${activeTab === "templates" ? "p-4" : "p-6"} scrollbar-thin`}>
              {activeTab === "design" && renderDesignTab()}
              {activeTab === "sections" && renderSectionsTab()}
              {activeTab === "layout" && renderLayoutTab()}
              {activeTab === "templates" && renderTemplatesTab()}
            </div>
          </div>
        )}

        {/* Main WYSIWYG Editor Preview area */}
        <div className="flex-1 overflow-auto p-8 flex flex-col items-center justify-start bg-slate-105 dark:bg-[#12121f] scrollbar-thin">
          <div
            className="w-[595px] h-[842px] shadow-2xl rounded-sm overflow-hidden flex-shrink-0 relative cv-template-container-bg"
            style={{
              "--cv-font-family": cvFontFamily,
              "--cv-line-spacing": cvLineHeight,
              "--cv-background": cvBackground === "none" ? "#ffffff" : cvBackground,
            } as React.CSSProperties}
          >
            {/* Scaled template container with scale class for font size */}
            <div
              className={`w-full h-full cv-template-container cv-size-${cvFontSize}`}
            >
              {selectedTemplate && (
                <TemplateComponent
                  data={cvData}
                  onChange={setCVData}
                  template={selectedTemplate}
                />
              )}
            </div>
          </div>
          <p className="mt-4 text-[11px] text-muted-foreground text-center">
            {i18n.t("cv.builder.editHint")}
          </p>
        </div>
      </div>

      {/* AI Chat Bubble */}
      <AIChatBubble onApplyCVData={handleApplyAIData} draftId={draftId} savedCvId={savedCvId} isSaved={saved} />

      {/* Success Save Toast Overlay */}
      {showSaveToast && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white/95 dark:bg-slate-900/95 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center relative overflow-hidden transform scale-100 transition-all duration-300 animate-in zoom-in-95">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 mb-4 animate-bounce">
              <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              CV đã được lưu thành công!
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Đang chuyển hướng về trang danh sách hồ sơ...
            </p>
            {/* Countdown animation bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 w-full animate-shrink-progress" />
          </div>
        </div>
      )}

      {/* Success Draft Save Toast Overlay */}
      {showDraftSaveToast && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white/95 dark:bg-slate-900/95 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center relative overflow-hidden transform scale-100 transition-all duration-300 animate-in zoom-in-95">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 mb-4 animate-bounce">
              <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              Đã lưu nháp thành công!
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Đang chuyển hướng về trang danh sách nháp...
            </p>
            {/* Countdown animation bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 w-full animate-shrink-progress" />
          </div>
        </div>
      )}
    </div>
  );
}




