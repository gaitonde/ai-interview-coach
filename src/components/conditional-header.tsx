'use client'

import { Header } from '@/components/header'
import { isDemoAtom } from '@/stores/profileAtoms'
import { useAuth } from '@clerk/nextjs'
import { useAtomValue } from 'jotai'
import { useRouter } from 'next/navigation'

export function ConditionalHeader() {
  const router = useRouter()
  const { userId } = useAuth()

  // if (!userId) {
  //   router.push('/home')
  //   return null
  // }
  const isDemo = useAtomValue(isDemoAtom)

  // console.log('userId', userId)
  // console.log('isDemo', isDemo)

  return (userId || isDemo) && <Header />
}
