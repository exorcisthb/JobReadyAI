import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Loader2,
  MapPin,
  Phone,
  Sun,
  Moon,
  Palette,
  ChevronDown,
  User,
  Check,
  Search,
} from "lucide-react";
import logoJr from "@/assets/logo.png";
import { useAuth } from "@/components/auth-provider";
import { completeProfile } from "@/lib/api";
import { useTheme } from "@/components/theme-provider";

type ProfileMessage = {
  text: string;
  type: "success" | "error";
};

const messageClassName = {
  success: "message-success",
  error: "message-error",
};

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

// Job titles by industry (no fresher/intern as default)
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
    { value: "Bảo hiểm", label: "Chuyên viên bảo hiểm" },
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

// Experience levels (with fresher/intern options)
const experienceLevels = [
  { value: "intern", label: "Intern" },
  { value: "fresher", label: "Fresher" },
  { value: "1-2", label: "1-2 năm" },
  { value: "3-5", label: "3-5 năm" },
  { value: "5-10", label: "5-10 năm" },
  { value: "10+", label: "Trên 10 năm" },
  { value: "manager", label: "Quản lý / Manager" },
];

// Reusable Dropdown Component with search bar on top
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
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 50);
    } else {
      setSearch("");
    }
  }, [open]);

  const selectedOption = options.find((o) => o.value === value);

  // Lọc kết quả tìm kiếm không dấu
  const filteredOptions = options.filter((option) =>
    removeAccents(option.label).toLowerCase().includes(removeAccents(search).toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium text-foreground">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`mt-2 flex h-12 w-full items-center justify-between rounded-xl border bg-background px-3 text-sm transition-all ${
          disabled
            ? "cursor-not-allowed border-input bg-muted/50 text-muted-foreground/50"
            : "border-input focus-within:ring-2 focus-within:ring-inset focus-within:ring-ring cursor-pointer hover:border-primary/50"
        } ${open ? "ring-2 ring-primary border-primary" : ""}`}
      >
        <span className={selectedOption ? "text-foreground font-medium" : "text-muted-foreground"}>
          {selectedOption?.label || placeholder || "Chọn..."}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && !disabled && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-popover shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95">
          {/* Thanh tìm kiếm ở trên cùng của ô danh sách */}
          <div className="p-2 border-b border-border bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Tìm ${label.toLowerCase()}...`}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-background border border-input rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground transition-all"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setOpen(false);
                    setSearch("");
                  }
                  if (e.key === "Enter" && filteredOptions.length > 0) {
                    onChange(filteredOptions[0].value);
                    setOpen(false);
                    setSearch("");
                  }
                }}
              />
            </div>
          </div>

          {/* Danh sách các options */}
          <div ref={listRef} className="max-h-52 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground">
                Không tìm thấy kết quả
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  data-value={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors text-left ${
                    option.value === value
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === value && <Check className="h-4 w-4 text-primary shrink-0 ml-2" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function removeAccents(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function CompleteProfilePage() {
  const { user, login } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<ProfileMessage | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Form state with cascading
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [fullName, setFullName] = useState(user?.name || "");
  const [phone, setPhone] = useState("0");
  const [phoneError, setPhoneError] = useState("");
  const [location, setLocation] = useState("");
  const [referralCode, setReferralCode] = useState("");

  // Job titles based on selected industry
  const jobTitles = selectedIndustry ? jobTitlesByIndustry[selectedIndustry] || [] : [];

  // Enable job title selection only after industry is selected
  const isJobTitleEnabled = !!selectedIndustry;

  // Enable experience selection only after job title is selected
  const isExperienceEnabled = !!selectedJobTitle;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user?.id) {
      setMessage({
        text: "Hoàn thành profile thất bại. Phiên đăng nhập không hợp lệ.",
        type: "error",
      });
      return;
    }

    // Validate
    if (!fullName.trim()) {
      setMessage({ text: "Vui lòng nhập họ tên.", type: "error" });
      return;
    }
    // Validate phone: must be 10 digits starting with 0
    if (phone.length < 10) {
      setMessage({ text: "Vui lòng nhập đủ 10 số điện thoại.", type: "error" });
      return;
    }
    if (!/^0\d{9}$/.test(phone)) {
      setMessage({ text: "Số điện thoại phải là 10 số, bắt đầu bằng số 0. Ví dụ: 0912345678", type: "error" });
      return;
    }
    if (!selectedIndustry) {
      setMessage({ text: "Vui lòng chọn ngành nghề.", type: "error" });
      return;
    }
    if (!selectedJobTitle) {
      setMessage({ text: "Vui lòng chọn vị trí mong muốn.", type: "error" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Get labels for display
      const industryLabel = industries.find((i) => i.value === selectedIndustry)?.label || "";
      const jobTitleLabel = jobTitles.find((j) => j.value === selectedJobTitle)?.label || "";
      const experienceLabel = experienceLevels.find((e) => e.value === selectedExperience)?.label || "";

      await completeProfile({
        userId: user.id,
        fullName: fullName.trim(),
        phone: phone.trim(),
        jobTitle: jobTitleLabel,
        industry: industryLabel,
        experienceLevel: experienceLabel,
        location: location.trim(),
        skills: "",
        careerGoal: "",
        referralCode: referralCode.trim(),
      });

      login({
        ...user,
        name: fullName.trim(),
        profileCompleted: true,
        profile: {
          phone: phone.trim(),
          jobTitle: jobTitleLabel,
          industry: industryLabel,
          experienceLevel: experienceLabel,
          location: location.trim(),
          skills: "",
          careerGoal: "",
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
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2">
            <div className="logo-sparkle-wrapper">
              <div className="logo-glow-ring" />
              <span className="logo-spark logo-spark-1" />
              <span className="logo-spark logo-spark-2" />
              <span className="logo-spark logo-spark-3" />
              <span className="logo-spark logo-spark-4" />
              <span className="logo-spark logo-spark-5" />
              <span className="logo-spark logo-spark-6" />
              <img src={logoJr} alt="JobReady AI Logo" className="logo-img" />
            </div>
            <span className="text-lg font-bold tracking-tight">JobReady AI</span>
          </a>
          <div className="flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 rounded-full border border-border bg-card/85 px-3 py-1.5 text-xs font-semibold text-foreground transition-all duration-300 hover:bg-secondary cursor-pointer shadow-[var(--shadow-soft)] hover:scale-[1.02]"
                title="Chọn giao diện"
              >
                {theme === "light" && <Sun className="h-3.5 w-3.5 text-amber-500" />}
                {theme === "dark" && <Moon className="h-3.5 w-3.5 text-blue-400" />}
                {theme === "rose" && <Palette className="h-3.5 w-3.5 text-rose-500" />}
                <span className="hidden sm:inline capitalize">
                  {theme === "light" ? "Sáng" : theme === "dark" ? "Tối" : "Hồng"}
                </span>
                <ChevronDown
                  className={`h-3 w-3 text-muted-foreground transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-2xl border border-border bg-card/95 p-1.5 shadow-[var(--shadow-elegant)] backdrop-blur-xl animate-slide-in-up z-50">
                  <button
                    onClick={() => {
                      setTheme("light");
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                      theme === "light"
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Sun className="h-4 w-4 text-amber-500" />
                    Giao diện sáng
                  </button>
                  <button
                    onClick={() => {
                      setTheme("dark");
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                      theme === "dark"
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Moon className="h-4 w-4 text-blue-400" />
                    Giao diện tối
                  </button>
                  <button
                    onClick={() => {
                      setTheme("rose");
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-200 cursor-pointer ${
                      theme === "rose"
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Palette className="h-4 w-4 text-rose-500" />
                    Hồng nhung
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="flex min-h-[240px] flex-col items-center justify-center text-center lg:self-stretch">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Profile</p>
          <h1 className="mt-3 max-w-md text-4xl font-bold tracking-tight">Hoàn thành thông tin của bạn</h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Thông tin này giúp JobReady AI cá nhân hóa trải nghiệm theo ngành nghề và vị trí bạn mong muốn.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="self-start rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-elegant)] sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-foreground">
                Họ tên <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-inset focus-within:ring-ring">
                <User className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập họ tên của bạn"
                  className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground">Số điện thoại</label>
              <div className={`mt-2 flex h-12 items-center gap-0.3 rounded-xl border bg-background px-3 focus-within:ring-2 focus-within:ring-inset focus-within:ring-ring ${phoneError ? "border-red-500" : "border-input"}`}>
                <Phone className="h-4 w-4 text-muted-foreground shrink-0 mr-1" />
                <span className="text-sm text-foreground leading-none pt-px">0</span>
                <input
                  type="tel"
                  value={phone.slice(1)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    if (raw.length > 9) {
                      setPhoneError("Số điện thoại không được quá 10 số.");
                      return;
                    }
                    setPhoneError("");
                    setPhone("0" + raw);
                  }}
                  placeholder="xx xxx xxxx"
                  maxLength={9}
                  inputMode="numeric"
                  className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground leading-none"
                />
              </div>
              {phoneError && <p className="mt-1 text-xs text-red-500">{phoneError}</p>}
            </div>

            {/* Location */}
            <Dropdown
              label="Địa điểm"
              value={location}
              options={[
                { value: "An Giang", label: "An Giang" },
                { value: "Bắc Ninh", label: "Bắc Ninh" },
                { value: "Cà Mau", label: "Cà Mau" },
                { value: "Cao Bằng", label: "Cao Bằng" },
                { value: "Đắk Lắk", label: "Đắk Lắk" },
                { value: "Điện Biên", label: "Điện Biên" },
                { value: "Hà Giang", label: "Hà Giang" },
                { value: "Hà Nội", label: "Hà Nội" },
                { value: "Hải Phòng", label: "Hải Phòng" },
                { value: "Hồ Chí Minh", label: "Hồ Chí Minh" },
                { value: "Khánh Hòa", label: "Khánh Hòa" },
                { value: "Kiên Giang", label: "Kiên Giang" },
                { value: "Kon Tum", label: "Kon Tum" },
                { value: "Lai Châu", label: "Lai Châu" },
                { value: "Lạng Sơn", label: "Lạng Sơn" },
                { value: "Lào Cai", label: "Lào Cai" },
                { value: "Nam Định", label: "Nam Định" },
                { value: "Ninh Bình", label: "Ninh Bình" },
                { value: "Ninh Thuận", label: "Ninh Thuận" },
                { value: "Phú Thọ", label: "Phú Thọ" },
                { value: "Quảng Bình", label: "Quảng Bình" },
                { value: "Quảng Nam", label: "Quảng Nam" },
                { value: "Quảng Ngãi", label: "Quảng Ngãi" },
                { value: "Quảng Ninh", label: "Quảng Ninh" },
                { value: "Sóc Trăng", label: "Sóc Trăng" },
                { value: "Tây Ninh", label: "Tây Ninh" },
                { value: "Thái Bình", label: "Thái Bình" },
                { value: "Thái Nguyên", label: "Thái Nguyên" },
                { value: "Thanh Hóa", label: "Thanh Hóa" },
                { value: "Thừa Thiên Huế", label: "Thừa Thiên Huế" },
                { value: "Tiền Giang", label: "Tiền Giang" },
                { value: "Trà Vinh", label: "Trà Vinh" },
                { value: "Vĩnh Long", label: "Vĩnh Long" },
                { value: "Yên Bái", label: "Yên Bái" },
              ]}
              onChange={(val) => setLocation(val)}
              placeholder="Chọn tỉnh/thành..."
              required
            />

            {/* Step 1: Industry & Step 2: Job Title - Same row */}
            <div>
              <Dropdown
                label="Ngành nghề"
                value={selectedIndustry}
                options={industries}
                onChange={(val) => {
                  setSelectedIndustry(val);
                  setSelectedJobTitle("");
                  setSelectedExperience("");
                }}
                placeholder="Chọn ngành..."
                required
              />
            </div>

            <div>
              <Dropdown
                label="Vị trí mong muốn"
                value={selectedJobTitle}
                options={jobTitles}
                onChange={(val) => {
                  setSelectedJobTitle(val);
                  setSelectedExperience("");
                }}
                placeholder="Chọn vị trí..."
                disabled={!isJobTitleEnabled}
                required
              />
              {!isJobTitleEnabled && (
                <p className="mt-1 text-xs text-muted-foreground">Chọn ngành trước</p>
              )}
            </div>

            {/* Step 3: Experience - Only enabled after job title selected */}
            <div className="sm:col-span-2">
              <Dropdown
                label="Kinh nghiệm"
                value={selectedExperience}
                options={experienceLevels}
                onChange={setSelectedExperience}
                placeholder="Chọn mức kinh nghiệm (không bắt buộc)"
              />
              {!isExperienceEnabled && (
                <p className="mt-1 text-xs text-muted-foreground">Chọn vị trí trước</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-foreground">Mã người giới thiệu <span className="text-muted-foreground">(không bắt buộc)</span></label>
              <input
                value={referralCode}
                onChange={(event) => setReferralCode(event.target.value.replace(/[^a-z]/gi, "").slice(0, 16))}
                maxLength={16}
                autoComplete="off"
                placeholder="Nhập mã gồm 16 chữ cái"
                className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
              />
              <p className="mt-1 text-xs text-muted-foreground">Người giới thiệu sẽ được giảm 20% trong 7 ngày khi mã hợp lệ.</p>
            </div>
          </div>

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
