import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';


export async function GET(request: Request) {
  try {
    await sql`
      DELETE FROM ai_interview_coach_prod_airesponses WHERE profile_id = 1
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ content: "unable to delete content" }, { status: 500 });
  }
}
