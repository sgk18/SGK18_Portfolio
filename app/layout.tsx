import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LenisProvider from "@/components/LenisProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Surya | Software Engineer",
  description:
    "Personal portfolio of Surya — Software Engineer specializing in building scalable web applications and digital experiences.",
  keywords: ["Software Engineer", "Full Stack Developer", "React", "Next.js", "Portfolio"],
  authors: [{ name: "Surya" }],
  openGraph: {
    title: "Surya | Software Engineer",
    description: "Building scalable web applications and digital experiences.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
        <LenisProvider />
        {children}
      </body>
    </html>
  );
}
