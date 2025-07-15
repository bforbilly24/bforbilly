'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FileText, FolderOpen } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/atoms/accordion';
import { SheetTrigger, SheetContent, Sheet, SheetTitle, SheetDescription, SheetClose } from '@/components/atoms/sheet';
import { ScrollArea } from '@/components/atoms/scroll-area';
import { getMainNavigation, NavigationItem, NavigationSection } from '@/constants/navigation';
import { Button } from '@/components/atoms/button';
import { ENDPOINTS } from '@/api/endpoints';
import { Divide as Hamburger } from 'hamburger-react';
import { Fragment } from 'react';

export const NavbarMobileBtn: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Sheet onOpenChange={setIsOpen}>
			<SheetTrigger asChild>
				<Button variant={'link'} className='ml-auto flex items-center justify-center px-2.5 text-muted-foreground md:hidden' data-umami-event='navbar-mobile-trigger'>
					<Hamburger toggled={isOpen} size={24} color='currentColor' />
				</Button>
			</SheetTrigger>
			<NavbarMobile />
		</Sheet>
	);
};

export const NavbarMobile = () => {
	const navMenu = getMainNavigation();
	const [openAccordion, setOpenAccordion] = useState<string>('');
	const [openChildAccordion, setOpenChildAccordion] = useState<string>('');

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

	const renderNavItem = (item: NavigationItem | NavigationSection, level: number = 0) => {
		if (item.child) {
			return (
				<Accordion type='single' collapsible key={item.name} value={level === 0 ? openAccordion : openChildAccordion} onValueChange={level === 0 ? setOpenAccordion : setOpenChildAccordion}>
					<AccordionItem value={item.name}>
						<AccordionTrigger className={`${level === 0 ? 'text-xl' : 'text-lg'} font-normal text-foreground`} data-umami-event={`navbar-accordion-${item.name}`}>
							{item.name}
						</AccordionTrigger>
						<AccordionContent className={`${level === 0 ? 'pl-5' : 'pl-3'} divide-y`}>
							{item.child.map((child: NavigationItem, index: number) => (
								<div key={index} className='py-1'>
									{child.child ? (
										renderNavItem(child, level + 1)
									) : (
										<SheetClose asChild>
											<Link href={child.path} className={`block ${level === 0 ? 'text-lg' : 'text-base'} border-b py-2 text-muted-foreground first:pt-0 last:border-0 last:pb-0`} {...(child.external && { target: '_blank', rel: 'noopener noreferrer' })}>
												{child.name}
											</Link>
										</SheetClose>
									)}
								</div>
							))}
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			);
		} else {
			return (
				<SheetClose asChild>
					<Link href={item.path || '#'} className='block py-4 text-xl first:pt-0 last:pb-0' {...(item.path?.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}>
						{item.name}
					</Link>
				</SheetClose>
			);
		}
	};

	return (
		<SheetContent side='right' className='flex w-[340px] flex-col pt-16'>
			<SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
			<SheetDescription className='sr-only'>Main navigation menu with links to all sections of the website</SheetDescription>

			<ScrollArea className='flex-1 p-6'>
				{navMenu.map((menu, i) => (
					<Fragment key={i}>{renderNavItem(menu)}</Fragment>
				))}
			</ScrollArea>

			{/* Download Section */}
			<div className="border-t border-border p-6 space-y-4">
				<div className="text-center">
					<h3 className="text-base font-semibold mb-1">Portfolio & CV</h3>
					<p className="text-sm text-muted-foreground mb-3">Download documents</p>
				</div>
				<div className="space-y-3">
					<Button 
						variant="default" 
						size="sm" 
						className="w-full flex items-center gap-2"
						onClick={() => handleDownload(ENDPOINTS.ASSETS.CV_PDF, 'CV_Muhammad_Daniel_Krisna_Halim_Putra.pdf')}
					>
						<FileText className="h-4 w-4" />
						Download CV
					</Button>
					<Button 
						variant="outline" 
						size="sm" 
						className="w-full flex items-center gap-2"
						onClick={() => handleDownload(ENDPOINTS.ASSETS.PORTFOLIO_PDF, 'Portfolio_Muhammad_Daniel_Krisna_Halim_Putra.pdf')}
					>
						<FolderOpen className="h-4 w-4" />
						Portfolio PDF
					</Button>
				</div>
			</div>
		</SheetContent>
	);
};
