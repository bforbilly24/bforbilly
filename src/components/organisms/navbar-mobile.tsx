'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/atoms/accordion';
import { SheetTrigger, SheetContent, Sheet, SheetTitle, SheetDescription, SheetClose } from '@/components/atoms/sheet';
import { ScrollArea } from '@/components/atoms/scroll-area';
import { getMainNavigation, NavigationItem, NavigationSection } from '@/constants/navigation';
import { Button } from '@/components/atoms/button';
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
		</SheetContent>
	);
};
