'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Footer } from './components-footer'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function ProfileSetupComponent() {
  const router = useRouter()
  const [fileName, setFileName] = useState<string>('No file chosen')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name)
    } else {
      setFileName('No file chosen')
    }
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    console.log("Saving profile")
    e.preventDefault()
    console.log("Saving profile 2")
    // Here you would typically save the profile data
    // For now, we'll just navigate to the job prep page
    router.push('/job-prep')
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1f2b]">
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-[#252b3b] p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-white">Profile Setup</h2>
            <p className="mt-2 text-sm text-gray-400">Complete your profile to get started</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSaveProfile}>
            <div className="space-y-4">
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
                    accept=".pdf"
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
                <label htmlFor="job-description" className="block text-sm font-medium text-white">
                  Job Description URL
                </label>
                <Input
                  id="job-description"
                  name="job-description"
                  type="url"
                  placeholder="https://example.com/job-description"
                  className="bg-white text-gray-700 placeholder-gray-400 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1 w-full rounded-md"
                />
              </div>
              <div>
                <label htmlFor="school" className="block text-sm font-medium text-white">
                  School
                </label>
                <Select name="school">
                  <SelectTrigger className="w-full bg-white text-gray-700 border-gray-300 focus:ring-blue-500 mt-1 rounded-md">
                    <SelectValue placeholder="Select your school" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-gray-700 border-gray-300">
                    <SelectItem value="berkeley">UC Berkeley Haas School of Business</SelectItem>
                    <SelectItem value="emory">Emory University Goizueta Business School</SelectItem>
                    <SelectItem value="baylor">Baylor University Hankamer School of Business</SelectItem>
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
                  Concentration
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
                <label htmlFor="graduation-date" className="block text-sm font-medium text-white">
                  Graduation Date
                </label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  <Select name="graduation-month">
                    <SelectTrigger className="w-full bg-white text-gray-700 border-gray-300 focus:ring-blue-500 rounded-md">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-700 border-gray-300">
                      <SelectItem value="01">January</SelectItem>
                      <SelectItem value="02">February</SelectItem>
                      <SelectItem value="03">March</SelectItem>
                      <SelectItem value="04">April</SelectItem>
                      <SelectItem value="05">May</SelectItem>
                      <SelectItem value="06">June</SelectItem>
                      <SelectItem value="07">July</SelectItem>
                      <SelectItem value="08">August</SelectItem>
                      <SelectItem value="09">September</SelectItem>
                      <SelectItem value="10">October</SelectItem>
                      <SelectItem value="11">November</SelectItem>
                      <SelectItem value="12">December</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select name="graduation-year" defaultValue="2025">
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
            <Button type="submit" className="w-full bg-[#10B981] text-white hover:bg-[#059669] py-2 px-4 rounded-md transition-colors">
              Save Profile
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
