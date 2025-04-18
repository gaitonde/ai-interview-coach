// import { insertQuestions, deleteAllQuestions } from "@/app/actions";
import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { sql } from '@vercel/postgres';
import { getTable } from "@/lib/db";

let serviceAccountAuth: JWT | null = null;

function getServiceAccountAuth(): JWT {
  if (!serviceAccountAuth) {
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('Missing Google service account credentials');
    }
    serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }
  return serviceAccountAuth;
}

//NOTE: this is kinda ok, because it's just a trigger to go out and fetch data from Google Sheets
//TODO: could do more/better validation to ensure the request is valid
export async function GET() {
  console.log('in google sheets to prompts webhook')
  console.log('GOOGLE_SHEET_ID', process.env.GOOGLE_SHEET_ID);

  try {
    const auth = getServiceAccountAuth();
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID as string, auth);
    await doc.loadInfo();

    const title = (process.env.VERCEL_ENV === 'production') ? 'Prompts' : 'Prompts-preview';
    console.log('Getting prompts from this sheet: ', title);

    const sheet = doc.sheetsByTitle[title];
    const rows = await sheet.getRows();
    const prompts = [];

    await deleteAllPrompts();

    //key	model	temperature	max_completion_tokens	system prompt	user prompt
    for(const row of rows) {
      const promptData = {
        id: row.rowNumber - 1,
        key: row.get('key'),
        model: row.get('model'),
        temperature: row.get('temperature') as number,
        max_completion_tokens: row.get('max_completion_tokens') as number,
        system_prompt: row.get('system prompt'),
        user_prompt: row.get('user prompt')
      };
      console.log('prompt key: ', promptData.key);
      // skip row if there is no prompt key; means it's not ready
      if (promptData.key) {
        console.log('adding row', row.rowNumber);
        await insertPrompt(promptData);
        prompts.push(promptData);
      }
    }

    return NextResponse.json({
      success: true,
      // prompts: prompts,
      count: prompts.length,
      title: sheet.title,
      sheetId: sheet.sheetId,
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      error: error,
      sheetId: process.env.GOOGLE_SHEET_ID
    }, { status: 500 })
  }
}

async function deleteAllPrompts() {
  const TABLE = getTable('prompts');
  await sql.query(`DELETE FROM ${TABLE}`);
}

async function insertPrompt(prompt: any) {
  const table = getTable('prompts');
  const query = `
    INSERT INTO "${table}"
    (id, key, model, temperature, max_completion_tokens, system_prompt, user_prompt)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `;

  const values = [
    prompt.id,
    prompt.key,
    prompt.model,
    prompt.temperature,
    prompt.max_completion_tokens,
    prompt.system_prompt,
    prompt.user_prompt
  ];

  await sql.query(query, values);
}

// async function insertPrompts(prompts: any[]) {
//   console.log('inserting prompts.length: ', prompts.length);
//
//   if (prompts.length === 0) {
//     console.log('No prompts to insert');
//     return;
//   }
//
//   const values = prompts.map((_, index) =>
//     `($${index * 7 + 1}, $${index * 7 + 2}, $${index * 7 + 3}, $${index * 7 + 4}, $${index * 7 + 5}, $${index * 7 + 6}, $${index * 7 + 7})`
//   ).join(', ');
//
//   console.debug('values: ', values);
//
//   const flattenedValues = prompts.flatMap(prompt => [
//     prompt.id,
//     prompt.key,
//     prompt.model,
//     prompt.temperature,
//     prompt.max_completion_tokens,
//     prompt.system_prompt,
//     prompt.user_prompt
//   ]);
//
//   console.debug('flattenedValues: ', flattenedValues);
//
//   const TABLE = getTable('prompts');
//
//   const query = `
//     INSERT INTO ${TABLE} (
//       id,
//       key,
//       model,
//       temperature,
//       max_completion_tokens,
//       system_prompt,
//       user_prompt
//     ) VALUES ${values}
//   `;
//
//   console.debug('query: ', query);
//
//   try {
//     const result = await sql.query(query, flattenedValues);
//     console.log(`Successfully inserted ${result.rowCount} prompts`);
//   } catch (error) {
//     console.error('Error inserting prompts:', error);
//     console.error('Query:', query);
//     console.error('Values:', flattenedValues);
//     throw error;
//   }
// }
