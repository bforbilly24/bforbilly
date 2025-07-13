import { clerkMiddleware } from '@clerk/nextjs/server';

// Production-ready middleware with custom domain support
export default clerkMiddleware();

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};