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
  console.log('IN interviews GET')
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
    SELECT id, profile_id, company_name, company_url, role_name, interviewer_name, interviewer_role, interview_date, readiness
    FROM ${INTERVIEWS}
    WHERE profile_id = $1
    AND id = $2
    ORDER BY id DESC
  `
    const interviews = await sql.query(query, [profileId, interviewId])
    return NextResponse.json({ content: interviews.rows[0] })

  } else {
    const query = `
    SELECT id, profile_id, company_name, role_name, interviewer_name, interviewer_role, interview_date, readiness
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
    interview_date
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
  const company_md = await fetchUrlContents(company_url)
  const jd_md = await fetchUrlContents(jd_url)
  const interviewer_linkedin_md = interviewer_linkedin_url ? await fetchUrlContents(interviewer_linkedin_url) : null

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
      interview_date
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
    formattedInterviewDate
  ];

  const interviews = await sql.query(query, values)
  const interviewId = interviews.rows[0].id

  // Insert interview readiness records for each category
  const table = getTable('interview_readiness')
  const categories = ['Overall', 'Behavioral', 'Case', 'Role', 'Technical', ]

  const readinessQuery = `
    INSERT INTO "${table}" (
      profile_id,
      interview_id,
      category,
      is_up_to_date
    )
    VALUES ($1, $2, $3, FALSE)
  `

  // Insert a record for each category
  await Promise.all(
    categories.map(category =>
      sql.query(readinessQuery, [profileId, interviewId, category])
    )
  )

  return NextResponse.json({ id: interviewId })
}

async function fetchUrlContents(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)
    $('script').remove()
    $('[onload], [onclick], [onmouseover], [onfocus], [onsubmit], [oninput]').each((_, element) => {
      Object.keys(element.attribs).forEach(attr => {
        if (attr.startsWith('on')) {
          $(element).removeAttr(attr)
        }
      });
    });

    // Get the cleaned HTML
    const cleanHtml = $('body').html()
    const markdown = turndownService.turndown(cleanHtml || '')
    return markdown
  } catch (error) {
    console.error('Error in fetchUrlContents:', error)
    throw error
  }
}