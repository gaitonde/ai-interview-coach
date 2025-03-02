import { getAvailableInterviews } from "@/app/actions/get-available-interviews"
import { getTable } from '@/lib/db'
import { sql } from '@vercel/postgres'
import * as cheerio from 'cheerio'
import { NextResponse } from "next/server"
import fetch from 'node-fetch'
import TurndownService from 'turndown'

const INTERVIEWS = getTable('interviews')

const turndownService = new TurndownService()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const profileId = searchParams.get('profileId')
  const interviewId = searchParams.get('interviewId')

  if (!profileId) {
    return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 })
  }

  if (searchParams.has('interviewId') && !interviewId) {
    return NextResponse.json({ error: 'Missing Interview ID' }, { status: 400 })
  }

  if (interviewId) {
    const query = `
    SELECT id, profile_id, company_name, company_url, role_name, jd_url, interviewer_name, interviewer_role, interviewer_linkedin_url, interview_date, readiness
    FROM ${INTERVIEWS}
    WHERE profile_id = $1
    AND id = $2
    ORDER BY id DESC
  `
    const interviews = await sql.query(query, [profileId, interviewId])
    return NextResponse.json({ content: interviews.rows[0] })
  } else {
    const query = `
    SELECT id, profile_id, company_name, company_url, role_name, jd_url, interviewer_name, interviewer_role, interviewer_linkedin_url, interview_date, readiness
    FROM ${INTERVIEWS}
    WHERE profile_id = $1
    ORDER BY id DESC
  `
    const interviews = await sql.query(query, [profileId])

    if (interviews.rows.length < 1) {
      return NextResponse.json({ content: [] })
    } else {
      return NextResponse.json({ content: interviews.rows })
    }
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const {
    profileId,
    company_url,
    jd_url,
    interviewer_linkedin_url,
    interviewer_role,
    interview_date,
    role_name
  } = body

  //TODO: how to properly handle the initial free interview case
  //Check if the user has enough interviews available
  const interviewsAvailable = await getAvailableInterviews(profileId)
  if (interviewsAvailable.interviewsAvailable < 0) {
    return NextResponse.json({ message: 'No interviews available' }, { status: 400 })
  }

  // Convert empty interview_date to null
  const formattedInterviewDate = interview_date === '' ? null : interview_date;

  //TODO: do these url fetches async
  const company_md = company_url ? await fetchUrlContents(company_url) : null;
  const jd_md = jd_url ? await fetchUrlContents(jd_url) : null;
  const interviewer_linkedin_md = interviewer_linkedin_url ? await fetchUrlContents(interviewer_linkedin_url) : null;

  const query = `
    INSERT INTO "${INTERVIEWS}" (
      profile_id,
      company_url,
      company_text,
      jd_url,
      jd_text,
      interviewer_linkedin_url,
      interviewer_linkedin_text,
      interviewer_role,
      interview_date,
      role_name
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id
  `;

  const values = [
    profileId,
    company_url,
    company_md,
    jd_url,
    jd_md,
    interviewer_linkedin_url,
    interviewer_linkedin_md,
    interviewer_role,
    formattedInterviewDate,
    role_name
  ];

  const interviews = await sql.query(query, values)
  const interviewId = interviews.rows[0].id

  // Insert interview readiness records for each category
  // const table = getTable('interview_readiness')
  // const categories = ['overall', 'behavioral', 'case', 'role', 'technical', ]

  // const readinessQuery = `
  //   INSERT INTO "${table}" (
  //     profile_id,
  //     interview_id,
  //     category,
  //     is_up_to_date
  //   )
  //   VALUES ($1, $2, $3, TRUE)
  // `

  // // Insert a record for each category
  // await Promise.all(
  //   categories.map(category =>
  //     sql.query(readinessQuery, [profileId, interviewId, category])
  //   )
  // )

  return NextResponse.json({ id: interviewId })
}

async function fetchUrlContents(url: string): Promise<string> {
  const AbortController = globalThis.AbortController || await import('abort-controller')
  const controller = new AbortController();
  let timeoutId: NodeJS.Timeout | undefined = undefined;

  try {
    // Set timeout and store the timeout ID
    timeoutId = setTimeout(() => {
      controller.abort();
    }, 10000);

    console.log('loading url: ', url)
    const response = await fetch(url, {
      signal: controller.signal,
      follow: 10
    });

    console.log('loaded response without timeout: ', url)
    const html = await response.text()
    const $ = cheerio.load(html)
    console.log('cheerio loaded html')
    $('script').remove()
    $('[onload], [onclick], [onmouseover], [onfocus], [onsubmit], [oninput]').each((_, element) => {
      Object.keys(element.attribs).forEach(attr => {
        if (attr.startsWith('on')) {
          $(element).removeAttr(attr)
        }
      });
    });
    console.log('6')

    // Get the cleaned HTML
    const cleanHtml = $('body').html()
    const markdown = turndownService.turndown(cleanHtml || '')
    return markdown
  } catch (error) {
    console.error('Error in fetchUrlContents:', error)
    throw error
  } finally {
    // Clear timeout using the stored ID
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}