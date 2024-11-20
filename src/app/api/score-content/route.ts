import { NextResponse } from "next/server";
import { generateCompletion } from "../utils/openAiCompletion";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { profileId, promptKey, content } = json;

    if (!profileId || !promptKey || !content) {
      return NextResponse.json({ error: 'Profile ID, prompt key, and content are required' }, { status: 400 });
    }

    const { content: rubric } = await generateCompletion(profileId, promptKey, content);

    return NextResponse.json({ rubric });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ content: "unable to score prep sheet" }, { status: 500 });
  }
}