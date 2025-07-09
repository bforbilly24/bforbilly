'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { MessageCircle, Reply, Trash2, ChevronDown, ChevronRight, Edit3, Clock, CheckCircle, BadgeCheck, CornerDownRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/atoms/collapsible';
import { AIBadge, isAIMessage } from '@/components/atoms/ai-badge';
import { CommentInput } from '@/components/atoms/comment-input';
import { Card } from '@/components/atoms/card';
import { Button } from '@/components/atoms/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/atoms/avatar';
import { VERIFIED_USER_ID } from '@/types/environment';
import { type NestedComment } from '@/lib/comments'

interface GuestBookIconProps {
	className?: string;
	[key: string]: unknown;
}

const GuestBookIcon = ({ className, ...props }: GuestBookIconProps) => <MessageCircle className={cn('size-5 text-blue-500', className)} {...props} />;

// Verified badge component using Lucide
const Verified = ({ className, ...props }: GuestBookIconProps) => <BadgeCheck className={cn('size-4 text-blue-500', className)} {...props} />;

const truncate = (str: string | null, length: number) => {
	if (!str || str.length <= length) return str;
	return `${str.slice(0, length - 3)}...`;
};

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
	return <div className={cn('rounded-md bg-primary/10', className)} {...props} />;
};

export const GuestBookSkeleton = ({ className, ...props }: { className?: string; [key: string]: unknown }) => (
	<div className={cn('flex size-full max-h-max min-w-72 flex-col gap-2 rounded-lg border p-4', className)} {...props}>
		<div className='flex flex-row gap-2'>
			<Skeleton className='size-10 shrink-0 rounded-full' />
			<Skeleton className='h-10 w-full' />
		</div>
		<Skeleton className='h-20 w-full' />
	</div>
);

