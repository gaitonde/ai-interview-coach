import { getTable } from '@/lib/db'
import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json();
  const { profileId, interviewId, questionId, transcript } = body

  const answers = getTable('answers')
  const query =
    `INSERT INTO ${answers}
    (profile_id, interview_id, question_id, answer)
    VALUES ($1, $2, $3, $4)
    RETURNING id`

  const result = await sql.query(query, [profileId, interviewId, questionId, transcript])
  return NextResponse.json({ id: result.rows[0].id })
}