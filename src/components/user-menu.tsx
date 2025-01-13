"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SignedIn, SignOutButton } from '@clerk/nextjs'
import { User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSetAtom } from 'jotai'
import { userIdAtom } from '@/stores/profileAtoms'

export function UserMenu() {
  const router = useRouter()
  const setUserId = useSetAtom(userIdAtom)

  return (
    <>
      <SignedIn>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1a1f2b] border-2 border-[#10B981] flex items-center justify-center text-white cursor-pointer hover:bg-[#252b3b]">
              <User className="w-6 h-6 md:w-7 md:h-7" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#252b3b] text-[#F9FAFB] border-[#374151]">
          <DropdownMenuItem onClick={() => router.push('/dashboard')} className="cursor-pointer hover:bg-[#374151]">
              Dashboard
            </DropdownMenuItem>
{/* TODO (DG: 12/11/2024): uncomment after being able to handle resume updates/versioning
            <DropdownMenuItem onClick={() => router.push('/profile-setup')} className="cursor-pointer hover:bg-[#374151]">
              Profile
            </DropdownMenuItem>
             */}
            <DropdownMenuItem onClick={() => router.push('/buy')} className="cursor-pointer hover:bg-[#374151]">
              Get More Interviews
            </DropdownMenuItem>
            <SignOutButton redirectUrl="/">
              <DropdownMenuItem
                onClick={() => setUserId(null)}
                className="cursor-pointer hover:bg-[#374151]"
              >
                Sign out
              </DropdownMenuItem>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>
    </>
  )
}