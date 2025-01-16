'use client'

import { HeroSection } from "@/components/hero-section"
import { Button } from '@/components/ui/button'
import { removeDemoData } from "@/utils/auth"
import { SignIn } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    removeDemoData()
    // Log all search params
    const params = Object.fromEntries(searchParams.entries())
    console.log('Clerk verification params:', params)
    console.log('Current URL:', window.location.href)
    console.log('Search Params:', searchParams.toString())
    // Log specific params
    const sessionId = searchParams.get('__clerk_created_session')
    const status = searchParams.get('__clerk_status')


    console.log('sessionId', sessionId)
    console.log('status', status)
    // More detailed debug logging
    console.log('Auth State in SignInPage:', {
      sessionId,
      status,
      allParams: Object.fromEntries(searchParams.entries()),
      pathname: window.location.pathname,
      search: window.location.search
    })

    if (sessionId && status === 'verified') {
      console.log('✅ Redirecting to dashboard...')
      router.push('/dashboard')
      // router.refresh()
    }
  }, [searchParams, router])

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12 bg-gradient-to-b from-background to-muted">
      <HeroSection />
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <SignIn signUpUrl="/sign-up" />
        <Button variant="outline" onClick={() => router.push('/')}>
          &lt; Back
        </Button>
      </div>
    </div>
  )
}