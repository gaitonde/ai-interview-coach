import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { getTable } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const profileId = searchParams.get('profileId')
  const questionId = searchParams.get('questionId')
  const answerId = searchParams.get('answerId')

  if (!profileId || !questionId || !answerId) {
    return NextResponse.json({ error: 'Profile ID, Question ID, and Answer ID are all required' }, { status: 400 })
  }

  const table = getTable('feedback')
  const query = `
      SELECT id, feedback
      FROM ${table}
      WHERE profile_id = $1
      AND question_id = $2
      AND answer_id = $3
      ORDER BY id ASC
  `
  const result = await sql.query(query, [profileId, questionId, answerId])

  if (result.rows.length === 0) {
    return NextResponse.json({ feedback: null })
  } else {
    return NextResponse.json({ feedback: result.rows[0].feedback })
  }
}

