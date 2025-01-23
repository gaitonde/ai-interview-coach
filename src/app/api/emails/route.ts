import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { getTable } from '@/lib/db'
import { NewEmailTemplate } from '@/components/components/new-email-template'
import { CreateEmailResponseSuccess, Resend } from 'resend'
import { Status } from "@/app/types/email"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const json = await request.json()
  const { email } = json

  sendEmail(email, 'attempted')

  const table = getTable('emails')

  const getEmailQuery = `
    SELECT id
    FROM ${table}
    where email = $1
    `

    const existingEmailsResult = await sql.query(getEmailQuery, [
      email,
    ])

    if (existingEmailsResult.rows.length > 0) {
      sendEmail(email, 're-entered')
      return NextResponse.json({ id: existingEmailsResult.rows[0].id })

    } else {
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

        const data = await sendEmail(email, 'succeeded')
        console.log('email sent:', data)

        return NextResponse.json({ id })
      } catch (error) {
        const data = await sendEmail(email, 'failed')
        return NextResponse.json({ id: -1 })
      }
    }
}

async function sendEmail(email: string, status: Status): Promise<CreateEmailResponseSuccess | null> {
  try {
    const env = process.env.VERCEL_ENV || 'Unknown'
    console.log('env: ', env)
    const toList = (env.toLowerCase() !== 'production') ? ['dayal@greenpenailabs.com', 'shaan@greenpenailabs.com'] : ['dayal@greenpenailabs.com']
    //  return null
    const { data, error } = await resend.emails.send({
      from: 'TIP <internal@theinterviewplaybook.com>',
      to: toList,
      subject: `New Landing Page Email - ${email}]`,
      react: NewEmailTemplate({ email, status, env: env || '' }),
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
