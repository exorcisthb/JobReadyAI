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
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

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
}

const cvTemplates: CVTemplate[] = [
  { id: "simple-1", name: "Đơn giản 1", description: "Template CV đơn giản, dễ đọc", primaryColor: "#1a365d", secondaryColor: "#2c5282", accentColor: "#3182ce", textColor: "#FFFFFF", style: "simple", layout: "single" },
  { id: "simple-2", name: "Đơn giản 2", description: "Thiết kế tối giản, chuyên nghiệp", primaryColor: "#2d3748", secondaryColor: "#4a5568", accentColor: "#718096", textColor: "#FFFFFF", style: "simple", layout: "two-column" },
  { id: "simple-3", name: "Đơn giản 3", description: "CV dạng cột đơn, thanh lịch", primaryColor: "#234e52", secondaryColor: "#285e61", accentColor: "#38b2ac", textColor: "#FFFFFF", style: "simple", layout: "single" },
  { id: "impressive-1", name: "Ấn tượng 1", description: "Template ấn tượng, nổi bật", primaryColor: "#c53030", secondaryColor: "#e53e3e", accentColor: "#fc8181", textColor: "#FFFFFF", style: "impressive", layout: "impressive" },
  { id: "impressive-2", name: "Ấn tượng 2", description: "Thiết kế sáng tạo, phù hợp vị trí sáng tạo", primaryColor: "#6b46c1", secondaryColor: "#805ad5", accentColor: "#b794f4", textColor: "#FFFFFF", style: "impressive", layout: "impressive" },
  { id: "impressive-3", name: "Ấn tượng 3", description: "CV ấn tượng với gradient màu độc đáo", primaryColor: "#d69e2e", secondaryColor: "#ecc94b", accentColor: "#faf089", textColor: "#1a202c", style: "impressive", layout: "impressive" },
  { id: "professional-1", name: "Chuyên nghiệp 1", description: "CV phong cách doanh nghiệp", primaryColor: "#1a202c", secondaryColor: "#2d3748", accentColor: "#4a5568", textColor: "#FFFFFF", style: "professional", layout: "two-column" },
  { id: "professional-2", name: "Chuyên nghiệp 2", description: "Template công sở, chính thức", primaryColor: "#2c5282", secondaryColor: "#3182ce", accentColor: "#63b3ed", textColor: "#FFFFFF", style: "professional", layout: "two-column" },
  { id: "harvard-1", name: "Harvard 1", description: "Phong cách Harvard kinh điển", primaryColor: "#1a365d", secondaryColor: "#2c5282", accentColor: "#c9a227", textColor: "#FFFFFF", style: "harvard", layout: "single" },
  { id: "it-1", name: "IT 1", description: "Template dành cho ngành IT", primaryColor: "#0f4c75", secondaryColor: "#1b262c", accentColor: "#3282b8", textColor: "#FFFFFF", style: "it", layout: "sidebar" },
  { id: "designer-1", name: "Designer 1", description: "Template sáng tạo cho ngành thiết kế", primaryColor: "#ed64a6", secondaryColor: "#f687b3", accentColor: "#fbb6ce", textColor: "#FFFFFF", style: "designer", layout: "impressive" },
  { id: "designer-2", name: "Designer 2", description: "CV với phong cách nghệ thuật", primaryColor: "#667eea", secondaryColor: "#764ba2", accentColor: "#a78bfa", textColor: "#FFFFFF", style: "designer", layout: "impressive" },
];

// ============ SAMPLE CV DATA FOR EACH TEMPLATE ============

