import { getTable } from '@/lib/db'
import { sql } from '@vercel/postgres'

const DEFAULT_NUM_FREE_INTERVIEWS = 1

export async function getAvailableInterviews(
  profileId: string,
): Promise<{ interviewsAvailable: number }> {
  try {
    //
    const profilesTable = getTable('profiles')
    const profilesResult = await sql.query(`
      SELECT num_free_interviews FROM ${profilesTable}
      WHERE id = ${profileId}
    `)

    const freeInterviews = profilesResult?.rows?.[0]?.num_free_interviews ?? DEFAULT_NUM_FREE_INTERVIEWS

    const paymentsTable = getTable('payments')
    const paymentsResult = await sql.query(`
      SELECT count(*) as count FROM ${paymentsTable}
      WHERE profile_id = ${profileId}
    `)

    const paidInterviews = paymentsResult?.rows?.[0]?.count ?? 0

    const interviewTable = getTable('interviews')
    const interviews = await sql.query(`
      SELECT count(*) as count FROM ${interviewTable}
      WHERE profile_id = ${profileId}
    `)

    const interviewsDone = interviews?.rows[0].count ?? paidInterviews
    const interviewsAvailable = Math.max(0, freeInterviews + paidInterviews - interviewsDone)

    return { interviewsAvailable }
  } catch (error: unknown) {
      console.error('Error getting payments:', error)
      throw error
  }
}
