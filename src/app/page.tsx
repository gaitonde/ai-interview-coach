'use client'
import { ConditionalHeader } from '@/components/conditional-header'
import Dashboard from '@/components/dashboard'
import { useRouter } from "next/navigation"
import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { profileIdAtom, userIdAtom } from '@/stores/profileAtoms'

export default function Home() {
  const router = useRouter()
  const [atomUserId] = useAtom(userIdAtom)
  const [profileId] = useAtom(profileIdAtom)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (atomUserId) {
      setIsLoggedIn(true)
    }
  }, [atomUserId, profileId])

  useEffect(() => {

    if (atomUserId) {
      setIsLoggedIn(true)
    }
  }, [atomUserId, profileId])

  useEffect(() => {
    if (!atomUserId) {
      console.debug('User is loaded and not authenticated!')
      router.push('home')
      return
    }

    console.log('User is loaded and authenticated!')
    fetch(`/api/users?id=${atomUserId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log('User data:', data)
      console.log('data.profile', data.profile)
      if (!data.profile.school) {
        router.push('/profile-setup')
      }
    })
    .catch(error => {
      console.error('Error fetching user:', error)
    })
  }, [atomUserId, router])

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center min-h-screen px-4 py-12 bg-gradient-to-b from-background to-muted">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <>
      <ConditionalHeader />
      {atomUserId && <Dashboard />}
    </>
  )
}
