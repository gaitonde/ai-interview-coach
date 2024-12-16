import { useClerk } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import { profileIdAtom } from "@/stores/profileAtoms";
import { useSetAtom } from "jotai";
// import { currentUser } from "@clerk/nextjs/server";

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
    router.push('/start')
  };

  return logout;
};

export function removeDemoData() {
  localStorage.removeItem('mode')
  localStorage.removeItem('profileId')
  localStorage.removeItem('interviewId')
  localStorage.removeItem('userId')
}

// export async function requireAuth() {
//   const user = await currentUser();

//   if (!user) {
//     redirect("/sign-in");
//   }

//   return user;
// }
