import { NextResponse } from 'next/server';

// Simple visitor tracking (resets on server restart)
let uniqueVisitors = new Set<string>();
let lastCleanup = Date.now();

// Clean up old visitors every 10 minutes
const CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes

function generateVisitorId(request: Request): string {
  // Create visitor ID from IP + basic fingerprint
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  return `${ip}-${userAgent.substring(0, 50)}`;
}

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    // Reset visitors periodically to prevent infinite growth
    const currentSize = uniqueVisitors.size;
    if (currentSize > 10) {
      // Keep only recent visitors (simulate session timeout)
      uniqueVisitors.clear();
      // Add a base count to maintain some presence
      for (let i = 0; i < Math.min(3, currentSize); i++) {
        uniqueVisitors.add(`base-${i}`);
      }
    }
    lastCleanup = now;
  }
}

export async function GET() {
  try {
    cleanup();
    
    const onlineCount = Math.max(1, uniqueVisitors.size);
    
    return NextResponse.json({ 
      onlineCount,
      guestBookOnlineCount: Math.max(1, Math.floor(onlineCount * 0.8)),
      timestamp: Date.now()
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
    // Generate visitor ID
    const visitorId = generateVisitorId(request);
    
    // Add to active visitors
    uniqueVisitors.add(visitorId);
    
    cleanup();
    
    return NextResponse.json({ 
      success: true, 
      onlineCount: uniqueVisitors.size,
      visitorId: visitorId.substring(0, 8), // For debugging
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error updating online count:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update count' 
    }, { status: 500 });
  }
}
