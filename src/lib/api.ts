import type { DemoUser } from "@/components/auth-provider";

export type OAuthUser = DemoUser & {
  googleId?: string;
};

type ApiErrorResponse = {
  error?: string;
};

export type CompleteProfilePayload = {
  userId: string;
  fullName: string;
  phone: string;
  jobTitle: string;
  industry: string;
  experienceLevel: string;
  location: string;
  skills: string;
  careerGoal: string;
};

async function request<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => ({}))) as ApiErrorResponse;

  if (!response.ok) {
    throw new Error(data.error ?? "Không thể kết nối máy chủ.");
  }

  return data as T;
}

export function loginWithPhone(phone: string, password: string) {
  return request<{ user: DemoUser }>("/api/auth/login", { phone, password });
}

export function registerWithPhone(phone: string) {
  return request<{ phone: string; otp: string; message: string }>(
    "/api/auth/register",
    { phone },
  );
}

export function verifyOTP(phone: string, otp: string) {
  return request<{ phone: string; verified: boolean }>("/api/auth/verify-otp", { phone, otp });
}

export function completeRegistration(phone: string, password: string) {
  return request<{ user: DemoUser }>("/api/auth/complete-registration", { phone, password });
}

export function loginWithOAuth(user: OAuthUser) {
  return request<{ user: DemoUser }>("/api/auth/oauth", user);
}

export function checkEmailExists(email: string) {
  return request<{ exists: boolean }>("/api/auth/check-email", { email });
}

export function resetPassword(email: string, password: string) {
  return request<{ ok: boolean }>("/api/auth/reset-password", { email, password });
}

export function completeProfile(payload: CompleteProfilePayload) {
  return request<{ profile: CompleteProfilePayload & { profile_completed?: boolean } }>(
    "/api/auth/complete-profile",
    payload,
  );
}
