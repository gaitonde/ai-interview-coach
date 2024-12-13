'use client'

import { Header } from '@/components/header'
import { isDemoAtom } from '@/stores/profileAtoms'
import { useAuth } from '@clerk/nextjs'
import { useAtomValue } from 'jotai'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ConditionalHeader() {
  const router = useRouter()
  const { userId, signOut } = useAuth()

  console.log('In ConditionalHeader userId', userId)

  useEffect(() => {
    if (!userId) {
      signOut()
      router.push('/start')
    }
  }, [userId, signOut, router])

  const isDemo = useAtomValue(isDemoAtom)

  console.log('userId', userId)
  console.log('isDemo', isDemo)

  if (!userId) return null

  return (userId || isDemo) && <Header />
}
