'use client'

import { profileIdAtom } from "@/stores/profileAtoms"
import { useUser } from '@clerk/nextjs'
import { useAtom } from "jotai"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [profileId, setProfileId] = useAtom(profileIdAtom)

  useEffect(() => {
    async function fetchProfile() {
      if (user?.id && !profileId) {
        try {
          const response = await fetch(`/api/profiles?userId=${user.id}`)
          if (response.ok) {
            const data = await response.json()
            console.log('JKDSLJ data', data)
            if (data.profile?.id) {
              setProfileId(data.profile.id)
            } else {
              router.push('/profile-setup')
            }
          } else {
            router.push('/profile-setup')
          }
        } catch (error) {
          console.error('Error fetching profile:', error)
          router.push('/profile-setup')
        }
      }
    }

    if (isLoaded) {
      if (!user) {
        router.push('/start')
      } else if (!profileId) {
        fetchProfile()
      }
    }
  }, [isLoaded, user, router, profileId, setProfileId])

  if (!isLoaded || !user) {
    return <div/>
  }

  return <>{children}</>
}
