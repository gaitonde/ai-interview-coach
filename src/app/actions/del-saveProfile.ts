'use server'

import { db } from '@/lib/db'

export async function saveProfile(formData: FormData) {
  // const graduation_month = formData.get('graduation-month')
  const graduation_year = formData.get('graduation-year')
  const graduation_date = `01-01-${graduation_year}`

  try {
    //Save to Profiles
    const result = await db.query(
      `INSERT INTO ai_interview_coach_prod_profiles
      (school, major, concentration, graduation_date)
      VALUES ($1, $2, $3, $4)
      RETURNING id`,
      [
        formData.get('school'),
        formData.get('major'),
        formData.get('concentration'),
        graduation_date
      ]
    )
    //Save to Jobs
    //Save to Resumes

    return { success: true, id: result.rows[0].id }
  } catch (error) {
    console.error("Error saving profile:", error)
    return { success: false, error: 'Failed to save profile' }
  }
}
