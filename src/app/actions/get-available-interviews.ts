import { getTable } from '@/lib/db'
import { sql } from '@vercel/postgres'

export async function getAvailableInterviews(
  profileId: string,
): Promise<{ interviewsAvailable: number }> {
  try {
    const billingTable = getTable('billing')
    const billingsResult = await sql.query(`
      SELECT paid_interviews FROM ${billingTable}
      WHERE profile_id = ${profileId}
    `)

    const paidInterviews = billingsResult?.rows?.[0]?.paid_interviews ?? 0

    const interviewTable = getTable('interviews')
    const interviews = await sql.query(`
      SELECT count(*) as count FROM ${interviewTable}
      WHERE profile_id = ${profileId}
    `)

    const interviewsDone = interviews?.rows[0].count ?? paidInterviews
    const interviewsAvailable = Math.max(0, paidInterviews - interviewsDone)

    return { interviewsAvailable }
  } catch (error: unknown) {
      console.error('Error getting billing:', error)
      throw error
  }
}
