import { getTable } from "@/lib/db";
import { sql } from "@vercel/postgres";

export async function createProfile(
  user_id: number
): Promise<number> {
  try {
    const table = getTable('profiles');
    const result = await sql.query(`
      INSERT INTO ${table} (user_id)
      VALUES (${user_id})
      RETURNING id
    `);
    return result.rows[0].id;
  } catch (error) {
    console.error('Error creating user record:', error);
    throw error;
  }
}
