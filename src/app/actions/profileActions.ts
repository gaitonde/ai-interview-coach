'use server'

import { PrismaClient } from '@prisma/client'
import { put } from '@vercel/blob'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import OpenAI from 'openai';
// import formidable from 'formidable';
// import fs from 'fs/promises';
// import { IncomingMessage } from 'http';

const prisma = new PrismaClient()
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const todayDate = `Oct 22 2024`;
const companyWebsiteUrl = `https://www.snowflake.com/en/`;
const jobRole = `Senior Container Platform Engineer`;
const jobDescription = `
Build the future of the AI Data Cloud. Join the Snowflake team.

We’re hiring talented Senior Engineers for our Container Platform team that are passionate about using software-based approaches to solve complex infrastructure challenges and automate those solutions.  You’ll be part of the cloud engineering organization where we have a strong focus on using engineering and software practices to manage and scale our cloud infrastructure.  Working in cloud engineering, you’ll lead and contribute to initiatives aimed at scaling our infrastructure, process, systems, and automation.  You’ll build a deep understanding of Snowflakes services and use that knowledge, coupled with your infrastructure and cloud knowledge, to optimize and evolve our infrastructure reliability, availability, serviceability, and price/performance.

You’ll work with some of the brightest engineers in the valley. To be successful, you’ll need to be deeply technical and capable of holding your own with other strong peers.  You possess excellent communication, collaboration, and diplomacy skills. You have experience practicing infrastructure-as-code, including using tools like Terraform, Ansible. You’ll have strong software development fundamentals and skills. In addition, you’ll have strong systems knowledge and troubleshooting abilities.

If you love solving problems at scale, prefer to write scalable, reliable, and testable software to automate infrastructure management, are an ace troubleshooter, and are deeply technical, then this is the role for you!

We are looking for talented, passionate Senior Container Platform Engineers to join our cloud engineering team in San Mateo, CA and evolve our elastic, large scale, high-performance computing environment. You will be part of a team that has been tasked with building the next generation, highly available, global scale, multi-cloud PaaS platform with open source technologies to enable and accelerate Snowflake's rapid growth. You will get to be a technology thought leader, evangelize new, cutting edge technologies and solve complex problems.



AS A SENIOR ENGINEER, CONTAINER PLATFORM ENGINEER AT SNOWFLAKE, YOU WILL:
Contribute to the team charter to build and operate a highly scalable and resilient Infrastructure and platform services that include but not limited to VM, Container and Serverless Platforms.

Research and implement solutions to build a highly reliable and scalable Kubernetes platform.

Evangelize and drive adoption of the new platform to meet business goals.

Introduce tools to facilitate greater automation and operability of platform services.

Participate in on-call rotation and ensure uptime of services



OUR IDEAL SENIOR CONTAINER PLATFORM ENGINEER WILL HAVE:
BS/CS, MS/CS or equivalent.

At least 8+ years experience in a software engineering platform team in a Cloud, SaaS environment and supporting mission critical services.

At least 3+ years in cloud computing (AWS, Azure or GCP).

At least 3+ years experience in Kubernetes. Experience with Amazon EKS, Azure AKS or Google GKE highly desired.

Strong coding skills in Golang, Python, C++ or Java.

Experience with Cloud computing toolsets - Pulumi, Terraform, Vault etc.

Firm grasp of IP networking, load balancing, DNS.

Good knowledge of distributed systems, APIs, cloud computing.

Tremendous attention to details and ability to build reliable and scalable software systems.

Effective communication and collaboration skills.

Solid interpersonal skills conducive to a team environment.

Able to troubleshoot and resolve complex technical issues.

Self-driven & motivated, with a strong work ethic and a passion for problem solving.

Experience and knowledge of Git, JIRA, and Jenkins a plus.

MANDATORY REQUIREMENTS FOR THE ROLE:
The position may require access to U.S. export-controlled technologies, technical data, or sensitive government data.

Employment with Snowflake is contingent on Snowflake verifying that you: (i) may legally access U.S. export-controlled technologies, technical data, or sensitive government data; or (ii) are eligible to obtain, in a timely manner, any necessary license or other authorization(s) from the U.S. Government to allow access to U.S. export-controlled technology, technical data, or sensitive government data.

Every Snowflake employee is expected to follow the company’s confidentiality and security standards for handling sensitive data. Snowflake employees must abide by the company’s data security plan as an essential part of their duties. It is every employee's duty to keep customer information secure and confidential.

Snowflake is growing fast, and we’re scaling our team to help enable and accelerate our growth. We are looking for people who share our values, challenge ordinary thinking, and push the pace of innovation while building a future for themselves and Snowflake.

How do you want to make your impact?

The following represents the expected range of compensation for this role:

The estimated base salary range for this role is .
Additionally, this role is eligible to participate in Snowflake’s bonus and equity plan.
The successful candidate’s starting salary will be determined based on permissible, non-discriminatory factors such as skills, experience, and geographic location. This role is also eligible for a competitive benefits package that includes: medical, dental, vision, life, and disability insurance; 401(k) retirement plan; flexible spending & health savings account; at least 12 paid holidays; paid time off; parental leave; employee assistance program; and other company benefits.

Snowflake is growing fast, and we’re scaling our team to help enable and accelerate our growth. We are looking for people who share our values, challenge ordinary thinking, and push the pace of innovation while building a future for themselves and Snowflake.

How do you want to make your impact?
`;

