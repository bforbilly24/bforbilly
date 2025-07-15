const { withContentlayer } = require('next-contentlayer');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
				port: '',
				pathname: '/u/**',
			},
			{
				protocol: 'https',
				hostname: 'wakatime.com',
				port: '',
				pathname: '/photo/**',
			},
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				port: '',
				pathname: '/bforbilly24/**',
			},
		],
	},
	experimental: {
		webpackBuildWorker: true,
		serverActions: {
			enabled: true,
		},
	},
	// Prevent API routes from being analyzed during build
	webpack: (config, { isServer, buildId }) => {
		if (isServer) {
			config.externals.push('@prisma/client')
		}
		
		// Suppress webpack cache warning for contentlayer
		const originalLogger = config.infrastructureLogging?.level || 'info';
		config.infrastructureLogging = {
			...config.infrastructureLogging,
			level: 'error',
		};
		
		return config
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	onDemandEntries: {
		maxInactiveAge: 25 * 1000,
		pagesBufferLength: 2,
	},
	output: 'standalone',
	redirects() {
		return [
			{
				source: '/about',
				destination: '/about/personal.ts',
				permanent: true,
			},
		];
	},
};

module.exports = withContentlayer(nextConfig);
