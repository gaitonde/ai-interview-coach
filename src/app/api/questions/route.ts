import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getTable } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get('profileId');
  const mode = searchParams.get('mode');

  if (!profileId) {
    return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
  }

  let result;
  const JOBS_TABLE = getTable('ai_interview_coach_prod_job_questions');
  if (mode === 'demo') {
    const ANSWERS_TABLE = getTable('ai_interview_coach_prod_job_question_answers');
    const SCORES_TABLE = getTable('ai_interview_coach_prod_answer_scores');
    const SUGGESTIONS_TABLE = getTable('ai_interview_coach_prod_suggestions');
    const query = `
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
        ${JOBS_TABLE} questions
        JOIN ${ANSWERS_TABLE} answers
          ON questions.id = answers.question_id
        LEFT JOIN (
          SELECT DISTINCT ON (answer_id) *
          FROM ${SCORES_TABLE}
          ORDER BY answer_id, created_at DESC
        ) scores
          ON answers.id = scores.answer_id
        LEFT JOIN (
          SELECT DISTINCT ON (answer_id) *
          FROM ${SUGGESTIONS_TABLE}
          ORDER BY answer_id, created_at DESC
        ) suggestions
          ON answers.id = suggestions.answer_id
      WHERE
        questions.profile_id = $1
        AND answers.profile_id = $1
      ORDER BY
        questions.id ASC,
        answers.created_at DESC
    `;
    result = await sql.query(query, [profileId]);
  } else {
    const query = `
      SELECT
        id,
        category,
        question,
        why,
        focus
      FROM ${JOBS_TABLE}
      WHERE profile_id = $1
      ORDER BY id ASC
    `;
    result = await sql.query(query, [profileId]);
  }

  return NextResponse.json(result.rows);
}

