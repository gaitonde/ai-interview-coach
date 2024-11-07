import { sql } from '@vercel/postgres';
import { NextResponse } from "next/server";
import { getPageContent } from '@/services/browserService';
import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';
import { JSDOM } from 'jsdom';

export async function GET() {
  const jobs = await sql`SELECT * FROM ai_interview_coach_prod_jobs`;
  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  const body = await request.json();
  const profileId = body.profileId;
  const company_url = body.company_url;
  const jd_url = body.jd_url;

  const company_md = await fetchUrlContents(company_url);
  const jd_md = await fetchUrlContents(jd_url);

  const jobs = await sql`INSERT INTO
  ai_interview_coach_prod_jobs (
    profile_id,
    company_url,
    company_text,
    jd_url,
    jd_text
  )
  VALUES (
    ${profileId},
    ${company_url},
    ${company_md},
    ${jd_url},
    ${jd_md}
  )`;

  return NextResponse.json(jobs);
}

async function fetchUrlContents(url: string): Promise<string> {
  console.log('url', url);

  // Get HTML content using the browser service
  const html = await getPageContent(url);
  console.log('html', html);

  // Create virtual DOM
  const dom = new JSDOM(html);
  const document = dom.window.document;

  console.log('document', document);

  // Use Readability to parse the main content
  const reader = new Readability(document);
  const article = reader.parse();

  if (!article) {
    throw new Error('Failed to parse article content');
  }

  // Convert HTML to Markdown
  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(article.content);

  return markdown;
}