import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getTable } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get('profileId');
  const questionId = searchParams.get('questionId');
  const answerId = searchParams.get('answerId');

  if (!profileId || !questionId || !answerId) {
    return NextResponse.json({ error: 'Profile ID, Question ID, and Answer ID are all required' }, { status: 400 });
  }

  const table = getTable('aic_suggestions');
  const query = `
      SELECT id, suggestion_content
      FROM ${table}
      WHERE profile_id = $1
      AND question_id = $2
      AND answer_id = $3
      ORDER BY id ASC
  `;
  console.log('ZZZ query', query);
  const result = await sql.query(query, [profileId, questionId, answerId]);

  return NextResponse.json({ suggestions: result.rows[0].suggestion_content });
}

