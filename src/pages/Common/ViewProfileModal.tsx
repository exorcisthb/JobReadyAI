import { useState, useEffect, memo, useCallback, useRef } from "react";
import { X, User, Mail, Phone, Briefcase, MapPin, Target, Edit3, Save, Loader2, Award, ChevronDown, Check } from "lucide-react";

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
  onSave: (data: ProfileData) => Promise<void>;
}

// Industry options
const industries = [
  { value: "it", label: "Công nghệ thông tin" },
  { value: "finance", label: "Tài chính - Ngân hàng" },
  { value: "marketing", label: "Kinh doanh - Marketing" },
  { value: "engineering", label: "Kỹ thuật" },
  { value: "hr", label: "Nhân sự" },
  { value: "education", label: "Giáo dục" },
  { value: "healthcare", label: "Y tế" },
  { value: "design", label: "Thiết kế" },
  { value: "other", label: "Khác" },
];

// Job titles by industry
const jobTitlesByIndustry: Record<string, { value: string; label: string }[]> = {
  it: [
    { value: "Frontend Developer", label: "Frontend Developer" },
    { value: "Backend Developer", label: "Backend Developer" },
    { value: "Fullstack Developer", label: "Fullstack Developer" },
    { value: "Mobile Developer", label: "Mobile Developer" },
    { value: "DevOps Engineer", label: "DevOps Engineer" },
    { value: "QA Engineer", label: "QA Engineer" },
    { value: "Data Engineer", label: "Data Engineer" },
    { value: "Machine Learning Engineer", label: "Machine Learning Engineer" },
    { value: "Cloud Engineer", label: "Cloud Engineer" },
    { value: "Security Engineer", label: "Security Engineer" },
    { value: "Product Manager", label: "Product Manager" },
    { value: "UI/UX Designer", label: "UI/UX Designer" },
  ],
  finance: [
    { value: "Chuyên viên tín dụng", label: "Chuyên viên tín dụng" },
    { value: "Chuyên viên tài chính", label: "Chuyên viên tài chính" },
    { value: "Kế toán", label: "Kế toán" },
    { value: "Kiểm toán", label: "Kiểm toán" },
    { value: "Chuyên viên đầu tư", label: "Chuyên viên đầu tư" },
    { value: "Quản lý rủi ro", label: "Quản lý rủi ro" },
    { value: "Chuyên viên bảo hiểm", label: "Chuyên viên bảo hiểm" },
  ],
  marketing: [
    { value: "Content Marketing", label: "Content Marketing" },
    { value: "Digital Marketing", label: "Digital Marketing" },
    { value: "SEO Specialist", label: "SEO Specialist" },
    { value: "Social Media Marketing", label: "Social Media Marketing" },
    { value: "Brand Manager", label: "Brand Manager" },
    { value: "Marketing Manager", label: "Marketing Manager" },
    { value: "Sales Executive", label: "Sales Executive" },
    { value: "Business Development", label: "Business Development" },
  ],
  engineering: [
    { value: "Kỹ sư cơ khí", label: "Kỹ sư cơ khí" },
    { value: "Kỹ sư điện", label: "Kỹ sư điện" },
    { value: "Kỹ sư xây dựng", label: "Kỹ sư xây dựng" },
    { value: "Kỹ sư công nghiệp", label: "Kỹ sư công nghiệp" },
    { value: "Kỹ sư hóa", label: "Kỹ sư hóa" },
    { value: "Project Engineer", label: "Project Engineer" },
  ],
  hr: [
    { value: "Recruiter", label: "Recruiter" },
    { value: "HR Executive", label: "HR Executive" },
    { value: "HR Manager", label: "HR Manager" },
    { value: "Training Specialist", label: "Training Specialist" },
    { value: "C&B Specialist", label: "C&B Specialist" },
    { value: "HRBP", label: "HR Business Partner" },
  ],
  education: [
    { value: "Giáo viên", label: "Giáo viên" },
    { value: "Giảng viên", label: "Giảng viên" },
    { value: "Tư vấn tuyển sinh", label: "Tư vấn tuyển sinh" },
    { value: "Content Creator (Education)", label: "Content Creator (Education)" },
    { value: "Product Manager (EdTech)", label: "Product Manager (EdTech)" },
  ],
  healthcare: [
    { value: "Bác sĩ", label: "Bác sĩ" },
    { value: "Dược sĩ", label: "Dược sĩ" },
    { value: "Điều dưỡng", label: "Điều dưỡng" },
    { value: "Marketing y tế", label: "Marketing y tế" },
    { value: "Quản lý phòng khám", label: "Quản lý phòng khám" },
  ],
  design: [
    { value: "Graphic Designer", label: "Graphic Designer" },
    { value: "UI Designer", label: "UI Designer" },
    { value: "UX Designer", label: "UX Designer" },
    { value: "Product Designer", label: "Product Designer" },
    { value: "Motion Designer", label: "Motion Designer" },
    { value: "3D Artist", label: "3D Artist" },
  ],
  other: [
    { value: "Chuyên viên", label: "Chuyên viên" },
    { value: "Quản lý", label: "Quản lý" },
    { value: "Trưởng phòng", label: "Trưởng phòng" },
    { value: "Giám đốc", label: "Giám đốc" },
    { value: "Kinh doanh", label: "Kinh doanh" },
    { value: "Vận hành", label: "Vận hành" },
  ],
};

