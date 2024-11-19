import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get('profileId');
  const mode = searchParams.get('mode');

  if (!profileId) {
    return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
  }

  let result;
  if (mode === 'demo') {
    result = await sql`
    SELECT questions.id as "questionId", questions.category, questions.question, questions.why, questions.focus, answers.id as "answerId", answers.answer, answers.created_at as "recordingTimestamp", scores.scores, suggestions.suggestion_content
    FROM ai_interview_coach_prod_job_questions questions, ai_interview_coach_prod_job_question_answers answers, ai_interview_coach_prod_answer_scores scores, ai_interview_coach_prod_suggestions suggestions
    WHERE questions.profile_id = ${profileId} AND answers.profile_id = ${profileId} AND scores.profile_id = ${profileId} AND suggestions.profile_id = ${profileId}
    AND questions.id = answers.question_id
    AND answers.id = scores.answer_id
    AND answers.id = suggestions.answer_id
    ORDER BY questions.id ASC
`;

  } else {
    result = await sql`
        SELECT id, category, question, why, focus
        FROM ai_interview_coach_prod_job_questions
        WHERE profile_id = ${profileId}
        ORDER BY id ASC
    `;
  }

  return NextResponse.json(result.rows);
}

