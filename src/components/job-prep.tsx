'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Footer } from './footer'
import { Clipboard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import MarkdownRenderer from "./markdown-renderer"

export function JobPrep() {
  const router = useRouter()
  const [content, setContent] = useState<string>('')
  const [questionsRetrieved, setQuestionsRetrieved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)  
  const [profileId, setProfileId] = useState<string | null>(null);
  const hasFetchedQuestions = useRef(false);

  
  useEffect(() => {
    const storedProfileId = localStorage.getItem('profileId');
    setProfileId(storedProfileId);

    if (profileId && !hasFetchedQuestions.current) {
      hasFetchedQuestions.current = true;
      (async () => {
        try {
          await generateQuestions(profileId);
          setQuestionsRetrieved(true);
        } catch (error) {
          console.error('Error generating questions:', error);
        }
      })();
    }    

    // Fetch prep sheet response
    if (profileId) {
        fetch(`/api/get-prep-sheet?profileId=${profileId}`)
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

  const handleSubmit = async () => {
    setIsSubmitting(true);    
  }  

  const generateQuestions = async (profileId: string) => {
    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileId }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const result = await response.json();
      // console.log('Questions generated:', result.content);
      return result.content;
    } catch (error) {
      console.error('Error generating questions:', error);
      throw error;
    }
  };

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
              type="submit"
              disabled={isSubmitting || !questionsRetrieved}
              onSubmit={handleSubmit}

              onClick={() => router.push('/questions')}
              className="w-full bg-[#10B981] text-[#F9FAFB] py-3 rounded-md font-medium hover:bg-[#0e9370] transition-colors"
            >
              See Mock Interview Questions
            </Button>
          </div>
      </main>
      <Footer />
    </div>
  )
}
