import { getBaseUrl } from "@/lib/utils"
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(req: Request) {
  try {
    const { profileId, productName, price } = await req.json()

    const baseUrl = getBaseUrl(req)

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/purchased?profile_id=${profileId}&session_id={CHECKOUT_SESSION_ID}`, //TODO: handle session id
      cancel_url: `${baseUrl}/buy`,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (err) {
    console.error('Error creating checkout session:', err)
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    )
  }
}