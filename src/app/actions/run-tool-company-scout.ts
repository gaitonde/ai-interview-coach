import { getTable } from '@/lib/db';
import { sql } from '@vercel/postgres';
import { ToolInput } from "@/app/actions/tool-input";

export async function runPostProcess(
  input: ToolInput,
  content: string,
): Promise<void> {
  try {
    console.log('content: ', content);
    console.log('input');
    const { profileId, interviewId } = input;

    if (!content || !profileId || !interviewId) {
      throw new Error('content and profileId and interviewId are required');
    }

    const companyMatch = content?.match(/\*\*Company\*\*:\s*([^\n]*)/)
    const companyName = companyMatch ? companyMatch[1].trim() : null
    const roleMatch = content?.match(/\*\*Position\*\*:\s*([^\n]*)/)
    const roleName = roleMatch ? roleMatch[1].trim() : null

    const interviewsTable = getTable('interviews');
    const query2 = `
      UPDATE ${interviewsTable}
      SET company_name = $1, role_name = $2
      WHERE profile_id = $3
      AND id = $4;
    `;
    await sql.query(query2, [companyName, roleName, profileId, interviewId]);


  } catch (error) {
      console.error('Error creating user record:', error)
  }
}


