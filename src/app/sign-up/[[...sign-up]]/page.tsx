'use client'

import { Button } from "@/components/ui/button"
import { SignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12 bg-gradient-to-b from-background to-muted">
      <div className="max-w-2xl text-center space-y-6 mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Ace Your Next Interview
        </h1>
        <p className="text-xl text-muted-foreground">
          Practice with AI-powered mock interviews tailored to your specific role and company.
          Get instant feedback and improve your chances of landing your dream job.
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <SignUp
          signInUrl="/sign-in"
        forceRedirectUrl="/profile-setup"
      />
        <Button variant="outline" onClick={() => router.back()}>&lt; Back</Button>
      </div>
    </div>

  )
}