'use client'

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Footer } from './footer'
import { useRouter } from 'next/navigation'

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

  useEffect(() => {
    const savedMode = localStorage.getItem('mode')
    const isDemo = savedMode === 'demo'
    setIsDemoMode(isDemo)

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
      <main className="flex-grow flex justify-center">
        <div className="w-full max-w-4xl prep-sheet-content">
          <h2 className="text-2xl font-bold my-4">Demo Mode</h2>

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
              <p className="text-sm text-gray-400">Continue without demo profile</p>
            </div>
            {profiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => handleProfileClick(profile.id)}
                className={`
                  p-4 rounded-lg border cursor-pointer
                  ${selectedProfileId === profile.id
                    ? 'border-[#10B981] bg-[#10B981]/10'
                    : 'border-gray-700 hover:border-[#10B981]/50'}
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
      <Footer />
    </div>
  )
}
