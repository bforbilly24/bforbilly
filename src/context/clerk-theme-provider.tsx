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
	
	const getBaseUrl = () => {
		if (typeof window !== 'undefined') {
			return window.location.origin;
		}
		return process.env.NODE_ENV === 'production' ? 'https://bforbilly.tech' : 'http://localhost:3000';
	};

	const baseUrl = getBaseUrl();
	
	// Warning for test keys in production
	if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith('pk_test_')) {
		console.warn('⚠️ Using Clerk test keys in production! Please create a production instance.');
	}

	return (
		<ClerkProvider
			publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
			appearance={{
				baseTheme: resolvedTheme === 'dark' ? [dark] : undefined,
			}}
			signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || `${baseUrl}/sign-in`}
			signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || `${baseUrl}/sign-up`}
			signInFallbackRedirectUrl={`${baseUrl}/guest-book`}
			signUpFallbackRedirectUrl={`${baseUrl}/guest-book`}
		>
			{children}
		</ClerkProvider>
	);
}