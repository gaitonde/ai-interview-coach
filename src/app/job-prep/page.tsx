import { JobPrepComponent } from '@/components/job-prep'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Job Prep Page | AI Interview Coach',
  description: 'Prepare for your job interview with our comprehensive prep sheet.',
}

export default function JobPrepPage() {
  return (
    <div className="min-h-screen bg-[#111827]">
      <JobPrepComponent />
    </div>
  )
}
