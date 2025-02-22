import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'
import { generateCompletion } from '../utils/openAiCompletion'
import { getTable } from '@/lib/db'

export async function POST(request: Request) {
  const body = await request.json();
  const { profileId, interviewId } = body

  if (!profileId || !interviewId) {
    return NextResponse.json({ error: 'Profile ID and Interview ID are required' }, { status: 400 });
  }

  try {
    const { content, usage } = await generateCompletion(profileId, 'prompt-company-prep', interviewId)
    const aiResponsesTable = getTable('airesponses')
    const query = `
      INSERT INTO ${aiResponsesTable} (profile_id, interview_id, generated_company_scout, usage)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (profile_id, interview_id)
      DO UPDATE SET generated_company_scout = EXCLUDED.generated_company_scout, usage = EXCLUDED.usage;
    `;

    await sql.query(query, [profileId, interviewId, content, usage]);

    const companyMatch = content?.match(/\*\*Company\*\*:\s*([^\n]*)/)
    const companyName = companyMatch ? companyMatch[1].trim() : null
    const roleMatch = content?.match(/\*\*Position\*\*:\s*([^\n]*)/)
    const roleName = roleMatch ? roleMatch[1].trim() : null

    const interviewsTable = getTable('interviews');
    const query2 = `
      UPDATE ${interviewsTable}
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
