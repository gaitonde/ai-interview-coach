'use client'

import { useEffect, useState } from 'react'
import DashboardPage from './dashboard-page'

export default function DashboardWrapper() {
  const [profileId, setProfileId] = useState<string | null>(null)

  useEffect(() => {
    setProfileId(localStorage.getItem('profileId'))
  }, [])

  if (!profileId) {
    return null
  }

  return <DashboardPage profileId={profileId} />
}