// src/lib/wakatime-oauth.ts
interface WakaTimeOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

interface WakaTimeTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export class WakaTimeOAuth {
  private config: WakaTimeOAuthConfig;

  constructor(config: WakaTimeOAuthConfig) {
    this.config = config;
  }

  // Generate OAuth authorization URL
  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      redirect_uri: this.config.redirectUri,
      scope: 'read_logged_time,read_stats',
    });

    return `https://wakatime.com/oauth/authorize?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string): Promise<WakaTimeTokenResponse> {
    const response = await fetch('https://wakatime.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUri,
        grant_type: 'authorization_code',
        code,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<WakaTimeTokenResponse> {
    const response = await fetch('https://wakatime.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Revoke token
  async revokeToken(token: string): Promise<void> {
    const response = await fetch('https://wakatime.com/oauth/revoke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        token,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token revocation failed: ${response.statusText}`);
    }
  }
}
