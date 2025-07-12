'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GuestBookThread } from '@/components/molecules/guest-book';
import { GuestBookCardSkeleton } from '@/components/atoms/guest-book/skeleton';
import { LoadMoreSkeleton } from '@/components/atoms/skeleton/load-more-skeleton';
import { GuestBookDeleteConfirmation } from '@/components/molecules/guest-book';
import { Card } from '@/components/atoms/card';
import { ScrollArea, ScrollBar } from '@/components/atoms/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/atoms/sheet';
import { Button } from '@/components/atoms/button';
import { ChatInput } from '@/components/atoms/chat-input';
import { UserResource } from '@clerk/types';
import { ChevronLeft, MessageSquare, X } from 'lucide-react';
import { type NestedComment } from '@/lib/comments';

interface GuestBookListProps {
	entries: NestedComment[];
	loading?: boolean;
	loadingMore?: boolean;
	hasNextPage?: boolean;
	onLoadMore?: () => Promise<void>;
	emptyMessage?: string;
	onReply?: (message: string, parentId?: string) => Promise<void>;
	onEdit?: (entry: NestedComment) => void;
	onDelete?: (entryId: string) => Promise<void>;
	currentUser?: UserResource | null;
	isAdmin?: boolean;
	expandedThreads?: Set<string>;
	onToggleExpand?: (entryId: string) => void;
}

