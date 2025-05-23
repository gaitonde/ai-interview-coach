'use client'

import { Button } from '@/components/ui/button'
import {
  interviewIdAtomWithStorage,
  profileIdAtomWithStorage,
  showScoreAtomWithStorage
} from '@/stores/profileAtoms'

import ConditionalHeader from '@/components/conditional-header'
import { useAtom } from "jotai"
import { Clipboard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import MarkdownRenderer from './markdown-renderer'
import { RubricScorer } from './rubric-scorer'
import { useMixpanel } from '@/hooks/use-mixpanel'

export default function CompanyPrep() {
  const router = useRouter()
  const { track } = useMixpanel()
  const [content, setContent] = useState<string>('')
  const [profileId] = useAtom(profileIdAtomWithStorage)
  const [interviewId] = useAtom(interviewIdAtomWithStorage)
  const [showScore] = useAtom(showScoreAtomWithStorage)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (profileId) {
      track('ViewedCompanyScoutingReport', { profileId })
      fetch(`/api/company-prep?profileId=${profileId}&interviewId=${interviewId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch prep sheet response')
          }
          return response.json();
        })
        .then(data => {
          setContent('# Company Scouting Report\n\n' + data.content)
        })
        .catch(error => {
          console.error('Error fetching prep sheet response:', error)
          setContent('Error loading content. Please try again later.')
        })
    } else {
      router.push('/');
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    router.push('/interviewer-prep');
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

              {showScore && (
                <RubricScorer
                  profileId={profileId || ''}
                  promptKey='prompt-company-prep-rubric'
                  content={content}
                />
              )}

              <div className="mx-4 mt-2 mb-4 flex flex-col items-center">
                <div className="mb-2">Next up: Interviewer Scouting Report</div>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-auto h-12 bg-[#10B981] text-[#F9FAFB] py-3 rounded-md font-medium hover:bg-[#0e9370] transition-colors text-4xl flex items-center"
                >
                  Next &gt;
                </Button>
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
