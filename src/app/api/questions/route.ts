import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { sql } from '@vercel/postgres';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are an AI tasked with generating a set of interview preparation questions for any given role. The questions should be based on the Job Role, Job Description, Company, Resume of the candidate, and Today’s Date. You will assess the Applicant Level (e.g., undergraduate, MBA, graduate, experienced professional) based on the qualifications and experience level provided in the resume, and generate level-appropriate questions for the role.
The questions generated must reflect the most important qualities and skills required for the role, focusing on role-specific skills, company-specific needs, technical skills, and behavioral competencies. The generation of these questions should be guided by the top 10 most important topics that are inferred from the job description, resume, and the company’s needs. These topics should include a mix of technical skills, domain-specific knowledge, and behavioral competencies prioritized based on their relevance to the role and the applicant’s experience level. These identified topics should underpin the questions, but the topics themselves should not be listed—instead, integrate them directly into the questions and the rationale behind each.
Ensure that the questions align with the specific domain and responsibilities mentioned in the job description, and prioritize questions within each category according to their importance for the role and applicant level.
Your task is to generate the following types of questions (5 of each type):
1. Role-Specific and Company-Aligned Questions
These questions should assess the candidate’s understanding of both the role-specific skills and how they align with the company’s business strategy and market. Tailor the questions to the applicant’s level (e.g., undergraduate, MBA, graduate, or experienced professional) and ensure that they assess the candidate’s ability to apply key skills (e.g., financial modeling, project management) in the context of the company’s specific market.
Each question should include:
Question
Why they are asking: Explanation of the skill or concept being tested and why it is important for the role or company.
What you should focus on: Guidance on how the candidate should approach their answer, focusing on their ability to demonstrate practical application in a company-specific context.
2. Technical Skills Questions
These questions should focus on the technical skills and domain-specific knowledge required for the role, with a focus on key concepts derived from the top 10 most important topics. Ensure these questions are level-appropriate for the candidate, based on their experience level and the role’s requirements. These questions should assess the candidate’s ability to apply relevant technical knowledge or methodologies critical for success in the role.
Each question should include:
Question
Why they are asking: Explanation of the technical skill or concept being tested and its importance to the role or company.
What you should focus on: Guidance on how the candidate should approach the technical question, with an example of how it relates to real-world scenarios in the job.
3. Behavioral Questions
Behavioral questions assess how candidates have handled real-world situations in the past and how they might handle similar situations in the future. These questions should focus on assessing interpersonal abilities, leadership, teamwork, adaptability, communication, conflict resolution, and other behavioral competencies. These questions should prioritize key behavioral skills required for the role, particularly if the role involves significant team collaboration, leadership, or communication responsibilities.
Each question should include:
Question
Why they are asking: Explanation of why this behavioral skill is important for the role and how it affects performance.
What you should focus on: Guidance on how the candidate can highlight their behavioral skills with examples from past experiences.
Foundation of Questions:
All questions should be underpinned by the top 10 most important topics inferred from the inputs, which are extracted but not listed in the final output. These topics will guide the construction of each question to ensure that they reflect the most critical skills, knowledge, and competencies relevant to the role.
Prioritization of Topics:
Most Important Qualities in the Role: Analyze the job description and prioritize the skills, knowledge, and attributes critical to success in the position. This could range from technical proficiency for engineering roles to strategic thinking for product management roles or leadership skills for team management roles.
Level Appropriateness: Ensure that questions are adjusted to reflect the candidate’s experience level based on their resume. For entry-level candidates, focus on foundational concepts, while for senior-level candidates, emphasize strategic thinking, leadership, and high-level problem-solving.
Role-Specific Domain Knowledge: For technical roles, ensure that questions assess relevant domain knowledge (e.g., coding proficiency for software engineering, market analysis for business roles). For non-technical roles, focus on analytical, strategic, or creative skills based on the job description.
Company-Specific Focus: Use the company’s industry, products, and business focus to inform the creation of company-targeted questions that test how well the candidate’s skills align with the company’s needs.
Behavioral Competency Relevance: For leadership or collaborative roles, place higher importance on behavioral questions. For individual contributor or highly technical roles, reduce the focus on behavioral competencies and emphasize problem-solving, domain expertise, or innovation.
Inputs:
Job Description ({jobDescription}): Provide the role, key responsibilities, and qualifications. Use this information to infer the most relevant general and technical questions.
Company Website ({companyWebsiteURL}): Use the company’s industry, products, and business focus to tailor market-specific questions.
Resume ({resumeText}): Extract key information about the candidate's experience, skills, and education to determine the applicant’s level (e.g., undergraduate, graduate, or experienced professional).
Today’s Date ({todayDate}): Use today’s date to calculate experience timelines, especially for students nearing graduation.


