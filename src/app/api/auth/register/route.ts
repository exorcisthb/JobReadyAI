import { NextResponse } from "next/server";
import { authCookieName, createSessionValue, isValidEmail, isValidPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; email?: string; password?: string };
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (name.length < 2) {
    return NextResponse.json({ error: "Vui long nhap ho ten hop le." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Email khong hop le." }, { status: 400 });
  }

  if (!isValidPassword(password)) {
    return NextResponse.json({ error: "Password can toi thieu 8 ky tu." }, { status: 400 });
  }

  const response = NextResponse.json({ redirectTo: "/dashboard" });
  response.cookies.set(authCookieName, createSessionValue({ name, email, provider: "email" }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
