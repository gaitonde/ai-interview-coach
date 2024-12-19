'use client'

import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { UserMenu } from '@/components/user-menu'

export function Header() {
  const { userId } = useAuth()
  console.log('userId from useAuth', userId)

  return (
    <div className="flex flex-col">
      <div className="flex-grow flex justify-center">
        <div className="w-full max-w-4xl">
          <header className="p-4 md:py-8">
            <div className={`container max-w-7xl mx-auto flex justify-between items-center`}>
              <Link href="/">
                <h1 className="md:text-4xl text-2xl font-bold text-white-500">Interview Playbook</h1>
              </Link>
              {userId && <UserMenu />}
            </div>
          </header>
        </div>
      </div>
    </div>
  )
}