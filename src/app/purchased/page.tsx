'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAtomValue } from "jotai"
import { profileIdAtom } from "@/stores/profileAtoms"
import { useRouter } from 'next/navigation'

export default function PurchasedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const stripeSessionId = searchParams.get('session_id')
  const profileId = useAtomValue(profileIdAtom)

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ profileId, sessionId: stripeSessionId }),
        })
        const data = await response.json()

        if (data.success) {
          router.push('/interview-setup')
        }
      } catch (error) {
        console.error('Error verifying payment:', error)
      }
    }

    if (stripeSessionId) {
      verifyPayment()
    }
  }, [stripeSessionId])

  return null
}
