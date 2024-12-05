'use client'

import { useEffect, useState } from 'react'
import DashboardPage from './dashboard-page'
import { useRouter } from 'next/navigation'

export default function DashboardWrapper() {
  console.log('in DashboardWrapper')
  const router = useRouter()
  const [profileId, setProfileId] = useState<string | null>(null)

  useEffect(() => {
    const storedProfileId = localStorage.getItem('profileId')
    setProfileId(storedProfileId)
    if (!storedProfileId) {
      router.push('/profile-setup')
    }
  }, [])

  return (
    <div>
      {profileId && <DashboardPage profileId={profileId}/>}
    </div>
  )
}