import type { Metadata } from "next";
import "../styles.css";

export const metadata: Metadata = {
  title: "Jobredy AI - Tạo CV chuyên nghiệp bằng AI trong vài phút",
  description:
    "Jobredy AI giúp bạn xây dựng CV chuẩn ATS, thiết kế đẹp và tối ưu cho từng vị trí ứng tuyển chỉ trong vài phút.",
  authors: [{ name: "Jobredy" }],
  openGraph: {
    title: "Jobredy AI - CV thông minh, ứng tuyển tự tin",
    description: "Tạo CV chuẩn ATS bằng AI, tối ưu cho mọi vị trí ứng tuyển.",
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
