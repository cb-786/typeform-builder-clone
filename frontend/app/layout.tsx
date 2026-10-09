import type { Metadata } from "next";
import { Newsreader, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Typeform Clone — Modern Conversational Forms & AI Automation",
  description: "Build forms that feel like a conversation. Next.js & FastAPI Typeform clone with drag-and-drop builder and conversational respondent flow.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable} dark`}>
      <body className="min-h-screen bg-[#0f0f12] text-white antialiased flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
