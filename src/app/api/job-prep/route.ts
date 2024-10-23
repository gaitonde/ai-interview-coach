import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { sql } from '@vercel/postgres';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

These inputs may be provided:
Resume: The student’s resume, including their background, skills, and experiences. Use the variable {resumeStudent}.
Job Description: The description of the role, including responsibilities and qualifications. Use the variable {jobDescription}.
Company Website URL: To provide relevant research and context. Use the variable {companyWebsiteURL}.
Graduation Year: To help tailor the fit and skills sections further. Use variable {gradYear}
Today’s Date: This will be used in conjunction with Graduation Year to determine the student’s current year in school and help align their experience with the job's qualifications. Use the variable {todayDate}.
School Name: For additional context about the student and related coursework. Use variable {schoolName}
Major: For additional context about the student’s area of focus in school. Use variable {schoolMajor}
Concentration: For additional context about the student’s area of narrowed emphasis in school. Use variable {schoolConcentration}
LinkedIn Profile: Additional professional info, endorsements, certifications, or volunteer work. Use variable {studentLI}
School’s Course Catalog: Relevant coursework that ties into the role. Use variable {schoolCourseCatalog}

<example>
# Awesome Interview Prep Sheet for TechCorp Inc.

**Date**: October 21, 2024
**Candidate**: May Trix
**Position**: 2025 Product Manager Intern
**Company**: TechCorp Inc.

---

## Company Research

**TechCorp Inc.** is a global leader in technology innovation, providing a wide range of products and services from digital infrastructure to smart devices. The company is well-known for its commitment to innovation and delivering customer-centric solutions.

* **Mission**: TechCorp aims to drive innovation that empowers individuals and businesses worldwide.
* **Key Products/Services**: Digital infrastructure (TechAI), smart devices (SmartEase), and cloud services.
* **Recent News**: TechCorp continues to expand its AI capabilities while focusing on sustainability and long-term growth. They are prioritizing customer-centric innovations and streamlining their product offerings to meet future demand.

---

### Company Culture Insights

**Customer Obsession**: TechCorp is driven by the mission to continuously improve the customer experience. Product managers are essential in this process, constantly identifying customer needs and providing innovative solutions.

* **Team Dynamics**: Employees at TechCorp collaborate closely with senior leadership and are expected to take ownership of projects from day one. Junior team members contribute to high-impact projects and gain significant exposure to leadership.
* **Professional Development**: TechCorp supports continuous growth through mentorship, access to specialized training programs, and opportunities for upward mobility.
* **Work-Life Balance**: Though fast-paced, TechCorp promotes work-life balance by fostering a flexible working environment.
* **Community and Values**: The company emphasizes diversity and inclusion while encouraging participation in sustainability and social responsibility programs.

### Check Out These Links

