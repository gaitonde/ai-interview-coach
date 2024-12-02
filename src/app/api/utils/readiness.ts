import { sql } from '@vercel/postgres'
import { getTable } from "@/lib/db"
import OpenAI from 'openai'
import { fetchPrompt, PromptData } from "./fetchPrompt"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ReadinessData {
  readiness_text: string;
  readiness_rating: string;
}

export const CATEGORIES = ['Overall', 'Behavioral', 'Technical', 'Role', 'Case']

export async function getExistingReadiness(profileId: string, jobId: string, category: string) {
  const table = getTable('aic_job_readiness')
  const result = await sql.query(`
    SELECT * FROM ${table}
    WHERE profile_id = $1 AND job_id = $2 AND category = $3
    LIMIT 1`,
    [profileId, jobId, category]
  )
  return result.rows[0]
}

export async function getFeedbackContent(profileId: string, jobId: string, category: string) {
  const table = getTable('aic_suggestions')
  const result = await sql.query(`
    SELECT suggestion_content FROM ${table}
    WHERE profile_id = $1 AND job_id = $2 AND category = $3
    ORDER BY id DESC LIMIT 1`,
    [profileId, jobId, category]
  )
  return result.rows[0]?.suggestion_content
}

export async function generateReadinessEvaluation(profileId: string, category: string, feedback: string): Promise<ReadinessData> {
  const promptData: PromptData = await fetchPrompt(profileId, `prompt-interview-ready-${category.toLowerCase()}`)
  promptData.userPrompt = promptData.userPrompt
    .replace('{responseCategory}', category)
    .replace('{responseFeedback}', feedback)

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
  if (!generatedContent) {
    throw new Error('Generated content is null')
  }

  return JSON.parse(generatedContent)
}

export async function updateReadinessRecord(profileId: string, jobId: string, category: string, data: ReadinessData) {
  const table = getTable('aic_job_readiness')
  const { readiness_text, readiness_rating } = data

  const query = `
    INSERT INTO ${table} (profile_id, job_id, category, readiness_rating, readiness_text, is_up_to_date)
    VALUES ($1, $2, $3, $4, $5, TRUE)
    ON CONFLICT (profile_id, job_id, category) DO UPDATE
    SET readiness_rating = $4, readiness_text = $5, is_up_to_date = TRUE
  `
  return await sql.query(query, [profileId, jobId, category, readiness_rating, readiness_text])
}

export async function upsertOutOfDateReadinessRecord(profileId: string, jobId: string, category: string) {
  const table = getTable('aic_job_readiness')

  const query = `
    INSERT INTO ${table}
      (profile_id, job_id, category, readiness_rating, readiness_text, is_up_to_date)
    VALUES
      ($1, $2, $3, '', '', FALSE)
    ON CONFLICT (profile_id, job_id, category)
    DO UPDATE SET is_up_to_date = FALSE
  `
  return await sql.query(query, [profileId, jobId, category])
}