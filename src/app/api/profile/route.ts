import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { email, school, major, concentration, graduation_year } = json;

    // Convert graduation_year String to a Date with Jan 1
    const graduation_date = new Date(`1/1/${graduation_year}`);
    const profileId = await createProfile(email, school, major, concentration, graduation_date);

    return NextResponse.json({ success: true, profileId });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ content: "unable to add profile" }, { status: 500 });
  }
}

async function createProfile(
  email: string,
  school: string,
  major: string,
  concentration: string,
  graduation_date: Date
): Promise<number> {
  try {
    const result = await sql`
      INSERT INTO ai_interview_coach_prod_profiles (email, school, major, concentration, graduation_date)
      VALUES (${email}, ${school}, ${major}, ${concentration}, ${graduation_date.toISOString()})
      RETURNING id
    `;
    return result.rows[0].id;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

// async function clearAiResponses() {
//   try {
//     await sql`DELETE FROM ai_interview_coach_prod_airesponses WHERE profile_id = 1`;
//   } catch (error) {
//     console.error('Error clearing AI responses:', error);
//   }
// }
