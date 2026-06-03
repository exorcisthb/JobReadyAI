import { useState, useEffect, useRef, useCallback } from "react";
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
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/dashboard-header";
import { userNavItems } from "@/pages/user/user-nav-items";
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
  layout: "sidebar" | "single" | "two-column" | "centered" | "impressive";
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
  title: string;
  fullName: string;
  jobTitle: string;
  dateOfBirth: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  objective: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: string[];
  hobbies: string[];
  certifications: string[];
  avatar?: string;
}

const cvTemplates: CVTemplate[] = [
  {
    id: "simple-1",
    name: "Tiêu chuẩn (ít kinh nghiệm)",
    description: "Template CV đơn giản, dễ đọc, bố cục truyền thống",
    style: "simple",
    layout: "single",
    tags: ["ATS", "Đơn giản", "Chuyên nghiệp"],
    colors: [
      { primaryColor: "#1a365d", secondaryColor: "#2c5282", accentColor: "#3182ce", textColor: "#FFFFFF" },
      { primaryColor: "#115e59", secondaryColor: "#0f766e", accentColor: "#14b8a6", textColor: "#FFFFFF" },
      { primaryColor: "#581c87", secondaryColor: "#6b21a8", accentColor: "#a855f7", textColor: "#FFFFFF" },
      { primaryColor: "#1f2937", secondaryColor: "#374151", accentColor: "#6b7280", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "simple-2",
    name: "Đơn giản 2",
    description: "Thiết kế tối giản, chuyên nghiệp, cân bằng thông tin",
    style: "simple",
    layout: "two-column",
    tags: ["ATS", "Đơn giản", "Hiện đại"],
    colors: [
      { primaryColor: "#2d3748", secondaryColor: "#4a5568", accentColor: "#718096", textColor: "#FFFFFF" },
      { primaryColor: "#1e3a8a", secondaryColor: "#1d4ed8", accentColor: "#3b82f6", textColor: "#FFFFFF" },
      { primaryColor: "#134e5e", secondaryColor: "#0f766e", accentColor: "#20b2aa", textColor: "#FFFFFF" },
      { primaryColor: "#701a75", secondaryColor: "#86198f", accentColor: "#d946ef", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "simple-3",
    name: "Thanh lịch 3",
    description: "CV dạng cột đơn, thanh lịch, trang nhã",
    style: "simple",
    layout: "single",
    tags: ["ATS", "Thanh lịch", "Đơn giản"],
    colors: [
      { primaryColor: "#234e52", secondaryColor: "#285e61", accentColor: "#38b2ac", textColor: "#FFFFFF" },
      { primaryColor: "#064e3b", secondaryColor: "#047857", accentColor: "#10b981", textColor: "#FFFFFF" },
      { primaryColor: "#881337", secondaryColor: "#9f1239", accentColor: "#f43f5e", textColor: "#FFFFFF" },
      { primaryColor: "#311084", secondaryColor: "#3730a3", accentColor: "#6366f1", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "impressive-1",
    name: "Ấn tượng 1",
    description: "Template ấn tượng, nổi bật, phù hợp làm nổi bật thế mạnh",
    style: "impressive",
    layout: "impressive",
    tags: ["Sáng tạo", "Nổi bật", "Hiện đại"],
    colors: [
      { primaryColor: "#c53030", secondaryColor: "#e53e3e", accentColor: "#fc8181", textColor: "#FFFFFF" },
      { primaryColor: "#0891b2", secondaryColor: "#06b6d4", accentColor: "#67e8f9", textColor: "#FFFFFF" },
      { primaryColor: "#5b21b6", secondaryColor: "#6d28d9", accentColor: "#a78bfa", textColor: "#FFFFFF" },
      { primaryColor: "#7c2d12", secondaryColor: "#9a3412", accentColor: "#f97316", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "impressive-2",
    name: "Ấn tượng 6",
    description: "Thiết kế sáng tạo, năng động, phù hợp nhiều ngành nghề",
    style: "impressive",
    layout: "impressive",
    tags: ["Sáng tạo", "Ấn tượng", "Chuyên nghiệp"],
    colors: [
      { primaryColor: "#6b46c1", secondaryColor: "#805ad5", accentColor: "#b794f4", textColor: "#FFFFFF" },
      { primaryColor: "#1b4d3e", secondaryColor: "#2d6a4f", accentColor: "#52b788", textColor: "#FFFFFF" },
      { primaryColor: "#c2410c", secondaryColor: "#ea580c", accentColor: "#f97316", textColor: "#FFFFFF" },
      { primaryColor: "#0f172a", secondaryColor: "#1e293b", accentColor: "#3b82f6", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "impressive-3",
    name: "Ấn tượng 3",
    description: "CV ấn tượng với gradient màu độc đáo",
    style: "impressive",
    layout: "impressive",
    tags: ["Sáng tạo", "Hiện đại", "Chuyên nghiệp"],
    colors: [
      { primaryColor: "#d69e2e", secondaryColor: "#ecc94b", accentColor: "#faf089", textColor: "#1a202c" },
      { primaryColor: "#3730a3", secondaryColor: "#4f46e5", accentColor: "#818cf8", textColor: "#FFFFFF" },
      { primaryColor: "#065f46", secondaryColor: "#047857", accentColor: "#34d399", textColor: "#FFFFFF" },
      { primaryColor: "#991b1b", secondaryColor: "#b91c1c", accentColor: "#f87171", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "professional-1",
    name: "Chuyên nghiệp 1",
    description: "CV phong cách doanh nghiệp, tối ưu không gian thông tin",
    style: "professional",
    layout: "two-column",
    tags: ["Chuyên nghiệp", "Hiện đại", "ATS"],
    colors: [
      { primaryColor: "#1a202c", secondaryColor: "#2d3748", accentColor: "#4a5568", textColor: "#FFFFFF" },
      { primaryColor: "#1e3a8a", secondaryColor: "#2563eb", accentColor: "#60a5fa", textColor: "#FFFFFF" },
      { primaryColor: "#064e3b", secondaryColor: "#059669", accentColor: "#34d399", textColor: "#FFFFFF" },
      { primaryColor: "#4c1d95", secondaryColor: "#7c3aed", accentColor: "#a78bfa", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "professional-2",
    name: "Chuyên nghiệp 2",
    description: "Template công sở, chính thức, phân chia rõ ràng",
    style: "professional",
    layout: "two-column",
    tags: ["Chuyên nghiệp", "Công sở", "ATS"],
    colors: [
      { primaryColor: "#2c5282", secondaryColor: "#3182ce", accentColor: "#63b3ed", textColor: "#FFFFFF" },
      { primaryColor: "#134e5e", secondaryColor: "#0d9488", accentColor: "#2dd4bf", textColor: "#FFFFFF" },
      { primaryColor: "#334155", secondaryColor: "#475569", accentColor: "#94a3b8", textColor: "#FFFFFF" },
      { primaryColor: "#4c0519", secondaryColor: "#881337", accentColor: "#fb7185", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "harvard-1",
    name: "Harvard 1",
    description: "Phong cách Harvard kinh điển, tối giản và học thuật",
    style: "harvard",
    layout: "single",
    tags: ["Học thuật", "Chuyên nghiệp", "Đơn giản"],
    colors: [
      { primaryColor: "#1a365d", secondaryColor: "#2c5282", accentColor: "#c9a227", textColor: "#FFFFFF" },
      { primaryColor: "#7a1c1c", secondaryColor: "#a82020", accentColor: "#dfa150", textColor: "#FFFFFF" },
      { primaryColor: "#111111", secondaryColor: "#222222", accentColor: "#d4af37", textColor: "#FFFFFF" },
      { primaryColor: "#0b3c2e", secondaryColor: "#1f5f4b", accentColor: "#dfa150", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "it-1",
    name: "IT 1",
    description: "Template tối ưu riêng cho ứng viên ngành Công nghệ",
    style: "it",
    layout: "sidebar",
    tags: ["IT", "Công nghệ", "Hiện đại"],
    colors: [
      { primaryColor: "#0f4c75", secondaryColor: "#1b262c", accentColor: "#3282b8", textColor: "#FFFFFF" },
      { primaryColor: "#064e3b", secondaryColor: "#022c22", accentColor: "#10b981", textColor: "#FFFFFF" },
      { primaryColor: "#2e1065", secondaryColor: "#1e1b4b", accentColor: "#8b5cf6", textColor: "#FFFFFF" },
      { primaryColor: "#1f2937", secondaryColor: "#111827", accentColor: "#f97316", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "designer-1",
    name: "Designer 1",
    description: "Template sáng tạo cho ngành thiết kế, nghệ thuật",
    style: "designer",
    layout: "impressive",
    tags: ["Thiết kế", "Sáng tạo", "Nổi bật"],
    colors: [
      { primaryColor: "#ed64a6", secondaryColor: "#f687b3", accentColor: "#fbb6ce", textColor: "#FFFFFF" },
      { primaryColor: "#4338ca", secondaryColor: "#6366f1", accentColor: "#a5b4fc", textColor: "#FFFFFF" },
      { primaryColor: "#047857", secondaryColor: "#10b981", accentColor: "#a7f3d0", textColor: "#FFFFFF" },
      { primaryColor: "#b45309", secondaryColor: "#f59e0b", accentColor: "#fde68a", textColor: "#FFFFFF" }
    ]
  },
  {
    id: "designer-2",
    name: "Designer 2",
    description: "CV với bố cục độc đáo, phối màu nghệ thuật",
    style: "designer",
    layout: "impressive",
    tags: ["Nghệ thuật", "Sáng tạo", "Hiện đại"],
    colors: [
      { primaryColor: "#667eea", secondaryColor: "#764ba2", accentColor: "#a78bfa", textColor: "#FFFFFF" },
      { primaryColor: "#ea580c", secondaryColor: "#c2410c", accentColor: "#fca5a5", textColor: "#FFFFFF" },
      { primaryColor: "#0d9488", secondaryColor: "#115e59", accentColor: "#99f6e4", textColor: "#FFFFFF" },
      { primaryColor: "#0f172a", secondaryColor: "#1e293b", accentColor: "#a855f7", textColor: "#FFFFFF" }
    ]
  }
];

const defaultCVData: CVData = {
  title: "",
  fullName: "",
  jobTitle: "",
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

// ============ SAMPLE CV DATA FOR EACH TEMPLATE ============

const sampleCVData: Record<string, CVData> = {
  "simple-1": {
    title: "CV Kiểm toán",
    fullName: "Nguyễn Minh Trang",
    jobTitle: "Audit Intern",
    dateOfBirth: "15/10/2004",
    address: "Hà Nội",
    phone: "0912 345 678",
    email: "minhtrang@email.com",
    website: "",
    objective: "Là một sinh viên ngành Kiểm toán học, mong muốn được học hỏi và trải nghiệm thực tế tại một môi trường chuyên nghiệp để tích lũy kiến thức thực tế và rèn luyện kỹ năng chuyên môn. Bản thân có khả năng tự học tốt, trung thực, chịu khó và mong muốn đóng góp năng lượng tích cực của mình vào thành công chung của công ty.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    experience: [
      { id: "1", company: "Công ty Kiểm toán TechTax", position: "Thực tập sinh Kiểm toán", startDate: "06/2025", endDate: "Hiện tại", description: "Hỗ trợ kiểm tra chứng từ, đối chiếu số liệu báo cáo tài chính. Tham gia khảo sát thực tế tại kho hàng của khách hàng." }
    ],
    education: [
      { id: "1", school: "Đại học Ngoại thương Hà Nội", degree: "Cử nhân Kiểm toán", field: "Kế toán - Kiểm toán", startDate: "2022", endDate: "2026" },
    ],
    skills: [
      { name: "Kiểm toán", level: 80 },
      { name: "Phân tích số liệu", level: 85 },
      { name: "Excel", level: 90 },
    ],
    languages: ["Tiếng Anh - IELTS 7.5"],
    hobbies: ["Đọc sách", "Cầu lông"],
    certifications: ["Chứng chỉ hoàn thành lớp Audit cơ bản"],
  },
  "simple-2": {
    title: "CV Marketing",
    fullName: "Vũ Tùng Dương",
    jobTitle: "Senior Digital Marketing",
    dateOfBirth: "20/09/1997",
    address: "Bình Thạnh, TP. HCM",
    phone: "0987 654 321",
    email: "tungduong.mkt@email.com",
    website: "",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
    objective: "Senior Digital Marketing với hơn 4 năm kinh nghiệm nghiên cứu thị trường, hoạch định và tối ưu hóa các chiến dịch quảng cáo đa kênh (Facebook, Google, TikTok). Đóng góp năng lực tăng trưởng leads và doanh số cho các sản phẩm công nghệ.",
    experience: [
      { id: "1", company: "VNG Corporation", position: "Senior Digital Marketing Specialist", startDate: "01/2023", endDate: "Hiện tại", description: "Quản lý và tối ưu ngân sách digital marketing 1.2 tỷ/tháng. Tăng tỷ lệ chuyển đổi leads lên 35%, tối ưu hóa ROAS đạt trung bình 280%." },
    ],
    education: [
      { id: "1", school: "Đại học Kinh tế TP.HCM", degree: "Cử nhân Marketing", field: "Digital Marketing", startDate: "2015", endDate: "2019" },
    ],
    skills: [
      { name: "Digital Marketing", level: 95 },
      { name: "Facebook Ads", level: 90 },
      { name: "Google Ads", level: 88 },
    ],
    languages: ["Tiếng Anh - TOEIC 850"],
    hobbies: ["Chụp ảnh", "Du lịch"],
    certifications: ["Google Ads Search Certification", "Facebook Certified Media Planning Professional"],
  },
  "simple-3": {
    title: "CV Kế toán",
    fullName: "Phạm Thúy Hà",
    jobTitle: "Nhân viên kế toán",
    dateOfBirth: "20/08/2000",
    address: "Cầu Giấy, Hà Nội",
    phone: "0359 123 456",
    email: "thuyha.keToan@email.com",
    website: "",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    objective: "Tìm kiếm vị trí Nhân viên kế toán, nơi tôi có thể áp dụng kiến thức chuyên ngành kế toán doanh nghiệp và kỹ năng sử dụng phần mềm MISA để xử lý hóa đơn, đối chiếu công nợ chính xác và kịp thời.",
    experience: [
      { id: "1", company: "Công ty Thương mại ABC", position: "Nhân viên Kế toán nội bộ", startDate: "03/2024", endDate: "Hiện tại", description: "Thực hiện đối chiếu hóa đơn VAT đầu vào/đầu ra, chuẩn bị chứng từ khai báo thuế hàng tháng. Quản lý thu chi nội bộ cửa hàng." },
    ],
    education: [
      { id: "1", school: "Học viện Tài chính", degree: "Cử nhân Kế toán", field: "Kế toán doanh nghiệp", startDate: "2018", endDate: "2022" },
    ],
    skills: [
      { name: "Excel kế toán", level: 90 },
      { name: "Phần mềm MISA", level: 85 },
      { name: "Khai báo Thuế", level: 80 },
    ],
    languages: ["Tiếng Anh giao tiếp"],
    hobbies: ["Nấu ăn", "Nghe nhạc"],
    certifications: ["Chứng chỉ Kế toán tổng hợp thực hành"],
  },
  "impressive-1": {
    title: "CV Lập trình viên",
    fullName: "Lê Chiến",
    jobTitle: "Lập trình viên",
    dateOfBirth: "12/03/2001",
    address: "Thủ Đức, TP. Hồ Chí Minh",
    phone: "0901 234 567",
    email: "lechien.dev@email.com",
    website: "github.com/lechiendev",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    objective: "Lập trình viên Front-End đầy nhiệt huyết với đam mê thiết kế giao diện người dùng mượt mà, tối ưu hóa hiệu năng ứng dụng. Mong muốn đem kỹ năng React.js đóng góp vào các dự án sản phẩm số chất lượng.",
    experience: [
      { id: "1", company: "FPT Software", position: "Front-End Developer", startDate: "06/2023", endDate: "Hiện tại", description: "Tham gia phát triển giao diện cổng thông tin tài chính lớn. Tối ưu hóa UI/UX giúp tăng thời gian tương tác người dùng thêm 20%." }
    ],
    education: [
      { id: "1", school: "Đại học Công nghệ Thông tin - ĐHQG TP.HCM", degree: "Cử nhân Kỹ thuật Phần mềm", field: "Phát triển Web", startDate: "2019", endDate: "2023" },
    ],
    skills: [
      { name: "React.js", level: 90 },
      { name: "JavaScript / TS", level: 85 },
      { name: "Tailwind CSS", level: 90 },
    ],
    languages: ["Tiếng Anh - TOEIC 780"],
    hobbies: ["Đọc sách công nghệ", "Chơi game"],
    certifications: ["Professional Web Developer Credential"],
  },
  "impressive-2": {
    title: "CV Content Marketing",
    fullName: "Trần Mạnh Dũng",
    jobTitle: "Content Leader",
    dateOfBirth: "25/11/1998",
    address: "Cầu Giấy, Hà Nội",
    phone: "0932 876 543",
    email: "manhdung.content@email.com",
    website: "",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    objective: "Content Leader với hơn 3 năm kinh nghiệm lập kế hoạch và triển khai nội dung cho các thương hiệu hàng đầu trong lĩnh vực F&B và FMCG. Định hướng phát triển chiến lược Content đa kênh hiệu quả.",
    experience: [
      { id: "1", company: "Agency XYZ", position: "Content Leader", startDate: "09/2022", endDate: "Hiện tại", description: "Lên ý tưởng, xây dựng nội dung cho các chiến dịch ra mắt sản phẩm mới của các nhãn hàng đối tác. Quản lý đội ngũ 5 CTV viết bài." }
    ],
    education: [
      { id: "1", school: "Đại học Khoa học Xã hội và Nhân văn", degree: "Cử nhân Báo chí", field: "Báo chí & Truyền thông", startDate: "2016", endDate: "2020" },
    ],
    skills: [
      { name: "Copywriting", level: 95 },
      { name: "Content Strategy", level: 90 },
      { name: "SEO Content", level: 85 },
    ],
    languages: ["Tiếng Anh giao tiếp tốt"],
    hobbies: ["Viết blog cá nhân", "Đọc sách tâm lý"],
    certifications: ["Hubspot Content Marketing Certification"],
  },
  "impressive-3": {
    title: "CV Nhân sự",
    fullName: "Ngô Thị Hoa",
    jobTitle: "Trưởng phòng Nhân sự",
    dateOfBirth: "08/07/1990",
    address: "Ba Đình, Hà Nội",
    phone: "0981 567 890",
    email: "ngothihoa.hr@email.com",
    website: "",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    objective: "Xây dựng văn hóa công ty tích cực và thu hút nhân tài. 8 năm kinh nghiệm trong lĩnh vực HR, từ tuyển dụng đến phát triển tổ chức.",
    experience: [
      { id: "1", company: "Tập đoàn Vingroup", position: "HR Manager", startDate: "01/2021", endDate: "Hiện tại", description: "Quản lý đội ngũ 15 người. Tuyển dụng 200+ nhân sự/năm. Xây dựng chương trình đào tạo nội bộ, tăng retention rate 25%." },
    ],
    education: [
      { id: "1", school: "Đại học Luật Hà Nội", degree: "Cử nhân Quản trị Nhân lực", field: "HR Management", startDate: "2008", endDate: "2012" },
    ],
    skills: [
      { name: "Tuyển dụng", level: 95 },
      { name: "Đào tạo & Phát triển", level: 90 },
    ],
    languages: ["Tiếng Anh - TOEIC 700"],
    hobbies: ["Yoga", "Nấu ăn"],
    certifications: ["SPHRi Certification"],
  },
  "professional-1": {
    title: "CV Kỹ sư xây dựng",
    fullName: "Đặng Văn Phúc",
    jobTitle: "Kỹ sư Xây dựng",
    dateOfBirth: "30/04/1994",
    address: "Gò Vấp, TP. Hồ Chí Minh",
    phone: "0916 789 012",
    email: "dangphuc.engineer@email.com",
    website: "",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    objective: "Tham gia các dự án xây dựng quy mô lớn, áp dụng kiến thức chuyên môn và công nghệ hiện đại để đảm bảo chất lượng và tiến độ công trình.",
    experience: [
      { id: "1", company: "Coteccons", position: "Site Engineer", startDate: "06/2020", endDate: "Hiện tại", description: "Giám sát thi công dự án cao ốc 30 tầng. Quản lý 50 công nhân. Đảm bảo tiến độ và chất lượng công trình, tiết kiệm 5% chi phí vật tư." },
    ],
    education: [
      { id: "1", school: "Đại học Bách Khoa TP.HCM", degree: "Kỹ sư Xây dựng", field: "Xây dựng Dân dụng", startDate: "2012", endDate: "2016" },
    ],
    skills: [
      { name: "AutoCAD", level: 92 },
      { name: "Revit", level: 85 },
    ],
    languages: ["Tiếng Anh - TOEIC 650"],
    hobbies: ["Leo núi", "Chụp ảnh kiến trúc"],
    certifications: ["Chứng chỉ Kỹ sư Xây dựng"],
  },
  "professional-2": {
    title: "CV Content Marketing",
    fullName: "Hoàng Tường Vy",
    jobTitle: "Content Marketing",
    dateOfBirth: "16/09/2000",
    address: "Hai Bà Trưng, Hà Nội",
    phone: "0978 345 678",
    email: "tuongvy.content@email.com",
    website: "",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150",
    objective: "Đam mê sáng tạo nội dung đa nền tảng, có tư duy thẩm mỹ cao và nhạy bén với các xu hướng tiếp thị số. Mong muốn cống hiến năng lực sáng tạo làm nổi bật giá trị cốt lõi của doanh nghiệp.",
    experience: [
      { id: "1", company: "G-Group", position: "Content Marketing Specialist", startDate: "08/2023", endDate: "Hiện tại", description: "Quản lý fanpage chính thức của 3 thương hiệu con, lên kịch bản video ngắn TikTok đạt triệu view. Tăng lượng tiếp cận tự nhiên thêm 40%." },
    ],
    education: [
      { id: "1", school: "Học viện Báo chí và Tuyên truyền", degree: "Cử nhân Quảng cáo", field: "Quan hệ công chúng", startDate: "2018", endDate: "2022" },
    ],
    skills: [
      { name: "Content Writer", level: 95 },
      { name: "Social Strategy", level: 90 },
      { name: "Thiết kế Banner", level: 80 },
    ],
    languages: ["Tiếng Anh - IELTS 6.5"],
    hobbies: ["Vẽ tranh", "Xem phim tài liệu"],
    certifications: ["Google Digital Marketing Certificate"],
  },
  "harvard-1": {
    title: "CV Học thuật",
    fullName: "Phan Đình Khoa",
    jobTitle: "Nghiên cứu sinh Tiến sĩ",
    dateOfBirth: "22/06/1992",
    address: "Cần Thơ",
    phone: "0945 678 901",
    email: "phandinhkhoa.research@email.com",
    website: "khoaphan-academic.github.io",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    objective: "Nghiên cứu chuyên sâu về Trí tuệ Nhân tạo và Ứng dụng, hướng đến các giải pháp AI có thể tác động tích cực đến xã hội và kinh tế.",
    experience: [
      { id: "1", company: "ĐH KHTN - ĐHQG TP.HCM", position: "Nghiên cứu sinh", startDate: "09/2021", endDate: "Hiện tại", description: "Nghiên cứu về Deep Learning cho NLP. Công bố 5 bài báo quốc tế (h-index: 3). Nhận tài trợ nghiên cứu 500 triệu đồng từ NAFOSTED." },
    ],
    education: [
      { id: "1", school: "Đại học Quốc gia Singapore (NUS)", degree: "Thạc sĩ Khoa học Máy tính", field: "Artificial Intelligence", startDate: "2019", endDate: "2021" },
    ],
    skills: [
      { name: "Python", level: 95 },
      { name: "Deep Learning", level: 90 },
    ],
    languages: ["Tiếng Anh - IELTS 8.0"],
    hobbies: ["Đọc paper", "Chơi cờ vua"],
    certifications: ["IEEE Member"],
  },
  "it-1": {
    title: "CV DevOps Engineer",
    fullName: "Trần Văn Hùng",
    jobTitle: "DevOps Engineer",
    dateOfBirth: "05/12/1996",
    address: "Quận 9, TP. Hồ Chí Minh",
    phone: "0903 456 789",
    email: "tranhung.devops@email.com",
    website: "hungdevops.io",
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150",
    objective: "Xây dựng và tối ưu hóa hạ tầng CI/CD, đảm bảo deployment an toàn và tự động hóa quy trình phát triển phần mềm.",
    experience: [
      { id: "1", company: "VNG Corporation", position: "DevOps Engineer", startDate: "01/2022", endDate: "Hiện tại", description: "Xây dựng CI/CD pipeline với Jenkins và GitLab. Tự động hóa deployment cho 10 microservices. Giảm thời gian deploy từ 2 giờ xuống 15 phút. Quản lý Kubernetes cluster với 50+ pods." },
    ],
    education: [
      { id: "1", school: "Đại học Sư phạm Kỹ thuật", degree: "Kỹ sư CNTT", field: "Hệ thống Thông tin", startDate: "2014", endDate: "2018" },
    ],
    skills: [
      { name: "Docker", level: 92 },
      { name: "Kubernetes", level: 88 },
    ],
    languages: ["Tiếng Anh - TOEIC 800"],
    hobbies: ["Tự động hóa nhà thông minh", "CTF"],
    certifications: ["CKA (Kubernetes)"],
  },
  "designer-1": {
    title: "CV Graphic Designer",
    fullName: "Lê Thị Ngọc",
    jobTitle: "Graphic Designer",
    dateOfBirth: "28/02/1998",
    address: "Q.3, TP. Hồ Chí Minh",
    phone: "0923 567 890",
    email: "lengoc.design@email.com",
    website: "ngocdesign.portfolio.com",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150",
    objective: "Tạo ra các thiết kế đồ họa sáng tạo và có sức cộng hưởng thương hiệu, từ branding đến digital marketing materials.",
    experience: [
      { id: "1", company: "Brandify Agency", position: "Senior Graphic Designer", startDate: "03/2022", endDate: "Hiện tại", description: "Lead design cho 10+ campaigns lớn của các thương hiệu F&B. Thiết kế brand identity hoàn chỉnh cho 5 startup. Tăng engagement rate 60% qua việc refresh visual assets." },
    ],
    education: [
      { id: "1", school: "Trường ĐH Mỹ Thuật TP.HCM", degree: "Cử nhân Thiết kế Đồ họa", field: "Graphic Design", startDate: "2016", endDate: "2020" },
    ],
    skills: [
      { name: "Illustrator", level: 95 },
      { name: "Photoshop", level: 92 },
    ],
    languages: ["Tiếng Anh - TOEIC 700"],
    hobbies: ["Vẽ tay", "Nhiếp ảnh"],
    certifications: ["Adobe Certified Expert"],
  },
  "designer-2": {
    title: "CV Motion Designer",
    fullName: "Bùi Văn Tài",
    jobTitle: "Motion Graphics Designer",
    dateOfBirth: "14/10/1997",
    address: "Q.Phú Nhuận, TP. Hồ Chí Minh",
    phone: "0934 678 901",
    email: "buivantaimotion@email.com",
    website: "taimotion.vimeo.com",
    avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150",
    objective: "Mang đến những sản phẩm motion graphics sống động và có sức lan tỏa, kết hợp nghệ thuật thị giác với câu chuyện thương hiệu.",
    experience: [
      { id: "1", company: "MoMo Entertainment", position: "Motion Designer", startDate: "06/2022", endDate: "Hiện tại", description: "Sản xuất 50+ motion graphics videos/tháng cho social media. Creative direction cho TVC quảng cáo. Tạo template animation giúp team tăng 40% productivity." },
    ],
    education: [
      { id: "1", school: "Arena Multimedia", degree: "Diploma in Motion Graphics", field: "Animation & VFX", startDate: "2015", endDate: "2017" },
    ],
    skills: [
      { name: "After Effects", level: 95 },
      { name: "Cinema 4D", level: 85 },
    ],
    languages: ["Tiếng Anh - TOEIC 750"],
    hobbies: ["Làm phim ngắn", "Synthwave art"],
    certifications: ["After Effects Certified"],
  },
};

// ============ INLINE EDITOR ============

const InlineInput = ({
  value,
  onChange,
  placeholder = "Nhấn để nhập...",
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
        title="Nhấn để chỉnh sửa"
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
  placeholder = "Nhấn để nhập...",
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
        className={`cursor-text border-b border-dashed border-gray-400 hover:border-primary hover:bg-blue-50 px-0.5 py-0.5 transition-all ${!value ? "text-gray-400 italic" : "text-gray-700"} ${className}`}
        style={style}
        title="Nhấn để chỉnh sửa"
      >
        {value || placeholder}
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

const SectionHeader = ({ title, accentColor, primaryColor }: { title: string; accentColor: string; primaryColor: string }) => (
  <div className="flex items-center gap-1.5 mb-2">
    <div className="w-0.5 h-3.5 rounded-full" style={{ background: accentColor }} />
    <span className="font-bold uppercase tracking-wide text-[10px]" style={{ color: primaryColor }}>
      {title}
    </span>
  </div>
);

const ExperienceItem = ({
  exp,
  onUpdate,
  onRemove,
  accentColor,
  primaryColor,
}: {
  exp: Experience;
  onUpdate: (field: string, value: string) => void;
  onRemove: () => void;
  accentColor: string;
  primaryColor: string;
}) => (
  <div className="border-l-2 pl-2 mb-2.5 group relative">
    <button
      onClick={onRemove}
      className="absolute -right-5 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500"
    >
      <X className="h-3 w-3" />
    </button>
    <div className="flex justify-between items-start text-[9px] mb-0.5">
      <span className="font-semibold text-gray-800">
        <InlineInput value={exp.position} onChange={(v) => onUpdate("position", v)} placeholder="Vị trí công việc" />
      </span>
      <span className="text-gray-400 text-[8px]">
        <InlineInput value={exp.startDate} onChange={(v) => onUpdate("startDate", v)} placeholder="Từ" className="!text-[8px] w-[40px]" /> - <InlineInput value={exp.endDate} onChange={(v) => onUpdate("endDate", v)} placeholder="Đến" className="!text-[8px] w-[40px]" />
      </span>
    </div>
    <div className="text-[9px]" style={{ color: primaryColor }}>
      <InlineInput value={exp.company} onChange={(v) => onUpdate("company", v)} placeholder="Tên công ty" />
    </div>
    <div className="text-[8px] text-gray-500">
      <InlineTextarea value={exp.description} onChange={(v) => onUpdate("description", v)} placeholder="Mô tả công việc, thành tích..." className="!text-[8px]" />
    </div>
  </div>
);

const EducationItem = ({
  edu,
  onUpdate,
  onRemove,
  accentColor,
  primaryColor,
}: {
  edu: Education;
  onUpdate: (field: string, value: string) => void;
  onRemove: () => void;
  accentColor: string;
  primaryColor: string;
}) => (
  <div className="border-l-2 pl-2 mb-2 group relative">
    <button
      onClick={onRemove}
      className="absolute -right-5 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500"
    >
      <X className="h-3 w-3" />
    </button>
    <div className="flex justify-between text-[9px]">
      <span className="font-semibold text-gray-800">
        <InlineInput value={edu.degree} onChange={(v) => onUpdate("degree", v)} placeholder="Bằng cấp" />
      </span>
      <span className="text-gray-400 text-[8px]">
        <InlineInput value={edu.endDate} onChange={(v) => onUpdate("endDate", v)} placeholder="Năm" className="!text-[8px] w-[35px]" />
      </span>
    </div>
    <div className="text-[9px] text-gray-600">
      <InlineInput value={edu.school} onChange={(v) => onUpdate("school", v)} placeholder="Trường học" />
    </div>
  </div>
);

const SkillTag = ({
  skill,
  onUpdate,
  onRemove,
  primaryColor,
}: {
  skill: Skill;
  onUpdate: (v: string) => void;
  onRemove: () => void;
  primaryColor: string;
}) => (
  <span
    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] group relative"
    style={{ background: `${primaryColor}15`, color: primaryColor }}
  >
    <InlineInput value={skill.name} onChange={onUpdate} placeholder="Kỹ năng" className="!text-[9px]" />
    <button
      onClick={onRemove}
      className="opacity-0 group-hover:opacity-100 transition-opacity ml-0.5"
    >
      <X className="h-2.5 w-2.5" />
    </button>
  </span>
);

// ============ CV TEMPLATE LAYOUTS ============

/** TEMPLATE 1: SIDEBAR (dọc trái gradient + nội dung phải) */
const CVTemplateSidebar = ({ data, onChange, template }: { data: CVData; onChange: (d: CVData) => void; template: SelectedCVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  return (
    <div className="w-full h-full bg-white flex" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Sidebar trái */}
      <div className="w-[220px] shrink-0 flex flex-col" style={{ background: `linear-gradient(175deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}>
        {/* Avatar + Name */}
        <div className="flex flex-col items-center px-5 pt-8 pb-6">
          <div className="w-20 h-20 rounded-full border-[3px] border-white/40 bg-white/20 flex items-center justify-center mb-4 overflow-hidden shrink-0 shadow-lg">
            {data.avatar ? (
              <img src={data.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="h-9 w-9 text-white/70" />
            )}
          </div>
          <div className="text-white font-bold text-[15px] text-center leading-tight mb-1">
            <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder="Họ và tên" className="!text-white !font-bold text-center !text-[15px]" />
          </div>
          <div className="text-white/75 text-[11px] text-center mt-0.5">
            <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder="Vị trí ứng tuyển" className="!text-white/75 text-center !text-[11px]" />
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-white/20" />

        {/* Contact Info */}
        <div className="px-5 py-5 space-y-2.5">
          <p className="text-white/50 text-[9px] font-semibold uppercase tracking-widest mb-3">Liên hệ</p>
          <div className="flex items-center gap-2.5 text-white/90">
            <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <Phone className="h-3 w-3" />
            </div>
            <InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder="Số điện thoại" className="!text-white/90 flex-1 !text-[11px]" />
          </div>
          <div className="flex items-center gap-2.5 text-white/90">
            <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <Mail className="h-3 w-3" />
            </div>
            <InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder="Email" className="!text-white/90 flex-1 !text-[10px]" />
          </div>
          <div className="flex items-center gap-2.5 text-white/90">
            <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <MapPin className="h-3 w-3" />
            </div>
            <InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder="Địa chỉ" className="!text-white/90 flex-1 !text-[11px]" />
          </div>
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="px-5 pb-4">
            <div className="h-px bg-white/20 mb-4" />
            <p className="text-white/50 text-[9px] font-semibold uppercase tracking-widest mb-3">Kỹ năng</p>
            <div className="space-y-2">
              {data.skills.map((skill, i) => (
                <div key={i} className="group relative">
                  <div className="flex justify-between items-center mb-1">
                    <InlineInput
                      value={skill.name}
                      onChange={(v) => { const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s }); }}
                      placeholder="Kỹ năng"
                      className="!text-white !text-[11px] !border-white/30"
                    />
                    <button onClick={() => { const s = data.skills.filter((_, idx) => idx !== i); onChange({ ...data, skills: s }); }}
                      className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-white ml-1">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="h-1 rounded-full bg-white/20">
                    <div className="h-full rounded-full bg-white/70" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages.length > 0 && (
          <div className="px-5 pb-4">
            <div className="h-px bg-white/20 mb-4" />
            <p className="text-white/50 text-[9px] font-semibold uppercase tracking-widest mb-3">Ngôn ngữ</p>
            <div className="space-y-1.5">
              {data.languages.map((lang, i) => (
                <div key={i} className="flex items-center gap-2 text-white/85">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />
                  <InlineInput value={lang} onChange={(v) => { const l = [...data.languages]; l[i] = v; onChange({ ...data, languages: l }); }} className="!text-white/85 flex-1 !text-[11px]" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main content phải */}
      <div className="flex-1 px-7 py-7 overflow-y-auto space-y-5">
        {data.objective && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: primaryColor }} />
              <span className="font-bold text-[13px] uppercase tracking-wide" style={{ color: primaryColor }}>Mục tiêu nghề nghiệp</span>
            </div>
            <div className="text-gray-600 text-[11.5px] leading-relaxed pl-3">
              <InlineTextarea value={data.objective} onChange={(v) => onChange({ ...data, objective: v })} placeholder="Mô tả mục tiêu..." className="!text-gray-600 !text-[11.5px]" />
            </div>
          </div>
        )}

        {data.experience.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: primaryColor }} />
              <span className="font-bold text-[13px] uppercase tracking-wide" style={{ color: primaryColor }}>Kinh nghiệm làm việc</span>
            </div>
            <div className="space-y-3 pl-3">
              {data.experience.map((exp, i) => (
                <div key={exp.id} className="group relative border-l-2 pl-4 pb-1" style={{ borderColor: `${accentColor}60` }}>
                  <button onClick={() => { const e = data.experience.filter((_, idx) => idx !== i); onChange({ ...data, experience: e }); }}
                    className="absolute -right-4 top-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400">
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="font-semibold text-[12.5px] text-gray-800">
                    <InlineInput value={exp.position} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], position: v }; onChange({ ...data, experience: e }); }} placeholder="Vị trí công việc" />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-medium" style={{ color: primaryColor }}>
                      <InlineInput value={exp.company} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], company: v }; onChange({ ...data, experience: e }); }} placeholder="Tên công ty" />
                    </span>
                    <span className="text-gray-400 text-[10px]">
                      <InlineInput value={exp.startDate} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], startDate: v }; onChange({ ...data, experience: e }); }} placeholder="Từ" className="!text-[10px] w-10" /> - <InlineInput value={exp.endDate} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, experience: e }); }} placeholder="Đến" className="!text-[10px] w-12" />
                    </span>
                  </div>
                  <div className="text-gray-500 text-[11px] leading-relaxed mt-1">
                    <InlineTextarea value={exp.description} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], description: v }; onChange({ ...data, experience: e }); }} placeholder="Mô tả công việc..." className="!text-gray-500 !text-[11px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: primaryColor }} />
              <span className="font-bold text-[13px] uppercase tracking-wide" style={{ color: primaryColor }}>Học vấn</span>
            </div>
            <div className="space-y-2.5 pl-3">
              {data.education.map((edu, i) => (
                <div key={edu.id} className="group relative border-l-2 pl-4" style={{ borderColor: `${accentColor}60` }}>
                  <button onClick={() => { const e = data.education.filter((_, idx) => idx !== i); onChange({ ...data, education: e }); }}
                    className="absolute -right-4 top-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400">
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="font-semibold text-[12px] text-gray-800">
                    <InlineInput value={edu.degree} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], degree: v }; onChange({ ...data, education: e }); }} placeholder="Bằng cấp / Chuyên ngành" />
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-[11px] text-gray-500">
                      <InlineInput value={edu.school} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], school: v }; onChange({ ...data, education: e }); }} placeholder="Tên trường" />
                    </span>
                    <span className="text-[10px] text-gray-400">
                      <InlineInput value={edu.endDate} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, education: e }); }} placeholder="Năm" className="!text-[10px] w-10" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.certifications.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: primaryColor }} />
              <span className="font-bold text-[13px] uppercase tracking-wide" style={{ color: primaryColor }}>Chứng chỉ</span>
            </div>
            <div className="space-y-1.5 pl-3">
              {data.certifications.map((cert, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] text-gray-600">
                  <Award className="h-3.5 w-3.5 shrink-0" style={{ color: accentColor }} />
                  <InlineInput value={cert} onChange={(v) => { const c = [...data.certifications]; c[i] = v; onChange({ ...data, certifications: c }); }} className="flex-1 !text-[11px]" />
                </div>
              ))}
            </div>
          </div>
        )}

        {data.hobbies.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: primaryColor }} />
              <span className="font-bold text-[13px] uppercase tracking-wide" style={{ color: primaryColor }}>Sở thích</span>
            </div>
            <div className="flex flex-wrap gap-2 pl-3">
              {data.hobbies.map((hobby, i) => (
                <span key={i} className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: `${primaryColor}12`, color: primaryColor }}>
                  <InlineInput value={hobby} onChange={(v) => { const h = [...data.hobbies]; h[i] = v; onChange({ ...data, hobbies: h }); }} className="!text-[11px]" />
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/** TEMPLATE 2: SINGLE COLUMN (header banner + body đơn cột) */
const CVTemplateSingle = ({ data, onChange, template }: { data: CVData; onChange: (d: CVData) => void; template: SelectedCVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  return (
    <div className="w-full h-full bg-white flex flex-col" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header banner */}
      <div className="px-8 py-6 flex items-center gap-5" style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}>
        <div className="w-[72px] h-[72px] rounded-full bg-white/25 border-2 border-white/40 flex items-center justify-center shrink-0 overflow-hidden shadow-lg">
          {data.avatar ? (
            <img src={data.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="h-8 w-8 text-white/70" />
          )}
        </div>
        <div className="flex-1">
          <div className="text-white font-bold text-[20px] leading-tight">
            <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder="Họ và tên" className="!text-white !font-bold !text-[20px]" />
          </div>
          <div className="text-white/80 text-[13px] mt-1">
            <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder="Vị trí ứng tuyển" className="!text-white/80 !text-[13px]" />
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2.5 text-white/75 text-[11px]">
            <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /><InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder="SĐT" className="!text-white/75 !text-[11px]" /></span>
            <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /><InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder="Email" className="!text-white/75 !text-[11px]" /></span>
            <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /><InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder="Địa chỉ" className="!text-white/75 !text-[11px]" /></span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-8 py-5 space-y-4 overflow-y-auto">
        {data.objective && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-[13px] uppercase tracking-wide" style={{ color: primaryColor }}>Mục tiêu nghề nghiệp</span>
              <div className="flex-1 h-px" style={{ background: `${accentColor}50` }} />
            </div>
            <p className="text-gray-600 text-[11.5px] leading-relaxed">
              <InlineTextarea value={data.objective} onChange={(v) => onChange({ ...data, objective: v })} placeholder="Mô tả mục tiêu..." className="!text-gray-600 !text-[11.5px]" />
            </p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold text-[13px] uppercase tracking-wide" style={{ color: primaryColor }}>Kinh nghiệm làm việc</span>
              <div className="flex-1 h-px" style={{ background: `${accentColor}50` }} />
            </div>
            <div className="space-y-3">
              {data.experience.map((exp, i) => (
                <div key={exp.id} className="group relative flex gap-3">
                  <div className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ background: accentColor }} />
                  <div className="flex-1">
                    <button onClick={() => { const e = data.experience.filter((_, idx) => idx !== i); onChange({ ...data, experience: e }); }}
                      className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400">
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <div className="flex items-baseline justify-between">
                      <span className="font-semibold text-[12.5px] text-gray-800">
                        <InlineInput value={exp.position} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], position: v }; onChange({ ...data, experience: e }); }} placeholder="Vị trí" />
                      </span>
                      <span className="text-[10.5px] text-gray-400">
                        <InlineInput value={exp.startDate} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], startDate: v }; onChange({ ...data, experience: e }); }} placeholder="Từ" className="!text-[10.5px] w-10" /> – <InlineInput value={exp.endDate} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, experience: e }); }} placeholder="Đến" className="!text-[10.5px] w-14" />
                      </span>
                    </div>
                    <div className="text-[11.5px] font-medium mt-0.5" style={{ color: primaryColor }}>
                      <InlineInput value={exp.company} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], company: v }; onChange({ ...data, experience: e }); }} placeholder="Tên công ty" />
                    </div>
                    <div className="text-gray-500 text-[11px] leading-relaxed mt-1">
                      <InlineTextarea value={exp.description} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], description: v }; onChange({ ...data, experience: e }); }} placeholder="Mô tả..." className="!text-[11px] !text-gray-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold text-[13px] uppercase tracking-wide" style={{ color: primaryColor }}>Học vấn</span>
              <div className="flex-1 h-px" style={{ background: `${accentColor}50` }} />
            </div>
            <div className="space-y-2">
              {data.education.map((edu, i) => (
                <div key={edu.id} className="group relative flex gap-3">
                  <div className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ background: accentColor }} />
                  <div className="flex-1">
                    <button onClick={() => { const e = data.education.filter((_, idx) => idx !== i); onChange({ ...data, education: e }); }}
                      className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400">
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <div className="flex items-baseline justify-between">
                      <span className="font-semibold text-[12px] text-gray-800">
                        <InlineInput value={edu.degree} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], degree: v }; onChange({ ...data, education: e }); }} placeholder="Bằng cấp" />
                      </span>
                      <span className="text-[10px] text-gray-400">
                        <InlineInput value={edu.endDate} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, education: e }); }} placeholder="Năm" className="!text-[10px] w-10" />
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      <InlineInput value={edu.school} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], school: v }; onChange({ ...data, education: e }); }} placeholder="Tên trường" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.skills.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold text-[13px] uppercase tracking-wide" style={{ color: primaryColor }}>Kỹ năng</span>
              <div className="flex-1 h-px" style={{ background: `${accentColor}50` }} />
            </div>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="group relative flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium border" style={{ borderColor: `${primaryColor}30`, color: primaryColor, background: `${primaryColor}08` }}>
                  <InlineInput value={skill.name} onChange={(v) => { const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s }); }} placeholder="Kỹ năng" className="!text-[11px]" />
                  <button onClick={() => { const s = data.skills.filter((_, idx) => idx !== i); onChange({ ...data, skills: s }); }}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/** TEMPLATE 3: TWO COLUMN (header full-width + body 2 cột) */
const CVTemplateTwoColumn = ({ data, onChange, template }: { data: CVData; onChange: (d: CVData) => void; template: SelectedCVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  return (
    <div className="w-full h-full bg-white flex flex-col" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Full-width header */}
      <div className="px-8 py-5 flex items-center gap-5" style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}>
        <div className="w-[68px] h-[68px] rounded-full bg-white/25 border-2 border-white/40 flex items-center justify-center shrink-0 overflow-hidden shadow-lg">
          {data.avatar ? (
            <img src={data.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="h-8 w-8 text-white/70" />
          )}
        </div>
        <div className="flex-1">
          <div className="text-white font-bold text-[19px] leading-tight">
            <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder="Họ và tên" className="!text-white !font-bold !text-[19px]" />
          </div>
          <div className="text-white/80 text-[12.5px] mt-0.5">
            <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder="Vị trí ứng tuyển" className="!text-white/80 !text-[12.5px]" />
          </div>
        </div>
      </div>

      {/* Contact bar */}
      <div className="flex items-center justify-center gap-5 py-2.5 border-b border-gray-100" style={{ background: `${primaryColor}08` }}>
        <span className="flex items-center gap-1.5 text-[11px] text-gray-600"><Phone className="h-3 w-3" style={{ color: primaryColor }} /><InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder="SĐT" className="!text-[11px] !text-gray-600" /></span>
        <span className="flex items-center gap-1.5 text-[11px] text-gray-600"><Mail className="h-3 w-3" style={{ color: primaryColor }} /><InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder="Email" className="!text-[11px] !text-gray-600" /></span>
        <span className="flex items-center gap-1.5 text-[11px] text-gray-600"><MapPin className="h-3 w-3" style={{ color: primaryColor }} /><InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder="Địa chỉ" className="!text-[11px] !text-gray-600" /></span>
      </div>

      {/* Two-column body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left col */}
        <div className="w-[195px] shrink-0 px-4 py-5 space-y-4" style={{ background: `${primaryColor}05`, borderRight: `1px solid ${primaryColor}15` }}>
          {data.skills.length > 0 && (
            <div>
              <div className="font-bold text-[12px] uppercase tracking-wide mb-3" style={{ color: primaryColor }}>Kỹ năng</div>
              <div className="space-y-2">
                {data.skills.map((skill, i) => (
                  <div key={i} className="group relative">
                    <div className="flex justify-between items-center">
                      <InlineInput value={skill.name} onChange={(v) => { const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s }); }} placeholder="Kỹ năng" className="!text-[11px] !text-gray-700 flex-1" />
                      <button onClick={() => { const s = data.skills.filter((_, idx) => idx !== i); onChange({ ...data, skills: s }); }}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 mt-1">
                      <div className="h-full rounded-full" style={{ width: `${skill.level}%`, background: primaryColor }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.languages.length > 0 && (
            <div>
              <div className="font-bold text-[12px] uppercase tracking-wide mb-2" style={{ color: primaryColor }}>Ngôn ngữ</div>
              <div className="space-y-1.5">
                {data.languages.map((lang, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accentColor }} />
                    <InlineInput value={lang} onChange={(v) => { const l = [...data.languages]; l[i] = v; onChange({ ...data, languages: l }); }} className="!text-[11px] flex-1" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.hobbies.length > 0 && (
            <div>
              <div className="font-bold text-[12px] uppercase tracking-wide mb-2" style={{ color: primaryColor }}>Sở thích</div>
              <div className="flex flex-wrap gap-1.5">
                {data.hobbies.map((h, i) => (
                  <span key={i} className="text-[10.5px] px-2 py-1 rounded-full" style={{ background: `${primaryColor}10`, color: primaryColor }}>
                    <InlineInput value={h} onChange={(v) => { const ho = [...data.hobbies]; ho[i] = v; onChange({ ...data, hobbies: ho }); }} className="!text-[10.5px]" />
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right col */}
        <div className="flex-1 px-5 py-5 space-y-4 overflow-y-auto">
          {data.objective && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-[12.5px] uppercase tracking-wide" style={{ color: primaryColor }}>Mục tiêu</span>
                <div className="flex-1 h-px" style={{ background: `${accentColor}40` }} />
              </div>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                <InlineTextarea value={data.objective} onChange={(v) => onChange({ ...data, objective: v })} placeholder="Mô tả mục tiêu..." className="!text-gray-600 !text-[11px]" />
              </p>
            </div>
          )}

          {data.experience.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-[12.5px] uppercase tracking-wide" style={{ color: primaryColor }}>Kinh nghiệm</span>
                <div className="flex-1 h-px" style={{ background: `${accentColor}40` }} />
              </div>
              {data.experience.map((exp, i) => (
                <div key={exp.id} className="group relative mb-3 pl-3 border-l-2" style={{ borderColor: `${accentColor}50` }}>
                  <button onClick={() => { const e = data.experience.filter((_, idx) => idx !== i); onChange({ ...data, experience: e }); }}
                    className="absolute -right-4 top-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400">
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="flex justify-between">
                    <span className="font-semibold text-[12px] text-gray-800">
                      <InlineInput value={exp.position} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], position: v }; onChange({ ...data, experience: e }); }} placeholder="Vị trí" />
                    </span>
                    <span className="text-[10px] text-gray-400">
                      <InlineInput value={exp.startDate} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], startDate: v }; onChange({ ...data, experience: e }); }} placeholder="Từ" className="!text-[10px] w-9" /> – <InlineInput value={exp.endDate} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, experience: e }); }} placeholder="Đến" className="!text-[10px] w-12" />
                    </span>
                  </div>
                  <div className="text-[11px] font-medium mt-0.5" style={{ color: primaryColor }}>
                    <InlineInput value={exp.company} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], company: v }; onChange({ ...data, experience: e }); }} placeholder="Công ty" />
                  </div>
                  <div className="text-[10.5px] text-gray-500 mt-1 leading-relaxed">
                    <InlineTextarea value={exp.description} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], description: v }; onChange({ ...data, experience: e }); }} placeholder="Mô tả..." className="!text-[10.5px] !text-gray-500" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {data.education.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-[12.5px] uppercase tracking-wide" style={{ color: primaryColor }}>Học vấn</span>
                <div className="flex-1 h-px" style={{ background: `${accentColor}40` }} />
              </div>
              {data.education.map((edu, i) => (
                <div key={edu.id} className="group relative mb-2 pl-3 border-l-2" style={{ borderColor: `${accentColor}50` }}>
                  <button onClick={() => { const e = data.education.filter((_, idx) => idx !== i); onChange({ ...data, education: e }); }}
                    className="absolute -right-4 top-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400">
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="flex justify-between">
                    <span className="font-semibold text-[12px] text-gray-800">
                      <InlineInput value={edu.degree} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], degree: v }; onChange({ ...data, education: e }); }} placeholder="Bằng cấp" />
                    </span>
                    <span className="text-[10px] text-gray-400">
                      <InlineInput value={edu.endDate} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, education: e }); }} placeholder="Năm" className="!text-[10px] w-9" />
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    <InlineInput value={edu.school} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], school: v }; onChange({ ...data, education: e }); }} placeholder="Tên trường" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/** TEMPLATE 4: IMPRESSIVE (centered header lớn + body đơn) */
const CVTemplateImpressive = ({ data, onChange, template }: { data: CVData; onChange: (d: CVData) => void; template: SelectedCVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  return (
    <div className="w-full h-full bg-white flex flex-col" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Centered header */}
      <div className="px-8 py-7 text-center" style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}>
        <div className="w-[80px] h-[80px] rounded-full mx-auto mb-3 border-[3px] border-white/40 bg-white/20 flex items-center justify-center overflow-hidden shadow-xl">
          {data.avatar ? (
            <img src={data.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="h-9 w-9 text-white/70" />
          )}
        </div>
        <div className="text-white font-bold text-[21px] leading-tight">
          <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder="Họ và tên" className="!text-white !font-bold !text-[21px] text-center" />
        </div>
        <div className="text-white/80 text-[13px] mt-1">
          <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder="Vị trí ứng tuyển" className="!text-white/80 !text-[13px] text-center" />
        </div>
        <div className="flex justify-center flex-wrap gap-x-5 gap-y-1 mt-3 text-white/75 text-[11px]">
          <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /><InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder="SĐT" className="!text-white/75 !text-[11px]" /></span>
          <span className="flex items-center gap-1.5"><Mail className="h-3 w-3" /><InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder="Email" className="!text-white/75 !text-[11px]" /></span>
          <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /><InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder="Địa chỉ" className="!text-white/75 !text-[11px]" /></span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-8 py-5 space-y-4 overflow-y-auto">
        {data.objective && (
          <div>
            <div className="text-center mb-3">
              <span className="font-bold text-[13px] uppercase tracking-widest px-4 py-1 rounded-full text-white" style={{ background: primaryColor }}>Mục tiêu nghề nghiệp</span>
            </div>
            <p className="text-gray-600 text-[11.5px] leading-relaxed text-center">
              <InlineTextarea value={data.objective} onChange={(v) => onChange({ ...data, objective: v })} placeholder="Mô tả mục tiêu..." className="!text-gray-600 !text-[11.5px]" />
            </p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px" style={{ background: `${accentColor}40` }} />
              <span className="font-bold text-[13px] uppercase tracking-wide" style={{ color: primaryColor }}>Kinh nghiệm làm việc</span>
              <div className="flex-1 h-px" style={{ background: `${accentColor}40` }} />
            </div>
            <div className="space-y-3">
              {data.experience.map((exp, i) => (
                <div key={exp.id} className="group relative bg-gray-50 rounded-lg px-4 py-3 border-l-4" style={{ borderColor: primaryColor }}>
                  <button onClick={() => { const e = data.experience.filter((_, idx) => idx !== i); onChange({ ...data, experience: e }); }}
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400">
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-[12.5px] text-gray-800">
                      <InlineInput value={exp.position} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], position: v }; onChange({ ...data, experience: e }); }} placeholder="Vị trí" />
                    </span>
                    <span className="text-[10.5px] text-gray-400 shrink-0 ml-2">
                      <InlineInput value={exp.startDate} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], startDate: v }; onChange({ ...data, experience: e }); }} placeholder="Từ" className="!text-[10.5px] w-10" /> – <InlineInput value={exp.endDate} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, experience: e }); }} placeholder="Đến" className="!text-[10.5px] w-14" />
                    </span>
                  </div>
                  <div className="text-[11.5px] font-medium mt-0.5" style={{ color: primaryColor }}>
                    <InlineInput value={exp.company} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], company: v }; onChange({ ...data, experience: e }); }} placeholder="Công ty" />
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                    <InlineTextarea value={exp.description} onChange={(v) => { const e = [...data.experience]; e[i] = { ...e[i], description: v }; onChange({ ...data, experience: e }); }} placeholder="Mô tả..." className="!text-[11px] !text-gray-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px" style={{ background: `${accentColor}40` }} />
              <span className="font-bold text-[13px] uppercase tracking-wide" style={{ color: primaryColor }}>Học vấn</span>
              <div className="flex-1 h-px" style={{ background: `${accentColor}40` }} />
            </div>
            <div className="space-y-2">
              {data.education.map((edu, i) => (
                <div key={edu.id} className="group relative bg-gray-50 rounded-lg px-4 py-2.5 border-l-4" style={{ borderColor: accentColor }}>
                  <button onClick={() => { const e = data.education.filter((_, idx) => idx !== i); onChange({ ...data, education: e }); }}
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400">
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="flex justify-between">
                    <span className="font-semibold text-[12px] text-gray-800">
                      <InlineInput value={edu.degree} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], degree: v }; onChange({ ...data, education: e }); }} placeholder="Bằng cấp" />
                    </span>
                    <span className="text-[10px] text-gray-400">
                      <InlineInput value={edu.endDate} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], endDate: v }; onChange({ ...data, education: e }); }} placeholder="Năm" className="!text-[10px] w-10" />
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    <InlineInput value={edu.school} onChange={(v) => { const e = [...data.education]; e[i] = { ...e[i], school: v }; onChange({ ...data, education: e }); }} placeholder="Tên trường" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.skills.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px" style={{ background: `${accentColor}40` }} />
              <span className="font-bold text-[13px] uppercase tracking-wide" style={{ color: primaryColor }}>Kỹ năng</span>
              <div className="flex-1 h-px" style={{ background: `${accentColor}40` }} />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="group relative flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium border" style={{ borderColor: `${primaryColor}30`, color: primaryColor, background: `${primaryColor}08` }}>
                  <InlineInput value={skill.name} onChange={(v) => { const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s }); }} placeholder="Kỹ năng" className="!text-[11px]" />
                  <button onClick={() => { const s = data.skills.filter((_, idx) => idx !== i); onChange({ ...data, skills: s }); }}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
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
  const activeColor = template.colors[colorsIndex];
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

  const sampleData = sampleCVData[template.id] || sampleCVData["simple-1"];

  const TemplateComponent = template.layout === "sidebar" ? CVTemplateSidebar
    : template.layout === "two-column" ? CVTemplateTwoColumn
    : template.style === "impressive" ? CVTemplateImpressive
    : CVTemplateSingle;

  return (
    <div className="group flex flex-col bg-slate-50/40 border border-slate-100 hover:border-slate-200 rounded-3xl p-3.5 hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-300 relative">
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
            onChange={() => {}}
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
            Dùng mẫu
          </button>
          <button
            type="button"
            onClick={() => onPreview(colorsIndex)}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg hover:shadow-white/10 transition-all cursor-pointer transform hover:scale-105"
          >
            Xem trước
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
            className={`w-3.5 h-3.5 rounded-full border border-white shadow-sm transition-all duration-200 transform hover:scale-110 cursor-pointer ${
              colorsIndex === idx
                ? "ring-2 ring-offset-2 ring-slate-400 scale-110"
                : "opacity-70 hover:opacity-100"
            }`}
            style={{ backgroundColor: color.primaryColor }}
            title={`Màu ${idx + 1}`}
          />
        ))}
      </div>

      {/* Title & Description */}
      <h3 className="text-slate-900 font-bold text-center text-sm mt-3 line-clamp-1 group-hover:text-primary transition-colors duration-200 px-1">
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
  const activeColor = template.colors[colorsIndex];

  const customizedTemplate: SelectedCVTemplate = {
    ...template,
    primaryColor: activeColor.primaryColor,
    secondaryColor: activeColor.secondaryColor,
    accentColor: activeColor.accentColor,
    textColor: activeColor.textColor,
  };

  const sampleData = sampleCVData[template.id] || sampleCVData["simple-1"];

  const TemplateComponent = template.layout === "sidebar" ? CVTemplateSidebar
    : template.layout === "two-column" ? CVTemplateTwoColumn
    : template.style === "impressive" ? CVTemplateImpressive
    : CVTemplateSingle;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col md:flex-row text-white animate-slide-in-up">
        {/* Left Panel: Scrollable CV Preview */}
        <div className="flex-1 bg-slate-850 p-6 overflow-auto flex items-start justify-center min-h-0">
          <div className="w-[595px] h-[842px] shadow-2xl rounded-sm overflow-hidden flex-shrink-0 bg-white transform scale-75 md:scale-90 origin-top">
            <TemplateComponent
              data={sampleData}
              onChange={() => {}}
              template={customizedTemplate}
            />
          </div>
        </div>

        {/* Right Panel: Template details and actions */}
        <div className="w-full md:w-80 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800 p-6 flex flex-col justify-between shrink-0">
          <div>
            {/* Header info */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  Mẫu {template.style}
                </span>
                <h3 className="text-xl font-bold text-white mt-2">{template.name}</h3>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {template.description}
            </p>

            {/* Colors Section */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Tông màu chủ đạo
              </h4>
              <div className="flex items-center gap-3">
                {template.colors.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setColorsIndex(idx)}
                    className={`w-6 h-6 rounded-full border-2 border-slate-900 shadow-md transition-all duration-200 transform hover:scale-110 cursor-pointer ${
                      colorsIndex === idx
                        ? "ring-2 ring-emerald-500 scale-110"
                        : "opacity-60 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: color.primaryColor }}
                    title={`Màu ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Tags Section */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Đặc điểm
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-slate-800 text-slate-300 text-[10px] font-medium px-2.5 py-0.5 rounded-md uppercase tracking-wider"
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
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-11 rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-200"
            >
              Dùng mẫu này
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 h-11 rounded-xl transition-all"
            >
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============

export default function CVBuilderPage() {
  const { user } = useAuth();
  const [step, setStep] = useState<"select" | "build">("select");
  const [selectedTemplate, setSelectedTemplate] = useState<SelectedCVTemplate | null>(null);
  const [cvData, setCVData] = useState<CVData>(defaultCVData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [skillInput, setSkillInput] = useState(false);
  const [skillValue, setSkillValue] = useState("");
  const [langValue, setLangValue] = useState("");
  const [hobbyValue, setHobbyValue] = useState("");
  const [certValue, setCertValue] = useState("");

  // Preview Modal States
  const [previewTemplate, setPreviewTemplate] = useState<CVTemplate | null>(null);
  const [previewColorsIndex, setPreviewColorsIndex] = useState<number>(0);

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
    // Load sample data for this template
    const templateData = sampleCVData[template.id] || sampleCVData["simple-1"];
    setCVData({ ...templateData });
    setStep("build");
  };

  const handleSave = async () => {
    if (!selectedTemplate || !user) return;
    setSaving(true);
    setSaved(false);
    try {
      const response = await fetch("/api/cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id || "",
          "x-user-role": user.role || "user",
        },
        body: JSON.stringify({
          title: cvData.title || cvData.fullName || "CV của tôi",
          template_id: selectedTemplate.id,
          content: cvData,
          type: "created",
        }),
      });
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const addExperience = () => {
    setCVData((prev) => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now().toString(), company: "", position: "", startDate: "", endDate: "", description: "" }],
    }));
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

  // Navigation items
  const navItems = [
    { label: "Trang chủ", href: "/", icon: <Home className="h-4 w-4" /> },
    { label: "Tạo CV", href: "/cv/create", icon: <FileText className="h-4 w-4" />, active: true },
    { label: "Danh sách CV", href: "/cv", icon: <List className="h-4 w-4" /> },
    { label: "Ph\u1ecfng v\u1ea5n", href: "/interview/config", icon: <InterviewIcon className="h-4 w-4" /> },
    { label: "Blog", href: "/blog", icon: <BookOpen className="h-4 w-4" /> },
    { label: "Hồ sơ", href: "/profile", icon: <UserCircle className="h-4 w-4" /> },
  ];

  // ============ STEP 1: TEMPLATE SELECTOR ============
  if (step === "select") {
    return (
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shrink-0">
          <div className="px-6">
            <div className="flex items-center justify-between h-14">
              {/* Logo */}
              <a href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: "var(--gradient-hero)" }}>
                  <Sparkles className="h-4 w-4" />
                </div>
                <span className="font-bold text-lg">JobReady AI</span>
              </a>
              
              {/* Nav Links */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      item.active
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </a>
                ))}
              </div>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                <a href="/profile" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden sm:block">{user?.email?.split("@")[0] || "User"}</span>
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 w-full overflow-hidden flex flex-col">
          {/* Header below nav */}
          <div className="bg-white border-b border-gray-100 px-8 py-5 shrink-0">
            <h1 className="text-2xl font-bold mb-1">Chọn mẫu CV của bạn</h1>
            <p className="text-sm text-gray-500">Chọn mẫu CV phù hợp, nhấn "Dùng mẫu" để bắt đầu điền thông tin</p>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Template grid - Full width without sidebar */}
            <div className="flex-1 px-6 py-6 overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  Hiển thị <span className="font-semibold text-gray-800">{cvTemplates.length}</span> mẫu CV
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {cvTemplates.map((template) => (
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
      </div>
    );
  }

  // ============ STEP 2: WYSIWYG EDITOR ============
  const TemplateComponent = selectedTemplate?.layout === "sidebar" ? CVTemplateSidebar
    : selectedTemplate?.layout === "two-column" ? CVTemplateTwoColumn
    : selectedTemplate?.style === "impressive" ? CVTemplateImpressive
    : CVTemplateSingle;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shrink-0">
        <div className="max-w-full mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ background: "var(--gradient-hero)" }}>
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg">JobReady AI</span>
            </a>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </a>
              ))}
            </div>

            {/* User Menu & Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSave}
                disabled={saving}
                size="sm"
                className="gap-1"
                style={{ background: "var(--gradient-hero)" }}
              >
                {saving ? (
                  <span className="animate-spin">⟳</span>
                ) : saved ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saved ? "Đã lưu!" : saving ? "Đang lưu..." : "Lưu CV"}
              </Button>
              <a href="/profile" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Secondary Header with back button and template info */}
      <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-6 shrink-0">
        <button
          onClick={() => setStep("select")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Đổi template</span>
        </button>
        <div className="h-4 w-px bg-gray-300 mx-4" />
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded" style={{ background: selectedTemplate?.primaryColor }} />
          <span className="text-sm font-medium">{selectedTemplate?.name}</span>
        </div>
        <div className="ml-auto text-xs text-gray-400">
          Nhấn vào văn bản để chỉnh sửa trực tiếp
        </div>
      </div>

      {/* Toolbar: Add sections */}
      <div className="h-12 bg-white border-b border-gray-100 flex items-center gap-2 px-6 shrink-0 overflow-x-auto">
        <AddSectionButton onClick={() => setCVData((p) => ({ ...p, objective: p.objective ? "" : "Mục tiêu nghề nghiệp..." }))} icon={<Target className="h-3 w-3" />} label={cvData.objective ? "Sửa Mục tiêu" : "Thêm Mục tiêu"} />
        <AddSectionButton onClick={addExperience} icon={<Briefcase className="h-3 w-3" />} label="+ Kinh nghiệm" />
        <AddSectionButton onClick={addEducation} icon={<GraduationCap className="h-3 w-3" />} label="+ Học vấn" />
        
        <div className="flex items-center gap-1 ml-2">
          {skillInput ? (
            <div className="flex items-center gap-1">
              <Input
                autoFocus
                value={skillValue}
                onChange={(e) => setSkillValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") addSkill(); }}
                placeholder="Tên kỹ năng"
                className="h-8 w-32 text-xs"
              />
              <Button onClick={addSkill} size="sm" className="h-8 px-2"><Check className="h-3 w-3" /></Button>
              <Button onClick={() => { setSkillInput(false); setSkillValue(""); }} size="sm" variant="outline" className="h-8 px-2"><X className="h-3 w-3" /></Button>
            </div>
          ) : (
            <AddSectionButton onClick={() => setSkillInput(true)} icon={<Code className="h-3 w-3" />} label="+ Kỹ năng" />
          )}
        </div>

        <div className="flex items-center gap-1">
          {langValue !== "" || cvData.languages.length > 0 ? (
            <div className="flex items-center gap-1 flex-wrap">
              {cvData.languages.map((l, i) => (
                <Badge key={i} variant="secondary" className="gap-1 pl-1.5 pr-1 py-0.5 text-[10px] h-auto">
                  {l}
                  <button
                    onClick={() => {
                      const newLangs = [...cvData.languages];
                      newLangs.splice(i, 1);
                      setCVData((p) => ({ ...p, languages: newLangs }));
                    }}
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              ))}
              <div className="flex items-center gap-1">
                <Input value={langValue} onChange={(e) => setLangValue(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addLanguage(); }} placeholder="Ngôn ngữ" className="h-6 w-24 text-[10px]" />
                <button onClick={addLanguage} className="text-gray-400 hover:text-primary"><PlusCircle className="h-4 w-4" /></button>
              </div>
            </div>
          ) : (
            <AddSectionButton onClick={() => setLangValue(" ")} icon={<Languages className="h-3 w-3" />} label="+ Ngôn ngữ" />
          )}
        </div>
      </div>

      {/* WYSIWYG CV Editor */}
      <div className="flex-1 overflow-auto p-6 flex flex-col items-center">
        <div className="w-[595px] h-[842px] shadow-2xl rounded-sm overflow-hidden flex-shrink-0 bg-white">
          {selectedTemplate && (
            <TemplateComponent
              data={cvData}
              onChange={setCVData}
              template={selectedTemplate}
            />
          )}
        </div>
        <p className="mt-3 text-xs text-gray-400 text-center">
          Nhấn vào bất kỳ văn bản nào trên CV để chỉnh sửa trực tiếp
        </p>
      </div>
    </div>
  );
}