const resumeText = `
EDUCATION
CARNEGIE MELLON
UNIVERSITY
B.S.INCOMPUTERSCIENCE Pittsburgh, PA| ExpectedMay2018
SKILLS
Java • Python • C • SML • HTML5 •  CSS • Django • Android • LATEX•Git Datastructures • Software design patterns
COURSEWORK
Parallel andSequentialData
Structures andAlgorithms
Introduction toComputer Systems Software System Construction Great TheoreticalIdeas in Computer Science
Web Application Development Principles ofImperative
Computation
Principles of Functional
Programming
LINKS
Github://maytrix
LinkedIn:// maytrix
May Trix
888-888-8881 | mtrix@andrew.cmu.edu
EXPERIENCE
CARNEGIEMELLONUNIVERSITY,HUMAN-COMPUTER INTERACTION INSTITUTE | RESEARCH ASSISTANT
February2016 - Present | Pittsburgh, PA
• Make Android and web apps for NavCog, a toolthat uses sensors, computer vision, and crowdsourcing to help blind people move in spaces. Target crowdsourcingeffortto create 3-D modelsof buildings and maintain sensors.
June2015 - August2015 | Pittsburgh, PA
• Led 3 person teamdeveloping mobile andwear apps forChorus, a web based crowdsourcingconversational assistant. Has texttospeechand speechtotext capabilities. Uses YelpSearchandYahoo APIs.
• Made a natural language processortoolto be added toChorusweb application.
BUSINESSGOLFACADEMY | SOCIAL MEDIA MANAGER May2015 – Present | Pittsburgh, PA
• Manage the socialmedia presence forBGA,whichencourages womento use golftoadvance their careers. TripledTwitterfollowers
PROJECTS
UMBRELLA | LEADANDROIDDEVELOPER, GITREPO MANAGER February 2016
• App uses crowdsourcing to fight gender-based violence and the bystander effect.Bluetooth-based messaging whereusers
anonymouslypost situation.
BUDGIE | LEADANDROIDDEVELOPER,GITREPOMANAGER September 2015
• Apptomanage andcategorize expenses.ImplementsMicrosoft’s Oxford OpitcalCharacter Recognition API. Pie charts show
spending distribution.
ACTIVITIES
WOMEN’SVARSITYGOLF TEAM | CAPTAIN (2014-PRESENT) August2014 – Present | Pittsburgh, PA
• Won Thomas B. Craig & LaVerne Craig Tartan Award 2015-2016 (Most Valuable Player), University Athletic Association All
Association First Team, Eastern College Athletic Conference
Rookie of the Month Division III, University Athletic Association Women’s Golf Athlete of the Week (3 times)
• Student Athlete Advisory Council | September 2014 - May 2015
WOMEN@SCS | MENTOR
September 2014 – Present | Pittsburgh,PA
• ”Big sister” inthe Big Sister/Little Sister mentoringprogram.
THEFIRSTTEEOFPITTSBURGH | VOLUNTEERGOLF
INSTRUCTOR
September 2014 – Present | Pittsburgh,PA
• Teachgolf and life skills to 20 underprivileged children ages 8-16 years
`;


