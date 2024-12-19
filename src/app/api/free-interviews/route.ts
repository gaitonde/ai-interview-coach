import { getTable } from '@/lib/db'
import { sql } from '@vercel/postgres'
import { NextResponse } from "next/server"

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url)
//   const profileId = searchParams.get('profileId')
//   const interviewId = searchParams.get('interviewId')

//   if (!profileId) {
//     return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 })
//   }

//   if (searchParams.has('interviewId') && !interviewId) {
//     return NextResponse.json({ error: 'Missing Interview ID' }, { status: 400 })
//   }

//   if (interviewId) {
//     const query = `
//     SELECT id, profile_id, company_name, company_url, role_name, jd_url, interviewer_name, interviewer_role, interview_date, readiness
//     FROM ${INTERVIEWS}
//     WHERE profile_id = $1
//     AND id = $2
//     ORDER BY id DESC
//   `
//     const interviews = await sql.query(query, [profileId, interviewId])
//     return NextResponse.json({ content: interviews.rows[0] })
//   } else {
//     const query = `
//     SELECT id, profile_id, company_name, company_url, role_name, jd_url, interviewer_name, interviewer_role, interview_date, readiness
//     FROM ${INTERVIEWS}
//     WHERE profile_id = $1
//     ORDER BY id DESC
//   `
//     const interviews = await sql.query(query, [profileId])

//     if (interviews.rows.length < 1) {
//       return NextResponse.json({ content: [] })
//     } else {
//       return NextResponse.json({ content: interviews.rows })
//     }
//   }
// }

export async function POST(request: Request) {
  const body = await request.json()
  const {
    email,
    numFreeInterviews,
  } = body

  console.log('in free-interviews', email, numFreeInterviews)

  const profilesTable = getTable('profiles')
  const query = `
    UPDATE ${profilesTable}
    SET num_free_interviews = $1
    WHERE email = $2
  `

  const updated = await sql.query(query, [numFreeInterviews, email])
  console.log('updated: ', updated.rowCount)

  return NextResponse.json({ updated: updated.rowCount === 1 })
}
