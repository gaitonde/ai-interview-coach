'use client'

import { Header } from "@/components/header"
import { useEffect, useState } from "react"

interface ConditionalHeaderProps {
  userId: string | null
}

export function ConditionalHeader({ userId }: ConditionalHeaderProps) {
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    setIsDemo(localStorage.getItem('mode') === 'demo')
  }, [])

  if (userId || isDemo) {
    return <Header />
  }

  return null
}