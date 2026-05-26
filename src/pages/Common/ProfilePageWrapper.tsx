import { useState, useEffect, memo } from "react";
import ProfilePage from "./ProfilePage";
import { useAuth } from "@/components/auth-provider";

function ProfilePageWrapper() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch("/api/dashboard/me", {
      headers: {
        "x-user-id": user.id,
        "x-user-role": user.role || "user",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        setProfileData({
          ...data.user,
          ...data.profile,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading profile:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [user?.id, user?.role]);

  const handleSave = async (data: any) => {
    if (!user?.id) return;

    const response = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user.id,
      },
      body: JSON.stringify({
        full_name: data.full_name,
        phone: data.phone,
        job_title: data.job_title,
        industry: data.industry,
        experience_level: data.experience_level,
        location: data.location,
        skills: data.skills,
        career_goal: data.career_goal,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save");
    }

    const refresh = await fetch("/api/dashboard/me", {
      headers: {
        "x-user-id": user.id,
        "x-user-role": user.role || "user",
      },
    });
    const refreshData = await refresh.json();
    setProfileData({
      ...refreshData.user,
      ...refreshData.profile,
    });
  };

  if (loading) {
    return (
      <div style={{
        background: "#0f1117",
        color: "#e2e8f0",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Be Vietnam Pro', sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 40, height: 40,
            border: "3px solid #2a3048",
            borderTopColor: "#4f8ef7",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 16px",
          }} />
          <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
          Đang tải...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: "#0f1117",
        color: "#e2e8f0",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Be Vietnam Pro', sans-serif",
        padding: "40px",
      }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ marginBottom: 8 }}>Đã có lỗi xảy ra</h2>
          <p style={{ color: "#64748b", marginBottom: 24 }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "linear-gradient(135deg, #4f8ef7, #38d9a9)",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const mergedUser = {
    name: profileData?.name || user?.name,
    email: profileData?.email || user?.email,
    phone: profileData?.phone,
    jobTitle: profileData?.job_title,
    industry: profileData?.industry,
    experienceLevel: profileData?.experience_level,
    location: profileData?.location,
    skills: profileData?.skills,
    careerGoal: profileData?.career_goal,
    avatar_url: profileData?.avatar_url || user?.image,
    profile_completed: profileData?.profile_completed,
    role: user?.role,
  };

  return (
    <ProfilePage
      user={mergedUser}
      onSave={handleSave}
      onBack={() => window.location.href = "/dashboard"}
    />
  );
}

export default memo(ProfilePageWrapper);
