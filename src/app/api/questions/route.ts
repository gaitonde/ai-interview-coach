import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { sql } from '@vercel/postgres';
import { fetchPrompt, PromptData } from "../utils/fetchPrompt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get('profileId');
  const offset = searchParams.get('offset') || 0;
  console.log('offset: ', offset);

  if (!profileId) {
    return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
  }

  // const result = await sql`
  //     SELECT category, question 
  //     FROM ai_interview_coach_prod_job_questions 
  //     WHERE profile_id = ${profileId}
  //     ORDER BY id ASC
  //     LIMIT 1
  //     OFFSET ${offset}
  //   `;

  
  // const question = result.rows[0];
  // return NextResponse.json({ question });


  const result = await sql`
      SELECT id, category, question, why, focus
      FROM ai_interview_coach_prod_job_questions 
      WHERE profile_id = ${profileId}
      ORDER BY id ASC
      LIMIT 2
      OFFSET ${offset}
    `;

  // Check if we have a current question and if there's a next one
  const currentQuestion = result.rows[0];
  const hasMoreQuestions = result.rows.length > 1;
  const nextOffset = hasMoreQuestions ? Number(offset) + 1 : -1;
  
  return NextResponse.json({ 
    question: currentQuestion,
    offset: nextOffset 
  });  
}

