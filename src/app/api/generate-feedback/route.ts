import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { fetchPrompt, PromptData } from "../utils/fetchPrompt";
import { sql } from "@vercel/postgres";
import { getTable } from "@/lib/db";
import { upsertOutOfDateReadinessRecord } from '../utils/readiness'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  console.log('Generating feedback...');
  try {
    const body = await req.json();
    //TODO: need better protection here
    const { profileId, interviewId, questionId, answerId, categories } = body;

    if (!categories || !Array.isArray(categories)) {
      return NextResponse.json({ error: 'Categories are required and must be an array' }, { status: 400 });
    }

    if (!questionId || !answerId) {
      return NextResponse.json({ error: 'Question ID and Answer ID are required' }, { status: 400 });
    }

    console.log('IN generate-feedback', profileId, questionId, answerId);

    const promptData: PromptData = await fetchPrompt(profileId, 'prompt-generate-feedback', interviewId, questionId, answerId);
    // const scoredCategories = categories.map(cat => `${cat.name}: ${cat.score}/10`).join('\n');
    // promptData.userPrompt = promptData.userPrompt.replace('${scoredCategories}', scoredCategories);

    console.log('IN generate-feedback user promptData', promptData.userPrompt);

    const completion = await openai.chat.completions.create({
      model: promptData.model,
      messages: [
        { role: "system", content: promptData.systemPrompt },
        { role: "user", content: promptData.userPrompt }
      ],
      max_completion_tokens: promptData.maxCompletionTokens,
      temperature: promptData.temperature,
    });

    const feedback = completion.choices[0]?.message?.content;

    if (feedback) {
      const table = getTable('feedback');
      const query = `
        INSERT INTO ${table}
        (profile_id, interview_id, question_id, answer_id, feedback)
        VALUES
        ($1, $2, $3, $4, $5)
      `;
      await sql.query(query, [profileId, interviewId, questionId, answerId, feedback]);

      // Update readiness records to mark them as out of date
      const table2 = getTable('questions')
      console.log('table2', table2)
      console.log('XX questionId', questionId)
      const query2 = `
        SELECT category FROM ${table2} WHERE id = $1
      `
      const questionCategory = await sql.query(query2, [questionId]);
      console.log('XX questionCategory', questionCategory, questionId)

      await upsertOutOfDateReadinessRecord(profileId, interviewId, questionCategory.rows[0].category);
    }

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}