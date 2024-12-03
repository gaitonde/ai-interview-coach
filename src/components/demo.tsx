'use client'

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

interface Profile {
  id: string
  email: string
  school: string
  major: string
}

export function Demo() {
  const router = useRouter()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [selectedProfileId, setSelectedProfileId] = useState<string>('')
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [showScore, setShowScore] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const savedMode = localStorage.getItem('mode')
    const isDemo = savedMode === 'demo'
    setIsDemoMode(isDemo)
    const profileId = localStorage.getItem('profileId')
    setSelectedProfileId(profileId || '')
    const savedShowScore = localStorage.getItem('showScore')
    setShowScore(savedShowScore === 'true')

    if (!isDemo) {
      setSelectedProfileId('normal')
      localStorage.removeItem('profileId')
    }

    const fetchDemoProfiles = async () => {
      const response = await fetch(`/api/demo-profiles`);

      if (!response.ok) {
        throw new Error('Failed to fetch prep sheet response');
      }
      const data = await response.json();
      setProfiles(data.profiles);
    };

    fetchDemoProfiles();
  }, []);

  const handleProfileClick = (profileId: string) => {
    if (selectedProfileId === profileId) {
      localStorage.removeItem('profileId');
      setSelectedProfileId('');
      setIsDemoMode(false);
      localStorage.removeItem('mode');
    } else {
      localStorage.setItem('profileId', profileId);
      setSelectedProfileId(profileId);
      setIsDemoMode(true);
      localStorage.setItem('mode', 'demo');
    }
  }

  const handleButtonClick = () => {
    const mode = isDemoMode ? 'demo' : 'normal'
    localStorage.setItem('mode', mode)
    router.push('/')
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#111827]">
      <main className="flex-grow flex flex-col items-center">
      <div className="w-full max-w-6xl">
          <h2 className="text-2xl font-bold my-4 mx-4">Testing</h2>

          <div className="mx-4 mb-4">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="showScore"
                checked={showScore}
                onCheckedChange={(checked: boolean) => {
                  setShowScore(checked)
                  if (checked) {
                    localStorage.setItem('showScore', 'true')
                  } else {
                    localStorage.removeItem('showScore')
                  }
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
          <h2 className="text-2xl font-bold my-4 mx-4">Example Student Profiles</h2>

          <div className="flex flex-wrap gap-4 mx-4 mb-6">
            <div
              onClick={() => {
                setIsDemoMode(false);
                setSelectedProfileId('normal');
                localStorage.removeItem('profileId');
                localStorage.removeItem('mode');
              }}
              className={`
                p-4 rounded-lg border cursor-pointer
                ${(!isDemoMode || selectedProfileId === 'normal')
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
                  ${selectedProfileId === `${profile.id}`
                    ? 'border-orange-400 bg-orange-400/10'
                    : 'border-gray-700 hover:border-orange-400/50'}
                `}
              >
                <p className="text-sm font-medium">{profile.email}</p>
                <p className="text-sm text-gray-400">{profile.school}</p>
                <p className="text-sm text-gray-400">{profile.major}</p>
              </div>
            ))}
          </div>
          <div className="mx-4 mb-4">
            <Button
                type="submit"
                onClick={handleButtonClick}
                disabled={isDemoMode && !selectedProfileId}
                className={`w-full ${
                  isDemoMode
                    ? 'bg-orange-400 hover:bg-orange-500'
                    : 'bg-[#10B981] hover:bg-[#0e9370]'
                } text-[#F9FAFB] py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isDemoMode
                  ? `Continue in Demo Mode with Profile (ID: ${selectedProfileId})`
                  : `Continue in Normal Mode`}
              </Button>

          </div>
        </div>
      </main>
    </div>
  )
}
