import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { getTable } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { profileId, questionId, transcript } = body;

  const table = getTable('answers');
  const query =
    `INSERT INTO ${table}
    (profile_id, question_id, answer)
    VALUES ($1, $2, $3)
    RETURNING id`;

  const result = await sql.query(query, [profileId, questionId, transcript]);
  return NextResponse.json({ id: result.rows[0].id });
}