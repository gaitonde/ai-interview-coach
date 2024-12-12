import { getPromptByKey } from '@/lib/prompts'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key') ?? ''

    if (!key) {
      return NextResponse.json({ success: false, message: 'Key is required' }, { status: 400 })
    }

    const prompt = await getPromptByKey(key)

    if (!prompt) {
      return NextResponse.json({ success: false }, { status: 404 })
    } else {
      return NextResponse.json({ success: true, data: prompt })
    }

  } catch (error) {
    console.error('Error fetching prompts:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch prompts' }, { status: 500 })
  }
}
