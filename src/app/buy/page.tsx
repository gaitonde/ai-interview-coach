'use client'

import { ConditionalHeader } from '@/components/conditional-header'
import { Button } from '@/components/ui/button'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function BuyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    try {
      setLoading(true)

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: 'Interview Prep Session',
          price: 500, // Amount in cents
        }),
      })

      const { sessionId } = await response.json()

      // Redirect to Stripe checkout
      const stripe = await stripePromise
      const { error } = await stripe!.redirectToCheckout({ sessionId })

      if (error) {
        console.error('Stripe checkout error:', error)
      }
    } catch (err) {
      console.error('Error creating checkout session:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ConditionalHeader />
      <div className="min-h-screen bg-[#111827] flex flex-col items-center text-white px-8 py-8">
        <div className="max-w-md w-full p-6 bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center">Interview Prep</h1>
          <p className="mt-2 text-sm text-gray-400 mb-6 text-center">Buy an interview prep session</p>

          <div className="mb-8">
            <div className="text-lg mb-2">What's included:</div>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Streamlined Company Research</li>
              <li>Unlimited Jam Sessions</li>
              <li>Personalized guidance + analysis</li>
            </ul>
          </div>

          <div className="text-center mb-6">
            <div className="text-3xl font-bold">$5.00</div>
            <div className="text-gray-400">One-time payment</div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-[#10B981] text-white hover:bg-[#059669] font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Pay'}
          </button>
          <div className="my-4">
            <Button
              onClick={() => {
                  router.back()
              }}
              variant="outline"
              className="w-full text-[#F9FAFB] py-3 rounded-md font-medium transition-colors"
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
