import { runPostProcess as runToolCompanyScout } from '@/app/actions/run-tool-company-scout';
import { ToolInput } from '@/app/actions/tool-input';
import { runAI } from '@/app/api/utils/openAiCompletion';
import { getTable } from '@/lib/db';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

// Define a type for post-processor functions
type PostProcessor = (input: ToolInput, content: string) => Promise<void>;

// Create a registry of post-processors
const postProcessors: Record<string, PostProcessor> = {
  'company-scout': runToolCompanyScout,
  // Add more processors as needed:
  // 'y': runToolY,
  // 'z': runToolZ,
};

export async function POST(request: Request) {
  const body = await request.json();
  const { toolName, profileId, interviewId, questionId } = body;

  if (!toolName || !profileId) {
    return NextResponse.json({ error: 'toolName, profileId are required' }, { status: 400 });
  }

  const content = await runAIAndStoreResults(toolName, profileId, interviewId, questionId);

  if (!content) {
    return NextResponse.json({ error: 'Sorry, there was an issue. Not able to run this tool at this time.' }, { status: 400 });
  }

  // Run post-processor if one exists for this tool
  const postProcessor = postProcessors[toolName];
  if (postProcessor && content) {
    await postProcessor({ profileId, interviewId }, content);
  }

  console.log('tool output: ', content)

  return NextResponse.json({ content })
}

async function runAIAndStoreResults(toolName: string, profileId: string, interviewId?: string, questionId?: string) {
  console.log('in new POST tool:', toolName, questionId)

  const promptKey = `prompt-tools-${toolName}`;
  try {
    const { content, usage } = await runAI(promptKey, profileId, interviewId, questionId)
    const table = getTable('tool_responses')
    const query = `
      INSERT INTO ${table} (profile_id, tool_name, content, usage)
      VALUES ($1, $2, $3, $4)
    `

    await sql.query(query, [profileId, toolName, content, usage])
    return content;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }

}

// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams
//     const { profileId, interviewId, tool } = Object.fromEntries(searchParams.entries())

//     if (!profileId || !tool) {
//       return NextResponse.json({ error: 'Profile ID and Interview ID AND slug are required' }, { status: 400 });
//     }

//     const table = getTable('tool_responses');

//     const underscore_slug = tool.replace(/-/g, '_');
//     // const column = `generated_${underscore_slug}`;

//     const query = `
//       SELECT content
//       FROM ${table}
//       WHERE profile_id = $1
//       ORDER BY created_at DESC
//       LIMIT 1
//     `;

//     const result = await sql.query(query, [profileId, interviewId])
//     if (result.rows.length === 0) {
//       return NextResponse.json({ error: 'Not found' }, { status: 404 });
//     } else {
//       return NextResponse.json({ content: result.rows[0].content })
//     }
//   } catch (error) {
//     console.error('Error fetching prep sheet response:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }