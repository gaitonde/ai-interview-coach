import { sql } from '@vercel/postgres'
import { getTable } from '@/lib/db'

export async function getPromptByKey(key: string) {
  const table = getTable('prompts')
  const result = await sql.query(
    `SELECT * FROM ${table} WHERE key = $1 LIMIT 1`,
    [key]
  )

  let prompt = result.rows[0]
  if (prompt) {
    prompt = {
      ...prompt,
      temperature: parseFloat(prompt.temperature)
    }
  }

  return prompt
}