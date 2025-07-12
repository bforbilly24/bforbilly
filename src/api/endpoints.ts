// src/api/endpoints.ts
import { 
  WAKATIME_API_BASE_URL, 
} from '@/types/environment';

// Only include endpoints available for free accounts
export const ENDPOINTS = {
  WAKATIME: {
    BASE: WAKATIME_API_BASE_URL,
    USER_PROFILE: '/users/current',
    TEAMS: '/users/current/teams',
    PROJECTS: '/users/current/projects',
    PROJECT_STATS: (project: string) => `/users/current/projects/${project}/stats`,
    GOALS: '/users/current/goals',
    GOAL_DETAIL: (goal: string) => `/users/current/goals/${goal}`,
    ALERTS: '/users/current/alerts',
    PLUGINS: '/users/current/plugins',
    MACHINES: '/users/current/machines',
    STATUS_BAR: '/users/current/status_bar/today',
    STATS: (range: string) => `/users/current/stats/${range}`,
    ALL_TIME: '/users/current/all_time_since_today',
    EDITORS: '/users/current/editors',
    LANGUAGES: '/users/current/languages',
    OPERATING_SYSTEMS: '/users/current/operating_systems',
    AGENTS: '/users/current/agents',
  },
  // Local API endpoints
  LOCAL: {
    LANGUAGES: (range: string) => `/api/languages?range=${range}`,
    GUEST_BOOK: '/api/guest-book',
    GUEST_BOOK_PAGINATED: (page: number = 1, limit: number = 5) => `/api/guest-book?page=${page}&limit=${limit}`,
    GUEST_BOOK_ALL: '/api/guest-book?loadAll=true',
    GUEST_BOOK_REPLY: (commentId: string) => `/api/guest-book/${commentId}/reply`,
    GUEST_BOOK_EDIT: (entryId: string) => `/api/guest-book?id=${entryId}`,
    GUEST_BOOK_DELETE: (entryId: string) => `/api/guest-book?id=${entryId}`,
    // Project endpoints with Cloudinary integration
    PROJECTS: '/api/projects',
    // Cloudinary endpoints
    CLOUDINARY_UPLOAD: '/api/cloudinary/upload',
    CLOUDINARY_DELETE: (publicId: string, resourceType: string = 'image') => `/api/cloudinary/delete?publicId=${publicId}&resourceType=${resourceType}`,
    CLOUDINARY_LIST: (folder: string = 'portfolio', resourceType: string = 'image') => `/api/cloudinary/list?folder=${folder}&resourceType=${resourceType}`,
  },
} as const;

// Only re-export what's actually used
// Note: WAKATIME constants are used directly from @/types/environment where needed