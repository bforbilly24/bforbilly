import './globals.css';
import Script from 'next/script';
import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ClerkThemeProvider } from '@/components/atoms/clerk-theme-provider';
import { ThemeWrapper } from '@/components/atoms/theme-wrapper';
import { Navbar } from '@/components/organisms/navbar';
import { Footer } from '@/components/organisms/footer';
import { ResponsiveIndicator } from '@/components/atoms/responsive-indicator';
import { SmoothCursor } from '@/components/molecules/smooth-cursor';
import { CommandMenu } from '@/components/molecules/command-menu';
import { SessionTimeoutHandler } from '@/components/molecules/session-timeout-handler';
import { BProgressProvider } from '@/context/progress-bar-provider';
import { SocketProvider } from '@/context/socket-provider';

import { ENV } from '@/types/environment';
import { ConsoleLogger } from '@/components/miscellaneous/console-logger';

export const metadata: Metadata = {
	metadataBase: new URL(ENV.NEXT_PUBLIC_WEBSITE_URL),
	title: {
		default: 'Halim',
		template: '%s | Halim',
	},
	description:
		"Get to know me, Halim Putra, through this website! I'm a passionate frontend developer and electrical engineering student, and I've poured my skills and creativity into building this site with Next.js and Tailwind CSS. Explore my interactive projects, clean portfolio, and a glimpse into my technical expertise. If you're seeking a talented developer for your next project or simply looking for inspiration, feel free to get in touch!",
	icons: {
		icon: [
			{ url: '/favicon/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
			{ url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
			{ url: '/favicon/favicon.svg', type: 'image/svg+xml' },
		],
		apple: [
			{ url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
		],
		shortcut: '/favicon/favicon.ico',
	},
	manifest: '/favicon/site.webmanifest',
	openGraph: {
		title: 'Halim',
		description:
			"Get to know me, Halim Putra, through this website! I'm a passionate frontend developer and electrical engineering student, and I've poured my skills and creativity into building this site with Next.js and Tailwind CSS. Explore my interactive projects, clean portfolio, and a glimpse into my technical expertise. If you're seeking a talented developer for your next project or simply looking for inspiration, feel free to get in touch!",
		url: ENV.NEXT_PUBLIC_WEBSITE_URL,
		siteName: 'Halim',
		locale: 'en_US',
		type: 'website',
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	twitter: {
		title: 'Halim',
		card: 'summary_large_image',
	},
	verification: {
		google: ENV.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${GeistSans.variable} ${GeistMono.variable} font-mono`} suppressHydrationWarning>
				<ThemeWrapper attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
					<ClerkThemeProvider>
						<SocketProvider>
							<BProgressProvider>
							<main>
								<ConsoleLogger />
								<Navbar />
								{children}
								<Footer />
							</main>
							<SessionTimeoutHandler />
						</BProgressProvider>
					</SocketProvider>
				</ClerkThemeProvider>
				</ThemeWrapper>
				<SmoothCursor />
				<CommandMenu />
				{ENV.NODE_ENV === 'production' && (
					<>
						<Script async src='https://us.umami.is/script.js' data-website-id='5a0b1ee0-4b3e-479b-9027-078240848194' />
						<SpeedInsights />
					</>
				)}
				<ResponsiveIndicator />
			</body>
		</html>
	);
}
