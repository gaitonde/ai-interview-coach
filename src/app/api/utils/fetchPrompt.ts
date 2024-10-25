import { sql } from '@vercel/postgres';

interface ProfileData {
  profileId: string;
  todayDate: string;
  gradYear: number;
  jobDescriptionURL: string;
  companyWebsiteUrl: string;
  resumeUrl: string;
  schoolName?: string;
  schoolMajor?: string;
  schoolConcentration?: string;
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
    sql`SELECT company_url, jd_url FROM ai_interview_coach_prod_jobs WHERE profile_id = ${profileId}`,
    sql`SELECT url FROM ai_interview_coach_prod_resumes WHERE profile_id = ${profileId}`
  ]);

  if (profileDetails.rows.length === 0) throw new Error("Profile not found");
  if (jobDetails.rows.length === 0) throw new Error("Job not found");
  if (resumeDetails.rows.length === 0) throw new Error("Resume not found");

  const { school: schoolName, major: schoolMajor, concentration: schoolConcentration, graduation_date: graduationDate } = profileDetails.rows[0];
  const { company_url: companyWebsiteUrl, jd_url: jobDescriptionURL } = jobDetails.rows[0];
  const { url: resumeUrl } = resumeDetails.rows[0];

  return {
    profileId,
    todayDate,
    gradYear: new Date(graduationDate).getFullYear(),
    jobDescriptionURL,
    companyWebsiteUrl,
    resumeUrl,
    schoolName,
    schoolMajor,
    schoolConcentration
  };
}

async function fetchRawPrompt(promptKey: string): Promise<{ system_prompt: string; user_prompt: string; temperature: number; max_completion_tokens: number }> {
  const promptResponse = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/prompts?key=${promptKey}`);
  if (!promptResponse.ok) throw new Error("Failed to fetch prompt");
  const promptData = await promptResponse.json();
  return promptData.data;
}

function applyVariables(prompt: string, data: ProfileData): string {
  return prompt
    .replace('${jobDescriptionURL}', data.jobDescriptionURL)
    .replace('${companyWebsiteURL}', data.companyWebsiteUrl)
    .replace('${resumeURL}', data.resumeUrl)
    .replace('${gradYear}', data.gradYear.toString())
    .replace('${todayDate}', data.todayDate)
    .replace('${schoolName}', data.schoolName || '')
    .replace('${schoolMajor}', data.schoolMajor || '')
    .replace('${schoolConcentration}', data.schoolConcentration || '');
}
