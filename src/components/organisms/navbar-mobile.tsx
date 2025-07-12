'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/atoms/accordion'
import { SheetTrigger, SheetContent, Sheet } from '@/components/atoms/sheet'
import { getMainNavigation, NavigationItem, NavigationSection } from '@/constants/navigation'
import { Button } from '@/components/atoms/button'
import { Divide as Hamburger } from 'hamburger-react'
import { Fragment } from 'react'

export const NavbarMobileBtn: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant={'link'} className='text-muted-foreground ml-auto px-2.5 flex items-center justify-center md:hidden' data-umami-event='navbar-mobile-trigger'>
          <Hamburger toggled={isOpen} size={24} color="currentColor" />
        </Button>
      </SheetTrigger>
      <NavbarMobile />
    </Sheet>
  )
}

export const NavbarMobile = () => {
  const navMenu = getMainNavigation()
  const [openAccordion, setOpenAccordion] = useState<string>('')
  const [openChildAccordion, setOpenChildAccordion] = useState<string>('')

  const renderNavItem = (item: NavigationItem | NavigationSection, level: number = 0) => {
    if (item.child) {
      return (
        <Accordion 
          type='single' 
          collapsible 
          key={item.name}
          value={level === 0 ? openAccordion : openChildAccordion}
          onValueChange={level === 0 ? setOpenAccordion : setOpenChildAccordion}
        >
          <AccordionItem value={item.name}>
            <AccordionTrigger 
              className={`${level === 0 ? 'text-xl' : 'text-lg'} font-normal text-foreground`} 
              data-umami-event={`navbar-accordion-${item.name}`}
            >
              {item.name}
            </AccordionTrigger>
            <AccordionContent className={`${level === 0 ? 'pl-5' : 'pl-3'} divide-y`}>
              {item.child.map((child: NavigationItem, index: number) => (
                <div key={index} className="py-1">
                  {child.child ? (
                    renderNavItem(child, level + 1)
                  ) : (
                    <Link 
                      href={child.path} 
                      className={`block ${level === 0 ? 'text-lg' : 'text-base'} py-2 first:pt-0 last:pb-0 border-b last:border-0 text-muted-foreground`}
                      {...(child.external && { target: '_blank', rel: 'noopener noreferrer' })}
                    >
                      {child.name}
                    </Link>
                  )}
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )
    } else {
      return (
        <Link 
          href={item.path || '#'} 
          className='block text-xl py-4 first:pt-0 last:pb-0' 
          {...(item.path?.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
        >
          {item.name}
        </Link>
      )
    }
  }

  return (
    <SheetContent side="right" className="w-[340px] pt-16 flex flex-col">
      <div className="p-6 overflow-y-auto flex-1">
        {navMenu.map((menu, i) => (
          <Fragment key={i}>
            {renderNavItem(menu)}
          </Fragment>
        ))}
      </div>
    </SheetContent>
  )
}
