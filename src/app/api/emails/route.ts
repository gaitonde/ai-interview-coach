import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { getTable } from '@/lib/db'
import { NewEmailTemplate } from '@/components/components/new-email-template'
import { CreateEmailResponseSuccess, Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const json = await request.json()
  const { email } = json

  const table = getTable('emails')
  const insertEmailQuery = `
    INSERT INTO ${table} (
      email
    ) VALUES (
      $1
    ) RETURNING *`

  try {
    const result = await sql.query(insertEmailQuery, [
      email,
    ])
    const id = result.rows[0].id

    const data = await sendEmail(email)
    console.log('email sent:', data)

    return NextResponse.json({ id })
  } catch (error) {
    return NextResponse.json({ id: -1 })
  }
}

async function sendEmail(email: string): Promise<CreateEmailResponseSuccess | null> {
  try {
    const env = process.env.VERCEL_ENV || 'Unknown'
    console.log('env: ', env)
    // if (env.toLowerCase() !== 'production') return null
    const { data, error } = await resend.emails.send({
      from: 'TIP <internal@theinterviewplaybook.com>',
      to: ['dayal@greenpenailabs.com', 'shaan@greenpenailabs.com'],
      subject: `New Landing Page Email - ${email}`,
      react: NewEmailTemplate({ email, env: env || '' }),
    })

    if (error) {
      console.warn('New email entered on landing page, but unable to send internal notification email')
    }

    if (data) {
      return data
    }

  } catch (error) {
    console.warn('New email entered on landing page, but unable to send internal notification email')

  }
  return null
}
