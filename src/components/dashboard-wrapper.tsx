'use client'

import { profileIdAtom } from '@/stores/profileAtoms'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DashboardPage from './dashboard-page'

export default function DashboardWrapper() {
  const router = useRouter()
  const [profileId] = useAtom(profileIdAtom)

  useEffect(() => {
    if (!profileId) {
      router.push('/profile-setup')
    }
  }, [profileId])

  return (
    <div>
      {profileId && <DashboardPage profileId={profileId}/>}
    </div>
  )
}