import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define routes that require authentication
const isProtectedRoute = createRouteMatcher([
	'/guest-book(.*)',
]);

// Define public routes (explicitly public)
const isPublicRoute = createRouteMatcher([
	'/',
	'/about(.*)',
	'/articles(.*)',
	'/projects(.*)',
	'/coding-activity(.*)',
	'/api/og(.*)',
	'/api/projects(.*)',
	'/api/languages(.*)',
	'/sign-in(.*)',
	'/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
	try {
		// Skip middleware for static files and API routes
		if (
			req.nextUrl.pathname.startsWith('/_next') ||
			req.nextUrl.pathname.startsWith('/favicon') ||
			req.nextUrl.pathname.startsWith('/api/auth') ||
			req.nextUrl.pathname.includes('.') // Static files
		) {
			return NextResponse.next();
		}

		// Protect authenticated routes
		if (isProtectedRoute(req)) {
			await auth.protect();
		}

		return NextResponse.next();
	} catch (error) {
		console.error('Clerk middleware error:', error);
		
		// For protected routes, redirect to sign-in
		if (isProtectedRoute(req)) {
			const signInUrl = new URL('/sign-in', req.url);
			signInUrl.searchParams.set('redirect_url', req.url);
			return NextResponse.redirect(signInUrl);
		}
		
		// For other routes, continue normally
		return NextResponse.next();
	}
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
};
