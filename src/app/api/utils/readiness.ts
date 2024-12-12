import { getTable } from "@/lib/db";
import { sql } from '@vercel/postgres';

export interface ReadinessData {
  readiness_text: string
  readiness_rating: string
}

export const CATEGORIES = ['Overall', 'Behavioral', 'Technical', 'Role', 'Case']

export async function getExistingReadiness(profileId: string, interviewId: string) {
  const table = getTable('interview_readiness')
  const result = await sql.query(`
    SELECT * FROM ${table}
    WHERE profile_id = $1
    AND interview_id = $2
    ORDER BY id DESC
    `,
    [profileId, interviewId]
  )
  console.log('XXX result', result.rows)
  return result.rows
}

export async function getFeedbackContent(profileId: string, interviewId: string, category: string) {
  const table = getTable('feedback')
  const result = await sql.query(`
    SELECT feedback FROM ${table}
    WHERE profile_id = $1 AND interview_id = $2 AND category = $3
    ORDER BY id DESC LIMIT 1`,
    [profileId, interviewId, category]
  )
  return result.rows[0]?.feedback
}

export async function updateReadinessRecord(profileId: string, interviewId: string, category: string, data: ReadinessData) {
  const table = getTable('interview_readiness')
  const { readiness_text, readiness_rating } = data

  const query = `
    INSERT INTO ${table} (profile_id, interview_id, category, readiness_rating, readiness_text, is_up_to_date)
    VALUES ($1, $2, $3, $4, $5, TRUE)
    ON CONFLICT (profile_id, interview_id, category) DO UPDATE
    SET readiness_rating = $4, readiness_text = $5, is_up_to_date = TRUE
  `
  return await sql.query(query, [profileId, interviewId, category, readiness_rating, readiness_text])
}

export async function upsertOutOfDateReadinessRecord(profileId: string, interviewId: string, category: string) {
  const table = getTable('interview_readiness')

  const query = `
    INSERT INTO ${table}
      (profile_id, interview_id, category, readiness_rating, readiness_text, is_up_to_date)
    VALUES
      ($1, $2, $3, '', '', FALSE)
    ON CONFLICT (profile_id, interview_id, category)
    DO UPDATE SET is_up_to_date = FALSE
  `
  return await sql.query(query, [profileId, interviewId, category])
}