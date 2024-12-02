

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const profileId = searchParams.get('profileId')
  const jobId = searchParams.get('jobId')
}
