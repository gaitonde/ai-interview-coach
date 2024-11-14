import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get('profileId');

  if (!profileId) {
    return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
  }

  const result = await sql`
      SELECT id, category, question, why, focus
      FROM ai_interview_coach_prod_suggestions 
      WHERE profile_id = ${profileId}
      ORDER BY id ASC
  `;
  
  return NextResponse.json(result.rows);
}

