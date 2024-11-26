import Dashboard from '@/components/dashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Interview AI Coach',
  description: 'View and manage your interview preparation sessions',
}

export default function DashboardPage() {
  return (
    <main>
      <Dashboard />
    </main>
  )
}