"use client";

import MarkdownRenderer from "@/components/markdown-renderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tool, tools } from "@/data/tools";
import { useMixpanel } from '@/hooks/use-mixpanel';
import Cookies from "js-cookie";
import Link from "next/link";
import React, { FormEvent, useEffect, useRef, useState } from "react";

export default function ToolDetails({ params }: { params: Promise<{ slug: string }> }) {
  const [showOutput, setShowOutput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [profileId, setProfileId] = useState<String>();
  const [showInterviewerLIUrl, setShowInterviewerLIUrl] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [resumeFileName, setResumeFileName] = useState<String>();
  const [tool, setTool] = useState<Tool>();
  const [statusMessage, setStatusMessage] = useState('Thinking...');

  const { track } = useMixpanel();
  const { slug } = React.use(params);

  const getToolBySlug = (slug: string) => {
    return tools.find(tool => tool.slug === slug);
  }

  const toolName = slug.split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // e: FormEvent<HTMLFormElement>
  const handleRunTool = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const interviewId = await saveInterview(formData)
    await generateResults(interviewId)
    await getToolResults(interviewId)
  }

  useEffect(() => {
    const tool = getToolBySlug(`/tools/${slug}`);
    setTool(tool);
    console.log('ViewedTool...')
    track('ViewedTool', {tool: `/tools/${slug}`});

    if (slug.includes("interviewer-scout")) {
      setShowInterviewerLIUrl(true)
    }
  }, [])

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

  const handleUploadResume = async () => {
    track('UploadResumeAttempt');
    uploadResume().then(uploaded => {
      console.log('resume uploaded: ', uploaded)
      // if (uploaded) {
      //   track('UploadResumeSuccess');
      // } else {
      //   track('UploadResumeFailed');
      // }
    })
  }

  const uploadResume = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'application/pdf'

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) {
          resolve(false)
          return
        }

        try {
          setIsUploading(true)
          track('SubmittedResumeUpload');
          const profileId = Cookies.get('profileId') as string
          setProfileId(profileId)

          const formData = new FormData()
          const email = 'fix@me.com';
          formData.append('email', email)
          formData.append('profileId', profileId)
          formData.append('resume', file)
          formData.append('filename', file.name)


          const response = await fetch('/api/resume', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) throw new Error('Upload failed')

          const result = await response.json()
          // const profileId = result.profileId
          // setProfileId(profileId)
          const resumeFileName = (file.name.length > 20) ? `${file.name.substring(0, 20)}...` : file.name;
          setResumeFileName(resumeFileName)
          track('UploadResumeSuccess');
          // track('ProfileCreatedSuccess', {
          //   landingPageEmail: email,
          //   profileId
          // })

          Cookies.set('profileId', profileId, {
            secure: true,
            sameSite: 'strict'
          })

          resolve(true)
        } catch (error) {
          console.error('Upload error:', error)
          resolve(false)
        } finally {
          setIsUploading(false)
        }
      }

      input.click()
    })
  }

  const getToolResults = async (interviewId: string) => {
    // Determine the API endpoint based on the slug
    const apiEndpoint = slug.includes("company-scout") ? "company-prep" :
                        slug.includes("interviewer-scout") ? "interviewer-prep" :
                        slug.includes("question-scout") ? "question-prep" : "";

    if (apiEndpoint) {
      fetch(`/api/${apiEndpoint}?profileId=${profileId}&interviewId=${interviewId}`)
        .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch generated questions response')
            }
            return response.json()
          })
          .then(data => {
            setContent(`# ${toolName}\n\n` + data.content)
            track('ViewedToolContent', {tool: slug });
          })
          .catch(error => {
            console.error('Error fetching prep sheet response:', error)
            setContent('Error loading content. Please try again later.')
          })
          .finally(() => {
            setShowOutput(true);
            setIsSubmitting(false);
          })
    } else {
      console.error('Invalid slug for API endpoint');
    }
  }

  const saveInterview = async (formData: FormData) => {
    try {
      let companyUrl = formData.get('company_url')?.toString();
      if (companyUrl && !companyUrl.match(/^https?:\/\//)) {
        companyUrl = `https://${companyUrl}`;
      }
      let jdUrl = formData.get('jd_url')?.toString();
      if (jdUrl && !jdUrl.match(/^https?:\/\//)) {
        jdUrl = `https://${jdUrl}`;
      }

      console.log('companyUrl: ', companyUrl)
      console.log('jdUrl: ', jdUrl)

      const response = await fetch(`/api/interviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId,
          company_url: companyUrl,
          jd_url: jdUrl,
          interviewer_linkedin_url: formData.get('interviewer_linkedin_url'),
        }),
      });

      if (!response.ok) {
        const result = await response.json()
        setError(result.message)
        return
      }

      const result = await response.json()
      const interviewId = result.id
      // setInterviewId(interviewId)
      // track('AddInterviewSuccess', { profileId })

      return interviewId
    } catch (error) {
      throw error
    }
  };

  const generateResults = async (interviewId: string) => {
    // Determine the API endpoint based on the slug
    const apiEndpoint = slug.includes("company-scout") ? "generate-company-prep" :
                        slug.includes("interviewer-scout") ? "generate-interviewer-prep" :
                        slug.includes("question-scout") ? "generate-question-prep" : "";

    const apiUrl = `/api/${apiEndpoint}`;
    try {
      track('RunToolAttempt', {tool: slug});
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileId, interviewId }),
      });

      if (!response.ok) {
        console.log(`error response for url: ${apiUrl}`, response);
        return;
      }

      const result = await response.json();
      return result.content;
    } catch (error) {
      console.error('Error in generating response for tool:', error);
      throw error;
    }
  }

  if (!tool) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#111827]">
      <div className="flex flex-col space-y-4 px-4 sm:px-6 lg:px-8 my-6">
        {/* Tool Metadata */}
        <div className="w-full max-w-full sm:px-8 sm:pb-8 space-y-6 sm:space-y-8 bg-[#1F2937] rounded-xl shadow-md">
          <div className="text-[#F9FAFB] p-4">
            <div className="max-w-3xl">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-gray-700">
                  {tool.icon}
                </div>
                <h1 className="text-4xl font-bold text-emerald-400 mb-2 ml-4">{tool.title}</h1>
              </div>
              <Link href="/tools" className="hover:underline">
                ← Back
              </Link>

              <div className="prose prose-invert prose-emerald mt-8">
                {tool.description}
              </div>
            </div>
          </div>
        </div>

        {/* Input(s) */}
        <div className="w-full max-w-full sm:px-8 sm:pb-8 space-y-6 sm:space-y-8 bg-[#1F2937] rounded-xl shadow-md">
          <div className="text-[#F9FAFB] p-4">
            <h2 className="mt-2 text-3xl font-bold text-white">Inputs</h2>
            <div className="w-full mt-8">
                    <label htmlFor="interviewer_role" className="block text-sm font-medium text-white">
                      Resume
                    </label>
                    <Button
                      size="lg"
                      className="text-sm w-full bg-[#F9FAFB] hover:bg-[#E5E7EB] text-gray-800"
                      onClick={handleUploadResume}
                      disabled={isUploading}
                    >
                      <span className="min-w-[200px]">
                        {isUploading ? "Uploading..." : (resumeFileName) ? `Selected Resume: ${resumeFileName}` : "Choose Resume"}
                      </span>
                    </Button>
                  </div>
            <form
              ref={formRef}
              className="mt-4 space-y-6 w-full"
              onSubmit={handleRunTool}
            >
              <div className="space-y-4">

                <div className="w-full">
                  <label htmlFor="company_url" className="block text-sm font-medium text-white">
                    Company URL
                  </label>
                  <Input
                    id="company_url"
                    name="company_url"
                    type="text"
                    placeholder="https://acme.com"
                    // defaultValue="http://www.apple.com/careers/us/"
                    className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="jd_url" className="block text-sm font-medium text-white">
                    Job Description URL
                  </label>
                  <Input
                    id="jd_url"
                    name="jd_url"
                    type="text"
                    placeholder="https://careers.example.com/job-description"
                    // defaultValue="https://jobs.apple.com/en-us/details/200554357/business-marketing-and-g-a-internships?team=STDNT"
                    className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                  />
                </div>
                {showInterviewerLIUrl && (
                <div className="w-full">
                  <label htmlFor="interviewer_linkedin_url" className="block text-sm font-medium text-white">
                    Interviewer LinkedIn URL
                  </label>
                  <Input
                    id="interviewer_linkedin_url"
                    name="interviewer_linkedin_url"
                    type="text"
                    placeholder="eg. https://www.linkedin.com/in/johndoe"
                    // defaultValue="https://www.linkedin.com/in/ellendalen/"
                    className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                  />
                </div>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-[#10B981] text-white hover:bg-[#059669] py-2 px-4 rounded-md transition-colors"
                disabled={
                  isSubmitting ||
                  !resumeFileName ||
                  !formRef.current?.company_url.value ||
                  !formRef.current?.jd_url.value
                }
              >
                {isSubmitting ? statusMessage : showOutput ? 'Run Again' : `Run ${toolName}`}
              </Button>
              <p className="text-sm mt-1 text-center">
                {isSubmitting && (
                  'Takes about 30 seconds, please be patient. Thank you.'
                )}
              </p>

            </form>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>

        {showOutput && (
          <div>
            <MarkdownRenderer content={content} />
          </div>
        )}
      </div>
    </div>
  )
}
