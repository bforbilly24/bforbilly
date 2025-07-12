'use client'

import { allArticles } from 'contentlayer/generated';
import { Suspense } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/atoms/accordion';
import { AsideLink } from '@/components/atoms/aside-link';
import { FadeInStagger, FadeIn } from '@/components/atoms/fade-in';
import { slugify } from '@/utils/slug';
import { PageLoading } from '@/components/atoms/page-loading';

interface ArticleDetailSidebarProps {
	slug: string;
}

export const ArticleDetailSidebar = ({ slug }: ArticleDetailSidebarProps) => {
	const content = allArticles.find(article => article.slug.toLowerCase() === slug);
	
	if (!content) return null;

	return (
		<aside className='border-lines hidden overflow-y-auto border-r md:col-span-3 md:block lg:col-span-2'>
			<Accordion type='single' collapsible defaultValue='table-of-contents'>
				<AccordionItem value='table-of-contents'>
					<AccordionTrigger className='border-lines border-b px-5 py-2.5 text-left'>Table of content</AccordionTrigger>
					<AccordionContent className='mt-5 space-y-1'>
						<FadeInStagger faster>
							{content.headings.map((heading: { text: string; level: string }, i: number) => (
								<FadeIn key={i}>
									<Suspense
										fallback={
											<div className='flex h-full flex-1 items-center justify-center'>
												<PageLoading />
											</div>
										}
									>
										<AsideLink 
											href={'#' + slugify(heading.text)} 
											startWith={`/articles/${slug}`} 
											title={heading.text} 
											data-level={heading.level} 
											className='text-xs data-[level=four]:pl-10 data-[level=three]:pl-8'
										>
											{heading.text}
										</AsideLink>
									</Suspense>
								</FadeIn>
							))}
						</FadeInStagger>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</aside>
	);
};
