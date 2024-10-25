import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { fetchPrompt, PromptData } from '@/app/api/utils/fetchPrompt';
import { sql } from '@vercel/postgres';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  console.log('in BE with request for generating job-prep');
  const body = await request.json();
  const profileId = body.profileId;

  try {
    const promptData: PromptData = await fetchPrompt(profileId, 'prompt-job-prep');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        { role: "system", content: promptData.systemPrompt },
        { role: "user", content: promptData.userPrompt }
      ],
      max_completion_tokens: promptData.maxCompletionTokens,
      temperature: promptData.temperature,
    });

    const generatedContent = completion.choices[0]?.message?.content;

    await sql`
      INSERT INTO ai_interview_coach_prod_airesponses (profile_id, prep_sheet_response)
      VALUES (${profileId}, ${generatedContent})
      ON CONFLICT (profile_id)
      DO UPDATE SET prep_sheet_response = EXCLUDED.prep_sheet_response;
    `;

    return NextResponse.json({ content: generatedContent });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
