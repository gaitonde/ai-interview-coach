// src/app/api/verify-payment/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sql } from '@vercel/postgres'
import { getTable } from "@/lib/db"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(req: Request) {
  try {
    const { sessionId, profileId } = await req.json()
    console.log('XX sessionId', sessionId)
    console.log('XX profileId', profileId)

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    console.log('session', session)
    console.log('payment_status', session.payment_status)
    if (session.payment_status === 'paid') {
      console.log('todo: payment_status is paid')

      // Upsert billing record using SQL
      const table = getTable('payments')
      const query = `
        INSERT INTO ${table} (profile_id, stripe_session_id)
        VALUES ($1, $2)
        ON CONFLICT (profile_id)
        DO UPDATE SET
          stripe_session_id = $2
      `
      const result = await sql.query(query, [profileId, sessionId])
      console.log('result', result)

      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, message: 'Payment not completed' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { success: false, message: 'Error verifying payment' },
      { status: 500 }
    )
  }
}