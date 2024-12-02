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
    const aiResponsesTable = getTable('aic_airesponses');
    const query = `
      INSERT INTO ${aiResponsesTable} (profile_id, job_id, generated_company_info, usage)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (profile_id, job_id)
      DO UPDATE SET generated_company_info = EXCLUDED.generated_company_info, usage = EXCLUDED.usage;
    `;

    await sql.query(query, [profileId, jobId, content, usage]);

    const companyMatch = content?.match(/\*\*Company\*\*:\s*([^\n]*)/);
    const companyName = companyMatch ? companyMatch[1].trim() : null;
    console.log('company: ', companyName);

    const roleMatch = content?.match(/\*\*Position\*\*:\s*([^\n]*)/);
    const roleName = roleMatch ? roleMatch[1].trim() : null;
    console.log('roleName: ', roleName);

    const jobsTable = getTable('aic_jobs');
    const query2 = `
      UPDATE ${jobsTable}
      SET company_name = $1, role_name = $2
      WHERE profile_id = $3
      AND id = $4;
    `;
    await sql.query(query2, [companyName, roleName, profileId, jobId]);

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
