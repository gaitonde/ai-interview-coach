'use client'

import { HeroSection } from '@/components/hero-section'
import { Button } from '@/components/ui/button'
import { profileIdAtom } from '@/stores/profileAtoms'
import { removeDemoData } from '@/utils/auth'
import { useAtom } from 'jotai'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useClerk } from '@clerk/nextjs'

export default function StartPage() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [, setProfileId] = useAtom(profileIdAtom)
  const { signOut } = useClerk()

  const handleUploadResume = async () => {
    removeDemoData()
    setIsUploading(true)
    uploadResume().then(uploaded => {
      if (uploaded) {
        router.push('/profile-setup')
      } else {
        setIsUploading(false)
      }
    })
  }

  const handleSignIn = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    removeDemoData()

    try {
      await signOut()
      router.push('/sign-in?redirect_url=/dashboard')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const uploadResume = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'application/pdf'

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) {
          resolve(false)
          return
        }

        try {

          const formData = new FormData()
          formData.append('resume', file)
          formData.append('filename', file.name)

          const response = await fetch('/api/resume', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) throw new Error('Upload failed')

          const result = await response.json()
          const profileId = result.profileId
          setProfileId(profileId)

          Cookies.set('profileId', profileId, {
            secure: true,
            sameSite: 'strict'
          })

          resolve(true)
        } catch (error) {
          console.error('Upload error:', error)
          resolve(false)
        }
      }

      input.click()
    })
  }

   return (
    <div className="flex flex-col items-center min-h-[100dvh] px-4 py-12 bg-gradient-to-b from-background to-muted">
      <HeroSection />

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Button
          size="lg"
          className="text-lg h-12 bg-[#10B981] hover:bg-[#059669]"
          onClick={handleUploadResume}
          disabled={isUploading}
        >
          <span className="min-w-[200px]">
            {isUploading ? "Uploading..." : "Start with your resume"}
          </span>
        </Button>

        <div className="text-center mt-4">
          <span className="text-sm">
            Already have an account?{' '}
            <Link
              href="/#"
              onClick={handleSignIn}
              className="text-blue-500 hover:underline"
              prefetch={true}
            >
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}
