import type { Metadata } from "next";
import { Inter, Playfair_Display as PlayfairDisplay } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

const playfair = PlayfairDisplay({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "Agentic Fitness | Weekly Workout Planner",
  description:
    "Plan your weekly workouts with a mobile-first experience that keeps you on track with routines, progress tracking, and recovery insights."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-slate-900`}>
        {children}
      </body>
    </html>
  );
}
