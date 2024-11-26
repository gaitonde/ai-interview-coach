import { getTable } from "@/lib/db";
import { sql } from "@vercel/postgres";
import { NextResponse } from 'next/server';

const TABLE = getTable('ai_interview_coach_prod_profiles');

export async function GET() {
  const profiles = await sql.query(`SELECT * FROM ${TABLE} WHERE is_demo = TRUE order by created_at desc`);
  return NextResponse.json({ profiles: profiles.rows }, { status: 200 });
}
