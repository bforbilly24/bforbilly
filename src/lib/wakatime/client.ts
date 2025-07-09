// src/lib/wakatime-client.ts

import { WakaTimeOAuth } from './auth';
import { 
	WAKATIME_API_BASE_URL, 
	WAKATIME_APP_ID, 
	WAKATIME_APP_SECRET, 
	WAKATIME_REDIRECT_URI 
} from '@/types/environment';

interface WakaTimeClientConfig {
	accessToken?: string;
	apiKey?: string;
	baseUrl?: string;
}

export class WakaTimeClient {
	private config: WakaTimeClientConfig;
	private oauth?: WakaTimeOAuth;

	constructor(config: WakaTimeClientConfig) {
		this.config = {
			baseUrl: WAKATIME_API_BASE_URL,
			...config,
		};

		if (WAKATIME_APP_ID && WAKATIME_APP_SECRET) {
			this.oauth = new WakaTimeOAuth({
				clientId: WAKATIME_APP_ID,
				clientSecret: WAKATIME_APP_SECRET,
				redirectUri: WAKATIME_REDIRECT_URI,
			});
		}
	}

	private async makeRequest(endpoint: string): Promise<any> {
		const url = `${this.config.baseUrl}${endpoint}`;
		const headers: Record<string, string> = {};

		if (this.config.accessToken) {
			headers['Authorization'] = `Bearer ${this.config.accessToken}`;
		} else if (this.config.apiKey) {
			// Use Basic Auth for API key
			let basicAuth: string;
			if (typeof Buffer !== 'undefined') {
				basicAuth = Buffer.from(`${this.config.apiKey}:`).toString('base64');
			} else if (typeof btoa !== 'undefined') {
				basicAuth = btoa(`${this.config.apiKey}:`);
			} else {
				throw new Error('No base64 encoding available');
			}
			headers['Authorization'] = `Basic ${basicAuth}`;
		} else {
			throw new Error('No authentication method available');
		}

		const response = await fetch(url, { headers });

		if (response.status === 401) {
			throw new Error('Unauthorized: Invalid or expired token');
		}

		if (!response.ok) {
			throw new Error(`WakaTime API error: ${response.status} ${response.statusText}`);
		}

		const jsonResponse = await response.json();

		return jsonResponse;
	}

	async getUserProfile() {
		return this.makeRequest('/users/current');
	}

	async getStatusBar() {
		return this.makeRequest('/users/current/status_bar/today');
	}

	async getAllTimeStats() {
		return this.makeRequest('/users/current/all_time_since_today');
	}

	async getSummaries(start: string, end: string) {
		return this.makeRequest(`/users/current/summaries?start=${start}&end=${end}`);
	}

	async getStats(range: string) {
		return this.makeRequest(`/users/current/stats/${range}`);
	}

	async getHeartbeats(date: string, page: number = 1) {
		return this.makeRequest(`/users/current/heartbeats?date=${date}&page=${page}`);
	}

	async getProjects() {
		return this.makeRequest('/users/current/projects');
	}

	async getEditors() {
		return this.makeRequest('/users/current/editors');
	}

	async getLanguages() {
		return this.makeRequest('/users/current/languages');
	}

	async getOperatingSystems() {
		return this.makeRequest('/users/current/operating_systems');
	}

	getAuthorizationUrl(): string {
		if (!this.oauth) {
			throw new Error('OAuth not configured');
		}
		return this.oauth.getAuthorizationUrl();
	}

	async exchangeCodeForToken(code: string) {
		if (!this.oauth) {
			throw new Error('OAuth not configured');
		}
		return this.oauth.exchangeCodeForToken(code);
	}
}
