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

  let table = getTable('interviews')
  let query = `
    UPDATE ${table}
    SET readiness = null
    WHERE profile_id = $1
    AND id = $2
  `

  await sql.query(query, [profileId, interviewId])

  table = getTable('interview_readiness')
  query = `
    DELETE FROM ${table}
    WHERE profile_id = $1
    AND interview_id = $2
  `
  await sql.query(query, [profileId, interviewId])

  table = getTable('feedback')
  query = `
    DELETE FROM ${table}
    WHERE profile_id = $1
    AND interview_id = $2
  `
  await sql.query(query, [profileId, interviewId])

  table = getTable('scores')
  const answersTable = getTable('answers')
  query = `
    DELETE FROM ${table}
    USING ${answersTable}
    WHERE ${table}.answer_id =  ${answersTable}.id
    AND ${table}.profile_id = $1
  `
  await sql.query(query, [profileId])

  query = `
    DELETE FROM ${answersTable}
    WHERE profile_id = $1
    AND interview_id = $2
  `
  await sql.query(query, [profileId, interviewId])

  return NextResponse.json({ sucess: true })
}
