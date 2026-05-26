import { useState, useEffect, memo, useCallback } from "react";
import { ArrowLeft, User, Mail, Phone, Briefcase, Calendar, Shield, Award, CheckCircle } from "lucide-react";

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

function ProfilePage({ user, onSave, onBack }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [formData, setFormData] = useState<ProfileData>({
    full_name: user?.name || "",
    phone: user?.phone || "",
    job_title: user?.jobTitle || "",
    industry: user?.industry || "",
    experience_level: user?.experienceLevel || "",
    location: user?.location || "",
    skills: user?.skills || "",
    career_goal: user?.careerGoal || "",
  });

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

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      await onSave(formData);
      setIsEditing(false);
      setToast({ type: "success", message: "Cập nhật thông tin thành công!" });
      setTimeout(() => setToast(null), 3500);
    } catch (error) {
      setToast({ type: "error", message: "Có lỗi xảy ra. Vui lòng thử lại." });
      setTimeout(() => setToast(null), 3500);
    } finally {
      setLoading(false);
    }
  }, [formData, onSave]);

  const handleFieldChange = useCallback((field: keyof ProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <div style={{
      fontFamily: "'Be Vietnam Pro', sans-serif",
      background: "#0f1117",
      color: "#e2e8f0",
      minHeight: "100vh",
      padding: "40px 16px",
      boxSizing: "border-box"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .profile-wrap { width: 100%; max-width: 680px; margin: 0 auto; }
        .back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; color: #64748b; text-decoration: none;
          margin-bottom: 24px; transition: color .15s; cursor: pointer;
        }
        .back-link:hover { color: #4f8ef7; }
        .card { background: #181c27; border: 1px solid #2a3048; border-radius: 16px; overflow: hidden; }
        .card-top {
          padding: 36px 36px 0; display: flex; align-items: flex-end; gap: 24px;
          border-bottom: 1px solid #2a3048;
          background: linear-gradient(135deg, rgba(56,217,169,.12), rgba(79,142,247,.06));
        }
        .avatar-wrap { position: relative; flex-shrink: 0; margin-bottom: -28px; }
        .avatar-img {
          width: 100px; height: 100px; border-radius: 50%;
          border: 4px solid #181c27; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          font-size: 36px; font-weight: 700; color: #fff; text-transform: uppercase;
          background: linear-gradient(135deg, #38d9a9, #4f8ef7);
        }
        .avatar-img img { width: 100%; height: 100%; object-fit: cover; }
        .card-top-info { flex: 1; padding-bottom: 24px; }
        .profile-name { font-size: 22px; font-weight: 700; margin-bottom: 6px; color: #e2e8f0; }
        .profile-role {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 20px;
          background: rgba(56,217,169,.15); color: #38d9a9;
          border: 1px solid rgba(56,217,169,.25);
        }
        .card-body { padding: 40px 36px 36px; }
        .section-title {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1px; color: #64748b;
          margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #2a3048;
        }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; }
        .info-item { display: flex; flex-direction: column; gap: 4px; }
        .info-item.full { grid-column: 1 / -1; }
        .info-label { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: .5px; }
        .info-value {
          font-size: 14px; font-weight: 500; color: #e2e8f0;
          background: #1f2433; border: 1px solid #2a3048;
          border-radius: 8px; padding: 10px 14px;
        }
        .info-value.empty { color: #64748b; }

        /* FAB Button */
        .fab-edit {
          position: fixed; bottom: 32px; right: 32px; z-index: 100;
          display: flex; align-items: center; gap: 10px;
          background: linear-gradient(135deg, #4f8ef7, #38d9a9);
          color: #fff; border: none; border-radius: 50px;
          padding: 14px 24px; font-size: 14px; font-weight: 700;
          font-family: inherit; cursor: pointer;
          box-shadow: 0 8px 32px rgba(79,142,247,.4);
          transition: all .2s;
        }
        .fab-edit:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(79,142,247,.5); }

        /* Modal */
        .modal-overlay {
          display: none; position: fixed; inset: 0; z-index: 999;
          background: rgba(0,0,0,.65); backdrop-filter: blur(6px);
          align-items: center; justify-content: center;
        }
        .modal-overlay.show { display: flex; animation: overlayIn .2s ease; }
        @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
        .modal {
          background: #181c27; border: 1px solid #2a3048;
          border-radius: 16px; width: 620px; max-width: calc(100vw - 32px);
          max-height: 90vh; overflow-y: auto;
          box-shadow: 0 24px 64px rgba(0,0,0,.6);
          animation: modalIn .22s cubic-bezier(.34,1.56,.64,1);
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(.93) translateY(12px); }
          to   { opacity: 1; transform: none; }
        }
        .modal-hdr {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 26px 16px; border-bottom: 1px solid #2a3048;
          position: sticky; top: 0; background: #181c27; z-index: 1;
        }
        .modal-hdr-left { display: flex; align-items: center; gap: 14px; }
        .modal-ico {
          width: 46px; height: 46px; border-radius: 12px;
          background: rgba(79,142,247,.15);
          display: flex; align-items: center; justify-content: center; font-size: 20px;
        }
        .modal-title { font-size: 16px; font-weight: 800; color: #e2e8f0; }
        .modal-sub   { font-size: 12px; color: #64748b; margin-top: 2px; }
        .modal-close {
          width: 32px; height: 32px; border-radius: 8px;
          border: 1px solid #2a3048; background: #1f2433;
          color: #64748b; font-size: 16px; cursor: pointer;
          display: flex; align-items: center; justify-content: center; transition: all .18s;
        }
        .modal-close:hover { border-color: #f75c5c; color: #f75c5c; }
        .modal-body { padding: 22px 26px; }
        .modal-footer {
          padding: 14px 26px 22px; display: flex; gap: 10px;
          justify-content: flex-end; border-top: 1px solid #2a3048;
        }

        /* Form */
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px; }
        .form-item { display: flex; flex-direction: column; gap: 6px; }
        .form-item.full { grid-column: 1 / -1; }
        .form-label {
          font-size: 11px; font-weight: 700; color: #64748b;
          text-transform: uppercase; letter-spacing: .5px;
        }
        .form-input, .form-select, .form-textarea {
          background: #1f2433; border: 1px solid #2a3048;
          color: #e2e8f0; padding: 10px 14px; border-radius: 8px;
          font-size: 14px; font-family: inherit; transition: border-color .18s; width: 100%;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none; border-color: #4f8ef7;
        }
        .form-textarea { resize: vertical; min-height: 88px; }
        .form-hint { font-size: 11px; color: #64748b; margin-top: 2px; }
        .form-select option { background: #1f2433; }

        /* Buttons */
        .btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 22px; border-radius: 8px; font-size: 13px;
          font-weight: 700; cursor: pointer; font-family: inherit;
          transition: all .18s; border: none;
        }
        .btn-cancel { background: #1f2433; color: #64748b; border: 1px solid #2a3048; }
        .btn-cancel:hover { background: #181c27; color: #e2e8f0; }
        .btn-submit {
          background: linear-gradient(135deg, #4f8ef7, #38d9a9);
          color: #fff;
        }
        .btn-submit:hover { opacity: .9; transform: translateY(-1px); }
        .btn-submit:disabled { opacity: .5; cursor: not-allowed; transform: none; }

        /* Toast */
        .toast {
          position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
          z-index: 9999; padding: 13px 22px; border-radius: 10px;
          font-size: 13px; font-weight: 600; display: none; align-items: center;
          gap: 10px; box-shadow: 0 8px 32px rgba(0,0,0,.4); white-space: nowrap;
        }
        .toast.show { display: flex; animation: slideUp .25s ease; }
        .toast.success { background: rgba(56,217,169,.15); border: 1px solid rgba(56,217,169,.4); color: #38d9a9; }
        .toast.error   { background: rgba(247,92,92,.15);  border: 1px solid rgba(247,92,92,.4);  color: #f75c5c; }
        @keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(14px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

        @media (max-width: 600px) {
          .info-grid, .form-grid { grid-template-columns: 1fr; }
          .card-top { flex-direction: column; align-items: center; text-align: center; padding-top: 28px; }
          .fab-edit { bottom: 20px; right: 20px; padding: 12px 18px; font-size: 13px; }
        }
      `}</style>

      <div className="profile-wrap">
        {/* Back Link */}
        {onBack && (
          <div className="back-link" onClick={onBack}>
            ← Quay lại Dashboard
          </div>
        )}

        {/* Main Card */}
        <div className="card">
          {/* Card Top - Avatar & Name */}
          <div className="card-top">
            <div className="avatar-wrap">
              <div className="avatar-img">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} />
                ) : initials}
              </div>
            </div>
            <div className="card-top-info">
              <div className="profile-name">{user?.name || "User"}</div>
              <span className="profile-role">
                <User style={{ width: 14, height: 14 }} />
                Người dùng
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="card-body">
            {/* Thông tin cá nhân */}
            <div className="section-title">Thông tin cá nhân</div>
            <div className="info-grid">
              <div className="info-item full">
                <div className="info-label">Họ và tên</div>
                <div className={`info-value ${!user?.name ? "empty" : ""}`}>
                  {user?.name || "—"}
                </div>
              </div>
              <div className="info-item full">
                <div className="info-label">Email</div>
                <div className={`info-value ${!user?.email ? "empty" : ""}`}>
                  {user?.email || "—"}
                </div>
              </div>
              <div className="info-item full">
                <div className="info-label">Số điện thoại</div>
                <div className={`info-value ${!user?.phone ? "empty" : ""}`}>
                  {user?.phone || "—"}
                </div>
              </div>
            </div>

            {/* Thông tin nghề nghiệp */}
            <div className="section-title">Thông tin nghề nghiệp</div>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Vị trí mong muốn</div>
                <div className={`info-value ${!user?.jobTitle ? "empty" : ""}`}>
                  {user?.jobTitle || "—"}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">Ngành nghề</div>
                <div className={`info-value ${!user?.industry ? "empty" : ""}`}>
                  {user?.industry || "—"}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">Cấp bậc</div>
                <div className={`info-value ${!user?.experienceLevel ? "empty" : ""}`}>
                  {user?.experienceLevel || "—"}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">Địa điểm</div>
                <div className={`info-value ${!user?.location ? "empty" : ""}`}>
                  {user?.location || "—"}
                </div>
              </div>
              <div className="info-item full">
                <div className="info-label">Kỹ năng</div>
                <div className={`info-value ${!user?.skills ? "empty" : ""}`}>
                  {user?.skills || "—"}
                </div>
              </div>
              <div className="info-item full">
                <div className="info-label">Mục tiêu nghề nghiệp</div>
                <div className={`info-value ${!user?.careerGoal ? "empty" : ""}`}>
                  {user?.careerGoal || "—"}
                </div>
              </div>
            </div>

            {/* Thông tin tài khoản */}
            <div className="section-title">Thông tin tài khoản</div>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">Vai trò</div>
                <div className="info-value">{user?.role || "Người dùng"}</div>
              </div>
              <div className="info-item">
                <div className="info-label">Trạng thái</div>
                <div className="info-value">
                  {user?.profile_completed ? "✅ Hoàn thiện" : "🔒 Chưa hoàn thiện"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAB Edit Button */}
      <button className="fab-edit" onClick={() => setIsEditing(true)}>
        ✏️ Chỉnh sửa thông tin
      </button>

      {/* Edit Modal */}
      <div className={`modal-overlay ${isEditing ? "show" : ""}`} onClick={(e) => e.target === e.currentTarget && setIsEditing(false)}>
        <div className="modal">
          <div className="modal-hdr">
            <div className="modal-hdr-left">
              <div className="modal-ico">✏️</div>
              <div>
                <div className="modal-title">Chỉnh sửa thông tin</div>
                <div className="modal-sub">Cập nhật thông tin cá nhân của bạn</div>
              </div>
            </div>
            <button className="modal-close" onClick={() => setIsEditing(false)}>✕</button>
          </div>

          <div className="modal-body">
            <div className="form-grid">
              <div className="form-item full">
                <label className="form-label">Họ và tên *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.full_name}
                  onChange={(e) => handleFieldChange("full_name", e.target.value)}
                  placeholder="Nhập họ và tên đầy đủ"
                />
              </div>
              <div className="form-item full">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={user?.email || ""}
                  disabled
                  style={{ opacity: 0.6 }}
                />
              </div>
              <div className="form-item full">
                <label className="form-label">Số điện thoại</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  placeholder="0xxx xxx xxx"
                />
              </div>
            </div>

            <div className="section-title">Thông tin nghề nghiệp</div>
            <div className="form-grid">
              <div className="form-item">
                <label className="form-label">Vị trí mong muốn</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.job_title}
                  onChange={(e) => handleFieldChange("job_title", e.target.value)}
                  placeholder="VD: Frontend Developer"
                />
              </div>
              <div className="form-item">
                <label className="form-label">Ngành nghề</label>
                <select
                  className="form-select"
                  value={formData.industry}
                  onChange={(e) => handleFieldChange("industry", e.target.value)}
                >
                  <option value="">— Chọn ngành —</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              <div className="form-item">
                <label className="form-label">Cấp bậc</label>
                <select
                  className="form-select"
                  value={formData.experience_level}
                  onChange={(e) => handleFieldChange("experience_level", e.target.value)}
                >
                  <option value="">— Chọn cấp bậc —</option>
                  {experienceLevels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div className="form-item">
                <label className="form-label">Địa điểm</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.location}
                  onChange={(e) => handleFieldChange("location", e.target.value)}
                  placeholder="VD: Hồ Chí Minh"
                />
              </div>
              <div className="form-item full">
                <label className="form-label">Kỹ năng</label>
                <textarea
                  className="form-textarea"
                  value={formData.skills}
                  onChange={(e) => handleFieldChange("skills", e.target.value)}
                  placeholder="VD: React, TypeScript, Node.js,..."
                />
              </div>
              <div className="form-item full">
                <label className="form-label">Mục tiêu nghề nghiệp</label>
                <textarea
                  className="form-textarea"
                  value={formData.career_goal}
                  onChange={(e) => handleFieldChange("career_goal", e.target.value)}
                  placeholder="Mô tả mục tiêu nghề nghiệp của bạn..."
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-cancel" onClick={() => setIsEditing(false)}>Huỷ</button>
            <button className="btn btn-submit" onClick={handleSave} disabled={loading}>
              {loading ? "⏳ Đang lưu..." : "💾 Lưu thay đổi"}
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type === "success" ? "success" : "error"} show`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default memo(ProfilePage);
