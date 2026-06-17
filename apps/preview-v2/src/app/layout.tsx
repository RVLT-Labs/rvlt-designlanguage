import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RVLT Flow · Preview v2",
  description: "Live component showcase — @rvlt/flow-theme installed, all 27 components rendered.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-paper text-ink font-sans antialiased">{children}</body>
    </html>
  );
}
