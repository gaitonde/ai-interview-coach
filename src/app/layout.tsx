import { Footer } from "@/components/footer"
import { AtomProvider } from '@/components/providers/atom-provider'
import { Toaster } from '@/components/ui/toaster'
import {
  ClerkProvider
} from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

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
  title: "The Interview Playbook",
  description: "Nail your next interview!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}>
          <div className="min-h-screen flex flex-col">
            <main className="max-w-7xl mx-auto w-full bg-[#1a1f2b] flex-1">
              <AtomProvider>
                {children}
              </AtomProvider>
            </main>
            <Footer />
            <Toaster />
            <Analytics />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}



