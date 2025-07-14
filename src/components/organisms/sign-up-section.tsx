'use client'

import { SignUp } from '@clerk/nextjs'

export function SignUpSection() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <SignUp 
          fallbackRedirectUrl="/guest-book"
          forceRedirectUrl="/guest-book"
        />
      </div>
    </div>
  )
}
