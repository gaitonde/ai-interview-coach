'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { interviewIdAtom, profileIdAtom, userIdAtom } from "@/stores/profileAtoms"
import { useAtom, useAtomValue } from "jotai"
import { atomWithStorage } from 'jotai/utils'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useRef, useState } from 'react'

const isDemoModeAtom = atomWithStorage('demoMode', false)

export function InterviewSetup() {
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [statusMessage, setStatusMessage] = useState('Thinking...')
  const [, setAtomInterviewId] = useAtom<string | null>(interviewIdAtom)
  const profileId = useAtomValue(profileIdAtom)
  const userId = useAtomValue(userIdAtom)
  const interviewId = useAtomValue(interviewIdAtom)
  const isDemo = useAtomValue(isDemoModeAtom)

  console.log('atom profileId from atom: ', profileId)
  console.log('atom userId from atom: ', userId)
  console.log('atom isDemo from atom: ', isDemo)

  useEffect(() => {
    console.log('xx storedProfileId: ', profileId)
    console.log('xx storedUserId: ', userId)
    console.log('xx storedInterviewId: ', interviewId)
    console.log('xx isDemo: ', isDemo)

    if (isDemo && profileId) {
      loadInterview(profileId!, interviewId!)
    }
  }, [profileId, interviewId, isDemo])

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
    //TODO: dont send interviewId if it is not set
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

        const interviewerNameInput = form.elements.namedItem('interviewer_linkedin') as HTMLInputElement;
        interviewerNameInput.value = interview.interviewer_linkedin || '';

        const interviewerRoleInput = form.elements.namedItem('interviewer_role') as HTMLInputElement;
        interviewerRoleInput.value = interview.interviewer_role || '';

        const interviewDateInput = form.elements.namedItem('interview_date') as HTMLInputElement;
        const dateValue = interview.interview_date ? new Date(interview.interview_date).toISOString().split('T')[0] : '';
        interviewDateInput.value = dateValue;
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
          interviewer_linkedin: formData.get('interviewer_linkedin'),
          interviewer_role: formData.get('interviewer_role'),
          interview_date: formData.get('interview_date')
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create job record');
      }

      const result = await response.json()
      const interviewId = result.id
      setAtomInterviewId(interviewId)

      return interviewId
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

    const interviewDate = formData.get('interview_date') as string;
    if (interviewDate) {
      const selectedDate = new Date(interviewDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return 'Interview date cannot be in the past';
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

    if (isDemo) {
      router.push(`/company-prep`);
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
      if (!profileId) {
        throw new Error('Profile ID not found');
      }
      const interviewId = await saveInterview(profileId, formData)
      await generateJobPrep(profileId, interviewId)

      router.push(`/company-prep`);
    } catch (error) {
      console.error('Error during submission:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex-grow flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-[#252b3b] p-8 rounded-lg shadow-lg my-4">
          <div className="text-center">
            <h2 className="mt-2 text-3xl font-bold text-white">Interview Setup</h2>
            <p className="mt-2 text-sm text-gray-400">Add your first interview</p>
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
                <label htmlFor="interviewer_linkedin" className="block text-sm font-medium text-white">
                  Interviewer LinkedIn URL (Optional)
                </label>
                <Input
                  id="interviewer_linkedin"
                  name="interviewer_linkedin"
                  type="text"
                  placeholder="eg. https://www.linkedin.com/in/johndoe"
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
                  min={new Date().toISOString().split('T')[0]}
                  className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#10B981] text-white hover:bg-[#059669] py-2 px-4 rounded-md transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? statusMessage : isDemo ? 'Next' : 'Save'}
            </Button>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              {isSubmitting && (
                'Takes about 30 seconds, please be patient. Thank you.'
              )}
            </p>

          </form>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>
    </>
  )
}
