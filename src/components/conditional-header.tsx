'use client'

import { Header } from '@/components/header'
import { isDemoAtom } from '@/stores/profileAtoms'
import { useAuth } from '@clerk/nextjs'
import { useAtomValue } from 'jotai'

export function ConditionalHeader() {
  const { userId } = useAuth()

  console.log('userId in conditional-header', userId)

  const isDemo = useAtomValue(isDemoAtom)

  if (!userId) return null

  return (userId || isDemo) && <Header />
}
