import OpenAI from 'openai';
import { fetchPrompt, PromptData } from './fetchPrompt';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCompletion(profileId: string, promptKey: string, content?: string) {
  const promptData: PromptData = await fetchPrompt(profileId, promptKey, content);

  const completion = await openai.chat.completions.create({
    model: promptData.model,
    messages: [
      { role: "system", content: promptData.systemPrompt },
      { role: "user", content: promptData.userPrompt }
    ],
    max_completion_tokens: promptData.maxCompletionTokens,
    temperature: promptData.temperature,
  });

  return {
    content: completion.choices[0]?.message?.content,
    usage: JSON.stringify(completion.usage)
  };
}