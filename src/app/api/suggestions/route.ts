import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get('profileId');
  const questionId = searchParams.get('questionId');
  const answerId = searchParams.get('answerId');

  if (!profileId || !questionId || !answerId) {
    return NextResponse.json({ error: 'Profile ID, Question ID, and Answer ID are all required' }, { status: 400 });
  }

  const result = await sql`
      SELECT id, suggestion_content
      FROM ai_interview_coach_prod_suggestions
      WHERE profile_id = ${profileId}
      AND question_id = ${questionId}
      AND answer_id = ${answerId}
      ORDER BY id ASC
  `;

  return NextResponse.json({ suggestions: result.rows[0].suggestion_content });
}

