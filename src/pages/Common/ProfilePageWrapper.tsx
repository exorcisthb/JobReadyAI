import { useState, useEffect, memo } from "react";
import ProfilePage from "./ProfilePage";
import { useAuth } from "@/components/auth-provider";
import { Loader2 } from "lucide-react";

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

function ProfilePageWrapper() {
  const { user, updateUser } = useAuth();
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

  const handleSave = async (data: ProfileData) => {
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

  const handleAvatarChange = (avatarUrl: string) => {
    setProfileData((prev: any) => ({
      ...prev,
      avatar_url: avatarUrl,
    }));
    updateUser?.({ image: avatarUrl });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-foreground mb-2">Đã có lỗi xảy ra</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const mergedUser = {
    id: user?.id,
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
      onAvatarChange={handleAvatarChange}
    />
  );
}

export default memo(ProfilePageWrapper);
