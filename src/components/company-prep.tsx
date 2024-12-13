'use client'

import { Button } from "@/components/ui/button"
import { Clipboard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import MarkdownRenderer from './markdown-renderer'
import { RubricScorer } from './rubric-scorer'
import { useAtom } from "jotai"
import { interviewIdAtom, isDemoAtom, profileIdAtom, showScoreAtom } from "@/stores/profileAtoms"
import { ConditionalHeader } from "./conditional-header"

export default function CompanyPrep() {
  const router = useRouter()
  const [content, setContent] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  // const [isDemoMode, setIsDemoMode] = useState(false)
  const [statusMessage, setStatusMessage] = useState('Thinking...')
  const [profileId] = useAtom(profileIdAtom)
  const [interviewId] = useAtom(interviewIdAtom)
  const [isDemo] = useAtom(isDemoAtom)
  const [showScore] = useAtom(showScoreAtom)
  useEffect(() => {
    if (profileId) {
      fetch(`/api/company-prep?profileId=${profileId}&interviewId=${interviewId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch prep sheet response')
          }
          return response.json();
        })
        .then(data => {
          setContent('# Company Scoop\n\n' + data.content)
        })
        .catch(error => {
          console.error('Error fetching prep sheet response:', error)
          setContent('Error loading content. Please try again later.')
        })
    } else {
      router.push('/');
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
    //TODO: try to get first; if not generate
    if (!isDemo && profileId) {
      await generateInterviewPrep(profileId)
    }
    router.push('/interviewer-prep');
  }

  const generateInterviewPrep = async (profileId: string) => {
    try {
      const response = await fetch('/api/generate-interviewer-prep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileId, interviewId }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const result = await response.json();
      return result.content;
    } catch (error) {
      console.error('Error generating questions:', error);
      throw error;
    }
  };

  return (
    <>
    <ConditionalHeader />
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted px-4">
      <div className="flex-grow flex justify-center">
        <div className="w-full max-w-4xl prep-sheet-content overflow-hidden">
          {content ? (
            <div className="mx-4">
              <div className="prose prose-invert max-w-none">
                <MarkdownRenderer content={content} />
              </div>

              {showScore && (
                <RubricScorer
                  profileId={profileId || ''}
                  promptKey='prompt-company-prep-rubric'
                  content={content}
                />
              )}

              <div className="mx-4 mb-4">
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
                  className="w-full mb-4 bg-[#4B5563] text-[#F9FAFB] py-3 rounded-md font-medium hover:bg-[#374151] transition-colors items-center justify-center"
                >
                  <Clipboard className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button
                  type="submit"
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
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-center text-muted-foreground">Loading content...</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}
