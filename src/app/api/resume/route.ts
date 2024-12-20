import { fetchPromptByKey, PromptData } from '@/app/api/utils/fetchPrompt'
import { EmailTemplate } from '@/components/components/email-template'
import { getTable } from '@/lib/db'
import { put } from '@vercel/blob'
import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import PDFParser from 'pdf2json'
import { CreateEmailResponseSuccess, Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  school: string | null;
  major: string | null;
  concentration: string | null;
  graduation_date: Date | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  created_at?: Date;  // Added since Postgres typically adds this automatically
  updated_at?: Date;  // Added since Postgres typically adds this automatically
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const resume = formData.get('resume') as File
    const filename = formData.get('filename') as string
    const resumeUrl = await uploadResume(resume)
    const resumeText = await extractText(resume)
    const parsedResume = await parseResume(resumeText)
    const profile = await insertProfile(parsedResume)
    const profileId = profile.id
    await insertResumeRecord(profileId, filename, resumeUrl, parsedResume)

    const data = await sendEmail(resumeUrl, filename, profile)
    console.log('email sent:', data)

    return NextResponse.json({ success: true, profileId })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ content: "unable to upload resume" }, { status: 500 })
  }
}

async function uploadResume(file: File): Promise<string> {
  if (!file) {
    throw new Error('No file uploaded')
  }

  if (file.type !== 'application/pdf') {
    throw new Error('Uploaded file must be a PDF')
  }

  const { url } = await put(file.name, file, {
    access: 'public',
    addRandomSuffix: true,
  })

  return url
}

async function extractText(resume: File): Promise<string> {
  let parsedText = ''

    // Convert ArrayBuffer to Buffer
    const fileBuffer = Buffer.from(await resume.arrayBuffer())

    // Create a Promise to handle the async PDF parsing
    const parsePDF = () => {
      return new Promise((resolve, reject) => {
        const pdfParser = new (PDFParser as any)(null, 1)

        pdfParser.on('pdfParser_dataError', (errData: any) => {
          console.error(errData.parserError)
          reject(errData.parserError)
        })

        pdfParser.on('pdfParser_dataReady', () => {
          const text = (pdfParser as any).getRawTextContent()
          resolve(text)
        })

        // Parse directly from buffer instead of file
        pdfParser.parseBuffer(fileBuffer)
      })
    }

    try {
      const rawText = (await parsePDF()) as string
      // Convert the raw text to markdown format
      // This is a simple conversion - you might want to add more formatting rules
      parsedText = rawText
        .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
        .replace(/\f/g, '\n\n') // Replace form feeds with double newlines
        .trim() // Remove leading/trailing whitespace
    } catch (error) {
      throw new Error('Failed to parse PDF')
    }

    return parsedText
}

async function insertResumeRecord(profileId: string, filename: string, resumeUrl: string, resumeContent: string): Promise<void> {

  try {
    const table = getTable('resumes')
    const query = `
      INSERT INTO ${table} (profile_id, filename, url, text)
      VALUES (${profileId}, '${filename}', '${resumeUrl}', '${resumeContent}')
    `
    await sql.query(query)
  } catch (error) {
    console.error('Error updating profile with resume URL:', error)
    throw new Error('Failed to update profile with resume URL')
  }
}

async function parseResume(resumeText: string): Promise<string> {
  const promptData: PromptData = await fetchPromptByKey('prompt-resume-extract')
  promptData.userPrompt = promptData.userPrompt.replace('${resume}', resumeText)

  const completion = await openai.chat.completions.create({
    model: promptData.model,
    messages: [
      { role: "system", content: promptData.systemPrompt },
      { role: "user", content: promptData.userPrompt }
    ],
    max_completion_tokens: promptData.maxCompletionTokens,
    temperature: promptData.temperature as number,
  })

  const content = completion.choices[0].message.content
  return content as string
}

async function insertProfile(resumeJson: string): Promise<Profile> {
  const parsed = JSON.parse(resumeJson)

  // Convert "Not Specified" to null for each field
  const {
    firstName,
    lastName,
    school,
    major,
    concentration,
    graduationYear,
    email,
    phone,
    linkedInURL
  } = Object.fromEntries(
    Object.entries(parsed).map(([key, value]) =>
      [key, value === "Not Specified" ? null : value]
    )
  )

  const graduation_date = graduationYear ? new Date(`6/1/${graduationYear}`) : null
  const table = getTable('profiles')
  const insertProfileQuery = `
    INSERT INTO ${table} (
      first_name,
      last_name,
      school,
      major,
      concentration,
      graduation_date,
      email,
      phone,
      linkedin_url
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9
    ) RETURNING *`

  const result = await sql.query(insertProfileQuery, [
    firstName,
    lastName,
    school,
    major,
    concentration,
    graduation_date,
    email,
    phone,
    linkedInURL
  ])

  return result.rows[0]
}

async function sendEmail(resumeUrl: string, filename: string, profile: Profile): Promise<CreateEmailResponseSuccess | null> {
  try {
    const env = process.env.VERCEL_ENV || 'Unknown'
    console.log('env: ', env)
    const { data, error } = await resend.emails.send({
      from: 'TIP <internal@theinterviewplaybook.com>',
      to: ['dayal@greenpenailabs.com', 'shaan@greenpenailabs.com'],
      subject: `New Resume Uploaded - ${profile.first_name} ${profile.last_name}`,
      react: EmailTemplate({ ...profile, env: env || '' }),
      attachments: [
        {
          path: resumeUrl,
          filename: filename,
        },
      ],
    })

    if (error) {
      console.warn('Resume uploaded, but unable to send email')
    }

    if (data) {
      return data
    }

  } catch (error) {
    console.warn('Resume uploaded, but unable to send email')
  }
  return null
}