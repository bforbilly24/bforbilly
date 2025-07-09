'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Home,
  Briefcase,
  FileText,
  Activity,
  MessageSquare,
  Search,
  Code
} from 'lucide-react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/atoms/command'

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleNavigate = (path: string) => {
    setOpen(false)
    router.push(path)
  }

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => handleNavigate('/')}>
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
            </CommandItem>
            <CommandItem onSelect={() => handleNavigate('/about')}>
              <User className="mr-2 h-4 w-4" />
              <span>About</span>
            </CommandItem>
            <CommandItem onSelect={() => handleNavigate('/projects')}>
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Projects</span>
            </CommandItem>
            <CommandItem onSelect={() => handleNavigate('/articles')}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Articles</span>
            </CommandItem>
            <CommandItem onSelect={() => handleNavigate('/guest-book')}>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Guest Book</span>
            </CommandItem>
            <CommandItem onSelect={() => handleNavigate('/coding-activity')}>
              <Activity className="mr-2 h-4 w-4" />
              <span>Coding Activity</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Projects">
            <CommandItem onSelect={() => handleNavigate('/projects/personal-portfolio')}>
              <Code className="mr-2 h-4 w-4" />
              <span>Personal Portfolio</span>
            </CommandItem>
            <CommandItem onSelect={() => handleNavigate('/projects/ecommerce')}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>E-commerce Platform</span>
            </CommandItem>
            <CommandItem onSelect={() => handleNavigate('/projects/client-portal')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Client Portal</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Articles">
            <CommandItem onSelect={() => handleNavigate('/articles/elevate-website-appeal-with-svg-animations-using-framer-motion')}>
              <FileText className="mr-2 h-4 w-4" />
              <span>SVG Animations with Framer Motion</span>
            </CommandItem>
            <CommandItem onSelect={() => handleNavigate('/articles/generate-dynamic-open-graph-with-nextjs')}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Dynamic Open Graph with Next.js</span>
            </CommandItem>
            <CommandItem onSelect={() => handleNavigate('/articles/how-to-create-a-reusable-active-link-component-in-nextjs-app-router')}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Reusable Active Link Component</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

        </CommandList>  
      </CommandDialog>
    </>
  )
}

export function CommandMenuTrigger() {
  return (
    <div className="text-sm text-muted-foreground">
      Press{' '}
      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
        <span className="text-xs">⌘</span>K
      </kbd>{' '}
      to search
    </div>
  )
}
