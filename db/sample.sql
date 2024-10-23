-- Insert sample data into ai_interview_coach_prod_Profiles
INSERT INTO ai_interview_coach_prod_Profiles (email, school, major, concentration, graduation_date)
VALUES
    ('john.doe@stanford.edu', 'Stanford University', 'Computer Science', 'Artificial Intelligence', '2024-06-15'),
    ('jane.smith@mit.edu', 'MIT', 'Electrical Engineering', 'Robotics', '2023-05-20'),
    ('alice.johnson@harvard.edu', 'Harvard University', 'Business Administration', 'Finance', '2025-05-30');

-- Insert sample data into ai_interview_coach_prod_Jobs
INSERT INTO ai_interview_coach_prod_Jobs (profile_id, jd_url, jd_text)
VALUES
    (1, 'https://example.com/job1', 'Software Engineer at Tech Corp'),
    (1, 'https://example.com/job2', 'Data Scientist at AI Innovations'),
    (2, 'https://example.com/job3', 'Robotics Engineer at Future Robotics'),
    (3, 'https://example.com/job4', 'Financial Analyst at Big Bank');

-- Insert sample data into ai_interview_coach_prod_Resumes
INSERT INTO ai_interview_coach_prod_Resumes (profile_id, url, text)
VALUES
    (1, 'https://example.com/resume1', 'John Doe - Software Engineer Resume'),
    (2, 'https://example.com/resume2', 'Jane Smith - Robotics Engineer Resume'),
    (3, 'https://example.com/resume3', 'Alice Johnson - Financial Analyst Resume');

-- Insert sample data into ai_interview_coach_prod_airesponses
INSERT INTO ai_interview_coach_prod_airesponses (id, prep_sheet_response, created_at) VALUES
(
'# Interview Preparation Sheet

## Company Overview
- **Company Name**: TechInnovate Solutions
- **Industry**: Software Development and AI
- **Size**: Mid-sized (500-1000 employees)
- **Location**: Headquartered in San Francisco, with remote options

## Position Details
- **Job Title**: Senior Full Stack Developer
- **Department**: Product Development
- **Reports To**: Director of Engineering

## Key Responsibilities
1. Design and implement scalable web applications
2. Collaborate with cross-functional teams
3. Mentor junior developers
4. Contribute to architectural decisions

## Required Skills
- Proficiency in JavaScript, TypeScript, and React
- Experience with Node.js and Express.js
- Familiarity with cloud platforms (AWS, Azure, or GCP)
- Strong understanding of database design and ORM concepts

## Company Culture
- Emphasizes innovation and continuous learning
- Promotes work-life balance with flexible hours
- Encourages open communication and idea sharing

## Potential Questions to Ask
1. What are the biggest challenges facing the engineering team right now?
2. How does the company support professional development?
3. Can you describe the typical project lifecycle?
4. What opportunities are there for career growth within the company?

## Key Achievements to Highlight
- Successfully led a team in delivering a high-performance web application
- Implemented CI/CD pipelines that reduced deployment time by 40%
- Contributed to open-source projects related to React and Node.js

Remember to tailor your responses to showcase how your experience aligns with TechInnovate Solutions'' needs and culture. Good luck!',
NOW() - INTERVAL '2 days'
),
(
'# Interview Preparation Guide

## Company Background
- **Company**: GreenEarth Innovations
- **Sector**: Environmental Technology
- **Employee Count**: 200-300
- **Main Office**: Seattle, with satellite offices globally

## Job Information
- **Position**: Environmental Data Scientist
- **Team**: Research and Analytics
- **Reporting Line**: Chief Data Officer

## Core Duties
1. Analyze environmental data sets
2. Develop predictive models for climate patterns
3. Create data visualizations for stakeholders
4. Collaborate on green technology initiatives

## Essential Qualifications
- Advanced degree in Data Science, Environmental Science, or related field
- Proficiency in Python, R, and SQL
- Experience with machine learning algorithms
- Knowledge of GIS and remote sensing technologies

## Workplace Environment
- Committed to sustainability and eco-friendly practices
- Encourages interdisciplinary collaboration
- Offers opportunities for field research and travel

## Questions for the Interviewer
1. How does GreenEarth Innovations measure the impact of its environmental projects?
2. What upcoming initiatives is the company most excited about?
3. How does the company balance commercial interests with environmental goals?
4. What opportunities exist for professional growth and specialization?

## Achievements to Emphasize
- Published research on climate change prediction models
- Developed an algorithm that improved renewable energy efficiency by 15%
- Led a team that won a hackathon focused on sustainable urban planning

Approach the interview with enthusiasm for environmental causes and be prepared to discuss how your data science skills can contribute to GreenEarth Innovations'' mission. Best of luck!',
NOW() - INTERVAL '1 day'
),
(
'# Interview Prep Sheet

## About the Company
- **Organization**: HealthTech Dynamics
- **Field**: Healthcare Technology
- **Workforce**: 1000+ employees
- **Headquarters**: Boston, with offices in major cities

## Role Overview
- **Title**: Senior UX/UI Designer
- **Division**: Product Design
- **Reports to**: Head of User Experience

## Primary Responsibilities
1. Create user-centered designs for healthcare applications
2. Conduct user research and usability testing
3. Collaborate with product managers and developers
4. Ensure accessibility and inclusivity in all designs

## Required Expertise
- Degree in Design, HCI, or related field
- Proficiency in design tools (Figma, Sketch, Adobe Creative Suite)
- Experience in designing for healthcare or regulated industries
- Understanding of HIPAA compliance in digital products

## Company Values
- Patient-centric approach to technology
- Emphasis on ethical AI and data privacy
- Promotes diversity and inclusion in healthcare
- Encourages continuous learning and innovation

## Suggested Questions
1. How does HealthTech Dynamics incorporate patient feedback into the design process?
2. What strategies does the company use to stay ahead in the rapidly evolving healthtech sector?
3. Can you describe a challenging project and how the team overcame obstacles?
4. How does the company balance innovation with regulatory compliance?

## Key Accomplishments to Mention
- Redesigned a patient portal increasing user satisfaction by 40%
- Led the UX strategy for a telemedicine platform used by over 1 million patients
- Received an award for designing an inclusive medical app for visually impaired users

Remember to showcase your passion for improving healthcare through thoughtful design. Highlight your ability to create intuitive interfaces that can positively impact patient care. Good luck with your interview!',
NOW()
);

