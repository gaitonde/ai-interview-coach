// import { insertQuestions, deleteAllQuestions } from "@/app/actions";
import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { sql } from '@vercel/postgres';

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

    const sheet = doc.sheetsByTitle['Prompts'];
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
      prompts.push(promptData);      

    }
    insertPrompts(prompts);

    return NextResponse.json({
      success: true,
      prompts: prompts,
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
  await sql`DELETE FROM ai_interview_coach_prod_prompts`;
}

async function insertPrompts(prompts: any[]) {
  for(const prompt of prompts) {
    console.log('inserting prompt id: ', prompt.id);
    console.log('inserting prompt key: ', prompt.key);
    await sql`INSERT INTO ai_interview_coach_prod_prompts (
      id, 
      key, 
      model, 
      temperature, 
      max_completion_tokens, 
      system_prompt, 
      user_prompt
    ) VALUES (
      ${prompt.id}, 
      ${prompt.key}, 
      ${prompt.model}, 
      ${prompt.temperature}, 
      ${prompt.max_completion_tokens}, 
      ${prompt.system_prompt}, 
      ${prompt.user_prompt}
    )`;
  }
}
