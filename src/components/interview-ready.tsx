'use client'

import ConditionalHeader from '@/components/conditional-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { interviewIdAtom, isDemoAtom, profileIdAtom } from '@/stores/profileAtoms'
import { useAtom } from 'jotai'
import { AlertCircle, Briefcase, Calendar, Frown, Meh, Smile, Target, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

type Interview = {
  id: string
  interviewer_name: string
  interviewer_role: string
  // interview_date: string
  company_name: string
  role_name: string
  readiness: string
}

type CategoryResponse = {
  readiness_rating: string
  readiness_text: string
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
    name: "behavioral",
    displayName: "Behavioral",
    description: "Questions about past experiences and how you handled specific work situations.",
  },
  {
    name: "technical",
    displayName: "Technical",
    description: "Questions testing your knowledge of specific skills required for the job.",
  },
  {
    name: "role",
    displayName: "Role Based",
    description: "Questions specific to the responsibilities and expectations of the target job.",
  },
  {
    name: "case",
    displayName: "Case Style",
    description: "Problem-solving questions that assess your analytical and creative thinking skills.",
  },
]

const getScoreInfo = (score?: string): { icon: React.ReactNode; text: string; color: string } => {
  if (score === undefined) return { icon: <AlertCircle className="w-6 h-6" />, text: "No Data", color: "text-slate-400" }
  switch (score) {
    case "Ready":
      return { icon: <Smile className="w-6 h-6" />, text: "Ready", color: "text-green-500" }
    case "Kinda Ready":
      return { icon: <Meh className="w-6 h-6" />, text: "Kinda Ready", color: "text-yellow-500" }
    case "Not Ready":
      return { icon: <Frown className="w-6 h-6" />, text: "Not Ready", color: "text-red-500" }
    default:
      return { icon: <AlertCircle className="w-6 h-6" />, text: "No Data", color: "text-slate-400" }
  }
}

const LoadingCard = () => (
  <Card className="bg-[#1a1f2b] text-white mb-6">
    <CardContent className="p-4 sm:p-6">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-700 rounded"></div>
          <div className="h-3 bg-gray-700 rounded w-5/6"></div>
          <div className="h-3 bg-gray-700 rounded w-4/6"></div>
        </div>
        <div className="h-8 bg-gray-700 rounded mt-4"></div>
      </div>
    </CardContent>
  </Card>
)

