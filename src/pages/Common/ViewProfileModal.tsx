import { useState, useEffect, memo, useCallback } from "react";
import {
  X,
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
  onSave: (data: ProfileData) => Promise<void>;
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

function ViewProfileModal({ isOpen, onClose, user, onSave }: ViewProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    full_name: "",
    phone: "",
    job_title: "",
    industry: "",
    experience_level: "",
    location: "",
    skills: "",
    career_goal: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        full_name: user?.name || "",
        phone: user?.phone || "",
        job_title: user?.jobTitle || "",
        industry: user?.industry || "",
        experience_level: user?.experienceLevel || "",
        location: user?.location || "",
        skills: user?.skills || "",
        career_goal: user?.careerGoal || "",
      });
      setIsEditing(false);
    }
  }, [isOpen, user]);

  const initials = (user?.name || "U").charAt(0).toUpperCase();

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      await onSave(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setLoading(false);
    }
  }, [formData, onSave]);

  const handleFieldChange = useCallback((field: keyof ProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

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

      {/* Main Content - Background xám */}
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
                    <span className="text-sm font-medium text-slate-800">
                      {user?.name || "Chưa cập nhật"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Email</span>
                    <span className="text-sm font-medium text-slate-800">
                      {user?.email || "Chưa cập nhật"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-500">Số điện thoại</span>
                    <span className="text-sm font-medium text-slate-800">
                      {user?.phone || "Chưa cập nhật"}
                    </span>
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
                    <span className="text-sm font-medium text-slate-800">
                      {user?.jobTitle || "Chưa cập nhật"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Ngành nghề</span>
                    <span className="text-sm font-medium text-slate-800">
                      {user?.industry || "Chưa cập nhật"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-slate-500">Cấp bậc</span>
                    <span className="text-sm font-medium text-slate-800">
                      {user?.experienceLevel || "Chưa cập nhật"}
                    </span>
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
                    <span className="text-sm text-slate-600">
                      {user?.location || "Chưa cập nhật"}
                    </span>
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
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => handleFieldChange("full_name", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all bg-white"
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">
                        Số điện thoại
                      </label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => handleFieldChange("phone", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all bg-white"
                        placeholder="0xxx xxx xxx"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">
                        Địa điểm
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleFieldChange("location", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all bg-white"
                        placeholder="VD: Hồ Chí Minh"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">
                        Mục tiêu nghề nghiệp
                      </label>
                      <textarea
                        value={formData.career_goal}
                        onChange={(e) => handleFieldChange("career_goal", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all bg-white min-h-[100px] resize-none"
                        placeholder="Mô tả mục tiêu nghề nghiệp của bạn..."
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Thông tin nghề nghiệp
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">
                        Vị trí mong muốn
                      </label>
                      <input
                        type="text"
                        value={formData.job_title}
                        onChange={(e) => handleFieldChange("job_title", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all bg-white"
                        placeholder="VD: Frontend Developer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">
                        Ngành nghề
                      </label>
                      <select
                        value={formData.industry}
                        onChange={(e) => handleFieldChange("industry", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all bg-white cursor-pointer"
                      >
                        <option value="">Chọn ngành nghề</option>
                        {industries.map((ind) => (
                          <option key={ind} value={ind}>
                            {ind}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">
                        Cấp bậc
                      </label>
                      <select
                        value={formData.experience_level}
                        onChange={(e) => handleFieldChange("experience_level", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all bg-white cursor-pointer"
                      >
                        <option value="">Chọn cấp bậc</option>
                        {experienceLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1.5">
                        Kỹ năng
                      </label>
                      <textarea
                        value={formData.skills}
                        onChange={(e) => handleFieldChange("skills", e.target.value)}
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
