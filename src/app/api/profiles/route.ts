import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { getTable } from "@/lib/db"

const PROFILES_TABLE = getTable('profiles')

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

    return NextResponse.json({ profiles: profile.rows })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ content: "unable to get profile" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const { userId, school, major, concentration, graduation_year } = json

    // Convert graduation_year String to a Date with Jan 1
    const graduation_date = new Date(`1/1/${graduation_year}`)
    const profileId = await createProfile(userId, school, major, concentration, graduation_date)

    return NextResponse.json({ success: true, profileId })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ content: "unable to add profile" }, { status: 500 })
  }
}

async function createProfile(
  userId: number,
  school: string,
  major: string,
  concentration: string,
  graduation_date: Date
): Promise<number> {
  try {
    // ON CONFLICT ON CONSTRAINT unique_user_id
    const result = await sql.query(`
      INSERT INTO ${PROFILES_TABLE} (user_id, school, major, concentration, graduation_date)
      VALUES (${userId}, '${school}', '${major}', '${concentration}', '${graduation_date.toISOString()}')
      ON CONFLICT (user_id)
      DO UPDATE SET
        school = EXCLUDED.school,
        major = EXCLUDED.major,
        concentration = EXCLUDED.concentration,
        graduation_date = EXCLUDED.graduation_date,
        last_updated_at = CURRENT_TIMESTAMP
      RETURNING id
    `)
    return result.rows[0].id
  } catch (error) {
    console.error('Error creating profiles:', error)
    throw error
  }
}
