// import { GuestBookRow } from '@/components/molecules/guest-book-card'
// import { db } from '@/lib/prisma'
// import { auth } from '@/lib/auth'

import { Spotlight } from '@/components/molecules/spotlight';

export default async function GuestBooks() {
	//   const session = await auth()
	//   const posts = await db.post.findMany({
	//     include: {
	//       user: true
	//     },
	//     orderBy: {
	//       createdAt: 'desc'
	//     }
	//   })

	return (
		<article className='flex h-full items-center justify-center divide-y lg:divide-y-0'>
			{/* {posts.map((data, i) => (
        <GuestBookRow session={session} data={data} key={i} />
      ))} */}
			<div className='relative flex h-full w-full overflow-hidden rounded-md antialiased md:items-center md:justify-center'>
				<Spotlight className='-top-40 left-0 md:-top-20 md:left-60' fill='white' />
				<div className='relative z-10 mx-auto w-full max-w-7xl p-4 pt-20 md:pt-0'>
					<h1 className='bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-xl font-bold text-transparent sm:text-2xl lg:text-4xl xl:text-5xl 2xl:text-6xl'>
						Guest Book
						<br /> is Coming Soon.
					</h1>
					<p className='mx-auto mt-4 max-w-lg text-center text-sm font-normal text-neutral-300 sm:text-xs lg:text-base xl:text-lg 2xl:text-xl'>I used the Spotlight effect is a great way to draw attention to a specific part of the page. Here, we are drawing the attention towards the text section of the page.</p>
				</div>
			</div>
		</article>
	);
}
