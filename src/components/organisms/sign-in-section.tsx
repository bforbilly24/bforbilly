'use client'

import { SignIn } from '@clerk/nextjs'

export function SignInSection() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <SignIn 
          fallbackRedirectUrl="/guest-book"
          forceRedirectUrl="/guest-book"
        />
      </div>
    </div>
  )
}
