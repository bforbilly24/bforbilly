'use client'

import { Suspense } from 'react';
import { HiTerminal } from 'react-icons/hi';
import { TbBrain, TbDeviceDesktop, TbServer, TbDeviceMobile, TbCloud } from 'react-icons/tb';
import { TbBrandNextjs } from 'react-icons/tb';
import { RiReactjsLine, RiBootstrapFill } from 'react-icons/ri';
import { SiLaravel, SiCodeigniter, SiInertia, SiFastapi, SiElectron } from 'react-icons/si';
import { MdWeb, MdPhoneIphone } from 'react-icons/md';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/atoms/accordion';
import { AsideLink } from '@/components/atoms/aside-link';
import { FadeInStagger, FadeIn } from '@/components/atoms/fade-in';
import { PageLoading } from '@/components/atoms/page-loading';
import { getProjectsNavigation } from '@/constants/navigation';

export const ProjectsSidebar = () => {
	const PROJECTS_NAVIGATION_DATA = getProjectsNavigation();
	
	// Icon mapping function
	const getIcon = (iconName: string, title: string) => {
		const iconMap: { [key: string]: React.ComponentType<any> } = {
			'Terminal': HiTerminal,
			'Activity': TbBrain,
			'Monitor': TbDeviceDesktop,
			'Globe': TbServer,
			'Smartphone': TbDeviceMobile,
		};
		
		// Special cases for specific titles
		if (title === 'Next.js') return TbBrandNextjs;
		if (title === 'React') return RiReactjsLine;
		if (title === 'Laravel') return SiLaravel;
		if (title === 'CodeIgniter') return SiCodeigniter;
		if (title === 'Inertia.js') return SiInertia;
		if (title === 'FastAPI') return SiFastapi;
		if (title === 'Bootstrap') return RiBootstrapFill;
		if (title === 'Electron') return SiElectron;
		if (title === 'Web') return MdWeb;
		if (title === 'Mobile') return MdPhoneIphone;
		if (title === 'Desktop') return TbDeviceDesktop;
		
		return iconMap[iconName] || HiTerminal;
	};
	
	return (
		<aside className='border-lines hidden overflow-y-auto border-r md:col-span-3 md:block lg:col-span-2'>
			<Accordion type='single' collapsible defaultValue='item-0'>
				{PROJECTS_NAVIGATION_DATA.map((item, i) => (
					<AccordionItem value={`item-${i}`} key={i}>
						<AccordionTrigger className='border-lines border-b px-5 py-2.5 text-left' data-umami-event='accordion-project'>
							{item.title}
						</AccordionTrigger>
						<AccordionContent className='mt-5 space-y-1'>
							<FadeInStagger faster>
								{item.list.map((listItem, j) => {
									const IconComponent = getIcon(listItem.icon, listItem.title);
									return (
										<FadeIn key={j}>
											<Suspense
												fallback={
													<div className='flex h-full flex-1 items-center justify-center'>
														<PageLoading />
													</div>
												}
											>
												<AsideLink href={listItem.href} startWith='/projects' title={listItem.title}>
													<IconComponent className='size-4' />
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
