import { sql } from '@vercel/postgres';

interface ProfileData {
  profileId: string;
  companyWebsiteUrl: string;
  companyWebsiteText: string;
  jobDescriptionURL: string;
  jobDescription: string;
  resumeUrl?: string;
  resume?: string;
  schoolName?: string;
  schoolMajor?: string;
  schoolConcentration?: string;
  gradYear: number;
  todayDate: string;
}

export interface PromptData {
  systemPrompt: string;
  userPrompt: string;
  temperature: number;
  maxCompletionTokens: number;
}

export async function fetchPrompt(profileId: string, promptKey: string): Promise<PromptData> {
  const profileData = await fetchProfileData(profileId);
  const rawPromptData = await fetchRawPrompt(promptKey);

  return {
    systemPrompt: applyVariables(rawPromptData.system_prompt, profileData),
    userPrompt: applyVariables(rawPromptData.user_prompt, profileData),
    temperature: rawPromptData.temperature,
    maxCompletionTokens: rawPromptData.max_completion_tokens
  };
}

async function fetchProfileData(profileId: string): Promise<ProfileData> {
  const todayDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const [profileDetails, jobDetails, resumeDetails] = await Promise.all([
    sql`SELECT school, major, concentration, graduation_date FROM ai_interview_coach_prod_profiles WHERE id = ${profileId}`,
    sql`SELECT company_url, company_text, jd_url, jd_text FROM ai_interview_coach_prod_jobs WHERE profile_id = ${profileId}`,
    sql`SELECT url, text FROM ai_interview_coach_prod_resumes WHERE profile_id = ${profileId}`
  ]);

  if (profileDetails.rows.length === 0) throw new Error("Profile not found");
  if (jobDetails.rows.length === 0) throw new Error("Job not found");
  if (resumeDetails.rows.length === 0) throw new Error("Resume not found");

  const { school: schoolName, major: schoolMajor, concentration: schoolConcentration, graduation_date: graduationDate } = profileDetails.rows[0];
  const { company_url: companyWebsiteUrl, company_text: companyWebsiteText, jd_url: jobDescriptionURL, jd_text: jobDescription } = jobDetails.rows[0];
  const { url: resumeUrl, text: resume } = resumeDetails.rows[0];

  return {
    profileId,
    companyWebsiteUrl,
    companyWebsiteText,
    jobDescriptionURL,
    jobDescription,
    resumeUrl,
    resume,
    schoolName,
    schoolMajor,
    schoolConcentration,
    gradYear: new Date(graduationDate).getFullYear(),
    todayDate,
  };
}

async function fetchRawPrompt(promptKey: string): Promise<{ system_prompt: string; user_prompt: string; temperature: number; max_completion_tokens: number }> {
  console.log('fetching prompt', process.env.NEXT_PUBLIC_VERCEL_URL);
  const protocol = process.env.NEXT_PUBLIC_VERCEL_URL?.startsWith('localhost') ? 'http' : 'https';
  const promptResponse = await fetch(`${protocol}://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/prompts?key=${promptKey}`);
  if (!promptResponse.ok) throw new Error("Failed to fetch prompt");
  const promptData = await promptResponse.json();
  return promptData.data;
}

function applyVariables(prompt: string, data: ProfileData): string {
  return prompt
    .replace('${jobDescription}', data.jobDescription)
    .replace('${companyWebsiteText}', data.companyWebsiteText)
    .replace('${resume}', data.resume || '')
    .replace('${gradYear}', data.gradYear.toString())
    .replace('${todayDate}', data.todayDate)
    .replace('${schoolName}', data.schoolName || '')
    .replace('${schoolMajor}', data.schoolMajor || '')
    .replace('${schoolConcentration}', data.schoolConcentration || '');
}
