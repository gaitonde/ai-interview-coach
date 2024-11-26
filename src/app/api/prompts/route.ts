import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getTable } from "@/lib/db";

const TABLE = getTable('ai_interview_coach_prod_prompts');

export async function GET(request: Request) {
  console.log('Fetching prompts');

  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    const result = await sql.query(
      `SELECT * FROM ${TABLE} WHERE key = $1 LIMIT 1`,
      [key]
    );

    let prompt = result.rows[0];
    if (prompt) {
      prompt = {
        ...prompt,
        temperature: parseFloat(prompt.temperature)
      };
    }

    if (!prompt) {
      return NextResponse.json({ success: false }, { status: 404 });
    } else {
      return NextResponse.json({ success: true, data: prompt });
    }

  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch prompts' }, { status: 500 });
  }
}
