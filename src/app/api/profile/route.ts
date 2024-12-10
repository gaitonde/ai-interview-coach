import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { getTable } from '@/lib/db'
import { createUser } from '@/app/actions/create-user'

const PROFILES_TABLE = getTable('profiles')
// const JOBS_TABLE = getTable('interviews')

interface ClerkError extends Error {
  errors?: Array<{ message: string }>;
}

export async function GET(request: Request) {
  console.debug('in profile route GET')
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
    const graduation_date = new Date(`1/1/${graduation_year}`)


    let userId

    try {
      const user = await createUser(email)
      userId = user.id
      await updateProfile(id, userId, email, linkedin, school, major, concentration, graduation_date)
    } catch (err) {
      const error = err as ClerkError
      const errorMessage = error.errors?.[0]?.message || error.message || "Failed to create profile"
      console.log('1')
      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }



    return NextResponse.json({ success: true, userId, profileId: id })
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
  graduation_date: Date,
): Promise<number> {
  console.log('in updateProfile...')
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
        graduation_date = '${graduation_date.toISOString()}'
      WHERE id = ${id}
      RETURNING id
    `)
    return result.rows[0].id
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}
