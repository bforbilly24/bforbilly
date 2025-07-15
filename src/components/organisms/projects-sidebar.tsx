'use client'

import { Suspense } from 'react';
import Link from 'next/link';
import { HiTerminal } from 'react-icons/hi';
import { TbBrain, TbDeviceDesktop, TbServer, TbDeviceMobile, TbCloud } from 'react-icons/tb';
import { TbBrandNextjs } from 'react-icons/tb';
import { RiReactjsLine, RiBootstrapFill } from 'react-icons/ri';
import { SiLaravel, SiCodeigniter, SiInertia, SiFastapi, SiElectron } from 'react-icons/si';
import { MdWeb, MdPhoneIphone } from 'react-icons/md';
import { FileText, FolderOpen } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/atoms/accordion';
import { AsideLink } from '@/components/atoms/aside-link';
import { FadeInStagger, FadeIn } from '@/components/atoms/fade-in';
import { PageLoading } from '@/components/atoms/page-loading';
import { Button } from '@/components/atoms/button';
import { getProjectsNavigation } from '@/constants/navigation';
import { ENDPOINTS } from '@/api/endpoints';

export const ProjectsSidebar = () => {
	const PROJECTS_NAVIGATION_DATA = getProjectsNavigation();
	
	// Function to handle auto download
	const handleDownload = (url: string, filename: string) => {
		try {
			// Create a temporary anchor element for download
			const link = document.createElement('a');
			link.href = url;
			link.download = filename;
			link.target = '_blank';
			link.rel = 'noopener noreferrer';
			
			// Add to DOM, click, and remove
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error('Download failed:', error);
			// Fallback to opening in new tab
			window.open(url, '_blank');
		}
	};
	
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
			{/* Download Section */}
			<div className="border-lines border-b p-4 space-y-3">
				<div className="text-center">
					<h3 className="text-sm font-semibold mb-1">Portfolio & CV</h3>
					<p className="text-xs text-muted-foreground mb-3">Download documents</p>
				</div>
				<div className="space-y-2">
					<Button 
						variant="default" 
						size="sm" 
						className="w-full flex items-center gap-2 text-xs"
						onClick={() => handleDownload(ENDPOINTS.ASSETS.CV_PDF, 'CV_Muhammad_Daniel_Krisna_Halim_Putra.pdf')}
					>
						<FileText className="h-3 w-3" />
						Download CV
					</Button>
					<Button 
						variant="outline" 
						size="sm" 
						className="w-full flex items-center gap-2 text-xs"
						onClick={() => handleDownload(ENDPOINTS.ASSETS.PORTFOLIO_PDF, 'Portfolio_Muhammad_Daniel_Krisna_Halim_Putra.pdf')}
					>
						<FolderOpen className="h-3 w-3" />
						Portfolio PDF
					</Button>
				</div>
			</div>

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
