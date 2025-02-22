import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { sql } from '@vercel/postgres'
import { fetchPrompt, PromptData } from '../utils/fetchPrompt'
import { getTable } from '@/lib/db'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const { profileId, interviewId, slug } = Object.fromEntries(searchParams.entries())

    if (!profileId || !interviewId || !slug) {
      return NextResponse.json({ error: 'Profile ID and Interview ID AND slug are required' }, { status: 400 });
    }

    const table = getTable('airesponses');

    const underscore_slug = slug.replace(/-/g, '_');
    const column = `generated_${underscore_slug}`;

    const query = `
      SELECT ${column} as content
      FROM ${table}
      WHERE profile_id = $1
      AND interview_id = $2
      ORDER BY created_at DESC
      LIMIT 1
    `;

    const result = await sql.query(query, [profileId, interviewId])
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    } else {
      return NextResponse.json({ content: result.rows[0].content })
    }
  } catch (error) {
    console.error('Error fetching prep sheet response:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


export async function POST(request: Request) {
  console.log('in new POST')
  const body = await request.json();
  const { profileId, interviewId, slug } = body;
  console.log('in new POST slug:', slug)

  //prompt-tools-interview-questions-predictor
  //prompt-tools-interview-question-predictor
  const promptKey = `prompt-tools-${slug}`;
  try {
    const promptData: PromptData = await fetchPrompt(profileId, promptKey, interviewId)

    const completion = await openai.chat.completions.create({
      model: promptData.model,
      messages: [
        { role: "system", content: promptData.systemPrompt },
        { role: "user", content: promptData.userPrompt }
      ],
      max_completion_tokens: promptData.maxCompletionTokens,
      temperature: promptData.temperature,
    })

    const generatedContent = completion.choices[0]?.message?.content

    const underscore_slug = slug.replace(/-/g, '_');
    const column = `generated_${underscore_slug}`;

    // Modified upsert operation
    const table = getTable('airesponses')
    const query = `
      WITH upsert AS (
        UPDATE ${table}
        SET ${column} = $3
        WHERE profile_id = $1 AND interview_id = $2
        RETURNING *
      )
      INSERT INTO ${table} (profile_id, interview_id, ${column})
      SELECT $1, $2, $3
      WHERE NOT EXISTS (
        SELECT * FROM upsert
      )
    `
    await sql.query(query, [profileId, interviewId, generatedContent])

    return NextResponse.json({ content: generatedContent })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ content: "unable to get content" }, { status: 500 })
  }
}
