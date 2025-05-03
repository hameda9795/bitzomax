import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/layout/TopBar";
import Sidebar from "@/components/layout/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { SubscriptionProvider } from "@/lib/subscription-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BitZoMax - Muziek Streaming Platform",
  description: "Premium muziek streaming dienst met de beste kwaliteit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SubscriptionProvider>
          <TopBar />
          <Sidebar />
          <main className="pt-16 pl-0 md:pl-64 min-h-screen">
            <div className="container mx-auto py-8 px-4">
              {children}
            </div>
          </main>
          <Toaster />
        </SubscriptionProvider>
      </body>
    </html>
  );
}
