import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getTable } from "@/lib/db";

const PROFILES_TABLE = getTable('ai_interview_coach_prod_profiles');
const JOBS_TABLE = getTable('ai_interview_coach_prod_jobs');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');

    const profile = await sql.query(`SELECT * FROM ${PROFILES_TABLE} WHERE id = ${profileId} AND is_demo = true`);
    const job = await sql.query(`SELECT company_url, jd_url, interviewer_name, interviewer_role FROM ${JOBS_TABLE} WHERE profile_id = ${profileId}`);

    return NextResponse.json({ profile: profile.rows[0], job: job.rows[0] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ content: "unable to get profile" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { email, school, major, concentration, graduation_year } = json;

    // Convert graduation_year String to a Date with Jan 1
    const graduation_date = new Date(`1/1/${graduation_year}`);
    const profileId = await createProfile(email, school, major, concentration, graduation_date);

    return NextResponse.json({ success: true, profileId });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ content: "unable to add profile" }, { status: 500 });
  }
}

async function createProfile(
  email: string,
  school: string,
  major: string,
  concentration: string,
  graduation_date: Date
): Promise<number> {
  try {
    const result = await sql.query(`
      INSERT INTO ${PROFILES_TABLE} (email, school, major, concentration, graduation_date)
      VALUES ('${email}', '${school}', '${major}', '${concentration}', '${graduation_date.toISOString()}')
      RETURNING id
    `);
    return result.rows[0].id;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
