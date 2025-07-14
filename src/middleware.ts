import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

// Temporarily disable middleware matching
export const config = {
  matcher: [],
};