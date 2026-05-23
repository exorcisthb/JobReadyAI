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
  };
}
