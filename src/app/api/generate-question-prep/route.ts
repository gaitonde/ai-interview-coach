import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { fetchPrompt, PromptData } from '../utils/fetchPrompt'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET(request: NextRequest) {
  try {
    const { profileId, interviewId } = Object.fromEntries(request.nextUrl.searchParams)
    console.log('profileId', profileId)
    console.log('interviewId', interviewId)

    const content = await generateQuestionPrep(profileId)
    console.log('XXX content', content)
    return NextResponse.json({ content })

  } catch (error) {
    console.error('Interview Readiness Error:', error)
    return NextResponse.json({ content: "Unable to get Interview Readiness content" }, { status: 500 })
  }
}

async function generateQuestionPrep(profileId: string): Promise<string> {

  try {
    const promptData: PromptData = await fetchPrompt(profileId, `prompt-question-prep`)

    console.log('XXX promptData.userPrompt', promptData.userPrompt)

    const completion = await openai.chat.completions.create({
      model: promptData.model,
      messages: [
        { role: "system", content: promptData.systemPrompt },
        { role: "user", content: promptData.userPrompt }
      ],
      max_completion_tokens: promptData.maxCompletionTokens,
      temperature: promptData.temperature,
    })

    const generatedContent = completion.choices[0]?.message?.content
    console.log('generatedContent', generatedContent)
    return generatedContent || ''
  } catch (error) {
    console.error('Error generating initial readiness:', error)
    throw new Error('Unable to generate initial readiness')
  }

}

