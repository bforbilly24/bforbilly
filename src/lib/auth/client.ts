/**
 * Client-side Admin Check Utility
 * Safe to use in Client Components
 */

import { type UserResource } from '@clerk/types'
import { ADMIN_USERNAME, VERIFIED_USER_ID, ADMIN_USER_IDS } from '@/types/environment'

export function isUserAdminClient(user: UserResource | null | undefined): boolean {
  if (!user) return false

  // Method 1: Check if user is belly (the admin username)
  if (user.fullName === ADMIN_USERNAME || 
      user.firstName === ADMIN_USERNAME ||
      user.username === ADMIN_USERNAME) {
    return true
  }

  // Method 2: Check by verified user ID from environment
  if (user.id === VERIFIED_USER_ID) {
    return true
  }

  // Method 3: Check against admin user IDs (supports multiple admins)
  const adminIds = ADMIN_USER_IDS || []
  if (adminIds.includes(user.id)) {
    return true
  }

  // Method 4: Check Clerk public metadata for role (if available)
  if (user.publicMetadata?.role === 'admin') {
    return true
  }
  
  return false
}
