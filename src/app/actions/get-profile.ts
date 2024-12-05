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