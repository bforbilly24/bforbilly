'use client';
import { RiReactjsLine, RiArticleLine } from 'react-icons/ri';
import { SiTailwindcss } from 'react-icons/si';
import { LiaBookSolid } from 'react-icons/lia';
import { Suspense } from 'react';
import { useParams } from 'next/navigation';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/atoms/accordion';
import { AsideLink } from '@/components/atoms/aside-link';

import { FadeInStagger, FadeIn } from '@/components/atoms/fade-in';
import { PageLoading } from '@/components/atoms/page-loading';
import { TbBrandNextjs } from 'react-icons/tb';

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
	const params = useParams();
	if (params.slug) return children;

	return (
		<section className='grid h-full grid-cols-12 overflow-hidden'>
			<aside className='border-lines hidden overflow-y-auto border-r md:col-span-3 md:block lg:col-span-2'>
				<Accordion type='single' collapsible defaultValue='item-0'>
					{TAGS.map((item, i) => (
						<AccordionItem value={`item-${i}`} key={i}>
							<AccordionTrigger className='border-lines border-b px-5 py-2.5 text-left' data-umami-event='accordion-articles'>
								{item.title}
							</AccordionTrigger>
							<AccordionContent className='mt-5 space-y-1'>
								<FadeInStagger faster>
									{item.list.map((listItem, j) => (
										<FadeIn key={j}>
											<Suspense
												fallback={
													<div className='flex h-full flex-1 items-center justify-center'>
														<PageLoading />
													</div>
												}
											>
												<AsideLink href={listItem.href} startWith='/projects' title={listItem.title}>
													<listItem.icon className='h-4 w-4' />
													{listItem.title}
												</AsideLink>
											</Suspense>
										</FadeIn>
									))}
								</FadeInStagger>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</aside>
			<section className='relative col-span-12 h-[84dvh] overflow-y-auto md:col-span-9 md:h-auto lg:col-span-10'>{children}</section>
		</section>
	);
}

const TAGS = [
	{
		title: 'Article Tags',
		list: [
			{
				title: 'All article',
				href: '/articles',
				icon: RiArticleLine,
			},
			{
				title: 'Next.js',
				href: '/articles?tag=Next.js',
				icon: TbBrandNextjs,
			},
			{
				title: 'TailwindCSS',
				href: '/articles?tag=TailwindCSS',
				icon: SiTailwindcss,
			},
			{
				title: 'Non Technical',
				href: '/articles?tag=Non Technical',
				icon: LiaBookSolid,
			},
		],
	},
];
