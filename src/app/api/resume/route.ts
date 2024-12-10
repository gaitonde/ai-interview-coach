import { getTable } from "@/lib/db"
import { put } from '@vercel/blob'
import { sql } from '@vercel/postgres'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import PDFParser from 'pdf2json'
import { fetchPromptByKey, PromptData } from "../utils/fetchPrompt"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  console.log('POST request received for resume')
  try {
    const formData = await request.formData()
    const resume = formData.get('resume') as File
    const filename = formData.get('filename') as string
    const resumeUrl = await uploadResume(resume)
    const resumeText = await extractText(resume)
    const parsedResume = await parseResume(resumeText)
    const profileId = await insertProfile(parsedResume)
    await insertResumeRecord(profileId, filename, resumeUrl, parsedResume)

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
          console.log(errData.parserError)
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
  const table = getTable('resumes')
  const query = `
    INSERT INTO ${table} (profile_id, filename, url, text)
    VALUES (${profileId}, '${filename}', '${resumeUrl}', '${resumeContent}')
  `

  try {
    await sql.query(query)
    console.log(`For profile ${profileId} inserted new resume URL: ${resumeUrl}`)
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
  console.log('content', content)
  return content as string

  // const parsedResume = JSON.parse(content as string)

  // return parsedResume
}

async function insertProfile(resumeJson: string): Promise<string> {
  const parsed = JSON.parse(resumeJson)
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
  } = parsed

  const graduation_date = new Date(`6/1/${graduationYear}`)
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
    ) RETURNING id`

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

  return result.rows[0].id
}
