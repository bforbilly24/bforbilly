'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSocket } from '@/context/socket-provider';
import { GuestBookList } from '@/components/molecules/guest-book-list';
import { ChatInput } from '@/components/atoms/chat-input';
import { EditMessageDialog } from '@/components/molecules/edit-message-dialog';
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
	const [editingEntry, setEditingEntry] = useState<NestedComment | null>(null);
	const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
	const [guestBookOnlineCount, setGuestBookOnlineCount] = useState(0);

	const isAdmin = user && isUserAdminClient(user);

	useEffect(() => {
		fetchEntries();
	}, []);

	// Socket.IO event listeners
	useEffect(() => {
		if (!socket) return;

		// Join guest book room
		socket.emit('guestbook:join-room');

		// Listen for new messages
		socket.on('guestbook:new-message', (newMessage: any) => {
			fetchEntries(); // Refresh the entire list to maintain proper tree structure
		});

		// Listen for message updates
		socket.on('guestbook:message-updated', (updatedMessage: any) => {
			fetchEntries(); // Refresh the entire list
		});

		// Listen for message deletions
		socket.on('guestbook:message-deleted', (messageId: string) => {
			fetchEntries(); // Refresh the entire list
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

	const fetchEntries = async () => {
		try {
			const response = await fetch(ENDPOINTS.LOCAL.GUEST_BOOK);
			const result = await response.json();
			if (result.success) {
				const treeData = buildCommentTree(result.data);

				const validation = validateNestedStructure(treeData);
				// Structure validation completed

				// Remove auto-expand logic - keep all threads collapsed by default
				// Users will manually expand threads they want to see

				setEntries(treeData);
			}
		} catch (error) {
			console.error('Error fetching entries:', error);
		} finally {
			setLoading(false);
		}
	};

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
				await fetchEntries();
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
				await fetchEntries();
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
				await fetchEntries();
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

	return (
		<div className='relative flex h-full min-h-[calc(100vh-120px)] flex-col sm:min-h-[calc(100vh-200px)]'>
			<div className='flex-shrink-0 p-2 pb-1 sm:p-4 sm:pb-2'>
				<Card className='shadow-sm'>
					<CardHeader className='p-3 sm:p-6'>
						<CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
							💬 Guest Book
							<Badge variant='secondary' className='text-xs sm:text-sm'>
								{getCommentStats(entries).total} messages
							</Badge>
							{/* Real-time connection status with online count */}
							<div className={`ml-auto flex items-center gap-1 text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
								<div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
								{isConnected ? `Online (${guestBookOnlineCount})` : 'Offline'}
							</div>
						</CardTitle>
					</CardHeader>
				</Card>
			</div>

			<div className='flex-1 overflow-y-auto px-2 pb-2 sm:px-4 sm:pb-4'>
				<div className='space-y-4 sm:space-y-6'>
					<GuestBookList entries={entries} loading={loading} emptyMessage='No messages yet. Be the first to leave a message!' onReply={handleSubmitMessage} onEdit={handleEditMessage} onDelete={handleDeleteMessage} currentUser={user} isAdmin={!!isAdmin} expandedThreads={expandedThreads} onToggleExpand={handleToggleExpand} />
				</div>

				{user && <div className='h-40 sm:h-32 md:h-24' />}
			</div>
		{user && (
			<div className='sticky bottom-0 left-0 right-0 z-10 bg-background/95 backdrop-blur-sm'>
				<ChatInput 
					onSendMessage={(message) => handleSubmitMessage(message)} 
					className='border-t' 
					userImage={user.imageUrl}
					userName={user.fullName || user.firstName || user.emailAddresses[0]?.emailAddress || 'Anonymous'}
				/>
			</div>
		)}

			{editingEntry && <EditMessageDialog isOpen={!!editingEntry} onClose={() => setEditingEntry(null)} initialMessage={editingEntry.message} onSave={handleSaveEdit} />}
		</div>
	);
}
