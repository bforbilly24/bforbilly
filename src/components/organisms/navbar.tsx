import Link from 'next/link'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

import { NavLink } from '@/components/atoms/nav-link'
import { ThemeToggle } from '@/components/molecules/theme-toggler'
import { CommandMenuTrigger } from '@/components/molecules/command-menu'
import { getDesktopNavigation } from '@/constants/navigation'

import { NavbarMobileBtn } from './navbar-mobile'

export const Navbar = () => {
  const navMenu = getDesktopNavigation()
  
  return (
    <nav className='md:grid grid-cols-12 border-b flex items-center justify-between relative z-10 bg-background overflow-x-auto'>
      <Link href='/' className='md:border-r md:px-5 px-2.5 py-4 text-foreground md:col-span-3 lg:col-span-2 shrink-0 transition-colors'>
        Halim
      </Link>
      <div className='md:col-span-9 lg:col-span-10 flex items-center justify-between'>
        <ul className='md:flex items-center divide-x w-max border-r hidden shrink-0'>
          {navMenu.map((menu, i) => (
            <NavLink key={i} href={menu.path || '#'}>
              {menu.name}
            </NavLink>
          ))}
        </ul>
        <div className='flex items-center gap-3'>
          <div className='hidden lg:block'>
            <CommandMenuTrigger />
          </div>
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
          </SignedIn>
          <ThemeToggle />
          <NavbarMobileBtn />
        </div>
      </div>
    </nav>
  )
}
