import { getTable } from "@/lib/db"
import { sql } from '@vercel/postgres'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const { profileId, mode, interviewId, category, checkOnly } = Object.fromEntries(searchParams)

  if (!profileId) {
    return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
  }

  let result
  const questions = getTable('questions')
  const answers = getTable('answers')
  // const feedback = getTable('feedback')
  const scores = getTable('scores')
  //  if (mode === 'demo') {
  //   const query = `
  //     SELECT
  //       questions.id AS "questionId",
  //       questions.category,
  //       questions.question,
  //       questions.why,
  //       questions.focus,
  //       answers.id AS "answerId",
  //       answers.answer,
  //       answers.created_at AS "recordingTimestamp",
  //       scores.scores,
  //       feedback.feedback
  //     FROM
  //       ${questions} questions
  //       JOIN ${answers} answers
  //         ON questions.id = answers.question_id
  //       LEFT JOIN (
  //         SELECT DISTINCT ON (answer_id) *
  //         FROM ${scores}
  //         ORDER BY answer_id, created_at DESC
  //       ) scores
  //         ON answers.id = scores.answer_id
  //       LEFT JOIN (
  //         SELECT DISTINCT ON (answer_id) *
  //         FROM ${feedback}
  //         ORDER BY answer_id, created_at DESC
  //       ) feedback
  //         ON answers.id = feedback.answer_id
  //     WHERE
  //       questions.profile_id = $1
  //       AND answers.profile_id = $1
  //     ORDER BY
  //       questions.id ASC,
  //       answers.created_at DESC
  //   `;
  //   result = await sql.query(query, [profileId])
  //  }
   if (checkOnly) {
    const query = `
      SELECT COUNT(*)
      FROM ${questions}
      WHERE profile_id = $1
      AND interview_id = $2
    `;
    result = await sql.query(query, [profileId, interviewId])
    return NextResponse.json({ count: result.rows[0].count })
   } else {
     const query = `
       SELECT
         questions.id AS "questionId",
         questions.category,
         questions.question,
         questions.why,
         questions.focus,
         questions.example_answer as "exampleAnswer",
         answers.id AS "answerId",
         answers.answer,
         answers.created_at AS "recordingTimestamp",
         scores.scores
       FROM ${questions} questions
       LEFT OUTER JOIN ${answers} answers
         ON questions.id = answers.question_id
         AND answers.profile_id = $1
         AND answers.interview_id = $2
       LEFT JOIN (
          SELECT DISTINCT ON (answer_id) *
          FROM ${scores}
          ORDER BY answer_id, created_at DESC
        ) scores
          ON answers.id = scores.answer_id
       WHERE questions.profile_id = $1
       AND questions.interview_id = $2
       ${category ? 'AND questions.category = $3' : ''}
       ORDER BY questions.id ASC
     `

     result = await sql.query(query, [profileId, interviewId, ...(category ? [category] : [])])
  }

  return NextResponse.json(result.rows)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    profileId,
    interviewId,
    question,
  } = body


  console.log('server profileId:', profileId)
  console.log('server interviewId:', interviewId)
  console.log('server question:', question)

  const table = getTable('questions')
  const query = `
    INSERT INTO ${table}
      (profile_id, interview_id, question)
    VALUES
      ($1, $2, $3)
    RETURNING id
  `
  const result = await sql.query(query, [profileId, interviewId, question])

  return NextResponse.json({ id: result.rows[0].id });
}