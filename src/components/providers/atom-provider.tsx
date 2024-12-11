'use client'

import { Provider } from 'jotai'
import { ReactNode, useEffect, useState } from 'react'

type Props = {
  children: ReactNode
}

const HydrateAtoms = ({ children }: Props) => {
  const [mounted, setMounted] = useState(false)

  // Initialize with localStorage values
  // useHydrateAtoms([
  //   [profileIdAtom, localStorage.getItem('profileId') || ''],
  //   [userIdAtom, localStorage.getItem('userId') || ''],
  //   [interviewIdAtom, localStorage.getItem('interviewId') || ''],
  //   [showScoreAtom, localStorage.getItem('showScore') === 'true']
  // ])

  useEffect(() => {
    // Update atoms with localStorage values after mount
    if (typeof window !== 'undefined') {
      setMounted(true)
    }
  }, [])

  if (!mounted) {
    return null // or a loading spinner
  }

  return <>{children}</>
}

export function AtomProvider({ children }: Props) {
  return (
    <Provider>
      <HydrateAtoms>{children}</HydrateAtoms>
    </Provider>
  )
}