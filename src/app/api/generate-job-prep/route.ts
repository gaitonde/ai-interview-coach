import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { generateCompletion } from "../utils/openAiCompletion";
import { getTable } from "@/lib/db";

const TABLE = getTable('ai_interview_coach_prod_airesponses');

export async function POST(request: Request) {
  console.log('in BE with request for generating job-prep');
  const body = await request.json();
  const profileId = body.profileId;

  try {
    const { content, usage } = await generateCompletion(profileId, 'prompt-job-prep');
    const query = `
      INSERT INTO ${TABLE} (profile_id, prep_sheet_response, usage)
      VALUES ($1, $2, $3)
      ON CONFLICT (profile_id)
      DO UPDATE SET prep_sheet_response = EXCLUDED.prep_sheet_response, usage = EXCLUDED.usage;
    `;

    await sql.query(query, [profileId, content, usage]);

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
