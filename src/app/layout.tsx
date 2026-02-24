import { Suspense } from "react";
import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans, Noto_Sans_KR, Space_Mono } from "next/font/google";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto",
});

const spaceMono = Space_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Photographer's Toolkit",
  description: "A powerful toolkit for photographers in Korea and Japan",
};

import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark" style={{ colorScheme: 'dark' }}>
      <body
        className={`${dmSerifDisplay.variable} ${dmSans.variable} ${notoSansKR.variable} ${spaceMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <Sidebar />
        </Suspense>
        <div className="flex flex-col min-h-screen md:pl-[260px] transition-[padding] duration-300">
          <main className="flex-1 pb-[70px] md:pb-0">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
