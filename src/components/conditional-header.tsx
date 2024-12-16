'use client'

import { Header } from '@/components/header'
import { useAuth } from '@clerk/nextjs'

export default function ConditionalHeader() {
  const { userId } = useAuth()

  console.log('userId in conditional-header', userId)

  if (!userId) return null

  return <Header />
}