INSERT INTO ai_interview_coach_prod_airesponses (id, prep_sheet_response, created_at) VALUES
(1,
"# Interview Preparation Prep Sheet\n'
    '\n'
    '## Company Research:\n'
    '### Snowflake\n'
    '**Mission:** Snowflake aims to build the future of the AI Data Cloud by providing highly scalable and resilient infrastructure and platform services using software-based approaches.\n'
    '\n'
    '**Key Products/Services:** Snowflake offers a cloud data platform that enables organizations to store, manage, and analyze their data efficiently.\n'
    '\n'
    '**Recent News:** Snowflake has recently announced partnerships with leading tech companies to enhance its cloud computing capabilities.\n'
    '\n'
    '**Company Culture Insights:** Snowflake fosters a collaborative work environment that values innovation, problem-solving, and continuous learning. The company emphasizes employee development through challenging projects and opportunities to work with cutting-edge technologies.\n'
    '\n'
    '## Additional Resources to Explore:\n'
    '1. **Understanding Snowflake's Cloud Data Platform**  \n'
    '   [Link](https://www.snowflake.com/en/cloud-data-platform)\n'
    '\n'
    '2. **Snowflake's Approach to Infrastructure-as-Code**  \n'
    '   [Link](https://www.snowflake.com/en/infrastructure-as-code)\n'
    '\n'
    '3. **Interview with Snowflake's Engineering Team**  \n'
    '   [Link](https://www.youtube.com/watch?v=XXXXX)  \n'
    '\n'
    '4. **Podcast: Inside Snowflake's Culture of Innovation**  \n'
    '   [Link](https://www.podcast.com/snowflake-innovation)\n'
    '\n'
    '5. **Snowflake's Growth and Expansion Strategies**  \n'
    '   [Link](https://www.snowflake.com/en/growth-strategies)\n'
    '\n'
    '## Job Description Breakdown and Your Fit (as of Oct 22, 2024):\n'
    'Based on your experiences as a Research Assistant at Carnegie Mellon University and your technical skills in software development and infrastructure management, you align well with Snowflake's requirements for a Senior Container Platform Engineer. Your background in building Android and web apps, leading teams, and practicing infrastructure-as-code make you a strong candidate for this role.\n'
    '\n'
    '## Types of Questions You Might Get:\n'
    '- **Behavioral Question:** Can you describe a time when you had to troubleshoot a complex technical issue under pressure?\n'
    '- **Technical Question:** How would you design a highly scalable and reliable Kubernetes platform for a cloud environment?\n'
    '- **Role-Specific Question:** How do you approach automating infrastructure management using tools like Terraform and Ansible?\n'
    '\n'
    '## 3 STAR Stories for Behavioral Questions:\n'
    '1. **Topic:** Leadership and Problem-Solving  \n'
    '   **Situation:** Leading a team to develop mobile apps for Chorus.  \n'
    '   **Task:** Implementing text-to-speech capabilities using APIs.  \n'
    '   **Action:** Developing a natural language processor tool for the web application.  \n'
    '   **Result:** Successfully enhancing Chorus's functionality and user experience.\n'
    '\n'
    '2. **Topic:** Collaboration and Innovation  \n'
    '   **Situation:** Working on NavCog to assist blind individuals in navigation.  \n'
    '   **Task:** Creating 3D models of buildings through crowdsourcing efforts.  \n'
    '   **Action:** Integrating sensors and computer vision technologies.  \n'
    '   **Result:** Improving the accessibility and accuracy of NavCog for users.\n'
    '\n'
    '3. **Topic:** Technical Troubleshooting  \n'
    '   **Situation:** Developing Umbrella app for addressing gender-based violence.  \n'
    '   **Task:** Implementing Bluetooth-based messaging for anonymous reporting.  \n'
    '   **Action:** Resolving technical challenges to ensure secure and reliable communication.  \n'
    '   **Result:** Enhancing user safety and engagement through effective app functionality.\n'
    '\n'
    '## 5 Personalized Questions for the Interviewer:\n'
    '1. Can you share more about the team dynamics and collaboration opportunities within the cloud engineering organization at Snowflake?\n'
    '2. How does Snowflake support continuous learning and professional development for its engineering team members?\n'
    '3. What are some of the key challenges that the Container Platform team is currently facing, and how does Snowflake approach problem-solving in such scenarios?\n'
    '4. Could you provide insights into the onboarding process for new team members joining the cloud engineering team at Snowflake?\n'
    '5. How does Snowflake promote a culture of innovation and experimentation within its technical teams?\n'
    '\n'
    '## Tech/Skills to Brush Up On:\n'
    '1. Kubernetes platform design and implementation.\n'
    '2. Infrastructure-as-code tools like Terraform and Ansible.\n'
    '3. Cloud computing toolsets such as Pulumi and Vault.\n'
    '4. Coding skills in Golang, Python, C++, or Java.\n'
    '\n'
    '## Personalized Pitch:\n'
    'As a dedicated Research Assistant with a strong background in developing innovative mobile and web applications, leading teams, and practicing infrastructure-as-code, I am excited about the opportunity to contribute to Snowflake's mission of building the future of the AI Data Cloud. My technical skills and problem-solving abilities align well with the requirements for the Senior Container Platform Engineer role, and I am eager to leverage my experiences to drive innovation and scalability within Snowflake's cloud engineering team.\n'
    '\n'
    '---\n'
    '\n'
    'This prep sheet is personalized for [May Trix] on [Oct 22, 2024]. Note that the prep sheet is meant as a guide based on the information you have provided. You should verify all information. Good luck. Go crush it!',
    NOW()
);
