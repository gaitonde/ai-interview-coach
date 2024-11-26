import { NextResponse } from 'next/server';
import { sql } from "@vercel/postgres";
// import { Pool } from 'pg';
import { getTable } from "@/lib/db";

const TABLE = getTable('ai_interview_coach_prod_airesponses');

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');

    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
    }

    console.log('ZZZXXX profileId:', TABLE);
    const result = await sql.query(`
      SELECT questions_response
      FROM ${TABLE}
      WHERE profile_id = $1
      ORDER BY created_at DESC
    `, [profileId]);

    if (result.rows.length < 1) {
      return NextResponse.json({ error: 'No questions found' }, { status: 404 });
    }


    return NextResponse.json({ content: result.rows[0].questions_response });
  } catch (error) {
    console.error('Error fetching prep sheet response:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
