import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PromptData } from "../utils/fetchPrompt";
import { fetchPrompt } from "../utils/fetchPrompt";
import { sql } from '@vercel/postgres';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RubricScores {
  thesisClarity: number;
  organization: number;
  supportEvidence: number;
  pacingPausing: number;
  volumeClarity: number;
  vocalVariety: number;
  grammarSyntax: number;
  appropriateness: number;
  wordChoiceRhetoric: number;
}

interface ScoringResult {
  contentAndStructure: {
    thesisClarity: number;
    organization: number;
    supportEvidence: number;
    total: number;
  };
  deliveryAndVocalControl: {
    pacingPausing: number;
    volumeClarity: number;
    vocalVariety: number;
    total: number;
  };
  languageUseAndStyle: {
    grammarSyntax: number;
    appropriateness: number;
    wordChoiceRhetoric: number;
    total: number;
  };
  finalScore: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profileId, questionId, transcription } = body;

    if (!transcription) {
      return NextResponse.json({ error: 'Transcription is required' }, { status: 400 });
    }

    const promptData: PromptData = await fetchPrompt(profileId, 'prompt-answer-score');
    promptData.userPrompt = promptData.userPrompt.replace('${transcription}', transcription);

    const completion = await openai.chat.completions.create({
      model: promptData.model,//"gpt-4o-mini-2024-07-18",
      messages: [
        { role: "system", content: promptData.systemPrompt },
        { role: "user", content: promptData.userPrompt }
      ],
      max_completion_tokens: promptData.maxCompletionTokens,
      temperature: promptData.temperature,
    });


    console.log('XXX AI SCORE completion: ', completion.choices[0].message.content);
    const aiScores = completion.choices[0].message.content?.split(',').map(Number);

    if (!aiScores || aiScores.length !== 9) {
      throw new Error('Invalid AI response');
    }

    const rubricScores: RubricScores = {
      thesisClarity: aiScores[0],
      organization: aiScores[1],
      supportEvidence: aiScores[2],
      pacingPausing: aiScores[3],
      volumeClarity: aiScores[4],
      vocalVariety: aiScores[5],
      grammarSyntax: aiScores[6],
      appropriateness: aiScores[7],
      wordChoiceRhetoric: aiScores[8],
    };

    // Calculate scores
    const contentAndStructure = {
      thesisClarity: rubricScores.thesisClarity,
      organization: rubricScores.organization,
      supportEvidence: rubricScores.supportEvidence,
      total: 0
    };
    contentAndStructure.total = contentAndStructure.thesisClarity + contentAndStructure.organization + contentAndStructure.supportEvidence;

    const deliveryAndVocalControl = {
      pacingPausing: rubricScores.pacingPausing,
      volumeClarity: rubricScores.volumeClarity,
      vocalVariety: rubricScores.vocalVariety,
      total: 0
    };
    deliveryAndVocalControl.total = deliveryAndVocalControl.pacingPausing + deliveryAndVocalControl.volumeClarity + deliveryAndVocalControl.vocalVariety;

    const languageUseAndStyle = {
      grammarSyntax: rubricScores.grammarSyntax,
      appropriateness: rubricScores.appropriateness,
      wordChoiceRhetoric: rubricScores.wordChoiceRhetoric,
      total: 0
    };
    languageUseAndStyle.total = languageUseAndStyle.grammarSyntax + languageUseAndStyle.appropriateness + languageUseAndStyle.wordChoiceRhetoric;

    const finalScore = (
      (contentAndStructure.total / 30) * 0.4 +
      (deliveryAndVocalControl.total / 30) * 0.4 +
      (languageUseAndStyle.total / 30) * 0.2
    ) * 100;

    const result: ScoringResult = {
      contentAndStructure,
      deliveryAndVocalControl,
      languageUseAndStyle,
      finalScore: parseFloat((finalScore ?? 0).toFixed(2))
    };

    const json = NextResponse.json(result);
    const answerId = await insertAnswer(profileId, questionId, transcription);
    await insertScore(profileId, answerId, finalScore, result);

    return json;
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function insertAnswer(profileId: string, questionId: string, transcript: string) {
  const result = await sql`
    INSERT INTO ai_interview_coach_prod_job_question_answers 
    (profile_id, question_id, answer) 
    VALUES (${profileId}, ${questionId}, ${transcript}) 
    RETURNING id`;
  return result.rows[0].id;
}

async function insertScore(profileId: string, answerId: string, finalScore: number, scores: ScoringResult) {
  await sql`
  INSERT INTO ai_interview_coach_prod_answer_scores (profile_id, answer_id, total_score, scores)
  VALUES (${profileId}, ${answerId}, ${finalScore}, ${JSON.stringify(scores)})
  ON CONFLICT (profile_id, answer_id)
  DO UPDATE SET total_score = EXCLUDED.total_score, scores = EXCLUDED.scores;
`;
}
