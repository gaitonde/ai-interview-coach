'use client'

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Footer } from './footer'
import { Clipboard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import MarkdownRenderer from "./markdown-renderer"

export default function InterviewPrep() {
  const router = useRouter()
  const [content, setContent] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)  

  useEffect(() => {
    const profileId = localStorage.getItem('profileId');
    console.log("Stored Profile ID!!:", profileId);
    // Fetch prep sheet response
    if (profileId) {
        fetch(`/api/generated-questions?profileId=${profileId}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch prep sheet response');
            }
            return response.json();
          })
          .then(data => {
            setContent('# Awesome Interview Cheat Sheet\n\n' + data.content);
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
    setIsSubmitting(true)
    const profileId = Number(localStorage.getItem('profileId')) || 0
    await generateInterviewQuestions(profileId)
    router.push(`/interview-practice`)
  }

  return (
    <>
    {content && (
    <div className="flex flex-col min-h-screen bg-[#111827]">
      <main className="flex-grow flex justify-center">
        <div className="w-full max-w-4xl">
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
            className="hidden w-full mb-4 bg-[#4B5563] text-[#F9FAFB] py-3 rounded-md font-medium hover:bg-[#374151] transition-colors items-center justify-center"
          >
            <Clipboard className="w-4 h-4 mr-2" />
            Copy to Clipboard
          </Button>
          <Button
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="w-full bg-[#10B981] text-[#F9FAFB] py-3 rounded-md font-medium hover:bg-[#0e9370] transition-colors"
          >              
            {isSubmitting ? 'Generating questions...' : 'Practice Interview Now'}
          </Button>
          <p className="text-sm text-muted-foreground mt-1 text-center">
              {isSubmitting && (
                'Takes about 10 seconds, please be patient. Thank you.'
              )}
          </p>
          </div>
        </main>
        <Footer />
      </div>
    )}
    </>
  )
}