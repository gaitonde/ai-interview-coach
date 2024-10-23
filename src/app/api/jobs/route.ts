import { sql } from '@vercel/postgres';
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const jobs = await sql`SELECT * FROM ai_interview_coach_prod_jobs`;
  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  const body = await request.json();
  const profileId = body.profileId;
  const company_url = body.company_url;
  const jd_url = body.jd_url;

  const jobs = await sql`INSERT INTO
  ai_interview_coach_prod_jobs (
    profile_id,
    company_url,
    jd_url
  )
  VALUES (
    ${profileId},
    ${company_url},
    ${jd_url}
  )`;

  return NextResponse.json(jobs);
}