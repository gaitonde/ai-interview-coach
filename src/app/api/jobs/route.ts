import { sql } from '@vercel/postgres';
import { NextResponse } from "next/server";
import TurndownService from 'turndown';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const turndownService = new TurndownService();

export async function GET(request: Request) {
  console.log('IN jobs GET');
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get('profileId');
  const scope = searchParams.get('scope');

  if (!profileId) {
    return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
  }

  //TODO: fix dynamic columns
  // let columns: string;
  // if (interviewer) {
  //   columns = 'id, profile_id, interviewer_name, interviewer_role';
  // } else {
  //   columns = '*';
  // }
  // console.log('ZZZ profileId:', profileId);
  // console.log('ZZZ columns:', columns);

  
  // const queryText = `SELECT $1 FROM ai_interview_coach_prod_jobs WHERE profile_id = $2 ORDER BY id DESC LIMIT 1`;
  // const jobs = await sql.query(queryText, [columns, profileId]);

  const jobs = await sql`
    SELECT id, profile_id, interviewer_name, interviewer_role 
    FROM ai_interview_coach_prod_jobs 
    WHERE profile_id = ${profileId} 
    ORDER BY id DESC 
    LIMIT 1
  `;

  console.log('ZZZ jobs', jobs.rows[0]);

  if (jobs.rows.length < 1) {
    return NextResponse.json({ content: [] }, { status: 404 });
  } else {
    return NextResponse.json({ content: jobs.rows[0] });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { 
    profileId, 
    company_url, 
    jd_url, 
    interviewer_name, 
    interviewer_role 
  } = body;

  //TODO: do these url fetches async
  const company_md = await fetchUrlContents(company_url);
  const jd_md = await fetchUrlContents(jd_url);

  const jobs = await sql`INSERT INTO
  ai_interview_coach_prod_jobs (
    profile_id,
    company_url,
    company_text,
    jd_url,
    jd_text,
    interviewer_name,
    interviewer_role
  )
  VALUES (
    ${profileId},
    ${company_url},
    ${company_md},
    ${jd_url},
    ${jd_md},
    ${interviewer_name},
    ${interviewer_role}
  )`;

  return NextResponse.json(jobs);
}

async function fetchUrlContents(url: string): Promise<string> {
  console.log('url', url);

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    $('script').remove();  
    $('[onload], [onclick], [onmouseover], [onfocus], [onsubmit], [oninput]').each((_, element) => {
      Object.keys(element.attribs).forEach(attr => {
        if (attr.startsWith('on')) {
          $(element).removeAttr(attr);
        }
      });
    });
  
    // Get the cleaned HTML
    const cleanHtml = $('body').html();
    const markdown = turndownService.turndown(cleanHtml || '');
    return markdown;
  } catch (error) {
    console.error('Error in fetchUrlContents:', error);
    throw error;
  }
}