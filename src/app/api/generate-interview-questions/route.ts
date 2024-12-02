import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { sql } from '@vercel/postgres'
import { fetchPrompt, PromptData } from '../utils/fetchPrompt'
import { getTable } from "@/lib/db"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  console.log('in BE with request for generating questions')
  const body = await request.json()
  const { profileId, jobId } = body

  try {
    const promptData: PromptData = await fetchPrompt(profileId, 'prompt-questions')
    console.log('BBB promptData: ', promptData.systemPrompt)

    const completion = await openai.chat.completions.create({
      model: promptData.model,
      messages: [
        { role: "system", content: promptData.systemPrompt },
        { role: "user", content: promptData.userPrompt }
      ],
      max_completion_tokens: promptData.maxCompletionTokens,
      temperature: promptData.temperature,
    })

    console.log('VVV completion: ', completion)

    const generatedContent = completion.choices[0]?.message?.content?.replace('```json', '').replace('```', '')

    const questionsJson = JSON.parse(generatedContent || '{}')

    for (const questionJson of questionsJson) {
      const category = questionJson.category
      const questions = questionJson.questions

      for (const question of questions) {
        // Clean and sanitize the question text
        const sanitizedQuestion = question.question.replace(/'/g, "''")
        const table = getTable('aic_job_questions')
        const query = `
          INSERT INTO ${table}
            (profile_id, job_id, category, question, why, focus)
          VALUES
            ($1, $2, $3, $4, $5, $6)
        `
        await sql.query(query, [profileId, jobId, category, sanitizedQuestion, question.why, question.focus])
      }
    }

    return NextResponse.json({ content: generatedContent })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ content: "unable to get content" }, { status: 500 })
  }
}
