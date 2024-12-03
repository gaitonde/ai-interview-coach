import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import {
  ClerkProvider
} from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AI Interview Coach",
  description: "Nail your first interview!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}>
          <div className="min-h-screen flex flex-col">
            <div className="max-w-7xl mx-auto w-full bg-[#1a1f2b]">
              <Header />
{/*
              <div className="flex justify-between">
                <SignOutButton />
                <Link href="/sign-in">Sign In</Link>
                <Link href="/sign-up">Sign Up</Link>
              </div>
               */}
              {children}
              <Footer />
            </div>
            <Toaster />
            <Analytics />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}



