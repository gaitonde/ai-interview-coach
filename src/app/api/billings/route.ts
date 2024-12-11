import { NextRequest, NextResponse } from "next/server"

import { getAvailableInterviews } from "@/app/actions/get-available-interviews"

export async function GET(request: NextRequest) {
  const profileId = request.nextUrl.searchParams.get('profileId')
  if (!profileId) {
    return NextResponse.json({ error: 'profileId is required' }, { status: 400 })
  }
  const interviewsAvailable = await getAvailableInterviews(profileId)
  return NextResponse.json(interviewsAvailable)
}
