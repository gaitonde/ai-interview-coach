import DashboardWrapper from '@/components/dashboard-wrapper'
import ProtectedLayout from "@/components/layouts/ProtectedLayout"

export default function DashboardRoute() {
  return (
    <>
      <ProtectedLayout>
        <DashboardWrapper />
      </ProtectedLayout>
    </>
  )
}
