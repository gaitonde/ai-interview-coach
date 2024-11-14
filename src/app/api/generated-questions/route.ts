import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create a new pool using the connection string from your environment variables
const pool = new Pool({
  connectionString: process.env.POSTGRES_PRISMA_URL,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');

    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT questions_response
        FROM ai_interview_coach_prod_airesponses
        WHERE profile_id = $1
        ORDER BY created_at DESC
      `, [profileId]);

      if (result.rows.length < 1) {
        return NextResponse.json({ error: 'No questions found' }, { status: 404 });
      }
      // const content = result.rows[0].questions_response

      return NextResponse.json({ content: result.rows });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching prep sheet response:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
