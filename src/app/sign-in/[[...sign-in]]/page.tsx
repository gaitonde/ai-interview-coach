'use client'

import { Button } from "@/components/ui/button"
import { SignIn } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Log all search params
    const params = Object.fromEntries(searchParams.entries())
    console.log('Clerk verification params:', params)

    // Log specific params
    const sessionId = searchParams.get('__clerk_created_session')
    const status = searchParams.get('__clerk_status')

    if (sessionId && status) {
      console.log('Clerk Session ID:', sessionId)
      console.log('Clerk Status:', status)
    }
  }, [searchParams])

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
        <SignIn signUpUrl="/sign-up" />
        <Button variant="outline" onClick={() => router.back()}>&lt; Back</Button>
      </div>
    </div>
  )
}