'use client'

import { Header } from '@/components/header'
import { isDemoAtom, userIdAtom } from '@/stores/profileAtoms'
import { useAtom, useAtomValue } from 'jotai'

export function ConditionalHeader() {
  const [userId] = useAtom(userIdAtom)
  const isDemo = useAtomValue(isDemoAtom)

  return (userId || isDemo) && <Header />
}
