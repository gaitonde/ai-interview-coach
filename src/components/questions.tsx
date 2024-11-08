'use client'

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Footer } from './footer'
import { Clipboard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import MarkdownRenderer from "./markdown-renderer"

export function Questions() {
  const router = useRouter()
  const [content, setContent] = useState<string>('')

  useEffect(() => {
    console.log("Fetching Questions Should only happen once!!!")
    const fetchQuestions = async () => {
      try {
        const profileId = localStorage.getItem('profileId');
        const response = await fetch(`/api/get-questions?profileId=${profileId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch prep sheet response');
        }
        const data = await response.json();
        setContent(data.content);
      } catch (error) {
        console.error('Error fetching questions response:', error);
        setContent('Error loading content. Please try again later.');
        }
    }

    if (!content) {
      fetchQuestions();
    }
  }, []);

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
              onClick={() => router.push('/')}
              className="w-full bg-[#10B981] text-[#F9FAFB] py-3 rounded-md font-medium hover:bg-[#0e9370] transition-colors">
              Home
            </Button>
          </div>
      </main>
      <Footer />
    </div>
  )
}
