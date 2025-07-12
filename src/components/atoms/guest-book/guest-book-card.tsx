'use client';
import React from 'react';
import { format } from 'date-fns';
import { MessageCircle, Reply, Trash2, ChevronDown, Edit3, CheckCircle, BadgeCheck } from 'lucide-react';
import { AIBadge, isAIMessage } from '@/components/atoms/ai-badge';
import { Card } from '@/components/atoms/card';
import { Button } from '@/components/atoms/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/atoms/avatar';
import { VERIFIED_USER_ID } from '@/types/environment';
import { type NestedComment } from '@/lib/comments';
import { cn } from '@/lib/utils';

interface GuestBookIconProps {
	className?: string;
	[key: string]: unknown;
}

const GuestBookIcon = ({ className, ...props }: GuestBookIconProps) => <MessageCircle className={cn('size-3 text-blue-500 sm:size-4 md:size-5', className)} {...props} />;

// Verified badge component using Lucide
const Verified = ({ className, ...props }: GuestBookIconProps) => <BadgeCheck className={cn('size-3 text-blue-500 sm:size-4', className)} {...props} />;

const truncate = (str: string | null, length: number) => {
	if (!str || str.length <= length) return str;
	return `${str.slice(0, length - 3)}...`;
};

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
	return <div className={cn('rounded-md bg-primary/10', className)} {...props} />;
};

