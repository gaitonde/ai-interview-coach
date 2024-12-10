'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { useAtom } from 'jotai'
import { profileIdAtom, userIdAtom, isDemoAtom } from '@/stores/profileAtoms'

export function ProfileSetup() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [school, setSchool] = useState<string | undefined>(undefined)
  const [graduationYear, setGraduationYear] = useState<string | undefined>(undefined)
  const [isSignup, setIsSignup] = useState(false)
  // const [isDemoMode, setIsDemoMode] = useState(false)
  // const [includeResume, setIncludeResume] = useState(false)
  // const [fileName, setFileName] = useState<string>('No file chosen')
  // const [resumeFile, setResumeFile] = useState<File | null>(null)
  // const [userId, setUserId] = useState<string | null>(null)

  const [atomProfileId, setAtomProfileId] = useAtom<string | null>(profileIdAtom)
  const [atomUserId, setAtomUserId] = useAtom<string | null>(userIdAtom)
  const [isDemo] = useAtom(isDemoAtom)

  useEffect(() => {
    console.log('atomProfileId: ', atomProfileId)
    console.log('atomUserId: ', atomUserId)
    console.log('atomDemoMode: ', isDemo)

    setIsSignup(atomUserId === null)
    if (isDemo || atomProfileId) {
      loadProfile(atomProfileId!)
    }

  }, [])


  const loadProfile = async (profileId: string) => {
    const response = await fetch(`/api/profile?profileId=${profileId}`)
    const { profiles } = await response.json()
    const profile = profiles[0]

    // Set select values using state
    setSchool(profile?.school || undefined)
    setGraduationYear(profile?.graduation_date ? new Date(profile?.graduation_date).getUTCFullYear().toString() : '')

    // Populate form fields with profile data
    if (formRef.current) {
      const form = formRef.current

      if (profile) {
        // Profile fields
        (form.elements.namedItem('email') as HTMLInputElement).value = profile.email || '';
        (form.elements.namedItem('linkedin') as HTMLInputElement).value = profile.linkedin_url || '';
        (form.elements.namedItem('school') as HTMLInputElement).value = profile.school || '';
        (form.elements.namedItem('major') as HTMLInputElement).value = profile.major || '';
        (form.elements.namedItem('concentration') as HTMLInputElement).value = profile.concentration || '';

        //resume field
        // setFileName(`${profile.email}-resume.pdf`);
        // const mockFile = new File([''], 'sample-resume.pdf', { type: 'application/pdf' });
        // setResumeFile(mockFile);
      }
    }

    return profile;
  }

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     setFileName(e.target.files[0].name);
  //     setResumeFile(e.target.files[0]);
  //   } else {
  //     setFileName('No file chosen');
  //     setResumeFile(null);
  //   }
  // }

  const saveProfile = async (formData: FormData) => {
    const profileAttributes = {
      id: atomProfileId,
      userId: atomUserId,
      email: formData.get('email'),
      linkedin: formData.get('linkedin'),
      school: formData.get('school'),
      major: formData.get('major'),
      concentration: formData.get('concentration'),
      graduation_year: formData.get('graduation_year'),
    };

    const profileResponse = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileAttributes)
    });

    const {success, userId, profileId, error} = await profileResponse.json();
    console.log('Profile response: ', success, profileId);

    if (!profileResponse.ok) {
      console.log('Profile response error: ', error)
      throw new Error(error || 'Failed to save profile');
    }

    setAtomProfileId(profileId)
    setAtomUserId(userId)

    return profileId
  }

  const uploadResume = async (profileId: number, resumeFile: File) => {
    if (resumeFile && resumeFile.name !== 'No file chosen') {
      const resumeFormData = new FormData();
      resumeFormData.append('resume', resumeFile);
      resumeFormData.append('profileId', profileId.toString()); // Associate resume with profile

      const resumeResponse = await fetch('/api/resume', {
        method: 'POST',
        body: resumeFormData
      });

      if (!resumeResponse.ok) {
        throw new Error('Failed to upload resume');
      }

      const {success: resumeSuccess, resumeUrl} = await resumeResponse.json();
      console.log('Resume response: ', resumeSuccess, resumeUrl);
      return resumeSuccess;
    }
    return false;
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const validateForm = (formData: FormData): string | null => {
    const requiredFields = [
      'email',
      'linkedin',
      'school',
      'major'
    ]

    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return `${field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')} is required`;
      }
    }

    // Email validation
    const email = formData.get('email') as string
    if (!validateEmail(email)) {
      return 'Please enter a valid email address'
    }

    // LinkedIn URL validation
    const linkedin = formData.get('linkedin') as string
    try {
      const url = new URL(linkedin)
      if (!url.hostname.includes('linkedin.com')) {
        return 'Please enter a valid LinkedIn URL'
      }
    } catch {
      return 'Please enter a valid LinkedIn URL'
    }

    // Add specific validation for school dropdown
    // const school = formData.get('school') as string
    // console.log('school: ', school)
    // if (!school) {
    //   return 'Please select your school'
    // }

    // Add specific validation for graduation year dropdown
    const graduationYear = formData.get('graduation_year') as string
    console.log('graduationYear: ', graduationYear)
    if (!graduationYear) {
      return 'Please select your graduation year'
    }

    // if (!resumeFile) {
    //   return 'Resume is required';
    // }

    // Add userId validation
    // if (!userId) {
    //   return 'User ID not found. Please log in again.';
    // }

    return null;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isDemo) {
      router.push(`/interview-setup`)
      return
    }

    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const validationError = validateForm(formData)
    if (validationError) {
      setError(validationError)
      setIsSubmitting(false)
      return
    }

    try {
      const profileId = await saveProfile(formData)
      console.log('Profile ID: ', profileId)
      if (profileId < 0) {
        setIsSubmitting(false)
        return
      }

      // await saveJob(profileId, formData)

      // if (includeResume) {
      //   const resumeFile = formData.get('resume') as File
      //   await uploadResume(profileId, resumeFile)
      // }

      router.push(`/interview-setup`)
    } catch (error: any) {
      setError(error?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getButtonText = () => {
    if (isSubmitting) return 'Saving...'
    if (isDemo) return 'Next'
    if (isSignup) return 'Continue'
    return 'Save'
  }

  return (
    <>
      <div className="flex-grow flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-[#252b3b] px-8 py-4 rounded-lg shadow-lg my-4">
          <div className="text-center">
            <h2 className="mt-2 text-3xl font-bold text-white">Profile Setup</h2>
            <p className="mt-2 text-sm text-gray-400">Complete your profile to get started</p>
{/*
            <p className="mt-2 text-sm text-gray-400">
              (or
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const demoProfileId = process.env.NEXT_PUBLIC_DEMO_PROFILE_ID as string
                  console.log('Demo profile ID: ', demoProfileId)


                  toast({
                    variant: "default",
                    duration: 4000,
                    className: "bg-green-800 text-white border-0",
                    title: "Example Loaded - Marketing Profile",
                    description:
                      "Scroll down and keep clicking 'Next' through the app to see example data and get a feel for how it works.",
                  })

                  loadProfile(demoProfileId)
                  setIsDemoMode(true)
                }}
                className="text-[#10B981] hover:text-[#059669] underline mx-1"
              >
                view an example
              </a>
              first)
            </p>
             */}
          </div>
          <form
            ref={formRef}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                />
              </div>
{/*
              {includeResume && (
                <div>
                  <label htmlFor="resume" className="block text-sm font-medium text-white">
                    Upload Resume (PDF)
                </label>
                <div className="mt-1 flex items-center">
                  <label
                    htmlFor="resume"
                    className="cursor-pointer bg-white text-gray-700 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors whitespace-nowrap"
                  >
                    Choose File
                  </label>
                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <span className="ml-3 text-sm text-gray-400 truncate">{fileName}</span>
                  </div>
                </div>
              )}
                 */}

              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium text-white">
                  LinkedIn
                </label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  placeholder="https://www.linkedin.com/in/yourprofile"
                  className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                />
              </div>

              <div>
                <label htmlFor="school" className="block text-sm font-medium text-white">
                  School
                </label>
                <Input
                  id="school"
                  name="school"
                  type="text"
                  placeholder="e.g. Baylor University"
                  className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                />
{/*
                <Select name="school" value={school} onValueChange={setSchool}>
                  <SelectTrigger className="w-full bg-white text-gray-700 border-gray-300 focus:ring-blue-500 mt-1 rounded-md">
                    <SelectValue placeholder="Select your school" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-700 border-gray-300">
                    <SelectItem value="Baylor University">Baylor University</SelectItem>
                    <SelectItem value="Boston College">Boston College</SelectItem>
                    <SelectItem value="Carnegie Mellon University">Carnegie Mellon University</SelectItem>
                    <SelectItem value="Columbia University">Columbia University</SelectItem>
                    <SelectItem value="Emory University">Emory University</SelectItem>
                    <SelectItem value="Washington University in St. Louis">Washington University in St. Louis</SelectItem>
                    <SelectItem value="UC Berkeley">UC Berkeley</SelectItem>
                    <SelectItem value="USC">USC</SelectItem>
                    <SelectItem value="Not on this list">Not on this list</SelectItem>
                  </SelectContent>
                </Select>
                 */}
              </div>
              <div>
                <label htmlFor="graduation_year" className="block text-sm font-medium text-white">
                  Graduation Year
                </label>
                <div className="mt-1">
                  <Select name="graduation_year" value={graduationYear} onValueChange={setGraduationYear}>
                    <SelectTrigger className="w-full bg-white text-gray-700 border-gray-300 focus:ring-blue-500 rounded-md">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-700 border-gray-300">
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                      <SelectItem value="2028">2028</SelectItem>
                      <SelectItem value="2029">2029</SelectItem>
                      <SelectItem value="2030">2030</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label htmlFor="major" className="block text-sm font-medium text-white">
                  Major
                </label>
                <Input
                  id="major"
                  name="major"
                  type="text"
                  placeholder="e.g. Finance, Marketing, etc."
                  className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                />
              </div>
              <div>
                <label htmlFor="concentration" className="block text-sm font-medium text-white">
                  Concentration (Optional)
                </label>
                <Input
                  id="concentration"
                  name="concentration"
                  type="text"
                  placeholder="e.g. Commercial, Private Equity, International"
                  className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                />
              </div>

{/*
              <div>
                <label htmlFor="current-courses" className="block text-sm font-medium text-white">
                  Current Courses
                </label>
                <textarea
                  id="current-courses"
                  name="current-courses"
                  rows={4}
                  placeholder="List your current courses (e.g. MKT 4350, ISOM 352)"
                  className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md text-sm px-3 py-2"
                ></textarea>
              </div>
               */}
            </div>
            <Button
              type="submit"
              className="w-full bg-[#10B981] text-white hover:bg-[#059669] py-2 px-4 rounded-md transition-colors"
              disabled={isSubmitting}
            >
              {getButtonText()}
            </Button>
          </form>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </div>
    </>
  )
}
