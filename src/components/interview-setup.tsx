'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useRef, useState } from 'react'

export function InterviewSetup() {
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [statusMessage, setStatusMessage] = useState('Thinking...')
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    const storedProfileId = localStorage.getItem('profileId')
    const storedInterviewId = localStorage.getItem('interviewId')
    const isDemo = localStorage.getItem('mode') === 'demo'
    setIsDemoMode(isDemo)
    console.log('storedProfileId: ', storedProfileId)
    console.log('storedInterviewId: ', storedInterviewId)
    console.log('isDemo: ', isDemo)

    if (isDemo || storedProfileId) {
      loadInterview(storedProfileId!, storedInterviewId!)
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


  const loadInterview = async (profileId: string, interviewId: string) => {
    const response = await fetch(`/api/interviews?profileId=${profileId}&interviewId=${interviewId}`)
    const json = await response.json()
    console.log('XX interviews: ', json)
    const interview = json.content || json

    if (!interview) {
      console.error('No interview data found')
      return null
    }

    if (formRef.current) {
      const form = formRef.current
      if (interview) {
        const companyUrlInput = form.elements.namedItem('company_url') as HTMLInputElement;
        companyUrlInput.value = interview.company_url || '';

        const jdUrlInput = form.elements.namedItem('jd_url') as HTMLInputElement;
        jdUrlInput.value = interview.jd_url || '';

        const interviewerNameInput = form.elements.namedItem('interviewer_name') as HTMLInputElement;
        interviewerNameInput.value = interview.interviewer_name || '';

        const interviewerRoleInput = form.elements.namedItem('interviewer_role') as HTMLInputElement;
        interviewerRoleInput.value = interview.interviewer_role || '';
      }
    }

    return interview;
  }
  const saveInterview = async (profileId: string, formData: FormData) => {
    try {
      const response = await fetch(`/api/interviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId,
          company_url: formData.get('company_url'),
          jd_url: formData.get('jd_url'),
          interviewer_name: formData.get('interviewer_name'),
          interviewer_role: formData.get('interviewer_role'),
          interview_date: formData.get('interview_date')
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create job record');
      }

      const result = await response.json()
      return result.id
    } catch (error) {
      console.error('Error creating job record:', error);
      throw error;
    }
  };

  const generateJobPrep = async (profileId: string, interviewId: string) => {
    try {
      const response = await fetch('/api/generate-company-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileId, interviewId }),
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

  const validateForm = (formData: FormData): string | null => {
    const requiredFields = [
      'company_url',
      'jd_url',
    ];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return `${field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')} is required`;
      }
    }

    const urlFields = ['company_url', 'jd_url'];
    for (const field of urlFields) {
      let value = formData.get(field) as string;
      if (value) {
        if (!value.startsWith('http://') && !value.startsWith('https://')) {
          value = `http://${value}`;
          formData.set(field, value);
        }
      }
    }

    return null;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isDemoMode) {
      router.push(`/job-prep`);
      return;
    }

    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget);

    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      const profileId = localStorage.getItem('profileId') as string
      const interviewId = await saveInterview(profileId, formData)
      console.log('interviewId: ', interviewId)
      localStorage.setItem('interviewId', interviewId)
      await generateJobPrep(profileId, interviewId)

      router.push(`/job-prep`);
    } catch (error) {
      console.error('Error during submission:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-[#252b3b] p-8 rounded-lg shadow-lg my-4">
          <div className="text-center">
            <h2 className="mt-2 text-3xl font-bold text-white">Interview Setup</h2>
            <p className="mt-2 text-sm text-gray-400">Add your interview</p>
          </div>
          <form
            ref={formRef}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="company_url" className="block text-sm font-medium text-white">
                  Company URL
                </label>
                <Input
                  id="company_url"
                  name="company_url"
                  type="text"
                  placeholder="https://acme.com"
                  className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                />
              </div>
              <div>
                <label htmlFor="jd_url" className="block text-sm font-medium text-white">
                  Job Description URL
                </label>
                <Input
                  id="jd_url"
                  name="jd_url"
                  type="text"
                  placeholder="https://careers.example.com/job-description"
                  className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                />
              </div>
              <div>
                <label htmlFor="interviewer_name" className="block text-sm font-medium text-white">
                  Interviewer Name (Optional)
                </label>
                <Input
                  id="interviewer_name"
                  name="interviewer_name"
                  type="text"
                  placeholder="eg. Ira Johnson"
                  className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                />
              </div>
              <div>
                <label htmlFor="interviewer_role" className="block text-sm font-medium text-white">
                  Interviewer Role (Optional)
                </label>
                <Input
                  id="interviewer_role"
                  name="interviewer_role"
                  type="text"
                  placeholder="eg. Senior Product Manager"
                  className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                />
              </div>
              <div>
                <label htmlFor="interview_date" className="block text-sm font-medium text-white">
                  Interview Date (Optional)
                </label>
                <Input
                  id="interview_date"
                  name="interview_date"
                  type="date"
                  className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#10B981] text-white hover:bg-[#059669] py-2 px-4 rounded-md transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? statusMessage : isDemoMode ? 'Next' : 'Save'}
            </Button>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              {isSubmitting && (
                'Takes about 30 seconds, please be patient. Thank you.'
              )}
            </p>

          </form>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </main>
    </>
  )
}
