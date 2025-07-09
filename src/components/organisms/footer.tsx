import Link from 'next/link';
import { BiGitBranch, BiRefresh, BiXCircle } from 'react-icons/bi';
import { IoWarningOutline, IoLogoGithub } from 'react-icons/io5';
import { AiOutlineClockCircle } from 'react-icons/ai';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/atoms/tooltip';
import { getWakaStatusBar } from '@/lib/wakatime/actions';

export const Footer = async () => {
	const stats = await getWakaStatusBar();
	let todayText = '0 hrs 0 mins';
	if (stats?.data?.categories && Array.isArray(stats.data.categories)) {
		const codingCategory = stats.data.categories.find((cat: any) => cat.name === 'Coding');
		todayText = codingCategory?.text || todayText;
	}

	return (
		<footer className='text-off-white bg-layout relative z-30 flex select-none items-center justify-between border-t text-xs'>
			<div className='flex items-center divide-x border-r'>
				<Link target='_blank' href='https://github.com/bforbilly24/bforbilly' className='flex items-center gap-x-2 px-2 py-1 text-muted-foreground transition-colors hover:text-foreground'>
					<BiGitBranch className='text-lg' />
					<p>master</p>
				</Link>
				<button aria-label='refetch' className='group hidden items-center gap-x-2 px-2 py-1 text-muted-foreground transition-colors hover:text-foreground md:flex' data-umami-event='footer-refresh-btn'>
					<BiRefresh className='text-xl transition-transform group-active:rotate-180' />
				</button>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className='hidden items-center gap-x-1 px-2 py-1 text-muted-foreground md:flex'>
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
							<Link aria-label={todayText} href='/coding-activity' className='hidden items-center gap-x-1 px-2 py-1 text-muted-foreground transition-colors hover:text-foreground md:flex'>
								<AiOutlineClockCircle className='text-base' />
								<p>{todayText}</p>
							</Link>
						</TooltipTrigger>
						<TooltipContent>
							<p>Today coding activity</p>
							<p className='text-sm text-muted-foreground'>click for more</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<Link href='mailto:halimputra0701@gmail.com' target='_blank' className='hidden items-center gap-x-1.5 px-2 py-1 text-muted-foreground transition-colors hover:text-foreground md:flex'>
					<div className='h-2 w-2 animate-pulse rounded-full bg-green-500' />
					<span>Available for a work!</span>
				</Link>
			</div>

			<div className='divide flex items-center divide-x border-l'>
				<div className='hidden items-center gap-x-2 px-2 py-1 text-muted-foreground lg:flex'>
					<p>Copyright © {new Date().getFullYear()}</p>
				</div>
				<Link target='_blank' href='https://github.com/bforbilly24' className='flex items-center gap-x-1 px-2 py-1 text-muted-foreground transition-colors hover:text-foreground'>
					<p>Bforbilly24</p>
					<IoLogoGithub className='text-lg' />
				</Link>
			</div>
		</footer>
	);
};
