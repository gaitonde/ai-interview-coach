'use client'

import { useAuth } from '@clerk/nextjs'
import Link from "next/link"
import { UserMenu } from "./user-menu"

export function Header() {
  const { userId } = useAuth()
  console.log('XXX userId', userId)

  return (
    <header className="p-4 md:p-8">
      <div className={`container max-w-7xl mx-auto flex justify-between items-center px-4`}>
        <Link href="/">
          <h1 className="md:text-4xl text-2xl font-bold text-[#10B981]">AI Interview Coach</h1>
        </Link>
        {userId && <UserMenu />}
      </div>
    </header>
  )
}