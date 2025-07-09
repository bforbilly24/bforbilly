import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('wakatime_access_token')?.value;
  
  return NextResponse.json({
    authenticated: !!accessToken
  });
}