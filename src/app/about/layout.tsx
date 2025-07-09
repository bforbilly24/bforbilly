import { Suspense } from 'react';
import { FaRegEnvelope } from 'react-icons/fa';
import { BsWhatsapp, BsInstagram, BsLinkedin } from 'react-icons/bs';
import { allAbouts } from 'contentlayer/generated';
import { SiTypescript } from 'react-icons/si';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/atoms/accordion';
import { AsideLink } from '@/components/atoms/aside-link';
import { FadeInStagger, FadeIn } from '@/components/atoms/fade-in';
import { PageLoading } from '@/components/atoms/page-loading';

export default function AboutLayout({ children }: { children: React.ReactNode }) {
	return (
		<section className='grid h-full grid-cols-12 overflow-hidden'>
			<aside className='border-lines hidden overflow-y-auto border-r md:col-span-3 md:block lg:col-span-2'>
				<Accordion type='single' collapsible defaultValue='about'>
					<AccordionItem value={'about'} defaultChecked>
						<AccordionTrigger className='border-lines border-b px-5 py-2.5 text-left' data-umami-event='accordion-about'>
							About Me
						</AccordionTrigger>
						<AccordionContent className='mt-5 space-y-1'>
							<FadeInStagger faster>
								{allAbouts.map(({ title }) => (
									<FadeIn key={title}>
										<Suspense
											fallback={
												<div className='flex h-full flex-1 items-center justify-center'>
													<PageLoading />
												</div>
											}
										>
											<AsideLink href={title} key={title} startWith='/about' title={title}>
												<SiTypescript className='size-4 shrink-0' />
												{title}
											</AsideLink>
										</Suspense>
									</FadeIn>
								))}
							</FadeInStagger>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
				<Accordion type='single' collapsible>
					{data.map((item, i) => (
						<AccordionItem value={`item-${i}`} key={i}>
							<AccordionTrigger className='border-lines border-b px-5 py-2.5 text-left' data-umami-event='accordion-guest-book'>
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
												<AsideLink href={listItem.href} startWith='/about'>
													<span className='shrink-0'>{listItem.icon}</span>
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

const data = [
	{
		title: 'Contacts',
		list: [
			{
				title: 'Email',
				href: 'mailto:halimputra0701@gmail.com',
				icon: <FaRegEnvelope className='size-4' />,
			},
			{
				title: 'WhatsApp',
				href: 'https://wa.me/+6285156644103',
				icon: <BsWhatsapp className='size-4' />,
			},
			{
				title: 'LinkedIn',
				href: 'https://www.linkedin.com/in/halimp',
				icon: <BsLinkedin className='size-4' />,
			},
			{
				title: 'Instagram',
				href: 'https://www.instagram.com/bforbilly24',
				icon: <BsInstagram className='size-4' />,
			},
		],
	},
];
