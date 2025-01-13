'use client'

import {
  isDemoAtomWithStorage,
  profileIdAtomWithStorage
} from '@/stores/profileAtoms'
import { useUser } from '@clerk/nextjs'
import { useAtom } from "jotai"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [profileId, setProfileId] = useAtom(profileIdAtomWithStorage)
  const [isDemo, setIsDemo] = useAtom(isDemoAtomWithStorage)

  useEffect(() => {
    if (!isLoaded) return

    async function fetchProfile() {
      if (!user?.id || profileId) return

      try {
        const response = await fetch(`/api/profiles?userId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
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

    if (!user && !isDemo) {
      console.log('In ProtectedLayout useEffect user not found, redirecting to start')
      router.push('/')
    } else {
      console.log('In ProtectedLayout useEffect user found, fetching profile')
      fetchProfile()
    }
  }, [isLoaded, user, router, profileId, setProfileId])

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if ((!isLoaded || !user) && !isDemo) {
    return <div/>
  }

  return <>{children}</>
}
