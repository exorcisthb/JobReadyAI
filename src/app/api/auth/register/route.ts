import { NextResponse } from "next/server";
import { authCookieName, createSessionValue, isValidEmail, isValidPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; email?: string; password?: string };
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (name.length < 2) {
    return NextResponse.json({ error: "Vui lòng nhập họ tên hợp lệ." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Email không hợp lệ." }, { status: 400 });
  }

  if (!isValidPassword(password)) {
    return NextResponse.json({ error: "Mật khẩu cần tối thiểu 8 ký tự." }, { status: 400 });
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
