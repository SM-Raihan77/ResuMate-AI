import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ResuMate AI — Autonomous Resume & Career Accelerator",
  description: "Next-generation AI career intelligence platform. Optimize resumes for ATS, simulate mock interviews, map personalized career roadmaps, and land top-tier roles.",
  keywords: ["AI Resume Builder", "ATS Resume Checker", "Career Coach AI", "Mock Interview AI", "Tech Career Roadmap"],
  authors: [{ name: "ResuMate AI Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#08090C] text-gray-100 font-sans selection:bg-[#FFE600]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}

