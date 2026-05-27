import { useState, useCallback, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Check,
  Download,
  Eye,
  Loader2,
  Save,
  Sparkles,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Code,
  Calendar,
  Target,
  Heart,
  Plus,
  X,
  Search,
  Filter,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader, type NavItem } from "@/components/dashboard-header";

interface CVTemplate {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  style: "simple" | "impressive" | "professional" | "harvard" | "it" | "designer";
  layout: "sidebar" | "single" | "two-column" | "centered" | "impressive";
}

const cvTemplates: CVTemplate[] = [
  {
    id: "simple-1",
    name: "Đơn giản 1",
    description: "Template CV đơn giản, dễ đọc, phù hợp mọi ngành nghề",
    primaryColor: "#1a365d",
    secondaryColor: "#2c5282",
    accentColor: "#3182ce",
    textColor: "#FFFFFF",
    style: "simple",
    layout: "single",
  },
  {
    id: "simple-2",
    name: "Đơn giản 2",
    description: "Thiết kế tối giản, chuyên nghiệp, nhấn mạnh nội dung",
    primaryColor: "#2d3748",
    secondaryColor: "#4a5568",
    accentColor: "#718096",
    textColor: "#FFFFFF",
    style: "simple",
    layout: "two-column",
  },
  {
    id: "simple-3",
    name: "Đơn giản 3",
    description: "CV dạng cột đơn, thanh lịch và hiện đại",
    primaryColor: "#234e52",
    secondaryColor: "#285e61",
    accentColor: "#38b2ac",
    textColor: "#FFFFFF",
    style: "simple",
    layout: "single",
  },
  {
    id: "impressive-1",
    name: "Ấn tượng 1",
    description: "Template ấn tượng, nổi bật, gây ấn tượng với nhà tuyển dụng",
    primaryColor: "#c53030",
    secondaryColor: "#e53e3e",
    accentColor: "#fc8181",
    textColor: "#FFFFFF",
    style: "impressive",
    layout: "impressive",
  },
  {
    id: "impressive-2",
    name: "Ấn tượng 2",
    description: "Thiết kế sáng tạo, phù hợp vị trí sáng tạo",
    primaryColor: "#6b46c1",
    secondaryColor: "#805ad5",
    accentColor: "#b794f4",
    textColor: "#FFFFFF",
    style: "impressive",
    layout: "impressive",
  },
  {
    id: "impressive-3",
    name: "Ấn tượng 3",
    description: "CV ấn tượng với gradient màu độc đáo",
    primaryColor: "#d69e2e",
    secondaryColor: "#ecc94b",
    accentColor: "#faf089",
    textColor: "#1a202c",
    style: "impressive",
    layout: "impressive",
  },
  {
    id: "impressive-4",
    name: "Ấn tượng 4",
    description: "Phong cách hiện đại, chuyên nghiệp và ấn tượng",
    primaryColor: "#2b6cb0",
    secondaryColor: "#4299e1",
    accentColor: "#90cdf4",
    textColor: "#FFFFFF",
    style: "impressive",
    layout: "impressive",
  },
  {
    id: "impressive-5",
    name: "Ấn tượng 5",
    description: "Template với màu sắc tươi sáng, năng động",
    primaryColor: "#38a169",
    secondaryColor: "#48bb78",
    accentColor: "#9ae6b4",
    textColor: "#FFFFFF",
    style: "impressive",
    layout: "impressive",
  },
  {
    id: "impressive-6",
    name: "Ấn tượng 6",
    description: "Thiết kế chuyên nghiệp với tone màu nâu sang trọng",
    primaryColor: "#744210",
    secondaryColor: "#975a16",
    accentColor: "#d69e2e",
    textColor: "#FFFFFF",
    style: "impressive",
    layout: "impressive",
  },
  {
    id: "professional-1",
    name: "Chuyên nghiệp 1",
    description: "CV phong cách doanh nghiệp, đáng tin cậy",
    primaryColor: "#1a202c",
    secondaryColor: "#2d3748",
    accentColor: "#4a5568",
    textColor: "#FFFFFF",
    style: "professional",
    layout: "two-column",
  },
  {
    id: "professional-2",
    name: "Chuyên nghiệp 2",
    description: "Template công sở, phù hợp môi trường chính thức",
    primaryColor: "#2c5282",
    secondaryColor: "#3182ce",
    accentColor: "#63b3ed",
    textColor: "#FFFFFF",
    style: "professional",
    layout: "two-column",
  },
  {
    id: "professional-3",
    name: "Chuyên nghiệp 3",
    description: "Thiết kế truyền thống, chuyên nghiệp",
    primaryColor: "#553c9a",
    secondaryColor: "#6b46c1",
    accentColor: "#9f7aea",
    textColor: "#FFFFFF",
    style: "professional",
    layout: "two-column",
  },
  {
    id: "harvard-1",
    name: "Harvard 1",
    description: "Phong cách Harvard kinh điển, sang trọng",
    primaryColor: "#1a365d",
    secondaryColor: "#2c5282",
    accentColor: "#c9a227",
    textColor: "#FFFFFF",
    style: "harvard",
    layout: "single",
  },
  {
    id: "harvard-2",
    name: "Harvard 2",
    description: "CV theo phong cách học thuật, nghiêm túc",
    primaryColor: "#742a2a",
    secondaryColor: "#9b2c2c",
    accentColor: "#e53e3e",
    textColor: "#FFFFFF",
    style: "harvard",
    layout: "single",
  },
  {
    id: "it-1",
    name: "IT 1",
    description: "Template dành cho ngành IT, công nghệ",
    primaryColor: "#0f4c75",
    secondaryColor: "#1b262c",
    accentColor: "#3282b8",
    textColor: "#FFFFFF",
    style: "it",
    layout: "sidebar",
  },
  {
    id: "it-2",
    name: "IT 2",
    description: "CV tech-savvy với thiết kế hiện đại",
    primaryColor: "#11998e",
    secondaryColor: "#38ef7d",
    accentColor: "#d1fae5",
    textColor: "#1a202c",
    style: "it",
    layout: "sidebar",
  },
  {
    id: "designer-1",
    name: "Designer 1",
    description: "Template sáng tạo cho ngành thiết kế",
    primaryColor: "#ed64a6",
    secondaryColor: "#f687b3",
    accentColor: "#fbb6ce",
    textColor: "#FFFFFF",
    style: "designer",
    layout: "impressive",
  },
  {
    id: "designer-2",
    name: "Designer 2",
    description: "CV với phong cách nghệ thuật, sáng tạo",
    primaryColor: "#667eea",
    secondaryColor: "#764ba2",
    accentColor: "#a78bfa",
    textColor: "#FFFFFF",
    style: "designer",
    layout: "impressive",
  },
];

