import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to generate unique shortId
const generateShortId = () => `msg_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`;

async function main() {
	await prisma.guestBookEntry.deleteMany({});

	// Chat 1: Main comment with 2 replies
	const comment1 = await prisma.guestBookEntry.create({
		data: {
			message: 'Portfolio yang sangat keren! Animasinya smooth banget dan designnya modern. Tech stacknya juga impressive dengan Next.js dan Prisma. 🔥',
			shortId: generateShortId(),
			authorId: 'user_sari123',
			authorName: 'Sari Wulandari',
			authorImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
		},
	});

	// Reply 1 to comment 1 (from another developer)
	await prisma.guestBookEntry.create({
		data: {
			message: 'Setuju banget! Tech stack pilihan yang solid. Clean code structure nya juga kelihatan maintainable. Inspiratif! 💪',
			shortId: generateShortId(),
			authorId: 'user_andi789',
			authorName: 'Andi Setiawan',
			authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
			parentId: comment1.id,
			repliedToUserId: 'user_sari123',
			repliedToUserName: 'Sari Wulandari',
		},
	});

	// Reply 2 to comment 1 (from another user)
	await prisma.guestBookEntry.create({
		data: {
			message: 'Bisa jadi referensi untuk portfolio saya juga nih! Dark mode supportnya juga bagus 👍',
			shortId: generateShortId(),
			authorId: 'user_dimas456',
			authorName: 'Dimas Pratama',
			authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
			parentId: comment1.id,
			repliedToUserId: 'user_sari123',
			repliedToUserName: 'Sari Wulandari',
		},
	});

	// Chat 2: Main comment with 1 reply
	const comment2 = await prisma.guestBookEntry.create({
		data: {
			message: 'Implementasi Clerk auth-nya seamless banget. Atomic design structure juga rapi, maintainable code. Guest book fiturnya unique dengan real-time chat style! 💡',
			shortId: generateShortId(),
			authorId: 'user_fitri789',
			authorName: 'Fitri Handayani',
			authorImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
		},
	});

	// Reply to comment 2 (from a UI/UX enthusiast)
	await prisma.guestBookEntry.create({
		data: {
			message: 'UI/UX designer here! Love the attention to detail dan micro-interactions nya. Chat-style guest book concept nya fresh banget! 🎨',
			shortId: generateShortId(),
			authorId: 'user_linda404',
			authorName: 'Linda Permata',
			authorImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
			parentId: comment2.id,
			repliedToUserId: 'user_fitri789',
			repliedToUserName: 'Fitri Handayani',
		},
	});

	// Chat 3: Main comment with 2 replies
	const comment3 = await prisma.guestBookEntry.create({
		data: {
			message: 'Website portfolio terbaik yang pernah saya lihat! UI/UX nya user-friendly dan responsivenya perfect di mobile. Loading animations juga halus banget. Semoga bisa kolaborasi suatu saat! ✨',
			shortId: generateShortId(),
			authorId: 'user_rizki101',
			authorName: 'Rizki Maulana',
			authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
		},
	});

	// Reply 1 to comment 3 (from a fellow developer)
	await prisma.guestBookEntry.create({
		data: {
			message: 'Performance optimization nya juga top! Page load speed dan Core Web Vitals pasti bagus nih. Good job! ⚡',
			shortId: generateShortId(),
			authorId: 'user_budi505',
			authorName: 'Budi Santoso',
			authorImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&crop=face',
			parentId: comment3.id,
			repliedToUserId: 'user_rizki101',
			repliedToUserName: 'Rizki Maulana',
		},
	});

	// Reply 2 to comment 3 (from another user)
	await prisma.guestBookEntry.create({
		data: {
			message: 'Betul banget! Mobile experience-nya top notch. Jarang nemuin portfolio yang se-polished ini 👏',
			shortId: generateShortId(),
			authorId: 'user_maya202',
			authorName: 'Maya Sinta',
			authorImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
			parentId: comment3.id,
			repliedToUserId: 'user_rizki101',
			repliedToUserName: 'Rizki Maulana',
		},
	});

	// Chat 4: Comment from Belly (regular user, not verified in seed)
	const comment4 = await prisma.guestBookEntry.create({
		data: {
			message: 'Thanks everyone for the feedback! 🙏 Really appreciate all the kind words. This portfolio is built with love using Next.js 14, Prisma, and lots of coffee ☕',
			shortId: generateShortId(),
			authorId: 'user_belly_fake', // Fake user ID for seed data (not the real verified user)
			authorName: 'Belly',
			authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
		},
	});

	// Reply to Belly's comment
	await prisma.guestBookEntry.create({
		data: {
			message: '@Belly Amazing work bro! Keep inspiring! 🚀',
			shortId: generateShortId(),
			authorId: 'user_fanboy999',
			authorName: 'Ahmad Fauzi',
			authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
			parentId: comment4.id,
			repliedToUserId: 'user_belly_fake', // Updated to match the fake user ID
			repliedToUserName: 'Belly',
		},
	});
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
