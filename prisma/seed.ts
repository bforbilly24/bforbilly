import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const generateShortId = () => `msg_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`;

const getTimestamp = (daysAgo: number, hoursOffset: number = 0) => {
	const date = new Date();
	date.setDate(date.getDate() - daysAgo);
	date.setHours(date.getHours() - hoursOffset);
	return date;
};

async function main() {
	await prisma.guestBookEntry.deleteMany({});

	const comment1 = await prisma.guestBookEntry.create({
		data: {
			message: "Just discovered your portfolio through LinkedIn and WOW! 🤯 The smooth animations and clean code architecture really caught my attention. Next.js 14 with App Router implementation looks solid - loving the atomic design pattern you've used!",
			shortId: generateShortId(),
			authorId: 'user_sarah_dev',
			authorName: 'Sarah Chen',
			authorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format',
			createdAt: getTimestamp(5, 2),
		},
	});

	await prisma.guestBookEntry.create({
		data: {
			message: "@Sarah Chen Couldn't agree more! The TypeScript implementation is particularly clean. Also noticed the Prisma + Supabase combo - smart choice for scalability! 🚀",
			shortId: generateShortId(),
			authorId: 'user_alex_fullstack',
			authorName: 'Alex Rodriguez',
			authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&auto=format',
			parentId: comment1.id,
			repliedToUserId: 'user_sarah_dev',
			repliedToUserName: 'Sarah Chen',
			createdAt: getTimestamp(5, 1),
		},
	});

	await prisma.guestBookEntry.create({
		data: {
			message: "As a fellow developer, I'm impressed by the performance optimizations! The Core Web Vitals must be excellent with this setup. Mind sharing your approach to code splitting? �",
			shortId: generateShortId(),
			authorId: 'user_david_frontend',
			authorName: 'David Kim',
			authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format',
			parentId: comment1.id,
			repliedToUserId: 'user_sarah_dev',
			repliedToUserName: 'Sarah Chen',
			createdAt: getTimestamp(4, 22),
		},
	});

	const comment2 = await prisma.guestBookEntry.create({
		data: {
			message: "UI/UX Designer here! 🎨 This portfolio is a masterclass in user experience. The micro-interactions are delightful without being overwhelming, and the dark mode implementation is *chef's kiss* 👌 The guest book chat interface is such a creative touch!",
			shortId: generateShortId(),
			authorId: 'user_priya_designer',
			authorName: 'Priya Sharma',
			authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&auto=format',
			createdAt: getTimestamp(4, 5),
		},
	});

	await prisma.guestBookEntry.create({
		data: {
			message: '@Priya Sharma Yes! The attention to accessibility details is also noteworthy. Proper focus states, semantic HTML, and the contrast ratios are spot on. This sets a great example for inclusive design! ♿',
			shortId: generateShortId(),
			authorId: 'user_marcus_a11y',
			authorName: 'Marcus Johnson',
			authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format',
			parentId: comment2.id,
			repliedToUserId: 'user_priya_designer',
			repliedToUserName: 'Priya Sharma',
			createdAt: getTimestamp(3, 18),
		},
	});

	const comment3 = await prisma.guestBookEntry.create({
		data: {
			message: 'Stumbled upon this portfolio while looking for senior developers. The technical depth combined with excellent presentation skills is rare! The project showcase effectively demonstrates both technical expertise and business impact. Would love to connect about opportunities! 💼',
			shortId: generateShortId(),
			authorId: 'user_jennifer_recruiter',
			authorName: 'Jennifer Walsh',
			authorImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face&auto=format',
			createdAt: getTimestamp(3, 8),
		},
	});

	await prisma.guestBookEntry.create({
		data: {
			message: 'As a startup founder, I can confirm - this level of craft in personal projects indicates someone who cares about quality in all aspects of their work. The real-time features and clean architecture speak volumes! 🏆',
			shortId: generateShortId(),
			authorId: 'user_robert_founder',
			authorName: 'Robert Chang',
			authorImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face&auto=format',
			parentId: comment3.id,
			repliedToUserId: 'user_jennifer_recruiter',
			repliedToUserName: 'Jennifer Walsh',
			createdAt: getTimestamp(2, 15),
		},
	});

	await prisma.guestBookEntry.create({
		data: {
			message: "@Robert Chang Exactly! The fact that this isn't just a static showcase but a fully functional app with authentication, database integration, and real-time features shows true full-stack capabilities. Impressive! 💪",
			shortId: generateShortId(),
			authorId: 'user_lisa_cto',
			authorName: 'Lisa Thompson',
			authorImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face&auto=format',
			parentId: comment3.id,
			repliedToUserId: 'user_robert_founder',
			repliedToUserName: 'Robert Chang',
			createdAt: getTimestamp(2, 12),
		},
	});

	const comment4 = await prisma.guestBookEntry.create({
		data: {
			message: 'Greetings from Brazil! 🇧🇷 Found your portfolio through the Next.js showcase. The internationalization potential and mobile responsiveness are excellent. The coding activity tracker is particularly inspiring for us developers! Keep up the amazing work! ⭐',
			shortId: generateShortId(),
			authorId: 'user_carlos_brazil',
			authorName: 'Carlos Silva',
			authorImage: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face&auto=format',
			createdAt: getTimestamp(2, 6),
		},
	});

	await prisma.guestBookEntry.create({
		data: {
			message: '@Carlos Silva Hello from Germany! 🇩🇪 Totally agree about the international appeal. The clean design language transcends cultural boundaries. The WakaTime integration for coding stats is brilliant - shows dedication to continuous learning! 📊',
			shortId: generateShortId(),
			authorId: 'user_elena_germany',
			authorName: 'Elena Mueller',
			authorImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&h=150&fit=crop&crop=face&auto=format',
			parentId: comment4.id,
			repliedToUserId: 'user_carlos_brazil',
			repliedToUserName: 'Carlos Silva',
			createdAt: getTimestamp(1, 20),
		},
	});

	const comment5 = await prisma.guestBookEntry.create({
		data: {
			message: 'Computer Science student here! 🎓 This portfolio is like a textbook example of modern web development best practices. The clean git history, proper documentation, and progressive enhancement approach are goals! Thank you for the inspiration! 📚',
			shortId: generateShortId(),
			authorId: 'user_maya_student',
			authorName: 'Maya Patel',
			authorImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face&auto=format',
			createdAt: getTimestamp(1, 14),
		},
	});

	await prisma.guestBookEntry.create({
		data: {
			message: "@Maya Patel Same! Final year CS major and this shows me what's possible with dedication. The deployment strategy with Vercel and the environment management are particularly educational. Bookmarked for reference! �",
			shortId: generateShortId(),
			authorId: 'user_ahmed_student',
			authorName: 'Ahmed Hassan',
			authorImage: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150&h=150&fit=crop&crop=face&auto=format',
			parentId: comment5.id,
			repliedToUserId: 'user_maya_student',
			repliedToUserName: 'Maya Patel',
			createdAt: getTimestamp(1, 10),
		},
	});

	const comment6 = await prisma.guestBookEntry.create({
		data: {
			message: 'Wow, thank you all for the incredibly kind words! 🙏 Building this portfolio has been a journey of learning and experimentation. Special thanks to the open-source community that made tools like Next.js, Prisma, and Tailwind possible. Your feedback motivates me to keep pushing boundaries! ☕🚀',
			shortId: generateShortId(),
			authorId: 'user_belly_demo',
			authorName: 'Belly',
			authorImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face&auto=format',
			createdAt: getTimestamp(1, 5),
		},
	});

	await prisma.guestBookEntry.create({
		data: {
			message: "@Belly Your humility makes this even more impressive! Can't wait to see what you build next. The tech community needs more people like you who share knowledge and inspire others! 🌟",
			shortId: generateShortId(),
			authorId: 'user_sophie_mentor',
			authorName: 'Sophie Williams',
			authorImage: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face&auto=format',
			parentId: comment6.id,
			repliedToUserId: 'user_belly_demo',
			repliedToUserName: 'Belly',
			createdAt: getTimestamp(1, 2),
		},
	});

	const comment7 = await prisma.guestBookEntry.create({
		data: {
			message: 'Senior architect here! 🏗️ The middleware implementation with Clerk and Supabase integration is particularly well thought out. The separation of concerns between client/server components follows React 18 patterns perfectly. This could be a case study in modern full-stack architecture!',
			shortId: generateShortId(),
			authorId: 'user_william_architect',
			authorName: 'William Foster',
			authorImage: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face&auto=format',
			createdAt: getTimestamp(0, 8),
		},
	});

	await prisma.guestBookEntry.create({
		data: {
			message: '@William Foster The error boundary implementations and loading states are also production-ready! Shows understanding of edge cases that many developers overlook. The atomic design system makes it maintainable too 🛠️',
			shortId: generateShortId(),
			authorId: 'user_diana_lead',
			authorName: 'Diana Park',
			authorImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face&auto=format',
			parentId: comment7.id,
			repliedToUserId: 'user_william_architect',
			repliedToUserName: 'William Foster',
			createdAt: getTimestamp(0, 4),
		},
	});

	console.log('✅ Seeded guest book with realistic human-like conversations!');
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
