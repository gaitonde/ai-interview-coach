'use client'

import { Button } from '@/components/ui/button'
import { interviewIdAtom, profileIdAtom } from '@/stores/profileAtoms'
import { useAtom } from 'jotai'
import { Clipboard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ConditionalHeader } from "./conditional-header"
import MarkdownRenderer from './markdown-renderer'

export default function QuestionPrep() {
  const router = useRouter()
  const [content, setContent] = useState<string | null>(null)
  const [profileId] = useAtom(profileIdAtom)
  const [interviewId] = useAtom(interviewIdAtom)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('Thinking...')
  const fetchedRef = useRef(false)

  useEffect(() => {
    // Reset ref when dependencies change
    if (fetchedRef.current && profileId && interviewId) return

    console.log('storedProfileId', profileId)
    if (!profileId || !interviewId) return

    fetchedRef.current = true

    fetch(`/api/question-prep?profileId=${profileId}&interviewId=${interviewId}`)
      .then(response => {
        if (!response.ok) throw new Error(`Failed to check question prep`)
        return response.json()
      })
      .then(async data => {
        if (data.content) {
          // Use existing prep content
          setContent('# Question Scoop\n\n' + data.content)
        } else {
          // Generate new prep content
          const response = await fetch('/api/generate-question-prep', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ profileId, interviewId }),
          })
          // const generateResponse = await fetch(`/api/generate-question-prep?profileId=${profileId}&interviewId=${interviewId}`)
          if (!response.ok) throw new Error(`Failed to generate question prep`)
          const newData = await response.json()
          setContent('# Question Scoop\n\n' + newData.content)
        }
      })
      .catch(error => {
        console.error('Error fetching question prep:', error)
        setContent('# Error\n\nFailed to load question preparation content.')
      })
  }, [profileId, interviewId])

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
      return
    }

    setIsSubmitting(true)

    try {
      // First check if questions already exist
      const checkResponse = await fetch(`/api/questions?profileId=${profileId}&interviewId=${interviewId}&checkOnly=true`)

      const json = await checkResponse.json()
      console.log('json for checkOnly', json)
      const { count } = json
      console.log('count for checkOnly', count)
      if (!checkResponse.ok || count < 1) {
        console.log('No questions! Generating questions')
        // Only generate questions if they don't exist
        const generateResponse = await fetch('/api/generate-interview-questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ profileId, interviewId }),
        })

        if (!generateResponse.ok) {
          throw new Error('Failed to generate questions')
        }

        await generateResponse.json()
      } else {
        console.log('Questions already exist!')
      }

      router.push('/interview-ready')
    } catch (error) {
      console.error('Error handling questions:', error)
      alert('Failed to process questions. Please try again.')
    }
  }

  const generateInterviewQuestions = async (profileId: string) => {
    try {
      const response = await fetch('/api/generate-interview-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileId, interviewId }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate interview prep')
      }

      const result = await response.json()
      return result.content
    } catch (error) {
      console.error('Error generating prep sheet:', error)
      throw error
    }
  }

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

              <div className="mx-4 mb-4">
                <Button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      const content = document.querySelector('.prep-sheet-content')?.textContent
                      if (content) {
                        navigator.clipboard.writeText(content)
                          .then(() => alert('Content copied to clipboard!'))
                          .catch(err => console.error('Failed to copy: ', err))
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
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-[#10B981] text-[#F9FAFB] py-3 rounded-md font-medium hover:bg-[#0e9370] transition-colors"
                >
                  {isSubmitting ? statusMessage : 'Next'}
                </Button>
                <p className="text-sm mt-1 text-center">
                  {isSubmitting && 'Takes about 10 seconds, please be patient. Thank you.'}
                </p>
              </div>
            </div>
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
