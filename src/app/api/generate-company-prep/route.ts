import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { generateCompletion } from "../utils/openAiCompletion";
import { getTable } from "@/lib/db";

export async function POST(request: Request) {
  console.log('in generate company-prep')
  const body = await request.json();
  const profileId = body.profileId;
  const interviewId = body.interviewId;

  if (!profileId || !interviewId) {
    return NextResponse.json({ error: 'Profile ID and Job ID are required' }, { status: 400 });
  }

  try {
    const { content, usage } = await generateCompletion(profileId, 'prompt-company-prep')
    const aiResponsesTable = getTable('airesponses');
    const query = `
      INSERT INTO ${aiResponsesTable} (profile_id, interview_id, generated_company_prep, usage)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (profile_id, interview_id)
      DO UPDATE SET generated_company_prep = EXCLUDED.generated_company_prep, usage = EXCLUDED.usage;
    `;

    await sql.query(query, [profileId, interviewId, content, usage]);

    const companyMatch = content?.match(/\*\*Company\*\*:\s*([^\n]*)/);
    const companyName = companyMatch ? companyMatch[1].trim() : null;
    console.log('company: ', companyName);

    const roleMatch = content?.match(/\*\*Position\*\*:\s*([^\n]*)/);
    const roleName = roleMatch ? roleMatch[1].trim() : null;
    console.log('roleName: ', roleName);

    const jobsTable = getTable('interviews');
    const query2 = `
      UPDATE ${jobsTable}
      SET company_name = $1, role_name = $2
      WHERE profile_id = $3
      AND id = $4;
    `;
    await sql.query(query2, [companyName, roleName, profileId, interviewId]);

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
