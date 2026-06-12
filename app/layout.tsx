import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import LenisProvider from "@/components/providers/LenisProvider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Surya | Software Engineer",
  description:
    "Personal portfolio of Surya — Software Engineer specializing in building scalable web applications and digital experiences.",
  keywords: ["Software Engineer", "Full Stack Developer", "React", "Next.js", "Portfolio"],
  authors: [{ name: "Surya" }],
  icons: {
    icon: [
      { url: "/logo.png", sizes: "any", type: "image/png" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/site.webmanifest",
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
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-white text-[#0A0A0A] font-sans antialiased">
        <LenisProvider />
        {children}
      </body>
    </html>
  );
}

