import { clerkMiddleware } from '@clerk/nextjs/server';
import { updateSession } from '@/lib/supabase/middleware';

export default clerkMiddleware(async (auth, req) => {
	try {
		await auth();

		if (!req.nextUrl.pathname.startsWith('/api/auth') && !req.nextUrl.pathname.includes('sign-in') && !req.nextUrl.pathname.includes('sign-up')) {
			return await updateSession(req);
		}

		return;
	} catch (error) {
		console.error('Middleware error:', error);

		return;
	}
});

export const config = {
	matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', '/(api|trpc)(.*)', '/(.*)'],
};
