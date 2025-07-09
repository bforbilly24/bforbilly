// src/app/api/auth/wakatime/route.ts
import { WakaTimeClient } from '@/lib/wakatime/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const client = new WakaTimeClient({});
  
  try {
    const authUrl = client.getAuthorizationUrl();
    return NextResponse.redirect(authUrl);
  } catch (error) {
    return NextResponse.json(
      { error: 'OAuth not configured' },
      { status: 500 }
    );
  }
}