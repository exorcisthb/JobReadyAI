import type { Metadata } from "next";
import "../styles.css";

export const metadata: Metadata = {
  title: "Jobredy AI - Tao CV chuyen nghiep bang AI trong vai phut",
  description:
    "Jobredy AI giup ban xay dung CV chuan ATS, thiet ke dep va toi uu cho tung vi tri ung tuyen chi trong vai phut.",
  authors: [{ name: "Jobredy" }],
  openGraph: {
    title: "Jobredy AI - CV thong minh, ung tuyen tu tin",
    description: "Tao CV chuan ATS bang AI, toi uu cho moi vi tri ung tuyen.",
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@Lovable",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
