import Link from 'next/link'
import { BiGitBranch, BiRefresh, BiXCircle } from 'react-icons/bi'
import { IoWarningOutline, IoLogoGithub } from 'react-icons/io5'
import { AiOutlineClockCircle } from 'react-icons/ai'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/atoms/tooltip'
import { weeklyCodingActivity } from '@/lib/actions'

export const Footer = async () => {
  const { data } = await weeklyCodingActivity()
  const todayData = data[data.length - 1]

  return (
    <footer className='border-t text-off-white text-xs flex items-center justify-between select-none bg-layout relative z-30'>
      <div className='flex items-center border-r divide-x'>
        <Link
          target='_blank'
          href='https://github.com/bforbilly24/bforbilly'
          className='flex items-center gap-x-2 px-2 py-1 hover:text-foreground text-muted-foreground transition-colors'
        >
          <BiGitBranch className='text-lg' />
          <p>master</p>
        </Link>
        <button
          aria-label='refetch'
          className='items-center gap-x-2 px-2 py-1 md:flex hidden group hover:text-foreground text-muted-foreground transition-colors'
          data-umami-event='footer-refresh-btn'
        >
          <BiRefresh className='text-xl group-active:rotate-180 transition-transform' />
        </button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='items-center gap-x-1 px-2 py-1 md:flex hidden text-muted-foreground'>
                <BiXCircle className='text-base' />
                <p>0</p>
                <IoWarningOutline className='text-base' />
                <p>0</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>No problems</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                aria-label={todayData?.grand_total.text}
                href='/coding-activity'
                className='items-center gap-x-1 px-2 py-1 md:flex hidden text-muted-foreground hover:text-foreground transition-colors'
              >
                <AiOutlineClockCircle className='text-base' />
                <p>{todayData?.grand_total.text}</p>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Today coding activity</p>
              <p className='text-sm text-muted-foreground'>click for more</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Link
          href='mailto:halimputra0701@gmail.com'
          target='_blank'
          className='items-center gap-x-1.5 px-2 py-1 md:flex hidden text-muted-foreground hover:text-foreground transition-colors'
        >
          <div className='w-2 h-2 bg-red-500 rounded-full animate-pulse' />
          <span>Not available for a work!</span>
        </Link>
      </div>

      <div className='flex items-center divide-x divide border-l'>
        <div className='items-center gap-x-2 px-2 py-1 lg:flex hidden text-muted-foreground'>
          <p>I give special thanks to:</p>
          <Link href='https://github.com/rasvanjaya21' target='_blank' className='hover:text-foreground transition-colors'>
            @Rasvanjaya21
          </Link>
        </div>
        <Link target='_blank' href='https://github.com/bforbilly24' className='flex items-center gap-x-1 px-2 py-1 hover:text-foreground text-muted-foreground transition-colors'>
          <p>Bforbilly24</p>
          <IoLogoGithub className='text-lg' />
        </Link>
      </div>
    </footer>
  )
}
