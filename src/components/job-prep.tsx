'use client'

import { Button } from "@/components/ui/button"
import { Clipboard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import MarkdownRenderer from './markdown-renderer'
import { RubricScorer } from './rubric-scorer'

export function JobPrep() {
  const router = useRouter()
  const [content, setContent] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [statusMessage, setStatusMessage] = useState('Thinking...')

  useEffect(() => {
    const storedProfileId = localStorage.getItem('profileId')
    const storedInterviewId = localStorage.getItem('interviewId')
    const isDemo = localStorage.getItem('mode') === 'demo'
    setIsDemoMode(isDemo)

    if (storedProfileId) {
      fetch(`/api/generated-company-info?profileId=${storedProfileId}&interviewId=${storedInterviewId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch prep sheet response')
          }
          return response.json();
        })
        .then(data => {
          console.log('should be setting content', data)
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

  const handleSubmit = async () => {
    const profileId = localStorage.getItem('profileId') || ''
    if (!profileId) {
      alert('No profile ID found. Please select a profile.')
    }
    if (!isDemoMode) {
      setIsSubmitting(true)
      await generateInterviewPrep(profileId)
    }
    router.push('/interview-prep');
  }

  const generateInterviewPrep = async (profileId: string) => {
    try {
      const interviewId = localStorage.getItem('interviewId') || ''
      const response = await fetch('/api/generate-interview-prep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileId, interviewId }),
      });

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
      {content && (
        <div className="flex flex-col min-h-screen bg-[#111827]">
          <main className="flex-grow flex justify-center">
            <div className="w-full max-w-4xl prep-sheet-content overflow-hidden">
              <div className="mx-4">
                <div className="prose prose-invert max-w-none">
                  <MarkdownRenderer content={content} />
                </div>

                {localStorage.getItem('showScore') && (
                  <RubricScorer
                    profileId={localStorage.getItem('profileId') || ''}
                    promptKey='prompt-job-prep-rubric'
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
                          .then(() => alert('Content copied to clipboard!')) //TODO: replace with toas
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
                <p className="text-sm text-muted-foreground mt-1 text-center">
                {isSubmitting && (
                  'Takes about 30 seconds, please be patient. Thank you.'
                )}
                </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  )
}
