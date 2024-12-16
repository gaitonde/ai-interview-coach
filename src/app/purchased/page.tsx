'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAtomValue } from "jotai"
import { profileIdAtom } from "@/stores/profileAtoms"

export default function PurchasedPage() {
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
          // Handle successful payment verification
          // e.g., update UI, save to database, etc.
        }
      } catch (error) {
        console.error('Error verifying payment:', error)
      }
    }

    if (stripeSessionId) {
      verifyPayment()
    }
  }, [stripeSessionId])

  return (
    // Your success page UI
    <div>
      <h1>Purchased Page</h1>
      <p>Payment verified successfully</p>
    </div>
  )
}
