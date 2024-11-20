import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { generateCompletion } from "../utils/openAiCompletion";

export async function POST(request: Request) {
  console.log('in BE with request for generating job-prep');
  const body = await request.json();
  const profileId = body.profileId;

  try {
    const { content, usage } = await generateCompletion(profileId, 'prompt-job-prep');

    await sql`
      INSERT INTO ai_interview_coach_prod_airesponses (profile_id, prep_sheet_response, usage)
      VALUES (${profileId}, ${content}, ${usage})
      ON CONFLICT (profile_id)
      DO UPDATE SET prep_sheet_response = EXCLUDED.prep_sheet_response;
    `;

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
