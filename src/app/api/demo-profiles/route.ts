import { getTable } from "@/lib/db";
import { sql } from "@vercel/postgres";
import { NextResponse } from 'next/server';

export async function GET() {
  const table = getTable('ai_interview_coach_prod_profiles');

  console.debug('Fetching demo profiles');
  const profiles = await sql`SELECT * FROM ${table} WHERE is_demo = TRUE order by created_at desc`;
  return NextResponse.json({ profiles: profiles.rows }, { status: 200 });
}
