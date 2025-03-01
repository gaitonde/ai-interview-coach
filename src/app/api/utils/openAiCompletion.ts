import OpenAI from 'openai';
import { fetchPrompt, PromptData } from './fetchPrompt';
import { ChatCompletion } from 'openai/resources/chat/completions'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function genCompletion(promptData: PromptData): Promise<ChatCompletion> {
  const completion = await openai.chat.completions.create({
    model: promptData.model,
    messages: [
      { role: "system", content: promptData.systemPrompt },
      { role: "user", content: promptData.userPrompt }
    ],
    max_completion_tokens: promptData.maxCompletionTokens,
    temperature: promptData.temperature,
  });

  return completion
}

export async function generateCompletion(profileId: string, promptKey: string, interviewId?: string, questionId?: string, answerId?: string, content?: string) {
  const promptData: PromptData = await fetchPrompt(profileId, promptKey, interviewId, undefined, undefined, content);

  console.log('XX1: promptData.userPrompt', promptData.userPrompt)
  console.log('XX1: promptData.systemPrompt', promptData.systemPrompt)
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

export async function runAI(promptKey: string, profileId: string, interviewId?: string, questionId?: string) {
  const promptData: PromptData = await fetchPrompt(profileId, promptKey, interviewId, questionId, undefined, undefined);

  console.log(`${promptKey} : userPrompt after var sub: ${promptData.userPrompt}`)
  console.log(`${promptKey} : systemPrompt after var sub: ${promptData.systemPrompt}`)

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