const sampleCVData: Record<string, CVData> = {
  "simple-1": {
    title: "CV Lập trình viên",
    fullName: "Nguyễn Văn An",
    jobTitle: "Lập trình viên Full-stack",
    dateOfBirth: "01/01/1998",
    address: "Quận 7, TP. Hồ Chí Minh",
    phone: "0912 345 678",
    email: "nguyenvanan@email.com",
    website: "anportfolio.com",
    objective: "Tìm kiếm vị trí Lập trình viên Full-stack tại công ty công nghệ uy tín, nơi tôi có thể áp dụng kỹ năng JavaScript, React và Node.js để phát triển các sản phẩm có giá trị.",
    experience: [
      { id: "1", company: "TechViet Solutions", position: "Lập trình viên Full-stack", startDate: "03/2023", endDate: "Hiện tại", description: "Phát triển và bảo trì ứng dụng web sử dụng React và Node.js. Tối ưu hóa hiệu suất ứng dụng, giảm 40% thời gian tải trang." },
      { id: "2", company: "StartupABC", position: "Thực tập sinh", startDate: "06/2022", endDate: "02/2023", description: "Hỗ trợ phát triển các tính năng mới cho ứng dụng mobile sử dụng React Native." },
    ],
    education: [
      { id: "1", school: "Đại học Bách Khoa TP.HCM", degree: "Cử nhân Công nghệ Thông tin", field: "Kỹ thuật Phần mềm", startDate: "2016", endDate: "2020" },
    ],
    skills: [
      { name: "JavaScript", level: 90 },
      { name: "React.js", level: 85 },
      { name: "Node.js", level: 80 },
      { name: "TypeScript", level: 75 },
      { name: "MongoDB", level: 70 },
    ],
    languages: ["Tiếng Anh - TOEIC 750", "Tiếng Nhật - N3"],
    hobbies: ["Đọc sách công nghệ", "Chơi game", "Du lịch"],
    certifications: ["AWS Certified Developer", "Google UX Design Certificate"],
  },
  "simple-2": {
    title: "CV Marketing",
    fullName: "Trần Thị Bình",
    jobTitle: "Chuyên viên Marketing",
    dateOfBirth: "15/05/1996",
    address: "Đống Đa, Hà Nội",
    phone: "0987 654 321",
    email: "trinbinh.marketing@email.com",
    website: "",
    objective: "Áp dụng kinh nghiệm 3 năm trong lĩnh vực Marketing Digital để giúp doanh nghiệp tăng trưởng doanh thu và xây dựng thương hiệu bền vững.",
    experience: [
      { id: "1", company: "Công ty TNHH ABC Việt Nam", position: "Marketing Manager", startDate: "01/2022", endDate: "Hiện tại", description: "Quản lý ngân sách marketing 500 triệu/tháng. Tăng 60% lượng khách hàng qua digital marketing. Xây dựng chiến lược content cho 5 thương hiệu lớn." },
      { id: "2", company: "Agency XYZ", position: "Marketing Specialist", startDate: "06/2019", endDate: "12/2021", description: "Thực hiện chiến dịch quảng cáo Facebook, Google Ads. Tối ưu ROAS đạt 300% cho các chiến dịch e-commerce." },
    ],
    education: [
      { id: "1", school: "Đại học Kinh tế Quốc dân", degree: "Cử nhân Marketing", field: "Quản trị Kinh doanh", startDate: "2014", endDate: "2018" },
    ],
    skills: [
      { name: "Digital Marketing", level: 95 },
      { name: "Facebook Ads", level: 90 },
      { name: "Google Ads", level: 85 },
      { name: "SEO", level: 80 },
      { name: "Content Marketing", level: 88 },
    ],
    languages: ["Tiếng Anh - TOEIC 800"],
    hobbies: ["Viết blog", "Nhiếp ảnh", "Yoga"],
    certifications: ["Google Ads Certification", "Facebook Blueprint Certificate"],
  },
  "simple-3": {
    title: "CV Kế toán",
    fullName: "Lê Minh Cường",
    jobTitle: "Kế toán tổng hợp",
    dateOfBirth: "20/08/1995",
    address: "Cầu Giấy, Hà Nội",
    phone: "0359 123 456",
    email: "lecuong.keToan@email.com",
    website: "",
    objective: "Tìm kiếm vị trí Kế toán tổng hợp tại doanh nghiệp sản xuất, nơi tôi có thể phát huy khả năng quản lý tài chính và đảm bảo tính tuân thủ pháp luật.",
    experience: [
      { id: "1", company: "Công ty Sản xuất ABC", position: "Kế toán tổng hợp", startDate: "03/2021", endDate: "Hiện tại", description: "Thực hiện hạch toán kế toán, lập BCTC hàng quý và hàng năm. Quản lý thuế, khai báo thuế đúng hạn. Tối ưu chi phí thuế, tiết kiệm 200 triệu/năm." },
    ],
    education: [
      { id: "1", school: "Học viện Tài chính", degree: "Cử nhân Kế toán", field: "Kế toán - Kiểm toán", startDate: "2013", endDate: "2017" },
    ],
    skills: [
      { name: "Excel", level: 95 },
      { name: "MISA/SAP", level: 85 },
      { name: "Phân tích tài chính", level: 80 },
      { name: "Thuế", level: 90 },
    ],
    languages: ["Tiếng Anh"],
    hobbies: ["Đọc sách tài chính", "Cắm trại"],
    certifications: ["Chứng chỉ Kế toán viên", "Chứng chỉ Thuế"],
  },
  "impressive-1": {
    title: "CV Designer",
    fullName: "Phạm Thị Dương",
    jobTitle: "Senior UI/UX Designer",
    dateOfBirth: "12/03/1997",
    address: "Thủ Đức, TP. Hồ Chí Minh",
    phone: "0901 234 567",
    email: "phamduong.design@email.com",
    website: "duongdesign.artstation.com",
    objective: "Mang đến trải nghiệm người dùng xuất sắc thông qua thiết kế UI/UX sáng tạo và có ý nghĩa. Đam mê tạo ra các sản phẩm số đẹp mắt và dễ sử dụng.",
    experience: [
      { id: "1", company: "DesignHub Vietnam", position: "Senior UI/UX Designer", startDate: "06/2022", endDate: "Hiện tại", description: "Lead design cho 3 sản phẩm chính của công ty. Tạo design system hoàn chỉnh với 200+ components. Tăng user engagement 45% sau khi redesign app mobile." },
      { id: "2", company: "Freelance", position: "UI Designer", startDate: "01/2020", endDate: "05/2022", description: "Thiết kế UI cho 20+ dự án web và mobile. Đạt 98% satisfaction rating từ khách hàng." },
    ],
    education: [
      { id: "1", school: "FPT Arena Multmedia", degree: "Cử nhân Thiết kế Đồ họa", field: "UI/UX Design", startDate: "2015", endDate: "2019" },
    ],
    skills: [
      { name: "Figma", level: 98 },
      { name: "Adobe XD", level: 90 },
      { name: "Illustrator", level: 88 },
      { name: "Photoshop", level: 85 },
      { name: "Prototyping", level: 92 },
    ],
    languages: ["Tiếng Anh - IELTS 7.0", "Tiếng Nhật"],
    hobbies: ["Vẽ minh họa", "Thiết kế bao bì", "Khám phá ẩm thực"],
    certifications: ["Google UX Design Certificate", "Apple Human Interface Guidelines"],
  },
  "impressive-2": {
    title: "CV Data Analyst",
    fullName: "Hoàng Văn Em",
    jobTitle: "Data Analyst",
    dateOfBirth: "25/11/1999",
    address: "Bình Thạnh, TP. Hồ Chí Minh",
    phone: "0932 876 543",
    email: "hoanganh.data@email.com",
    website: "hoanganh-analytics.github.io",
    objective: "Sử dụng dữ liệu để tạo ra insights có giá trị, hỗ trợ quyết định kinh doanh. Đam mê Machine Learning và AI để giải quyết các vấn đề thực tiễn.",
    experience: [
      { id: "1", company: "DataCorp Asia", position: "Data Analyst", startDate: "09/2022", endDate: "Hiện tại", description: "Phân tích dữ liệu khách hàng cho 5 triệu users. Xây dựng dashboard với Tableau và Power BI. Dự đoán churn rate với độ chính xác 87%." },
    ],
    education: [
      { id: "1", school: "Đại học Khoa học Tự nhiên", degree: "Cử nhân Khoa học Dữ liệu", field: "Data Science", startDate: "2017", endDate: "2021" },
    ],
    skills: [
      { name: "Python", level: 90 },
      { name: "SQL", level: 95 },
      { name: "Tableau", level: 88 },
      { name: "Machine Learning", level: 80 },
      { name: "Excel", level: 92 },
    ],
    languages: ["Tiếng Anh - TOEIC 850"],
    hobbies: ["Thiết kế", "Đọc sách về AI", "Chơi cờ"],
    certifications: ["Google Data Analytics Certificate", "Microsoft Certified: Data Analyst Associate"],
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
    objective: "Xây dựng văn hóa công ty tích cực và thu hút nhân tài. 8 năm kinh nghiệm trong lĩnh vực HR, từ tuyển dụng đến phát triển tổ chức.",
    experience: [
      { id: "1", company: "Tập đoàn Vingroup", position: "HR Manager", startDate: "01/2021", endDate: "Hiện tại", description: "Quản lý đội ngũ 15 người. Tuyển dụng 200+ nhân sự/năm. Xây dựng chương trình đào tạo nội bộ, tăng retention rate 25%." },
      { id: "2", company: "Công ty CMS", position: "Recruitment Lead", startDate: "03/2018", endDate: "12/2020", description: "Lead team tuyển dụng 5 người. Hoàn thành 150+ positions/năm với thời gian tuyển dụng trung bình 25 ngày." },
    ],
    education: [
      { id: "1", school: "Đại học Luật Hà Nội", degree: "Cử nhân Quản trị Nhân lực", field: "HR Management", startDate: "2008", endDate: "2012" },
    ],
    skills: [
      { name: "Tuyển dụng", level: 95 },
      { name: "Đào tạo & Phát triển", level: 90 },
      { name: "Compensation & Benefits", level: 88 },
      { name: "HRIS", level: 85 },
      { name: "Labor Law", level: 92 },
    ],
    languages: ["Tiếng Anh - TOEIC 700"],
    hobbies: ["Đọc sách tâm lý", "Yoga", "Nấu ăn"],
    certifications: ["SPHRi Certification", "SHL Psychometric Testing"],
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
      { name: "ETABS", level: 88 },
      { name: "MS Project", level: 80 },
    ],
    languages: ["Tiếng Anh - TOEIC 650"],
    hobbies: ["Leo núi", "Chụp ảnh kiến trúc", "Đọc sách kỹ thuật"],
    certifications: ["Chứng chỉ Kỹ sư Xây dựng", "OSHA Safety Certificate"],
  },
  "professional-2": {
    title: "CV Tài chính - Ngân hàng",
    fullName: "Vũ Thị Mai",
    jobTitle: "Chuyên viên Tín dụng",
    dateOfBirth: "16/09/1993",
    address: "Hai Bà Trưng, Hà Nội",
    phone: "0978 345 678",
    email: "vuthimai.bank@email.com",
    website: "",
    objective: "Phát triển sự nghiệp trong lĩnh vực tài chính - ngân hàng, đóng góp vào việc tăng trưởng tín dụng bền vững và quản lý rủi ro hiệu quả.",
    experience: [
      { id: "1", company: "Vietcombank", position: "Credit Officer", startDate: "08/2020", endDate: "Hiện tại", description: "Thẩm định và phê duyệt tín dụng doanh nghiệp với Dư nợ 500 tỷ. Tỷ lệ nợ xấu dưới 2%. Phát triển danh mục khách hàng VIP với 30 doanh nghiệp lớn." },
    ],
    education: [
      { id: "1", school: "Học viện Ngân hàng", degree: "Cử nhân Tài chính - Ngân hàng", field: "Tài chính Doanh nghiệp", startDate: "2011", endDate: "2015" },
    ],
    skills: [
      { name: "Phân tích tín dụng", level: 95 },
      { name: "Định giá doanh nghiệp", level: 88 },
      { name: "Quản lý rủi ro", level: 85 },
      { name: "Excel nâng cao", level: 90 },
    ],
    languages: ["Tiếng Anh - TOEIC 750"],
    hobbies: ["Đầu tư chứng khoán", "Đọc báo kinh tế", "Bơi lội"],
    certifications: ["CFA Level 1", "FRM Certificate"],
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
    objective: "Nghiên cứu chuyên sâu về Trí tuệ Nhân tạo và Ứng dụng, hướng đến các giải pháp AI có thể tác động tích cực đến xã hội và kinh tế.",
    experience: [
      { id: "1", company: "ĐH KHTN - ĐHQG TP.HCM", position: "Nghiên cứu sinh", startDate: "09/2021", endDate: "Hiện tại", description: "Nghiên cứu về Deep Learning cho NLP. Công bố 5 bài báo quốc tế (h-index: 3). Nhận tài trợ nghiên cứu 500 triệu đồng từ NAFOSTED." },
    ],
    education: [
      { id: "1", school: "Đại học Quốc gia Singapore (NUS)", degree: "Thạc sĩ Khoa học Máy tính", field: "Artificial Intelligence", startDate: "2019", endDate: "2021" },
      { id: "2", school: "ĐH KHTN - ĐHQG TP.HCM", degree: "Cử nhân CNTT", field: "Khoa học Máy tính", startDate: "2015", endDate: "2019" },
    ],
    skills: [
      { name: "Python", level: 95 },
      { name: "Deep Learning", level: 90 },
      { name: "TensorFlow/PyTorch", level: 88 },
      { name: "Research", level: 95 },
      { name: "LaTeX", level: 92 },
    ],
    languages: ["Tiếng Anh - IELTS 8.0", "Tiếng Pháp"],
    hobbies: ["Đọc paper", "Viết blog khoa học", "Chơi cờ vua"],
    certifications: ["ACL Anthology", "IEEE Member"],
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
    objective: "Xây dựng và tối ưu hóa hạ tầng CI/CD, đảm bảo deployment an toàn và tự động hóa quy trình phát triển phần mềm.",
    experience: [
      { id: "1", company: "VNG Corporation", position: "DevOps Engineer", startDate: "01/2022", endDate: "Hiện tại", description: "Xây dựng CI/CD pipeline với Jenkins và GitLab. Tự động hóa deployment cho 10 microservices. Giảm thời gian deploy từ 2 giờ xuống 15 phút. Quản lý Kubernetes cluster với 50+ pods." },
      { id: "2", company: "FPT Software", position: "Junior DevOps", startDate: "07/2020", endDate: "12/2021", description: "Hỗ trợ vận hành hạ tầng cloud AWS. Cấu hình monitoring với Prometheus và Grafana." },
    ],
    education: [
      { id: "1", school: "Đại học Sư phạm Kỹ thuật", degree: "Kỹ sư CNTT", field: "Hệ thống Thông tin", startDate: "2014", endDate: "2018" },
    ],
    skills: [
      { name: "Docker", level: 92 },
      { name: "Kubernetes", level: 88 },
      { name: "AWS/GCP", level: 85 },
      { name: "Jenkins/GitLab CI", level: 90 },
      { name: "Terraform", level: 82 },
      { name: "Linux", level: 90 },
    ],
    languages: ["Tiếng Anh - TOEIC 800"],
    hobbies: ["Tự động hóa nhà thông minh", "CTF competitions", "Đọc sách về cloud"],
    certifications: ["AWS Solutions Architect", "CKA (Kubernetes)", "Docker Certified Associate"],
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
      { name: "After Effects", level: 80 },
      { name: "InDesign", level: 88 },
      { name: "Brand Design", level: 90 },
    ],
    languages: ["Tiếng Anh - TOEIC 700"],
    hobbies: ["Vẽ tay", "Nhiếp ảnh", "Thiết kế bao bì"],
    certifications: ["Adobe Certified Expert", "Dieline Awards Finalist"],
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
      { name: "Premiere Pro", level: 88 },
      { name: "3D Animation", level: 80 },
    ],
    languages: ["Tiếng Anh - TOEIC 750"],
    hobbies: ["Làm phim ngắn", "Synthwave art", "Chơi nhạc"],
    certifications: ["After Effects Certified", "Motionographer Featured"],
  },
};

