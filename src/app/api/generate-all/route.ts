import { NextResponse } from 'next/server'
import { generateCompletion } from '../utils/openAiCompletion'
import { getTable } from '@/lib/db'
import { sql } from '@vercel/postgres'
import { getBaseUrl } from '@/lib/utils'

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
      generateOtherPreps(request, profileId, interviewId)
    ])

    return NextResponse.json(companyPrepResult)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: error }, { status: 500 })
  }
}

async function generateCompanyPrep(profileId: string, interviewId: string) {
  const { content, usage } = await generateCompletion(profileId, 'prompt-company-prep', interviewId)
  const aiResponsesTable = getTable('airesponses')
  const query = `
    INSERT INTO ${aiResponsesTable} (profile_id, interview_id, generated_company_prep, usage)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (profile_id, interview_id)
    DO UPDATE SET generated_company_prep = EXCLUDED.generated_company_prep, usage = EXCLUDED.usage;
  `

  await sql.query(query, [profileId, interviewId, content, usage])

  console.log('PPP content', content)
  const details = await extractDetailsFromCompanyScoutingReport(content!!)
  console.log('PPP details: ', details)
  let companyName, roleName
  if (!details) {
    console.warn('Could not extract company and role details')
    companyName = 'Stealth Mode'
    roleName = 'No formal role title'
  } else {
    companyName  = details.companyName
    roleName = details.roleName
  }

  const interviewsTable = getTable('interviews')
  const query2 = `
    UPDATE ${interviewsTable}
    SET company_name = $1, role_name = $2
    WHERE profile_id = $3
    AND id = $4;
  `

  console.log('PPP companyName: ', companyName)
  console.log('PPP roleName: ', roleName)
  await sql.query(query2, [companyName, roleName, profileId, interviewId])

  return { content }
}

async function generateOtherPreps(request: Request, profileId: string, interviewId: string) {
  const baseUrl = getBaseUrl(request)

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
      priority: 'low',
    })

  // Fire all other generations in parallel
  await Promise.all(generateEndpoints.map(makeRequest))
}

async function extractDetailsFromCompanyScoutingReport(text: string) {
  if (!text) return

  const regex = /This Company Scouting Report is personalized for .+ for (.+?) at ([^.]+)\./;
  const match = text.match(regex)

  if (match) {
    const [, roleName, companyName] = match
    return { roleName, companyName }
  }

  return null // No match found
}