// export const config = {
//   api: {
//     bodyParser: false, // Disable the default body parser
//   },
// };

export async function handleProfileSetup(formData: FormData) {
  console.log('in BE with formData: ', formData);
  try {
    // Upload resume
    // const resumeUrl = await uploadResume(formData.get('resume') as File)

    // TODO: Parse resume text

    // Create profile
    const profile = await createProfile({
      school: formData.get('school') as string,
      major: formData.get('major') as string,
      concentration: formData.get('concentration') as string,
      graduation_year: formData.get('graduation-year') as string,
    })

    // Make AI API calls
    // const aiResponse = await makeAIAPICalls(profile)
    // console.log(aiResponse);

    // const questions = await getQuestions(profile)
    // console.log(questions);

    // Store AI response in database
    // await storeAIResponse(profile.id, aiResponse)

    // Revalidate the cache for the profile page
    // revalidatePath('/profile')

    // Redirect to the job prep page
    // return redirect('/job-prep')
    return { aiResponse: "aiResponse" }
  } catch (error) {
    console.error('Error in handleProfileSetup:', error)
    throw new Error('Failed to set up profile. Please try again.')
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

async function createProfile(data: {
  school: string
  major: string
  concentration: string
  graduation_year: string
}) {
  return await prisma.ai_interview_coach_prod_profiles.create({
    data: {
      school: data.school,
      major: data.major,
      concentration: data.concentration,
      graduation_date: new Date(data.graduation_year),
    },
  })
}
//TODO: add correct params
async function getQuestions(profile: any) {
  const systemPrompt = `
You are an AI tasked with generating a set of interview preparation questions for any given role. The questions should be based on the Job Role, Job Description, Company, Resume of the candidate, and Today’s Date. You will assess the Applicant Level (e.g., undergraduate, MBA, graduate, experienced professional) based on the qualifications and experience level provided in the resume, and generate level-appropriate questions for the role.
The questions generated must reflect the most important qualities and skills required for the role, focusing on role-specific skills, company-specific needs, technical skills, and behavioral competencies. The generation of these questions should be guided by the top 10 most important topics that are inferred from the job description, resume, and the company’s needs. These topics should include a mix of technical skills, domain-specific knowledge, and behavioral competencies prioritized based on their relevance to the role and the applicant’s experience level. These identified topics should underpin the questions, but the topics themselves should not be listed—instead, integrate them directly into the questions and the rationale behind each.
Ensure that the questions align with the specific domain and responsibilities mentioned in the job description, and prioritize questions according to their importance for the role and applicant level.
Your task is to generate the following types of questions:
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
  `;
//Job Role, Job Description, Company, Resume of the candidate, and Today’s Date
  const userPrompt = `
  Job Role: ${jobRole}
  Job Description: ${jobDescription}
  Company: ${companyWebsiteUrl}
  Resume: ${resumeText}
  Today's Date: ${todayDate}
  `;
  console.log('userPrompt: ', userPrompt);
  try {
    // Make the API call to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // gpt-4o-mini-2024-07-18
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 2000, // Adjust as needed
      temperature: 0.1, // Adjust for desired creativity/randomness
    });

    // Extract the generated content from the API response
    const generatedContent = completion.choices[0].message.content;

    // Return the generated content
    return { generatedContent };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to generate interview preparation materials.');
  }

}

