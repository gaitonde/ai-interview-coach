import InterviewerPrep from '@/components/interviewer-prep'
import ProtectedLayout from "@/components/layouts/ProtectedLayout"

export default function InterviewPrepPage() {
  return <>
    <ProtectedLayout>
      <InterviewerPrep />
    </ProtectedLayout>
  </>
}
