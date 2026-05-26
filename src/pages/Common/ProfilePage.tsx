import { useState, useEffect, memo, useCallback, useRef } from "react";
import { ArrowLeft, User, Mail, Phone, Briefcase, MapPin, Target, Edit3, Save, Loader2, Award, Shield, CheckCircle, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";

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

interface ProfilePageProps {
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
    role?: string;
    created_at?: string;
  };
  onSave: (data: ProfileData) => Promise<void>;
  onBack?: () => void;
  onAvatarChange?: (avatarUrl: string) => void;
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
  "Khác"
];

function ProfilePage({ user, onSave, onBack, onAvatarChange }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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
  }, [user]);

  const initials = (user?.name || "U").charAt(0).toUpperCase();

  const handleAvatarChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setToast({ type: "error", message: "Vui lòng chọn file hình ảnh." });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setToast({ type: "error", message: "Kích thước file không được vượt quá 5MB." });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setUploadingAvatar(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("avatar", file);

      const response = await fetch("/api/auth/avatar", {
        method: "POST",
        headers: {
          "x-user-id": user?.id || "",
        },
        body: formDataUpload,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setLocalAvatarUrl(data.avatar_url);
      onAvatarChange?.(data.avatar_url);
      setToast({ type: "success", message: "Cập nhật avatar thành công!" });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      setToast({ type: "error", message: "Có lỗi xảy ra. Vui lòng thử lại." });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setUploadingAvatar(false);
    }
  }, [user?.id, onAvatarChange]);

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      await onSave(formData);
      setIsEditing(false);
      setToast({ type: "success", message: "Cập nhật thông tin thành công!" });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      setToast({ type: "error", message: "Có lỗi xảy ra. Vui lòng thử lại." });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  }, [formData, onSave]);

  const handleFieldChange = useCallback((field: keyof ProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:bg-muted transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold text-foreground">Trang cá nhân</h1>
              <p className="text-sm text-muted-foreground">Quản lý thông tin cá nhân của bạn</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Header Card */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent-mint/10 p-6 border-b border-border">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                {localAvatarUrl ? (
                  <img
                    src={localAvatarUrl}
                    alt={user.name}
                    className="h-20 w-20 rounded-full object-cover border-4 border-card shadow-md"
                  />
                ) : user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="h-20 w-20 rounded-full object-cover border-4 border-card shadow-md"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent-mint flex items-center justify-center text-2xl font-bold text-primary-foreground border-4 border-card shadow-md">
                    {initials}
                  </div>
                )}
                {/* Avatar Edit Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg flex items-center justify-center transition-all cursor-pointer disabled:opacity-50"
                  title="Đổi avatar"
                >
                  {uploadingAvatar ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                {user?.profile_completed && (
                  <div className="absolute -top-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-4 border-card flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">{user?.name || "User"}</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                  <Mail className="h-3.5 w-3.5" />
                  {user?.email}
                </p>
                {user?.jobTitle && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <Briefcase className="h-3.5 w-3.5" />
                    {user.jobTitle}
                    {user?.industry && <span className="text-muted-foreground/70">/ {user.industry}</span>}
                  </p>
                )}
              </div>
              {user?.profile_completed && (
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium text-green-700">Hồ sơ hoàn thiện</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* 2x2 Grid Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Thông tin cá nhân */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-base">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                  <User className="h-5 w-5 text-primary" />
                </div>
                Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0 -mt-2">
              <div className="flex justify-between items-center py-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Họ và tên</span>
                <span className="text-sm font-medium text-foreground">{user?.name || "Chưa cập nhật"}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium text-foreground">{user?.email || "Chưa cập nhật"}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-muted-foreground">Số điện thoại</span>
                <span className="text-sm font-medium text-foreground">{user?.phone || "Chưa cập nhật"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Thông tin nghề nghiệp */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-base">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                Thông tin nghề nghiệp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0 -mt-2">
              <div className="flex justify-between items-center py-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Vị trí mong muốn</span>
                <span className="text-sm font-medium text-foreground">{user?.jobTitle || "Chưa cập nhật"}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Ngành nghề</span>
                <span className="text-sm font-medium text-foreground">{user?.industry || "Chưa cập nhật"}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-muted-foreground">Cấp bậc</span>
                <span className="text-sm font-medium text-foreground">{user?.experienceLevel || "Chưa cập nhật"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Kỹ năng */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-base">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                Kỹ năng
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user?.skills ? (
                <div className="flex flex-wrap gap-2">
                  {user.skills.split(",").map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-full bg-primary/10 text-sm font-medium text-primary border border-primary/20"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Chưa cập nhật kỹ năng</p>
              )}
            </CardContent>
          </Card>

          {/* Card 4: Mục tiêu & Địa điểm */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-base">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                Mục tiêu & Địa điểm
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Mục tiêu nghề nghiệp</p>
                <p className="text-sm text-foreground leading-relaxed">
                  {user?.careerGoal || "Chưa cập nhật mục tiêu nghề nghiệp"}
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{user?.location || "Chưa cập nhật"}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all cursor-pointer"
          >
            <Edit3 className="h-4 w-4" />
            Chỉnh sửa thông tin
          </button>
        </div>
      </main>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                  <Edit3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Chỉnh sửa thông tin</h2>
                  <p className="text-sm text-muted-foreground">Cập nhật thông tin cá nhân của bạn</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Thông tin cá nhân</h3>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Họ và tên *</label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => handleFieldChange("full_name", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Số điện thoại</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleFieldChange("phone", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="0xxx xxx xxx"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Địa điểm</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleFieldChange("location", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="VD: Hồ Chí Minh"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Mục tiêu nghề nghiệp</label>
                    <textarea
                      value={formData.career_goal}
                      onChange={(e) => handleFieldChange("career_goal", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all min-h-[100px] resize-none"
                      placeholder="Mô tả mục tiêu nghề nghiệp của bạn..."
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Thông tin nghề nghiệp</h3>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Vị trí mong muốn</label>
                    <input
                      type="text"
                      value={formData.job_title}
                      onChange={(e) => handleFieldChange("job_title", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      placeholder="VD: Frontend Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Ngành nghề</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => handleFieldChange("industry", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all cursor-pointer"
                    >
                      <option value="">Chọn ngành nghề</option>
                      {industries.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Cấp bậc</label>
                    <select
                      value={formData.experience_level}
                      onChange={(e) => handleFieldChange("experience_level", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all cursor-pointer"
                    >
                      <option value="">Chọn cấp bậc</option>
                      {experienceLevels.map((level) => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Kỹ năng</label>
                    <textarea
                      value={formData.skills}
                      onChange={(e) => handleFieldChange("skills", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all min-h-[100px] resize-none"
                      placeholder="VD: React, TypeScript, Node.js,..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30">
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all disabled:opacity-50 cursor-pointer"
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
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-xl text-sm font-medium shadow-lg animate-in slide-in-from-bottom-4 duration-300 ${
          toast.type === "success" 
            ? "bg-green-50 border border-green-200 text-green-700" 
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default memo(ProfilePage);