1. **TechCorp’s Leadership Principles**
   ([https://www.techcorp.com/leadership-principles](https://www.techcorp.com/leadership-principles))
2. **TechCorp’s Data Innovation and Strategy**
   (https://www.technews.com/data-strategy-techcorp)
3. **How TechCorp Focuses on Customer Experience**
   (https://www.techcorp.com/news/customer-obsession)
4. **Product Management at TechCorp**
   ([https://www.youtube.com/watch?v=TechCorpPM](https://www.youtube.com/watch?v=TechCorpPM))
5. **The Role of Product Managers at TechCorp**
   (https://medium.com/pm-practice/land-a-pm-job-at-techcorp)

---

## Job Description Breakdown and Your Fit (as of October 21, 2024)

**Job Description**
As a **2025 Product Manager Intern**, you'll support vendor managers in improving business performance, digitizing procurement processes, and generating insights from large datasets.

**Your Fit**
1. **Where You Stand**: Since today is October 21, 2024, you are currently a junior, which aligns with TechCorp's requirements for rising seniors for their summer internship program.
2. **Technical Experience**: Your work on **NavCog** and **Chorus** showcases your skills in Android development and data analysis—both critical for handling large datasets and driving insights, which TechCorp highly values.
3. **Leadership and Teamwork**: As the captain of the **women’s varsity golf team** and **social media manager** at Business Golf Academy, you’ve demonstrated leadership and collaboration skills that TechCorp looks for in its product management interns.
4. **Problem-Solving**: Your experience developing tools like **NavCog** to help visually impaired users navigate complex spaces showcases your ability to identify customer pain points and build solutions—a core focus for TechCorp.

---

##   Types of Questions You Might Get

1. **Behavioral**
   **Question**: "Tell me about a time you led a team to achieve a goal under a tight deadline."
   **Why they’re asking**: TechCorp values leadership and ownership. They want to see how you manage pressure and lead teams to deliver results.
   **What you should focus on**: You can discuss your experience leading the development of **Chorus**, where you managed a team of 3 developers to create a conversational assistant app within a strict timeline.
2. **Technical**
   **Question**: "How would you analyze a large dataset to identify performance gaps?"
   **Why they’re asking**: TechCorp places a high priority on data-driven decision-making. They need to see how well you work with data and draw actionable insights.
   **What you should focus on**: Mention your work with **NavCog** and **Chorus**, where you analyzed data and system behaviors to optimize app performance. Highlight specific tools like Python and data visualization techniques you used.
3. **Role-Specific**
   **Question**: "What strategies would you use to improve customer conversion rates on TechCorp's platform?"
   **Why they’re asking**: Conversion rates are critical in e-commerce, and TechCorp needs to ensure its platform is optimized for customer engagement.
   **What you should focus on**: Reference your experience improving **Umbrella**'s user interaction by utilizing A/B testing and data analysis to optimize app features.

---

### **3 STAR Stories for Behavioral Questions:**

1. **Topic**: Leadership and managing a team under pressure
   **Situation**: During my time as lead Android developer for **Chorus**, I was responsible for managing a small team of three developers to create a conversational assistant app.
   **Task**: We had a tight deadline and needed to deliver a high-quality product.
   **Action**: I organized tasks using Agile methodologies, set up frequent check-ins to track progress, and resolved technical issues as they came up.
   **Result**: We delivered the app on time with all its key functionalities working smoothly, including text-to-speech and speech-to-text capabilities.
2. **Topic**: Problem-solving and innovation
   **Situation**: In my role with **NavCog**, I was tasked with developing tools to assist blind users in navigating complex spaces.
   **Task**: I needed to create an app that combined crowdsourcing and sensor data to accurately guide users.
   **Action**: I designed an innovative system using computer vision and crowdsourced data to generate 3D building models.
   **Result**: The tool significantly improved accessibility for blind users and was well-received by the community.
3. **Topic**: Data-driven decision making
   **Situation**: While working on **Budgie**, an expense management app, I needed to categorize users’ expenses and present meaningful insights.
   **Task**: I had to ensure the app displayed financial data in a user-friendly and impactful way.
   **Action**: I implemented Microsoft’s OCR API to scan and categorize receipts and created visualizations of users’ spending patterns through pie charts.
   **Result**: The app was well-received by users who appreciated the clear, intuitive interface and easy tracking of their finances.

---

### **5 Personalized Questions for the Interviewer:**

1. **Professional**: "What are the most significant challenges TechCorp faces in optimizing conversion rates, and how do product managers contribute to overcoming them?"
2. **Professional but Conversational**: "Could you tell me more about the mentorship opportunities for interns? I’m curious how TechCorp supports learning and growth."
3. **Professional**: "How does TechCorp measure the success of product managers, and what metrics do you use to track performance?"
4. **Professional but Conversational**: "I’ve read about TechCorp’s Leadership Principles. Could you share how these principles play out in your day-to-day work?"
5. **Professional**: "What does career progression look like for product managers at TechCorp after the internship?"

---

### **Tech/Skills to Brush Up On:**

1. **Data Analysis (Top Priority)**: Brush up on data manipulation and analysis using Python. You’ll need to be comfortable with identifying trends in large datasets and extracting actionable insights.
2. **Customer Metrics**: Be familiar with conversion rates, retention metrics, and strategies to improve them—key performance indicators in e-commerce.
3. **Product Management Tools**: Explore Agile methodologies and Jira for project management, since TechCorp often uses these to track product development.
4. **Presentation Skills**: Practice presenting data-driven insights clearly and concisely, as you will likely be asked to share findings with senior leadership.
5. **Natural Language Processing**: Since your work with **Chorus** and **NavCog** involved NLP, reviewing key concepts will prepare you for technical discussions around user interaction.

---

## Personalized Pitch

"Hi, I’m May Trix, a junior at Carnegie Mellon University majoring in Computer Science. My experience in data analysis, mobile app development, and leadership—along with my work on projects like NavCog and Chorus—aligns well with TechCorp’s focus on data-driven product management. I’m excited about the opportunity to work with your team to develop innovative solutions and improve customer experiences."

<br>

---

<br>

**This prep sheet is personalized for May Trix on October 21, 2024\. Note that the prep sheet is meant as a guide based on the information you have provided. You should verify all information. Good luck. Go crush it\!**

</example>

`;

export async function POST(request: Request) {
  console.log('in BE with request for generating prep sheet');
  const body = await request.json();
  const profileId = body.profileId;

  const todayDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const profileDetails = await sql`
    SELECT school, major, concentration, graduation_date
    FROM ai_interview_coach_prod_profiles
    WHERE id = ${profileId}
  `;

  if (profileDetails.rows.length === 0) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const {
    school: schoolName,
    major: schoolMajor,
    concentration: schoolConcentration,
    graduation_date: graduationDate
  } = profileDetails.rows[0];

  const gradYear = new Date(graduationDate).getFullYear();

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


//TODO: get this from db
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

  const userPrompt = `
    Job Description: ${jobDescriptionURL}
    Company: ${companyWebsiteUrl}
    Resume: ${resumeUrl}
    GraduationYear: ${gradYear}
    Today's Date: ${todayDate}
    School Name: ${schoolName}
    Major:${schoolMajor}
    Concentration: ${schoolConcentration}
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
      temperature: 0.1,
    });

    const generatedContent = completion.choices[0]?.message?.content;

    // Upsert operation for prep_sheet_response
    await sql`
      INSERT INTO ai_interview_coach_prod_airesponses (profile_id, prep_sheet_response)
      VALUES (${profileId}, ${generatedContent})
      ON CONFLICT (profile_id)
      DO UPDATE SET prep_sheet_response = EXCLUDED.prep_sheet_response;
    `;

    console.log('in BE with generatedContent: ', generatedContent);
    // Return the generated content
    return NextResponse.json({ content: generatedContent });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ content: "unable to get content" }, { status: 500 });
  }
}
