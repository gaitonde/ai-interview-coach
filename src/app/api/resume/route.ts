import { NextResponse } from 'next/server';
import { put } from '@vercel/blob'
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  console.log('POST request received for resume');
  try {
    const formData = await request.formData() ;    

    const profileId = formData.get('profileId') as string;
    const resume = formData.get('resume') as File;
    console.log('profileId: ', profileId);
    console.log('resume type: ', resume.type);

    //TODO: protect url
    const resumeUrl = await uploadResume(resume);
    await updateProfileWithResumeUrl(profileId, resumeUrl);

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

async function updateProfileWithResumeUrl(profileId: string, resumeUrl: string): Promise<void> {
  try {
    await sql`
      INSERT INTO ai_interview_coach_prod_resumes (profile_id, url)
      VALUES (${profileId}, ${resumeUrl})
    `;
    console.log(`For profile ${profileId} inserted new resume URL: ${resumeUrl}`);
  } catch (error) {
    console.error('Error updating profile with resume URL:', error);
    throw new Error('Failed to update profile with resume URL');
  }
}
