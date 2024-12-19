import { getTable } from '@/lib/db'
import { sql } from '@vercel/postgres'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const profileId = request.nextUrl.searchParams.get('profileId')

  const table = getTable('interviews')
  const query = `
    SELECT * FROM ${table}
    WHERE is_demo = TRUE
    AND profile_id = $1
    ORDER BY id DESC
  `

  const result = await sql.query(query, [profileId])
  return NextResponse.json({ interviews: result.rows })
}

export async function DELETE(request: NextRequest) {
  const profileId = request.nextUrl.searchParams.get('profileId')
  const interviewId = request.nextUrl.searchParams.get('interviewId')

  const table = getTable('interview_readiness')
  const query = `
    SELECT * FROM ${table}
    WHERE profile_id = $1
    AND interview_id = $2
    ORDER BY id DESC
  `

  const result = await sql.query(query, [profileId, interviewId])
  return NextResponse.json({ profiles: result.rows })
}
