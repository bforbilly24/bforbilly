'use client';
import { RiReactjsLine, RiArticleLine } from 'react-icons/ri';
import { SiTailwindcss } from 'react-icons/si';
import { LiaBookSolid } from 'react-icons/lia';
import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { TbBrandNextjs } from 'react-icons/tb';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/atoms/accordion';
import { AsideLink } from '@/components/atoms/aside-link';
import { FadeInStagger, FadeIn } from '@/components/atoms/fade-in';
import { PageLoading } from '@/components/atoms/page-loading';
import { getArticlesNavigation } from '@/constants/navigation';

export const ArticlesSidebar = () => {
	const params = useParams();
	
	// Jika sedang di halaman artikel detail, jangan tampilkan sidebar
	if (params.slug) return null;
	
	const TAGS = getArticlesNavigation();

	return (
		<aside className='border-lines hidden overflow-y-auto border-r md:col-span-3 md:block lg:col-span-2'>
			<Accordion type='single' collapsible defaultValue='item-0'>
				{TAGS.map((item, i) => (
					<AccordionItem value={`item-${i}`} key={i}>
						<AccordionTrigger className='border-lines border-b px-5 py-2.5 text-left' data-umami-event='accordion-articles'>
							{item.title}
						</AccordionTrigger>
						<AccordionContent className='mt-5 space-y-1'>
							<FadeInStagger faster>
								{item.list.map((listItem, j) => {
									const IconComponent = listItem.title === 'All article' ? RiArticleLine :
										listItem.title === 'Next.js' ? TbBrandNextjs :
										listItem.title === 'TailwindCSS' ? SiTailwindcss :
										listItem.title === 'Non Technical' ? LiaBookSolid : RiArticleLine;
									
									return (
										<FadeIn key={j}>
											<Suspense
												fallback={
													<div className='flex h-full flex-1 items-center justify-center'>
														<PageLoading />
													</div>
												}
											>
												<AsideLink href={listItem.href} startWith='/articles' title={listItem.title}>
													<IconComponent className='h-4 w-4' />
													{listItem.title}
												</AsideLink>
											</Suspense>
										</FadeIn>
									);
								})}
							</FadeInStagger>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</aside>
	);
};
