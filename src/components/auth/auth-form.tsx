"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Chrome, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(
    searchParams.get("oauth") === "not_configured"
      ? "Google OAuth chua duoc cau hinh. Hay them GOOGLE_OAUTH_URL hoac noi NextAuth/Supabase."
      : null,
  );

  const isRegister = mode === "register";
  const title = isRegister ? "Dang ky tai khoan" : "Dang nhap";
  const subtitle = isRegister
    ? "Tao tai khoan Jobredy AI bang email va password."
    : "Dang nhap bang email va password de tiep tuc.";
  const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string; redirectTo?: string };

      if (!response.ok) {
        setMessage(result.error ?? "Co loi xay ra. Vui long thu lai.");
        return;
      }

      router.push(result.redirectTo ?? "/dashboard");
      router.refresh();
    } catch {
      setMessage("Khong the ket noi may chu. Vui long thu lai.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-elegant)] sm:p-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <a
        href="/api/auth/google"
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold transition hover:bg-secondary"
      >
        <Chrome className="h-4 w-4" />
        Dang nhap bang Google
      </a>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        hoac
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {isRegister && (
          <label className="block">
            <span className="text-sm font-medium text-foreground">Ho ten</span>
            <span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
              <User className="h-4 w-4 text-muted-foreground" />
              <input
                name="name"
                type="text"
                required
                minLength={2}
                placeholder="Nguyen Van A"
                className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </span>
          </label>
        )}

        <label className="block">
          <span className="text-sm font-medium text-foreground">Email</span>
          <span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Password</span>
          <span className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              placeholder="Toi thieu 8 ky tu"
              className="h-full flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="text-muted-foreground transition hover:text-foreground"
              aria-label={showPassword ? "An password" : "Hien password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </span>
        </label>

        {message && (
          <div className="rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          style={{ background: "var(--gradient-hero)" }}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isRegister ? "Tao tai khoan" : "Dang nhap"}
          {!isLoading ? <ArrowRight className="h-4 w-4" /> : null}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isRegister ? "Da co tai khoan?" : "Chua co tai khoan?"}{" "}
        <Link href={isRegister ? "/login" : "/register"} className="font-semibold text-primary">
          {isRegister ? "Dang nhap" : "Dang ky ngay"}
        </Link>
      </p>
    </div>
  );
}
