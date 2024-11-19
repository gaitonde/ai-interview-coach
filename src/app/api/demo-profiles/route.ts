import { sql } from "@vercel/postgres";
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.debug('Fetching demo profiles');
  const profiles = await sql`SELECT * FROM ai_interview_coach_prod_profiles WHERE is_demo = TRUE order by created_at desc`;
  return NextResponse.json({ profiles: profiles.rows }, { status: 200 });
}
