'use client'
import Dashboard from '@/components/dashboard'
import { useRouter } from "next/navigation"
import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { userIdAtom } from '@/stores/profileAtoms'

export default function Home() {
  const router = useRouter()
  const [userId] = useAtom(userIdAtom)

  // Handle authentication check and redirect
  useEffect(() => {
    if (!userId) {
      console.debug('User is loaded and not authenticated!')
      router.push('home')
    } else {
      console.log('User is loaded and authenticated!')

      fetch(`/api/users?id=${userId}`, {
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
    }
  }, [userId, router])

  // Show loading state while auth is loading
  if (!userId) {
    return (
      <div className="flex flex-col items-center min-h-screen px-4 py-12 bg-gradient-to-b from-background to-muted">
      </div>
    )
  }

  return (
    <>
      {userId && <Dashboard />}
    </>
  )
}
