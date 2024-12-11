import { NextResponse } from 'next/server'
import { sql } from "@vercel/postgres"
import { getTable } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');
    const interviewId = searchParams.get('interviewId');
    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
    }

    const table = getTable('airesponses')
    const result = await sql.query(`
      SELECT generated_interviewer_prep
      FROM ${table}
      WHERE profile_id = $1
      AND interview_id = $2
      ORDER BY created_at DESC
    `, [profileId, interviewId]);

    if (result.rows.length < 1) {
      return NextResponse.json({ error: 'No questions found' }, { status: 404 });
    }

    return NextResponse.json({ content: result.rows[0].generated_interviewer_prep });
  } catch (error) {
    console.error('Error fetching prep sheet response:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
