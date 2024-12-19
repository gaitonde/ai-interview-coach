
export async function updateFreeInterviews(email: string, numFreeInterviews: number) {
  try {
    const response = await fetch(`/api/free-interviews`, {
        method: 'POST',
        body: JSON.stringify({ email, numFreeInterviews }),
      }
    )
    const json = await response.json()
    return { success: json.updated }
  } catch (error) {
    console.error('Error updating free interviews:', error)
    throw error
  }
}