import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import AppDownloadNotice from "@/components/AppDownloadNotice";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Helsingbuss Airport Shuttle | hbshuttle.se",
  description:
    "Helsingbuss Airport Shuttle förbereder moderna flygbusslinjer till och från flygplatsen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className={openSans.className}><AppDownloadNotice />{children}</body>
    </html>
  );
}

