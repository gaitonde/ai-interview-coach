'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Footer } from './footer'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function ProfileSetup() {
  const router = useRouter()
  const [fileName, setFileName] = useState<string>('No file chosen')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name)
    } else {
      setFileName('No file chosen')
    }
  }

  const saveProfile = async (formData: FormData) => {
    const profileAttributes = {
      email: formData.get('email'),
      school: formData.get('school'),
      major: formData.get('major'),
      concentration: formData.get('concentration'),
      graduation_year: formData.get('graduation_year'),
      company_url: formData.get('company_url'),
      jd_url: formData.get('jd_url')
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
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId,
          company_url: formData.get('company_url'),
          jd_url: formData.get('jd_url')
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

  const generatePrepSheet = async (profileId: number) => {
    try {
      const response = await fetch('/api/job-prep', {
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
      console.log('Prep sheet generated:', result.content);
      return result.content;
    } catch (error) {
      console.error('Error generating prep sheet:', error);
      throw error;
    }
  };

  const generateQuestions = async (profileId: number) => {
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
      console.log('Questions generated:', result.content);
      return result.content;
    } catch (error) {
      console.error('Error generating questions:', error);
      throw error;
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Save profile
      const profileId = await saveProfile(formData);

      // Save Job
      const jobCreated = await saveJob(profileId, formData);

      // Upload Resume
      const resumeFile = formData.get('resume') as File;
      const resumeUploaded = await uploadResume(profileId, resumeFile);

      // Generate Prep Sheet + Questions
      const prepSheetContent = await generatePrepSheet(profileId);

      // Generate Questions
      const questionsContent = await generateQuestions(profileId);

      // If everything is successful, you can redirect or show a success message
      router.push('/job-prep');
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
        <div className="w-full max-w-md space-y-8 bg-[#252b3b] p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-white">Profile Setup</h2>
            <p className="mt-2 text-sm text-gray-400">Complete your profile to get started</p>
          </div>
          <form
            className="mt-8 space-y-6"
            action={handleSubmit}
            // encType="multipart/form-data"
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
                  defaultValue="may@trix.com"
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
                    className="cursor-pointer bg-white text-gray-700 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
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
                  <span className="ml-3 text-sm text-gray-400">{fileName}</span>
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
                <label htmlFor="company_url" className="block text-sm font-medium text-white">
                  Company URL
                </label>
                <Input
                  id="company_url"
                  name="company_url"
                  type="url"
                  placeholder="https://acme.com"
                  defaultValue="https://www.snowflake.com/en/"
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
                  type="url"
                  placeholder="https://careers.example.com/job-description"
                  defaultValue="https://careers.snowflake.com/us/en/job/SNCOUSD38DF19E64C1405CA3A1ADC24F5ADB9EEXTERNALENUS152B293DEC65486289577F50089728AC/Software-Engineer-Intern-Toronto-Summer-2025"
                  className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                />
              </div>
              <div>
                <label htmlFor="school" className="block text-sm font-medium text-white">
                  School
                </label>
                <Select name="school" defaultValue="Carnegie Mellon University">
                  <SelectTrigger className="w-full bg-white text-gray-700 border-gray-300 focus:ring-blue-500 mt-1 rounded-md">
                    <SelectValue placeholder="Select your school" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-700 border-gray-300">
                    <SelectItem value="UC Berkeley Haas School of Business">UC Berkeley Haas School of Business</SelectItem>
                    <SelectItem value="Emory University Goizueta Business School">Emory University Goizueta Business School</SelectItem>
                    <SelectItem value="Baylor University Hankamer School of Business">Baylor University Hankamer School of Business</SelectItem>
                    <SelectItem value="Carnegie Mellon University">Carnegie Mellon University</SelectItem>
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
                  defaultValue="Computer Science"
                  className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                />
              </div>
              <div>
                <label htmlFor="concentration" className="block text-sm font-medium text-white">
                  Concentration
                </label>
                <Input
                  id="concentration"
                  name="concentration"
                  type="text"
                  placeholder="e.g. Commercial, Private Equity, International"
                  defaultValue="Software Engineering"
                  className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                />
              </div>
              <div>
                <label htmlFor="graduation_year" className="block text-sm font-medium text-white">
                  Graduation Year
                </label>
                <div className="mt-1">
                  <Select name="graduation_year" defaultValue="2025">
                    <SelectTrigger className="w-full bg-white text-gray-700 border-gray-300 focus:ring-blue-500 rounded-md">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-700 border-gray-300">
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </main>
      <Footer />
    </div>
  )
}
