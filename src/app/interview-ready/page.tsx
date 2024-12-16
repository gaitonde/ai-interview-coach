import InterviewReady from '@/components/interview-ready'
import ProtectedLayout from "@/components/layouts/ProtectedLayout"

export default function InterviewReadyPage() {
  return <>
    <ProtectedLayout>
      <InterviewReady />
    </ProtectedLayout>
  </>
}
