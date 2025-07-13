'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import { ReactNode } from 'react';

interface ClerkThemeProviderProps {
	children: ReactNode;
}

export function ClerkThemeProvider({ children }: ClerkThemeProviderProps) {
	const { resolvedTheme } = useTheme();
	
	// Get base URL for absolute URLs
	const getBaseUrl = () => {
		if (typeof window !== 'undefined') {
			return window.location.origin;
		}
		return process.env.NODE_ENV === 'production' 
			? 'https://bforbilly.tech' 
			: 'http://localhost:3000';
	};
	
	const baseUrl = getBaseUrl();
	
	// Debug: log environment variables
	if (typeof window !== 'undefined') {
		console.log('🔐 Clerk Debug Info:', {
			publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
			hasKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
			nodeEnv: process.env.NODE_ENV,
			origin: window.location.origin,
			baseUrl: baseUrl
		});
	}
	
	// Warn about test keys in production
	if (typeof window !== 'undefined' && 
		process.env.NODE_ENV === 'production' && 
		process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith('pk_test_')) {
		console.warn('⚠️ Using Clerk test keys in production! Please create a production instance.');
	}
	
	return (
		<ClerkProvider
			publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
			appearance={{
				baseTheme: resolvedTheme === 'dark' ? [dark] : undefined,
			}}
			signInUrl={`${baseUrl}/sign-in`}
			signUpUrl={`${baseUrl}/sign-up`}
			signInFallbackRedirectUrl={`${baseUrl}/guest-book`}
			signUpFallbackRedirectUrl={`${baseUrl}/guest-book`}
		>
			{children}
		</ClerkProvider>
	);
}
