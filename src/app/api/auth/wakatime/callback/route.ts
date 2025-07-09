

// src/app/api/auth/wakatime/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { WakaTimeClient } from '@/lib/wakatime/client';
import { cookies } from 'next/headers';
import { ENV } from '@/types/environment';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect('/coding-activity?error=access_denied');
  }

  if (!code) {
    return NextResponse.redirect('/coding-activity?error=no_code');
  }

  const client = new WakaTimeClient({});

  try {
    const tokenResponse = await client.exchangeCodeForToken(code);
    
    // Store tokens in secure cookies
    const cookieStore = cookies();
    cookieStore.set('wakatime_access_token', tokenResponse.access_token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenResponse.expires_in,
    });

    if (tokenResponse.refresh_token) {
      cookieStore.set('wakatime_refresh_token', tokenResponse.refresh_token, {
        httpOnly: true,
        secure: ENV.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    return NextResponse.redirect('/coding-activity?success=authenticated');
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.redirect('/coding-activity?error=token_exchange_failed');
  }
}
