import { NextResponse } from 'next/server';
import { Pool } from 'pg';

import { getTable } from "@/lib/db";

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
      const table = getTable('aic_airesponses');
      const result = await client.query(`
        SELECT generated_company_info
        FROM ${table}
        WHERE profile_id = $1
        ORDER BY created_at DESC
        LIMIT 1
      `, [profileId]);

      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'No company info found' }, { status: 404 });
      }

      return NextResponse.json({ content: result.rows[0].generated_company_info });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching prep sheet response:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
