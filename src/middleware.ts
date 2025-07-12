import { clerkMiddleware } from '@clerk/nextjs/server';
import { updateSession } from '@/lib/supabase/middleware';

export default clerkMiddleware(async (auth, req) => {
	await auth();

	return await updateSession(req);
});

export const config = {
	matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', '/(api|trpc)(.*)', '/(.*)'],
};
