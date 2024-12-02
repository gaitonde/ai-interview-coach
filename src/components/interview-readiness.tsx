'use client'

import React, { useEffect, useState } from 'react'
import { Frown, Meh, Smile, AlertCircle, Calendar, User, Briefcase, Target } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

type Interview = {
  interviewer_name: string
  interviewer_role: string
  interview_date: string
  company_name: string
  role_name: string
}

type CategoryResponse = {
  readiness_rating: string;
  readiness_text: string;
}

type Category = {
  name: string
  displayName: string
  description: string
  status?: string
  explanation?: string
}

const categories: Category[] = [
  {
    name: "Behavioral",
    displayName: "Behavioral",
    description: "Questions about past experiences and how you handled specific work situations.",
  },
  {
    name: "Technical",
    displayName: "Technical",
    description: "Questions testing your knowledge of specific skills required for the job.",
  },
  {
    name: "Role",
    displayName: "Role Based",
    description: "Questions specific to the responsibilities and expectations of the target job.",
  },
  {
    name: "Case",
    displayName: "Case Style",
    description: "Problem-solving questions that assess your analytical and creative thinking skills.",
  },
]

const getScoreInfo = (score?: string): { icon: React.ReactNode; text: string; color: string } => {
  if (score === undefined) return { icon: <AlertCircle className="w-6 h-6" />, text: "No Data", color: "text-yellow-500" }
  switch (score) {
    case "Ready":
      return { icon: <Smile className="w-6 h-6" />, text: "Ready", color: "text-green-500" }
    case "Kinda Ready":
      return { icon: <Meh className="w-6 h-6" />, text: "Kinda Ready", color: "text-yellow-500" }
    case "Not Ready":
      return { icon: <Frown className="w-6 h-6" />, text: "Not Ready", color: "text-red-500" }
    default:
      return { icon: <AlertCircle className="w-6 h-6" />, text: "No Data", color: "text-yellow-500" }
  }
}

