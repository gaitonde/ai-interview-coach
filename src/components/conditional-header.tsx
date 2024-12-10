'use client'

import { Header } from '@/components/header'
import { isDemoAtom } from '@/stores/profileAtoms'
import { useAtomValue } from 'jotai'

interface ConditionalHeaderProps {
  userId: string | null
}

export function ConditionalHeader({ userId }: ConditionalHeaderProps) {
  const isDemo = useAtomValue(isDemoAtom)

  if (userId || isDemo) {
    return <Header />
  }

  return null
}