<example>
## Role-Specific and Company-Aligned Questions

* **Question**: "How would you prioritize features for a new product aimed at organizing and improving access to information?"
  * **Why they are asking**: TechCorp wants to assess your ability to make strategic decisions when managing a product’s feature set, especially when you have limited resources.
  * **What you should focus on**: Discuss how you would prioritize features using frameworks like RICE or MoSCoW. You can give an example where you used data-driven methods to prioritize features, such as focusing on the most impactful updates when building out InfoNet, TechCorp’s information management tool.

## **Technical Skills Questions

* **Question**: "Describe a time when you made a data-driven decision. How would you apply data-driven decision-making in your role as a TechCorp Inc. Product Manager Intern?"
  * **Why they are asking**: TechCorp relies heavily on data to make product decisions and expects you to have a clear understanding of how to leverage it to improve products.
  * **What you should focus on**: Highlight a specific instance where data guided your decision-making process. For instance, you can mention analyzing user interactions in MapTrail and how that data led you to optimize the app’s user

</example>
`;

export async function POST(request: Request) {
  console.log('in BE with request for generating questions');
  const body = await request.json();
  const profileId = body.profileId;

  const todayDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  // Fetch profile details
  const profileDetails = await sql`
    SELECT graduation_date
    FROM ai_interview_coach_prod_profiles
    WHERE id = ${profileId}
  `;


  if (profileDetails.rows.length === 0) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const {
    graduation_date: graduationDate
  } = profileDetails.rows[0];

  const gradYear = new Date(graduationDate).getFullYear();

  // Fetch job details
  const jobDetails = await sql`
    SELECT company_url, jd_url
    FROM ai_interview_coach_prod_jobs
    WHERE profile_id = ${profileId}
  `;

  if (jobDetails.rows.length === 0) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const {
    company_url: companyWebsiteUrl,
    jd_url: jobDescriptionURL
  } = jobDetails.rows[0];

  const resumeDetails = await sql`
  SELECT url
  FROM ai_interview_coach_prod_resumes
  WHERE profile_id = ${profileId}
`;

if (resumeDetails.rows.length === 0) {
  return NextResponse.json({ error: "Resume not found" }, { status: 404 });
}

const {
  url: resumeUrl
} = resumeDetails.rows[0];

  const userPrompt = `
    Job Description: ${jobDescriptionURL}
    Company: ${companyWebsiteUrl}
    Resume: ${resumeUrl}
    GraduationYear: ${gradYear}
    Today's Date: ${todayDate}
  `;

  try {
    // Make the API call to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_completion_tokens: 3000,
      temperature: 0.5,
    });

    const generatedContent = completion.choices[0]?.message?.content;

    // Upsert operation for questions_response
    await sql`
      INSERT INTO ai_interview_coach_prod_airesponses (profile_id, questions_response)
      VALUES (${profileId}, ${generatedContent})
      ON CONFLICT (profile_id)
      DO UPDATE SET questions_response = EXCLUDED.questions_response;
    `;

    console.log('in BE with questions response: ', generatedContent);
    return NextResponse.json({ content: generatedContent });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ content: "unable to get content" }, { status: 500 });
  }
}
