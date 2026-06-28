import { useState, useEffect, memo } from "react";
import { Loader2 } from "lucide-react";
import ViewProfileModal from "./ViewProfileModal";
import { useAuth } from "@/components/auth-provider";

interface ViewProfilePageProps {
  userId: string;
}

function ViewProfilePage({ userId }: ViewProfilePageProps) {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const headers: Record<string, string> = {};
    if (user?.id) {
      headers["x-user-id"] = user.id;
      headers["x-user-role"] = user.role || "user";
    }

    fetch(`/api/dashboard/profile/${userId}`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile data");
        return res.json();
      })
      .then((data) => {
        setProfileData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading user profile:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [userId, user?.id, user?.role]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm font-medium">Đang tải hồ sơ...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-lg font-bold text-foreground mb-2">Không thể tải hồ sơ</h2>
          <p className="text-muted-foreground text-sm mb-6">{error || "Người dùng không tồn tại hoặc đã có lỗi xảy ra."}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <ViewProfileModal
      isOpen={true}
      onClose={() => window.history.back()}
      user={profileData}
      readonly={true}
    />
  );
}

export default memo(ViewProfilePage);
