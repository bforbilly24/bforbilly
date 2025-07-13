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
	
	return (
		<ClerkProvider
			appearance={{
				baseTheme: resolvedTheme === 'dark' ? [dark] : undefined,
			}}
			signInFallbackRedirectUrl="/guest-book"
			signUpFallbackRedirectUrl="/guest-book"
		>
			{children}
		</ClerkProvider>
	);
}
