import CompanyPrep from '@/components/company-prep'
import ProtectedLayout from "@/components/layouts/ProtectedLayout"

export default function CompanyPrepPage() {
  return <>
    <ProtectedLayout>
      <CompanyPrep />
    </ProtectedLayout>
  </>
}
