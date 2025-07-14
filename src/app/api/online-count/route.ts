import { NextResponse } from 'next/server';

// Simple in-memory counter for simulation (resets on server restart)
// In production, you might want to use Redis or a database
let onlineCount = 0;
let guestBookVisitors = 0;
let lastUpdate = Date.now();

// Reset count after 10 minutes of inactivity
const RESET_TIMEOUT = 10 * 60 * 1000; // 10 minutes

export async function GET() {
  try {
    // Check if we should reset the count
    const now = Date.now();
    if (now - lastUpdate > RESET_TIMEOUT) {
      onlineCount = 0;
      guestBookVisitors = 0;
    }

    // Return actual count + small random base for realism
    const baseOnlineCount = Math.max(1, onlineCount);
    const currentOnline = baseOnlineCount + Math.floor(Math.random() * 3); // Add 0-2 random users
    
    return NextResponse.json({ 
      onlineCount: currentOnline,
      guestBookOnlineCount: Math.min(currentOnline, guestBookVisitors + Math.floor(Math.random() * 2)),
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

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { page } = body;

    // Increment online count when user visits
    onlineCount++;
    lastUpdate = Date.now();
    
    // Track guest book visitors separately
    if (page === 'guest-book') {
      guestBookVisitors++;
    }
    
    return NextResponse.json({ 
      success: true, 
      onlineCount,
      guestBookVisitors,
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
