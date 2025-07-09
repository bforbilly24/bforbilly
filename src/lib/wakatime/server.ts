
// src/lib/wakatime-server.ts
import { WakaTimeClient } from './client';
import { WAKATIME_API_KEY } from '@/types/environment';

// Server-side WakaTime client that uses API key
export function getWakaTimeClient(): WakaTimeClient {
  return new WakaTimeClient({
    apiKey: WAKATIME_API_KEY,
  });
}