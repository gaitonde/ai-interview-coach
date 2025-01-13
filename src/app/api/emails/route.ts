import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { getTable } from '@/lib/db'

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
    return NextResponse.json({ id })
  } catch (error) {
    return NextResponse.json({ id: -1 })
  }
}