export function InterviewReadinessComponent() {
  const router = useRouter()

  const [interview, setInterview] = useState<Interview | null>(null)
  const [categoryResponses, setCategoryResponses] = useState<Record<string, CategoryResponse>>({});

  useEffect(() => {
    const storedProfileId = localStorage.getItem('profileId')
    const jobId = localStorage.getItem('jobId')

    const categoriesToFetch = ['Overall', 'Behavioral', 'Technical', 'Role', 'Case'];

    Promise.all(
      categoriesToFetch.map(category =>
        fetch(`/api/interview-eval?profileId=${storedProfileId}&jobId=${jobId}&category=${category}`)
          .then(response => {
            if (!response.ok) throw new Error(`Failed to fetch ${category} evaluation`);
            return response.json();
          })
          .then(data => ({ category, data: data.content }))
      )
    )
    .then(results => {
      console.log('Results:', results);
      const responses: Record<string, CategoryResponse> = {};
      results.forEach(({ category, data }) => {
        console.log('Category:', category, 'Data:', data);
        responses[category] = {
          readiness_rating: data ? data.readiness_rating : "No Data",
          readiness_text: data ? data.readiness_text : "We don't have enough information to calculate a score."
        };
      });
      console.log('XXXX Responses:', responses);
      setCategoryResponses(responses);
    })
    .catch(error => {
      console.error('Error fetching evaluations:', error);
    });
  }, [])

  useEffect(() => {
    const storedProfileId = localStorage.getItem('profileId')
    const jobId = localStorage.getItem('jobId')
    fetch(`/api/jobs?profileId=${storedProfileId}&jobId=${jobId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch interview data');
      }
      return response.json();
    })
    .then(data => {
      console.log('Raw API response:', data.content);
      setInterview({
        interviewer_name: data.content.interviewer_name,
        interviewer_role: data.content.interviewer_role,
        interview_date: data.content.interview_date,
        company_name: data.content.company_name,
        role_name: data.content.role_name
      });
    })
    .catch(error => {
      console.error('Error fetching interview data:', error)
    });
  }, [])

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
                      <p className="text-sm text-gray-300">{interview?.interviewer_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <User className="w-5 h-5 mr-2 text-[#10B981] mt-1" />
                    <div>
                      <p className="text-sm font-semibold">Interviewer Role</p>
                      <p className="text-sm text-gray-300">{interview?.interviewer_role}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                    <Calendar className="w-5 h-5 mr-2 text-[#10B981] mt-1" />
                    <div>
                      <p className="text-sm font-semibold">Interview Date</p>
                      <p className="text-sm text-gray-300">
                        {interview?.interview_date ? new Date(interview.interview_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : ''}
                      </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-start">
                    <Briefcase className="w-5 h-5 mr-2 text-[#10B981] mt-1" />
                    <div>
                      <p className="text-sm font-semibold">Company</p>
                      <p className="text-sm text-gray-300">{interview?.company_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Target className="w-5 h-5 mr-2 text-[#10B981] mt-1" />
                    <div>
                      <p className="text-sm font-semibold">Target Job</p>
                      <p className="text-sm text-gray-300">{interview?.role_name}</p>
                    </div>
                  </div>
                </div>
              </div>
                <Button
                  className="w-full bg-[#10B981] hover:bg-[#0D9668] text-white font-medium py-2 rounded-lg text-sm"
                  onClick={() => router.push('/interview-practice')}
                >
                  Practice All Interview Questions
                </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1f2b] text-white mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <ReadinessIndicator readiness={categoryResponses.Overall?.readiness_rating ?? null} />
              </div>
              <ReactMarkdown
                components={{
                  ul: ({node, ...props}) => (
                    <ul className="list-disc pl-4 space-y-1 mb-4" {...props} />
                  )
                }}
              >{categoryResponses.Overall?.readiness_text ?? ''}</ReactMarkdown>
            </CardContent>
          </Card>

          {categories.map((category) => {
            const categoryResponse = categoryResponses[category.name];
            console.log('XXX Category Response:', categoryResponse);
            const { icon, text, color } = getScoreInfo(categoryResponse?.readiness_rating);
            return (
              <Card key={category.name} className="bg-[#1a1f2b] text-white mb-4">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className="text-lg font-semibold">{category.displayName}</h2>
                      <p className="text-sm text-gray-400 italic mt-1">{category.description}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center">
                        <span className={`mr-2 ${color}`}>{icon}</span>
                        <span className={`text-sm ${color}`}>{text}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mt-3 mb-4">
                    {categoryResponse?.readiness_text ?? 'Loading...'}
                  </p>
                  <Button
                    className="w-full bg-[#10B981] hover:bg-[#0D9668] text-white font-medium py-2 rounded-lg text-sm"
                    onClick={() => router.push(`/interview-practice?category=${category.name.toLowerCase()}`)}
                  >
                    Practice {category.name} Questions
                  </Button>
                </CardContent>
              </Card>
            );
          })}

          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              className="border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white font-medium py-2 rounded-lg text-sm"
              onClick={() => router.push('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

type ReadinessIndicatorProps = {
  readiness: string | null
}

export function ReadinessIndicator({ readiness }: ReadinessIndicatorProps) {
  const getIcon = () => {
    switch (readiness) {
      case "Ready":
        return <Smile className="w-6 h-6 text-green-500 mr-2" />
      case "Kinda Ready":
        return <Meh className="w-6 h-6 text-yellow-500 mr-2" />
      case "Not Ready":
        return <Frown className="w-6 h-6 text-red-500 mr-2" />
      default:
        return <AlertCircle className="w-6 h-6 text-yellow-500 mr-2" />
    }
  }

  const getTextColor = () => {
    switch (readiness) {
      case "Ready":
        return "text-green-500"
      case "Not Ready":
        return "text-red-500"
      default:
        return "text-yellow-500"
    }
  }

  return (
    <div className="flex items-center">
      {getIcon()}
      <span className={`text-xl font-bold ${getTextColor()}`}>
        {readiness || "No Data"}
      </span>
    </div>
  )
}