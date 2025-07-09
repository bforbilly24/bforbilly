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
				pathname: '/bforbilly/**',
			},
		],
	},
	experimental: {
		webpackBuildWorker: true,
		serverActions: {
			enabled: true,
		},
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
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
