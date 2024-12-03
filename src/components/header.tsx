'use client'

import { useAuth } from '@clerk/nextjs'
import Link from "next/link"
import { UserMenu } from "./user-menu"

export function Header() {
  const { userId } = useAuth()
  console.debug('XX in home userId', userId)

  return (
    <header className="p-4 md:p-8">
      <div className={`max-w-7xl mx-auto ${userId ? 'flex justify-between' : 'text-center'} items-center`}>
        <Link href="/">
          <h1 className="text-2xl font-bold text-[#10B981]">AI Interview Coach</h1>
        </Link>
        {userId && <UserMenu />}
      </div>
    </header>

  )
}