import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create a new pool using the connection string from your environment variables
const pool = new Pool({
  connectionString: process.env.POSTGRES_PRISMA_URL,
});

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT questions_response
        FROM ai_interview_coach_prod_airesponses
        ORDER BY created_at DESC
        LIMIT 1
      `);

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'No prep sheet response found' }, { status: 404 });
      }
      const content = result.rows[0].questions_response

      return NextResponse.json({ content: content });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching prep sheet response:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
