export async function getProfileX(profileId: String) {
  try {
    const response = await fetch(`/api/profiles?profileId=${profileId}`)

    if (!response.ok) {
      return null
    }

    const json = await response.json()
    const profile = json.profiles[0]
    return profile

  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}

export async function getProfileByUserId(userId: String) {
  try {
    const protocol = process.env.NEXT_PUBLIC_VERCEL_URL?.startsWith('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    const url = `${baseUrl}/api/profiles?userId=${userId}`
    console.log('TTT AAAXXX url', url)
    const response = await fetch(url)

    if (!response.ok) {
      return null
    }

    const json = await response.json()
    console.log('AAAXXX json', json)
    const profile = json.profile
    console.log('AAAXXX profile', profile)
    return profile

  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}