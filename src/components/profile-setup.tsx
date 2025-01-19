'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { isDemoAtomWithStorage, profileIdAtomWithStorage, userIdAtomWithStorage } from '@/stores/profileAtoms'
import { useClerk, useSignIn } from '@clerk/nextjs'
import { useAtom, useAtomValue } from 'jotai'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useRef, useState } from 'react'

const DEFAULT_GRADUATION_YEAR = '2025'

export function ProfileSetup() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({
    email: '',
    linkedin: '',
    school: '',
    major: '',
    concentration: '',
    graduationYear: DEFAULT_GRADUATION_YEAR
  });
  const [graduationYear, setGraduationYear] = useState<string>(DEFAULT_GRADUATION_YEAR)
  const [, setIsSignup] = useState(false)
  const { signIn } = useSignIn()
  const clerk = useClerk()
  const isDemo = useAtomValue(isDemoAtomWithStorage)
  const [storedProfileId, setStoredProfileId] = useAtom(profileIdAtomWithStorage)
  const [storedUserId, setStoredUserId] = useAtom(userIdAtomWithStorage)

  // const [isDemoMode, setIsDemoMode] = useState(false)
  // const [includeResume, setIncludeResume] = useState(false)
  // const [fileName, setFileName] = useState<string>('No file chosen')
  // const [resumeFile, setResumeFile] = useState<File | null>(null)
  // const [userId, setUserId] = useState<string | null>(null)


  useEffect(() => {
    setIsSignup(storedUserId === null)
    if (isDemo || storedProfileId) {
      loadProfile(storedProfileId!)
    }
  }, [])

  const loadProfile = async (profileId: string) => {
    const response = await fetch(`/api/profile?profileId=${profileId}`)
    const { profiles } = await response.json()
    const profileData = profiles[0]

    if (profileData) {
      await setStoredProfileId(profileData.id)
      const gradYear = profileData.graduation_date ?
        new Date(profileData.graduation_date).getUTCFullYear().toString() : DEFAULT_GRADUATION_YEAR

      setFormData({
        email: profileData.email || '',
        linkedin: profileData.linkedin_url || '',
        school: profileData.school || '',
        major: profileData.major || '',
        concentration: profileData.concentration || '',
        graduationYear: gradYear
      });
      setGraduationYear(gradYear);
    }

    return profileData
  }

  const saveProfile = async (formData: FormData) => {
    try {
      const profileAttributes = {
        id: storedProfileId,
        email: formData.get('email'),
        linkedin: formData.get('linkedin'),
        school: formData.get('school'),
        major: formData.get('major'),
        concentration: formData.get('concentration'),
        graduation_year: formData.get('graduation_year'),
      }

      const profileResponse = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileAttributes)
      })

      const {userId: clerkId, profileId, ticket, error} = await profileResponse.json()

      if (!profileResponse.ok) {
        console.log('Profile response error: ', error)
        throw new Error(error || 'Failed to save profile')
      }

      // Update atoms in this order and wait for them to complete
      await Promise.all([
        setStoredProfileId(profileId),
        setStoredUserId(clerkId),
      ])

      return {profileId, clerkId, ticket}
    } catch (error) {
      console.error('Error in saveProfile:', error)
      throw error
    }
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isRecentOrFutureGrad = (year: string | undefined): boolean => {
    if (!year) return false
    const currentYear = new Date().getFullYear()
    const gradYear = parseInt(year)
    return gradYear >= currentYear - 1
  }

  const validateForm = (formData: FormData): string | null => {
    const requiredFields = [
      'email',
      'linkedin',
    ]

    // Add conditional required fields
    if (isRecentOrFutureGrad(graduationYear)) {
      requiredFields.push('school', 'major', 'graduation_year')
    }

    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return `${field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')} is required`
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
    if (isRecentOrFutureGrad(graduationYear)) {
      const formGraduationYear = formData.get('graduation_year') as string
      if (!formGraduationYear) {
        return 'Please select your graduation year'
      }
    }

    // if (!resumeFile) {
    //   return 'Resume is required'
    // }

    // Add userId validation
    // if (!userId) {
    //   return 'User ID not found. Please log in again.'
    // }

    return null
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isDemo) {
      router.push(`/interview-setup`)
      return
    }

    handleSignOut()
    setIsSubmitting(true)
    setErrorMsg(null)

    const formData = new FormData(e.currentTarget)
    const validationError = validateForm(formData)
    if (validationError) {
      setErrorMsg(validationError)
      setIsSubmitting(false)
      return
    }

    try {
      const {profileId, clerkId, ticket} = await saveProfile(formData)
      if (profileId < 0) {
        setIsSubmitting(false)
        return
      }

      const signInResult = await signIn?.create({
        strategy: 'ticket',
        ticket: ticket,
      })

      if (signInResult?.status === 'complete') {
        const sessionId = signInResult.createdSessionId
        if (sessionId) {
          await clerk.setActive({ session: sessionId })

          // The atoms will automatically persist to localStorage
          await Promise.all([
            setStoredProfileId(profileId),
            setStoredUserId(clerkId)
          ])

          console.log("Session activated successfully!")
        }
      }

      router.push('/interview-setup')
    } catch (error: any) {
      setErrorMsg(error?.message)
      setIsSubmitting(false)
    }
  }

  const getButtonText = () => {
    if (isSubmitting) return 'Saving...'
    if (isDemo) return 'Next'
    return 'Continue'
  }

  const handleSignOut = async () => {
    await clerk.signOut()
    // setStoredProfileId('')
    // setStoredUserId('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <div className="flex justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-[#252b3b] px-8 py-4 rounded-lg shadow-lg my-4">
          <div className="text-center">
            <h2 className="mt-2 text-3xl font-bold text-white">Verify Profile</h2>
            <p className="mt-2 text-sm text-gray-400">Confirm your information to get started</p>
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
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                />
              </div>
              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium text-white">
                  LinkedIn
                </label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://www.linkedin.com/in/yourprofile"
                  className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                />
              </div>

              {isRecentOrFutureGrad(graduationYear) && (
                <>
                  <div>
                    <label htmlFor="school" className="block text-sm font-medium text-white">
                      School
                    </label>
                    <Input
                      id="school"
                      name="school"
                      type="text"
                      value={formData.school}
                      onChange={handleInputChange}
                      placeholder="e.g. Baylor University"
                      className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                    />
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
                      value={formData.major}
                      onChange={handleInputChange}
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
                      value={formData.concentration}
                      onChange={handleInputChange}
                      placeholder="e.g. Commercial, Private Equity, International"
                      className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                    />
                  </div>
                </>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-[#10B981] text-white hover:bg-[#059669] py-2 px-4 rounded-md transition-colors"
              disabled={isSubmitting}
            >
              {getButtonText()}
            </Button>
            <p className="mt-4 text-sm">
              <span>
                By clicking continue, you agree to our{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Terms of Service
                </a>
                .
              </span>
            </p>
          </form>
          {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
        </div>
      </div>
    </>
  )
}
