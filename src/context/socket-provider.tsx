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
    // Prevent duplicate connections in React Strict Mode (development)
    if (socket) return;

    // Get server URL based on environment
    const serverUrl = process.env.NODE_ENV === 'production' 
      ? 'https://bforbilly.tech' 
      : 'http://localhost:3000';

    // Initialize socket connection
    const socketInstance = io(serverUrl, {
      path: '/socket.io/',
      transports: ['polling', 'websocket'],
      forceNew: true, // Force new connection to prevent reuse
      timeout: 10000, // 10 second timeout
      retries: 3,
    });

    // Connection event handlers
    socketInstance.on('connect', () => {
      console.log('✅ Connected to Socket.IO server:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Disconnected from Socket.IO server');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('❌ Socket.IO connection error:', error);
      setIsConnected(false);
    });

    // Listen for online count updates
    socketInstance.on('online-count', (count: number) => {
      setOnlineCount(count);
    });

    // Listen for guest book specific online count
    socketInstance.on('guestbook:online-count', (count: number) => {
      setGuestBookOnlineCount(count);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineCount, guestBookOnlineCount }}>
      {children}
    </SocketContext.Provider>
  );
}
