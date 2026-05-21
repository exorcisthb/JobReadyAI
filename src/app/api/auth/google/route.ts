import { redirect } from "next/navigation";

export function GET() {
  const googleOAuthUrl = process.env.GOOGLE_OAUTH_URL;

  if (googleOAuthUrl) {
    redirect(googleOAuthUrl);
  }

  redirect("/login?oauth=not_configured");
}
