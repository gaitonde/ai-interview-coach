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
SELECT
  questions.id AS "questionId",
  questions.category,
  questions.question,
  questions.why,
  questions.focus,
  answers.id AS "answerId",
  answers.answer,
  answers.created_at AS "recordingTimestamp",
  scores.scores,
  suggestions.suggestion_content
FROM
  ai_interview_coach_prod_job_questions questions
  JOIN ai_interview_coach_prod_job_question_answers answers
    ON questions.id = answers.question_id
  LEFT JOIN (
    SELECT DISTINCT ON (answer_id) *
    FROM ai_interview_coach_prod_answer_scores
    ORDER BY answer_id, created_at DESC
  ) scores
    ON answers.id = scores.answer_id
  LEFT JOIN (
    SELECT DISTINCT ON (answer_id) *
    FROM ai_interview_coach_prod_suggestions
    ORDER BY answer_id, created_at DESC
  ) suggestions
    ON answers.id = suggestions.answer_id
WHERE
  questions.profile_id = ${profileId}
  AND answers.profile_id = ${profileId}
ORDER BY
  questions.id ASC,
  answers.created_at DESC;
    `
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

