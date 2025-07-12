'use client';

import React, { useEffect, useState } from 'react';
import { MessageCircle, Lock } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { SignInButton } from '@clerk/nextjs';
import { ENDPOINTS } from '@/api/endpoints';
import { GuestBookCard } from '@/components/atoms/guest-book'

type GuestBookEntry = {
	id: string;
	message: string;
	authorId: string;
	authorName: string;
	authorImage?: string;
	createdAt: string;
	updatedAt: string;
	parentId?: string;
	repliedToUserId?: string;
	repliedToUserName?: string;
	replies?: GuestBookEntry[];
	parent?: GuestBookEntry;
};

type GuestBookCommentPreviewProps = {
	entries?: GuestBookEntry[];
	loading?: boolean;
};

export function GuestBookCommentPreview({ entries: externalEntries, loading: externalLoading }: GuestBookCommentPreviewProps = {}) {
	const [entries, setEntries] = useState<GuestBookEntry[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Jika ada external entries, gunakan itu
		if (externalEntries !== undefined) {
			setEntries(externalEntries);
			setLoading(externalLoading ?? false);
			return;
		}

		// Jika tidak ada external entries, fetch sendiri
		const fetchEntries = async () => {
			try {
				const response = await fetch(ENDPOINTS.LOCAL.GUEST_BOOK);
				const result = await response.json();
				if (result.success) {
					setEntries(result.data);
				}
			} catch (error) {
				console.error('Error fetching entries:', error);
				setEntries([]);
			} finally {
				setLoading(false);
			}
		};

		fetchEntries();
	}, [externalEntries, externalLoading]);
	// Show the 4 most recent comments (only root comments, no replies)
	const previewEntries = entries.filter(entry => !entry.parentId).slice(0, 4);

	if (loading) {
		return (
			<aside className='w-full space-y-6'>
				<div className='space-y-4 text-center'>
					<div className='flex items-center justify-center gap-2'>
						<MessageCircle className='size-6 text-primary' />
						<h2 className='text-xl font-bold'>Comment Preview</h2>
					</div>
					<p className='text-sm text-muted-foreground'>Loading komentar terbaru...</p>
				</div>
				<div className='flex h-32 items-center justify-center'>
					<div className='size-8 animate-spin rounded-full border-b-2 border-primary'></div>
				</div>
			</aside>
		);
	}

	return (
		<aside className='w-full space-y-6'>
			{/* Header */}
			<div className='space-y-3 text-center sm:space-y-4'>
				<div className='flex items-center justify-center gap-2'>
					<MessageCircle className='size-5 text-primary sm:h-6 sm:w-6' />
					<h2 className='text-lg font-bold sm:text-xl'>Comment Preview</h2>
				</div>
				<p className='mx-auto max-w-2xl px-4 text-xs text-muted-foreground sm:text-sm'>Lihat apa kata pengunjung tentang portfolio ini</p>
			</div>

			{/* Guest Book Cards in Single Column with Central Lock */}
			<div className='relative min-h-[600px] w-full'>
				{previewEntries.length > 0 ? (
					<>
						<div className='grid w-full grid-cols-1 gap-4'>
							{previewEntries.map((entry, index) => (
								<div key={entry.id} className='relative'>
									<GuestBookCard entry={entry} isAdmin={false} className='pointer-events-none opacity-80 transition-opacity hover:opacity-90' />
								</div>
							))}
						</div>
						{/* Single Central Lock overlay for all comments */}
						<div className='absolute inset-0 flex items-center justify-center rounded-lg bg-background/60 backdrop-blur-[2px]'>
							<div className='space-y-2 text-center'>
								<Lock className='mx-auto size-8 text-muted-foreground' />
								<p className='text-base font-medium text-muted-foreground'>Login to see full conversation</p>
							</div>
						</div>
					</>
				) : (
					<div className='rounded-lg border-2 border-dashed border-muted-foreground/20 p-8 text-center'>
						<p className='mb-4 text-muted-foreground'>Belum ada komentar. Jadilah yang pertama berbagi pendapat!</p>
					</div>
				)}
			</div>

			{/* Call to Action */}
			<div className='rounded-lg border bg-gradient-to-r from-muted/30 to-muted/50 p-4 text-center sm:p-6'>
				<div className='space-y-3'>
					<h3 className='text-base font-semibold sm:text-lg'>Bergabung dalam percakapan</h3>
					<p className='text-xs text-muted-foreground sm:text-sm'>{entries.length > 0 ? `${entries.length} orang sudah memberikan feedback` : 'Jadilah yang pertama memberikan feedback'}</p>
					<SignInButton mode='modal'>
						<Button variant='default' size='sm' className='gap-2'>
							<MessageCircle className='size-4' />
							Join Conversation
						</Button>
					</SignInButton>
				</div>
			</div>

			{entries.length > 4 && (
				<div className='text-center'>
					<p className='text-sm text-muted-foreground'>+{entries.length - 4} komentar lainnya menunggu Anda</p>
				</div>
			)}
		</aside>
	);
}
