'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import {
  interviewIdAtomWithStorage,
  isDemoAtomWithStorage,
  profileIdAtomWithStorage,
  showScoreAtomWithStorage,
} from '@/stores/profileAtoms'
import { useAtom } from 'jotai'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Profile {
  id: string
  email: string
  school: string
  major: string
}

export function Demo() {
  const router = useRouter()
  const { toast } = useToast()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [profileId, setProfileId] = useAtom(profileIdAtomWithStorage)
  const [interviewId, setInterviewId] = useAtom(interviewIdAtomWithStorage)
  const [isDemo, setIsDemo] = useAtom(isDemoAtomWithStorage)
  const [showScore, setShowScore] = useAtom(showScoreAtomWithStorage)

  const fetchDemoProfiles = async () => {
    const response = await fetch(`/api/demo-profiles`)

    if (!response.ok) {
      throw new Error('Failed to fetch demo profiles')
    }
    const data = await response.json()
    setProfiles(data.profiles)
  }

  const fetchDemoInterview = async (profileId: string) => {
    console.log('getting interview')
    const response = await fetch(`/api/demo-interviews?profileId=${profileId}`)

    if (!response.ok) {
      throw new Error('Failed to fetch demo interview')
    }
    const data = await response.json()
    if (data.interviews.length > 0) {
      setInterviewId(data.interviews[0].id)
    } else {
      toast({
        variant: "default",
        duration: 5000,
        title: "No Interviews Found",
        className: "bg-red-800 text-white border-0",
        description: `
          Unable to get any interviews for the profile with id: ${profileId}.
          Either add an is_demo bit to an interview for this profile or remove the is_demo bit from this profile.
          `,
      })
      setDemoMode(false)

      setProfileId('')
      setInterviewId('')
    }
  }

  const clearDemoData = async () => {
    console.log('TODO: clear demo data')
    // const response = await fetch(`/api/demo-interviews?profileId=${profileId}`)

    // if (!response.ok) {
    //   throw new Error('Failed to fetch demo interview')
    // }
    // const data = await response.json()
    // setInterviewId(data.content[0].id)
  }
  const setDemoMode = async (isDemo: boolean) => {
    setIsDemo(isDemo)
    Cookies.set('isDemo', isDemo.toString(), {
      secure: true,
      sameSite: 'strict'
    })
  }

  const handleProfileClick = (selectedProfileId: string) => {
    setDemoMode(true)
    setProfileId(selectedProfileId)
    fetchDemoInterview(selectedProfileId)
  }

  const handleSubmit = async () => {
    await clearDemoData()
    const url = isDemo ? '/profile-setup' : '/start'
    router.push(url)
  }

  useEffect(() => {
    fetchDemoProfiles()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-[#111827]">
      <div className="flex-grow flex flex-col items-center">
        <div className="w-full max-w-6xl">
          <h2 className="text-2xl font-bold my-4 mx-4">Testing</h2>

          <div className="mx-4 mb-4">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="showScore"
                checked={showScore}
                onCheckedChange={(checked: boolean) => {
                  setShowScore(checked)
                  toast({
                    variant: "default",
                    duration: 2000,
                    title: checked ? "Prompt Rubrics Enabled" : "Prompt Rubrics Disabled",
                    className: "bg-green-800 text-white border-0",
                    description: checked
                      ? "You will now see scoring rubrics for each prompt."
                      : "Scoring rubrics are now hidden.",
                  })
                }}
                className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
              />
              <label
                htmlFor="showScore"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Enable Prompt Rubrics
              </label>
            </div>
          </div>
        </div>
        <div className="w-full max-w-6xl">
          <h2 className="text-2xl font-bold my-4 mx-4">Example Profiles</h2>

          <div className="flex flex-wrap gap-4 mx-4 mb-6">
            <div
              onClick={() => {
                setDemoMode(false)
                setProfileId('')
              }}
              className={`
                p-4 rounded-lg border cursor-pointer
                ${(!isDemo || profileId === -1)
                  ? 'border-[#10B981] bg-[#10B981]/10'
                  : 'border-gray-700 hover:border-[#10B981]/50'}
              `}
            >
              <p className="text-sm font-medium">Normal Mode</p>
              <p className="text-sm text-gray-400">Continue without an example profile</p>
            </div>
            {profiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => handleProfileClick(`${profile.id}`)}
                className={`
                  p-4 rounded-lg border cursor-pointer
                  ${profileId === `${profile.id}`
                    ? 'border-orange-400 bg-orange-400/10'
                    : 'border-gray-700 hover:border-orange-400/50'}
                `}
              >
                <p className="text-sm font-medium">{profile.email}</p>
                <p className="text-sm text-gray-400">{profile.school}</p>
                <p className="text-sm text-gray-400">{profile.major}</p>
                {interviewId && (<p className="text-sm text-gray-400">Interview ID: {interviewId}</p>)}
              </div>
            ))}
          </div>
          <div className="mx-4 mb-4">
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isDemo && !profileId}
              className={`w-full ${isDemo
                  ? 'bg-orange-400 hover:bg-orange-500'
                  : 'bg-[#10B981] hover:bg-[#0e9370]'
                } text-[#F9FAFB] py-3 rounded-md font-medium transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isDemo
                ? `Continue in Demo Mode with Profile (ID: ${profileId})`
                : `Continue in Normal Mode`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
