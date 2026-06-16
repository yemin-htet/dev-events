import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "@/components/LightRays";
import Navbar from "@/components/Navbar";
import NavbarSkeleton from "@/components/NavbarSkeleton";
import { Toaster } from "sonner";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Event",
  description: "Public event hub for developers",
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
      <body className="min-h-full flex flex-col bg-dark-100">
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar />
        </Suspense>
        <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
          <LightRays
              raysOrigin="top-center"
              raysColor="#5dfeca"
              raysSpeed={0.5}
              lightSpread={0.9}
              rayLength={1.4}
              followMouse={true}
              mouseInfluence={0.02}
              noiseAmount={0}
              distortion={0.01}
              className="custom-rays"
              pulsating={false}
            fadeDistance={1}
            saturation={1}
           />
        </div>
        <main>
          {children}
        </main>
        <Toaster/>
      </body>
    </html>
  );
}
