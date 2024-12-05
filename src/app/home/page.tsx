'use client'
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from 'js-cookie'

export default function Home() {
  const router = useRouter()


  const handleSignUpClick = () => {
    localStorage.removeItem('mode')
    Cookies.remove('mode')

    router.push("/sign-up")
  }

  const handleSignInClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    localStorage.removeItem('mode')
    Cookies.remove('mode')
    router.push("/sign-in")
  }

  const handleDemoClick = () => {
    const demoProfileId = process.env.NEXT_PUBLIC_DEMO_PROFILE_ID as string
    const demoInterviewId = process.env.NEXT_PUBLIC_DEMO_INTERVIEW_ID as string

    localStorage.setItem('mode', 'demo')
    localStorage.setItem('profileId', demoProfileId)
    localStorage.setItem('interviewId', demoInterviewId)

    Cookies.set('mode', 'demo')
    Cookies.set('profileId', demoProfileId)
    Cookies.set('interviewId', demoInterviewId)

    router.push("/profile-setup");
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12 bg-gradient-to-b from-background to-muted">
      <div className="max-w-2xl text-center space-y-6 mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Ace Your Next Interview
        </h1>
        <p className="text-xl text-muted-foreground">
          Practice with AI-powered mock interviews tailored to your specific role and company.
          Get instant feedback and improve your chances of landing your dream job.
        </p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Button
          size="lg"
          className="text-lg h-12 bg-[#10B981] hover:bg-[#059669]"
          onClick={handleSignUpClick}
        >
          Get Started Free
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="text-lg h-12 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={handleDemoClick}
        >
          See an Example
        </Button>

        <div className="text-center mt-4">
          <span className="text-sm">
            Already have an account?{' '}
            <Link
              href="/#"
              onClick={handleSignInClick}
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
