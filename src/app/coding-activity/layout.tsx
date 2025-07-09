import { Suspense } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/atoms/accordion';
import { AsideLink } from '@/components/atoms/aside-link';
import { FadeInStagger, FadeIn } from '@/components/atoms/fade-in';
import { PAGE_URLS, OG_IMAGES } from '@/types/environment';
import { generateSEO } from '@/utils/seo';

import { allActivity } from './all-activities';
import { PageLoading } from '@/components/atoms/page-loading';

const title = 'coding-activity';
const description = 'Dive into my coding activity page to discover insights into my work hours, coding time, preferred text editors, and the current programming languages in focus this week. Get a transparent glimpse into my coding routine, offering a quick snapshot of the tools and dedication that drive my passion for development.';
const url = PAGE_URLS.CODING_ACTIVITY;
const image = OG_IMAGES.CODING_ACTIVITY;

export const metadata = generateSEO(title, description, image, url);

export default function CodingActivityLayout({ children }: { children: React.ReactNode }) {
	return (
		<section className='grid h-full grid-cols-12 overflow-hidden'>
			<aside className='border-lines hidden overflow-y-auto border-r md:col-span-3 md:block lg:col-span-2'>
				<Accordion type='single' collapsible defaultValue='item-0'>
					{data.map((item, i) => (
						<AccordionItem value={`item-${i}`} key={i}>
							<AccordionTrigger className='border-lines border-b px-5 py-2.5 text-left'>{item.title}</AccordionTrigger>
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
												<AsideLink href={`/coding-activity/${listItem.slug}`} startWith='/coding-activity' title={listItem.slug}>
													<listItem.icon />
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
			<section className='relative col-span-12 h-[84dvh] overflow-y-auto p-5 md:col-span-9 md:h-auto lg:col-span-10'>{children}</section>
		</section>
	);
}

const data = [
	{
		title: 'Coding Activity',
		list: [...allActivity],
	},
];
