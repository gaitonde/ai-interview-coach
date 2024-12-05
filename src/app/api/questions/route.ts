import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getTable } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const { profileId, mode, interviewId, category } = Object.fromEntries(searchParams)

  if (!profileId) {
    return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
  }

  let result;
  const QUESTIONS_TABLE = getTable('questions');
  if (mode === 'demo') {
    const ANSWERS_TABLE = getTable('answers');
    const SCORES_TABLE = getTable('scores');
    const FEEDBACK_TABLE = getTable('feedback');
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
        feedback.feedback
      FROM
        ${QUESTIONS_TABLE} questions
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
          FROM ${FEEDBACK_TABLE}
          ORDER BY answer_id, created_at DESC
        ) feedback
          ON answers.id = feedback.answer_id
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
      FROM ${QUESTIONS_TABLE}
      WHERE profile_id = $1
      AND interview_id = $2
      ${category ? 'AND category = $3' : ''}
      ORDER BY id ASC
    `;
    result = await sql.query(query, [profileId, interviewId, ...(category ? [category] : [])]);
  }

  return NextResponse.json(result.rows);
}

