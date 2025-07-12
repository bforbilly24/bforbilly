'use client'

import { Suspense } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/atoms/accordion';
import { AsideLink } from '@/components/atoms/aside-link';
import { FadeInStagger, FadeIn } from '@/components/atoms/fade-in';
import { PageLoading } from '@/components/atoms/page-loading';
import { getCodingActivityNavigation } from '@/constants/navigation';

// Import all activities from the coding-activity module
import { allActivity } from '@/app/coding-activity/all-activities';

export const CodingActivitySidebar = () => {
	const data = getCodingActivityNavigation();
	
	return (
		<aside className='border-lines hidden overflow-y-auto border-r md:col-span-3 md:block lg:col-span-2'>
			<Accordion type='single' collapsible defaultValue='item-0'>
				{data.map((item, i) => (
					<AccordionItem value={`item-${i}`} key={i}>
						<AccordionTrigger className='border-lines border-b px-5 py-2.5 text-left'>{item.title}</AccordionTrigger>
						<AccordionContent className='mt-5 space-y-1'>
							<FadeInStagger faster>
								{item.list.map((listItem, j) => {
									const activityItem = allActivity.find(activity => activity.slug === listItem.slug);
									return (
										<FadeIn key={j}>
											<Suspense
												fallback={
													<div className='flex h-full flex-1 items-center justify-center'>
														<PageLoading />
													</div>
												}
											>
												<AsideLink href={listItem.href} startWith='/coding-activity' title={listItem.title}>
													{activityItem && <activityItem.icon />}
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