const GuestBookHeader = ({ entry, isAdmin = false, isOwner = false, canReply = false, onReply, onEdit, onDelete }: { entry: NestedComment; isAdmin?: boolean; isOwner?: boolean; canReply?: boolean; onReply?: (e?: React.MouseEvent) => void; onEdit?: (entry: NestedComment) => void; onDelete?: (entryId: string) => void }) => (
	<div className='flex min-w-0 flex-row items-start justify-between gap-1 sm:gap-2'>
		<div className='flex min-w-0 flex-1 items-center space-x-1 sm:space-x-2'>
			<Avatar className={cn('h-5 w-5 shrink-0 sm:h-7 sm:w-7 md:h-9 md:w-9', entry.isDeleted && 'opacity-50 grayscale')}>
				<AvatarImage src={entry.isDeleted ? `https://api.dicebear.com/7.x/avataaars/svg?seed=deleted` : entry.authorImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.authorName}`} alt={entry.isDeleted ? '[Deleted User]' : entry.authorName} />
				<AvatarFallback className={cn('bg-blue-100 text-[0.65rem] font-semibold text-blue-600 sm:text-xs', entry.isDeleted && 'bg-gray-100 text-gray-400')}>{entry.isDeleted ? 'D' : entry.authorName?.charAt(0) || 'U'}</AvatarFallback>
			</Avatar>
			<div className='min-w-0 flex-1'>
				<div className={cn('flex min-w-0 items-center gap-1 text-xs font-semibold sm:gap-2 sm:text-sm', entry.isDeleted && 'text-gray-400')}>
					<span className='truncate'>{entry.isDeleted ? '[Deleted User]' : entry.authorName}</span>
					{!entry.isDeleted && entry.authorId === VERIFIED_USER_ID && <Verified className='size-2.5 shrink-0 text-blue-500 sm:size-3 md:size-4' />}
					{!entry.isDeleted && isAIMessage(entry.authorName) && <AIBadge variant='minimal' />}
				</div>
				<div className='flex flex-wrap items-center gap-1 text-[0.65rem] sm:gap-2 sm:text-xs'>
					<span className='whitespace-nowrap text-gray-500 dark:text-gray-400'>{format(new Date(entry.createdAt), 'MMM d, yyyy')}</span>
					<span className='hidden text-gray-500 sm:inline dark:text-gray-400'>{format(new Date(entry.createdAt), 'h:mm a')}</span>
					<span className='shrink-0 rounded bg-gray-100 px-0.5 py-0.5 font-mono text-[0.65rem] text-gray-400 dark:bg-gray-800' title='Message ID'>
						#{entry.shortId ? entry.shortId.slice(-6) : entry.id.slice(-6)}
					</span>
				</div>
			</div>
		</div>
		<div className='flex shrink-0 items-center gap-0.5 sm:gap-1'>
			{canReply && onReply && !entry.isDeleted && (
				<Button
					variant='ghost'
					size='sm'
					onClick={e => {
						e.stopPropagation();
						onReply(e);
					}}
					className='h-4 w-4 p-0 text-gray-500 hover:bg-blue-50 hover:text-blue-600 sm:h-5 sm:w-5 md:h-7 md:w-7 dark:text-gray-400 dark:hover:bg-blue-950/50 dark:hover:text-blue-400'
					title='Reply to this comment'
				>
					<Reply className='size-2 sm:size-2.5 md:size-3.5' />
				</Button>
			)}
			{(isOwner || isAdmin) && onEdit && !entry.isDeleted && (
				<Button
					variant='ghost'
					size='sm'
					onClick={e => {
						e.stopPropagation();
						onEdit(entry);
					}}
					className='h-4 w-4 p-0 text-gray-500 hover:bg-yellow-50 hover:text-yellow-600 sm:h-5 sm:w-5 md:h-7 md:w-7 dark:text-gray-400 dark:hover:bg-yellow-950/50 dark:hover:text-yellow-400'
					title='Edit this comment'
				>
					<Edit3 className='size-2 sm:size-2.5 md:size-3.5' />
				</Button>
			)}
			{(isOwner || isAdmin) && onDelete && !entry.isDeleted && (
				<Button
					variant='ghost'
					size='sm'
					onClick={e => {
						e.stopPropagation();
						onDelete(entry.id);
					}}
					className='h-4 w-4 p-0 text-gray-500 hover:bg-red-50 hover:text-red-600 sm:h-5 sm:w-5 md:h-7 md:w-7 dark:text-gray-400 dark:hover:bg-red-950/50 dark:hover:text-red-400'
					title='Delete this comment'
				>
					<Trash2 className='size-2 sm:size-2.5 md:size-3.5' />
				</Button>
			)}
			{entry.isDeleted && <span className='px-0.5 text-[0.65rem] italic text-gray-400 sm:px-1 sm:text-xs'>Deleted</span>}
			<GuestBookIcon className='md:size-4.5 size-2.5 shrink-0 text-blue-500 transition-all ease-in-out hover:scale-105 sm:size-3.5 dark:text-blue-400' />
		</div>
	</div>
);

const GuestBookBody = ({ entry, isAdmin = false, currentUserId, isInSheet = false }: { entry: NestedComment; isAdmin?: boolean; currentUserId?: string; isInSheet?: boolean }) => {
	// Check if message was edited (updatedAt is different from createdAt)
	const wasEdited = entry.updatedAt && entry.createdAt && new Date(entry.updatedAt).getTime() !== new Date(entry.createdAt).getTime();

	// Show edited label for all edited messages
	const showEditedLabel = wasEdited;

	// Handle reply display logic
	let displayType = 'normal'; // 'self', 'to-you', 'you-replied', 'normal'

	if (entry.parentId && entry.repliedToUserId && entry.repliedToUserName && currentUserId) {
		// Check if the author replied to themselves
		const isSelfReply = entry.authorId === entry.repliedToUserId;
		
		// Check if someone replied to the current viewing user
		const isReplyToCurrentUser = entry.repliedToUserId === currentUserId;
		
		// Check if the current viewing user is the author of this reply
		const isCurrentUserAuthor = entry.authorId === currentUserId;

		if (isSelfReply && isCurrentUserAuthor) {
			// Current user replied to themselves
			displayType = 'self';
		} else if (isReplyToCurrentUser && !isCurrentUserAuthor) {
			// Someone else replied to current user
			displayType = 'to-you';
		} else if (isCurrentUserAuthor && !isSelfReply) {
			// Current user replied to someone else
			displayType = 'you-replied';
		} else {
			// Normal reply (other users replying to other users)
			displayType = 'normal';
		}
	}

	return (
		<div className='min-w-0 break-words leading-normal'>
			{/* Regular reply indicator with 3 color categories */}
			{entry.parentId && entry.repliedToUserName && (
				<div
					className={`mb-1.5 flex items-center gap-1 rounded-lg p-1 text-[0.65rem] sm:mb-2 sm:p-2 sm:text-xs ${
						displayType === 'self'
							? 'border border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400'
							: displayType === 'to-you'
								? 'border border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/30 dark:text-purple-400'
								: displayType === 'you-replied'
									? 'border border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/30 dark:text-orange-400'
									: 'border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-400'
					}`}
				>
					<Reply className='size-2 shrink-0 sm:size-2.5' />
					{displayType === 'self' ? (
						<>
							<CheckCircle className='h-2 w-2 shrink-0 sm:h-2.5 sm:w-2.5' />
							<span className='font-medium'>Replied to yourself</span>
						</>
					) : displayType === 'to-you' ? (
						<>
							<span className='font-medium'>Replying to You</span>
							<span className='hidden opacity-75 sm:inline'>• {entry.parent?.createdAt ? new Date(entry.parent.createdAt).toLocaleDateString() : ''}</span>
						</>
					) : displayType === 'you-replied' ? (
						<>
							<span className='truncate font-medium'>You replied to {entry.repliedToUserName}</span>
							<span className='hidden opacity-75 sm:inline'>• {entry.parent?.createdAt ? new Date(entry.parent.createdAt).toLocaleDateString() : ''}</span>
						</>
					) : (
						<>
							<span className='truncate font-medium'>Self Reply</span>
							<span className='hidden opacity-75 sm:inline'>• {entry.parent?.createdAt ? new Date(entry.parent.createdAt).toLocaleDateString() : ''}</span>
						</>
					)}
				</div>
			)}
			<div className='flex min-w-0 flex-col'>
				<div className={cn('min-w-0 whitespace-pre-wrap break-words text-[0.7rem] font-normal sm:text-xs md:text-sm dark:text-gray-200', entry.isDeleted && 'italic text-gray-400 line-through opacity-60')}>
					{/* Discord-style @mention for replies with 3 color categories */}
					{entry.parentId && entry.repliedToUserName && !entry.isDeleted && (
						<span className={cn('mr-1 break-words font-semibold', 
							displayType === 'to-you' 
								? 'rounded bg-purple-50 px-1 text-[0.65rem] text-purple-600 sm:text-xs dark:bg-purple-950/30 dark:text-purple-400'
								: displayType === 'you-replied'
									? 'rounded bg-orange-50 px-1 text-[0.65rem] text-orange-600 sm:text-xs dark:bg-orange-950/30 dark:text-orange-400'
									: displayType === 'self'
										? 'rounded bg-green-50 px-1 text-[0.65rem] text-green-600 sm:text-xs dark:bg-green-950/30 dark:text-green-400'
										: 'text-blue-600 dark:text-blue-400'
						)}>
							@{entry.repliedToUserName}
						</span>
					)}
					<span className='break-words'>{entry.isDeleted ? '[Message deleted]' : entry.message}</span>
					{/* Inline edited label */}
					{showEditedLabel && !entry.isDeleted && (
						<span className='ml-1 inline-flex items-center gap-0.5 whitespace-nowrap rounded-full bg-gray-100 px-1 py-0.5 text-[0.65rem] font-medium text-gray-600 sm:ml-2 sm:gap-1 sm:px-2 sm:text-xs dark:bg-gray-700 dark:text-gray-300'>
							<Edit3 className='size-2 sm:size-3' />
							<span className='italic'>edited</span>
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export const GuestBookCard = ({
	entry,
	isAdmin = false,
	currentUserId,
	onReply,
	onEdit,
	onDelete,
	showReplies = true,
	className,
	depth = 0,
	isExpanded,
	onToggleExpand,
	expandedThreads,
	isInSheet = false,
	...props
}: {
	entry: NestedComment;
	isAdmin?: boolean;
	currentUserId?: string;
	onReply?: (entryId?: string) => void;
	onEdit?: (entry: NestedComment) => void;
	onDelete?: (entryId: string) => void;
	showReplies?: boolean;
	className?: string;
	depth?: number;
	isExpanded?: boolean;
	onToggleExpand?: () => void;
	expandedThreads?: Set<string>;
	isInSheet?: boolean;
	[key: string]: unknown;
}) => {
	const canReply = !!currentUserId;
	const isOwner = currentUserId === entry.authorId;

	const handleReply = (e?: React.MouseEvent) => {
		// Prevent event propagation
		if (e) {
			e.stopPropagation();
		}

		if (onReply) {
			onReply(entry.id);
		}
	};



	return (
		<div
			className={cn(
				'relative flex w-full min-w-0 max-w-full flex-col gap-1 overflow-hidden rounded-lg border p-1.5 backdrop-blur-md transition-all duration-300 hover:shadow-lg sm:gap-3 sm:p-2 md:p-4 dark:hover:shadow-gray-800/50',
				entry.parentId
					? 'border-l-4 border-l-blue-400 bg-gradient-to-r from-blue-50/90 to-blue-50/30 shadow-sm hover:from-blue-100/90 hover:to-blue-100/30 dark:border-l-blue-500 dark:from-blue-950/50 dark:to-blue-950/20 dark:hover:from-blue-900/60 dark:hover:to-blue-900/30'
					: 'border-gray-200 bg-white/95 shadow-md hover:border-blue-300 hover:bg-white dark:border-gray-600 dark:bg-gray-900/95 dark:hover:border-blue-500 dark:hover:bg-gray-800/95',
				isInSheet ? 'pointer-events-auto' : 'cursor-pointer',
				'text-xs sm:text-sm md:text-base', // More responsive text for mobile
				className,
			)}
			onClick={e => {
				// Always prevent default action when in sheet view
				// to stop propagation to parent elements
				if (isInSheet) {
					e.stopPropagation();
				}
			}}
			{...props}
		>
			<GuestBookHeader entry={entry} isAdmin={isAdmin} isOwner={isOwner} canReply={canReply} onReply={handleReply} onEdit={onEdit} onDelete={onDelete} />
			<GuestBookBody entry={entry} isAdmin={entry.authorId === VERIFIED_USER_ID} currentUserId={currentUserId} isInSheet={isInSheet} />

			{/* Replies section */}
			{showReplies && entry.replies && entry.replies.length > 0 && (
				<div className='mt-2 sm:mt-4'>
					{/* Replies counter - always shown for any message with replies */}
					<div className='flex w-full items-center gap-1 rounded-md border-t border-gray-100 p-1.5 pt-2 text-[0.65rem] font-medium uppercase tracking-wide text-blue-500 sm:gap-2 sm:p-2 sm:pt-3 sm:text-xs dark:border-gray-700 dark:text-blue-400'>
						{isInSheet ? <ChevronDown className='size-2.5 shrink-0 sm:size-3' /> : null}
						<MessageCircle className='size-2.5 shrink-0 sm:size-3' />
						<span className='truncate'>
							{entry.replies.length} {entry.replies.length === 1 ? 'Reply' : 'Replies'}
						</span>
					</div>

					{/* Only display replies in sheet view */}
					{isInSheet && (
						<div className='space-y-1.5 pt-1.5 sm:space-y-3 sm:pt-3'>
							{entry.replies.map((reply: NestedComment) => (
								<div key={reply.id} className='relative min-w-0'>
									{/* Connection line for replies */}
									{/* <div className='absolute -left-1.5 bottom-0 top-0 w-px bg-gradient-to-b from-blue-300 to-transparent sm:-left-3 dark:from-blue-600' />
									<div className='absolute -left-1.5 top-6 h-px w-1 bg-blue-300 sm:-left-3 sm:w-2 dark:bg-blue-600' /> */}

									<GuestBookCard
										entry={reply}
										isAdmin={isAdmin}
										currentUserId={currentUserId}
										onReply={onReply}
										onEdit={onEdit}
										onDelete={onDelete}
										showReplies={false} // Always set to false for nested replies
										depth={depth + 1}
										expandedThreads={expandedThreads}
										isInSheet={isInSheet}
										className={cn('border-blue-200 bg-gradient-to-r from-blue-50/80 to-blue-50/40 dark:border-blue-700 dark:from-blue-950/60 dark:to-blue-950/20')}
									/>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
};
