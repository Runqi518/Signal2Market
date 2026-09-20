import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signal to Market",
  description: "Turn customer interviews into evidence-backed GTM assets.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
