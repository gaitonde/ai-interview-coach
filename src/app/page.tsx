'use client'
import Dashboard from "@/components/dashboard"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from 'react'

export default function Home() {
  const router = useRouter()
  const { userId, isLoaded } = useAuth()

  // Handle authentication check and redirect
  useEffect(() => {
    if (isLoaded && !userId) {
      console.debug('User is loaded and not authenticated!')
      router.push('home')
    } else if (isLoaded && userId) {
      console.log('User is loaded and authenticated!')

      // Make API call to /users with clerk_id
      fetch(`/api/users?clerk_id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log('User data:', data)
        localStorage.setItem('userId', data.id)
        console.log('data.profile', data.profile)
        if (!data.profile.school) {
          router.push('/profile-setup')
        }
      })
      .catch(error => {
        console.error('Error fetching user:', error)
      })
    }
  }, [isLoaded, userId, router])

  // Show loading state while auth is loading
  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Dashboard />
    </>
  )
}
