import { NextResponse } from 'next/server';

// Simple in-memory counter (resets on server restart)
// In production, you might want to use Redis or a database
let onlineCount = 0;
let lastUpdate = Date.now();

// Reset count after 5 minutes of inactivity
const RESET_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    // Check if we should reset the count
    const now = Date.now();
    if (now - lastUpdate > RESET_TIMEOUT) {
      onlineCount = 0;
    }

    // Return a mock count or actual count
    const mockCount = Math.max(1, onlineCount || Math.floor(Math.random() * 5) + 1);
    
    return NextResponse.json({ 
      onlineCount: mockCount,
      guestBookOnlineCount: Math.max(1, Math.floor(mockCount * 0.7)),
      timestamp: now
    });
  } catch (error) {
    console.error('Error getting online count:', error);
    return NextResponse.json({ 
      onlineCount: 1,
      guestBookOnlineCount: 1,
      timestamp: Date.now()
    });
  }
}

export async function POST() {
  try {
    // Increment online count when user visits
    onlineCount++;
    lastUpdate = Date.now();
    
    return NextResponse.json({ 
      success: true, 
      onlineCount,
      timestamp: lastUpdate
    });
  } catch (error) {
    console.error('Error updating online count:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update count' 
    }, { status: 500 });
  }
}
