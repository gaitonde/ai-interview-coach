import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { profileIdAtom } from "@/stores/profileAtoms";
import { useSetAtom } from "jotai";

export const useLogout = () => {
  const { signOut } = useClerk()
  const router = useRouter()
  const setProfileId = useSetAtom(profileIdAtom)

  const logout = async () => {
    // Clear Jotai atoms
    setProfileId(null)

    // Sign out from Clerk
    await signOut()
    // Redirect to sign-in page
    router.push('/sign-in')
  };

  return logout;
};

export function removeDemoData() {
  localStorage.removeItem('mode')
  localStorage.removeItem('profileId')
  localStorage.removeItem('interviewId')
  localStorage.removeItem('userId')
}

