import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI সাপোর্ট এজেন্ট | প্রফেশনাল ISP সহায়তা",
  description:
    "ভদ্র, ধৈর্যশীল ও পেশাদার ISP AI সাপোর্ট এজেন্ট – সহজ বাংলায় আপনার ইন্টারনেট সমস্যার সমাধান।"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
