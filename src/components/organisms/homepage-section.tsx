'use client'

import { useEffect, useState } from 'react';
import { FadeIn } from '@/components/atoms/fade-in';
import { GridPattern } from '@/components/atoms/grid-pattern';
import { SvgMotion } from '@/components/atoms/svg-motion';
import { ClientOnly } from '@/components/atoms/client-only';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { PageLoading } from '@/components/atoms/page-loading';
import { AnimatedShinyText } from '@/components/atoms/animated-shiny-text';
import { HyperText } from '@/components/atoms/hyper-text';
import TrueFocus from '@/components/molecules/true-focus';
import { Badge3D } from '@/components/molecules/badge-3d';
import { useMobile } from '@/hooks/use-mobile';

export function HomepageSection() {
  const [loading, setLoading] = useState(true);
  const isMobile = useMobile();

  useEffect(() => {
    if (sessionStorage.getItem('animationPlayed')) {
      setLoading(false);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem('animationPlayed', 'true');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <ClientOnly
      fallback={
        <section className='flex items-center justify-center gap-20 p-5'>
          <PageLoading />
        </section>
      }
    >
      {loading && <SvgMotion />}
      {!loading && (
        <section id='hero' className='flex flex-col items-center justify-center gap-20 p-5 md:flex-col lg:flex-row'>
          <FadeIn>
            <div className='relative z-10 space-y-8 md:space-y-10'>
              <header className='flex flex-col items-start justify-center'>
                <div className='flex items-start justify-center'>
                  <AnimatedShinyText>P Hu!. I am</AnimatedShinyText>
                </div>

                <HyperText className='text-3xl font-medium sm:text-4xl md:text-6xl'>Halim Putra</HyperText>

                <div className='flex items-center justify-center gap-x-3 mt-4'>
                  <ChevronRightIcon className='animate-pulse' />
                  <TrueFocus sentence='Frontend developer' manualMode={!isMobile} blurAmount={5} borderColor='#FFFFFF' glowColor='rgba(168,85,247,0.5)' animationDuration={0.4} pauseBetweenAnimations={1.2} />
                </div>

                <div className='absolute left-0 top-0 -z-10 h-1/2 w-full animate-pulse rounded-full bg-muted-foreground/10 blur-2xl' />
              </header>

              <div className='space-y-2 text-xs sm:text-sm'>
                <p className='text-muted-foreground'>{`// wanna see it? visit on my Github page`}</p>
                <p className='text-muted-foreground'>
                  <span className='text-purple'>const</span> <span className='text-green'>githubLink</span> = &apos;
                  <Link target='_blank' href='https://github.com/bforbilly24/bforbilly' className='text-light-brown transition-colors hover:text-foreground hover:underline'>
                    https://github.com/bforbilly24/bforbilly
                  </Link>
                  &apos;
                </p>
              </div>
            </div>
          </FadeIn>
          <Badge3D />
          <GridPattern className='absolute inset-x-0 -top-14 -z-10 h-full w-full fill-neutral-100 stroke-neutral-700/5 [mask-image:linear-gradient(to_bottom_right,white_40%,transparent_50%)] dark:fill-secondary/20 dark:stroke-secondary/30' yOffset={-96} interactive />
        </section>
      )}
    </ClientOnly>
  );
}
