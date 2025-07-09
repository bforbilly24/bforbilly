// Update your existing actions to use the new client
// src/lib/actions.ts (updated)
import { getWakaTimeClient } from './server';

export async function getWakaStatusBar() {
	const client = getWakaTimeClient();
	try {
		return await client.getStatusBar();
	} catch (error) {
		console.error('WakaTime API error:', error);
		return null;
	}
}

export async function getWakaAllTimeStats() {
	const client = getWakaTimeClient();
	try {
		return await client.getAllTimeStats();
	} catch (error) {
		console.error('WakaTime API error:', error);
		return null;
	}
}

export async function getWakaStats(range: 'last_7_days' | 'last_30_days' | 'last_6_months' | 'last_year') {
	const client = getWakaTimeClient();
	try {
		return await client.getStats(range);
	} catch (error) {
		console.error('WakaTime API error:', error);
		return null;
	}
}
