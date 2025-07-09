// src/app/api/auth/wakatime/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  
  // Clear WakaTime tokens
  cookieStore.delete('wakatime_access_token');
  cookieStore.delete('wakatime_refresh_token');
  
  return NextResponse.json({ success: true });
}