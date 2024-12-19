import { getTable } from "@/lib/db"
import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { fetchPrompt, PromptData } from '../utils/fetchPrompt'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  const body = await request.json()
  const { profileId, interviewId } = body

  try {
    const promptData: PromptData = await fetchPrompt(profileId, 'prompt-questions', interviewId)
    const processedCategories = new Set<string>()

    const completion = await openai.chat.completions.create({
      model: promptData.model,
      messages: [
        { role: "system", content: promptData.systemPrompt },
        { role: "user", content: promptData.userPrompt }
      ],
      max_completion_tokens: promptData.maxCompletionTokens,
      temperature: promptData.temperature,
    })

    const generatedContent = completion.choices[0]?.message?.content?.replace('```json', '').replace('```', '')
    const questionsJson = JSON.parse(generatedContent || '{}')

    for (const questionJson of questionsJson) {
      const category = questionJson.category.toLowerCase()
      const questions = questionJson.questions

      for (const question of questions) {
        // Clean and sanitize the question text
        const sanitizedQuestion = question.question.replace(/'/g, "''")
        const table = getTable('questions')
        const query = `
          INSERT INTO ${table}
            (profile_id, interview_id, category, question, why, focus, example_answer)
          VALUES
            ($1, $2, $3, $4, $5, $6, $7)
        `
        await sql.query(query, [profileId, interviewId, category, sanitizedQuestion, question.why, question.focus, question.exampleAnswer])
      }

      // Only insert interview readiness once per category
      if (!processedCategories.has(category)) {
        await insertInterviewReadiness(profileId, interviewId, category)
        processedCategories.add(category)
      }
    }

    return NextResponse.json({ content: generatedContent })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ content: "unable to get content" }, { status: 500 })
  }
}

async function insertInterviewReadiness(profileId: string, interviewId: string, category: string) {
  // Insert interview readiness records for each category
  const table = getTable('interview_readiness')
  const query = `
    INSERT INTO "${table}" (
      profile_id,
      interview_id,
      category,
      is_up_to_date
    )
    VALUES ($1, $2, $3, TRUE)
  `

  await sql.query(query, [profileId, interviewId, category])
}