//TODO: add correct params
async function makeAIAPICalls(profile: any) {

  const systemPrompt = `
You are a senior recruiter helping a student prepare for an interview. I will provide the student’s resume, job description, company website URL, and today’s date. Based on the information provided, generate a personalized interview preparation prep sheet that includes the following sections:
Company Research:
Provide a brief overview of the company, including its mission, key products/services, and relevant recent news.
Include Company Culture Insights to help the student understand the company’s work environment, values, and professional development opportunities.
After that, provide at least five links to articles, YouTube videos, or podcasts the student can check out to dig deeper. Ensure that the links are numbered and include clickable titles, formatted with the URL in parentheses as well. Derive the company name and market from the provided job description and/or website URL.
Company Culture Insights:
Describe the company’s culture, including how they approach employee development, collaboration, work-life balance, and their core values.
Include insights into the company’s leadership principles and diversity and inclusion efforts, where applicable.
Job Description Breakdown and Your Fit (as of Today’s Date):
Look at the job description and explain how the student’s experiences (from their resume) match up with what the role needs.
Keep this section concise, focusing on how the student's technical skills, leadership, and problem-solving abilities align with the requirements of the role.
Ensure the information is level-appropriate for the student’s current year and experience level based on today’s date.
Types of Questions You Might Get:
Provide one behavioral, one technical, and one role-specific question.
Direct the comments and insights to the applicant in a conversational tone (e.g., “They might ask you about...").
Prioritize the technical question based on the top technical skills required for the role. For behavioral and role-specific questions, tailor them to key responsibilities and leadership principles mentioned in the job description.
3 STAR Stories for Behavioral Questions:
Create three personalized STAR stories (Situation, Task, Action, Result) based on the student’s resume.
These stories should be written from the student’s perspective, focusing on specific projects or leadership experiences they’ve had.
Each STAR story should include a topic or type of question that might spur the use of the story.
5 Personalized Questions for the Interviewer:
Suggest five relevant questions the student can ask the interviewer. These questions should be both professional and conversational, showing that the student has done their homework on the company and the role.
Tech/Skills to Brush Up On:
List 4-5 key technical or role-related skills the student should review before the interview so they feel confident discussing relevant topics.
Prioritize the top skills the role requires, ensuring they are level-appropriate for the student’s experience and background.
Personalized Pitch:
Write a personalized elevator pitch the student can use during the interview. It should highlight why they’re a good fit for the role based on their background, skills, and interest in the company.
At the End:
Include the following note at the bottom:
“This prep sheet is personalized for [First Name Last Name] on [Today’s Date]. Note that the prep sheet is meant as a guide based on the information you have provided. You should verify all information. Good luck. Go crush it!”
`;
const userPrompt = `
resume: ${resumeText}
job description: ${jobDescription}
company website URL: ${companyWebsiteUrl}
today's date: ${todayDate}
  `;

  try {
    // Make the API call to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // gpt-4o-mini-2024-07-18
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_completion_tokens: 2000,
      temperature: 1.0,
    });

    // Extract the generated content from the API response
    const generatedContent = completion.choices[0].message.content;

    // Return the generated content
    return { generatedContent };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to generate interview preparation materials.');
  }
}

// async function storeAIResponse(profileId: number, aiResponse: any) {
//   // Store the AI response in the database
//   await prisma.ai_interview_coach_prod_ai_responses.create({
//     data: {
//       profile_id: profileId,
//       response_data: JSON.stringify(aiResponse),
//     },
//   })
// }

export async function getById(id: number) {
  try {
    const profile = await prisma.ai_interview_coach_prod_profiles.findUnique({
      where: { id: id },
    })
    return profile
  } catch (error) {
    console.error('Error fetching profile:', error)
    throw error
  }
}

export async function update(id: number, data: { name?: string; email?: string; bio?: string }) {
  try {
    const updatedProfile = await prisma.ai_interview_coach_prod_profiles.update({
      where: { id: id },
      data: data,
    })
    return updatedProfile
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}

export async function deleteProfile(id: number) {
  try {
    const deletedProfile = await prisma.ai_interview_coach_prod_profiles.delete({
      where: { id: id },
    })
    return deletedProfile
  } catch (error) {
    console.error('Error deleting profile:', error)
    throw error
  }
}

export async function getAll() {
  try {
    const profiles = await prisma.ai_interview_coach_prod_profiles.findMany()
    return profiles
  } catch (error) {
    console.error('Error fetching all profiles:', error)
    throw error
  }
}

