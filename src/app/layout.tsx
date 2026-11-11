import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import AICompanion from "@/components/AICompanion";
import HomeGuideOrb from "@/components/HomeGuideOrb";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mirza Julkawsar | AI & Software Engineer Portfolio",
  description: "AI & Full-Stack Engineer specializing in LLMs, NLP, and intelligent distributed systems. Explore my projects, experience, skills, and interact with my AI clone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-zinc-900 dark:bg-zinc-950 dark:text-gray-100 min-h-screen relative`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          {/* AI Companion — floats globally over all pages */}
          <AICompanion />
          {/* Home Guide Aura Spark — guides new users from companion to quick questions */}
          <HomeGuideOrb />
        </ThemeProvider>
      </body>
    </html>
  );
}
