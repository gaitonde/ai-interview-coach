'use client'

import { HeroSection } from "@/components/hero-section"
import { Button } from '@/components/ui/button'
import { removeDemoData } from "@/utils/auth"
import { SignIn } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    removeDemoData()
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
      <HeroSection />
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <SignIn signUpUrl="/sign-up" />
        <Button variant="outline" onClick={() => router.push('/start')}>
          &lt; Back
        </Button>
      </div>
    </div>
  )
}