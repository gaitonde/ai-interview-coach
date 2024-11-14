import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { profileId, questionId, transcript } = body;

  const result = await sql`
    INSERT INTO ai_interview_coach_prod_job_question_answers 
    (profile_id, question_id, answer) 
    VALUES (${profileId}, ${questionId}, ${transcript}) 
    RETURNING id`;
  
    return NextResponse.json({ id: result.rows[0].id });
}