const defaultCVData: CVData = sampleCVData["simple-1"];

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

const CVTemplateSidebar = ({ data, onChange, template }: { data: CVData; onChange: (d: CVData) => void; template: CVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  return (
    <div className="w-full h-full bg-white flex text-xs">
      {/* Sidebar trái */}
      <div className="w-2/5 p-3 flex flex-col items-center" style={{ background: `linear-gradient(180deg, ${primaryColor}, ${secondaryColor})` }}>
        <div className="w-12 h-12 rounded-full border-2 border-white/30 bg-white/20 flex items-center justify-center mb-2">
          <User className="h-6 w-6 text-white/60" />
        </div>
        <div className="text-white font-bold text-sm mb-0.5 text-center">
          <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder="Họ tên" className="!text-white text-center !font-bold" />
        </div>
        <div className="text-white/70 text-[10px] mb-3 text-center">
          <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder="Vị trí ứng tuyển" className="!text-white/70 text-center" />
        </div>
        <div className="w-full space-y-1.5">
          <div className="text-white/80 text-[9px] flex items-center gap-1.5">
            <Phone className="h-3 w-3 shrink-0" />
            <InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder="Số điện thoại" className="!text-white/80 flex-1 !text-[9px]" />
          </div>
          <div className="text-white/80 text-[9px] flex items-center gap-1.5">
            <Mail className="h-3 w-3 shrink-0" />
            <InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder="Email" className="!text-white/80 flex-1 !text-[9px]" />
          </div>
          <div className="text-white/80 text-[9px] flex items-center gap-1.5">
            <MapPin className="h-3 w-3 shrink-0" />
            <InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder="Địa chỉ" className="!text-white/80 flex-1 !text-[9px]" />
          </div>
        </div>
        {data.skills.length > 0 && (
          <div className="w-full mt-3">
            <div className="text-white font-bold text-[10px] mb-1">Kỹ năng</div>
            <div className="flex flex-wrap gap-1">
              {data.skills.map((skill, i) => (
                <SkillTag key={i} skill={skill} onUpdate={(v) => {
                  const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s });
                }} onRemove={() => {
                  const s = data.skills.filter((_, idx) => idx !== i); onChange({ ...data, skills: s });
                }} primaryColor={primaryColor} />
              ))}
            </div>
          </div>
        )}
        {data.languages.length > 0 && (
          <div className="w-full mt-2">
            <div className="text-white font-bold text-[10px] mb-1">Ngôn ngữ</div>
            <div className="space-y-0.5">
              {data.languages.map((lang, i) => (
                <div key={i} className="text-white/80 text-[9px] flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-white/50 shrink-0" />
                  <InlineInput value={lang} onChange={(v) => {
                    const l = [...data.languages]; l[i] = v; onChange({ ...data, languages: l });
                  }} className="!text-white/80 flex-1 !text-[9px]" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Content phải */}
      <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
        {data.objective && (
          <div>
            <SectionHeader title="Mục tiêu" accentColor={accentColor} primaryColor={primaryColor} />
            <div className="pl-2 text-gray-600 text-[9px]">
              <InlineTextarea value={data.objective} onChange={(v) => onChange({ ...data, objective: v })} placeholder="Mô tả mục tiêu nghề nghiệp..." className="!text-gray-600 !text-[9px]" />
            </div>
          </div>
        )}
        {data.experience.length > 0 && (
          <div>
            <SectionHeader title="Kinh nghiệm" accentColor={accentColor} primaryColor={primaryColor} />
            {data.experience.map((exp, i) => (
              <ExperienceItem key={exp.id} exp={exp} accentColor={accentColor} primaryColor={primaryColor}
                onUpdate={(field, v) => {
                  const e = [...data.experience]; e[i] = { ...e[i], [field]: v }; onChange({ ...data, experience: e });
                }}
                onRemove={() => {
                  const e = data.experience.filter((_, idx) => idx !== i); onChange({ ...data, experience: e });
                }}
              />
            ))}
          </div>
        )}
        {data.education.length > 0 && (
          <div>
            <SectionHeader title="Học vấn" accentColor={accentColor} primaryColor={primaryColor} />
            {data.education.map((edu, i) => (
              <EducationItem key={edu.id} edu={edu} accentColor={accentColor} primaryColor={primaryColor}
                onUpdate={(field, v) => {
                  const e = [...data.education]; e[i] = { ...e[i], [field]: v }; onChange({ ...data, education: e });
                }}
                onRemove={() => {
                  const e = data.education.filter((_, idx) => idx !== i); onChange({ ...data, education: e });
                }}
              />
            ))}
          </div>
        )}
        {data.certifications.length > 0 && (
          <div>
            <SectionHeader title="Chứng chỉ" accentColor={accentColor} primaryColor={primaryColor} />
            <div className="pl-2 space-y-0.5">
              {data.certifications.map((cert, i) => (
                <div key={i} className="text-[9px] text-gray-600 flex items-center gap-1">
                  <Award className="h-2.5 w-2.5 shrink-0" style={{ color: accentColor }} />
                  <InlineInput value={cert} onChange={(v) => {
                    const c = [...data.certifications]; c[i] = v; onChange({ ...data, certifications: c });
                  }} className="!text-gray-600 flex-1 !text-[9px]" />
                </div>
              ))}
            </div>
          </div>
        )}
        {data.hobbies.length > 0 && (
          <div>
            <SectionHeader title="Sở thích" accentColor={accentColor} primaryColor={primaryColor} />
            <div className="pl-2 flex flex-wrap gap-1">
              {data.hobbies.map((hobby, i) => (
                <span key={i} className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: `${primaryColor}10`, color: primaryColor }}>
                  <InlineInput value={hobby} onChange={(v) => {
                    const h = [...data.hobbies]; h[i] = v; onChange({ ...data, hobbies: h });
                  }} className="!text-[8px]" />
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CVTemplateSingle = ({ data, onChange, template }: { data: CVData; onChange: (d: CVData) => void; template: CVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  return (
    <div className="w-full h-full bg-white flex flex-col text-xs">
      <div className="px-4 py-3 flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
        <div className="w-12 h-12 rounded-full bg-white/25 flex items-center justify-center shrink-0">
          <User className="h-6 w-6 text-white/70" />
        </div>
        <div>
          <div className="text-white font-bold text-sm">
            <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder="Họ tên đầy đủ" className="!text-white !font-bold" />
          </div>
          <div className="text-white/80 text-xs">
            <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder="Vị trí ứng tuyển" className="!text-white/80" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 py-1.5 bg-gray-50 border-b border-gray-100 text-[10px] text-gray-500">
        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /><InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder="SĐT" className="!text-gray-500 !text-[10px]" /></span>
        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /><InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder="Email" className="!text-gray-500 !text-[10px]" /></span>
        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /><InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder="Địa chỉ" className="!text-gray-500 !text-[10px]" /></span>
      </div>
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {data.objective && (
          <div>
            <SectionHeader title="Mục tiêu nghề nghiệp" accentColor={accentColor} primaryColor={primaryColor} />
            <div className="pl-3 text-[11px] text-gray-600">
              <InlineTextarea value={data.objective} onChange={(v) => onChange({ ...data, objective: v })} placeholder="Mô tả mục tiêu..." className="!text-gray-600" />
            </div>
          </div>
        )}
        {data.experience.length > 0 && (
          <div>
            <SectionHeader title="Kinh nghiệm làm việc" accentColor={accentColor} primaryColor={primaryColor} />
            {data.experience.map((exp, i) => (
              <ExperienceItem key={exp.id} exp={exp} accentColor={accentColor} primaryColor={primaryColor}
                onUpdate={(field, v) => {
                  const e = [...data.experience]; e[i] = { ...e[i], [field]: v }; onChange({ ...data, experience: e });
                }}
                onRemove={() => {
                  const e = data.experience.filter((_, idx) => idx !== i); onChange({ ...data, experience: e });
                }}
              />
            ))}
          </div>
        )}
        {data.education.length > 0 && (
          <div>
            <SectionHeader title="Học vấn" accentColor={accentColor} primaryColor={primaryColor} />
            {data.education.map((edu, i) => (
              <EducationItem key={edu.id} edu={edu} accentColor={accentColor} primaryColor={primaryColor}
                onUpdate={(field, v) => {
                  const e = [...data.education]; e[i] = { ...e[i], [field]: v }; onChange({ ...data, education: e });
                }}
                onRemove={() => {
                  const e = data.education.filter((_, idx) => idx !== i); onChange({ ...data, education: e });
                }}
              />
            ))}
          </div>
        )}
        {data.skills.length > 0 && (
          <div>
            <SectionHeader title="Kỹ năng" accentColor={accentColor} primaryColor={primaryColor} />
            <div className="pl-3 flex flex-wrap gap-1.5">
              {data.skills.map((skill, i) => (
                <SkillTag key={i} skill={skill} onUpdate={(v) => {
                  const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s });
                }} onRemove={() => {
                  const s = data.skills.filter((_, idx) => idx !== i); onChange({ ...data, skills: s });
                }} primaryColor={primaryColor} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CVTemplateTwoColumn = ({ data, onChange, template }: { data: CVData; onChange: (d: CVData) => void; template: CVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  return (
    <div className="w-full h-full bg-white flex flex-col text-xs">
      <div className="px-4 py-3.5 flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
        <div className="w-12 h-12 rounded-full bg-white/25 shrink-0" />
        <div>
          <div className="text-white font-bold text-base">
            <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder="Họ tên" className="!text-white !font-bold" />
          </div>
          <div className="text-white/80 text-sm">
            <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder="Vị trí ứng tuyển" className="!text-white/80" />
          </div>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-2/5 p-3 space-y-3" style={{ background: `${primaryColor}08` }}>
          <div>
            <div className="font-bold text-[10px] mb-1" style={{ color: primaryColor }}>Liên hệ</div>
            <div className="space-y-1 text-[10px] text-gray-600">
              <div className="flex items-center gap-1"><Phone className="h-3 w-3 shrink-0" /><InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder="SĐT" className="!text-gray-600 flex-1 !text-[10px]" /></div>
              <div className="flex items-center gap-1"><Mail className="h-3 w-3 shrink-0" /><InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder="Email" className="!text-gray-600 flex-1 !text-[10px]" /></div>
              <div className="flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0" /><InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder="Địa chỉ" className="!text-gray-600 flex-1 !text-[10px]" /></div>
            </div>
          </div>
          {data.skills.length > 0 && (
            <div>
              <div className="font-bold text-[10px] mb-1" style={{ color: primaryColor }}>Kỹ năng</div>
              <div className="flex flex-wrap gap-1">
                {data.skills.map((skill, i) => (
                  <SkillTag key={i} skill={skill} onUpdate={(v) => {
                    const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s });
                  }} onRemove={() => {
                    const s = data.skills.filter((_, idx) => idx !== i); onChange({ ...data, skills: s });
                  }} primaryColor={primaryColor} />
                ))}
              </div>
            </div>
          )}
          {data.languages.length > 0 && (
            <div>
              <div className="font-bold text-[10px] mb-1" style={{ color: primaryColor }}>Ngôn ngữ</div>
              <div className="space-y-0.5">
                {data.languages.map((lang, i) => (
                  <div key={i} className="text-[10px] text-gray-600">
                    <InlineInput value={lang} onChange={(v) => {
                      const l = [...data.languages]; l[i] = v; onChange({ ...data, languages: l });
                    }} className="!text-gray-600" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.hobbies.length > 0 && (
            <div>
              <div className="font-bold text-[10px] mb-1" style={{ color: primaryColor }}>Sở thích</div>
              <div className="flex flex-wrap gap-1">
                {data.hobbies.map((h, i) => (
                  <span key={i} className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: `${primaryColor}15`, color: primaryColor }}>
                    <InlineInput value={h} onChange={(v) => {
                      const ho = [...data.hobbies]; ho[i] = v; onChange({ ...data, hobbies: ho });
                    }} className="!text-[9px]" />
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 p-3 space-y-3 overflow-y-auto">
          {data.objective && (
            <div>
              <SectionHeader title="Mục tiêu" accentColor={accentColor} primaryColor={primaryColor} />
              <div className="pl-3 text-[11px] text-gray-600">
                <InlineTextarea value={data.objective} onChange={(v) => onChange({ ...data, objective: v })} placeholder="Mô tả mục tiêu..." className="!text-gray-600" />
              </div>
            </div>
          )}
          {data.experience.length > 0 && (
            <div>
              <SectionHeader title="Kinh nghiệm" accentColor={accentColor} primaryColor={primaryColor} />
              {data.experience.map((exp, i) => (
                <ExperienceItem key={exp.id} exp={exp} accentColor={accentColor} primaryColor={primaryColor}
                  onUpdate={(field, v) => {
                    const e = [...data.experience]; e[i] = { ...e[i], [field]: v }; onChange({ ...data, experience: e });
                  }}
                  onRemove={() => {
                    const e = data.experience.filter((_, idx) => idx !== i); onChange({ ...data, experience: e });
                  }}
                />
              ))}
            </div>
          )}
          {data.education.length > 0 && (
            <div>
              <SectionHeader title="Học vấn" accentColor={accentColor} primaryColor={primaryColor} />
              {data.education.map((edu, i) => (
                <EducationItem key={edu.id} edu={edu} accentColor={accentColor} primaryColor={primaryColor}
                  onUpdate={(field, v) => {
                    const e = [...data.education]; e[i] = { ...e[i], [field]: v }; onChange({ ...data, education: e });
                  }}
                  onRemove={() => {
                    const e = data.education.filter((_, idx) => idx !== i); onChange({ ...data, education: e });
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CVTemplateImpressive = ({ data, onChange, template }: { data: CVData; onChange: (d: CVData) => void; template: CVTemplate }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  return (
    <div className="w-full h-full bg-white flex flex-col text-xs">
      <div className="px-4 py-4 text-center" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}>
        <div className="w-14 h-14 rounded-full mx-auto mb-2 border-2 border-white/40 bg-white/20 flex items-center justify-center">
          <User className="h-7 w-7 text-white/70" />
        </div>
        <div className="text-white font-bold text-base mb-1">
          <InlineInput value={data.fullName} onChange={(v) => onChange({ ...data, fullName: v })} placeholder="Họ tên" className="!text-white !font-bold" />
        </div>
        <div className="text-white/80 text-sm mb-2">
          <InlineInput value={data.jobTitle} onChange={(v) => onChange({ ...data, jobTitle: v })} placeholder="Vị trí ứng tuyển" className="!text-white/80" />
        </div>
        <div className="flex justify-center gap-3 text-white/70 text-[10px]">
          <span className="flex items-center gap-1"><Phone className="h-3 w-3" /><InlineInput value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder="SĐT" className="!text-white/70 !text-[10px]" /></span>
          <span className="flex items-center gap-1"><Mail className="h-3 w-3" /><InlineInput value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder="Email" className="!text-white/70 !text-[10px]" /></span>
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /><InlineInput value={data.address} onChange={(v) => onChange({ ...data, address: v })} placeholder="Địa chỉ" className="!text-white/70 !text-[10px]" /></span>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {data.objective && (
          <div>
            <SectionHeader title="Mục tiêu nghề nghiệp" accentColor={accentColor} primaryColor={primaryColor} />
            <div className="pl-3 text-[11px] text-gray-600">
              <InlineTextarea value={data.objective} onChange={(v) => onChange({ ...data, objective: v })} placeholder="Mô tả mục tiêu..." className="!text-gray-600" />
            </div>
          </div>
        )}
        {data.experience.length > 0 && (
          <div>
            <SectionHeader title="Kinh nghiệm" accentColor={accentColor} primaryColor={primaryColor} />
            {data.experience.map((exp, i) => (
              <ExperienceItem key={exp.id} exp={exp} accentColor={accentColor} primaryColor={primaryColor}
                onUpdate={(field, v) => {
                  const e = [...data.experience]; e[i] = { ...e[i], [field]: v }; onChange({ ...data, experience: e });
                }}
                onRemove={() => {
                  const e = data.experience.filter((_, idx) => idx !== i); onChange({ ...data, experience: e });
                }}
              />
            ))}
          </div>
        )}
        {data.education.length > 0 && (
          <div>
            <SectionHeader title="Học vấn" accentColor={accentColor} primaryColor={primaryColor} />
            {data.education.map((edu, i) => (
              <EducationItem key={edu.id} edu={edu} accentColor={accentColor} primaryColor={primaryColor}
                onUpdate={(field, v) => {
                  const e = [...data.education]; e[i] = { ...e[i], [field]: v }; onChange({ ...data, education: e });
                }}
                onRemove={() => {
                  const e = data.education.filter((_, idx) => idx !== i); onChange({ ...data, education: e });
                }}
              />
            ))}
          </div>
        )}
        {data.skills.length > 0 && (
          <div>
            <SectionHeader title="Kỹ năng" accentColor={accentColor} primaryColor={primaryColor} />
            <div className="pl-3 flex flex-wrap gap-1.5">
              {data.skills.map((skill, i) => (
                <SkillTag key={i} skill={skill} onUpdate={(v) => {
                  const s = [...data.skills]; s[i] = { ...s[i], name: v }; onChange({ ...data, skills: s });
                }} onRemove={() => {
                  const s = data.skills.filter((_, idx) => idx !== i); onChange({ ...data, skills: s });
                }} primaryColor={primaryColor} />
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

const TemplateThumbnail = ({ template, onClick }: { template: CVTemplate; onClick: () => void }) => {
  const { primaryColor, secondaryColor, accentColor } = template;
  return (
    <div onClick={onClick} className="cursor-pointer group">
      <div className="aspect-[3/4] rounded-xl overflow-hidden border-2 border-transparent group-hover:border-primary group-hover:shadow-lg transition-all duration-200">
        <div className="w-full h-full bg-white flex flex-col">
          <div className="h-1/4" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }} />
          <div className="flex-1 p-1.5 space-y-1">
            <div className="h-1 w-3/4 rounded" style={{ background: `${primaryColor}30` }} />
            <div className="h-0.5 w-full rounded" style={{ background: `${primaryColor}15` }} />
            <div className="h-0.5 w-5/6 rounded" style={{ background: `${primaryColor}15` }} />
            <div className="h-1.5 w-full rounded flex gap-0.5">
              {template.layout === "sidebar" ? (
                <>
                  <div className="flex-1 rounded" style={{ background: accentColor }} />
                  <div className="flex-1" />
                </>
              ) : (
                <>
                  <div className="flex-1 rounded" style={{ background: accentColor }} />
                  <div className="flex-1 rounded" style={{ background: accentColor }} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 text-center">
        <div className="text-sm font-medium">{template.name}</div>
        <div className="text-xs text-muted-foreground">{template.description}</div>
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============

export default function CVBuilderPage() {
  const { user } = useAuth();
  const [step, setStep] = useState<"select" | "build">("select");
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate | null>(null);
  const [cvData, setCVData] = useState<CVData>(defaultCVData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [skillInput, setSkillInput] = useState(false);
  const [skillValue, setSkillValue] = useState("");
  const [langValue, setLangValue] = useState("");
  const [hobbyValue, setHobbyValue] = useState("");
  const [certValue, setCertValue] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "simple", label: "Đơn giản" },
    { id: "impressive", label: "Ấn tượng" },
    { id: "professional", label: "Chuyên nghiệp" },
    { id: "harvard", label: "Harvard" },
    { id: "it", label: "IT" },
    { id: "designer", label: "Designer" },
  ];

  const filteredTemplates = activeTab === "all"
    ? cvTemplates
    : cvTemplates.filter((t) => t.style === activeTab);

  const handleSelectTemplate = (template: CVTemplate) => {
    setSelectedTemplate(template);
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
    { label: "Phỏng vấn", href: "/interview/config", icon: <InterviewIcon className="h-4 w-4" /> },
    { label: "Blog", href: "/blog", icon: <BookOpen className="h-4 w-4" /> },
    { label: "Hồ sơ", href: "/profile", icon: <UserCircle className="h-4 w-4" /> },
  ];

  // ============ STEP 1: TEMPLATE SELECTOR ============
  if (step === "select") {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Top Navigation Bar */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6">
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
        <div className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Chọn mẫu CV yêu thích</h1>
            <p className="text-muted-foreground">Click vào mẫu CV bạn thích để bắt đầu tạo CV của riêng mình</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateThumbnail key={template.id} template={template} onClick={() => handleSelectTemplate(template)} />
            ))}
          </div>
        </div>
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