export function GuestBookList({ entries, loading = false, loadingMore = false, hasNextPage = false, onLoadMore, emptyMessage = 'No messages yet. Be the first to leave a message!', onReply, onEdit, onDelete, currentUser, isAdmin = false, expandedThreads = new Set(), onToggleExpand }: GuestBookListProps) {
	const [replyingTo, setReplyingTo] = useState<string | null>(null);
	const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; entryId?: string }>({
		isOpen: false,
	});
	const [activeThread, setActiveThread] = useState<NestedComment | null>(null);
	const [threadSheetOpen, setThreadSheetOpen] = useState(false);

	const loadMoreRef = useRef<HTMLDivElement>(null);
	const [isIntersecting, setIsIntersecting] = useState(false);

	const findEntryById = (entries: NestedComment[], id: string): NestedComment | null => {
		if (!id || !entries) return null;

		for (const entry of entries) {
			if (entry.id === id) {
				return entry;
			}
			if (entry.replies && entry.replies.length > 0) {
				const found = findEntryById(entry.replies, id);
				if (found) return found;
			}
		}
		return null;
	};

	const activeThreadId = activeThread?.id;
	useEffect(() => {
		if (activeThreadId && threadSheetOpen && entries.length > 0) {
			const updatedThread = findEntryById(entries, activeThreadId);
			if (updatedThread) {
				setActiveThread(updatedThread);
			}
		}
	}, [entries, activeThreadId, threadSheetOpen]);

	const debounceTimeoutRef = useRef<NodeJS.Timeout>();

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (debounceTimeoutRef.current) {
					clearTimeout(debounceTimeoutRef.current);
				}

				debounceTimeoutRef.current = setTimeout(() => {
					setIsIntersecting(entry.isIntersecting);
				}, 300);
			},
			{
				threshold: 0.1,
				rootMargin: '100px',
			},
		);

		if (loadMoreRef.current) {
			observer.observe(loadMoreRef.current);
		}

		return () => {
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
			if (loadMoreRef.current) {
				observer.unobserve(loadMoreRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (isIntersecting && hasNextPage && !loadingMore && onLoadMore) {
			onLoadMore();
		}
	}, [isIntersecting, hasNextPage, loadingMore, onLoadMore]);

	const handleStartReply = (entryId: string) => {
		setReplyingTo(entryId);
	};

	const handleCancelReply = () => {
		setReplyingTo(null);
	};

	const handleReply = async (message: string, parentId?: string) => {
		if (onReply) {
			await onReply(message, parentId);
			setReplyingTo(null);
		}
	};

	const handleDeleteClick = async (entryId: string) => {
		setDeleteDialog({ isOpen: true, entryId });
	};

	const handleDeleteConfirm = async () => {
		if (onDelete && deleteDialog.entryId) {
			await onDelete(deleteDialog.entryId);
		}
		setDeleteDialog({ isOpen: false });
	};

	const handleOpenThread = (entry: NestedComment) => {
		setActiveThread(entry);
		setThreadSheetOpen(true);
	};

	const handleCloseThread = () => {
		setThreadSheetOpen(false);
		setReplyingTo(null);
	};

	const preventPropagation = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	if (loading) {
		return (
			<ScrollArea className='h-[calc(100vh-200px)] w-full [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
				<div className='space-y-3 sm:space-y-4'>
					{[...Array(5)].map((_, i) => {
						// Create varied skeleton patterns for loading state
						const isReply = i === 1 || i === 4; // Some cards are replies
						const hasReplies = i === 0 || i === 2; // Some cards have replies
						const showNestedReply = hasReplies && Math.random() > 0.6; // Sometimes show nested reply
						
						return (
							<GuestBookCardSkeleton 
								key={i}
								isReply={isReply}
								hasReplies={hasReplies}
								showNestedReply={showNestedReply}
							/>
						);
					})}
				</div>
				<ScrollBar orientation='vertical' />
			</ScrollArea>
		);
	}

	if (entries.length === 0) {
		return (
			<ScrollArea className='h-[calc(100vh-200px)] w-full [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
				<Card className='p-4 text-center sm:p-6 lg:p-8'>
					<div className='space-y-2 sm:space-y-3'>
						<p className='text-sm text-muted-foreground sm:text-base'>{emptyMessage}</p>
						<p className='text-xs text-muted-foreground/70 sm:text-sm'>💬 Start the conversation!</p>
					</div>
				</Card>
				<ScrollBar orientation='vertical' />
			</ScrollArea>
		);
	}

	return (
		<>
			<ScrollArea className='h-[calc(100vh-200px)] w-full [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
				<div className='space-y-4 sm:space-y-6 pb-28 sm:pb-40'>
					{entries.map(entry => (
						<div
							key={entry.id}
							onClick={e => {
								if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
									return;
								}
								handleOpenThread(entry);
							}}
							className='relative cursor-pointer'
						>
							<GuestBookThread
								entry={entry}
								isAdmin={isAdmin}
								currentUser={currentUser}
								onEdit={onEdit}
								onDelete={(id: string) => {
									handleDeleteClick(id);
									return Promise.resolve();
								}}
								onStartReply={(id: string) => {
									handleOpenThread(entry);
									setReplyingTo(id);
								}}
								expandedThreads={expandedThreads}
								onToggleExpand={() => handleOpenThread(entry)}
								isInSheet={false}
							/>
						</div>
					))}

					{/* Infinite scroll trigger and loading */}
					{hasNextPage && (
						<div ref={loadMoreRef} className='flex flex-col items-center gap-3 py-4'>
							{loadingMore ? (
								<LoadMoreSkeleton />
							) : (
								<>
									<div className='text-center text-sm text-muted-foreground'>Scroll to load more messages...</div>
									{/* Manual load more button as fallback */}
									<Button variant='outline' size='sm' onClick={() => onLoadMore?.()} disabled={loadingMore} className='text-xs'>
										Load More Messages
									</Button>
								</>
							)}
						</div>
					)}

					{/* End of messages indicator */}
					{!hasNextPage && entries.length > 0 && (
						<div className='py-6 text-center'>
							<p className='text-sm text-muted-foreground'>🎉 You've reached the end of the conversation!</p>
						</div>
					)}
				</div>
				<ScrollBar orientation='vertical' />
			</ScrollArea>

			{/* Thread Sheet (Discord-style) */}
			<Sheet open={threadSheetOpen} onOpenChange={setThreadSheetOpen}>
				<SheetContent side='right' className='flex w-full flex-col overflow-hidden border-l-2 border-l-blue-500/50 p-0 shadow-lg motion-safe:transition-transform motion-reduce:transition-none sm:max-w-[420px] md:max-w-[56rem]' style={{ maxWidth: '100vw' }}>
					{activeThread && (
						<>
							<SheetHeader className='sticky top-0 mt-8 border-b bg-background px-3 py-2 shadow-sm sm:px-4 sm:py-3'>
								<div className='flex items-center gap-2 sm:gap-3'>
									<Button variant='ghost' size='icon' onClick={handleCloseThread} className='h-7 w-7 rounded-full hover:bg-blue-50 sm:h-8 sm:w-8 dark:hover:bg-blue-900/20'>
										<ChevronLeft className='h-4 w-4 sm:h-5 sm:w-5' />
									</Button>
									<div className='flex items-center gap-1.5 sm:gap-2'>
										<div className='rounded-full bg-blue-100 p-1 sm:p-1.5 dark:bg-blue-900/40'>
											<MessageSquare className='h-3 w-3 text-blue-600 sm:h-4 sm:w-4 dark:text-blue-400' />
										</div>
										<div>
											<SheetTitle className='sm:text-sm-full text-start text-xs font-bold'>Thread</SheetTitle>
											<p className='max-w-[160px] truncate text-left text-[0.65rem] text-muted-foreground sm:max-w-[300px] sm:text-xs'>
												{activeThread.authorName} • {activeThread.message.substring(0, 40)}
												{activeThread.message.length > 40 ? '...' : ''}
											</p>
										</div>
									</div>
								</div>
							</SheetHeader>

							<div className='flex h-full w-full flex-1 flex-col overflow-hidden'>
								<ScrollArea className='w-full max-w-full flex-1 p-3 pb-0 [-ms-overflow-style:none] [scrollbar-width:none] sm:p-4 [&::-webkit-scrollbar]:hidden'>
									<div onClick={preventPropagation} className='pointer-events-auto w-full rounded-lg bg-gradient-to-b from-transparent to-background/5'>
										<GuestBookThread entry={activeThread} isAdmin={isAdmin} currentUser={currentUser} onEdit={onEdit} onDelete={handleDeleteClick} onStartReply={handleStartReply} expandedThreads={new Set([activeThread.id])} onToggleExpand={undefined} isInSheet={true} />
									</div>
									<div className='h-20'></div> {/* Space for bottom padding */}
								</ScrollArea>

								{/* Thread reply input - fixed at bottom */}
								{currentUser && (
									<div className='sticky bottom-0 mt-auto border-t bg-background p-3 sm:p-4'>
										<div className='relative'>
											<ChatInput
												onSendMessage={(message: string) => {
													const targetId = replyingTo || activeThread.id;
													handleReply(message, targetId);
												}}
												placeholder={
													replyingTo && replyingTo !== activeThread.id
														? `Reply to ${(() => {
																const findComment = (comments: any[], id: string): any => {
																	for (const comment of comments) {
																		if (comment.id === id) return comment;
																		if (comment.replies) {
																			const found = findComment(comment.replies, id);
																			if (found) return found;
																		}
																	}
																	return null;
																};
																const targetComment = findComment([activeThread], replyingTo);
																return targetComment?.authorName || 'Unknown';
															})()}...`
														: 'Write a reply to this thread...'
												}
												userImage={currentUser.imageUrl}
												userName={currentUser.fullName || currentUser.firstName || 'User'}
												isReplyMode={!!(replyingTo && replyingTo !== activeThread.id)}
												replyToName={
													replyingTo && replyingTo !== activeThread.id
														? (() => {
																const findComment = (comments: any[], id: string): any => {
																	for (const comment of comments) {
																		if (comment.id === id) return comment;
																		if (comment.replies) {
																			const found = findComment(comment.replies, id);
																			if (found) return found;
																		}
																	}
																	return null;
																};
																const targetComment = findComment([activeThread], replyingTo);
																return targetComment?.authorName;
															})()
														: undefined
												}
												onCancelReply={handleCancelReply}
											/>
										</div>
									</div>
								)}
							</div>
						</>
					)}
				</SheetContent>
			</Sheet>

			{/* Delete Confirmation Dialog */}
			<GuestBookDeleteConfirmation isOpen={deleteDialog.isOpen} onOpenChange={(open: boolean) => setDeleteDialog({ isOpen: open })} onConfirm={handleDeleteConfirm} />
		</>
	);
}
