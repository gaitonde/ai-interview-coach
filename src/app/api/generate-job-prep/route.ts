import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { generateCompletion } from "../utils/openAiCompletion";
import { getTable } from "@/lib/db";

export async function POST(request: Request) {
  console.log('in BE with request for generating job-prep');
  const body = await request.json();
  const profileId = body.profileId;
  const jobId = body.jobId;

  if (!profileId || !jobId) {
    return NextResponse.json({ error: 'Profile ID and Job ID are required' }, { status: 400 });
  }

  try {
    const { content, usage } = await generateCompletion(profileId, 'prompt-job-prep');
    const aiResponsesTable = getTable('ai_interview_coach_prod_airesponses');
    const query = `
      INSERT INTO ${aiResponsesTable} (profile_id, job_id, prep_sheet_response, usage)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (profile_id)
      DO UPDATE SET prep_sheet_response = EXCLUDED.prep_sheet_response, usage = EXCLUDED.usage;
    `;

    await sql.query(query, [profileId, jobId, content, usage]);

    const companyMatch = content?.match(/\*\*Company\*\*:\s*([^\n]*)/);
    const companyName = companyMatch ? companyMatch[1].trim() : null;
    console.log('company: ', companyName);

    const jobsTable = getTable('ai_interview_coach_prod_jobs');
    const query2 = `
      UPDATE ${jobsTable}
      SET company_name = $1
      WHERE profile_id = $2;
    `;
    await sql.query(query2, [companyName, profileId]);

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