export default function InterviewReady() {
  const router = useRouter()
  const [interview, setInterview] = useState<Interview | null>(null)
  const [categoryRatings, setCategoryRatings] = useState<Record<string, CategoryResponse>>({})
  const [isDemoMode] = useAtom(isDemoAtom)
  const [profileId] = useAtom(profileIdAtom)
  const [interviewId] = useAtom(interviewIdAtom)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    console.log('storedProfileId', profileId)
    console.log('interviewId', interviewId)

    const fetchReadiness = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/interview-readiness?profileId=${profileId}&interviewId=${interviewId}`)
        if (!response.ok) throw new Error('Failed to fetch evaluation')
        const { content: results } = await response.json()

        // Map results into categoryResponses format
        const categoryRatings: Record<string, CategoryResponse> = {};
        results.forEach((result: any) => {
          categoryRatings[result.category] = {
            readiness_rating: result.readiness_rating || "No Data",
            readiness_text: result.readiness_text || "We don't have enough information to calculate a score."
          }
        })

        setCategoryRatings(categoryRatings);
      } catch (error) {
        console.error('Error fetching evaluations:', error);
      } finally {
        setIsLoading(false)
      }
    }

    fetchReadiness()
  }, [profileId, interviewId])

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await fetch(`/api/interviews?profileId=${profileId}&interviewId=${interviewId}`)
        if (!response.ok) throw new Error('Failed to fetch job data')
        const { content: interview } = await response.json()
        console.log('XXX interview', interview)
        setInterview(interview)
      } catch (error) {
        console.error('Error fetching interview data:', error)
      }
    }
    fetchInterview()
  }, [profileId, interviewId])

  return (
    <>
    <ConditionalHeader />
    <div className="bg-[#1a1f2b] px-4 py-4">
      <div className="max-w-4xl mx-auto bg-[#252b3b] rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 text-center text-white">Interview Readiness</h2>

          {interview && (
            <Card className="bg-[#1a1f2b] text-white mb-6">
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-start">
                    <Briefcase className="w-5 h-5 mr-2 text-[#10B981] mt-1" />
                    <div>
                      <p className="text-sm font-semibold">Company</p>
                      <p className="text-sm text-gray-300">{interview.company_name}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Target className="w-5 h-5 mr-2 text-[#10B981] mt-1" />
                    <div>
                      <p className="text-sm font-semibold">Target Job</p>
                      <p className="text-sm text-gray-300">{interview.role_name}</p>
                    </div>
                  </div>

                  {interview.interviewer_role && (
                    <div className="flex items-start">
                      <User className="w-5 h-5 mr-2 text-[#10B981] mt-1" />
                      <div>
                        <p className="text-sm font-semibold">Interviewer Role</p>
                        <p className="text-sm text-gray-300">{interview.interviewer_role}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {(isLoading && interview?.id) ? (
            <>
              <LoadingCard />
              {Object.keys(categoryRatings).filter(key => key !== 'overall').map((category) => (
                <LoadingCard key={category} />
              ))}
            </>
          ) : categoryRatings.overall?.readiness_rating ? (
            <>
              <Card className="bg-[#1a1f2b] text-white mb-6">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <ReadinessIndicator readiness={categoryRatings.overall.readiness_rating} />
                  </div>
                  <ReactMarkdown
                    components={{
                      ul: ({node, ...props}) => (
                        <ul className="list-disc pl-4 space-y-1 mb-4" {...props} />
                      )
                    }}
                  >{categoryRatings.overall.readiness_text ?? ''}</ReactMarkdown>
                  <Button
                    className="w-full bg-[#10B981] hover:bg-[#0D9668] text-white font-medium py-2 rounded-lg text-sm mt-4"
                    onClick={() => router.push('/interview-practice')}
                  >
                    Practice All Interview Questions
                  </Button>
                </CardContent>
              </Card>

              {categories
                .filter(category => categoryRatings[category.name]?.readiness_rating)
                .map((category) => {
                  const categoryResponse = categoryRatings[category.name];
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
                          variant='outline'
                          className="w-full text-white font-medium py-2 rounded-lg text-sm"
                          onClick={() => router.push(`/interview-practice?category=${category.name.toLowerCase()}`)}
                        >
                          Practice {category.name.charAt(0).toUpperCase() + category.name.slice(1)} Questions
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
            </>
          ) : interview && !interview.readiness ? (
            <div className="mt-0">
              <Card className="bg-[#1a1f2b] text-white mb-6">
                <CardContent className="p-4 sm:p-6">
                  <div>
                    <div className="sm:hidden">
                    <p>
                        Personalized questions have been created to help you prepare for your interview.
                      </p>
                      <p className="mt-4">
                        Interview Jam sessions are a great way to practice your answers and see what you're at!
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <p>
                      Personalized questions have been created to help you prepare for your interview. Interview Jam sessions are a great way to practice your answers and see what you're at!
                      </p>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-[#10B981] hover:bg-[#0D9668] text-white font-medium py-2 rounded-lg text-sm mt-4"
                    disabled={isSubmitting}
                    onClick={() => {
                      setIsSubmitting(true)
                      router.push('/interview-practice')
                    }}
                  >
                    Start Interview Jam Session
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {interview && interview.readiness && (
            <div className="mt-6 flex justify-center">
              <Button
                variant={isDemoMode ? 'default' : 'outline'}
                className={cn(
                "w-full font-medium py-3 rounded-md transition-colors",
                isDemoMode
                  ? "bg-[#10B981] text-[#F9FAFB] hover:bg-[#0e9370]"
                  : "bg-transparent text-[#10B981] border-[#10B981] hover:bg-[#10B981] hover:text-white"
              )}
              onClick={() => {
                if (isDemoMode) {
                  router.push('/interview-practice')
                } else {
                  router.push('/dashboard')
                }
              }}
            >
              {isDemoMode ? 'Next' : 'Back to Dashboard'}
            </Button>
          </div>
          )}
        </div>
      </div>
    </div>
    </>
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
        return <AlertCircle className="w-6 h-6 text-gray-500 mr-2" />
    }
  }

  const getTextColor = () => {
    switch (readiness) {
      case "Ready":
        return "text-green-500"
      case "Not Ready":
        return "text-red-500"
      default:
        return "text-gray-500"
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