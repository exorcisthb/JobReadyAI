import { cookies } from "next/headers";

export const authCookieName = "jobready_demo_session";

export type DemoSession = {
  name: string;
  email: string;
  provider: "email" | "google";
};

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password: string) {
  return password.length >= 8;
}

export function createSessionValue(session: DemoSession) {
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64url");
}

export function readSessionValue(value?: string) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as DemoSession;
  } catch {
    return null;
  }
}

export async function getDemoSession() {
  const cookieStore = await cookies();
  return readSessionValue(cookieStore.get(authCookieName)?.value);
}
