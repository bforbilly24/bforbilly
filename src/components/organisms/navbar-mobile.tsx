'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FileText, FolderOpen, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/atoms/accordion';
import { ScrollArea } from '@/components/atoms/scroll-area';
import { getMainNavigation, NavigationItem, NavigationSection } from '@/constants/navigation';
import { Button } from '@/components/atoms/button';
import { ENDPOINTS } from '@/api/endpoints';

export const NavbarMobileBtn: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);

	const handleNavigation = (href: string) => {
		setIsOpen(false);
	};

	return (
		<>
			{/* Mobile Menu Button - menimpa di atas navbar */}
			<Button
				size="icon"
				variant="ghost"
				onClick={() => setIsOpen(!isOpen)}
				className="text-foreground md:hidden relative z-[70] transition-all duration-300"
				data-umami-event='navbar-mobile-trigger'
			>
				<motion.div
					animate={{ rotate: isOpen ? 180 : 0 }}
					transition={{ duration: 0.3 }}
				>
					{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
				</motion.div>
			</Button>

			{/* Custom Mobile Sheet Menu */}
			<AnimatePresence>
				{isOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
							className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
							onClick={() => setIsOpen(false)}
						/>
						{/* Slide-out Menu */}
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{
								type: "spring",
								stiffness: 300,
								damping: 30,
							}}
							className="fixed top-0 right-0 h-full w-[340px] bg-background/95 backdrop-blur-xl border-l border-border shadow-2xl z-50 md:hidden"
						>
							<NavbarMobile onNavigate={handleNavigation} />
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
};

interface NavbarMobileProps {
	onNavigate: (href: string) => void;
}

export const NavbarMobile = ({ onNavigate }: NavbarMobileProps) => {
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

	const handleLinkClick = (href: string) => {
		onNavigate(href);
	};

	const renderNavItem = (item: NavigationItem | NavigationSection, level: number = 0) => {
		if (item.child) {
			return (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 * level }}
					key={item.name}
				>
					<Accordion type='single' collapsible value={level === 0 ? openAccordion : openChildAccordion} onValueChange={level === 0 ? setOpenAccordion : setOpenChildAccordion}>
						<AccordionItem value={item.name}>
							<AccordionTrigger className={`${level === 0 ? 'text-lg' : 'text-base'} font-medium text-foreground hover:text-primary transition-colors`} data-umami-event={`navbar-accordion-${item.name}`}>
								{item.name}
							</AccordionTrigger>
							<AccordionContent className={`${level === 0 ? 'pl-4' : 'pl-2'} space-y-1`}>
								{item.child.map((child: NavigationItem, index: number) => (
									<div key={index}>
										{child.child ? (
											renderNavItem(child, level + 1)
										) : (
											<Link 
												href={child.path} 
												className={`block ${level === 0 ? 'text-base' : 'text-sm'} py-2 text-muted-foreground hover:text-foreground transition-colors rounded-md px-2 hover:bg-accent`} 
												{...(child.external && { target: '_blank', rel: 'noopener noreferrer' })}
												onClick={() => handleLinkClick(child.path)}
											>
												{child.name}
											</Link>
										)}
									</div>
								))}
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</motion.div>
			);
		} else {
			return (
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.1 * level }}
					key={item.name}
				>
					<Link 
						href={item.path || '#'} 
						className='block py-3 text-lg font-medium text-foreground hover:text-primary transition-colors rounded-md px-2 hover:bg-accent' 
						{...(item.path?.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
						onClick={() => handleLinkClick(item.path || '#')}
					>
						{item.name}
					</Link>
				</motion.div>
			);
		}
	};

	return (
		<div className='flex h-full w-full flex-col pt-16'>
			<div className='sr-only'>Navigation Menu</div>
			<div className='sr-only'>Main navigation menu with links to all sections of the website</div>

			<ScrollArea className='flex-1 p-6'>
				<div className="space-y-2">
					{navMenu.map((menu, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.1 * i }}
						>
							{renderNavItem(menu)}
						</motion.div>
					))}
				</div>
			</ScrollArea>

			{/* Download Section */}
			<motion.div 
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className='space-y-4 border-t border-border p-6'
			>
				<div className='text-center'>
					<h3 className='mb-1 text-base font-semibold'>Portfolio & CV</h3>
					<p className='mb-3 text-sm text-muted-foreground'>Download documents</p>
				</div>
				<div className='space-y-3'>
					<Button 
						variant='default' 
						size='sm' 
						className='flex w-full items-center gap-2 transition-all hover:scale-105' 
						onClick={() => handleDownload(ENDPOINTS.ASSETS.CV_PDF, 'CV_Muhammad_Daniel_Krisna_Halim_Putra.pdf')}
					>
						<FileText className='h-4 w-4' />
						Download CV
					</Button>
					<Button 
						variant='outline' 
						size='sm' 
						className='flex w-full items-center gap-2 transition-all hover:scale-105' 
						onClick={() => handleDownload(ENDPOINTS.ASSETS.PORTFOLIO_PDF, 'Portfolio_Muhammad_Daniel_Krisna_Halim_Putra.pdf')}
					>
						<FolderOpen className='h-4 w-4' />
						Portfolio PDF
					</Button>
				</div>
			</motion.div>
		</div>
	);
};
