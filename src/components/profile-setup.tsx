'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Footer } from './footer'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FormEvent } from 'react'
import { useToast } from "@/hooks/use-toast"

export function ProfileSetup() {
  const router = useRouter()
  const [fileName, setFileName] = useState<string>('No file chosen')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [school, setSchool] = useState<string>('')
  const [graduationYear, setGraduationYear] = useState<string>('')
  const [isDemoMode, setIsDemoMode] = useState(false)
  const { toast } = useToast()
  const [statusMessage, setStatusMessage] = useState('Thinking...')

  useEffect(() => {
    const storedProfileId = localStorage.getItem('profileId')
    const isDemo = localStorage.getItem('mode') === 'demo';
    if (isDemo && storedProfileId) {
      loadProfile(storedProfileId);
    }
    setIsDemoMode(isDemo);
  }, []);

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

  const loadProfile = async (profileId: string) => {
    const response = await fetch(`/api/profile?profileId=${profileId}`);
    const { profile, job } = await response.json();

    // Set select values using state
    setSchool(profile?.school || '')
    setGraduationYear(profile?.graduation_date ? new Date(profile?.graduation_date).getUTCFullYear().toString() : '')

    // Populate form fields with profile data
    if (formRef.current) {
      const form = formRef.current;

      if (profile) {
        // Profile fields
        (form.elements.namedItem('email') as HTMLInputElement).value = profile.email || '';
        (form.elements.namedItem('major') as HTMLInputElement).value = profile.major || '';
        (form.elements.namedItem('concentration') as HTMLInputElement).value = profile.concentration || '';

        //resume field
        setFileName(`${profile.email}-resume.pdf`);
        const mockFile = new File([''], 'sample-resume.pdf', { type: 'application/pdf' });
        setResumeFile(mockFile);
      }

      // Job fields
      if (job) {
        (form.elements.namedItem('company_url') as HTMLInputElement).value = job.company_url || '';
        (form.elements.namedItem('jd_url') as HTMLInputElement).value = job.jd_url || '';
        (form.elements.namedItem('interviewer_name') as HTMLInputElement).value = job.interviewer_name || '';
        (form.elements.namedItem('interviewer_role') as HTMLInputElement).value = job.interviewer_role || '';
      }
    }

    return profile;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      setResumeFile(e.target.files[0]);
    } else {
      setFileName('No file chosen');
      setResumeFile(null);
    }
  }

  const saveProfile = async (formData: FormData) => {
    const profileAttributes = {
      email: formData.get('email'),
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

    const {success, profileId} = await profileResponse.json();
    console.log('Profile response: ', success, profileId);

    if (!profileResponse.ok) {
      throw new Error('Failed to save profile');
    }

    return profileId;
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

  const saveJob = async (profileId: number, formData: FormData) => {
    try {
      const response = await fetch(`/api/jobs?profileId=${profileId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId,
          company_url: formData.get('company_url'),
          jd_url: formData.get('jd_url'),
          interviewer_name: formData.get('interviewer_name'),
          interviewer_role: formData.get('interviewer_role')
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create job record');
      }

      const result = await response.json();
      return result.jobId;
    } catch (error) {
      console.error('Error creating job record:', error);
      throw error;
    }
  };

  const generateJobPrep = async (profileId: number) => {
    try {
      const response = await fetch('/api/generate-job-prep', {
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

  const validateForm = (formData: FormData): string | null => {
    const requiredFields = [
      'email',
      'school',
      'major',
      'graduation_year',
      'company_url',
      'jd_url',
    ];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return `${field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')} is required`;
      }
    }

    if (!resumeFile) {
      return 'Resume is required';
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
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const isDemo = localStorage.getItem('mode') === 'demo';
    if (isDemo) {
      router.push(`/job-prep`);
      return;
    }

    const formData = new FormData(e.currentTarget);

    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      const profileId = await saveProfile(formData);
      localStorage.setItem('profileId', profileId);

      await saveJob(profileId, formData);

      const resumeFile = formData.get('resume') as File;
      await uploadResume(profileId, resumeFile);

      await generateJobPrep(profileId);

      router.push(`/job-prep`);
    } catch (error) {
      console.error('Error during submission:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1f2b]">
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-[#252b3b] p-8 rounded-lg shadow-lg my-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#10B981]">AI Interview Coach</h1>
            <h2 className="mt-2 text-3xl font-bold text-white">Profile Setup</h2>
            <p className="mt-2 text-sm text-gray-400">Complete your profile to get started</p>
            <p className="mt-2 text-sm text-gray-400">
              (or
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const demoProfileId = '353';
                  localStorage.setItem('mode', 'demo');
                  localStorage.setItem('profileId', demoProfileId);

                  toast({
                    variant: "default",
                    duration: 2000,
                    className: "bg-green-800 text-white border-0",
                    title: "Example Marketing Profile Loaded",
                    description:
                      "Example data loaded. Click through the app to see how it works.",
                  });

                  loadProfile(demoProfileId);
                  setIsDemoMode(true);
                }}
                className="text-[#10B981] hover:text-[#059669] underline mx-1"
              >
                view an example
              </a>
              first)
            </p>
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
{/*
              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium text-white">
                  LinkedIn URL
                </label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  type="url"
                  placeholder="https://www.linkedin.com/in/yourprofile"
                  className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                />
              </div>
 */}
              <div>
                <label htmlFor="school" className="block text-sm font-medium text-white">
                  School
                </label>
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
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
                  // defaultValue="Ira Johnson"
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
                  // defaultValue="Senior Product Manager"
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
              {isSubmitting ? statusMessage : 'Next'}
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
      <Footer />
    </div>
  )
}