interface CVData {
  title: string;
  fullName: string;
  dateOfBirth: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  objective: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }>;
  skills: Array<{
    name: string;
    level: number;
  }>;
  languages: string[];
  hobbies: string[];
  certifications: string[];
}

const defaultCVData: CVData = {
  title: "",
  fullName: "",
  dateOfBirth: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  objective: "",
  experience: [],
  education: [],
  skills: [],
  languages: [],
  hobbies: [],
  certifications: [],
};

const cvNavItems: NavItem[] = [
  { label: "Tổng quan", icon: <FileText className="h-5 w-5" />, href: "/user/dashboard" },
  { label: "Phỏng vấn", icon: <FileText className="h-5 w-5" />, href: "/interview/config" },
  { label: "Xem CV", icon: <FileText className="h-5 w-5" />, href: "/cv" },
  { label: "Luyện tập", icon: <FileText className="h-5 w-5" />, href: "/practice" },
];

// =============================================
// TEMPLATE PREVIEW COMPONENTS - Realistic CV layouts
// =============================================

// Layout 1: Single column - clean header top
const PreviewSingleColumn = ({ template }: { template: CVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 flex flex-col text-[7px]">
      {/* Header */}
      <div
        className="px-3 py-2.5 flex items-center gap-2"
        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
      >
        <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center shrink-0">
          <div className="w-5 h-5 rounded-full bg-white/40" />
        </div>
        <div>
          <div className="text-white font-bold mb-0.5">Nguyễn Văn A</div>
          <div className="text-white/80 text-[6px]">Lập trình viên Java</div>
        </div>
      </div>
      {/* Contact bar */}
      <div className="flex items-center justify-center gap-2 py-1.5 bg-gray-50 border-b border-gray-100 text-[6px] text-gray-500">
        <span>📱 0912 345 678</span>
        <span>✉️ email@example.com</span>
        <span>📍 TP.HCM</span>
      </div>
      {/* Body */}
      <div className="flex-1 p-2.5 space-y-2 overflow-hidden">
        {/* Mục tiêu */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <div className="w-0.5 h-3 rounded-full" style={{ background: accentColor }} />
            <span className="font-bold uppercase tracking-wide" style={{ color: primaryColor }}>
              Mục tiêu
            </span>
          </div>
          <div className="pl-2 space-y-0.5 text-gray-600">
            <p>Tìm kiếm vị trí phù hợp để phát triển kỹ năng và đóng góp cho công ty.</p>
          </div>
        </div>
        {/* Kinh nghiệm */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <div className="w-0.5 h-3 rounded-full" style={{ background: accentColor }} />
            <span className="font-bold uppercase tracking-wide" style={{ color: primaryColor }}>
              Kinh nghiệm
            </span>
          </div>
          <div className="pl-2 space-y-1">
            <div className="border-l-2 pl-2" style={{ borderColor: `${primaryColor}40` }}>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-800">Lập trình viên</span>
                <span className="text-gray-400">2022-Hiện tại</span>
              </div>
              <div className="text-gray-600" style={{ color: primaryColor }}>
                Công ty ABC
              </div>
              <p className="text-gray-500 text-[6px]">Phát triển ứng dụng web</p>
            </div>
          </div>
        </div>
        {/* Học vấn */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <div className="w-0.5 h-3 rounded-full" style={{ background: accentColor }} />
            <span className="font-bold uppercase tracking-wide" style={{ color: primaryColor }}>
              Học vấn
            </span>
          </div>
          <div className="pl-2 border-l-2 space-y-0.5" style={{ borderColor: `${primaryColor}40` }}>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-800">Cử nhân CNTT</span>
              <span className="text-gray-400">2018-2022</span>
            </div>
            <p className="text-gray-600">ĐH Bách Khoa</p>
          </div>
        </div>
        {/* Kỹ năng */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <div className="w-0.5 h-3 rounded-full" style={{ background: accentColor }} />
            <span className="font-bold uppercase tracking-wide" style={{ color: primaryColor }}>
              Kỹ năng
            </span>
          </div>
          <div className="pl-2 grid grid-cols-2 gap-0.5">
            {["JavaScript", "React", "Node.js", "TypeScript"].map((skill, i) => (
              <div key={i} className="flex items-center gap-1 text-gray-700">
                <div className="w-1 h-1 rounded-full" style={{ background: accentColor }} />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Layout 2: Two column - sidebar left + main right
const PreviewTwoColumn = ({ template }: { template: CVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 flex flex-col text-[7px]">
      {/* Header */}
      <div
        className="px-3 py-2.5 flex items-center gap-2"
        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
      >
        <div className="w-8 h-8 rounded-full bg-white/25 shrink-0" />
        <div>
          <div className="text-white font-bold">Nguyễn Văn A</div>
          <div className="text-white/80 text-[6px]">Lập trình viên Java</div>
        </div>
      </div>
      {/* Two column body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar */}
        <div className="w-2/5 p-2 space-y-2" style={{ background: `${primaryColor}10` }}>
          <div>
            <div className="font-bold text-gray-500 mb-1" style={{ color: primaryColor }}>
              Liên hệ
            </div>
            <div className="space-y-0.5 text-gray-600">
              <div>📱 0912 345 678</div>
              <div>✉️ email@example.com</div>
              <div>📍 TP.HCM</div>
            </div>
          </div>
          <div>
            <div className="font-bold text-gray-500 mb-1" style={{ color: primaryColor }}>
              Kỹ năng
            </div>
            <div className="space-y-0.5">
              {["JavaScript", "React", "Node.js"].map((skill, i) => (
                <div key={i} className="flex items-center gap-1 text-gray-700">
                  <div className="w-1 h-1 rounded-full" style={{ background: accentColor }} />
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right main */}
        <div className="flex-1 p-2 space-y-2 overflow-hidden">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <div className="w-0.5 h-3 rounded-full" style={{ background: accentColor }} />
              <span className="font-bold" style={{ color: primaryColor }}>
                Mục tiêu
              </span>
            </div>
            <p className="text-gray-600 text-[6px] pl-2">
              Tìm kiếm vị trí phù hợp để phát triển kỹ năng.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <div className="w-0.5 h-3 rounded-full" style={{ background: accentColor }} />
              <span className="font-bold" style={{ color: primaryColor }}>
                Kinh nghiệm
              </span>
            </div>
            <div className="border-l-2 pl-2 space-y-1" style={{ borderColor: `${primaryColor}40` }}>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-800">Lập trình viên</span>
                <span className="text-gray-400">2022-Hiện tại</span>
              </div>
              <p className="text-gray-600 text-[6px]" style={{ color: primaryColor }}>
                Công ty ABC
              </p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <div className="w-0.5 h-3 rounded-full" style={{ background: accentColor }} />
              <span className="font-bold" style={{ color: primaryColor }}>
                Học vấn
              </span>
            </div>
            <div className="border-l-2 pl-2" style={{ borderColor: `${primaryColor}40` }}>
              <div className="flex justify-between">
                <span className="text-gray-800">Cử nhân CNTT</span>
                <span className="text-gray-400">2018-2022</span>
              </div>
              <p className="text-gray-600 text-[6px]">ĐH Bách Khoa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Layout 3: Sidebar dark left + white right
const PreviewSidebarDark = ({ template }: { template: CVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 flex text-[7px]">
      {/* Dark sidebar */}
      <div
        className="w-2/5 flex flex-col items-center pt-2.5 pb-2 px-2 space-y-2"
        style={{ background: `linear-gradient(180deg, ${primaryColor}, ${secondaryColor})` }}
      >
        <div className="w-10 h-10 rounded-full border-2 border-white/30 bg-white/20" />
        <div className="text-white font-bold text-center">Nguyễn Văn A</div>
        <div className="text-white/70 text-[6px] text-center">Lập trình viên</div>
        <div className="w-full space-y-1 mt-1">
          <div className="text-white/80 text-[6px] flex items-center gap-1">
            <span>📱</span> 0912 345 678
          </div>
          <div className="text-white/80 text-[6px] flex items-center gap-1">
            <span>✉️</span> email@example.com
          </div>
          <div className="text-white/80 text-[6px] flex items-center gap-1">
            <span>📍</span> TP.HCM
          </div>
        </div>
        <div className="w-full">
          <div className="text-white font-bold text-[6px] mb-1">Kỹ năng</div>
          <div className="space-y-1">
            {["JavaScript", "React", "Node.js"].map((skill, i) => (
              <div key={i} className="text-white/90 text-[6px] flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-white/50" />
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* White right */}
      <div className="flex-1 p-2 space-y-2 overflow-hidden">
        <div>
          <div className="flex items-center gap-1 mb-0.5">
            <div className="w-0.5 h-2.5 rounded-full" style={{ background: accentColor }} />
            <span className="font-bold text-[7px]" style={{ color: primaryColor }}>
              Mục tiêu
            </span>
          </div>
          <p className="text-gray-600 text-[6px] pl-2">Tìm kiếm vị trí phù hợp để phát triển.</p>
        </div>
        <div>
          <div className="flex items-center gap-1 mb-0.5">
            <div className="w-0.5 h-2.5 rounded-full" style={{ background: accentColor }} />
            <span className="font-bold text-[7px]" style={{ color: primaryColor }}>
              Kinh nghiệm
            </span>
          </div>
          <div className="border-l-2 pl-1.5 space-y-1" style={{ borderColor: `${accentColor}60` }}>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-800 text-[6px]">Lập trình viên</span>
              <span className="text-gray-400 text-[5px]">2022-Hiện tại</span>
            </div>
            <p className="text-gray-600 text-[5px]" style={{ color: primaryColor }}>
              Công ty ABC
            </p>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1 mb-0.5">
            <div className="w-0.5 h-2.5 rounded-full" style={{ background: accentColor }} />
            <span className="font-bold text-[7px]" style={{ color: primaryColor }}>
              Học vấn
            </span>
          </div>
          <div className="border-l-2 pl-1.5" style={{ borderColor: `${accentColor}60` }}>
            <div className="flex justify-between">
              <span className="text-gray-800 text-[6px]">Cử nhân CNTT</span>
              <span className="text-gray-400 text-[5px]">2018-2022</span>
            </div>
            <p className="text-gray-600 text-[5px]">ĐH Bách Khoa</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Layout 4: Bold centered header
const PreviewImpressive = ({ template }: { template: CVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor, textColor } = template;
  const isLight = textColor !== "#FFFFFF";
  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 flex flex-col text-[7px]">
      {/* Bold header */}
      <div
        className="px-3 py-3 text-center"
        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
      >
        <div className="w-10 h-10 rounded-full mx-auto mb-1.5 border-2 border-white/40 bg-white/20" />
        <div className="text-white font-bold text-[9px] mb-0.5">Nguyễn Văn A</div>
        <div className="text-white/80 text-[6px] mb-1">Lập trình viên Java</div>
        <div className="flex justify-center gap-2 text-white/70 text-[5px]">
          <span>0912 345 678</span>
          <span>•</span>
          <span>email@example.com</span>
          <span>•</span>
          <span>TP.HCM</span>
        </div>
      </div>
      {/* Body */}
      <div className="flex-1 p-2.5 space-y-2 overflow-hidden">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <div className="w-0.5 h-3 rounded-full" style={{ background: accentColor }} />
            <span className="font-bold uppercase tracking-wide" style={{ color: primaryColor }}>
              Mục tiêu
            </span>
          </div>
          <p className="text-gray-600 text-[6px] pl-2">
            Tìm kiếm vị trí phù hợp để phát triển kỹ năng và đóng góp cho công ty.
          </p>
        </div>
        <div>
          <div className="flex items-center gap-1 mb-1">
            <div className="w-0.5 h-3 rounded-full" style={{ background: accentColor }} />
            <span className="font-bold uppercase tracking-wide" style={{ color: primaryColor }}>
              Kinh nghiệm
            </span>
          </div>
          <div className="pl-2 space-y-1">
            <div className="border-l-2 pl-2" style={{ borderColor: `${accentColor}60` }}>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-800 text-[6px]">Lập trình viên</span>
                <span className="text-gray-400 text-[5px]">2022-Hiện tại</span>
              </div>
              <p className="text-[6px]" style={{ color: primaryColor }}>
                Công ty ABC
              </p>
              <p className="text-gray-500 text-[5px]">Phát triển ứng dụng web</p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1 mb-1">
            <div className="w-0.5 h-3 rounded-full" style={{ background: accentColor }} />
            <span className="font-bold uppercase tracking-wide" style={{ color: primaryColor }}>
              Kỹ năng
            </span>
          </div>
          <div className="pl-2 grid grid-cols-2 gap-0.5">
            {["JavaScript", "React", "Node.js", "TypeScript"].map((skill, i) => (
              <div key={i} className="flex items-center gap-1 text-gray-700 text-[6px]">
                <div className="w-1 h-1 rounded-full" style={{ background: accentColor }} />
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Layout 5: Harvard - minimalist
const PreviewHarvard = ({ template }: { template: CVTemplate }) => {
  const { primaryColor, accentColor } = template;
  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 flex flex-col text-[7px]">
      {/* Top: centered name */}
      <div className="px-3 pt-3 pb-2 text-center border-b-2" style={{ borderColor: accentColor }}>
        <div className="w-8 h-8 rounded-full mx-auto mb-1 bg-gray-200" />
        <div className="text-gray-800 font-bold text-[9px]">Nguyễn Văn A</div>
        <div className="text-gray-500 text-[6px] mb-1">Lập trình viên Java</div>
        <div className="flex justify-center gap-2 text-gray-400 text-[5px]">
          <span>0912 345 678</span>
          <span>•</span>
          <span>email@example.com</span>
        </div>
      </div>
      {/* Body */}
      <div className="flex-1 p-2.5 space-y-2 overflow-hidden">
        <div>
          <div
            className="font-black uppercase tracking-widest mb-1"
            style={{ color: primaryColor }}
          >
            Kinh nghiệm
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-800">Lập trình viên</span>
              <span className="text-gray-400">2022-Hiện tại</span>
            </div>
            <p className="text-gray-600 text-[6px]">Công ty ABC - Phát triển ứng dụng web</p>
          </div>
        </div>
        <div>
          <div
            className="font-black uppercase tracking-widest mb-1"
            style={{ color: primaryColor }}
          >
            Học vấn
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Cử nhân CNTT</span>
            <span className="text-gray-400">2018-2022</span>
          </div>
          <p className="text-gray-600 text-[6px]">ĐH Bách Khoa</p>
        </div>
        <div>
          <div
            className="font-black uppercase tracking-widest mb-1"
            style={{ color: primaryColor }}
          >
            Kỹ năng
          </div>
          <div className="flex gap-1 flex-wrap">
            {["JavaScript", "React", "Node.js", "TypeScript"].map((skill, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 rounded text-[5px]"
                style={{
                  background: `${accentColor}20`,
                  border: `1px solid ${accentColor}60`,
                  color: primaryColor,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Layout 6: Designer - diagonal header
const PreviewDesigner = ({ template }: { template: CVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 relative flex flex-col text-[7px]">
      {/* Diagonal gradient header */}
      <div
        className="relative h-14 flex items-end pb-2 px-3"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 60%, transparent 100%)`,
          clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 100%)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-white/25">
            <div className="w-5 h-5 rounded-md bg-white/35 m-2" />
          </div>
          <div>
            <div className="text-white font-bold text-[9px]">Nguyễn Văn A</div>
            <div className="text-white/80 text-[6px]">Lập trình viên</div>
          </div>
        </div>
      </div>
      {/* Body */}
      <div className="flex-1 p-2.5 -mt-2 space-y-2 overflow-hidden">
        <div className="flex gap-1 flex-wrap">
          {["📱 0912 345 678", "✉️ email@example.com", "📍 TP.HCM"].map((item, i) => (
            <span
              key={i}
              className="px-1.5 py-0.5 rounded-full text-[5px]"
              style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}50` }}
            >
              {item}
            </span>
          ))}
        </div>
        <div>
          <div className="relative pl-3 mb-0.5">
            <div
              className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
              style={{ background: `linear-gradient(180deg, ${primaryColor}, ${accentColor})` }}
            />
            <span className="font-bold text-[8px]" style={{ color: primaryColor }}>
              Mục tiêu
            </span>
          </div>
          <p className="text-gray-600 text-[6px] pl-3">
            Tìm kiếm vị trí phù hợp để phát triển kỹ năng.
          </p>
        </div>
        <div>
          <div className="relative pl-3 mb-0.5">
            <div
              className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
              style={{ background: `linear-gradient(180deg, ${primaryColor}, ${accentColor})` }}
            />
            <span className="font-bold text-[8px]" style={{ color: primaryColor }}>
              Kinh nghiệm
            </span>
          </div>
          <div className="pl-3 space-y-1">
            <div className="bg-gray-50 rounded p-1">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-800 text-[6px]">Lập trình viên</span>
                <span className="text-gray-400 text-[5px]">2022-Hiện tại</span>
              </div>
              <p className="text-gray-600 text-[5px]" style={{ color: primaryColor }}>
                Công ty ABC
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="relative pl-3 mb-0.5">
            <div
              className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
              style={{ background: `linear-gradient(180deg, ${primaryColor}, ${accentColor})` }}
            />
            <span className="font-bold text-[8px]" style={{ color: primaryColor }}>
              Kỹ năng
            </span>
          </div>
          <div className="pl-3 flex gap-1 flex-wrap">
            {["JavaScript", "React", "Node.js", "TypeScript"].map((skill, i) => (
              <span
                key={i}
                className="text-[5px] px-1 py-0.5 rounded"
                style={{ background: `${primaryColor}10`, color: primaryColor }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Template Card with Preview
const TemplateCard = ({ template }: { template: CVTemplate }) => {
  const { style } = template;

  const PreviewComponent =
    style === "it"
      ? PreviewSidebarDark
      : style === "professional"
        ? PreviewTwoColumn
        : style === "harvard"
          ? PreviewHarvard
          : style === "designer"
            ? PreviewDesigner
            : style === "impressive"
              ? PreviewImpressive
              : PreviewSingleColumn;

  return <PreviewComponent template={template} />;
};

// =============================================
// END TEMPLATE PREVIEWS
// =============================================

export default function CVBuilderPage() {
  const { user, logout } = useAuth();
  const [step, setStep] = useState<"select" | "build">("select");
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate | null>(null);
  const [cvData, setCVData] = useState<CVData>(defaultCVData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");
  const [hobbyInput, setHobbyInput] = useState("");
  const [certInput, setCertInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [confirmTemplate, setConfirmTemplate] = useState<CVTemplate | null>(null);

  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "simple", label: "Đơn giản" },
    { id: "impressive", label: "Ấn tượng" },
    { id: "professional", label: "Chuyên nghiệp" },
    { id: "harvard", label: "Harvard" },
    { id: "it", label: "IT" },
    { id: "designer", label: "Designer" },
  ];

  const headers = useMemo(
    () => ({
      "x-user-id": user?.id ?? "",
      "x-user-role": user?.role ?? "user",
    }),
    [user?.id, user?.role],
  );

  const loadExistingCV = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/cv/${id}`, { headers });
        if (response.ok) {
          const data = await response.json();
          if (data.cv && data.cv.content) {
            setCVData(data.cv.content);
            if (data.cv.template_id) {
              const template = cvTemplates.find((t) => t.id === data.cv.template_id);
              if (template) {
                setSelectedTemplate(template);
                setStep("build");
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to load CV:", err);
      }
    },
    [headers],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cvId = params.get("id");
    if (cvId) {
      loadExistingCV(cvId);
    }
  }, [loadExistingCV]);

  const handleSelectTemplate = (template: CVTemplate) => {
    setSelectedTemplate(template);
    setStep("build");
  };

  const updateField = (
    field: keyof CVData,
    value:
      | string
      | number
      | Array<{
          id: string;
          company: string;
          position: string;
          startDate: string;
          endDate: string;
          description: string;
        }>
      | Array<{
          id: string;
          school: string;
          degree: string;
          field: string;
          startDate: string;
          endDate: string;
        }>
      | Array<{ name: string; level: number }>,
  ) => {
    setCVData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const addExperience = () => {
    setCVData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now().toString(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    }));
    setSaved(false);
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setCVData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)),
    }));
    setSaved(false);
  };

  const removeExperience = (index: number) => {
    setCVData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
    setSaved(false);
  };

  const addEducation = () => {
    setCVData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now().toString(),
          school: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
        },
      ],
    }));
    setSaved(false);
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)),
    }));
    setSaved(false);
  };

  const removeEducation = (index: number) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
    setSaved(false);
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setCVData((prev) => ({
        ...prev,
        skills: [...prev.skills, { name: skillInput.trim(), level: 70 }],
      }));
      setSkillInput("");
      setSaved(false);
    }
  };

  const removeSkill = (index: number) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
    setSaved(false);
  };

  const updateSkillLevel = (index: number, level: number) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, i) => (i === index ? { ...skill, level } : skill)),
    }));
    setSaved(false);
  };

  const addLanguage = () => {
    if (languageInput.trim()) {
      setCVData((prev) => ({
        ...prev,
        languages: [...prev.languages, languageInput.trim()],
      }));
      setLanguageInput("");
      setSaved(false);
    }
  };

  const removeLanguage = (index: number) => {
    setCVData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
    setSaved(false);
  };

  const addHobby = () => {
    if (hobbyInput.trim()) {
      setCVData((prev) => ({
        ...prev,
        hobbies: [...prev.hobbies, hobbyInput.trim()],
      }));
      setHobbyInput("");
      setSaved(false);
    }
  };

  const removeHobby = (index: number) => {
    setCVData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.filter((_, i) => i !== index),
    }));
    setSaved(false);
  };

  const addCertification = () => {
    if (certInput.trim()) {
      setCVData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, certInput.trim()],
      }));
      setCertInput("");
      setSaved(false);
    }
  };

  const removeCertification = (index: number) => {
    setCVData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify({
          title: cvData.title || cvData.fullName || "CV của tôi",
          template_id: selectedTemplate?.id,
          content: cvData,
          type: "created",
        }),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error("Failed to save CV:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    alert("Tính năng xuất PDF đang được phát triển. Vui lòng lưu CV trước.");
  };

  const handleLogout = () => {
    logout();
    window.location.assign("/");
  };

  const InputField = ({
    icon: Icon,
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    className = "",
  }: {
    icon?: React.ElementType;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    className?: string;
  }) => (
    <div className={`space-y-1.5 ${className}`}>
      <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10"
      />
    </div>
  );

  const filteredTemplates = cvTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || template.style === activeTab;
    return matchesSearch && matchesTab;
  });

  // Confirmation Modal
  const ConfirmModal = ({
    template,
    onClose,
    onConfirm,
  }: {
    template: CVTemplate;
    onClose: () => void;
    onConfirm: () => void;
  }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm mx-4">
        <div className="p-6 text-center">
          <div
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
            style={{
              background: `linear-gradient(135deg, ${template.primaryColor}20, ${template.secondaryColor}20)`,
            }}
          >
            <FileText className="h-8 w-8" style={{ color: template.primaryColor }} />
          </div>
          <h2 className="text-lg font-bold mb-2">Sử dụng template này?</h2>
          <p className="text-sm text-muted-foreground mb-1">{template.name}</p>
          <p className="text-xs text-muted-foreground">{template.description}</p>
        </div>
        <div className="flex items-center gap-3 p-4 border-t border-border/50 bg-muted/20">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1"
            style={{ background: template.primaryColor }}
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  );

  if (step === "select") {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <DashboardHeader
          navItems={cvNavItems}
          activePath="/cv/create"
          role="user"
          onLogout={handleLogout}
        />

        <main className="pt-16 min-h-screen transition-all duration-300">
          <div
            className="p-6 lg:p-8 space-y-6"
            style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}
          >
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/5 via-card to-emerald-500/5 p-6 lg:p-8">
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                    <Sparkles className="h-4 w-4" />
                    Tạo CV mới
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                    Chọn template CV
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                    Hơn 18+ mẫu CV đẹp, chuyên nghiệp. Cập nhật xu hướng tuyển dụng 2024.
                  </p>
                </div>
                <button
                  onClick={() => window.location.assign("/cv")}
                  className="flex items-center gap-2 rounded-lg bg-card border border-border hover:bg-muted px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer shadow-sm"
                >
                  <FileText className="h-4 w-4" />
                  <span>Danh sách CV</span>
                </button>
              </div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            </div>

            {/* Search & Filter Bar */}
            <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm template..."
                      className="pl-10 h-10"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Filter Info */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Filter className="h-4 w-4" />
                    <span>
                      <strong className="text-foreground">{filteredTemplates.length}</strong>{" "}
                      template
                    </span>
                  </div>
                </div>

                {/* Category Tabs */}
                <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                        activeTab === tab.id
                          ? "bg-primary text-white shadow-md"
                          : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Template Grid */}
            {filteredTemplates.length === 0 ? (
              <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Không tìm thấy template
                  </h3>
                  <p className="text-sm text-muted-foreground/60">Thử tìm kiếm với từ khóa khác</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="group cursor-pointer"
                    onClick={() => setConfirmTemplate(template)}
                  >
                    <Card className="border border-border/40 bg-card/80 backdrop-blur-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 overflow-hidden group">
                      {/* Template Preview - Full CV Preview */}
                      <div className="p-3 h-80">
                        <TemplateCard template={template} />
                      </div>

                      {/* Template Info */}
                      <div className="p-3 border-t border-border/40 bg-muted/30">
                        <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Confirmation Modal */}
        {confirmTemplate && (
          <ConfirmModal
            template={confirmTemplate}
            onClose={() => setConfirmTemplate(null)}
            onConfirm={() => {
              handleSelectTemplate(confirmTemplate);
              setConfirmTemplate(null);
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader
        navItems={cvNavItems}
        activePath="/cv/create"
        role="user"
        onLogout={handleLogout}
      />

      <main className="pt-16 min-h-screen transition-all duration-300">
        <div
          className="p-6 lg:p-8 space-y-6"
          style={{ paddingLeft: "calc(var(--sidebar-width) + 1.5rem)" }}
        >
          {/* Build Header */}
          <div
            className="relative overflow-hidden rounded-2xl border border-border/40 p-6"
            style={{
              background: `linear-gradient(135deg, ${selectedTemplate?.primaryColor || "#1e3a5f"} 0%, ${selectedTemplate?.secondaryColor || "#2d5a87"} 100%)`,
            }}
          >
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setStep("select")}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-5 w-5 text-white" />
                </button>
                <div className="text-white">
                  <h1 className="text-xl font-bold">Tạo CV - {selectedTemplate?.name}</h1>
                  <p className="text-sm text-white/80">Điền thông tin để tạo CV của bạn</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep("select")}
                  className="flex items-center gap-2 rounded-lg bg-white/20 hover:bg-white/30 px-4 py-2 text-sm font-medium text-white transition-colors cursor-pointer"
                >
                  <FileText className="h-4 w-4" />
                  DS CV
                </button>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="rounded-xl gap-2 bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white"
                >
                  <Download className="h-4 w-4" />
                  Xuất PDF
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className={`rounded-xl gap-2 ${
                    saved
                      ? "bg-emerald-500 hover:bg-emerald-500"
                      : "bg-white text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : saved ? (
                    <>
                      <Check className="h-4 w-4" />
                      Đã lưu
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Lưu CV
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Thông tin cá nhân
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InputField
                    label="Vi tri ung tuyen"
                    value={cvData.title}
                    onChange={(v: string) => updateField("title", v)}
                    placeholder="VD: Lap trinh vien Java"
                    className="lg:col-span-2"
                  />
                  <InputField
                    icon={User}
                    label="Ho va ten"
                    value={cvData.fullName}
                    onChange={(v: string) => updateField("fullName", v)}
                    placeholder="Nguyen Van A"
                  />
                  <InputField
                    icon={Mail}
                    label="Email"
                    value={cvData.email}
                    onChange={(v: string) => updateField("email", v)}
                    placeholder="email@example.com"
                    type="email"
                  />
                  <InputField
                    icon={Phone}
                    label="So dien thoai"
                    value={cvData.phone}
                    onChange={(v: string) => updateField("phone", v)}
                    placeholder="0912 345 678"
                  />
                  <InputField
                    icon={MapPin}
                    label="Dia chi"
                    value={cvData.address}
                    onChange={(v: string) => updateField("address", v)}
                    placeholder="TP. Ho Chi Minh"
                  />
                </CardContent>
              </Card>

              {/* Objective */}
              <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Mục tiêu nghề nghiệp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={cvData.objective}
                    onChange={(e) => updateField("objective", e.target.value)}
                    placeholder="Mô tả mục tiêu và định hướng phát triển nghề nghiệp của bạn..."
                    className="w-full min-h-[100px] px-4 py-3 rounded-xl bg-muted border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                  />
                </CardContent>
              </Card>

              {/* Experience */}
              <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Kinh nghiệm làm việc
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addExperience}
                    className="rounded-lg gap-1"
                  >
                    <Plus className="h-4 w-4" /> Thêm
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cvData.experience.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Chưa có kinh nghiệm. Nhấn "Thêm" để nhập.
                    </p>
                  ) : (
                    cvData.experience.map((exp, index) => (
                      <div
                        key={exp.id}
                        className="p-4 rounded-xl bg-muted/50 border border-border/50 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Công việc {index + 1}</span>
                          <button
                            onClick={() => removeExperience(index)}
                            className="text-xs text-destructive hover:underline cursor-pointer"
                          >
                            Xóa
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <InputField
                            icon={Briefcase}
                            label="Công ty"
                            value={exp.company}
                            onChange={(v: string) => updateExperience(index, "company", v)}
                            placeholder="Tên công ty"
                          />
                          <InputField
                            label="Vị trí"
                            value={exp.position}
                            onChange={(v: string) => updateExperience(index, "position", v)}
                            placeholder="VD: Lập trình viên"
                          />
                          <InputField
                            icon={Calendar}
                            label="Từ tháng"
                            value={exp.startDate}
                            onChange={(v: string) => updateExperience(index, "startDate", v)}
                            placeholder="01/2020"
                          />
                          <InputField
                            icon={Calendar}
                            label="Đến tháng"
                            value={exp.endDate}
                            onChange={(v: string) => updateExperience(index, "endDate", v)}
                            placeholder="Hiện tại"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-muted-foreground">
                            Mô tả công việc
                          </label>
                          <textarea
                            value={exp.description}
                            onChange={(e) => updateExperience(index, "description", e.target.value)}
                            placeholder="Mô tả các công việc đã làm và thành tích đạt được..."
                            className="w-full min-h-[80px] px-4 py-2 rounded-lg bg-card border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Education */}
              <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Học vấn
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addEducation}
                    className="rounded-lg gap-1"
                  >
                    <Plus className="h-4 w-4" /> Thêm
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cvData.education.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Chưa có thông tin học vấn. Nhấn "Thêm" để nhập.
                    </p>
                  ) : (
                    cvData.education.map((edu, index) => (
                      <div
                        key={edu.id}
                        className="p-4 rounded-xl bg-muted/50 border border-border/50 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Học vấn {index + 1}</span>
                          <button
                            onClick={() => removeEducation(index)}
                            className="text-xs text-destructive hover:underline cursor-pointer"
                          >
                            Xóa
                          </button>
                        </div>
                        <InputField
                          icon={GraduationCap}
                          label="Trường"
                          value={edu.school}
                          onChange={(v: string) => updateEducation(index, "school", v)}
                          placeholder="Tên trường"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <InputField
                            label="Bằng cấp"
                            value={edu.degree}
                            onChange={(v: string) => updateEducation(index, "degree", v)}
                            placeholder="VD: Cử nhân, Kỹ sư"
                          />
                          <InputField
                            label="Chuyên ngành"
                            value={edu.field}
                            onChange={(v: string) => updateEducation(index, "field", v)}
                            placeholder="VD: Công nghệ thông tin"
                          />
                          <InputField
                            icon={Calendar}
                            label="Từ năm"
                            value={edu.startDate}
                            onChange={(v: string) => updateEducation(index, "startDate", v)}
                            placeholder="2016"
                          />
                          <InputField
                            icon={Calendar}
                            label="Đến năm"
                            value={edu.endDate}
                            onChange={(v: string) => updateEducation(index, "endDate", v)}
                            placeholder="2020"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Kỹ năng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      placeholder="Nhập kỹ năng và nhấn Enter..."
                      className="flex-1"
                    />
                    <Button onClick={addSkill} variant="outline" className="rounded-lg">
                      Thêm
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {cvData.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                      >
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{skill.name}</span>
                          </div>
                          <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${skill.level}%`,
                                background: selectedTemplate?.accentColor || "var(--primary)",
                              }}
                            />
                          </div>
                        </div>
                        <select
                          value={skill.level}
                          onChange={(e) => updateSkillLevel(index, Number(e.target.value))}
                          className="h-8 px-2 rounded border border-border bg-card text-xs"
                        >
                          <option value={30}>Yếu</option>
                          <option value={50}>TB</option>
                          <option value={70}>Khá</option>
                          <option value={90}>Tốt</option>
                          <option value={100}>XS</option>
                        </select>
                        <button
                          onClick={() => removeSkill(index)}
                          className="text-destructive hover:underline text-xs cursor-pointer"
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Languages & Certifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Languages */}
                <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Languages className="h-5 w-5 text-primary" />
                      Ngôn ngữ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={languageInput}
                        onChange={(e) => setLanguageInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
                        placeholder="Nhập ngôn ngữ..."
                        className="flex-1"
                      />
                      <Button
                        onClick={addLanguage}
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                      >
                        +
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cvData.languages.map((lang, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1.5 text-sm flex items-center gap-2"
                        >
                          {lang}
                          <button
                            onClick={() => removeLanguage(index)}
                            className="hover:text-destructive cursor-pointer"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Certifications */}
                <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Chứng chỉ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={certInput}
                        onChange={(e) => setCertInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addCertification())
                        }
                        placeholder="Nhập chứng chỉ..."
                        className="flex-1"
                      />
                      <Button
                        onClick={addCertification}
                        variant="outline"
                        size="sm"
                        className="rounded-lg"
                      >
                        +
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cvData.certifications.map((cert, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="px-3 py-1.5 text-sm flex items-center gap-2"
                        >
                          <Award className="h-3 w-3" />
                          {cert}
                          <button
                            onClick={() => removeCertification(index)}
                            className="hover:text-destructive cursor-pointer"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Hobbies */}
              <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Sở thích
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={hobbyInput}
                      onChange={(e) => setHobbyInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHobby())}
                      placeholder="Nhập sở thích..."
                      className="flex-1"
                    />
                    <Button onClick={addHobby} variant="outline" size="sm" className="rounded-lg">
                      +
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cvData.hobbies.map((hobby, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1.5 text-sm flex items-center gap-2"
                      >
                        {hobby}
                        <button
                          onClick={() => removeHobby(index)}
                          className="hover:text-destructive cursor-pointer"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="border border-border/40 bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" />
                      Xem trước CV
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[600px]">
                      {selectedTemplate && <TemplateCard template={selectedTemplate} />}
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      Đây là bản xem trước. Xuất PDF để xem đầy đủ.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
