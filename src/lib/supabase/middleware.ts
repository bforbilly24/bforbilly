import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const updateSession = async (request: NextRequest) => {
	try {
		if (!supabaseUrl || !supabaseKey) {
			console.warn('Supabase not configured, skipping session update');
			return NextResponse.next({
				request: {
					headers: request.headers,
				},
			});
		}

		let response = NextResponse.next({
			request: {
				headers: request.headers,
			},
		});

		const supabase = createServerClient(supabaseUrl, supabaseKey, {
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
					try {
						cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
						response = NextResponse.next({
							request: {
								headers: request.headers,
							},
						});
						cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
					} catch (error) {
						console.error('Error setting cookies:', error);
					}
				},
			},
		});

		// This will refresh session if expired - required for Server Components
		// Wrap in try-catch to prevent blocking middleware
		try {
			await supabase.auth.getUser();
		} catch (error) {
			console.error('Error getting Supabase user:', error);
			// Continue anyway, don't block the request
		}

		return response;
	} catch (error) {
		console.error('Error in updateSession middleware:', error);
		// Return normal response to prevent blocking
		return NextResponse.next({
			request: {
				headers: request.headers,
			},
		});
	}
};
