import { getTable } from '@/lib/db'
import { getPromptByKey } from '@/lib/prompts'
import { sql } from '@vercel/postgres'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET(request: NextRequest) {
  const { profileId, interviewId } = Object.fromEntries(request.nextUrl.searchParams)
  console.log('profileId', profileId)
  console.log('interviewId', interviewId)

  let interviewReadiness = await getInteriewReadiness(profileId, interviewId)
  let result = interviewReadiness.rows
  if (interviewReadiness.needsUpdate) {
    let messages: ChatCompletionMessageParam[] = []
    await addChatHistory(profileId, interviewId, messages)
    await getUnsentFeedback(profileId, interviewId, messages)
    if (messages.length > 0) {
      console.log('XXX after chat history')
      const evaluation = await runPrompt(profileId, interviewId, messages)
      console.log('XXX evaluation', evaluation)
      //insert new chat history for assistant message
      const newChatHistory = await insertChatHistory(profileId, interviewId, 'assistant', evaluation)
      //make sure feedback is marked so we don't use it again
      await updateFeedback(profileId, interviewId, newChatHistory.id)
      //TODO: post result stuff - db,
      await upsertInterviewReadiness(profileId, interviewId, newChatHistory.id, result)
      interviewReadiness = await getInteriewReadiness(profileId, interviewId)
      result = interviewReadiness.rows
    } else {
      console.warn('Interview readiness needs updating but there is no new feedback to use')
    }
  }
  console.log('XXX result', result)
  return NextResponse.json({content: result})
}

async function updateFeedback(profileId: string, interviewId: string, interviewReadinessChatHistoryId: string) {
  const table = getTable('feedback')
  const query = `
    UPDATE ${table}
    SET interview_readiness_chat_history_id = $1
    WHERE profile_id = $2
    AND interview_id = $3
  `
  await sql.query(query, [interviewReadinessChatHistoryId, profileId, interviewId])
}

async function insertChatHistory(profileId: string, interviewId: string, role: string, content: string) {
  const table = getTable('interview_readiness_chat_history')
  const query = `
    INSERT INTO ${table}
    (profile_id, interview_id, role, content)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `
  const result = await sql.query(query, [profileId, interviewId, role, content])
  return result.rows[0]
}

async function a(profileId: string, interviewId: string) {
  const result = await getInteriewReadiness(profileId, interviewId)
  return NextResponse.json(result)
}

// user should see initial state of interview readiness page -
//assuming that there are no records
async function getInteriewReadiness(profileId: string, interviewId: string) {
  const table = await getTable('interview_readiness')

  const result = await sql.query(`
    SELECT * FROM ${table}
    WHERE profile_id = $1
    AND interview_id = $2
  `, [profileId, interviewId])

  const needsUpdate = result.rows.some(row => !row.is_up_to_date)

  return {
    needsUpdate: needsUpdate,
    rows: result.rows,
  }
}

async function upsertInterviewReadiness(profileId: string, interviewId: string, chatHistoryId: string, data: any) {
  const table = getTable('interview_readiness')

  console.log('XXX data', data)

  for (const key of Object.keys(data)) {
    if (key.endsWith('_readiness_rating')) {
      const category = key.replace('_readiness_rating', '')
      const ratingKey = `${category}_readiness_rating`
      const textKey = `${category}_readiness_text`

      const query = `
        INSERT INTO ${table}
        (profile_id, interview_id, category, readiness_rating, readiness_text, is_up_to_date)
        VALUES ($1, $2, $3, $4, $5, true)
        ON CONFLICT (profile_id, interview_id, category) DO UPDATE
        SET readiness_rating = EXCLUDED.readiness_rating,
            readiness_text = EXCLUDED.readiness_text,
            is_up_to_date = true
      `
      await sql.query(query, [
        profileId,
        interviewId,
        category,
        data[ratingKey],
        data[textKey],
      ])
    }
  }
}

async function getUnsentFeedback(profileId: string, interviewId: string, messages: ChatCompletionMessageParam[]) {
  const table = getTable('feedback')
  const query = `
    SELECT id, category, feedback, created_at, interview_readiness_chat_history_id FROM ${table}
    WHERE profile_id = $1
    AND interview_id = $2
    AND interview_readiness_chat_history_id IS NULL
    ORDER BY id ASC
  `
  const result = await sql.query(query, [profileId, interviewId])
  const allUnsentFeedback = result.rows
  const feedback = allUnsentFeedback.map(unsentFeedback =>
    `
      =====
      Id: ${unsentFeedback.id}
      Date: ${unsentFeedback.created_at}
      Category: ${unsentFeedback.category}
      Feedback: ${unsentFeedback.feedback}
    `
  ).join('\n')

  const userMessage = `Please provide an updated evaluation based the following
    feedback the user has received since the last evaluation:\n
    ${feedback}
  `

  messages.push({
    role: 'user',
    content: userMessage
  })
  //insert this into chat history
  await insertChatHistory(profileId, interviewId, 'user', userMessage)
}

async function runPrompt(profileId: string, interviewId: string, messages: ChatCompletionMessageParam[]) {
  console.log('XXX messages', messages)
  console.log('XXX messages length', messages.length)

  // const promptData: PromptData = await fetchPrompt(profileId, `prompt-interview-ready-dayal`, interviewId)
  const prompt = await getPromptByKey('prompt-interview-ready-dayal')
  console.log('XXX prompt', prompt)
  const completion = await openai.chat.completions.create({
    model: prompt.model,
    messages: messages,
    max_completion_tokens: prompt.max_completion_tokens,
    temperature: prompt.temperature,
  })

  console.log('XXX completion', completion)

  const generatedContent = completion.choices[0]?.message?.content
  if (!generatedContent) {
    throw new Error('Unable to generate interview readiness evaluation')
  }
  const jsonContent = generatedContent.replace('```json', '').replace('```', '')
  const jsonObject = JSON.parse(jsonContent)
  return jsonObject
}

async function addChatHistory(profileId: string, interviewId: string, messages: ChatCompletionMessageParam[]) {
  const table = getTable('interview_readiness_chat_history')
  const query = `
    SELECT * FROM ${table}
    WHERE profile_id = $1
    AND interview_id = $2
    ORDER BY id ASC
  `
  const result = await sql.query(query, [profileId, interviewId])
  let chatHistory = result.rows

  //lazy insert chat history
  if (chatHistory.length < 1) {
    console.log('inserting initial system prompt for getting interview readiness')
    const prompt = await getPromptByKey('prompt-interview-ready-dayal')
    chatHistory = await insertChatHistory(profileId, interviewId, 'system', prompt.system_prompt)
  }

  for (const chat of chatHistory) {
    messages.push({
      role: chat.role,
      content: chat.content
    })
  }
}


