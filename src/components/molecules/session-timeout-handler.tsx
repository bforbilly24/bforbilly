'use client'

import { useAuth } from '@clerk/nextjs'
import { useEffect, useRef } from 'react'

const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes in milliseconds

export function SessionTimeoutHandler() {
  const { signOut, isSignedIn } = useAuth()
  const timeoutRef = useRef<NodeJS.Timeout>()
  const lastActivityRef = useRef<number>(Date.now())

  useEffect(() => {
    if (!isSignedIn) return

    const handleActivity = () => {
      lastActivityRef.current = Date.now()
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        signOut()
      }, SESSION_TIMEOUT)
    }

    // Initial setup
    handleActivity()

    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [isSignedIn, signOut])

  return null
}
