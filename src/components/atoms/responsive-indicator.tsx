'use client'
import { ClientOnly } from './client-only'
import { ENV } from '@/types/environment'

export const ResponsiveIndicator = () => {
  if (ENV.NODE_ENV === 'production') return null

  return (
    <ClientOnly>
      <div className='fixed bottom-1 left-1 z-[999999999] flex h-6 w-6 items-center justify-center rounded-full bg-black p-3 font-mono text-xs text-white'>
        <div className='block sm:hidden'>xs</div>
        <div className='hidden sm:block md:hidden'>sm</div>
        <div className='hidden md:block lg:hidden'>md</div>
        <div className='hidden lg:block xl:hidden'>lg</div>
        <div className='hidden xl:block 2xl:hidden'>xl</div>
        <div className='hidden 2xl:block'>2xl</div>
      </div>
    </ClientOnly>
  )
}
