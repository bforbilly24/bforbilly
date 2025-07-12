'use client';

import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/atoms/button';
import { MessageCircle, LogIn, UserPlus, TrendingUp } from 'lucide-react';
import { FadeIn } from '@/components/atoms/fade-in';
import { NumberTicker } from '@/components/atoms/number-ticker';
import { useEffect, useState } from 'react';
import { ENDPOINTS } from '@/api/endpoints';

export function GuestBookSidebar() {
	const [stats, setStats] = useState({ totalComments: 0, loading: true });

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await fetch(ENDPOINTS.LOCAL.GUEST_BOOK);
				const result = await response.json();

				if (result.success) {
					setStats({ totalComments: result.data.length, loading: false });
				}
			} catch (error) {
				console.error('❌ Error fetching stats:', error);
				setStats({ totalComments: 0, loading: false });
			}
		};
		fetchStats();
	}, []);

	return (
		<aside className='border-lines hidden overflow-y-auto border-r bg-background md:col-span-3 md:block lg:col-span-2'>
			<div className='space-y-6 p-4'>
				{/* Guest Book Info */}
				<div className='space-y-3'>
					<div className='flex items-center gap-2'>
						<MessageCircle className='h-5 w-5 text-primary' />
						<h3 className='text-sm font-semibold'>Guest Book</h3>
					</div>
					<p className='text-xs leading-relaxed text-muted-foreground'>Berbagi pemikiran dan terhubung dengan pengunjung lain</p>
				</div>

				{/* Stats Section */}
				<div className='space-y-3'>
					<div className='flex items-center gap-2'>
						<TrendingUp className='h-4 w-4 text-primary' />
						<h4 className='text-sm font-medium'>Statistics</h4>
					</div>
					<div className='rounded-lg bg-muted/30 p-3'>
						<div className='text-center'>
							<div className='text-lg font-bold text-primary'>
								{stats.loading ? '...' : <NumberTicker value={stats.totalComments} className="text-lg font-bold text-primary" />}
							</div>
							<div className='text-xs text-muted-foreground'>Total Comments</div>
						</div>
					</div>
				</div>

				{/* Authentication Section - Always Open */}
				<div className='space-y-3'>
					<div className='border-lines flex items-center gap-2 border-b pb-2'>
						<h4 className='text-sm font-medium'>Authentication</h4>
					</div>
					<div className='space-y-3'>
						<SignedOut>
							<FadeIn>
								<div className='space-y-3'>
									<div className='text-xs text-muted-foreground'>Sign in untuk bergabung dalam percakapan</div>
									<SignInButton>
										<Button size='sm' className='w-full justify-start gap-2'>
											<LogIn className='h-4 w-4' />
											Sign In
										</Button>
									</SignInButton>
									<SignUpButton>
										<Button variant='outline' size='sm' className='w-full justify-start gap-2'>
											<UserPlus className='h-4 w-4' />
											Sign Up
										</Button>
									</SignUpButton>
								</div>
							</FadeIn>
						</SignedOut>

						<SignedIn>
							<FadeIn>
								<div className='space-y-3'>
									<div className='flex items-center gap-2'>
										<UserButton
											appearance={{
												elements: {
													avatarBox: 'h-6 w-6',
												},
											}}
										/>
										<span className='text-xs text-muted-foreground'>Signed in</span>
									</div>
									<div className='text-xs text-muted-foreground'>Anda sudah masuk dan dapat menulis komentar</div>
								</div>
							</FadeIn>
						</SignedIn>
					</div>
				</div>
			</div>
		</aside>
	);
}
