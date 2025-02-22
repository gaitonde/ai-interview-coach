import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { fetchPrompt, PromptData } from '../utils/fetchPrompt'
import { getTable } from "@/lib/db"
import { sql } from "@vercel/postgres"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profileId, interviewId } = body
    const content = await generateQuestionPrep(profileId, interviewId)
    return NextResponse.json({ content })

  } catch (error) {
    console.error('Interview Readiness Error:', error)
    return NextResponse.json({ content: "Unable to get Interview Readiness content" }, { status: 500 })
  }
}

async function generateQuestionPrep(profileId: string, interviewId: string): Promise<string> {

  try {
    const promptData: PromptData = await fetchPrompt(profileId, `prompt-question-prep`, interviewId)
    const completion = await openai.chat.completions.create({
      model: promptData.model,
      messages: [
        { role: "system", content: promptData.systemPrompt },
        { role: "user", content: promptData.userPrompt }
      ],
      max_completion_tokens: promptData.maxCompletionTokens,
      temperature: promptData.temperature,
    })

    const generatedContent = completion.choices[0]?.message?.content

    // Modified upsert operation
    const table = getTable('airesponses')
    const query = `
      WITH upsert AS (
        UPDATE ${table}
        SET generated_question_scout = $3
        WHERE profile_id = $1 AND interview_id = $2
        RETURNING *
      )
      INSERT INTO ${table} (profile_id, interview_id, generated_question_scout)
      SELECT $1, $2, $3
      WHERE NOT EXISTS (
        SELECT * FROM upsert
      )
    `
    await sql.query(query, [profileId, interviewId, generatedContent])

    return generatedContent || ''
  } catch (error) {
    console.error('Error generating initial readiness:', error)
    throw new Error('Unable to generate initial readiness')
  }

}

