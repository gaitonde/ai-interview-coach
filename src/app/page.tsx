'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useUser()

  useEffect(() => {
    // Don't do anything until Clerk is loaded
    if (!isLoaded) return

    if (isSignedIn) {
      router.push('/dashboard')
    } else {
      router.push('/start')
    }
  }, [isLoaded, isSignedIn, router])

  return null
}
