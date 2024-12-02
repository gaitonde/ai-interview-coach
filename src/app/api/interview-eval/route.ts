import { NextResponse, NextRequest } from 'next/server'
import {
  CATEGORIES,
  getExistingReadiness,
  getFeedbackContent,
  generateReadinessEvaluation,
  updateReadinessRecord
} from '../utils/readiness'

export async function GET(request: NextRequest) {
  try {
    const { profileId, jobId, category } = Object.fromEntries(request.nextUrl.searchParams)

    if (!CATEGORIES.includes(category)) {
      return NextResponse.json({ content: `category not found: ${category}` }, { status: 400 })
    }

    const existingRecord = await getExistingReadiness(profileId, jobId, category)

    if (existingRecord?.is_up_to_date) {
      return NextResponse.json({ content: existingRecord })
    }

    const feedback = await getFeedbackContent(profileId, jobId, category)
    const readinessData = feedback
      ? await generateReadinessEvaluation(profileId, category, feedback)
      : { readiness_text: 'TODO: Need better default text', readiness_rating: 'Not Ready' }

    const result = await updateReadinessRecord(profileId, jobId, category, readinessData)
    return NextResponse.json({ content: result })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ content: "unable to get content" }, { status: 500 })
  }
}
