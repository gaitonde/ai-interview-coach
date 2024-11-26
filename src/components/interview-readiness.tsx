'use client'

import React from 'react'
import { Frown, Meh, Smile, AlertCircle, Calendar, User, Briefcase, Target } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Category = {
  name: string
  score: number | null
  explanation: string
  description: string
  questionsAttempted: number
}

const categories: Category[] = [
  {
    name: "Behavioral",
    score: 24,
    explanation: "Excellent articulation of ideas and active listening skills demonstrated.",
    description: "Questions about past experiences and how you handled specific work situations.",
    questionsAttempted: 10
  },
  {
    name: "Technical",
    score: 5,
    explanation: "Significant gaps in technical knowledge. Focus on strengthening core concepts and practical application.",
    description: "Questions testing your knowledge of specific skills required for the job.",
    questionsAttempted: 8
  },
  {
    name: "Role Based",
    score: null,
    explanation: "Questions in this category were skipped. We don't have enough information to calculate a score.",
    description: "Questions specific to the responsibilities and expectations of the target job.",
    questionsAttempted: 0
  },
  {
    name: "Case Style",
    score: 20,
    explanation: "Innovative approaches used, could improve on time management.",
    description: "Problem-solving questions that assess your analytical and creative thinking skills.",
    questionsAttempted: 5
  },
]

const getScoreInfo = (score: number | null): { icon: React.ReactNode; text: string; color: string } => {
  if (score === null) return { icon: <AlertCircle className="w-6 h-6" />, text: "No Data", color: "text-yellow-500" }
  if (score >= 22) return { icon: <Smile className="w-6 h-6" />, text: "Ready", color: "text-green-500" }
  if (score >= 12) return { icon: <Meh className="w-6 h-6" />, text: "Kinda Ready", color: "text-yellow-500" }
  return { icon: <Frown className="w-6 h-6" />, text: "Not Ready", color: "text-red-500" }
}

export function InterviewReadinessComponent() {
  return (
    <div className="min-h-screen bg-[#1a1f2b] py-8 px-4">
      <div className="max-w-4xl mx-auto bg-[#252b3b] rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-center text-[#10B981]">AI Interview Coach</h1>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-center text-white">Interview Readiness</h2>

          <Card className="bg-[#1a1f2b] text-white mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-start">
                    <User className="w-5 h-5 mr-2 text-[#10B981] mt-1" />
                    <div>
                      <p className="text-sm font-semibold">Interviewer</p>
                      <p className="text-sm text-gray-300">Anjali Gupte</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <User className="w-5 h-5 mr-2 text-[#10B981] mt-1" />
                    <div>
                      <p className="text-sm font-semibold">Interviewer Role</p>
                      <p className="text-sm text-gray-300">Director of Marketing</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                    <Calendar className="w-5 h-5 mr-2 text-[#10B981] mt-1" />
                    <div>
                      <p className="text-sm font-semibold">Interview Date</p>
                      <p className="text-sm text-gray-300">May 15, 2023</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-start">
                    <Briefcase className="w-5 h-5 mr-2 text-[#10B981] mt-1" />
                    <div>
                      <p className="text-sm font-semibold">Company</p>
                      <p className="text-sm text-gray-300">Apple Inc</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Target className="w-5 h-5 mr-2 text-[#10B981] mt-1" />
                    <div>
                      <p className="text-sm font-semibold">Target Job</p>
                      <p className="text-sm text-gray-300">Marketing Intern</p>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                className="w-full bg-[#10B981] hover:bg-[#0D9668] text-white font-medium py-2 rounded-lg text-sm"
              >
                Practice All Interview Questions
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1f2b] text-white mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Meh className="w-6 h-6 text-yellow-500 mr-2" />
                  <span className="text-xl font-bold text-yellow-500">Kinda Ready</span>
                </div>
              </div>
              <p className="text-sm mb-4">Your performance shows some strengths, but there are areas that need improvement:</p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4 mb-4">
                <li>Technical knowledge is a significant concern and requires immediate attention.</li>
                <li>Role-based questions were skipped, indicating a potential lack of preparation in this area.</li>
                <li>While behavioral and case style performance was strong, there's still room for improvement.</li>
              </ul>
              <h3 className="text-sm font-semibold mb-2">What to practice next:</h3>
              <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                <li>Focus on strengthening your technical skills through coding practice and system design exercises.</li>
                <li>Research the specific role you're applying for and prepare answers to common role-based questions.</li>
                <li>Work on time management during case interviews to maximize your performance.</li>
                <li>Continue to refine your behavioral interview skills, focusing on more complex scenarios.</li>
              </ul>
            </CardContent>
          </Card>

          {categories.map((category) => {
            const { icon, text, color } = getScoreInfo(category.score)
            return (
              <Card key={category.name} className="bg-[#1a1f2b] text-white mb-4">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className="text-lg font-semibold">{category.name}</h2>
                      <p className="text-sm text-gray-400 italic mt-1">{category.description}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center">
                        <span className={`mr-2 ${color}`}>{icon}</span>
                        <span className={`text-sm ${color}`}>{text}</span>
                      </div>
                      <span className="text-xs text-gray-400 mt-1">
                        {category.questionsAttempted} questions attempted
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mt-3 mb-4">{category.explanation}</p>
                  <Button
                    className="w-full bg-[#10B981] hover:bg-[#0D9668] text-white font-medium py-2 rounded-lg text-sm"
                  >
                    Practice {category.name} Questions
                  </Button>
                </CardContent>
              </Card>
            )
          })}

          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              className="border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white font-medium py-2 rounded-lg text-sm"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}