'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSocket } from '@/context/socket-provider';
import { GuestBookList } from '@/components/molecules/guest-book';
import { GuestBookSkeleton } from '@/components/molecules/guest-book/skeleton';
import { ChatInput } from '@/components/atoms/chat-input';
import { GuestBookEditMessageDialog } from '@/components/molecules/guest-book';
import { Card, CardHeader, CardTitle } from '@/components/atoms/card';
import { Badge } from '@/components/atoms/badge';
import { ENDPOINTS } from '@/api/endpoints';
import { isUserAdminClient } from '@/lib/auth/client';
import { buildCommentTree, getCommentStats, type NestedComment } from '@/lib/comments';
import { validateNestedStructure } from '@/lib/comments';

export function GuestBookChat() {
	const { user } = useUser();
	const { socket, isConnected } = useSocket();
	const [entries, setEntries] = useState<NestedComment[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [editingEntry, setEditingEntry] = useState<NestedComment | null>(null);
	const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
	const [guestBookOnlineCount, setGuestBookOnlineCount] = useState(0);
	const [pagination, setPagination] = useState<{
		currentPage: number;
		hasNextPage: boolean;
		totalItems: number;
		totalPages: number;
	} | null>(null);

	const isAdmin = user && isUserAdminClient(user);

	useEffect(() => {
		fetchEntries();
	}, []);

	// Function to fetch entries with pagination
	const fetchEntries = async (page: number = 1, append: boolean = false) => {
		try {
			if (!append) {
				setLoading(true);
			} else {
				setLoadingMore(true);
			}

			const response = await fetch(ENDPOINTS.LOCAL.GUEST_BOOK_PAGINATED(page, 5));
			const result = await response.json();

			if (result.success) {
				const treeData = buildCommentTree(result.data);
				const validation = validateNestedStructure(treeData);

				if (append) {
					// Append new entries to existing ones
					setEntries(prev => [...prev, ...treeData]);
				} else {
					// Replace entries (initial load or refresh)
					setEntries(treeData);
				}

				setPagination(result.pagination);
			}
		} catch (error) {
			console.error('Error fetching entries:', error);
		} finally {
			setLoading(false);
			setLoadingMore(false);
		}
	};

	// Function to fetch all entries (used for real-time updates)
	const fetchAllEntries = async () => {
		try {
			const response = await fetch(ENDPOINTS.LOCAL.GUEST_BOOK_ALL);
			const result = await response.json();
			if (result.success) {
				const treeData = buildCommentTree(result.data);
				const validation = validateNestedStructure(treeData);
				setEntries(treeData);
			}
		} catch (error) {
			console.error('Error fetching all entries:', error);
		}
	};

	// Function to load more entries
	const loadMoreEntries = async () => {
		if (!pagination?.hasNextPage || loadingMore) return;

		await fetchEntries(pagination.currentPage + 1, true);
	};
	useEffect(() => {
		if (!socket) return;

		// Join guest book room
		socket.emit('guestbook:join-room');

		// Listen for new messages
		socket.on('guestbook:new-message', (newMessage: any) => {
			fetchAllEntries(); // Refresh the entire list to maintain proper tree structure
		});

		// Listen for message updates
		socket.on('guestbook:message-updated', (updatedMessage: any) => {
			fetchAllEntries(); // Refresh the entire list
		});

		// Listen for message deletions
		socket.on('guestbook:message-deleted', (messageId: string) => {
			fetchAllEntries(); // Refresh the entire list
		});

		// Listen for online count updates
		socket.on('guestbook:online-count', (count: number) => {
			setGuestBookOnlineCount(count);
		});

		// Cleanup on unmount
		return () => {
			socket.emit('guestbook:leave-room');
			socket.off('guestbook:new-message');
			socket.off('guestbook:message-updated');
			socket.off('guestbook:message-deleted');
			socket.off('guestbook:online-count');
		};
	}, [socket]);

	const handleSubmitMessage = async (message: string, parentId?: string) => {
		if (!user) return;

		const payload = {
			message,
			authorName: user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress || 'Anonymous',
			authorImage: user.imageUrl,
			parentId,
		};

		try {
			const response = await fetch(ENDPOINTS.LOCAL.GUEST_BOOK, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			const result = await response.json();

			if (result.success) {
				if (parentId) {
					setExpandedThreads(prev => new Set(prev).add(parentId));
				}
				await fetchAllEntries();
			} else {
				console.error('❌ Message failed:', result.error);
				alert('Failed to send message: ' + result.error);
			}
		} catch (error) {
			console.error('Error submitting message:', error);
		}
	};

	const handleDeleteMessage = async (entryId: string) => {
		try {
			const response = await fetch(`${ENDPOINTS.LOCAL.GUEST_BOOK}?id=${entryId}`, {
				method: 'DELETE',
			});
			const result = await response.json();

			if (result.success) {
				await fetchAllEntries();
			} else {
				console.error('❌ Error deleting message:', result.error);
				alert('Failed to delete message: ' + result.error);
			}
		} catch (error) {
			console.error('Error deleting message:', error);
			alert('Failed to delete message');
		}
	};

	const handleEditMessage = (entry: NestedComment) => {
		setEditingEntry(entry);
	};

	const handleSaveEdit = async (message: string) => {
		if (!editingEntry) return;

		try {
			const response = await fetch(ENDPOINTS.LOCAL.GUEST_BOOK, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id: editingEntry.id,
					message,
				}),
			});

			const result = await response.json();
			if (result.success) {
				await fetchAllEntries();
				setEditingEntry(null);
			} else {
				console.error('Error editing message:', result.error);
				alert('Failed to edit message: ' + result.error);
			}
		} catch (error) {
			console.error('Error editing message:', error);
			alert('Failed to edit message');
		}
	};

	const handleToggleExpand = (entryId: string) => {
		setExpandedThreads(prev => {
			const newSet = new Set(prev);
			if (newSet.has(entryId)) {
				newSet.delete(entryId);
			} else {
				newSet.add(entryId);
			}
			return newSet;
		});
	};

	// Show skeleton loading for initial load
	if (loading && entries.length === 0) {
		return <GuestBookSkeleton />;
	}

	return (
		<div className='flex h-full flex-col'>
			<div className='flex-shrink-0 p-2 pb-1 sm:p-4 sm:pb-2'>
				<Card className='shadow-sm'>
					<CardHeader className='p-3 sm:p-6'>
						<CardTitle className='flex flex-col items-start gap-2 text-lg sm:flex-row sm:items-center sm:text-xl'>
							<p className='max-w-full sm:max-w-40 w-full'>💬 Guest Book</p>
							<div className='flex w-full flex-row items-center justify-between'>
								<Badge variant='secondary' className='text-xs sm:text-sm'>
									{getCommentStats(entries).total} messages
								</Badge>
								{/* Real-time connection status with online count */}
								<div className={`ml-auto flex items-center gap-1 text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
									<div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
									{isConnected ? `Online (${guestBookOnlineCount})` : 'Offline'}
								</div>
							</div>
						</CardTitle>
					</CardHeader>
				</Card>
			</div>

			<div className='flex-1 px-2 sm:px-4 sm:pb-4'>
				<GuestBookList
					entries={entries}
					loading={loading}
					loadingMore={loadingMore}
					hasNextPage={pagination?.hasNextPage || false}
					onLoadMore={loadMoreEntries}
					emptyMessage='No messages yet. Be the first to leave a message!'
					onReply={handleSubmitMessage}
					onEdit={handleEditMessage}
					onDelete={handleDeleteMessage}
					currentUser={user}
					isAdmin={!!isAdmin}
					expandedThreads={expandedThreads}
					onToggleExpand={handleToggleExpand}
				/>
			</div>

			{user && (
				<div className='sticky bottom-0 left-0 right-0 z-50 flex-shrink-0 bg-background/95 backdrop-blur-sm'>
					<ChatInput onSendMessage={message => handleSubmitMessage(message)} className='border-t' userImage={user.imageUrl} userName={user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress || 'Anonymous'} />
				</div>
			)}

			{editingEntry && <GuestBookEditMessageDialog isOpen={!!editingEntry} onClose={() => setEditingEntry(null)} initialMessage={editingEntry.message} onSave={handleSaveEdit} />}
		</div>
	);
}
