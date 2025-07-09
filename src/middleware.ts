import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware(async (auth, req) => {
  // Add debug logging to see if middleware is called
  console.log('🔧 Middleware called for:', req.nextUrl.pathname);
  
  // Ensure Clerk processes this request by calling auth() to initialize the context
  // This helps Clerk detect that clerkMiddleware is being used
  await auth();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Explicitly include all routes to ensure middleware runs
    '/(.*)'
  ],
};
