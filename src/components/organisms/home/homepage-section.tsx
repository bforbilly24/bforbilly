'use client';

import { useEffect, useState } from 'react';
import { FadeIn, FadeInStagger } from '@/components/atoms/fade-in';
import { GridPattern } from '@/components/atoms/grid-pattern';
import { ScrollArea } from '@/components/atoms/scroll-area';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { PageLoading } from '@/components/atoms/page-loading';
import { AnimatedShinyText, HyperText, SvgMotion } from '@/components/atoms/home';
import { Badge3D, Badge3DLazy, TrueFocus } from '@/components/molecules/home';
import { useMobile } from '@/hooks/use-mobile';

export function HomepageSection() {
	const [loading, setLoading] = useState(true);
	const [isClient, setIsClient] = useState(false);
	const [shouldLoadBadge, setShouldLoadBadge] = useState(false);
	const isMobile = useMobile();

	useEffect(() => {
		setIsClient(true);

		// Check if animation was played before
		const animationPlayed = sessionStorage.getItem('animationPlayed');

		if (animationPlayed) {
			setLoading(false);
			// Load badge immediately if animation was already played
			setShouldLoadBadge(true);
		} else {
			const timer = setTimeout(() => {
				setLoading(false);
				sessionStorage.setItem('animationPlayed', 'true');
				// Load badge after animation
				setShouldLoadBadge(true);
			}, 3000); // Reduced from 5000ms to 3000ms
			return () => clearTimeout(timer);
		}
	}, []);

	// Show loading during SSR and initial hydration
	if (!isClient) {
		return (
			<section id='hero' className='flex items-center justify-center gap-20 p-5'>
				<PageLoading />
			</section>
		);
	}

	return (
		<>
			{loading && <SvgMotion />}
			{!loading && (
				<section id='hero' className='relative grid h-full grid-cols-12 overflow-hidden'>
					{isMobile ? (
						<ScrollArea className='col-span-12 h-[84dvh]'>
							<FadeInStagger className='flex min-h-[84dvh] flex-col items-center justify-center gap-12 p-5 sm:gap-16 md:flex-col lg:flex-row lg:gap-20' faster>
								<FadeIn>
									<div className='space-y-8 md:space-y-10'>
										<header className='flex flex-col items-start justify-center'>
											<div className='flex items-start justify-center'>
												<AnimatedShinyText>P Hu!. I am</AnimatedShinyText>
											</div>

											<HyperText className='text-3xl font-medium sm:text-4xl md:text-6xl'>Halim Putra</HyperText>

											<div className='mt-4 flex items-center justify-center gap-x-3'>
												<ChevronRightIcon className='animate-pulse' />
												<TrueFocus sentence='Frontend developer' manualMode={!isMobile} blurAmount={5} animationDuration={0.4} pauseBetweenAnimations={1.2} />
											</div>

											<div className='absolute left-0 top-0 -z-10 h-1/2 w-full animate-pulse rounded-full bg-muted-foreground/10 blur-2xl' />
										</header>

										<div className='space-y-2 text-xs sm:text-sm'>
											<p className='text-muted-foreground'>{`// wanna see it? visit on my Github page`}</p>
											<p className='text-muted-foreground'>
												<span className='text-orange-500'>const</span> <span className='text-blue-500'>githubLink</span> ={' '}
												<Link target='_blank' href='https://github.com/bforbilly24/bforbilly' className='text-cyan-500 transition-colors hover:text-foreground hover:underline'>
													&apos;https://github.com/bforbilly24/bforbilly&apos;
												</Link>
											</p>
										</div>
									</div>
								</FadeIn>

								<div className='flex w-full justify-center' style={{ touchAction: 'pan-y' }}>
									{shouldLoadBadge ? (
										<Badge3DLazy />
									) : (
										<div className='relative flex h-[32rem] w-full max-w-lg items-center justify-center lg:h-full lg:w-full 2xl:h-[48rem]'>
											<PageLoading />
										</div>
									)}
								</div>
							</FadeInStagger>
						</ScrollArea>
					) : (
						<FadeInStagger className='col-span-12 flex h-[84dvh] flex-col items-center justify-center gap-12 p-5 sm:gap-16 md:flex-col lg:flex-row lg:gap-20' faster>
							<FadeIn>
								<div className='space-y-8 md:space-y-10'>
									<header className='flex flex-col items-start justify-center'>
										<div className='flex items-start justify-center'>
											<AnimatedShinyText>P Hu!. I am</AnimatedShinyText>
										</div>

										<HyperText className='text-3xl font-medium sm:text-4xl md:text-6xl'>Halim Putra</HyperText>

										<div className='mt-4 flex items-center justify-center gap-x-3'>
											<ChevronRightIcon className='animate-pulse' />
											<TrueFocus sentence='Frontend developer' manualMode={!isMobile} blurAmount={5} animationDuration={0.4} pauseBetweenAnimations={1.2} />
										</div>

										<div className='absolute left-0 top-0 -z-10 h-1/2 w-full animate-pulse rounded-full bg-muted-foreground/10 blur-2xl' />
									</header>

									<div className='space-y-2 text-xs sm:text-sm'>
										<p className='text-muted-foreground'>{`// wanna see it? visit on my Github page`}</p>
										<p className='text-muted-foreground'>
											<span className='text-orange-500'>const</span> <span className='text-purple-500'>githubLink</span> <span className='text-orange-500'>= </span>
											<Link target='_blank' href='https://github.com/bforbilly24/bforbilly' className='text-blue-500 transition-colors hover:text-foreground hover:underline'>
												&apos;https://github.com/bforbilly24/bforbilly&apos;
											</Link>
										</p>
									</div>
								</div>
							</FadeIn>
							{shouldLoadBadge ? (
								<Badge3D />
							) : (
								<div className='relative flex h-[32rem] w-full max-w-lg items-center justify-center lg:h-full lg:w-full 2xl:h-[48rem]'>
									<PageLoading />
								</div>
							)}
						</FadeInStagger>
					)}
					<GridPattern className='absolute inset-x-0 -top-14 -z-10 h-full w-full fill-neutral-300/50 stroke-neutral-700/15 [mask-image:linear-gradient(to_bottom_right,white_40%,transparent_50%)] dark:fill-secondary/40 dark:stroke-secondary/20 dark:[mask-image:linear-gradient(to_bottom_right,white_40%,transparent_50%)]' yOffset={-96} interactive />
				</section>
			)}
		</>
	);
}
