import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { sql } from '@vercel/postgres'
import { fetchPrompt, PromptData } from '../utils/fetchPrompt'
import { getTable } from '@/lib/db'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  const body = await request.json()
  const { profileId, interviewId } = body

  try {
    const promptData: PromptData = await fetchPrompt(profileId, 'prompt-interviewer-prep', interviewId)

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
        SET generated_interviewer_prep = $3
        WHERE profile_id = $1 AND interview_id = $2
        RETURNING *
      )
      INSERT INTO ${table} (profile_id, interview_id, generated_interviewer_prep)
      SELECT $1, $2, $3
      WHERE NOT EXISTS (
        SELECT * FROM upsert
      )
    `
    await sql.query(query, [profileId, interviewId, generatedContent])

    return NextResponse.json({ content: generatedContent })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ content: "unable to get content" }, { status: 500 })
  }
}
