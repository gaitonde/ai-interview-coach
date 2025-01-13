'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { PlayCircle, Menu, ArrowRight, CheckCircle, X } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollingLogoBar } from './scrolling-logo-bar'
import { removeDemoData } from '@/utils/auth'
import { useRouter } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'
import Cookies from 'js-cookie'
import { useAtom } from "jotai"
import { profileIdAtomWithStorage } from "@/stores/profileAtoms"

export default function LandingPage() {
  const router = useRouter()
  const { signOut } = useClerk()
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [, setProfileId] = useAtom(profileIdAtomWithStorage)

  const handleUploadResume = async () => {
    removeDemoData()
    uploadResume().then(uploaded => {
      if (uploaded) {
        router.push('/profile-setup')
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
          setIsUploading(true)
          const formData = new FormData()
          formData.append('email', email)
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
          setIsUploading(false)
          resolve(false)
        }
      }

      input.click()
    })
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address')
      return
    }
    setEmailError('')

    try {
      const response = await fetch('/api/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('xFailed to submit email')
      }

      const data = await response.json()
      if (data.id < 0) {
        setIsEmailSubmitted(true)
        setIsStarted(false)
        setEmailError('This email may be taken. Did you already sign up?')
        return
      }

      setIsEmailSubmitted(true)
      setIsStarted(true)
    } catch (error) {
      console.error('Error submitting email:', error)
      setEmailError('This email may be taken. Did you already sign up?')
    }
  }

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#1F2937] text-white scroll-smooth">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="w-40 sm:w-48">
            <img
              src="/images/logo.png"
              alt="Interview Playbook - Personalized AI Coach"
              width={240}
              height={80}
              className="w-full h-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex space-x-6">
            <Link
              href="#elevate-skills"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('elevate-skills');
              }}
              className="text-sm font-medium text-white hover:text-emerald-400 transition-colors duration-200"
            >
              Features
            </Link>
            <Link
              href="#success-stories"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('success-stories');
              }}
              className="text-sm font-medium text-white hover:text-emerald-400 transition-colors duration-200"
            >
              Success Stories
            </Link>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-white hover:text-emerald-400 transition-colors duration-200"
            >
              Sign In
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="sm:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-[#1F2937] border-emerald-500/30"
              onCloseAutoFocus={(e) => {
                e.preventDefault();
              }}
            >
              <SheetTitle className="text-white">Navigation Menu</SheetTitle>
              <nav className="flex flex-col space-y-4 mt-8">
                <SheetClose asChild>
                  <button
                    onClick={() => {
                      setTimeout(() => scrollToSection('elevate-skills'), 100);
                    }}
                    className="text-left text-lg text-white hover:text-emerald-400 transition-colors duration-200"
                  >
                    Features
                  </button>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/sign-in"
                    className="text-lg text-white hover:text-emerald-400 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        {/* Hero Section */}
        <section className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-emerald-400">
              Master Your Interview Game
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Harness the power of AI to perfect your interview skills and land your dream job.
            </p>
            {!isStarted ? (
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto">
                <div className="w-full">
                  <Input
                    type="email"
                    placeholder="Enter your email to get started"
                    className="h-12 bg-white/5 border-emerald-500/30 text-white placeholder:text-gray-400 w-full"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setEmailError('')
                    }}
                    required
                  />
                  {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                </div>
                <Button
                  type="submit"
                  className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-full transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
                >
                  Start Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            ) : (
              <div className="max-w-md mx-auto">
                <AnimatePresence>
                  {isEmailSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 text-emerald-400 flex items-center justify-center"
                    >
                      <CheckCircle className="mr-2 h-5 w-5" />
                      <span>Great! You can now upload your resume.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex justify-center gap-4">
                  <Button
                    size="lg"
                    className="text-lg h-12 bg-[#10B981] hover:bg-[#059669]"
                    onClick={handleUploadResume}
                    disabled={isUploading}
                  >
                    <span className="min-w-[200px]">
                      {isUploading ? "Uploading..." : "Upload Resume"}
                    </span>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </section>

        {/* Scrolling Logo Bar */}
        <section className="mb-20">
          <ScrollingLogoBar />
        </section>

        {/* Video Section */}
        <section className="mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-emerald-400">
            See Interview Playbook in Action
          </h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden group cursor-pointer"
            onClick={() => setIsVideoModalOpen(true)}
          >
            <div className="absolute inset-0 bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle className="w-20 h-20 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <img
              src="/images/placeholder.svg?height=720&width=1280"
              alt="Interview Playbook Demo"
              width={1280}
              height={720}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </section>

        {/* Feature Boxes */}
        <section id="elevate-skills" className="mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-emerald-400">
            Elevate Your Interview Skills
          </h2>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Research",
                description: "Streamline your company research with our intelligent data gathering",
                icon: (
                  <img
                    src="/images/feature-1.png"
                    alt="AI-Powered Research icon"
                    width={640}
                    height={640}
                    className="mb-4"
                  />
                )
              },
              {
                title: "Personalized Prep",
                description: "Get tailored interview questions and answers based on your profile",
                icon: (
                  <img
                    src="/images/feature-1.png"
                    alt="Personalized preparation icon"
                    width={640}
                    height={640}
                    className="mb-4"
                  />
                )
              },
              {
                title: "Real-time Feedback",
                description: "Receive instant feedback on your responses during practice sessions",
                icon: (
                  <img
                    src="/images/feature-2.png"
                    alt="Real-time feedback interface"
                    width={640}
                    height={640}
                    className="mb-4"
                  />
                )
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-md p-6 rounded-xl text-center hover:bg-white/10 transition-colors duration-300 border border-emerald-500/30 flex flex-col items-center"
              >
                <div className="w-40 h-40 mb-4 flex items-center justify-center">
                  {typeof feature.icon === 'string' ? (
                    <span className="text-4xl">{feature.icon}</span>
                  ) : (
                    feature.icon
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-emerald-400">{feature.title}</h3>
                <p className="text-sm text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonial Section */}
{/*
        <section id="success-stories" className="mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-emerald-400">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Alex G.",
                role: "Product Management",
                content: "Interview Playbook transformed my interview preparation. The AI-powered practice sessions were incredibly realistic and helped me land my dream job!"
              },
              {
                name: "Sarah P.",
                role: "Digital Marketing Manager",
                content: "As a career switcher, I was nervous about interviews. This platform gave me the confidence I needed. The personalized feedback was invaluable!"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-emerald-500/30"
              >
                <div className="flex flex-col mb-4">
                  <h3 className="font-semibold text-emerald-400 text-lg">{testimonial.name}</h3>
                  <p className="text-sm text-gray-300">{testimonial.role}</p>
                </div>
                <p className="text-gray-300 italic">&ldquo;{testimonial.content}&rdquo;</p>
              </motion.div>
            ))}
          </div>
        </section> */}

        {/* CTA Section */}
        <section className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-emerald-400">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of successful job seekers who have transformed their interview skills with Interview Playbook.
          </p>
          <Button
            onClick={() => scrollToSection('top')}
            className="h-14 px-10 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-medium rounded-full transition-all duration-200 transform hover:scale-105"
          >
            Get Started for Free
          </Button>
        </section>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2"
                onClick={() => setIsVideoModalOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Interview Playbook Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

