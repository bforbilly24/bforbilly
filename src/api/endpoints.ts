// src/api/endpoints.ts
import { 
  WAKATIME_API_BASE_URL, 
  CLOUDINARY
} from '@/types/environment';

// Helper function untuk generate Cloudinary URLs
const createCloudinaryUrl = (folder: string, filename: string, options?: string) => {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY.CLOUD_NAME}`;
  const transformation = options ? `/${options}` : '';
  // Support multiple formats: webp, jpg, gif, png
  let fileWithExt = filename;
  if (!filename.includes('.')) {
    // Default to webp for better compression, fallback to jpg
    fileWithExt = `${filename}.webp`;
  }
  return `${baseUrl}/image/upload${transformation}/${folder}/${fileWithExt}`;
};

const createCloudinaryVideoUrl = (folder: string, filename: string, options?: string) => {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY.CLOUD_NAME}`;
  const transformation = options ? `/${options}` : '';
  const fileWithExt = filename.includes('.') ? filename : `${filename}.gif`;
  return `${baseUrl}/video/upload${transformation}/${folder}/${fileWithExt}`;
};

const createCloudinaryRawUrl = (folder: string, filename: string) => {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY.CLOUD_NAME}`;
  // Keep original extension for raw files
  return `${baseUrl}/raw/upload/${folder}/${filename}`;
};

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
  // Cloudinary Assets - uploaded assets with direct URLs
  ASSETS: {
    // Shared assets (using local public files)
    OG_BACKGROUND: '/og-bg.png',
    
    // 3D Badge assets (using local public files)
    BADGE_3D_MODEL: '/3d-badge/tag.glb',
    
    // Project demo assets
    BADGE_3D_DEMO: createCloudinaryVideoUrl('bforbilly/projects/demo', 'badge-3d.gif'),
    
    // Favicon assets (using local public files)
    FAVICON_ICO: '/favicon/favicon.ico',
    FAVICON_SVG: '/favicon/favicon.svg',
    FAVICON_96: '/favicon/favicon-96x96.png',
    APPLE_TOUCH_ICON: '/favicon/apple-touch-icon.png',
    WEB_MANIFEST_192: '/favicon/web-app-manifest-192x192.png',
    WEB_MANIFEST_512: '/favicon/web-app-manifest-512x512.png',
    SITE_WEBMANIFEST: '/favicon/site.webmanifest',
    
    // Font assets
    OUTFIT_SEMIBOLD: createCloudinaryRawUrl('bforbilly/fonts', 'outfit-semibold.ttf'),
    
    // Document assets (using direct Cloudinary URLs)
    // CV_PDF: 'https://res.cloudinary.com/bforbilly24/image/upload/v1752597692/CV_Muhammad_Daniel_Krisna_Halim_Putra_u7sgk9.pdf',
    CV_PDF: 'https://res.cloudinary.com/bforbilly24/image/upload/v1754369108/Clear_CV_Muhammad_Daniel_Krisna_Halim_Putra_pckcrn.pdf',
    // PORTFOLIO_PDF: 'https://res.cloudinary.com/bforbilly24/image/upload/v1752597708/Portfolio_Muhammad_Daniel_Krisna_Halim_Putra.pdf_wih5fw.pdf',
    PORTFOLIO_PDF: 'https://res.cloudinary.com/bforbilly24/image/upload/v1754369983/Clear_Portfolio_Muhammad_Daniel_Krisna_Halim_Putra.pdf_ijzrof.pdf',
    
    // Helper functions for dynamic asset URLs
    PROJECT_IMAGE: (filename: string, options?: string) => createCloudinaryUrl('bforbilly/projects', filename, options),
    PROFILE_IMAGE: (filename: string, options?: string) => createCloudinaryUrl('bforbilly/profile', filename, options),
    BLOG_IMAGE: (filename: string, options?: string) => createCloudinaryUrl('bforbilly/blog', filename, options),
    GENERAL_IMAGE: (folder: string, filename: string, options?: string) => createCloudinaryUrl(`bforbilly/${folder}`, filename, options),
  },
} as const;

// Export helper functions for external use
export { createCloudinaryUrl, createCloudinaryVideoUrl, createCloudinaryRawUrl };