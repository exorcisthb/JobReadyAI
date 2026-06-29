import { useEffect } from "react";
import { useAuth } from "@/components/auth-provider";

export function useHeartbeat() {
  const { user, isActiveSession } = useAuth();

  useEffect(() => {
    if (!user?.id || !isActiveSession) return;
    // ...rest stays the same
    const sendHeartbeat = () => {
      fetch("/api/online/heartbeat", {
        method: "POST",
        headers: {
          "x-user-id": user.id ?? "",
          "x-user-role": user.role || "user",
        },
      }).catch(() => {});
    };

    sendHeartbeat();
    const interval = window.setInterval(sendHeartbeat, 25_000);
    return () => window.clearInterval(interval);
  }, [user?.id, user?.role, isActiveSession]);
}
