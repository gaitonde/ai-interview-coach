import Dashboard from '@/components/dashboard'
import { redirect } from 'next/navigation'
import { getProfile } from '@/app/actions/get-profile'

export default async function DashboardPage({
  profileId,
}: {
  profileId: string
}) {
  const profile = await getProfile(profileId)

  if (!profile) {
    redirect('/profile-setup')
  }

  return (
    <main>
      <Dashboard />
    </main>
  )
}