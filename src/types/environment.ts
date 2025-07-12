export const WAKATIME_API_BASE_URL = process.env.WAKATIME_API_BASE_URL || 'https://wakatime.com/api/v1';
export const WAKATIME_API_KEY = process.env.WAKATIME_API_KEY;
export const WAKATIME_APP_ID = process.env.WAKATIME_APP_ID;
export const WAKATIME_APP_SECRET = process.env.WAKATIME_APP_SECRET;
export const WAKATIME_REDIRECT_URI = process.env.WAKATIME_REDIRECT_URI || 'http://localhost:3000/api/auth/wakatime/callback';

// Environment configuration
export const ENV = {
  NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://bforbilly.vercel.app',
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: '',
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  AUTH_SECRET: process.env.AUTH_SECRET || 'some-secret',
  NODE_ENV: process.env.NODE_ENV || 'development',
  // Cloudinary security settings
  DISABLE_CLOUDINARY_SECURITY: process.env.DISABLE_CLOUDINARY_SECURITY === 'true',
  // Allowed domains for Cloudinary
  ALLOWED_DOMAINS: [
    'localhost',
    '127.0.0.1',
    'bforbilly.vercel.app',
    'bforbilly.com'
  ],
}

// Cloudinary Configuration
export const CLOUDINARY = {
  CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'bforbilly',
  API_KEY: process.env.CLOUDINARY_API_KEY,
  API_SECRET: process.env.CLOUDINARY_API_SECRET,
  URL: process.env.CLOUDINARY_URL,
  UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'bforbilly',
  // Product Environment ID (optional - untuk advanced setup)
  PRODUCT_ENVIRONMENT_ID: process.env.CLOUDINARY_PRODUCT_ENVIRONMENT_ID || '5839ad269cea6d7ca78f64ad9c1f41',
} as const;

// URL Generation Helpers
export const createPageUrl = (path: string) => `${ENV.NEXT_PUBLIC_WEBSITE_URL}${path}`;
export const createOgImageUrl = (title: string) => `${ENV.NEXT_PUBLIC_WEBSITE_URL}/api/og?title=${encodeURIComponent(title)}`;

// Cloudinary URL helpers
export const createAssetUrl = (publicId: string) => `https://res.cloudinary.com/${CLOUDINARY.CLOUD_NAME}/image/upload/${publicId}`;
export const createVideoUrl = (publicId: string) => `https://res.cloudinary.com/${CLOUDINARY.CLOUD_NAME}/video/upload/${publicId}`;
export const createRawUrl = (publicId: string) => `https://res.cloudinary.com/${CLOUDINARY.CLOUD_NAME}/raw/upload/${publicId}`;

// Page URLs
export const PAGE_URLS = {
  HOME: createPageUrl('/'),
  PROJECTS: createPageUrl('/projects'),
  ARTICLES: createPageUrl('/articles'),
  ABOUT: createPageUrl('/about'),
  GUEST_BOOK: createPageUrl('/guest-book'),
  CODING_ACTIVITY: createPageUrl('/coding-activity'),
  NOT_FOUND: createPageUrl('/404'),
} as const;

// OG Image URLs
export const OG_IMAGES = {
  PROJECTS: createOgImageUrl('projects'),
  ARTICLES: createOgImageUrl('articles'),
  ABOUT: createOgImageUrl('about'),
  GUEST_BOOK: createOgImageUrl('guest book'),
  CODING_ACTIVITY: createOgImageUrl('coding activity'),
} as const;



