export async function getProfile(profileId: string) {
  try {
    const response = await fetch(`/api/profiles?profileId=${profileId}`)

    if (!response.ok) {
      return null
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching profile:', error)
    return null
  }
}