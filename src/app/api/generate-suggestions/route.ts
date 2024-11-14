import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { fetchPrompt, PromptData } from "../utils/fetchPrompt";
import { sql } from "@vercel/postgres";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Suggestion {
  category: string;
  text: string;
}

export async function POST(req: NextRequest) {
  console.log('Generating suggestions...');
  try {
    const body = await req.json();
    //TODO: need better protection here
    const { profileId, questionId, answerId, categories } = body;

    if (!categories || !Array.isArray(categories)) {
      return NextResponse.json({ error: 'Categories are required and must be an array' }, { status: 400 });
    }

    if (!questionId || !answerId) {
      return NextResponse.json({ error: 'Question ID and Answer ID are required' }, { status: 400 });
    }

    console.log('PPP  IN generate-suggestions', profileId, questionId, answerId);

    const promptData: PromptData = await fetchPrompt(profileId, 'prompt-generate-suggestions', questionId, answerId);
    // const scoredCategories = categories.map(cat => `${cat.name}: ${cat.score}/10`).join('\n');
    // promptData.userPrompt = promptData.userPrompt.replace('${scoredCategories}', scoredCategories);

    // console.log('PPP  IN generate-suggestions system promptData', promptData.systemPrompt);
    console.log('PPP  IN generate-suggestions user promptData', promptData.userPrompt);

    const completion = await openai.chat.completions.create({
      model: promptData.model,
      messages: [
        { role: "system", content: promptData.systemPrompt },
        { role: "user", content: promptData.userPrompt }
      ],
      max_completion_tokens: promptData.maxCompletionTokens,
      temperature: promptData.temperature,
    });
    
    const suggestions = completion.choices[0]?.message?.content;
    // console.log('Suggestions :', suggestions);

    if (suggestions) {
      await sql`
        INSERT INTO ai_interview_coach_prod_suggestions 
        (profile_id, question_id, answer_id, suggestion_content)
        VALUES 
        (${profileId}, ${questionId}, ${answerId}, ${suggestions})
      `;
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}