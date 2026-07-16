export function normalizeEmail(email) {
  return String(email ?? "")
    .trim()
    .toLowerCase();
}

export function validatePassword(password) {
  return typeof password === "string" && password.length >= 8;
}

export function serializeUser(row) {
  const fallbackName = row.email?.split("@")[0] ?? row.phone ?? "User";

  return {
    id: row.id,
    name: row.full_name || fallbackName,
    email: row.email ?? "",
    image: row.avatar_url ?? undefined,
    provider: row.google_id ? "google" : "phone",
    role: row.role || "user",
    isTestUser: Boolean(row.is_test_user),
    profileCompleted: Boolean(row.profile_completed),
    profile: {
      phone: row.profile_phone ?? row.phone ?? "",
      jobTitle: row.job_title ?? "",
      industry: row.industry ?? "",
      experienceLevel: row.experience_level ?? "",
      location: row.location ?? "",
      skills: row.skills ?? "",
      careerGoal: row.career_goal ?? "",
    },
    password_hash: row.password_hash ?? null,
    otp_verified: Boolean(row.otp_verified),
  };
}

// === Online user tracking (in-memory, no Redis needed) ===

const onlineUsers = new Map();
const ONLINE_TTL_MS = 35_000; // 35 seconds — user heartbeats every 25s, gives 10s buffer

export function trackActivity(userId) {
  if (!userId) return;
  onlineUsers.set(String(userId), Date.now());
}

export function getOnlineCount() {
  const now = Date.now();
  let count = 0;
  for (const [, ts] of onlineUsers) {
    if (now - ts < ONLINE_TTL_MS) count++;
  }
  return count;
}

export function getOnlineUserIds() {
  const now = Date.now();
  const ids = [];
  for (const [id, ts] of onlineUsers) {
    if (now - ts < ONLINE_TTL_MS) ids.push(id);
  }
  return ids;
}

// Cleanup stale entries every 15s
setInterval(() => {
  const now = Date.now();
  for (const [id, ts] of onlineUsers) {
    if (now - ts >= ONLINE_TTL_MS) onlineUsers.delete(id);
  }
}, 15_000);


