import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "توقيت — قرارك في وقته الصحيح",
  description: "تطبيق موبايل يساعد تاجر الذهب على اتخاذ قرار تشغيلي يومي سريع",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "توقيت",
  },
  themeColor: "#1A1612",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full`}>
      <body className="min-h-full" style={{ fontFamily: "var(--font-cairo)" }}>
        {children}
      </body>
    </html>
  );
}
