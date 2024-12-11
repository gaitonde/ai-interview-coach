'use client'

import { getProfileX } from '@/app/actions/get-profile'
import Dashboard from '@/components/dashboard'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ConditionalHeader } from '@/components/conditional-header'

export default function DashboardPage({ profileId }: { profileId: string }) {

  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getProfileX(profileId)

      if (!profile) {
        router.push('/profile-setup')
        return
      }

    }

    fetchProfile()
  }, [profileId, router])

  return (
    <>
      <ConditionalHeader />
      <Dashboard />
    </>
  )
}