import { getTable } from "@/lib/db"
import { sql } from "@vercel/postgres"
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from "openai"
import { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs"
import { fetchPrompt, PromptData } from "../utils/fetchPrompt"
import {
  // CATEGORIES,
  // getExistingReadiness,
  ReadinessData
} from '../utils/readiness'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET(request: NextRequest) {
  try {
    //TODO: think we can remove category
    const { profileId, interviewId, category } = Object.fromEntries(request.nextUrl.searchParams)
    console.log('profileId', profileId)
    console.log('interviewId', interviewId)

    const initialReadiness = await getInitialReadiness(profileId, interviewId)
    console.log('XXX initialReadiness', initialReadiness)

    // if (!CATEGORIES.includes(category)) {
    //   return NextResponse.json({ content: `Category not found: ${category}` }, { status: 400 })
    // }

    // const existingRecord = await getExistingReadiness(profileId, interviewId, category)

    // //TODO: figure out what to do if no record, upsert or return 400?
    // if (existingRecord?.is_up_to_date) {
    //   return NextResponse.json({ content: existingRecord })
    // }

    // console.log('New data available. Generating readiness evaluation...')

    // const readinessData = await generateReadinessEvaluation(profileId, interviewId, category)

    // const result = await updateReadinessRecord(profileId, interviewId, category, readinessData)
    // return NextResponse.json({ content: result })
    return NextResponse.json({ content: initialReadiness })

  } catch (error) {
    console.error('Interview Readiness Error:', error)
    return NextResponse.json({ content: "Unable to get Interview Readiness content" }, { status: 500 })
  }
}

async function getInitialReadiness(profileId: string, interviewId: string): Promise<string> {

  try {
    const promptData: PromptData = await fetchPrompt(profileId, `prompt-interview-ready-initial`, interviewId)

    console.log('XXX promptData.userPrompt', promptData.userPrompt)

    const completion = await openai.chat.completions.create({
      model: promptData.model,
      messages: [
        { role: "system", content: promptData.systemPrompt },
        { role: "user", content: promptData.userPrompt }
      ],
      max_completion_tokens: promptData.maxCompletionTokens,
      temperature: promptData.temperature,
    });

    const generatedContent = completion.choices[0]?.message?.content
    console.log('generatedContent', generatedContent)
    return generatedContent || ''
  } catch (error) {
    console.error('Error generating initial readiness:', error)
    throw new Error('Unable to generate initial readiness')
  }

}

async function generateReadinessEvaluation(profileId: string, interviewId: string, category: string): Promise<ReadinessData> {
  // const promptData: PromptData = await fetchPrompt(profileId, `prompt-interview-ready-${category.toLowerCase()}`, interviewId)
  const promptData: PromptData = await fetchPrompt(profileId, `prompt-interview-ready`, interviewId)

  console.log('xx interviewId', interviewId)
  const chatHistory = await getChatHistory(profileId, interviewId)
  console.log('chatHistory', chatHistory.length)

  // Convert chat history to OpenAI message format
  const messages: ChatCompletionMessageParam[] = chatHistory.map(record => ({
    role: record.role as 'user' | 'assistant',
    content: record.content
  }))

  // const unsentFeedback = await getUnsentFeedback(profileId, interviewId)

  // // Combine all unsentFeedback into a single message
  // const combinedFeedback = unsentFeedback.map(feedback =>
  //   `Category: ${feedback.category}\nFeedback: ${feedback.feedback}`
  // ).join('\n')

  // messages.push({
  //   role: 'user',
  //   content: combinedFeedback
  // })

  console.log('Messages to be sent to OpenAI:', messages)

  const completion = await openai.chat.completions.create({
    model: promptData.model,
    messages: messages,
    max_completion_tokens: promptData.maxCompletionTokens,
    temperature: promptData.temperature,
  })

  const generatedContent = completion.choices[0]?.message?.content
  if (!generatedContent) {
    throw new Error('Generated content is null')
  }
  console.log('XXX generatedContent', generatedContent)
  // Insert user message into chat history
  // const chatHistoryTable = getTable('interview_readiness_chat_history')
  // const insertChatQuery = `
  //   INSERT INTO ${chatHistoryTable} (profile_id, interview_id, role, content)
  //   VALUES ($1, $2, $3, $4)
  //   RETURNING id
  // `
  // const chatResult = await sql.query(insertChatQuery, [profileId, interviewId, 'user', combinedFeedback])
  // const chatHistoryId = chatResult.rows[0].id

  // // Update feedback records with chat history id
  // const feedbackTable = getTable('feedback')
  // const updateFeedbackQuery = `
  //   UPDATE ${feedbackTable}
  //   SET interview_readiness_chat_history_id = $1
  //   WHERE id = ANY($2)
  // `
  // await sql.query(updateFeedbackQuery, [chatHistoryId, unsentFeedback.map(f => f.id)])


  // // Insert assistant response into chat history
  // await sql.query(insertChatQuery, [profileId, interviewId, 'assistant', generatedContent])

  return JSON.parse(generatedContent)
}

async function getChatHistory(profileId: string, interviewId: string) {
  const table = getTable('interview_readiness_chat_history')
  const query = `
    SELECT * FROM ${table}
    WHERE profile_id = $1
    AND interview_id = $2
    ORDER BY id DESC
  `
  const result = await sql.query(query, [profileId, interviewId])
  return result.rows
}

async function getUnsentFeedback(profileId: string, interviewId: string) {
  const table = getTable('feedback')
  const query = `
    SELECT * FROM ${table}
    WHERE profile_id = $1
    AND interview_id = $2
    AND interview_readiness_chat_history_id IS NULL
    ORDER BY id ASC
  `
  const result = await sql.query(query, [profileId, interviewId])

  return result.rows
}
