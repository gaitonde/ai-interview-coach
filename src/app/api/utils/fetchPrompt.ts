import { getTable } from "@/lib/db";
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
  gradeClass?: string;
  todayDateFormatted: string;
  interviewerName?: string;
  interviewerRole?: string;
  question?: string;
  answer?: string;
}

export interface PromptData {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  temperature: number;
  maxCompletionTokens: number;
}

export async function fetchPrompt(profileId: string, promptKey: string, questionId?: string, answerId?: string, content?: string): Promise<PromptData> {
  const profileData = await fetchProfileData(profileId, questionId, answerId);
  const rawPromptData = await fetchRawPrompt(promptKey);

  return {
    model: rawPromptData.model,
    systemPrompt: applyVariables(rawPromptData.system_prompt, profileData, content),
    userPrompt: applyVariables(rawPromptData.user_prompt, profileData, content),
    temperature: rawPromptData.temperature,
    maxCompletionTokens: rawPromptData.max_completion_tokens
  };
}

async function fetchProfileData(profileId: string, questionId?: string, answerId?: string): Promise<ProfileData> {
  const todayDate = new Date();
  const todayDateFormatted = todayDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const PROFILES_TABLE = getTable('profiles');
  const JOBS_TABLE = getTable('interviews');
  const RESUMES_TABLE = getTable('resumes');
  const QUESTIONS_TABLE = getTable('questions');
  const ANSWERS_TABLE = getTable('answers');

  const PROFILE_QUERY = `SELECT school, major, concentration, graduation_date
      FROM "${PROFILES_TABLE}"
      WHERE id = $1`;

  const JOB_QUERY = `SELECT company_url, company_text, jd_url, jd_text, interviewer_name, interviewer_role
      FROM "${JOBS_TABLE}"
      WHERE profile_id = $1
      ORDER BY created_at DESC LIMIT 1`;

  const RESUME_QUERY = `SELECT url, text
      FROM "${RESUMES_TABLE}"
      WHERE profile_id = $1
      ORDER BY created_at DESC LIMIT 1`;

  const [profileDetails, jobDetails, resumeDetails, questionDetails, answerDetails] = await Promise.all([
    sql.query(PROFILE_QUERY, [profileId]),
    sql.query(JOB_QUERY, [profileId]),
    sql.query(RESUME_QUERY, [profileId]),
    questionId
      ? sql.query(`SELECT question FROM "${QUESTIONS_TABLE}" WHERE profile_id = $1 AND id = $2`, [profileId, questionId])
      : Promise.resolve({ rows: [] }),
    answerId
      ? sql.query(`SELECT answer FROM "${ANSWERS_TABLE}" WHERE profile_id = $1 AND id = $2`, [profileId, answerId])
      : Promise.resolve({ rows: [] })
  ]);

  console.log('Profile rows:', profileDetails.rows.length);
  console.log('Job rows:', jobDetails.rows.length);
  console.log('Resume rows:', resumeDetails.rows.length);

  if (profileDetails.rows.length === 0) throw new Error(`Profile not found for ID: ${profileId}`);
  if (jobDetails.rows.length === 0) throw new Error(`Job not found for profile ID: ${profileId}`);
  if (resumeDetails.rows.length === 0) throw new Error(`Resume not found for profile ID: ${profileId}`);
  if (questionId && questionDetails.rows.length === 0) throw new Error("Question not found");
  if (answerId && answerDetails.rows.length === 0) throw new Error("Answers not found");

  const { school: schoolName, major: schoolMajor, concentration: schoolConcentration, graduation_date: graduationDate } = profileDetails.rows[0];
  const { company_url: companyWebsiteUrl, company_text: companyWebsiteText, jd_url: jobDescriptionURL, jd_text: jobDescription, interviewer_name: interviewerName, interviewer_role: interviewerRole } = jobDetails.rows[0];
  const { url: resumeUrl, text: resume } = resumeDetails.rows[0];
  const question = questionId ? questionDetails.rows[0]?.question : null;
  const answer = answerId ? answerDetails.rows[0]?.answer : null;

  const gradYear = new Date(graduationDate).getFullYear();
  const gradeClass = await fetchGradeClass(gradYear, todayDate);
  console.debug('gradYear, todayDate, gradeClass:', gradYear, todayDate, gradeClass);

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
    gradeClass: gradeClass,
    todayDateFormatted,
    interviewerName,
    interviewerRole,
    question,
    answer
  };
}

export function fetchGradeClass(graduationYear: number, currentDate: Date): string {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const delta = graduationYear - currentYear;

  if (delta < 0) return 'Graduate';
  if (delta === 0) return 'Senior';
  if (delta === 1) return currentMonth < 5 ? 'Junior' : 'Senior';
  if (delta === 2) return currentMonth < 5 ? 'Sophomore' : 'Junior';
  if (delta === 3) return currentMonth >= 5 ? 'Sophomore' : 'Freshman';
  return 'Freshman';
}

async function fetchRawPrompt(promptKey: string): Promise<{ system_prompt: string; user_prompt: string; model: string; temperature: number; max_completion_tokens: number }> {
  console.log('fetching prompt', process.env.NEXT_PUBLIC_VERCEL_URL);
  const protocol = process.env.NEXT_PUBLIC_VERCEL_URL?.startsWith('localhost') ? 'http' : 'https';
  const promptResponse = await fetch(`${protocol}://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/prompts?key=${promptKey}`);
  if (!promptResponse.ok) throw new Error("Failed to fetch prompt");
  const promptData = await promptResponse.json();
  return promptData.data;
}

function applyVariables(prompt: string, data: ProfileData, content?: string): string {
  return prompt
    .replace('${jobDescription}', data.jobDescription)
    .replace('${companyWebsiteText}', data.companyWebsiteText)
    .replace('${resume}', data.resume || '')
    .replace('${gradYear}', data.gradYear.toString())
    .replace('${gradeClass}', data.gradeClass || '')
    .replace('${todayDate}', data.todayDateFormatted)
    .replace('${schoolName}', data.schoolName || '')
    .replace('${schoolMajor}', data.schoolMajor || '')
    .replace('${schoolConcentration}', data.schoolConcentration || '')
    .replace('${interviewerName}', data.interviewerName || '')
    .replace('${interviewerRole}', data.interviewerRole || '')
    .replace('${question}', data.question || '')
    .replace('${transcription}', data.answer || '')
    .replace('${content}', content || '');
}