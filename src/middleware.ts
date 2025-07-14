import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip OAuth callbacks and static files completely
    '/((?!.*\\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$|_next|v1/oauth_callback).*)',
    // API routes (but skip OAuth)
    '/(api|trpc)(?!/.*oauth).*',
  ],
};