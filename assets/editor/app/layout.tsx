import type { Metadata } from "next";
import "./globals.css";
import "./simple-studio.css";

export const metadata: Metadata = {
  title: "استوديو المحتوى | Carousel Studio",
  description: "لوحة المحتوى اليومية: أفكار وموافقات وتصميم وكاروسيل وصور وستوري وريلز.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
