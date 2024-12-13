import { NextResponse } from 'next/server'
import { generateCompletion } from '../utils/openAiCompletion'
import { getTable } from '@/lib/db'
import { sql } from '@vercel/postgres'

export async function POST(request: Request) {
  const body = await request.json()
  const { profileId, interviewId } = body

  if (!profileId || !interviewId) {
    return NextResponse.json({ error: 'Profile ID and Interview ID are required' }, { status: 400 })
  }

  try {
    // Start all generations in parallel
    const [companyPrepResult] = await Promise.all([
      // Only await company prep result
      generateCompanyPrep(profileId, interviewId),
      // Fire and forget other generations
      generateOtherPreps(profileId, interviewId)
    ])

    return NextResponse.json(companyPrepResult)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

async function generateCompanyPrep(profileId: string, interviewId: string) {
  const { content, usage } = await generateCompletion(profileId, 'prompt-company-prep', interviewId)
  const aiResponsesTable = getTable('airesponses');
  const query = `
    INSERT INTO ${aiResponsesTable} (profile_id, interview_id, generated_company_prep, usage)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (profile_id, interview_id)
    DO UPDATE SET generated_company_prep = EXCLUDED.generated_company_prep, usage = EXCLUDED.usage;
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

  return { content };
}

async function generateOtherPreps(profileId: string, interviewId: string) {
  const protocol = process.env.NEXT_PUBLIC_VERCEL_URL?.startsWith('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${process.env.NEXT_PUBLIC_VERCEL_URL}`

  const generateEndpoints = [
    'generate-interviewer-prep',
    'generate-question-prep',
    'generate-interview-questions'
  ]

  const makeRequest = (endpoint: string) =>
    fetch(`${baseUrl}/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, interviewId }),
    })

  // Fire all other generations in parallel
  await Promise.all(generateEndpoints.map(makeRequest))
}