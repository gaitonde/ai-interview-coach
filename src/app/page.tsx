'use client'

import ConditionalHeader from '@/components/conditional-header'
import Dashboard from '@/components/dashboard'
import { userIdAtom } from '@/stores/profileAtoms'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useEffect, useCallback } from 'react'

export default function Home() {
  const router = useRouter()
  const [atomUserId, setAtomUserId] = useAtom(userIdAtom)

  const navigateToStart = useCallback(() => {
    router.push('/start')
  }, [router])

  useEffect(() => {
    if (!atomUserId) {
      navigateToStart()
    } else {
      fetch(`/api/users?id=${atomUserId}`)
      .then(response => response.json())
      .then(data => {
        if (!data.profile.school) {
          router.push('/profile-setup')
        } else {
          router.push('/dashboard')
        }
      })
      .catch(error => {
        console.error('Error fetching user:', error)
        setAtomUserId(null)
        navigateToStart()
      })
    }
  }, [atomUserId, navigateToStart])

  return (
    <>
      <ConditionalHeader />
      {atomUserId && <Dashboard />}
    </>
  )
}
