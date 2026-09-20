// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Free-Fit.com - Live Sports Streaming",
  description: "Stream live sports matches, watch highlights, and follow your favorite teams",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* No pt-16 here — each page handles its own navbar spacing */}
      <body className={`${inter.className} bg-[#0a0e27] text-white`}>
        {children}
      </body>
    </html>
  );
}