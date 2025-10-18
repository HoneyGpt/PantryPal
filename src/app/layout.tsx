import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PantryPal - AI Recipe Generator",
  description: "Turn whatever ingredients you have into real, safe recipes using AI. PantryPal helps you discover delicious recipes based on what's in your kitchen.",
  keywords: ["PantryPal", "recipe generator", "AI cooking", "ingredients", "recipes", "cooking", "kitchen"],
  authors: [{ name: "PantryPal Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "PantryPal - AI Recipe Generator",
    description: "Turn whatever ingredients you have into real, safe recipes using AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PantryPal - AI Recipe Generator",
    description: "Turn whatever ingredients you have into real, safe recipes using AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
