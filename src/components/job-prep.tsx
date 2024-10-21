'use client'

import { Button } from "@/components/ui/button"
import { Footer } from './components-footer'
import { Clipboard } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function JobPrepComponent() {
  const router = useRouter()
  const companyInfo = {
    name: "TechCorp Inc.",
    description: "TechCorp Inc. is a global leader in technology innovation, providing a wide range of products and services from digital infrastructure to smart devices. The company is well-known for its commitment to innovation and delivering customer-centric solutions.",
    mission: "TechCorp aims to drive innovation that empowers individuals and businesses worldwide.",
    keyProducts: "Digital infrastructure (TechAI), smart devices (SmartEase), and cloud services.",
    recentNews: "TechCorp continues to expand its AI capabilities while focusing on sustainability and long-term growth. They are prioritizing customer-centric innovations and streamlining their product offerings to meet future demand.",
  }

  const companyCulture = {
    customerObsession: "TechCorp is driven by the mission to continuously improve the customer experience. Product managers are essential in this process, constantly identifying customer needs and providing innovative solutions.",
    teamDynamics: "Employees at TechCorp collaborate closely with senior leadership and are expected to take ownership of projects from day one. Junior team members contribute to high-impact projects and gain significant exposure to leadership.",
    professionalDevelopment: "TechCorp supports continuous growth through mentorship, access to specialized training programs, and opportunities for upward mobility.",
    workLifeBalance: "Though fast-paced, TechCorp promotes work-life balance by fostering a flexible working environment.",
    communityAndValues: "The company emphasizes diversity and inclusion while encouraging participation in sustainability and social responsibility programs.",
  }

  const links = [
    { name: "TechCorp's Leadership Principles", url: "https://www.techcorp.com/leadership-principles" },
    { name: "TechCorp's Data Innovation and Strategy", url: "https://www.technews.com/data-strategy-techcorp" },
    { name: "How TechCorp Focuses on Customer Experience", url: "https://www.techcorp.com/news/customer-obsession" },
    { name: "Product Management at TechCorp", url: "https://www.youtube.com/watch?v=TechCorpPM" },
    { name: "The Role of Product Managers at TechCorp", url: "https://medium.com/pm-practice/land-a-pm-job-at-techcorp" },
  ]

  const jobDescription = "As a 2025 Product Manager Intern, you'll support vendor managers in improving business performance, digitizing procurement processes, and generating insights from large datasets."

  const yourFit = [
    "Where You Stand: Since today is October 21, 2024, you are currently a junior, which aligns with TechCorp's requirements for rising seniors for their summer internship program.",
    "Technical Experience: Your work on NavCog and Chorus showcases your skills in Android development and data analysis—both critical for handling large datasets and driving insights, which TechCorp highly values.",
    "Leadership and Teamwork: As the captain of the women's varsity golf team and social media manager at Business Golf Academy, you've demonstrated leadership and collaboration skills that TechCorp looks for in its product management interns.",
    "Problem-Solving: Your experience developing tools like NavCog to help visually impaired users navigate complex spaces showcases your ability to identify customer pain points and build solutions—a core focus for TechCorp.",
  ]

  const questionTypes = [
    {
      type: "Behavioral",
      question: "Tell me about a time you led a team to achieve a goal under a tight deadline.",
      why: "TechCorp values leadership and ownership. They want to see how you manage pressure and lead teams to deliver results.",
      focus: "You can discuss your experience leading the development of Chorus, where you managed a team of 3 developers to create a conversational assistant app within a strict timeline.",
    },
    {
      type: "Technical",
      question: "How would you analyze a large dataset to identify performance gaps?",
      why: "TechCorp places a high priority on data-driven decision-making. They need to see how well you work with data and draw actionable insights.",
      focus: "Mention your work with NavCog and Chorus, where you analyzed data and system behaviors to optimize app performance. Highlight specific tools like Python and data visualization techniques you used.",
    },
    {
      type: "Role-Specific",
      question: "What strategies would you use to improve customer conversion rates on TechCorp's platform?",
      why: "Conversion rates are critical in e-commerce, and TechCorp needs to ensure its platform is optimized for customer engagement.",
      focus: "Reference your experience improving Umbrella's user interaction by utilizing A/B testing and data analysis to optimize app features.",
    },
  ]

  const starStories = [
    {
      topic: "Leadership and managing a team under pressure",
      situation: "During my time as lead Android developer for Chorus, I was responsible for managing a small team of three developers to create a conversational assistant app.",
      task: "We had a tight deadline and needed to deliver a high-quality product.",
      action: "I organized tasks using Agile methodologies, set up frequent check-ins to track progress, and resolved technical issues as they came up.",
      result: "We delivered the app on time with all its key functionalities working smoothly, including text-to-speech and speech-to-text capabilities.",
    },
    {
      topic: "Problem-solving and innovation",
      situation: "In my role with NavCog, I was tasked with developing tools to assist blind users in navigating complex spaces.",
      task: "I needed to create an app that combined crowdsourcing and sensor data to accurately guide users.",
      action: "I designed an innovative system using computer vision and crowdsourced data to generate 3D building models.",
      result: "The tool significantly improved accessibility for blind users and was well-received by the community.",
    },
    {
      topic: "Data-driven decision making",
      situation: "While working on Budgie, an expense management app, I needed to categorize users' expenses and present meaningful insights.",
      task: "I had to ensure the app displayed financial data in a user-friendly and impactful way.",
      action: "I implemented Microsoft's OCR API to scan and categorize receipts and created visualizations of users' spending patterns through pie charts.",
      result: "The app was well-received by users who appreciated the clear, intuitive interface and easy tracking of their finances.",
    },
  ]

  const interviewerQuestions = [
    "What are the most significant challenges TechCorp faces in optimizing conversion rates, and how do product managers contribute to overcoming them?",
    "Could you tell me more about the mentorship opportunities for interns? I'm curious how TechCorp supports learning and growth.",
    "How does TechCorp measure the success of product managers, and what metrics do you use to track performance?",
    "I've read about TechCorp's Leadership Principles. Could you share how these principles play out in your day-to-day work?",
    "What does career progression look like for product managers at TechCorp after the internship?",
  ]

  const skillsToBrushUp = [
    { skill: "Data Analysis", description: "Brush up on data manipulation and analysis using Python. You'll need to be comfortable with identifying trends in large datasets and extracting actionable insights.", priority: "Top Priority" },
    { skill: "Customer Metrics", description: "Be familiar with conversion rates, retention metrics, and strategies to improve them—key performance indicators in e-commerce." },
    { skill: "Product Management Tools", description: "Explore Agile methodologies and Jira for project management, since TechCorp often uses these to track product development." },
    { skill: "Presentation Skills", description: "Practice presenting data-driven insights clearly and concisely, as you will likely be asked to share findings with senior leadership." },
    { skill: "Natural Language Processing", description: "Since your work with Chorus and NavCog involved NLP, reviewing key concepts will prepare you for technical discussions around user interaction." },
  ]

  const personalizedPitch = "Hi, I'm May Trix, a junior at Carnegie Mellon University majoring in Computer Science. My experience in data analysis, mobile app development, and leadership—along with my work on projects like NavCog and Chorus—aligns well with TechCorp's focus on data-driven product management. I'm excited about the opportunity to work with your team to develop innovative solutions and improve customer experiences."

  return (
    <div className="flex flex-col min-h-screen bg-[#111827]">
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="prep-sheet-content">
          <div className="w-full max-w-4xl p-6 sm:p-8 space-y-6 sm:space-y-8 bg-[#1F2937] rounded-xl shadow-md">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#10B981] text-center">Interview Prep Sheet for TechCorp Inc.</h1>
              <div className="space-y-0">
                <p className="text-[#F9FAFB]">Date: October 21, 2024</p>
                <p className="text-[#F9FAFB]">Candidate: May Trix</p>
                <p className="text-[#F9FAFB]">Position: 2025 Product Manager Intern</p>
                <p className="text-[#F9FAFB]">Company: TechCorp Inc.</p>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#10B981]">Company Research:</h2>
              <p className="text-[#F9FAFB]">{companyInfo.description}</p>
              <ul className="list-disc pl-5 space-y-2 text-[#F9FAFB]">
                <li><strong>Mission:</strong> {companyInfo.mission}</li>
                <li><strong>Key Products/Services:</strong> {companyInfo.keyProducts}</li>
                <li><strong>Recent News:</strong> {companyInfo.recentNews}</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#10B981]">Company Culture Insights:</h2>
              <p className="text-[#F9FAFB]"><strong>Customer Obsession:</strong> {companyCulture.customerObsession}</p>
              <ul className="list-disc pl-5 space-y-2 text-[#F9FAFB]">
                <li><strong>Team Dynamics:</strong> {companyCulture.teamDynamics}</li>
                <li><strong>Professional Development:</strong> {companyCulture.professionalDevelopment}</li>
                <li><strong>Work-Life Balance:</strong> {companyCulture.workLifeBalance}</li>
                <li><strong>Community and Values:</strong> {companyCulture.communityAndValues}</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#10B981]">Check Out These Links:</h2>
              <ol className="list-decimal pl-5 space-y-2 text-[#F9FAFB]">
                {links.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-[#10B981] hover:underline">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#10B981]">Job Description Breakdown and Your Fit (as of October 21, 2024):</h2>
              <p className="text-[#F9FAFB]"><strong>Job Description:</strong> {jobDescription}</p>
              <h3 className="text-lg font-semibold text-[#D1D5DB]">Your Fit:</h3>
              <ol className="list-decimal pl-5 space-y-2 text-[#F9FAFB]">
                {yourFit.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#10B981]">Types of Questions You Might Get:</h2>
              {questionTypes.map((qt, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-lg font-semibold text-[#D1D5DB]">{index + 1}. {qt.type}:</h3>
                  <p className="text-[#F9FAFB]"><strong>Question:</strong> {qt.question}</p>
                  <p className="text-[#F9FAFB]"><strong>Why they're asking:</strong> {qt.why}</p>
                  <p className="text-[#F9FAFB]"><strong>What you should focus on:</strong> {qt.focus}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#10B981]">3 STAR Stories for Behavioral Questions:</h2>
              {starStories.map((story, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-lg font-semibold text-[#D1D5DB]">{index + 1}. Topic: {story.topic}</h3>
                  <p className="text-[#F9FAFB]"><strong>Situation:</strong> {story.situation}</p>
                  <p className="text-[#F9FAFB]"><strong>Task:</strong> {story.task}</p>
                  <p className="text-[#F9FAFB]"><strong>Action:</strong> {story.action}</p>
                  <p className="text-[#F9FAFB]"><strong>Result:</strong> {story.result}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#10B981]">5 Personalized Questions for the Interviewer:</h2>
              <ol className="list-decimal pl-5 space-y-2 text-[#F9FAFB]">
                {interviewerQuestions.map((question, index) => (
                  <li key={index}>{question}</li>
                ))}
              </ol>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#10B981]">Tech/Skills to Brush Up On:</h2>
              <ol className="list-decimal pl-5 space-y-2 text-[#F9FAFB]">
                {skillsToBrushUp.map((skill, index) => (
                  <li key={index}>

                    <strong>{skill.skill}</strong>{skill.priority ? ` (${skill.priority})` : ''}: {skill.description}
                  </li>
                ))}
              </ol>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#10B981]">Personalized Pitch:</h2>
              <p className="text-[#F9FAFB]">{personalizedPitch}</p>
            </div>
            <div className="space-y-4">
              <p className="text-[#F9FAFB] italic">This prep sheet is personalized for May Trix on October 21, 2024. Note that the prep sheet is meant as a guide based on the information you have provided. You should verify all information. Good luck. Go crush it!</p>
            </div>
            <Button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const content = document.querySelector('.prep-sheet-content')?.textContent;
                  if (content) {
                    navigator.clipboard.writeText(content)
                      .then(() => alert('Content copied to clipboard!'))
                      .catch(err => console.error('Failed to copy: ', err));
                  }
                }
              }}
              className="w-full mb-4 bg-[#4B5563] text-[#F9FAFB] py-3 rounded-md font-medium hover:bg-[#374151] transition-colors flex items-center justify-center"
            >
              <Clipboard className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </Button>
            <Button
              onClick={() => router.push('/questions')}
              className="w-full bg-[#10B981] text-[#F9FAFB] py-3 rounded-md font-medium hover:bg-[#0e9370] transition-colors">
              See Mock Interview Questions
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}