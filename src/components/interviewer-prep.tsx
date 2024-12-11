'use client'

import { ConditionalHeader } from '@/components/conditional-header'
import { Button } from '@/components/ui/button'
import { interviewIdAtom, profileIdAtom, showScoreAtom } from '@/stores/profileAtoms'
import { useAtom } from 'jotai'
import { Clipboard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import MarkdownRenderer from './markdown-renderer'
import { RubricScorer } from './rubric-scorer'

export default function InterviewerPrep() {
  const router = useRouter()
  const [content, setContent] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDemoMode] = useState(false)
  const [statusMessage, setStatusMessage] = useState('Thinking...')

  const [profileId] = useAtom(profileIdAtom)
  const [interviewId] = useAtom(interviewIdAtom)
  const [showScore] = useAtom(showScoreAtom)

  useEffect(() => {
    if (profileId) {
      fetch(`/api/interviewer-prep?profileId=${profileId}&interviewId=${interviewId}`)
        .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch generated questions response')
            }
            return response.json()
          })
          .then(data => {
            setContent('# Interviewer Scoop\n\n' + data.content)
          })
          .catch(error => {
            console.error('Error fetching prep sheet response:', error)
            setContent('Error loading content. Please try again later.')
          })
    } else {
      router.push('/')
    }
  }, []);

  useEffect(() => {
    if (!isSubmitting) return

    const messages = ['Thinking...', 'Researching...', 'Analyzing...', 'Generating...']
    let currentIndex = 0

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % messages.length
      setStatusMessage(messages[currentIndex])
    }, 5000)

    return () => clearInterval(interval)
  }, [isSubmitting])

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!profileId) {
      alert('No profile ID found. Please select a profile.')
    }

    setIsSubmitting(true)
    // if (!isDemoMode && profileId) {
    //   await generateInterviewQuestions(profileId)
    // }

    router.push(`/question-prep`)
  }

  return (
    <>
    <ConditionalHeader />
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="flex-grow flex justify-center">
        <div className="w-full max-w-4xl prep-sheet-content">
          {content ? (
            <>
              <MarkdownRenderer content={content} />

              {showScore && (
                <RubricScorer
                  profileId={profileId || ''}
                  promptKey='prompt-interviewer-prep-rubric'
                  content={content}
                />
              )}

              <div className="mx-4 mb-4">
                <Button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      const content = document.querySelector('.prep-sheet-content')?.textContent
                      if (content) {
                        navigator.clipboard.writeText(content)
                          .then(() => alert('Content copied to clipboard!'))
                          .catch(err => console.error('Failed to copy: ', err));
                      }
                    }
                  }}
                  className="w-full mb-4 bg-[#4B5563] text-[#F9FAFB] py-3 rounded-md font-medium hover:bg-[#374151] transition-colors items-center justify-center"
                >
                  <Clipboard className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="w-full bg-[#10B981] text-[#F9FAFB] py-3 rounded-md font-medium hover:bg-[#0e9370] transition-colors"
                >
                  {isSubmitting ? statusMessage : 'Next'}
                </Button>
                <p className="text-sm mt-1 text-center">
                  {isSubmitting && (
                    'Takes about 10 seconds, please be patient. Thank you.'
                  )}
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[50vh]">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}
