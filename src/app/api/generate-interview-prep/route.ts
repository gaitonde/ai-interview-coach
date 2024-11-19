import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { sql } from '@vercel/postgres';
import { fetchPrompt, PromptData } from "../utils/fetchPrompt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  console.log('in BE with request for generating questions');
  const body = await request.json();
  const profileId = body.profileId;

  try {
    const promptData: PromptData = await fetchPrompt(profileId, 'prompt-interview-prep');

    const completion = await openai.chat.completions.create({
      model: promptData.model,
      messages: [
        { role: "system", content: promptData.systemPrompt },
        { role: "user", content: promptData.userPrompt }
      ],
      max_completion_tokens: promptData.maxCompletionTokens,
      temperature: promptData.temperature,
    });
    
    const generatedContent = completion.choices[0]?.message?.content; //?.replace('```json', '').replace('```', '');

    // Upsert operation for questions_response
    await sql`
      INSERT INTO ai_interview_coach_prod_airesponses (profile_id, questions_response)
      VALUES (${profileId}, ${generatedContent})
      ON CONFLICT (profile_id)
      DO UPDATE SET questions_response = EXCLUDED.questions_response;
    `;
    
    return NextResponse.json({ content: generatedContent });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ content: "unable to get content" }, { status: 500 });
  }
}
