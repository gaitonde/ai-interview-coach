'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Footer } from './footer'
import { Clipboard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import MarkdownRenderer from "./markdown-renderer"

export default function InterviewPrep() {
  const router = useRouter()
  const [content, setContent] = useState<string>('')
  // const [questionsRetrieved, setQuestionsRetrieved] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)  

  useEffect(() => {
    const profileId = localStorage.getItem('profileId');
    console.log("Stored Profile ID!!:", profileId);
    // Fetch prep sheet response
    if (profileId) {
        fetch(`/api/get-questions?profileId=${profileId}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch prep sheet response');
            }
            return response.json();
          })
          .then(data => {
            setContent(data.content);
          })
          .catch(error => {
            console.error('Error fetching prep sheet response:', error);
            setContent('Error loading content. Please try again later.');
          });
    }
  }, []);  
  
  const generateInterviewQuestions = async (profileId: number) => {
    console.log('VVV generateInterviewQuestions', profileId)
    try {
      const response = await fetch('/api/generate-interview-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileId }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate prep sheet');
      }

      const result = await response.json();
      return result.content;
    } catch (error) {
      console.error('Error generating prep sheet:', error);
      throw error;
    }
  };  

  const handleSubmit = async () => {
    console.log('VVV handleSubmit')
    setIsSubmitting(true)
    const profileId = Number(localStorage.getItem('profileId')) || 0
    console.log('VVV profileId: ', profileId)
    await generateInterviewQuestions(profileId)
    router.push(`/interview-practice`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#111827]">
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="prep-sheet-content">
            <MarkdownRenderer content={content} />

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
            <Button
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-full bg-[#10B981] text-[#F9FAFB] py-3 rounded-md font-medium hover:bg-[#0e9370] transition-colors"
            >              
              Practice Interview Now
            </Button>
          </div>
      </main>
      <Footer />
    </div>
  )
}
