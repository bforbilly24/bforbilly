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
	
	// Debug: log environment variables
	if (typeof window !== 'undefined') {
		console.log('🔐 Clerk Debug Info:', {
			publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
			hasKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
			nodeEnv: process.env.NODE_ENV,
			origin: window.location.origin
		});
	}
	
	return (
		<ClerkProvider
			publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
			appearance={{
				baseTheme: resolvedTheme === 'dark' ? [dark] : undefined,
			}}
			signInFallbackRedirectUrl="/guest-book"
			signUpFallbackRedirectUrl="/guest-book"
			domain="together-ram-61.clerk.accounts.dev"
			isSatellite={typeof window !== 'undefined' && window.location.hostname === 'bforbilly.tech'}
		>
			{children}
		</ClerkProvider>
	);
}
