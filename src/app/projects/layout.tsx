import { Suspense } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/atoms/accordion';
import { AsideLink } from '@/components/atoms/aside-link';
import { FadeInStagger, FadeIn } from '@/components/atoms/fade-in';
import { PageLoading } from '@/components/atoms/page-loading';
import { PAGE_URLS, OG_IMAGES } from '@/types/environment';
import { generateSEO } from '@/utils/seo';
import { PROJECTS_NAVIGATION_DATA } from '@/constants/projects-navigation';

const title = 'projects';
const description = 'Discover the interactive brilliance of my projects, peruse my polished portfolio, and delve into a sneak peek of my formidable technical prowess. Uncover a world where innovation meets functionality, showcased through a meticulously crafted Next.js application. Elevate your digital experience with a seamless blend of creativity and technical finesse.';
const url = PAGE_URLS.PROJECTS;
const image = OG_IMAGES.PROJECTS;

export const metadata = generateSEO(title, description, image, url);

export default function AboutLayout({ children }: { children: React.ReactNode }) {
	return (
		<section className='grid h-full grid-cols-12 overflow-hidden'>
			<aside className='border-lines hidden overflow-y-auto border-r md:col-span-3 md:block lg:col-span-2'>
				<Accordion type='single' collapsible defaultValue='item-0'>
					{PROJECTS_NAVIGATION_DATA.map((item, i) => (
						<AccordionItem value={`item-${i}`} key={i}>
							<AccordionTrigger className='border-lines border-b px-5 py-2.5 text-left' data-umami-event='accordion-project'>
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
													{listItem.icon}
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
			<section className='relative col-span-12 h-[84dvh] overflow-y-auto scroll-smooth md:col-span-9 md:h-auto lg:col-span-10'>
				<Suspense fallback={
					<div className='flex h-full flex-1 items-center justify-center'>
						<PageLoading />
					</div>
				}>
					{children}
				</Suspense>
			</section>
		</section>
	);
}
