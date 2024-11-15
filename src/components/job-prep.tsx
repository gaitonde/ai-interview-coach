'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Footer } from './footer'
import { Clipboard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import MarkdownRenderer from './markdown-renderer'

export function JobPrep() {
  const router = useRouter()
  const [content, setContent] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)  
  const [profileId, setProfileId] = useState<string | null>(null);
  
  useEffect(() => {
    const storedProfileId = localStorage.getItem('profileId');
    console.log("Stored Profile ID!!:", storedProfileId);
    setProfileId(storedProfileId);

    // console.log("Has Fetched Questions:", hasFetchedQuestions.current);

    // if (storedProfileId && !hasFetchedQuestions.current) {
    //   console.log("Generating Questions!!")
    //   hasFetchedQuestions.current = true;
    //   (async () => {
    //     try {
    //       console.log("Generating Questions2!!")
    //       await generateQuestions(storedProfileId);
    //       console.log("DONE Generating Questions3!!")
    //       setQuestionsRetrieved(true);
    //     } catch (error) {
    //       console.error('Error generating questions:', error);
    //     }
    //   })();
    // }    

    // Fetch prep sheet response
    if (storedProfileId) {
        fetch(`/api/generated-prep-sheet?profileId=${storedProfileId}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch prep sheet response');
            }
            return response.json();
          })
          .then(data => {
            console.log('should be setting content', data);
            setContent('# Company Scoop\n\n' + data.content);
          })
          .catch(error => {
            console.error('Error fetching prep sheet response:', error);
            setContent('Error loading content. Please try again later.');
          });
    }
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);    
    const profileId = localStorage.getItem('profileId') || '';
    await generateInterviewPrep(profileId);
    router.push('/interview-prep');
  }  

  const generateInterviewPrep = async (profileId: string) => {
    try {
      const response = await fetch('/api/generate-interview-prep', {
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
            <div className="w-full max-w-4xl">
              <MarkdownRenderer content={content} />
              
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
                className="hidden w-full mb-4 bg-[#4B5563] text-[#F9FAFB] py-3 rounded-md font-medium hover:bg-[#374151] transition-colors items-center justify-center"
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
                {isSubmitting ? 'Generating Cheat Sheet...' : 'Prepare for Interview'}
              </Button>
              <p className="text-sm text-muted-foreground mt-1 text-center">
              {isSubmitting && (
                'Takes about 30 seconds, please be patient. Thank you.'
              )}
              </p>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      )}
    </>
  )
}
