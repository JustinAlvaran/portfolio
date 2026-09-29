import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
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
  metadataBase: new URL("https://justin-alvaran-portfolio.vercel.app"),
  title: "Justin A. Alvaran | Junior Software Engineer & AI/ML Practitioner",
  description:
    "Portfolio of Justin A. Alvaran, a junior software engineer with two full years of production engineering experience with Next.js, TypeScript, PostgreSQL, and deployable AI systems.",
  openGraph: {
    title: "Justin A. Alvaran | Junior Software Engineer & AI/ML Practitioner",
    description:
      "Two full years of production engineering experience with Next.js, TypeScript, PostgreSQL, and deployable AI systems. 2026 National Gold Medalist in AI.",
    url: "https://justin-alvaran-portfolio.vercel.app",
    siteName: "Justin A. Alvaran Portfolio",
    locale: "en_PH",
    type: "website",
    images: [
      {
        url: "/profile.jpg",
        width: 800,
        height: 800,
        alt: "Justin Alvaran",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Justin A. Alvaran | Junior Software Engineer & AI/ML Practitioner",
    description:
      "Two full years of production engineering experience with Next.js, TypeScript, PostgreSQL, and deployable AI systems. 2026 National Gold Medalist in AI.",
    images: ["/profile.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <Suspense fallback={null}>
          <AnalyticsProvider />
        </Suspense>
      </body>
    </html>
  );
}