// Cloudinary Asset URLs - Share your uploaded assets here
export const CLOUDINARY_ASSETS = {
  // Helper function untuk generate URL
  getAssetUrl: (publicId: string, options?: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale';
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  }) => {
    const baseUrl = `https://res.cloudinary.com/${CLOUDINARY.CLOUD_NAME}/image/upload`;
    const transformations = [];
    
    if (options?.width) transformations.push(`w_${options.width}`);
    if (options?.height) transformations.push(`h_${options.height}`);
    if (options?.crop) transformations.push(`c_${options.crop}`);
    if (options?.quality) transformations.push(`q_${options.quality}`);
    if (options?.format) transformations.push(`f_${options.format}`);
    
    const transformString = transformations.length > 0 ? transformations.join(',') + '/' : '';
    return `${baseUrl}/${transformString}${publicId}`;
  },

  // Project assets
  BERESIN: 'bforbilly/projects/beresin',
  CLIENT_PORTAL: 'bforbilly/projects/client-portal',
  DENTAL: 'bforbilly/projects/dental',
  DETECTION_PEST: 'bforbilly/projects/detection-pest',
  DOKTER_EMR: 'bforbilly/projects/dokter-emr',
  ECOMMERCE: 'bforbilly/projects/ecommerce',
  EDUSKILL_COURSE: 'bforbilly/projects/eduskill-course',
  EDUSKILL_LANDING: 'bforbilly/projects/eduskill-landing',
  EXPERT_SYSTEM: 'bforbilly/projects/expert-system',
  FOLDERING: 'bforbilly/projects/foldering',
  INTERACT_BUDGET: 'bforbilly/projects/interact-budget',
  JOB_VACANCY: 'bforbilly/projects/job-vacancy',
  MONITORING_SYSTEM: 'bforbilly/projects/monitoring-system',
  PERSONAL_PORTFOLIO_OLD: 'bforbilly/projects/personal-portfolio-old',
  PERSONAL_PORTFOLIO_OLD_WEBP: 'bforbilly/projects/personal-portfolio-old-webp',
  RE_SHOP: 'bforbilly/projects/re-shop',
  SHOESTORE: 'bforbilly/projects/shoestore',
  TRAVIO: 'bforbilly/projects/travio',
  TRIPPLANNER: 'bforbilly/projects/tripplanner',
  YSMUMMA: 'bforbilly/projects/ysmumma',

  // Project demo videos (updated paths)
  DENTAL_DEMO: 'bforbilly/projects/demo/demo-dental',
  DETECTION_PEST_DEMO: 'bforbilly/projects/demo/demo-detection-pest',
  EXPERTSYSTEM_DEMO: 'bforbilly/projects/demo/demo-expertsystem',
  TRAVIO_DEMO: 'bforbilly/projects/demo/demo-travio',

  // Article assets
  ARTICLE_OPEN_GRAPH_PREVIEW: 'bforbilly/articles/generate-open-graph-nextjs/preview',
  ARTICLE_SVG_ANIMATION: 'bforbilly/articles/svg-animations-framer-motion/animation',
  ARTICLE_3D_BAND_PREVIEW: 'bforbilly/articles/3d-band-component-nextjs/preview',
  ARTICLE_ACTIVE_LINK_PREVIEW: 'bforbilly/articles/active-link-component-nextjs/preview',

  // 3D Badge assets (images from Cloudinary, GLB files served locally)
  BADGE_BAND: 'bforbilly/3d-badge/band',
  BADGE_LANYARD_3D: 'bforbilly/3d-badge/lanyard-3d',
  BADGE_TEST: 'bforbilly/3d-badge/test',

  // Shared assets (fonts and OG background moved to local)
  SETUP: 'bforbilly/shared/setup',
  SETUP_2: 'bforbilly/shared/setup-2',

  // Organized asset structure
  PROFILE: {
    // AVATAR: 'bforbilly/prod/profile/halim-avatar',
    // BANNER: 'bforbilly/prod/profile/halim-banner',
  },
  
  PROJECTS: {
    // PROJECT_1: {
    //   THUMBNAIL: 'bforbilly/prod/projects/project-1/thumbnail',
    //   SCREENSHOT: 'bforbilly/prod/projects/project-1/screenshot',
    //   DEMO_VIDEO: 'bforbilly/prod/projects/project-1/demo-video',
    // },
  },
  
  ARTICLES: {
    // ARTICLE_1: {
    //   BANNER: 'bforbilly/prod/articles/article-1/banner',
    //   FEATURED_IMAGE: 'bforbilly/prod/articles/article-1/featured',
    // },
  },
  
  SHARED: {
    // LOGO: 'bforbilly/shared/logos/bforbilly-logo',
    // FAVICON: 'bforbilly/shared/icons/favicon',
    // OG_IMAGE: 'bforbilly/shared/og/default-og-image',
  },
  
  // Example usage:
  // Tambahkan asset Anda dengan struktur seperti ini:
  // PROFILE: {
  //   AVATAR: 'bforbilly/prod/profile/halim-avatar',
  // },
  // Kemudian gunakan: CLOUDINARY_ASSETS.getAssetUrl(CLOUDINARY_ASSETS.PROFILE.AVATAR, { width: 200, height: 200, crop: 'fill' })
} as const;

// Admin Configuration
export const ADMIN_USERNAME = 'belly';
export const VERIFIED_USER_ID = process.env.NEXT_PUBLIC_VERIFIED_USER_ID || process.env.VERIFIED_USER_ID;
export const ADMIN_USER_IDS = process.env.NEXT_PUBLIC_VERIFIED_USER_ID ? [process.env.NEXT_PUBLIC_VERIFIED_USER_ID] : (process.env.VERIFIED_USER_ID ? [process.env.VERIFIED_USER_ID] : []);

// Optional Features
export const ENABLE_AUTO_ORG_JOIN = process.env.ENABLE_AUTO_ORG_JOIN === 'true';