import { NextResponse } from 'next/server';
import { put } from '@vercel/blob'
import { sql } from '@vercel/postgres';
import PDFParser from 'pdf2json';
import { getTable } from "@/lib/db";

export async function POST(request: Request) {
  console.log('POST request received for resume');
  try {
    const formData = await request.formData();

    const profileId = formData.get('profileId') as string;
    const resume = formData.get('resume') as File;
    const parsedResume = await parseResume(resume);
    //TODO: protect url
    const resumeUrl = await uploadResume(resume);
    //TODO: right now overriding with resume content; need to create new column for resume content
    await updateProfileWithResumeUrl(profileId, resumeUrl, parsedResume);

    return NextResponse.json({ success: true, resumeUrl });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ content: "unable to upload resume" }, { status: 500 });
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

async function updateProfileWithResumeUrl(profileId: string, resumeUrl: string, resumeContent: string): Promise<void> {
  const table = getTable('ai_interview_coach_prod_resumes');
  const query = `
    INSERT INTO ${table} (profile_id, url, text)
    VALUES (${profileId}, '${resumeUrl}', '${resumeContent}')
  `;
  console.log('OOO query:', query);

  try {
    await sql.query(query);
    console.log(`For profile ${profileId} inserted new resume URL: ${resumeUrl}`);
  } catch (error) {
    console.error('Error updating profile with resume URL:', error);
    throw new Error('Failed to update profile with resume URL');
  }
}


async function parseResume(resume: File): Promise<string> {
  let parsedText = '';

    // Convert ArrayBuffer to Buffer
    const fileBuffer = Buffer.from(await resume.arrayBuffer());

    // Create a Promise to handle the async PDF parsing
    const parsePDF = () => {
      return new Promise((resolve, reject) => {
        const pdfParser = new (PDFParser as any)(null, 1);

        pdfParser.on('pdfParser_dataError', (errData: any) => {
          console.log(errData.parserError);
          reject(errData.parserError);
        });

        pdfParser.on('pdfParser_dataReady', () => {
          const text = (pdfParser as any).getRawTextContent();
          resolve(text);
        });

        // Parse directly from buffer instead of file
        pdfParser.parseBuffer(fileBuffer);
      });
    };

    try {
      const rawText = (await parsePDF()) as string;
      // Convert the raw text to markdown format
      // This is a simple conversion - you might want to add more formatting rules
      parsedText = rawText
        .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
        .replace(/\f/g, '\n\n') // Replace form feeds with double newlines
        .trim(); // Remove leading/trailing whitespace
    } catch (error) {
      throw new Error('Failed to parse PDF');
    }

    return parsedText;
}