import { getTable } from "@/lib/db";
import { sql } from "@vercel/postgres";

export async function createProfile(
  email: string,
  clerk_id: string
): Promise<number> {
  try {
    const table = getTable('ai_interview_coach_prod_profiles');
    const result = await sql.query(`
      INSERT INTO ${table} (email, clerk_id)
      VALUES ('${email}', '${clerk_id}')
      RETURNING id
    `);
    return result.rows[0].id;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
}
