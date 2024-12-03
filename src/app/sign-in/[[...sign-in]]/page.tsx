import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex min-h-screen justify-center">
      <SignIn signUpUrl="/sign-up" />
    </div>
  )
}