// Experience levels
const experienceLevels = [
  { value: "intern", label: "Intern" },
  { value: "fresher", label: "Fresher" },
  { value: "1-2", label: "1-2 năm" },
  { value: "3-5", label: "3-5 năm" },
  { value: "5-10", label: "5-10 năm" },
  { value: "10+", label: "Trên 10 năm" },
  { value: "manager", label: "Quản lý / Manager" },
];

// Reusable Dropdown Component
function Dropdown({
  label,
  value,
  options,
  onChange,
  placeholder,
  disabled,
  required,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-medium text-slate-500 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-all ${
          disabled
            ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
            : "bg-white border-slate-300 text-slate-700 hover:border-indigo-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
        } ${open ? "ring-2 ring-indigo-500/30 border-indigo-400" : ""}`}
      >
        <span className={selectedOption ? "text-slate-700" : "text-slate-400"}>
          {selectedOption?.label || placeholder || "Chọn..."}
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 bg-white p-1 shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
                option.value === value
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              {option.label}
              {option.value === value && <Check className="h-4 w-4 text-indigo-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ViewProfileModal({ isOpen, onClose, user, onSave }: ViewProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state with cascade
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [careerGoal, setCareerGoal] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");

  // Job titles based on selected industry
  const jobTitles = selectedIndustry ? jobTitlesByIndustry[selectedIndustry] || [] : [];

  // Enable job title only after industry selected
  const isJobTitleEnabled = !!selectedIndustry;

  // Enable experience only after job title selected
  const isExperienceEnabled = !!selectedJobTitle;

  useEffect(() => {
    if (isOpen) {
      setFullName(user?.name || "");
      setPhone(user?.phone || "");
      setLocation(user?.location || "");
      setSkills(user?.skills || "");
      setCareerGoal(user?.careerGoal || "");

      // Map existing values to dropdown values
      const industry = industries.find(i => i.label === user?.industry);
      if (industry) {
        setSelectedIndustry(industry.value);
        const jobTitle = jobTitlesByIndustry[industry.value]?.find(j => j.label === user?.jobTitle);
        if (jobTitle) setSelectedJobTitle(jobTitle.value);
      }

      const exp = experienceLevels.find(e => e.label === user?.experienceLevel);
      if (exp) setSelectedExperience(exp.value);

      setIsEditing(false);
    }
  }, [isOpen, user]);

  const initials = (user?.name || "U").charAt(0).toUpperCase();

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      const industryLabel = industries.find((i) => i.value === selectedIndustry)?.label || user?.industry || "";
      const jobTitleLabel = jobTitles.find((j) => j.value === selectedJobTitle)?.label || user?.jobTitle || "";
      const experienceLabel = experienceLevels.find((e) => e.value === selectedExperience)?.label || user?.experienceLevel || "";

      await onSave({
        full_name: fullName,
        phone,
        job_title: jobTitleLabel,
        industry: industryLabel,
        experience_level: experienceLabel,
        location,
        skills,
        career_goal: careerGoal,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setLoading(false);
    }
  }, [fullName, phone, selectedIndustry, selectedJobTitle, selectedExperience, location, skills, careerGoal, user, onSave]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-100 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100">
              <User className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Trang cá nhân</h1>
              <p className="text-sm text-slate-500">Quản lý thông tin cá nhân của bạn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Profile Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 shrink-0">
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white border-4 border-white shadow-md">
                {initials}
              </div>
            )}
            {user?.profile_completed && (
              <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-800">{user?.name || "User"}</h2>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Mail className="h-3.5 w-3.5" />
              {user?.email}
            </p>
            {user?.jobTitle && (
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Briefcase className="h-3.5 w-3.5" />
                {user.jobTitle}
                {user?.industry && <span className="text-slate-400">/ {user.industry}</span>}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
            {/* Card 1: Thông tin cá nhân */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 p-5 border-b border-slate-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100">
                  <User className="h-5 w-5 text-indigo-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">Thông tin cá nhân</h3>
              </div>
              <div className="p-5">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Họ và tên</span>
                    <span className="text-sm font-medium text-slate-800">{user?.name || "Chưa cập nhật"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Email</span>
                    <span className="text-sm font-medium text-slate-800">{user?.email || "Chưa cập nhật"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-500">Số điện thoại</span>
                    <span className="text-sm font-medium text-slate-800">{user?.phone || "Chưa cập nhật"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Thông tin nghề nghiệp */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 p-5 border-b border-slate-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100">
                  <Briefcase className="h-5 w-5 text-indigo-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">Thông tin nghề nghiệp</h3>
              </div>
              <div className="p-5">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Vị trí mong muốn</span>
                    <span className="text-sm font-medium text-slate-800">{user?.jobTitle || "Chưa cập nhật"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Ngành nghề</span>
                    <span className="text-sm font-medium text-slate-800">{user?.industry || "Chưa cập nhật"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-500">Cấp bậc</span>
                    <span className="text-sm font-medium text-slate-800">{user?.experienceLevel || "Chưa cập nhật"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Kỹ năng */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 p-5 border-b border-slate-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100">
                  <Award className="h-5 w-5 text-indigo-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">Kỹ năng</h3>
              </div>
              <div className="p-5">
                {user?.skills ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skills.split(",").map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 rounded-full bg-indigo-50 text-sm font-medium text-indigo-700 border border-indigo-100"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Chưa cập nhật kỹ năng</p>
                )}
              </div>
            </div>

            {/* Card 4: Mục tiêu & Địa điểm */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 p-5 border-b border-slate-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100">
                  <Target className="h-5 w-5 text-indigo-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-800">Mục tiêu & Địa điểm</h3>
              </div>
              <div className="p-5">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-400 mb-1.5">Mục tiêu nghề nghiệp</p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {user?.careerGoal || "Chưa cập nhật mục tiêu nghề nghiệp"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">{user?.location || "Chưa cập nhật"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Thông tin cá nhân</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">Họ và tên *</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all bg-white"
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">Số điện thoại</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all bg-white"
                        placeholder="0xxx xxx xxx"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">Địa điểm</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all bg-white"
                        placeholder="VD: Hồ Chí Minh"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">Mục tiêu nghề nghiệp</label>
                      <textarea
                        value={careerGoal}
                        onChange={(e) => setCareerGoal(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all bg-white min-h-[100px] resize-none"
                        placeholder="Mô tả mục tiêu nghề nghiệp của bạn..."
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Thông tin nghề nghiệp</h3>
                  <div className="space-y-4">
                    {/* Industry - Full width on top */}
                    <Dropdown
                      label="Ngành nghề"
                      value={selectedIndustry}
                      options={industries}
                      onChange={(val) => {
                        setSelectedIndustry(val);
                        setSelectedJobTitle("");
                        setSelectedExperience("");
                      }}
                      placeholder="Chọn ngành nghề..."
                      required
                    />

                    {/* Job Title - Full width below Industry */}
                    <div>
                      <Dropdown
                        label="Vị trí mong muốn"
                        value={selectedJobTitle}
                        options={jobTitles}
                        onChange={(val) => {
                          setSelectedJobTitle(val);
                          setSelectedExperience("");
                        }}
                        placeholder="Chọn vị trí mong muốn..."
                        disabled={!isJobTitleEnabled}
                        required
                      />
                      {!isJobTitleEnabled && (
                        <p className="text-xs text-slate-400 mt-1">Vui lòng chọn ngành nghề trước</p>
                      )}
                    </div>

                    {/* Experience - Full width */}
                    <div>
                      <Dropdown
                        label="Kinh nghiệm"
                        value={selectedExperience}
                        options={experienceLevels}
                        onChange={setSelectedExperience}
                        placeholder="Chọn mức kinh nghiệm (không bắt buộc)"
                      />
                      {!isExperienceEnabled && (
                        <p className="text-xs text-slate-400 mt-1">Vui lòng chọn vị trí mong muốn trước</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">Kỹ năng</label>
                      <textarea
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all bg-white min-h-[100px] resize-none"
                        placeholder="VD: React, TypeScript, Node.js,..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      {!isEditing && (
        <footer className="bg-white border-t border-slate-200 px-6 py-4 shrink-0">
          <div className="max-w-4xl mx-auto flex justify-end">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all cursor-pointer"
            >
              <Edit3 className="h-4 w-4" />
              Chỉnh sửa thông tin
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}

export default memo(ViewProfileModal);
