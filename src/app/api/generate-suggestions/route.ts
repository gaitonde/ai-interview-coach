import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { fetchPrompt, PromptData } from "../utils/fetchPrompt";

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
    const { profileId, categories } = body;

    if (!categories || !Array.isArray(categories)) {
      return NextResponse.json({ error: 'Categories are required and must be an array' }, { status: 400 });
    }

    const promptData: PromptData = await fetchPrompt(profileId, 'prompt-generate-suggestions');
    const scoredCategories = categories.map(cat => `${cat.name}: ${cat.score}/10`).join('\n');
    promptData.userPrompt = promptData.userPrompt.replace('${scoredCategories}', scoredCategories);

    const completion = await openai.chat.completions.create({
      model: promptData.model,
      messages: [
        { role: "system", content: promptData.systemPrompt },
        { role: "user", content: promptData.userPrompt }
      ],
      max_completion_tokens: promptData.maxCompletionTokens,
      temperature: promptData.temperature,
    });
    
    const suggestionsText = completion.choices[0]?.message?.content?.replaceAll('```json', '').replaceAll('```', '');
    let suggestions: Suggestion[];

    try {
      suggestions = JSON.parse(suggestionsText || '[]');
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      return NextResponse.json({ error: 'Invalid response from AI' }, { status: 500 });
    }

    // Ensure we have no more than 5 suggestions
    suggestions = suggestions.slice(0, 5);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}