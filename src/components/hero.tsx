"use client"

import { Button } from "@/components/ui/button"
import { SignedOut, SignUpButton } from "@clerk/clerk-react"
import { track } from "@vercel/analytics/react"

export default function Hero() {
  return (
    <section className="flex h-auto flex-col items-center justify-center px-4 text-center">
      <div className="max-w-4xl">
        <h1  className="mb-2 flex items-center justify-center gap-2 text-4xl font-bold text-emerald-400">
          {/* <Sparkles className="h-8 w-8 text-emerald-400" /> */}
          Master Your Interview Game
          {/* <Sparkles className="h-8 w-8 text-emerald-400" /> */}
        </h1>
        <p className="mb-8 text-xl text-gray-300 sm:text-2xl">
          Crush your interviews with personalized AI powered prep and stand out — <span className="text-emerald-400">It's free.</span>
        </p>
        <SignedOut>
          <SignUpButton mode="modal" forceRedirectUrl="/aa">
            <Button
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg py-6 px-8"
              onClick={() => {
                track('v2.ViewSignup');
              }}
            >
              Get Started for Free
            </Button>
          </SignUpButton>
        </SignedOut>
{/* For testing */}
{/*
        <SignedIn>
          <SignOutButton>
          </SignOutButton>
        </SignedIn>
 */}
      </div>
    </section>
  )
}

