import { getTable } from "@/lib/db";
import { sql } from "@vercel/postgres";
import { NextResponse } from 'next/server';

export async function GET() {
  const table = getTable('aic_profiles');
  const profiles = await sql.query(`
    SELECT * FROM ${table}
    WHERE is_demo = TRUE
    ORDER BY created_at DESC
  `);
  return NextResponse.json({ profiles: profiles.rows }, { status: 200 });
}
