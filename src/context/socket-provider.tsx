'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
	socket: Socket | null;
	isConnected: boolean;
	onlineCount: number;
	guestBookOnlineCount: number;
}

const SocketContext = createContext<SocketContextType>({
	socket: null,
	isConnected: false,
	onlineCount: 0,
	guestBookOnlineCount: 0,
});

export const useSocket = () => {
	const context = useContext(SocketContext);
	if (!context) {
		throw new Error('useSocket must be used within a SocketProvider');
	}
	return context;
};

interface SocketProviderProps {
	children: React.ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [onlineCount, setOnlineCount] = useState(0);
	const [guestBookOnlineCount, setGuestBookOnlineCount] = useState(0);

	useEffect(() => {
		if (socket) return;

		if (typeof window === 'undefined') return;

		if (process.env.NODE_ENV === 'production') {
			console.log('🔌 Socket.IO disabled in production (Vercel serverless limitations)');

			const fetchOnlineCount = async () => {
				try {
					await fetch('/api/online-count', { method: 'POST' });

					const response = await fetch('/api/online-count');
					const data = await response.json();

					setOnlineCount(data.onlineCount || 1);
					setGuestBookOnlineCount(data.guestBookOnlineCount || 1);
				} catch (error) {
					console.error('Failed to fetch online count:', error);

					setOnlineCount(1);
					setGuestBookOnlineCount(1);
				}
			};

			fetchOnlineCount();

			const interval = setInterval(fetchOnlineCount, 30000);

			return () => {
				clearInterval(interval);
			};
		}

		// Development environment only - Socket.IO server
		const serverUrl = typeof window !== 'undefined' 
			? window.location.origin 
			: 'http://localhost:3000';

		console.log('🔌 Attempting Socket.IO connection to:', serverUrl);

		const socketInstance = io(serverUrl, {
			path: '/socket.io/',
			transports: ['polling', 'websocket'],
			upgrade: true,
			timeout: 5000,
			retries: 2,
			autoConnect: true,
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionAttempts: 3,
			forceNew: false,
		});

		socketInstance.on('connect', () => {
			console.log('✅ Connected to Socket.IO server:', socketInstance.id);
			setIsConnected(true);
		});

		socketInstance.on('disconnect', reason => {
			console.log('❌ Disconnected from Socket.IO server. Reason:', reason);
			setIsConnected(false);
		});

		socketInstance.on('connect_error', error => {
			console.error('❌ Socket.IO connection error:', error.message || error);
			setIsConnected(false);

			if (socketInstance.connected === false) {
				console.log('🔄 Socket.IO will retry connection automatically...');
			}
		});

		socketInstance.on('reconnect', attemptNumber => {
			console.log('🔄 Socket.IO reconnected after', attemptNumber, 'attempts');
			setIsConnected(true);
		});

		socketInstance.on('reconnect_error', error => {
			console.warn('⚠️ Socket.IO reconnection failed:', error.message || error);
		});

		socketInstance.on('reconnect_failed', () => {
			console.error('❌ Socket.IO failed to reconnect after all attempts');
			setIsConnected(false);
		});

		socketInstance.on('online-count', (count: number) => {
			setOnlineCount(count);
		});

		socketInstance.on('guestbook:online-count', (count: number) => {
			setGuestBookOnlineCount(count);
		});

		setSocket(socketInstance);

		return () => {
			if (socketInstance) {
				socketInstance.disconnect();
			}
		};
	}, []);

	return <SocketContext.Provider value={{ socket, isConnected, onlineCount, guestBookOnlineCount }}>{children}</SocketContext.Provider>;
}
