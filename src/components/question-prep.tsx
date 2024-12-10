'use client'

import { Button } from '@/components/ui/button'
import { profileIdAtom } from '@/stores/profileAtoms'
import { useAtom } from 'jotai'
import { Clipboard } from 'lucide-react'
import { useEffect, useState } from 'react'
import MarkdownRenderer from './markdown-renderer'
import { useRouter } from 'next/navigation'

export default function QuestionPrep() {
  const router = useRouter()
  const [content, setContent] = useState<string | null>(null)
  const [profileId] = useAtom(profileIdAtom)

  useEffect(() => {
    console.log('storedProfileId', profileId)
    // if (!profileId) {
    //   console.error('Missing interviewId or profileId')
    //   return
    // }

    // fetch(`/api/generate-question-prep?profileId=41&interviewId=6`)
    fetch(`/api/generate-question-prep?profileId=${profileId}`)
    // const x = fetch(`/api/interview-readiness?profileId=31&interviewId=14`)
    .then(response => {
      if (!response.ok) throw new Error(`Failed to fetch evaluation`)
      console.log('response', response)

      return response.json()
    })
    .then(data => {
      console.log('data', data)
      setContent('# Question Scoop\n\n' + data.content)

    })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    router.push('/interview-ready');
  }

  if (!content) {
    return null
  }

  return (
    <>
      {content && (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted px-4">
          <div className="flex-grow flex justify-center">
            <div className="w-full max-w-4xl prep-sheet-content overflow-hidden">
              <div className="mx-4">
                <div className="prose prose-invert max-w-none">
                  <MarkdownRenderer content={content} />
                </div>

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
                    onClick={handleSubmit}
                    className="w-full bg-[#10B981] text-[#F9FAFB] py-3 rounded-md font-medium hover:bg-[#0e9370] transition-colors"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  )
}