const GuestBookHeader = ({ entry, isAdmin = false, isOwner = false, canReply = false, onReply, onEdit, onDelete }: { entry: NestedComment; isAdmin?: boolean; isOwner?: boolean; canReply?: boolean; onReply?: () => void; onEdit?: (entry: NestedComment) => void; onDelete?: (entryId: string) => void }) => (
	<div className='flex flex-row justify-between tracking-tight'>
		<div className='flex items-center space-x-2'>
			<Avatar className={cn(
				'h-12 w-12',
				entry.isDeleted && 'opacity-50 grayscale'
			)}>
				<AvatarImage
					src={entry.isDeleted ? `https://api.dicebear.com/7.x/avataaars/svg?seed=deleted` : (entry.authorImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.authorName}`)}
					alt={entry.isDeleted ? '[Deleted User]' : entry.authorName}
				/>
				<AvatarFallback className={cn(
					'bg-blue-100 text-blue-600 font-semibold',
					entry.isDeleted && 'bg-gray-100 text-gray-400'
				)}>
					{entry.isDeleted ? 'D' : (entry.authorName?.charAt(0) || 'U')}
				</AvatarFallback>
			</Avatar>
			<div>
				<div className={cn(
					'flex items-center gap-2 whitespace-nowrap font-semibold',
					entry.isDeleted && 'text-gray-400'
				)}>
					{truncate(entry.isDeleted ? '[Deleted User]' : entry.authorName, 20)}
					{!entry.isDeleted && entry.authorId === VERIFIED_USER_ID && <Verified className='ml-1 inline size-4 text-blue-500' />}
					{!entry.isDeleted && isAIMessage(entry.authorName) && <AIBadge variant='minimal' />}
				</div>
				<div className='flex items-center space-x-1'>
				<div className='flex items-center gap-2'>
					<span className='text-sm text-gray-500 transition-all duration-75 dark:text-gray-400'>{format(new Date(entry.createdAt), 'MMM d, yyyy h:mm a')}</span>
					<span className='text-xs text-gray-400 font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded' title='Message ID'>
						#{entry.shortId ? entry.shortId.slice(-6) : entry.id.slice(-6)}
					</span>
				</div>
				</div>
			</div>
		</div>
		<div className='flex items-center gap-1'>
			{canReply && onReply && !entry.isDeleted && (
				<Button
					variant="ghost"
					size="sm"
					onClick={onReply}
					className='h-8 w-8 p-0 text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-blue-950/50 dark:hover:text-blue-400'
					title='Reply to this comment'
				>
					<Reply className='size-4' />
				</Button>
			)}
			{(isOwner || isAdmin) && onEdit && !entry.isDeleted && (
				<Button
					variant="ghost"
					size="sm"
					onClick={() => onEdit(entry)}
					className='h-8 w-8 p-0 text-gray-500 hover:bg-yellow-50 hover:text-yellow-600 dark:text-gray-400 dark:hover:bg-yellow-950/50 dark:hover:text-yellow-400'
					title='Edit this comment'
				>
					<Edit3 className='size-4' />
				</Button>
			)}
			{(isOwner || isAdmin) && onDelete && !entry.isDeleted && (
				<Button
					variant="ghost"
					size="sm"
					onClick={() => {
						onDelete(entry.id);
					}}
					className='h-8 w-8 p-0 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/50 dark:hover:text-red-400'
					title='Delete this comment'
				>
					<Trash2 className='size-4' />
				</Button>
			)}
			{entry.isDeleted && (
				<span className='text-xs text-gray-400 italic px-2'>Deleted</span>
			)}
			<GuestBookIcon className='size-5 items-start text-blue-500 transition-all ease-in-out hover:scale-105 dark:text-blue-400' />
		</div>
	</div>
);

const GuestBookBody = ({ entry, isAdmin = false, currentUserId }: { entry: NestedComment; isAdmin?: boolean; currentUserId?: string }) => {
	// Check if message was edited (updatedAt is different from createdAt)
	const wasEdited = entry.updatedAt && entry.createdAt && 
		new Date(entry.updatedAt).getTime() !== new Date(entry.createdAt).getTime();
	
	// Show edited label for all edited messages (remove admin restriction for now)
	const showEditedLabel = wasEdited;

	// Handle reply display logic
	let displayType = 'normal'; // 'self', 'to-you', 'you-replied', 'normal'
	
	if (entry.parentId && entry.repliedToUserId && entry.repliedToUserName && currentUserId) {
		// Case 1: Current user viewing their OWN self-reply (user replies to their own comment AND user is viewing it)
		const isCurrentUserSelfReply = entry.authorId === entry.repliedToUserId && entry.authorId === currentUserId;
		
		// Case 2: Someone else replying to current user (current user is being replied to)
		const isReplyToCurrentUser = entry.repliedToUserId === currentUserId && entry.authorId !== currentUserId;
		
		// Case 3: Current user viewing their own reply to someone else (current user is the replier)
		const isCurrentUserReplying = entry.authorId === currentUserId && entry.repliedToUserId !== currentUserId;
		
		if (isCurrentUserSelfReply) {
			// Only show "Replied to yourself" if the CURRENT USER is viewing their own self-reply
			displayType = 'self';
		} else if (isReplyToCurrentUser) {
			// Someone else is replying to current user
			displayType = 'to-you';
		} else if (isCurrentUserReplying) {
			// Current user is replying to someone else
			displayType = 'you-replied';
		} else {
			// Default: normal reply (viewing others' conversation, including others' self-replies)
			displayType = 'normal';
		}
	}

	return (
		<div className='break-words leading-normal tracking-tighter'>
			{/* Regular reply indicator */}
			{entry.parentId && entry.repliedToUserName && (
				<div
					className={`mb-2 flex items-center gap-2 rounded-lg p-2 text-xs ${
						displayType === 'self'
							? 'border border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400'
							: displayType === 'to-you'
								? 'border border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/30 dark:text-purple-400'
								: displayType === 'you-replied'
									? 'border border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/30 dark:text-orange-400'
									: 'border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-400'
					}`}
				>
					<Reply className='size-3' />
					{displayType === 'self' ? (
						// When someone replies to their own comment
						<>
							<CheckCircle className='h-3 w-3' />
							<span className='font-medium'>Replied to yourself</span>
						</>
					) : displayType === 'to-you' ? (
						// When someone else replies to current user's comment
						<>
							<span className='font-medium'>Replying to You</span>
							<span className='opacity-75'>• {entry.parent?.createdAt ? new Date(entry.parent.createdAt).toLocaleDateString() : ''}</span>
						</>
					) : displayType === 'you-replied' ? (
						// When current user replies to someone else
						<>
							<span className='font-medium'>You replied to {entry.repliedToUserName}</span>
							<span className='opacity-75'>• {entry.parent?.createdAt ? new Date(entry.parent.createdAt).toLocaleDateString() : ''}</span>
						</>
					) : (
						// Default case: show who is being replied to using repliedToUserName
						<>
							<span className='font-medium'>Replying to {entry.repliedToUserName}</span>
							<span className='opacity-75'>• {entry.parent?.createdAt ? new Date(entry.parent.createdAt).toLocaleDateString() : ''}</span>
						</>
					)}
				</div>
			)}
			<div className="flex flex-col">
				<span className={cn(
					'whitespace-pre-wrap text-sm font-normal dark:text-gray-200',
					entry.isDeleted && 'text-gray-400 italic line-through opacity-60'
				)}>
					{/* Discord-style @mention for replies */}
					{entry.parentId && entry.repliedToUserName && !entry.isDeleted && (
						<span className={cn(
							'font-semibold mr-1',
							displayType === 'to-you' 
								? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 px-1 rounded text-xs' 
								: 'text-blue-600 dark:text-blue-400'
						)}>
							@{entry.repliedToUserName}{' '}
						</span>
					)}
					{entry.isDeleted ? '[Message deleted]' : entry.message}
					{/* WhatsApp-style inline edited label */}
					{showEditedLabel && !entry.isDeleted && (
						<span className='ml-2 inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full'>
							<Edit3 className='size-3' />
							<span className='italic'>edited</span>
						</span>
					)}
				</span>
				{/* Alternative: Below message edited label (commented out) */}
				{/* {showEditedLabel && (
					<div className='mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400'>
						<Edit3 className='size-3' />
						<span className='italic font-medium'>edited</span>
					</div>
				)} */}
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
  replyingTo,
  onStartReply,
  onCancelReply,
  currentUser,
  onSubmitReply,
  depth = 0,
  isExpanded: providedIsExpanded,
  onToggleExpand,
  expandedThreads,
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
  replyingTo?: string | null;
  onStartReply?: (entryId: string) => void;
  onCancelReply?: () => void;
  currentUser?: any;
  onSubmitReply?: (message: string, parentId?: string) => Promise<void>;
  depth?: number;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  expandedThreads?: Set<string>;
  [key: string]: unknown 
}) => {
	// Use provided expanded state or default to collapsed (false)
	const isExpanded = providedIsExpanded !== undefined 
		? providedIsExpanded 
		: false; // Default to collapsed state

	// Handle toggle expand
	const handleToggleExpand = () => {
		if (onToggleExpand) {
			onToggleExpand();
		}
	};

	// Show reply button for all authenticated users (both root comments and replies)
	const canReply = !!currentUserId;

	// Check if current user owns this entry
	const isOwner = currentUserId === entry.authorId;

	// Handler for replying to this specific entry
	const handleReply = () => {
		if (onStartReply) {
			onStartReply(entry.id);
		} else if (onReply) {
			onReply(entry.id);
		}
	};

	// Handle reply submission
	const handleSubmitReply = async (message: string) => {
		if (onSubmitReply) {
			await onSubmitReply(message, entry.id);
			onCancelReply?.();
		}
	};

	// Render reply input for this specific entry
	const renderReplyInput = () => {
		if (replyingTo === entry.id && currentUser) {
			return (
				<div className="mt-3 ml-2">
					<Card className="p-4 border-blue-200 bg-blue-50/30 dark:border-blue-700 dark:bg-blue-950/30 shadow-sm">
						<div className="flex items-center gap-2 text-xs text-blue-600 font-medium mb-3 uppercase tracking-wide dark:text-blue-400">
							<CornerDownRight className="w-3 h-3" />
							Replying to {entry.authorName}
						</div>
						<CommentInput
							userImage={currentUser.imageUrl}
							userName={currentUser.fullName || currentUser.firstName || 'User'}
							onSubmit={handleSubmitReply}
							placeholder={`Write your reply to ${entry.authorName}...`}
							onCancel={onCancelReply}
						/>
					</Card>
				</div>
			);
		}
		return null;
	};

	return (
		<div
			className={cn(
				'relative flex size-full max-w-full flex-col gap-3 overflow-hidden rounded-lg border p-4 backdrop-blur-md transition-all duration-300 hover:shadow-lg dark:hover:shadow-gray-800/50',
				entry.parentId
					? 'border-l-4 border-l-blue-400 bg-gradient-to-r from-blue-50/90 to-blue-50/30 shadow-sm hover:from-blue-100/90 hover:to-blue-100/30 dark:border-l-blue-500 dark:from-blue-950/50 dark:to-blue-950/20 dark:hover:from-blue-900/60 dark:hover:to-blue-900/30'
					: 'border-gray-200 bg-white/95 shadow-md hover:border-blue-300 hover:bg-white dark:border-gray-600 dark:bg-gray-900/95 dark:hover:border-blue-500 dark:hover:bg-gray-800/95',
				className,
			)}
			{...props}
		>
			<GuestBookHeader entry={entry} isAdmin={isAdmin} isOwner={isOwner} canReply={canReply} onReply={handleReply} onEdit={onEdit} onDelete={onDelete} />
			<GuestBookBody entry={entry} isAdmin={entry.authorId === VERIFIED_USER_ID} currentUserId={currentUserId} />

			{/* Reply input for this entry */}
			{renderReplyInput()}

			{/* Replies with Collapsible - show nested structure */}
			{showReplies && entry.replies && entry.replies.length > 0 && (
				<div className='mt-4'>
					<Collapsible open={isExpanded} onOpenChange={handleToggleExpand}>
						<CollapsibleTrigger className='flex w-full items-center gap-2 rounded-md border-t border-gray-100 p-2 pt-3 text-xs font-medium uppercase tracking-wide text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-300'>
							{isExpanded ? <ChevronDown className='size-3' /> : <ChevronRight className='size-3' />}
							<MessageCircle className='size-3' />
							{entry.replies.length} {entry.replies.length === 1 ? 'Reply' : 'Replies'}
							<span className='ml-auto text-xs opacity-75'>
								{isExpanded ? 'Click to hide replies' : 'Click to show replies'}
							</span>
						</CollapsibleTrigger>
						<CollapsibleContent className='space-y-3 pt-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2'>
							{entry.replies.map((reply: NestedComment, index: number) => (
								<div key={reply.id} className='relative'>
									{/* Connection line for replies */}
									<div className='absolute -left-4 bottom-0 top-0 w-px bg-gradient-to-b from-blue-300 to-transparent dark:from-blue-600' />
									<div className='absolute -left-4 top-6 h-px w-3 bg-blue-300 dark:bg-blue-600' />

									<GuestBookCard
										entry={reply}
										isAdmin={isAdmin}
										currentUserId={currentUserId}
										onReply={onReply}
										onEdit={onEdit}
										onDelete={onDelete}
										showReplies={false} // 2-level structure: No nested replies, only flat 2-level
										replyingTo={replyingTo}
										onStartReply={onStartReply}
										onCancelReply={onCancelReply}
										onSubmitReply={onSubmitReply}
										currentUser={currentUser}
										depth={depth + 1}
										expandedThreads={expandedThreads}
										isExpanded={expandedThreads?.has(reply.id)}
										onToggleExpand={() => onToggleExpand?.()}
										className={cn(
											'ml-4 border-blue-200 bg-gradient-to-r dark:border-blue-700',
											'from-blue-50/80 to-blue-50/40 dark:from-blue-950/60 dark:to-blue-950/20'
										)}
									/>
								</div>
							))}
						</CollapsibleContent>
					</Collapsible>
				</div>
			)}
		</div>
	);
};
