import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { UserMenu } from "@/components/user-menu"
import {
  ClerkProvider
} from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import Link from "next/link"

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


function Header() {
  return (
    <header className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold text-[#10B981]">AI Interview Coach</h1>
        </Link>
        <UserMenu />
      </div>
    </header>
  )
}

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



