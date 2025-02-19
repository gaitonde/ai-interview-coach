"use client"

import { Button } from "@/components/ui/button"
import { SignedOut, SignUpButton } from "@clerk/clerk-react"

export default function Hero() {
  return (
    <section className="flex h-auto flex-col items-center justify-center px-4 py-12 text-center">
      <div className="max-w-4xl">
        <h1 className="mb-6 text-4xl font-bold text-emerald-400 sm:text-6xl">Master Your Interview Game</h1>
        <p className="mb-8 text-xl text-gray-300 sm:text-2xl">
          Use AI-powered interview prep and stand out—It&apos;s free.
        </p>
        <SignedOut>
          <SignUpButton mode="modal">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg py-6 px-8">
              Get Started for Free
            </Button>
          </SignUpButton>
        </SignedOut>
{/* For testing
        <SignedIn>
          <SignOutButton>
          </SignOutButton>
        </SignedIn>
         */}
      </div>
    </section>
  )
}

