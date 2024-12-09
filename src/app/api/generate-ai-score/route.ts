import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PromptData } from "../utils/fetchPrompt";
import { fetchPrompt } from "../utils/fetchPrompt";
import { sql } from '@vercel/postgres';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RubricScores {
  foundationalKnowledge: number;
  problemSolvingAndLearningPotential: number;
  behavioralAndSoftSkills: number;
  culturalFitAndMotivation: number;
  initiativeAndLeadershipPotential: number;
  starMethodAdherence: number;
  confidenceAndProfessionalism: number;
}

interface ScoringResult {
  foundationalKnowledge: number;
  problemSolvingAndLearningPotential: number;
  behavioralAndSoftSkills: number;
  culturalFitAndMotivation: number;
  initiativeAndLeadershipPotential: number;
  starMethodAdherence: number;
  confidenceAndProfessionalism: number;
  finalScore: number;
  averageScore: number;
}

export async function POST(req: NextRequest) {
  console.log('IN generate-ai-score');
  try {
    const body = await req.json();
    const { profileId, questionId, answerId } = body;

    if (!questionId || !answerId) {
      return NextResponse.json({ error: 'Question ID and Answer ID are required' }, { status: 400 });
    }

    console.log('PPP  IN generate-ai-score fetchPrompt', questionId, answerId);
    const promptData: PromptData = await fetchPrompt(profileId, 'prompt-answer-score', questionId, answerId);
    console.log('IN generate-ai-score promptData');

    const completion = await openai.chat.completions.create({
      model: promptData.model,
      messages: [
        { role: "system", content: promptData.systemPrompt },
        { role: "user", content: promptData.userPrompt }
      ],
      max_completion_tokens: promptData.maxCompletionTokens,
      temperature: promptData.temperature,
    });


    console.log('XXX AI SCORE completion: ', completion.choices[0].message.content);
    const aiScores = completion.choices[0].message.content?.split(',').map(Number);

    if (!aiScores || aiScores.length !== 7) {
      throw new Error('Invalid AI response');
    }

    const finalScore = aiScores.reduce((sum, score) => sum + score, 0);
    const averageScore = finalScore / aiScores.length;

    const rubricScores: RubricScores = {
      foundationalKnowledge: aiScores[0],
      problemSolvingAndLearningPotential: aiScores[1],
      behavioralAndSoftSkills: aiScores[2],
      culturalFitAndMotivation: aiScores[3],
      initiativeAndLeadershipPotential: aiScores[4],
      starMethodAdherence: aiScores[5],
      confidenceAndProfessionalism: aiScores[6],
    };


    const result: ScoringResult = {
      foundationalKnowledge: rubricScores.foundationalKnowledge,
      problemSolvingAndLearningPotential: rubricScores.problemSolvingAndLearningPotential,
      behavioralAndSoftSkills: rubricScores.behavioralAndSoftSkills,
      culturalFitAndMotivation: rubricScores.culturalFitAndMotivation,
      initiativeAndLeadershipPotential: rubricScores.initiativeAndLeadershipPotential,
      starMethodAdherence: rubricScores.starMethodAdherence,
      confidenceAndProfessionalism: rubricScores.confidenceAndProfessionalism,
      finalScore: parseFloat((finalScore ?? 0).toFixed(2)),
      averageScore: parseFloat((averageScore ?? 0).toFixed(2))
    };

    const json = NextResponse.json(result);
    // const answerId = await insertAnswer(profileId, questionId, transcription);
    await insertScore(profileId, answerId, finalScore, result);

    return json;
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



async function insertScore(profileId: string, answerId: string, finalScore: number, scores: ScoringResult) {
  await sql`
  INSERT INTO ai_interview_coach_prod_answer_scores (profile_id, answer_id, total_score, scores)
  VALUES (${profileId}, ${answerId}, ${finalScore}, ${JSON.stringify(scores)})
  ON CONFLICT (profile_id, answer_id)
  DO UPDATE SET total_score = EXCLUDED.total_score, scores = EXCLUDED.scores;
`;
}
