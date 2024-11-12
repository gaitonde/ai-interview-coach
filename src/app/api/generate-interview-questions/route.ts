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
  console.log('VVV profileId: ', profileId);

  try {
    const promptData: PromptData = await fetchPrompt(profileId, 'prompt-questions');
    console.log('BBB promptData: ', promptData.systemPrompt);

    const completion = await openai.chat.completions.create({
      model: promptData.model,
      messages: [
        { role: "system", content: promptData.systemPrompt },
        { role: "user", content: promptData.userPrompt }
      ],
      max_completion_tokens: promptData.maxCompletionTokens,
      temperature: promptData.temperature,
    });
    
    console.log('VVV completion: ', completion);

    const generatedContent = completion.choices[0]?.message?.content?.replace('```json', '').replace('```', '');

    console.log('XXX generatedContent: ', generatedContent);

    const questionsJson = JSON.parse(generatedContent || '{}');
    console.log('XXX123 questions: ', questionsJson);
    
    for (const questionJson of questionsJson) {
      console.log('XXX123 questionJson: ', questionJson);
      const category = questionJson.category;
      console.log('XXX123 category: ', category);
      const questions = questionJson.questions;
      console.log('XXX123 questions: ', questions);
      
      for (const question of questions) {
        // Clean and sanitize the question text
        const sanitizedQuestion = question.question.replace(/'/g, "''");
        console.log('XXX123 sanitizedQuestion: ', sanitizedQuestion);
        console.log('XXX123 question.why: ', question.why);
        console.log('XXX123 question.focus: ', question.focus);
        
        await sql`
          INSERT INTO ai_interview_coach_prod_job_questions 
            (profile_id, category, question, why, focus)
          VALUES 
            (${profileId}, ${category}, ${sanitizedQuestion}, ${question.why}, ${question.focus})
        `;
      }
    }

    // console.log('in BE with questions response: ', generatedContent);
    return NextResponse.json({ content: generatedContent });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ content: "unable to get content" }, { status: 500 });
  }
}
