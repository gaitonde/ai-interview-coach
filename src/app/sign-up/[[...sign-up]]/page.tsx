'use client'

import { HeroSection } from "@/components/hero-section"
import { Button } from '@/components/ui/button'
import { removeDemoData } from "@/utils/auth"
import { SignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from "react"

export default function SignUpPage() {
  const router = useRouter()

  useEffect(() => {
    removeDemoData()
  }, [])

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12 bg-gradient-to-b from-background to-muted">
      <HeroSection />

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <SignUp
          signInUrl="/sign-in"
          forceRedirectUrl="/profile-setup"
        />
        <Button variant="outline" onClick={() => router.push('/')}>&lt; Back</Button>
      </div>
    </div>

  )
}