import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { getTable } from '@/lib/db'
import { createUser } from '@/app/actions/create-user'
import { clerkClient } from '@clerk/express'

const PROFILES_TABLE = getTable('profiles')
// const JOBS_TABLE = getTable('interviews')

interface ClerkError extends Error {
  errors?: Array<{ message: string }>;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('profileId')
    const isDemo = searchParams.get('loadDemo')

    let query

    if (isDemo) {
      if (profileId) {
        query = `
          SELECT * FROM ${PROFILES_TABLE}
          WHERE id = ${profileId}
          AND is_demo = true
        `
      } else {
        query = `
          SELECT * FROM ${PROFILES_TABLE}
          WHERE is_demo = true
          ORDER BY created_at DESC
        `
      }
    } else {
      query = `
        SELECT * FROM ${PROFILES_TABLE}
        WHERE id = ${profileId}
      `
    }

    const profile = await sql.query(query)
    // const job = await sql.query(`SELECT company_url, jd_url, interviewer_name, interviewer_role FROM ${JOBS_TABLE} WHERE profile_id = ${profileId}`);

    return NextResponse.json({ profiles: profile.rows })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ content: "unable to get profile" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const { id, email, linkedin, school, major, concentration, graduation_year } = json

    // Convert graduation_year String to a Date with Jan 1
    const graduation_date = graduation_year ? new Date(`1/1/${graduation_year}`) : null


    let userId, ticket

    try {
      const user = await createUser(email)
      userId = user.id
      ticket = await clerkClient.signInTokens.createSignInToken({
        userId: user.clerkId.toString(),
        expiresInSeconds: 60 * 60, // Token expires in 1 hour
      })
      await updateProfile(id, userId, email, linkedin, school, major, concentration, graduation_date)
    } catch (err) {
      const error = err as ClerkError
      const errorMessage = error.errors?.[0]?.message || error.message || "Failed to create profile"
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    return NextResponse.json({ success: true, userId, profileId: id, ticket: ticket.token })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({
      error: "An unexpected error occurred while creating the profile"
    }, { status: 500 })
  }

}

//id, userId, email, linkedin, school, major, concentration, graduation_date
async function updateProfile(
  id: number,
  userId: number,
  email: string,
  linkedin: string,
  school: string,
  major: string,
  concentration: string,
  graduation_date: Date | null,
): Promise<number> {

  try {
    const result = await sql.query(`
      UPDATE ${PROFILES_TABLE}
      SET
        user_id = ${userId},
        email = '${email}',
        linkedin_url = '${linkedin}',
        school = '${school}',
        major = '${major}',
        concentration = '${concentration}',
        graduation_date = ${graduation_date ? `'${graduation_date.toISOString()}'` : 'NULL'}
      WHERE id = ${id}
      RETURNING id
    `)
    return result.rows[0].id
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}
