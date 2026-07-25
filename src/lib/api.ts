import type { DemoUser } from "@/components/auth-provider";

export type OAuthUser = DemoUser & {
  googleId?: string;
  facebookId?: string;
  accessToken?: string;
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

export function loginWithEmail(email: string, password: string) {
  return request<{ user: DemoUser }>("/api/auth/login", { email, password });
}

export function registerWithEmail(email: string) {
  return request<{ email: string; otp: string; message: string }>("/api/auth/register", { email });
}

export function verifyOTP(email: string, otp: string) {
  return request<{ email: string; verified: boolean }>("/api/auth/verify-otp", { email, otp });
}

export function completeRegistration(email: string, password: string) {
  return request<{ user: DemoUser }>("/api/auth/complete-registration", { email, password });
}

export function loginWithOAuth(user: OAuthUser) {
  return request<{ user: DemoUser }>("/api/auth/oauth", user);
}

export function loginWithFacebook(payload: OAuthUser | { accessToken: string }) {
  return request<{ user: DemoUser }>("/api/auth/facebook", payload);
}

export function checkEmailExists(email: string) {
  return request<{ exists: boolean }>("/api/auth/check-email", { email });
}

export function requestPasswordResetOTP(email: string) {
  return request<{ email: string; message: string }>("/api/auth/request-password-reset", { email });
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
