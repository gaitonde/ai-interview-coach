'use client'

import { Button } from '@/components/ui/button'
import { Footer } from './components-footer'
import { Clipboard } from 'lucide-react'

export function JobPrepComponent() {
  // Mock data - in a real application, this would come from an API or database
  const companyInfo = {
    name: "TechCorp Inc.",
    description: "A global leader in technology innovation, providing a wide range of products and services from digital infrastructure and cloud computing to artificial intelligence (TechAI) and smart devices (SmartEase).",
    mission: "To drive innovation that empowers individuals and businesses worldwide",
  }

  const companyCulture = [
    "Customer Obsession: Focus on delivering exceptional customer experiences",
    "Ownership: Foster a strong sense of ownership among employees",
    "Leadership Principles: Innovate and Simplify, Deliver Results, Be Curious and Learn Continuously",
    "Diversity and Inclusion: Actively promote an inclusive and diverse work environment",
    "Professional Growth: Offer mentoring programs, training, and opportunities for career growth",
  ]

  const starStories = [
    {
      topic: "Leadership and managing a team under pressure",
      situation: "As lead Android developer for Chorus, responsible for managing a small team of three developers to create a conversational assistant app.",
      task: "Had a tight deadline and needed to deliver a high-quality product.",
      action: "Organized tasks using Agile methodologies, set up frequent check-ins to track progress, and resolved technical issues as they came up.",
      result: "Delivered the app on time with all its key functionalities working smoothly, including text-to-speech and speech-to-text capabilities.",
    },
    {
      topic: "Problem-solving and innovation",
      situation: "In role with NavCog, tasked with developing tools to assist blind users in navigating complex spaces.",
      task: "Needed to create an app that combined crowdsourcing and sensor data to accurately guide users.",
      action: "Designed an innovative system using computer vision and crowdsourced data to generate 3D building models.",
      result: "The tool significantly improved accessibility for blind users and was well-received by the community.",
    },
    {
      topic: "Data-driven decision making",
      situation: "While working on Budgie, an expense management app, needed to categorize users' expenses and present meaningful insights.",
      task: "Had to ensure the app displayed financial data in a user-friendly and impactful way.",
      action: "Implemented Microsoft's OCR API to scan and categorize receipts and created visualizations of users' spending patterns through pie charts.",
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
              <p className="text-[#F9FAFB] text-center">2025 Product Manager Intern - May Trix</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#10B981]">Company Information</h2>
              <p className="text-[#F9FAFB]"><strong>Name:</strong> {companyInfo.name}</p>
              <p className="text-[#F9FAFB]"><strong>Description:</strong> {companyInfo.description}</p>
              <p className="text-[#F9FAFB]"><strong>Mission:</strong> {companyInfo.mission}</p>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#10B981]">Company Culture Insights</h2>
              <ul className="list-disc pl-5 space-y-2 text-[#F9FAFB]">
                {companyCulture.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#10B981]">STAR Stories</h2>
              {starStories.map((story, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-lg font-semibold text-[#D1D5DB]">{story.topic}</h3>
                  <p className="text-[#F9FAFB]"><strong>Situation:</strong> {story.situation}</p>
                  <p className="text-[#F9FAFB]"><strong>Task:</strong> {story.task}</p>
                  <p className="text-[#F9FAFB]"><strong>Action:</strong> {story.action}</p>
                  <p className="text-[#F9FAFB]"><strong>Result:</strong> {story.result}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#10B981]">Questions for the Interviewer</h2>
              <ul className="list-disc pl-5 space-y-2 text-[#F9FAFB]">
                {interviewerQuestions.map((question, index) => (
                  <li key={index}>{question}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#10B981]">Tech/Skills to Brush Up On</h2>
              <ul className="list-disc pl-5 space-y-2 text-[#F9FAFB]">
                {skillsToBrushUp.map((skill, index) => (
                  <li key={index}>
                    <strong>{skill.skill}</strong>{skill.priority ? ` (${skill.priority})` : ''}: {skill.description}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#10B981]">Personalized Pitch</h2>
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
            <Button className="w-full bg-[#10B981] text-[#F9FAFB] py-3 rounded-md font-medium hover:bg-[#0e9370] transition-colors">
              See Mock Interview Questions
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}